import * as React from "react";
import { Text, StyleSheet, Image, View, Pressable } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitSurvey } from "../api/authApi";

const HIW = ({ navigation }: any) => {
  React.useEffect(() => {
    const submitSurveyData = async () => {
      try {
        // Get survey responses
        const surveyData = await AsyncStorage.getItem('surveyResponses');
        const userDataString = await AsyncStorage.getItem('userData');
        
        if (!surveyData || !userDataString) return;

        const { responses } = JSON.parse(surveyData);
        const userData = JSON.parse(userDataString);

        const surveyPayload = {
          userId: userData.user_id,
          question1: responses[0],
          question2: responses[1],
          question3: responses[2],
          question4: responses[3],
          question5: responses[4],
        };

        await submitSurvey(surveyPayload);
        // After successful submission, optionally clear the survey data
        await AsyncStorage.removeItem('surveyResponses');
      } catch (error) {
        console.error('Error submitting survey:', error);
      }
    };

    submitSurveyData();
  }, []);

  const Text1 = () => {
    return <Text style={styles.textButton}>1</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>How It Works</Text>
      <Text1 />
      <Text style={styles.subHeader}>
        Choose how you want to journal for the day.
      </Text>
      <View style={styles.optionsGrid}>
        <Image
          style={[styles.optionImage, styles.leftImage]}
          source={require("../assets/monologue.png")} // Replace with the correct image path
        />
        <Image
          style={[styles.optionImage, styles.rightImage]}
          source={require("../assets/dialogue.png")} // Replace with the correct image path
        />
        <Image
          style={[styles.optionImage, styles.leftImage]}
          source={require("../assets/type.png")} // Replace with the correct image path
        />
        <Image
          style={[styles.optionImage, styles.rightImage]}
          source={require("../assets/chat_ai.png")} // Replace with the correct image path
        />
        <Image
          style={[styles.optionImage, styles.leftImage]}
          source={require("../assets/prompt.png")} // Replace with the correct image path
        />
        <Image
          style={[styles.optionImage, styles.rightImage]}
          source={require("../assets/gratitude.png")} // Replace with the correct image path
        />
      </View>
      <Pressable
        style={styles.nextButton}
        onPress={() => navigation.replace("HIW2")}
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
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginTop: 50,
    marginBottom: 10,
  },
  textButton: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    backgroundColor: "#474d41",
    width: 33,
    height: 33,
    borderRadius: 16.5,
    textAlign: "center",
    textAlignVertical: "center", // Centers the text vertically
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    color: "#474d41",
    textAlign: "center",
    marginBottom: 30,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
    width: "100%",
  },
  optionImage: {
    width: 120,
    height: 143,
    marginBottom: 1,
  },
  leftImage: {
    marginLeft: 40,
  },
  rightImage: {
    marginRight: 40,
  },
  nextButton: {
    backgroundColor: "#474d41",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  nextButtonText: {
    color: "#fcfaf0",
    fontSize: 16,
    textAlign: "center",
  },
});

export default HIW;
