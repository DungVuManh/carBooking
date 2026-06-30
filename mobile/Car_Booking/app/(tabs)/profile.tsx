import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Platform, StatusBar, Alert, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, SHADOWS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { MOCK_USER } from '../data/mockData';

const STATS = [
  { icon: 'ticket-outline' as const, label: 'Vé đã đặt', value: '12' },
  { icon: 'star-outline' as const, label: 'Điểm tích lũy', value: '840' },
  { icon: 'shield-checkmark-outline' as const, label: 'Hạng thành viên', value: 'Gold' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(MOCK_USER.name);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [email, setEmail] = useState(MOCK_USER.email);

  const handleSave = () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    setIsEditing(false);
    Alert.alert('✅ Thành công', 'Đã cập nhật thông tin cá nhân');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Bạn có chắc muốn đăng xuất?')) router.replace('/auth/login');
    } else {
      Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: () => router.replace('/auth/login') },
      ]);
    }
  };

  const initials = name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase();

  const MENU_ITEMS = [
    { icon: 'lock-closed-outline' as const, color: COLORS.info, bg: COLORS.infoLight, label: 'Đổi mật khẩu', onPress: undefined as any },
    { icon: 'help-buoy-outline' as const, color: COLORS.warning, bg: COLORS.warningLight, label: 'Trung tâm hỗ trợ', onPress: () => router.push('/(tabs)/chat') },
    { icon: 'notifications-outline' as const, color: COLORS.success, bg: COLORS.successLight, label: 'Thông báo', onPress: () => router.push('/(tabs)/notifications') },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── PROFILE HEADER ── */}
        <View style={styles.profileHeader}>
          <View style={styles.headerBg} />
          <View style={styles.headerBgCircle1} />
          <View style={styles.headerBgCircle2} />

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.editCameraBtn}>
                <Ionicons name="camera" size={14} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>

          {/* Member badge */}
          <View style={styles.memberBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#F59E0B" />
            <Text style={styles.memberText}>Thành viên Gold</Text>
          </View>
        </View>

        {/* ── STATS ── */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={styles.statIconBox}>
                <Ionicons name={s.icon} size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── PERSONAL INFO ── */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <TouchableOpacity
              style={[styles.editBtn, isEditing && styles.editBtnActive]}
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              <Ionicons
                name={isEditing ? 'checkmark' : 'create-outline'}
                size={14}
                color={isEditing ? COLORS.white : COLORS.primary}
              />
              <Text style={[styles.editBtnText, isEditing && styles.editBtnTextActive]}>
                {isEditing ? 'Lưu' : 'Chỉnh sửa'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            {[
              { icon: 'person-outline' as const, label: 'Họ và tên', value: name, onChange: setName, type: undefined },
              { icon: 'call-outline' as const, label: 'Số điện thoại', value: phone, onChange: setPhone, type: 'phone-pad' as const },
              { icon: 'mail-outline' as const, label: 'Email', value: email, onChange: setEmail, type: 'email-address' as const },
            ].map((field, i, arr) => (
              <View key={field.label}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconBox}>
                    <Ionicons name={field.icon} size={17} color={COLORS.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{field.label}</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.infoInput}
                        value={field.value}
                        onChangeText={field.onChange}
                        keyboardType={field.type as any}
                        autoCapitalize={field.type === 'email-address' ? 'none' : 'words'}
                      />
                    ) : (
                      <Text style={styles.infoValue}>{field.value}</Text>
                    )}
                  </View>
                </View>
                {i < arr.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── SETTINGS MENU ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, i, arr) => (
              <View key={item.label}>
                <Pressable
                  style={styles.menuItem}
                  onPress={item.onPress}
                  android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
                >
                  <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
                </Pressable>
                {i < arr.length - 1 && <View style={[styles.rowDivider, { marginLeft: 68 }]} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── LOGOUT ── */}
        <View style={styles.section}>
          <Pressable
            style={styles.logoutBtn}
            onPress={handleLogout}
            android_ripple={{ color: 'rgba(239,68,68,0.1)' }}
          >
            <View style={styles.logoutIconBox}>
              <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
            </View>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </Pressable>
        </View>

        {/* App version */}
        <Text style={styles.versionText}>Vân Anh Bus v2.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: { flexGrow: 1 },

  // Profile header
  profileHeader: {
    alignItems: 'center',
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.xl,
    overflow: 'hidden',
    marginBottom: -SPACING.md,
  },
  headerBg: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 180, backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  headerBgCircle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -50, right: -40,
  },
  headerBgCircle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)', top: 60, left: -20,
  },
  avatarWrap: { position: 'relative', marginBottom: SPACING.md },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: COLORS.white, ...SHADOWS.medium,
  },
  avatarText: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: COLORS.white },
  editCameraBtn: {
    position: 'absolute', bottom: 2, right: 2,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.white,
  },
  profileName: {
    fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.textPrimary, marginBottom: 4,
  },
  profileEmail: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  memberBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FEF3C7', borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  memberText: { fontSize: FONT_SIZE.xs, color: '#92400E', fontWeight: FONT_WEIGHT.bold },

  // Stats
  statsRow: {
    flexDirection: 'row', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.sm,
  },
  statCard: {
    flex: 1, backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, padding: SPACING.md,
    alignItems: 'center', ...SHADOWS.small,
  },
  statIconBox: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm,
  },
  statValue: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.textPrimary },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },

  // Section
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.primaryMid,
  },
  editBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  editBtnText: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary },
  editBtnTextActive: { color: COLORS.white },

  // Info card
  infoCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md, ...SHADOWS.small,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, gap: SPACING.md },
  infoIconBox: {
    width: 40, height: 40, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textTertiary, fontWeight: FONT_WEIGHT.medium, marginBottom: 3 },
  infoValue: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.textPrimary },
  infoInput: {
    fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary, padding: 0,
    borderBottomWidth: 1.5, borderBottomColor: COLORS.primary,
    paddingBottom: 2,
  },
  rowDivider: { height: 1, backgroundColor: COLORS.borderLight, marginLeft: 56 },

  // Menu
  menuCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, ...SHADOWS.small, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  menuIconBox: { width: 40, height: 40, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium, color: COLORS.textPrimary },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.errorLight, borderRadius: RADIUS.xl,
    padding: SPACING.md, borderWidth: 1.5, borderColor: '#FECACA',
  },
  logoutIconBox: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center',
  },
  logoutText: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.error },

  versionText: { textAlign: 'center', fontSize: FONT_SIZE.xs, color: COLORS.textTertiary, marginTop: SPACING.xl },
});
