// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import { db, auth } from './firebaseConfig';
// import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// export default function CartScreen({ navigation }) {
//   const [cart, setCart] = useState([]);
//   const userId = auth.currentUser?.uid;

//   useEffect(() => {
//     const fetchCart = async () => {
//       if (userId) {
//         const cartRef = collection(db, 'users', userId, 'cart');
//         const cartSnapshot = await getDocs(cartRef);
//         const cartList = cartSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setCart(cartList);
//       }
//     };
//     fetchCart();
//   }, [userId]);

//   const removeItemFromCart = async (cartItemId) => {
//     await deleteDoc(doc(db, 'users', userId, 'cart', cartItemId));
//     setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
//   };

//   const renderCartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <Text style={styles.cartItemName}>{item.name}</Text>
//       <Text style={styles.cartItemPrice}>${item.price}</Text>
//       <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
//       <TouchableOpacity
//         style={styles.removeButton}
//         onPress={() => removeItemFromCart(item.id)}
//       >
//         <Text style={styles.removeButtonText}>Remove</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Cart</Text>

//       <FlatList
//         data={cart}
//         keyExtractor={item => item.id}
//         renderItem={renderCartItem}
//       />

//       <TouchableOpacity style={styles.checkoutButton}>
//         <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   cartItem: {
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   cartItemName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cartItemPrice: {
//     fontSize: 16,
//     color: '#666',
//   },
//   cartItemQuantity: {
//     fontSize: 16,
//     color: '#999',
//   },
//   removeButton: {
//     backgroundColor: '#F44336',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   removeButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   checkoutButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   checkoutButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });



// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Alert } from 'react-native';
// import { db } from './firebaseConfig'; // Firebase configuration
// import { collection, addDoc, Timestamp } from 'firebase/firestore';
// import { auth } from './firebaseConfig'; // Assuming you have auth setup for the user

// export default function CartScreen() {
//   const [cartItems, setCartItems] = useState([]);
  
//   useEffect(() => {
//     // Mock cart data (replace this with data from Firebase or your state management)
//     const fetchedCartItems = [
//       {
//         id: '1',
//         name: 'Product 1',
//         price: 20.0,
//         imageUrl: 'https://via.placeholder.com/150',
//         quantity: 2,
//       },
//       {
//         id: '2',
//         name: 'Product 2',
//         price: 15.0,
//         imageUrl: 'https://via.placeholder.com/150',
//         quantity: 1,
//       },
//     ];

//     setCartItems(fetchedCartItems); // Set cart items from your source
//   }, []);

//   const handleCheckout = async () => {
//     if (cartItems.length === 0) {
//       Alert.alert('Error', 'Your cart is empty!');
//       return;
//     }

//     try {
//       // Assuming `auth.currentUser` has a valid authenticated user
//       const userId = auth.currentUser.uid;
//       const orderData = {
//         userId,
//         items: cartItems,
//         totalAmount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
//         orderDate: Timestamp.fromDate(new Date()),
//         status: 'Pending',
//       };

//       // Save the order to Firebase Firestore
//       await addDoc(collection(db, 'orders'), orderData);
//       Alert.alert('Success', 'Your order has been placed successfully!');
      
//       // After placing the order, you can clear the cart or navigate to another screen
//       setCartItems([]); // Clear the cart after checkout (optional)
//     } catch (error) {
//       console.error('Error placing order: ', error);
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     }
//   };

//   const renderCartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
//       <View style={styles.cartDetails}>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
//         <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Cart</Text>
      
//       {/* If cart is empty, show a message */}
//       {cartItems.length === 0 ? (
//         <Text style={styles.emptyCartText}>Your cart is empty.</Text>
//       ) : (
//         <FlatList
//           data={cartItems}
//           renderItem={renderCartItem}
//           keyExtractor={item => item.id}
//         />
//       )}

//       {/* Checkout Button */}
//       <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
//         <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F9F9F9',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#285430',
//     marginVertical: 20,
//   },
//   emptyCartText: {
//     fontSize: 16,
//     color: '#555',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   cartItem: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 15,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     alignItems: 'center',
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginRight: 15,
//     resizeMode: 'cover',
//   },
//   cartDetails: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   productPrice: {
//     fontSize: 16,
//     color: '#666',
//   },
//   productQuantity: {
//     fontSize: 14,
//     color: '#888',
//   },
//   checkoutButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//     marginTop: 20,
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 20,
//     left: '50%',
//     transform: [{ translateX: -50 }],
//   },
//   checkoutButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });




// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from "react-native";
// import { getFirestore, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const db = getFirestore();
// const auth = getAuth();

// export default function CartScreen({ navigation }) {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch cart items from Firebase (simulating with local data)
//   useEffect(() => {
//     const fetchCartItems = async () => {
//       const userId = auth.currentUser.uid;
//       const cartRef = doc(db, "users", userId);
//       const userDoc = await getDoc(cartRef);
//       if (userDoc.exists()) {
//         setCartItems(userDoc.data().cart || []);
//       } else {
//         setCartItems([]);
//       }
//       setLoading(false);
//     };

//     fetchCartItems();
//   }, []);

//   const handleRemoveItem = async (itemId) => {
//     const userId = auth.currentUser.uid;
//     const cartRef = doc(db, "users", userId);
//     await updateDoc(cartRef, {
//       cart: arrayRemove(cartItems.find(item => item.id === itemId))
//     });
//     setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
//   };

