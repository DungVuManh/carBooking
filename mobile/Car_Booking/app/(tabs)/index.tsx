import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, FlatList, SafeAreaView, Platform, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { useSearchTrip, OPERATING_HOURS } from '../../hooks/useSearchTrip';
import { useAuth } from '../../hooks/useAuth';

export default function HomeScreen() {
  const {
    from, to, date, time, setDate, setTime,
    cityModalVisible, setCityModalVisible, selectingField,
    timeModalVisible, setTimeModalVisible, openCityPicker,
    swapLocations, handleSearch, handleQuickRoute, navigateToProfile,
    locations, routes, loadingRoutes, handleLocationSelect,
  } = useSearchTrip();

  const { user } = useAuth();
  const userName = (user?.name || 'Bạn').split(' ').slice(-1)[0];
  const userInitial = (user?.name || 'U').charAt(0).toUpperCase();

  // Build quick routes from backend data
  const QUICK_ROUTES = routes.map((r: any) => ({
    from: r.from,
    to: r.to,
    duration: r.duration || '--',
    distance: r.distance || '--',
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── HERO HEADER ── */}
        <View style={styles.hero}>
          {/* Decorative circles */}
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroCircle3} />

          {/* Top row: greeting + avatar */}
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroGreeting}>Xin chào 👋</Text>
              <Text style={styles.heroName}>{userName}</Text>
            </View>
            <TouchableOpacity style={styles.avatar} onPress={navigateToProfile}>
              <Text style={styles.avatarText}>{userInitial}</Text>
              <View style={styles.avatarOnline} />
            </TouchableOpacity>
          </View>

          {/* Hero headline */}
          <Text style={styles.heroTitle}>Bạn muốn đi{'\n'}đâu hôm nay?</Text>
          <Text style={styles.heroSub}>Hơn 100+ chuyến xe mỗi ngày</Text>

          {/* Promo badge */}
          <View style={styles.promoBadge}>
            <Ionicons name="pricetag" size={12} color={COLORS.accent} />
            <Text style={styles.promoText}>Giảm 20% · Mã: HE2026</Text>
          </View>
        </View>

        {/* ── SEARCH CARD (floating over hero) ── */}
        <View style={styles.searchCard}>
          <Text style={styles.searchCardTitle}>Tìm chuyến xe</Text>

          {/* From / To */}
          <View style={styles.locationContainer}>
            {/* From */}
            <TouchableOpacity style={styles.locationBox} onPress={() => openCityPicker('from')} activeOpacity={0.75}>
              <View style={[styles.locationDot, { backgroundColor: COLORS.primary }]} />
              <View style={styles.locationTexts}>
                <Text style={styles.locationLabel}>Điểm đi</Text>
                <Text style={[styles.locationValue, !from && styles.placeholder]} numberOfLines={1}>
                  {from || 'Chọn điểm đi'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
            </TouchableOpacity>

            {/* To */}
            <TouchableOpacity style={styles.locationBox} onPress={() => openCityPicker('to')} activeOpacity={0.75}>
              <View style={[styles.locationDot, { backgroundColor: COLORS.success }]} />
              <View style={styles.locationTexts}>
                <Text style={styles.locationLabel}>Điểm đến</Text>
                <Text style={[styles.locationValue, !to && styles.placeholder]} numberOfLines={1}>
                  {to || 'Chọn điểm đến'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
            </TouchableOpacity>

            {/* Swap */}
            <TouchableOpacity style={styles.swapBtn} onPress={swapLocations} activeOpacity={0.7}>
              <Ionicons name="swap-vertical" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Date + Time */}
          <View style={styles.dateTimeRow}>
            <View style={[styles.dateBox, { flex: 1 }]}>
              <View style={styles.dateIconWrap}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.locationLabel}>Ngày đi</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor={COLORS.textTertiary}
                  value={date}
                  onChangeText={setDate}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity style={[styles.dateBox, { flex: 1 }]} onPress={() => setTimeModalVisible(true)} activeOpacity={0.75}>
              <View style={styles.dateIconWrap}>
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.locationLabel}>Giờ đi</Text>
                <Text style={[styles.dateValue, !time && styles.placeholder]}>
                  {time || 'Tất cả giờ'}
                </Text>
              </View>
              {time ? (
                <TouchableOpacity onPress={() => setTime('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={15} color={COLORS.textTertiary} />
                </TouchableOpacity>
              ) : (
                <Ionicons name="chevron-down" size={14} color={COLORS.textTertiary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={[styles.searchBtn, (!from || !to) && styles.searchBtnDisabled]}
            onPress={handleSearch}
            activeOpacity={0.85}
          >
            <Ionicons name="search" size={18} color={COLORS.white} />
            <Text style={styles.searchBtnText}>Tìm chuyến xe</Text>
          </TouchableOpacity>
        </View>

        {/* ── POPULAR ROUTES ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Tuyến phổ biến</Text>
            <Text style={styles.sectionSub}>Đặt nhanh</Text>
          </View>
          <View style={styles.routesGrid}>
            {QUICK_ROUTES.map((route, i) => (
              <TouchableOpacity
                key={i}
                style={styles.routeCard}
                onPress={() => handleQuickRoute(route.from, route.to)}
                activeOpacity={0.8}
              >
                <View style={styles.routeCardTop}>
                  <View style={styles.routeIconBox}>
                    <Ionicons name="bus" size={18} color={COLORS.primary} />
                  </View>
                  <View style={styles.routeFavBtn}>
                    <Ionicons name="heart-outline" size={14} color={COLORS.textTertiary} />
                  </View>
                </View>
                <Text style={styles.routeFromTo}>
                  {route.from} <Ionicons name="arrow-forward" size={11} color={COLORS.textSecondary} /> {route.to}
                </Text>
                <View style={styles.routeCardMeta}>
                  <Text style={styles.routeMetaText}>⏱ {route.duration}</Text>
                </View>
                <Text style={styles.routePrice}>{route.distance}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── PROMO SECTION ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎁 Ưu đãi dành cho bạn</Text>
          <View style={styles.promoCard}>
            <View style={styles.promoCardLeft}>
              <Text style={styles.promoCardTag}>Hè 2026</Text>
              <Text style={styles.promoCardTitle}>Giảm 20%{'\n'}cho chuyến đầu tiên</Text>
              <Text style={styles.promoCardCode}>Mã: HE2026</Text>
            </View>
            <View style={styles.promoCardRight}>
              <Ionicons name="bus" size={70} color="rgba(255,255,255,0.25)" />
            </View>
            <View style={styles.promoCircle1} />
            <View style={styles.promoCircle2} />
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── MODAL: Location Picker ── */}
      <Modal visible={cityModalVisible} animationType="slide" transparent onRequestClose={() => setCityModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCityModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>
                  {selectingField === 'from' ? 'Chọn điểm đi' : 'Chọn điểm đến'}
                </Text>
                <Text style={styles.modalSub}>Chọn từ danh sách tuyến đường có sẵn</Text>
              </View>
            </View>

            <FlatList
              data={locations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pickerItem} onPress={() => handleLocationSelect(item)}>
                  <View style={styles.pickerIconBox}>
                    <Ionicons name="location" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.pickerItemText}>{item}</Text>
                  {((selectingField === 'from' && from === item) || (selectingField === 'to' && to === item)) && (
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.pickerSep} />}
              ListEmptyComponent={() => (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: COLORS.textSecondary }}>Chưa có tuyến đường nào</Text>
                </View>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── MODAL: Time Picker ── */}
      <Modal visible={timeModalVisible} animationType="slide" transparent onRequestClose={() => setTimeModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setTimeModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn giờ đi</Text>
            </View>
            <TouchableOpacity style={styles.pickerItem} onPress={() => { setTime(''); setTimeModalVisible(false); }}>
              <View style={[styles.pickerIconBox, { backgroundColor: COLORS.accentLight }]}>
                <Ionicons name="time" size={16} color={COLORS.accent} />
              </View>
              <Text style={[styles.pickerItemText, { flex: 1 }]}>Tất cả giờ trong ngày</Text>
              {!time && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
            </TouchableOpacity>
            <View style={styles.pickerSep} />
            <FlatList
              data={OPERATING_HOURS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pickerItem} onPress={() => { setTime(item); setTimeModalVisible(false); }}>
                  <View style={styles.pickerIconBox}>
                    <Ionicons name="bus-outline" size={15} color={COLORS.primary} />
                  </View>
                  <Text style={[styles.pickerItemText, { flex: 1 }]}>{item}</Text>
                  {time === item && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.pickerSep} />}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, backgroundColor: COLORS.background },

  // ── HERO ──
  hero: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl + 24,
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute', width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -80, right: -60,
  },
  heroCircle2: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)', top: 60, left: -50,
  },
  heroCircle3: {
    position: 'absolute', width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.07)', bottom: 20, right: 100,
  },
  heroTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SPACING.lg,
  },
  heroGreeting: {
    fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.75)',
    fontWeight: FONT_WEIGHT.medium,
  },
  heroName: {
    fontSize: FONT_SIZE.lg, color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold, marginTop: 2,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: { color: COLORS.white, fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  avatarOnline: {
    position: 'absolute', bottom: 2, right: 2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.success, borderWidth: 1.5, borderColor: COLORS.primary,
  },
  heroTitle: {
    fontSize: 30, fontWeight: FONT_WEIGHT.black,
    color: COLORS.white, lineHeight: 38, marginBottom: SPACING.sm,
  },
  heroSub: {
    fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.7)',
    fontWeight: FONT_WEIGHT.medium, marginBottom: SPACING.md,
  },
  promoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 6,
  },
  promoText: { fontSize: FONT_SIZE.xs, color: COLORS.white, fontWeight: FONT_WEIGHT.semibold },

  // ── SEARCH CARD ──
  searchCard: {
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.large,
    marginBottom: SPACING.lg,
  },
  searchCardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  locationContainer: { position: 'relative', gap: SPACING.sm, marginBottom: SPACING.md },
  locationBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2, gap: SPACING.sm,
    borderWidth: 1.5, borderColor: COLORS.borderLight,
    minHeight: 60,
  },
  locationDot: { width: 8, height: 8, borderRadius: 4 },
  locationTexts: { flex: 1, paddingRight: 40 }, // padding right to not overlap swapBtn
  locationLabel: {
    fontSize: FONT_SIZE.xs, color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.medium, marginBottom: 2,
  },
  locationValue: {
    fontSize: FONT_SIZE.md, color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  placeholder: { color: COLORS.textTertiary, fontWeight: FONT_WEIGHT.regular },
  swapBtn: {
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    marginTop: -20, // half of height
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.colored,
    zIndex: 10,
    elevation: 5,
  },
  dateTimeRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  dateBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2, gap: SPACING.sm,
    borderWidth: 1.5, borderColor: COLORS.borderLight,
    minHeight: 60,
  },
  dateIconWrap: {
    width: 28, height: 28, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  dateInput: {
    fontSize: FONT_SIZE.sm, color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold, padding: 0,
  },
  dateValue: { fontSize: FONT_SIZE.sm, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2, gap: SPACING.sm,
    ...SHADOWS.colored,
  },
  searchBtnDisabled: { backgroundColor: COLORS.textDisabled, ...SHADOWS.small },
  searchBtnText: { color: COLORS.white, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },

  // ── SECTIONS ──
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
  sectionSub: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: FONT_WEIGHT.semibold },

  // ── ROUTE CARDS ──
  routesGrid: { flexDirection: 'row', gap: SPACING.sm },
  routeCard: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.md, ...SHADOWS.small,
  },
  routeCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  routeIconBox: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  routeFavBtn: {
    width: 28, height: 28, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary, justifyContent: 'center', alignItems: 'center',
  },
  routeFromTo: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary, marginBottom: 4 },
  routeCardMeta: { flexDirection: 'row', gap: 6, marginBottom: SPACING.sm },
  routeMetaText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  routePrice: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary },

  // ── PROMO CARD ──
  promoCard: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    padding: SPACING.lg, flexDirection: 'row',
    overflow: 'hidden', ...SHADOWS.colored,
  },
  promoCardLeft: { flex: 1 },
  promoCardTag: {
    fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.75)',
    fontWeight: FONT_WEIGHT.semibold, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: 6,
  },
  promoCardTitle: {
    fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.white, lineHeight: 26, marginBottom: 8,
  },
  promoCardCode: {
    fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.85)',
    fontWeight: FONT_WEIGHT.semibold,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  promoCardRight: { justifyContent: 'center' },
  promoCircle1: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.06)', right: -30, top: -30,
  },
  promoCircle2: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)', right: 80, bottom: -20,
  },

  // ── MODALS ──
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl, paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl, maxHeight: '72%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: SPACING.lg,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  modalBackBtn: { padding: 4 },
  modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
  modalSub: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: SPACING.md, gap: SPACING.md,
  },
  pickerIconBox: {
    width: 34, height: 34, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  pickerItemText: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  pickerSep: { height: 1, backgroundColor: COLORS.borderLight },
});
