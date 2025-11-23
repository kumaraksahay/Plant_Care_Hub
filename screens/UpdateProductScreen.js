// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import { db } from "./firebaseConfig"; // Your Firebase config
// import { doc, updateDoc } from "firebase/firestore";

// export default function UpdateProductScreen({ route, navigation }) {
//   const {currentName, currentPrice, currentStock } = route.params; // Receiving product details from previous screen

//   const [productName, setProductName] = useState(currentName);
//   const [price, setPrice] = useState(currentPrice.toString());
//   const [stock, setStock] = useState(currentStock.toString());

//   const handleUpdateProduct = async () => {
//     if (productName === "" || price === "" || stock === "") {
//       Alert.alert("Error", "All fields are required.");
//       return;
//     }

//     try {
//       const productRef = doc(db, "products",);
//       await updateDoc(productRef, {
//         name: productName,
//         price: parseFloat(price),
//         stock: parseInt(stock),
//       });
//       Alert.alert("Success", "Product updated successfully.");
//       navigation.goBack(); // Go back to the previous screen after update
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Failed to update product.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Update Product</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Product Name"
//         value={productName}
//         onChangeText={setProductName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Price"
//         value={price}
//         onChangeText={setPrice}
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Stock"
//         value={stock}
//         onChangeText={setStock}
//         keyboardType="numeric"
//       />
//       <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
//         <Text style={styles.buttonText}>Update Product</Text>
//       </TouchableOpacity>
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
//   input: {
//     backgroundColor: "#fff",
//     padding: 15,
//     marginBottom: 15,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   button: {
//     backgroundColor: "#4CAF50",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });



// import React, { useState, useEffect } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from './firebaseConfig';

// export default function UpdateProductScreen({ route, navigation }) {
//   const { productId, currentName, currentPrice, currentDescription } = route.params;
  
//   const [name, setName] = useState(currentName);
//   const [price, setPrice] = useState(currentPrice);
//   const [description, setDescription] = useState(currentDescription);

//   const handleUpdateProduct = async () => {
//     if (!name || !price || !description) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     try {
//       const productRef = doc(db, 'products', productId);
//       await updateDoc(productRef, {
//         name,
//         price,
//         description,
//       });
//       Alert.alert('Success', 'Product updated successfully');
//       navigation.navigate('ManageProductsScreen');
//     } catch (error) {
//       Alert.alert('Error', 'Unable to update product');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Update Product</Text>
      
//       <TextInput
//         style={styles.input}
//         placeholder="Product Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Price"
//         value={price}
//         onChangeText={setPrice}
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Description"
//         value={description}
//         onChangeText={setDescription}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
//         <Text style={styles.buttonText}>Update Product</Text>
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
//   input: {
//     padding: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });


// import React, { useState, useEffect } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from './firebaseConfig';

// export default function UpdateProductScreen({ route, navigation }) {
//   const { productId, currentName, currentPrice, currentDescription } = route.params;

//   const [name, setName] = useState(currentName);
//   const [price, setPrice] = useState(currentPrice);
//   const [description, setDescription] = useState(currentDescription);

//   const handleUpdateProduct = async () => {
//     if (!name || !price || !description) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     try {
//       const productRef = doc(db, 'products', productId);
//       await updateDoc(productRef, {
//         name,
//         price,
//         description,
//       });
//       Alert.alert('Success', 'Product updated successfully');
//       navigation.replace('ManageProductsScreen');
//     } catch (error) {
//       Alert.alert('Error', 'Unable to update product');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Update Product</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Product Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Price"
//         value={price}
//         onChangeText={setPrice}
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Description"
//         value={description}
//         onChangeText={setDescription}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
//         <Text style={styles.buttonText}>Update Product</Text>
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
//   input: {
//     padding: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });



