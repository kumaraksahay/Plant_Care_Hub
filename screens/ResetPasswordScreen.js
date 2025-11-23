// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet } from "react-native";
// // import { auth } from "../firebaseConfig";
// import { sendPasswordResetEmail} from "firebase/auth";
// // import { auth } from "./firebase";
// import { auth } from "./firebaseConfig";
// // import { getAuth, sendPasswordResetEmail } from "@firebase/auth";


// export default function ResetPasswordScreen({ navigation }) {
//   const [email, setEmail] = useState("");
// //   const auth = getAuth();

//   const handleResetPassword = () => {
    
//       sendPasswordResetEmail(auth,email)
//       .then(() => {
//         alert("Password reset email sent!");
//         navigation.navigate("SignInScreen");
//       })
//       .catch((error) => alert(error.message));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Reset Password</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <Button title="Send Reset Email" onPress={handleResetPassword} />
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
// });




import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, ScrollView, ActivityIndicator, Alert, Easing } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; // Expo-native gradient, version ~14.0.2
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Title fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Button bounce animation
    Animated.timing(bounceAnim, {
      toValue: 1,
      duration: 1500,
      delay: 500,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, bounceAnim]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation

  const handleResetPassword = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!emailRegex.test(email.trim().toLowerCase())) {
      setError('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
        navigation.navigate("SignInScreen");
      })
      .catch((error) => {
        console.log('Firebase Error:', error); // Log Firebase errors for debugging
        alert(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient
        colors={['#E8F5E9', '#C8E6C9']} // Soft green gradient
        style={styles.background}
      >
        <View style={styles.header}>
          <Animated.Text
            style={[styles.title, { opacity: fadeAnim }]}
          >
            Reset Password
          </Animated.Text>
          <Text style={styles.subtitle}>Enter your email to reset your password</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#A3C4BC"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email Input"
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Animated.View
            style={[
              styles.buttonContainer,
              { transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }], opacity: bounceAnim },
            ]}
          >
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleResetPassword}
              disabled={isLoading}
              accessibilityLabel="Send Reset Email Button"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Email</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              styles.backButtonContainer,
              { transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }], opacity: bounceAnim },
            ]}
          >
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.navigate('SignInScreen')}
              accessibilityLabel="Back to Login Button"
            >
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32', // PlantPal’s dark green
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#4CAF50', // PlantPal’s light green
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingHorizontal: 15,
  },
  input: {
    paddingVertical: 12,
    color: '#2E7D32',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginVertical: 10,
    fontSize: 14,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50', // PlantPal’s green for button
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    width: '80%',
    marginVertical: 5,
  },
  backButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});