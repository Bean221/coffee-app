# 🔧 Fix Lỗi Network Error trên Điện Thoại

## Vấn đề
Khi test app trên điện thoại, bạn gặp lỗi "Network error" hoặc "Không thể kết nối đến server".

## Nguyên nhân
Trên điện thoại, `localhost` hoặc `127.0.0.1` sẽ trỏ về chính điện thoại, không phải máy tính của bạn. Do đó app không thể kết nối đến API server chạy trên máy tính.

## ✅ Giải pháp

### Bước 1: Lấy IP Address của máy tính

**Windows:**
```bash
ipconfig
```
Tìm dòng `IPv4 Address` (ví dụ: `192.168.1.43`)

**Mac/Linux:**
```bash
ifconfig
```
Tìm dòng `inet` (ví dụ: `192.168.1.43`)

### Bước 2: Cấu hình API URL

**Cách 1: Sửa trực tiếp trong code (Nhanh nhất)**

Mở file `constants/api.ts` và thay đổi:
```typescript
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.43:3000';
```
(Thay `192.168.1.43` bằng IP của bạn)

**Cách 2: Dùng biến môi trường (Khuyến nghị)**

1. Tạo file `.env` trong thư mục gốc:
```
EXPO_PUBLIC_API_URL=http://192.168.1.43:3000
```

2. Khởi động lại Expo:
```bash
npm start
```

### Bước 3: Kiểm tra

1. ✅ Đảm bảo API server đang chạy trên máy tính
2. ✅ Đảm bảo điện thoại và máy tính cùng mạng WiFi
3. ✅ Đảm bảo firewall không chặn port 3000
4. ✅ Thử mở `http://YOUR_IP:3000` trên trình duyệt điện thoại để test

### Bước 4: Test lại app

Sau khi cấu hình xong, thử đăng ký/đăng nhập lại trên điện thoại.

## 🔍 Debug

Nếu vẫn lỗi, kiểm tra:

1. **Console logs**: Mở Metro bundler và xem log để biết URL nào đang được gọi
2. **API server**: Đảm bảo server đang chạy và có thể truy cập từ mạng local
3. **Firewall**: Tắt tạm thời firewall để test
4. **Port**: Đảm bảo port 3000 không bị chặn

## 📝 Lưu ý

- IP address có thể thay đổi mỗi khi kết nối WiFi mới
- Nếu IP thay đổi, cần cập nhật lại API URL
- Khi deploy lên production, dùng domain thay vì IP
