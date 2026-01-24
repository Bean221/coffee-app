import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const stats = [
    { label: 'Tổng đơn hàng', value: '24', icon: 'cart.fill', color: '#0a7ea4' },
    { label: 'Sản phẩm', value: '12', icon: 'cup.and.saucer.fill', color: '#6f4e37' },
    { label: 'Doanh thu hôm nay', value: '2.5M', icon: 'dollarsign.circle.fill', color: '#28a745' },
    { label: 'Tồn kho', value: '156', icon: 'archivebox.fill', color: '#ffc107' },
  ];

  const recentOrders = [
    { id: '#001', customer: 'Nguyễn Văn A', total: '150,000đ', status: 'Đã giao' },
    { id: '#002', customer: 'Trần Thị B', total: '320,000đ', status: 'Đang giao' },
    { id: '#003', customer: 'Lê Văn C', total: '85,000đ', status: 'Chờ xử lý' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <ThemedText type="title" style={styles.headerTitle}>
                ☕ Quản lý Cà phê
              </ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                Chào mừng, {user?.name || 'Người dùng'}!
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={[styles.logoutButton, { backgroundColor: colors.background }]}
            >
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={colors.tint} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: colors.background }]}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                <IconSymbol name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Đơn hàng gần đây
          </ThemedText>
          {recentOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={[styles.orderCard, { backgroundColor: colors.background }]}
            >
              <View style={styles.orderInfo}>
                <ThemedText type="defaultSemiBold">{order.id}</ThemedText>
                <ThemedText style={styles.orderCustomer}>{order.customer}</ThemedText>
              </View>
              <View style={styles.orderRight}>
                <ThemedText type="defaultSemiBold" style={styles.orderTotal}>
                  {order.total}
                </ThemedText>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        order.status === 'Đã giao'
                          ? '#28a74520'
                          : order.status === 'Đang giao'
                          ? '#0a7ea420'
                          : '#ffc10720',
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.statusText,
                      {
                        color:
                          order.status === 'Đã giao'
                            ? '#28a745'
                            : order.status === 'Đang giao'
                            ? '#0a7ea4'
                            : '#ffc107',
                      },
                    ]}
                  >
                    {order.status}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActions}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Thao tác nhanh
          </ThemedText>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#6f4e37' }]}
            >
              <IconSymbol name="plus.circle.fill" size={32} color="#fff" />
              <ThemedText style={styles.actionText}>Tạo đơn</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#0a7ea4' }]}
            >
              <IconSymbol name="cup.and.saucer.fill" size={32} color="#fff" />
              <ThemedText style={styles.actionText}>Thêm SP</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#28a745' }]}
            >
              <IconSymbol name="chart.bar.fill" size={32} color="#fff" />
              <ThemedText style={styles.actionText}>Báo cáo</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    margin: 5,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    padding: 20,
    paddingBottom: 40,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
});
