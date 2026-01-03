import * as React from "react";
import { Text, StyleSheet, View, Pressable, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUser } from '../api/authApi';

const journalCovers: { [key: string]: any } = {
  '1': require('../assets/journalCovers/1.png'),
  '2': require('../assets/journalCovers/2.png'),
  '3': require('../assets/journalCovers/3.png'),
  '4': require('../assets/journalCovers/4.png'),
};

const AskJournal = ({ navigation, route }: any) => {
  const { name, notificationDays, notificationTime } = route.params;
  const [selectedCover, setSelectedCover] = React.useState<string | null>(null);

  const handleCoverSelect = (coverNumber: string) => {
    setSelectedCover(coverNumber);
  };

  const handleFinish = async () => {
    if (selectedCover) {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) {
          console.error('No user data found');
          return;
        }
        
        const userData = JSON.parse(userDataString);
        
        const payload = {
          userId: userData.user_id,
          name: name,
          isOnboarded: true,
          notificationTime: notificationTime,
          notificationDays: notificationDays,
          coverChoice: selectedCover
        };

        // Update API
        await updateUser(payload);

        // Update local storage with merged data
        const new_payload = {
          userId: userData.user_id,
          name: name,
          isOnboarded: true,
          notification_time: notificationTime,
          notification_days: notificationDays,
          points: 15,
          subscription: "freeTier",
          coverChoice: selectedCover
        };
        const updatedUserData = {
          ...userData,
          ...new_payload
        };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

        navigation.navigate("OnboardLanguageSelection");
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>
        Choose Your Journal Cover
      </Text>

      <View style={styles.contentContainer}>
        {[1, 2, 3, 4].map((number) => (
          <Pressable
            key={number}
            onPress={() => handleCoverSelect(number.toString())}
            style={[
              styles.coverWrapper,
              selectedCover === number.toString() && styles.selectedCover
            ]}
          >
            <Image
              style={styles.contentImage}
              source={journalCovers[number.toString()]}
            />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.nextButton, !selectedCover && styles.disabledButton]}
        onPress={handleFinish}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginTop: 50,
    marginBottom: 10,
    textAlign: "center",
  },
  stepCircle: {
    backgroundColor: "#474d41",
    width: 33,
    height: 33,
    borderRadius: 16.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  stepText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  subHeader: {
    fontSize: 16,
    color: "#474d41",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  contentContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Enables wrapping
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
    paddingHorizontal: 40, // Adds padding for spacing
  },
  contentImage: {
    width: 120, // Adjust size for better layout
    height: 177,
    borderRadius: 7,
    resizeMode: "cover",
  },
  nextButton: {
    backgroundColor: "#474d41",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    position: "absolute",
    bottom: 40,
  },
  nextButtonText: {
    color: "#fcfaf0",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  coverWrapper: {
    borderRadius: 7,
    marginBottom: 20,
  },
  selectedCover: {
    borderWidth: 2,
    borderColor: '#474d41',
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default AskJournal;
