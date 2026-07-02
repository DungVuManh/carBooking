/**
 * UC04 - Màn hình Kết quả tìm kiếm chuyến xe
 * Premium 2026 redesign
 */
import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { formatPrice, formatDate } from '../data/mockData';
import { useSearchResults, type SortType } from '../../hooks/useSearchResults';

// ─── TRIP CARD ─────────────────────────────────────────────────────────────────
function TripCard({ trip, onPress }: { trip: any; onPress: () => void }) {
  const isLowSeat = trip.availableSeats <= 5;

  const getDuration = () => {
    const [dH, dM] = trip.departureTime.split(':').map(Number);
    const [aH, aM] = trip.arrivalTime.split(':').map(Number);
    let diff = (aH * 60 + aM) - (dH * 60 + dM);
    if (diff < 0) diff += 24 * 60;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return m > 0 ? `${h}h${m}p` : `${h}h`;
  };

  return (
    <View style={styles.card}>
      {/* Top: Company + Rating */}
      <View style={styles.cardTop}>
        <View style={styles.companyRow}>
          <View style={styles.companyAvatar}>
            <Ionicons name="bus" size={14} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.companyName}>{trip.company}</Text>
            <Text style={styles.busType}>{trip.busType}</Text>
          </View>
        </View>
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={styles.ratingText}>{trip.rating}</Text>
        </View>
      </View>

      {/* Route visual */}
      <View style={styles.routeVisual}>
        <View style={styles.routeEndpoint}>
          <Text style={styles.timeText}>{trip.departureTime}</Text>
          {trip.date && <Text style={styles.dateText}>{trip.date.split('-').reverse().join('/')}</Text>}
          <Text style={styles.cityText} numberOfLines={1}>{trip.from}</Text>
        </View>

        <View style={styles.routeMiddle}>
          <Text style={styles.durationBadge}>{getDuration()}</Text>
          <View style={styles.routeLine}>
            <View style={styles.routeDot} />
            <View style={styles.routeBar} />
            <View style={styles.busOnLine}>
              <Ionicons name="bus" size={13} color={COLORS.primary} />
            </View>
            <View style={styles.routeBar} />
            <View style={styles.routeDot} />
          </View>
        </View>

        <View style={[styles.routeEndpoint, { alignItems: 'flex-end' }]}>
          <Text style={styles.timeText}>{trip.arrivalTime}</Text>
          {trip.date && <Text style={styles.dateText}>{trip.date.split('-').reverse().join('/')}</Text>}
          <Text style={styles.cityText} numberOfLines={1} adjustsFontSizeToFit>{trip.to}</Text>
        </View>
      </View>

      {/* Footer: Seats + Price + CTA */}
      <View style={styles.cardFooter}>
        <View>
          <View style={[styles.seatBadge, isLowSeat && styles.seatBadgeLow]}>
            <Ionicons
              name={isLowSeat ? 'warning-outline' : 'checkmark-circle-outline'}
              size={12}
              color={isLowSeat ? COLORS.warning : COLORS.success}
            />
            <Text style={[styles.seatText, isLowSeat && styles.seatTextLow]}>
              Còn {trip.availableSeats} ghế
            </Text>
          </View>
          <Text style={styles.priceText}>
            {formatPrice(trip.price)}<Text style={styles.perSeat}>/ghế</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.selectBtn} onPress={onPress} activeOpacity={0.85}>
          <Text style={styles.selectBtnText}>Chọn ghế</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── SCREEN ────────────────────────────────────────────────────────────────────
