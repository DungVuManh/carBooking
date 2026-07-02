import { useState, useMemo, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../utils/api';
import { type Trip } from '../app/data/mockData';

export type SortType = 'price' | 'time' | 'rating';

export function useSearchResults() {
  const router = useRouter();
  const { from, to, date, time } = useLocalSearchParams<{
    from: string;
    to: string;
    date: string;
    time: string;
  }>();

  const [sortBy, setSortBy] = useState<SortType>('time');
  const [loading, setLoading] = useState(true);
  const [fetchedTrips, setFetchedTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const res = await api.get('/trips', {
          params: {
            from: from || undefined,
            to: to || undefined,
            date: date || undefined,
          }
        });
        if (res.data.success) {
          setFetchedTrips(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [from, to, date]);

  const trips = useMemo(() => {
    let results = [...fetchedTrips];

    if (time) {
      results = results.filter((trip) => trip.departureTime >= time);
    }

    return results.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return a.departureTime.localeCompare(b.departureTime);
    });
  }, [fetchedTrips, sortBy, time]);

  const handleSelectTrip = (trip: Trip) => {
    router.push({
      pathname: '/booking/seat-selection',
      params: { tripId: trip._id || trip.id },
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
    loading,
    handleSelectTrip,
    goBack: () => router.back(),
  };
}
