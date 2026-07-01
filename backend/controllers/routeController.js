import Route from '../models/Route.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Lấy tất cả tuyến đường
// @route   GET /api/routes
// @access  Public
export const getRoutes = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  let query = {};

  if (from) {
    query.from = { $regex: from, $options: 'i' };
  }
  if (to) {
    query.to = { $regex: to, $options: 'i' };
  }

  const routes = await Route.find(query);
  res.status(200).json({
    success: true,
    count: routes.length,
    data: routes,
  });
});

// @desc    Lấy tuyến đường theo ID
// @route   GET /api/routes/:id
// @access  Public
export const getRouteById = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (!route) {
    res.status(404);
    throw new Error('Không tìm thấy tuyến đường');
  }

  res.status(200).json({
    success: true,
    data: route,
  });
});

// @desc    Tạo tuyến đường mới
// @route   POST /api/routes
// @access  Public
export const createRoute = asyncHandler(async (req, res) => {
  const { from, to, distance, duration } = req.body;

  // Kiểm tra trùng lặp tuyến đường từ-đến
  const routeExists = await Route.findOne({ from, to });
  if (routeExists) {
    res.status(400);
    throw new Error('Tuyến đường này đã tồn tại');
  }

  const route = await Route.create({
    from,
    to,
    distance,
    duration,
  });

  res.status(201).json({
    success: true,
    data: route,
  });
});

// @desc    Cập nhật tuyến đường
// @route   PUT /api/routes/:id
// @access  Public
export const updateRoute = asyncHandler(async (req, res) => {
  const { from, to, distance, duration } = req.body;
  const route = await Route.findById(req.params.id);

  if (!route) {
    res.status(404);
    throw new Error('Không tìm thấy tuyến đường để cập nhật');
  }

  // Nếu cập nhật from hoặc to, check trùng tuyến đường khác
  if ((from && from !== route.from) || (to && to !== route.to)) {
    const checkFrom = from || route.from;
    const checkTo = to || route.to;
    const routeExists = await Route.findOne({ from: checkFrom, to: checkTo });
    if (routeExists && routeExists._id.toString() !== route._id.toString()) {
      res.status(400);
      throw new Error('Tuyến đường mới đã tồn tại trên hệ thống');
    }
  }

  route.from = from || route.from;
  route.to = to || route.to;
  route.distance = distance || route.distance;
  route.duration = duration || route.duration;

  const updatedRoute = await route.save();
  res.status(200).json({
    success: true,
    data: updatedRoute,
  });
});

// @desc    Xóa tuyến đường
// @route   DELETE /api/routes/:id
// @access  Public
export const deleteRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (!route) {
    res.status(404);
    throw new Error('Không tìm thấy tuyến đường để xóa');
  }

  await route.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Đã xóa tuyến đường thành công',
  });
});
