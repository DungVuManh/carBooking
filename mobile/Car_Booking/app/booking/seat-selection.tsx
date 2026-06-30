/**
 * UC04 - Màn hình Chọn ghế
 *
 * Layout mới: Đầu xe bên TRÁI, ghế trải dài ngang sang PHẢI.
 * Tầng dưới và tầng trên được GỘP CHUNG, hiển thị theo cột (column).
 * Người dùng kéo ngang để xem toàn bộ sơ đồ.
 *
 * CẤU TRÚC LAYOUT (nhìn từ trên xuống):
 *
 *  ┌──────┐  [COL A] [COL B] [COL C] [COL D] [COL E] [COL F] [COL G] [COL H]
 *  │ ĐẦU  │   A1      B1      C1      D1      E1      F1      G1      H1
 *  │  XE  │  ─── lối đi ────────────────────────────────────────────────────
 *  └──────┘   A2      B2      C2      D2      E2      F2      G2      H2
 *             A3      B3      C3      D3      E3      F3      G3      H3
 *            ─── lối đi ──────────────────────────────────────────────────
 *             A4      B4      C4      D4      E4      F4      G4      H4
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
import { formatPrice, type Seat } from '../data/mockData';
import { useSeatSelection } from '../../hooks/useSeatSelection';

// ─── KÍCH THƯỚC GHẾ ──────────────────────────────────────────────────────────
const SEAT_SIZE = 46;
const SEAT_GAP = 6;

// ─── COMPONENT CON: SeatCell ─────────────────────────────────────────────────
function SeatCell({
  seat,
  onPress,
}: {
  seat: Seat;
  onPress: (seat: Seat) => void;
}) {
  const isBooked = seat.status === 'booked';
  const isSelected = seat.status === 'selected';

  return (
    <TouchableOpacity
      style={[
        seatStyles.cell,
        isBooked && seatStyles.booked,
        isSelected && seatStyles.selected,
        !isBooked && !isSelected && seatStyles.available,
      ]}
      onPress={() => !isBooked && onPress(seat)}
      disabled={isBooked}
      activeOpacity={0.7}
    >
      <Text
        style={[
          seatStyles.label,
          isSelected && seatStyles.labelSelected,
          isBooked && seatStyles.labelBooked,
        ]}
      >
        {seat.id}
      </Text>
    </TouchableOpacity>
  );
}

const seatStyles = StyleSheet.create({
  cell: {
    width: SEAT_SIZE,
    height: SEAT_SIZE,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SEAT_GAP,
  },
  available: {
    backgroundColor: COLORS.seatAvailable,
    borderWidth: 1.5,
    borderColor: COLORS.seatBorder,
  },
  selected: {
    backgroundColor: COLORS.seatSelected,
  },
  booked: {
    backgroundColor: COLORS.seatBooked,
    borderWidth: 1,
    borderColor: COLORS.seatBookedBorder,
  },
  label: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  labelSelected: { color: COLORS.white },
  labelBooked: { color: COLORS.textDisabled },
});

// ─── COMPONENT CON: SeatColumn ───────────────────────────────────────────────
function SeatColumn({
  rowLabel,
  seats,
  onSeatPress,
}: {
  rowLabel: string;
  seats: Seat[];
  onSeatPress: (seat: Seat) => void;
}) {
  const sorted = [...seats].sort((a, b) => a.col - b.col);
  const topSeats = sorted.filter((s) => s.col <= 2);
  const bottomSeats = sorted.filter((s) => s.col > 2);

  return (
    <View style={colStyles.column}>
      <View style={colStyles.rowLabelBox}>
        <Text style={colStyles.rowLabelText}>{rowLabel}</Text>
      </View>

      {topSeats.map((seat) => (
        <SeatCell key={seat.id} seat={seat} onPress={onSeatPress} />
      ))}

      <View style={colStyles.aisle} />

      {bottomSeats.map((seat) => (
        <SeatCell key={seat.id} seat={seat} onPress={onSeatPress} />
      ))}
    </View>
  );
}

const colStyles = StyleSheet.create({
  column: {
    alignItems: 'center',
    marginRight: SEAT_GAP,
  },
  rowLabelBox: {
    width: SEAT_SIZE,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowLabelText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
  },
  aisle: {
    width: SEAT_SIZE,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SEAT_GAP,
  },
});

// ─── MÀN HÌNH CHÍNH ──────────────────────────────────────────────────────────
export default function SeatSelectionScreen() {
  // Lấy toàn bộ logic, state từ Custom Hook
  const {
    trip,
    selectedSeats,
    totalPrice,
    columnGroups,
    handleSeatPress,
    handleContinue,
    goBack,
  } = useSeatSelection();

  if (!trip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy chuyến xe!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Chọn ghế</Text>
          <Text style={styles.headerSubText}>{trip.from} → {trip.to} · {trip.departureTime}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* ── CHÚ THÍCH MÀU SẮC ── */}
      <View style={styles.legend}>
        <LegendItem color={COLORS.seatAvailable} border={COLORS.seatBorder} label="Trống" />
        <LegendItem color={COLORS.seatSelected} label="Đang chọn" />
        <LegendItem color={COLORS.seatBooked} border={COLORS.seatBookedBorder} label="Đã đặt" />
      </View>

      {/* ── SƠ ĐỒ XE CUỘN NGANG ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Căn giữa sơ đồ xe */}
        <View style={styles.mapCenterContainer}>
          <View style={styles.mapWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.horizontalContent}
            >
              {/* ── ĐẦU XE (bên trái) ── */}
              <View style={styles.busHeadBlock}>
                <View style={styles.busHeadIcon}>
                  <Ionicons name="bus" size={28} color={COLORS.white} />
                </View>
                <View style={styles.busHeadLabels}>
                  <Text style={styles.busHeadLabelText}>Cửa sổ</Text>
                  <View style={styles.busHeadLabelSpacer} />
                  <Text style={styles.busHeadLabelText}>Lối đi</Text>
                  <View style={styles.busHeadLabelSpacer} />
                  <Text style={styles.busHeadLabelText}>Cửa sổ</Text>
                </View>
              </View>

              {/* ── CÁC CỘT GHẾ ── */}
              {Object.entries(columnGroups).map(([row, rowSeats]) => (
                <SeatColumn
                  key={row}
                  rowLabel={row}
                  seats={rowSeats}
                  onSeatPress={handleSeatPress}
                />
              ))}

              {/* ── ĐUÔI XE (bên phải) ── */}
              <View style={styles.busTailBlock}>
                <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textTertiary} />
              </View>
            </ScrollView>
          </View>
        </View>

        {/* ── THÔNG TIN CHUYẾN XE ── */}
        <View style={styles.tripInfoCard}>
          <View style={styles.tripInfoRow}>
            <Ionicons name="bus-outline" size={16} color={COLORS.primary} />
            <Text style={styles.tripInfoText}>{trip.busType} · {trip.busNumber}</Text>
          </View>
          <View style={styles.tripInfoRow}>
            <Ionicons name="people-outline" size={16} color={COLORS.primary} />
            <Text style={styles.tripInfoText}>
              Còn {trip.availableSeats}/{trip.totalSeats} ghế trống
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Ghế đã chọn</Text>
            <Text style={styles.summarySeats}>
              {selectedSeats.length > 0
                ? selectedSeats.map((s) => s.id).join(', ')
                : '—  Chưa chọn'}
            </Text>
          </View>
          <Text style={styles.summaryPrice}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.continueBtn, selectedSeats.length === 0 && styles.continueBtnDisabled]}
          onPress={handleContinue}
        >
          <Text style={styles.continueBtnText}>Tiếp tục thanh toán</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── LEGEND ITEM ─────────────────────────────────────────────────────────────
