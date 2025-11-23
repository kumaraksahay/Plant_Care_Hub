// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, Button } from 'react-native';
// import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db, auth } from './firebaseConfig'; // Firebase setup

// export default function BuyProductScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   const userId = auth.currentUser?.uid; // Get user ID from Firebase Authentication

//   // Fetch products from Firestore
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setProducts(productList);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     const fetchCart = async () => {
//       if (userId) {
//         const cartRef = collection(db, 'users', userId, 'cart');
//         const cartSnapshot = await getDocs(cartRef);
//         const cartList = cartSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setCart(cartList);
//       }
//     };
    
//     fetchProducts();
//     fetchCart();
//   }, [userId]);

//   // Add product to cart
//   const addToCart = async (product) => {
//     if (!userId) {
//       Alert.alert('Please login to add items to the cart.');
//       return;
//     }

//     const existingProduct = cart.find(item => item.productId === product.id);

//     if (existingProduct) {
//       // If the product is already in the cart, update the quantity
//       const updatedQuantity = existingProduct.quantity + 1;
//       const productRef = doc(db, 'users', userId, 'cart', existingProduct.id);
//       await updateDoc(productRef, { quantity: updatedQuantity });
//       setCart(prevCart => prevCart.map(item => item.productId === product.id ? { ...item, quantity: updatedQuantity } : item));
//     } else {
//       // If the product is not in the cart, add it
//       const newCartItem = {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//       };
//       const cartRef = collection(db, 'users', userId, 'cart');
//       const docRef = await addDoc(cartRef, newCartItem);
//       setCart(prevCart => [...prevCart, { ...newCartItem, id: docRef.id }]);
//     }
//   };

//   // View cart details
//   const goToCart = () => {
//     navigation.navigate('CartScreen');
//   };

//   // Render Product Item
//   const renderProduct = ({ item }) => (
//     <View style={styles.productItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
//       <View style={styles.productDetails}>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productPrice}>${item.price}</Text>
//       </View>
//       <TouchableOpacity
//         style={styles.addToCartButton}
//         onPress={() => addToCart(item)}
//       >
//         <Text style={styles.buttonText}>Add to Cart</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <Text>Loading products...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Shop Products</Text>

//       <FlatList
//         data={products}
//         keyExtractor={item => item.id}
//         renderItem={renderProduct}
//         contentContainerStyle={styles.productList}
//       />

//       {/* Cart button */}
//       <TouchableOpacity style={styles.cartButton} onPress={goToCart}>
//         <Text style={styles.cartButtonText}>Go to Cart ({cart.length})</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   productItem: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     alignItems: 'center',
//   },
//   productImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 8,
//     marginRight: 15,
//     resizeMode: 'cover',
//   },
//   productDetails: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   productPrice: {
//     fontSize: 14,
//     color: '#666',
//   },
//   addToCartButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   cartButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   cartButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });


// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db, auth } from './firebaseConfig'; // Firebase setup

// export default function BuyProductScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userId = auth.currentUser?.uid; // Get user ID from Firebase Authentication

//   // Fetch products from Firestore
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setProducts(productList);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchCart = async () => {
//       if (userId) {
//         const cartRef = collection(db, 'users', userId, 'cart');
//         const cartSnapshot = await getDocs(cartRef);
//         const cartList = cartSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setCart(cartList);
//       }
//     };

//     fetchProducts();
//     fetchCart();
//   }, [userId]);

//   // Add product to cart
//   const addToCart = async (product) => {
//     if (!userId) {
//       Alert.alert('Please login to add items to the cart.');
//       return;
//     }

//     const existingProduct = cart.find(item => item.productId === product.id);

//     if (existingProduct) {
//       // If the product is already in the cart, update the quantity
//       const updatedQuantity = existingProduct.quantity + 1;
//       const productRef = doc(db, 'users', userId, 'cart', existingProduct.id);
//       await updateDoc(productRef, { quantity: updatedQuantity });
//       setCart(prevCart => prevCart.map(item => item.productId === product.id ? { ...item, quantity: updatedQuantity } : item));
//     } else {
//       // If the product is not in the cart, add it
//       const newCartItem = {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//         imageUrl: product.imageUrl, // Add imageUrl if it exists in product data
//       };
//       const cartRef = collection(db, 'users', userId, 'cart');
//       const docRef = await addDoc(cartRef, newCartItem);
//       setCart(prevCart => [...prevCart, { ...newCartItem, id: docRef.id }]);
//     }
//   };

//   // View cart details
//   const goToCart = () => {
//     navigation.navigate('CartScreen');
//   };

//   // Render Product Item
//   const renderProduct = ({ item }) => (
//     <View style={styles.productItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
//       <View style={styles.productDetails}>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productPrice}>${item.price}</Text>
//       </View>
//       <TouchableOpacity
//         style={styles.addToCartButton}
//         onPress={() => addToCart(item)}
//       >
//         <Text style={styles.buttonText}>Add to Cart</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <Text>Loading products...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Shop Products</Text>

//       <FlatList
//         data={products}
//         keyExtractor={item => item.id}
//         renderItem={renderProduct}
//         contentContainerStyle={styles.productList}
//       />

//       {/* Cart button */}
//       <TouchableOpacity style={styles.cartButton} onPress={goToCart}>
//         <Text style={styles.cartButtonText}>Go to Cart ({cart.length})</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   productItem: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     alignItems: 'center',
//   },
//   productImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 8,
//     marginRight: 15,
//     resizeMode: 'cover',
//   },
//   productDetails: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   productPrice: {
//     fontSize: 14,
//     color: '#666',
//   },
//   addToCartButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   cartButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   cartButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });



// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db, auth } from './firebaseConfig'; // Firebase setup

// export default function BuyProductScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userId = auth.currentUser?.uid; // Get user ID from Firebase Authentication

//   // Fetch products from Firestore
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setProducts(productList);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchCart = async () => {
//       if (userId) {
//         const cartRef = collection(db, 'users', userId, 'cart');
//         const cartSnapshot = await getDocs(cartRef);
//         const cartList = cartSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setCart(cartList);
//       }
//     };

//     fetchProducts();
//     fetchCart();
//   }, [userId]);

//   // Add product to cart
//   const addToCart = async (product) => {
//     if (!userId) {
//       Alert.alert('Please login to add items to the cart.');
//       return;
//     }

//     const existingProduct = cart.find(item => item.productId === product.id);

//     if (existingProduct) {
//       // If the product is already in the cart, update the quantity
//       const updatedQuantity = existingProduct.quantity + 1;
//       const productRef = doc(db, 'users', userId, 'cart', existingProduct.id);
//       await updateDoc(productRef, { quantity: updatedQuantity });
//       setCart(prevCart => prevCart.map(item => item.productId === product.id ? { ...item, quantity: updatedQuantity } : item));
//     } else {
//       // If the product is not in the cart, add it
//       const newCartItem = {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//         imageUrl: product.imageUrl, // Add imageUrl if it exists in product data
//       };
//       const cartRef = collection(db, 'users', userId, 'cart');
//       const docRef = await addDoc(cartRef, newCartItem);
//       setCart(prevCart => [...prevCart, { ...newCartItem, id: docRef.id }]);
//     }
//   };

//   // View cart details
//   const goToCart = () => {
//     navigation.navigate('CartScreen');
//   };

//   // Render Product Item
//   const renderProduct = ({ item }) => (
//     <View style={styles.productItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
//       <View style={styles.productDetails}>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productPrice}>${item.price}</Text>
//       </View>
//       <TouchableOpacity
//         style={styles.addToCartButton}
//         onPress={() => addToCart(item)}
//       >
//         <Text style={styles.buttonText}>Add to Cart</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <Text>Loading products...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Adjusted heading container */}
//       <View style={styles.headerContainer}>
//         <Text style={styles.title}>Shop Products</Text>
//       </View>

//       <FlatList
//         data={products}
//         keyExtractor={item => item.id}
//         renderItem={renderProduct}
//         contentContainerStyle={styles.productList}
//       />

//       {/* Cart button */}
//       <TouchableOpacity style={styles.cartButton} onPress={goToCart}>
//         <Text style={styles.cartButtonText}>Go to Cart ({cart.length})</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//     padding: 20,
//   },
//   // Adjusted header container to ensure it gets proper space
//   headerContainer: {
//     width: '100%',
//     paddingTop: 20, // Add some space at the top to prevent the header from being cut off
//     paddingBottom: 10,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   productItem: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     alignItems: 'center',
//   },
//   productImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 8,
//     marginRight: 15,
//     resizeMode: 'cover',
//   },
//   productDetails: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   productPrice: {
//     fontSize: 14,
//     color: '#666',
//   },
//   addToCartButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   cartButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   cartButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
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
//   TextInput,
//   ScrollView,
//   Modal,
//   ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   collection,
//   getDocs,
//   addDoc,
//   doc,
//   updateDoc,
//   onSnapshot,
// } from 'firebase/firestore';
// import { db, auth } from './firebaseConfig';

// // Memoized Product Item Component
// const ProductItem = React.memo(({ item, onAddToCart, cart, onViewDetails }) => {
//   const existingCartItem = cart.find(itemInCart => itemInCart.productId === item.id);
//   const availableStock = item.stock || 0;
//   const inCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
//   const canAdd = availableStock > inCartQuantity;
//   const rating = item.rating || 0;

//   const formattedPrice = typeof item.price === 'number' ? item.price.toFixed(2) : '0.00';
//   const originalPrice = item.originalPrice
//     ? typeof item.originalPrice === 'number'
//       ? item.originalPrice.toFixed(2)
//       : '0.00'
//     : null;
//   const discount = originalPrice
//     ? ((1 - item.price / originalPrice) * 100).toFixed(0)
//     : 0;

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <Ionicons
//           key={i}
//           name={i <= rating ? 'star' : 'star-outline'}
//           size={14}
//           color="#FFD700"
//           style={styles.star}
//         />
//       );
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.productCard}>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={() => onViewDetails(item)}
//       >
//         <Image
//           source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
//           style={styles.productImage}
//         />
//         {discount > 0 && (
//           <View style={styles.discountBadge}>
//             <Text style={styles.discountText}>-{discount}%</Text>
//           </View>
//         )}
//         <View style={styles.productInfo}>
//           <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
//           <View style={styles.ratingContainer}>{renderStars()}</View>
//           <Text style={styles.productPrice}>${formattedPrice}</Text>
//           {originalPrice && (
//             <Text style={styles.originalPrice}>${originalPrice}</Text>
//           )}
//           <Text style={styles.productStock}>
//             {availableStock > 0 ? `${availableStock} Left` : 'Out of Stock'}
//           </Text>
//           <TouchableOpacity
//             style={[styles.addToCartButton, !canAdd && styles.disabledButton]}
//             onPress={() => canAdd && onAddToCart(item)}
//             disabled={!canAdd}
//             accessibilityLabel={`Add ${item.name} to cart`}
//           >
//             <Ionicons name="cart-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
//             <Text style={styles.buttonText}>{canAdd ? 'Add to Cart' : 'Max Reached'}</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// });

// export default function BuyProductScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [minRating, setMinRating] = useState(0);
//   const [sortBy, setSortBy] = useState('default');
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);
//   const [tempMinRating, setTempMinRating] = useState(0);
//   const [tempSortBy, setTempSortBy] = useState('default');

//   const userId = auth.currentUser?.uid;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             ...data,
//             id: doc.id,
//             stock: data.stock !== undefined ? Number(data.stock) : 0,
//             price: data.price !== undefined ? Number(data.price) : 0,
//             originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : null,
//             rating: data.rating !== undefined ? Number(data.rating) : 0,
//             category: data.category || 'Others',
//           };
//         });
//         setProducts(productList);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         Alert.alert('Error', 'Failed to load products.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const unsubscribeCart = userId
//       ? onSnapshot(collection(db, 'users', userId, 'cart'), (snapshot) => {
//           const cartList = snapshot.docs.map(doc => ({
//             ...doc.data(),
//             id: doc.id,
//             price: Number(doc.data().price) || 0,
//           }));
//           setCart(cartList);
//         }, (error) => {
//           console.error('Error listening to cart:', error);
//           Alert.alert('Error', 'Failed to load cart items.');
//         })
//       : () => {};

//     fetchProducts();
//     return () => unsubscribeCart();
//   }, [userId]);

//   const addToCart = async (product) => {
//     if (!userId) {
//       Alert.alert('Login Required', 'Please login to add items to the cart.');
//       return;
//     }

//     const existingProduct = cart.find(item => item.productId === product.id);
//     const availableStock = product.stock || 0;
//     const inCartQuantity = existingProduct ? existingProduct.quantity : 0;

//     if (inCartQuantity >= availableStock) {
//       Alert.alert('Stock Limit', `Only ${availableStock} ${product.name}(s) available.`);
//       return;
//     }

//     try {
//       if (existingProduct) {
//         await updateDoc(doc(db, 'users', userId, 'cart', existingProduct.id), {
//           quantity: inCartQuantity + 1,
//         });
//       } else {
//         await addDoc(collection(db, 'users', userId, 'cart'), {
//           productId: product.id,
//           name: product.name,
//           price: Number(product.price) || 0,
//           quantity: 1,
//           imageUrl: product.imageUrl,
//         });
//       }
//       Alert.alert('Success', `${product.name} added to cart!`);
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       Alert.alert('Error', 'Failed to add item to cart.');
//     }
//   };

//   const goToCart = () => navigation.navigate('CartScreen');
//   const viewDetails = (product) => navigation.navigate('ProductDetailsScreen', { product });

//   const filterAndSortProducts = () => {
//     if (!products || products.length === 0) return [];

//     let filtered = products.filter(product => {
//       const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
//       const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
//       const matchesRating = product.rating >= minRating;
//       return matchesSearch && matchesCategory && matchesPrice && matchesRating;
//     });

//     switch (sortBy) {
//       case 'priceLowToHigh':
//         filtered.sort((a, b) => a.price - b.price);
//         break;
//       case 'priceHighToLow':
//         filtered.sort((a, b) => b.price - a.price);
//         break;
//       default:
//         break;
//     }

//     console.log('Filtered Products:', filtered); // Debugging log
//     return filtered;
//   };

//   const categories = ['All', ...new Set(products.map(product => product.category))];
//   const filteredProducts = filterAndSortProducts();
//   const calculateCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

//   const renderProduct = ({ item }) => (
//     <ProductItem item={item} onAddToCart={addToCart} cart={cart} onViewDetails={viewDetails} />
//   );

//   if (loading) {
//     return (
//       <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
//         <Ionicons name="leaf-outline" size={50} color="#4CAF50" />
//         <Text style={styles.loadingText}>Loading your plants...</Text>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#1B5E20" />
//         </TouchableOpacity>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search for plants..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#666"
//           />
//         </View>
//         <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
//           <Ionicons name="cart-outline" size={24} color="#1B5E20" />
//           {cart.length > 0 && (
//             <View style={styles.cartBadge}>
//               <Text style={styles.cartBadgeText}>{cart.length}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.filterRow}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
//           {categories.map(category => (
//             <TouchableOpacity
//               key={category}
//               style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
//               onPress={() => setSelectedCategory(category)}
//             >
//               <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
//                 {category}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//         <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
//           <Ionicons name="filter" size={20} color="#1B5E20" />
//         </TouchableOpacity>
//       </View>

//       {filteredProducts.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="leaf-outline" size={60} color="#666" />
//           <Text style={styles.emptyText}>No plants found.</Text>
//           <TouchableOpacity
//             style={styles.resetButton}
//             onPress={() => {
//               setSearchQuery('');
//               setSelectedCategory('All');
//               setPriceRange([0, 1000]);
//               setMinRating(0);
//               setSortBy('default');
//             }}
//           >
//             <Text style={styles.resetText}>Reset Filters</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredProducts}
//           keyExtractor={item => item.id}
//           renderItem={renderProduct}
//           contentContainerStyle={styles.productList}
//           numColumns={2}
//           columnWrapperStyle={styles.columnWrapper}
//           initialNumToRender={10}
//           maxToRenderPerBatch={10}
//           windowSize={5}
//           extraData={[cart.length, selectedCategory, priceRange, minRating, sortBy]}
//         />
//       )}

//       {cart.length > 0 && (
//         <LinearGradient colors={['#FFFFFF', '#E8F5E9']} style={styles.cartSummary}>
//           <Text style={styles.cartSummaryText}>
//             Cart: {cart.reduce((total, item) => total + item.quantity, 0)} items
//           </Text>
//           <Text style={styles.cartTotal}>Total: ${calculateCartTotal()}</Text>
//           <TouchableOpacity style={styles.checkoutButton} onPress={goToCart}>
//             <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.checkoutGradient}>
//               <Text style={styles.checkoutText}>Proceed to Cart</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>
//       )}

//       <Modal
//         visible={filterModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setFilterModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <Text style={styles.modalSubtitle}>Price Range: ${tempPriceRange[0]} - ${tempPriceRange[1]}</Text>
//             <View style={styles.sliderPlaceholder}>
//               <Text style={styles.sliderText}>[Price Range Slider Placeholder]</Text>
//             </View>
//             <Text style={styles.modalSubtitle}>Minimum Rating:</Text>
//             <View style={styles.ratingPicker}>
//               {[0, 1, 2, 3, 4].map(rating => (
//                 <TouchableOpacity
//                   key={rating}
//                   style={[styles.ratingOption, tempMinRating === rating && styles.ratingOptionActive]}
//                   onPress={() => setTempMinRating(rating)}
//                 >
//                   <Text style={[styles.ratingText, tempMinRating === rating && styles.ratingTextActive]}>
//                     {rating}+
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <Text style={styles.modalSubtitle}>Sort By:</Text>
//             <View style={styles.sortPicker}>
//               {['Default', 'Price Low to High', 'Price High to Low'].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[styles.sortOption, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortOptionActive]}
//                   onPress={() => setTempSortBy(option.toLowerCase().replace(/\s/g, ''))}
//                 >
//                   <Text style={[styles.sortText, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortTextActive]}>
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => setFilterModalVisible(false)}
//               >
//                 <Text style={styles.modalCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalApplyButton}
//                 onPress={() => {
//                   setPriceRange(tempPriceRange);
//                   setMinRating(tempMinRating);
//                   setSortBy(tempSortBy);
//                   setFilterModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.modalApplyText}>Apply</Text>
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
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFFFFF',
//     elevation: 5,
//   },
//   backButton: {
//     padding: 5,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 25,
//     paddingHorizontal: 10,
//     marginHorizontal: 10,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#1B5E20',
//   },
//   cartIcon: {
//     padding: 5,
//     position: 'relative',
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     backgroundColor: '#FF5722',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 10,
//   },
//   categoryContainer: {
//     paddingHorizontal: 15,
//   },
//   categoryButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: '#F5F5F5',
//   },
//   categoryButtonActive: {
//     backgroundColor: '#4CAF50',
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   categoryTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   filterButton: {
//     padding: 10,
//     marginRight: 15,
//   },
//   productList: {
//     padding: 10,
//     paddingBottom: 120,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//   },
//   productCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     margin: 5,
//     padding: 10,
//     elevation: 3,
//   },
//   productImage: {
//     width: '100%',
//     height: 140,
//     borderRadius: 10,
//     resizeMode: 'cover',
//     marginBottom: 8,
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#FF5722',
//     borderRadius: 8,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   discountText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   star: {
//     marginRight: 2,
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#4CAF50',
//     marginBottom: 5,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#666',
//     textDecorationLine: 'line-through',
//     marginBottom: 5,
//   },
//   productStock: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   addToCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4CAF50',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#B0BEC5',
//   },
//   buttonIcon: {
//     marginRight: 5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   cartSummary: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 15,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     elevation: 5,
//   },
//   cartSummaryText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 5,
//   },
//   cartTotal: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginBottom: 10,
//   },
//   checkoutButton: {
//     borderRadius: 25,
//   },
//   checkoutGradient: {
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   checkoutText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
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
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyIcon: {
//     marginBottom: 10,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 20,
//   },
//   resetButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   resetText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
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
//     marginBottom: 10,
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
//   sliderPlaceholder: {
//     width: '100%',
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 5,
//     marginBottom: 20,
//   },
//   sliderText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   ratingPicker: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   ratingOption: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F5F5F5',
//     marginHorizontal: 5,
//   },
//   ratingOptionActive: {
//     backgroundColor: '#4CAF50',
//   },
//   ratingText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   ratingTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   sortPicker: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   sortOption: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F5F5F5',
//     margin: 5,
//   },
//   sortOptionActive: {
//     backgroundColor: '#4CAF50',
//   },
//   sortText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   sortTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
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
//   modalApplyButton: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   modalApplyText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });




// //main code

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
//   TextInput,
//   ScrollView,
//   Modal,
//   ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   collection,
//   getDocs,
//   addDoc,
//   doc,
//   updateDoc,
//   onSnapshot,
// } from 'firebase/firestore';
// import { db, auth } from './firebaseConfig';

// // Memoized Product Item Component
// const ProductItem = React.memo(({ item, onAddToCart, cart, onViewDetails }) => {
//   const existingCartItem = cart.find(itemInCart => itemInCart.productId === item.id);
//   const availableStock = item.stock || 0;
//   const inCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
//   const canAdd = availableStock > inCartQuantity;
//   const rating = item.rating || 0;

//   const formattedPrice = typeof item.price === 'number' ? item.price.toFixed(2) : '0.00';
//   const originalPrice = item.originalPrice
//     ? typeof item.originalPrice === 'number'
//       ? item.originalPrice.toFixed(2)
//       : '0.00'
//     : null;
//   const discount = originalPrice
//     ? ((1 - item.price / originalPrice) * 100).toFixed(0)
//     : 0;

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <Ionicons
//           key={i}
//           name={i <= rating ? 'star' : 'star-outline'}
//           size={14}
//           color="#FFD700"
//           style={styles.star}
//         />
//       );
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.productCard}>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={() => onViewDetails(item)}
//       >
//         <Image
//           source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
//           style={styles.productImage}
//         />
//         {discount > 0 && (
//           <View style={styles.discountBadge}>
//             <Text style={styles.discountText}>-{discount}%</Text>
//           </View>
//         )}
//         <View style={styles.productInfo}>
//           <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
//           <View style={styles.ratingContainer}>{renderStars()}</View>
//           <Text style={styles.productPrice}>${formattedPrice}</Text>
//           {originalPrice && (
//             <Text style={styles.originalPrice}>${originalPrice}</Text>
//           )}
//           <Text style={styles.productStock}>
//             {availableStock > 0 ? `${availableStock} Left` : 'Out of Stock'}
//           </Text>
//           <TouchableOpacity
//             style={[styles.addToCartButton, !canAdd && styles.disabledButton]}
//             onPress={() => canAdd && onAddToCart(item)}
//             disabled={!canAdd}
//             accessibilityLabel={`Add ${item.name} to cart`}
//           >
//             <Ionicons name="cart-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
//             <Text style={styles.buttonText}>{canAdd ? 'Add to Cart' : 'Max Reached'}</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// });

// export default function BuyProductScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [minRating, setMinRating] = useState(0);
//   const [sortBy, setSortBy] = useState('default');
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);
//   const [tempMinRating, setTempMinRating] = useState(0);
//   const [tempSortBy, setTempSortBy] = useState('default');

