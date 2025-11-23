// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Switch,
//   Alert,
//   TextInput,
//   ScrollView,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { auth, db } from './firebaseConfig';
// import { doc, getDoc, setDoc } from 'firebase/firestore';

// export default function SettingsScreen({ navigation }) {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true);
//   const [userName, setUserName] = useState('');
//   const [email, setEmail] = useState('');

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const user = auth.currentUser;
//         if (user) {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             const data = userDoc.data();
//             setIsDarkMode(data.darkMode || false);
//             setNotificationsEnabled(data.notificationsEnabled !== false); // Default to true
//             setUserName(data.displayName || user.email.split('@')[0]);
//             setEmail(user.email);
//           }
//         }
//       } catch (error) {
//         Alert.alert('Error', `Failed to load settings: ${error.message}`);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const toggleDarkMode = async () => {
//     const newValue = !isDarkMode;
//     setIsDarkMode(newValue);
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         await setDoc(doc(db, 'users', user.uid), { darkMode: newValue }, { merge: true });
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update theme settings.');
//       setIsDarkMode(!newValue); // Revert on error
//     }
//   };

//   const toggleNotifications = async () => {
//     const newValue = !notificationsEnabled;
//     setNotificationsEnabled(newValue);
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         await setDoc(doc(db, 'users', user.uid), { notificationsEnabled: newValue }, { merge: true });
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update notification settings.');
//       setNotificationsEnabled(!newValue); // Revert on error
//     }
//   };

//   const updateProfile = async () => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         await setDoc(doc(db, 'users', user.uid), { displayName: userName }, { merge: true });
//         Alert.alert('Success', 'Profile updated successfully!');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update profile.');
//     }
//   };

//   const signOut = async () => {
//     try {
//       await auth.signOut();
//       navigation.replace('SignInScreen'); // Replace with your login screen
//     } catch (error) {
//       Alert.alert('Error', 'Failed to sign out.');
//     }
//   };

//   return (
//     <LinearGradient colors={['#DCF5DC', '#A8E6CF']} style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//           accessibilityLabel="Go Back"
//         >
//           <MaterialCommunityIcons name="arrow-left" size={28} color="#285430" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Settings</Text>
//       </View>

//       <ScrollView style={styles.content}>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Profile</Text>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Name</Text>
//             <TextInput
//               style={styles.input}
//               value={userName}
//               onChangeText={setUserName}
//               placeholder="Your Name"
//             />
//           </View>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Email</Text>
//             <TextInput
//               style={[styles.input, styles.disabledInput]}
//               value={email}
//               editable={false}
//             />
//           </View>
//           <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
//             <Text style={styles.saveButtonText}>Save Profile</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Preferences</Text>
//           <View style={styles.settingRow}>
//             <Text style={styles.settingText}>Dark Mode</Text>
//             <Switch
//               value={isDarkMode}
//               onValueChange={toggleDarkMode}
//               trackColor={{ false: '#767577', true: '#4CAF50' }}
//               thumbColor={isDarkMode ? '#FFFFFF' : '#F4F3F4'}
//             />
//           </View>
//           <View style={styles.settingRow}>
//             <Text style={styles.settingText}>Notifications</Text>
//             <Switch
//               value={notificationsEnabled}
//               onValueChange={toggleNotifications}
//               trackColor={{ false: '#767577', true: '#4CAF50' }}
//               thumbColor={notificationsEnabled ? '#FFFFFF' : '#F4F3F4'}
//             />
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Account</Text>
//           <TouchableOpacity style={styles.actionButton} onPress={signOut}>
//             <Text style={styles.actionButtonText}>Sign Out</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>About</Text>
//           <Text style={styles.aboutText}>PlantCare App v1.0.0</Text>
//           <Text style={styles.aboutText}>© 2025 PlantCare Inc.</Text>
//           <TouchableOpacity
//             style={styles.linkButton}
//             onPress={() => Alert.alert('Support', 'Contact us at support@plantcare.com')}
//           >
//             <Text style={styles.linkButtonText}>Contact Support</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     paddingTop: 40,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   backButton: {
//     padding: 10,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#285430',
//     marginLeft: 10,
//     fontFamily: 'System',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 10,
//   },
//   section: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     padding: 20,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#285430',
//     marginBottom: 15,
//     fontFamily: 'System',
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 5,
//     fontFamily: 'System',
//   },
//   input: {
//     backgroundColor: '#F5F7F5',
//     borderRadius: 10,
//     padding: 10,
//     fontSize: 16,
//     color: '#285430',
//     fontFamily: 'System',
//   },
//   disabledInput: {
//     backgroundColor: '#E0E0E0',
//     color: '#666',
//   },
//   saveButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     alignSelf: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   saveButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'System',
//   },
//   settingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   settingText: {
//     fontSize: 16,
//     color: '#285430',
//     fontFamily: 'System',
//   },
//   actionButton: {
//     backgroundColor: '#FF5252',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     alignSelf: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   actionButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'System',
//   },
//   aboutText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'System',
//   },
//   linkButton: {
//     alignSelf: 'center',
//     padding: 10,
//   },
//   linkButtonText: {
//     fontSize: 16,
//     color: '#4CAF50',
//     fontWeight: '500',
//     fontFamily: 'System',
//   },
// });



