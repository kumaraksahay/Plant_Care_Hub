import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim1 = useRef(new Animated.Value(0)).current;
  const buttonAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo gentle breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for background elements
    Animated.loop(
      Animated.timing(floatingAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // Particle animations
    Animated.loop(
      Animated.timing(particle1, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(particle2, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(particle3, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Title fade and slide up
    Animated.spring(titleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Subtitle fade and slide, delayed
    Animated.timing(subtitleAnim, {
      toValue: 1,
      duration: 1000,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Buttons spring animation, staggered
    Animated.spring(buttonAnim1, {
      toValue: 1,
      tension: 40,
      friction: 6,
      delay: 400,
      useNativeDriver: true,
    }).start();

    Animated.spring(buttonAnim2, {
      toValue: 1,
      tension: 40,
      friction: 6,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const logoScale = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const logoRotate = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const titleTranslateY = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const subtitleTranslateY = subtitleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const floatingY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  const particle1Y = particle1.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const particle2Y = particle2.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -150],
  });

  const particle3Y = particle3.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -120],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F2027', '#203A43', '#2C5364']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {/* Decorative floating particles */}
        <Animated.View 
          style={[
            styles.particle, 
            { 
              left: '15%', 
              transform: [{ translateY: particle1Y }],
              opacity: 0.3 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.particle, 
            { 
              left: '70%', 
              transform: [{ translateY: particle2Y }],
              opacity: 0.25 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.particle, 
            { 
              left: '45%', 
              transform: [{ translateY: particle3Y }],
              opacity: 0.2 
            }
          ]} 
        />

        {/* Decorative circles */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />

        <View style={styles.header}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: logoScale },
                  { rotate: logoRotate },
                  { translateY: floatingY },
                ],
              },
            ]}
          >
            <View style={styles.logoGlow}>
              <Image
                source={require("./assets/plant-logo.png")}
                style={styles.logo}
                onError={(e) => console.log('Logo failed to load:', e.nativeEvent.error)}
              />
            </View>
          </Animated.View>

          <Animated.View
            style={{
              opacity: titleAnim,
              transform: [{ translateY: titleTranslateY }],
            }}
          >
            <Text style={styles.title}>PlantPal</Text>
            <View style={styles.titleUnderline} />
          </Animated.View>

          <Animated.Text
            style={[
              styles.subtitle,
              { 
                opacity: subtitleAnim, 
                transform: [{ translateY: subtitleTranslateY }] 
              },
            ]}
          >
            Nurture your green companions{'\n'}with smart care & love 🌿
          </Animated.Text>
        </View>

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.buttonWrapper,
              { 
                opacity: buttonAnim1,
                transform: [{ scale: buttonAnim1 }]
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.buttonPrimary} 
              onPress={() => navigation.navigate('SignUpScreen')}
              activeOpacity={0.8}
              accessibilityLabel="Sign Up Button"
            >
              <LinearGradient
                colors={['#56AB2F', '#A8E063']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonTextPrimary}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.buttonWrapper,
              { 
                opacity: buttonAnim2,
                transform: [{ scale: buttonAnim2 }]
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.buttonSecondary} 
              onPress={() => navigation.navigate('SignInScreen')}
              activeOpacity={0.8}
              accessibilityLabel="Log In Button"
            >
              <Text style={styles.buttonTextSecondary}>I Have an Account</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.footerText}>
            Join 10,000+ plant lovers worldwide 🌎
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  background: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A8E063',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(168, 224, 99, 0.1)',
  },
  decorCircle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  decorCircle2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -50,
  },
  header: {
    flex: 2.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(168, 224, 99, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A8E063',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(168, 224, 99, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#A8E063',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
    paddingHorizontal: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  buttonWrapper: {
    width: '100%',
    marginVertical: 8,
  },
  buttonPrimary: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#A8E063',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(168, 224, 99, 0.5)',
  },
  buttonTextSecondary: {
    color: '#A8E063',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footerText: {
    marginTop: 30,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontWeight: '400',
  },
});