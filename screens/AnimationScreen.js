// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, StatusBar, Platform, Image, Animated } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import LottieView from 'lottie-react-native';
// import * as Haptics from 'expo-haptics';

// const AnimationScreen = ({ navigation }) => {
//   const animation = useRef(null);
//   const [animationError, setAnimationError] = useState(false);
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

//     // Start pulsing animation for fallback
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(scaleAnim, {
//           toValue: 1.1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleAnim, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Play Lottie animation
//     if (animation.current && !animationError) {
//       try {
//         animation.current.play();
//       } catch (error) {
//         console.error('Lottie Play Error:', error);
//         setAnimationError(true);
//       }
//     }

//     // Auto-navigate to DashboardScreen after 3 seconds
//     const timer = setTimeout(() => {
//       navigation.replace('DashboardScreen');
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [navigation, animationError, scaleAnim]);

//   return (
//     <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//       {animationError ? (
//         <View style={styles.fallback}>
//           <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//             <Image
//               source={require('./assets/plant-leaf.png')}
//               style={styles.fallbackLogo}
//               onError={(e) => console.error('Fallback Logo Error:', e.nativeEvent.error)}
//             />
//           </Animated.View>
//           <Text style={styles.loadingText}>Welcome to PlantPal!</Text>
//         </View>
//       ) : (
//         <>
//           <LottieView
//             ref={animation}
//             source={require('./assets/plant-loading.json')}
//             autoPlay
//             loop
//             style={styles.animation}
//             onAnimationFailure={(error) => {
//               console.error('Lottie Animation Failure:', error);
//               setAnimationError(true);
//             }}
//             onError={(error) => console.error('Lottie Load Error:', error)}
//           />
//           <Text style={styles.loadingText}>Welcome to PlantPal!</Text>
//         </>
//       )}
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
//   },
//   animation: {
//     width: 150,
//     height: 150,
//   },
//   fallback: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   fallbackLogo: {
//     width: 100,
//     height: 100,
//     marginBottom: 16,
//   },
//   loadingText: {
//     fontSize: 18,
//     color: '#2E7D32',
//     marginTop: 16,
//     fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
//     fontWeight: '600',
//   },
// });

// export default AnimationScreen;






import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';

const AnimationScreen = ({ navigation }) => {
  const animation = useRef(null);
  const [animationError, setAnimationError] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const secondTextOpacity = useRef(new Animated.Value(0)).current;
  const backgroundScale = useRef(new Animated.Value(1)).current;
  const leaf1Rotate = useRef(new Animated.Value(0)).current;
  const leaf2Rotate = useRef(new Animated.Value(0)).current;
  const leafOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Haptic feedback sequence
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 1000);

    // Text animations
    Animated.sequence([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 800,
        delay: 700,
        useNativeDriver: true,
      }),
      Animated.timing(secondTextOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Background pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundScale, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Leaf particle animations
    Animated.parallel([
      Animated.timing(leafOpacity, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(leaf1Rotate, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.timing(leaf2Rotate, {
          toValue: -1,
          duration: 4000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Fallback pulse for error case
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Play Lottie animation
    if (animation.current && !animationError) {
      try {
        animation.current.play();
      } catch (error) {
        console.error('Lottie Play Error:', error);
        setAnimationError(true);
      }
    }

    // Auto-navigate to DashboardScreen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('DashboardScreen');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, animationError, scaleAnim, textOpacity, secondTextOpacity, backgroundScale, leaf1Rotate, leaf2Rotate, leafOpacity]);

  const leaf1Rotation = leaf1Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const leaf2Rotation = leaf2Rotate.interpolate({
    inputRange: [-1, 0],
    outputRange: ['-360deg', '0deg'],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: backgroundScale }] }]}>
      <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={StyleSheet.absoluteFill} />
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {animationError ? (
        <View style={styles.fallback}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Image
              source={require('./assets/plant-leaf.png')}
              style={styles.fallbackLogo}
              onError={(e) => console.error('Fallback Logo Error:', e.nativeEvent.error)}
            />
          </Animated.View>
          <Animated.Text style={[styles.loadingText, { opacity: textOpacity }]}>
            Welcome to PlantPal!
          </Animated.Text>
          <Animated.Text style={[styles.loadingText, { opacity: secondTextOpacity }]}>
            Grow with love 🌱
          </Animated.Text>
        </View>
      ) : (
        <View style={styles.animationContainer}>
          <Animated.Image
            source={require('./assets/leaf.png')}
            style={[styles.leaf, styles.leaf1, { transform: [{ rotate: leaf1Rotation }], opacity: leafOpacity }]}
          />
          <Animated.Image
            source={require('./assets/leaf.png')}
            style={[styles.leaf, styles.leaf2, { transform: [{ rotate: leaf2Rotation }], opacity: leafOpacity }]}
          />
          <LottieView
            ref={animation}
            source={require('./assets/plant-loading.json')}
            autoPlay
            loop
            style={styles.animation}
            onAnimationFailure={(error) => {
              console.error('Lottie Animation Failure:', error);
              setAnimationError(true);
            }}
            onError={(error) => console.error('Lottie Load Error:', error)}
          />
          <Animated.Text style={[styles.loadingText, { opacity: textOpacity }]}>
            Welcome to PlantPal!
          </Animated.Text>
          <Animated.Text style={[styles.loadingText, { opacity: secondTextOpacity }]}>
            Grow with love 🌱
          </Animated.Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  animation: {
    width: 150,
    height: 150,
  },
  leaf: {
    width: 50,
    height: 50,
    position: 'absolute',
  },
  leaf1: {
    top: -50,
    left: -80,
  },
  leaf2: {
    bottom: -50,
    right: -80,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackLogo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#2E7D32',
    marginTop: 16,
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AnimationScreen;