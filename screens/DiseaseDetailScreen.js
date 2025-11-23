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
  Dimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DiseaseDetailScreen({ navigation, route }) {
  const { id } = route.params || { id: 2 };
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionStates, setSectionStates] = useState({
    basicInfo: true,
    solution: true,
    host: true,
  });
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { width } = Dimensions.get('window');

  const [basicInfoAnim] = useState(new Animated.Value(1));
  const [solutionAnim] = useState(new Animated.Value(1));
  const [hostAnim] = useState(new Animated.Value(1));

  const fetchData = async () => {
    console.log('Fetching disease data for ID:', id);
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://perenual.com/api/pest-disease-list?key=sk-DF6767cca1847a9aa9028`
      );
      if (!response.ok) throw new Error(`Disease API failed: ${response.status}`);
      const data = await response.json();
      console.log('Full disease data:', data);
      const matchingDisease = data.data.find(d => String(d.id) === String(id));
      if (!matchingDisease) {
        console.warn(`No matching disease found for ID: ${id}, data length: ${data.data.length}`);
        throw new Error(`No disease found with ID: ${id}`);
      }
      console.log('Matching disease:', matchingDisease);
      setDisease(matchingDisease);
    } catch (err) {
      console.error('Fetch error:', err.message);
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
  }, [id]);

  const toggleSection = (section) => {
    setSectionStates(prev => {
      const newState = { ...prev, [section]: !prev[section] };
      const anim = { basicInfo: basicInfoAnim, solution: solutionAnim, host: hostAnim }[section];
      Animated.timing(anim, {
        toValue: newState[section] ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return newState;
    });
  };

  const renderImage = () => {
    const imageUri = disease?.images?.[0]?.original_url || disease?.images?.[0]?.regular_url || 'https://via.placeholder.com/300';
    return (
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        onError={(e) => console.log('Image error:', e.nativeEvent.error)}
      />
    );
  };

  const renderSection = (title, content, sectionKey, anim) => {
    console.log(`renderSection called with content for ${sectionKey}:`, content);
    if (typeof content === 'object' && !React.isValidElement(content)) {
      console.error(`renderSection received an invalid object for section ${sectionKey}:`, content);
      return (
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(sectionKey)}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Ionicons name={sectionStates[sectionKey] ? 'chevron-up' : 'chevron-down'} size={20} color="#285430" />
          </TouchableOpacity>
          <Animated.View style={[styles.sectionContent, { opacity: anim, transform: [{ scaleY: anim }] }]}>
            <Text style={styles.infoText}>Error: Unable to display this section.</Text>
          </Animated.View>
        </View>
      );
    }

    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(sectionKey)}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Ionicons name={sectionStates[sectionKey] ? 'chevron-up' : 'chevron-down'} size={20} color="#285430" />
        </TouchableOpacity>
        <Animated.View style={[styles.sectionContent, { opacity: anim, transform: [{ scaleY: anim }] }]}>
          {content}
        </Animated.View>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#A8E6CF', '#DCF5DC']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#285430" />
        <Text style={styles.loadingText}>Diagnosing issues...</Text>
      </LinearGradient>
    );
  }

  if (error || !disease) {
    return (
      <LinearGradient colors={['#A8E6CF', '#DCF5DC']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#285430" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Disease Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'No data available.'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchData()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const renderDescriptionSection = () => {
    return (
      <View>
        {disease && disease.scientific_name && <Text style={styles.subtitle}>{disease.scientific_name}</Text>}
        {Array.isArray(disease.other_name) && disease.other_name.length > 0 && (
          <Text style={styles.otherNames}>Also known as: {disease.other_name.join(', ')}</Text>
        )}
        {Array.isArray(disease.description) ? (
          disease.description.map((desc, index) => (
            <View key={index}>
              {desc.subtitle && <Text style={styles.subtitle}>{desc.subtitle}</Text>}
              {desc.description && <Text style={styles.description}>{desc.description}</Text>}
            </View>
          ))
        ) : (
          disease.description && <Text style={styles.description}>{disease.description}</Text>
        )}
      </View>
    );
  };

  const renderSolutionSection = () => {
    return (
      <View>
        {Array.isArray(disease.solution) ? (
          disease.solution.map((sol, index) => (
            <View key={index}>
              {sol.subtitle && <Text style={styles.subtitle}>{sol.subtitle}</Text>}
              {sol.description && <Text style={styles.infoText}>{sol.description}</Text>}
            </View>
          ))
        ) : (
          disease.solution && <Text style={styles.infoText}>{disease.solution}</Text>
        )}
      </View>
    );
  };

  const renderHostSection = () => {
    return Array.isArray(disease.host) ? (
      <Text style={styles.infoText}>{disease.host.join(', ')}</Text>
    ) : (
      disease.host && <Text style={styles.infoText}>{disease.host}</Text>
    );
  };

  return (
    <LinearGradient colors={['#A8E6CF', '#DCF5DC']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#285430" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{disease.common_name || 'Disease Details'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {renderImage()}
          <View style={styles.detailsCard}>
            {renderSection('Basic Information', renderDescriptionSection(), 'basicInfo', basicInfoAnim)}
            {disease.solution && renderSection('Solution', renderSolutionSection(), 'solution', solutionAnim)}
            {Array.isArray(disease.host) && disease.host.length > 0 && renderSection('Host Plants', renderHostSection(), 'host', hostAnim)}
          </View>
        </Animated.View>
      </ScrollView>
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
  content: { flex: 1, paddingHorizontal: 15, paddingTop: 15 },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    marginBottom: 15,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },
  sectionContainer: { marginBottom: 15 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#285430',
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginTop: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoText: { fontSize: 16, color: '#666' },
  subtitle: { fontSize: 16, fontStyle: 'italic', color: '#666', textAlign: 'center', marginBottom: 15 },
  otherNames: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 15 },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F5F7F5',
    borderRadius: 15,
    textAlign: 'center',
  },
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