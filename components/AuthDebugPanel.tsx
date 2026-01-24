import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthDebug } from "@/utils/auth-debug";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export function AuthDebugPanel() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string>("");

  const addLog = (message: string) => {
    setLogs((prev) => prev + message + "\n");
  };

  // Override console.log to capture logs
  React.useEffect(() => {
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog(...args);
      addLog(
        args
          .map((arg) =>
            typeof arg === "object"
              ? JSON.stringify(arg, null, 2)
              : String(arg),
          )
          .join(" "),
      );
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  const handleTest = async (fn: () => Promise<any>) => {
    setLoading(true);
    setLogs("");
    try {
      await fn();
    } catch (error) {
      addLog(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        🧪 Auth Debug Panel
      </ThemedText>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={() => handleTest(() => AuthDebug.runDiagnostics())}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>📊 Diagnostics</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={() =>
            handleTest(() =>
              AuthDebug.simulateLoginFlow("test@example.com", "password123"),
            )
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>🔐 Test Login</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF9800" }]}
          onPress={() => handleTest(() => AuthDebug.checkStoredToken())}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>🔑 Check Token</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2196F3" }]}
          onPress={() => handleTest(() => AuthDebug.checkStoredUser())}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>👤 Check User</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#f44336" }]}
          onPress={() => handleTest(() => AuthDebug.clearStorage())}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>🗑️ Clear Storage</ThemedText>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[
          styles.logs,
          { backgroundColor: colors.background, borderColor: colors.icon },
        ]}
      >
        <ThemedText style={styles.logsText}>
          {logs || "(logs will appear here)"}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  buttonGroup: {
    gap: 8,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  logs: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  logsText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
});
