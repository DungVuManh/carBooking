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
