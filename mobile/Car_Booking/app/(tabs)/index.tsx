import React from 'react';
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
import { COLORS, SPACING, RADIUS, SHADOWS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { ADMINISTRATIVE_DATA, MOCK_USER } from '../data/mockData';
import { useSearchTrip, OPERATING_HOURS } from '../../hooks/useSearchTrip';

/**
 * HomeScreen - Màn hình chính (UC03: Tìm kiếm chuyến xe)
 */
export default function HomeScreen() {
  const {
    from,
    to,
    date,
    time,
    setDate,
    setTime,
    cityModalVisible,
    setCityModalVisible,
    selectingField,
    timeModalVisible,
    setTimeModalVisible,
    openCityPicker,
    swapLocations,
    handleSearch,
    handleQuickRoute,
    navigateToProfile,
    selectionStep,
    selectedProvince,
    selectedDistrict,
    handleBackSelectionStep,
    handleProvinceSelect,
    handleDistrictSelect,
    handleCommuneSelect,
  } = useSearchTrip();

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
            onPress={navigateToProfile}
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

          {/* Ngày đi + Giờ đi (2 ô cạnh nhau) */}
          <View style={styles.dateTimeRow}>
            {/* Ngày đi */}
            <View style={[styles.dateInput, { flex: 1 }]}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
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
            </View>

            {/* Giờ đi - bấm để mở modal chọn giờ */}
            <TouchableOpacity
              style={[styles.dateInput, { flex: 1 }]}
              onPress={() => setTimeModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <View style={styles.dateTextContainer}>
                <Text style={styles.locationLabel}>Giờ đi</Text>
                <Text style={[styles.dateValue, !time && styles.placeholder]}>
                  {time || 'Tất cả giờ'}
                </Text>
              </View>
              {/* Nút xóa giờ đã chọn */}
              {time ? (
                <TouchableOpacity onPress={() => setTime('')}>
                  <Ionicons name="close-circle" size={16} color={COLORS.textTertiary} />
                </TouchableOpacity>
              ) : (
                <Ionicons name="chevron-down" size={16} color={COLORS.textTertiary} />
              )}
            </TouchableOpacity>
          </View>

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

      {/* ── MODAL CHỌN THÀNH PHỐ / HUYỆN / XÃ ──────────────────────────────── */}
      <Modal
        visible={cityModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleBackSelectionStep}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCityModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              {selectionStep !== 'province' && (
                <TouchableOpacity onPress={handleBackSelectionStep} style={styles.modalBackBtn}>
                  <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
                </TouchableOpacity>
              )}
              <Text style={styles.modalTitle}>
                {selectionStep === 'province' && (selectingField === 'from' ? 'Chọn điểm đi' : 'Chọn điểm đến')}
                {selectionStep === 'district' && `${selectedProvince?.name}`}
                {selectionStep === 'commune' && `${selectedDistrict?.name}`}
              </Text>
            </View>

            {selectionStep === 'province' && (
              <FlatList
                data={ADMINISTRATIVE_DATA}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.cityItem}
                    onPress={() => handleProvinceSelect(item.name)}
                  >
                    <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.cityName}>{item.name}</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}

            {selectionStep === 'district' && selectedProvince && (
              <FlatList
                data={selectedProvince.districts}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.cityItem}
                    onPress={() => handleDistrictSelect(item.name)}
                  >
                    <Ionicons name="map-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.cityName}>{item.name}</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}

            {selectionStep === 'commune' && selectedDistrict && (
              <FlatList
                data={selectedDistrict.communes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.cityItem}
                    onPress={() => handleCommuneSelect(item)}
                  >
                    <Ionicons name="navigate-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.cityName}>{item}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── MODAL CHỌN GIỜ ĐI ──────────────────────────────────────────── */}
      {/*
       * Modal hiển thị danh sách giờ xe hoạt động.
       * Tương tự modal chọn thành phố nhưng dữ liệu là OPERATING_HOURS.
       */}
      <Modal
        visible={timeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTimeModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTimeModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Chọn giờ đi</Text>

            {/* Tùy chọn "Tất cả giờ" (không lọc theo giờ) */}
            <TouchableOpacity
              style={styles.cityItem}
              onPress={() => { setTime(''); setTimeModalVisible(false); }}
            >
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <Text style={styles.cityName}>Tất cả giờ trong ngày</Text>
              {!time && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
            </TouchableOpacity>
            <View style={styles.separator} />

            {/* Danh sách các giờ hoạt động */}
            <FlatList
              data={OPERATING_HOURS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => { setTime(item); setTimeModalVisible(false); }}
                >
                  {/* Icon đồng hồ */}
                  <View style={styles.timeIconBox}>
                    <Ionicons name="bus-outline" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.cityName}>{item}</Text>
                  {/* Dấu check nếu đang chọn giờ này */}
                  {time === item && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
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
  // Hàng ngày đi + giờ đi cạnh nhau
  dateTimeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: SPACING.sm,
    // marginBottom bỏ khỏi đây vì dateTimeRow đã xử lý khoảng cách
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
  // Icon giờ (box nhỏ có nền)
  timeIconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  modalBackBtn: {
    paddingRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