//   const userId = auth.currentUser?.uid;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => ({
//           ...doc.data(),
//           id: doc.id,
//           stock: Number(doc.data().stock) || 0,
//           price: Number(doc.data().price) || 0,
//           originalPrice: Number(doc.data().originalPrice) || null,
//           rating: Number(doc.data().rating) || 0,
//           category: doc.data().category || 'Others',
//         }));
//         setProducts(productList);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         Alert.alert('Error', 'Failed to load products.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const unsubscribeCart = userId
//       ? onSnapshot(collection(db, 'users', userId, 'cart'), (snapshot) => {
//           const cartList = snapshot.docs.map(doc => ({
//             ...doc.data(),
//             id: doc.id,
//             price: Number(doc.data().price) || 0,
//           }));
//           setCart(cartList);
//         }, (error) => {
//           console.error('Error listening to cart:', error);
//           Alert.alert('Error', 'Failed to load cart items.');
//         })
//       : () => {};

//     fetchProducts();
//     return () => unsubscribeCart();
//   }, [userId]);

//   const addToCart = async (product) => {
//     if (!userId) {
//       Alert.alert('Login Required', 'Please login to add items to the cart.');
//       return;
//     }

//     const existingProduct = cart.find(item => item.productId === product.id);
//     const availableStock = product.stock || 0;
//     const inCartQuantity = existingProduct ? existingProduct.quantity : 0;

