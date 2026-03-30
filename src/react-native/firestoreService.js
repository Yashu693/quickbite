import { db } from '../../firebase'; // Adjust this import based on your firebaseConfig path
import {
  doc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  collectionGroup,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

/**
 * FEATURE 1 — Save College Selection After Login
 * Saves the user's selected college to their user document.
 */
export const saveCollege = async (userId, email, displayName, college) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        email,
        displayName,
        college,
        createdAt: serverTimestamp(),
      },
      { merge: true } // Prevents overwriting existing fields
    );
    console.log('College saved successfully!');
  } catch (error) {
    console.error('Error saving college:', error);
    throw error;
  }
};

/**
 * FEATURE 2 — Place & Save Orders
 * Saves a new order to the user's nested orders subcollection.
 */
export const placeOrder = async (userId, college, items, totalPrice) => {
  try {
    const ordersRef = collection(db, 'users', userId, 'orders');
    const newOrderRef = await addDoc(ordersRef, {
      items, // Array of { name, qty, price }
      totalPrice,
      status: 'pending',
      college,
      timestamp: serverTimestamp(),
    });
    console.log('Order placed with ID:', newOrderRef.id);
    return newOrderRef.id;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

/**
 * FEATURE 3 — Canteen Admin: View All Orders in Real-Time
 * Listens to ALL orders across ALL users ordered by timestamp descending.
 */
export const listenToAllOrders = (onData, onError) => {
  try {
    // Requires a Firestore Composite Index on collection 'orders'
    const q = query(collectionGroup(db, 'orders'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((docSnap) => {
          // Extract userId from document Reference (users/{userId}/orders/{orderId})
          const userId = docSnap.ref.parent.parent?.id || 'unknown';
          return {
            id: docSnap.id,
            userId,
            ...docSnap.data(),
          };
        });
        onData(orders);
      },
      (error) => {
        console.error('Snapshot error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up orders listener:', error);
    throw error;
  }
};

/**
 * FEATURE 4 — Update Order Status
 * Updates the status field of a specific order.
 */
export const updateOrderStatus = async (userId, orderId, newStatus) => {
  try {
    const orderRef = doc(db, 'users', userId, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
    });
    console.log('Order status updated to:', newStatus);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
