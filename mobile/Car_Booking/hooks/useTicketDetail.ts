import { useState, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MOCK_TICKETS, canCancelTicket, type Ticket } from '../app/data/mockData';

/**
 * Custom Hook: useTicketDetail
 * 
 * Quản lý trạng thái và logic hủy vé cho màn hình chi tiết vé (UC07).
 */
export function useTicketDetail() {
  const router = useRouter();

  // Lấy id của vé từ URL params
  const { id } = useLocalSearchParams<{ id: string }>();

  // Tìm thông tin vé từ id
  const foundTicket = useMemo(() => {
    return MOCK_TICKETS.find((t) => t.id === id);
  }, [id]);

  // Trạng thái lưu trữ vé cục bộ
  const [ticketData, setTicketData] = useState<Ticket | undefined>(foundTicket);

  // Kiểm tra xem vé có thể hủy được hay không
  const cancellable = useMemo(() => {
    return ticketData ? canCancelTicket(ticketData) : false;
  }, [ticketData]);

  /**
   * Xử lý thực hiện hủy vé
   */
  const handleCancelTicket = () => {
    const doCancel = () => {
      setTicketData((prev) => (prev ? { ...prev, status: 'cancelled' } : prev));

      if (Platform.OS === 'web') {
        alert('✅ Hủy vé thành công!\nTiền hoàn trả sẽ xử lý trong 3-5 ngày làm việc.');
      } else {
        Alert.alert(
          '✅ Hủy vé thành công',
          'Vé của bạn đã được hủy. Tiền hoàn trả (nếu có) sẽ được xử lý trong 3-5 ngày làm việc.',
          [{ text: 'OK' }]
        );
      }
    };

    // Xác nhận trước khi hủy
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Bạn có chắc muốn hủy vé này?\nHành động này không thể hoàn tác.'
      );
      if (confirmed) {
        doCancel();
      }
    } else {
      Alert.alert(
        'Hủy vé',
        'Bạn có chắc muốn hủy vé này? Hành động này không thể hoàn tác.',
        [
          { text: 'Không', style: 'cancel' },
          {
            text: 'Hủy vé',
            style: 'destructive',
            onPress: doCancel,
          },
        ]
      );
    }
  };

  return {
    ticketData,
    cancellable,
    handleCancelTicket,
    goBack: () => router.back(),
  };
}
