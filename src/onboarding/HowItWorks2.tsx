import * as React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";

const HIW2 = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.header}>How It Works</Text>
      <View style={styles.stepCircle}>
        <Text style={styles.stepText}>2</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subHeader}>
        Mindleaf intelligently converts the session into a journal entry.
      </Text>

      {/* Content Image */}
      <View style={styles.contentContainer}>
        <Image
          style={styles.contentImage}
          source={require("../assets/entry-card.png")} // Replace with correct image path
        />
      </View>

      {/* Next Button */}
      <Pressable
        style={styles.nextButton}
        onPress={() => navigation.replace("HIW3")}
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
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  contentImage: {
    width: 300,
    height: 350,
    borderRadius: 22,
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
});

export default HIW2;