//   const handleCheckout = async () => {
//     if (cartItems.length === 0) {
//       Alert.alert("Your cart is empty!", "Add some products before proceeding to checkout.");
//       return;
//     }

//     const userId = auth.currentUser.uid;
//     const userRef = doc(db, "users", userId);
//     const orderRef = doc(db, "orders", userId + "_" + new Date().getTime()); // Create unique order id based on time
    
//     // Save order data to the Firestore 'orders' collection
//     await setDoc(orderRef, {
//       userId,
//       items: cartItems,
//       totalPrice: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
//       status: "Pending",
//       timestamp: new Date(),
//     });

//     // Clear cart after successful checkout
//     await updateDoc(userRef, {
//       cart: []
//     });

//     Alert.alert("Purchase Successful", "Your order has been placed successfully!");
//     navigation.navigate("DashboardScreen");
//   };

//   const renderCartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
//       <View style={styles.cartItemDetails}>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
//         <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
//         <TouchableOpacity
//           style={styles.removeButton}
//           onPress={() => handleRemoveItem(item.id)}
//         >
//           <Text style={styles.removeButtonText}>Remove</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return loading ? (
//     <View style={styles.loader}>
//       <Text>Loading...</Text>
//     </View>
//   ) : (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Cart</Text>

//       {cartItems.length === 0 ? (
//         <Text style={styles.emptyCartText}>Your cart is empty. Start shopping now!</Text>
//       ) : (
//         <FlatList
//           data={cartItems}
//           renderItem={renderCartItem}
//           keyExtractor={(item) => item.id}
//         />
//       )}

