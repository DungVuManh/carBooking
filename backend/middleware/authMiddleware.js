import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/User.js";

const protect = asyncHandler(async (req, res, next) => {
 let token;

 if (
  req.headers.authorization &&
  req.headers.authorization.startsWith("Bearer")
 ) {
  try {
   token = req.headers.authorization.split(" ")[1];

   if (!token || token === "null" || token === "undefined") {
    res.status(401);
    throw new Error("Không được phép, token không hợp lệ");
   }

   const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback_secret",
   );

   req.user = await User.findById(decoded.id).select("-password");

   next();
  } catch (error) {
   console.error(error);
   res.status(401);
   throw new Error("Không được phép, token bị lỗi");
  }
 }

 if (!token) {
  res.status(401);
  throw new Error("Không được phép, không có token");
 }
});

const admin = (req, res, next) => {
 if (req.user && req.user.role === "admin") {
  next();
 } else {
  res.status(401);
  throw new Error("Không được phép, bạn không phải admin");
 }
};

export { protect, admin };
