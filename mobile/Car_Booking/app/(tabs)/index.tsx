import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, SHADOWS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { CITIES, MOCK_USER, formatDate } from '../data/mockData';

/**
 * HomeScreen - Màn hình chính (UC03: Tìm kiếm chuyến xe)
 *
 * Chức năng:
 * - Hiển thị form tìm kiếm: Điểm đi, Điểm đến, Ngày đi
 * - Dropdown chọn thành phố
 * - Hiển thị danh sách tuyến phổ biến (quick select)
 * - Banner khuyến mãi
 *
 * State management:
 * - useState để lưu giá trị form tìm kiếm
 * - Modal để hiển thị dropdown chọn thành phố
 */

// Type cho field đang chọn (from hoặc to)
type SelectingField = 'from' | 'to' | null;

export default function HomeScreen() {
  const router = useRouter();

  // State lưu thông tin form tìm kiếm
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  // State kiểm soát modal dropdown chọn thành phố
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [selectingField, setSelectingField] = useState<SelectingField>(null);

  // Mở modal chọn thành phố cho trường tương ứng
  const openCityPicker = (field: SelectingField) => {
    setSelectingField(field);
    setCityModalVisible(true);
  };

  // Khi chọn thành phố từ dropdown
  const handleCitySelect = (city: string) => {
    if (selectingField === 'from') setFrom(city);
    else if (selectingField === 'to') setTo(city);
    setCityModalVisible(false);
  };

  // Đổi chiều điểm đi và điểm đến
  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Xử lý tìm kiếm - điều hướng sang màn search results
  const handleSearch = () => {
    if (!from || !to) return;
    // Truyền params qua URL query string (Expo Router cách truyền dữ liệu giữa màn hình)
    router.push({
      pathname: '/booking/search-results' as any,
      params: { from, to, date: date || new Date().toISOString().split('T')[0] },
    });
  };

  // Chọn tuyến phổ biến nhanh
  const handleQuickRoute = (fromCity: string, toCity: string) => {
    setFrom(fromCity);
    setTo(toCity);
  };

  return (
    // SafeAreaView đảm bảo nội dung không bị che bởi notch / status bar
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Xin chào, 👋</Text>
            <Text style={styles.userName}>{MOCK_USER.name}</Text>
          </View>
          {/* Avatar người dùng */}
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.avatarText}>
              {MOCK_USER.name.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── BANNER QUẢNG CÁO ───────────────────────────────────────── */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTag}>Ưu đãi hè 2025</Text>
            <Text style={styles.bannerTitle}>Giảm 20% cho{'\n'}chuyến xe mùa hè! 🌞</Text>
            <Text style={styles.bannerSubtitle}>Nhập mã: HE2025</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Đặt ngay</Text>
            </TouchableOpacity>
          </View>
          {/* Decoration circles */}
          <View style={styles.bannerCircle1} />
          <View style={styles.bannerCircle2} />
          <Ionicons
            name="bus"
            size={80}
            color="rgba(255,255,255,0.15)"
            style={styles.bannerBusIcon}
          />
        </View>

        {/* ── FORM TÌM KIẾM CHUYẾN XE ───────────────────────────────── */}
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>🔍 Tìm chuyến xe</Text>

          {/* Điểm đi & Điểm đến */}
          <View style={styles.routeRow}>
            {/* Điểm đi */}
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => openCityPicker('from')}
              activeOpacity={0.7}
            >
              {/* Ionicons là thư viện icon vector phổ biến trong React Native */}
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Điểm đi</Text>
                <Text style={[styles.locationValue, !from && styles.placeholder]}>
                  {from || 'Chọn điểm đi'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Nút đổi chiều */}
            <TouchableOpacity style={styles.swapBtn} onPress={swapLocations}>
              <Ionicons name="swap-vertical" size={22} color={COLORS.white} />
            </TouchableOpacity>

            {/* Điểm đến */}
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => openCityPicker('to')}
              activeOpacity={0.7}
            >
              <Ionicons name="location" size={20} color={COLORS.secondary} />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Điểm đến</Text>
                <Text style={[styles.locationValue, !to && styles.placeholder]}>
                  {to || 'Chọn điểm đến'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Ngày đi */}
          <TouchableOpacity style={styles.dateInput}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            <View style={styles.dateTextContainer}>
              <Text style={styles.locationLabel}>Ngày đi</Text>
              <TextInput
                style={styles.dateValue}
                placeholder="dd/mm/yyyy"
                placeholderTextColor={COLORS.textTertiary}
                value={date}
                onChangeText={setDate}
                keyboardType="numeric"
              />
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>

          {/* Nút tìm kiếm */}
          <TouchableOpacity
            style={[styles.searchBtn, (!from || !to) && styles.searchBtnDisabled]}
            onPress={handleSearch}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color={COLORS.white} />
            <Text style={styles.searchBtnText}>Tìm chuyến xe</Text>
          </TouchableOpacity>
        </View>

        {/* ── TUYẾN PHỔ BIẾN ─────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Tuyến phổ biến</Text>
          <View style={styles.popularRoutes}>
            {[
              { from: 'Hà Nội', to: 'Hải Phòng', price: '120.000 đ', duration: '2h30' },
              { from: 'Hà Nội', to: 'Lào Cai', price: '280.000 đ', duration: '5h' },
              { from: 'Hà Nội', to: 'Quảng Ninh', price: '150.000 đ', duration: '3h' },
              { from: 'Hà Nội', to: 'Ninh Bình', price: '90.000 đ', duration: '2h' },
            ].map((route, index) => (
              // Mỗi card tuyến phổ biến
              <TouchableOpacity
                key={index}
                style={styles.routeCard}
                onPress={() => handleQuickRoute(route.from, route.to)}
                activeOpacity={0.7}
              >
                <View style={styles.routeCardLeft}>
                  <View style={styles.routeIconBox}>
                    <Ionicons name="bus" size={18} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.routeName}>
                      {route.from} → {route.to}
                    </Text>
                    <Text style={styles.routeDuration}>⏱ {route.duration}</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.routePrice}>Từ {route.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Padding bottom để tránh bị tab bar che */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── MODAL CHỌN THÀNH PHỐ ──────────────────────────────────────── */}
      {/* Modal hiển thị danh sách thành phố để chọn */}
      <Modal
        visible={cityModalVisible}
        animationType="slide"  // Trượt từ dưới lên
        transparent={true}
        onRequestClose={() => setCityModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCityModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {selectingField === 'from' ? 'Chọn điểm đi' : 'Chọn điểm đến'}
            </Text>
            {/* FlatList hiệu quả hơn ScrollView khi render danh sách dài */}
            <FlatList
              data={CITIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => handleCitySelect(item)}
                >
                  <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.cityName}>{item}</Text>
                  {/* Hiển thị dấu check nếu đang chọn thành phố này */}
                  {((selectingField === 'from' && from === item) ||
                    (selectingField === 'to' && to === item)) && (
                      <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                    )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // SafeAreaView bảo vệ nội dung khỏi bị cắt bởi notch/statusbar
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── HEADER ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.regular,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },

  // ── BANNER ──
  banner: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  bannerContent: {
    zIndex: 1,
  },
  bannerTag: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.extrabold,
    lineHeight: 28,
    marginBottom: SPACING.xs,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
  },
  bannerBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.sm,
  },
  // Decorative elements
  bannerCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: -20,
    top: -30,
  },
  bannerCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: 60,
    bottom: -20,
  },
  bannerBusIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },

  // ── SEARCH CARD ──
  searchCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  searchTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  locationInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  placeholder: {
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.regular,
  },
  swapBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
    padding: 0,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  searchBtnDisabled: {
    backgroundColor: COLORS.textDisabled,
  },
  searchBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },

  // ── POPULAR ROUTES ──
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  popularRoutes: {
    gap: SPACING.sm,
  },
  routeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  routeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  routeIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  routeDuration: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  routePrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },

  // ── MODAL ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  cityName: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
