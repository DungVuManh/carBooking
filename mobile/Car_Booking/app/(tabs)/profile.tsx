import React, { useState } from 'react';
import {
  View, // Container giống <div>
  Text, // Hiển thị văn bản giống <span>
  StyleSheet,
  ScrollView, // Cuộn trang
  TouchableOpacity, // Nút bấm
  TextInput, // Ô nhập liệu
  SafeAreaView, // Chống lẹm tai thỏ
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, SHADOWS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { MOCK_USER } from '../data/mockData';

/**
 * ProfileScreen - Màn hình Quản lý hồ sơ (UC02)
 *
 * Cho phép người dùng xem và cập nhật thông tin cá nhân.
 * Hỗ trợ chế độ xem (view) và chế độ sửa (edit).
 */
export default function ProfileScreen() {
  const router = useRouter();

  // State xác định người dùng có đang ở chế độ chỉnh sửa hay không
  const [isEditing, setIsEditing] = useState(false);

  // State lưu trữ dữ liệu người dùng (lấy từ MOCK_USER ban đầu)
  const [name, setName] = useState(MOCK_USER.name);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [email, setEmail] = useState(MOCK_USER.email);

  // Hàm xử lý lưu thông tin
  const handleSave = () => {
    // Validate cơ bản
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Ở đây sẽ gọi API cập nhật thông tin lên Firebase/Backend
    // ...

    // Thành công -> tắt chế độ sửa
    setIsEditing(false);
    Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân');
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: () => router.replace('/auth/login') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Phần Header cá nhân */}
        <View style={styles.header}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
            {/* Nút đổi avatar (chỉ hiện khi đang sửa) */}
            {isEditing && (
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="camera" size={16} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Thông tin hồ sơ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            {/* Nút bật/tắt chế độ sửa */}
            <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
              <Text style={[styles.editBtnText, isEditing && styles.saveBtnText]}>
                {isEditing ? 'Lưu' : 'Chỉnh sửa'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            {/* Input: Họ tên */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Họ và tên</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.infoValue}>{name}</Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />

            {/* Input: Số điện thoại */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="call-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{phone}</Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />

            {/* Input: Email */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.infoValue}>{email}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Các tuỳ chọn khác (Menu) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          <View style={styles.menuCard}>
            {/* Đổi mật khẩu */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.infoLight }]}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.info} />
              </View>
              <Text style={styles.menuText}>Đổi mật khẩu</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
            
            {/* Hỗ trợ */}
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/chat')}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.warningLight }]}>
                <Ionicons name="help-buoy-outline" size={20} color={COLORS.warning} />
              </View>
              <Text style={styles.menuText}>Trung tâm hỗ trợ</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>

            {/* Đăng xuất */}
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.errorLight }]}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              </View>
              <Text style={[styles.menuText, { color: COLORS.error }]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  
  // ── HEADER ──
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  avatarText: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  // ── SECTION ──
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  editBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primary,
  },
  saveBtnText: {
    color: COLORS.success,
  },

  // ── INFO CARD ──
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  infoInput: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 56, // Align with content, bypassing icon
  },

  // ── MENU CARD ──
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
});