//       <View style={styles.checkoutContainer}>
//         <Text style={styles.totalPrice}>
//           Total: $
//           {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
//         </Text>
//         <TouchableOpacity
//           style={styles.checkoutButton}
//           onPress={handleCheckout}
//         >
//           <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F9F9F9",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 20,
//   },
//   cartItem: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   cartItemDetails: {
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   productName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   productPrice: {
//     fontSize: 16,
//     color: "#4CAF50",
//   },
//   productQuantity: {
//     fontSize: 14,
//     color: "#888",
//   },
//   removeButton: {
//     marginTop: 10,
//     backgroundColor: "#F44336",
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   removeButtonText: {
//     color: "#fff",
//     fontSize: 14,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyCartText: {
//     fontSize: 16,
//     textAlign: "center",
//     color: "#888",
//   },
//   checkoutContainer: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   totalPrice: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 10,
//   },
//   checkoutButton: {
//     backgroundColor: "#4CAF50",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   checkoutButtonText: {
//     color: "#fff",
//     fontSize: 18,
//   },
// });






// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// import { db, auth } from './firebaseConfig';
// import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';

// export default function CartScreen() {
//   const [cart, setCart] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const userId = auth.currentUser?.uid;

//   // Fetch cart items from Firestore
//   useEffect(() => {
//     const fetchCart = async () => {
//       if (userId) {
//         const cartRef = collection(db, 'users', userId, 'cart');
//         const cartSnapshot = await getDocs(cartRef);
//         const cartList = cartSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setCart(cartList);
//         calculateTotal(cartList);
//       }
//     };

//     fetchCart();
//   }, [userId]);

//   // Calculate total price
//   const calculateTotal = (cartList) => {
//     const total = cartList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
//     setTotalAmount(total);
//   };

//   // Remove item from the cart
//   const removeItemFromCart = async (cartItemId) => {
//     await deleteDoc(doc(db, 'users', userId, 'cart', cartItemId));
//     const updatedCart = cart.filter(item => item.id !== cartItemId);
//     setCart(updatedCart);
//     calculateTotal(updatedCart);
//   };

//   // Update item quantity
//   const updateItemQuantity = async (cartItemId, newQuantity) => {
//     if (newQuantity < 1) return;
//     const productRef = doc(db, 'users', userId, 'cart', cartItemId);
//     await updateDoc(productRef, { quantity: newQuantity });

//     const updatedCart = cart.map(item =>
//       item.id === cartItemId ? { ...item, quantity: newQuantity } : item
//     );
//     setCart(updatedCart);
//     calculateTotal(updatedCart);
//   };

//   // Handle checkout (save cart items to Firestore)
//   const proceedToCheckout = async () => {
//     if (cart.length === 0) {
//       Alert.alert("Your cart is empty!", "Please add some products to proceed.");
//     } else {
//       // Save cart items to Firestore under a 'purchases' collection
//       const purchasesRef = collection(db, 'users', userId, 'purchases');
//       try {
//         for (const item of cart) {
//           // Save each item in the cart to the 'purchases' collection
//           await addDoc(purchasesRef, {
//             productId: item.id,
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//             imageUrl: item.imageUrl,
//             purchaseDate: new Date(),
//           });
//         }

//         // After saving, clear the cart
//         const cartRef = collection(db, 'users', userId, 'cart');
//         const cartSnapshot = await getDocs(cartRef);
//         cartSnapshot.forEach(async (docSnapshot) => {
//           await deleteDoc(doc(db, 'users', userId, 'cart', docSnapshot.id));
//         });

//         setCart([]); // Clear the cart locally
//         setTotalAmount(0); // Reset the total amount
//         Alert.alert("Purchase Successful!", "Your items have been purchased.");
//       } catch (error) {
//         console.error("Error processing purchase: ", error);
//         Alert.alert("Error", "There was an issue completing your purchase.");
//       }
//     }
//   };

//   // Render cart item
//   const renderCartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.cartItemImage} />
//       <View style={styles.cartItemDetails}>
//         <Text style={styles.cartItemName}>{item.name}</Text>
//         <Text style={styles.cartItemPrice}>${item.price}</Text>
//         <View style={styles.cartItemControls}>
//           <View style={styles.quantityControls}>
//             <TouchableOpacity onPress={() => updateItemQuantity(item.id, item.quantity - 1)} style={styles.quantityButton}>
//               <Text style={styles.quantityButtonText}>-</Text>
//             </TouchableOpacity>
//             <Text style={styles.quantityText}>{item.quantity}</Text>
//             <TouchableOpacity onPress={() => updateItemQuantity(item.id, item.quantity + 1)} style={styles.quantityButton}>
//               <Text style={styles.quantityButtonText}>+</Text>
//             </TouchableOpacity>
//           </View>
//           <TouchableOpacity
//             style={styles.removeButton}
//             onPress={() => removeItemFromCart(item.id)}
//           >
//             <Text style={styles.removeButtonText}>Remove</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.title}>Your Cart</Text>
//       </View>

//       <FlatList
//         data={cart}
//         keyExtractor={item => item.id}
//         renderItem={renderCartItem}
//         contentContainerStyle={styles.cartList}
//       />

//       <View style={styles.totalContainer}>
//         <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
//       </View>

//       <TouchableOpacity style={styles.checkoutButton} onPress={proceedToCheckout}>
//         <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//     paddingTop: 30,
//     paddingHorizontal: 20,
//   },
//   headerContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: '#333',
//     textAlign: 'center',
//   },
//   cartItem: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 3,
//     alignItems: 'center',
//   },
//   cartItemImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     marginRight: 15,
//     resizeMode: 'cover',
//   },
//   cartItemDetails: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   cartItemName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   cartItemPrice: {
//     fontSize: 16,
//     color: '#888',
//   },
//   cartItemControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   quantityControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quantityButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 5,
//     paddingHorizontal: 12,
//     borderRadius: 5,
//     marginHorizontal: 8,
//   },
//   quantityButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   removeButton: {
//     backgroundColor: '#F44336',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   removeButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   totalContainer: {
//     marginTop: 30,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//     alignItems: 'center',
//   },
//   totalText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   checkoutButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   checkoutButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cartList: {
//     paddingBottom: 20,
//   },
// });












// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
//   Modal,
//   ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';
// import { db, auth } from './firebaseConfig';
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
//   deleteDoc,
//   addDoc,
//   runTransaction,
//   onSnapshot,
//   getDoc,
// } from 'firebase/firestore';

// // Memoized Cart Item Component
// const CartItem = React.memo(({ item, onUpdateQuantity, onRemove }) => {
//   const [updating, setUpdating] = useState(false);

//   const handleUpdateQuantity = async (newQuantity) => {
//     setUpdating(true);
//     try {
//       await onUpdateQuantity(item.id, newQuantity);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const formattedPrice = typeof item.price === 'number' ? item.price.toFixed(2) : '0.00';
//   const subtotal = (item.price * item.quantity).toFixed(2);

//   return (
//     <View style={styles.cartItem}>
//       <Image
//         source={{ uri: item.imageUrl || 'https://via.placeholder.com/90' }}
//         style={styles.cartItemImage}
//       />
//       <View style={styles.cartItemDetails}>
//         <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
//         <Text style={styles.cartItemPrice}>${formattedPrice} each</Text>
//         <Text style={styles.cartItemSubtotal}>Subtotal: ${subtotal}</Text>
//         <View style={styles.cartItemControls}>
//           <View style={styles.quantityControls}>
//             <TouchableOpacity
//               onPress={() => handleUpdateQuantity(item.quantity - 1)}
//               style={[styles.quantityButton, updating && styles.disabledButton]}
//               disabled={updating || item.quantity <= 1}
//               accessibilityLabel={`Decrease quantity of ${item.name}`}
//             >
//               {updating ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.quantityButtonText}>-</Text>
//               )}
//             </TouchableOpacity>
//             <Text style={styles.quantityText}>{item.quantity}</Text>
//             <TouchableOpacity
//               onPress={() => handleUpdateQuantity(item.quantity + 1)}
//               style={[styles.quantityButton, updating && styles.disabledButton]}
//               disabled={updating}
//               accessibilityLabel={`Increase quantity of ${item.name}`}
//             >
//               {updating ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.quantityButtonText}>+</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//           <TouchableOpacity
//             style={styles.removeButton}
//             onPress={() => onRemove(item.id, item.name)}
//             accessibilityLabel={`Remove ${item.name} from cart`}
//           >
//             <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
//             <Text style={styles.removeButtonText}>Remove</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// });

// export default function CartScreen({ navigation }) {
//   const [cart, setCart] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);

//   const userId = auth.currentUser?.uid;

//   useEffect(() => {
//     if (!userId) {
//       setLoading(false);
//       return;
//     }

//     const unsubscribe = onSnapshot(
//       collection(db, 'users', userId, 'cart'),
//       (snapshot) => {
//         const cartList = snapshot.docs.map(doc => ({
//           ...doc.data(),
//           id: doc.id,
//           price: Number(doc.data().price) || 0,
//         }));
//         setCart(cartList);
//         calculateTotal(cartList);
//         setLoading(false);
//       },
//       (error) => {
//         console.error('Error listening to cart:', error);
//         Alert.alert('Error', 'Failed to load cart items.');
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [userId]);

//   const calculateTotal = (cartList) => {
//     const total = cartList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
//     setTotalAmount(total);
//   };

//   const updateItemQuantity = async (cartItemId, newQuantity) => {
//     if (newQuantity < 1) {
//       Alert.alert('Minimum Quantity', 'Quantity cannot be less than 1.');
//       return;
//     }

//     try {
//       const cartItem = cart.find(item => item.id === cartItemId);
//       const productRef = doc(db, 'products', cartItem.productId);
//       const productDoc = await getDoc(productRef);

//       if (!productDoc.exists()) {
//         Alert.alert('Error', 'Product not found.');
//         return;
//       }

//       const productData = productDoc.data();
//       const availableStock = productData.stock || 0;

//       if (newQuantity > availableStock) {
//         Alert.alert('Stock Limit', `Only ${availableStock} ${cartItem.name}(s) available in stock.`);
//         return;
//       }

//       const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
//       await updateDoc(cartItemRef, { quantity: newQuantity });
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       Alert.alert('Error', 'Failed to update quantity.');
//     }
//   };

//   const removeItemFromCart = (cartItemId, itemName) => {
//     Alert.alert(
//       'Remove Item',
//       `Are you sure you want to remove ${itemName} from your cart?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteDoc(doc(db, 'users', userId, 'cart', cartItemId));
//             } catch (error) {
//               console.error('Error removing item:', error);
//               Alert.alert('Error', 'Failed to remove item.');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const clearCart = () => {
//     if (cart.length === 0) return;

//     Alert.alert(
//       'Clear Cart',
//       'Are you sure you want to clear all items from your cart?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const cartRef = collection(db, 'users', userId, 'cart');
//               const cartSnapshot = await getDocs(cartRef);
//               const deletePromises = cartSnapshot.docs.map(docSnapshot =>
//                 deleteDoc(doc(db, 'users', userId, 'cart', docSnapshot.id))
//               );
//               await Promise.all(deletePromises);
//             } catch (error) {
//               console.error('Error clearing cart:', error);
//               Alert.alert('Error', 'Failed to clear cart.');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const proceedToCheckout = async () => {
//     if (cart.length === 0) {
//       Alert.alert('Empty Cart', 'Your cart is empty! Add some products to proceed.');
//       return;
//     }

//     try {
//       for (const item of cart) {
//         const productRef = doc(db, 'products', item.productId);
//         const productDoc = await getDoc(productRef);
//         if (!productDoc.exists()) {
//           Alert.alert('Error', `Product ${item.name} is no longer available.`);
//           return;
//         }
//         const productData = productDoc.data();
//         const availableStock = productData.stock || 0;
//         if (item.quantity > availableStock) {
//           Alert.alert('Stock Issue', `Only ${availableStock} ${item.name}(s) available in stock.`);
//           return;
//         }
//       }

//       setCheckoutModalVisible(true);
//     } catch (error) {
//       console.error('Error checking stock:', error);
//       Alert.alert('Error', 'Failed to verify stock.');
//     }
//   };

//   const confirmCheckout = async () => {
//     setCheckoutLoading(true);
//     try {
//       await runTransaction(db, async (transaction) => {
//         const purchasesRef = collection(db, 'users', userId, 'purchases');
//         const cartRef = collection(db, 'users', userId, 'cart');

//         for (const item of cart) {
//           const productRef = doc(db, 'products', item.productId);
//           const productDoc = await transaction.get(productRef);
//           if (!productDoc.exists()) {
//             throw new Error(`Product ${item.name} not found.`);
//           }
//           const productData = productDoc.data();
//           const newStock = (productData.stock || 0) - item.quantity;
//           if (newStock < 0) {
//             throw new Error(`Insufficient stock for ${item.name}.`);
//           }
//           transaction.update(productRef, { stock: newStock });

//           await addDoc(purchasesRef, {
//             productId: item.productId,
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//             imageUrl: item.imageUrl,
//             purchaseDate: new Date().toISOString(),
//           });
//         }

//         const cartSnapshot = await getDocs(cartRef);
//         cartSnapshot.forEach(docSnapshot => {
//           transaction.delete(doc(db, 'users', userId, 'cart', docSnapshot.id));
//         });
//       });

//       setCheckoutModalVisible(false);
//       Alert.alert('Purchase Successful!', 'Your items have been purchased.', [
//         { text: 'OK', onPress: () => navigation.navigate('PurchaseHistoryScreen') },
//       ]);
//     } catch (error) {
//       console.error('Error processing purchase:', error);
//       Alert.alert('Error', 'There was an issue completing your purchase.');
//     } finally {
//       setCheckoutLoading(false);
//     }
//   };

//   const renderCartItem = ({ item }) => (
//     <CartItem
//       item={item}
//       onUpdateQuantity={updateItemQuantity}
//       onRemove={removeItemFromCart}
//     />
//   );

//   if (loading) {
//     return (
//       <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
//         <Ionicons name="leaf-outline" size={50} color="#4CAF50" />
//         <Text style={styles.loadingText}>Loading your cart...</Text>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
//       <View style={styles.headerContainer}>
//         <View style={styles.headerRow}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//             accessibilityLabel="Go back"
//           >
//             <Ionicons name="arrow-back" size={24} color="#1B5E20" />
//           </TouchableOpacity>
//           <Text style={styles.title}>Your Cart</Text>
//           {cart.length > 0 && (
//             <TouchableOpacity
//               style={styles.clearButton}
//               onPress={clearCart}
//               accessibilityLabel="Clear cart"
//             >
//               <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
//               <Text style={styles.clearButtonText}>Clear</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {cart.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="leaf-outline" size={60} color="#666" style={styles.emptyIcon} />
//           <Text style={styles.emptyText}>Your cart is empty!</Text>
//           <TouchableOpacity
//             style={styles.shopButton}
//             onPress={() => navigation.navigate('BuyProductScreen')}
//           >
//             <Text style={styles.shopText}>Shop Now</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={cart}
//           keyExtractor={item => item.id}
//           renderItem={renderCartItem}
//           contentContainerStyle={styles.cartList}
//           initialNumToRender={10}
//           maxToRenderPerBatch={10}
//           windowSize={5}
//         />
//       )}

//       {cart.length > 0 && (
//         <LinearGradient
//           colors={['#FFFFFF', '#E8F5E9']}
//           style={styles.footer}
//         >
//           <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
//           <TouchableOpacity
//             style={styles.checkoutButton}
//             onPress={proceedToCheckout}
//             accessibilityLabel="Proceed to checkout"
//           >
//             <LinearGradient
//               colors={['#4CAF50', '#388E3C']}
//               style={styles.checkoutGradient}
//             >
//               <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>
//       )}

//       <Modal
//         visible={checkoutModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setCheckoutModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Confirm Purchase</Text>
//             <Text style={styles.modalText}>
//               Total Amount: ${totalAmount.toFixed(2)}
//             </Text>
//             <Text style={styles.modalText}>
//               Are you sure you want to proceed with your purchase?
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => setCheckoutModalVisible(false)}
//               >
//                 <Text style={styles.modalCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalConfirmButton}
//                 onPress={confirmCheckout}
//                 disabled={checkoutLoading}
//               >
//                 <Text style={styles.modalConfirmText}>
//                   {checkoutLoading ? 'Processing...' : 'Confirm Purchase'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight,
//   },
//   headerContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#FFFFFF',
//     elevation: 5,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     padding: 5,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#1B5E20',
//     textAlign: 'center',
//   },
//   clearButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F44336',
//   },
//   clearButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 5,
//   },
//   cartItem: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     padding: 15,
//     borderRadius: 15,
//     marginBottom: 15,
//     marginHorizontal: 20,
//     elevation: 3,
//     alignItems: 'center',
//   },
//   cartItemImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 10,
//     marginRight: 15,
//     resizeMode: 'cover',
//   },
//   cartItemDetails: {
//     flex: 1,
//   },
//   cartItemName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   cartItemPrice: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 5,
//   },
//   cartItemSubtotal: {
//     fontSize: 14,
//     color: '#4CAF50',
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   cartItemControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   quantityControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quantityButton: {
//     backgroundColor: '#4CAF50',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   disabledButton: {
//     backgroundColor: '#B0BEC5',
//   },
//   quantityButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginHorizontal: 5,
//   },
//   removeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F44336',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//   },
//   removeButtonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginLeft: 5,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     elevation: 5,
//   },
//   totalText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   checkoutButton: {
//     borderRadius: 30,
//   },
//   checkoutGradient: {
//     paddingVertical: 15,
//     alignItems: 'center',
//   },
//   checkoutButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cartList: {
//     padding: 20,
//     paddingBottom: 120,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyIcon: {
//     marginBottom: 15,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#666',
//     marginBottom: 20,
//   },
//   shopButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   shopText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#333',
//     marginTop: 10,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     padding: 20,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1B5E20',
//     marginBottom: 15,
//   },
//   modalText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 20,
//   },
//   modalCancelButton: {
//     flex: 1,
//     backgroundColor: '#F44336',
//     paddingVertical: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   modalCancelText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   modalConfirmButton: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   modalConfirmText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });





// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
//   Modal,
//   ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';
// import { db, auth } from './firebaseConfig';
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
//   deleteDoc,
//   addDoc,
//   runTransaction,
//   onSnapshot,
//   getDoc,
// } from 'firebase/firestore';

// // Memoized Cart Item Component
// const CartItem = React.memo(({ item, onUpdateQuantity, onRemove }) => {
//   const [updating, setUpdating] = useState(false);

//   const handleUpdateQuantity = async (newQuantity) => {
//     setUpdating(true);
//     try {
//       await onUpdateQuantity(item.id, newQuantity);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const formattedPrice = typeof item.price === 'number' ? item.price.toFixed(2) : '0.00';
//   const subtotal = (item.price * item.quantity).toFixed(2);

//   return (
//     <View style={styles.cartItem}>
//       <Image
//         source={{ uri: item.imageUrl || 'https://via.placeholder.com/90' }}
//         style={styles.cartItemImage}
//       />
//       <View style={styles.cartItemDetails}>
//         <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
//         <Text style={styles.cartItemPrice}>${formattedPrice} each</Text>
//         <Text style={styles.cartItemSubtotal}>Subtotal: ${subtotal}</Text>
//         <View style={styles.cartItemControls}>
//           <View style={styles.quantityControls}>
//             <TouchableOpacity
//               onPress={() => handleUpdateQuantity(item.quantity - 1)}
//               style={[styles.quantityButton, updating && styles.disabledButton]}
//               disabled={updating || item.quantity <= 1}
//               accessibilityLabel={`Decrease quantity of ${item.name}`}
//             >
//               {updating ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.quantityButtonText}>-</Text>
//               )}
//             </TouchableOpacity>
//             <Text style={styles.quantityText}>{item.quantity}</Text>
//             <TouchableOpacity
//               onPress={() => handleUpdateQuantity(item.quantity + 1)}
//               style={[styles.quantityButton, updating && styles.disabledButton]}
//               disabled={updating}
//               accessibilityLabel={`Increase quantity of ${item.name}`}
//             >
//               {updating ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.quantityButtonText}>+</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//           <TouchableOpacity
//             style={styles.removeButton}
//             onPress={() => onRemove(item.id, item.name)}
//             accessibilityLabel={`Remove ${item.name} from cart`}
//           >
//             <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
//             <Text style={styles.removeButtonText}>Remove</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// });

// export default function CartScreen({ navigation }) {
//   const [cart, setCart] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);

//   const userId = auth.currentUser?.uid;

//   useEffect(() => {
//     if (!userId) {
//       setLoading(false);
//       return;
//     }

//     const unsubscribe = onSnapshot(
//       collection(db, 'users', userId, 'cart'),
//       (snapshot) => {
//         const cartList = snapshot.docs.map(doc => ({
//           ...doc.data(),
//           id: doc.id,
//           price: Number(doc.data().price) || 0,
//         }));
//         setCart(cartList);
//         calculateTotal(cartList);
//         setLoading(false);
//       },
//       (error) => {
//         console.error('Error listening to cart:', error);
//         Alert.alert('Error', 'Failed to load cart items.');
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [userId]);

