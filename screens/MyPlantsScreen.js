import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Animated,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function MyPlantsScreen({ navigation }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [editName, setEditName] = useState('');
  const [editHealth, setEditHealth] = useState('');
  const [editImageUri, setEditImageUri] = useState(null);
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchPlants = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const plantsQuery = query(collection(db, 'users', user.uid, 'plants'), orderBy('timestamp', 'desc'));
        const plantsSnapshot = await getDocs(plantsQuery);
        const plantsList = plantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlants(plantsList);
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
      Alert.alert('Error', 'Failed to load plants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) setEditImageUri(result.assets[0].uri);
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
      formData.append('upload_preset', 'PlantPal');
      formData.append('cloud_name', 'arkuribc');

      const response = await axios.post('https://api.cloudinary.com/v1_1/arkuribc/image/upload', formData, {
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

  const handleEdit = (plant) => {
    setSelectedPlant(plant);
    setEditName(plant.name);
    setEditHealth(plant.health.toString());
    setEditImageUri(null);
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSaveEdit = async () => {
    if (!editName || !editHealth) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const user = auth.currentUser;
      let newImageUrl = selectedPlant.image;
      if (editImageUri) {
        newImageUrl = await uploadImageToCloudinary(editImageUri);
      }

      await updateDoc(doc(db, 'users', user.uid, 'plants', selectedPlant.id), {
        name: editName,
        health: parseInt(editHealth),
        image: newImageUrl,
        lastWatered: new Date().toISOString(),
      });
      setModalVisible(false);
      fetchPlants();
    } catch (error) {
      console.error('Edit Error:', error);
      Alert.alert('Error', 'Failed to update plant.');
    }
  };

  const handleDelete = async (plantId) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this plant?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const user = auth.currentUser;
            await deleteDoc(doc(db, 'users', user.uid, 'plants', plantId));
            fetchPlants();
          } catch (error) {
            console.error('Delete Error:', error);
            Alert.alert('Error', 'Failed to delete plant.');
          }
        },
      },
    ]);
  };

  const renderPlant = ({ item, index }) => {
    const inputRange = [-1, 0, index * 180, (index + 2) * 180];
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.8],
    });

    return (
      <Animated.View style={[styles.plantCard, { transform: [{ scale }] }]}>
        <View style={styles.plantCardInner}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.plantImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
            <View style={styles.healthBadge}>
              <LinearGradient
                colors={
                  item.health > 80 ? ['#00F260', '#0575E6'] :
                  item.health > 60 ? ['#F2994A', '#F2C94C'] : 
                  ['#EB3349', '#F45C43']
                }
                style={styles.healthBadgeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.healthBadgeText}>{item.health}%</Text>
              </LinearGradient>
            </View>
          </View>
          
          <View style={styles.plantContent}>
            <View style={styles.plantHeader}>
              <Text style={styles.plantName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.statusDot}>
                <View style={[
                  styles.statusDotInner,
                  { backgroundColor: item.health > 70 ? '#00F260' : item.health > 40 ? '#F2C94C' : '#EB3349' }
                ]} />
              </View>
            </View>

            <View style={styles.waterInfoCard}>
              <View style={styles.waterIconContainer}>
                <Ionicons name="water" size={18} color="#0575E6" />
              </View>
              <View style={styles.waterTextContainer}>
                <Text style={styles.waterLabel}>Last watered</Text>
                <Text style={styles.waterTime}>{moment(item.lastWatered).fromNow()}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.editBtn} 
                onPress={() => handleEdit(item)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.btnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="create-outline" size={18} color="#FFF" />
                  <Text style={styles.btnText}>Edit</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.deleteBtn} 
                onPress={() => handleDelete(item.id)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#EB3349', '#F45C43']}
                  style={styles.btnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="trash-outline" size={18} color="#FFF" />
                  <Text style={styles.btnText}>Delete</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Animated.View style={styles.loadingSpinner}>
          <Ionicons name="leaf" size={60} color="#FFF" />
        </Animated.View>
        <Text style={styles.loadingText}>Loading your garden...</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Garden</Text>
          <Text style={styles.headerSubtitle}>{plants.length} {plants.length === 1 ? 'plant' : 'plants'}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('AddPlantScreen')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#00F260', '#0575E6']}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {plants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.emptyIconGradient}
            >
              <Ionicons name="leaf-outline" size={80} color="#FFF" />
            </LinearGradient>
          </View>
          <Text style={styles.emptyTitle}>No Plants Yet</Text>
          <Text style={styles.emptyText}>Start building your digital garden</Text>
          <TouchableOpacity 
            style={styles.emptyAddButton} 
            onPress={() => navigation.navigate('AddPlantScreen')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#00F260', '#0575E6']}
              style={styles.emptyAddGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FFF" />
              <Text style={styles.emptyAddText}>Add Your First Plant</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.FlatList
          data={plants}
          renderItem={renderPlant}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.plantList}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
      )}

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent, 
              { 
                opacity: modalAnimation, 
                transform: [{ 
                  scale: modalAnimation.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [0.7, 1] 
                  }) 
                }] 
              }
            ]}
          >
            <LinearGradient 
              colors={['#667eea', '#764ba2']} 
              style={styles.modalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.modalHeaderContent}>
                <Ionicons name="create" size={24} color="#FFF" />
                <Text style={styles.modalTitle}>Edit Plant</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close-circle" size={28} color="#FFF" />
              </TouchableOpacity>
            </LinearGradient>
            
            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Ionicons name="leaf-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Plant Name"
                  value={editName}
                  onChangeText={setEditName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="heart-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Health (0-100)"
                  value={editHealth}
                  onChangeText={setEditHealth}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity onPress={pickImage} style={styles.modalImagePicker}>
                {editImageUri ? (
                  <Image source={{ uri: editImageUri }} style={styles.modalImage} />
                ) : (
                  <LinearGradient
                    colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
                    style={styles.modalImagePlaceholder}
                  >
                    <Ionicons name="camera" size={40} color="#667eea" />
                    <Text style={styles.modalImageText}>Change Image</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalSaveButton} 
                onPress={handleSaveEdit}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#00F260', '#0575E6']}
                  style={styles.modalSaveGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                  <Text style={styles.modalSaveText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    fontWeight: '500',
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantList: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 30,
  },
  plantCard: {
    flex: 1,
    margin: 8,
    maxWidth: (width - 62) / 2,
  },
  plantCardInner: {
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  plantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  healthBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  healthBadgeGradient: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  healthBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  plantContent: {
    padding: 14,
  },
  plantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  plantName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3436',
    flex: 1,
    marginRight: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  waterInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  waterIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(5, 117, 230, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  waterTextContainer: {
    flex: 1,
  },
  waterLabel: {
    fontSize: 11,
    color: '#636E72',
    fontWeight: '500',
    marginBottom: 2,
  },
  waterTime: {
    fontSize: 13,
    color: '#2D3436',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#EB3349',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  btnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    marginBottom: 30,
  },
  emptyIconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyAddButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  emptyAddGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyAddText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputIcon: {
    marginRight: 12,
  },
  modalInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
  },
  modalImagePicker: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  modalImageText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  modalSaveButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00F260',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  modalSaveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  modalSaveText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});