//     if (inCartQuantity >= availableStock) {
//       Alert.alert('Stock Limit', `Only ${availableStock} ${product.name}(s) available.`);
//       return;
//     }

//     try {
//       if (existingProduct) {
//         await updateDoc(doc(db, 'users', userId, 'cart', existingProduct.id), {
//           quantity: inCartQuantity + 1,
//         });
//       } else {
//         await addDoc(collection(db, 'users', userId, 'cart'), {
//           productId: product.id,
//           name: product.name,
//           price: Number(product.price) || 0,
//           quantity: 1,
//           imageUrl: product.imageUrl,
//         });
//       }
//       Alert.alert('Success', `${product.name} added to cart!`);
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       Alert.alert('Error', 'Failed to add item to cart.');
//     }
//   };

//   const goToCart = () => navigation.navigate('CartScreen');
//   const viewDetails = (product) => navigation.navigate('ProductDetailsScreen', { product });

//   const filterAndSortProducts = () => {
//     if (!products || products.length === 0) {
//       console.log('No products available to filter.');
//       return [];
//     }

//     let filtered = [...products].filter(product => {
//       const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
//       const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
//       const matchesRating = product.rating >= minRating;
//       return matchesSearch && matchesCategory && matchesPrice && matchesRating;
//     });

//     console.log('Before Sorting - Filtered Products:', filtered); // Debug log

//     switch (sortBy) {
//       case 'priceLowToHigh':
//         filtered.sort((a, b) => a.price - b.price);
//         console.log('Sorted by Price Low to High:', filtered);
//         break;
//       case 'priceHighToLow':
//         filtered.sort((a, b) => b.price - a.price);
//         console.log('Sorted by Price High to Low:', filtered);
//         break;
//       case 'default':
//       default:
//         console.log('No sorting applied:', filtered);
//         break;
//     }

//     console.log('After Sorting - Final Filtered Products:', filtered); // Debug log
//     return filtered;
//   };

//   const categories = ['All', ...new Set(products.map(product => product.category))];
//   const filteredProducts = filterAndSortProducts();
//   const calculateCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

//   const renderProduct = ({ item }) => (
//     <ProductItem item={item} onAddToCart={addToCart} cart={cart} onViewDetails={viewDetails} />
//   );

//   if (loading) {
//     return (
//       <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
//         <Ionicons name="leaf-outline" size={50} color="#4CAF50" />
//         <Text style={styles.loadingText}>Loading your plants...</Text>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#1B5E20" />
//         </TouchableOpacity>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search for plants..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#666"
//           />
//         </View>
//         <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
//           <Ionicons name="cart-outline" size={24} color="#1B5E20" />
//           {cart.length > 0 && (
//             <View style={styles.cartBadge}>
//               <Text style={styles.cartBadgeText}>{cart.length}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.filterRow}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
//           {categories.map(category => (
//             <TouchableOpacity
//               key={category}
//               style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
//               onPress={() => {
//                 console.log(`Category selected: ${category}`); // Debug log
//                 setSelectedCategory(category);
//               }}
//             >
//               <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
//                 {category}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//         <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
//           <Ionicons name="filter" size={20} color="#1B5E20" />
//         </TouchableOpacity>
//       </View>

//       {filteredProducts.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="leaf-outline" size={60} color="#666" />
//           <Text style={styles.emptyText}>No plants found.</Text>
//           <TouchableOpacity
//             style={styles.resetButton}
//             onPress={() => {
//               console.log('Resetting all filters');
//               setSearchQuery('');
//               setSelectedCategory('All');
//               setPriceRange([0, 1000]);
//               setMinRating(0);
//               setSortBy('default');
//             }}
//           >
//             <Text style={styles.resetText}>Reset Filters</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredProducts}
//           keyExtractor={item => item.id}
//           renderItem={renderProduct}
//           contentContainerStyle={styles.productList}
//           numColumns={2}
//           columnWrapperStyle={styles.columnWrapper}
//           initialNumToRender={10}
//           maxToRenderPerBatch={10}
//           windowSize={5}
//           extraData={[cart.length, selectedCategory, priceRange, minRating, sortBy, searchQuery]} // Ensure re-render on all state changes
//         />
//       )}

//       {cart.length > 0 && (
//         <LinearGradient colors={['#FFFFFF', '#E8F5E9']} style={styles.cartSummary}>
//           <Text style={styles.cartSummaryText}>
//             Cart: {cart.reduce((total, item) => total + item.quantity, 0)} items
//           </Text>
//           <Text style={styles.cartTotal}>Total: ${calculateCartTotal()}</Text>
//           <TouchableOpacity style={styles.checkoutButton} onPress={goToCart}>
//             <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.checkoutGradient}>
//               <Text style={styles.checkoutText}>Proceed to Cart</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>
//       )}

