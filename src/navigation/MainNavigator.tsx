// Import necessary components
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, SafeAreaView, Keyboard } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import JourneyScreen from '../screens/JourneyScreen';
import SessionScreen from '../screens/SessionScreen';
import JournalScreen from '../screens/JournalScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ActionScreen from '../screens/HomePageScreens/Actions';
import Header from '../screens/Header';
import MindScreen from '../screens/HomePageScreens/Mind';
// import TherapyScreen from '../screens/HomePageScreens/Therapy';
import TherapyScreen from '../screens/HomePageScreens/TherapyLock';
import MoodScreen from '../screens/HomePageScreens/Mood';
import UserJournals from '../screens/JournalPageScreens/UserJournals';
import ReadJournal from '../screens/JournalPageScreens/ReadJournal';
import AITherapy from '../screens/SettingPageScreens/AITherapy';
import LanguageSelection from '../screens/SettingPageScreens/Language';
import BuyLeavesPage from '../screens/SettingPageScreens/BuyLeaves';
import VoiceSelection from '../screens/SettingPageScreens/Voice';
import Monologue from '../screens/SessionPageScreens/Monologue';
import Dialogue from '../screens/SessionPageScreens/Dialogue';
import Type from '../screens/SessionPageScreens/Type';
import Chat from '../screens/SessionPageScreens/Chat';
import Prompt from '../screens/SessionPageScreens/Prompt';
import Gratitude from '../screens/SessionPageScreens/Gratitude';
import TypeJournal from '../screens/SessionPageScreens/TypeJournal';
import ChatJournal from '../screens/SessionPageScreens/ChatJournal';
import AnalyseJournal from '../screens/SessionPageScreens/AnalyseJournal';
import PromptJournal from '../screens/SessionPageScreens/PromptJournal';
import GratitudeJournal from '../screens/SessionPageScreens/GratitudeJournal';
import MonologueJournal from '../screens/SessionPageScreens/MonologueJournal';
import DialogueJournal from '../screens/SessionPageScreens/DialogueJournal';
import { SubscriptionManager } from '../screens/SettingPageScreens/Subscriptions';

import VoidScreen from '../screens/HomePageScreens/Void';
import MeditationScreen from '../screens/HomePageScreens/Meditation';
import CoursesScreen from '../screens/HomePageScreens/Courses';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type RouteNames = 'Home' | 'Journey' | 'Session' | 'Journal' | 'Settings';

const icons: Record<RouteNames, { active: any; inactive: any }> = {
  Home: {
    active: require('../assets/icons/home-active.png'),
    inactive: require('../assets/icons/home-inactive.png'),
  },
  Journey: {
    active: require('../assets/icons/journey-active.png'),
    inactive: require('../assets/icons/journey-inactive.png'),
  },
  Session: {
    active: require('../assets/icons/session-active.png'),
    inactive: require('../assets/icons/session-inactive.png'),
  },
  Journal: {
    active: require('../assets/icons/journal-active.png'),
    inactive: require('../assets/icons/journal-inactive.png'),
  },
  Settings: {
    active: require('../assets/icons/settings-active.png'),
    inactive: require('../assets/icons/settings-inactive.png'),
  },
};

const TAB_BAR_HEIGHT = 60;

// Home stack navigator
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Action" component={ActionScreen} />
      <Stack.Screen name="Mind" component={MindScreen} />
      <Stack.Screen name="Therapy" component={TherapyScreen} />
      <Stack.Screen name="Mood" component={MoodScreen} />
      <Stack.Screen name="Void" component={VoidScreen} />
      <Stack.Screen name="Meditation" component={MeditationScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
    </Stack.Navigator>
  );
};

// Settings stack navigator
const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="AITherapy" component={AITherapy} />
      <Stack.Screen name="Language" component={LanguageSelection} />
      <Stack.Screen name="AICharacter" component={VoiceSelection} />
      <Stack.Screen name="Subscription" component={BuyLeavesPage} />
      <Stack.Screen name="BuySubscriptions" component={SubscriptionManager} />
    </Stack.Navigator>
  );
};

// Journal stack navigator
const JournalStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Placeholder" component={() => <></>} /> */}
      <Stack.Screen name="JournalMain" component={JournalScreen} />
      <Stack.Screen name="UserJournals" component={UserJournals} />
      <Stack.Screen name="ReadJournal" component={ReadJournal} />
    </Stack.Navigator>
  );
};


// Session stack navigator
const SessionStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Placeholder" component={() => <></>} /> */}
      <Stack.Screen name="SessionMain" component={SessionScreen} />
      <Stack.Screen name="Monologue" component={Monologue} />
      <Stack.Screen name="Dialogue" component={Dialogue} />
      <Stack.Screen name="Type" component={Type} />
      <Stack.Screen name="TypeJournal" component={TypeJournal} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatJournal" component={ChatJournal} />
      <Stack.Screen name="Prompt" component={Prompt} />
      <Stack.Screen name="Gratitude" component={Gratitude} />
      <Stack.Screen name="AnalyseJournal" component={AnalyseJournal} />
      <Stack.Screen name="PromptJournal" component={PromptJournal} />
      <Stack.Screen name="GratitudeJournal" component={GratitudeJournal} />
      <Stack.Screen name="MonologueJournal" component={MonologueJournal} />
      <Stack.Screen name="DialogueJournal" component={DialogueJournal} />
    </Stack.Navigator>
  );
};

// Main navigator with tabs
const MainNavigator = () => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      <SafeAreaView>
        <Header />
      </SafeAreaView>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const icon = focused
              ? icons[route.name as RouteNames].active
              : icons[route.name as RouteNames].inactive;

            return <Image source={icon} style={styles.icon} />;
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            display: isKeyboardVisible ? 'none' : 'flex',
            backgroundColor: '#FCFAF0',
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
            height: TAB_BAR_HEIGHT,
            paddingBottom: 8,
            paddingTop: 8,
          },
          // Add this to create bottom padding for content
          contentStyle: {
            backgroundColor: '#FCFAF0',
          },
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Journey" component={JourneyScreen} />
        <Tab.Screen name="Session" component={SessionStack} />
        <Tab.Screen name="Journal" component={JournalStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24, // Adjust the size as per your requirement
    height: 24,
    resizeMode: 'contain',
  },
});

export default MainNavigator;
