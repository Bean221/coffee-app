import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log("🌐 API Request:", url);
      console.log("📦 Request Body:", options.body || "N/A");

      // Thêm timeout 10 giây
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("✅ API Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Lỗi ${response.status}: ${response.statusText}`,
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ API Response Data:", data);
      return data;
    } catch (error) {
      console.error("❌ API Error Details:", {
        url,
        error: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : "Unknown",
      });

      if (error instanceof Error) {
        // Timeout error
        if (error.name === "AbortError" || error.message.includes("aborted")) {
          throw new Error(
            "Request timeout. Server không phản hồi trong 10 giây. Vui lòng kiểm tra server có đang chạy không.",
          );
        }

        // Network error
        if (
          error.message.includes("Network request failed") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError") ||
          error.message.includes("Network request failed")
        ) {
          throw new Error(
            "❌ Không thể kết nối đến server!\n\n" +
              "Vui lòng kiểm tra:\n" +
              "1. ✅ API server đã chạy chưa? (http://192.168.1.43:3000)\n" +
              "2. ✅ Điện thoại và máy tính có cùng mạng WiFi không?\n" +
              "3. ✅ Firewall có chặn port 3000 không?\n" +
              "4. ✅ Thử mở http://192.168.1.43:3000 trên trình duyệt điện thoại\n" +
              "5. ✅ Đã rebuild app sau khi sửa app.json? (npx expo start --clear)",
          );
        }
        throw error;
      }
      throw new Error(
        "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và địa chỉ API.",
      );
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    // --- SỬA Ở ĐÂY ---
    // 1. Ưu tiên lấy token từ 'access_token' (theo Postman) hoặc 'token'
    const finalToken = response.access_token || response.token;

    // Log để debug xem nó nhận được gì
    console.log("🔐 Login Token Check:", {
      receivedToken: finalToken ? "YES" : "NO",
      keyFromBackend: response.access_token ? "access_token" : "token",
    });

    // 2. Validate: Kiểm tra biến finalToken thay vì response.token
    if (!finalToken) {
      console.error("❌ ERROR: No token found");
      throw new Error(
        "Đăng nhập thất bại: Server không trả về 'access_token' hoặc 'token'.",
      );
    }

    // 3. QUAN TRỌNG: Map lại dữ liệu để trả về đúng format mà AuthContext cần
    // AuthContext đang đợi .token, nên ta gán access_token vào đó luôn.
    return {
      ...response,
      token: finalToken, // Gán giá trị này để các file khác gọi .token không bị lỗi
    };
  }

  async getProfile(token: string): Promise<UserProfile> {
    return this.request<UserProfile>(API_ENDPOINTS.AUTH.PROFILE, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();
