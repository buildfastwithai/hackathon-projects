import * as React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen.js';
import RegisterScreen from './screens/RegisterScreen.js';
import OnboardingScreen from './screens/OnboardingScreen.js';
import MainScreen from './screens/MainScreen.js';
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="onboard" component={OnboardingScreen} />
        <Stack.Screen options={{headerShown:false}} name="login" component={LoginScreen} />
        <Stack.Screen options={{headerShown:false}} name="register" component={RegisterScreen} />
        <Stack.Screen options={{headerShown:false}} name="main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
