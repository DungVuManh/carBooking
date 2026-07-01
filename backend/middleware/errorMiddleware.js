// Middleware xử lý khi không tìm thấy route (404)
export const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy đường dẫn - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware xử lý lỗi tập trung
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Lỗi định dạng ID không hợp lệ của Mongoose (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'ID không hợp lệ hoặc không đúng định dạng';
  }

  // Lỗi trùng lặp key (ví dụ: trùng email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Dữ liệu đã tồn tại hoặc bị trùng lặp: ${field || ''}`;
  }

  // Lỗi validation của Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
