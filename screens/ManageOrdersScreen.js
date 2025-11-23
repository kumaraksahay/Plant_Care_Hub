// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// import { db } from './firebaseConfig'; // Ensure you import Firebase correctly
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// export default function ManageOrdersScreen() {
//   const [orders, setOrders] = useState([]);

//   // Fetch all orders from Firestore
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const ordersRef = collection(db, 'orders');  // Fetching from the 'orders' collection globally
//         const ordersSnapshot = await getDocs(ordersRef);
//         const ordersList = ordersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//         setOrders(ordersList);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//         Alert.alert('Error', 'Failed to fetch orders.');
//       }
//     };

//     fetchOrders();
//   }, []);

//   // Remove order from Firestore
//   const removeOrder = async (orderId) => {
//     try {
//       await deleteDoc(doc(db, 'orders', orderId));
//       setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
//       Alert.alert('Success', 'Order has been deleted.');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       Alert.alert('Error', 'Failed to delete the order.');
//     }
//   };

//   // Render Order Item
//   const renderOrderItem = ({ item }) => (
//     <View style={styles.orderItem}>
//       <View style={styles.orderDetails}>
//         <Text style={styles.orderEmail}>User Email: {item.userId}</Text>  {/* Displaying User ID instead of email for security */}
//         <Text style={styles.orderDate}>Order Date: {new Date(item.orderDate.seconds * 1000).toLocaleDateString()}</Text>
//         <Text style={styles.orderStatus}>Status: {item.status}</Text>
//         <Text style={styles.orderAmount}>Total Amount: ${item.totalAmount}</Text>
//         <Text style={styles.orderItems}>Items:</Text>
//         {item.items.map((product, index) => (
//           <View key={index} style={styles.productDetails}>
//             <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
//             <View>
//               <Text style={styles.productName}>{product.name}</Text>
//               <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
//               <Text style={styles.productPrice}>Price: ${product.price}</Text>
//             </View>
//           </View>
//         ))}
//       </View>

//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => removeOrder(item.id)}
//       >
//         <Text style={styles.deleteButtonText}>Delete Order</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Orders</Text>

//       {orders.length > 0 ? (
//         <FlatList
//           data={orders}
//           keyExtractor={item => item.id}
//           renderItem={renderOrderItem}
//         />
//       ) : (
//         <View style={styles.noOrdersContainer}>
//           <Text style={styles.noOrdersText}>No orders available.</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//     padding: 20,
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   orderItem: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   orderDetails: {
//     marginBottom: 10,
//   },
//   orderEmail: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   orderDate: {
//     fontSize: 14,
//     color: '#888',
//   },
//   orderStatus: {
//     fontSize: 14,
//     color: '#FF5722', // For pending status
//     fontWeight: 'bold',
//   },
//   orderAmount: {
//     fontSize: 16,
//     color: '#4CAF50', // Green for total amount
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   orderItems: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 10,
//     marginBottom: 5,
//     color: '#333',
//   },
//   productDetails: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   productImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     marginRight: 10,
//     resizeMode: 'cover',
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   productQuantity: {
//     fontSize: 12,
//     color: '#888',
//   },
//   productPrice: {
//     fontSize: 12,
//     color: '#4CAF50',
//   },
//   deleteButton: {
//     backgroundColor: '#F44336',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   deleteButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   noOrdersContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   noOrdersText: {
//     fontSize: 18,
//     color: '#888',
//   },
// });




import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function ManageOrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const removeOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      Alert.alert('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      Alert.alert('Failed to delete order');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderDetails}>
        <Text style={styles.orderEmail}>User Email: <Text style={styles.boldText}>{item.userId}</Text></Text>
        <Text style={styles.orderDate}>
          Order Date: <Text style={styles.boldText}>{new Date(item.orderDate.seconds * 1000).toLocaleDateString()}</Text>
        </Text>
        <Text style={styles.orderStatus}>Status: <Text style={styles.boldText}>{item.status}</Text></Text>
        <Text style={styles.orderAmount}>Total Amount: <Text style={styles.boldText}>${item.totalAmount}</Text></Text>
        
        <Text style={styles.orderItems}>Items:</Text>
        {item.items.map((product, index) => (
          <View key={index} style={styles.productDetails}>
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
            <View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
              <Text style={styles.productPrice}>Price: ${product.price}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeOrder(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Orders</Text>
      
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderOrderItem}
        />
      )}
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
    textAlign: 'center',
    marginBottom: 20,
  },
  noOrdersText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderDetails: {
    marginBottom: 10,
  },
  orderEmail: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    color: '#888',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  orderItems: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
});
