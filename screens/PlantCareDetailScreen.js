// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Animated,
//   Dimensions,
// } from 'react-native';
// import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// export default function PlantCareDetailScreen({ navigation, route }) {
//   const { id } = route.params || { id: 1 };
//   const [plant, setPlant] = useState(null);
//   const [guide, setGuide] = useState(null);
//   const [activeTab, setActiveTab] = useState('Overview');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sectionStates, setSectionStates] = useState({
//     overview: true,
//     careGuide: true,
//     environment: true,
//     growth: true,
//     propagation: true,
//   });
//   const fadeAnim = useState(new Animated.Value(0))[0];
//   const { width } = Dimensions.get('window');

//   const [overviewAnim] = useState(new Animated.Value(1));
//   const [careGuideAnim] = useState(new Animated.Value(1));
//   const [environmentAnim] = useState(new Animated.Value(1));
//   const [growthAnim] = useState(new Animated.Value(1));
//   const [propagationAnim] = useState(new Animated.Value(1));

//   const fetchData = async () => {
//     console.log('Fetching plant data for ID:', id);
//     try {
//       setLoading(true);
//       setError(null);

//       const plantResponse = await fetch(
//         `https://perenual.com/api/v2/species/details/${id}?key=sk-DF6767cca1847a9aa9028`
//       );
//       if (!plantResponse.ok) throw new Error(`Plant API failed: ${plantResponse.status}`);
//       const plantData = await plantResponse.json();
//       console.log('Full plant data:', plantData);
//       setPlant(plantData || {});

//       const guideResponse = await fetch(
//         `https://perenual.com/api/species-care-guide-list?key=sk-DF6767cca1847a9aa9028`
//       );
//       if (!guideResponse.ok) throw new Error(`Guide API failed: ${guideResponse.status}`);
//       const guideData = await guideResponse.json();
//       console.log('Guide data:', guideData);
//       const matchingGuide = guideData.data.find(g => g.species_id === id);
//       console.log('Matching guide:', matchingGuide);
//       setGuide(matchingGuide || null);
//     } catch (err) {
//       console.error('Fetch error:', err.message);
//       setError(`Failed to load: ${err.message}`);
//     } finally {
//       setLoading(false);
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }).start();
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [id]);

//   const toggleSection = (section) => {
//     setSectionStates(prev => {
//       const newState = { ...prev, [section]: !prev[section] };
//       const anim = {
//         overview: overviewAnim,
//         careGuide: careGuideAnim,
//         environment: environmentAnim,
//         growth: growthAnim,
//         propagation: propagationAnim,
//       }[section];
//       Animated.timing(anim, {
//         toValue: newState[section] ? 1 : 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//       return newState;
//     });
//   };

//   const renderImage = () => {
//     const imageUri = plant?.default_image?.original_url || plant?.default_image?.regular_url || 'https://via.placeholder.com/300';
//     return (
//       <Image
//         source={{ uri: imageUri }}
//         style={styles.image}
//         onError={(e) => console.log('Image error:', e.nativeEvent.error)}
//       />
//     );
//   };

//   const renderSection = (title, content, sectionKey, anim) => {
//     console.log(`renderSection called with content for ${sectionKey}:`, content);
//     if (typeof content === 'object' && !React.isValidElement(content)) {
//       console.error(`renderSection received an invalid object for section ${sectionKey}:`, content);
//       return (
//         <View style={styles.sectionContainer}>
//           <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(sectionKey)}>
//             <Text style={styles.sectionTitle}>{title}</Text>
//             <Ionicons name={sectionStates[sectionKey] ? 'chevron-up' : 'chevron-down'} size={20} color="#285430" />
//           </TouchableOpacity>
//           <Animated.View style={[styles.sectionContent, { opacity: anim, transform: [{ scaleY: anim }] }]}>
//             <Text style={styles.infoText}>Error: Unable to display this section.</Text>
//           </Animated.View>
//         </View>
//       );
//     }

//     return (
//       <View style={styles.sectionContainer}>
//         <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(sectionKey)}>
//           <Text style={styles.sectionTitle}>{title}</Text>
//           <Ionicons name={sectionStates[sectionKey] ? 'chevron-up' : 'chevron-down'} size={20} color="#285430" />
//         </TouchableOpacity>
//         <Animated.View style={[styles.sectionContent, { opacity: anim, transform: [{ scaleY: anim }] }]}>
//           {content}
//         </Animated.View>
//       </View>
//     );
//   };

