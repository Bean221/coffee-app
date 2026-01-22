import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <IconSymbol name="cup.and.saucer.fill" size={80} color="#6f4e37" style={styles.icon} />
      <ThemedText type="title" style={styles.title}>
        ☕ Quản lý Cà phê
      </ThemedText>
      <ThemedText style={styles.description}>
        Ứng dụng quản lý mua bán cà phê chuyên nghiệp
      </ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Về trang chủ</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 30,
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
