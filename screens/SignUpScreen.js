// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
// // import { auth } from "../firebaseConfig";
// // import { getAuth, createUserWithEmailAndPassword } from "@firebase/auth";
// // import { createUserWithEmailAndPassword } from "@firebase/auth";
// import { auth } from "./firebaseConfig";
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// export default function SignUpScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
// //   const auth = getAuth();

//   const handleSignUp = () => {
    
//       createUserWithEmailAndPassword(auth,email, password)
//       .then(() => {
//         navigation.replace("DashboardScreen");
//       })
//       .catch((error) => alert(error.message));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Sign Up" onPress={handleSignUp} />
//       <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
//         <Text style={styles.link}>Already have an account? Sign In</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//     backgroundColor: "#f0efeb",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//   },
//   link: {
//     marginTop: 20,
//     color: "#05668d",
//     textAlign: "center",
//   },
// });



// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./firebaseConfig";

// export default function SignUpScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSignUp = async () => {
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }
//     try {
//       setIsLoading(true);
//       await createUserWithEmailAndPassword(auth, email, password);
//       Alert.alert("Success", "Account created successfully");
//       navigation.navigate("SignInScreen");
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
//         <Text style={styles.buttonText}>{isLoading ? "Signing Up..." : "Sign Up"}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
//         <Text style={styles.link}>Already have an account? Sign In</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
//   input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
//   button: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 5, alignItems: "center" },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   link: { color: "#4CAF50", textAlign: "center", marginTop: 15 },
// });



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";

