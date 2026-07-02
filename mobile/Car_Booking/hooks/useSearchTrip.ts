import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import api from '../utils/api';

export type SelectingField = 'from' | 'to' | null;

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
 * Lấy danh sách tuyến đường từ backend API.
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

  // State kiểm soát modal chọn giờ đi
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  // Danh sách các locations từ backend routes
  const [locations, setLocations] = useState<string[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  // Fetch routes from backend on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await api.get('/routes');
        if (res.data.success) {
          const routeData = res.data.data;
          setRoutes(routeData);
          // Extract unique locations from routes
          const allLocations = new Set<string>();
          routeData.forEach((r: any) => {
            allLocations.add(r.from);
            allLocations.add(r.to);
          });
          setLocations(Array.from(allLocations).sort());
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchRoutes();
  }, []);

  // Mở modal chọn địa điểm
  const openCityPicker = (field: SelectingField) => {
    setSelectingField(field);
    setCityModalVisible(true);
  };

  // Khi chọn một địa điểm
  const handleLocationSelect = (locationName: string) => {
    if (selectingField === 'from') {
      setFrom(locationName);
    } else if (selectingField === 'to') {
      setTo(locationName);
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
    // Location data from API
    locations,
    routes,
    loadingRoutes,
    handleLocationSelect,
  };
}
