import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.data.role === 'admin') {
        localStorage.setItem('adminToken', data.data.token);
        setIsLoggedIn(true);
        setAuthError('');
      } else if (data.success && data.data.role !== 'admin') {
        setAuthError('Tài khoản này là tài khoản Khách hàng. Vui lòng đăng nhập trên ứng dụng Mobile.');
      } else {
        setAuthError(data.message || 'Email hoặc mật khẩu không chính xác.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('Có lỗi xảy ra khi kết nối máy chủ.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  return {
    isLoggedIn,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    handleLogin,
    handleLogout,
  };
}
