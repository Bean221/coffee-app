import { apiService } from "@/services/api";
import * as SecureStore from "expo-secure-store";

/**
 * Debug utilities for authentication
 * Sử dụng để test và troubleshoot login flow
 */

export const AuthDebug = {
  /**
   * Test API login endpoint
   */
  async testLoginAPI(email: string, password: string) {
    try {
      console.log("\n🧪 Testing Login API...");
      console.log("📧 Email:", email);
      console.log("🌐 API URL:", "http://192.168.1.43:3000/api/auth/login");

      const response = await apiService.login({ email, password });

      console.log("\n✅ API Response Structure:");
      console.log("  - Full Response:", response);
      console.log("  - Has token?", !!response.token);
      console.log("  - Has user?", !!response.user);
      console.log(
        "  - Token (first 20 chars):",
        response.token ? response.token.substring(0, 20) + "..." : "MISSING ❌",
      );
      console.log("  - User:", response.user);

      return response;
    } catch (error) {
      console.error("\n❌ API Error:");
      console.error("  -", error instanceof Error ? error.message : error);
      if (error instanceof Error) {
        console.error("  - Error Stack:", error.stack);
      }
      throw error;
    }
  },

  /**
   * Xem token đã lưu trong SecureStore
   */
  async checkStoredToken() {
    try {
      console.log("\n🔍 Checking Stored Token...");
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        console.log(
          "✅ Token found (first 20 chars):",
          token.substring(0, 20) + "...",
        );
        return token;
      } else {
        console.log("❌ No token found in SecureStore");
        return null;
      }
    } catch (error) {
      console.error("❌ Error reading token:", error);
    }
  },

  /**
   * Xem user data đã lưu trong SecureStore
   */
  async checkStoredUser() {
    try {
      console.log("\n🔍 Checking Stored User...");
      const userStr = await SecureStore.getItemAsync("user_data");
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("✅ User found:", user);
        return user;
      } else {
        console.log("❌ No user found in SecureStore");
        return null;
      }
    } catch (error) {
      console.error("❌ Error reading user:", error);
    }
  },

  /**
   * Clear all stored auth data
   */
  async clearStorage() {
    try {
      console.log("\n🗑️ Clearing Auth Storage...");
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("user_data");
      console.log("✅ Storage cleared");
    } catch (error) {
      console.error("❌ Error clearing storage:", error);
    }
  },

  /**
   * Test API profile endpoint
   */
  async testProfileAPI(token: string) {
    try {
      console.log("\n🧪 Testing Profile API...");
      const profile = await apiService.getProfile(token);
      console.log("✅ Profile Response:", profile);
      return profile;
    } catch (error) {
      console.error("❌ Profile Error:", error);
      throw error;
    }
  },

  /**
   * Simulate login flow
   */
  async simulateLoginFlow(email: string, password: string) {
    try {
      console.log("\n🔐 Simulating Complete Login Flow...\n");

      // Step 1: Test API
      console.log("Step 1️⃣: Testing API Login...");
      const loginResponse = await this.testLoginAPI(email, password);

      // Step 2: Check response
      console.log("\nStep 2️⃣: Validating Response...");
      if (!loginResponse.token) {
        throw new Error("❌ Response missing token field");
      }
      console.log("✅ Token field present");

      if (!loginResponse.user) {
        console.log(
          "⚠️ Response missing user field, will fetch from profile endpoint",
        );
      } else {
        console.log("✅ User field present:", loginResponse.user);
      }

      // Step 3: Save to storage
      console.log("\nStep 3️⃣: Saving to SecureStore...");
      await SecureStore.setItemAsync("auth_token", loginResponse.token);
      console.log("✅ Token saved");

      if (loginResponse.user) {
        await SecureStore.setItemAsync(
          "user_data",
          JSON.stringify(loginResponse.user),
        );
        console.log("✅ User data saved");
      }

      // Step 4: Verify storage
      console.log("\nStep 4️⃣: Verifying Storage...");
      await this.checkStoredToken();
      await this.checkStoredUser();

      console.log("\n✅ Login simulation complete!");
      return loginResponse;
    } catch (error) {
      console.error("\n❌ Login simulation failed:", error);
      throw error;
    }
  },

  /**
   * Full diagnostic report
   */
  async runDiagnostics() {
    try {
      console.log("\n\n════════════════════════════════════════");
      console.log("📊 AUTHENTICATION DIAGNOSTICS");
      console.log("════════════════════════════════════════\n");

      await this.checkStoredToken();
      await this.checkStoredUser();

      console.log("\n════════════════════════════════════════\n");
    } catch (error) {
      console.error("Diagnostic error:", error);
    }
  },
};

/**
 * 🧪 HOW TO USE IN DEVELOPMENT:
 *
 * 1. Import in your login screen or any component:
 *    import { AuthDebug } from '@/utils/auth-debug';
 *
 * 2. Test in your component's debug function:
 *    const handleDebugLogin = async () => {
 *      await AuthDebug.simulateLoginFlow('test@example.com', 'password123');
 *    };
 *
 * 3. Or call directly in console:
 *    AuthDebug.runDiagnostics();
 *    AuthDebug.simulateLoginFlow('test@example.com', 'password123');
 *    AuthDebug.clearStorage();
 *
 * 4. After fixing the issue, remove debug code
 */
