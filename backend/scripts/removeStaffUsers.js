const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Kết nối MongoDB Atlas
const connectToAtlas = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(mongoURI, options);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB Atlas:', error.message);
        process.exit(1);
    }
};

const removeStaffUsers = async () => {
    try {
        await connectToAtlas();
        
        console.log('🔄 Đang xóa tất cả user có role staff...');
        
        // Tìm tất cả user có role staff
        const staffUsers = await User.find({ role: 'staff' });
        console.log(`📋 Tìm thấy ${staffUsers.length} user có role staff`);
        
        if (staffUsers.length > 0) {
            console.log('📋 Danh sách user sẽ bị xóa:');
            staffUsers.forEach(user => {
                console.log(`- ${user.fullname} (${user.email}) - ${user.role}`);
            });
            
            // Xóa tất cả user có role staff
            const result = await User.deleteMany({ role: 'staff' });
            console.log(`✅ Đã xóa ${result.deletedCount} user có role staff`);
        } else {
            console.log('ℹ️ Không có user nào có role staff');
        }
        
        console.log('✅ Hoàn thành việc xóa staff users');
    } catch (error) {
        console.error('❌ Lỗi khi xóa staff users:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Đã đóng kết nối MongoDB Atlas');
    }
};

// Chạy script
removeStaffUsers(); 