// API Configuration
// Thay đổi BASE_URL theo địa chỉ API của bạn
// 
// ⚠️ QUAN TRỌNG khi test trên điện thoại:
// - KHÔNG dùng localhost (sẽ KHÔNG hoạt động trên điện thoại!)
// - Phải dùng IP address của máy tính, ví dụ: http://192.168.1.43:3000
// - Để lấy IP: 
//   * Windows: mở CMD và gõ: ipconfig (tìm IPv4 Address)
//   * Mac/Linux: mở Terminal và gõ: ifconfig (tìm inet)
// - Đảm bảo điện thoại và máy tính cùng mạng WiFi
// - Đảm bảo firewall không chặn port 3000
//
// Cách 1: Sửa trực tiếp dòng dưới (thay 192.168.1.43 bằng IP của bạn)
// Cách 2: Tạo file .env với: EXPO_PUBLIC_API_URL=http://YOUR_IP:3000
//
// IP hiện tại của máy này: 192.168.1.43
// Ví dụ: http://192.168.1.43:3000 hoặc https://your-api-domain.com
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.43:3000';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
  },
};
