import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../utils/api';
import { User } from '../app/data/mockData';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Fetch user profile to verify token
        const res = await api.get('/users/profile');
        if (res.data.success) {
          setUser(res.data.data);
          setIsLoggedIn(true);
        } else {
          await logout();
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        await AsyncStorage.setItem('userToken', res.data.data.token);
        setUser(res.data.data);
        setIsLoggedIn(true);
        router.replace('/(tabs)');
        return { success: true };
      }
      return { success: false, message: 'Đăng nhập thất bại' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Có lỗi xảy ra khi kết nối máy chủ'
      };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data.success) {
        await AsyncStorage.setItem('userToken', res.data.data.token);
        setUser(res.data.data);
        setIsLoggedIn(true);
        router.replace('/(tabs)');
        return { success: true };
      }
      return { success: false, message: 'Đăng ký thất bại' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Có lỗi xảy ra khi kết nối máy chủ'
      };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/auth/login');
  };

  return {
    user,
    isLoggedIn,
    loading,
    login,
    register,
    logout,
  };
}
