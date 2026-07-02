import { useState, useMemo, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../utils/api';
import { type Seat, type Trip } from '../app/data/mockData';

// Helper function to generate seats based on bookedSeats array
const generateSeatsHelper = (bookedSeats: string[]): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = [1, 2, 3, 4];

  // Lower deck
  rows.slice(0, 4).forEach((row) => {
    cols.forEach((col) => {
      const seatId = `${row}${col}`;
      seats.push({
        id: seatId,
        row,
        col,
        status: bookedSeats.includes(seatId) ? 'booked' : 'available',
        deck: 'lower',
      });
    });
  });

  // Upper deck
  rows.slice(4).forEach((row) => {
    cols.forEach((col) => {
      const seatId = `${row}${col}`;
      seats.push({
        id: seatId,
        row,
        col,
        status: bookedSeats.includes(seatId) ? 'booked' : 'available',
        deck: 'upper',
      });
    });
  });

  return seats;
};

export function useSeatSelection() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const [trip, setTrip] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get(`/trips/${tripId}`);
        if (res.data.success) {
          const tripData = res.data.data;
          setTrip(tripData);
          setSeats(generateSeatsHelper(tripData.bookedSeats || []));
        }
      } catch (error) {
        console.error('Error fetching trip details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  const selectedSeats = useMemo(() => {
    return seats.filter((s) => s.status === 'selected');
  }, [seats]);

  const totalPrice = useMemo(() => {
    return selectedSeats.length * (trip?.price || 0);
  }, [selectedSeats, trip]);

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

  const handleSeatPress = (pressedSeat: Seat) => {
    setSeats((prev) =>
      prev.map((s) =>
        s.id === pressedSeat.id
          ? { ...s, status: s.status === 'selected' ? 'available' : 'selected' }
          : s
      )
    );
  };

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
    loading,
    handleSeatPress,
    handleContinue,
    goBack: () => router.back(),
  };
}
