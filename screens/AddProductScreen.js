// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import { db } from "./firebaseConfig"; // Your Firebase config
// import { addDoc, collection } from "firebase/firestore";

// export default function AddProductScreen() {
//   const [productName, setProductName] = useState("");
//   const [price, setPrice] = useState("");
//   const [stock, setStock] = useState("");

//   const handleAddProduct = async () => {
//     if (productName === "" || price === "" || stock === "") {
//       Alert.alert("Error", "All fields are required.");
//       return;
//     }

//     try {
//       await addDoc(collection(db, "products"), {
//         name: productName,
//         price: parseFloat(price),
//         stock: parseInt(stock),
//       });
//       Alert.alert("Success", "Product added successfully.");
//       setProductName("");
//       setPrice("");
//       setStock("");
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Failed to add product.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add New Product</Text>
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
//       <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
//         <Text style={styles.buttonText}>Add Product</Text>
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



// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import { addDoc, collection } from 'firebase/firestore';
// import { db } from './firebaseConfig';

// export default function AddProductScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');

//   const handleAddProduct = async () => {
//     if (!name || !price || !description) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     try {
//       await addDoc(collection(db, 'products'), {
//         name,
//         price,
//         description,
//       });
//       Alert.alert('Success', 'Product added successfully');
//       navigation.replace('ManageProductsScreen');
//     } catch (error) {
//       Alert.alert('Error', 'Unable to add product');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add New Product</Text>
      
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

//       <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
//         <Text style={styles.buttonText}>Add Product</Text>
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



// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker'; // To select images from gallery
// import { addDoc, collection } from 'firebase/firestore';
// import { db, storage } from './firebaseConfig'; // Firebase storage setup
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// export default function AddProductScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [stock, setStock] = useState('');
//   const [imageUri, setImageUri] = useState(null);

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

//   const handleAddProduct = async () => {
//     if (!name || !price || !description || !stock || !imageUri) {
//       Alert.alert('Error', 'Please fill in all fields, including the image');
//       return;
//     }

//     try {
//       // Upload image to Firebase Storage
//       const imageRef = ref(storage, `productImages/${Date.now()}`);
//       const response = await fetch(imageUri);
//       const blob = await response.blob();
//       await uploadBytes(imageRef, blob);

//       // Get the image URL
//       const imageUrl = await getDownloadURL(imageRef);

//       // Add product to Firestore
//       await addDoc(collection(db, 'products'), {
//         name,
//         price,
//         description,
//         stock,
//         imageUrl,
//       });

//       Alert.alert('Success', 'Product added successfully');
//     //   navigation.navigate('ManageProductsScreen');
//     } catch (error) {
//       Alert.alert('Error', 'Unable to add product');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add Product</Text>

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

//       <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
//         <Text style={styles.buttonText}>Add Product</Text>
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



// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker'; // To select images from gallery
// import { addDoc, collection } from 'firebase/firestore';
// import { db, storage } from './firebaseConfig'; // Firebase storage setup
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// export default function AddProductScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [stock, setStock] = useState('');
//   const [imageUri, setImageUri] = useState(null);

//   // Request permission to access the gallery and pick image
//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission denied', 'You need to grant permission to access the gallery.');
//       return;
//     }

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

//   const handleAddProduct = async () => {
//     if (!name || !price || !description || !stock || !imageUri) {
//       Alert.alert('Error', 'Please fill in all fields, including the image');
//       return;
//     }

//     try {
//       // Upload image to Firebase Storage
//       const imageRef = ref(storage, 'productImages/${Date.now()}');
      
//       // Fetch image as blob
//       const response = await fetch(imageUri);
//       const blob = await response.blob();
      
//       // Upload the blob to Firebase Storage
//       await uploadBytes(imageRef, blob);

//       // Get the image URL after upload
//       const imageUrl = await getDownloadURL(imageRef);

//       // Add product information to Firestore
//       await addDoc(collection(db, 'products'), {
//         name,
//         price,
//         description,
//         stock,
//         imageUrl,
//       });

//       // Success message
//       Alert.alert('Success', 'Product added successfully');
//       navigation.navigate('ManageProductsScreen'); // Navigate to manage products screen after success

//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Unable to add product');
//     }
//   };

//   return (
//     <View style={styles.container}>
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
      
//       {/* Display selected image if available */}
//       {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      
//       <TouchableOpacity onPress={pickImage} style={styles.button}>
//         <Text style={styles.buttonText}>Pick an Image</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={handleAddProduct} style={styles.button}>
//         <Text style={styles.buttonText}>Add Product</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingLeft: 8,
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 12,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginBottom: 12,
//     alignSelf: 'center',
//   },
// });


import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For picking images from the gallery
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Firebase Firestore setup

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('Error', 'Unable to pick an image.');
    }
  };

  const handleAddProduct = async () => {
    if (!name || !price || !description || !stock || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields, including the image.');
      return;
    }

    try {
      // Upload image to Imgur
      const imageData = new FormData();
      imageData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'product.jpg',
      });

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: 'Client-ID c638fa73cd91cb5', // Replace with your Imgur Client ID
          'Content-Type': 'multipart/form-data',
        },
        body: imageData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error('Image upload to Imgur failed.');
      }

      const imageUrl = result.data.link; // URL of the uploaded image

      // Add product details to Firestore
      await addDoc(collection(db, 'products'), {
        name,
        price,
        description,
        stock,
        imageUrl,
      });

      Alert.alert('Success', 'Product added successfully!');
      navigation.navigate('ManageProductsScreen'); // Navigate to Manage Products screen
    } catch (error) {
      console.error('Error Adding Product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.textarea}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        placeholderTextColor="#777"
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Select Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    fontSize: 16,
  },
  textarea: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    width: 120,
    height: 120,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageText: {
    color: '#aaa',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
