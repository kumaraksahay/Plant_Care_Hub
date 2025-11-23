import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const PurchaseConfirmationScreen = ({ navigation, route }) => {
  const { cart, totalAmount, paymentMethodId } = route.params;

  const renderPurchasedItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>
        ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('BuyProductScreen')}>
          <Ionicons name="arrow-back" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <Text style={styles.title}>Purchase Confirmed</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <LottieView
          source={require('./assets/success-plant.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />
        <Text style={styles.confirmationText}>Thank you for your purchase!</Text>
        <Text style={styles.totalText}>Total Paid: ${totalAmount.toFixed(2)}</Text>
        <Text style={styles.paymentIdText}>Payment Method ID: {paymentMethodId}</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={renderPurchasedItem}
          style={styles.itemList}
        />
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('BuyProductScreen')}
          accessibilityLabel="Continue shopping"
        >
          <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.continueButtonGradient}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('PurchaseHistoryScreen')}
          accessibilityLabel="View purchase history"
        >
          <Text style={styles.historyButtonText}>View Purchase History</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B5E20',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 10,
  },
  paymentIdText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  itemList: {
    width: '100%',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  continueButton: {
    width: '100%',
    borderRadius: 25,
    marginBottom: 10,
  },
  continueButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 25,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    padding: 10,
  },
  historyButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default PurchaseConfirmationScreen;