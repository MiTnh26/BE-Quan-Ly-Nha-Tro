const mongoose = require('mongoose');
require('dotenv').config();

const testAtlasConnection = async () => {
    try {
        console.log('🔄 Testing MongoDB Atlas connection...');
        
        const mongoURI = process.env.MONGO_URI;
        
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        console.log('📋 Connection string format:', mongoURI.substring(0, 50) + '...');

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(mongoURI, options);
        console.log('✅ Successfully connected to MongoDB Atlas');
        
        // Test database operations
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('📋 Available collections:', collections.map(col => col.name));
        
        // Test a simple query
        const User = require('../models/User');
        const userCount = await User.countDocuments();
        console.log(`📊 Total users in database: ${userCount}`);
        
        console.log('✅ All tests passed! MongoDB Atlas is working correctly');
        
    } catch (error) {
        console.error('❌ MongoDB Atlas connection test failed:', error.message);
        
        if (error.message.includes('ENOTFOUND')) {
            console.log('💡 Tip: Check if your cluster name and network access are correct');
        } else if (error.message.includes('Authentication failed')) {
            console.log('💡 Tip: Check your username and password in the connection string');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 Tip: Check if your IP address is whitelisted in MongoDB Atlas');
        }
        
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
    }
};

// Chạy test
testAtlasConnection(); 