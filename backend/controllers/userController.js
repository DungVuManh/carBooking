import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Lấy tất cả người dùng
// @route   GET /api/users
// @access  Public (hoặc Admin tùy phân quyền sau này)
export const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  let query = {};

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query);
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Lấy người dùng theo ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Tạo người dùng mới
// @route   POST /api/users
// @access  Public
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, avatar, role } = req.body;

  // Kiểm tra trùng email
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email đã tồn tại trên hệ thống');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password, // Lưu mật khẩu gốc (hoặc hash nếu có bcrypt, ở đây làm CRUD đơn giản trước)
    avatar,
    role,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc    Cập nhật thông tin người dùng
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, avatar, role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng để cập nhật');
  }

  // Nếu cập nhật email, kiểm tra xem email mới có bị trùng với người dùng khác không
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email mới đã tồn tại trên hệ thống');
    }
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.avatar = avatar !== undefined ? avatar : user.avatar;
  user.role = role || user.role;

  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// @desc    Xóa người dùng
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng để xóa');
  }

  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Đã xóa người dùng thành công',
  });
});

// @desc    Lấy thông tin profile cá nhân
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

// @desc    Cập nhật thông tin profile cá nhân
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email mới đã tồn tại trên hệ thống');
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      },
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});
