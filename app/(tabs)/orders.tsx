import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  date: string;
  time: string;
}

const mockOrders: Order[] = [
  {
    id: '#001',
    customer: 'Nguyễn Văn A',
    items: 3,
    total: 150000,
    status: 'delivered',
    date: '15/01/2024',
    time: '09:30',
  },
  {
    id: '#002',
    customer: 'Trần Thị B',
    items: 5,
    total: 320000,
    status: 'processing',
    date: '15/01/2024',
    time: '10:15',
  },
  {
    id: '#003',
    customer: 'Lê Văn C',
    items: 2,
    total: 85000,
    status: 'pending',
    date: '15/01/2024',
    time: '11:00',
  },
  {
    id: '#004',
    customer: 'Phạm Thị D',
    items: 4,
    total: 200000,
    status: 'delivered',
    date: '14/01/2024',
    time: '14:20',
  },
  {
    id: '#005',
    customer: 'Hoàng Văn E',
    items: 1,
    total: 45000,
    status: 'cancelled',
    date: '14/01/2024',
    time: '16:45',
  },
];

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xử lý' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' },
  ];

  const filteredOrders =
    selectedFilter === 'all'
      ? mockOrders
      : mockOrders.filter((order) => order.status === selectedFilter);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Chờ xử lý', color: '#ffc107', bgColor: '#ffc10720' };
      case 'processing':
        return { label: 'Đang xử lý', color: '#0a7ea4', bgColor: '#0a7ea420' };
      case 'delivered':
        return { label: 'Đã giao', color: '#28a745', bgColor: '#28a74520' };
      case 'cancelled':
        return { label: 'Đã hủy', color: '#dc3545', bgColor: '#dc354520' };
      default:
        return { label: 'Unknown', color: '#6c757d', bgColor: '#6c757d20' };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const totalRevenue = mockOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const todayOrders = mockOrders.filter((o) => o.date === '15/01/2024').length;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Đơn hàng
        </ThemedText>
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#0a7ea420' }]}>
            <ThemedText style={styles.statValue}>{todayOrders}</ThemedText>
            <ThemedText style={styles.statLabel}>Đơn hôm nay</ThemedText>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#28a74520' }]}>
            <ThemedText style={styles.statValue}>{formatPrice(totalRevenue)}</ThemedText>
            <ThemedText style={styles.statLabel}>Doanh thu</ThemedText>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    selectedFilter === filter.key ? '#6f4e37' : colors.background,
                },
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  {
                    color: selectedFilter === filter.key ? '#fff' : colors.text,
                  },
                ]}
              >
                {filter.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          return (
            <TouchableOpacity
              key={order.id}
              style={[styles.orderCard, { backgroundColor: colors.background }]}
            >
              <View style={styles.orderHeader}>
                <View>
                  <ThemedText type="defaultSemiBold" style={styles.orderId}>
                    {order.id}
                  </ThemedText>
                  <ThemedText style={styles.orderCustomer}>{order.customer}</ThemedText>
                </View>
                <View
                  style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}
                >
                  <ThemedText style={[styles.statusText, { color: statusInfo.color }]}>
                    {statusInfo.label}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.orderDetails}>
                <View style={styles.orderDetailRow}>
                  <IconSymbol name="cube.box.fill" size={16} color={colors.icon} />
                  <ThemedText style={styles.orderDetailText}>
                    {order.items} sản phẩm
                  </ThemedText>
                </View>
                <View style={styles.orderDetailRow}>
                  <IconSymbol name="clock.fill" size={16} color={colors.icon} />
                  <ThemedText style={styles.orderDetailText}>
                    {order.date} - {order.time}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.orderFooter}>
                <ThemedText type="defaultSemiBold" style={styles.orderTotal}>
                  {formatPrice(order.total)}
                </ThemedText>
                {order.status === 'pending' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <ThemedText style={styles.actionButtonText}>Xử lý</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  filterContainer: {
    marginTop: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#6f4e37',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 14,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 12,
    gap: 8,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderDetailText: {
    fontSize: 14,
    opacity: 0.7,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  orderTotal: {
    fontSize: 18,
    color: '#6f4e37',
  },
  actionButton: {
    backgroundColor: '#6f4e37',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});