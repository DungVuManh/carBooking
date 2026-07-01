import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'Tuyến đường (routeId) là bắt buộc'],
    },
    from: {
      type: String,
      required: [true, 'Điểm xuất phát là bắt buộc'],
      trim: true,
    },
    to: {
      type: String,
      required: [true, 'Điểm đến là bắt buộc'],
      trim: true,
    },
    departureTime: {
      type: String,
      required: [true, 'Thời gian khởi hành là bắt buộc'],
    },
    arrivalTime: {
      type: String,
      required: [true, 'Thời gian đến dự kiến là bắt buộc'],
    },
    date: {
      type: String,
      required: [true, 'Ngày khởi hành (YYYY-MM-DD) là bắt buộc'],
    },
    price: {
      type: Number,
      required: [true, 'Giá vé là bắt buộc'],
    },
    busType: {
      type: String,
      required: [true, 'Loại xe là bắt buộc'],
    },
    busNumber: {
      type: String,
      required: [true, 'Biển số xe là bắt buộc'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Số lượng ghế trống là bắt buộc'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Tổng số lượng ghế là bắt buộc'],
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    company: {
      type: String,
      required: [true, 'Tên nhà xe là bắt buộc'],
    },
    rating: {
      type: Number,
      default: 5.0,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo chỉ mục phục vụ việc tìm kiếm chuyến xe theo lộ trình và ngày đi
tripSchema.index({ routeId: 1 });
tripSchema.index({ from: 1, to: 1, date: 1 });

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
