/**
 * Mock data cho ứng dụng Bus Booking (Phiên bản Web Admin).
 * Tất cả dữ liệu đều là dữ liệu mẫu thực tế của Việt Nam.
 * KHÔNG kết nối backend - chỉ dùng để demo UI.
 */

// ─── TYPES ──────────────────────────────────────────────────────────────────

/** Thông tin người dùng */
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
};

/** Tuyến đường xe */
export type Route = {
  id: string;
  from: string;       // Điểm đi
  to: string;         // Điểm đến
  distance: string;   // Khoảng cách
  duration: string;   // Thời gian di chuyển
};

/** Chuyến xe cụ thể */
export type Trip = {
  id: string;
  routeId: string;
  from: string;
  to: string;
  departureTime: string;    // Giờ khởi hành
  arrivalTime: string;      // Giờ đến
  date: string;             // Ngày (YYYY-MM-DD)
  price: number;            // Giá vé (VND)
  busType: string;          // Loại xe (VD: "Limousine 34 chỗ")
  busNumber: string;        // Biển số xe
  availableSeats: number;   // Số ghế còn lại
  totalSeats: number;
  amenities: string[];      // Tiện ích (WiFi, Điều hòa...)
  company: string;          // Tên nhà xe
  rating: number;
};

/** Ghế ngồi */
export type Seat = {
  id: string;       // VD: "A1", "B3"
  row: string;      // Hàng: "A", "B"...
  col: number;      // Cột: 1, 2, 3, 4
  status: 'available' | 'booked' | 'selected'; // Trạng thái ghế
  deck: 'upper' | 'lower'; // Tầng (xe giường nằm)
};

/** Đơn đặt vé */
export type Ticket = {
  id: string;
  tripId: string;
  userId: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  seats: string[];          // Danh sách ghế đã chọn
  passengerName: string;
  passengerPhone: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: 'qr' | 'cash';
  bookedAt: string;         // Thời điểm đặt vé (ISO string)
  busType: string;
  busNumber: string;
  company: string;
};

/** Tin nhắn chat */
export type ChatMessage = {
  id: string;
  senderId: string;   // 'user' hoặc 'agent'
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
};

/** Thông báo */
export type Notification = {
  id: string;
  title: string;
  body: string;
  type: 'reminder' | 'promotion' | 'system' | 'booking';
  isRead: boolean;
  createdAt: string;
  tripId?: string;
};

// ─── MOCK USER ───────────────────────────────────────────────────────────────

export const MOCK_USER: User = {
  id: 'user_001',
  name: 'Nguyễn Văn An',
  email: 'nguyenvanan@gmail.com',
  phone: '0912 345 678',
};

// ─── MOCK ROUTES ─────────────────────────────────────────────────────────────

export const MOCK_ROUTES: Route[] = [
  { id: 'r1', from: 'Hà Nội', to: 'Hải Phòng', distance: '120 km', duration: '2h 30p' },
  { id: 'r2', from: 'Hà Nội', to: 'Ninh Bình', distance: '93 km', duration: '2h' },
  { id: 'r3', from: 'Hà Nội', to: 'Thanh Hóa', distance: '160 km', duration: '3h 30p' },
  { id: 'r4', from: 'Hà Nội', to: 'Đà Nẵng', distance: '764 km', duration: '14h' },
  { id: 'r5', from: 'Hà Nội', to: 'Hồ Chí Minh', distance: '1726 km', duration: '30h' },
  { id: 'r6', from: 'Hải Phòng', to: 'Hà Nội', distance: '120 km', duration: '2h 30p' },
  { id: 'r7', from: 'Đà Nẵng', to: 'Huế', distance: '108 km', duration: '3h' },
  { id: 'r8', from: 'Hồ Chí Minh', to: 'Vũng Tàu', distance: '125 km', duration: '2h' },
  { id: 'r9', from: 'Hà Nội', to: 'Lào Cai', distance: '296 km', duration: '5h' },
  { id: 'r10', from: 'Hà Nội', to: 'Quảng Ninh', distance: '156 km', duration: '3h' },
];

// Danh sách tỉnh thành để dùng trong search dropdown
export const CITIES = ['Hà Nội', 'Thanh Hóa'];

