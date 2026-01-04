import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './src/navigation/LandingPage';
import MainNavigator from './src/navigation/MainNavigator';
import Survey from './src/navigation/Survey';
import LoginPage from './src/screens/LoginScreen';
import HIW from './src/onboarding/HowItWorks1';
import HIW2 from './src/onboarding/HowItWorks2';
import HIW3 from './src/onboarding/HowItWorks3';
import AskName from './src/onboarding/AskName';
import AskNotification from './src/onboarding/AskNotification';
import AskJournal from './src/onboarding/AskJournal';
import SignInEmail from './src/screens/SigninEmail';
import VerifyOTP from './src/screens/VerifyOTP';
import { Provider } from "react-redux";
import store from "./src/store";
import OldUserLanding from './src/navigation/OldUserLanding';
import OnboardLanguageSelection from './src/onboarding/onboardLangSettings';
import Logout from './src/screens/Logout';

const Stack = createStackNavigator();

interface UserData {
  user_id: string;
  email: string;
  name: string;
  is_onboarded: boolean;
  [key: string]: any;
}

const App = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkUserData = async (): Promise<void> => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const parsedData: UserData = JSON.parse(userDataString);
          if (parsedData.user_id) {
            setInitialRoute('OldUserLanding');
          } else {
            setInitialRoute('LandingPage');
          }
        } else {
          setInitialRoute('LandingPage');
        }
      } catch (error) {
        console.error('Error checking user data:', error);
        setInitialRoute('LandingPage');
      }
    };

    checkUserData();
  }, []);

  if (!initialRoute) return null;

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={initialRoute}
        >
          <Stack.Screen name="OldUserLanding" component={OldUserLanding} />
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="Survey" component={Survey} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SigninEmail" component={SignInEmail} />
          <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
          <Stack.Screen name="HIW" component={HIW} />
          <Stack.Screen name="HIW2" component={HIW2} />
          <Stack.Screen name="HIW3" component={HIW3} />
          <Stack.Screen name="AskName" component={AskName} />
          <Stack.Screen name="AskNotification" component={AskNotification} />
          <Stack.Screen name="AskJournal" component={AskJournal} />
          <Stack.Screen name="OnboardLanguageSelection" component={OnboardLanguageSelection} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Logout" component={Logout} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
