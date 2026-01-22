import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Cà phê Arabica',
    category: 'Hạt rang',
    currentStock: 50,
    minStock: 20,
    maxStock: 100,
    unit: 'kg',
    lastUpdated: '14/01/2024',
  },
  {
    id: '2',
    name: 'Cà phê Robusta',
    category: 'Hạt rang',
    currentStock: 75,
    minStock: 30,
    maxStock: 150,
    unit: 'kg',
    lastUpdated: '14/01/2024',
  },
  {
    id: '3',
    name: 'Cà phê Espresso',
    category: 'Hạt rang',
    currentStock: 15,
    minStock: 20,
    maxStock: 80,
    unit: 'kg',
    lastUpdated: '13/01/2024',
  },
  {
    id: '4',
    name: 'Sữa tươi',
    category: 'Nguyên liệu',
    currentStock: 120,
    minStock: 50,
    maxStock: 200,
    unit: 'lít',
    lastUpdated: '15/01/2024',
  },
  {
    id: '5',
    name: 'Đường',
    category: 'Nguyên liệu',
    currentStock: 80,
    minStock: 40,
    maxStock: 150,
    unit: 'kg',
    lastUpdated: '14/01/2024',
  },
  {
    id: '6',
    name: 'Cốc giấy',
    category: 'Vật tư',
    currentStock: 500,
    minStock: 200,
    maxStock: 1000,
    unit: 'cái',
    lastUpdated: '15/01/2024',
  },
  {
    id: '7',
    name: 'Ống hút',
    category: 'Vật tư',
    currentStock: 300,
    minStock: 150,
    maxStock: 800,
    unit: 'cái',
    lastUpdated: '14/01/2024',
  },
  {
    id: '8',
    name: 'Cà phê Culi',
    category: 'Hạt rang',
    currentStock: 25,
    minStock: 15,
    maxStock: 60,
    unit: 'kg',
    lastUpdated: '13/01/2024',
  },
];

export default function InventoryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getStockStatus = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    if (current <= min) {
      return { status: 'low', color: '#dc3545', bgColor: '#dc354520', label: 'Sắp hết' };
    } else if (percentage < 50) {
      return { status: 'medium', color: '#ffc107', bgColor: '#ffc10720', label: 'Trung bình' };
    } else {
      return { status: 'good', color: '#28a745', bgColor: '#28a74520', label: 'Đủ' };
    }
  };

  const lowStockItems = mockInventory.filter((item) => item.currentStock <= item.minStock).length;
  const totalItems = mockInventory.length;
  const totalValue = mockInventory.reduce((sum, item) => {
    // Giả định giá trung bình
    const avgPrice = item.category === 'Hạt rang' ? 150000 : item.category === 'Nguyên liệu' ? 50000 : 2000;
    return sum + item.currentStock * avgPrice;
  }, 0);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Quản lý Kho
        </ThemedText>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#0a7ea420' }]}>
            <IconSymbol name="cube.box.fill" size={24} color="#0a7ea4" />
            <ThemedText style={styles.statValue}>{totalItems}</ThemedText>
            <ThemedText style={styles.statLabel}>Tổng sản phẩm</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: lowStockItems > 0 ? '#dc354520' : '#28a74520' }]}>
            <IconSymbol name="exclamationmark.triangle.fill" size={24} color={lowStockItems > 0 ? '#dc3545' : '#28a745'} />
            <ThemedText style={styles.statValue}>{lowStockItems}</ThemedText>
            <ThemedText style={styles.statLabel}>Sắp hết hàng</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#6f4e3720' }]}>
            <IconSymbol name="dollarsign.circle.fill" size={24} color="#6f4e37" />
            <ThemedText style={styles.statValue}>
              {(totalValue / 1000000).toFixed(1)}M
            </ThemedText>
            <ThemedText style={styles.statLabel}>Tổng giá trị</ThemedText>
          </View>
        </View>
      </View>

      <ScrollView style={styles.inventoryList} showsVerticalScrollIndicator={false}>
        {mockInventory.map((item) => {
          const stockStatus = getStockStatus(item.currentStock, item.minStock, item.maxStock);
          const stockPercentage = (item.currentStock / item.maxStock) * 100;

          return (
            <View
              key={item.id}
              style={[styles.inventoryCard, { backgroundColor: colors.background }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.itemInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.itemName}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={styles.itemCategory}>{item.category}</ThemedText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: stockStatus.bgColor }]}>
                  <ThemedText style={[styles.statusText, { color: stockStatus.color }]}>
                    {stockStatus.label}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.stockInfo}>
                <View style={styles.stockRow}>
                  <ThemedText style={styles.stockLabel}>Tồn kho:</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.stockValue}>
                    {item.currentStock} {item.unit}
                  </ThemedText>
                </View>
                <View style={styles.stockRow}>
                  <ThemedText style={styles.stockLabel}>Tối thiểu:</ThemedText>
                  <ThemedText style={styles.stockValue}>
                    {item.minStock} {item.unit}
                  </ThemedText>
                </View>
                <View style={styles.stockRow}>
                  <ThemedText style={styles.stockLabel}>Tối đa:</ThemedText>
                  <ThemedText style={styles.stockValue}>
                    {item.maxStock} {item.unit}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${stockPercentage}%`,
                        backgroundColor: stockStatus.color,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={styles.progressText}>
                  {stockPercentage.toFixed(0)}%
                </ThemedText>
              </View>

              <View style={styles.cardFooter}>
                <ThemedText style={styles.lastUpdated}>
                  Cập nhật: {item.lastUpdated}
                </ThemedText>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <IconSymbol name="plus.circle.fill" size={20} color="#28a745" />
                    <ThemedText style={styles.actionText}>Nhập</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <IconSymbol name="minus.circle.fill" size={20} color="#dc3545" />
                    <ThemedText style={styles.actionText}>Xuất</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: 'center',
  },
  inventoryList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inventoryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    opacity: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stockInfo: {
    marginBottom: 12,
    gap: 6,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  stockValue: {
    fontSize: 13,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  lastUpdated: {
    fontSize: 11,
    opacity: 0.6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
  },
});