import * as React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Quiz from './Quiz';
import BeginnerQuiz from './BeginnerQuiz';
import IntermediateQuiz from './IntermediateQuiz';
import MasterQuiz from './MasterQuiz';
const Stack = createNativeStackNavigator();
const QuizMain = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="Quiz" component={Quiz} />
        <Stack.Screen options={{headerShown:false}} name="BeginnerQuiz" component={BeginnerQuiz} />
        <Stack.Screen options={{headerShown:false}} name="IntermediateQuiz" component={IntermediateQuiz} />
        <Stack.Screen options={{headerShown:false}} name="MasterQuiz" component={MasterQuiz} />
      </Stack.Navigator>
  )
}

export default QuizMain;
