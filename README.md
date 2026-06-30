# 🚌 Bus Booking System

A full-stack Bus Booking System that allows passengers to search trips, book bus tickets, choose seats, pay online, and manage bookings. The system also provides an Admin Dashboard for managing routes, trips, bookings, and revenue statistics.

---

# 📌 Project Overview

The project consists of two applications:

- 📱 Mobile App (React Native + Expo) for passengers.
- 💻 Web Dashboard (React + Material UI) for administrators.

Backend is developed using **Node.js**, **Express.js**, and **MongoDB**.

---

# 🚀 Technologies

## Frontend (Passenger App)

- React Native (Expo)
- TypeScript
- React Navigation
- React Hooks
- Firebase Authentication
- Axios

---

## Admin Dashboard

- React
- TypeScript
- Material UI
- React Router
- Axios

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Firebase Admin SDK
- RESTful API

---

## Database

- MongoDB Atlas

---

# ✨ Main Features

## Passenger Mobile App

### UC01 - Register / Login

- Login with Google
- Login with Gmail
- Firebase Authentication

---

### UC02 - Profile Management

Passengers can:

- Update full name
- Update phone number

---

### UC03 - Search Trips

Search available trips by:

- Departure
- Destination
- Departure Date

---

### UC04 - Seat Selection

- Interactive seat map
- Display available seats
- Select preferred seats

---

### UC05 - Booking & Payment

Passengers can:

- Enter passenger information
- Select seats
- Pay via QR Payment

---

### UC06 - Booking History

View:

- Booking history
- Booking status

---

### UC07 - Cancel Booking

Passengers can cancel bookings if:

- The booking was created within 12 hours.

---

### UC08 - Customer Support Chat

Passengers can chat directly with Customer Support.

---

### UC09 - Trip Reminder Notification

Receive Push Notifications before departure.

---

# 👨‍💼 Admin Dashboard

### UC10 - Admin Login

Admin authentication.

---

### UC11 - Route Management

CRUD Operations

- Create Route
- Read Route
- Update Route
- Delete Route

Example:

```
Ha Noi → Hai Phong
```

---

### UC12 - Trip Management

Manage:

- Departure time
- Ticket price
- Bus license plate
- Route assignment

---

### UC13 - Booking Management

Admin can:

- View bookings
- Confirm passengers
- Update booking status

---

### UC14 - Revenue Statistics

Dashboard displays:

- Total Revenue
- Total Tickets Sold
- Revenue Reports

---

### UC15 - Customer Support

Reply to customer messages.

---

### UC16 - Admin Notifications

Receive notifications when customers send new messages.

---

# 📂 Project Structure

```
project
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── config
│   └── app.js
│
├── mobile
│   ├── src
│   │   ├── components
│   │   ├── screens
│   │   ├── navigation
│   │   ├── services
│   │   ├── hooks
│   │   ├── utils
│   │   └── types
│
├── admin
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── layouts
│   │   ├── services
│   │   ├── routes
│   │   └── hooks
│
└── README.md
```

---

# 🔥 System Workflow

```
Passenger
      │
      ▼
Search Trip
      │
      ▼
Choose Seat
      │
      ▼
Booking
      │
      ▼
QR Payment
      │
      ▼
Booking History
```

---

# 📱 Passenger Features

- Authentication
- Search Trips
- Seat Selection
- Booking
- QR Payment
- Booking History
- Cancel Booking
- Chat Support
- Push Notification
- Profile Management

---

# 💻 Admin Features

- Login
- Dashboard
- Route Management
- Trip Management
- Booking Management
- Revenue Statistics
- Customer Support
- Notification Center

---

# 🔐 Authentication

Passenger

- Firebase Authentication
- Google Sign-In
- Email & Password

Administrator

- JWT Authentication

---

# 📊 Database

Main Collections

- Users
- Routes
- Trips
- Buses
- Seats
- Bookings
- Payments
- Messages
- Notifications

---

# 🎯 Future Improvements

- Online payment gateway integration
- Real-time seat synchronization
- Voucher & Promotion system
- Loyalty points
- Multi-language support
- Dark Mode
- AI Customer Support
- Route recommendation system

---

# 👨‍💻 Authors

Bus Booking System

Developed as a university project using React Native, React, Node.js, Express.js, MongoDB, and Firebase.