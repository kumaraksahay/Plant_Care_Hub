import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
  SafeAreaView,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';

const { width, height } = Dimensions.get('window');

export default function FindPlantScreen({ navigation }) {
  const [plantImage, setPlantImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPlantImage(null);
      setIsScanning(false);
      setScanComplete(false);
      setDownloadProgress(0);
      setIsCameraOpen(false);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        await tf.ready();
        await requestCameraPermission();
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
        ]).start();
        startPulseAnimation();
        startFloatAnimation();
        startGlowAnimation();
        await loadModel();
      } catch (error) {
        Alert.alert('Initialization Error', `Failed to initialize: ${error.message}`);
      }
    })();
  }, [requestCameraPermission]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  };

  const startFloatAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  };

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    ).start();
  };

  const startRotateAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  };

  const checkPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Media library access is needed. Please enable it in settings.',
        [{ text: 'Open Settings', onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() }]
      );
      return false;
    }
    return true;
  };

  const loadModel = async () => {
    try {
      const modelJson = require('./assets/model/model.json');
      const modelWeights = require('./assets/model/weights.bin');
      const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      setModel(loadedModel);
    } catch (error) {
      Alert.alert('Model Error', `Failed to load model: ${error.message}`);
    } finally {
      setModelLoading(false);
    }
  };

  const identifyPlant = async (uri) => {
    if (!model) await loadModel();
    if (modelLoading) {
      Alert.alert('Please Wait', 'Model is still loading.');
      return null;
    }

    let imageTensor, rgbTensor, resizedTensor, normalizedTensor, expandedTensor, prediction;
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists || fileInfo.size > 10 * 1024 * 1024) {
        Alert.alert('Error', 'Invalid or oversized image.');
        return null;
      }

      const imageData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const imageBuffer = Buffer.from(imageData, 'base64');
      const rawImageData = jpeg.decode(imageBuffer, { useTArray: true });

      if (rawImageData.width < 50 || rawImageData.height < 50) {
        Alert.alert('Error', 'Image is too small.');
        return null;
      }

      imageTensor = tf.tensor(rawImageData.data, [rawImageData.height, rawImageData.width, 4]);
      rgbTensor = imageTensor.slice([0, 0, 0], [rawImageData.height, rawImageData.width, 3]);
      resizedTensor = tf.image.resizeBilinear(rgbTensor, [224, 224]);
      normalizedTensor = tf.div(resizedTensor, tf.scalar(255.0));
      expandedTensor = normalizedTensor.expandDims(0);

      prediction = model.predict(expandedTensor);
      const probabilities = prediction.dataSync();
      const predictedClassIndex = prediction.argMax(-1).dataSync()[0];
      const speciesNames = [
        'Blue spruce sedum',
        'Sword fern',
        'Flamingo flower',
        'Hollyhock',
        'Marigold',
        'Noble dendrobium',
        'Radiator plant',
        'Raindrop peperomia',
        'Spanish lavender',
        'White velvet',
        'Zebra plant',
        'Not a Plant',
      ];
      const predictedSpecies = speciesNames[predictedClassIndex];
      const confidence = (probabilities[predictedClassIndex] * 100).toFixed(2);

      return predictedSpecies === 'Not a Plant'
        ? `This does not appear to be a plant. (Confidence: ${confidence}%)`
        : `Identified: ${predictedSpecies} (Confidence: ${confidence}%)`;
    } catch (error) {
      Alert.alert('Identification Error', `Failed to identify plant: ${error.message}`);
      return null;
    } finally {
      if (imageTensor) tf.dispose([imageTensor, rgbTensor, resizedTensor, normalizedTensor, expandedTensor, prediction]);
    }
  };

  const startScanAnimation = async (uri, isCamera) => {
    setIsScanning(true);
    setScanComplete(false);
    setDownloadProgress(0);

    scanLineAnim.setValue(0);
    progressAnim.setValue(0);
    startRotateAnimation();

    Animated.sequence([
      Animated.timing(scanLineAnim, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(progressAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
    ]).start(async () => {
      const result = await identifyPlant(uri);
      setIsScanning(false);
      setScanComplete(true);
      rotateAnim.stopAnimation();

      if (result) {
        setTimeout(() => {
          navigation.navigate('ResultScreen', { imageUri: uri, result });
        }, 1000);
      } else {
        setPlantImage(null);
        setScanComplete(false);
      }
    });

    const progressInterval = setInterval(() => {
      setDownloadProgress((prev) => (prev >= 100 ? (clearInterval(progressInterval), 100) : prev + 2));
    }, 100);
  };

  const captureImage = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
        return;
      }
    }
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        const resizedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 224, height: 224 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        const cacheUri = `${FileSystem.cacheDirectory}plant_${Date.now()}.jpg`;
        await FileSystem.copyAsync({ from: resizedPhoto.uri, to: cacheUri });
        setPlantImage(cacheUri);
        setIsCameraOpen(false);
        startScanAnimation(cacheUri, true);
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      }
    }
  };

  const handleImageSelection = async (type) => {
    if (type === 'camera') {
      if (!cameraPermission?.granted) {
        const permission = await requestCameraPermission();
        if (!permission.granted) {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
          return;
        }
      }
      setIsCameraOpen(true);
    } else {
      const granted = await checkPermissions();
      if (!granted) return;
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled) {
          const selectedImage = result.assets[0].uri;
          setPlantImage(selectedImage);
          startScanAnimation(selectedImage, false);
        }
      } catch (error) {
        Alert.alert('Image Error', `Failed to pick image: ${error.message}`);
      }
    }
  };

  const scanLineTransform = scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, width * 0.8] });
  const rotateInterpolate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const floatTransform = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] });
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  if (!cameraPermission) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.loadingGradient}>
          <MaterialCommunityIcons name="leaf-circle" size={60} color="#FFFFFF" />
          <Text style={styles.loadingText}>Initializing PlantScan AI...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.loadingGradient}>
          <MaterialCommunityIcons name="camera-off" size={60} color="#FFFFFF" />
          <Text style={styles.loadingText}>Camera access required</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
            <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.permissionButtonGradient}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  if (isCameraOpen) {
    return (
      <View style={styles.fullScreenCamera}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef} autofocus="on">
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.cameraOverlay}
          >
            <View style={styles.cameraHeader}>
              <TouchableOpacity onPress={() => setIsCameraOpen(false)} style={styles.cameraCloseButton}>
                <View style={styles.glassmorphicButton}>
                  <MaterialCommunityIcons name="close" size={28} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Position Plant in Frame</Text>
            </View>

            <View style={styles.cameraCenterGuide}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity onPress={captureImage} style={styles.captureButtonContainer}>
                <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.captureButton}>
                  <View style={styles.captureButtonInner}>
                    <MaterialCommunityIcons name="camera" size={40} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </CameraView>
      </View>
    );
  }

  const renderInfoModal = () => {
    return (
      <Modal animationType="fade" transparent={true} visible={infoModalVisible} onRequestClose={() => setInfoModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalHeader}>
              <MaterialCommunityIcons name="lightbulb-on" size={28} color="#FFFFFF" />
              <Text style={styles.modalTitle}>Photography Tips</Text>
              <TouchableOpacity onPress={() => setInfoModalVisible(false)} style={styles.modalCloseButton}>
                <MaterialCommunityIcons name="close-circle" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.tipSection}>
                <View style={styles.tipCard}>
                  <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.tipIconContainer}>
                    <MaterialCommunityIcons name="white-balance-sunny" size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.tipCardTitle}>Natural Lighting</Text>
                  <Text style={styles.tipCardDescription}>
                    Use bright, natural light without harsh shadows. Early morning or late afternoon works best.
                  </Text>
                </View>

                <View style={styles.tipCard}>
                  <LinearGradient colors={['#fa709a', '#fee140']} style={styles.tipIconContainer}>
                    <MaterialCommunityIcons name="camera-iris" size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.tipCardTitle}>Clear Focus</Text>
                  <Text style={styles.tipCardDescription}>
                    Ensure the plant is in sharp focus. Tap on your screen to adjust focus if needed.
                  </Text>
                </View>

                <View style={styles.tipCard}>
                  <LinearGradient colors={['#30cfd0', '#330867']} style={styles.tipIconContainer}>
                    <MaterialCommunityIcons name="image-filter-center-focus" size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.tipCardTitle}>Fill the Frame</Text>
                  <Text style={styles.tipCardDescription}>
                    Get close enough so the plant fills most of the frame for better identification accuracy.
                  </Text>
                </View>

                <View style={styles.tipCard}>
                  <LinearGradient colors={['#a8edea', '#fed6e3']} style={styles.tipIconContainer}>
                    <MaterialCommunityIcons name="leaf" size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.tipCardTitle}>Show Key Features</Text>
                  <Text style={styles.tipCardDescription}>
                    Capture leaves, flowers, or distinctive characteristics that help identify the species.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseButtonBottom} onPress={() => setInfoModalVisible(false)}>
              <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.modalCloseButtonGradient}>
                <Text style={styles.modalCloseButtonText}>Got it!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {renderInfoModal()}
      
      <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.backgroundGradient}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Premium Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerButton} onPress={() => navigation.replace('DashboardScreen')}>
                <View style={styles.glassmorphicButton}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <Animated.View style={{ transform: [{ translateY: floatTransform }] }}>
                  <MaterialCommunityIcons name="leaf-circle" size={40} color="#FFFFFF" />
                </Animated.View>
                <Text style={styles.headerTitle}>PlantScan AI</Text>
                <Text style={styles.headerSubtitle}>Powered by Neural Networks</Text>
              </View>

              <TouchableOpacity style={styles.headerButton} onPress={() => setInfoModalVisible(true)}>
                <View style={styles.glassmorphicButton}>
                  <MaterialCommunityIcons name="information" size={24} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Main Scan Area */}
            <Animated.View style={[styles.scanAreaContainer, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.scanAreaWrapper}>
                <Animated.View style={[styles.glowEffect, { opacity: glowOpacity }]} />
                
                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={isScanning || scanComplete || modelLoading}
                  onPress={() => handleImageSelection('camera')}
                  style={styles.scanArea}
                >
                  {plantImage ? (
                    <View style={styles.imagePreview}>
                      <Image source={{ uri: plantImage }} style={styles.previewImage} />
                      {isScanning && (
                        <>
                          <View style={styles.scanningOverlay}>
                            <LinearGradient
                              colors={['transparent', 'rgba(102, 126, 234, 0.3)', 'transparent']}
                              style={styles.scanningGradient}
                            />
                          </View>
                          <Animated.View style={[styles.scanBeam, { transform: [{ translateY: scanLineTransform }] }]} />
                          <View style={styles.scanningBadge}>
                            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                              <MaterialCommunityIcons name="radar" size={20} color="#FFFFFF" />
                            </Animated.View>
                            <Text style={styles.scanningBadgeText}>ANALYZING</Text>
                          </View>
                        </>
                      )}
                      {scanComplete && (
                        <View style={styles.successOverlay}>
                          <LinearGradient colors={['rgba(76, 175, 80, 0.95)', 'rgba(56, 142, 60, 0.95)']} style={styles.successGradient}>
                            <MaterialCommunityIcons name="check-circle" size={80} color="#FFFFFF" />
                            <Text style={styles.successText}>Scan Complete!</Text>
                          </LinearGradient>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.emptyState}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                        style={styles.emptyStateGradient}
                      >
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                          <MaterialCommunityIcons name="camera-plus" size={80} color="#FFFFFF" />
                        </Animated.View>
                        <Text style={styles.emptyStateTitle}>Scan Your Plant</Text>
                        <Text style={styles.emptyStateSubtitle}>Tap to capture or upload a photo</Text>
                      </LinearGradient>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Progress Indicator */}
            {(isScanning || scanComplete || modelLoading) && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    <MaterialCommunityIcons name={modelLoading ? 'cog' : 'brain'} size={24} color="#FFFFFF" />
                  </Animated.View>
                  <Text style={styles.progressTitle}>
                    {modelLoading ? 'Loading AI Model...' : scanComplete ? 'Analysis Complete' : `Processing ${downloadProgress}%`}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  >
                    <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.progressBarGradient} />
                  </Animated.View>
                </View>
                {!scanComplete && !modelLoading && (
                  <Text style={styles.progressSubtext}>Neural network identifying species...</Text>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.primaryButton, (isScanning || scanComplete || modelLoading) && styles.buttonDisabled]}
                onPress={() => handleImageSelection('gallery')}
                disabled={isScanning || scanComplete || modelLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={(isScanning || scanComplete || modelLoading) ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] : ['#f093fb', '#f5576c']}
                  style={styles.primaryButtonGradient}
                >
                  <MaterialCommunityIcons name="image-plus" size={24} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>
                    {(isScanning || scanComplete || modelLoading) ? 'Processing...' : 'Upload from Gallery'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Feature Cards */}
            {!(isScanning || scanComplete || modelLoading || plantImage) && (
              <View style={styles.featuresGrid}>
                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.featureIconGradient}>
                      <MaterialCommunityIcons name="shield-check" size={28} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.featureTitle}>99.9% Accuracy</Text>
                  <Text style={styles.featureDescription}>Advanced AI recognition</Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <LinearGradient colors={['#fa709a', '#fee140']} style={styles.featureIconGradient}>
                      <MaterialCommunityIcons name="lightning-bolt" size={28} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.featureTitle}>Instant Results</Text>
                  <Text style={styles.featureDescription}>Identify in seconds</Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <LinearGradient colors={['#30cfd0', '#330867']} style={styles.featureIconGradient}>
                      <MaterialCommunityIcons name="database" size={28} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.featureTitle}>10,000+ Species</Text>
                  <Text style={styles.featureDescription}>Comprehensive database</Text>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerButton: {
    width: 48,
    height: 48,
  },
  glassmorphicButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  scanAreaContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  scanAreaWrapper: {
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 40,
    backgroundColor: '#f5576c',
    shadowColor: '#f5576c',
    shadowOffset: { width: 0, height:10 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  scanArea: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanningGradient: {
    width: '100%',
    height: '100%',
  },
  scanBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#f5576c',
    shadowColor: '#f5576c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  scanningBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  scanningBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  successGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyState: {
    width: '100%',
    height: '100%',
  },
  emptyStateGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptyStateSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
  },
  progressSection: {
    marginHorizontal: 30,
    marginTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressBarGradient: {
    height: '100%',
    width: '100%',
  },
  progressSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  actionButtons: {
    paddingHorizontal: 30,
    marginTop: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: (width - 60) / 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIconContainer: {
    marginBottom: 12,
  },
  featureIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    textAlign: 'center',
  },
  fullScreenCamera: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cameraCloseButton: {
    marginRight: 16,
  },
  cameraTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  cameraCenterGuide: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: width * 0.7,
    height: width * 0.7,
    marginLeft: -(width * 0.35),
    marginTop: -(width * 0.35),
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#f5576c',
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#f5576c',
    borderTopRightRadius: 8,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#f5576c',
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#f5576c',
    borderBottomRightRadius: 8,
  },
  cameraControls: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  captureButtonContainer: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  captureButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  permissionButton: {
    marginTop: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  permissionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    maxHeight: height * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  modalCloseButton: {
    position: 'absolute',
    right: 20,
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },
  tipSection: {
    paddingVertical: 20,
  },
  tipCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  tipIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  tipCardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalCloseButtonBottom: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalCloseButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});