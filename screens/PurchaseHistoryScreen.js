import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from './firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

const PurchaseHistoryScreen = ({ navigation }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'users', userId, 'purchases'),
      (snapshot) => {
        const purchaseList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          purchaseDate: doc.data().purchaseDate ? new Date(doc.data().purchaseDate).toLocaleString() : 'N/A',
        }));
        setPurchases(purchaseList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching purchases:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const renderPurchaseItem = ({ item }) => (
    <LinearGradient
      colors={['#FFFFFF', '#E8F5E9']}
      style={styles.purchaseItem}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/60' }}
        style={styles.purchaseImage}
      />
      <View style={styles.purchaseDetails}>
        <Text style={styles.purchaseName}>{item.name}</Text>
        <Text style={styles.purchasePrice}>${item.price.toFixed(2)} x {item.quantity}</Text>
        <Text style={styles.purchaseDate}>Date: {item.purchaseDate}</Text>
        <Text style={styles.purchasePaymentId}>Transaction ID: {item.paymentId}</Text>
      </View>
    </LinearGradient>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
        <Ionicons name="leaf-outline" size={50} color="#4CAF50" />
        <Text style={styles.loadingText}>Loading purchase history...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#1B5E20" />
          </TouchableOpacity>
          <Text style={styles.title}>Purchase History</Text>
        </View>
      </View>

      {purchases.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={60} color="#666" style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No purchases yet!</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('BuyProductScreen')}
          >
            <Text style={styles.shopText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={purchases}
          keyExtractor={item => item.id}
          renderItem={renderPurchaseItem}
          contentContainerStyle={styles.purchaseList}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B5E20',
    textAlign: 'center',
    flex: 1,
  },
  purchaseItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  purchaseImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover',
  },
  purchaseDetails: {
    flex: 1,
  },
  purchaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  purchasePrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 5,
  },
  purchaseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  purchasePaymentId: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  purchaseList: {
    padding: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  shopText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
});

export default PurchaseHistoryScreen;