//   const calculateTotal = (cartList) => {
//     const total = cartList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
//     setTotalAmount(total);
//   };

//   const updateItemQuantity = async (cartItemId, newQuantity) => {
//     if (newQuantity < 1) {
//       Alert.alert('Minimum Quantity', 'Quantity cannot be less than 1.');
//       return;
//     }

//     try {
//       const cartItem = cart.find(item => item.id === cartItemId);
//       const productRef = doc(db, 'products', cartItem.productId);
//       const productDoc = await getDoc(productRef);

//       if (!productDoc.exists()) {
//         Alert.alert('Error', 'Product not found.');
//         return;
//       }

//       const productData = productDoc.data();
//       const availableStock = productData.stock || 0;

//       if (newQuantity > availableStock) {
//         Alert.alert('Stock Limit', `Only ${availableStock} ${cartItem.name}(s) available in stock.`);
//         return;
//       }

//       const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
//       await updateDoc(cartItemRef, { quantity: newQuantity });
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       Alert.alert('Error', 'Failed to update quantity.');
//     }
//   };

//   const removeItemFromCart = (cartItemId, itemName) => {
//     Alert.alert(
//       'Remove Item',
//       `Are you sure you want to remove ${itemName} from your cart?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteDoc(doc(db, 'users', userId, 'cart', cartItemId));
//             } catch (error) {
//               console.error('Error removing item:', error);
//               Alert.alert('Error', 'Failed to remove item.');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const clearCart = () => {
//     if (cart.length === 0) return;

