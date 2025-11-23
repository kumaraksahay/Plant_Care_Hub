// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
// } from "react-native";
// import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
// import { db } from "./firebaseConfig"; // Ensure firebaseConfig is properly set up

// export default function ChatScreen() {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     // Firestore query to listen for real-time updates
//     const q = query(collection(db, "chatMessages"), orderBy("timestamp", "desc"));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const messagesArray = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(messagesArray);
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, []);

//   const handleSend = async () => {
//     if (newMessage.trim() === "") return;

//     try {
//       await addDoc(collection(db, "chatMessages"), {
//         text: newMessage,
//         timestamp: new Date(),
//       });
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.messageBubble}>
//             <Text style={styles.messageText}>{item.text}</Text>
//           </View>
//         )}
//         inverted // Show latest messages at the bottom
//         contentContainerStyle={styles.chatContainer}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type your message..."
//           value={newMessage}
//           onChangeText={setNewMessage}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F4F9F4",
//   },
//   chatContainer: {
//     padding: 10,
//   },
//   messageBubble: {
//     backgroundColor: "#D3E4CD",
//     padding: 15,
//     borderRadius: 20,
//     marginVertical: 5,
//     alignSelf: "flex-start",
//     maxWidth: "70%",
//   },
//   messageText: {
//     color: "#285430",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#FFFFFF",
//     borderTopWidth: 1,
//     borderTopColor: "#CCCCCC",
//   },
//   input: {
//     flex: 1,
//     backgroundColor: "#F4F4F4",
//     borderRadius: 20,
//     padding: 10,
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: "#285430",
//     padding: 10,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sendButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//   },
// });





// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Expo-native gradient
// import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
// import { db } from './firebaseConfig'; // Ensure firebaseConfig is properly set up
// import Constants from 'expo-constants'; // For status bar height

// export default function ChatScreen({ navigation }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const messageAnims = useRef({}).current; // Object to store animation values for each message

//   useEffect(() => {
//     // Firestore query to listen for real-time updates
//     const q = query(collection(db, "chatMessages"), orderBy("timestamp", "desc"));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const messagesArray = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(messagesArray);
//       // Trigger fade animation for new messages
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, [fadeAnim]);

//   useEffect(() => {
//     // Initialize or reset animation values for new messages
//     messages.forEach((message) => {
//       if (!messageAnims[message.id]) {
//         messageAnims[message.id] = new Animated.Value(0);
//         Animated.timing(messageAnims[message.id], {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start();
//       }
//     });
//   }, [messages, messageAnims]);

//   const handleSend = async () => {
//     if (newMessage.trim() === "") return;

//     try {
//       await addDoc(collection(db, "chatMessages"), {
//         text: newMessage.trim(),
//         timestamp: new Date(),
//       });
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   const renderMessage = ({ item }) => (
//     <Animated.View style={[styles.messageBubble, styles.botMessage, { opacity: messageAnims[item.id] || 1 }]}>
//       <Text style={styles.messageText}>{item.text}</Text>
//       <Text style={styles.timestamp}>
//         {new Date(item.timestamp?.toDate?.() || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//       </Text>
//     </Animated.View>
//   );

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.keyboardAvoidingContainer}
//     >
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#E8F5E9', '#C8E6C9']} // Soft green gradient for a natural feel
//           style={styles.background}
//         >
//           <View style={styles.header}>
//             <Image
//               source={require("./assets/plant-leaf.png")}
//               style={styles.headerLogo}
//               onError={(e) => console.log('Logo failed to load:', e.nativeEvent.error)}
//             />
//             <Text style={styles.headerTitle}>PlantPal Chat</Text>
//           </View>

//           <FlatList
//             data={messages}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id}
//             inverted // Show latest messages at the bottom
//             style={styles.chatList}
//             contentContainerStyle={styles.chatContent}
//           />

//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Type your message..."
//               value={newMessage}
//               onChangeText={setNewMessage}
//               placeholderTextColor="#A3C4BC"
//               keyboardType="default"
//               autoCorrect={true}
//               accessibilityLabel="Chat Input"
//             />
//             <TouchableOpacity 
//               style={styles.sendButton} 
//               onPress={handleSend}
//               accessibilityLabel="Send Message Button"
//             >
//               <Text style={styles.sendButtonText}>Send</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   keyboardAvoidingContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight, // Account for status bar in Expo
//   },
//   background: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(46, 125, 50, 0.1)', // Subtle green overlay
//     borderBottomWidth: 1,
//     borderBottomColor: '#C8E6C9',
//   },
//   headerLogo: {
//     width: 30,
//     height: 30,
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2E7D32',
//   },
//   chatList: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   chatContent: {
//     paddingVertical: 10,
//   },
//   messageBubble: {
//     padding: 15,
//     borderRadius: 20,
//     marginVertical: 5,
//     maxWidth: '80%',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   botMessage: {
//     backgroundColor: '#C8E6C9',
//     alignSelf: 'flex-start',
//     marginLeft: 10,
//   },
//   messageText: {
//     fontSize: 14,
//     color: '#285430',
//     marginBottom: 5,
//   },
//   timestamp: {
//     fontSize: 10,
//     color: '#285430',
//     alignSelf: 'flex-end',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#C8E6C9',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     marginRight: 10,
//     color: '#2E7D32',
//     fontSize: 14,
//   },
//   sendButton: {
//     backgroundColor: '#2E7D32',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   sendButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });







// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Expo-native gradient
// import { collection, addDoc, query, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
// import { auth, db } from './firebaseConfig'; // Ensure firebaseConfig includes both auth and db
// import Constants from 'expo-constants'; // For status bar height

// export default function ChatScreen({ navigation }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [senderNames, setSenderNames] = useState({}); // Store sender names by userId
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const messageAnims = useRef({}).current; // Object to store animation values for each message

//   useEffect(() => {
//     // Fetch current user's name from Firestore
//     const fetchUserName = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             setSenderNames(prev => ({ ...prev, [user.uid]: userDoc.data().name || 'Unknown User' }));
//           } else {
//             setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//           }
//         } catch (error) {
//           console.error('Error fetching user name: ', error);
//           setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//         }
//       }
//     };

//     fetchUserName();

//     // Firestore query to listen for real-time updates
//     const q = query(collection(db, "chatMessages"), orderBy("timestamp", "desc"));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const messagesArray = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         text: doc.data().text || '',
//         userId: doc.data().userId || null, // Default to null if userId is missing
//         timestamp: doc.data().timestamp || new Date(),
//       }));
//       setMessages(messagesArray);
//       // Trigger fade animation for new messages
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();

//       // Fetch sender names for all messages with valid userIds
//       messagesArray.forEach(async (message) => {
//         if (message.userId && !senderNames[message.userId]) {
//           try {
//             const userDoc = await getDoc(doc(db, 'users', message.userId));
//             if (userDoc.exists()) {
//               setSenderNames(prev => ({ ...prev, [message.userId]: userDoc.data().name || 'Unknown User' }));
//             } else {
//               setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//             }
//           } catch (error) {
//             console.error('Error fetching sender name: ', error);
//             setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//           }
//         }
//       });
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, [fadeAnim, senderNames]);

//   useEffect(() => {
//     // Initialize or reset animation values for new messages
//     messages.forEach((message) => {
//       if (!messageAnims[message.id]) {
//         messageAnims[message.id] = new Animated.Value(0);
//         Animated.timing(messageAnims[message.id], {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start();
//       }
//     });
//   }, [messages, messageAnims]);

//   const handleSend = async () => {
//     if (newMessage.trim() === "") return;

//     const user = auth.currentUser;
//     if (!user) {
//       console.error('No authenticated user found');
//       return;
//     }

//     try {
//       await addDoc(collection(db, "chatMessages"), {
//         text: newMessage.trim(),
//         userId: user.uid, // Store the user's UID to identify the sender
//         timestamp: new Date(),
//       });
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   const renderMessage = ({ item }) => {
//     const isCurrentUser = item.userId === auth.currentUser?.uid;
//     const senderName = senderNames[item.userId] || 'Unknown User';

//     return (
//       <Animated.View 
//         style={[
//           styles.messageBubble,
//           isCurrentUser ? styles.userMessage : styles.botMessage,
//           { opacity: messageAnims[item.id] || 1 },
//         ]}
//       >
//         <Text style={styles.senderName}>{senderName}</Text>
//         <Text style={styles.messageText}>{item.text || 'No message content'}</Text>
//         <Text style={styles.timestamp}>
//           {new Date(item.timestamp?.toDate?.() || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </Text>
//       </Animated.View>
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.keyboardAvoidingContainer}
//     >
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#E8F5E9', '#C8E6C9']} // Soft green gradient for a natural feel
//           style={styles.background}
//         >
//           <View style={styles.header}>
//             <Image
//               source={require("./assets/plant-leaf.png")}
//               style={styles.headerLogo}
//               onError={(e) => console.log('Logo failed to load:', e.nativeEvent.error)}
//             />
//             <Text style={styles.headerTitle}>PlantPal Chat</Text>
//           </View>

//           <FlatList
//             data={messages}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id}
//             inverted // Show latest messages at the bottom
//             style={styles.chatList}
//             contentContainerStyle={styles.chatContent}
//           />

//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Type your message..."
//               value={newMessage}
//               onChangeText={setNewMessage}
//               placeholderTextColor="#A3C4BC"
//               keyboardType="default"
//               autoCorrect={true}
//               accessibilityLabel="Chat Input"
//             />
//             <TouchableOpacity 
//               style={styles.sendButton} 
//               onPress={handleSend}
//               accessibilityLabel="Send Message Button"
//             >
//               <Text style={styles.sendButtonText}>Send</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   keyboardAvoidingContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight, // Account for status bar in Expo
//   },
//   background: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(46, 125, 50, 0.1)', // Subtle green overlay
//     borderBottomWidth: 1,
//     borderBottomColor: '#C8E6C9',
//   },
//   headerLogo: {
//     width: 30,
//     height: 30,
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2E7D32',
//   },
//   chatList: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   chatContent: {
//     paddingVertical: 10,
//   },
//   messageBubble: {
//     padding: 15,
//     borderRadius: 20,
//     marginVertical: 5,
//     maxWidth: '80%',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   userMessage: {
//     backgroundColor: '#4CAF50', // Bright green for current user
//     alignSelf: 'flex-end',
//     marginRight: 10,
//   },
//   botMessage: {
//     backgroundColor: '#C8E6C9', // Lighter green for other users
//     alignSelf: 'flex-start',
//     marginLeft: 10,
//   },
//   senderName: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#285430',
//     marginBottom: 5,
//   },
//   messageText: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     marginBottom: 5,
//   },
//   timestamp: {
//     fontSize: 10,
//     color: '#FFFFFF',
//     alignSelf: 'flex-end',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#C8E6C9',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     marginRight: 10,
//     color: '#2E7D32',
//     fontSize: 14,
//   },
//   sendButton: {
//     backgroundColor: '#2E7D32',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   sendButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });





// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Expo-native gradient
// import { collection, addDoc, query, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
// import { auth, db } from './firebaseConfig'; // Ensure firebaseConfig includes both auth and db
// import Constants from 'expo-constants'; // For status bar height

// export default function ChatScreen({ navigation }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [senderNames, setSenderNames] = useState({}); // Store sender names by userId
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const messageAnims = useRef({}).current; // Object to store animation values for each message

//   useEffect(() => {
//     // Fetch current user's name from Firestore
//     const fetchUserName = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             setSenderNames(prev => ({ ...prev, [user.uid]: userDoc.data().name || 'Unknown User' }));
//           } else {
//             setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//           }
//         } catch (error) {
//           console.error('Error fetching user name: ', error);
//           setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//         }
//       }
//     };

//     fetchUserName();

//     // Firestore query to listen for real-time updates
//     const q = query(collection(db, "chatMessages"), orderBy("timestamp", "desc"));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const messagesArray = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         text: doc.data().text || '',
//         userId: doc.data().userId || null, // Default to null if userId is missing
//         timestamp: doc.data().timestamp || new Date(),
//       }));
//       setMessages(messagesArray);
//       // Trigger fade animation for new messages
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();

//       // Fetch sender names for all messages with valid userIds
//       messagesArray.forEach(async (message) => {
//         if (message.userId && !senderNames[message.userId]) {
//           try {
//             const userDoc = await getDoc(doc(db, 'users', message.userId));
//             if (userDoc.exists()) {
//               setSenderNames(prev => ({ ...prev, [message.userId]: userDoc.data().name || 'Unknown User' }));
//             } else {
//               setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//             }
//           } catch (error) {
//             console.error('Error fetching sender name: ', error);
//             setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//           }
//         }
//       });
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, [fadeAnim, senderNames]);

//   useEffect(() => {
//     // Initialize or reset animation values for new messages
//     messages.forEach((message) => {
//       if (!messageAnims[message.id]) {
//         messageAnims[message.id] = new Animated.Value(0);
//         Animated.timing(messageAnims[message.id], {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start();
//       }
//     });
//   }, [messages, messageAnims]);