// Cấu trúc dữ liệu hành chính Huyện, Xã mới nhất 2026 cho Hà Nội và Thanh Hóa
export interface District {
  name: string;
  communes: string[];
}

export interface Province {
  name: string;
  districts: District[];
}

export const ADMINISTRATIVE_DATA: Province[] = [
  {
    name: 'Hà Nội',
    districts: [
      {
        name: 'Quận Hoàn Kiếm',
        communes: ['Phường Hàng Bạc', 'Phường Tràng Tiền', 'Phường Lý Thái Tổ', 'Phường Hàng Đào', 'Phường Hàng Trống']
      },
      {
        name: 'Quận Ba Đình',
        communes: ['Phường Điện Biên', 'Phường Trúc Bạch', 'Phường Kim Mã', 'Phường Cống Vị', 'Phường Giảng Võ']
      },
      {
        name: 'Quận Cầu Giấy',
        communes: ['Phường Dịch Vọng', 'Phường Nghĩa Tân', 'Phường Quan Hoa', 'Phường Mai Dịch', 'Phường Trung Hòa']
      },
      {
        name: 'Quận Đống Đa',
        communes: ['Phường Láng Hạ', 'Phường Láng Thượng', 'Phường Ô Chợ Dừa', 'Phường Quang Trung']
      },
      {
        name: 'Huyện Đông Anh',
        communes: ['Xã Kim Nỗ', 'Xã Hải Bối', 'Xã Cổ Loa', 'Xã Uy Nỗ', 'Thị trấn Đông Anh']
      },
      {
        name: 'Huyện Gia Lâm',
        communes: ['Xã Đa Tốn', 'Xã Bát Tràng', 'Xã Ninh Hiệp', 'Thị trấn Trâu Quỳ']
      }
    ]
  },
  {
    name: 'Thanh Hóa',
    districts: [
      {
        name: 'Thành phố Thanh Hóa',
        communes: ['Phường Ba Đình', 'Phường Điện Biên', 'Phường Đông Thọ', 'Phường Hàm Rồng', 'Phường Quảng Hưng']
      },
      {
        name: 'Thị xã Bỉm Sơn',
        communes: ['Phường Ba Đình', 'Phường Ngọc Trạo', 'Phường Lam Sơn', 'Phường Đông Sơn', 'Xã Quang Trung']
      },
      {
        name: 'Thị xã Nghi Sơn',
        communes: ['Phường Hải Hòa', 'Phường Nguyên Bình', 'Phường Trúc Lâm', 'Xã Hải Thượng', 'Phường Tĩnh Gia']
      },
      {
        name: 'Huyện Quảng Xương',
        communes: ['Xã Quảng Bình', 'Xã Quảng Nhân', 'Xã Quảng Hợp', 'Xã Quảng Đức', 'Thị trấn Tân Phong']
      },
      {
        name: 'Huyện Hoằng Hóa',
        communes: ['Xã Hoằng Lộc', 'Xã Hoằng Tiến', 'Xã Hoằng Hải', 'Xã Hoằng Thanh', 'Thị trấn Bút Sơn']
      }
    ]
  }
];