//     Alert.alert(
//       'Clear Cart',
//       'Are you sure you want to clear all items from your cart?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const cartRef = collection(db, 'users', userId, 'cart');
//               const cartSnapshot = await getDocs(cartRef);
//               const deletePromises = cartSnapshot.docs.map(docSnapshot =>
//                 deleteDoc(doc(db, 'users', userId, 'cart', docSnapshot.id))
//               );
//               await Promise.all(deletePromises);
//             } catch (error) {
//               console.error('Error clearing cart:', error);
//               Alert.alert('Error', 'Failed to clear cart.');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const proceedToCheckout = async () => {
//     if (cart.length === 0) {
//       Alert.alert('Empty Cart', 'Your cart is empty! Add some products to proceed.');
//       return;
//     }

//     try {
//       for (const item of cart) {
//         const productRef = doc(db, 'products', item.productId);
//         const productDoc = await getDoc(productRef);
//         if (!productDoc.exists()) {
//           Alert.alert('Error', `Product ${item.name} is no longer available.`);
//           return;
//         }
//         const productData = productDoc.data();
//         const availableStock = productData.stock || 0;
//         if (item.quantity > availableStock) {
//           Alert.alert('Stock Issue', `Only ${availableStock} ${item.name}(s) available in stock.`);
//           return;
//         }
//       }

