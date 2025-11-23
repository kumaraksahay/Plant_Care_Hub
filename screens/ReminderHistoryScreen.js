import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, query, orderBy, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export default function ReminderHistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchHistory = async () => {
    try {
      setError(null);
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'users', user.uid, 'history'), orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(q);
        const historyData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(historyData);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load history. Please try again.');
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid, 'history', id));
        fetchHistory();
        Alert.alert('Success', 'History item deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
      Alert.alert('Error', 'Failed to delete history item. Please try again.');
    }
  };

  const clearHistory = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'users', user.uid, 'history'));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        fetchHistory();
        Alert.alert('Success', 'History cleared successfully!');
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      Alert.alert('Error', 'Failed to clear history. Please try again.');
    }
  };

  const restoreReminder = async (item) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const newTime = moment().add(1, 'days');
        const reminderRef = await addDoc(collection(db, 'users', user.uid, 'reminders'), {
          task: item.task,
          repeatEvery: item.repeatEvery || 1,
          time: newTime.format('hh:mm A'),
          timestamp: newTime.toDate(),
          imageUri: item.imageUri || null,
          isCompleted: false,
          createdAt: new Date(),
          priority: item.priority,
          notificationSound: item.notificationSound,
          notificationVibrate: item.notificationVibrate,
        });
        await scheduleNotification(
          newTime,
          item.task,
          item.priority,
          item.notificationSound,
          item.notificationVibrate,
          reminderRef.id
        );
        await deleteDoc(doc(db, 'users', user.uid, 'history', item.id));
        fetchHistory();
        Alert.alert('Success', 'Reminder restored successfully!');
      }
    } catch (error) {
      console.error('Error restoring reminder:', error);
      Alert.alert('Error', 'Failed to restore reminder. Please try again.');
    }
  };

  const scheduleNotification = async (reminderTime, task, priority, sound, vibrate, id) => {
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

  const getPriorityColor = (priority) => ({
    High: '#D32F2F',
    Medium: '#FFB300',
    Low: '#4CAF50',
    None: '#757575',
  }[priority]);

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyContent}>
        <View style={styles.historyDetails}>
          <Text style={styles.historyTitle}>- {item.task}</Text>
          <Text style={styles.historyInfo}>
            Completed on: {moment(item.completedAt?.toDate()).format('MMMM D, YYYY, h:mm A')}
          </Text>
          <Text style={styles.historyInfo}>
            Scheduled for: {moment(item.timestamp?.toDate()).format('MMMM D, YYYY')} at {item.time}
          </Text>
          <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
            Priority: {item.priority}
          </Text>
        </View>
        <View style={styles.historyActions}>
          <TouchableOpacity style={styles.restoreButton} onPress={() => restoreReminder(item)}>
            <Text style={styles.restoreText}>Restore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteHistoryItem(item.id)}>
            <Ionicons name="trash" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (error) {
    return (
      <LinearGradient colors={['#DCF5DC', '#A8E6CF']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHistory}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#DCF5DC', '#A8E6CF']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#285430" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminder History</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No completed reminders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
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
  clearButton: {
    padding: 8,
  },
  clearText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '600',
  },
  list: { padding: 15, paddingBottom: 20 },
  historyCard: {
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
  historyContent: { flexDirection: 'row', alignItems: 'center' },
  historyDetails: { flex: 1 },
  historyTitle: { fontSize: 16, fontWeight: '600', color: '#424242', marginBottom: 5 },
  historyInfo: { fontSize: 14, color: '#757575', marginBottom: 3 },
  priorityText: { fontSize: 12, fontWeight: '500', marginBottom: 3 },
  historyActions: { flexDirection: 'row', alignItems: 'center' },
  restoreButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  restoreText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  deleteButton: {
    padding: 10,
  },
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