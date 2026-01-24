# Hướng dẫn cấu hình Authentication

## Cấu hình API URL

Để cấu hình địa chỉ API của bạn, bạn có 2 cách:

### Cách 1: Sử dụng biến môi trường (Khuyến nghị)

1. Tạo file `.env` trong thư mục gốc của project:
```
EXPO_PUBLIC_API_URL=http://your-api-url.com/api
```

2. Khởi động lại Expo server:
```bash
npm start
```

### Cách 2: Sửa trực tiếp trong code

Mở file `constants/api.ts` và thay đổi giá trị `API_BASE_URL`:

```typescript
export const API_BASE_URL = 'http://your-api-url.com/api';
```

## API Endpoints cần thiết

App này yêu cầu các API endpoints sau:

### 1. POST /auth/register
Đăng ký tài khoản mới

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Tên người dùng"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "Tên người dùng"
  }
}
```

### 2. POST /auth/login
Đăng nhập

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "Tên người dùng"
  }
}
```

### 3. GET /auth/profile
Lấy thông tin profile (yêu cầu JWT token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "Tên người dùng"
}
```

## Tính năng đã triển khai

✅ Đăng ký tài khoản mới
✅ Đăng nhập
✅ Lưu trữ JWT token an toàn (sử dụng expo-secure-store)
✅ Protected routes - tự động chuyển hướng đến login nếu chưa đăng nhập
✅ Hiển thị thông tin người dùng trên màn hình chính
✅ Đăng xuất
✅ Validation form
✅ Loading states
✅ Error handling

## Cấu trúc files

- `constants/api.ts` - Cấu hình API
- `services/api.ts` - API service layer
- `contexts/AuthContext.tsx` - Authentication context
- `app/login.tsx` - Màn hình đăng nhập
- `app/register.tsx` - Màn hình đăng ký
- `components/ProtectedRoute.tsx` - Component bảo vệ routes

## Sử dụng

Sau khi cấu hình API URL, app sẽ:
1. Hiển thị màn hình login nếu chưa đăng nhập
2. Tự động chuyển đến màn hình chính sau khi đăng nhập/đăng ký thành công
3. Lưu token và tự động đăng nhập lại khi mở app lần sau
4. Yêu cầu đăng nhập lại nếu token không hợp lệ
