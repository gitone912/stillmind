import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMindData } from "../../store/slices/mindSlice";
import { MindData } from "../../api/mindTaskApi";
import MoodGraphComponent from "./mood_graph_component";
import { fetchFrequentWords } from "../../store/slices/moodSlice";

type RootStackParamList = {
  Therapy: undefined;
  Session: undefined;
};

type MindScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const MindScreen = () => {
  const navigation = useNavigation<MindScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [latestMind, setLatestMind] = useState<MindData | null>(null);
  const { frequentWords, frequentWordsLoading, frequentWordsError } = useAppSelector(
    (state) => state.mood
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const { user_id } = JSON.parse(userData);
          dispatch(fetchFrequentWords(user_id));
          const result = await dispatch(getMindData(user_id)).unwrap();

          const entries = Object.values(result) as MindData[];
          if (entries.length > 0) {
            const latest = entries.reduce((prev: MindData, current: MindData) =>
              new Date(prev.created_at) > new Date(current.created_at) ? prev : current
            );
            setLatestMind(latest);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const renderFrequentWords = () => {
    if (frequentWordsLoading) {
      return <Text>Loading...</Text>;
    }
  
    if (frequentWordsError || !frequentWords || frequentWords.length === 0) {
      return (
        <View style={styles.wordBox}>
          <Text style={styles.word}>No Data Available</Text>
          <Text style={styles.wordCount}>Complete journals to generate insights</Text>
        </View>
      );
    }
  
    // Filter out empty words before rendering
    const filteredWords = frequentWords.filter(([word]) => word.trim() !== "");
  
    // If no valid words remain, don't show anything
    if (filteredWords.length === 0) {
      return null;
    }
  
    return filteredWords.map(([word, count], index) => (
      <View key={index} style={styles.wordBox}>
        <Text style={styles.word}>{word}</Text>
        <Text style={styles.wordCount}>Mentioned in {count} journals</Text>
      </View>
    ));
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Insights</Text>
      <Text style={styles.subtitle}>
        Based on your journal entries, here's a snapshot of your mental health status.
      </Text>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusText}>{latestMind?.title || "Mood Summary"}</Text>
        <Text style={styles.statusDescription}>
          {latestMind?.insight ||
            "Please complete one week of journal entries to get mood Summary"}
        </Text>
      </View>

      {/* Frequent Words Section */}
      <View style={styles.wordsContainer}>
        <Text style={styles.wordsTitle}>Frequent Issues</Text>
        {renderFrequentWords()}
      </View>

       {/* Mood Graph Component */}
       <View style={styles.moodGraphContainer}>
        <Text style={styles.sectionTitle}>Mood Tracking</Text>
        <MoodGraphComponent />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fcfaf0",
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontFamily: "Ovo",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    backgroundColor: "#fcfaf0",
    fontFamily: "Inter-Regular",
    color: "#979797",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: "#fcfaf0",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#b2b0b0",
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  statusText: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#b78418",
    textAlign: "center",
    marginBottom: 10,
  },
  statusDescription: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#5f5f5f",
    lineHeight: 20,
    textAlign: "justify",
  },
  wordsContainer: {
    backgroundColor: "#fcfaf0",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#b2b0b0",
    padding: 20,
    width: "100%",
    marginTop: 20,
  },
  wordsTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#000",
    marginBottom: 10,
    alignItems:"center",
    textAlign: "center",
  },
  wordBox: {
    backgroundColor: "#f7f6eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: "#b2b0b0",
  },
  word: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#333",
  },
  wordCount: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#979797",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  button: {
    flex: 1,
    backgroundColor: "#474d41",
    borderRadius: 7,
    padding: 12,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Regular",
  },
  moodGraphContainer: {
    backgroundColor: "#fcfaf0",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#b2b0b0",
    padding: 20,
    width: "100%",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#000",
    marginBottom: 10,
    alignItems:"center",
    textAlign: "center", // Center the text
  },
});

export default MindScreen;
