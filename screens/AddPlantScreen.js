import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function AddPlantScreen({ navigation }) {
  const [name, setName] = useState('');
  const [health, setHealth] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('Error', 'Unable to pick an image.');
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'plant.jpg',
      });
      formData.append('upload_preset', 'PlantPal'); // Replace with your Cloudinary upload preset
      formData.append('cloud_name', 'darkuribc'); // Replace with your Cloudinary cloud name

      const response = await axios.post('https://api.cloudinary.com/v1_1/darkuribc/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.secure_url) {
        return response.data.secure_url;
      } else {
        throw new Error('Failed to upload image to Cloudinary');
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw error;
    }
  };

  const handleAddPlant = async () => {
    if (!name || !health || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields and select an image.');
      return;
    }

    try {
      const user = auth.currentUser;
      let imageUrl = '';
      if (imageUri) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }

      await addDoc(collection(db, 'users', user.uid, 'plants'), {
        name,
        health: parseInt(health),
        image: imageUrl,
        lastWatered: new Date().toISOString(),
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Plant added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Add Plant Error:', error);
      Alert.alert('Error', 'Failed to add plant.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#A8E6CF', '#DCF5DC']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#285430" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Plant</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Plant Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#777"
        />
        <TextInput
          style={styles.input}
          placeholder="Health (0-100)"
          value={health}
          onChangeText={setHealth}
          keyboardType="numeric"
          placeholderTextColor="#777"
        />
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Tap to Select Image</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlant}>
          <LinearGradient
            colors={['#4CAF50', '#388E3C']}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.addButtonText}>Add Plant</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#285430',
  },
  headerPlaceholder: {
    width: 28,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imagePicker: {
    width: 150,
    height: 150,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  imageText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    alignSelf: 'center',
  },
  addButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});