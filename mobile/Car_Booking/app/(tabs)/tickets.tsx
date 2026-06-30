/**
 * UC06 - Màn hình Lịch sử đặt vé
 *
 * Hiển thị danh sách tất cả vé đã đặt, có thể lọc theo trạng thái.
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
  canCancelTicket,
  type Ticket,
} from '../data/mockData';
import { useTicketHistory, FILTER_TABS, type FilterTab } from '../../hooks/useTicketHistory';

// ─── COMPONENT CON: TicketCard ────────────────────────────────────────────────
function TicketCard({
  ticket,
  onPress,
}: {
  ticket: Ticket;
  onPress: () => void;
}) {
  const statusColor = getStatusColor(ticket.status);
  const statusText = getStatusText(ticket.status);
  const cancellable = canCancelTicket(ticket);

  return (
    <TouchableOpacity style={styles.ticketCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.ticketAccent, { backgroundColor: statusColor }]} />

      <View style={styles.ticketContent}>
        {/* Dòng 1: Tuyến đường + Badge trạng thái */}
        <View style={styles.ticketHeader}>
          <View style={styles.routeInfo}>
            <Text style={styles.routeText}>{ticket.from}</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.textSecondary} />
            <Text style={styles.routeText}>{ticket.to}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
        </View>

        {/* Dòng 2: Thông tin chuyến */}
        <View style={styles.ticketMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{formatDate(ticket.date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{ticket.departureTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="ticket-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>Ghế: {ticket.seats.join(', ')}</Text>
          </View>
        </View>

        {/* Dòng 3: Giá + Icon cảnh báo hủy được */}
        <View style={styles.ticketFooter}>
          <Text style={styles.ticketPrice}>{formatPrice(ticket.totalPrice)}</Text>
          {cancellable && (
            <View style={styles.cancellableTag}>
              <Ionicons name="information-circle-outline" size={12} color={COLORS.warning} />
              <Text style={styles.cancellableText}>Có thể hủy</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── MÀN HÌNH CHÍNH ──────────────────────────────────────────────────────────
export default function TicketsScreen() {
  const {
    activeFilter,
    setActiveFilter,
    filteredTickets,
    totalTickets,
    handleTicketPress,
    handleGoHome,
  } = useTicketHistory();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vé của tôi</Text>
        <Text style={styles.headerSubtitle}>{totalTickets} vé đã đặt</Text>
      </View>

      {/* ── TAB LỌC (cuộn ngang) ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              activeFilter === tab.key && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(tab.key)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab.key && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── DANH SÁCH VÉ ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {filteredTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color={COLORS.textDisabled} />
            <Text style={styles.emptyTitle}>Không có vé nào</Text>
            <Text style={styles.emptySubtitle}>
              Bạn chưa có vé nào trong danh mục này
            </Text>
            <TouchableOpacity
              style={styles.bookNowBtn}
              onPress={handleGoHome}
            >
              <Text style={styles.bookNowText}>Đặt vé ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPress={() => handleTicketPress(ticket.id)}
            />
          ))
        )}
        <View style={{ height: 20 }} />
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
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterScroll: {
    maxHeight: 50,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterContainer: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  filterTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  filterTabTextActive: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  listContainer: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  ticketAccent: {
    width: 6,
    height: '100%',
  },
  ticketContent: {
    flex: 1,
    padding: SPACING.md,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  routeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
  },
  ticketMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  ticketPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  cancellableTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  cancellableText: {
    fontSize: 10,
    color: COLORS.warning,
    fontWeight: FONT_WEIGHT.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: SPACING.sm,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  bookNowBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    ...SHADOWS.small,
  },
  bookNowText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
});
