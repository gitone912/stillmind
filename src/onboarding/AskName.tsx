import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Pressable, TextInput } from "react-native";

const AskName = ({ navigation }: any) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    navigation.replace("AskNotification", { name });
  };

  return (
    <View style={styles.safeAreaGuide}>
      {!showPrompt ? (
        <Text style={styles.initialMessage}>Welcome! Let's get started...</Text>
      ) : (
        <>
          <Text style={[styles.whatIsYour, styles.textLayout]}>
            What is your first name?
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <Pressable
            style={[styles.rectangleParent, styles.groupChildLayout]}
            onPress={handleNext}
          >
            <View style={[styles.groupChild, styles.groupChildLayout]} />
            <Text style={styles.next}>Next</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textLayout: {
    height: 53,
    width: "80%",
    color: "#474d41",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Inter-Regular",
    lineHeight: 22,
    position: "absolute",
  },
  groupChildLayout: {
    height: 46,
    width: 99,
    position: "absolute",
  },
  whatIsYour: {
    top: "40%",
    left: "10%",
  },
  textInput: {
    top: "45%",
    left: "10%",
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "#474d41",
    fontSize: 18,
    textAlign: "center",
    position: "absolute",
  },
  groupChild: {
    top: 0,
    left: 0,
    borderRadius: 43,
    backgroundColor: "#474d41",
  },
  next: {
    top: 12,
    left: 17,
    fontSize: 14,
    color: "#fcfaf0",
    width: 65,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontFamily: "Inter-Regular",
    lineHeight: 22,
    position: "absolute",
  },
  rectangleParent: {
    top: "80%",
    left: "40%",
  },
  safeAreaGuide: {
    backgroundColor: "#fcfaf0",
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  initialMessage: {
    fontSize: 18,
    color: "#474d41",
    textAlign: "center",
    fontFamily: "Inter-Regular",
    position: "absolute",
  },
});

export default AskName;
