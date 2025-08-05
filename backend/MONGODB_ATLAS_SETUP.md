# MongoDB Atlas Setup Guide

## 1. Tạo MongoDB Atlas Cluster

### Bước 1: Đăng ký MongoDB Atlas
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Đăng ký tài khoản hoặc đăng nhập
3. Tạo project mới

### Bước 2: Tạo Cluster
1. Chọn "Build a Database"
2. Chọn "FREE" tier (M0)
3. Chọn cloud provider (AWS, Google Cloud, Azure)
4. Chọn region gần nhất
5. Click "Create"

### Bước 3: Cấu hình Security
1. **Database Access**: Tạo database user
   - Click "Database Access" → "Add New Database User"
   - Username: `your_username`
   - Password: `your_secure_password`
   - Role: "Atlas admin" hoặc "Read and write to any database"

2. **Network Access**: Whitelist IP
   - Click "Network Access" → "Add IP Address"
   - Chọn "Allow Access from Anywhere" (0.0.0.0/0) cho development
   - Hoặc thêm IP cụ thể của bạn

## 2. Lấy Connection String

1. Click "Connect" trên cluster
2. Chọn "Connect your application"
3. Copy connection string:
```
mongodb+srv://<username>:<password>@<cluster-name>.<cluster-id>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

## 3. Cấu hình Environment Variables

1. Copy file `env.example` thành `.env`:
```bash
cp env.example .env
```

2. Cập nhật `.env` file:
```env
# MongoDB Atlas Configuration
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.your_id.mongodb.net/dormitory_management?retryWrites=true&w=majority

# Server Configuration
PORT=9999

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Environment
NODE_ENV=development
```

## 4. Test Connection

Chạy script test để kiểm tra kết nối:
```bash
cd backend
node scripts/testAtlasConnection.js
```

## 5. Chạy Migration Scripts (nếu cần)

Nếu bạn đã có data từ local MongoDB, chạy các script migration:

```bash
# Xóa staff users (nếu có)
node scripts/removeStaffUsers.js

# Cập nhật pending requests
node scripts/updatePendingRequests.js
```

## 6. Khởi động Server

```bash
cd backend
npm install
npm start
```

## Troubleshooting

### Lỗi thường gặp:

1. **ENOTFOUND**: Kiểm tra cluster name và network access
2. **Authentication failed**: Kiểm tra username/password
3. **ECONNREFUSED**: Kiểm tra IP whitelist
4. **Timeout**: Kiểm tra network connection
5. **buffermaxentries is not supported**: Loại bỏ deprecated options trong cấu hình

### Kiểm tra cấu hình:

```bash
# Kiểm tra phiên bản và cấu hình MongoDB
npm run check:mongo

# Test kết nối Atlas
npm run test:atlas
```

### Tips:

- Sử dụng MongoDB Compass để quản lý database trực quan
- Monitor performance trong MongoDB Atlas dashboard
- Backup data thường xuyên
- Sử dụng environment variables cho production

## Production Deployment

Khi deploy lên production:

1. Tạo production cluster riêng
2. Sử dụng environment variables
3. Whitelist IP của server
4. Enable monitoring và alerts
5. Setup automated backups 