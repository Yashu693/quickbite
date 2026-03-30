import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, ScrollView } from 'react-native';
import { placeOrder } from './firestoreService';

// import { auth } from '../firebaseConfig';
const mockAuth = { currentUser: { uid: 'user_123' } };

export default function OrderConfirmScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  // Mocked Cart Data
  const sampleCart = [
    { id: 'f1', name: 'Special Samosa', qty: 2, price: 25 },
    { id: 'f2', name: 'Masala Chai', qty: 3, price: 15 }
  ];
  const userCollege = 'AU Central Dining Hall';
  const totalPrice = sampleCart.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const handleConfirmOrder = async () => {
    const user = mockAuth.currentUser;
    if (!user) {
      Alert.alert('Auth Error', 'You must be logged in to order.');
      return;
    }

    setLoading(true);
    try {
      // FEATURE 2: Place & Save Orders (subcollection, auto-generated ID)
      const orderId = await placeOrder(user.uid, userCollege, sampleCart, totalPrice);
      Alert.alert('Order Confirmed!', `Your order #${orderId.slice(-6).toUpperCase()} has been placed successfully.`);
      
      if (navigation) navigation.navigate('CanteenDashboard');
    } catch (error) {
      Alert.alert('Order Failed', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Order</Text>
      
      <ScrollView style={styles.scroll}>
        <View style={styles.receipt}>
          {sampleCart.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.itemText}>{item.qty}x {item.name}</Text>
              <Text style={styles.priceText}>₹{item.qty * item.price}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalAmount}>₹{totalPrice}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleConfirmOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay ₹{totalPrice} & Place Order</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  scroll: { flex: 1 },
  receipt: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderColor: '#e5e7eb', borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  itemText: { fontSize: 16, color: '#4b5563' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  totalAmount: { fontSize: 24, fontWeight: '900', color: '#ef4444' },
  button: { backgroundColor: '#ef4444', padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
