import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: [true, 'Điểm đi là bắt buộc'],
      trim: true,
    },
    to: {
      type: String,
      required: [true, 'Điểm đến là bắt buộc'],
      trim: true,
    },
    distance: {
      type: String,
      required: [true, 'Khoảng cách là bắt buộc'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Thời gian di chuyển là bắt buộc'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo chỉ mục kép phục vụ tìm kiếm tuyến đường nhanh chóng
routeSchema.index({ from: 1, to: 1 });

const Route = mongoose.model('Route', routeSchema);

export default Route;
