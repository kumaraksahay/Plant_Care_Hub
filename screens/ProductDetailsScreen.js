import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

export default function PlantCareDetailScreen({ navigation, route }) {
  const { plantId } = route.params || { plantId: 1 };
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://perenual.com/api/v2/species/details/${plantId}?key=sk-eGcp67cc742f773a59025`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch plant details');
        }
        const data = await response.json();
        console.log('Plant Details Response:', data);
        setPlant(data || {});
      } catch (err) {
        console.error('Error fetching plant details:', err);
        setError('Unable to load plant details. Please try again.');
        setPlant({});
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [plantId]);

  useEffect(() => {
    if (!loading && plant) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, plant]);

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    fetchPlantDetails();
  };

  if (loading) {
    return (
      <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading plant care details...</Text>
      </LinearGradient>
    );
  }

  if (error || !plant) {
    return (
      <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1B5E20" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Care Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'No plant data available.'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#D4E7D5', '#F1F8E9']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{plant.common_name || 'Plant Care Details'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image
            source={{ uri: plant.default_image?.original_url || plant.default_image?.regular_url || 'https://via.placeholder.com/300' }}
            style={styles.plantImage}
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.scientificName}>
              {plant.scientific_name?.[0] ? `(${plant.scientific_name[0]})` : ''}
            </Text>
            {plant.other_name && plant.other_name.length > 0 && (
              <Text style={styles.otherNames}>
                Also known as: {plant.other_name.join(', ')}
              </Text>
            )}
            {plant.description && (
              <Text style={styles.description}>{plant.description}</Text>
            )}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type:</Text>
                <Text style={styles.infoText}>{plant.type || 'N/A'}</Text>
              </View>
              {plant.dimensions && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Dimensions:</Text>
                  <Text style={styles.infoText}>
                    {plant.dimensions.min_value} - {plant.dimensions.max_value} {plant.dimensions.unit}
                  </Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cycle:</Text>
                <Text style={styles.infoText}>{plant.cycle || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Care Level:</Text>
                <Text style={styles.infoText}>{plant.care_level || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Growth Rate:</Text>
                <Text style={styles.infoText}>{plant.growth_rate || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Maintenance:</Text>
                <Text style={styles.infoText}>{plant.maintenance || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Drought Tolerant:</Text>
                <Text style={styles.infoText}>{plant.drought_tolerant ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Indoor:</Text>
                <Text style={styles.infoText}>{plant.indoor ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Flowering:</Text>
                <Text style={styles.infoText}>{plant.flowers ? 'Yes' : 'No'}</Text>
              </View>
              {plant.hardiness && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Hardiness Zone:</Text>
                  <Text style={styles.infoText}>{plant.hardiness.min} - {plant.hardiness.max}</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Care Instructions</Text>
              <View style={styles.careItem}>
                <Ionicons name="water-outline" size={20} color="#4CAF50" />
                <Text style={styles.careText}>
                  Watering: {plant.watering || 'N/A'} ({plant.watering_general_benchmark?.value} {plant.watering_general_benchmark?.unit})
                </Text>
              </View>
              <View style={styles.careItem}>
                <Ionicons name="sunny-outline" size={20} color="#4CAF50" />
                <Text style={styles.careText}>
                  Sunlight: {plant.sunlight?.join(', ') || 'N/A'}
                </Text>
              </View>
              {plant.plant_anatomy && plant.plant_anatomy.length > 0 && (
                <View style={styles.careItem}>
                  <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
                  <Text style={styles.careText}>
                    Anatomy: {plant.plant_anatomy.map(p => `${p.part}: ${p.color.join(', ')}`).join('; ')}
                  </Text>
                </View>
              )}
              {plant.pruning_month && (
                <View style={styles.careItem}>
                  <Ionicons name="pricetag-outline" size={20} color="#4CAF50" />
                  <Text style={styles.careText}>
                    Pruning: {plant.pruning_count?.amount} {plant.pruning_count?.interval} ({plant.pruning_month.join(', ')})
                  </Text>
                </View>
              )}
              <View style={styles.careItem}>
                <Ionicons name="share-outline" size={20} color="#4CAF50" />
                <Text style={styles.careText}>
                  Propagation: {plant.propagation?.join(', ') || 'N/A'}
                </Text>
              </View>
              {plant.attracts && plant.attracts.length > 0 && (
                <View style={styles.careItem}>
                  <Ionicons name="heart-outline" size={20} color="#4CAF50" />
                  <Text style={styles.careText}>
                    Attracts: {plant.attracts.join(', ')}
                  </Text>
                </View>
              )}
            </View>

            {(plant.pest_susceptibility || plant.cones || plant.fruits || plant.leaf) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Additional Details</Text>
                {plant.pest_susceptibility && (
                  <View style={styles.careItem}>
                    <Ionicons name="bug-outline" size={20} color="#4CAF50" />
                    <Text style={styles.careText}>
                      Pest Susceptibility: {plant.pest_susceptibility || 'N/A'}
                    </Text>
                  </View>
                )}
                <View style={styles.careItem}>
                  <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
                  <Text style={styles.careText}>
                    Cones: {plant.cones ? 'Yes' : 'No'}
                  </Text>
                </View>
                <View style={styles.careItem}>
                  <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
                  <Text style={styles.careText}>
                    Fruits: {plant.fruits ? 'Yes' : 'No'} (Edible: {plant.edible_fruit ? 'Yes' : 'No'})
                  </Text>
                </View>
                <View style={styles.careItem}>
                  <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
                  <Text style={styles.careText}>
                    Leaf: {plant.leaf ? 'Yes' : 'No'} (Edible: {plant.edible_leaf ? 'Yes' : 'No'})
                  </Text>
                </View>
                {plant.flowering_season && (
                  <View style={styles.careItem}>
                    <Ionicons name="flower-outline" size={20} color="#4CAF50" />
                    <Text style={styles.careText}>
                      Flowering Season: {plant.flowering_season}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <Text style={styles.tipText}>
              Tip: Regularly check your plant for signs of pests or overwatering to keep it thriving!
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
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
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  plantImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  otherNames: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F5F7F5',
    borderRadius: 10,
    padding: 10,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F5F7F5',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#1B5E20',
    fontWeight: '500',
    width: 100,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  careItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  careText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});