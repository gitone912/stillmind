import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

const LandingPage = ({ navigation }: any) => {
  const [currentScreen, setCurrentScreen] = useState(0); // Tracks which screen is being displayed
  const fadeAnims = useRef([
    new Animated.Value(0), // Fade for text 1
    new Animated.Value(0), // Fade for text 2
    new Animated.Value(0), // Fade for text 3
    new Animated.Value(0), // Fade for text 4
  ]).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; // For the logo and leaf fade animations

  useEffect(() => {
    if (currentScreen === 0) {
      // Animate the first four text elements
      fadeAnims.forEach((fadeAnim, index) => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }).start();
        }, index * 2000); // Delay each animation by 1 second
      });

      // After all text animations, move to the next phase
      setTimeout(() => {
        setCurrentScreen(1);
      }, fadeAnims.length * 2000 + 2000);
    } else if (currentScreen === 1) {
      // Logo fade-in and out
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            setCurrentScreen(2);
          });
        }, 2000);
      });
    } else if (currentScreen === 2) {
      // Leaf fade-in and out
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            navigation.replace('Survey');
          });
        }, 2000);
      });
    }
  }, [currentScreen]);

  const renderContent = () => {
    if (currentScreen === 0) {
      // Render all four text elements stacked vertically
      return (
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.text, { opacity: fadeAnims[0] }]}>
            The mind is like a tree
          </Animated.Text>
          <Animated.Text style={[styles.text, { opacity: fadeAnims[1] }]}>
            Each leaf is a thought, a memory, or an idea.
          </Animated.Text>
          <Animated.Text style={[styles.text, { opacity: fadeAnims[2] }]}>
            And just like a tree,
          </Animated.Text>
          <Animated.Text style={[styles.text, { opacity: fadeAnims[3] }]}>
            the mind needs nurturing to thrive.
          </Animated.Text>
        </View>
      );
    } else if (currentScreen === 1) {
      // Render the logo
      return (
        <Animated.Image
          source={require('../assets/logo_new.png')}
          style={[styles.image, { opacity: fadeAnim }]}
        />
      );
    } else if (currentScreen === 2) {
      // Render the leaf
      return (
        <Animated.Image
          source={require('../assets/logo_leaf.png')}
          style={[styles.logoImage, { opacity: fadeAnim }]}
        />
      );
    }
    return null;
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});

export default LandingPage;
