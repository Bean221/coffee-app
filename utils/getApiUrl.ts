import { Platform } from 'react-native';

/**
 * Lấy API URL phù hợp với platform
 * Trên mobile, tự động thay localhost bằng IP address nếu có
 */
export function getApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  // Nếu đã có URL từ env, dùng luôn
  if (envUrl) {
    return envUrl;
  }

  // Default URL
  let apiUrl = 'http://localhost:3000';

  // Trên mobile, nếu dùng localhost thì cảnh báo
  if (Platform.OS !== 'web' && apiUrl.includes('localhost')) {
    console.warn(
      '⚠️ CẢNH BÁO: Đang dùng localhost trên mobile!\n' +
      'Localhost sẽ KHÔNG hoạt động trên điện thoại.\n' +
      'Vui lòng:\n' +
      '1. Tạo file .env với EXPO_PUBLIC_API_URL=http://YOUR_IP:3000\n' +
      '2. Hoặc sửa trực tiếp trong constants/api.ts\n' +
      '3. Lấy IP bằng: Windows: ipconfig | Mac/Linux: ifconfig'
    );
  }

  return apiUrl;
}
