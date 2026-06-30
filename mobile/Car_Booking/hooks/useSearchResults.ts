import { useState, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { searchTrips, type Trip } from '../app/data/mockData';

export type SortType = 'price' | 'time' | 'rating';

/**
 * Custom Hook: useSearchResults
 * 
 * Quản lý trạng thái lọc và sắp xếp cho danh sách kết quả tìm kiếm chuyến xe.
 */
export function useSearchResults() {
  const router = useRouter();

  // Lấy các tham số tìm kiếm từ URL query
  const { from, to, date, time } = useLocalSearchParams<{
    from: string;
    to: string;
    date: string;
    time: string;
  }>();

  // Trạng thái sắp xếp: theo giờ đi ('time'), giá xe ('price') hoặc rating ('rating')
  const [sortBy, setSortBy] = useState<SortType>('time');

  // Lọc và sắp xếp danh sách chuyến xe từ mockData
  const trips = useMemo(() => {
    // Tìm các chuyến chạy từ điểm đi -> điểm đến
    let results = searchTrips(from || '', to || '');

    // Nếu người dùng chọn giờ đi cụ thể ở Home Screen, lọc các chuyến chạy từ giờ đó trở đi
    if (time) {
      results = results.filter((trip) => {
        // So sánh giờ đi: trip.departureTime >= time
        return trip.departureTime >= time;
      });
    }

    // Sắp xếp kết quả
    return [...results].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.departureTime.localeCompare(b.departureTime);
    });
  }, [from, to, sortBy, time]);

  /**
   * Chọn chuyến xe cụ thể -> sang UC04 chọn ghế
   */
  const handleSelectTrip = (trip: Trip) => {
    router.push({
      pathname: '/booking/seat-selection',
      params: { tripId: trip.id },
    });
  };

  return {
    from: from || '',
    to: to || '',
    date: date || '',
    time: time || '',
    sortBy,
    setSortBy,
    trips,
    handleSelectTrip,
    goBack: () => router.back(),
  };
}
