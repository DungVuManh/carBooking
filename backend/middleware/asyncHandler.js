// Middleware giúp bắt lỗi tự động trong các async/await route handler mà không cần dùng try-catch lặp đi lặp lại
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