function LegendItem({
  color,
  border,
  label,
}: {
  color: string;
  border?: string;
  label: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          { backgroundColor: color },
          border ? { borderWidth: 1.5, borderColor: border } : {},
        ]}
      />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: FONT_SIZE.lg, color: COLORS.error },
  scrollContainer: {
    paddingBottom: 160,
  },

  // ── HEADER ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, alignItems: 'center' },
  headerText: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.white },
  headerSubText: { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // ── CHÚ THÍCH ──
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 20, height: 20, borderRadius: RADIUS.xs },
  legendText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },

  // ── CONTAINER TRUNG TÂM (Căn giữa sơ đồ) ──
  mapCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  // ── KHU VỰC SƠ ĐỒ ──
  mapWrapper: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    borderRadius: RADIUS.xl,
    ...SHADOWS.medium,
    overflow: 'hidden',
    alignSelf: 'center',
    maxWidth: '95%',
  },
  horizontalContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    // Đảm bảo có thể căn giữa nếu nội dung nhỏ hơn màn hình rộng
    justifyContent: 'center',
  },

  // ── ĐẦU XE ──
  busHeadBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  busHeadIcon: {
    width: 52,
    height: 24 + 4 * (SEAT_SIZE + SEAT_GAP) + 18,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  busHeadLabels: {
    width: 36,
    height: 24 + 4 * (SEAT_SIZE + SEAT_GAP) + 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderTopRightRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
    paddingVertical: 8,
    gap: 4,
  },
  busHeadLabelText: {
    fontSize: 8,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
    transform: [{ rotate: '90deg' }],
  },
  busHeadLabelSpacer: {
    flex: 1,
  },

  // ── ĐUÔI XE ──
  busTailBlock: {
    width: 20,
    height: 24 + 4 * (SEAT_SIZE + SEAT_GAP) + 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  // ── THÔNG TIN CHUYẾN ──
  tripInfoCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  tripInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tripInfoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  // ── BOTTOM BAR ──
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.large,
    gap: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  summarySeats: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    maxWidth: 200,
  },
  summaryPrice: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.primary,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: 8,
  },
  continueBtnDisabled: { backgroundColor: COLORS.textDisabled },
  continueBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
});