//   const handleSend = async () => {
//     if (newMessage.trim() === "") return;

//     const user = auth.currentUser;
//     if (!user) {
//       console.error('No authenticated user found');
//       return;
//     }

//     try {
//       await addDoc(collection(db, "chatMessages"), {
//         text: newMessage.trim(),
//         userId: user.uid, // Store the user's UID to identify the sender
//         timestamp: new Date(),
//       });
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   const renderMessage = ({ item }) => {
//     const isCurrentUser = item.userId === auth.currentUser?.uid;
//     const senderName = senderNames[item.userId] || 'Unknown User';

//     return (
//       <Animated.View 
//         style={[
//           styles.messageBubble,
//           isCurrentUser ? styles.userMessage : styles.botMessage,
//           { opacity: messageAnims[item.id] || 1 },
//         ]}
//       >
//         <Text style={styles.senderName}>{senderName}</Text>
//         <Text style={styles.messageText}>{item.text || 'No message content'}</Text>
//         <Text style={styles.timestamp}>
//           {new Date(item.timestamp?.toDate?.() || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </Text>
//       </Animated.View>
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.keyboardAvoidingContainer}
//     >
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#E8F5E9', '#C8E6C9']} // Soft green gradient for a natural feel
//           style={styles.background}
//         >
//           <View style={styles.header}>
//             <Image
//               source={require("./assets/plant-leaf.png")}
//               style={styles.headerLogo}
//               onError={(e) => console.log('Logo failed to load:', e.nativeEvent.error)}
//             />
//             <Text style={styles.headerTitle}>PlantPal Chat</Text>
//           </View>

//           <FlatList
//             data={messages}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id}
//             inverted // Show latest messages at the bottom
//             style={styles.chatList}
//             contentContainerStyle={styles.chatContent}
//           />

//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Type your message..."
//               value={newMessage}
//               onChangeText={setNewMessage}
//               placeholderTextColor="#A3C4BC"
//               keyboardType="default"
//               autoCorrect={true}
//               accessibilityLabel="Chat Input"
//             />
//             <TouchableOpacity 
//               style={styles.sendButton} 
//               onPress={handleSend}
//               accessibilityLabel="Send Message Button"
//             >
//               <Text style={styles.sendButtonText}>Send</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   keyboardAvoidingContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight, // Account for status bar in Expo
//   },
//   background: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(46, 125, 50, 0.1)', // Subtle green overlay
//     borderBottomWidth: 1,
//     borderBottomColor: '#C8E6C9',
//   },
//   headerLogo: {
//     width: 30,
//     height: 30,
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2E7D32',
//   },
//   chatList: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   chatContent: {
//     paddingVertical: 10,
//   },
//   messageBubble: {
//     padding: 15,
//     borderRadius: 20,
//     marginVertical: 5,
//     maxWidth: '80%',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   userMessage: {
//     backgroundColor: '#4CAF50', // Bright green for current user
//     alignSelf: 'flex-end',
//     marginRight: 10,
//   },
//   botMessage: {
//     backgroundColor: '#C8E6C9', // Lighter green for other users
//     alignSelf: 'flex-start',
//     marginLeft: 10,
//   },
//   senderName: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#285430',
//     marginBottom: 5,
//   },
//   messageText: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     marginBottom: 5,
//   },
//   timestamp: {
//     fontSize: 10,
//     color: '#FFFFFF',
//     alignSelf: 'flex-end',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#C8E6C9',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     marginRight: 10,
//     color: '#2E7D32',
//     fontSize: 14,
//   },
//   sendButton: {
//     backgroundColor: '#2E7D32',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   sendButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });








// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Easing,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Expo-native gradient
// import { collection, addDoc, query, orderBy, onSnapshot, getDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { auth, db } from './firebaseConfig'; // Ensure firebaseConfig includes both auth and db
// import Constants from 'expo-constants'; // For status bar height
// import { Ionicons } from '@expo/vector-icons'; // For emojis and attachments
// import * as ImagePicker from 'expo-image-picker'; // For attachments
// import * as FileSystem from 'expo-file-system'; // For reading file as base64

// export default function ChatScreen({ navigation }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [senderNames, setSenderNames] = useState({}); // Store sender names by userId
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false); // For emoji picker
//   const [attachment, setAttachment] = useState(null); // For attachments (base64 string)
//   const [typingUsers, setTypingUsers] = useState({}); // For typing indicators
//   const [isTyping, setIsTyping] = useState(false); // Track current user typing
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const messageAnims = useRef({}).current; // Object to store animation values for each message
//   const inputAnim = useRef(new Animated.Value(0)).current;
//   const typingAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Fetch current user's name from Firestore
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setSenderNames(prev => ({ ...prev, [user.uid]: userData.name || 'Unknown User' }));
//           } else {
//             setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//           }
//         } catch (error) {
//           console.error('Error fetching user name: ', error);
//           setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//         }
//       }
//     };

//     fetchUserData();

//     // Firestore query to listen for real-time updates
//     const q = query(collection(db, "chatMessages"), orderBy("timestamp", "desc"));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const messagesArray = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         text: doc.data().text || '',
//         userId: doc.data().userId || null,
//         timestamp: doc.data().timestamp || serverTimestamp(),
//         emojis: doc.data().emojis || [],
//         attachmentBase64: doc.data().attachmentBase64 || null, // Store base64 string
//       }));
//       setMessages(messagesArray);
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();

//       messagesArray.forEach(async (message) => {
//         if (message.userId && !senderNames[message.userId]) {
//           try {
//             const userDoc = await getDoc(doc(db, 'users', message.userId));
//             if (userDoc.exists()) {
//               const userData = userDoc.data();
//               setSenderNames(prev => ({ ...prev, [message.userId]: userData.name || 'Unknown User' }));
//             } else {
//               setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//             }
//           } catch (error) {
//             console.error('Error fetching sender name: ', error);
//             setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//           }
//         }
//       });
//     });

//     // Simulate typing indicators (replace with real-time logic in production)
//     const typingUnsubscribe = onSnapshot(query(collection(db, "typingStatus"), orderBy("timestamp", "desc")), (snapshot) => {
//       const typing = {};
//       snapshot.forEach(doc => {
//         const data = doc.data();
//         if (data.userId !== auth.currentUser?.uid && Date.now() - data.timestamp.toDate().getTime() < 5000) {
//           typing[data.userId] = true;
//         }
//       });
//       setTypingUsers(typing);
//     });

//     // Animate input area on mount
//     Animated.timing(inputAnim, {
//       toValue: 1,
//       duration: 1000,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();

//     // Animate typing indicator
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(typingAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(typingAnim, {
//           toValue: 0,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     return () => {
//       unsubscribe();
//       if (typingUnsubscribe) typingUnsubscribe();
//     }; // Cleanup listeners on unmount
//   }, [fadeAnim, senderNames, inputAnim, typingAnim]);

//   useEffect(() => {
//     // Initialize or reset animation values for new messages
//     messages.forEach((message) => {
//       if (!messageAnims[message.id]) {
//         messageAnims[message.id] = new Animated.Value(0);
//         Animated.timing(messageAnims[message.id], {
//           toValue: 1,
//           duration: 500,
//           easing: Easing.out(Easing.exp),
//           useNativeDriver: true,
//         }).start();
//       }
//     });
//   }, [messages, messageAnims]);

//   const handleSend = async () => {
//     if (newMessage.trim() === "" && !attachment) return;

//     const user = auth.currentUser;
//     if (!user) {
//       console.error('No authenticated user found');
//       return;
//     }

//     try {
//       await addDoc(collection(db, "chatMessages"), {
//         text: newMessage.trim(),
//         userId: user.uid,
//         timestamp: serverTimestamp(),
//         emojis: [],
//         attachmentBase64: attachment || null, // Store base64 string directly in Firestore
//       });

//       // Simulate typing status (optional, replace with real-time in production)
//       await addDoc(collection(db, "typingStatus"), {
//         userId: user.uid,
//         timestamp: serverTimestamp(),
//       });

//       // Clear the input field immediately after sending
//       setNewMessage("");
//       setAttachment(null);
//       setShowEmojiPicker(false);
//       setIsTyping(false);
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   const addEmoji = (emoji) => {
//     setNewMessage(prev => prev + emoji);
//   };

//   const handleTyping = (text) => {
//     setNewMessage(text);
//     setIsTyping(text.length > 0);
//     if (text.length > 0) {
//       // Simulate typing status (replace with real-time in production)
//       addDoc(collection(db, "typingStatus"), {
//         userId: auth.currentUser?.uid,
//         timestamp: serverTimestamp(),
//       });
//     }
//   };

//   const pickAttachment = async () => {
//     try {
//       // Request media library permissions
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'We need permission to access your photos to attach images.');
//         return;
//       }

//       // Launch image picker
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images, // Revert to MediaTypeOptions.Images to avoid casting error
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.5, // Reduced quality to keep base64 size smaller
//       });

//       if (!result.canceled) {
//         const uri = result.assets[0].uri;
//         // Convert the image to base64
//         const base64 = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });
//         const base64WithPrefix = `data:image/jpeg;base64,${base64}`; // Add prefix for rendering
//         setAttachment(base64WithPrefix); // Store the base64 string
//       }
//     } catch (error) {
//       console.error("Error picking attachment: ", error);
//       Alert.alert('Error', 'Failed to pick an image. Please try again.');
//     }
//   };

//   const renderMessage = ({ item }) => {
//     const isCurrentUser = item.userId === auth.currentUser?.uid;
//     const senderName = senderNames[item.userId] || 'Unknown User';

//     return (
//       <Animated.View 
//         style={[
//           styles.messageBubble,
//           isCurrentUser ? styles.userMessage : styles.botMessage,
//           { 
//             opacity: messageAnims[item.id] || 1,
//             transform: [{ scale: messageAnims[item.id]?.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) || 1 }],
//           },
//         ]}
//       >
//         <Text style={styles.senderName}>{senderName}</Text>
//         <View style={styles.messageContent}>
//           <Text style={styles.messageText}>{item.text || 'No message content'}</Text>
//           {item.emojis.length > 0 && (
//             <View style={styles.emojiContainer}>
//               {item.emojis.map((emoji, index) => (
//                 <Text key={index} style={styles.emoji}>{emoji}</Text>
//               ))}
//             </View>
//           )}
//           {item.attachmentBase64 && (
//             <View style={styles.attachmentPreview}>
//               <Image 
//                 source={{ uri: item.attachmentBase64 }} 
//                 style={styles.attachmentImage} 
//                 onError={(e) => console.log('Attachment failed to load:', e.nativeEvent.error)}
//               />
//               <Text style={styles.attachmentText}>📷 Attachment</Text>
//             </View>
//           )}
//         </View>
//         <Text style={styles.timestamp}>
//           {new Date(item.timestamp?.toDate?.() || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </Text>
//       </Animated.View>
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.keyboardAvoidingContainer}
//     >
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#E8F5E9', '#C8E6C9']} // Soft green gradient for a natural feel
//           style={styles.background}
//         >
//           <View style={styles.header}>
//             <Image
//               source={require("./assets/plant-leaf.png")}
//               style={styles.headerLogo}
//               onError={(e) => console.log('Logo failed to load:', e.nativeEvent.error)}
//             />
//             <Text style={styles.headerTitle}>PlantPal Chat</Text>
//           </View>

//           <FlatList
//             data={messages}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id}
//             inverted // Show latest messages at the bottom
//             style={styles.chatList}
//             contentContainerStyle={styles.chatContent}
//           />

//           <Animated.View style={[styles.inputContainer, { opacity: inputAnim, transform: [{ translateY: inputAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
//             <View style={styles.inputWrapper}>
//               <TouchableOpacity 
//                 style={styles.emojiButton} 
//                 onPress={() => setShowEmojiPicker(!showEmojiPicker)}
//                 accessibilityLabel="Toggle Emoji Picker"
//               >
//                 <Ionicons name="happy-outline" size={24} color="#2E7D32" />
//               </TouchableOpacity>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Type your message..."
//                 value={newMessage}
//                 onChangeText={handleTyping}
//                 placeholderTextColor="#A3C4BC"
//                 keyboardType="default"
//                 autoCorrect={true}
//                 accessibilityLabel="Chat Input"
//                 onBlur={() => setIsTyping(false)} // Stop typing when focus leaves
//               />
//               <TouchableOpacity 
//                 style={styles.attachmentButton} 
//                 onPress={pickAttachment}
//                 accessibilityLabel="Add Attachment"
//               >
//                 <Ionicons name="attach-outline" size={24} color="#2E7D32" />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity 
//               style={styles.sendButton} 
//               onPress={handleSend}
//               accessibilityLabel="Send Message Button"
//             >
//               <Text style={styles.sendButtonText}>Send</Text>
//             </TouchableOpacity>
//             {showEmojiPicker && (
//               <View style={styles.emojiPicker}>
//                 {['😊', '😂', '🌱', '🍃', '❤️', '🌿', '🌼'].map(emoji => (
//                   <TouchableOpacity 
//                     key={emoji} 
//                     style={styles.emojiItem} 
//                     onPress={() => addEmoji(emoji)}
//                     accessibilityLabel={`Add ${emoji} emoji`}
//                   >
//                     <Text style={styles.emoji}>{emoji}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </Animated.View>

//           {Object.keys(typingUsers).length > 0 && (
//             <Animated.View style={[styles.typingIndicator, { opacity: typingAnim }]}>
//               <Text style={styles.typingText}>
//                 {Object.keys(typingUsers).map(userId => senderNames[userId] || 'Someone').join(', ')} is typing...
//               </Text>
//               <View style={styles.typingDots}>
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim }] }]} />
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] }) }] }]} />
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }] }]} />
//               </View>
//             </Animated.View>
//           )}
//         </LinearGradient>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   keyboardAvoidingContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight, // Account for status bar in Expo
//   },
//   background: {
//     flex: 1,
//     backgroundImage: 'linear-gradient(to bottom, rgba(232, 245, 233, 0.95), rgba(200, 230, 201, 0.95))', // Softer, more polished green overlay
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 18,
//     paddingHorizontal: 24,
//     backgroundColor: 'rgba(46, 125, 50, 0.12)', // Slightly more pronounced green overlay for elegance
//     borderBottomWidth: 1.5,
//     borderBottomColor: '#C8E6C9',
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   headerLogo: {
//     width: 32,
//     height: 32,
//     marginRight: 12,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#2E7D32', // Soft green for a natural feel
//     textShadowColor: 'rgba(0, 0, 0, 0.03)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   chatList: {
//     flex: 1,
//     paddingHorizontal: 12,
//   },
//   chatContent: {
//     paddingVertical: 12,
//     paddingBottom: 24,
//   },
//   messageBubble: {
//     padding: 14,
//     borderRadius: 20, // Slightly more rounded for a premium look
//     marginVertical: 8,
//     maxWidth: '78%',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle white overlay for softness
//   },
//   userMessage: {
//     backgroundColor: '#4CAF50', // Bright, soothing green for current user
//     alignSelf: 'flex-end',
//     marginRight: 12,
//   },
//   botMessage: {
//     backgroundColor: '#C8E6C9', // Soft, light green for others
//     alignSelf: 'flex-start',
//     marginLeft: 12,
//   },
//   senderName: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#285430', // Deep green for contrast, polished
//     marginBottom: 6,
//     textShadowColor: 'rgba(0, 0, 0, 0.03)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 1,
//   },
//   messageContent: {
//     flexDirection: 'column',
//   },
//   messageText: {
//     fontSize: 15,
//     color: '#FFFFFF', // White for readability on green
//     marginBottom: 6,
//     lineHeight: 20, // Enhanced readability
//   },
//   emojiContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 6,
//   },
//   emoji: {
//     fontSize: 22, // Slightly larger for visibility
//     marginRight: 6,
//     padding: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)', // Subtle white background for contrast
//     borderRadius: 12, // Rounded for a polished look
//     borderWidth: 1,
//     borderColor: 'rgba(46, 125, 50, 0.3)', // Subtle green border
//   },
//   attachmentPreview: {
//     marginTop: 6,
//     alignItems: 'center',
//   },
//   attachmentImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginBottom: 4,
//   },
//   attachmentText: {
//     fontSize: 13,
//     color: '#2E7D32', // Soft green for consistency
//     fontWeight: '600',
//   },
//   timestamp: {
//     fontSize: 11,
//     color: '#FFFFFF', // White for readability on green
//     alignSelf: 'flex-end',
//     opacity: 0.7,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1.5,
//     borderTopColor: '#C8E6C9',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   inputWrapper: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5', // Light green for a clean look
//     borderRadius: 22, // Slightly larger for elegance
//     paddingHorizontal: 10,
//     marginRight: 10,
//     borderWidth: 1.5,
//     borderColor: 'rgba(46, 125, 50, 0.15)', // Subtle green border
//   },
//   emojiButton: {
//     padding: 10,
//   },
//   attachmentButton: {
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     height: 42,
//     backgroundColor: 'transparent',
//     paddingHorizontal: 14,
//     color: '#2E7D32', // Soft green for text
//     fontSize: 15,
//   },
//   sendButton: {
//     backgroundColor: '#2E7D32', // Soft green, polished and soothing
//     paddingVertical: 12,
//     paddingHorizontal: 18,
//     borderRadius: 22, // Slightly larger for elegance
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   sendButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700', // Bolder for premium feel
//   },
//   emojiPicker: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 12,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1.5,
//     borderTopColor: '#C8E6C9',
//     borderRadius: 12,
//     marginTop: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   emojiItem: {
//     padding: 10,
//   },
//   typingIndicator: {
//     padding: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 12,
//     marginHorizontal: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   typingText: {
//     fontSize: 14,
//     color: '#285430', // Deep green for consistency
//     marginBottom: 6,
//   },
//   typingDots: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   dot: {
//     width: 6,
//     height: 6,
//     backgroundColor: '#285430', // Deep green for dots
//     borderRadius: 3,
//     marginHorizontal: 2,
//   },
// });






//Main code for this screen

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Easing,
//   Modal,
//   Dimensions,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Expo-native gradient
// import { collection, addDoc, query, orderBy, onSnapshot, getDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { auth, db } from './firebaseConfig'; // Ensure firebaseConfig includes both auth and db
// import Constants from 'expo-constants'; // For status bar height
// import { Ionicons } from '@expo/vector-icons'; // For emojis and attachments
// import * as ImagePicker from 'expo-image-picker'; // For attachments
// import * as FileSystem from 'expo-file-system'; // For reading file as base64

// export default function ChatScreen({ navigation }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [senderNames, setSenderNames] = useState({}); // Store sender names by userId
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false); // For emoji picker
//   const [attachment, setAttachment] = useState(null); // For attachments (base64 string)
//   const [typingUsers, setTypingUsers] = useState({}); // For typing indicators
//   const [isTyping, setIsTyping] = useState(false); // Track current user typing
//   const [selectedImage, setSelectedImage] = useState(null); // For displaying full image in modal
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const messageAnims = useRef({}).current; // Object to store animation values for each message
//   const inputAnim = useRef(new Animated.Value(0)).current;
//   const typingAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Fetch current user's name from Firestore
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setSenderNames(prev => ({ ...prev, [user.uid]: userData.name || 'Unknown User' }));
//           } else {
//             setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//           }
//         } catch (error) {
//           console.error('Error fetching user name: ', error);
//           setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//         }
//       }
//     };

