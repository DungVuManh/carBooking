import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MOCK_TRIPS, MOCK_USER } from '../app/data/mockData';

export type PaymentStep = 'form' | 'qr' | 'loading';

/**
 * Custom Hook: usePayment
 * 
 * Quản lý thông tin hành khách, các bước thanh toán (Nhập form -> Hiển thị QR -> Xử lý).
 */
export function usePayment() {
  const router = useRouter();

  // Lấy các tham số từ URL
  const { tripId, seatIds, totalPrice } = useLocalSearchParams<{
    tripId: string;
    seatIds: string;
    totalPrice: string;
  }>();

  // Parse các ghế đã chọn và tổng giá vé
  const seats = seatIds?.split(',') || [];
  const price = parseInt(totalPrice || '0', 10);
  const trip = MOCK_TRIPS.find((t) => t.id === tripId);

  // Khởi tạo các trường nhập thông tin hành khách từ profile có sẵn
  const [name, setName] = useState(MOCK_USER.name);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [email, setEmail] = useState(MOCK_USER.email);

  // Quản lý các bước thanh toán
  const [step, setStep] = useState<PaymentStep>('form');

  /**
   * Xử lý xác nhận form để hiển thị mã QR
   */
  const handleShowQR = () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin hành khách.');
      return;
    }
    setStep('qr');
  };

  /**
   * Giả lập thanh toán trực tuyến
   */
  const handleConfirmPayment = () => {
    setStep('loading');

    setTimeout(() => {
      // Chuyển sang màn hình xác nhận, truyền thông tin vé thành công
      router.replace({
        pathname: '/booking/confirmation',
        params: {
          tripId: tripId || '',
          seatIds: seatIds || '',
          totalPrice: totalPrice || '0',
          passengerName: name,
          passengerPhone: phone,
        },
      });
    }, 2000);
  };

  const handleBackPress = () => {
    if (step === 'qr') {
      setStep('form');
    } else {
      router.back();
    }
  };

  return {
    trip,
    tripId,
    seats,
    price,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    step,
    setStep,
    handleShowQR,
    handleConfirmPayment,
    handleBackPress,
  };
}
