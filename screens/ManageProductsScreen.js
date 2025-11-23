// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';

// export default function ManageProductsScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Products</Text>

//       <TouchableOpacity 
//         style={styles.button}
//         onPress={() => navigation.navigate('AddProductScreen')}
//       >
//         <Text style={styles.buttonText}>Add Product</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={styles.button}
//         onPress={() => navigation.navigate('UpdateProductScreen')}
//       >
//         <Text style={styles.buttonText}>Update Product</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={styles.button}
//         onPress={() => navigation.navigate('DeleteProductScreen')}
//       >
//         <Text style={styles.buttonText}>Delete Product</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7f7f7',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#2A5B46',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 12,
//     marginVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });




// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from './firebaseConfig'; // Assuming you have Firebase set up

// export default function ManageProductsScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
  
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setProducts(productList);
//       } catch (error) {
//         Alert.alert('Error', 'Unable to fetch products');
//       }
//     };
    
//     fetchProducts();
//   }, []);

//   const renderProduct = ({ item }) => (
//     <View style={styles.productItem}>
//       <Text style={styles.productText}>{item.name}</Text>
//       <Text style={styles.productText}>Price: ${item.price}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Products</Text>
      
//       <FlatList 
//         data={products}
//         keyExtractor={item => item.id}
//         renderItem={renderProduct}
//       />

//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AddProductScreen')}>
//           <Text style={styles.footerButtonText}>Add Product</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('UpdateProductScreen')}>
//           <Text style={styles.footerButtonText}>Update Product</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('DeleteProductScreen')}>
//           <Text style={styles.footerButtonText}>Delete Product</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   productItem: {
//     padding: 15,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   productText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 20,
//   },
//   footerButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   footerButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from './firebaseConfig'; // Assuming you have Firebase set up

// export default function ManageProductsScreen({ navigation }) {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setProducts(productList);
//       } catch (error) {
//         Alert.alert('Error', 'Unable to fetch products');
//       }
//     };

//     fetchProducts();
//   }, []);

//   const renderProduct = ({ item }) => (
//     <View style={styles.productItem}>
//       <Text style={styles.productText}>{item.name}</Text>
//       <Text style={styles.productText}>Price: ${item.price}</Text>
//       <View style={styles.productActions}>
//         <TouchableOpacity onPress={() => navigation.navigate('UpdateProductScreen', {
//           productId: item.id,
//           currentName: item.name,
//           currentPrice: item.price,
//           currentDescription: item.description,
//         })}>
//           <Text style={styles.productActionText}>Update</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('DeleteProductScreen', { productId: item.id, name: item.name })}>
//           <Text style={styles.productActionText}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Products</Text>

//       <FlatList 
//         data={products}
//         keyExtractor={item => item.id}
//         renderItem={renderProduct}
//       />

//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AddProductScreen')}>
//           <Text style={styles.footerButtonText}>Add Product</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   productItem: {
//     padding: 15,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   productText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   productActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   productActionText: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   footerButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   footerButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from './firebaseConfig';

// export default function ManageProductsScreen({ navigation }) {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'products');
//         const productSnapshot = await getDocs(productCollection);
//         const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setProducts(productList);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const renderProduct = ({ item }) => (
//     <View style={styles.productItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
//       <Text style={styles.productText}>{item.name}</Text>
//       <Text style={styles.productText}>Price: ${item.price}</Text>
//       <Text style={styles.productText}>Stock: {item.stock}</Text>

//       <View style={styles.productActions}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('UpdateProductScreen', {
//             productId: item.id,
//             currentName: item.name,
//             currentPrice: item.price,
//             currentDescription: item.description,
//             currentStock: item.stock,
//             currentImageUrl: item.imageUrl,
//           })}>
//           <Text style={styles.productActionText}>Update</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => navigation.navigate('DeleteProductScreen', { productId: item.id, name: item.name })}>
//           <Text style={styles.productActionText}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Products</Text>

//       <FlatList
//         data={products}
//         keyExtractor={item => item.id}
//         renderItem={renderProduct}
//       />

//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AddProductScreen')}>
//           <Text style={styles.footerButtonText}>Add Product</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   productItem: {
//     flexDirection: 'row',
//     padding: 15,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     alignItems: 'center',
//   },
//   productImage: {
//     width: 80,
//     height: 80,
//     marginRight: 15,
//     resizeMode: 'contain',
//   },
//   productText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   productActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   productActionText: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   footerButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   footerButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });



import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function ManageProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productCollection);
        const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Price: ${item.price}</Text>
        <Text style={styles.productStock}>Stock: {item.stock}</Text>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('UpdateProductScreen', {
          productId: item.id,
        })}>
        <Text style={styles.actionButtonText}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#F44336' }]}
        onPress={() => navigation.navigate('DeleteProductScreen', { productId: item.id })}>
        <Text style={styles.actionButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Products</Text>

      {products.length === 0 ? (
        <Text style={styles.noProductsText}>No products available. Add a new product to get started!</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProductScreen')}>
        <Text style={styles.addButtonText}>+ Add Product</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 80,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: 'cover',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  productStock: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});



// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from './firebaseConfig';

// export default function ManageProductsScreen({ navigation }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

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

//     fetchProducts();
//   }, []);

//   const renderProduct = ({ item }) => (
//     <TouchableOpacity
//       style={styles.productItem}
//       onPress={() => navigation.navigate('ProductDetailsScreen', { productId: item.id, productData: item })}>
//       <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
//       <View style={styles.productDetails}>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productPrice}>${item.price}</Text>
//         <Text style={styles.productStock}>Stock: {item.stock}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Products</Text>

//       {products.length === 0 ? (
//         <Text style={styles.noProductsText}>No products available. Add a new product to get started!</Text>
//       ) : (
//         <FlatList
//           data={products}
//           keyExtractor={item => item.id}
//           renderItem={renderProduct}
//           contentContainerStyle={styles.listContainer}
//           numColumns={2}
//         />
//       )}

//       <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProductScreen')}>
//         <Text style={styles.addButtonText}>+ Add Product</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noProductsText: {
//     fontSize: 16,
//     color: '#555',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   listContainer: {
//     paddingBottom: 80,
//   },
//   productItem: {
//     flexDirection: 'column',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 20,
//     marginHorizontal: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     alignItems: 'center',
//     padding: 10,
//     width: '45%',
//     marginTop: 10,
//   },
//   productImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 8,
//     marginBottom: 10,
//     resizeMode: 'cover',
//   },
//   productDetails: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   productPrice: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   productStock: {
//     fontSize: 12,
//     color: '#999',
//   },
//   addButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: '50%',
//     transform: [{ translateX: -50 }],
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
