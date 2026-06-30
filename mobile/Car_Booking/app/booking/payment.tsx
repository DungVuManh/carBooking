/**
 * UC05 - Màn hình Đặt vé & Thanh toán
 *
 * Người dùng nhập thông tin hành khách và thanh toán bằng QR.
 * LUỒNG: seat-selection → payment → confirmation
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  ActivityIndicator,
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
import { usePayment } from '../../hooks/usePayment';

// ─── COMPONENT CON: InputField ────────────────────────────────────────────────
function InputField({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
}) {
  return (
    <View style={inputStyles.wrapper}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={inputStyles.inputRow}>
        <Ionicons name={icon} size={18} color={COLORS.primary} style={inputStyles.icon} />
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: { marginBottom: SPACING.md },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  icon: { marginRight: SPACING.sm },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
});

// ─── MÀN HÌNH CHÍNH ──────────────────────────────────────────────────────────
export default function PaymentScreen() {
  // Lấy dữ liệu và sự kiện từ hook
  const {
    trip,
    seats,
    price,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    step,
    handleShowQR,
    handleConfirmPayment,
    handleBackPress,
  } = usePayment();

  if (!trip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.error }}>Không tìm thấy chuyến xe!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {step === 'form' ? 'Thông tin đặt vé' : 'Thanh toán QR'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── BƯỚC 1: FORM NHẬP THÔNG TIN ── */}
      {step === 'form' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Thông tin chuyến xe */}
          <View style={styles.tripSummaryCard}>
            <Text style={styles.cardTitle}>Thông tin chuyến xe</Text>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>Tuyến đường</Text>
              <Text style={styles.tripValue}>{trip.from} → {trip.to}</Text>
            </View>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>Ngày đi</Text>
              <Text style={styles.tripValue}>{formatDate(trip.date)}</Text>
            </View>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>Giờ khởi hành</Text>
              <Text style={styles.tripValue}>{trip.departureTime}</Text>
            </View>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>Ghế đã chọn</Text>
              <Text style={styles.tripValue}>{seats.join(', ')}</Text>
            </View>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>Nhà xe</Text>
              <Text style={styles.tripValue}>{trip.company}</Text>
            </View>
          </View>

          {/* Form thông tin hành khách */}
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Thông tin hành khách</Text>
            <InputField
              label="Họ và tên"
              value={name}
              onChangeText={setName}
              icon="person-outline"
              placeholder="Nhập họ và tên"
            />
            <InputField
              label="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              icon="call-outline"
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
            <InputField
              label="Email (nhận vé)"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              placeholder="Nhập địa chỉ email"
              keyboardType="email-address"
            />
          </View>

          {/* Tổng tiền và nút xác nhận */}
          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Giá vé ({seats.length} ghế)</Text>
              <Text style={styles.totalValue}>{formatPrice(price)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Tổng cộng</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(price)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleShowQR}>
            <Ionicons name="qr-code-outline" size={20} color={COLORS.white} />
            <Text style={styles.primaryBtnText}>Xem QR thanh toán</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ── BƯỚC 2: QR THANH TOÁN ── */}
      {(step === 'qr' || step === 'loading') && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.qrContainer}>
          <Text style={styles.qrTitle}>Quét mã QR để thanh toán</Text>
          <Text style={styles.qrSubtitle}>
            Mở ứng dụng ngân hàng và quét mã bên dưới
          </Text>

          {/* Khung QR giả lập */}
          <View style={styles.qrBox}>
            <View style={styles.qrImagePlaceholder}>
              <Text style={styles.qrPlaceholderText}>QR CODE</Text>
              <View style={styles.qrGrid}>
                {Array.from({ length: 49 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.qrCell,
                      (i % 3 === 0 || i % 7 === 0 || i % 11 === 0) && styles.qrCellFilled,
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.qrAmount}>{formatPrice(price)}</Text>
            <Text style={styles.qrBankInfo}>Xe Vân Anh - STK: 9999 8888 7777</Text>
            <Text style={styles.qrNote}>Nội dung CK: {seats.join('')} - {name}</Text>
          </View>

          {/* Hướng dẫn thanh toán */}
          <View style={styles.instructionCard}>
            {['Mở app ngân hàng hoặc ví điện tử', 'Chọn "Quét QR" hoặc "Chuyển tiền"', 'Quét mã QR bên trên', 'Kiểm tra thông tin và xác nhận'].map(
              (stepText, i) => (
                <View key={i} style={styles.instructionItem}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepNumber}>{i + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{stepText}</Text>
                </View>
              )
            )}
          </View>

          {/* Nút xác nhận đã thanh toán */}
          <TouchableOpacity
            style={[styles.primaryBtn, step === 'loading' && styles.btnLoading]}
            onPress={handleConfirmPayment}
            disabled={step === 'loading'}
          >
            {step === 'loading' ? (
              <>
                <ActivityIndicator color={COLORS.white} size="small" />
                <Text style={styles.primaryBtnText}>Đang xử lý...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
                <Text style={styles.primaryBtnText}>Tôi đã thanh toán xong</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  tripSummaryCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },
  tripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  tripLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  tripValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
  },
  formCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  totalCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  totalLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  totalValue: { fontSize: FONT_SIZE.sm, color: COLORS.textPrimary },
  grandTotalLabel: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
  grandTotalValue: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: 8,
  },
  primaryBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  btnLoading: { backgroundColor: COLORS.textSecondary },
  qrContainer: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  qrTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  qrSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  qrBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    width: '100%',
    ...SHADOWS.medium,
    marginBottom: SPACING.md,
  },
  qrImagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: 8,
  },
  qrPlaceholderText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginBottom: 8,
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 140,
    gap: 2,
  },
  qrCell: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  qrCellFilled: {
    backgroundColor: COLORS.black,
  },
  qrAmount: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  qrBankInfo: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  qrNote: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
  },
  instructionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: COLORS.white },
  instructionText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textPrimary },
});
