import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

/**
 * Root Layout - Điều phối navigation cho toàn bộ app.
 * Stack Navigator quản lý các màn hình theo kiểu stack (chồng lên nhau).
 * headerShown: false → tắt header mặc định, mỗi màn hình tự vẽ header riêng.
 */
export default function RootLayout() {
  return (
    <>
      {/* Stack.Screen định nghĩa các màn hình có trong Stack */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Màn hình tabs chứa Bottom Tab Navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Màn hình đăng nhập / đăng ký */}
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />

        {/* Màn hình tìm kiếm kết quả chuyến xe */}
        <Stack.Screen name="booking/search-results" options={{ headerShown: false }} />

        {/* Màn hình chọn ghế */}
        <Stack.Screen name="booking/seat-selection" options={{ headerShown: false }} />

        {/* Màn hình thanh toán */}
        <Stack.Screen name="booking/payment" options={{ headerShown: false }} />

        {/* Màn hình xác nhận đặt vé thành công */}
        <Stack.Screen name="booking/confirmation" options={{ headerShown: false }} />

        {/* Màn hình chi tiết vé */}
        <Stack.Screen name="ticket/[id]" options={{ headerShown: false }} />
      </Stack>

      {/* StatusBar style="dark" → text màu tối trên status bar */}
      <StatusBar style="dark" />
    </>
  );
}
