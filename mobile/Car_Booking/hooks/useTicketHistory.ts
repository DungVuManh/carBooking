import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { MOCK_TICKETS, type Ticket } from '../app/data/mockData';

export type FilterTab = 'all' | Ticket['status'];

export const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

/**
 * Custom Hook: useTicketHistory
 * 
 * Quản lý trạng thái lọc cho danh sách vé trong lịch sử của người dùng.
 */
export function useTicketHistory() {
  const router = useRouter();

  // Tab lọc hiện tại (mặc định hiển thị tất cả)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  // Lọc danh sách vé theo status
  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter((ticket) =>
      activeFilter === 'all' ? true : ticket.status === activeFilter
    );
  }, [activeFilter]);

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
    totalTickets: MOCK_TICKETS.length,
    handleTicketPress,
    handleGoHome,
  };
}
