import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './src/navigation/LandingPage';
import Survey from './src/navigation/Survey';
import HIW from './src/onboarding/HowItWorks1';
import HIW2 from './src/onboarding/HowItWorks2';
import HIW3 from './src/onboarding/HowItWorks3';
import AskName from './src/onboarding/AskName';
import AskNotification from './src/onboarding/AskNotification';
import AskJournal from './src/onboarding/AskJournal';
import OnboardLanguageSelection from './src/onboarding/onboardLangSettings';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="LandingPage"
      >
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="Survey" component={Survey} />
        <Stack.Screen name="HIW" component={HIW} />
        <Stack.Screen name="HIW2" component={HIW2} />
        <Stack.Screen name="HIW3" component={HIW3} />
        <Stack.Screen name="AskName" component={AskName} />
        <Stack.Screen name="AskNotification" component={AskNotification} />
        <Stack.Screen name="AskJournal" component={AskJournal} />
        <Stack.Screen name="OnboardLanguageSelection" component={OnboardLanguageSelection} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

