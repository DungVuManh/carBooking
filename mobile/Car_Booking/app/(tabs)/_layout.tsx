import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * TabLayout - Cấu hình Bottom Navigation Bar (Tabs)
 *
 * Chứa 5 tab chính của ứng dụng:
 * 1. Trang chủ (index) - UC03: Tìm kiếm chuyến xe
 * 2. Vé của tôi (tickets) - UC06: Xem danh sách vé
 * 3. Tin nhắn (chat) - Hỗ trợ CSKH
 * 4. Thông báo (notifications) - Nhắc nhở chuyến đi, khuyến mãi
 * 5. Tài khoản (profile) - UC02: Quản lý hồ sơ
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Ẩn header mặc định vì mỗi màn hình sẽ tự code header riêng (đẹp hơn)
        headerShown: false,
        // Màu khi tab được chọn (active)
        tabBarActiveTintColor: COLORS.primary,
        // Màu khi tab không được chọn (inactive)
        tabBarInactiveTintColor: COLORS.tabInactive,
        // Style cho toàn bộ thanh tab bar
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          ...SHADOWS.medium, // Đổ bóng nhẹ lên trên
          height: Platform.OS === 'ios' ? 88 : 68, // iOS cần cao hơn do có phần Home Indicator
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
        },
        // Style cho chữ của tab
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: FONT_WEIGHT.medium,
          marginTop: 4,
        },
      }}>

      {/* Tab 1: Trang chủ (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab 2: Vé của tôi */}
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Vé của tôi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'ticket' : 'ticket-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab 3: Chat / Hỗ trợ */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Hỗ trợ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab 4: Thông báo */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab 5: Cá nhân / Hồ sơ */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
