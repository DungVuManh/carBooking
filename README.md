# 🚌 Bus Booking System

A full-stack Bus Booking System that allows passengers to search trips, book bus tickets, choose seats, pay online, and manage bookings. The system also provides an Admin Dashboard for managing routes, trips, bookings, and revenue statistics.

---

## 📂 Project Structure

```
carBooking
│
├── backend       # Node.js + Express + MongoDB backend API
│
├── web           # React + Vite Admin Dashboard (Web)
│
└── mobile        # React Native Passenger App (Coming Soon)
```

---

## 🚀 Setup & Installation Guide

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)

### 1. Backend Setup

1. Mở terminal và di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Tạo file `.env` trong thư mục `backend` (hoặc sử dụng file `.env` đã có) và cấu hình các biến môi trường:
   ```env
   MONGO_URI=mongodb://localhost:27017/carBooking  # Hoặc link MongoDB Atlas của bạn
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. **(Quan trọng)** Tạo tài khoản Admin đầu tiên để có thể đăng nhập vào web:
   ```bash
   node createAdmin.js
   ```
   _Tài khoản mặc định được tạo:_
   - **Email:** `admin@gmail.com`
   - **Mật khẩu:** `Admin2026`

### 2. Web Admin Dashboard Setup

1. Mở một terminal mới và di chuyển vào thư mục `web`:
   ```bash
   cd web
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```

---

## 🏃 Khởi chạy Project

Để hệ thống hoạt động đầy đủ, bạn cần chạy song song cả 2 môi trường (Backend và Web).

**Bước 1: Chạy Backend Server**
Mở terminal ở thư mục `backend` và chạy:

```bash
npm run dev
```

_(Server sẽ chạy tại `http://localhost:3000`)_

**Bước 2: Chạy Web Admin Dashboard**
Mở terminal ở thư mục `web` và chạy:

```bash
npm run dev
```

_(Web sẽ chạy tại `http://localhost:5173` - Cổng mặc định của Vite)_

**Bước 3: Chạy Mobile App**
Mở terminal ở thư mục `mobile/Car_Booking` và chạy:

```bash
npm start
```

_(Ứng dụng sẽ mở giao diện Expo. Bạn có thể sử dụng ứng dụng Expo Go trên điện thoại để quét mã QR hoặc chạy trên Emulator/Simulator)_

Sau khi chạy xong, hãy mở trình duyệt vào địa chỉ của Web Admin và đăng nhập bằng tài khoản Admin đã tạo ở bước trên! Hoặc sử dụng ứng dụng Mobile để trải nghiệm dưới góc độ hành khách.

---

## ✨ Các Tính Năng Chính

### 💻 Admin Dashboard (Web)

- **Authentication:** Đăng nhập an toàn bằng JWT.
- **Route Management:** Quản lý các tuyến đường (Thêm, Sửa, Xóa).
- **Trip Management:** Quản lý chuyến xe chạy theo ngày, giờ xuất phát, giá vé.
- **Booking Management:** Xác nhận hành khách lên xe, xem trạng thái vé.
- **Revenue Statistics:** Báo cáo tổng quan doanh thu, vé bán ra, và vé bị hủy.

### 📱 Passenger Mobile App (Dự kiến)

- **Authentication:** Login với Google, Email.
- **Search Trips:** Tìm chuyến đi theo điểm đi, điểm đến, ngày giờ.
- **Seat Selection:** Chọn ghế trống trên sơ đồ xe.
- **Booking & Payment:** Đặt vé và thanh toán qua QR.
- **Booking History:** Quản lý lịch sử chuyến đi và hủy vé.

---

## 🛠 Công Nghệ Sử Dụng

- **Frontend (Admin):** React, Vite, CSS thuần.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB, Mongoose.
- **Authentication:** JWT, bcryptjs.
