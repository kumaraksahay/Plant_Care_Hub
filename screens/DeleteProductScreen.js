// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
// import { db } from "./firebaseConfig"; // Your Firebase config
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// export default function DeleteProductScreen() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const productsRef = collection(db, "products");
//       const querySnapshot = await getDocs(productsRef);
//       const productsList = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//       setProducts(productsList);
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Failed to fetch products.");
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     try {
//       const productRef = doc(db, "products", id);
//       await deleteDoc(productRef);
//       Alert.alert("Success", "Product deleted successfully.");
//       fetchProducts(); // Refresh the product list after deletion
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Failed to delete product.");
//     }
//   };

//   const renderProductItem = ({ item }) => (
//     <View style={styles.productItem}>
//       <Text style={styles.productText}>{item.name}</Text>
//       <Text style={styles.productText}>Price: ${item.price}</Text>
//       <Text style={styles.productText}>Stock: {item.stock}</Text>
//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => handleDeleteProduct(item.id)}
//       >
//         <Text style={styles.buttonText}>Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Delete Product</Text>
//       <FlatList
//         data={products}
//         renderItem={renderProductItem}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f7f7f7",
//     paddingHorizontal: 20,
//     paddingTop: 30,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#2A5B46",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   productItem: {
//     backgroundColor: "#fff",
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   productText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   deleteButton: {
//     backgroundColor: "#FF6347",
//     paddingVertical: 10,
//     marginTop: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });



// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import { doc, deleteDoc } from 'firebase/firestore';
// import { db } from './firebaseConfig';

// export default function DeleteProductScreen({ route, navigation }) {
//   const { productId, name } = route.params;

//   const handleDeleteProduct = async () => {
//     try {
//       const productRef = doc(db, 'products', productId);
//       await deleteDoc(productRef);
//       Alert.alert('Success', 'Product deleted successfully');
//       navigation.navigate('ManageProductsScreen');
//     } catch (error) {
//       Alert.alert('Error', 'Unable to delete product');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Delete Product</Text>
//       <Text style={styles.text}>Are you sure you want to delete "{name}"?</Text>

//       <TouchableOpacity style={styles.button} onPress={handleDeleteProduct}>
//         <Text style={styles.buttonText}>Delete Product</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: '#FF6347',
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });



// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { doc, deleteDoc } from 'firebase/firestore';
// import { db } from './firebaseConfig';

// export default function DeleteProductScreen({ route, navigation }) {
//   const { productId, name } = route.params;

//   const handleDeleteProduct = async () => {
//     try {
//       const productRef = doc(db, 'products', productId);
//       await deleteDoc(productRef);
//       Alert.alert('Success', 'Product deleted successfully');
//       navigation.replace('ManageProductsScreen');
//     } catch (error) {
//       Alert.alert('Error', 'Unable to delete product');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Delete Product</Text>
//       <Text style={styles.text}>Are you sure you want to delete "{name}"?</Text>

//       <TouchableOpacity style={styles.button} onPress={handleDeleteProduct}>
//         <Text style={styles.buttonText}>Delete Product</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: '#FF6347',
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });







import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function DeleteProductScreen({ route, navigation }) {
  const { productId, name } = route.params;

  const handleDeleteProduct = async () => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      Alert.alert('Success', 'Product deleted successfully');
      navigation.replace('ManageProductsScreen');
    } catch (error) {
      Alert.alert('Error', 'Unable to delete product');
    }
  };

  return (
    <LinearGradient colors={['#A8E6CF', '#FF6B6B']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Confirm Deletion</Text>
        <Text style={styles.message}>
          Are you sure you want to delete "{name}"? This action cannot be undone.
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteProduct}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});