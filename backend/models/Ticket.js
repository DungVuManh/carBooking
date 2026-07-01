import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Mã chuyến xe (tripId) là bắt buộc'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mã người dùng (userId) là bắt buộc'],
    },
    // Các thông tin denormalized để phục vụ việc hiển thị nhanh của app/web
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    seats: {
      type: [String],
      required: [true, 'Danh sách ghế đã chọn là bắt buộc'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Vé đặt phải chứa ít nhất 1 ghế',
      },
    },
    passengerName: {
      type: String,
      required: [true, 'Tên hành khách là bắt buộc'],
      trim: true,
    },
    passengerPhone: {
      type: String,
      required: [true, 'Số điện thoại hành khách là bắt buộc'],
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Tổng số tiền là bắt buộc'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['qr', 'cash'],
      default: 'qr',
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    busType: {
      type: String,
      required: true,
    },
    busNumber: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Chỉ mục tìm vé theo người dùng hoặc theo chuyến xe nhanh chóng
ticketSchema.index({ userId: 1 });
ticketSchema.index({ tripId: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
