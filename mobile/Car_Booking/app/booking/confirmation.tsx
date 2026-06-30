/**
 * UC05 (tiếp) - Màn hình Xác nhận đặt vé thành công
 *
 * Hiển thị thông báo thành công và tóm tắt thông tin vé sau khi thanh toán.
 * LUỒNG: payment → confirmation → (tabs)/tickets
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
import { formatPrice, formatDate } from '../data/mockData';
import { useConfirmation } from '../../hooks/useConfirmation';

// ─── COMPONENT CON: DetailItem ────────────────────────────────────────────────
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={detailStyles.item}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  item: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
});

// ─── MÀN HÌNH CHÍNH ──────────────────────────────────────────────────────────
export default function ConfirmationScreen() {
  const {
    trip,
    seats,
    price,
    ticketCode,
    passengerName,
    passengerPhone,
    handleGoToTickets,
    handleGoHome,
  } = useConfirmation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── BIỂU TƯỢNG THÀNH CÔNG ── */}
        <View style={styles.successHeader}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>Đặt vé thành công! 🎉</Text>
          <Text style={styles.successSubtitle}>
            Cảm ơn bạn đã tin dùng Xe Vân Anh. Vé đã được gửi về email của bạn.
          </Text>

          {/* Mã vé nổi bật */}
          <View style={styles.ticketCodeBox}>
            <Text style={styles.ticketCodeLabel}>Mã vé của bạn</Text>
            <Text style={styles.ticketCode}>{ticketCode}</Text>
          </View>
        </View>

        {/* ── CHI TIẾT VÉ ── */}
        {trip && (
          <View style={styles.ticketCard}>
            <View style={styles.ticketTop}>
              <Text style={styles.ticketCardTitle}>Chi tiết vé</Text>
            </View>

            {/* Thông tin tuyến đường */}
            <View style={styles.routeSection}>
              <View style={styles.routePoint}>
                <Text style={styles.routeTime}>{trip.departureTime}</Text>
                <Text style={styles.routeCity}>{trip.from}</Text>
              </View>
              <View style={styles.routeArrow}>
                <View style={styles.routeLine} />
                <Ionicons name="bus" size={24} color={COLORS.primary} />
                <View style={styles.routeLine} />
              </View>
              <View style={styles.routePoint}>
                <Text style={styles.routeTime}>{trip.arrivalTime}</Text>
                <Text style={styles.routeCity}>{trip.to}</Text>
              </View>
            </View>

            {/* Đường ngăn cách */}
            <View style={styles.ticketDivider}>
              <View style={styles.ticketCircle} />
              <View style={styles.ticketDotLine} />
              <View style={[styles.ticketCircle, styles.ticketCircleRight]} />
            </View>

            {/* Thông tin chi tiết */}
            <View style={styles.detailGrid}>
              <DetailItem label="Ngày đi" value={formatDate(trip.date)} />
              <DetailItem label="Loại xe" value={trip.busType} />
              <DetailItem label="Ghế" value={seats.join(', ')} />
              <DetailItem label="Số xe" value={trip.busNumber} />
              <DetailItem label="Hành khách" value={passengerName} />
              <DetailItem label="Điện thoại" value={passengerPhone} />
            </View>

            {/* Tổng tiền */}
            <View style={styles.priceSection}>
              <Text style={styles.priceSectionLabel}>Đã thanh toán</Text>
              <Text style={styles.priceSectionValue}>{formatPrice(price)}</Text>
            </View>
          </View>
        )}

        {/* ── CÁC NÚT HÀNH ĐỘNG ── */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleGoToTickets}
          >
            <Ionicons name="ticket-outline" size={20} color={COLORS.white} />
            <Text style={styles.primaryBtnText}>Xem danh sách vé</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleGoHome}
          >
            <Text style={styles.secondaryBtnText}>Quay về trang chủ</Text>
          </TouchableOpacity>
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
  successHeader: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
    ...SHADOWS.small,
  },
  successIconContainer: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  successSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.md,
  },
  ticketCodeBox: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  ticketCodeLabel: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
  },
  ticketCode: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.primary,
    marginTop: 2,
    letterSpacing: 1,
  },
  ticketCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    borderRadius: RADIUS.xl,
    ...SHADOWS.medium,
  },
  ticketTop: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  ticketCardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  routeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  routePoint: {
    alignItems: 'center',
    width: '35%',
  },
  routeTime: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.textPrimary,
  },
  routeCity: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  routeArrow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.border,
  },
  ticketDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    overflow: 'hidden',
  },
  ticketCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    marginLeft: -10,
  },
  ticketCircleRight: {
    marginLeft: 0,
    marginRight: -10,
  },
  ticketDotLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 1,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.lg,
    paddingBottom: 0,
  },
  priceSection: {
    backgroundColor: COLORS.surfaceSecondary,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceSectionLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  priceSectionValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.primary,
  },
  actions: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  primaryBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  secondaryBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
});
