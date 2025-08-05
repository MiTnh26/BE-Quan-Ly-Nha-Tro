const mongoose = require('mongoose');
const PendingTenantRequest = require('../models/PendingTenantRequest');
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

const updatePendingRequests = async () => {
    try {
        await connectToAtlas();
        
        console.log('🔄 Đang cập nhật PendingTenantRequest...');
        
        // Tìm tất cả pending requests có staffId
        const pendingRequests = await PendingTenantRequest.find({ staffId: { $exists: true } });
        console.log(`📋 Tìm thấy ${pendingRequests.length} pending requests cần cập nhật`);
        
        if (pendingRequests.length > 0) {
            console.log('📋 Đang cập nhật...');
            
            for (const request of pendingRequests) {
                // Lưu staffId vào adminId và xóa staffId
                await PendingTenantRequest.findByIdAndUpdate(request._id, {
                    $set: { adminId: request.staffId },
                    $unset: { staffId: 1 }
                });
                console.log(`✅ Đã cập nhật request ${request._id}`);
            }
            
            console.log(`✅ Đã cập nhật ${pendingRequests.length} pending requests`);
        } else {
            console.log('ℹ️ Không có pending requests nào cần cập nhật');
        }
        
        console.log('✅ Hoàn thành việc cập nhật PendingTenantRequest');
    } catch (error) {
        console.error('❌ Lỗi khi cập nhật PendingTenantRequest:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Đã đóng kết nối MongoDB Atlas');
    }
};

// Chạy script
updatePendingRequests(); 