//     fetchUserData();

//     // Firestore query to listen for real-time updates
//     const q = query(collection(db, "chatMessages"), orderBy("timestamp", "desc"));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const messagesArray = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         text: doc.data().text || '',
//         userId: doc.data().userId || null,
//         timestamp: doc.data().timestamp || serverTimestamp(),
//         emojis: doc.data().emojis || [],
//         attachmentBase64: doc.data().attachmentBase64 || null, // Store base64 string
//       }));
//       setMessages(messagesArray);
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();

//       messagesArray.forEach(async (message) => {
//         if (message.userId && !senderNames[message.userId]) {
//           try {
//             const userDoc = await getDoc(doc(db, 'users', message.userId));
//             if (userDoc.exists()) {
//               const userData = userDoc.data();
//               setSenderNames(prev => ({ ...prev, [message.userId]: userData.name || 'Unknown User' }));
//             } else {
//               setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//             }
//           } catch (error) {
//             console.error('Error fetching sender name: ', error);
//             setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//           }
//         }
//       });
//     });

//     // Simulate typing indicators (replace with real-time logic in production)
//     const typingUnsubscribe = onSnapshot(query(collection(db, "typingStatus"), orderBy("timestamp", "desc")), (snapshot) => {
//       const typing = {};
//       snapshot.forEach(doc => {
//         const data = doc.data();
//         if (data.userId !== auth.currentUser?.uid && Date.now() - data.timestamp.toDate().getTime() < 5000) {
//           typing[data.userId] = true;
//         }
//       });
//       setTypingUsers(typing);
//     });

//     // Animate input area on mount
//     Animated.timing(inputAnim, {
//       toValue: 1,
//       duration: 1000,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();

//     // Animate typing indicator
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(typingAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(typingAnim, {
//           toValue: 0,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     return () => {
//       unsubscribe();
//       if (typingUnsubscribe) typingUnsubscribe();
//     }; // Cleanup listeners on unmount
//   }, [fadeAnim, senderNames, inputAnim, typingAnim]);

//   useEffect(() => {
//     // Initialize or reset animation values for new messages
//     messages.forEach((message) => {
//       if (!messageAnims[message.id]) {
//         messageAnims[message.id] = new Animated.Value(0);
//         Animated.timing(messageAnims[message.id], {
//           toValue: 1,
//           duration: 500,
//           easing: Easing.out(Easing.exp),
//           useNativeDriver: true,
//         }).start();
//       }
//     });
//   }, [messages, messageAnims]);

//   const handleSend = async () => {
//     if (newMessage.trim() === "" && !attachment) return;

//     const user = auth.currentUser;
//     if (!user) {
//       console.error('No authenticated user found');
//       return;
//     }

//     try {
//       await addDoc(collection(db, "chatMessages"), {
//         text: newMessage.trim(),
//         userId: user.uid,
//         timestamp: serverTimestamp(),
//         emojis: [],
//         attachmentBase64: attachment || null, // Store base64 string directly in Firestore
//       });

//       // Simulate typing status (optional, replace with real-time in production)
//       await addDoc(collection(db, "typingStatus"), {
//         userId: user.uid,
//         timestamp: serverTimestamp(),
//       });

//       // Clear the input field immediately after sending
//       setNewMessage("");
//       setAttachment(null);
//       setShowEmojiPicker(false);
//       setIsTyping(false);
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   const addEmoji = (emoji) => {
//     setNewMessage(prev => prev + emoji);
//   };

//   const handleTyping = (text) => {
//     setNewMessage(text);
//     setIsTyping(text.length > 0);
//     if (text.length > 0) {
//       // Simulate typing status (replace with real-time in production)
//       addDoc(collection(db, "typingStatus"), {
//         userId: auth.currentUser?.uid,
//         timestamp: serverTimestamp(),
//       });
//     }
//   };

//   const pickAttachment = async () => {
//     try {
//       // Request media library permissions
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'We need permission to access your photos to attach images.');
//         return;
//       }

//       // Launch image picker
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images, // Using MediaTypeOptions.Images despite deprecation warning
//         allowsEditing: false, // Disable editing to prevent cropping
//         quality: 0.5, // Reduced quality to keep base64 size smaller
//       });

//       if (!result.canceled) {
//         const uri = result.assets[0].uri;
//         // Convert the image to base64
//         const base64 = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });
//         const base64WithPrefix = `data:image/jpeg;base64,${base64}`; // Add prefix for rendering
//         setAttachment(base64WithPrefix); // Store the base64 string
//       }
//     } catch (error) {
//       console.error("Error picking attachment: ", error);
//       Alert.alert('Error', 'Failed to pick an image. Please try again.');
//     }
//   };

//   const removeAttachment = () => {
//     setAttachment(null); // Clear the selected image
//   };

//   const renderMessage = ({ item }) => {
//     const isCurrentUser = item.userId === auth.currentUser?.uid;
//     const senderName = senderNames[item.userId] || 'Unknown User';

//     return (
//       <Animated.View 
//         style={[
//           styles.messageBubble,
//           isCurrentUser ? styles.userMessage : styles.botMessage,
//           { 
//             opacity: messageAnims[item.id] || 1,
//             transform: [{ scale: messageAnims[item.id]?.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) || 1 }],
//           },
//         ]}
//       >
//         <Text style={styles.senderName}>{senderName}</Text>
//         <View style={styles.messageContent}>
//           <Text style={styles.messageText}>{item.text || 'No message content'}</Text>
//           {item.emojis.length > 0 && (
//             <View style={styles.emojiContainer}>
//               {item.emojis.map((emoji, index) => (
//                 <Text key={index} style={styles.emoji}>{emoji}</Text>
//               ))}
//             </View>
//           )}
//           {item.attachmentBase64 && (
//             <TouchableOpacity 
//               style={styles.attachmentPreview} 
//               onPress={() => setSelectedImage(item.attachmentBase64)} // Open modal on tap
//             >
//               <Image 
//                 source={{ uri: item.attachmentBase64 }} 
//                 style={styles.attachmentImage} 
//                 onError={(e) => console.log('Attachment failed to load:', e.nativeEvent.error)}
//               />
//               <Text style={styles.attachmentText}>📷 Attachment</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <Text style={styles.timestamp}>
//           {new Date(item.timestamp?.toDate?.() || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </Text>
//       </Animated.View>
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.keyboardAvoidingContainer}
//     >
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#E8F5E9', '#C8E6C9']} // Soft green gradient for a natural feel
//           style={styles.background}
//         >
//           <View style={styles.header}>
//             <Image
//               source={require("./assets/plant-leaf.png")}
//               style={styles.headerLogo}
//               onError={(e) => console.log('Logo failed to load:', e.nativeEvent.error)}
//             />
//             <Text style={styles.headerTitle}>PlantPal Chat</Text>
//           </View>

//           <FlatList
//             data={messages}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id}
//             inverted // Show latest messages at the bottom
//             style={styles.chatList}
//             contentContainerStyle={styles.chatContent}
//           />

//           <Animated.View style={[styles.inputContainer, { opacity: inputAnim, transform: [{ translateY: inputAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
//             <View style={styles.inputWrapper}>
//               <TouchableOpacity 
//                 style={styles.emojiButton} 
//                 onPress={() => setShowEmojiPicker(!showEmojiPicker)}
//                 accessibilityLabel="Toggle Emoji Picker"
//               >
//                 <Ionicons name="happy-outline" size={24} color="#2E7D32" />
//               </TouchableOpacity>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Type your message..."
//                 value={newMessage}
//                 onChangeText={handleTyping}
//                 placeholderTextColor="#A3C4BC"
//                 keyboardType="default"
//                 autoCorrect={true}
//                 accessibilityLabel="Chat Input"
//                 onBlur={() => setIsTyping(false)} // Stop typing when focus leaves
//               />
//               <TouchableOpacity 
//                 style={styles.attachmentButton} 
//                 onPress={pickAttachment}
//                 accessibilityLabel="Add Attachment"
//               >
//                 <Ionicons name="attach-outline" size={24} color="#2E7D32" />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity 
//               style={styles.sendButton} 
//               onPress={handleSend}
//               accessibilityLabel="Send Message Button"
//             >
//               <Text style={styles.sendButtonText}>Send</Text>
//             </TouchableOpacity>
//             {showEmojiPicker && (
//               <View style={styles.emojiPicker}>
//                 {['😊', '😂', '🌱', '🍃', '❤️', '🌿', '🌼'].map(emoji => (
//                   <TouchableOpacity 
//                     key={emoji} 
//                     style={styles.emojiItem} 
//                     onPress={() => addEmoji(emoji)}
//                     accessibilityLabel={`Add ${emoji} emoji`}
//                   >
//                     <Text style={styles.emoji}>{emoji}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//             {attachment && (
//               <View style={styles.attachmentPreviewInput}>
//                 <Image 
//                   source={{ uri: attachment }} 
//                   style={styles.attachmentImageInput} 
//                   onError={(e) => console.log('Attachment preview failed to load:', e.nativeEvent.error)}
//                 />
//                 <TouchableOpacity 
//                   style={styles.removeAttachmentButton} 
//                   onPress={removeAttachment}
//                   accessibilityLabel="Remove Attachment"
//                 >
//                   <Ionicons name="close-circle-outline" size={24} color="#2E7D32" />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </Animated.View>

//           {Object.keys(typingUsers).length > 0 && (
//             <Animated.View style={[styles.typingIndicator, { opacity: typingAnim }]}>
//               <Text style={styles.typingText}>
//                 {Object.keys(typingUsers).map(userId => senderNames[userId] || 'Someone').join(', ')} is typing...
//               </Text>
//               <View style={styles.typingDots}>
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim }] }]} />
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] }) }] }]} />
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }] }]} />
//               </View>
//             </Animated.View>
//           )}
//         </LinearGradient>

