import { useState } from 'react';

export function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (email.toLowerCase() === 'admin@gmail.com' && password === 'Admin2026') {
      setIsLoggedIn(true);
      setAuthError('');
    } else if (email.toLowerCase() === 'vananh@gmail.com' && password === 'Bus2026') {
      setAuthError('Tài khoản này là tài khoản Khách hàng. Vui lòng đăng nhập trên ứng dụng Mobile.');
    } else {
      setAuthError('Email hoặc mật khẩu không chính xác.');
    }
  };

  const handleLogout = () => {
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
