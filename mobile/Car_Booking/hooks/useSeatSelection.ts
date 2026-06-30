import { useState, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { generateSeats, MOCK_TRIPS, type Seat, type Trip } from '../app/data/mockData';

/**
 * Custom Hook: useSeatSelection
 * 
 * Tách biệt logic xử lý của màn hình Chọn Ghế (UC04) khỏi UI components.
 * Giúp code gọn gàng, dễ bảo trì và dễ test.
 */
export function useSeatSelection() {
  const router = useRouter();

  // Lấy tripId từ URL query
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  // Tìm thông tin chuyến xe từ ID
  const trip = useMemo(() => {
    return MOCK_TRIPS.find((t) => t.id === tripId) as Trip | undefined;
  }, [tripId]);

  // State quản lý danh sách ghế ngồi (gộp chung 2 tầng)
  const [seats, setSeats] = useState<Seat[]>(() => {
    return generateSeats(tripId || 'trip_001');
  });

  // Danh sách các ghế người dùng đang chọn
  const selectedSeats = useMemo(() => {
    return seats.filter((s) => s.status === 'selected');
  }, [seats]);

  // Tổng tiền tạm tính
  const totalPrice = useMemo(() => {
    return selectedSeats.length * (trip?.price || 0);
  }, [selectedSeats, trip]);

  // Nhóm ghế theo hàng (A, B, C...) để render theo cột dọc
  const columnGroups = useMemo(() => {
    const groups: Record<string, Seat[]> = {};
    seats.forEach((seat) => {
      if (!groups[seat.row]) {
        groups[seat.row] = [];
      }
      groups[seat.row].push(seat);
    });
    return groups;
  }, [seats]);

  /**
   * Xử lý khi nhấn chọn/hủy chọn ghế
   */
  const handleSeatPress = (pressedSeat: Seat) => {
    setSeats((prev) =>
      prev.map((s) =>
        s.id === pressedSeat.id
          ? { ...s, status: s.status === 'selected' ? 'available' : 'selected' }
          : s
      )
    );
  };

  /**
   * Chuyển tiếp sang màn thanh toán
   */
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      if (Platform.OS === 'web') {
        alert('Vui lòng chọn ít nhất 1 ghế để tiếp tục.');
      } else {
        Alert.alert('Chưa chọn ghế', 'Vui lòng chọn ít nhất 1 ghế để tiếp tục.');
      }
      return;
    }
    router.push({
      pathname: '/booking/payment',
      params: {
        tripId: tripId || '',
        seatIds: selectedSeats.map((s) => s.id).join(','),
        totalPrice: totalPrice.toString(),
      },
    });
  };

  return {
    trip,
    tripId,
    seats,
    selectedSeats,
    totalPrice,
    columnGroups,
    handleSeatPress,
    handleContinue,
    goBack: () => router.back(),
  };
}
