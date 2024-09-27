import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from '../assets/back.png';
import Home from './Home';
import Profile from './Profile';
import Report from './Report';
import Notification from './Notification';
import home from '../assets/home.png';
import profile from '../assets/profile.png';
import report from '../assets/report.png';
import notification from '../assets/notification.png';
import chat from '../assets/chat-bot.png';
import quiz from '../assets/ideas.png';
import chate from '../assets/chat.png';
import Beginner from './Beginner';
import Intermediate from './Intermediate';
import Master from './Master';
import VideoPlayer from './VideoPlayer';
import History from './History';
import { useNavigation } from '@react-navigation/native';
import QuizMain from './QuizMain';
import ChatBot from './ChatBot';
import Story from './Story';
import VoiceTest from './VoiceTest';
import GroupChat from './GroupChat';
import Game from './Game';
import GamePlay from './GamePlay';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainScreen=()=>{
      const navigation = useNavigation();
  return (
      <Stack.Navigator initialRouteName="TabNavigator" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: true,
          headerLeft: ({onPress}) => (
            <TouchableOpacity onPress={onPress} style={{ marginLeft: 10, paddingRight: 10 }}>
              <Image source={AntDesign} style={{height:20,width:20}}/>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10, backgroundColor: 'lightgrey', borderRadius: 50, padding: 10 }}>
              <Image source={notification} style={{ height: 25, width: 25 }} />
            </TouchableOpacity>
          ),
        }}
      />
          <Stack.Screen
        name="Beginner"
        component={Beginner}
        options={{
            headerShown: true
        }}
    />
    <Stack.Screen
        name="Intermediate"
        component={Intermediate}
        options={{
            headerShown: true
        }}
    />
    <Stack.Screen
        name="Master"
        component={Master}
        options={{
            headerBlurEffect:'prominent',
            headerShown: true
        }}
    />
    <Stack.Screen
        name="Player"
        component={VideoPlayer}
        options={{
            headerBlurEffect:'prominent',
            headerShown: true
        }}
    />
    <Stack.Screen
        name="History"
        component={History}
        options={{
            headerBlurEffect:'prominent',
            headerShown: true
        }}
    />
    <Stack.Screen
        name="Story"
        component={Story}
        options={{
            headerBlurEffect:'prominent',
            headerShown: true
        }}
    />
    <Stack.Screen
        name="VoiceTest"
        component={VoiceTest}
        options={{
            headerBlurEffect:'prominent',
            headerShown: true
        }}
    />
    <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
            headerBlurEffect:'prominent',
            // headerShown: true
        }}
    />
    <Stack.Screen
        name="Game"
        component={Game}
        options={{
            headerBlurEffect:'prominent',
            // headerShown: true
        }}
    />
    <Stack.Screen
        name="GamePlay"
        component={GamePlay}
        options={{
            headerBlurEffect:'prominent',
            // headerShown: true
        }}
    />
 
      </Stack.Navigator>
  );
}

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName='home'
      screenOptions={() => ({
        tabBarStyle: [
          {
            position: 'relative',
            width: '90%',
            alignSelf: 'center',
            borderRadius: 16,
            height: '10%',
            marginTop: '-30%',
            bottom: '3%',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ],
        headerShown: false,
      })}
    >

      <Tab.Screen
        name="report"
        component={Report}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ backgroundColor: focused ? '#ff0090' : 'transparent', borderRadius: 50, padding: 13 }}>
              <Image
                source={focused ? report : report}
                style={{ width: size, height: size, tintColor: focused ? 'white' : 'black' }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="chatbot"
        component={ChatBot}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ backgroundColor: focused ? '#ff0090' : 'transparent', borderRadius: 50, padding: 13 }}>
              <Image
                source={focused ? chat : chat}
                style={{ width: size, height: size, tintColor: focused ? 'white' : 'black' }}
              />
            </View>
          ),
        }}
      />

        <Tab.Screen
          name="home"
          component={Home}
          options={({ navigation, route }) => ({
            tabBarIcon: ({ focused, color, size }) => (
              <View style={{ backgroundColor: focused ? '#ff0090' : 'transparent', borderRadius: 50, padding: 20 ,marginTop: focused ? -20 : 0}}>
                <Image
                  source={focused ? home : home}
                  style={{ width: size, height: size, tintColor: focused ? 'white' : 'black' }}
                />
              </View>
            ),
            tabBarShowLabel: false,
          })}
        />

        <Tab.Screen
          name="quizmain"
          component={QuizMain}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, color, size }) => (
              <View style={{ backgroundColor: focused ? '#ff0090' : 'transparent', borderRadius: 50, padding: 13,}}>
                <Image
                  source={focused ? quiz : quiz}
                  style={{ width: size, height: size, tintColor: focused ? 'white' : 'black' }}
                />
              </View>
            ),
          }}
        />
      <Tab.Screen
        name="groupChat"
        component={GroupChat}
        options={{
          // headerShown:true,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ backgroundColor: focused ? '#ff0090' : 'transparent', borderRadius: 50, padding: 13 }}>
              <Image
                source={focused ? chate : chate}
                style={{ width: size, height: size, tintColor: focused ? 'white' : 'black' }}
              />
            </View>
          ),
        }}
      />


    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default MainScreen;