// export default function SignUpScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignUp = () => {
//     // Handle sign-up logic here
//     alert("Account created successfully!");
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topWave} />
//       <Text style={styles.title}>Register</Text>
//       <Text style={styles.subtitle}>Create your account</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         placeholderTextColor="#8CA596"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         placeholderTextColor="#8CA596"
//         secureTextEntry
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSignUp}>
//         <Text style={styles.buttonText}>Sign Up</Text>
//       </TouchableOpacity>
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Already have an account?</Text>
//         <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
//           <Text style={styles.footerLink}> Log in</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#DCF5DC",
//     paddingHorizontal: 20,
//     justifyContent: "center",
//   },
//   topWave: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: 200,
//     backgroundColor: "#A3C4BC",
//     borderBottomLeftRadius: 100,
//     borderBottomRightRadius: 100,
//   },
//   title: {
//     fontSize: 28,
//     color: "#1E5631",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#285430",
//     textAlign: "center",
//     marginVertical: 20,
//   },
//   input: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 25,
//     padding: 15,
//     marginVertical: 10,
//     color: "#285430",
//   },
//   button: {
//     backgroundColor: "#285430",
//     paddingVertical: 15,
//     borderRadius: 25,
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   footerText: {
//     color: "#285430",
//   },
//   footerLink: {
//     color: "#1E5631",
//     fontWeight: "bold",
//   },
// });


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { Picker } from '@react-native-picker/picker'; // Correct import for the picker
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./firebaseConfig"; // Assuming you have your Firebase setup

// export default function SignUpScreen({ navigation }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [error, setError] = useState("");

//   const [countryCode, setCountryCode] = useState("+1");

//   const handleSignUp = () => {
//     if (password !== confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }
//     createUserWithEmailAndPassword(auth, email, password)
//       .then(() => alert("Account created successfully!"))
//       .catch((err) => setError(err.message));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <View style={styles.phoneContainer}>
//         <Picker
//           selectedValue={countryCode}
//           onValueChange={(itemValue) => setCountryCode(itemValue)}
//           style={styles.dropdown}
//         >
//           <Picker.Item label="+1 (USA)" value="+1" />
//           <Picker.Item label="+44 (UK)" value="+44" />
//           <Picker.Item label="+91 (India)" value="+91" />
//           {/* Add more country codes as needed */}
//         </Picker>
//         <TextInput
//           style={[styles.input, styles.phoneInput]}
//           placeholder="Phone Number"
//           value={phone}
//           onChangeText={setPhone}
//         />
//       </View>
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//       />
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <TouchableOpacity style={styles.button} onPress={handleSignUp}>
//         <Text style={styles.buttonText}>Sign Up</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#EEF6F6",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#004643",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     padding: 15,
//     borderRadius: 25,
//     marginBottom: 15,
//     color: "#333333",
//   },
//   phoneContainer: {
//     flexDirection: "row",
//     width: "100%",
//     alignItems: "center",
//   },
//   dropdown: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 25,
//     borderColor: "#ddd",
//     height: 50, // Adjust the height for Picker dropdown
//     width: "30%",
//   },
//   phoneInput: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   button: {
//     backgroundColor: "#3F826D",
//     paddingVertical: 15,
//     width: "100%",
//     borderRadius: 25,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   error: {
//     color: "red",
//     marginBottom: 10,
//   },
// });


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
// } from "react-native";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./firebaseConfig"; // Assuming you have your Firebase setup

// export default function SignUpScreen({ navigation }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [error, setError] = useState("");

//   const handleSignUp = () => {
//     if (password !== confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }
//     createUserWithEmailAndPassword(auth, email, password)
//       .then(() => {
//         alert("Account created successfully!");
//         navigation.navigate("SignInScreen"); // Navigate to the login screen
//       })
//       .catch((err) => setError(err.message));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <View style={styles.phoneContainer}>
//         <Image
//           source={{ uri: "https://flagcdn.com/w320/pk.png" }} // URL for Pakistan flag
//           style={styles.flag}
//         />
//         <Text style={styles.countryCode}>+92</Text>
//         <TextInput
//           style={[styles.input, styles.phoneInput]}
//           placeholder="Phone Number"
//           value={phone}
//           onChangeText={setPhone}
//         />
//       </View>
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//       />
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <TouchableOpacity style={styles.button} onPress={handleSignUp}>
//         <Text style={styles.buttonText}>Sign Up</Text>
//       </TouchableOpacity>
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Already have an account?</Text>
//         <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
//           <Text style={styles.footerLink}> Log In</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#EEF6F6",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#004643",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     padding: 15,
//     borderRadius: 25,
//     marginBottom: 15,
//     color: "#333333",
//   },
//   phoneContainer: {
//     flexDirection: "row",
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   flag: {
//     width: 30,
//     height: 20,
//     marginRight: 10,
//   },
//   countryCode: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginRight: 10,
//   },
//   phoneInput: {
//     flex: 1,
//   },
//   button: {
//     backgroundColor: "#3F826D",
//     paddingVertical: 15,
//     width: "100%",
//     borderRadius: 25,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   error: {
//     color: "red",
//     marginBottom: 10,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   footerText: {
//     color: "#333333",
//   },
//   footerLink: {
//     color: "#004643",
//     fontWeight: "bold",
//   },
// });



// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from './firebaseConfig'; // Updated to use both auth and db
// import { doc, setDoc } from 'firebase/firestore'; // For storing user data
// import Icon from 'react-native-vector-icons/MaterialIcons'; // For eye icons (install: `npm install react-native-vector-icons`)
// import { ScrollView } from 'react-native';

// export default function SignUpScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [phone, setPhone] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false); // For password visibility
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility

//   const handleSignUp = async () => {
//     if (password !== confirmPassword) {
//       setError('Passwords do not match!');
//       return;
//     }
//     if (!email.trim() || !password.trim() || !name.trim() || !phone.trim()) {
//       setError('Please fill in all fields');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       await setDoc(doc(db, 'users', userCredential.user.uid), {
//         name,
//         email,
//         phone: `+92${phone}`, // Assuming Pakistan country code
//         createdAt: new Date(),
//       });
//       Alert.alert('Success', 'Account created successfully!'); // Display success message
//       navigation.navigate('SignInScreen');
//     } catch (err) {
//       setError(err.code === 'auth/email-already-in-use' ? 'Email already in use' : err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         <Image source={require("./assets/plant-leaf.png")} style={styles.logo} />
//         <Text style={styles.title}>Join PlantPal</Text>
//         <Text style={styles.subtitle}>Grow your green journey today!</Text>
//       </View>

//       <View style={styles.content}>
//         <View style={styles.inputContainer}>
//           <Image source={require("./assets/person-icon.png")} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Full Name"
//             value={name}
//             onChangeText={setName}
//             placeholderTextColor="#A3C4BC"
//             accessibilityLabel="Full Name Input"
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <Image source={require("./assets/email-icon.png")} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Email Address"
//             value={email}
//             onChangeText={setEmail}
//             placeholderTextColor="#A3C4BC"
//             keyboardType="email-address"
//             autoCapitalize="none"
//             autoCorrect={false}
//             accessibilityLabel="Email Input"
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <Image source={require("./assets/phone-icon.png")} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={phone}
//             onChangeText={setPhone}
//             placeholderTextColor="#A3C4BC"
//             keyboardType="phone-pad"
//             accessibilityLabel="Phone Number Input"
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <Image source={require("./assets/lock-icon.png")} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             placeholderTextColor="#A3C4BC"
//             secureTextEntry={!showPassword}
//             accessibilityLabel="Password Input"
//           />
//           <TouchableOpacity 
//             style={styles.eyeIcon} 
//             onPress={() => setShowPassword(!showPassword)}
//             accessibilityLabel="Toggle Password Visibility"
//           >
//             <Icon 
//               name={showPassword ? 'visibility-off' : 'visibility'} 
//               size={20} 
//               color="#A3C4BC" 
//             />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.inputContainer}>
//           <Image source={require("./assets/lock-icon.png")} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             placeholderTextColor="#A3C4BC"
//             secureTextEntry={!showConfirmPassword}
//             accessibilityLabel="Confirm Password Input"
//           />
//           <TouchableOpacity 
//             style={styles.eyeIcon} 
//             onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//             accessibilityLabel="Toggle Confirm Password Visibility"
//           >
//             <Icon 
//               name={showConfirmPassword ? 'visibility-off' : 'visibility'} 
//               size={20} 
//               color="#A3C4BC" 
//             />
//           </TouchableOpacity>
//         </View>
//         {error ? <Text style={styles.error}>{error}</Text> : null}
//         <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
//           {isLoading ? (
//             <ActivityIndicator size="small" color="#FFFFFF" />
//           ) : (
//             <Text style={styles.buttonText}>Sign Up</Text>
//           )}
//         </TouchableOpacity>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>Already have an account?</Text>
//           <TouchableOpacity 
//             onPress={() => navigation.navigate('SignInScreen')}
//             accessibilityLabel="Log In Link"
//           >
//             <Text style={styles.footerLink}> Log In</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#E8F5E9',
//     paddingHorizontal: 20,
//   },
//   header: {
//     paddingVertical: 60,
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#2E7D32',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#4CAF50',
//     fontWeight: '400',
//     marginBottom: 3,
//   },
//   content: {
//     paddingVertical: 2,
//     alignItems: 'center',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 25,
//     marginVertical: 7,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//     paddingRight: 10, // Added to accommodate the eye icon in password fields
//   },
//   inputIcon: {
//     width: 20,
//     height: 20,
//     marginHorizontal: 12,
//     tintColor: '#A3C4BC',
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingRight: 12,
//     color: '#2E7D32',
//     fontSize: 16,
//   },
//   eyeIcon: {
//     padding: 10,
//   },
//   error: {
//     color: 'red',
//     marginVertical: 10,
//     fontSize: 14,
//   },
//   button: {
//     width: '100%',
//     backgroundColor: '#4CAF50',
//     paddingVertical: 12,
//     borderRadius: 20,
//     alignItems: 'center',
//     marginVertical: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 5,
//     marginBottom: 10,
//   },
//   footerText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   footerLink: {
//     color: '#2E7D32',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginLeft: 5,
//   },
// });




import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For eye icons
import Modal from 'react-native-modal'; // For custom modals
import Checkbox from 'react-native-check-box'; // For terms checkbox
import { ScrollView } from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility
  const [modalVisible, setModalVisible] = useState(false); // For custom modal
  const [modalMessage, setModalMessage] = useState(''); // For modal message
  const [isSuccess, setIsSuccess] = useState(false); // To track success vs. error for styling
  const [isChecked, setIsChecked] = useState(false); // For terms and conditions checkbox

  // Advanced validation regex
  const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email with domain check
  const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits for Pakistan phone (after +92)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char

  const validateInputs = () => {
    if (!nameRegex.test(name.trim())) {
      setError('Name must contain only letters and spaces');
      return false;
    }
    if (!emailRegex.test(email.trim().toLowerCase())) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!phoneRegex.test(phone.trim())) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!passwordRegex.test(password.trim())) {
      setError('Password must be at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&)');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return false;
    }
    if (!isChecked) {
      setError('Please agree to the Terms and Conditions');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: `+92${phone.trim()}`,
        createdAt: new Date(),
      });
      setModalMessage('Account created successfully!');
      setIsSuccess(true);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('SignInScreen');
      }, 2000); // Auto-close modal after 2 seconds and navigate
    } catch (err) {
      setModalMessage(err.code === 'auth/email-already-in-use' ? 'Email already in use' : err.message);
      setIsSuccess(false);
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000); // Auto-close error modal after 2 seconds
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={require("./assets/plant.png")} style={styles.logo} />
        <Text style={styles.title}>Join PlantPal</Text>
        <Text style={styles.subtitle}>Grow your green journey today!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Image source={require("./assets/person-icon.png")} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor="#A3C4BC"
            autoCapitalize="words" // Capitalize each word for names
            accessibilityLabel="Full Name Input"
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require("./assets/email-icon.png")} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor="#A3C4BC"
            keyboardType="email-address"
            autoCapitalize="none" // Lowercase email
            autoCorrect={false}
            accessibilityLabel="Email Input"
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require("./assets/phone-icon.png")} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))} // Only allow numbers
            placeholderTextColor="#A3C4BC"
            keyboardType="phone-pad"
            maxLength={10} // Limit to 10 digits for Pakistan
            accessibilityLabel="Phone Number Input"
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require("./assets/lock-icon.png")} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholderTextColor="#A3C4BC"
            secureTextEntry={!showPassword}
            accessibilityLabel="Password Input"
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel="Toggle Password Visibility"
          >
            <Icon 
              name={showPassword ? 'visibility-off' : 'visibility'} 
              size={20} 
              color="#A3C4BC" 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Image source={require("./assets/lock-icon.png")} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            placeholderTextColor="#A3C4BC"
            secureTextEntry={!showConfirmPassword}
            accessibilityLabel="Confirm Password Input"
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            accessibilityLabel="Toggle Confirm Password Visibility"
          >
            <Icon 
              name={showConfirmPassword ? 'visibility-off' : 'visibility'} 
              size={20} 
              color="#A3C4BC" 
            />
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.termsContainer}>
          <Checkbox
            style={styles.checkbox}
            onClick={() => setIsChecked(!isChecked)}
            isChecked={isChecked}
            checkedCheckBoxColor="#2E7D32"
            uncheckedCheckBoxColor="#A3C4BC"
          />
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink} onPress={() => Alert.alert('Terms & Conditions', 'View our Terms & Conditions here.')}>Terms & Conditions</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SignInScreen')}
            accessibilityLabel="Log In Link"
          >
            <Text style={styles.footerLink}> Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Modal for Success/Error */}
        <Modal
          isVisible={modalVisible}
          onBackdropPress={closeModal}
          onBackButtonPress={closeModal}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { color: isSuccess ? '#2E7D32' : 'red' }]}>
              {modalMessage}
            </Text>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 19,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 5, // Reduced from 40 to bring inputs closer to subtitle
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '400',
    marginBottom: 5, // Reduced from 20 to bring inputs closer
  },
  content: {
    paddingVertical: 5, // Reduced from 10 to bring inputs closer
    alignItems: 'center',
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginVertical: 8, // Slightly reduced from 10 for tighter spacing
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingRight: 10,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 12,
    tintColor: '#A3C4BC',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    color: '#2E7D32',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  error: {
    color: 'red',
    marginVertical: 10,
    fontSize: 14,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  checkbox: {
    marginRight: 10,
  },
  termsText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  termsLink: {
    color: '#1B5E20',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});