//       setCheckoutModalVisible(true);
//     } catch (error) {
//       console.error('Error checking stock:', error);
//       Alert.alert('Error', 'Failed to verify stock.');
//     }
//   };

//   const confirmCheckout = async () => {
//     setCheckoutLoading(true);
//     try {
//       await runTransaction(db, async (transaction) => {
//         // Perform all reads first
//         const productReads = {};
//         for (const item of cart) {
//           const productRef = doc(db, 'products', item.productId);
//           const productDoc = await transaction.get(productRef);
//           if (!productDoc.exists()) {
//             throw new Error(`Product ${item.name} not found.`);
//           }
//           productReads[item.productId] = {
//             stock: productDoc.data().stock || 0,
//             name: item.name,
//           };
//         }

//         // Perform all writes
//         const purchasesRef = collection(db, 'users', userId, 'purchases');
//         const cartRef = collection(db, 'users', userId, 'cart');
//         const cartSnapshot = await getDocs(cartRef);

//         for (const item of cart) {
//           const productRef = doc(db, 'products', item.productId);
//           const newStock = productReads[item.productId].stock - item.quantity;
//           if (newStock < 0) {
//             throw new Error(`Insufficient stock for ${item.name}.`);
//           }
//           transaction.update(productRef, { stock: newStock });

