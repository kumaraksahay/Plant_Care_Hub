import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ResultScreen({ navigation, route }) {
  const { imageUri, result } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient
        colors={['#F5F7FF', '#E0E7FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.replace('SkinDiseaseScreen')}
            >
              <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                style={styles.backButtonGradient}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.title}>Analysis Result</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.imageContainerWrapper}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
              </View>
            </View>

            <View style={styles.resultContainer}>
              <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                style={styles.resultHeaderGradient}
              >
                <Text style={styles.resultHeader}>Skin Analysis Outcome</Text>
              </LinearGradient>
              <View style={styles.resultContent}>
                <MaterialCommunityIcons name="stethoscope" size={32} color="#4F46E5" style={styles.resultIcon} />
                <Text style={styles.resultText}>{result}</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Next Steps</Text>
              <Text style={styles.infoText}>
                • Consult a dermatologist for professional advice{'\n'}
                • Monitor the affected area for changes{'\n'}
                • Avoid self-diagnosis and seek medical guidance{'\n'}
                • Upload another image for further analysis
              </Text>
            </View>

            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={() => navigation.replace('SkinDiseaseScreen')}
            >
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.buttonGradient}
              >
                <MaterialCommunityIcons name="camera" size={24} color="#FFFFFF" style={styles.scanIcon} />
                <Text style={styles.scanText}>Scan Another Image</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  backButton: {
    borderRadius: 14,
    overflow: 'hidden',
    width: 48,
    height: 48,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  placeholder: {
    width: 48,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  imageContainerWrapper: {
    borderRadius: 24,
    marginVertical: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  imageContainer: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  resultContainer: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  resultHeaderGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  resultHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  resultContent: {
    padding: 16,
    alignItems: 'center',
  },
  resultIcon: {
    marginBottom: 12,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  infoContainer: {
    width: width * 0.9,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  infoText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  scanAgainButton: {
    width: width * 0.9,
    height: 60,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scanIcon: {
    marginRight: 12,
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});