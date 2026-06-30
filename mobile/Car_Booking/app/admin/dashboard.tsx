/**
 * AdminDashboardScreen - Màn hình Dashboard Quản trị viên (UC10 - UC16)
 *
 * Quản lý các chức năng:
 * - UC10: Đăng nhập Admin & Phân quyền (Đã cấu hình tại auth/login)
 * - UC11: Quản lý Tuyến đường (CRUD)
 * - UC12: Quản lý Chuyến xe (CRUD)
 * - UC13: Quản lý Đơn đặt vé & Xác nhận khách lên xe
 * - UC14: Thống kê doanh thu & báo cáo
 * - UC15: Phản hồi tin nhắn CSKH
 * - UC16: Nhận thông báo tin nhắn mới từ khách hàng
 */

import React, { useState, useEffect } from 'react';
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
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, SHADOWS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import {
  MOCK_ROUTES,
  MOCK_TRIPS,
  MOCK_TICKETS,
  MOCK_CHAT_MESSAGES,
  formatPrice,
  type Route,
  type Trip,
  type Ticket,
  type ChatMessage,
} from '../data/mockData';

const { width } = Dimensions.get('window');

type AdminTab = 'stats' | 'routes' | 'trips' | 'tickets' | 'chat';

export default function AdminDashboardScreen() {
  const router = useRouter();

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  
  // Data States
  const [routes, setRoutes] = useState<Route[]>([...MOCK_ROUTES]);
  const [trips, setTrips] = useState<Trip[]>([...MOCK_TRIPS]);
  const [tickets, setTickets] = useState<Ticket[]>([...MOCK_TICKETS]);
  const [chats, setChats] = useState<ChatMessage[]>([...MOCK_CHAT_MESSAGES]);

  // UI Modals
  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [tripModalVisible, setTripModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // Form Fields - Route
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [routeDistance, setRouteDistance] = useState('');
  const [routeDuration, setRouteDuration] = useState('');

  // Form Fields - Trip
  const [tripRouteId, setTripRouteId] = useState('');
  const [tripDepTime, setTripDepTime] = useState('');
  const [tripArrTime, setTripArrTime] = useState('');
  const [tripDate, setTripDate] = useState('2026-07-15');
  const [tripPrice, setTripPrice] = useState('');
  const [tripBusType, setTripBusType] = useState('Limousine 34 chỗ');
  const [tripBusNumber, setTripBusNumber] = useState('');
  const [tripCompany, setTripCompany] = useState('Xe Vân Anh');

  // Chat State
  const [replyText, setReplyText] = useState('');
  const [adminNotifications, setAdminNotifications] = useState<{ id: string; text: string }[]>([]);

  // ─── UC16: SIMULATE CLIENT INCOMING MESSAGE & NOTIFICATION ───────────────
  const simulateClientMessage = () => {
    const randomMsgs = [
      'Tôi muốn hỏi xe Hà Nội đi Thanh Hóa lúc 06:00 còn ghế không ạ?',
      'Cho hỏi xe biển số 29B-123.45 đã chạy chưa admin?',
      'Tôi muốn đổi vé chuyến xe hôm nay sang ngày mai có được không?',
      'CSKH tư vấn giúp tôi dòng xe Limousine với.',
    ];
    const content = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
    const newMsg: ChatMessage = {
      id: `msg_sim_${Date.now()}`,
      senderId: 'user',
      senderName: 'Khách hàng',
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Thêm vào danh sách chat
    MOCK_CHAT_MESSAGES.push(newMsg);
    setChats([...MOCK_CHAT_MESSAGES]);

    // Thêm thông báo UC16
    const newNotif = {
      id: `notif_${Date.now()}`,
      text: `Tin nhắn mới: "${content.substring(0, 30)}..."`,
    };
    setAdminNotifications((prev) => [newNotif, ...prev]);

    // Auto-remove notification banner after 5 seconds
    setTimeout(() => {
      setAdminNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, 5000);
  };

  // ─── UC11: CRUD ROUTES ─────────────────────────────────────────────────────
  const handleOpenAddRoute = () => {
    setEditingRoute(null);
    setRouteFrom('');
    setRouteTo('');
    setRouteDistance('');
    setRouteDuration('');
    setRouteModalVisible(true);
  };

  const handleOpenEditRoute = (route: Route) => {
    setEditingRoute(route);
    setRouteFrom(route.from);
    setRouteTo(route.to);
    setRouteDistance(route.distance);
    setRouteDuration(route.duration);
    setRouteModalVisible(true);
  };

  const handleSaveRoute = () => {
    if (!routeFrom || !routeTo || !routeDistance || !routeDuration) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin tuyến đường');
      return;
    }

    if (editingRoute) {
      // Edit
      const idx = MOCK_ROUTES.findIndex((r) => r.id === editingRoute.id);
      if (idx !== -1) {
        MOCK_ROUTES[idx] = {
          ...editingRoute,
          from: routeFrom,
          to: routeTo,
          distance: routeDistance,
          duration: routeDuration,
        };
      }
      Alert.alert('Thành công', 'Đã cập nhật tuyến đường');
    } else {
      // Add
      const newRoute: Route = {
        id: `r${Date.now()}`,
        from: routeFrom,
        to: routeTo,
        distance: routeDistance,
        duration: routeDuration,
      };
      MOCK_ROUTES.push(newRoute);
      Alert.alert('Thành công', 'Đã tạo tuyến đường mới');
    }

    setRoutes([...MOCK_ROUTES]);
    setRouteModalVisible(false);
  };

  const handleDeleteRoute = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa tuyến đường này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          const idx = MOCK_ROUTES.findIndex((r) => r.id === id);
          if (idx !== -1) {
            MOCK_ROUTES.splice(idx, 1);
            setRoutes([...MOCK_ROUTES]);
          }
        },
      },
    ]);
  };

  // ─── UC12: CRUD TRIPS ──────────────────────────────────────────────────────
  const handleOpenAddTrip = () => {
    setEditingTrip(null);
    setTripRouteId(routes[0]?.id || '');
    setTripDepTime('');
    setTripArrTime('');
    setTripPrice('');
    setTripBusNumber('');
    setTripBusType('Limousine 34 chỗ');
    setTripCompany('Xe Vân Anh');
    setTripModalVisible(true);
  };

  const handleOpenEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setTripRouteId(trip.routeId);
    setTripDepTime(trip.departureTime);
    setTripArrTime(trip.arrivalTime);
    setTripPrice(trip.price.toString());
    setTripBusNumber(trip.busNumber);
    setTripBusType(trip.busType);
    setTripCompany(trip.company);
    setTripModalVisible(true);
  };

  const handleSaveTrip = () => {
    if (!tripDepTime || !tripArrTime || !tripPrice || !tripBusNumber) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các trường thông tin');
      return;
    }

    const matchedRoute = routes.find((r) => r.id === tripRouteId);
    const fromLocation = matchedRoute ? matchedRoute.from : 'Hà Nội';
    const toLocation = matchedRoute ? matchedRoute.to : 'Thanh Hóa';

    const parsedPrice = parseInt(tripPrice, 10);

    if (editingTrip) {
      // Edit
      const idx = MOCK_TRIPS.findIndex((t) => t.id === editingTrip.id);
      if (idx !== -1) {
        MOCK_TRIPS[idx] = {
          ...editingTrip,
          routeId: tripRouteId,
          from: fromLocation,
          to: toLocation,
          departureTime: tripDepTime,
          arrivalTime: tripArrTime,
          price: parsedPrice,
          busNumber: tripBusNumber,
          busType: tripBusType,
          company: tripCompany,
        };
      }
      Alert.alert('Thành công', 'Đã cập nhật thông tin chuyến xe');
    } else {
      // Add
      const newTrip: Trip = {
        id: `trip_${Date.now()}`,
        routeId: tripRouteId,
        from: fromLocation,
        to: toLocation,
        departureTime: tripDepTime,
        arrivalTime: tripArrTime,
        date: tripDate,
        price: parsedPrice,
        busNumber: tripBusNumber,
        busType: tripBusType,
        company: tripCompany,
        availableSeats: 34,
        totalSeats: 34,
        amenities: ['WiFi', 'Điều hòa', 'USB sạc', 'Nước miễn phí'],
        rating: 5.0,
      };
      MOCK_TRIPS.push(newTrip);
      Alert.alert('Thành công', 'Đã thêm chuyến xe mới');
    }

    setTrips([...MOCK_TRIPS]);
    setTripModalVisible(false);
  };

  const handleDeleteTrip = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa chuyến xe này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          const idx = MOCK_TRIPS.findIndex((t) => t.id === id);
          if (idx !== -1) {
            MOCK_TRIPS.splice(idx, 1);
            setTrips([...MOCK_TRIPS]);
          }
        },
      },
    ]);
  };

  // ─── UC13: CONFIRM PASSENGER BOARDING ──────────────────────────────────────
  const handleConfirmBoarding = (ticketId: string) => {
    const idx = MOCK_TICKETS.findIndex((t) => t.id === ticketId);
    if (idx !== -1) {
      const currentStatus = MOCK_TICKETS[idx].status;
      const nextStatus = currentStatus === 'confirmed' ? 'completed' : 'confirmed';
      MOCK_TICKETS[idx].status = nextStatus;
      setTickets([...MOCK_TICKETS]);
      Alert.alert(
        'Thành công',
        nextStatus === 'completed'
          ? 'Đã xác nhận khách lên xe thành công!'
          : 'Đã hoàn tác trạng thái xác nhận khách lên xe.'
      );
    }
  };

  // ─── UC15: SEND CHAT REPLY ─────────────────────────────────────────────────
  const handleSendReply = () => {
    if (!replyText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_admin_${Date.now()}`,
      senderId: 'agent',
      senderName: 'Admin CSKH',
      content: replyText,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    MOCK_CHAT_MESSAGES.push(newMsg);
    setChats([...MOCK_CHAT_MESSAGES]);
    setReplyText('');
  };

  // ─── UC14: REVENUE STATISTICS CALCULATOR ──────────────────────────────────
  const calculateStats = () => {
    const totalSold = tickets.filter((t) => t.status !== 'cancelled').length;
    const totalRevenue = tickets
      .filter((t) => t.status === 'completed' || t.status === 'confirmed')
      .reduce((sum, t) => sum + t.totalPrice, 0);

    const pendingCount = tickets.filter((t) => t.status === 'pending').length;
    const cancelledCount = tickets.filter((t) => t.status === 'cancelled').length;

    return { totalSold, totalRevenue, pendingCount, cancelledCount };
  };

  const { totalSold, totalRevenue, pendingCount, cancelledCount } = calculateStats();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── BANNER THÔNG BÁO TIN NHẮN MỚI (UC16) ── */}
      {adminNotifications.length > 0 && (
        <View style={styles.notificationBanner}>
          <Ionicons name="notifications" size={20} color={COLORS.white} />
          <Text style={styles.notificationBannerText} numberOfLines={1}>
            {adminNotifications[0].text}
          </Text>
          <TouchableOpacity onPress={() => setActiveTab('chat')} style={styles.notificationBannerBtn}>
            <Text style={styles.notificationBannerBtnText}>Trả lời</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Hệ thống Quản trị</Text>
          <Text style={styles.headerSub}>Toàn Quang Bus Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/auth/login')}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* ── TABS SELECTOR ── */}
      <View style={styles.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {[
            { key: 'stats', label: 'Thống kê', icon: 'analytics-outline' },
            { key: 'routes', label: 'Tuyến đường', icon: 'map-outline' },
            { key: 'trips', label: 'Chuyến xe', icon: 'bus-outline' },
            { key: 'tickets', label: 'Đặt vé', icon: 'ticket-outline' },
            { key: 'chat', label: 'Hỗ trợ chat', icon: 'chatbubbles-outline' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.key as AdminTab)}
            >
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.key ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.tabButtonText, activeTab === tab.key && styles.tabButtonTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        {/* ── TAB CONTENT: THỐNG KÊ (UC14) ── */}
        {activeTab === 'stats' && (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Báo cáo doanh số</Text>
              <TouchableOpacity style={styles.simulateBtn} onPress={simulateClientMessage}>
                <Ionicons name="flash-outline" size={14} color={COLORS.primary} />
                <Text style={styles.simulateBtnText}>Simulate Client Msg</Text>
              </TouchableOpacity>
            </View>

            {/* Stat Cards */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
                <Text style={styles.statCardVal}>{formatPrice(totalRevenue)}</Text>
                <Text style={styles.statCardLbl}>Tổng doanh thu</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
                <Text style={styles.statCardVal}>{totalSold}</Text>
                <Text style={styles.statCardLbl}>Số vé đã bán</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: COLORS.warning }]}>
                <Text style={styles.statCardVal}>{pendingCount}</Text>
                <Text style={styles.statCardLbl}>Chờ thanh toán</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: COLORS.error }]}>
                <Text style={styles.statCardVal}>{cancelledCount}</Text>
                <Text style={styles.statCardLbl}>Đã hủy chuyến</Text>
              </View>
            </View>

            {/* Mock Charts */}
            <Text style={styles.subSectionTitle}>Doanh thu các tháng (VND)</Text>
            <View style={styles.chartContainer}>
              {[
                { label: 'Tháng 4', value: 8200000, height: 60 },
                { label: 'Tháng 5', value: 12500000, height: 90 },
                { label: 'Tháng 6', value: 18400000, height: 130 },
                { label: 'Tháng 7 (Mục tiêu)', value: totalRevenue, height: 110, highlight: true },
              ].map((item, idx) => (
                <View key={idx} style={styles.chartCol}>
                  <View style={styles.chartBarWrapper}>
                    <View
                      style={[
                        styles.chartBar,
                        { height: item.height },
                        item.highlight && { backgroundColor: COLORS.primary },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{item.label}</Text>
                  <Text style={styles.chartValText}>{formatPrice(item.value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── TAB CONTENT: TUYẾN ĐƯỜNG (UC11) ── */}
        {activeTab === 'routes' && (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Danh sách tuyến chạy</Text>
              <TouchableOpacity style={styles.addBtn} onPress={handleOpenAddRoute}>
                <Ionicons name="add" size={16} color={COLORS.white} />
                <Text style={styles.addBtnText}>Tạo tuyến</Text>
              </TouchableOpacity>
            </View>

            {routes.map((route) => (
              <View key={route.id} style={styles.dataCard}>
                <View style={styles.dataCardInfo}>
                  <Text style={styles.dataCardTitle}>
                    {route.from} → {route.to}
                  </Text>
                  <Text style={styles.dataCardSub}>
                    Khoảng cách: {route.distance} · Thời gian dự kiến: {route.duration}
                  </Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.editIconBtn} onPress={() => handleOpenEditRoute(route)}>
                    <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteIconBtn} onPress={() => handleDeleteRoute(route.id)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── TAB CONTENT: CHUYẾN XE (UC12) ── */}
        {activeTab === 'trips' && (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lịch trình chi tiết</Text>
              <TouchableOpacity style={styles.addBtn} onPress={handleOpenAddTrip}>
                <Ionicons name="add" size={16} color={COLORS.white} />
                <Text style={styles.addBtnText}>Thêm chuyến</Text>
              </TouchableOpacity>
            </View>

            {trips.map((trip) => (
              <View key={trip.id} style={styles.dataCard}>
                <View style={styles.dataCardInfo}>
                  <View style={styles.companyRow}>
                    <Text style={styles.companyNameText}>{trip.company}</Text>
                    <View style={styles.busPill}>
                      <Text style={styles.busPillText}>{trip.busNumber}</Text>
                    </View>
                  </View>
                  <Text style={styles.dataCardTitle}>
                    {trip.from} → {trip.to}
                  </Text>
                  <Text style={styles.tripTimeText}>
                    ⏰ Khởi hành: {trip.departureTime} (Đến: {trip.arrivalTime})
                  </Text>
                  <Text style={styles.tripPriceText}>
                    Giá vé: <Text style={styles.boldText}>{formatPrice(trip.price)}</Text> · Loại xe: {trip.busType}
                  </Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.editIconBtn} onPress={() => handleOpenEditTrip(trip)}>
                    <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteIconBtn} onPress={() => handleDeleteTrip(trip.id)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── TAB CONTENT: ĐƠN ĐẶT VÉ (UC13) ── */}
        {activeTab === 'tickets' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Đơn đặt vé & Xác nhận boarding</Text>
            {tickets.map((ticket) => (
              <View key={ticket.id} style={styles.dataCard}>
                <View style={styles.dataCardInfo}>
                  <View style={styles.ticketHeaderRow}>
                    <Text style={styles.ticketIdText}>Mã: {ticket.id}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        ticket.status === 'completed' && { backgroundColor: COLORS.successLight },
                        ticket.status === 'cancelled' && { backgroundColor: COLORS.errorLight },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          ticket.status === 'completed' && { color: COLORS.success },
                          ticket.status === 'cancelled' && { color: COLORS.error },
                        ]}
                      >
                        {ticket.status === 'completed'
                          ? 'Đã lên xe'
                          : ticket.status === 'confirmed'
                          ? 'Đã xác nhận'
                          : ticket.status === 'cancelled'
                          ? 'Đã hủy'
                          : 'Chờ thanh toán'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.dataCardTitle}>
                    {ticket.from} → {ticket.to}
                  </Text>
                  <Text style={styles.ticketDetailText}>
                    Khách đi: <Text style={styles.boldText}>{ticket.passengerName}</Text> ({ticket.passengerPhone})
                  </Text>
                  <Text style={styles.ticketDetailText}>
                    Ghế: {ticket.seats.join(', ')} · Tổng tiền: {formatPrice(ticket.totalPrice)}
                  </Text>
                  <Text style={styles.ticketDetailText}>
                    Xe: {ticket.company} ({ticket.busNumber})
                  </Text>
                </View>

                {/* Confirm Boarding Button */}
                {ticket.status !== 'cancelled' && (
                  <TouchableOpacity
                    style={[
                      styles.boardingBtn,
                      ticket.status === 'completed' && styles.boardingBtnActive,
                    ]}
                    onPress={() => handleConfirmBoarding(ticket.id)}
                  >
                    <Ionicons
                      name={ticket.status === 'completed' ? 'checkbox' : 'checkbox-outline'}
                      size={16}
                      color={COLORS.white}
                    />
                    <Text style={styles.boardingBtnText}>
                      {ticket.status === 'completed' ? 'Đã xác nhận lên xe' : 'Xác nhận lên xe'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── TAB CONTENT: HỖ TRỢ CHAT (UC15) ── */}
        {activeTab === 'chat' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Phản hồi tin nhắn</Text>
            <View style={styles.chatBox}>
              <View style={styles.chatHeader}>
                <Ionicons name="person-circle-outline" size={24} color={COLORS.primary} />
                <Text style={styles.chatHeaderName}>Khách hàng Nguyễn Văn An</Text>
              </View>
              <ScrollView style={styles.chatScroll} nestedScrollEnabled>
                {chats.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.chatBubble,
                      msg.senderId === 'agent' ? styles.chatBubbleAgent : styles.chatBubbleUser,
                    ]}
                  >
                    <Text style={styles.chatBubbleSender}>{msg.senderName}</Text>
                    <Text style={styles.chatBubbleContent}>{msg.content}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.chatInputRow}>
                <TextInput
                  style={styles.chatTextInput}
                  placeholder="Nhập nội dung phản hồi..."
                  placeholderTextColor={COLORS.textTertiary}
                  value={replyText}
                  onChangeText={setReplyText}
                />
                <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendReply}>
                  <Ionicons name="send" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── MODAL: ROUTE ADD/EDIT ── */}
      <Modal visible={routeModalVisible} animationType="slide" transparent onRequestClose={() => setRouteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRoute ? 'Sửa Tuyến đường' : 'Tạo Tuyến đường mới'}
              </Text>
              <TouchableOpacity onPress={() => setRouteModalVisible(false)}>
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Điểm đi</Text>
            <TextInput style={styles.modalInput} value={routeFrom} onChangeText={setRouteFrom} placeholder="VD: Hà Nội" />

            <Text style={styles.inputLabel}>Điểm đến</Text>
            <TextInput style={styles.modalInput} value={routeTo} onChangeText={setRouteTo} placeholder="VD: Hải Phòng" />

            <Text style={styles.inputLabel}>Khoảng cách</Text>
            <TextInput style={styles.modalInput} value={routeDistance} onChangeText={setRouteDistance} placeholder="VD: 120 km" />

            <Text style={styles.inputLabel}>Thời gian di chuyển dự kiến</Text>
            <TextInput style={styles.modalInput} value={routeDuration} onChangeText={setRouteDuration} placeholder="VD: 2h 30p" />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSaveRoute}>
              <Text style={styles.submitBtnText}>Lưu thông tin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── MODAL: TRIP ADD/EDIT ── */}
      <Modal visible={tripModalVisible} animationType="slide" transparent onRequestClose={() => setTripModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingTrip ? 'Sửa Chuyến xe' : 'Thêm Chuyến xe mới'}
                </Text>
                <TouchableOpacity onPress={() => setTripModalVisible(false)}>
                  <Ionicons name="close" size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Chọn Tuyến đường</Text>
              <View style={styles.pickerContainer}>
                {routes.map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.pickerItem, tripRouteId === r.id && styles.pickerItemActive]}
                    onPress={() => setTripRouteId(r.id)}
                  >
                    <Text style={[styles.pickerItemTextText, tripRouteId === r.id && styles.pickerItemTextTextActive]}>
                      {r.from} → {r.to}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Giờ khởi hành</Text>
              <TextInput style={styles.modalInput} value={tripDepTime} onChangeText={setTripDepTime} placeholder="VD: 06:00" />

              <Text style={styles.inputLabel}>Giờ đến</Text>
              <TextInput style={styles.modalInput} value={tripArrTime} onChangeText={setTripArrTime} placeholder="VD: 09:30" />

              <Text style={styles.inputLabel}>Giá vé (VND)</Text>
              <TextInput
                style={styles.modalInput}
                value={tripPrice}
                onChangeText={setTripPrice}
                placeholder="VD: 180000"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Biển số xe</Text>
              <TextInput style={styles.modalInput} value={tripBusNumber} onChangeText={setTripBusNumber} placeholder="VD: 29B - 123.45" />

              <Text style={styles.inputLabel}>Loại xe</Text>
              <TextInput style={styles.modalInput} value={tripBusType} onChangeText={setTripBusType} placeholder="VD: Limousine 34 chỗ" />

              <Text style={styles.inputLabel}>Nhà xe</Text>
              <TextInput style={styles.modalInput} value={tripCompany} onChangeText={setTripCompany} placeholder="VD: Xe Vân Anh" />

              <TouchableOpacity style={styles.submitBtn} onPress={handleSaveTrip}>
                <Text style={styles.submitBtnText}>Lưu thông tin</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  notificationBannerText: {
    flex: 1,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: FONT_SIZE.xs,
  },
  notificationBannerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  notificationBannerBtnText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.white,
  },
  headerSub: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  logoutBtnText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.xs,
  },
  tabsRow: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  tabButtonTextActive: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  contentScroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContent: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  subSectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
    ...SHADOWS.colored,
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.xs,
  },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.primaryMid,
  },
  simulateBtnText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderLeftWidth: 4,
    ...SHADOWS.small,
  },
  statCardVal: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.textPrimary,
  },
  statCardLbl: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    height: 220,
    ...SHADOWS.small,
    justifyContent: 'space-around',
  },
  chartCol: {
    alignItems: 'center',
  },
  chartBarWrapper: {
    height: 140,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: 24,
    backgroundColor: COLORS.textDisabled,
    borderRadius: RADIUS.xs,
  },
  chartLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  chartValText: {
    fontSize: 8,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: 2,
  },
  dataCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  dataCardInfo: {
    flex: 1,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 6,
  },
  companyNameText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  busPill: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  busPillText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.bold,
  },
  dataCardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  dataCardSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  tripTimeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tripPriceText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  boldText: {
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
    gap: SPACING.md,
  },
  editIconBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketIdText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
  },
  statusPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  statusPillText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  ticketDetailText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  boardingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    marginTop: SPACING.md,
    gap: SPACING.xs,
    ...SHADOWS.colored,
  },
  boardingBtnActive: {
    backgroundColor: COLORS.success,
  },
  boardingBtnText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.xs,
  },
  chatBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    height: 420,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.sm,
  },
  chatHeaderName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  chatScroll: {
    flex: 1,
    padding: SPACING.md,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  chatBubbleUser: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceSecondary,
  },
  chatBubbleAgent: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  chatBubbleSender: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  chatBubbleContent: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: COLORS.surfaceSecondary,
    height: 44,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    width: '100%',
    maxHeight: '85%',
    padding: SPACING.lg,
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  inputLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginTop: SPACING.sm,
  },
  modalInput: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    height: 44,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  pickerItem: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pickerItemTextText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  pickerItemTextTextActive: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.colored,
  },
  submitBtnText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.sm,
  },
});
