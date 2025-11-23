import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import debounce from 'lodash.debounce';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('Plant Lover');
  const [userAvatar, setUserAvatar] = useState(require('./assets/profile-avatar.png'));
  const [reminderCount, setReminderCount] = useState(0);
  const [nextReminder, setNextReminder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [plantTips, setPlantTips] = useState(null);
  const [weather, setWeather] = useState({
    temp: 'N/A',
    condition: 'Unknown',
    humidity: 'N/A',
    city: 'Loading...',
    icon: 'weather-sunny'
  });
  const [plantHealth, setPlantHealth] = useState(0);
  const [recentPlants, setRecentPlants] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const weatherIcons = useMemo(() => ({
    'Clear': 'weather-sunny',
    'Clouds': 'weather-cloudy',
    'Rain': 'weather-rainy',
    'Thunderstorm': 'weather-lightning',
    'Snow': 'weather-snowy',
    'Mist': 'weather-fog',
    'Smoke': 'weather-fog',
    'Haze': 'weather-fog',
    'Dust': 'weather-fog',
    'Fog': 'weather-fog',
    'Sand': 'weather-fog',
    'Ash': 'weather-fog',
    'Squall': 'weather-windy',
    'Tornado': 'weather-tornado',
    'Drizzle': 'weather-rainy'
  }), []);

  const dashboardOptions = useMemo(() => [
    { label: 'Home', icon: 'home-outline', navigateTo: 'DashboardScreen', id: 'dashboard' },
    { label: 'Plants', icon: 'leaf-outline', navigateTo: 'MyPlantsScreen', id: 'plants' },
    { label: 'Scan', icon: 'scan-outline', navigateTo: 'DiagnoseScreen', id: 'scan' },
    { label: 'Tasks', icon: 'checkmark-circle-outline', navigateTo: 'ReminderScreen', id: 'tasks', badge: reminderCount > 0 ? reminderCount : null },
    { label: 'Profile', icon: 'person-outline', navigateTo: 'SettingsScreen', id: 'profile' },
  ], [reminderCount]);

  const plantTipsData = useMemo(() => [
    "Water plants early morning to reduce evaporation",
    "Yellow leaves often indicate overwatering",
    "Most houseplants thrive in indirect sunlight",
    "Rotate plants weekly for even growth",
    "Rainwater is better than tap water for plants",
    "Brown leaf tips usually mean low humidity"
  ], []);

  const fetchWeather = useCallback(async (latitude, longitude, city = 'San Francisco') => {
    try {
      const cachedWeather = await AsyncStorage.getItem('weather_cache');
      if (cachedWeather) {
        const cacheTime = await AsyncStorage.getItem('weather_cache_time');
        const now = Date.now();
        if (cacheTime && (now - parseInt(cacheTime)) < 3600000) {
          setWeather(JSON.parse(cachedWeather));
          return;
        }
      }

      const apiKey = '90f09d4f5aee16b2bc04a8316114eb9e';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.cod === 200) {
        const newWeather = {
          temp: `${Math.round(data.main.temp)}°`,
          condition: data.weather[0].main,
          humidity: `${data.main.humidity}%`,
          city: city,
          icon: weatherIcons[data.weather[0].main] || 'weather-sunny'
        };
        setWeather(newWeather);
        await AsyncStorage.setItem('weather_cache', JSON.stringify(newWeather));
        await AsyncStorage.setItem('weather_cache_time', Date.now().toString());
      }
    } catch (error) {
      console.error('Weather Fetch Error:', error);
    }
  }, [weatherIcons]);

  const getLocation = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        fetchWeather(37.7749, -122.4194, 'San Francisco');
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      const city = reverseGeocode[0]?.city || 'Unknown City';
      fetchWeather(location.coords.latitude, location.coords.longitude, city);
    } catch (error) {
      console.error('Location Error:', error);
      fetchWeather(37.7749, -122.4194, 'San Francisco');
    }
  }, [fetchWeather]);

  const parseTask = useCallback((task) => {
    const taskLower = task.toLowerCase();
    let type = 'care';
    if (taskLower.includes('water')) type = 'water';
    else if (taskLower.includes('fertilize') || taskLower.includes('feed')) type = 'fertilize';
    const words = task.split(' ');
    const plantName = words.slice(1).join(' ') || 'Your plant';
    return { plantName: plantName.charAt(0).toUpperCase() + plantName.slice(1), type };
  }, []);

  const fetchReminders = useCallback(async () => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      const cacheKey = `dashboard_${user.uid}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (cachedData) {
        const data = JSON.parse(cachedData);
        const cacheTime = await AsyncStorage.getItem(`${cacheKey}_time`);
        const now = Date.now();
        if (cacheTime && (now - parseInt(cacheTime)) < 300000) {
          setUserName(data.userName || 'Plant Lover');
          setUserAvatar(data.photoURL ? { uri: data.photoURL } : require('./assets/profile-avatar.png'));
          setReminderCount(data.reminderCount || 0);
          setNextReminder(data.nextReminder || null);
          setRecentPlants(data.recentPlants || []);
          setPlantHealth(data.plantHealth || 0);
          setPlantTips(data.plantTips || plantTipsData[Math.floor(Math.random() * plantTipsData.length)]);
          setIsLoading(false);
          return;
        }
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const newData = {};
      
      if (userDoc.exists()) {
        newData.userName = userDoc.data().name || 'Plant Lover';
        newData.photoURL = userDoc.data().photoURL;
        setUserName(newData.userName);
        setUserAvatar(newData.photoURL ? { uri: newData.photoURL } : require('./assets/profile-avatar.png'));
      }

      const [remindersSnapshot, plantsSnapshot, tipsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'users', user.uid, 'reminders'), orderBy('timestamp'))),
        getDocs(query(collection(db, 'users', user.uid, 'plants'), orderBy('timestamp', 'desc'))),
        getDocs(collection(db, 'tips'))
      ]);

      const reminders = remindersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate() : new Date(),
        isCompleted: doc.data().isCompleted || false,
      }));
      
      const activeReminders = reminders.filter(reminder => !reminder.isCompleted);
      newData.reminderCount = activeReminders.length;
      setReminderCount(newData.reminderCount);

      if (activeReminders.length > 0) {
        const sortedReminders = activeReminders.sort((a, b) => a.timestamp - b.timestamp);
        const next = sortedReminders.find(r => moment(r.timestamp).isSameOrAfter(moment(), 'day'));
        if (next) {
          const daysUntil = moment(next.timestamp).diff(moment(), 'days');
          const { plantName, type } = parseTask(next.task || 'Care for plant');
          newData.nextReminder = { days: daysUntil > 0 ? daysUntil : 0, plantName, type };
          setNextReminder(newData.nextReminder);
        }
      }

      const plantsList = plantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      newData.recentPlants = plantsList.slice(0, 3);
      setRecentPlants(newData.recentPlants);
      
      if (plantsList.length > 0) {
        const totalHealth = plantsList.reduce((sum, plant) => sum + (plant.health || 0), 0);
        newData.plantHealth = Math.round(totalHealth / plantsList.length);
        setPlantHealth(newData.plantHealth);
      }

      const tips = tipsSnapshot.docs.map(doc => doc.data().tip);
      newData.plantTips = tips.length > 0 ? tips[Math.floor(Math.random() * tips.length)] : plantTipsData[Math.floor(Math.random() * plantTipsData.length)];
      setPlantTips(newData.plantTips);

      await AsyncStorage.setItem(cacheKey, JSON.stringify(newData));
      await AsyncStorage.setItem(`${cacheKey}_time`, Date.now().toString());
    } catch (error) {
      console.error('Data Fetch Error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        duration: 600, 
        useNativeDriver: true 
      }).start();
    }
  }, [plantTipsData, parseTask, fadeAnim]);

  useEffect(() => {
    if (isFocused) {
      getLocation();
      fetchReminders();
    }
  }, [isFocused, getLocation, fetchReminders]);

  const debouncedRefresh = useCallback(
    debounce(() => {
      setRefreshing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      getLocation();
      fetchReminders();
    }, 1500),
    [getLocation, fetchReminders]
  );

  const handleNavigation = useCallback((screen) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen);
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="sprout" size={48} color="#2D5F3F" />
          <Text style={styles.loadingText}>Loading your garden...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      {/* Minimalist Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.timeGreeting}>{moment().format('h:mm A')}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => handleNavigation('SettingsScreen')}
        >
          <Image source={userAvatar} style={styles.avatarImage} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={debouncedRefresh}
            colors={['#2D5F3F']}
            tintColor="#2D5F3F"
          />
        }
      >
        {/* Weather Strip */}
        <View style={styles.weatherStrip}>
          <View style={styles.weatherLeft}>
            <MaterialCommunityIcons name={weather.icon} size={32} color="#2D5F3F" />
            <View>
              <Text style={styles.weatherTemp}>{weather.temp}</Text>
              <Text style={styles.weatherCity}>{weather.city}</Text>
            </View>
          </View>
          <View style={styles.weatherRight}>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
            <Text style={styles.weatherHumidity}>{weather.humidity} humidity</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={[styles.statBox, { backgroundColor: '#E8F5E9' }]}
            onPress={() => handleNavigation('MyPlantsScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{recentPlants.length}</Text>
            <Text style={styles.statLabel}>Plants</Text>
            <MaterialCommunityIcons name="sprout" size={24} color="#2D5F3F" style={styles.statIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, { backgroundColor: '#FFF3E0' }]}
            onPress={() => handleNavigation('ReminderScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{reminderCount}</Text>
            <Text style={styles.statLabel}>Tasks Due</Text>
            <Ionicons name="checkbox-outline" size={24} color="#E65100" style={styles.statIcon} />
            {reminderCount > 0 && <View style={styles.urgentDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, { backgroundColor: '#E3F2FD' }]}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{plantHealth}%</Text>
            <Text style={styles.statLabel}>Health</Text>
            <MaterialCommunityIcons name="heart-pulse" size={24} color="#1565C0" style={styles.statIcon} />
          </TouchableOpacity>
        </View>

        {/* Next Task Card */}
        {nextReminder && (
          <TouchableOpacity
            style={styles.taskCard}
            onPress={() => handleNavigation('ReminderScreen')}
            activeOpacity={0.8}
          >
            <View style={styles.taskHeader}>
              <View style={styles.taskIconBox}>
                <Ionicons 
                  name={nextReminder.type === 'water' ? 'water' : nextReminder.type === 'fertilize' ? 'leaf' : 'flower'} 
                  size={20} 
                  color="#FFF" 
                />
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{nextReminder.plantName}</Text>
                <Text style={styles.taskType}>
                  {nextReminder.type === 'water' ? 'Watering' : nextReminder.type === 'fertilize' ? 'Fertilizing' : 'Care'} required
                </Text>
              </View>
              <View style={styles.taskTime}>
                <Text style={styles.taskDays}>{nextReminder.days === 0 ? 'Today' : `${nextReminder.days}d`}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Plants Section */}
        {recentPlants.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Plants</Text>
              <TouchableOpacity onPress={() => handleNavigation('MyPlantsScreen')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.plantsRow}
            >
              {recentPlants.map((plant) => (
                <TouchableOpacity
                  key={plant.id}
                  style={styles.plantCard}
                  onPress={() => handleNavigation('MyPlantScreen')}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: plant.image }}
                    style={styles.plantImage}
                    defaultSource={require('./assets/plant-placeholder.png')}
                  />
                  <View style={styles.plantInfo}>
                    <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
                    <View style={styles.plantMeta}>
                      <View style={[styles.healthDot, {
                        backgroundColor: plant.health > 80 ? '#4CAF50' : plant.health > 60 ? '#FF9800' : '#F44336'
                      }]} />
                      <Text style={styles.plantHealth}>{plant.health}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={styles.addPlantCard}
                onPress={() => handleNavigation('AddPlantScreen')}
              >
                <View style={styles.addPlantIcon}>
                  <Ionicons name="add" size={28} color="#2D5F3F" />
                </View>
                <Text style={styles.addPlantText}>Add Plant</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Tip Card */}
        {plantTips && (
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb-outline" size={20} color="#F57C00" />
              <Text style={styles.tipLabel}>Daily Tip</Text>
            </View>
            <Text style={styles.tipText}>{plantTips}</Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleNavigation('DiagnoseScreen')}
            >
              <Ionicons name="scan" size={24} color="#2D5F3F" />
              <Text style={styles.actionText}>Diagnose</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleNavigation('FindPlantScreen')}
            >
              <MaterialCommunityIcons name="magnify" size={24} color="#2D5F3F" />
              <Text style={styles.actionText}>Identify</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleNavigation('CareGuideScreen')}
            >
              <Ionicons name="book-outline" size={24} color="#2D5F3F" />
              <Text style={styles.actionText}>Care Guide</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleNavigation('ChatScreen')}
            >
              <Ionicons name="chatbubbles-outline" size={24} color="#2D5F3F" />
              <Text style={styles.actionText}>Ask AI</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {dashboardOptions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => {
              setActiveTab(item.id);
              handleNavigation(item.navigateTo);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.navIconWrapper}>
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={activeTab === item.id ? '#2D5F3F' : '#9E9E9E'} 
              />
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </View>
            {activeTab === item.id && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#546E7A',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F5F7FA',
  },
  headerLeft: {
    gap: 4,
  },
  timeGreeting: {
    fontSize: 14,
    color: '#78909C',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C313A',
    letterSpacing: -0.5,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  weatherStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C313A',
  },
  weatherCity: {
    fontSize: 13,
    color: '#78909C',
    marginTop: 2,
  },
  weatherRight: {
    alignItems: 'flex-end',
  },
  weatherCondition: {
    fontSize: 15,
    fontWeight: '600',
    color: '#37474F',
  },
  weatherHumidity: {
    fontSize: 12,
    color: '#78909C',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    position: 'relative',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C313A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#546E7A',
    fontWeight: '500',
  },
  statIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.3,
  },
  urgentDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  taskCard: {
    backgroundColor: '#2D5F3F',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  taskType: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  taskTime: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  taskDays: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C313A',
  },
  seeAll: {
    fontSize: 14,
    color: '#2D5F3F',
    fontWeight: '600',
  },
  plantsRow: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  plantCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  plantImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  plantInfo: {
    padding: 12,
  },
  plantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C313A',
    marginBottom: 6,
  },
  plantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  plantHealth: {
    fontSize: 12,
    color: '#78909C',
    fontWeight: '500',
  },
  addPlantCard: {
    width: 140,
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addPlantIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPlantText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D5F3F',
  },
  tipCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F57C00',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tipText: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#37474F',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navIconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#F44336',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2D5F3F',
    marginTop: 2,
  },
});

export default DashboardScreen;