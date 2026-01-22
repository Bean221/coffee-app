import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface CoffeeProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

const mockProducts: CoffeeProduct[] = [
  { id: '1', name: 'Cà phê Arabica', price: 150000, category: 'Hạt rang', stock: 50 },
  { id: '2', name: 'Cà phê Robusta', price: 120000, category: 'Hạt rang', stock: 75 },
  { id: '3', name: 'Cà phê Espresso', price: 180000, category: 'Hạt rang', stock: 30 },
  { id: '4', name: 'Cà phê Cappuccino', price: 45000, category: 'Đồ uống', stock: 100 },
  { id: '5', name: 'Cà phê Latte', price: 50000, category: 'Đồ uống', stock: 80 },
  { id: '6', name: 'Cà phê Americano', price: 40000, category: 'Đồ uống', stock: 90 },
  { id: '7', name: 'Cà phê Culi', price: 200000, category: 'Hạt rang', stock: 25 },
  { id: '8', name: 'Cà phê Moka', price: 250000, category: 'Hạt rang', stock: 20 },
];

export default function ProductsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Tất cả', 'Hạt rang', 'Đồ uống'];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'Tất cả' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Sản phẩm
        </ThemedText>
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    (selectedCategory === category || (!selectedCategory && category === 'Tất cả'))
                      ? '#6f4e37'
                      : colors.background,
                },
              ]}
              onPress={() => setSelectedCategory(category === 'Tất cả' ? null : category)}
            >
              <ThemedText
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category || (!selectedCategory && category === 'Tất cả')
                        ? '#fff'
                        : colors.text,
                  },
                ]}
              >
                {category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
        {filteredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[styles.productCard, { backgroundColor: colors.background }]}
          >
            <View style={styles.productImage}>
              <IconSymbol name="cup.and.saucer.fill" size={40} color="#6f4e37" />
            </View>
            <View style={styles.productInfo}>
              <ThemedText type="defaultSemiBold" style={styles.productName}>
                {product.name}
              </ThemedText>
              <ThemedText style={styles.productCategory}>{product.category}</ThemedText>
              <View style={styles.productFooter}>
                <ThemedText type="defaultSemiBold" style={styles.productPrice}>
                  {formatPrice(product.price)}
                </ThemedText>
                <View style={styles.stockContainer}>
                  <IconSymbol name="cube.box.fill" size={16} color={product.stock > 30 ? '#28a745' : '#ffc107'} />
                  <ThemedText
                    style={[
                      styles.stockText,
                      { color: product.stock > 30 ? '#28a745' : '#ffc107' },
                    ]}
                  >
                    {product.stock} sp
                  </ThemedText>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <IconSymbol name="pencil.circle.fill" size={24} color="#0a7ea4" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <IconSymbol name="plus.circle.fill" size={56} color="#6f4e37" />
      </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoryContainer: {
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#6f4e37',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6f4e3720',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#6f4e37',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});