//           transaction.set(doc(purchasesRef), {
//             productId: item.productId,
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//             imageUrl: item.imageUrl,
//             purchaseDate: new Date().toISOString(),
//           });
//         }

//         cartSnapshot.forEach(docSnapshot => {
//           transaction.delete(doc(db, 'users', userId, 'cart', docSnapshot.id));
//         });
//       });

//       setCheckoutModalVisible(false);
//       Alert.alert('Purchase Successful!', 'Your items have been purchased.', [
//         { text: 'OK', onPress: () => navigation.navigate('PurchaseHistoryScreen') },
//       ]);
//     } catch (error) {
//       console.error('Error processing purchase:', error);
//       Alert.alert('Error', 'There was an issue completing your purchase: ' + error.message);
//     } finally {
//       setCheckoutLoading(false);
//     }
//   };

//   const renderCartItem = ({ item }) => (
//     <CartItem
//       item={item}
//       onUpdateQuantity={updateItemQuantity}
//       onRemove={removeItemFromCart}
//     />
//   );

//   if (loading) {
//     return (
//       <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
//         <Ionicons name="leaf-outline" size={50} color="#4CAF50" />
//         <Text style={styles.loadingText}>Loading your cart...</Text>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
//       <View style={styles.headerContainer}>
//         <View style={styles.headerRow}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//             accessibilityLabel="Go back"
//           >
//             <Ionicons name="arrow-back" size={24} color="#1B5E20" />
//           </TouchableOpacity>
//           <Text style={styles.title}>Your Cart</Text>
//           {cart.length > 0 && (
//             <TouchableOpacity
//               style={styles.clearButton}
//               onPress={clearCart}
//               accessibilityLabel="Clear cart"
//             >
//               <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
//               <Text style={styles.clearButtonText}>Clear</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {cart.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="leaf-outline" size={60} color="#666" style={styles.emptyIcon} />
//           <Text style={styles.emptyText}>Your cart is empty!</Text>
//           <TouchableOpacity
//             style={styles.shopButton}
//             onPress={() => navigation.navigate('BuyProductScreen')}
//           >
//             <Text style={styles.shopText}>Shop Now</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={cart}
//           keyExtractor={item => item.id}
//           renderItem={renderCartItem}
//           contentContainerStyle={styles.cartList}
//           initialNumToRender={10}
//           maxToRenderPerBatch={10}
//           windowSize={5}
//         />
//       )}

//       {cart.length > 0 && (
//         <LinearGradient
//           colors={['#FFFFFF', '#E8F5E9']}
//           style={styles.footer}
//         >
//           <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
//           <TouchableOpacity
//             style={styles.checkoutButton}
//             onPress={proceedToCheckout}
//             accessibilityLabel="Proceed to checkout"
//           >
//             <LinearGradient
//               colors={['#4CAF50', '#388E3C']}
//               style={styles.checkoutGradient}
//             >
//               <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>
//       )}

