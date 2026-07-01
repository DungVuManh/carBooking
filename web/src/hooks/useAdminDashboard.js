import { useEffect, useMemo, useState } from 'react';
import { formatPrice } from '../data/mockData';

export const ADMIN_TABS = ['stats', 'routes', 'trips', 'tickets'];

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [routes, setRoutes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [tripModalVisible, setTripModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);

  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [routeDistance, setRouteDistance] = useState('');
  const [routeDuration, setRouteDuration] = useState('');

  const [tripRouteId, setTripRouteId] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripDepTime, setTripDepTime] = useState('');
  const [tripArrTime, setTripArrTime] = useState('');
  const [tripPrice, setTripPrice] = useState('');
  const [tripBusType, setTripBusType] = useState('Limousine 34 chỗ');
  const [tripBusNumber, setTripBusNumber] = useState('');
  const [tripCompany, setTripCompany] = useState('Xe Vân Anh');

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  });

  const fetchData = async () => {
    try {
      const [resRoutes, resTrips, resTickets] = await Promise.all([
        fetch('/api/routes', { headers: getAuthHeaders() }),
        fetch('/api/trips', { headers: getAuthHeaders() }),
        fetch('/api/tickets', { headers: getAuthHeaders() })
      ]);

      const dataRoutes = await resRoutes.json();
      const dataTrips = await resTrips.json();
      const dataTickets = await resTickets.json();

      if (dataRoutes.success) setRoutes(dataRoutes.data);
      if (dataTrips.success) setTrips(dataTrips.data);
      if (dataTickets.success) setTickets(dataTickets.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSaveRoute = async () => {
    if (!routeFrom.trim() || !routeTo.trim() || !routeDistance.trim() || !routeDuration.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin tuyến đường');
      return;
    }

    try {
      const payload = {
        from: routeFrom,
        to: routeTo,
        distance: routeDistance,
        duration: routeDuration,
      };

      if (editingRoute) {
        const res = await fetch(`/api/routes/${editingRoute._id || editingRoute.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setRoutes((prev) => prev.map((r) => ((r._id || r.id) === (editingRoute._id || editingRoute.id) ? data.data : r)));
        }
      } else {
        const res = await fetch('/api/routes', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setRoutes((prev) => [...prev, data.data]);
        }
      }
      setRouteModalVisible(false);
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Có lỗi xảy ra khi lưu tuyến đường.');
    }
  };

  const handleDeleteRoute = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tuyến đường này?')) {
      try {
        const res = await fetch(`/api/routes/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          setRoutes((prev) => prev.filter((r) => (r._id || r.id) !== id));
          setTrips((prev) => prev.filter((t) => (t.route?._id || t.routeId || t.route) !== id));
        }
      } catch (error) {
        console.error('Error deleting route:', error);
        alert('Có lỗi xảy ra khi xóa tuyến đường.');
      }
    }
  };

  const handleOpenAddTrip = () => {
    setEditingTrip(null);
    setTripRouteId(routes[0]?._id || routes[0]?.id || '');
    setTripDate(new Date().toISOString().split('T')[0]);
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
    setTripRouteId(trip.route?._id || trip.routeId || trip.route || '');
    setTripDate(trip.date || '');
    setTripDepTime(trip.departureTime);
    setTripArrTime(trip.arrivalTime);
    setTripPrice(trip.price.toString());
    setTripBusNumber(trip.busNumber);
    setTripBusType(trip.busType);
    setTripCompany(trip.company);
    setTripModalVisible(true);
  };

  const handleSaveTrip = async () => {
    if (!tripDate.trim() || !tripDepTime.trim() || !tripArrTime.trim() || !tripPrice.trim() || !tripBusNumber.trim()) {
      alert('Vui lòng điền đầy đủ các trường thông tin');
      return;
    }

    try {
      const parsedPrice = parseInt(tripPrice, 10) || 0;
      const payload = {
        routeId: tripRouteId,
        departureTime: tripDepTime,
        arrivalTime: tripArrTime,
        date: tripDate,
        price: parsedPrice,
        busNumber: tripBusNumber,
        busType: tripBusType,
        company: tripCompany,
        availableSeats: 34,
        totalSeats: 34,
      };

      if (editingTrip) {
        const res = await fetch(`/api/trips/${editingTrip._id || editingTrip.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          // Re-fetch to get populated fields
          fetchData();
        }
      } else {
        const res = await fetch('/api/trips', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      }
      setTripModalVisible(false);
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Có lỗi xảy ra khi lưu chuyến xe.');
    }
  };

  const handleDeleteTrip = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyến xe này?')) {
      try {
        const res = await fetch(`/api/trips/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          setTrips((prev) => prev.filter((t) => (t._id || t.id) !== id));
        }
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Có lỗi xảy ra khi xóa chuyến xe.');
      }
    }
  };

  const handleConfirmBoarding = async (ticketId) => {
    try {
      const targetTicket = tickets.find((t) => (t._id || t.id) === ticketId);
      if (!targetTicket) return;
      const nextStatus = targetTicket.status === 'confirmed' ? 'completed' : 'confirmed';
      
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setTickets((prev) =>
          prev.map((t) => ((t._id || t.id) === ticketId ? data.data : t))
        );
        alert(nextStatus === 'completed' ? 'Đã xác nhận khách lên xe thành công!' : 'Đã hoàn tác trạng thái xác nhận.');
      }
    } catch (error) {
      console.error('Error confirming boarding:', error);
      alert('Có lỗi xảy ra khi xác nhận boarding.');
    }
  };

  const stats = useMemo(() => {
    if (!tickets || !Array.isArray(tickets)) return { totalSold: 0, totalRevenue: 0, pendingCount: 0, cancelledCount: 0 };
    
    const totalSold = tickets.filter((t) => t.status !== 'cancelled').length;
    const totalRevenue = tickets
      .filter((t) => t.status === 'completed' || t.status === 'confirmed')
      .reduce((sum, t) => sum + (t.totalPrice || 0), 0);

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
    tripDate,
    setTripDate,
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
    handleOpenAddRoute,
    handleOpenEditRoute,
    handleSaveRoute,
    handleDeleteRoute,
    handleOpenAddTrip,
    handleOpenEditTrip,
    handleSaveTrip,
    handleDeleteTrip,
    handleConfirmBoarding,
    stats,
    formatPrice,
  };
}