//   const overviewContent = (
//     <View>
//       <Text style={styles.subtitle}>{plant?.scientific_name?.[0] || 'N/A'}</Text>
//       {Array.isArray(plant?.other_name) && plant.other_name.length > 0 && (
//         <Text style={styles.otherNames}>Also known as: {plant.other_name.join(', ')}</Text>
//       )}
//       {plant?.description && <Text style={styles.description}>{plant.description}</Text>}
//       <View style={styles.infoGrid}>
//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>Type:</Text>
//           <Text style={styles.infoText}>{plant?.type || 'N/A'}</Text>
//         </View>
//         {plant?.family && (
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Family:</Text>
//             <Text style={styles.infoText}>{plant.family || 'N/A'}</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   const careGuideContent = (
//     <View>
//       {guide?.section?.length ? (
//         guide.section.map((section, index) => (
//           <View key={index} style={styles.section}>
//             <Text style={styles.sectionTitle}>{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</Text>
//             <Text style={styles.infoText}>{section.description || 'No details'}</Text>
//           </View>
//         ))
//       ) : (
//         <Text style={styles.infoText}>No care guide available.</Text>
//       )}
//     </View>
//   );

//   const environmentContent = (
//     <View>
//       {plant?.watering && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Watering</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Frequency:</Text>
//             <Text style={styles.infoText}>{plant.watering || 'N/A'}</Text>
//           </View>
//         </View>
//       )}
//       {plant?.sunlight && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Sunlight</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Preference:</Text>
//             <Text style={styles.infoText}>{Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : plant.sunlight || 'N/A'}</Text>
//           </View>
//         </View>
//       )}
//       {plant?.soil && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Soil</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Type:</Text>
//             <Text style={styles.infoText}>{plant.soil || 'N/A'}</Text>
//           </View>
//         </View>
//       )}
//       {plant?.temperature && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Temperature</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Range:</Text>
//             <Text style={styles.infoText}>{plant.temperature.min}°C - {plant.temperature.max}°C</Text>
//           </View>
//         </View>
//       )}
//       {(!plant?.watering && !plant?.sunlight && !plant?.soil && !plant?.temperature) && (
//         <Text style={styles.infoText}>No environmental data available.</Text>
//       )}
//     </View>
//   );

//   const growthContent = (
//     <View>
//       {plant?.dimensions && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Dimensions</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Height:</Text>
//             <Text style={styles.infoText}>
//               {plant.dimensions.min_value} - {plant.dimensions.max_value} {plant.dimensions.unit}
//             </Text>
//           </View>
//         </View>
//       )}
//       {(plant?.growth_rate || plant?.care_level || plant?.maintenance) && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Growth</Text>
//           {plant.growth_rate && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Rate:</Text>
//               <Text style={styles.infoText}>{plant.growth_rate}</Text>
//             </View>
//           )}
//           {plant.care_level && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Level:</Text>
//               <Text style={styles.infoText}>{plant.care_level}</Text>
//             </View>
//           )}
//           {plant.maintenance && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Maintenance:</Text>
//               <Text style={styles.infoText}>{plant.maintenance}</Text>
//             </View>
//           )}
//         </View>
//       )}
//       {(!plant?.dimensions && !plant?.growth_rate && !plant?.care_level && !plant?.maintenance) && (
//         <Text style={styles.infoText}>No growth data available.</Text>
//       )}
//     </View>
//   );

//   const propagationContent = (
//     <View>
//       {plant?.propagation && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Propagation</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Method:</Text>
//             <Text style={styles.infoText}>{plant.propagation}</Text>
//           </View>
//         </View>
//       )}
//       {plant?.flowers && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Flowers</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Details:</Text>
//             <Text style={styles.infoText}>{plant.flowers}</Text>
//           </View>
//         </View>
//       )}
//       {plant?.fruit && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Fruits</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Details:</Text>
//             <Text style={styles.infoText}>{plant.fruit}</Text>
//           </View>
//         </View>
//       )}
//       {plant?.fertilizer && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Fertilizer</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Details:</Text>
//             <Text style={styles.infoText}>{plant.fertilizer}</Text>
//           </View>
//         </View>
//       )}
//       {plant?.pruning && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Pruning</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Details:</Text>
//             <Text style={styles.infoText}>{plant.pruning}</Text>
//           </View>
//         </View>
//       )}
//       {(!plant?.propagation && !plant?.flowers && !plant?.fruit && !plant?.fertilizer && !plant?.pruning) && (
//         <Text style={styles.infoText}>No propagation data available.</Text>
//       )}
//     </View>
//   );

