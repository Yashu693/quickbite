import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, FlatList } from 'react-native';
import { saveCollege } from './firestoreService';

// Ensure your firebase Auth instance is exported from your config
// import { auth } from '../firebaseConfig'; 
const mockAuth = { currentUser: { uid: 'user_123', email: 'test@example.com', displayName: 'John Doe' } };

const COLLEGES = [
  { id: '1', name: 'AU Central Dining Hall' },
  { id: '2', name: 'NIRMA Food Court' },
  { id: '3', name: 'CEPT Studio Café' },
];

export default function CollegePickerScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selected) {
      Alert.alert('Action Required', 'Please select a college first.');
      return;
    }

    // Replace mockAuth with actual Firebase Auth instance
    const user = mockAuth.currentUser; 
    
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    setLoading(true);
    try {
      // FEATURE 1: Record user selection in Firestore (merge: true handled in service)
      await saveCollege(user.uid, user.email, user.displayName, selected.name);
      Alert.alert('Success', 'College selected successfully!');
      
      if (navigation) navigation.navigate('OrderConfirmScreen');
    } catch (error) {
      Alert.alert('Error', 'Failed to save college. Note: ensure Firestore rules allow this write.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your College</Text>
      
      <FlatList
        data={COLLEGES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selected?.id === item.id && styles.selectedCard]}
            onPress={() => setSelected(item)}
          >
            <Text style={[styles.cardText, selected?.id === item.id && styles.selectedText]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={[styles.button, (!selected || loading) && styles.buttonDisabled]} 
        onPress={handleSave}
        disabled={!selected || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirm Selection</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  selectedCard: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  cardText: { fontSize: 16, color: '#374151', fontWeight: '500' },
  selectedText: { color: '#ef4444', fontWeight: 'bold' },
  button: { backgroundColor: '#ef4444', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  buttonDisabled: { backgroundColor: '#fca5a5' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