// ─── MOCK TRIPS ──────────────────────────────────────────────────────────────

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip_001',
    routeId: 'r1',
    from: 'Hà Nội',
    to: 'Thanh Hóa',
    departureTime: '06:00',
    arrivalTime: '09:30',
    date: '2026-07-15',
    price: 180000,
    busType: 'Limousine 34 chỗ',
    busNumber: '29B - 123.45',
    availableSeats: 12,
    totalSeats: 34,
    amenities: ['WiFi', 'Điều hòa', 'USB sạc', 'Nước miễn phí'],
    company: 'Xe DungVm',
    rating: 4.8,
  },
  {
    id: 'trip_002',
    routeId: 'r1',
    from: 'Hà Nội',
    to: 'Thanh Hóa',
    departureTime: '08:30',
    arrivalTime: '12:00',
    date: '2026-07-15',
    price: 180000,
    busType: 'Giường nằm 40 chỗ',
    busNumber: '29A - 456.78',
    availableSeats: 5,
    totalSeats: 40,
    amenities: ['WiFi', 'Điều hòa', 'TV', 'Chăn gối'],
    company: 'Xe Phương Trang',
    rating: 4.6,
  },
  {
    id: 'trip_003',
    routeId: 'r1',
    from: 'Hà Nội',
    to: 'Thanh Hóa',
    departureTime: '13:00',
    arrivalTime: '16:30',
    date: '2026-07-15',
    price: 150000,
    busType: 'Xe ghế ngồi 45 chỗ',
    busNumber: '14C - 789.01',
    availableSeats: 20,
    totalSeats: 45,
    amenities: ['Điều hòa'],
    company: 'Xe Hoàng Long',
    rating: 4.3,
  },
  {
    id: 'trip_004',
    routeId: 'r2',
    from: 'Thanh Hóa',
    to: 'Hà Nội',
    departureTime: '07:00',
    arrivalTime: '10:30',
    date: '2026-07-15',
    price: 180000,
    busType: 'Limousine 29 chỗ',
    busNumber: '29B - 234.56',
    availableSeats: 8,
    totalSeats: 29,
    amenities: ['WiFi', 'Điều hòa', 'USB sạc'],
    company: 'Xe DungVm',
    rating: 4.7,
  },
  {
    id: 'trip_005',
    routeId: 'r9',
    from: 'Thanh Hóa',
    to: 'Hà Nội',
    departureTime: '22:00',
    arrivalTime: '01:30',
    date: '2026-07-15',
    price: 220000,
    busType: 'Giường nằm VIP 34 chỗ',
    busNumber: '29D - 567.89',
    availableSeats: 16,
    totalSeats: 34,
    amenities: ['WiFi', 'Điều hòa', 'TV', 'Chăn gối', 'Đồ ăn nhẹ'],
    company: 'Xe Sapa Express',
    rating: 4.9,
  },
  {
    id: 'trip_006',
    routeId: 'r10',
    from: 'Hà Nội',
    to: 'Thanh Hóa',
    departureTime: '17:00',
    arrivalTime: '20:30',
    date: '2026-07-15',
    price: 180000,
    busType: 'Limousine 34 chỗ',
    busNumber: '14B - 321.65',
    availableSeats: 22,
    totalSeats: 34,
    amenities: ['WiFi', 'Điều hòa', 'USB sạc'],
    company: 'Xe DungVm',
    rating: 4.5,
  },
];

// ─── MOCK SEATS ──────────────────────────────────────────────────────────────

export const generateSeats = (tripId: string): Seat[] => {
  const preBookedSeats: Record<string, string[]> = {
    trip_001: ['A1', 'A2', 'B3', 'B4', 'C1', 'D2', 'D3'],
    trip_002: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4', 'E1'],
    trip_003: ['B1', 'C2'],
    trip_004: ['A3', 'A4', 'B1', 'B2'],
    trip_005: ['A1', 'A2', 'B3', 'D2'],
    trip_006: ['A1', 'B2'],
  };

  const booked = preBookedSeats[tripId] || [];
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = [1, 2, 3, 4];

  rows.slice(0, 4).forEach((row) => {
    cols.forEach((col) => {
      const seatId = `${row}${col}`;
      seats.push({
        id: seatId,
        row,
        col,
        status: booked.includes(seatId) ? 'booked' : 'available',
        deck: 'lower',
      });
    });
  });

  rows.slice(4).forEach((row) => {
    cols.forEach((col) => {
      const seatId = `${row}${col}`;
      seats.push({
        id: seatId,
        row,
        col,
        status: booked.includes(seatId) ? 'booked' : 'available',
        deck: 'upper',
      });
    });
  });

  return seats;
};

