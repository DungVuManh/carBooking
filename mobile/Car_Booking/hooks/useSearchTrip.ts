import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ADMINISTRATIVE_DATA, type Province, type District } from '../app/data/mockData';

export type SelectingField = 'from' | 'to' | null;
export type SelectionStep = 'province' | 'district' | 'commune';

export const OPERATING_HOURS = [
  '05:00', '06:00', '07:00', '08:00', '08:30',
  '09:00', '10:00', '11:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00', '23:00',
];

/**
 * Custom Hook: useSearchTrip
 * 
 * Quản lý trạng thái và các sự kiện của màn hình tìm kiếm chuyến xe (Home Screen).
 * Hỗ trợ chọn Tỉnh -> Huyện -> Xã theo phân cấp hành chính.
 */
export function useSearchTrip() {
  const router = useRouter();

  // State lưu thông tin form tìm kiếm
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // State kiểm soát modal dropdown chọn địa điểm
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [selectingField, setSelectingField] = useState<SelectingField>(null);

  // State quản lý việc chọn Tỉnh -> Huyện -> Xã
  const [selectionStep, setSelectionStep] = useState<SelectionStep>('province');
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // State kiểm soát modal chọn giờ đi
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  // Mở modal chọn địa điểm
  const openCityPicker = (field: SelectingField) => {
    setSelectingField(field);
    setSelectionStep('province');
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setCityModalVisible(true);
  };

  // Quay lại bước chọn trước đó
  const handleBackSelectionStep = () => {
    if (selectionStep === 'commune') {
      setSelectionStep('district');
      setSelectedDistrict(null);
    } else if (selectionStep === 'district') {
      setSelectionStep('province');
      setSelectedProvince(null);
    } else {
      setCityModalVisible(false);
    }
  };

  // Khi chọn Tỉnh/Thành
  const handleProvinceSelect = (provinceName: string) => {
    const province = ADMINISTRATIVE_DATA.find((p) => p.name === provinceName);
    if (province) {
      setSelectedProvince(province);
      setSelectionStep('district');
    }
  };

  // Khi chọn Quận/Huyện
  const handleDistrictSelect = (districtName: string) => {
    if (!selectedProvince) return;
    const district = selectedProvince.districts.find((d) => d.name === districtName);
    if (district) {
      setSelectedDistrict(district);
      setSelectionStep('commune');
    }
  };

  // Khi chọn Phường/Xã
  const handleCommuneSelect = (communeName: string) => {
    if (!selectedProvince || !selectedDistrict) return;
    
    // Tạo địa chỉ đầy đủ: Xã, Huyện, Tỉnh
    const fullAddress = `${communeName}, ${selectedDistrict.name}, ${selectedProvince.name}`;
    
    if (selectingField === 'from') {
      setFrom(fullAddress);
    } else if (selectingField === 'to') {
      setTo(fullAddress);
    }
    
    setCityModalVisible(false);
  };

  // Đổi chiều điểm đi và điểm đến
  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Xử lý tìm kiếm - điều hướng sang màn search results
  const handleSearch = () => {
    if (!from || !to) return;
    router.push({
      pathname: '/booking/search-results' as any,
      params: {
        from,
        to,
        date: date || new Date().toISOString().split('T')[0],
        time: time || '',
      },
    });
  };

  // Chọn nhanh tuyến phổ biến
  const handleQuickRoute = (fromCity: string, toCity: string) => {
    // Để giữ tính tiện dụng, quick route điền sẵn Tỉnh và cho phép tìm kiếm
    setFrom(fromCity);
    setTo(toCity);
    router.push({
      pathname: '/booking/search-results' as any,
      params: {
        from: fromCity,
        to: toCity,
        date: date || new Date().toISOString().split('T')[0],
      },
    });
  };

  const navigateToProfile = () => {
    router.push('/(tabs)/profile');
  };

  return {
    from,
    to,
    date,
    time,
    setDate,
    setTime,
    cityModalVisible,
    setCityModalVisible,
    selectingField,
    timeModalVisible,
    setTimeModalVisible,
    openCityPicker,
    swapLocations,
    handleSearch,
    handleQuickRoute,
    navigateToProfile,
    // Trạng thái chọn Tỉnh -> Huyện -> Xã
    selectionStep,
    selectedProvince,
    selectedDistrict,
    handleBackSelectionStep,
    handleProvinceSelect,
    handleDistrictSelect,
    handleCommuneSelect,
  };
}