//         {/* Modal for viewing full image */}
//         <Modal
//           visible={!!selectedImage}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => setSelectedImage(null)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Image
//                 source={{ uri: selectedImage }}
//                 style={styles.fullImage}
//                 resizeMode="contain"
//                 onError={(e) => console.log('Full image failed to load:', e.nativeEvent.error)}
//               />
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setSelectedImage(null)}
//                 accessibilityLabel="Close Image Modal"
//               >
//                 <Ionicons name="close-circle-outline" size={30} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const { width, height } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   keyboardAvoidingContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight, // Account for status bar in Expo
//   },
//   background: {
//     flex: 1,
//     backgroundImage: 'linear-gradient(to bottom, rgba(232, 245, 233, 0.95), rgba(200, 230, 201, 0.95))', // Softer, more polished green overlay
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 18,
//     paddingHorizontal: 24,
//     backgroundColor: 'rgba(46, 125, 50, 0.12)', // Slightly more pronounced green overlay for elegance
//     borderBottomWidth: 1.5,
//     borderBottomColor: '#C8E6C9',
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   headerLogo: {
//     width: 32,
//     height: 32,
//     marginRight: 12,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#2E7D32', // Soft green for a natural feel
//     textShadowColor: 'rgba(0, 0, 0, 0.03)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   chatList: {
//     flex: 1,
//     paddingHorizontal: 12,
//   },
//   chatContent: {
//     paddingVertical: 12,
//     paddingBottom: 24,
//   },
//   messageBubble: {
//     padding: 14,
//     borderRadius: 20, // Slightly more rounded for a premium look
//     marginVertical: 8,
//     maxWidth: '78%',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle white overlay for softness
//   },
//   userMessage: {
//     backgroundColor: '#4CAF50', // Bright, soothing green for current user
//     alignSelf: 'flex-end',
//     marginRight: 12,
//   },
//   botMessage: {
//     backgroundColor: '#C8E6C9', // Soft, light green for others
//     alignSelf: 'flex-start',
//     marginLeft: 12,
//   },
//   senderName: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#285430', // Deep green for contrast, polished
//     marginBottom: 6,
//     textShadowColor: 'rgba(0, 0, 0, 0.03)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 1,
//   },
//   messageContent: {
//     flexDirection: 'column',
//   },
//   messageText: {
//     fontSize: 15,
//     color: '#FFFFFF', // White for readability on green
//     marginBottom: 6,
//     lineHeight: 20, // Enhanced readability
//   },
//   emojiContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 6,
//   },
//   emoji: {
//     fontSize: 22, // Slightly larger for visibility
//     marginRight: 6,
//     padding: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)', // Subtle white background for contrast
//     borderRadius: 12, // Rounded for a polished look
//     borderWidth: 1,
//     borderColor: 'rgba(46, 125, 50, 0.3)', // Subtle green border
//   },
//   attachmentPreview: {
//     marginTop: 6,
//     alignItems: 'center',
//   },
//   attachmentImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginBottom: 4,
//   },
//   attachmentText: {
//     fontSize: 13,
//     color: '#2E7D32', // Soft green for consistency
//     fontWeight: '600',
//   },
//   timestamp: {
//     fontSize: 11,
//     color: '#FFFFFF', // White for readability on green
//     alignSelf: 'flex-end',
//     opacity: 0.7,
//   },
//   inputContainer: {
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1.5,
//     borderTopColor: '#C8E6C9',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5', // Light green for a clean look
//     borderRadius: 22, // Slightly larger for elegance
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     borderWidth: 1.5,
//     borderColor: 'rgba(46, 125, 50, 0.15)', // Subtle green border
//   },
//   emojiButton: {
//     padding: 10,
//   },
//   attachmentButton: {
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     height: 42,
//     backgroundColor: 'transparent',
//     paddingHorizontal: 14,
//     color: '#2E7D32', // Soft green for text
//     fontSize: 15,
//   },
//   sendButton: {
//     backgroundColor: '#2E7D32', // Soft green, polished and soothing
//     paddingVertical: 12,
//     paddingHorizontal: 18,
//     borderRadius: 22, // Slightly larger for elegance
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 5,
//     alignSelf: 'center',
//   },
//   sendButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700', // Bolder for premium feel
//   },
//   emojiPicker: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 12,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1.5,
//     borderTopColor: '#C8E6C9',
//     borderRadius: 12,
//     marginTop: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   emojiItem: {
//     padding: 10,
//   },
//   attachmentPreviewInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 10,
//     padding: 5,
//   },
//   attachmentImageInput: {
//     width: 50,
//     height: 50,
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   removeAttachmentButton: {
//     padding: 5,
//   },
//   typingIndicator: {
//     padding: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 12,
//     marginHorizontal: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   typingText: {
//     fontSize: 14,
//     color: '#285430', // Deep green for consistency
//     marginBottom: 6,
//   },
//   typingDots: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   dot: {
//     width: 6,
//     height: 6,
//     backgroundColor: '#285430', // Deep green for dots
//     borderRadius: 3,
//     marginHorizontal: 2,
//   },
//   // Modal styles for full image view
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark overlay
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: width * 0.9,
//     height: height * 0.7,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   fullImage: {
//     width: '100%',
//     height: '100%',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 15,
//     padding: 5,
//   },
// });




// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Easing,
//   Modal,
//   Dimensions,
//   PanResponder,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Expo-native gradient
// import { collection, addDoc, query, orderBy, onSnapshot, getDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { auth, db } from './firebaseConfig'; // Ensure firebaseConfig includes both auth and db
// import Constants from 'expo-constants'; // For status bar height
// import { Ionicons } from '@expo/vector-icons'; // For emojis and attachments
// import * as ImagePicker from 'expo-image-picker'; // For attachments
// import * as FileSystem from 'expo-file-system'; // For reading file as base64

// // Memoized Message Item Component to prevent unnecessary re-renders
// const MessageItem = React.memo(({ item, isCurrentUser, senderName, repliedMessage, messageAnims, translateXAnims, createPanResponder }) => {
//   const panResponder = createPanResponder(item);

//   return (
//     <Animated.View
//       style={{
//         transform: [{ translateX: translateXAnims[item.id] || 0 }],
//       }}
//       {...panResponder.panHandlers}
//     >
//       <Animated.View
//         style={[
//           styles.messageBubble,
//           isCurrentUser ? styles.userMessage : styles.botMessage,
//           {
//             opacity: messageAnims[item.id] || 1,
//             transform: [{ scale: messageAnims[item.id]?.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) || 1 }],
//           },
//         ]}
//       >
//         {repliedMessage && (
//           <View style={styles.replyContainer}>
//             <View style={styles.replyIndicator} />
//             <Text style={styles.replyText}>
//               Replying to {senderName}: {repliedMessage.text || (repliedMessage.attachmentBase64 ? 'Attachment' : '')}
//             </Text>
//           </View>
//         )}
//         <Text style={styles.senderName}>{senderName}</Text>
//         <View style={styles.messageContent}>
//           {item.text ? (
//             <Text style={styles.messageText}>{item.text}</Text>
//           ) : !item.attachmentBase64 && (
//             <Text style={styles.messageText}>No message content</Text>
//           )}
//           {item.emojis.length > 0 && (
//             <View style={styles.emojiContainer}>
//               {item.emojis.map((emoji, index) => (
//                 <Text key={index} style={styles.emoji}>{emoji}</Text>
//               ))}
//             </View>
//           )}
//           {item.attachmentBase64 && (
//             <TouchableOpacity
//               style={styles.attachmentPreview}
//               onPress={() => item.onPressAttachment(item.attachmentBase64)}
//             >
//               <Image
//                 source={{ uri: item.attachmentBase64 }}
//                 style={styles.attachmentImage}
//                 onError={(e) => console.log('Attachment failed to load:', e.nativeEvent.error)}
//               />
//               <Text style={styles.attachmentText}>📷 Attachment</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <Text style={styles.timestamp}>
//           {new Date(item.timestamp?.toDate?.() || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </Text>
//       </Animated.View>
//     </Animated.View>
//   );
// });

// export default function ChatScreen({ navigation }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [senderNames, setSenderNames] = useState({}); // Store sender names by userId
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false); // For emoji picker
//   const [attachment, setAttachment] = useState(null); // For attachments (base64 string)
//   const [typingUsers, setTypingUsers] = useState({}); // For typing indicators
//   const [isTyping, setIsTyping] = useState(false); // Track current user typing
//   const [selectedImage, setSelectedImage] = useState(null); // For displaying full image in modal
//   const [replyToMessage, setReplyToMessage] = useState(null); // For replying to a specific message
//   const [currentlySlidingMessage, setCurrentlySlidingMessage] = useState(null); // Track the currently sliding message
//   const flatListRef = useRef(null); // Ref to control FlatList scrolling
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const messageAnims = useRef({}).current; // Object to store animation values for each message
//   const translateXAnims = useRef({}).current; // Object to store translateX animations for each message
//   const inputAnim = useRef(new Animated.Value(0)).current;
//   const typingAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Fetch current user's name from Firestore
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setSenderNames(prev => ({ ...prev, [user.uid]: userData.name || 'Unknown User' }));
//           } else {
//             setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//           }
//         } catch (error) {
//           console.error('Error fetching user name: ', error);
//           setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//         }
//       }
//     };

//     fetchUserData();

//     // Firestore query to listen for real-time updates (from provided code)
//     const q = query(collection(db, "chatMessages"), orderBy("timestamp", "desc")); // Descending order for newest messages at the bottom

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const messagesArray = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         text: doc.data().text || '',
//         userId: doc.data().userId || null,
//         timestamp: doc.data().timestamp || serverTimestamp(),
//         emojis: doc.data().emojis || [],
//         attachmentBase64: doc.data().attachmentBase64 || null,
//         replyTo: doc.data().replyTo || null,
//         onPressAttachment: setSelectedImage, // Pass the callback as a prop
//       }));
//       // console.log('Fetched messages:', messagesArray.length, messagesArray.map(msg => msg.id)); // Debug log
//       setMessages(messagesArray);
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();

//       messagesArray.forEach(async (message) => {
//         if (message.userId && !senderNames[message.userId]) {
//           try {
//             const userDoc = await getDoc(doc(db, 'users', message.userId));
//             if (userDoc.exists()) {
//               const userData = userDoc.data();
//               setSenderNames(prev => ({ ...prev, [message.userId]: userData.name || 'Unknown User' }));
//             } else {
//               setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//             }
//           } catch (error) {
//             console.error('Error fetching sender name: ', error);
//             setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//           }
//         }
//       });
//     });

//     // Simulate typing indicators (replace with real-time logic in production)
//     const typingUnsubscribe = onSnapshot(query(collection(db, "typingStatus"), orderBy("timestamp", "desc")), (snapshot) => {
//       const typing = {};
//       snapshot.forEach(doc => {
//         const data = doc.data();
//         if (data.userId !== auth.currentUser?.uid && Date.now() - data.timestamp.toDate().getTime() < 5000) {
//           typing[data.userId] = true;
//         }
//       });
//       setTypingUsers(typing);
//     });

//     // Animate input area on mount
//     Animated.timing(inputAnim, {
//       toValue: 1,
//       duration: 1000,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();

//     // Animate typing indicator
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(typingAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(typingAnim, {
//           toValue: 0,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     return () => {
//       unsubscribe();
//       if (typingUnsubscribe) typingUnsubscribe();
//     };
//   }, [fadeAnim, senderNames, inputAnim, typingAnim]);

//   useEffect(() => {
//     // Initialize or reset animation values for new messages
//     messages.forEach((message) => {
//       if (!messageAnims[message.id]) {
//         messageAnims[message.id] = new Animated.Value(0);
//         Animated.timing(messageAnims[message.id], {
//           toValue: 1,
//           duration: 500,
//           easing: Easing.out(Easing.exp),
//           useNativeDriver: true,
//         }).start();
//       }
//       if (!translateXAnims[message.id]) {
//         translateXAnims[message.id] = new Animated.Value(0);
//       }
//     });

//     // Reset translateX for all messages when replyToMessage changes
//     if (replyToMessage) {
//       Object.keys(translateXAnims).forEach((key) => {
//         if (key !== replyToMessage.id) {
//           Animated.spring(translateXAnims[key], {
//             toValue: 0,
//             friction: 8,
//             useNativeDriver: true,
//           }).start();
//         }
//       });
//     } else {
//       Object.keys(translateXAnims).forEach((key) => {
//         Animated.spring(translateXAnims[key], {
//           toValue: 0,
//           friction: 8,
//           useNativeDriver: true,
//         }).start();
//       });
//     }
//   }, [messages, replyToMessage]);

//   const handleSend = async () => {
//     if (newMessage.trim() === "" && !attachment) return;

//     const user = auth.currentUser;
//     if (!user) {
//       console.error('No authenticated user found');
//       return;
//     }

//     try {
//       await addDoc(collection(db, "chatMessages"), {
//         text: newMessage.trim(),
//         userId: user.uid,
//         timestamp: serverTimestamp(),
//         emojis: [],
//         attachmentBase64: attachment || null,
//         replyTo: replyToMessage ? replyToMessage.id : null,
//       });

//       await addDoc(collection(db, "typingStatus"), {
//         userId: user.uid,
//         timestamp: serverTimestamp(),
//       });

//       setNewMessage("");
//       setAttachment(null);
//       setShowEmojiPicker(false);
//       setIsTyping(false);
//       setReplyToMessage(null);
//       setCurrentlySlidingMessage(null);
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   const addEmoji = (emoji) => {
//     setNewMessage(prev => prev + emoji);
//   };

//   const handleTyping = (text) => {
//     setNewMessage(text);
//     setIsTyping(text.length > 0);
//     if (text.length > 0) {
//       addDoc(collection(db, "typingStatus"), {
//         userId: auth.currentUser?.uid,
//         timestamp: serverTimestamp(),
//       });
//     }
//   };

//   const pickAttachment = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'We need permission to access your photos to attach images.');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: false,
//         quality: 0.5,
//       });

//       if (!result.canceled) {
//         const uri = result.assets[0].uri;
//         const base64 = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });
//         const base64WithPrefix = `data:image/jpeg;base64,${base64}`;
//         setAttachment(base64WithPrefix);
//       }
//     } catch (error) {
//       console.error("Error picking attachment: ", error);
//       Alert.alert('Error', 'Failed to pick an image. Please try again.');
//     }
//   };

//   const removeAttachment = () => {
//     setAttachment(null);
//   };

//   const createPanResponder = useCallback((message) => {
//     const translateX = translateXAnims[message.id] || new Animated.Value(0);
//     return PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         // Reset all other messages' translateX when a new slide starts
//         if (currentlySlidingMessage && currentlySlidingMessage !== message.id) {
//           Animated.spring(translateXAnims[currentlySlidingMessage], {
//             toValue: 0,
//             friction: 8,
//             useNativeDriver: true,
//           }).start();
//         }
//         setCurrentlySlidingMessage(message.id);
//       },
//       onPanResponderMove: (evt, gestureState) => {
//         if (gestureState.dx > 0) {
//           translateX.setValue(Math.min(gestureState.dx, 50));
//         }
//       },
//       onPanResponderRelease: (evt, gestureState) => {
//         if (gestureState.dx > 50) {
//           setReplyToMessage(message);
//           Animated.timing(translateX, {
//             toValue: 50,
//             duration: 100,
//             useNativeDriver: true,
//           }).start();
//         } else {
//           Animated.spring(translateX, {
//             toValue: 0,
//             friction: 8,
//             useNativeDriver: true,
//           }).start(() => {
//             setCurrentlySlidingMessage(null);
//           });
//         }
//       },
//     });
//   }, [currentlySlidingMessage]);

//   // Reset all translateX animations when scrolling starts
//   const handleScrollBeginDrag = () => {
//     if (currentlySlidingMessage) {
//       Animated.spring(translateXAnims[currentlySlidingMessage], {
//         toValue: 0,
//         friction: 8,
//         useNativeDriver: true,
//       }).start();
//       setCurrentlySlidingMessage(null);
//     }
//   };

//   let renderCount = 0; // Debug counter for rendered items
//   const renderMessage = ({ item }) => {
//     renderCount++;
//     // console.log(`Rendering message ${renderCount}: ${item.id}`); // Debug log
//     const isCurrentUser = item.userId === auth.currentUser?.uid;
//     const senderName = senderNames[item.userId] || 'Unknown User';
//     const repliedMessage = item.replyTo ? messages.find(msg => msg.id === item.replyTo) : null;

//     return (
//       <MessageItem
//         item={item}
//         isCurrentUser={isCurrentUser}
//         senderName={senderName}
//         repliedMessage={repliedMessage}
//         messageAnims={messageAnims}
//         translateXAnims={translateXAnims}
//         createPanResponder={createPanResponder}
//       />
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.keyboardAvoidingContainer}
//     >
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#D4E7D5', '#AEDCB1']}
//           style={styles.background}
//         >
//           <View style={styles.header}>
//             <Image
//               source={require("./assets/plant-leaf.png")}
//               style={styles.headerLogo}
//               onError={(e) => console.log('Logo failed to load:', e.nativeEvent.error)}
//             />
//             <Text style={styles.headerTitle}>PlantPal Chat</Text>
//           </View>

//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id}
//             inverted // Show newest messages at the bottom (from provided code)
//             style={styles.chatList}
//             contentContainerStyle={styles.chatContent}
//             onScrollBeginDrag={handleScrollBeginDrag} // Reset slide animations when scrolling starts
//             scrollEventThrottle={16}
//           />

//           <Animated.View style={[styles.inputContainer, { opacity: inputAnim, transform: [{ translateY: inputAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
//             {replyToMessage && (
//               <View style={styles.replyInputContainer}>
//                 <Text style={styles.replyInputText}>
//                   Replying to {senderNames[replyToMessage.userId] || 'Unknown User'}: {replyToMessage.text || (replyToMessage.attachmentBase64 ? 'Attachment' : '')}
//                 </Text>
//                 <TouchableOpacity onPress={() => setReplyToMessage(null)} style={styles.cancelReplyButton}>
//                   <Ionicons name="close" size={20} color="#D32F2F" />
//                 </TouchableOpacity>
//               </View>
//             )}
//             <View style={styles.inputRow}>
//               <View style={styles.inputWrapper}>
//                 <TouchableOpacity 
//                   style={styles.emojiButton} 
//                   onPress={() => setShowEmojiPicker(!showEmojiPicker)}
//                   accessibilityLabel="Toggle Emoji Picker"
//                 >
//                   <Ionicons name="happy-outline" size={24} color="#388E3C" />
//                 </TouchableOpacity>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Type your message..."
//                   value={newMessage}
//                   onChangeText={handleTyping}
//                   placeholderTextColor="#A5D6A7"
//                   keyboardType="default"
//                   autoCorrect={true}
//                   accessibilityLabel="Chat Input"
//                   onBlur={() => setIsTyping(false)}
//                 />
//                 <TouchableOpacity 
//                   style={styles.attachmentButton} 
//                   onPress={pickAttachment}
//                   accessibilityLabel="Add Attachment"
//                 >
//                   <Ionicons name="attach-outline" size={24} color="#388E3C" />
//                 </TouchableOpacity>
//               </View>
//               <TouchableOpacity 
//                 style={styles.sendButton} 
//                 onPress={handleSend}
//                 accessibilityLabel="Send Message Button"
//               >
//                 <Ionicons name="send" size={20} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
//             {showEmojiPicker && (
//               <View style={styles.emojiPicker}>
//                 {['😊', '😂', '🌱', '🍃', '❤️', '🌿', '🌼'].map(emoji => (
//                   <TouchableOpacity 
//                     key={emoji} 
//                     style={styles.emojiItem} 
//                     onPress={() => addEmoji(emoji)}
//                     accessibilityLabel={`Add ${emoji} emoji`}
//                   >
//                     <Text style={styles.emoji}>{emoji}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//             {attachment && (
//               <View style={styles.attachmentPreviewInput}>
//                 <Image 
//                   source={{ uri: attachment }} 
//                   style={styles.attachmentImageInput} 
//                   onError={(e) => console.log('Attachment preview failed to load:', e.nativeEvent.error)}
//                 />
//                 <TouchableOpacity 
//                   style={styles.removeAttachmentButton} 
//                   onPress={removeAttachment}
//                   accessibilityLabel="Remove Attachment"
//                 >
//                   <Ionicons name="close-circle-outline" size={24} color="#D32F2F" />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </Animated.View>

//           {Object.keys(typingUsers).length > 0 && (
//             <Animated.View style={[styles.typingIndicator, { opacity: typingAnim }]}>
//               <Text style={styles.typingText}>
//                 {Object.keys(typingUsers).map(userId => senderNames[userId] || 'Someone').join(', ')} is typing
//               </Text>
//               <View style={styles.typingDots}>
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim }] }]} />
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] }) }] }]} />
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }] }]} />
//               </View>
//             </Animated.View>
//           )}
//         </LinearGradient>

