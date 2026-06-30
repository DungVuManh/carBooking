/**
 * Màn hình Kết quả tìm kiếm chuyến xe
 *
 * Hiển thị danh sách xe chạy tuyến đó dựa trên điểm đi, điểm đến và giờ đi.
 * Bấm vào 1 xe → chuyển sang UC04 (chọn ghế).
 *
 * LUỒNG: Home (tìm kiếm) → search-results → seat-selection (UC04)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
  FONT_SIZE,
  FONT_WEIGHT,
} from '@/constants/theme';
import { formatPrice, formatDate, type Trip } from '../data/mockData';
import { useSearchResults, type SortType } from '../../hooks/useSearchResults';

// ─── COMPONENT CON: TripCard ─────────────────────────────────────────────────
function TripCard({ trip, onPress }: { trip: Trip; onPress: () => void }) {
  const isLowSeat = trip.availableSeats <= 5;

  return (
    <View style={styles.card}>
      {/* Dòng 1: Tên nhà xe + Rating */}
      <View style={styles.cardHeader}>
        <View style={styles.companyBadge}>
          <Ionicons name="bus" size={14} color={COLORS.primary} />
          <Text style={styles.companyName}>{trip.company}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#F39C12" />
          <Text style={styles.ratingText}>{trip.rating}</Text>
        </View>
      </View>

      {/* Dòng 2: Giờ đi – Giờ đến – Thời gian */}
      <View style={styles.timeRow}>
        <View style={styles.timePoint}>
          <Text style={styles.timeText}>{trip.departureTime}</Text>
          <Text style={styles.cityText}>{trip.from}</Text>
        </View>

        <View style={styles.timeMiddle}>
          <Text style={styles.durationText}>{
            (() => {
              const [dH, dM] = trip.departureTime.split(':').map(Number);
              const [aH, aM] = trip.arrivalTime.split(':').map(Number);
              let diff = (aH * 60 + aM) - (dH * 60 + dM);
              if (diff < 0) diff += 24 * 60;
              const h = Math.floor(diff / 60);
              const m = diff % 60;
              return m > 0 ? `${h}h${m}p` : `${h}h`;
            })()
          }</Text>
          <View style={styles.timeLine}>
            <View style={styles.timeDot} />
            <View style={styles.timeLineBar} />
            <Ionicons name="bus" size={16} color={COLORS.primary} />
            <View style={styles.timeLineBar} />
            <View style={styles.timeDot} />
          </View>
        </View>

        <View style={[styles.timePoint, { alignItems: 'flex-end' }]}>
          <Text style={styles.timeText}>{trip.arrivalTime}</Text>
          <Text style={styles.cityText}>{trip.to}</Text>
        </View>
      </View>

      {/* Dòng 3: Loại xe + Tiện ích */}
      <View style={styles.busInfoRow}>
        <View style={styles.busTypeTag}>
          <Ionicons name="car-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.busTypeText}>{trip.busType}</Text>
        </View>
        {trip.amenities.slice(0, 3).map((a) => (
          <View key={a} style={styles.amenityTag}>
            <Text style={styles.amenityText}>{a}</Text>
          </View>
        ))}
      </View>

      {/* Dòng 4: Số ghế + Giá + Nút chọn */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={[styles.seatText, isLowSeat && styles.seatTextLow]}>
            {isLowSeat
              ? `⚠️ Còn ${trip.availableSeats} ghế`
              : `✅ Còn ${trip.availableSeats} ghế`}
          </Text>
          <Text style={styles.priceText}>{formatPrice(trip.price)}<Text style={styles.perSeat}>/ghế</Text></Text>
        </View>

        <TouchableOpacity style={styles.selectBtn} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.selectBtnText}>Chọn ghế</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── MÀN HÌNH CHÍNH ──────────────────────────────────────────────────────────
export default function SearchResultsScreen() {
  // Lấy logic từ custom hook
  const {
    from,
    to,
    date,
    time,
    sortBy,
    setSortBy,
    trips,
    handleSelectTrip,
    goBack,
  } = useSearchResults();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerRoute}>{from} → {to}</Text>
          <Text style={styles.headerDate}>
            {date ? formatDate(date) : 'Hôm nay'}
            {time ? ` · Từ ${time}` : ''} · {trips.length} chuyến
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* ── THANH SẮP XẾP ── */}
      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>Sắp xếp:</Text>
        {([
          { key: 'time', label: '🕐 Giờ đi' },
          { key: 'price', label: '💰 Giá' },
          { key: 'rating', label: '⭐ Đánh giá' },
        ] as const).map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortBtn, sortBy === opt.key && styles.sortBtnActive]}
            onPress={() => setSortBy(opt.key as SortType)}
          >
            <Text style={[styles.sortBtnText, sortBy === opt.key && styles.sortBtnTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── DANH SÁCH CHUYẾN XE ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bus-outline" size={64} color={COLORS.textDisabled} />
            <Text style={styles.emptyTitle}>Không tìm thấy chuyến xe</Text>
            <Text style={styles.emptySubtitle}>
              Không có chuyến xe phù hợp cho tuyến {from} → {to}
              {time ? ` khởi hành sau ${time}` : ''}
            </Text>
            <TouchableOpacity style={styles.backHomeBtn} onPress={goBack}>
              <Text style={styles.backHomeBtnText}>← Thay đổi tìm kiếm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => handleSelectTrip(trip)}
            />
          ))
        )}
        <View style={{ height: 30 }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1, alignItems: 'center' },
  headerRoute: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.white },
  headerDate: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  sortLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontWeight: FONT_WEIGHT.medium },
  sortBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  sortBtnText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: FONT_WEIGHT.medium },
  sortBtnTextActive: { color: COLORS.white, fontWeight: FONT_WEIGHT.bold },
  listContent: { padding: SPACING.md, gap: SPACING.md },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.medium },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  companyName: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.primary },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  timePoint: { alignItems: 'flex-start', minWidth: 55 },
  timeText: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.textPrimary },
  cityText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 1 },
  timeMiddle: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.sm },
  durationText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginBottom: 4 },
  timeLine: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  timeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary },
  timeLineBar: { flex: 1, height: 1.5, backgroundColor: COLORS.border },
  busInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  busTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  busTypeText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  amenityTag: { backgroundColor: COLORS.successLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  amenityText: { fontSize: FONT_SIZE.xs, color: COLORS.success, fontWeight: FONT_WEIGHT.medium },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seatText: { fontSize: FONT_SIZE.xs, color: COLORS.success, fontWeight: FONT_WEIGHT.medium, marginBottom: 2 },
  seatTextLow: { color: COLORS.error },
  priceText: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.primary },
  perSeat: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular, color: COLORS.textSecondary },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  selectBtnText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: COLORS.white },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: SPACING.sm },
  emptyTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
  emptySubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: SPACING.xl },
  backHomeBtn: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  backHomeBtnText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.primary },
});
