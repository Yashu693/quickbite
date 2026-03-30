import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { listenToAllOrders, updateOrderStatus } from './firestoreService';

export default function CanteenDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FEATURE 3: Canteen Admin: View All Orders in Real-Time
    // This connects to the snapshot listener
    const unsubscribe = listenToAllOrders(
      (data) => {
        setOrders(data);
        setLoading(false);
      },
      (error) => {
        Alert.alert('Error', 'Failed to fetch orders in real-time');
        setLoading(false);
      }
    );

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (userId, orderId, currentStatus) => {
    // FEATURE 4: Update Order Status progression pipeline
    const stages = ['pending', 'preparing', 'ready', 'delivered'];
    const currentIndex = stages.indexOf(currentStatus);
    
    if (currentIndex === -1 || currentIndex === stages.length - 1) return;
    
    const nextStatus = stages[currentIndex + 1];

    try {
      await updateOrderStatus(userId, orderId, nextStatus);
    } catch (error) {
      Alert.alert('Error', 'Could not update status. Check permissions.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#fbbf24'; // Yellow
      case 'preparing': return '#3b82f6'; // Blue
      case 'ready': return '#22c55e'; // Green
      case 'delivered': return '#9ca3af'; // Grey
      default: return '#000';
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Order #{item.id.slice(-6).toUpperCase()}</Text>
        <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      
      <Text style={styles.detailText}>👤 User ID: {item.userId}</Text>
      <Text style={styles.detailText}>📍 College: {item.college}</Text>
      
      <View style={styles.divider} />
      
      {item.items?.map((food, idx) => (
        <Text key={idx} style={styles.foodText}>• {food.qty}x {food.name}</Text>
      ))}
      
      <View style={styles.divider} />
      
      <View style={styles.footerRow}>
        <Text style={styles.totalText}>Total: ₹{item.totalPrice}</Text>
        
        {item.status !== 'delivered' && (
          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={() => handleUpdateStatus(item.userId, item.id, item.status)}
          >
            <Text style={styles.updateButtonText}>Move to Next Stage →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>👨‍🍳 Canteen Dashboard</Text>
      <Text style={styles.subtext}>Live order tracker</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ef4444" style={{ marginTop: 40 }} />
      ) : (
        <FlatList 
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No active orders.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#111827', marginTop: 20 },
  subtext: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  statusBadge: { color: '#fff', fontSize: 10, fontWeight: '900', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  detailText: { fontSize: 13, color: '#4b5563', marginBottom: 4 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
  foodText: { fontSize: 14, color: '#1f2937', fontWeight: '500', marginBottom: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  updateButton: { backgroundColor: '#111827', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  updateButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 40, fontSize: 16 },
});
