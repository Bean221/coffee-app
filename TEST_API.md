# 🧪 Test API Connection

## Bước 1: Kiểm tra API Server

### Trên máy tính, mở trình duyệt và test:
```
http://192.168.1.43:3000/auth/register
```

Nếu thấy lỗi hoặc response, server đang chạy.

### Test bằng PowerShell:
```powershell
Invoke-WebRequest -Uri "http://192.168.1.43:3000/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"test123","name":"Test"}'
```

## Bước 2: Test từ điện thoại

### Mở trình duyệt trên điện thoại và vào:
```
http://192.168.1.43:3000
```

Nếu không mở được:
- ❌ Firewall đang chặn
- ❌ Không cùng mạng WiFi
- ❌ IP sai

Nếu mở được:
- ✅ Server OK, vấn đề ở app

## Bước 3: Fix Android HTTP Issue

Đã thêm `usesCleartextTraffic: true` vào `app.json`. 

**QUAN TRỌNG:** Sau khi sửa `app.json`, bạn CẦN rebuild app:

```bash
# Xóa cache và rebuild
npx expo start --clear

# Hoặc nếu dùng development build
npx expo prebuild --clean
npx expo run:android
```

## Bước 4: Kiểm tra Firewall Windows

1. Mở **Windows Defender Firewall**
2. Chọn **Advanced settings**
3. Vào **Inbound Rules** → **New Rule**
4. Chọn **Port** → **TCP** → **3000**
5. Cho phép connection
6. Áp dụng cho tất cả profiles

Hoặc tạm thời tắt firewall để test.

## Bước 5: Kiểm tra API Server Binding

Đảm bảo API server bind trên `0.0.0.0` (tất cả interfaces), không phải `127.0.0.1`:

```javascript
// ✅ ĐÚNG
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on 0.0.0.0:3000');
});

// ❌ SAI - chỉ bind localhost
app.listen(3000, '127.0.0.1', () => {
  console.log('Server running on 127.0.0.1:3000');
});
```

## Debug Steps

1. ✅ Server đang chạy? → `netstat -an | findstr :3000`
2. ✅ Có thể truy cập từ trình duyệt máy tính? → `http://192.168.1.43:3000`
3. ✅ Có thể truy cập từ trình duyệt điện thoại? → `http://192.168.1.43:3000`
4. ✅ App đã rebuild sau khi sửa app.json?
5. ✅ Firewall đã cho phép port 3000?