//   return (
//     <LinearGradient colors={['#A8E6CF', '#DCF5DC']} style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#285430" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{plant?.common_name || 'Plant Details'}</Text>
//         <View style={styles.headerSpacer} />
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {renderImage()}
//         <View style={styles.tabBar}>
//           {['Overview', 'Care Guide', 'Environment', 'Growth', 'Propagation'].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               style={[styles.tab, activeTab === tab && styles.activeTab]}
//               onPress={() => setActiveTab(tab)}
//             >
//               <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         {activeTab === 'Overview' && renderSection('Overview', overviewContent, 'overview', overviewAnim)}
//         {activeTab === 'Care Guide' && renderSection('Care Guide', careGuideContent, 'careGuide', careGuideAnim)}
//         {activeTab === 'Environment' && renderSection('Environment', environmentContent, 'environment', environmentAnim)}
//         {activeTab === 'Growth' && renderSection('Growth', growthContent, 'growth', growthAnim)}
//         {activeTab === 'Propagation' && renderSection('Propagation', propagationContent, 'propagation', propagationAnim)}
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: Constants.statusBarHeight },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 20,
//     paddingHorizontal: 15,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   backButton: {
//     padding: 12,
//     backgroundColor: '#E8F5E9',
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   headerTitle: { flex: 1, fontSize: 26, fontWeight: '700', color: '#285430', textAlign: 'center' },
//   headerSpacer: { width: 40 },
//   content: { flex: 1, paddingHorizontal: 15 },
//   image: {
//     width: '100%',
//     height: 300,
//     borderRadius: 20,
//     marginBottom: 15,
//     resizeMode: 'cover',
//     shadowColor: '#000',
//     shadowOpacity: 0.25,
//     shadowRadius: 15,
//     elevation: 8,
//   },
//   tabBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: 'rgba(255, 255, 255, 0.85)',
//     paddingVertical: 12,
//     marginHorizontal: 20,
//     borderRadius: 30,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//     marginBottom: 20,
//   },
//   tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
//   activeTab: { backgroundColor: '#4CAF50', transform: [{ scale: 1.05 }] },
//   tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
//   activeTabText: { color: '#FFFFFF' },
//   sectionContainer: { marginBottom: 15 },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     backgroundColor: '#E8F5E9',
//     borderRadius: 15,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#285430',
//   },
//   sectionContent: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     padding: 15,
//     marginTop: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   section: { marginTop: 10 },
//   subtitle: { fontSize: 16, fontStyle: 'italic', color: '#666', textAlign: 'center', marginBottom: 15 },
//   otherNames: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 15 },
//   description: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 15,
//     padding: 15,
//     backgroundColor: '#F5F7F5',
//     borderRadius: 15,
//     textAlign: 'center',
//   },
//   infoGrid: { marginTop: 10 },
//   infoRow: { flexDirection: 'row', marginBottom: 10 },
//   infoLabel: { fontSize: 16, color: '#333', fontWeight: '500', width: 100 },
//   infoText: { fontSize: 16, color: '#666', flex: 1, flexWrap: 'wrap' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   loadingText: { fontSize: 18, color: '#285430', marginTop: 15, fontStyle: 'italic' },
//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 15 },
//   retryButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   retryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
// });









import React, { useState, useEffect, useRef } from 'react';
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