export default function SearchResultsScreen() {
  const { from, to, date, time, sortBy, setSortBy, trips, handleSelectTrip, goBack } = useSearchResults();

  const SORT_OPTIONS = [
    { key: 'time', label: 'Giờ đi', icon: 'time-outline' as const },
    { key: 'price', label: 'Giá', icon: 'pricetag-outline' as const },
    { key: 'rating', label: 'Đánh giá', icon: 'star-outline' as const },
  ] as const;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerRoute} numberOfLines={1}>{from} → {to}</Text>
          <Text style={styles.headerMeta}>
            {date ? formatDate(date) : 'Hôm nay'}
            {time ? ` · ${time}` : ''} · {trips.length} chuyến
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Sort Bar */}
      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>Sắp xếp:</Text>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortChip, sortBy === opt.key && styles.sortChipActive]}
            onPress={() => setSortBy(opt.key as SortType)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={opt.icon}
              size={12}
              color={sortBy === opt.key ? COLORS.white : COLORS.textSecondary}
            />
            <Text style={[styles.sortChipText, sortBy === opt.key && styles.sortChipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="bus-outline" size={40} color={COLORS.textDisabled} />
            </View>
            <Text style={styles.emptyTitle}>Không tìm thấy chuyến xe</Text>
            <Text style={styles.emptySubtitle}>
              Không có chuyến nào phù hợp cho tuyến {from} → {to}
              {time ? ` từ ${time}` : ''}
            </Text>
            <TouchableOpacity style={styles.backHomeBtn} onPress={goBack}>
              <Text style={styles.backHomeBtnText}>← Thay đổi tìm kiếm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          trips.map((trip) => (
            <TripCard key={trip._id || trip.id} trip={trip} onPress={() => handleSelectTrip(trip)} />
          ))
        )}
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

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerRoute: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.white },
  headerMeta: { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  // Sort
  sortBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
    gap: SPACING.sm,
  },
  sortLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: FONT_WEIGHT.medium },
  sortChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.sm + 2, paddingVertical: 5,
    borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sortChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  sortChipText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: FONT_WEIGHT.medium },
  sortChipTextActive: { color: COLORS.white, fontWeight: FONT_WEIGHT.bold },

  // List
  listContent: { padding: SPACING.md, gap: SPACING.md },

  // Card
  card: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.md, ...SHADOWS.medium,
  },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SPACING.md,
  },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  companyAvatar: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  companyName: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
  busType: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 1 },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: '#FDE68A',
  },
  ratingText: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold, color: '#92400E' },

  // Route visual
  routeVisual: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  routeEndpoint: { alignItems: 'flex-start', minWidth: 60 },
  timeText: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.textPrimary },
  dateText: { fontSize: 10, color: COLORS.textTertiary, marginTop: -2, marginBottom: 2 },
  cityText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, maxWidth: 60 },
  routeMiddle: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.sm },
  durationBadge: {
    fontSize: FONT_SIZE.xs, color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: RADIUS.full, marginBottom: 6,
  },
  routeLine: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  routeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary },
  routeBar: { flex: 1, height: 1.5, backgroundColor: COLORS.border },
  busOnLine: {
    width: 24, height: 24, borderRadius: RADIUS.xs,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.xs,
  },

  // Amenities
  amenityRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
    marginBottom: SPACING.md,
  },
  amenityPill: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  amenityText: { fontSize: FONT_SIZE.xs, color: COLORS.success, fontWeight: FONT_WEIGHT.medium },
  amenityMore: { fontSize: FONT_SIZE.xs, color: COLORS.textTertiary, fontWeight: FONT_WEIGHT.medium, alignSelf: 'center' },

  // Footer
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.borderLight,
  },
  seatBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.full, alignSelf: 'flex-start', marginBottom: 6,
  },
  seatBadgeLow: { backgroundColor: COLORS.accentLight },
  seatText: { fontSize: FONT_SIZE.xs, color: COLORS.success, fontWeight: FONT_WEIGHT.semibold },
  seatTextLow: { color: COLORS.warning },
  priceText: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.primary },
  perSeat: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular, color: COLORS.textSecondary },
  selectBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md + 4, paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg, ...SHADOWS.colored,
  },
  selectBtnText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: COLORS.white },

  // Empty state
  emptyState: { alignItems: 'center', paddingTop: 80, gap: SPACING.sm },
  emptyIconBox: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm,
  },
  emptyTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm, color: COLORS.textSecondary,
    textAlign: 'center', paddingHorizontal: SPACING.xl, lineHeight: 20,
  },
  backHomeBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.primaryMid,
  },
  backHomeBtnText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.primary },
});
