import { useState, useMemo, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../utils/api';
import { type Ticket } from '../app/data/mockData';

export function useTicketDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/tickets/${id}`);
        if (res.data.success) {
          setTicketData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching ticket detail:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  const cancellable = useMemo(() => {
    if (!ticketData) return false;
    // Basic logic: can only cancel if status is confirmed or pending, and maybe check departureTime in a real app
    return ['confirmed', 'pending'].includes(ticketData.status);
  }, [ticketData]);

  const doCancel = async () => {
    try {
      const res = await api.put(`/tickets/${id}`, { status: 'cancelled' });
      if (res.data.success) {
        setTicketData(res.data.data);
        if (Platform.OS === 'web') {
          alert('✅ Hủy vé thành công!\nTiền hoàn trả sẽ xử lý trong 3-5 ngày làm việc.');
        } else {
          Alert.alert(
            '✅ Hủy vé thành công',
            'Vé của bạn đã được hủy. Tiền hoàn trả (nếu có) sẽ được xử lý trong 3-5 ngày làm việc.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error: any) {
      console.error('Error cancelling ticket:', error);
      if (Platform.OS === 'web') {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi hủy vé.');
      } else {
        Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi hủy vé.');
      }
    }
  };

  const handleCancelTicket = () => {
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
          { text: 'Hủy vé', style: 'destructive', onPress: doCancel },
        ]
      );
    }
  };

  return {
    ticketData,
    cancellable,
    loading,
    handleCancelTicket,
    goBack: () => router.back(),
  };
}