import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Alert,
  StatusBar,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [avatar, setAvatar] = useState(require('./assets/profile-avatar.png'));
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dobSaved, setDobSaved] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerHeight = useRef(new Animated.Value(140)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setEmail(user.email || '');

          const cachedData = await AsyncStorage.getItem(`user_${user.uid}`);
          if (cachedData) {
            const data = JSON.parse(cachedData);
            setName(data.name || '');
            setPhone(data.phone || '');
            setDob(data.dob || '');
            setDobSaved(!!data.dob);
            if (data.photoURL) setAvatar({ uri: data.photoURL });
            setNotificationsEnabled(data.notifications !== undefined ? data.notifications : true);
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
          }

          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.name || '');
            setPhone(data.phone || '');
            setDob(data.dob || '');
            setDobSaved(!!data.dob);
            if (data.photoURL) setAvatar({ uri: data.photoURL });
            setNotificationsEnabled(data.notifications !== undefined ? data.notifications : true);
            await AsyncStorage.setItem(`user_${user.uid}`, JSON.stringify({
              name: data.name,
              phone: data.phone,
              dob: data.dob,
              photoURL: data.photoURL,
              notifications: data.notifications,
            }));
          }
        }
      } catch (error) {
        console.error('Fetch User Data Error:', error);
      } finally {
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      }
    };
    fetchUserData();
  }, [fadeAnim]);

  const showAlert = (title, message) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(title, message);
  };

  const handleUpdateName = async () => {
    if (!name.trim()) {
      showAlert('Error', 'Please enter a valid name');
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) {
        showAlert('Error', 'User not authenticated');
        return;
      }
      await setDoc(doc(db, 'users', user.uid), { name: name.trim() }, { merge: true });
      await AsyncStorage.setItem(`user_${user.uid}`, JSON.stringify({
        name: name.trim(),
        phone,
        dob,
        notifications: notificationsEnabled,
        photoURL: avatar.uri,
      }));
      showAlert('Success', 'Name updated successfully');
    } catch (error) {
      showAlert('Error', 'Failed to update name');
      console.error('Update Name Error:', error);
    }
  };

  const handleUpdateDob = async () => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      showAlert('Error', 'Please enter Date of Birth in MM/DD/YYYY format');
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) {
        showAlert('Error', 'User not authenticated');
        return;
      }
      await setDoc(doc(db, 'users', user.uid), { dob }, { merge: true });
      await AsyncStorage.setItem(`user_${user.uid}`, JSON.stringify({
        name,
        phone,
        dob,
        notifications: notificationsEnabled,
        photoURL: avatar.uri,
      }));
      setDobSaved(true);
      showAlert('Success', 'Date of Birth saved');
    } catch (error) {
      showAlert('Error', 'Failed to save Date of Birth');
      console.error('Save DOB Error:', error);
    }
  };

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      try {
        const user = auth.currentUser;
        if (!user) {
          showAlert('Error', 'User not authenticated');
          return;
        }
        const photoURL = result.assets[0].uri;
        setAvatar({ uri: photoURL });
        await setDoc(doc(db, 'users', user.uid), { photoURL }, { merge: true });
        await AsyncStorage.setItem(`user_${user.uid}`, JSON.stringify({
          name,
          phone,
          dob,
          notifications: notificationsEnabled,
          photoURL,
        }));
        showAlert('Success', 'Avatar updated');
      } catch (error) {
        showAlert('Error', 'Failed to update avatar');
        console.error('Update Avatar Error:', error);
      }
    }
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    try {
      const user = auth.currentUser;
      if (!user) {
        showAlert('Error', 'User not authenticated');
        return;
      }
      await setDoc(doc(db, 'users', user.uid), { notifications: newValue }, { merge: true });
      await AsyncStorage.setItem(`user_${user.uid}`, JSON.stringify({
        name,
        phone,
        dob,
        notifications: newValue,
        photoURL: avatar.uri,
      }));
      showAlert('Success', `Notifications ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      showAlert('Error', 'Failed to update notification settings');
      console.error('Update Notifications Error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        showAlert('Error', 'User not authenticated');
        navigation.replace('SignInScreen');
        return;
      }
      await AsyncStorage.removeItem(`user_${user.uid}`);
      await auth.signOut();
      navigation.replace('SignInScreen');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      showAlert('Error', 'Failed to sign out');
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={StyleSheet.absoluteFill} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#1B5E20" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Personalize Your PlantPal Experience</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </Animated.View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatar}>
              <Image source={avatar} style={styles.avatar} />
              <Text style={styles.avatarText}>Change Avatar</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateName}>
              <Text style={styles.buttonText}>Update Name</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.fixedInput}>{email || 'Not set'}</Text>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.fixedInput}>{phone || 'Not set'}</Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Date of Birth</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Date of Birth (MM/DD/YYYY)</Text>
            <TextInput
              style={[styles.input, dobSaved && styles.inputDisabled]}
              value={dob}
              onChangeText={setDob}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#999"
              editable={!dobSaved}
            />
            {!dobSaved && (
              <TouchableOpacity style={styles.button} onPress={handleUpdateDob}>
                <Text style={styles.buttonText}>Save Date of Birth</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <Text style={styles.label}>Notifications</Text>
              <TouchableOpacity onPress={toggleNotifications}>
                <Ionicons
                  name={notificationsEnabled ? 'notifications' : 'notifications-off'}
                  size={24}
                  color={notificationsEnabled ? '#4CAF50' : '#999'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight + 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B5E20',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
  },
  subtitle: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 4,
    fontFamily: Platform.OS === 'android' ? 'sans-serif' : undefined,
  },
  placeholder: { width: 40 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 12,
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8, borderWidth: 2, borderColor: '#4CAF50' },
  avatarText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
  },
  label: {
    fontSize: 14,
    color: '#1B5E20',
    marginBottom: 8,
    fontFamily: Platform.OS === 'android' ? 'sans-serif' : undefined,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1B5E20',
    marginBottom: 16,
    fontFamily: Platform.OS === 'android' ? 'sans-serif' : undefined,
  },
  fixedInput: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    fontFamily: Platform.OS === 'android' ? 'sans-serif' : undefined,
  },
  inputDisabled: {
    backgroundColor: '#E0E0E0',
    color: '#999',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
  },
  signOutButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  signOutButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '700',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default SettingsScreen;