//         {/* Modal for viewing full image */}
//         <Modal
//           visible={!!selectedImage}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => setSelectedImage(null)}
//         >
//           <View style={styles.modalContainer}>
//             <Image
//               source={{ uri: selectedImage }}
//               style={styles.fullImage}
//               resizeMode="contain"
//               onError={(e) => console.log('Full image failed to load:', e.nativeEvent.error)}
//             />
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setSelectedImage(null)}
//               accessibilityLabel="Close Image Modal"
//             >
//               <Ionicons name="close-circle-outline" size={30} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>
//         </Modal>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const { width, height } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   keyboardAvoidingContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight,
//   },
//   background: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     backgroundColor: '#F1F8E9',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   headerLogo: {
//     width: 32,
//     height: 32,
//     marginRight: 12,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#1B5E20',
//     fontFamily: 'System',
//   },
//   chatList: {
//     flex: 1,
//     paddingHorizontal: 15,
//   },
//   chatContent: {
//     paddingVertical: 20,
//     paddingBottom: 30,
//   },
//   messageBubble: {
//     padding: 12,
//     borderRadius: 20,
//     marginVertical: 6,
//     maxWidth: '80%',
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   userMessage: {
//     backgroundColor: '#4CAF50',
//     alignSelf: 'flex-end',
//     marginRight: 10,
//     borderTopRightRadius: 5,
//   },
//   botMessage: {
//     backgroundColor: '#FFFFFF',
//     alignSelf: 'flex-start',
//     marginLeft: 10,
//     borderTopLeftRadius: 5,
//   },
//   replyContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.05)',
//     padding: 8,
//     borderRadius: 10,
//     marginBottom: 8,
//   },
//   replyIndicator: {
//     width: 4,
//     height: '100%',
//     backgroundColor: '#388E3C',
//     marginRight: 8,
//     borderRadius: 2,
//   },
//   replyText: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//     fontFamily: 'System',
//   },
//   senderName: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#1B5E20',
//     marginBottom: 4,
//     fontFamily: 'System',
//   },
//   messageContent: {
//     flexDirection: 'column',
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#2E2E2E',
//     marginBottom: 6,
//     lineHeight: 22,
//     fontFamily: 'System',
//   },
//   emojiContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 6,
//   },
//   emoji: {
//     fontSize: 24,
//     marginRight: 8,
//     padding: 6,
//     backgroundColor: 'rgba(0, 0, 0, 0.05)',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(76, 175, 80, 0.2)',
//   },
//   attachmentPreview: {
//     marginTop: 8,
//     alignItems: 'center',
//   },
//   attachmentImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 12,
//     marginBottom: 6,
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.1)',
//   },
//   attachmentText: {
//     fontSize: 13,
//     color: '#388E3C',
//     fontWeight: '500',
//     fontFamily: 'System',
//   },
//   timestamp: {
//     fontSize: 11,
//     color: '#B0BEC5',
//     alignSelf: 'flex-end',
//     opacity: 0.8,
//     fontFamily: 'System',
//   },
//   inputContainer: {
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E8F5E9',
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   replyInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F1F8E9',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   replyInputText: {
//     flex: 1,
//     fontSize: 14,
//     color: '#666',
//     fontStyle: 'italic',
//     fontFamily: 'System',
//   },
//   cancelReplyButton: {
//     padding: 5,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inputWrapper: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F1F8E9',
//     borderRadius: 25,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(76, 175, 80, 0.2)',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//     marginRight: 10,
//   },
//   emojiButton: {
//     padding: 10,
//   },
//   attachmentButton: {
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     height: 48,
//     backgroundColor: 'transparent',
//     paddingHorizontal: 14,
//     color: '#1B5E20',
//     fontSize: 16,
//     fontFamily: 'System',
//   },
//   sendButton: {
//     backgroundColor: '#388E3C',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   emojiPicker: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 15,
//     backgroundColor: '#F1F8E9',
//     borderRadius: 15,
//     marginTop: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: 'rgba(76, 175, 80, 0.2)',
//   },
//   emojiItem: {
//     padding: 10,
//     margin: 5,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   attachmentPreviewInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//     backgroundColor: '#F1F8E9',
//     borderRadius: 12,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   attachmentImageInput: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(76, 175, 80, 0.2)',
//   },
//   removeAttachmentButton: {
//     padding: 5,
//   },
//   typingIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     marginHorizontal: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   typingText: {
//     fontSize: 14,
//     color: '#388E3C',
//     marginRight: 8,
//     fontFamily: 'System',
//   },
//   typingDots: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     backgroundColor: '#388E3C',
//     borderRadius: 4,
//     marginHorizontal: 3,
//   },
//   // Modal styles for full image view
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullImage: {
//     width: width * 0.9,
//     height: height * 0.7,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 20,
//     padding: 5,
//   },
// });





// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Easing,
//   Modal,
//   Dimensions,
//   PanResponder,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Expo-native gradient
// import { collection, addDoc, query, orderBy, onSnapshot, getDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { auth, db } from './firebaseConfig'; // Ensure firebaseConfig includes both auth and db
// import Constants from 'expo-constants'; // For status bar height
// import { Ionicons } from '@expo/vector-icons'; // For emojis and attachments
// import * as ImagePicker from 'expo-image-picker'; // For attachments
// import * as FileSystem from 'expo-file-system'; // For reading file as base64

// // Memoized Message Item Component to prevent unnecessary re-renders
// const MessageItem = React.memo(({ item, isCurrentUser, senderName, repliedMessage, messageAnims, translateXAnims, createPanResponder }) => {
//   const panResponder = createPanResponder(item);

//   return (
//     <Animated.View
//       style={{
//         transform: [{ translateX: translateXAnims[item.id] || 0 }],
//       }}
//       {...panResponder.panHandlers}
//     >
//       <Animated.View
//         style={[
//           styles.messageBubble,
//           isCurrentUser ? styles.userMessage : styles.botMessage,
//           {
//             opacity: messageAnims[item.id] || 1,
//             transform: [{ scale: messageAnims[item.id]?.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) || 1 }],
//           },
//         ]}
//       >
//         {repliedMessage && (
//           <View style={styles.replyContainer}>
//             <View style={styles.replyIndicator} />
//             <Text style={styles.replyText}>
//               Replying to {senderName}: {repliedMessage.text || (repliedMessage.attachmentBase64 ? 'Attachment' : '')}
//             </Text>
//           </View>
//         )}
//         <Text style={styles.senderName}>{senderName}</Text>
//         <View style={styles.messageContent}>
//           {item.text ? (
//             <Text style={styles.messageText}>{item.text}</Text>
//           ) : !item.attachmentBase64 && (
//             <Text style={styles.messageText}>No message content</Text>
//           )}
//           {item.emojis.length > 0 && (
//             <View style={styles.emojiContainer}>
//               {item.emojis.map((emoji, index) => (
//                 <Text key={index} style={styles.emoji}>{emoji}</Text>
//               ))}
//             </View>
//           )}
//           {item.attachmentBase64 && (
//             <TouchableOpacity
//               style={styles.attachmentPreview}
//               onPress={() => item.onPressAttachment(item.attachmentBase64)}
//             >
//               <Image
//                 source={{ uri: item.attachmentBase64 }}
//                 style={styles.attachmentImage}
//                 onError={(e) => console.log('Attachment failed to load:', e.nativeEvent.error)}
//               />
//               <Text style={styles.attachmentText}>📷 Attachment</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <Text style={styles.timestamp}>
//           {new Date(item.timestamp?.toDate?.() || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </Text>
//       </Animated.View>
//     </Animated.View>
//   );
// });

// export default function ChatScreen({ navigation }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [senderNames, setSenderNames] = useState({}); // Store sender names by userId
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false); // For emoji picker
//   const [attachment, setAttachment] = useState(null); // For attachments (base64 string)
//   const [typingUsers, setTypingUsers] = useState({}); // For typing indicators
//   const [isTyping, setIsTyping] = useState(false); // Track current user typing
//   const [selectedImage, setSelectedImage] = useState(null); // For displaying full image in modal
//   const [replyToMessage, setReplyToMessage] = useState(null); // For replying to a specific message
//   const [currentlySlidingMessage, setCurrentlySlidingMessage] = useState(null); // Track the currently sliding message
//   const flatListRef = useRef(null); // Ref to control FlatList scrolling
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const messageAnims = useRef({}).current; // Object to store animation values for each message
//   const translateXAnims = useRef({}).current; // Object to store translateX animations for each message
//   const inputAnim = useRef(new Animated.Value(0)).current;
//   const typingAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Fetch current user's name from Firestore
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setSenderNames(prev => ({ ...prev, [user.uid]: userData.name || 'Unknown User' }));
//           } else {
//             setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//           }
//         } catch (error) {
//           console.error('Error fetching user name: ', error);
//           setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
//         }
//       }
//     };

