import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
 const { email, password } = req.body;

 const user = await User.findOne({ email }).select("+password");

 if (user && (await user.matchPassword(password))) {
  res.json({
   success: true,
   data: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
   },
  });
 } else {
  res.status(401);
  throw new Error("Email hoặc mật khẩu không chính xác");
 }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Email đã tồn tại');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'passenger', // Mặc định là hành khách
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Dữ liệu người dùng không hợp lệ');
  }
});
