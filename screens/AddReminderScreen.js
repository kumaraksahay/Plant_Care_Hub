import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Platform,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export default function AddReminderScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [remindAbout, setRemindAbout] = useState('Select');
  const [repeatEvery, setRepeatEvery] = useState('3');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  const [priority, setPriority] = useState('Medium');
  const [notificationSound, setNotificationSound] = useState(true);
  const [notificationVibrate, setNotificationVibrate] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [modalSetter, setModalSetter] = useState(null);
  const [modalPlaceholder, setModalPlaceholder] = useState('');

  const remindOptions = ['Select', 'Watering', 'Fertilizing', 'Pruning', 'Repotting', 'Check for Pests'];
  const repeatOptions = ['1', '2', '3', '5', '7', '14', '30'];
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periodOptions = ['AM', 'PM'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  const openModal = (options, setter, placeholder) => {
    setModalOptions(options);
    setModalSetter(() => setter);
    setModalPlaceholder(placeholder);
    setModalVisible(true);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log('Selected Image URI:', result.assets[0].uri);
    }
  };

  const scheduleNotification = async (reminderTime, task, priority, sound, vibrate, id) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Notification permissions are required!');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: `Reminder: ${task}`,
        body: `Time to ${task.toLowerCase()}! Priority: ${priority}`,
        sound: sound ? 'default' : undefined,
        vibrate: vibrate ? [250, 250, 250] : undefined,
        priority: priority === 'High' ? 'high' : 'normal',
        data: { reminderId: id },
      },
      trigger: { date: reminderTime.toDate() },
    });
  };

  const handleSaveReminder = async () => {
    if (remindAbout === 'Select') {
      Alert.alert('Error', 'Please select a reminder type.');
      return;
    }

    const timeString = `${hour}:${minute} ${period}`;
    const parsedTime = moment(timeString, 'hh:mm A');
    const today = moment().startOf('day');
    const reminderDateTime = today.clone().set({
      hour: parsedTime.hour(),
      minute: parsedTime.minute(),
      second: 0,
      millisecond: 0,
    });

    if (!reminderDateTime.isValid() || reminderDateTime.isBefore(moment())) {
      reminderDateTime.add(1, 'day');
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const reminderData = {
          task: remindAbout,
          repeatEvery: parseInt(repeatEvery),
          time: timeString,
          timestamp: reminderDateTime.toDate(),
          imageUri: image || null,
          isCompleted: false,
          createdAt: new Date(),
          priority: priority,
          notificationSound,
          notificationVibrate,
        };
        const docRef = await addDoc(collection(db, 'users', user.uid, 'reminders'), reminderData);
        await scheduleNotification(
          reminderDateTime,
          remindAbout,
          priority,
          notificationSound,
          notificationVibrate,
          docRef.id
        );
        Alert.alert('Success', 'Reminder added successfully!');
        navigation.navigate('ReminderScreen'); // Ensure it goes back to the root screen (e.g., Dashboard)
      }
    } catch (error) {
      console.error('Error adding reminder:', error);
      Alert.alert('Error', 'Failed to add reminder. Please try again.');
    }
  };

  const renderModalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        modalSetter(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.modalItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#DCF5DC', '#A8E6CF']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ReminderScreen')}>
          <Ionicons name="arrow-back" size={24} color="#285430" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set New Reminder</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plant Details</Text>
            <View style={styles.inputGroup}>
              <Ionicons name="image-outline" size={20} color="#00695C" style={styles.icon} />
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                  <Text style={styles.placeholderText}>Select Plant Image</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reminder Settings</Text>
            <View style={styles.inputGroup}>
              <Ionicons name="leaf-outline" size={20} color="#00695C" style={styles.icon} />
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => openModal(remindOptions, setRemindAbout, 'Select Task')}
              >
                <Text style={styles.dropdownText}>{remindAbout}</Text>
                <Ionicons name="chevron-down" size={20} color="#00695C" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="sync-outline" size={20} color="#00695C" style={styles.icon} />
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => openModal(repeatOptions, setRepeatEvery, 'Repeat Every')}
              >
                <Text style={styles.dropdownText}>{`${repeatEvery} Day${repeatEvery !== '1' ? 's' : ''}`}</Text>
                <Ionicons name="chevron-down" size={20} color="#00695C" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="time-outline" size={20} color="#00695C" style={styles.icon} />
              <Text style={styles.label}>Time</Text>
              <View style={styles.timePickerContainer}>
                <TouchableOpacity
                  style={styles.timePicker}
                  onPress={() => openModal(hourOptions, setHour, 'Hour')}
                >
                  <Text style={styles.timeText}>{hour}</Text>
                </TouchableOpacity>
                <Text style={styles.timeSeparator}>:</Text>
                <TouchableOpacity
                  style={styles.timePicker}
                  onPress={() => openModal(minuteOptions, setMinute, 'Minute')}
                >
                  <Text style={styles.timeText}>{minute}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timePicker}
                  onPress={() => openModal(periodOptions, setPeriod, 'Period')}
                >
                  <Text style={styles.timeText}>{period}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="flag-outline" size={20} color="#00695C" style={styles.icon} />
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => openModal(priorityOptions, setPriority, 'Select Priority')}
              >
                <Text style={styles.dropdownText}>{priority}</Text>
                <Ionicons name="chevron-down" size={20} color="#00695C" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="notifications-outline" size={20} color="#00695C" style={styles.icon} />
              <View style={styles.notificationSettings}>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setNotificationSound(!notificationSound)}
                >
                  <Text style={styles.toggleText}>
                    Sound: {notificationSound ? 'On' : 'Off'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setNotificationVibrate(!notificationVibrate)}
                >
                  <Text style={styles.toggleText}>
                    Vibrate: {notificationVibrate ? 'On' : 'Off'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveReminder}>
            <Text style={styles.saveButtonText}>Save Reminder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalPlaceholder}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#285430" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalOptions}
              renderItem={renderModalItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.modalList}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  backButton: { padding: 8 },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#285430',
    textAlign: 'center',
  },
  content: { flex: 1, padding: 15, backgroundColor: '#DCF5DC' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#285430',
    marginBottom: 15,
  },
  inputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  icon: { marginRight: 12 },
  imagePicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  imagePreview: { width: '100%', height: '100%', borderRadius: 12 },
  placeholderText: { fontSize: 14, color: '#757575' },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B0BEC5',
  },
  dropdownText: { fontSize: 14, color: '#424242' },
  timePickerContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 5 },
  timePicker: {
    width: 60,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B0BEC5',
    marginRight: 5,
  },
  timeText: { fontSize: 14, color: '#424242' },
  timeSeparator: { fontSize: 14, color: '#424242', marginHorizontal: 5 },
  label: { fontSize: 14, color: '#00695C', marginRight: 10 },
  notificationSettings: { flex: 1 },
  toggleButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  toggleText: { fontSize: 14, color: '#424242' },
  saveButton: {
    backgroundColor: '#285430',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    maxHeight: '60%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#285430' },
  modalList: { flexGrow: 0 },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalItemText: { fontSize: 16, color: '#424242' },
});