import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CareGuideScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Plants');
  const [plants, setPlants] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { width } = Dimensions.get('window');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const plantResponse = await fetch('https://perenual.com/api/v2/species-list?key=sk-DF6767cca1847a9aa9028');
      if (!plantResponse.ok) throw new Error(`Plant API failed: ${plantResponse.status}`);
      const plantData = await plantResponse.json();
      console.log('Plants data:', plantData.data); // Debug log
      setPlants(plantData.data || []);

      const diseaseResponse = await fetch('https://perenual.com/api/pest-disease-list?key=sk-DF6767cca1847a9aa9028');
      if (!diseaseResponse.ok) throw new Error(`Disease API failed: ${diseaseResponse.status}`);
      const diseaseData = await diseaseResponse.json();
      console.log('Diseases data:', diseaseData.data); // Debug log
      setDiseases(diseaseData.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to load: ${err.message}`);
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item, index }) => {
    const isPlant = activeTab === 'Plants';
    const imageUri = isPlant
      ? item.default_image?.thumbnail || item.default_image?.medium_url || 'https://via.placeholder.com/150'
      : item.images?.[0]?.thumbnail || item.images?.[0]?.medium_url || 'https://via.placeholder.com/150';
    const title = item.common_name || 'Unnamed';
    const subtitle = isPlant ? item.type || 'N/A' : (item.host?.join(', ') || 'N/A');

    return (
      <Animated.View style={[styles.cardContainer, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            console.log(`Navigating to ${isPlant ? 'PlantCareDetailScreen' : 'DiseaseDetailScreen'} with id:`, item.id);
            navigation.navigate(isPlant ? 'PlantCareDetailScreen' : 'DiseaseDetailScreen', { id: item.id });
          }}
          activeOpacity={0.8}
        >
          <Image source={{ uri: imageUri }} style={styles.cardImage} onError={(e) => console.log('Image error:', e.nativeEvent.error)} />
          <LinearGradient colors={['rgba(40, 84, 48, 0.7)', 'transparent']} style={styles.cardOverlay}>
            <View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name={isPlant ? 'leaf' : 'bug'} size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const data = activeTab === 'Plants' ? plants : diseases;

  if (loading) {
    return (
      <LinearGradient colors={['#A8E6CF', '#DCF5DC']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#285430" />
        <Text style={styles.loadingText}>Fetching your green companions...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#A8E6CF', '#DCF5DC']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#285430" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Care Guide</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabBar}>
        {['Plants', 'Diseases'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchData()}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No {activeTab.toLowerCase()} found.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.content}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={5}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Constants.statusBarHeight },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: { flex: 1, fontSize: 26, fontWeight: '700', color: '#285430', textAlign: 'center' },
  headerSpacer: { width: 40 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 20,
  },
  tab: { paddingVertical: 8, paddingHorizontal: 25, borderRadius: 20 },
  activeTab: { backgroundColor: '#4CAF50', transform: [{ scale: 1.05 }] },
  tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
  activeTabText: { color: '#FFFFFF' },
  content: { paddingHorizontal: 10, paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-evenly', marginVertical: 5 },
  cardContainer: { flex: 1, margin: 5 },
  card: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowRadius: 2 },
  cardSubtitle: { fontSize: 12, color: '#FFFFFF', opacity: 0.9, textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowRadius: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#285430', marginTop: 15, fontStyle: 'italic' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 15 },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  retryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});