//       <Modal
//         visible={filterModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setFilterModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <Text style={styles.modalSubtitle}>Price Range: ${tempPriceRange[0]} - ${tempPriceRange[1]}</Text>
//             <View style={styles.sliderPlaceholder}>
//               <Text style={styles.sliderText}>[Price Range Slider Placeholder]</Text>
//             </View>
//             <Text style={styles.modalSubtitle}>Minimum Rating:</Text>
//             <View style={styles.ratingPicker}>
//               {[0, 1, 2, 3, 4].map(rating => (
//                 <TouchableOpacity
//                   key={rating}
//                   style={[styles.ratingOption, tempMinRating === rating && styles.ratingOptionActive]}
//                   onPress={() => {
//                     console.log(`Rating filter set to: ${rating}+`);
//                     setTempMinRating(rating);
//                   }}
//                 >
//                   <Text style={[styles.ratingText, tempMinRating === rating && styles.ratingTextActive]}>
//                     {rating}+
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <Text style={styles.modalSubtitle}>Sort By:</Text>
//             <View style={styles.sortPicker}>
//               {['Default', 'Price Low to High', 'Price High to Low'].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[styles.sortOption, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortOptionActive]}
//                   onPress={() => {
//                     const sortValue = option.toLowerCase().replace(/\s/g, '');
//                     console.log(`Sort by set to: ${sortValue}`);
//                     setTempSortBy(sortValue);
//                   }}
//                 >
//                   <Text style={[styles.sortText, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortTextActive]}>
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => {
//                   console.log('Filter modal canceled');
//                   setFilterModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.modalCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalApplyButton}
//                 onPress={() => {
//                   console.log(`Applying filters: PriceRange=${tempPriceRange}, MinRating=${tempMinRating}, SortBy=${tempSortBy}`);
//                   setPriceRange(tempPriceRange);
//                   setMinRating(tempMinRating);
//                   setSortBy(tempSortBy);
//                   setFilterModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.modalApplyText}>Apply</Text>
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
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFFFFF',
//     elevation: 5,
//   },
//   backButton: {
//     padding: 5,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 25,
//     paddingHorizontal: 10,
//     marginHorizontal: 10,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#1B5E20',
//   },
//   cartIcon: {
//     padding: 5,
//     position: 'relative',
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     backgroundColor: '#FF5722',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 10,
//   },
//   categoryContainer: {
//     paddingHorizontal: 15,
//   },
//   categoryButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: '#F5F5F5',
//   },
//   categoryButtonActive: {
//     backgroundColor: '#4CAF50',
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   categoryTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   filterButton: {
//     padding: 10,
//     marginRight: 15,
//   },
//   productList: {
//     padding: 10,
//     paddingBottom: 120,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//   },
//   productCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     margin: 5,
//     padding: 10,
//     elevation: 3,
//   },
//   productImage: {
//     width: '100%',
//     height: 140,
//     borderRadius: 10,
//     resizeMode: 'cover',
//     marginBottom: 8,
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#FF5722',
//     borderRadius: 8,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   discountText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   star: {
//     marginRight: 2,
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#4CAF50',
//     marginBottom: 5,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#666',
//     textDecorationLine: 'line-through',
//     marginBottom: 5,
//   },
//   productStock: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   addToCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4CAF50',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#B0BEC5',
//   },
//   buttonIcon: {
//     marginRight: 5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   cartSummary: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 15,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     elevation: 5,
//   },
//   cartSummaryText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 5,
//   },
//   cartTotal: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginBottom: 10,
//   },
//   checkoutButton: {
//     borderRadius: 25,
//   },
//   checkoutGradient: {
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   checkoutText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
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
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 20,
//   },
//   resetButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   resetText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
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
//     marginBottom: 10,
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
//   sliderPlaceholder: {
//     width: '100%',
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 5,
//     marginBottom: 20,
//   },
//   sliderText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   ratingPicker: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   ratingOption: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F5F5F5',
//     marginHorizontal: 5,
//   },
//   ratingOptionActive: {
//     backgroundColor: '#4CAF50',
//   },
//   ratingText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   ratingTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   sortPicker: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   sortOption: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F5F5F5',
//     margin: 5,
//   },
//   sortOptionActive: {
//     backgroundColor: '#4CAF50',
//   },
//   sortText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   sortTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
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
//   modalApplyButton: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   modalApplyText: {
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
//   TextInput,
//   ScrollView,
//   Modal,
//   ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   collection,
//   getDocs,
//   addDoc,
//   doc,
//   updateDoc,
//   onSnapshot,
// } from 'firebase/firestore';
// import { db, auth } from './firebaseConfig';

// // Memoized Product Item Component (Removed onViewDetails)
// const ProductItem = React.memo(({ item, onAddToCart, cart }) => {
//   const existingCartItem = cart.find(itemInCart => itemInCart.productId === item.id);
//   const availableStock = Number(item.stock) || 0;
//   const inCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
//   const canAdd = availableStock > inCartQuantity;
//   const rating = Number(item.rating) || 0;

//   const formattedPrice = Number(item.price).toFixed(2) || '0.00';
//   const originalPrice = item.originalPrice
//     ? Number(item.originalPrice).toFixed(2) || '0.00'
//     : null;
//   const discount = originalPrice
//     ? ((1 - Number(item.price) / Number(item.originalPrice)) * 100).toFixed(0)
//     : 0;

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <Ionicons
//           key={i}
//           name={i <= rating ? 'star' : 'star-outline'}
//           size={14}
//           color="#FFD700"
//           style={styles.star}
//         />
//       );
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.productCard}>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={() => canAdd && onAddToCart(item)} // Only add to cart, no details
//         disabled={!canAdd}
//       >
//         <Image
//           source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
//           style={styles.productImage}
//         />
//         {discount > 0 && (
//           <View style={styles.discountBadge}>
//             <Text style={styles.discountText}>-{discount}%</Text>
//           </View>
//         )}
//         <View style={styles.productInfo}>
//           <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
//           <View style={styles.ratingContainer}>{renderStars()}</View>
//           <Text style={styles.productPrice}>${formattedPrice}</Text>
//           {originalPrice && (
//             <Text style={styles.originalPrice}>${originalPrice}</Text>
//           )}
//           <Text style={styles.productStock}>
//             {availableStock > 0 ? `${availableStock} Left` : 'Out of Stock'}
//           </Text>
//           <TouchableOpacity
//             style={[styles.addToCartButton, !canAdd && styles.disabledButton]}
//             onPress={() => canAdd && onAddToCart(item)}
//             disabled={!canAdd}
//             accessibilityLabel={`Add ${item.name} to cart`}
//           >
//             <Ionicons name="cart-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
//             <Text style={styles.buttonText}>{canAdd ? 'Add to Cart' : 'Max Reached'}</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// });

// export default function BuyProductScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered/sorted products
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [minRating, setMinRating] = useState(0);
//   const [sortBy, setSortBy] = useState(null); // Start with null, like friend's code
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);
//   const [tempMinRating, setTempMinRating] = useState(0);
//   const [tempSortBy, setTempSortBy] = useState(null);

