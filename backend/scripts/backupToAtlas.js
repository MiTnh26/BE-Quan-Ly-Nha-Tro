const mongoose = require('mongoose');
require('dotenv').config();

// Import tất cả models
const User = require('../models/User');
const Room = require('../models/Room');
const Contract = require('../models/Contract');
const Invoice = require('../models/Invoice');
const Request = require('../models/Request');
const Post = require('../models/Post');
const HouseService = require('../models/HouseService');
const Deposit = require('../models/Deposit');
const Assign = require('../models/Assign');
const PendingTenantRequest = require('../models/PendingTenantRequest');

const backupToAtlas = async () => {
    try {
        console.log('🔄 Starting backup to MongoDB Atlas...');
        
        // Kết nối Atlas
        const atlasURI = process.env.MONGO_URI;
        if (!atlasURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        const atlasOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(atlasURI, atlasOptions);
        console.log('✅ Connected to MongoDB Atlas');

        // Backup từng collection
        const collections = [
            { name: 'users', model: User },
            { name: 'rooms', model: Room },
            { name: 'contracts', model: Contract },
            { name: 'invoices', model: Invoice },
            { name: 'requests', model: Request },
            { name: 'posts', model: Post },
            { name: 'house_services', model: HouseService },
            { name: 'deposits', model: Deposit },
            { name: 'assigns', model: Assign },
            { name: 'pending_requests', model: PendingTenantRequest }
        ];

        for (const collection of collections) {
            try {
                const count = await collection.model.countDocuments();
                console.log(`📊 ${collection.name}: ${count} documents`);
                
                if (count > 0) {
                    console.log(`✅ ${collection.name} already has data`);
                } else {
                    console.log(`ℹ️ ${collection.name} is empty`);
                }
            } catch (error) {
                console.log(`⚠️ Error checking ${collection.name}:`, error.message);
            }
        }

        console.log('✅ Backup check completed');
        
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
    }
};

// Chạy backup
backupToAtlas(); 