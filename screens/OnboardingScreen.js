import React,{useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import lot1 from '../assets/lot1.json';
import lot2 from '../assets/lot2.json';
import lot3 from '../assets/lot3.json';
import lot4 from '../assets/lot4.json';
import lot5 from '../assets/lot5.json';
import lot6 from '../assets/lot6.json';
const Dots = ({selected}) => {

    let backgroundColor;

    backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <View 
            style={{
                width:6,
                height: 6,
                marginHorizontal: 3,
                backgroundColor
            }}
            />
    );
}

const Skip = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:10}}
        {...props}
    >
        <Text style={{fontSize:16}}>Skip</Text>
    </TouchableOpacity>
);

const Next = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:10}}
        {...props}
    >
        <Text style={{fontSize:16}}>Next</Text>
    </TouchableOpacity>
);

const Done = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:10}}
        {...props}
    >
        <Text style={{fontSize:16}}>Done</Text>
    </TouchableOpacity>
);

const OnboardingScreen = ({navigation}) => {

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      if (userLoggedIn === 'true') {
        navigation.navigate('main');
      }
      else{
        
      }
    };
    
    checkLoginStatus();
  });

    return (
        <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        onSkip={() => navigation.replace("login")}
        onDone={() => navigation.navigate("login")}
        pages={[
          {
            backgroundColor: '#a6e4d0',
            image: <LottieView source={lot6} autoPlay loop onError={console.error} width={400} height={400}/>,
            title: <Text style={styles.title}>Connect to Learning</Text>,
            subtitle: 'A New Way To Learn Things in a better and best way, Learn Tamil , English and much More',
          },
          {
            backgroundColor: '#fdeb93',
            image: <LottieView source={lot3} autoPlay loop onError={console.error} width={400} height={400}/>,
            title: <Text style={styles.title}>Increase Your Knowledge</Text>,
            subtitle: 'Share Your Thoughts With Similar Kind of People',
          },
          {
            backgroundColor: '#98fb98',
            image: <LottieView source={lot5} autoPlay loop onError={console.error} width={400} height={400}/>,
            title: <Text style={styles.title}>Become The Star</Text>,
            subtitle: "Let The Spot Light Capture You",
          },
        ]}
      />
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  title:{
    fontSize:30,
    color:'#6B4AD4',
    fontWeight:'900',
    marginTop:'-20%',
    padding:5,
  }
});