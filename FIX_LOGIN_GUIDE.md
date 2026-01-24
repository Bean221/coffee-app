# ✨ Fix Login System - Comprehensive Guide

## Các vấn đề đã tìm thấy và fix

### ✅ 1. **Authentication State Flow**

- **Vấn đề**: State update không đồng bộ, token lưu xong nhưng user state chưa update
- **Fix**: Đơn giản hóa logic, lưu token và user, sau đó cập nhật state

### ✅ 2. **SecureStore Data Consistency**

- **Vấn đề**: Có thể lưu dữ liệu vào storage nhưng state chưa update
- **Fix**: Lưu tất cả dữ liệu trước khi update state

### ✅ 3. **Better Error Handling & Logging**

- **Fix**: Thêm chi tiết logs để dễ debug

---

## 📋 Checklist để Login hoạt động

### 1. API Server Config ✓

Kiểm tra file `constants/api.ts`:

```typescript
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.43:3000";
```

**QUAN TRỌNG**: Đổi `192.168.1.43` thành IP của máy tính bạn

- **Windows**: Mở CMD, gõ `ipconfig`, tìm dòng `IPv4 Address`
- **Mac/Linux**: Mở Terminal, gõ `ifconfig`, tìm dòng `inet`

### 2. API Server Running ✓

Đảm bảo server chạy trên port 3000:

```bash
# Kiểm tra trong terminal
curl http://192.168.1.43:3000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

API phải return:

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

### 3. Rebuild App ✓

Sau khi sửa config, rebuild app:

```bash
npx expo start --clear
```

Restart Expo Go app trên điện thoại.

### 4. Test Login ✓

Trong login screen có **🔧 Debug button** để test:

- Nhấp vào nút **🔧 Debug**
- Nhấp vào **Test Login Flow**
- Xem logs để follow flow

---

## 🔍 Debug Tools (Có sẵn trong Login Screen)

### 1. Test Login Flow

```
Chạy: Test Login Flow
Xem các bước:
  ✅ Step 1: Testing API Login...
  ✅ Step 2: Validating Response...
  ✅ Step 3: Saving to SecureStore...
  ✅ Step 4: Verifying Storage...
```

### 2. Run Diagnostics

```
Chạy: Run Diagnostics
Kết quả:
  - Kiểm tra token đã lưu
  - Kiểm tra user đã lưu
```

### 3. Clear Storage

```
Chạy: Clear Storage
Kết quả: Xóa tất cả auth data
```

---

## 🧠 Cách hoạt động của Login

```
User enters email/password
         ↓
handleLogin() validation
         ↓
login() function in AuthContext
         ↓
apiService.login() API call
         ↓
Response check:
  - Has token? ✓
  - Has user? ✓ (or fetch from profile endpoint)
         ↓
Save to SecureStore:
  - auth_token
  - user_data
         ↓
Update state:
  - setToken()
  - setUser()
         ↓
useEffect detects change
         ↓
Navigate to /(tabs)
```

---

## 🐛 Troubleshooting

### ❌ Login button không làm gì

**Kiểm tra:**

1. Xem console có logs không (kiểm tra Expo Go console)
2. Validation có pass không
3. Nhập đúng format email không

**Fix:**

```bash
npx expo start --clear
# Restart app trên điện thoại
```

### ❌ API call lỗi

**Kiểm tra:**

1. API server có chạy không
2. IP address trong `constants/api.ts` có đúng không
3. Điện thoại và máy tính có cùng mạng WiFi không
4. Firewall có chặn port 3000 không

**Fix:**

```bash
# 1. Kiểm tra server
curl http://YOUR_IP:3000/api/auth/login -X POST ...

# 2. Sửa IP trong constants/api.ts
export const API_BASE_URL = 'http://YOUR_CORRECT_IP:3000';

# 3. Rebuild app
npx expo start --clear
```

### ❌ API thành công nhưng login vẫn không hoạt động

**Kiểm tra:**

1. API response có field `token` không?
2. API response có field `user` không?
3. SecureStore có lưu dữ liệu không? (dùng "Run Diagnostics")

**Kiểm tra API response:**

```bash
curl http://192.168.1.43:3000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Response phải có:

```json
{
  "token": "...", // ← BẮTBUỘC
  "user": {
    // ← BẮTBUỘC
    "id": "...",
    "email": "...",
    "name": "..."
  }
}
```

---

## 📝 Files đã sửa

1. **AuthContext.tsx** - Fix login/register flow
2. **login.tsx** - Thêm debug tools
3. **auth-debug.ts** - Utility để test
4. **TEST_LOGIN.md** - File này

---

## 💡 Tips

1. **Dùng debug tools** để test flow bước từng bước
2. **Xem console logs** để hiểu chính xác điều gì đang xảy ra
3. **Rebuild app** mỗi khi sửa config
4. **Clear storage** nếu có error lạ

---

## 🚀 Next Steps

1. ✅ Sửa IP address trong `constants/api.ts`
2. ✅ Rebuild app
3. ✅ Test login bằng debug tools
4. ✅ Xem console logs
5. ✅ Fix any issues
6. ✅ Xóa debug panel khi done (optional)
