import { Redirect } from 'expo-router';

/**
 * Root Index - Điểm bắt đầu của ứng dụng.
 * Tự động chuyển hướng người dùng đến màn hình Đăng nhập đầu tiên.
 */
export default function Index() {
  return <Redirect href="/auth/login" />;
}