//       <Modal
//         visible={checkoutModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setCheckoutModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Confirm Purchase</Text>
//             <Text style={styles.modalText}>
//               Total Amount: ${totalAmount.toFixed(2)}
//             </Text>
//             <Text style={styles.modalText}>
//               Are you sure you want to proceed with your purchase?
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => setCheckoutModalVisible(false)}
//               >
//                 <Text style={styles.modalCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalConfirmButton}
//                 onPress={confirmCheckout}
//                 disabled={checkoutLoading}
//               >
//                 <Text style={styles.modalConfirmText}>
//                   {checkoutLoading ? 'Processing...' : 'Confirm Purchase'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight,
//   },
//   headerContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#FFFFFF',
//     elevation: 5,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     padding: 5,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#1B5E20',
//     textAlign: 'center',
//   },
//   clearButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F44336',
//   },
//   clearButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 5,
//   },
//   cartItem: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     padding: 15,
//     borderRadius: 15,
//     marginBottom: 15,
//     marginHorizontal: 20,
//     elevation: 3,
//     alignItems: 'center',
//   },
//   cartItemImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 10,
//     marginRight: 15,
//     resizeMode: 'cover',
//   },
//   cartItemDetails: {
//     flex: 1,
//   },
//   cartItemName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   cartItemPrice: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 5,
//   },
//   cartItemSubtotal: {
//     fontSize: 14,
//     color: '#4CAF50',
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   cartItemControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   quantityControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quantityButton: {
//     backgroundColor: '#4CAF50',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   disabledButton: {
//     backgroundColor: '#B0BEC5',
//   },
//   quantityButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginHorizontal: 5,
//   },
//   removeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F44336',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//   },
//   removeButtonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginLeft: 5,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     elevation: 5,
//   },
//   totalText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   checkoutButton: {
//     borderRadius: 30,
//   },
//   checkoutGradient: {
//     paddingVertical: 15,
//     alignItems: 'center',
//   },
//   checkoutButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cartList: {
//     padding: 20,
//     paddingBottom: 120,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyIcon: {
//     marginBottom: 15,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#666',
//     marginBottom: 20,
//   },
//   shopButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   shopText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#333',
//     marginTop: 10,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     padding: 20,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1B5E20',
//     marginBottom: 15,
//   },
//   modalText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 20,
//   },
//   modalCancelButton: {
//     flex: 1,
//     backgroundColor: '#F44336',
//     paddingVertical: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   modalCancelText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   modalConfirmButton: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   modalConfirmText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from './firebaseConfig';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';

const CartItem = React.memo(({ item, onUpdateQuantity, onRemove }) => {
  const [updating, setUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity) => {
    setUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } finally {
      setUpdating(false);
    }
  };

  const formattedPrice = typeof item.price === 'number' ? item.price.toFixed(2) : '0.00';
  const subtotal = (item.price * item.quantity).toFixed(2);

  return (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/90' }}
        style={styles.cartItemImage}
      />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${formattedPrice} each</Text>
        <Text style={styles.cartItemSubtotal}>Subtotal: ${subtotal}</Text>
        <View style={styles.cartItemControls}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => handleUpdateQuantity(item.quantity - 1)}
              style={[styles.quantityButton, updating || item.quantity <= 1 ? styles.disabledButton : null]}
              disabled={updating || item.quantity <= 1}
              accessibilityLabel={`Decrease quantity of ${item.name}`}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.quantityButtonText}>-</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => handleUpdateQuantity(item.quantity + 1)}
              style={[styles.quantityButton, updating ? styles.disabledButton : null]}
              disabled={updating}
              accessibilityLabel={`Increase quantity of ${item.name}`}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.quantityButtonText}>+</Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.id, item.name)}
            accessibilityLabel={`Remove ${item.name} from cart`}
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      Alert.alert('Error', 'Please log in to view your cart.');
      navigation.navigate('SignInScreen');
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'users', userId, 'cart'),
      (snapshot) => {
        const cartList = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          price: Number(doc.data().price) || 0,
        }));
        setCart(cartList);
        calculateTotal(cartList);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to cart:', error);
        Alert.alert('Error', 'Failed to load cart items.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, navigation]);

  const calculateTotal = (cartList) => {
    const total = cartList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const updateItemQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      Alert.alert('Minimum Quantity', 'Quantity cannot be less than 1.');
      return;
    }

    try {
      const cartItem = cart.find(item => item.id === cartItemId);
      const productRef = doc(db, 'products', cartItem.productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        Alert.alert('Error', 'Product not found.');
        return;
      }

      const productData = productDoc.data();
      const availableStock = Number(productData.stock) || 0;

      if (newQuantity > availableStock) {
        Alert.alert('Stock Limit', `Only ${availableStock} ${cartItem.name}(s) available in stock.`);
        return;
      }

      const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
      await updateDoc(cartItemRef, { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity.');
    }
  };

  const removeItemFromCart = (cartItemId, itemName) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${itemName} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', userId, 'cart', cartItemId));
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item.');
            }
          },
        },
      ]
    );
  };

  const clearCart = () => {
    if (cart.length === 0) return;

    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const cartRef = collection(db, 'users', userId, 'cart');
              const cartSnapshot = await getDocs(cartRef);
              const deletePromises = cartSnapshot.docs.map(docSnapshot =>
                deleteDoc(doc(db, 'users', userId, 'cart', docSnapshot.id))
              );
              await Promise.all(deletePromises);
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Error', 'Failed to clear cart.');
            }
          },
        },
      ]
    );
  };

  const proceedToCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty! Add some products to proceed.');
      return;
    }

    try {
      for (const item of cart) {
        const productRef = doc(db, 'products', item.productId);
        const productDoc = await getDoc(productRef);
        if (!productDoc.exists()) {
          Alert.alert('Error', `Product ${item.name} is no longer available.`);
          return;
        }
        const productData = productDoc.data();
        const availableStock = Number(productData.stock) || 0;
        if (item.quantity > availableStock) {
          Alert.alert('Stock Issue', `Only ${availableStock} ${item.name}(s) available in stock.`);
          return;
        }
      }

      navigation.navigate('PaymentScreen', { cart, totalAmount });
    } catch (error) {
      console.error('Error checking stock:', error);
      Alert.alert('Error', 'Failed to verify stock.');
    }
  };

  const renderCartItem = ({ item }) => (
    <CartItem
      item={item}
      onUpdateQuantity={updateItemQuantity}
      onRemove={removeItemFromCart}
    />
  );

  if (loading) {
    return (
      <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
        <Ionicons name="leaf-outline" size={50} color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
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
          <Text style={styles.title}>Your Cart</Text>
          {cart.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearCart}
              accessibilityLabel="Clear cart"
            >
              <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={60} color="#666" style={styles.emptyIcon} />
          <Text style={styles.emptyText}>Your cart is empty!</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('BuyProductScreen')}
          >
            <Text style={styles.shopText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={item => item.id}
          renderItem={renderCartItem}
          contentContainerStyle={styles.cartList}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}

      {cart.length > 0 && (
        <LinearGradient
          colors={['#FFFFFF', '#E8F5E9']}
          style={styles.footer}
        >
          <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={proceedToCheckout}
            accessibilityLabel="Proceed to checkout"
          >
            <LinearGradient
              colors={['#4CAF50', '#388E3C']}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </LinearGradient>
  );
}

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
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#F44336',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 20,
    elevation: 3,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover',
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  cartItemSubtotal: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 10,
  },
  cartItemControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#4CAF50',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 5,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  checkoutButton: {
    borderRadius: 30,
  },
  checkoutGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartList: {
    padding: 20,
    paddingBottom: 120,
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