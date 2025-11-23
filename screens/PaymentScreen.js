import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from './firebaseConfig';
import { collection, doc, setDoc, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import * as Haptics from 'expo-haptics';

const PaymentScreen = ({ navigation, route }) => {
  const { cart, totalAmount } = route.params || { cart: [], totalAmount: 0 };
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardType, setCardType] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Detect card type based on card number
    const firstDigit = cardNumber.replace(/\s/g, '').charAt(0);
    if (firstDigit === '4') {
      setCardType('visa');
    } else if (firstDigit === '5') {
      setCardType('mastercard');
    } else {
      setCardType(null);
    }
  }, [cardNumber]);

  const validateCardInputs = () => {
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      setPaymentError('Invalid card number (16 digits required)');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setPaymentError('Invalid expiry date (MM/YY)');
      return false;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      setPaymentError('Invalid CVC (3-4 digits)');
      return false;
    }
    return true;
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const confirmPayment = async () => {
    if (!userId) {
      Alert.alert('Login Required', 'Please log in to proceed.');
      return;
    }
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'No items to purchase.');
      return;
    }
    if (!validateCardInputs()) {
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Generate fake payment ID
      const paymentId = `PAY-MOCK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Save fake purchases to Firestore
      const batch = db.batch();
      const purchasesRef = collection(db, 'users', userId, 'purchases');
      const cartRef = collection(db, 'users', userId, 'cart');

      cart.forEach(item => {
        const purchaseDoc = doc(purchasesRef);
        batch.set(purchaseDoc, {
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          paymentId,
          purchaseDate: new Date().toISOString(),
        });
      });

      // Update product stock
      cart.forEach(item => {
        const productRef = doc(db, 'products', item.productId);
        batch.update(productRef, {
          stock: getDoc(productRef).then(doc => doc.data().stock - item.quantity),
        });
      });

      // Clear cart
      const cartSnapshot = await getDocs(cartRef);
      cartSnapshot.forEach(docSnapshot => {
        batch.delete(docSnapshot.ref);
      });

      await batch.commit();

      // Animate checkmark
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setProcessing(false);
        Alert.alert('Payment Successful!', 'Your purchase has been completed.', [
          { text: 'OK', onPress: () => navigation.navigate('PurchaseHistoryScreen') },
        ]);
      });
    } catch (error) {
      console.error('Error simulating payment:', error);
      setPaymentError('Failed to process payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#1B5E20" />
          </TouchableOpacity>
          <Text style={styles.title}>Payment</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.paymentContainer, { opacity: fadeAnim }]}>
        <View style={styles.cardForm}>
          <Ionicons name="card-outline" size={30} color="#4CAF50" style={styles.cardIcon} />
          <Text style={styles.formTitle}>Enter Card Details</Text>
          <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>

          <View style={styles.cardIcons}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' }}
              style={[styles.providerIcon, cardType !== 'visa' && styles.inactiveIcon]}
            />
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg' }}
              style={[styles.providerIcon, cardType !== 'mastercard' && styles.inactiveIcon]}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Card Number (e.g., 4242 4242 4242 4242)"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(text.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
            keyboardType="numeric"
            maxLength={19}
            placeholderTextColor="#999"
          />
          <View style={styles.cardDetailsRow}>
            <TextInput
              style={[styles.input, styles.cardDetailsInput]}
              placeholder="MM/YY"
              value={expiry}
              onChangeText={(text) => {
                if (text.length === 2 && !text.includes('/')) {
                  setExpiry(text + '/');
                } else {
                  setExpiry(text);
                }
              }}
              keyboardType="numeric"
              maxLength={5}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.cardDetailsInput]}
              placeholder="CVC"
              value={cvc}
              onChangeText={setCvc}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor="#999"
            />
          </View>

          {processing ? (
            <View style={styles.successContainer}>
              <Animated.View
                style={{
                  opacity: checkAnim,
                  transform: [
                    {
                      scale: checkAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                }}
              >
                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                <Ionicons name="star" size={20} color="#FFD700" style={styles.confetti} />
                <Ionicons name="star" size={20} color="#FFD700" style={[styles.confetti, { left: -30, top: -10 }]} />
                <Ionicons name="star" size={20} color="#FFD700" style={[styles.confetti, { right: -30, top: -10 }]} />
              </Animated.View>
              <Text style={styles.successText}>Processing Payment...</Text>
            </View>
          ) : (
            <>
              {paymentError && (
                <View>
                  <Text style={styles.errorText}>{paymentError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => setPaymentError(null)}
                  >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={[styles.payButton, { transform: [{ scale: buttonAnim }] }]}
                onPress={() => {
                  animateButton();
                  confirmPayment();
                }}
                disabled={processing}
              >
                <LinearGradient
                  colors={['#4CAF50', '#388E3C']}
                  style={styles.payButtonGradient}
                >
                  <Text style={styles.payButtonText}>Pay Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.securityBadges}>
            <Ionicons name="lock-closed" size={16} color="#666" />
            <Text style={styles.securityText}>Secured by MockPay</Text>
          </View>
        </View>
      </Animated.View>
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
  paymentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    marginBottom: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 15,
  },
  cardIcons: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  providerIcon: {
    width: 40,
    height: 24,
    marginHorizontal: 5,
    resizeMode: 'contain',
  },
  inactiveIcon: {
    opacity: 0.3,
  },
  input: {
    width: '100%',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1B5E20',
    marginBottom: 12,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardDetailsInput: {
    flex: 1,
    marginRight: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  payButton: {
    width: '100%',
    borderRadius: 15,
    marginTop: 10,
  },
  payButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 15,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    fontStyle: 'italic',
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  successText: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 10,
  },
  confetti: {
    position: 'absolute',
    top: 0,
  },
});

export default PaymentScreen;