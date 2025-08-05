const mongoose = require('mongoose');
require('dotenv').config();

const checkMongoVersion = async () => {
    try {
        console.log('🔍 Checking MongoDB configuration...');
        
        // Kiểm tra phiên bản mongoose
        console.log(`📦 Mongoose version: ${mongoose.version}`);
        
        // Kiểm tra phiên bản MongoDB driver
        const mongoVersion = mongoose.mongo.getMongoClient().topology.s.options;
        console.log('📦 MongoDB driver options:', mongoVersion);
        
        // Test connection với options tối ưu
        const mongoURI = process.env.MONGO_URI;
        
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        console.log('🔄 Testing connection with optimized options...');

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(mongoURI, options);
        console.log('✅ Connection successful with optimized options');
        
        // Test database operations
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('📋 Available collections:', collections.map(col => col.name));
        
        console.log('✅ All configuration checks passed!');
        
    } catch (error) {
        console.error('❌ Configuration check failed:', error.message);
        
        if (error.message.includes('buffermaxentries')) {
            console.log('💡 Tip: Remove deprecated options like bufferMaxEntries and bufferCommands');
        } else if (error.message.includes('useNewUrlParser')) {
            console.log('💡 Tip: These options are now default in newer versions');
        }
        
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
    }
};

// Chạy check
checkMongoVersion(); 