import Trip from '../models/Trip.js';
import Route from '../models/Route.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Lấy danh sách chuyến xe
// @route   GET /api/trips
// @access  Public
export const getTrips = asyncHandler(async (req, res) => {
  const { from, to, date, routeId } = req.query;
  let query = {};

  if (routeId) {
    query.routeId = routeId;
  }

  if (from) {
    query.from = { $regex: from, $options: 'i' };
  }

  if (to) {
    query.to = { $regex: to, $options: 'i' };
  }

  if (date) {
    query.date = date; // Ví dụ: YYYY-MM-DD
  }

  const trips = await Trip.find(query).populate('routeId');
  res.status(200).json({
    success: true,
    count: trips.length,
    data: trips,
  });
});

// @desc    Lấy chi tiết chuyến xe theo ID
// @route   GET /api/trips/:id
// @access  Public
export const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate('routeId');

  if (!trip) {
    res.status(404);
    throw new Error('Không tìm thấy chuyến xe');
  }

  res.status(200).json({
    success: true,
    data: trip,
  });
});

// @desc    Tạo chuyến xe mới
// @route   POST /api/trips
// @access  Public
export const createTrip = asyncHandler(async (req, res) => {
  const {
    routeId,
    from,
    to,
    departureTime,
    arrivalTime,
    date,
    price,
    busType,
    busNumber,
    totalSeats,
    company,
    rating,
  } = req.body;

  // Kiểm tra RouteId có tồn tại không
  const route = await Route.findById(routeId);
  if (!route) {
    res.status(400);
    throw new Error('Tuyến đường (routeId) không tồn tại');
  }

  // Số lượng ghế trống ban đầu chính bằng tổng số ghế
  const availableSeats = totalSeats;

  const trip = await Trip.create({
    routeId,
    from: from || route.from, // Nếu không gửi, lấy từ Route
    to: to || route.to,       // Nếu không gửi, lấy từ Route
    departureTime,
    arrivalTime,
    date,
    price,
    busType,
    busNumber,
    availableSeats,
    totalSeats,
    bookedSeats: [],
    company,
    rating: rating || 5.0,
  });

  res.status(201).json({
    success: true,
    data: trip,
  });
});

// @desc    Cập nhật chuyến xe
// @route   PUT /api/trips/:id
// @access  Public
export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error('Không tìm thấy chuyến xe để cập nhật');
  }

  const { routeId, totalSeats } = req.body;

  if (routeId && routeId !== trip.routeId.toString()) {
    const route = await Route.findById(routeId);
    if (!route) {
      res.status(400);
      throw new Error('Tuyến đường (routeId) mới không tồn tại');
    }
  }

  // Nếu cập nhật totalSeats, cần tính lại availableSeats
  if (totalSeats !== undefined && totalSeats !== trip.totalSeats) {
    const numBooked = trip.bookedSeats.length;
    if (totalSeats < numBooked) {
      res.status(400);
      throw new Error(`Tổng số ghế không thể nhỏ hơn số ghế đã được đặt (${numBooked})`);
    }
    req.body.availableSeats = totalSeats - numBooked;
  }

  // Cập nhật tất cả các trường được gửi lên trong body
  const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('routeId');

  res.status(200).json({
    success: true,
    data: updatedTrip,
  });
});

// @desc    Xóa chuyến xe
// @route   DELETE /api/trips/:id
// @access  Public
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error('Không tìm thấy chuyến xe để xóa');
  }

  await trip.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Đã xóa chuyến xe thành công',
  });
});
