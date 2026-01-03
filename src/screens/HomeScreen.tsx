import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../store/hooks';
import { saveToken } from '../store/slices/notificationSlice';
import { fetchUserById } from '../store/slices/authSlice';

// Define screen types
type RootStackParamList = {
  HomeMain: undefined;
  Action: undefined;
  Mind: undefined;
  Therapy: undefined;
  Mood: undefined;
  Meditation: undefined;
  Courses: undefined;
};

// Define navigation prop type for HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeMain'>;

// Define the structure of an action
type Action = {
  id: string;
  title: string;
  image: any;
  screen: keyof RootStackParamList;
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState<string>('');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [remainingDays, setRemainingDays] = useState<number>(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUserDataAndSaveToken = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserName(parsedData.name);

          // Fetch latest user data
          const response = await dispatch(fetchUserById(parsedData.user_id)).unwrap();
          if (response.user.subscription === 'freeTier') {
            Alert.alert(
              'Free Tier Account',
              'You are currently on the free tier. Upgrade your subscription to access more features!',
              [{ text: 'OK' }]
            );
          }
          if (response.user.subscription === '7daysTrial') {
            const createdAt = new Date(response.user.created_at);
            const now = new Date();
            const trialEndDate = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
            const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            setRemainingDays(Math.max(0, daysRemaining));

            Alert.alert(
              '7 Days Free Trial',
              `You are currently on the 7 days free trial. You have ${daysRemaining} days remaining.\n\nUpgrade your subscription before trial expires to continue accessing all features!`,
              [{ text: 'OK' }]
            );
          }

          try {
            await dispatch(saveToken({
              userId: parsedData.user_id,
              name: parsedData.name
            })).unwrap();
          } catch (tokenError: any) {
            if (tokenError.message === 'No FCM token found') {
              console.log('error', tokenError);
            } else {
              console.error('Unknown error while saving token:', tokenError);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserDataAndSaveToken();
  }, []);

  const handlePlayGame = () => {
    Alert.alert(
      'Play Game',
      'Game feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const actions: Action[] = [
    { id: '1', title: 'Actions', image: require('../assets/home/actions.png'), screen: 'Action' },
    { id: '2', title: 'Insights', image: require('../assets/home/mind.png'), screen: 'Mind' },
    { id: '3', title: 'Therapy', image: require('../assets/home/therapy.png'), screen: 'Therapy' },
    { id: '4', title: 'Report', image: require('../assets/home/mood.png'), screen: 'Mood' },
    { id: '5', title: 'Meditation', image: require('../assets/home/meditation.png'), screen: 'Meditation' },
    { id: '6', title: 'Courses', image: require('../assets/home/courses.png'), screen: 'Courses' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.greeting}>
        {tokenError && <Text style={styles.errorText}>{tokenError}</Text>}
        <Text style={styles.title}>Hi, {userName}</Text>
        <Text style={styles.subtitle}>How is Your Mind Today?</Text>
      </View>

      {/* Play Game Button */}
      <TouchableOpacity style={styles.gameButton} onPress={handlePlayGame}>
        <Text style={styles.gameButtonText}>I Want Help</Text>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionItem}
            onPress={() => navigation.navigate(action.screen)}
          >
            <Image source={action.image} style={styles.actionImage} />
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF0',
    paddingHorizontal: 20,
  },
  greeting: {
    alignItems: 'center',
    marginVertical: 55,
  },
  day: {
    fontSize: 11,
    color: '#A6A6A6',
    fontFamily: 'Inter-Medium',
  },
  title: {
    fontSize: 35,
    marginVertical: 5,
    fontFamily: 'Ovo',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#A6A6A6',
    fontFamily: 'Inter-Regular',
  },
  gameButton: {
    backgroundColor: '#dcbb4eff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  actionItem: {
    width: '33%',
    alignItems: 'center',
    marginVertical: 15,
  },
  actionImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  actionText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default HomeScreen;