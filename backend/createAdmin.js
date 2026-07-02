import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Kết nối database thành công...');
    
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    
    if (adminExists) {
      console.log('Tài khoản admin đã tồn tại! (admin@gmail.com)');
      process.exit(0);
    }
    
    await User.create({
      name: 'Quản trị viên',
      email: 'admin@gmail.com',
      password: 'Admin2026',
      phone: '0987654321',
      role: 'admin',
    });
    
    console.log('Khởi tạo tài khoản admin thành công!');
    console.log('Email: admin@gmail.com');
    console.log('Password: Admin2026');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khởi tạo admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
