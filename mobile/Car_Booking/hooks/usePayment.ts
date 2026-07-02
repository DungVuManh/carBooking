import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../utils/api';
import { useAuth } from './useAuth';

export type PaymentStep = 'form' | 'qr' | 'loading';

export function usePayment() {
  const router = useRouter();
  const { user } = useAuth();
  
  const { tripId, seatIds, totalPrice } = useLocalSearchParams<{
    tripId: string;
    seatIds: string;
    totalPrice: string;
  }>();

  const seats = seatIds?.split(',') || [];
  const price = parseInt(totalPrice || '0', 10);
  
  const [trip, setTrip] = useState<any>(null);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [step, setStep] = useState<PaymentStep>('form');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get(`/trips/${tripId}`);
        if (res.data.success) {
          setTrip(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching trip in payment:', error);
      }
    };
    if (tripId) fetchTrip();
  }, [tripId]);

  const handleShowQR = () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin hành khách.');
      return;
    }
    setStep('qr');
  };

  const handleConfirmPayment = async () => {
    setStep('loading');
    
    try {
      const res = await api.post('/tickets', {
        tripId,
        userId: user?._id,
        seats,
        passengerName: name,
        passengerPhone: phone,
        paymentMethod: 'qr',
      });
      
      if (res.data.success) {
        router.replace({
          pathname: '/booking/confirmation',
          params: {
            ticketId: res.data.data._id || res.data.data.id,
          },
        });
      } else {
        Alert.alert('Đặt vé thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
        setStep('qr');
      }
    } catch (error: any) {
      console.error('Lỗi khi đặt vé:', error.response?.data || error.message);
      Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi đặt vé.');
      setStep('qr');
    }
  };

  const handleBackPress = () => {
    if (step === 'qr') {
      setStep('form');
    } else {
      router.back();
    }
  };

  return {
    trip,
    tripId,
    seats,
    price,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    step,
    setStep,
    handleShowQR,
    handleConfirmPayment,
    handleBackPress,
  };
}
