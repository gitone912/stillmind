import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, BackHandler, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({ navigation }: any) => {
  useEffect(() => {
    // Prevent going back
    navigation.addListener('beforeRemove', (e: any) => {
      // Prevent default behavior of leaving the screen
      e.preventDefault();
    });

    // Handle hardware back button (Android)
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to prevent default behavior (going back)
      return true;
    });

    const handleLogout = async () => {
      try {
        // Clear all data from AsyncStorage
        await AsyncStorage.clear();
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    handleLogout();

    // Cleanup function
    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  const handleExit = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      
      // For Android, exit the app
      if (Platform.OS === 'android') {
        BackHandler.exitApp();
      }
    } catch (error) {
      console.error('Exit error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.thankYouText}>Thanks for using our app!</Text>
      <TouchableOpacity style={[styles.loginButton, styles.exitButton]} onPress={handleExit}>
        <Text style={styles.buttonText}>Exit App</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcfaf0',
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#474d41',
  },
  loginText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#474d41',
  },
  loginButton: {
    backgroundColor: '#474d41',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fcfaf0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    marginTop: 10,
    backgroundColor: '#8b0000',
  },
});

export default Logout;