// ─── MOCK TICKETS ─────────────────────────────────────────────────────────────

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'ticket_001',
    tripId: 'trip_001',
    userId: 'user_001',
    from: 'Hà Nội',
    to: 'Thanh Hóa',
    departureTime: '06:00',
    arrivalTime: '09:30',
    date: '2026-07-20',
    seats: ['B3', 'B4'],
    passengerName: 'Nguyễn Văn An',
    passengerPhone: '0912 345 678',
    totalPrice: 360000,
    status: 'confirmed',
    paymentMethod: 'qr',
    bookedAt: '2026-07-10T14:30:00.000Z',
    busType: 'Limousine 34 chỗ',
    busNumber: '29B - 123.45',
    company: 'Xe DungVm',
  },
  {
    id: 'ticket_002',
    tripId: 'trip_005',
    userId: 'user_001',
    from: 'Thanh Hóa',
    to: 'Hà Nội',
    departureTime: '22:00',
    arrivalTime: '01:30',
    date: '2026-08-01',
    seats: ['A1'],
    passengerName: 'Nguyễn Văn An',
    passengerPhone: '0912 345 678',
    totalPrice: 220000,
    status: 'pending',
    paymentMethod: 'qr',
    bookedAt: '2026-07-12T09:15:00.000Z',
    busType: 'Giường nằm VIP 34 chỗ',
    busNumber: '29D - 567.89',
    company: 'Xe Sapa Express',
  },
  {
    id: 'ticket_003',
    tripId: 'trip_003',
    userId: 'user_001',
    from: 'Hà Nội',
    to: 'Thanh Hóa',
    departureTime: '13:00',
    arrivalTime: '16:30',
    date: '2026-06-15',
    seats: ['C2'],
    passengerName: 'Nguyễn Văn An',
    passengerPhone: '0912 345 678',
    totalPrice: 150000,
    status: 'completed',
    paymentMethod: 'qr',
    bookedAt: '2026-06-10T11:00:00.000Z',
    busType: 'Xe ghế ngồi 45 chỗ',
    busNumber: '14C - 789.01',
    company: 'Xe Hoàng Long',
  },
  {
    id: 'ticket_004',
    tripId: 'trip_004',
    userId: 'user_001',
    from: 'Thanh Hóa',
    to: 'Hà Nội',
    departureTime: '07:00',
    arrivalTime: '10:30',
    date: '2026-06-05',
    seats: ['A3'],
    passengerName: 'Nguyễn Văn An',
    passengerPhone: '0912 345 678',
    totalPrice: 180000,
    status: 'cancelled',
    paymentMethod: 'qr',
    bookedAt: '2026-06-01T16:00:00.000Z',
    busType: 'Limousine 29 chỗ',
    busNumber: '29B - 234.56',
    company: 'Xe DungVm',
  },
];

// ─── MOCK CHAT MESSAGES ──────────────────────────────────────────────────────

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_001',
    senderId: 'agent',
    senderName: 'CSKH DungVm',
    content: 'Xin chào! Tôi là nhân viên hỗ trợ khách hàng của Xe DungVm. Tôi có thể giúp gì cho bạn?',
    timestamp: '2026-07-12T09:00:00.000Z',
    isRead: true,
  },
  {
    id: 'msg_002',
    senderId: 'user',
    senderName: 'Nguyễn Văn An',
    content: 'Cho tôi hỏi chuyến xe 06:00 Hà Nội - Thanh Hóa ngày 15/7 còn ghế không?',
    timestamp: '2026-07-12T09:01:00.000Z',
    isRead: true,
  },
  {
    id: 'msg_003',
    senderId: 'agent',
    senderName: 'CSKH DungVm',
    content: 'Dạ, chuyến xe 06:00 ngày 15/7 hiện còn 12 ghế ạ. Bạn muốn đặt bao nhiêu ghế?',
    timestamp: '2026-07-12T09:02:30.000Z',
    isRead: true,
  },
  {
    id: 'msg_004',
    senderId: 'user',
    senderName: 'Nguyễn Văn An',
    content: 'Tôi muốn đặt 2 ghế. Có thể chọn ghế gần cửa sổ không?',
    timestamp: '2026-07-12T09:03:00.000Z',
    isRead: true,
  },
  {
    id: 'msg_005',
    senderId: 'agent',
    senderName: 'CSKH DungVm',
    content: 'Dạ được ạ! Bạn có thể vào mục "Chọn chuyến xe" và chọn ghế cửa sổ trực tiếp trên sơ đồ ghế. Hoặc để tôi hỗ trợ đặt giúp bạn!',
    timestamp: '2026-07-12T09:04:00.000Z',
    isRead: true,
  },
  {
    id: 'msg_006',
    senderId: 'user',
    senderName: 'Nguyễn Văn An',
    content: 'Ok cảm ơn bạn, tôi sẽ tự đặt trên app!',
    timestamp: '2026-07-12T09:05:00.000Z',
    isRead: true,
  },
  {
    id: 'msg_007',
    senderId: 'agent',
    senderName: 'CSKH DungVm',
    content: 'Dạ, chúc bạn có chuyến đi vui vẻ! Nếu cần hỗ trợ gì thêm, bạn nhắn tin lại nhé! 😊',
    timestamp: '2026-07-12T09:05:30.000Z',
    isRead: true,
  },
];