//     fetchUserData();

//     // Firestore query to listen for real-time updates
//     let unsubscribeMessages = null;
//     let unsubscribeTyping = null;

//     const setupListeners = () => {
//       // console.log('Setting up Firestore listeners'); // Debug log
//       const q = query(collection(db, "chatMessages"), orderBy("timestamp", "desc")); // Descending order for newest messages at the bottom

//       unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
//         const messagesArray = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           text: doc.data().text || '',
//           userId: doc.data().userId || null,
//           timestamp: doc.data().timestamp || serverTimestamp(),
//           emojis: doc.data().emojis || [],
//           attachmentBase64: doc.data().attachmentBase64 || null,
//           replyTo: doc.data().replyTo || null,
//           onPressAttachment: setSelectedImage, // Pass the callback as a prop
//         }));
//         // console.log('Fetched messages:', messagesArray.length, messagesArray.map(msg => msg.id)); // Debug log
//         setMessages(messagesArray);
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start();

//         messagesArray.forEach(async (message) => {
//           if (message.userId && !senderNames[message.userId]) {
//             try {
//               const userDoc = await getDoc(doc(db, 'users', message.userId));
//               if (userDoc.exists()) {
//                 const userData = userDoc.data();
//                 setSenderNames(prev => ({ ...prev, [message.userId]: userData.name || 'Unknown User' }));
//               } else {
//                 setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//               }
//             } catch (error) {
//               console.error('Error fetching sender name: ', error);
//               setSenderNames(prev => ({ ...prev, [message.userId]: 'Unknown User' }));
//             }
//           }
//         });
//       });

//       // Simulate typing indicators (replace with real-time logic in production)
//       unsubscribeTyping = onSnapshot(query(collection(db, "typingStatus"), orderBy("timestamp", "desc")), (snapshot) => {
//         const typing = {};
//         snapshot.forEach(doc => {
//           const data = doc.data();
//           if (data.userId !== auth.currentUser?.uid && Date.now() - data.timestamp.toDate().getTime() < 5000) {
//             typing[data.userId] = true;
//           }
//         });
//         setTypingUsers(typing);
//       });
//     };

//     setupListeners();

//     // Animate input area on mount
//     Animated.timing(inputAnim, {
//       toValue: 1,
//       duration: 1000,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();

