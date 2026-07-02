import Ticket from '../models/Ticket.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Lấy tất cả vé đặt
// @route   GET /api/tickets
// @access  Public
export const getTickets = asyncHandler(async (req, res) => {
  const { userId, tripId, status } = req.query;
  let query = {};

  if (userId) {
    query.userId = userId;
  }
  if (tripId) {
    query.tripId = tripId;
  }
  if (status) {
    query.status = status;
  }

  const tickets = await Ticket.find(query)
    .populate('userId')
    .populate('tripId');

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets,
  });
});

// @desc    Lấy thông tin chi tiết vé theo ID
// @route   GET /api/tickets/:id
// @access  Public
export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('userId')
    .populate('tripId');

  if (!ticket) {
    res.status(404);
    throw new Error('Không tìm thấy vé đặt');
  }

  // Đảm bảo chỉ admin hoặc chính người đặt mới xem được
  if (req.user.role !== 'admin' && ticket.userId._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Bạn không có quyền xem vé này');
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

// @desc    Đặt vé xe mới
// @route   POST /api/tickets
// @access  Public
export const createTicket = asyncHandler(async (req, res) => {
  const {
    tripId,
    userId,
    seats,
    passengerName,
    passengerPhone,
    paymentMethod,
  } = req.body;

  // 1. Kiểm tra User tồn tại
  const user = await User.findById(userId);
  if (!user) {
    res.status(400);
    throw new Error('Người dùng (userId) không tồn tại');
  }

  // 2. Kiểm tra Trip tồn tại
  const trip = await Trip.findById(tripId);
  if (!trip) {
    res.status(400);
    throw new Error('Chuyến xe (tripId) không tồn tại');
  }

  // 3. Kiểm tra danh sách ghế chọn
  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    res.status(400);
    throw new Error('Danh sách ghế (seats) đặt phải là một mảng và không được trống');
  }

  // Kiểm tra ghế có bị trùng lặp (đã được đặt) hay không
  const isSeatTaken = seats.some((seat) => trip.bookedSeats.includes(seat));
  if (isSeatTaken) {
    res.status(400);
    throw new Error('Một hoặc nhiều ghế bạn chọn đã được đặt trước đó');
  }

  // Kiểm tra số lượng ghế trống
  if (trip.availableSeats < seats.length) {
    res.status(400);
    throw new Error(`Chuyến xe chỉ còn trống ${trip.availableSeats} ghế`);
  }

  // 4. Denormalize thông tin từ Trip và tính tổng tiền
  const totalPrice = trip.price * seats.length;

  const ticket = await Ticket.create({
    tripId,
    userId,
    from: trip.from,
    to: trip.to,
    departureTime: trip.departureTime,
    arrivalTime: trip.arrivalTime,
    date: trip.date,
    seats,
    passengerName: passengerName || user.name,
    passengerPhone: passengerPhone || user.phone,
    totalPrice,
    status: 'confirmed', // Xác nhận luôn (hoặc pending tùy flow, ở đây mặc định confirmed)
    paymentMethod: paymentMethod || 'qr',
    busType: trip.busType,
    busNumber: trip.busNumber,
    company: trip.company,
  });

  // 5. Cập nhật ghế của chuyến xe (Trip)
  trip.bookedSeats.push(...seats);
  trip.availableSeats -= seats.length;
  await trip.save();

  res.status(201).json({
    success: true,
    data: ticket,
  });
});

// @desc    Cập nhật trạng thái / thông tin vé
// @route   PUT /api/tickets/:id
// @access  Public
export const updateTicket = asyncHandler(async (req, res) => {
  const { status, passengerName, passengerPhone, paymentMethod } = req.body;
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Không tìm thấy vé đặt để cập nhật');
  }

  // Nếu user là passenger, họ chỉ được phép huỷ vé của chính mình
  if (req.user.role !== 'admin') {
    if (ticket.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Bạn không có quyền cập nhật vé này');
    }
    // Passenger chỉ được update status thành 'cancelled'
    if (status && status !== 'cancelled') {
      res.status(403);
      throw new Error('Hành khách chỉ được phép huỷ vé');
    }
  }

  const trip = await Trip.findById(ticket.tripId);

  // Xử lý hoàn trả/đặt lại ghế khi thay đổi trạng thái
  if (status && status !== ticket.status) {
    // Nếu huỷ vé (từ trạng thái cũ không phải cancelled sang cancelled)
    if (status === 'cancelled' && ticket.status !== 'cancelled') {
      if (trip) {
        // Xóa các ghế của vé này khỏi danh sách bookedSeats của chuyến đi
        trip.bookedSeats = trip.bookedSeats.filter((seat) => !ticket.seats.includes(seat));
        trip.availableSeats += ticket.seats.length;
        await trip.save();
      }
    }
    // Nếu phục hồi vé từ cancelled sang confirmed/completed/pending
    else if (ticket.status === 'cancelled' && status !== 'cancelled') {
      if (trip) {
        // Kiểm tra xem ghế có bị người khác đặt mất chưa
        const isSeatTaken = ticket.seats.some((seat) => trip.bookedSeats.includes(seat));
        if (isSeatTaken) {
          res.status(400);
          throw new Error('Không thể phục hồi vé vì một hoặc nhiều ghế của vé này đã bị đặt mất');
        }
        // Thêm lại ghế đã chọn và giảm số ghế trống
        trip.bookedSeats.push(...ticket.seats);
        trip.availableSeats -= ticket.seats.length;
        await trip.save();
      }
    }

    ticket.status = status;
  }

  // Cập nhật các thông tin khác
  ticket.passengerName = passengerName || ticket.passengerName;
  ticket.passengerPhone = passengerPhone || ticket.passengerPhone;
  ticket.paymentMethod = paymentMethod || ticket.paymentMethod;

  const updatedTicket = await ticket.save();

  res.status(200).json({
    success: true,
    data: updatedTicket,
  });
});

// @desc    Xóa vé đặt (và tự động giải phóng ghế nếu vé chưa hủy)
// @route   DELETE /api/tickets/:id
// @access  Public
export const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Không tìm thấy vé đặt để xóa');
  }

  // Nếu vé chưa huỷ thì hoàn trả ghế trước khi xóa
  if (ticket.status !== 'cancelled') {
    const trip = await Trip.findById(ticket.tripId);
    if (trip) {
      trip.bookedSeats = trip.bookedSeats.filter((seat) => !ticket.seats.includes(seat));
      trip.availableSeats += ticket.seats.length;
      await trip.save();
    }
  }

  await ticket.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Đã xóa vé đặt thành công',
  });
});

// @desc    Lấy danh sách vé của user hiện tại
// @route   GET /api/tickets/my-tickets
// @access  Private
export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ userId: req.user._id })
    .populate('tripId')
    .sort('-createdAt'); // Mới nhất lên đầu

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets,
  });
});
