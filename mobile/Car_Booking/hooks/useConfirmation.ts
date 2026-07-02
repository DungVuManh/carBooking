import { useState, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../utils/api';

export function useConfirmation() {
  const router = useRouter();
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${ticketId}`);
        if (res.data.success) {
          setTicket(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching ticket confirmation:', error);
      } finally {
        setLoading(false);
      }
    };
    if (ticketId) fetchTicket();
  }, [ticketId]);

  const trip = useMemo(() => ticket?.tripId, [ticket]);
  const seats = useMemo(() => ticket?.seats || [], [ticket]);
  const price = useMemo(() => ticket?.totalPrice || 0, [ticket]);
  const ticketCode = useMemo(() => {
    return ticket?._id?.substring(0, 8).toUpperCase() || 'TKT-123';
  }, [ticket]);

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
    passengerName: ticket?.passengerName || '',
    passengerPhone: ticket?.passengerPhone || '',
    loading,
    handleGoToTickets,
    handleGoHome,
  };
}