//     // Animate typing indicator
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(typingAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(typingAnim, {
//           toValue: 0,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Cleanup listeners when the screen is unfocused or unmounted
//     const unsubscribeFocus = navigation.addListener('blur', () => {
//       // console.log('Screen blurred, cleaning up listeners'); // Debug log
//       if (unsubscribeMessages) unsubscribeMessages();
//       if (unsubscribeTyping) unsubscribeTyping();
//     });

//     const unsubscribeBlur = navigation.addListener('focus', () => {
//       // console.log('Screen focused, setting up listeners'); // Debug log
//       setupListeners();
//     });

//     return () => {
//       // console.log('Component unmounting, cleaning up listeners'); // Debug log
//       if (unsubscribeMessages) unsubscribeMessages();
//       if (unsubscribeTyping) unsubscribeTyping();
//       unsubscribeFocus();
//       unsubscribeBlur();
//     };
//   }, [fadeAnim, senderNames, inputAnim, typingAnim, navigation]);

//   useEffect(() => {
//     // Initialize or reset animation values for new messages
//     messages.forEach((message) => {
//       if (!messageAnims[message.id]) {
//         messageAnims[message.id] = new Animated.Value(0);
//         Animated.timing(messageAnims[message.id], {
//           toValue: 1,
//           duration: 500,
//           easing: Easing.out(Easing.exp),
//           useNativeDriver: true,
//         }).start();
//       }
//       if (!translateXAnims[message.id]) {
//         translateXAnims[message.id] = new Animated.Value(0);
//       }
//     });

//     // Reset translateX for all messages when replyToMessage changes
//     if (replyToMessage) {
//       Object.keys(translateXAnims).forEach((key) => {
//         if (key !== replyToMessage.id) {
//           Animated.spring(translateXAnims[key], {
//             toValue: 0,
//             friction: 8,
//             useNativeDriver: true,
//           }).start();
//         }
//       });
//     } else {
//       Object.keys(translateXAnims).forEach((key) => {
//         Animated.spring(translateXAnims[key], {
//           toValue: 0,
//           friction: 8,
//           useNativeDriver: true,
//         }).start();
//       });
//     }
//   }, [messages, replyToMessage]);

//   const handleSend = async () => {
//     if (newMessage.trim() === "" && !attachment) return;

//     const user = auth.currentUser;
//     if (!user) {
//       console.error('No authenticated user found');
//       return;
//     }

//     try {
//       await addDoc(collection(db, "chatMessages"), {
//         text: newMessage.trim(),
//         userId: user.uid,
//         timestamp: serverTimestamp(),
//         emojis: [],
//         attachmentBase64: attachment || null,
//         replyTo: replyToMessage ? replyToMessage.id : null,
//       });

//       await addDoc(collection(db, "typingStatus"), {
//         userId: user.uid,
//         timestamp: serverTimestamp(),
//       });

//       setNewMessage("");
//       setAttachment(null);
//       setShowEmojiPicker(false);
//       setIsTyping(false);
//       setReplyToMessage(null);
//       setCurrentlySlidingMessage(null);

//       // Scroll to the bottom after sending a message (with inverted, bottom is offset 0)
//       setTimeout(() => {
//         flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
//       }, 100);
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   const addEmoji = (emoji) => {
//     setNewMessage(prev => prev + emoji);
//   };

//   const handleTyping = (text) => {
//     setNewMessage(text);
//     setIsTyping(text.length > 0);
//     if (text.length > 0) {
//       addDoc(collection(db, "typingStatus"), {
//         userId: auth.currentUser?.uid,
//         timestamp: serverTimestamp(),
//       });
//     }
//   };

//   const pickAttachment = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'We need permission to access your photos to attach images.');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: false,
//         quality: 0.5,
//       });

//       if (!result.canceled) {
//         const uri = result.assets[0].uri;
//         const base64 = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });
//         const base64WithPrefix = `data:image/jpeg;base64,${base64}`;
//         setAttachment(base64WithPrefix);
//       }
//     } catch (error) {
//       console.error("Error picking attachment: ", error);
//       Alert.alert('Error', 'Failed to pick an image. Please try again.');
//     }
//   };

//   const removeAttachment = () => {
//     setAttachment(null);
//   };

//   const createPanResponder = useCallback((message) => {
//     const translateX = translateXAnims[message.id] || new Animated.Value(0);
//     return PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         // Reset all other messages' translateX when a new slide starts
//         if (currentlySlidingMessage && currentlySlidingMessage !== message.id) {
//           Animated.spring(translateXAnims[currentlySlidingMessage], {
//             toValue: 0,
//             friction: 8,
//             useNativeDriver: true,
//           }).start();
//         }
//         setCurrentlySlidingMessage(message.id);
//       },
//       onPanResponderMove: (evt, gestureState) => {
//         if (gestureState.dx > 0) {
//           translateX.setValue(Math.min(gestureState.dx, 50));
//         }
//       },
//       onPanResponderRelease: (evt, gestureState) => {
//         if (gestureState.dx > 50) {
//           setReplyToMessage(message);
//           Animated.timing(translateX, {
//             toValue: 50,
//             duration: 100,
//             useNativeDriver: true,
//           }).start();
//         } else {
//           Animated.spring(translateX, {
//             toValue: 0,
//             friction: 8,
//             useNativeDriver: true,
//           }).start(() => {
//             setCurrentlySlidingMessage(null);
//           });
//         }
//       },
//     });
//   }, [currentlySlidingMessage]);

//   // Reset all translateX animations when scrolling starts
//   const handleScrollBeginDrag = () => {
//     if (currentlySlidingMessage) {
//       Animated.spring(translateXAnims[currentlySlidingMessage], {
//         toValue: 0,
//         friction: 8,
//         useNativeDriver: true,
//       }).start();
//       setCurrentlySlidingMessage(null);
//     }
//   };

//   let renderCount = 0; // Debug counter for rendered items
//   const renderMessage = ({ item }) => {
//     renderCount++;
//     // console.log(`Rendering message ${renderCount}: ${item.id}`); // Debug log
//     const isCurrentUser = item.userId === auth.currentUser?.uid;
//     const senderName = senderNames[item.userId] || 'Unknown User';
//     const repliedMessage = item.replyTo ? messages.find(msg => msg.id === item.replyTo) : null;

//     return (
//       <MessageItem
//         item={item}
//         isCurrentUser={isCurrentUser}
//         senderName={senderName}
//         repliedMessage={repliedMessage}
//         messageAnims={messageAnims}
//         translateXAnims={translateXAnims}
//         createPanResponder={createPanResponder}
//       />
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.keyboardAvoidingContainer}
//     >
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#D4E7D5', '#AEDCB1']}
//           style={styles.background}
//         >
//           <View style={styles.header}>
//             <Image
//               source={require("./assets/plant-leaf.png")}
//               style={styles.headerLogo}
//               onError={(e) => console.log('Logo failed to load:', e.nativeEvent.error)}
//             />
//             <Text style={styles.headerTitle}>PlantPal Chat</Text>
//           </View>

//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id}
//             inverted // Show newest messages at the bottom
//             style={styles.chatList}
//             contentContainerStyle={styles.chatContent}
//             onScrollBeginDrag={handleScrollBeginDrag} // Reset slide animations when scrolling starts
//             scrollEventThrottle={16}
//           />

//           <Animated.View style={[styles.inputContainer, { opacity: inputAnim, transform: [{ translateY: inputAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
//             {replyToMessage && (
//               <View style={styles.replyInputContainer}>
//                 <Text style={styles.replyInputText}>
//                   Replying to {senderNames[replyToMessage.userId] || 'Unknown User'}: {replyToMessage.text || (replyToMessage.attachmentBase64 ? 'Attachment' : '')}
//                 </Text>
//                 <TouchableOpacity onPress={() => setReplyToMessage(null)} style={styles.cancelReplyButton}>
//                   <Ionicons name="close" size={20} color="#D32F2F" />
//                 </TouchableOpacity>
//               </View>
//             )}
//             <View style={styles.inputRow}>
//               <View style={styles.inputWrapper}>
//                 <TouchableOpacity 
//                   style={styles.emojiButton} 
//                   onPress={() => setShowEmojiPicker(!showEmojiPicker)}
//                   accessibilityLabel="Toggle Emoji Picker"
//                 >
//                   <Ionicons name="happy-outline" size={24} color="#388E3C" />
//                 </TouchableOpacity>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Type your message..."
//                   value={newMessage}
//                   onChangeText={handleTyping}
//                   placeholderTextColor="#A5D6A7"
//                   keyboardType="default"
//                   autoCorrect={true}
//                   accessibilityLabel="Chat Input"
//                   onBlur={() => setIsTyping(false)}
//                 />
//                 <TouchableOpacity 
//                   style={styles.attachmentButton} 
//                   onPress={pickAttachment}
//                   accessibilityLabel="Add Attachment"
//                 >
//                   <Ionicons name="attach-outline" size={24} color="#388E3C" />
//                 </TouchableOpacity>
//               </View>
//               <TouchableOpacity 
//                 style={styles.sendButton} 
//                 onPress={handleSend}
//                 accessibilityLabel="Send Message Button"
//               >
//                 <Ionicons name="send" size={20} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
//             {showEmojiPicker && (
//               <View style={styles.emojiPicker}>
//                 {['😊', '😂', '🌱', '🍃', '❤️', '🌿', '🌼'].map(emoji => (
//                   <TouchableOpacity 
//                     key={emoji} 
//                     style={styles.emojiItem} 
//                     onPress={() => addEmoji(emoji)}
//                     accessibilityLabel={`Add ${emoji} emoji`}
//                   >
//                     <Text style={styles.emoji}>{emoji}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//             {attachment && (
//               <View style={styles.attachmentPreviewInput}>
//                 <Image 
//                   source={{ uri: attachment }} 
//                   style={styles.attachmentImageInput} 
//                   onError={(e) => console.log('Attachment preview failed to load:', e.nativeEvent.error)}
//                 />
//                 <TouchableOpacity 
//                   style={styles.removeAttachmentButton} 
//                   onPress={removeAttachment}
//                   accessibilityLabel="Remove Attachment"
//                 >
//                   <Ionicons name="close-circle-outline" size={24} color="#D32F2F" />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </Animated.View>

//           {Object.keys(typingUsers).length > 0 && (
//             <Animated.View style={[styles.typingIndicator, { opacity: typingAnim }]}>
//               <Text style={styles.typingText}>
//                 {Object.keys(typingUsers).map(userId => senderNames[userId] || 'Someone').join(', ')} is typing
//               </Text>
//               <View style={styles.typingDots}>
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim }] }]} />
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] }) }] }]} />
//                 <Animated.View style={[styles.dot, { transform: [{ scale: typingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }] }]} />
//               </View>
//             </Animated.View>
//           )}
//         </LinearGradient>

