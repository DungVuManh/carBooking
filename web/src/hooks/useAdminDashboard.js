import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MOCK_CHAT_MESSAGES,
  MOCK_ROUTES,
  MOCK_TICKETS,
  MOCK_TRIPS,
  formatPrice,
} from '../data/mockData';

export const ADMIN_TABS = ['stats', 'routes', 'trips', 'tickets', 'chat'];

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [routes, setRoutes] = useState([...MOCK_ROUTES]);
  const [trips, setTrips] = useState([...MOCK_TRIPS]);
  const [tickets, setTickets] = useState([...MOCK_TICKETS]);
  const [chats, setChats] = useState([...MOCK_CHAT_MESSAGES]);

  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [tripModalVisible, setTripModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);

  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [routeDistance, setRouteDistance] = useState('');
  const [routeDuration, setRouteDuration] = useState('');

  const [tripRouteId, setTripRouteId] = useState('');
  const [tripDepTime, setTripDepTime] = useState('');
  const [tripArrTime, setTripArrTime] = useState('');
  const [tripPrice, setTripPrice] = useState('');
  const [tripBusType, setTripBusType] = useState('Limousine 34 chỗ');
  const [tripBusNumber, setTripBusNumber] = useState('');
  const [tripCompany, setTripCompany] = useState('Xe Vân Anh');
  const [replyText, setReplyText] = useState('');
  const [adminNotifications, setAdminNotifications] = useState([]);

  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, activeTab]);

  const simulateClientMessage = () => {
    const randomMsgs = [
      'Tôi muốn hỏi xe Hà Nội đi Thanh Hóa lúc 06:00 còn ghế không ạ?',
      'Cho hỏi xe biển số 29B-123.45 đã chạy chưa admin?',
      'Tôi muốn đổi vé chuyến xe hôm nay sang ngày mai có được không?',
      'CSKH tư vấn giúp tôi dòng xe Limousine với.',
    ];
    const content = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
    const newMsg = {
      id: `msg_sim_${Date.now()}`,
      senderId: 'user',
      senderName: 'Khách hàng Nguyễn Văn An',
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setChats((prev) => [...prev, newMsg]);

    const newNotif = {
      id: `notif_${Date.now()}`,
      text: `Tin nhắn mới từ Nguyễn Văn An: "${content.substring(0, 32)}..."`,
    };
    setAdminNotifications((prev) => [newNotif, ...prev]);

    window.setTimeout(() => {
      setAdminNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, 6000);
  };

  const handleOpenAddRoute = () => {
    setEditingRoute(null);
    setRouteFrom('');
    setRouteTo('');
    setRouteDistance('');
    setRouteDuration('');
    setRouteModalVisible(true);
  };

  const handleOpenEditRoute = (route) => {
    setEditingRoute(route);
    setRouteFrom(route.from);
    setRouteTo(route.to);
    setRouteDistance(route.distance);
    setRouteDuration(route.duration);
    setRouteModalVisible(true);
  };

  const handleSaveRoute = () => {
    if (!routeFrom.trim() || !routeTo.trim() || !routeDistance.trim() || !routeDuration.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin tuyến đường');
      return;
    }

    if (editingRoute) {
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === editingRoute.id
            ? { ...r, from: routeFrom, to: routeTo, distance: routeDistance, duration: routeDuration }
            : r
        )
      );
    } else {
      const newRoute = {
        id: `r_${Date.now()}`,
        from: routeFrom,
        to: routeTo,
        distance: routeDistance,
        duration: routeDuration,
      };
      setRoutes((prev) => [...prev, newRoute]);
    }
    setRouteModalVisible(false);
  };

  const handleDeleteRoute = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tuyến đường này?')) {
      setRoutes((prev) => prev.filter((r) => r.id !== id));
      setTrips((prev) => prev.filter((t) => t.routeId !== id));
    }
  };

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

  const handleOpenEditTrip = (trip) => {
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
    if (!tripDepTime.trim() || !tripArrTime.trim() || !tripPrice.trim() || !tripBusNumber.trim()) {
      alert('Vui lòng điền đầy đủ các trường thông tin');
      return;
    }

    const matchedRoute = routes.find((r) => r.id === tripRouteId);
    const fromLocation = matchedRoute ? matchedRoute.from : 'Hà Nội';
    const toLocation = matchedRoute ? matchedRoute.to : 'Thanh Hóa';
    const parsedPrice = parseInt(tripPrice, 10) || 0;

    if (editingTrip) {
      setTrips((prev) =>
        prev.map((t) =>
          t.id === editingTrip.id
            ? {
                ...t,
                routeId: tripRouteId,
                from: fromLocation,
                to: toLocation,
                departureTime: tripDepTime,
                arrivalTime: tripArrTime,
                price: parsedPrice,
                busNumber: tripBusNumber,
                busType: tripBusType,
                company: tripCompany,
              }
            : t
        )
      );
    } else {
      const newTrip = {
        id: `trip_${Date.now()}`,
        routeId: tripRouteId,
        from: fromLocation,
        to: toLocation,
        departureTime: tripDepTime,
        arrivalTime: tripArrTime,
        date: '2026-07-15',
        price: parsedPrice,
        busNumber: tripBusNumber,
        busType: tripBusType,
        company: tripCompany,
        availableSeats: 34,
        totalSeats: 34,
        amenities: ['WiFi', 'Điều hòa', 'USB sạc', 'Nước miễn phí'],
        rating: 5.0,
      };
      setTrips((prev) => [...prev, newTrip]);
    }
    setTripModalVisible(false);
  };

  const handleDeleteTrip = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyến xe này?')) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleConfirmBoarding = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const nextStatus = t.status === 'confirmed' ? 'completed' : 'confirmed';
          alert(nextStatus === 'completed' ? 'Đã xác nhận khách lên xe thành công!' : 'Đã hoàn tác trạng thái xác nhận.');
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: `msg_admin_${Date.now()}`,
      senderId: 'agent',
      senderName: 'Admin CSKH',
      content: replyText,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    setChats((prev) => [...prev, newMsg]);
    setReplyText('');
  };

  const stats = useMemo(() => {
    const totalSold = tickets.filter((t) => t.status !== 'cancelled').length;
    const totalRevenue = tickets
      .filter((t) => t.status === 'completed' || t.status === 'confirmed')
      .reduce((sum, t) => sum + t.totalPrice, 0);

    const pendingCount = tickets.filter((t) => t.status === 'pending').length;
    const cancelledCount = tickets.filter((t) => t.status === 'cancelled').length;

    return { totalSold, totalRevenue, pendingCount, cancelledCount };
  }, [tickets]);

  return {
    activeTab,
    setActiveTab,
    routes,
    setRoutes,
    trips,
    setTrips,
    tickets,
    setTickets,
    chats,
    setChats,
    routeModalVisible,
    setRouteModalVisible,
    tripModalVisible,
    setTripModalVisible,
    editingRoute,
    setEditingRoute,
    editingTrip,
    setEditingTrip,
    routeFrom,
    setRouteFrom,
    routeTo,
    setRouteTo,
    routeDistance,
    setRouteDistance,
    routeDuration,
    setRouteDuration,
    tripRouteId,
    setTripRouteId,
    tripDepTime,
    setTripDepTime,
    tripArrTime,
    setTripArrTime,
    tripPrice,
    setTripPrice,
    tripBusType,
    setTripBusType,
    tripBusNumber,
    setTripBusNumber,
    tripCompany,
    setTripCompany,
    replyText,
    setReplyText,
    chatBottomRef,
    adminNotifications,
    setAdminNotifications,
    simulateClientMessage,
    handleOpenAddRoute,
    handleOpenEditRoute,
    handleSaveRoute,
    handleDeleteRoute,
    handleOpenAddTrip,
    handleOpenEditTrip,
    handleSaveTrip,
    handleDeleteTrip,
    handleConfirmBoarding,
    handleSendReply,
    stats,
    formatPrice,
  };
}