// ─── MOCK NOTIFICATIONS ──────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_001',
    title: '⏰ Nhắc nhở chuyến đi',
    body: 'Chuyến xe Hà Nội → Thanh Hóa của bạn xuất phát lúc 06:00 ngày 15/07. Vui lòng có mặt trước 15 phút!',
    type: 'reminder',
    isRead: false,
    createdAt: '2026-07-14T18:00:00.000Z',
    tripId: 'trip_001',
  },
  {
    id: 'notif_002',
    title: '✅ Đặt vé thành công',
    body: 'Đặt vé chuyến xe 06:00 Hà Nội → Thanh Hóa ngày 15/07 thành công. Mã vé: #TKT001',
    type: 'booking',
    isRead: false,
    createdAt: '2026-07-10T14:30:00.000Z',
    tripId: 'trip_001',
  },
  {
    id: 'notif_003',
    title: '🎁 Ưu đãi hè 2026',
    body: 'Giảm 20% cho tất cả chuyến xe từ 01/08 - 31/08/2026. Nhập mã HE2026 khi đặt vé!',
    type: 'promotion',
    isRead: true,
    createdAt: '2026-07-08T10:00:00.000Z',
  },
  {
    id: 'notif_004',
    title: '⏰ Nhắc nhở chuyến đi',
    body: 'Chuyến xe Thanh Hóa → Hà Nội xuất phát lúc 22:00 ngày 01/08. Hãy chuẩn bị hành lý!',
    type: 'reminder',
    isRead: true,
    createdAt: '2026-07-31T16:00:00.000Z',
    tripId: 'trip_005',
  },
  {
    id: 'notif_005',
    title: '🔔 Cập nhật hệ thống',
    body: 'Xe DungVm vừa cập nhật tính năng mới! Bây giờ bạn có thể chat trực tiếp với tài xế.',
    type: 'system',
    isRead: true,
    createdAt: '2026-07-05T08:00:00.000Z',
  },
  {
    id: 'notif_006',
    title: '🎉 Chào mừng bạn đến với Xe DungVm',
    body: 'Cảm ơn bạn đã tin dùng dịch vụ! Đặt vé ngay hôm nay để nhận ưu đãi 10% cho chuyến đầu tiên.',
    type: 'promotion',
    isRead: true,
    createdAt: '2026-07-01T09:00:00.000Z',
  },
];

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

/** Format giá tiền theo định dạng Việt Nam */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + ' đ';
};

/** Format ngày theo định dạng dd/MM/yyyy */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/** Lấy màu badge theo trạng thái vé */
export const getStatusColor = (status: Ticket['status']): string => {
  const colors: Record<Ticket['status'], string> = {
    pending: '#F39C12',
    confirmed: '#27AE60',
    cancelled: '#E74C3C',
    completed: '#3498DB',
  };
  return colors[status];
};

/** Lấy text hiển thị trạng thái vé */
export const getStatusText = (status: Ticket['status']): string => {
  const texts: Record<Ticket['status'], string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy',
    completed: 'Hoàn thành',
  };
  return texts[status];
};

/**
 * Kiểm tra xem vé có thể hủy không.
 * Quy tắc: Chỉ hủy được nếu chưa quá 12 tiếng kể từ khi đặt.
 */
export const canCancelTicket = (ticket: Ticket): boolean => {
  if (ticket.status !== 'pending' && ticket.status !== 'confirmed') return false;
  const bookedAt = new Date(ticket.bookedAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - bookedAt.getTime()) / (1000 * 60 * 60);
  return hoursDiff < 12;
};

/** Tìm kiếm chuyến xe theo điều kiện */
export const searchTrips = (from: string, to: string, _date?: string): Trip[] => {
  return MOCK_TRIPS.filter(
    (trip) => {
      const fromMatch = !from || 
        trip.from.toLowerCase().includes(from.toLowerCase()) || 
        from.toLowerCase().includes(trip.from.toLowerCase());
      const toMatch = !to || 
        trip.to.toLowerCase().includes(to.toLowerCase()) || 
        to.toLowerCase().includes(trip.to.toLowerCase());
      return fromMatch && toMatch;
    }
  );
};