// import React, { useState, useEffect } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db, storage } from './firebaseConfig';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// export default function UpdateProductScreen({ route, navigation }) {
//   const { productId, currentName, currentPrice, currentDescription, currentStock, currentImageUrl } = route.params;

//   const [name, setName] = useState(currentName);
//   const [price, setPrice] = useState(currentPrice);
//   const [description, setDescription] = useState(currentDescription);
//   const [stock, setStock] = useState(currentStock);
//   const [imageUri, setImageUri] = useState(currentImageUrl);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImageUri(result.uri);
//     }
//   };

//   const handleUpdateProduct = async () => {
//     if (!name || !price || !description || !stock) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     try {
//       let updatedImageUrl = imageUri;
//       if (imageUri !== currentImageUrl) {
//         // Upload the new image if changed
//         const imageRef = ref(storage, `productImages/${Date.now()}`);
//         const response = await fetch(imageUri);
//         const blob = await response.blob();
//         await uploadBytes(imageRef, blob);
//         updatedImageUrl = await getDownloadURL(imageRef);
//       }

//       const productRef = doc(db, 'products', productId);
//       await updateDoc(productRef, {
//         name,
//         price,
//         description,
//         stock,
//         imageUrl: updatedImageUrl,
//       });

//       Alert.alert('Success', 'Product updated successfully');
//       navigation.navigate('ManageProductsScreen');
//     } catch (error) {
//       Alert.alert('Error', 'Unable to update product');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Update Product</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Product Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Price"
//         value={price}
//         onChangeText={setPrice}
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Description"
//         value={description}
//         onChangeText={setDescription}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Stock"
//         value={stock}
//         onChangeText={setStock}
//         keyboardType="numeric"
//       />

//       <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
//         {imageUri ? (
//           <Image source={{ uri: imageUri }} style={styles.image} />
//         ) : (
//           <Text style={styles.imageText}>Select Image</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
//         <Text style={styles.buttonText}>Update Product</Text>
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
//   input: {
//     padding: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//   },
//   imagePicker: {
//     backgroundColor: '#f0f0f0',
//     padding: 20,
//     marginBottom: 20,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   imageText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Image,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from './firebaseConfig';

// export default function UpdateProductScreen({ route, navigation }) {
//   const {
//     productId,
//     currentName,
//     currentPrice,
//     currentDescription,
//     currentStock,
//     currentImageUrl,
//   } = route.params;

//   const [name, setName] = useState(currentName || '');
//   const [price, setPrice] = useState(currentPrice?.toString() || '');
//   const [description, setDescription] = useState(currentDescription || '');
//   const [stock, setStock] = useState(currentStock?.toString() || '');
//   const [imageUri, setImageUri] = useState(currentImageUrl || '');

//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setImageUri(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.error('Image Picker Error:', error);
//       Alert.alert('Error', 'Unable to pick an image.');
//     }
//   };

//   const handleUpdateProduct = async () => {
//     if (!name || !price || !description || !stock) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     try {
//       let updatedImageUrl = imageUri;
//       if (imageUri !== currentImageUrl) {
//         // Upload the image to Imgur
//         const imageData = new FormData();
//         imageData.append('image', {
//           uri: imageUri,
//           type: 'image/jpeg',
//           name: 'product.jpg',
//         });

//         const response = await fetch('https://api.imgur.com/3/image', {
//           method: 'POST',
//           headers: {
//             Authorization: 'Client-ID c638fa73cd91cb5',
//             'Content-Type': 'multipart/form-data',
//           },
//           body: imageData,
//         });

//         const result = await response.json();

//         if (!result.success) {
//           throw new Error('Image upload to Imgur failed.');
//         }

//         updatedImageUrl = result.data.link; // New image URL from Imgur
//       }

//       // Update product details in Firestore
//       const productRef = doc(db, 'products', productId);
//       await updateDoc(productRef, {
//         name,
//         price,
//         description,
//         stock,
//         imageUrl: updatedImageUrl,
//       });

