import * as React from "react";
import { Text, StyleSheet, Image, View, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the type for the navigation prop
type SessionStackParamList = {
  SessionMain: undefined;
  Monologue: undefined;
  Dialogue: undefined;
  Type: undefined;
  Chat: undefined;
  Prompt: undefined;
  Gratitude: undefined;
};

type SessionScreenNavigationProp = StackNavigationProp<SessionStackParamList, "SessionMain">;

const SessionScreen = () => {
  const navigation = useNavigation<SessionScreenNavigationProp>();

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Text style={styles.subHeader}>
        Choose how you want to journal for today.
      </Text>
      <Text style={styles.header}>Text</Text>
      <View style={styles.optionsGrid}>
        <View style={styles.row}>
          <Pressable
            onPress={() => navigation.navigate("Type")}
            style={styles.optionWrapper}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/type.png")}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Chat")}
            style={styles.optionWrapper}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/chat_ai.png")}
              resizeMode="contain"
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            onPress={() => navigation.navigate("Prompt")}
            style={styles.optionWrapper}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/prompt.png")}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Gratitude")}
            style={styles.optionWrapper}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/gratitude_based.png")}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
      
      <Text style={styles.header}>Voice</Text>
      <View style={styles.optionsGrid}>
        <View style={styles.row}>
          <Pressable
            onPress={() => navigation.navigate("Monologue")}
            style={styles.optionWrapper}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/monologue.png")}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Dialogue")}
            style={styles.optionWrapper}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/dialogue.png")}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fcfaf0",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20, // Add padding at bottom for better scrolling
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 20,
    marginBottom: 3,
  },
  subHeader: {
    fontSize: 16,
    color: "#474d41",
    textAlign: "center",
    marginBottom: 20,
    marginTop:20
  },
  optionsGrid: {
    width: '100%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  optionWrapper: {
    width: '48%', // Leave small gap between columns
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
});

export default SessionScreen;
