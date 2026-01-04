// Importing necessary libraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getStreak } from '../store/slices/journeySlice';
import { AppDispatch, RootState } from '../store';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// JSON data for the boxes
const data = [
  {
    id: '1',
    level: 'Level 1',
    title: 'Reflective Novice',
    subtitle: '3-day Streak',
    icon: '🌱',
    days: 3,
  },
  {
    id: '2',
    level: 'Level 2',
    title: 'Thoughtful Apprentice',
    subtitle: '7-day Streak',
    icon: '🌿',
    days: 7,
  },
  {
    id: '3',
    level: 'Level 3',
    title: 'Mindful Explorer',
    subtitle: '10-day Streak',
    icon: '🌳',
    days: 10,
  },
  {
    id: '4',
    level: 'Level 4',
    title: 'Insightful Pathfinder',
    subtitle: '30-day Streak',
    icon: '🌲',
    days: 30,
  },
  {
    id: '5',
    level: 'Level 5',
    title: 'Emotional Champion',
    subtitle: '50-day Streak',
    icon: '🏆',
    days: 50,
  },
  {
    id: '6',
    level: 'Level 6',
    title: 'Master of Reflection',
    subtitle: '90-day Streak',
    icon: '🔮',
    days: 90,
  },
  {
    id: '7',
    level: 'Level 7',
    title: 'Sage of Self-Awareness',
    subtitle: '150-day Streak',
    icon: '🧘‍♂️',
    days: 150,
  },
  {
    id: '8',
    level: 'Level 8',
    title: 'Enlightened Guide',
    subtitle: '200-day Streak',
    icon: '🌟',
    days: 200,
  },
  {
    id: '9',
    level: 'Level 9',
    title: 'Transcendent Mentor',
    subtitle: '250-day Streak',
    icon: '💠',
    days: 250,
  },
  {
    id: '10',
    level: 'Level 10',
    title: 'Reflection Luminary',
    subtitle: '365-day Streak',
    icon: '🌞',
    days: 365,
  },
];

const DayProgress = ({ currentDay, totalDays }: { currentDay: number; totalDays: number }) => (
  <Text style={styles.dayProgress}>Day {currentDay} of {totalDays}</Text>
);

const JourneyScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { streak } = useSelector((state: RootState) => state.journey);
  const [userName, setUserName] = useState('');

  const getUserName = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { name } = JSON.parse(userData);
        setUserName(name || '');
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getStreak());
      getUserName();
    }, [dispatch])
  );

  const currentDay = streak;

  // Render a single box item
  const renderItem = ({ item }: { item: { id: string; level: string; title: string; subtitle: string; icon: string; days: number } }) => {
    const isRunning = currentDay <= item.days && currentDay > (data.find((box) => box.id === (parseInt(item.id) - 1)?.toString())?.days || 0);
    const isCompleted = currentDay > item.days;
    const isActive = currentDay >= item.days;

    return (
      <View
        style={[
          styles.box,
          isActive && styles.activeBox,
          isRunning && styles.runningBox,
        ]}
      >
        <Text style={[styles.icon, isCompleted ? styles.activeText : styles.defaultText]}>{item.icon}</Text>
        <Text style={[styles.level, isCompleted ? styles.activeText : styles.defaultText]}>{item.level}</Text>
        <Text style={[styles.title, isCompleted ? styles.activeText : styles.defaultText]}>{item.title}</Text>
        {isRunning ? (
          <DayProgress currentDay={currentDay} totalDays={item.days} />
        ) : (
          <Text style={[styles.subtitle, isCompleted ? styles.activeText : styles.defaultText]}>{item.subtitle}</Text>
        )}
      </View>
    );
  };

  const renderLine = () => <View style={styles.line} />;

  return (
    <View style={styles.container}>
      <Text style={styles.dayText}>Day {currentDay}</Text>
      <Text style={styles.description}>
        {userName}, you are just beginning your reflective journey. By reaching this level, you've taken the first step toward self-awareness. Every big journey starts with small, meaningful steps.
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            {renderItem({ item })}
            {index < data.length - 1 && renderLine()}
          </>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false} // Hides the scroll bar
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF0',
    padding: 16,
    alignItems: 'center',
  },
  listContainer: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 24,
    fontFamily: 'Ovo',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#979797',
    textAlign: 'center',
    marginBottom: 20,
    width: 284,
    height: 134,
  },
  box: {
    backgroundColor: '#FCFAF0',
    borderRadius: 15,
    width: 220,
    height: 100,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#8f8f8f',
    borderWidth: 0.5,
  },
  activeBox: {
    backgroundColor: "#474d41",
  },
  runningBox: {
    backgroundColor: '#FCFAF0',
  },
  title: {
    fontSize: 13,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
  },
  icon: {
    fontSize: 15,
    marginBottom: 4,
  },
  activeText: {
    color: '#FFFFFF',
  },
  defaultText: {
    color: '#000',
  },
  line: {
    height: 90,
    width: 1,
    backgroundColor: '#8f8f8f',
    alignSelf: 'center',
  },
  dayProgress: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#000',
    textAlign: 'center',
    marginTop: 4,
  },
  level: {
    fontSize: 11,
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
});

export default JourneyScreen;