//       Alert.alert('Success', 'Product updated successfully!');
//       navigation.navigate('ManageProductsScreen');
//     } catch (error) {
//       console.error('Error Updating Product:', error);
//       Alert.alert('Error', 'Failed to update the product. Please try again.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Update Product</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Product Name"
//         value={name}
//         onChangeText={setName}
//         placeholderTextColor="#777"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Price"
//         value={price}
//         onChangeText={setPrice}
//         keyboardType="numeric"
//         placeholderTextColor="#777"
//       />
//       <TextInput
//         style={styles.textarea}
//         placeholder="Description"
//         value={description}
//         onChangeText={setDescription}
//         multiline
//         placeholderTextColor="#777"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Stock"
//         value={stock}
//         onChangeText={setStock}
//         keyboardType="numeric"
//         placeholderTextColor="#777"
//       />

//       <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
//         {imageUri ? (
//           <Image source={{ uri: imageUri }} style={styles.image} />
//         ) : (
//           <Text style={styles.imageText}>Select Image</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
//         <Text style={styles.buttonText}>Update Product</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     color: '#333',
//     fontSize: 16,
//   },
//   textarea: {
//     width: '100%',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     color: '#333',
//     fontSize: 16,
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   imagePicker: {
//     width: 120,
//     height: 120,
//     backgroundColor: '#e8e8e8',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//   },
//   imageText: {
//     color: '#aaa',
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     paddingHorizontal: 60,
//     borderRadius: 25,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });




import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For picking images
import { db } from './firebaseConfig'; // Firebase Firestore setup
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function UpdateProductScreen({ route, navigation }) {
  const { productId } = route.params; // Get the product ID from the previous screen

  // Initialize state variables
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(true); // For showing loading state while fetching data

  // Fetch product data from Firestore when the component mounts
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          const productData = productDoc.data();
          setName(productData.name);
          setPrice(productData.price?.toString() || ''); // Ensure price is a string
          setDescription(productData.description || '');
          setStock(productData.stock?.toString() || ''); // Ensure stock is a string
          setImageUri(productData.imageUrl || '');
        } else {
          Alert.alert('Error', 'Product not found.');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        Alert.alert('Error', 'Failed to load product data.');
      } finally {
        setLoading(false); // Hide loading spinner when done
      }
    };

    fetchProductData();
  }, [productId]);

  // Function to pick a new image
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri); // Set the image URI
        console.log('New Image URI:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('Error', 'Unable to pick an image.');
    }
  };

  // Function to handle product update
  const handleUpdateProduct = async () => {
    if (!name || !price || !description || !stock) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const productRef = doc(db, 'products', productId);

      // If the image URI was updated, upload the new image and update the image URL
      if (imageUri !== productId.imageUrl) {
        // Here, you would upload the image to a storage service (like Imgur or Firebase Storage)
        // For now, we'll assume that you have a function to upload the image and return its URL
        const imageUrl = await uploadImage(imageUri); // Assume this function uploads the image and returns the URL

        // Update the product data in Firestore
        await updateDoc(productRef, {
          name,
          price,
          description,
          stock,
          imageUrl, // Update the image URL
        });
      } else {
        // If the image URI was not updated, only update the text fields
        await updateDoc(productRef, {
          name,
          price,
          description,
          stock,
        });
      }

      Alert.alert('Success', 'Product updated successfully!');
      navigation.goBack(); // Go back to ManageProductsScreen
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product. Please try again.');
    }
  };

  // Function to upload image (Dummy function for now)
  const uploadImage = async (uri) => {
    // Replace this with actual image upload logic
    // For example, upload the image to Firebase Storage or an external service
    console.log('Uploading image:', uri);
    return uri; // Return the image URL (For now, returning the same URI)
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Select Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
        <Text style={styles.buttonText}>Update Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  imagePicker: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  imageText: {
    fontSize: 16,
    color: '#333',
  },
});
