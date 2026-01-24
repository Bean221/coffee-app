import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthDebug } from "@/utils/auth-debug";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [showDebug, setShowDebug] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert(
        "Đăng nhập thất bại",
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại.",
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <IconSymbol
              name="cup.and.saucer.fill"
              size={64}
              color={colors.tint}
            />
            <ThemedText type="title" style={styles.title}>
              Chào mừng trở lại!
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Đăng nhập để tiếp tục
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.background,
                    borderColor: errors.email ? "#ff4444" : colors.icon + "30",
                  },
                ]}
              >
                <IconSymbol
                  name="envelope.fill"
                  size={20}
                  color={colors.icon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Nhập email của bạn"
                  placeholderTextColor={colors.icon}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && (
                <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
              )}
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Mật khẩu</ThemedText>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.background,
                    borderColor: errors.password
                      ? "#ff4444"
                      : colors.icon + "30",
                  },
                ]}
              >
                <IconSymbol name="lock.fill" size={20} color={colors.icon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={colors.icon}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <IconSymbol
                    name={showPassword ? "eye.slash.fill" : "eye.fill"}
                    size={20}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <ThemedText style={styles.errorText}>
                  {errors.password}
                </ThemedText>
              )}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.tint }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.loginButtonText}>
                  Đăng nhập
                </ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.registerLink}>
              <ThemedText style={styles.registerText}>
                Chưa có tài khoản?{" "}
              </ThemedText>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <ThemedText
                    style={[styles.registerLinkText, { color: colors.tint }]}
                  >
                    Đăng ký ngay
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </View>

            {/* DEBUG PANEL */}
            <Pressable
              onPress={() => setShowDebug(!showDebug)}
              style={styles.debugToggle}
            >
              <ThemedText style={styles.debugToggleText}>
                {showDebug ? "✖️ Ẩn Debug" : "🔧 Debug"}
              </ThemedText>
            </Pressable>

            {showDebug && (
              <View
                style={[
                  styles.debugPanel,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.icon,
                  },
                ]}
              >
                <ThemedText style={styles.debugTitle}>
                  🧪 Debug Tools
                </ThemedText>

                <TouchableOpacity
                  style={[styles.debugButton, { backgroundColor: "#4CAF50" }]}
                  onPress={async () => {
                    setDebugLoading(true);
                    try {
                      await AuthDebug.simulateLoginFlow(
                        "test@example.com",
                        "password123",
                      );
                    } catch (e) {
                      console.error("Debug error:", e);
                    } finally {
                      setDebugLoading(false);
                    }
                  }}
                  disabled={debugLoading}
                >
                  {debugLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText style={styles.debugButtonText}>
                      Test Login Flow
                    </ThemedText>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.debugButton, { backgroundColor: "#2196F3" }]}
                  onPress={async () => {
                    setDebugLoading(true);
                    try {
                      await AuthDebug.runDiagnostics();
                    } catch (e) {
                      console.error("Debug error:", e);
                    } finally {
                      setDebugLoading(false);
                    }
                  }}
                  disabled={debugLoading}
                >
                  {debugLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText style={styles.debugButtonText}>
                      Run Diagnostics
                    </ThemedText>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.debugButton, { backgroundColor: "#f44336" }]}
                  onPress={async () => {
                    setDebugLoading(true);
                    try {
                      await AuthDebug.clearStorage();
                    } catch (e) {
                      console.error("Debug error:", e);
                    } finally {
                      setDebugLoading(false);
                    }
                  }}
                  disabled={debugLoading}
                >
                  {debugLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText style={styles.debugButtonText}>
                      Clear Storage
                    </ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
  },
  registerLinkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  debugToggle: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#9C27B0",
    alignItems: "center",
  },
  debugToggleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  debugPanel: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  debugTitle: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 12,
  },
  debugButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  debugButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
  },
});
