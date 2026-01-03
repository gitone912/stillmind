import React, { useState } from "react";
import { StyleSheet, Text, Pressable, View, Image, Alert, ActivityIndicator } from "react-native";
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookTherapySession } from '../../store/slices/therapySlice';
import { AppDispatch } from '../../store'; // Make sure you have this type exported from your store
import { fetchUserById } from '../../store/slices/authSlice';

interface UserData {
  user_id: string;
  points: number;
  name: string;
  email: string;
}

const TherapyScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleTherapyBooking = async (therapyName: string, points: number) => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'Please login first');
        return;
      }
      
      const userData = JSON.parse(userDataString) as UserData;
      
      if (userData.points < points) {
        Alert.alert('Error', 'Insufficient leaf points');
        return;
      }

      Alert.alert(
        'Confirm Booking',
        `Would you like to book ${therapyName}? This will cost ${points} leaf points.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: async () => {
              try {
                setIsLoading(true);
                await dispatch(bookTherapySession({
                  userId: userData.user_id, // Changed from userId to user_id
                  therapyName,
                  pointsUsed: points
                })).unwrap();
                
                // Update user data to reflect new points balance
                await dispatch(fetchUserById(userData.user_id)).unwrap();
                
                Alert.alert(
                  'Success',
                  'Therapy session booked successfully! Please check your email for details.',
                  [{ text: 'OK' }]
                );
              } catch (error) {
                Alert.alert('Error', 'Failed to book therapy session');
              } finally {
                setIsLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', typeof error === 'string' ? error : 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      {/* Existing content with blur effect */}
      <View style={styles.blurredContent}>
        <Text style={styles.title}>Therapy</Text>
        <Text style={styles.subtitle}>
          Select a therapy type to begin your therapy session.
        </Text>

        <View style={styles.optionContainer}>
          {/* AI Therapy Button */}
          <Pressable style={[styles.button, styles.aiButton]} disabled>
            <Text style={styles.buttonText}>AI Therapy</Text>
          </Pressable>
          <View style={styles.costContainer}>
            <Image source={require('../../assets/leaf.png')} style={styles.leafIcon} />
            <Text style={styles.costText}>10</Text>
          </View>
        </View>

        <View style={styles.optionContainer}>
          {/* Human Therapy Button */}
          <Pressable style={[styles.button, styles.humanButton]} disabled>
            <Text style={styles.buttonText}>Human Therapy</Text>
          </Pressable>
          <View style={styles.costContainer}>
            <Image source={require('../../assets/leaf.png')} style={styles.leafIcon} />
            <Text style={styles.costText}>40</Text>
          </View>
        </View>
      </View>

      {/* Coming Soon Overlay */}
      <View style={styles.comingSoonOverlay}>
        <Text style={styles.comingSoonText}>Coming Soon!</Text>
        <Text style={styles.comingSoonSubtext}>We're working on something amazing!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    fontSize: 30,
    fontFamily: "Ovo",
    color: "#000",
    marginBottom: 20,
  },
  leafIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#979797",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 40,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    width: 213,
    height: 79,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  aiButton: {
    backgroundColor: "#1878d1",
  },
  humanButton: {
    backgroundColor: "#41ad49",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    color: "#fff",
  },
  costContainer: {
    width: 79,
    height: 79,
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'row',
    borderColor: "#b6b6b6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  costText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#777",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#777",
  },
  blurredContent: {
    opacity: 0.5,
    width: '100%',
    alignItems: 'center',
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(252, 250, 240, 0.7)',
  },
  comingSoonText: {
    fontSize: 40,
    fontFamily: 'Ovo',
    color: '#777',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 220
  },
  comingSoonSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#777',
    textAlign: 'center',
  },
});

export default TherapyScreen;
