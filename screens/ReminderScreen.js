import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  Platform,
  TextInput,
  SafeAreaView,
  Modal,
} from 'react-native';
import { auth, db } from './firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowActionButtons: true,
    actions: [
      { identifier: 'snooze', buttonTitle: 'Snooze', options: { isAuthenticationRequired: false } },
      { identifier: 'dismiss', buttonTitle: 'Dismiss', options: { isAuthenticationRequired: false } },
    ],
  }),
});

export default function ReminderScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByPriority, setSortByPriority] = useState('None');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedReminderId, setSelectedReminderId] = useState(null); // Track which reminder's snooze options are visible
  const [sortOptions, setSortOptions] = useState([]);
  const [sortSetter, setSortSetter] = useState(null);
  const [sortPlaceholder, setSortPlaceholder] = useState('');

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Notification permissions are required for reminders.');
      }
    };
    setupNotifications();
    fetchReminders();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      checkRemindersForNotifications();
    }, 30000);

    const unsubscribe = navigation.addListener('focus', () => {
      fetchReminders();
    });

    const notificationListener = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.actionIdentifier === 'snooze') {
        snoozeFromNotification(response.notification.request.content.data.reminderId);
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
      notificationListener.remove();
    };
  }, [navigation]);

  const scheduleNotification = async (reminderTime, task, priority, sound, vibrate, id) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    if (reminderTime.isBefore(moment())) return;
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: `Reminder: ${task}`,
        body: `Time to ${task.toLowerCase()}! Priority: ${priority}`,
        sound: sound ? 'default' : undefined,
        vibrate: vibrate ? [500, 500, 500] : undefined,
        priority: priority === 'High' ? 'high' : 'normal',
        data: { reminderId: id },
      },
      trigger: { date: reminderTime.toDate() },
    });
  };

  const triggerNotificationNow = async (reminder) => {
    await Notifications.cancelScheduledNotificationAsync(reminder.id);
    await Notifications.scheduleNotificationAsync({
      identifier: reminder.id,
      content: {
        title: `Reminder: ${reminder.task}`,
        body: `Time to ${reminder.task.toLowerCase()}! Priority: ${reminder.priority}`,
        sound: reminder.notificationSound ? 'default' : undefined,
        vibrate: reminder.notificationVibrate ? [500, 500, 500] : undefined,
        priority: reminder.priority === 'High' ? 'high' : 'normal',
        data: { reminderId: reminder.id },
      },
      trigger: null,
    });

    if (reminder.repeatEvery) {
      const newTime = moment(reminder.timestamp).add(reminder.repeatEvery, 'days');
      const reminderRef = doc(db, 'users', auth.currentUser.uid, 'reminders', reminder.id);
      await updateDoc(reminderRef, {
        timestamp: newTime.toDate(),
        time: newTime.format('hh:mm A'),
      });
      if (newTime.isAfter(moment())) {
        await scheduleNotification(
          newTime,
          reminder.task,
          reminder.priority,
          reminder.notificationSound,
          reminder.notificationVibrate,
          reminder.id
        );
      }
      fetchReminders();
    }
  };

  const checkRemindersForNotifications = () => {
    const now = moment();
    reminders.forEach(reminder => {
      if (reminder.isCompleted) return;
      const reminderTime = moment(reminder.timestamp);
      if (
        reminderTime.isValid() &&
        now.isSameOrAfter(reminderTime, 'minute') &&
        now.diff(reminderTime, 'minutes') < 1
      ) {
        triggerNotificationNow(reminder);
      }
    });
  };

  const fetchReminders = async () => {
    try {
      setError(null);
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'users', user.uid, 'reminders'), orderBy('timestamp'));
        const snapshot = await getDocs(q);
        const remindersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(), // Convert Firestore Timestamp to Date
            isCompleted: data.isCompleted || false,
          };
        });
        const activeReminders = remindersData.filter(reminder => !reminder.isCompleted);
        setReminders(remindersData);
        setFilteredReminders(activeReminders);
        activeReminders.forEach(reminder => {
          const reminderTime = moment(reminder.timestamp);
          if (reminderTime.isValid() && reminderTime.isAfter(moment())) {
            scheduleNotification(
              reminderTime,
              reminder.task,
              reminder.priority,
              reminder.notificationSound,
              reminder.notificationVibrate,
              reminder.id
            );
          }
        });
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setError('Failed to load reminders. Please try again.');
    }
  };

  const toggleReminder = async (id, currentStatus, reminder) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const reminderRef = doc(db, 'users', user.uid, 'reminders', id);
        if (!currentStatus) {
          await addDoc(collection(db, 'users', user.uid, 'history'), {
            task: reminder.task,
            completedAt: new Date(),
            timestamp: reminder.timestamp,
            time: reminder.time,
            priority: reminder.priority,
            repeatEvery: reminder.repeatEvery,
            imageUri: reminder.imageUri || null,
            notificationSound: reminder.notificationSound,
            notificationVibrate: reminder.notificationVibrate,
          });
          await updateDoc(reminderRef, { isCompleted: true });
          await Notifications.cancelScheduledNotificationAsync(id);
          fetchReminders();
        } else {
          await updateDoc(reminderRef, { isCompleted: false });
          const newTime = moment().add(1, 'days');
          await updateDoc(reminderRef, {
            timestamp: newTime.toDate(),
            time: newTime.format('hh:mm A'),
          });
          scheduleNotification(
            newTime,
            reminder.task,
            reminder.priority,
            reminder.notificationSound,
            reminder.notificationVibrate,
            id
          );
          fetchReminders();
        }
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      setError('Failed to update reminder. Please try again.');
    }
  };

  const snoozeFromNotification = async (reminderId) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      setSelectedReminderId(reminderId);
    }
  };

  const snoozeReminder = async (id, reminder, duration) => {
    const durations = { '15m': 15, '1h': 60, '1d': 1440 };
    const minutes = durations[duration];
    try {
      const user = auth.currentUser;
      if (user) {
        // Validate and convert timestamp
        const reminderTime = moment(reminder.timestamp);
        if (!reminderTime.isValid()) {
          throw new Error('Invalid reminder timestamp');
        }
        const currentTime = reminderTime.clone();
        const newTime = currentTime.add(minutes, 'minutes');
        if (!newTime.isValid()) {
          throw new Error('Invalid snooze time calculation');
        }
        const reminderRef = doc(db, 'users', user.uid, 'reminders', id);
        await updateDoc(reminderRef, {
          timestamp: newTime.toDate(),
          time: newTime.format('hh:mm A'),
        });
        if (newTime.isAfter(moment())) {
          scheduleNotification(
            newTime,
            reminder.task,
            reminder.priority,
            reminder.notificationSound,
            reminder.notificationVibrate,
            id
          );
        }
        setSelectedReminderId(null); // Hide snooze options after selection
        fetchReminders();
        Alert.alert('Success', `Reminder snoozed for ${duration}!`);
      }
    } catch (error) {
      console.error('Error snoozing reminder:', error);
      Alert.alert('Error', `Failed to snooze reminder: ${error.message}`);
    }
  };

  const rescheduleReminder = (reminder) => {
    navigation.navigate('EditReminderScreen', { reminder });
  };

  const deleteReminder = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid, 'reminders', id));
        await Notifications.cancelScheduledNotificationAsync(id);
        fetchReminders();
        Alert.alert('Success', 'Reminder deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      Alert.alert('Error', 'Failed to delete reminder. Please try again.');
    }
  };

  const editReminder = (reminder) => {
    navigation.navigate('EditReminderScreen', { reminder });
  };

  const viewHistory = () => {
    navigation.navigate('ReminderHistoryScreen');
  };

  const filterReminders = () => {
    let result = [...reminders].filter(reminder => !reminder.isCompleted);
    if (searchQuery) {
      result = result.filter(r => r.task.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (sortByPriority !== 'None') {
      result.sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1, None: 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    }
    setFilteredReminders(result);
  };

  useEffect(() => {
    filterReminders();
  }, [searchQuery, sortByPriority, reminders]);

  const getPriorityColor = (priority) => ({
    High: '#D32F2F',
    Medium: '#FFB300', // Yellow for Medium priority
    Low: '#4CAF50',
    None: '#757575',
  }[priority]);

  const renderReminder = ({ item }) => (
    <Animated.View style={[styles.reminderCard, { opacity: fadeAnim }]}>
      <View style={styles.reminderContent}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.reminderImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.reminderDetails}>
          <Text style={styles.reminderTitle}>- {item.task}</Text>
          <Text style={styles.reminderInfo}>
            {moment(item.timestamp).format('MMMM D, YYYY')} at {item.time}
          </Text>
          <Text style={styles.reminderInfo}>
            Repeats every {item.repeatEvery} day{item.repeatEvery > 1 ? 's' : ''}
          </Text>
          <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
            Priority: {item.priority}
          </Text>
        </View>
      </View>
      <View style={styles.actionContainer}>
        {!item.isCompleted && (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={() => editReminder(item)}>
              <Ionicons name="pencil" size={20} color="#285430" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => deleteReminder(item.id)}>
              <Ionicons name="trash" size={20} color="#D32F2F" />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={[styles.toggleButton, item.isCompleted && styles.completedToggle]}
          onPress={() => toggleReminder(item.id, item.isCompleted, item)}
        >
          <Text style={styles.toggleText}>
            {item.isCompleted ? 'Restore' : 'Mark Done'}
          </Text>
        </TouchableOpacity>
      </View>
      {!item.isCompleted && (
        <View style={styles.snoozeContainer}>
          <TouchableOpacity
            style={styles.snoozeButton}
            onPress={() => {
              setSelectedReminderId(selectedReminderId === item.id ? null : item.id);
            }}
          >
            <Text style={styles.snoozeText}>Snooze</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rescheduleButton}
            onPress={() => rescheduleReminder(item)}
          >
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      )}
      {selectedReminderId === item.id && !item.isCompleted && (
        <View style={styles.snoozeOptionsContainer}>
          <TouchableOpacity
            style={styles.snoozeOptionButton}
            onPress={() => snoozeReminder(item.id, item, '15m')}
          >
            <Text style={styles.snoozeOptionText}>15m</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.snoozeOptionButton}
            onPress={() => snoozeReminder(item.id, item, '1h')}
          >
            <Text style={styles.snoozeOptionText}>1h</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.snoozeOptionButton}
            onPress={() => snoozeReminder(item.id, item, '1d')}
          >
            <Text style={styles.snoozeOptionText}>1d</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  const openSortModal = (options, setter, placeholder) => {
    setSortOptions(options);
    setSortSetter(() => setter);
    setSortPlaceholder(placeholder);
    setShowSortModal(true);
  };

  const renderModalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        if (sortSetter) {
          sortSetter(item);
          setShowSortModal(false);
        }
      }}
    >
      <Text style={styles.modalItemText}>{item}</Text>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <LinearGradient colors={['#DCF5DC', '#A8E6CF']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="notifications-outline" size={50} color="#285430" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchReminders}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#DCF5DC', '#A8E6CF']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('DashboardScreen')}>
          <Ionicons name="arrow-back" size={24} color="#285430" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Reminders</Text>
        <TouchableOpacity style={styles.historyButton} onPress={viewHistory}>
          <Ionicons name="time-outline" size={24} color="#285430" />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by task..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => openSortModal(['None', 'High', 'Medium', 'Low'], setSortByPriority, 'Sort by Priority')}
        >
          <Text style={styles.sortText}>Sort: {sortByPriority}</Text>
          <Ionicons name="chevron-down" size={20} color="#00695C" />
        </TouchableOpacity>
      </View>

      {filteredReminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reminders yet. Add one!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredReminders}
          renderItem={renderReminder}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddReminderScreen')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showSortModal}
        onRequestClose={() => setShowSortModal(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{sortPlaceholder}</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Ionicons name="close" size={24} color="#285430" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={sortOptions}
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
  historyButton: { padding: 8 },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    color: '#424242',
    marginRight: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortText: { fontSize: 14, color: '#00695C', marginRight: 5 },
  list: { padding: 15, paddingBottom: 20 },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  reminderContent: { flexDirection: 'row', alignItems: 'center' },
  reminderImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15 },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  placeholderText: { fontSize: 12, color: '#757575' },
  reminderDetails: { flex: 1 },
  reminderTitle: { fontSize: 16, fontWeight: '600', color: '#424242', marginBottom: 5 },
  reminderInfo: { fontSize: 14, color: '#757575', marginBottom: 3 },
  priorityText: { fontSize: 12, fontWeight: '500', marginBottom: 3 },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: { padding: 10 },
  toggleButton: {
    backgroundColor: '#05C234', // Yellow for "Mark Done"
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedToggle: { backgroundColor: '#FFB300' }, // Yellow for "Restore"
  toggleText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  snoozeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  snoozeButton: {
    flex: 1,
    backgroundColor: '#FAD026',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 5,
  },
  snoozeText: { color: '#00695C', fontSize: 14, fontWeight: '500' },
  rescheduleButton: {
    flex: 1,
    backgroundColor: '#E0F2F1',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  rescheduleText: { color: '#00695C', fontSize: 14, fontWeight: '500' },
  snoozeOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  snoozeOptionButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  snoozeOptionText: {
    color: '#00695C',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#285430',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '80%',
    maxHeight: '50%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#285430' },
  modalList: { padding: 10 },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalItemText: { fontSize: 16, color: '#424242' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 15 },
  retryButton: {
    backgroundColor: '#285430',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#757575', textAlign: 'center' },
});