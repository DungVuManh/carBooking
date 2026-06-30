/**
 * UC07 - Màn hình Chi tiết vé & Hủy vé
 *
 * Hiển thị đầy đủ thông tin 1 vé. Nếu còn trong 12 giờ kể từ lúc đặt,
 * người dùng có thể hủy vé.
 * LUỒNG: tickets (list) → ticket/[id] (chi tiết)
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
import {
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusText,
} from '../data/mockData';
import { useTicketDetail } from '../../hooks/useTicketDetail';

// ─── COMPONENT CON: InfoRow ───────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={infoRowStyles.row}>
      <View style={infoRowStyles.iconBox}>
        <Ionicons name={icon} size={16} color={COLORS.primary} />
      </View>
      <Text style={infoRowStyles.label}>{label}</Text>
      <Text style={infoRowStyles.value}>{value}</Text>
    </View>
  );
}

const infoRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: SPACING.sm,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    textAlign: 'right',
    maxWidth: '60%',
  },
});

// ─── MÀN HÌNH CHÍNH ──────────────────────────────────────────────────────────
export default function TicketDetailScreen() {
  const { ticketData, cancellable, handleCancelTicket, goBack } = useTicketDetail();

  // Nếu không tìm thấy vé
  if (!ticketData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết vé</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>Không tìm thấy vé!</Text>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.errorBack}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(ticketData.status);
  const statusText = getStatusText(ticketData.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết vé</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── BADGE TRẠNG THÁI LỚN ── */}
        <View style={styles.statusBanner}>
          <View style={[styles.statusIconCircle, { backgroundColor: statusColor + '20' }]}>
            <Ionicons
              name={
                ticketData.status === 'confirmed' ? 'checkmark-circle' :
                ticketData.status === 'completed' ? 'checkmark-done-circle' :
                ticketData.status === 'cancelled' ? 'close-circle' :
                'time'
              }
              size={40}
              color={statusColor}
            />
          </View>
          <Text style={[styles.statusBannerText, { color: statusColor }]}>
            {statusText}
          </Text>
          <Text style={styles.ticketIdText}>Mã vé: {ticketData.id.toUpperCase()}</Text>
        </View>

        {/* ── THÔNG TIN CHUYẾN ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin chuyến xe</Text>

          {/* Tuyến đường nổi bật */}
          <View style={styles.routeRow}>
            <View style={styles.routeEndpoint}>
              <Text style={styles.routeTime}>{ticketData.departureTime}</Text>
              <Text style={styles.routeCity}>{ticketData.from}</Text>
            </View>
            <View style={styles.routeMiddle}>
              <View style={styles.routeDot} />
              <View style={styles.routeLine} />
              <Ionicons name="bus" size={20} color={COLORS.primary} />
              <View style={styles.routeLine} />
              <View style={styles.routeDot} />
            </View>
            <View style={[styles.routeEndpoint, { alignItems: 'flex-end' }]}>
              <Text style={styles.routeTime}>{ticketData.arrivalTime}</Text>
              <Text style={styles.routeCity}>{ticketData.to}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <InfoRow icon="calendar-outline" label="Ngày đi" value={formatDate(ticketData.date)} />
          <InfoRow icon="bus-outline" label="Nhà xe" value={ticketData.company} />
          <InfoRow icon="car-outline" label="Loại xe" value={ticketData.busType} />
          <InfoRow icon="barcode-outline" label="Số xe" value={ticketData.busNumber} />
          <InfoRow icon="ticket-outline" label="Ghế" value={ticketData.seats.join(', ')} />
        </View>

        {/* ── THÔNG TIN HÀNH KHÁCH ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin hành khách</Text>
          <InfoRow icon="person-outline" label="Họ tên" value={ticketData.passengerName} />
          <InfoRow icon="call-outline" label="Điện thoại" value={ticketData.passengerPhone} />
        </View>

        {/* ── THÔNG TIN THANH TOÁN ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thanh toán</Text>
          <InfoRow
            icon="qr-code-outline"
            label="Phương thức"
            value={ticketData.paymentMethod === 'qr' ? 'QR Code' : 'Tiền mặt'}
          />
          <InfoRow
            icon="time-outline"
            label="Ngày đặt"
            value={formatDate(ticketData.bookedAt)}
          />
          <View style={styles.totalPriceRow}>
            <Text style={styles.totalPriceLabel}>Tổng tiền</Text>
            <Text style={styles.totalPriceValue}>{formatPrice(ticketData.totalPrice)}</Text>
          </View>
        </View>

        {/* ── NÚT HỦY VÉ (UC07) ── */}
        {cancellable && (
          <View style={styles.cancelSection}>
            <View style={styles.warningBox}>
              <Ionicons name="information-circle" size={18} color={COLORS.warning} />
              <Text style={styles.warningText}>
                Bạn có thể hủy vé trong vòng 12 giờ kể từ khi đặt. Sau thời gian này, vé sẽ không thể hủy.
              </Text>
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelTicket}>
              <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
              <Text style={styles.cancelBtnText}>Hủy vé này</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Thông báo khi vé đã hủy */}
        {ticketData.status === 'cancelled' && (
          <View style={styles.cancelledNotice}>
            <Ionicons name="close-circle" size={20} color={COLORS.error} />
            <Text style={styles.cancelledNoticeText}>Vé này đã bị hủy</Text>
          </View>
        )}

        {/* Thông báo khi không còn có thể hủy */}
        {!cancellable && ticketData.status !== 'cancelled' && ticketData.status !== 'completed' && (
          <View style={styles.expiredNotice}>
            <Ionicons name="lock-closed-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.expiredNoticeText}>
              Đã quá 12 giờ, vé không thể hủy
            </Text>
          </View>
        )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  statusBanner: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statusBannerText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.extrabold,
    marginBottom: 4,
  },
  ticketIdText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  routeEndpoint: { flex: 2, alignItems: 'flex-start' },
  routeTime: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.textPrimary },
  routeCity: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  routeMiddle: { flex: 3, flexDirection: 'row', alignItems: 'center' },
  routeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  routeLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  totalPriceLabel: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: FONT_WEIGHT.semibold },
  totalPriceValue: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.primary },
  cancelSection: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  warningBox: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.warningLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.warning,
    lineHeight: 20,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.error,
  },
  cancelledNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
  },
  cancelledNoticeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.error,
  },
  expiredNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: SPACING.md,
    padding: SPACING.sm,
  },
  expiredNoticeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.error,
  },
  errorBack: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