//         {/* Modal for viewing full image */}
//         <Modal
//           visible={!!selectedImage}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => setSelectedImage(null)}
//         >
//           <View style={styles.modalContainer}>
//             <Image
//               source={{ uri: selectedImage }}
//               style={styles.fullImage}
//               resizeMode="contain"
//               onError={(e) => console.log('Full image failed to load:', e.nativeEvent.error)}
//             />
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setSelectedImage(null)}
//               accessibilityLabel="Close Image Modal"
//             >
//               <Ionicons name="close-circle-outline" size={30} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>
//         </Modal>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const { width, height } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   keyboardAvoidingContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight,
//   },
//   background: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     backgroundColor: '#F1F8E9',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   headerLogo: {
//     width: 32,
//     height: 32,
//     marginRight: 12,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#1B5E20',
//     fontFamily: 'System',
//   },
//   chatList: {
//     flex: 1,
//     paddingHorizontal: 15,
//   },
//   chatContent: {
//     paddingVertical: 20,
//     paddingBottom: 30,
//   },
//   messageBubble: {
//     padding: 12,
//     borderRadius: 20,
//     marginVertical: 6,
//     maxWidth: '80%',
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   userMessage: {
//     backgroundColor: '#4CAF50',
//     alignSelf: 'flex-end',
//     marginRight: 10,
//     borderTopRightRadius: 5,
//   },
//   botMessage: {
//     backgroundColor: '#FFFFFF',
//     alignSelf: 'flex-start',
//     marginLeft: 10,
//     borderTopLeftRadius: 5,
//   },
//   replyContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.05)',
//     padding: 8,
//     borderRadius: 10,
//     marginBottom: 8,
//   },
//   replyIndicator: {
//     width: 4,
//     height: '100%',
//     backgroundColor: '#388E3C',
//     marginRight: 8,
//     borderRadius: 2,
//   },
//   replyText: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//     fontFamily: 'System',
//   },
//   senderName: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#1B5E20',
//     marginBottom: 4,
//     fontFamily: 'System',
//   },
//   messageContent: {
//     flexDirection: 'column',
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#2E2E2E',
//     marginBottom: 6,
//     lineHeight: 22,
//     fontFamily: 'System',
//   },
//   emojiContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 6,
//   },
//   emoji: {
//     fontSize: 24,
//     marginRight: 8,
//     padding: 6,
//     backgroundColor: 'rgba(0, 0, 0, 0.05)',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(76, 175, 80, 0.2)',
//   },
//   attachmentPreview: {
//     marginTop: 8,
//     alignItems: 'center',
//   },
//   attachmentImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 12,
//     marginBottom: 6,
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.1)',
//   },
//   attachmentText: {
//     fontSize: 13,
//     color: '#388E3C',
//     fontWeight: '500',
//     fontFamily: 'System',
//   },
//   timestamp: {
//     fontSize: 11,
//     color: '#B0BEC5',
//     alignSelf: 'flex-end',
//     opacity: 0.8,
//     fontFamily: 'System',
//   },
//   inputContainer: {
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E8F5E9',
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   replyInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F1F8E9',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   replyInputText: {
//     flex: 1,
//     fontSize: 14,
//     color: '#666',
//     fontStyle: 'italic',
//     fontFamily: 'System',
//   },
//   cancelReplyButton: {
//     padding: 5,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inputWrapper: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F1F8E9',
//     borderRadius: 25,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(76, 175, 80, 0.2)',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//     marginRight: 10,
//   },
//   emojiButton: {
//     padding: 10,
//   },
//   attachmentButton: {
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     height: 48,
//     backgroundColor: 'transparent',
//     paddingHorizontal: 14,
//     color: '#1B5E20',
//     fontSize: 16,
//     fontFamily: 'System',
//   },
//   sendButton: {
//     backgroundColor: '#388E3C',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   emojiPicker: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 15,
//     backgroundColor: '#F1F8E9',
//     borderRadius: 15,
//     marginTop: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: 'rgba(76, 175, 80, 0.2)',
//   },
//   emojiItem: {
//     padding: 10,
//     margin: 5,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   attachmentPreviewInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//     backgroundColor: '#F1F8E9',
//     borderRadius: 12,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   attachmentImageInput: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(76, 175, 80, 0.2)',
//   },
//   removeAttachmentButton: {
//     padding: 5,
//   },
//   typingIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     marginHorizontal: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   typingText: {
//     fontSize: 14,
//     color: '#388E3C',
//     marginRight: 8,
//     fontFamily: 'System',
//   },
//   typingDots: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     backgroundColor: '#388E3C',
//     borderRadius: 4,
//     marginHorizontal: 3,
//   },
//   // Modal styles for full image view
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullImage: {
//     width: width * 0.9,
//     height: height * 0.7,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 20,
//     padding: 5,
//   },
// });






import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDatabase, ref, push, onValue, off, set, serverTimestamp } from 'firebase/database';
import { collection, getDoc, doc } from 'firebase/firestore';
import { auth, db, db1 } from './firebaseConfig';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Memoized Message Item Component
const MessageItem = React.memo(({ item, isCurrentUser, senderName, repliedMessage, translateXAnims, createPanResponder }) => {
  const panResponder = createPanResponder(item);

  return (
    <Animated.View
      style={{
        transform: [{ translateX: translateXAnims[item.id] || 0 }],
      }}
      {...panResponder.panHandlers}
    >
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        {repliedMessage && (
          <View style={styles.replyContainer}>
            <View style={styles.replyIndicator} />
            <Text style={styles.replyText}>
              Replying to {senderName}: {repliedMessage.text || (repliedMessage.attachmentBase64 ? 'Attachment' : '')}
            </Text>
          </View>
        )}
        <Text style={styles.senderName}>{senderName}</Text>
        <View style={styles.messageContent}>
          {item.text ? (
            <Text style={styles.messageText}>{item.text}</Text>
          ) : !item.attachmentBase64 && (
            <Text style={styles.messageText}>No message content</Text>
          )}
          {item.emojis?.length > 0 && (
            <View style={styles.emojiContainer}>
              {item.emojis.map((emoji, index) => (
                <Text key={index} style={styles.emoji}>{emoji}</Text>
              ))}
            </View>
          )}
          {item.attachmentBase64 && (
            <TouchableOpacity
              style={styles.attachmentPreview}
              onPress={() => item.onPressAttachment(item.attachmentBase64)}
            >
              <Image
                source={{ uri: item.attachmentBase64 }}
                style={styles.attachmentImage}
                onError={(e) => console.log('Attachment failed to load:', e.nativeEvent.error)}
              />
              <Text style={styles.attachmentText}>📷 Attachment</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </Animated.View>
  );
});

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderNames, setSenderNames] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [currentlySlidingMessage, setCurrentlySlidingMessage] = useState(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true); // Control auto-scroll
  const flatListRef = useRef(null);
  const translateXAnims = useRef({}).current;
  const dbRealTime = getDatabase();
  const lastMessageCountRef = useRef(0); // Track message count for new messages

  useEffect(() => {
    // Fetch current user's name from Firestore
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSenderNames(prev => ({ ...prev, [user.uid]: userData.name || 'Unknown User' }));
          } else {
            setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
          }
        } catch (error) {
          console.error('Error fetching user name: ', error);
          setSenderNames(prev => ({ ...prev, [user.uid]: 'Unknown User' }));
        }
      }
    };

    fetchUserData();

    // Fetch sender names for existing messages from Firestore
    const fetchSenderNames = async () => {
      const uniqueUserIds = [...new Set(messages.map(msg => msg.userId).filter(id => id && !senderNames[id]))];
      for (const userId of uniqueUserIds) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSenderNames(prev => ({ ...prev, [userId]: userData.name || 'Unknown User' }));
          } else {
            setSenderNames(prev => ({ ...prev, [userId]: 'Unknown User' }));
          }
        } catch (error) {
          console.error('Error fetching sender name: ', error);
          setSenderNames(prev => ({ ...prev, [userId]: 'Unknown User' }));
        }
      }
    };

    // Set up listener for messages with Realtime Database
    const messagesRef = ref(dbRealTime, 'messages');
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.keys(data).map(key => ({
        id: key,
        text: data[key].text || '',
        userId: data[key].userId || 'Anonymous',
        timestamp: data[key].timestamp || Date.now(),
        emojis: data[key].emojis || [],
        attachmentBase64: data[key].attachmentBase64 || null,
        replyTo: data[key].replyTo || null,
        onPressAttachment: setSelectedImage,
      })).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)) : [];
      
      setMessages(messagesArray);
      fetchSenderNames();

      // Auto-scroll only if shouldAutoScroll is true
      if (shouldAutoScroll) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
      lastMessageCountRef.current = messagesArray.length;
    }, (error) => console.log('Realtime DB error:', error));

    // Typing indicators with Realtime Database
    const typingRef = ref(dbRealTime, 'typingStatus');
    const unsubscribeTyping = onValue(typingRef, (snapshot) => {
      const data = snapshot.val();
      const typing = {};
      if (data) {
        Object.keys(data).forEach(userId => {
          const timestamp = data[userId].timestamp || 0;
          if (userId !== auth.currentUser?.uid && Date.now() - timestamp < 5000) {
            typing[userId] = true;
          }
        });
      }
      setTypingUsers(typing);
    }, (error) => console.log('Typing Realtime DB error:', error));

    // Navigation listeners
    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('Screen focused, reinitializing');
      off(messagesRef);
      off(typingRef);
      setShouldAutoScroll(true); // Enable auto-scroll on screen focus
      const newMessagesRef = ref(dbRealTime, 'messages');
      onValue(newMessagesRef, (snapshot) => {
        const data = snapshot.val();
        const messagesArray = data ? Object.keys(data).map(key => ({
          id: key,
          text: data[key].text || '',
          userId: data[key].userId || 'Anonymous',
          timestamp: data[key].timestamp || Date.now(),
          emojis: data[key].emojis || [],
          attachmentBase64: data[key].attachmentBase64 || null,
          replyTo: data[key].replyTo || null,
          onPressAttachment: setSelectedImage,
        })).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)) : [];
        setMessages(messagesArray);
        fetchSenderNames();
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, (error) => console.log('Focus Realtime DB error:', error));

      const newTypingRef = ref(dbRealTime, 'typingStatus');
      onValue(newTypingRef, (snapshot) => {
        const data = snapshot.val();
        const typing = {};
        if (data) {
          Object.keys(data).forEach(userId => {
            const timestamp = data[userId].timestamp || 0;
            if (userId !== auth.currentUser?.uid && Date.now() - timestamp < 5000) {
              typing[userId] = true;
            }
          });
        }
        setTypingUsers(typing);
      }, (error) => console.log('Typing Focus Realtime DB error:', error));
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('Screen blurred, cleaning up');
      off(messagesRef);
      off(typingRef);
    });

    return () => {
      off(messagesRef);
      off(typingRef);
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, senderNames]);

  useEffect(() => {
    messages.forEach((message) => {
      if (!translateXAnims[message.id]) {
        translateXAnims[message.id] = new Animated.Value(0);
      }
    });
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() === "" && !attachment) return;

    const user = auth.currentUser;
    if (!user) {
      console.log('No authenticated user found');
      return;
    }

    console.log('Sending message:', newMessage, 'Length:', newMessage.length);
    try {
      const messagesRef = ref(dbRealTime, 'messages');
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, {
        text: newMessage.trim(),
        userId: user.uid,
        timestamp: serverTimestamp(),
        emojis: [],
        attachmentBase64: attachment || null,
        replyTo: replyToMessage ? replyToMessage.id : null,
      });

      const typingRef = ref(dbRealTime, `typingStatus/${user.uid}`);
      await set(typingRef, {
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
      setAttachment(null);
      setShowEmojiPicker(false);
      setIsTyping(false);
      setReplyToMessage(null);
      setCurrentlySlidingMessage(null);
      setShouldAutoScroll(true); // Enable auto-scroll after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.log("Error sending message: ", error);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleTyping = (text) => {
    setNewMessage(text);
    setIsTyping(text.length > 0);
    if (text.length > 0 && auth.currentUser?.uid) {
      const typingRef = ref(dbRealTime, `typingStatus/${auth.currentUser.uid}`);
      set(typingRef, {
        timestamp: serverTimestamp(),
      });
    }
  };

  const pickAttachment = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos to attach images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const base64WithPrefix = `data:image/jpeg;base64,${base64}`;
        setAttachment(base64WithPrefix);
      }
    } catch (error) {
      console.log("Error picking attachment: ", error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const createPanResponder = useCallback((message) => {
    const translateX = translateXAnims[message.id] || new Animated.Value(0);
    return PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
      },
      onPanResponderGrant: () => {
        if (currentlySlidingMessage && currentlySlidingMessage !== message.id) {
          Animated.spring(translateXAnims[currentlySlidingMessage], {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
        setCurrentlySlidingMessage(message.id);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx, 50));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          setReplyToMessage(message);
          Animated.timing(translateX, {
            toValue: 50,
            duration: 100,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }).start(() => {
            setCurrentlySlidingMessage(null);
          });
        }
      },
    });
  }, [currentlySlidingMessage]);

  const handleScrollBeginDrag = () => {
    setShouldAutoScroll(false); // Disable auto-scroll when user starts scrolling
    if (currentlySlidingMessage) {
      Animated.spring(translateXAnims[currentlySlidingMessage], {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }).start();
      setCurrentlySlidingMessage(null);
    }
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10;
    if (isAtBottom) {
      setShouldAutoScroll(true); // Re-enable auto-scroll if user scrolls to bottom
    } else {
      setShouldAutoScroll(false); // Disable auto-scroll if user scrolls up
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.userId === auth.currentUser?.uid;
    const senderName = senderNames[item.userId] || 'Unknown User';
    const repliedMessage = item.replyTo ? messages.find(msg => msg.id === item.replyTo) : null;

    return (
      <MessageItem
        item={item}
        isCurrentUser={isCurrentUser}
        senderName={senderName}
        repliedMessage={repliedMessage}
        translateXAnims={translateXAnims}
        createPanResponder={createPanResponder}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#D4E7D5', '#AEDCB1']}
          style={styles.background}
        >
          <View style={styles.header}>
            <Image
              source={require("./assets/plant-chat.png")}
              style={styles.headerLogo}
              onError={(e) => console.log('Logo failed to load:', e.nativeEvent.error)}
            />
            <Text style={styles.headerTitle}>PlantPal Chat</Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.chatList}
            contentContainerStyle={styles.chatContent}
            onScrollBeginDrag={handleScrollBeginDrag}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={3}
          />

          <View style={styles.inputContainer}>
            {replyToMessage && (
              <View style={styles.replyInputContainer}>
                <Text style={styles.replyInputText}>
                  Replying to {senderNames[replyToMessage.userId] || 'Unknown User'}: {replyToMessage.text || (replyToMessage.attachmentBase64 ? 'Attachment' : '')}
                </Text>
                <TouchableOpacity onPress={() => setReplyToMessage(null)} style={styles.cancelReplyButton}>
                  <Ionicons name="close" size={20} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <TouchableOpacity 
                  style={styles.emojiButton} 
                  onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                  accessibilityLabel="Toggle Emoji Picker"
                >
                  <Ionicons name="happy-outline" size={24} color="#388E3C" />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Type your message..."
                  value={newMessage}
                  onChangeText={handleTyping}
                  placeholderTextColor="#A5D6A7"
                  keyboardType="default"
                  autoCorrect={true}
                  accessibilityLabel="Chat Input"
                  onBlur={() => setIsTyping(false)}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <TouchableOpacity 
                  style={styles.attachmentButton} 
                  onPress={pickAttachment}
                  accessibilityLabel="Add Attachment"
                >
                  <Ionicons name="attach-outline" size={24} color="#388E3C" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.sendButton} 
                onPress={handleSend}
                accessibilityLabel="Send Message Button"
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            {showEmojiPicker && (
              <View style={styles.emojiPicker}>
                {['😊', '😂', '🌱', '🍃', '❤️', '🌿', '🌼'].map(emoji => (
                  <TouchableOpacity 
                    key={emoji} 
                    style={styles.emojiItem} 
                    onPress={() => addEmoji(emoji)}
                    accessibilityLabel={`Add ${emoji} emoji`}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {attachment && (
              <View style={styles.attachmentPreviewInput}>
                <Image 
                  source={{ uri: attachment }} 
                  style={styles.attachmentImageInput} 
                  onError={(e) => console.log('Attachment preview failed to load:', e.nativeEvent.error)}
                />
                <TouchableOpacity 
                  style={styles.removeAttachmentButton} 
                  onPress={removeAttachment}
                  accessibilityLabel="Remove Attachment"
                >
                  <Ionicons name="close-circle-outline" size={24} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {Object.keys(typingUsers).length > 0 && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>
                {Object.keys(typingUsers).map(userId => senderNames[userId] || 'Someone').join(', ')} is typing
              </Text>
              <View style={styles.typingDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          )}
        </LinearGradient>

        <Modal
          visible={!!selectedImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
              onError={(e) => console.log('Full image failed to load:', e.nativeEvent.error)}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
              accessibilityLabel="Close Image Modal"
            >
              <Ionicons name="close-circle-outline" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F1F8E9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1B5E20',
    fontFamily: 'System',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  chatContent: {
    paddingVertical: 20,
    paddingBottom: 30,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  userMessage: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
    marginRight: 10,
    borderTopRightRadius: 5,
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    marginLeft: 10,
    borderTopLeftRadius: 5,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  replyIndicator: {
    width: 4,
    height: '100%',
    backgroundColor: '#388E3C',
    marginRight: 8,
    borderRadius: 2,
  },
  replyText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    fontFamily: 'System',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 4,
    fontFamily: 'System',
  },
  messageContent: {
    flexDirection: 'column',
  },
  messageText: {
    fontSize: 16,
    color: '#2E2E2E',
    marginBottom: 6,
    lineHeight: 22,
    fontFamily: 'System',
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  attachmentPreview: {
    marginTop: 8,
    alignItems: 'center',
  },
  attachmentImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  attachmentText: {
    fontSize: 13,
    color: '#388E3C',
    fontWeight: '500',
    fontFamily: 'System',
  },
  timestamp: {
    fontSize: 11,
    color: '#B0BEC5',
    alignSelf: 'flex-end',
    opacity: 0.8,
    fontFamily: 'System',
  },
  inputContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  replyInputText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    fontFamily: 'System',
  },
  cancelReplyButton: {
    padding: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    borderRadius: 25,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginRight: 10,
  },
  emojiButton: {
    padding: 10,
  },
  attachmentButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    minHeight: 48,
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
    color: '#1B5E20',
    fontSize: 16,
    fontFamily: 'System',
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#388E3C',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  emojiPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    backgroundColor: '#F1F8E9',
    borderRadius: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  emojiItem: {
    padding: 10,
    margin: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  attachmentPreviewInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  attachmentImageInput: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  removeAttachmentButton: {
    padding: 5,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  typingText: {
    fontSize: 14,
    color: '#388E3C',
    marginRight: 8,
    fontFamily: 'System',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#388E3C',
    borderRadius: 4,
    marginHorizontal: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width * 0.9,
    height: height * 0.7,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
});