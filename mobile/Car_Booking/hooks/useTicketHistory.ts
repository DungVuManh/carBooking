import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import api from '../utils/api';
import { type Ticket } from '../app/data/mockData';

export type FilterTab = 'all' | Ticket['status'];

export const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

export function useTicketHistory() {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets/my-tickets');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [])
  );

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) =>
      activeFilter === 'all' ? true : ticket.status === activeFilter
    );
  }, [tickets, activeFilter]);

  const handleTicketPress = (ticketId: string) => {
    router.push({
      pathname: '/ticket/[id]',
      params: { id: ticketId },
    });
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return {
    activeFilter,
    setActiveFilter,
    filteredTickets,
    totalTickets: tickets.length,
    loading,
    handleTicketPress,
    handleGoHome,
  };
}