export default function PlantCareDetailScreen({ navigation, route }) {
  const { id } = route.params || { id: 1 };
  const [plant, setPlant] = useState(null);
  const [guide, setGuide] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview'); // Kept for tab styling, but not for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionStates, setSectionStates] = useState({
    overview: true,
    careGuide: true,
    environment: true,
    growth: true,
    propagation: true,
  });
  const [sectionPositions, setSectionPositions] = useState({});
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { width } = Dimensions.get('window');
  const scrollViewRef = useRef(null);

  const [overviewAnim] = useState(new Animated.Value(1));
  const [careGuideAnim] = useState(new Animated.Value(1));
  const [environmentAnim] = useState(new Animated.Value(1));
  const [growthAnim] = useState(new Animated.Value(1));
  const [propagationAnim] = useState(new Animated.Value(1));

  const fetchData = async () => {
    console.log('Fetching plant data for ID:', id);
    try {
      setLoading(true);
      setError(null);

      const plantResponse = await fetch(
        `https://perenual.com/api/v2/species/details/${id}?key=sk-DF6767cca1847a9aa9028`
      );
      if (!plantResponse.ok) throw new Error(`Plant API failed: ${plantResponse.status}`);
      const plantData = await plantResponse.json();
      console.log('Full plant data:', plantData);
      setPlant(plantData || {});

      const guideResponse = await fetch(
        `https://perenual.com/api/species-care-guide-list?key=sk-DF6767cca1847a9aa9028`
      );
      if (!guideResponse.ok) throw new Error(`Guide API failed: ${guideResponse.status}`);
      const guideData = await guideResponse.json();
      console.log('Guide data:', guideData);
      const matchingGuide = guideData.data.find(g => g.species_id === id);
      console.log('Matching guide:', matchingGuide);
      setGuide(matchingGuide || null);
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
      const anim = {
        overview: overviewAnim,
        careGuide: careGuideAnim,
        environment: environmentAnim,
        growth: growthAnim,
        propagation: propagationAnim,
      }[section];
      Animated.timing(anim, {
        toValue: newState[section] ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return newState;
    });
  };

  const handleLayout = (sectionKey, event) => {
    const { y } = event.nativeEvent.layout;
    setSectionPositions(prev => ({ ...prev, [sectionKey]: y }));
  };

  const renderImage = () => {
    const imageUri = plant?.default_image?.original_url || plant?.default_image?.regular_url || 'https://via.placeholder.com/300';
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
        <View style={styles.sectionContainer} onLayout={(event) => handleLayout(sectionKey, event)}>
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
      <View style={styles.sectionContainer} onLayout={(event) => handleLayout(sectionKey, event)}>
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

  const overviewContent = (
    <View>
      <Text style={styles.subtitle}>{plant?.scientific_name?.[0] || 'N/A'}</Text>
      {Array.isArray(plant?.other_name) && plant.other_name.length > 0 && (
        <Text style={styles.otherNames}>Also known as: {plant.other_name.join(', ')}</Text>
      )}
      {plant?.description && <Text style={styles.description}>{plant.description}</Text>}
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.infoText}>{plant?.type || 'N/A'}</Text>
        </View>
        {plant?.family && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Family:</Text>
            <Text style={styles.infoText}>{plant.family || 'N/A'}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const careGuideContent = (
    <View>
      {guide?.section?.length ? (
        guide.section.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</Text>
            <Text style={styles.infoText}>{section.description || 'No details'}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.infoText}>No care guide available.</Text>
      )}
    </View>
  );

  const environmentContent = (
    <View>
      {plant?.watering && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Watering</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Frequency:</Text>
            <Text style={styles.infoText}>{plant.watering || 'N/A'}</Text>
          </View>
        </View>
      )}
      {plant?.sunlight && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sunlight</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Preference:</Text>
            <Text style={styles.infoText}>{Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : plant.sunlight || 'N/A'}</Text>
          </View>
        </View>
      )}
      {plant?.soil && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soil</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoText}>{plant.soil || 'N/A'}</Text>
          </View>
        </View>
      )}
      {plant?.temperature && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temperature</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Range:</Text>
            <Text style={styles.infoText}>{plant.temperature.min}°C - {plant.temperature.max}°C</Text>
          </View>
        </View>
      )}
      {(!plant?.watering && !plant?.sunlight && !plant?.soil && !plant?.temperature) && (
        <Text style={styles.infoText}>No environmental data available.</Text>
      )}
    </View>
  );

  const growthContent = (
    <View>
      {plant?.dimensions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dimensions</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Height:</Text>
            <Text style={styles.infoText}>
              {plant.dimensions.min_value} - {plant.dimensions.max_value} {plant.dimensions.unit}
            </Text>
          </View>
        </View>
      )}
      {(plant?.growth_rate || plant?.care_level || plant?.maintenance) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth</Text>
          {plant.growth_rate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rate:</Text>
              <Text style={styles.infoText}>{plant.growth_rate}</Text>
            </View>
          )}
          {plant.care_level && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Level:</Text>
              <Text style={styles.infoText}>{plant.care_level}</Text>
            </View>
          )}
          {plant.maintenance && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Maintenance:</Text>
              <Text style={styles.infoText}>{plant.maintenance}</Text>
            </View>
          )}
        </View>
      )}
      {(!plant?.dimensions && !plant?.growth_rate && !plant?.care_level && !plant?.maintenance) && (
        <Text style={styles.infoText}>No growth data available.</Text>
      )}
    </View>
  );

  const propagationContent = (
    <View>
      {plant?.propagation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Propagation</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Method:</Text>
            <Text style={styles.infoText}>{plant.propagation}</Text>
          </View>
        </View>
      )}
      {plant?.flowers && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowers</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Details:</Text>
            <Text style={styles.infoText}>{plant.flowers}</Text>
          </View>
        </View>
      )}
      {plant?.fruit && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fruits</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Details:</Text>
            <Text style={styles.infoText}>{plant.fruit}</Text>
          </View>
        </View>
      )}
      {plant?.fertilizer && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fertilizer</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Details:</Text>
            <Text style={styles.infoText}>{plant.fertilizer}</Text>
          </View>
        </View>
      )}
      {plant?.pruning && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pruning</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Details:</Text>
            <Text style={styles.infoText}>{plant.pruning}</Text>
          </View>
        </View>
      )}
      {(!plant?.propagation && !plant?.flowers && !plant?.fruit && !plant?.fertilizer && !plant?.pruning) && (
        <Text style={styles.infoText}>No propagation data available.</Text>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#A8E6CF', '#DCF5DC']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#285430" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{plant?.common_name || 'Plant Details'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderImage()}
        <View style={styles.tabBar}>
          {['Overview', 'Care Guide', 'Environment', 'Growth', 'Propagation'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => {
                setActiveTab(tab);
                const sectionKey = tab.toLowerCase().replace(' ', '');
                if (scrollViewRef.current && sectionPositions[sectionKey]) {
                  scrollViewRef.current.scrollTo({ y: sectionPositions[sectionKey], animated: true });
                }
              }}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Render all sections unconditionally */}
        {renderSection('Overview', overviewContent, 'overview', overviewAnim)}
        {renderSection('Care Guide', careGuideContent, 'careGuide', careGuideAnim)}
        {renderSection('Environment', environmentContent, 'environment', environmentAnim)}
        {renderSection('Growth', growthContent, 'growth', growthAnim)}
        {renderSection('Propagation', propagationContent, 'propagation', propagationAnim)}
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
  headerTitle: { 
    flex: 1, 
    fontSize: 26, 
    fontWeight: '700', 
    color: '#285430', 
    textAlign: 'center' 
  },
  headerSpacer: { width: 40 },
  content: { 
    flex: 1, 
    paddingHorizontal: 15, 
    paddingBottom: 20, // Ensure padding at the bottom
  },
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  activeTab: { backgroundColor: '#4CAF50', transform: [{ scale: 1.05 }] },
  tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
  activeTabText: { color: '#FFFFFF' },
  sectionContainer: { 
    marginBottom: 15,
    overflow: 'hidden', // Prevent content overflow
  },
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
    // Ensure content wraps and doesn't overflow
    flex: 1,
    minHeight: 50, // Minimum height to ensure visibility
  },
  section: { marginTop: 10 },
  subtitle: { 
    fontSize: 16, 
    fontStyle: 'italic', 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 15 
  },
  otherNames: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 15 
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F5F7F5',
    borderRadius: 15,
    textAlign: 'center',
  },
  infoGrid: { marginTop: 10 },
  infoRow: { flexDirection: 'row', marginBottom: 10 },
  infoLabel: { 
    fontSize: 16, 
    color: '#333', 
    fontWeight: '500', 
    width: 100 
  },
  infoText: { 
    fontSize: 16, 
    color: '#666', 
    flex: 1, 
    flexWrap: 'wrap' 
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { 
    fontSize: 18, 
    color: '#285430', 
    marginTop: 15, 
    fontStyle: 'italic' 
  },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { 
    fontSize: 16, 
    color: '#D32F2F', 
    textAlign: 'center', 
    marginBottom: 15 
  },
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