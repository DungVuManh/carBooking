import { useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MOCK_TRIPS } from '../app/data/mockData';

/**
 * Custom Hook: useConfirmation
 * 
 * Quản lý logic sau khi đặt vé thành công và tạo mã vé ngẫu nhiên để mô phỏng.
 */
export function useConfirmation() {
  const router = useRouter();

  // Lấy các thông số vé vừa thanh toán từ URL query params
  const { tripId, seatIds, totalPrice, passengerName, passengerPhone } =
    useLocalSearchParams<{
      tripId: string;
      seatIds: string;
      totalPrice: string;
      passengerName: string;
      passengerPhone: string;
    }>();

  const trip = useMemo(() => {
    return MOCK_TRIPS.find((t) => t.id === tripId);
  }, [tripId]);

  const seats = useMemo(() => {
    return seatIds?.split(',') || [];
  }, [seatIds]);

  const price = useMemo(() => {
    return parseInt(totalPrice || '0', 10);
  }, [totalPrice]);

  // Tạo mã vé mô phỏng (TKT-XXXXXX)
  const ticketCode = useMemo(() => {
    return `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }, []);

  const handleGoToTickets = () => {
    router.replace('/(tabs)/tickets');
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return {
    trip,
    seats,
    price,
    ticketCode,
    passengerName: passengerName || '',
    passengerPhone: passengerPhone || '',
    handleGoToTickets,
    handleGoHome,
  };
}
