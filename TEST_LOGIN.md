# Hướng dẫn Test Login

## 1. Xác nhận API Server đang chạy

```bash
# Kiểm tra xem server đã chạy trên cổng 3000 chưa
# Mở trình duyệt hoặc Terminal:
curl http://192.168.1.43:3000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
```

## 2. Kiểm tra API Response

Khi gọi login, API **PHẢI** trả về response như sau:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "name": "Tên người dùng"
  }
}
```

**⚠️ QUAN TRỌNG:**

- Field `token` **phải có** (bắt buộc)
- Field `user` **phải có** (bắt buộc, chứa `id`, `email`, `name`)

## 3. Xem Console Logs

Khi test trên app, xem console logs để follow flow:

```
🔑 Attempting login...
🌐 API Request: http://192.168.1.43:3000/api/auth/login
✅ API Response Status: 200
✅ API Response Data: {...}
✅ Login successful, token received
📋 User data in response
🔄 Updating auth state
🔐 Auth state changed: { isAuthenticated: true, token: true, user: true, userEmail: "..." }
✅ User authenticated, navigating to /(tabs)
```

## 4. Nếu login không hoạt động

### Symptom: Login button không làm gì

- Kiểm tra xem `handleLogin` có gọi không (check console)
- Kiểm tra validation có pass không

### Symptom: API call thành công nhưng không chuyển screen

- Check console xem có `setToken` và `setUser` không
- Check xem API response có field `token` và `user` không
- Kiểm tra `SecureStore.setItemAsync` có save dữ liệu không

### Symptom: API call lỗi

- Kiểm tra IP address trong `constants/api.ts` (nên là IP của máy tính, không phải localhost)
- Kiểm tra server có chạy không
- Kiểm tra firewall có chặn port 3000 không
- Kiểm tra điện thoại và máy tính có cùng mạng WiFi không

## 5. Rebuild App

Nếu sửa `constants/api.ts`, phải rebuild app:

```bash
npx expo start --clear
```

Sau đó restart Expo Go app trên điện thoại