//   const userId = auth.currentUser?.uid;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             ...data,
//             id: doc.id,
//             price: data.price, // Keep as-is, convert during sorting
//             stock: data.stock,
//             originalPrice: data.originalPrice || null,
//             rating: data.rating || 0,
//             category: data.category || 'Others',
//           };
//         });
//         console.log('Raw Fetched Products:', productList.map(p => ({ id: p.id, name: p.name, price: p.price })));
//         setProducts(productList);
//         setFilteredProducts(productList); // Initialize filteredProducts
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         Alert.alert('Error', 'Failed to load products.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const unsubscribeCart = userId
//       ? onSnapshot(collection(db, 'users', userId, 'cart'), (snapshot) => {
//           const cartList = snapshot.docs.map(doc => ({
//             ...doc.data(),
//             id: doc.id,
//             price: Number(doc.data().price) || 0,
//           }));
//           setCart(cartList);
//         }, (error) => {
//           console.error('Error listening to cart:', error);
//           Alert.alert('Error', 'Failed to load cart items.');
//         })
//       : () => {};

//     fetchProducts();
//     return () => unsubscribeCart();
//   }, [userId]);

//   // Sorting and filtering logic adapted from friend's code
//   useEffect(() => {
//     let updatedProducts = [...products];

//     console.log(`Applying Sorting with sortBy: ${sortBy}, products length: ${products.length}`);

//     // Apply search filter
//     if (searchQuery) {
//       updatedProducts = updatedProducts.filter((product) =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       console.log(`After Search Filter (query: "${searchQuery}"):`, updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));
//     }

//     // Apply category filter
//     if (selectedCategory !== 'All') {
//       updatedProducts = updatedProducts.filter((product) => product.category === selectedCategory);
//       console.log(`After Category Filter (category: "${selectedCategory}"):`, updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));
//     }

//     // Apply price range filter
//     updatedProducts = updatedProducts.filter((product) => {
//       const price = parseFloat(product.price) || 0;
//       return price >= priceRange[0] && price <= priceRange[1];
//     });
//     console.log(`After Price Range Filter (${priceRange[0]}-${priceRange[1]}):`, updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));

//     // Apply rating filter
//     updatedProducts = updatedProducts.filter((product) => product.rating >= minRating);
//     console.log(`After Rating Filter (min: ${minRating}):`, updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));

//     // Apply sorting
//     if (sortBy === 'priceLowToHigh') {
//       updatedProducts.sort((a, b) => {
//         const priceA = parseFloat(a.price) || 0;
//         const priceB = parseFloat(b.price) || 0;
//         console.log(`Sorting Low to High - Comparing ${priceA} (${a.name}) vs ${priceB} (${b.name})`);
//         return priceA - priceB;
//       });
//       console.log('After Sorting Low to High:', updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));
//     } else if (sortBy === 'priceHighToLow') {
//       updatedProducts.sort((a, b) => {
//         const priceA = parseFloat(a.price) || 0;
//         const priceB = parseFloat(b.price) || 0;
//         console.log(`Sorting High to Low - Comparing ${priceA} (${a.name}) vs ${priceB} (${b.name})`);
//         return priceB - priceA;
//       });
//       console.log('After Sorting High to Low:', updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));
//     } else {
//       console.log('Default Sorting (No Change):', updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));
//     }

//     setFilteredProducts(updatedProducts);
//   }, [sortBy, products, searchQuery, selectedCategory, priceRange, minRating]);

//   const addToCart = async (product) => {
//     if (!userId) {
//       Alert.alert('Login Required', 'Please login to add items to the cart.');
//       return;
//     }

//     const existingProduct = cart.find(item => item.productId === product.id);
//     const availableStock = Number(product.stock) || 0;
//     const inCartQuantity = existingProduct ? existingProduct.quantity : 0;

//     if (inCartQuantity >= availableStock) {
//       Alert.alert('Stock Limit', `Only ${availableStock} ${product.name}(s) available.`);
//       return;
//     }

//     try {
//       if (existingProduct) {
//         await updateDoc(doc(db, 'users', userId, 'cart', existingProduct.id), {
//           quantity: inCartQuantity + 1,
//         });
//       } else {
//         await addDoc(collection(db, 'users', userId, 'cart'), {
//           productId: product.id,
//           name: product.name,
//           price: Number(product.price) || 0,
//           quantity: 1,
//           imageUrl: product.imageUrl,
//         });
//       }
//       Alert.alert('Success', `${product.name} added to cart!`);
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       Alert.alert('Error', 'Failed to add item to cart.');
//     }
//   };

//   const goToCart = () => navigation.navigate('CartScreen');
//   const categories = ['All', ...new Set(products.map(product => product.category))];
//   const calculateCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

//   const renderProduct = ({ item }) => (
//     <ProductItem item={item} onAddToCart={addToCart} cart={cart} />
//   );

//   if (loading) {
//     return (
//       <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
//         <Ionicons name="leaf-outline" size={50} color="#4CAF50" />
//         <Text style={styles.loadingText}>Loading your plants...</Text>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#1B5E20" />
//         </TouchableOpacity>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search for plants..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#666"
//           />
//         </View>
//         <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
//           <Ionicons name="cart-outline" size={24} color="#1B5E20" />
//           {cart.length > 0 && (
//             <View style={styles.cartBadge}>
//               <Text style={styles.cartBadgeText}>{cart.length}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.filterRow}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
//           {categories.map(category => (
//             <TouchableOpacity
//               key={category}
//               style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
//               onPress={() => {
//                 console.log(`Category selected: ${category}`);
//                 setSelectedCategory(category);
//               }}
//             >
//               <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
//                 {category}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//         <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
//           <Ionicons name="filter" size={20} color="#1B5E20" />
//         </TouchableOpacity>
//       </View>

//       {filteredProducts.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="leaf-outline" size={60} color="#666" />
//           <Text style={styles.emptyText}>No plants found.</Text>
//           <TouchableOpacity
//             style={styles.resetButton}
//             onPress={() => {
//               console.log('Resetting all filters');
//               setSearchQuery('');
//               setSelectedCategory('All');
//               setPriceRange([0, 1000]);
//               setMinRating(0);
//               setSortBy(null);
//             }}
//           >
//             <Text style={styles.resetText}>Reset Filters</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredProducts}
//           keyExtractor={item => item.id}
//           renderItem={renderProduct}
//           contentContainerStyle={styles.productList}
//           numColumns={2}
//           columnWrapperStyle={styles.columnWrapper}
//           initialNumToRender={10}
//           maxToRenderPerBatch={10}
//           windowSize={5}
//           key={`${sortBy}`} // Force re-render when sortBy changes
//         />
//       )}

//       {cart.length > 0 && (
//         <LinearGradient colors={['#FFFFFF', '#E8F5E9']} style={styles.cartSummary}>
//           <Text style={styles.cartSummaryText}>
//             Cart: {cart.reduce((total, item) => total + item.quantity, 0)} items
//           </Text>
//           <Text style={styles.cartTotal}>Total: ${calculateCartTotal()}</Text>
//           <TouchableOpacity style={styles.checkoutButton} onPress={goToCart}>
//             <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.checkoutGradient}>
//               <Text style={styles.checkoutText}>Proceed to Cart</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>
//       )}

//       <Modal
//         visible={filterModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setFilterModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <Text style={styles.modalSubtitle}>Price Range: ${tempPriceRange[0]} - ${tempPriceRange[1]}</Text>
//             <View style={styles.sliderPlaceholder}>
//               <Text style={styles.sliderText}>[Price Range Slider Placeholder]</Text>
//             </View>
//             <Text style={styles.modalSubtitle}>Minimum Rating:</Text>
//             <View style={styles.ratingPicker}>
//               {[0, 1, 2, 3, 4].map(rating => (
//                 <TouchableOpacity
//                   key={rating}
//                   style={[styles.ratingOption, tempMinRating === rating && styles.ratingOptionActive]}
//                   onPress={() => {
//                     console.log(`Rating filter set to: ${rating}+`);
//                     setTempMinRating(rating);
//                   }}
//                 >
//                   <Text style={[styles.ratingText, tempMinRating === rating && styles.ratingTextActive]}>
//                     {rating}+
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <Text style={styles.modalSubtitle}>Sort By:</Text>
//             <View style={styles.sortPicker}>
//               {['Default', 'Price Low to High', 'Price High to Low'].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[styles.sortOption, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortOptionActive]}
//                   onPress={() => {
//                     const sortValue = option === 'Default' ? null : option.toLowerCase().replace(/\s/g, '');
//                     console.log(`Sort by set to: ${sortValue}`);
//                     setTempSortBy(sortValue);
//                   }}
//                 >
//                   <Text style={[styles.sortText, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortTextActive]}>
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => {
//                   console.log('Filter modal canceled');
//                   setFilterModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.modalCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalApplyButton}
//                 onPress={() => {
//                   console.log(`Applying filters: SortBy=${tempSortBy}`);
//                   setSortBy(tempSortBy);
//                   setFilterModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.modalApplyText}>Apply</Text>
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
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFFFFF',
//     elevation: 5,
//   },
//   backButton: {
//     padding: 5,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 25,
//     paddingHorizontal: 10,
//     marginHorizontal: 10,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#1B5E20',
//   },
//   cartIcon: {
//     padding: 5,
//     position: 'relative',
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     backgroundColor: '#FF5722',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 10,
//   },
//   categoryContainer: {
//     paddingHorizontal: 15,
//   },
//   categoryButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: '#F5F5F5',
//   },
//   categoryButtonActive: {
//     backgroundColor: '#4CAF50',
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   categoryTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   filterButton: {
//     padding: 10,
//     marginRight: 15,
//   },
//   productList: {
//     padding: 10,
//     paddingBottom: 120,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//   },
//   productCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     margin: 5,
//     padding: 10,
//     elevation: 3,
//   },
//   productImage: {
//     width: '100%',
//     height: 140,
//     borderRadius: 10,
//     resizeMode: 'cover',
//     marginBottom: 8,
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#FF5722',
//     borderRadius: 8,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   discountText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   star: {
//     marginRight: 2,
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#4CAF50',
//     marginBottom: 5,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#666',
//     textDecorationLine: 'line-through',
//     marginBottom: 5,
//   },
//   productStock: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   addToCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4CAF50',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#B0BEC5',
//   },
//   buttonIcon: {
//     marginRight: 5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   cartSummary: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 15,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     elevation: 5,
//   },
//   cartSummaryText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 5,
//   },
//   cartTotal: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginBottom: 10,
//   },
//   checkoutButton: {
//     borderRadius: 25,
//   },
//   checkoutGradient: {
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   checkoutText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
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
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 20,
//   },
//   resetButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   resetText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
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
//     marginBottom: 10,
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
//   sliderPlaceholder: {
//     width: '100%',
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 5,
//     marginBottom: 20,
//   },
//   sliderText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   ratingPicker: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   ratingOption: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F5F5F5',
//     marginHorizontal: 5,
//   },
//   ratingOptionActive: {
//     backgroundColor: '#4CAF50',
//   },
//   ratingText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   ratingTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   sortPicker: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   sortOption: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F5F5F5',
//     margin: 5,
//   },
//   sortOptionActive: {
//     backgroundColor: '#4CAF50',
//   },
//   sortText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   sortTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
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
//   modalApplyButton: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   modalApplyText: {
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
//   TextInput,
//   ScrollView,
//   Modal,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   collection,
//   getDocs,
//   addDoc,
//   doc,
//   updateDoc,
//   onSnapshot,
// } from 'firebase/firestore';
// import { db, auth } from './firebaseConfig';

// // Memoized Product Item Component
// const ProductItem = React.memo(({ item, onAddToCart, cart }) => {
//   const existingCartItem = cart.find(itemInCart => itemInCart.productId === item.id);
//   const availableStock = Number(item.stock) || 0;
//   const inCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
//   const canAdd = availableStock > inCartQuantity;
//   const rating = Number(item.rating) || 0;

//   const formattedPrice = Number(item.price).toFixed(2) || '0.00';
//   const originalPrice = item.originalPrice
//     ? Number(item.originalPrice).toFixed(2) || '0.00'
//     : null;
//   const discount = originalPrice
//     ? ((1 - Number(item.price) / Number(item.originalPrice)) * 100).toFixed(0)
//     : 0;

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <Ionicons
//           key={i}
//           name={i <= rating ? 'star' : 'star-outline'}
//           size={14}
//           color="#FFD700"
//           style={styles.star}
//         />
//       );
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.productCard}>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={() => canAdd && onAddToCart(item)}
//         disabled={!canAdd}
//       >
//         <Image
//           source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
//           style={styles.productImage}
//         />
//         {discount > 0 && (
//           <View style={styles.discountBadge}>
//             <Text style={styles.discountText}>-{discount}%</Text>
//           </View>
//         )}
//         <View style={styles.productInfo}>
//           <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
//           <View style={styles.ratingContainer}>{renderStars()}</View>
//           <Text style={styles.productPrice}>${formattedPrice}</Text>
//           {originalPrice && (
//             <Text style={styles.originalPrice}>${originalPrice}</Text>
//           )}
//           <Text style={styles.productStock}>
//             {availableStock > 0 ? `${availableStock} Left` : 'Out of Stock'}
//           </Text>
//           <TouchableOpacity
//             style={[styles.addToCartButton, !canAdd && styles.disabledButton]}
//             onPress={() => canAdd && onAddToCart(item)}
//             disabled={!canAdd}
//           >
//             <Ionicons name="cart-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
//             <Text style={styles.buttonText}>{canAdd ? 'Add to Cart' : 'Max Reached'}</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// });

// export default function BuyProductScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [minRating, setMinRating] = useState(0);
//   const [sortBy, setSortBy] = useState(null);
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);
//   const [tempMinRating, setTempMinRating] = useState(0);
//   const [tempSortBy, setTempSortBy] = useState(null);

//   const userId = auth.currentUser?.uid;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             ...data,
//             id: doc.id,
//             price: parseFloat(data.price) || 0, // Ensure price is a number
//             stock: data.stock || 0,
//             originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
//             rating: parseFloat(data.rating) || 0,
//             category: data.category || 'Others',
//           };
//         });
//         console.log('Raw Fetched Products:', productList.map(p => ({ id: p.id, name: p.name, price: p.price })));
//         setProducts(productList);
//         setFilteredProducts(productList); // Initialize with all products
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         Alert.alert('Error', 'Failed to load products.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const unsubscribeCart = userId
//       ? onSnapshot(collection(db, 'users', userId, 'cart'), (snapshot) => {
//           const cartList = snapshot.docs.map(doc => ({
//             ...doc.data(),
//             id: doc.id,
//             price: Number(doc.data().price) || 0,
//           }));
//           setCart(cartList);
//         }, (error) => {
//           console.error('Error listening to cart:', error);
//           Alert.alert('Error', 'Failed to load cart items.');
//         })
//       : () => {};

//     fetchProducts();
//     return () => unsubscribeCart();
//   }, [userId]);

//   // Simplified useEffect for filtering and sorting
//   useEffect(() => {
//     let updatedProducts = [...products];

//     // Apply sorting first to ensure it works independently
//     if (sortBy === 'priceLowToHigh') {
//       updatedProducts.sort((a, b) => {
//         const priceA = parseFloat(a.price) || 0;
//         const priceB = parseFloat(b.price) || 0;
//         console.log(`Sorting Low to High - ${priceA} (${a.name}) vs ${priceB} (${b.name})`);
//         return priceA - priceB;
//       });
//     } else if (sortBy === 'priceHighToLow') {
//       updatedProducts.sort((a, b) => {
//         const priceA = parseFloat(a.price) || 0;
//         const priceB = parseFloat(b.price) || 0;
//         console.log(`Sorting High to Low - ${priceA} (${a.name}) vs ${priceB} (${b.name})`);
//         return priceB - priceA;
//       });
//     } else {
//       console.log('No sorting applied');
//     }

//     // Apply other filters after sorting
//     if (searchQuery) {
//       updatedProducts = updatedProducts.filter(product =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     if (selectedCategory !== 'All') {
//       updatedProducts = updatedProducts.filter(product => product.category === selectedCategory);
//     }
//     updatedProducts = updatedProducts.filter(product => {
//       const price = parseFloat(product.price) || 0;
//       return price >= priceRange[0] && price <= priceRange[1];
//     });
//     updatedProducts = updatedProducts.filter(product => {
//       const rating = parseFloat(product.rating) || 0;
//       return rating >= minRating;
//     });

//     setFilteredProducts(updatedProducts);
//     console.log('Updated filteredProducts:', updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));
//   }, [sortBy, products, searchQuery, selectedCategory, priceRange, minRating]);

//   const addToCart = async (product) => {
//     if (!userId) {
//       Alert.alert('Login Required', 'Please login to add items to the cart.');
//       return;
//     }

//     const existingProduct = cart.find(item => item.productId === product.id);
//     const availableStock = Number(product.stock) || 0;
//     const inCartQuantity = existingProduct ? existingProduct.quantity : 0;

//     if (inCartQuantity >= availableStock) {
//       Alert.alert('Stock Limit', `Only ${availableStock} ${product.name}(s) available.`);
//       return;
//     }

//     try {
//       if (existingProduct) {
//         await updateDoc(doc(db, 'users', userId, 'cart', existingProduct.id), {
//           quantity: inCartQuantity + 1,
//         });
//       } else {
//         await addDoc(collection(db, 'users', userId, 'cart'), {
//           productId: product.id,
//           name: product.name,
//           price: Number(product.price) || 0,
//           quantity: 1,
//           imageUrl: product.imageUrl,
//         });
//       }
//       Alert.alert('Success', `${product.name} added to cart!`);
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       Alert.alert('Error', 'Failed to add item to cart.');
//     }
//   };

//   const goToCart = () => navigation.navigate('CartScreen');
//   const categories = ['All', ...new Set(products.map(product => product.category))];
//   const calculateCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

//   const renderProduct = ({ item }) => (
//     <ProductItem item={item} onAddToCart={addToCart} cart={cart} />
//   );

//   if (loading) {
//     return (
//       <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
//         <Ionicons name="leaf-outline" size={50} color="#4CAF50" />
//         <Text style={styles.loadingText}>Loading your plants...</Text>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#1B5E20" />
//         </TouchableOpacity>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search for plants..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#666"
//           />
//         </View>
//         <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
//           <Ionicons name="cart-outline" size={24} color="#1B5E20" />
//           {cart.length > 0 && (
//             <View style={styles.cartBadge}>
//               <Text style={styles.cartBadgeText}>{cart.length}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.filterRow}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
//           {categories.map(category => (
//             <TouchableOpacity
//               key={category}
//               style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
//               onPress={() => setSelectedCategory(category)}
//             >
//               <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
//                 {category}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//         <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
//           <Ionicons name="filter" size={20} color="#1B5E20" />
//         </TouchableOpacity>
//       </View>

//       {filteredProducts.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="leaf-outline" size={60} color="#666" />
//           <Text style={styles.emptyText}>No plants found.</Text>
//           <TouchableOpacity
//             style={styles.resetButton}
//             onPress={() => {
//               setSearchQuery('');
//               setSelectedCategory('All');
//               setPriceRange([0, 1000]);
//               setMinRating(0);
//               setSortBy(null);
//             }}
//           >
//             <Text style={styles.resetText}>Reset Filters</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredProducts}
//           keyExtractor={item => item.id}
//           renderItem={renderProduct}
//           contentContainerStyle={styles.productList}
//           numColumns={2}
//           columnWrapperStyle={styles.columnWrapper}
//           initialNumToRender={10}
//           maxToRenderPerBatch={10}
//           windowSize={5}
//           key={`${sortBy}`} // Force re-render on sortBy change
//         />
//       )}

//       {cart.length > 0 && (
//         <LinearGradient colors={['#FFFFFF', '#E8F5E9']} style={styles.cartSummary}>
//           <Text style={styles.cartSummaryText}>
//             Cart: {cart.reduce((total, item) => total + item.quantity, 0)} items
//           </Text>
//           <Text style={styles.cartTotal}>Total: ${calculateCartTotal()}</Text>
//           <TouchableOpacity style={styles.checkoutButton} onPress={goToCart}>
//             <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.checkoutGradient}>
//               <Text style={styles.checkoutText}>Proceed to Cart</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>
//       )}

//       <Modal
//         visible={filterModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setFilterModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <Text style={styles.modalSubtitle}>Price Range: ${tempPriceRange[0]} - ${tempPriceRange[1]}</Text>
//             <View style={styles.sliderPlaceholder}>
//               <Text style={styles.sliderText}>[Price Range Slider Placeholder]</Text>
//             </View>
//             <Text style={styles.modalSubtitle}>Minimum Rating:</Text>
//             <View style={styles.ratingPicker}>
//               {[0, 1, 2, 3, 4].map(rating => (
//                 <TouchableOpacity
//                   key={rating}
//                   style={[styles.ratingOption, tempMinRating === rating && styles.ratingOptionActive]}
//                   onPress={() => setTempMinRating(rating)}
//                 >
//                   <Text style={[styles.ratingText, tempMinRating === rating && styles.ratingTextActive]}>
//                     {rating}+
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <Text style={styles.modalSubtitle}>Sort By:</Text>
//             <View style={styles.sortPicker}>
//               {['Default', 'Price Low to High', 'Price High to Low'].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[styles.sortOption, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortOptionActive]}
//                   onPress={() => {
//                     const sortValue = option === 'Default' ? null : option.toLowerCase().replace(/\s/g, '');
//                     setTempSortBy(sortValue);
//                   }}
//                 >
//                   <Text style={[styles.sortText, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortTextActive]}>
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => setFilterModalVisible(false)}
//               >
//                 <Text style={styles.modalCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalApplyButton}
//                 onPress={() => {
//                   setSortBy(tempSortBy);
//                   setPriceRange(tempPriceRange);
//                   setMinRating(tempMinRating);
//                   setFilterModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.modalApplyText}>Apply</Text>
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
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFFFFF',
//     elevation: 5,
//   },
//   backButton: {
//     padding: 5,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 25,
//     paddingHorizontal: 10,
//     marginHorizontal: 10,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#1B5E20',
//   },
//   cartIcon: {
//     padding: 5,
//     position: 'relative',
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     backgroundColor: '#FF5722',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 10,
//   },
//   categoryContainer: {
//     paddingHorizontal: 15,
//   },
//   categoryButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: '#F5F5F5',
//   },
//   categoryButtonActive: {
//     backgroundColor: '#4CAF50',
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   categoryTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   filterButton: {
//     padding: 10,
//     marginRight: 15,
//   },
//   productList: {
//     padding: 10,
//     paddingBottom: 120,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//   },
//   productCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     margin: 5,
//     padding: 10,
//     elevation: 3,
//   },
//   productImage: {
//     width: '100',
//     height: 140,
//     borderRadius: 10,
//     resizeMode: 'cover',
//     marginBottom: 8,
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#FF5722',
//     borderRadius: 8,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   discountText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   star: {
//     marginRight: 2,
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#4CAF50',
//     marginBottom: 5,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#666',
//     textDecorationLine: 'line-through',
//     marginBottom: 5,
//   },
//   productStock: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   addToCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4CAF50',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#B0BEC5',
//   },
//   buttonIcon: {
//     marginRight: 5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   cartSummary: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 15,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     elevation: 5,
//   },
//   cartSummaryText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 5,
//   },
//   cartTotal: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginBottom: 10,
//   },
//   checkoutButton: {
//     borderRadius: 25,
//   },
//   checkoutGradient: {
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   checkoutText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
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
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 20,
//   },
//   resetButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   resetText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
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
//     marginBottom: 10,
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
//   sliderPlaceholder: {
//     width: '100%',
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 5,
//     marginBottom: 20,
//   },
//   sliderText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   ratingPicker: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   ratingOption: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F5F5F5',
//     marginHorizontal: 5,
//   },
//   ratingOptionActive: {
//     backgroundColor: '#4CAF50',
//   },
//   ratingText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   ratingTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   sortPicker: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   sortOption: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F5F5F5',
//     margin: 5,
//   },
//   sortOptionActive: {
//     backgroundColor: '#4CAF50',
//   },
//   sortText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   sortTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
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
//   modalApplyButton: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   modalApplyText: {
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
//   TextInput,
//   ScrollView,
//   Modal,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   collection,
//   getDocs,
//   addDoc,
//   doc,
//   updateDoc,
//   onSnapshot,
// } from 'firebase/firestore';
// import { db, auth } from './firebaseConfig';

// // Memoized Product Item Component (Rating Removed)
// const ProductItem = React.memo(({ item, onAddToCart, cart }) => {
//   const existingCartItem = cart.find(itemInCart => itemInCart.productId === item.id);
//   const availableStock = Number(item.stock) || 0;
//   const inCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
//   const canAdd = availableStock > inCartQuantity;

//   const formattedPrice = Number(item.price).toFixed(2) || '0.00';
//   const originalPrice = item.originalPrice
//     ? Number(item.originalPrice).toFixed(2) || '0.00'
//     : null;
//   const discount = originalPrice
//     ? ((1 - Number(item.price) / Number(item.originalPrice)) * 100).toFixed(0)
//     : 0;

//   return (
//     <View style={styles.productCard}>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={() => canAdd && onAddToCart(item)}
//         disabled={!canAdd}
//       >
//         <Image
//           source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
//           style={styles.productImage}
//         />
//         {discount > 0 && (
//           <View style={styles.discountBadge}>
//             <Text style={styles.discountText}>-{discount}%</Text>
//           </View>
//         )}
//         <View style={styles.productInfo}>
//           <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
//           <Text style={styles.productPrice}>${formattedPrice}</Text>
//           {originalPrice && (
//             <Text style={styles.originalPrice}>${originalPrice}</Text>
//           )}
//           <Text style={styles.productStock}>
//             {availableStock > 0 ? `${availableStock} Left` : 'Out of Stock'}
//           </Text>
//           <TouchableOpacity
//             style={[styles.addToCartButton, !canAdd && styles.disabledButton]}
//             onPress={() => canAdd && onAddToCart(item)}
//             disabled={!canAdd}
//           >
//             <Ionicons name="cart-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
//             <Text style={styles.buttonText}>{canAdd ? 'Add to Cart' : 'Max Reached'}</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// });

// export default function BuyProductScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [sortBy, setSortBy] = useState(null);
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);
//   const [tempSortBy, setTempSortBy] = useState(null);

//   const userId = auth.currentUser?.uid;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             ...data,
//             id: doc.id,
//             price: parseFloat(data.price) || 0,
//             stock: data.stock || 0,
//             originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
//             category: data.category || 'Others',
//             // Removed rating field
//           };
//         });
//         console.log('Raw Fetched Products:', productList.map(p => ({ id: p.id, name: p.name, price: p.price })));
//         setProducts(productList);
//         setFilteredProducts(productList);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         Alert.alert('Error', 'Failed to load products.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const unsubscribeCart = userId
//       ? onSnapshot(collection(db, 'users', userId, 'cart'), (snapshot) => {
//           const cartList = snapshot.docs.map(doc => ({
//             ...doc.data(),
//             id: doc.id,
//             price: Number(doc.data().price) || 0,
//           }));
//           setCart(cartList);
//         }, (error) => {
//           console.error('Error listening to cart:', error);
//           Alert.alert('Error', 'Failed to load cart items.');
//         })
//       : () => {};

//     fetchProducts();
//     return () => unsubscribeCart();
//   }, [userId]);

//   useEffect(() => {
//     let updatedProducts = [...products];

//     // Apply sorting
//     if (sortBy === 'priceLowToHigh') {
//       updatedProducts.sort((a, b) => {
//         const priceA = parseFloat(a.price) || 0;
//         const priceB = parseFloat(b.price) || 0;
//         console.log(`Sorting Low to High - ${priceA} (${a.name}) vs ${priceB} (${b.name})`);
//         return priceA - priceB;
//       });
//     } else if (sortBy === 'priceHighToLow') {
//       updatedProducts.sort((a, b) => {
//         const priceA = parseFloat(a.price) || 0;
//         const priceB = parseFloat(b.price) || 0;
//         console.log(`Sorting High to Low - ${priceA} (${a.name}) vs ${priceB} (${b.name})`);
//         return priceB - priceA;
//       });
//     } else {
//       console.log('No sorting applied');
//     }

//     // Apply other filters (rating filter removed)
//     if (searchQuery) {
//       updatedProducts = updatedProducts.filter(product =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     if (selectedCategory !== 'All') {
//       updatedProducts = updatedProducts.filter(product => product.category === selectedCategory);
//     }
//     updatedProducts = updatedProducts.filter(product => {
//       const price = parseFloat(product.price) || 0;
//       return price >= priceRange[0] && price <= priceRange[1];
//     });

//     setFilteredProducts(updatedProducts);
//     console.log('Updated filteredProducts:', updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));
//   }, [sortBy, products, searchQuery, selectedCategory, priceRange]);

//   const addToCart = async (product) => {
//     if (!userId) {
//       Alert.alert('Login Required', 'Please login to add items to the cart.');
//       return;
//     }

//     const existingProduct = cart.find(item => item.productId === product.id);
//     const availableStock = Number(product.stock) || 0;
//     const inCartQuantity = existingProduct ? existingProduct.quantity : 0;

//     if (inCartQuantity >= availableStock) {
//       Alert.alert('Stock Limit', `Only ${availableStock} ${product.name}(s) available.`);
//       return;
//     }

//     try {
//       if (existingProduct) {
//         await updateDoc(doc(db, 'users', userId, 'cart', existingProduct.id), {
//           quantity: inCartQuantity + 1,
//         });
//       } else {
//         await addDoc(collection(db, 'users', userId, 'cart'), {
//           productId: product.id,
//           name: product.name,
//           price: Number(product.price) || 0,
//           quantity: 1,
//           imageUrl: product.imageUrl,
//         });
//       }
//       Alert.alert('Success', `${product.name} added to cart!`);
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       Alert.alert('Error', 'Failed to add item to cart.');
//     }
//   };

//   const goToCart = () => navigation.navigate('CartScreen');
//   const categories = ['All', ...new Set(products.map(product => product.category))];
//   const calculateCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

//   const renderProduct = ({ item }) => (
//     <ProductItem item={item} onAddToCart={addToCart} cart={cart} />
//   );

//   if (loading) {
//     return (
//       <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
//         <Ionicons name="leaf-outline" size={50} color="#4CAF50" />
//         <Text style={styles.loadingText}>Loading your plants...</Text>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#1B5E20" />
//         </TouchableOpacity>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search for plants..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#666"
//           />
//         </View>
//         <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
//           <Ionicons name="cart-outline" size={24} color="#1B5E20" />
//           {cart.length > 0 && (
//             <View style={styles.cartBadge}>
//               <Text style={styles.cartBadgeText}>{cart.length}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.filterRow}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
//           {categories.map(category => (
//             <TouchableOpacity
//               key={category}
//               style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
//               onPress={() => setSelectedCategory(category)}
//             >
//               <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
//                 {category}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//         <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
//           <Ionicons name="filter" size={20} color="#1B5E20" />
//         </TouchableOpacity>
//       </View>

//       {filteredProducts.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="leaf-outline" size={60} color="#666" />
//           <Text style={styles.emptyText}>No plants found.</Text>
//           <TouchableOpacity
//             style={styles.resetButton}
//             onPress={() => {
//               setSearchQuery('');
//               setSelectedCategory('All');
//               setPriceRange([0, 1000]);
//               setSortBy(null);
//             }}
//           >
//             <Text style={styles.resetText}>Reset Filters</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredProducts}
//           keyExtractor={item => item.id}
//           renderItem={renderProduct}
//           contentContainerStyle={styles.productList}
//           numColumns={2}
//           columnWrapperStyle={styles.columnWrapper}
//           initialNumToRender={10}
//           maxToRenderPerBatch={10}
//           windowSize={5}
//           key={`${sortBy}`} // Force re-render on sortBy change
//         />
//       )}

//       {cart.length > 0 && (
//         <LinearGradient colors={['#FFFFFF', '#E8F5E9']} style={styles.cartSummary}>
//           <Text style={styles.cartSummaryText}>
//             Cart: {cart.reduce((total, item) => total + item.quantity, 0)} items
//           </Text>
//           <Text style={styles.cartTotal}>Total: ${calculateCartTotal()}</Text>
//           <TouchableOpacity style={styles.checkoutButton} onPress={goToCart}>
//             <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.checkoutGradient}>
//               <Text style={styles.checkoutText}>Proceed to Cart</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>
//       )}

//       <Modal
//         visible={filterModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setFilterModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <Text style={styles.modalSubtitle}>Price Range: ${tempPriceRange[0]} - ${tempPriceRange[1]}</Text>
//             <View style={styles.sliderPlaceholder}>
//               <Text style={styles.sliderText}>[Price Range Slider Placeholder]</Text>
//             </View>
//             {/* Removed Minimum Rating Section */}
//             <Text style={styles.modalSubtitle}>Sort By:</Text>
//             <View style={styles.sortPicker}>
//               {['Default', 'Price Low to High', 'Price High to Low'].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[styles.sortOption, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortOptionActive]}
//                   onPress={() => {
//                     const sortValue = option === 'Default' ? null : option.toLowerCase().replace(/\s/g, '');
//                     setTempSortBy(sortValue);
//                   }}
//                 >
//                   <Text style={[styles.sortText, tempSortBy === option.toLowerCase().replace(/\s/g, '') && styles.sortTextActive]}>
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => setFilterModalVisible(false)}
//               >
//                 <Text style={styles.modalCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalApplyButton}
//                 onPress={() => {
//                   setSortBy(tempSortBy);
//                   setPriceRange(tempPriceRange);
//                   setFilterModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.modalApplyText}>Apply</Text>
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
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFFFFF',
//     elevation: 5,
//   },
//   backButton: {
//     padding: 5,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 25,
//     paddingHorizontal: 10,
//     marginHorizontal: 10,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#1B5E20',
//   },
//   cartIcon: {
//     padding: 5,
//     position: 'relative',
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     backgroundColor: '#FF5722',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 10,
//   },
//   categoryContainer: {
//     paddingHorizontal: 15,
//   },
//   categoryButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: '#F5F5F5',
//   },
//   categoryButtonActive: {
//     backgroundColor: '#4CAF50',
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   categoryTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   filterButton: {
//     padding: 10,
//     marginRight: 15,
//   },
//   productList: {
//     padding: 10,
//     paddingBottom: 120,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//   },
//   productCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     margin: 5,
//     padding: 10,
//     elevation: 3,
//   },
//   productImage: {
//     width: '100',
//     height: 140,
//     borderRadius: 10,
//     resizeMode: 'cover',
//     marginBottom: 8,
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#FF5722',
//     borderRadius: 8,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   discountText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   // Removed ratingContainer and star styles
//   productPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#4CAF50',
//     marginBottom: 5,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#666',
//     textDecorationLine: 'line-through',
//     marginBottom: 5,
//   },
//   productStock: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   addToCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4CAF50',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#B0BEC5',
//   },
//   buttonIcon: {
//     marginRight: 5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   cartSummary: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 15,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     elevation: 5,
//   },
//   cartSummaryText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 5,
//   },
//   cartTotal: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginBottom: 10,
//   },
//   checkoutButton: {
//     borderRadius: 25,
//   },
//   checkoutGradient: {
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   checkoutText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
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
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 20,
//   },
//   resetButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   resetText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
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
//     marginBottom: 10,
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
//   sliderPlaceholder: {
//     width: '100%',
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 5,
//     marginBottom: 20,
//   },
//   sliderText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   // Removed ratingPicker, ratingOption, ratingText, ratingTextActive styles
//   sortPicker: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   sortOption: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     backgroundColor: '#F5F5F5',
//     margin: 5,
//   },
//   sortOptionActive: {
//     backgroundColor: '#4CAF50',
//   },
//   sortText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   sortTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
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
//   modalApplyButton: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   modalApplyText: {
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
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

// Memoized Product Item Component
const ProductItem = React.memo(({ item, onAddToCart, cart }) => {
  const existingCartItem = cart.find(itemInCart => itemInCart.productId === item.id);
  const availableStock = Number(item.stock) || 0;
  const inCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
  const canAdd = availableStock > inCartQuantity;

  const formattedPrice = Number(item.price).toFixed(2) || '0.00';

  return (
    <View style={styles.productCard}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => canAdd && onAddToCart(item)}
        disabled={!canAdd}
      >
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>${formattedPrice}</Text>
          <Text style={styles.productStock}>
            {availableStock > 0 ? `${availableStock} Left` : 'Out of Stock'}
          </Text>
          <TouchableOpacity
            style={[styles.addToCartButton, !canAdd && styles.disabledButton]}
            onPress={() => canAdd && onAddToCart(item)}
            disabled={!canAdd}
          >
            <Ionicons name="cart-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{canAdd ? 'Add to Cart' : 'Max Reached'}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
});

export default function BuyProductScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState(3); // 3: Default, 1: High to Low, 2: Low to High
  const [showSortModal, setShowSortModal] = useState(false);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productCollection);
        const productList = productSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            price: parseFloat(data.price) || 0,
            stock: data.stock || 0,
            category: data.category || 'Others',
          };
        });
        console.log('Raw Fetched Products:', productList.map(p => ({ id: p.id, name: p.name, price: p.price })));
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribeCart = userId
      ? onSnapshot(collection(db, 'users', userId, 'cart'), (snapshot) => {
          const cartList = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            price: Number(doc.data().price) || 0,
          }));
          setCart(cartList);
        }, (error) => {
          console.error('Error listening to cart:', error);
          Alert.alert('Error', 'Failed to load cart items.');
        })
      : () => {};

    fetchProducts();
    return () => unsubscribeCart();
  }, [userId]);

  useEffect(() => {
    let updatedProducts = [...products];

    // Simplified sorting logic using numeric sortBy values
    if (sortBy === 2) { // Low to High
      updatedProducts.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        console.log(`Sorting Low to High - ${priceA} (${a.name}) vs ${priceB} (${b.name})`);
        return priceA - priceB;
      });
    } else if (sortBy === 1) { // High to Low
      updatedProducts.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        console.log(`Sorting High to Low - ${priceA} (${a.name}) vs ${priceB} (${b.name})`);
        return priceB - priceA;
      });
    } else {
      console.log('No sorting applied (sortBy = 3)');
    }

    // Apply other filters
    if (searchQuery) {
      updatedProducts = updatedProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      updatedProducts = updatedProducts.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(updatedProducts);
    console.log('Updated filteredProducts:', updatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));
  }, [sortBy, products, searchQuery, selectedCategory]);

  const addToCart = async (product) => {
    if (!userId) {
      Alert.alert('Login Required', 'Please login to add items to the cart.');
      return;
    }

    const existingProduct = cart.find(item => item.productId === product.id);
    const availableStock = Number(product.stock) || 0;
    const inCartQuantity = existingProduct ? existingCartItem.quantity : 0;

    if (inCartQuantity >= availableStock) {
      Alert.alert('Stock Limit', `Only ${availableStock} ${product.name}(s) available.`);
      return;
    }

    try {
      if (existingProduct) {
        await updateDoc(doc(db, 'users', userId, 'cart', existingProduct.id), {
          quantity: inCartQuantity + 1,
        });
      } else {
        await addDoc(collection(db, 'users', userId, 'cart'), {
          productId: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          quantity: 1,
          imageUrl: product.imageUrl,
        });
      }
      Alert.alert('Success', `${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart.');
    }
  };

  const goToCart = () => navigation.navigate('CartScreen');
  const categories = ['All', ...new Set(products.map(product => product.category))];
  const calculateCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const renderProduct = ({ item }) => (
    <ProductItem item={item} onAddToCart={addToCart} cart={cart} />
  );

  const sortOptions = [
    { label: 'Default', value: 3 },
    { label: 'Price High to Low', value: 1 },
    { label: 'Price Low to High', value: 2 },
  ];

  const renderSortOption = ({ item }) => (
    <TouchableOpacity
      style={[styles.sortOption, sortBy === item.value && styles.sortOptionActive]}
      onPress={() => {
        setSortBy(item.value);
        setShowSortModal(false);
      }}
    >
      <Text style={[styles.sortOptionText, sortBy === item.value && styles.sortOptionTextActive]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  // Get the label of the currently selected sort option
  const getSortLabel = () => {
    const selectedOption = sortOptions.find(option => option.value === sortBy);
    return selectedOption ? selectedOption.label : 'Sort';
  };

  if (loading) {
    return (
      <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
        <Ionicons name="leaf-outline" size={50} color="#1B5E20" />
        <Text style={styles.loadingText}>Loading your plants...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for plants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
        <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
          <Ionicons name="cart-outline" size={24} color="#1B5E20" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            // Reset to Default (3) when opening the modal
            setSortBy(3);
            setShowSortModal(true);
          }}
        >
          <View style={styles.filterButtonContent}>
            <Ionicons name="filter" size={20} color="#1B5E20" />
            <Text style={styles.filterButtonText}>{getSortLabel()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={sortOptions}
              renderItem={renderSortOption}
              keyExtractor={(item) => item.value.toString()}
              style={styles.sortList}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={60} color="#666" />
          <Text style={styles.emptyText}>No plants found.</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSortBy(3); // Reset to Default (3)
            }}
          >
            <Text style={styles.resetText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.productList}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          key={`${sortBy}`} // Force re-render on sortBy change
        />
      )}

      {cart.length > 0 && (
        <LinearGradient colors={['#FFFFFF', '#E8F5E9']} style={styles.cartSummary}>
          <Text style={styles.cartSummaryText}>
            Cart: {cart.reduce((total, item) => total + item.quantity, 0)} items
          </Text>
          <Text style={styles.cartTotal}>Total: ${calculateCartTotal()}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={goToCart}>
            <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.checkoutGradient}>
              <Text style={styles.checkoutText}>Proceed to Cart</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  backButton: {
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1B5E20',
  },
  cartIcon: {
    padding: 5,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  categoryContainer: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterButton: {
    padding: 10,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#1B5E20',
  },
  // Sort Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  sortList: {
    maxHeight: 200,
  },
  sortOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sortOptionActive: {
    backgroundColor: '#E8F5E9',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  sortOptionTextActive: {
    color: '#1B5E20',
    fontWeight: '600',
  },
  productList: {
    padding: 10,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 5,
    padding: 10,
    elevation: 3,
  },
  productImage: {
    width: '100',
    height: 140,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 5,
  },
  productStock: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  buttonIcon: {
    marginRight: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  cartSummaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  checkoutButton: {
    borderRadius: 25,
  },
  checkoutGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});