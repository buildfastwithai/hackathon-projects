import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import VideoCard from './VideoCard';
import begin from '../assets/newbie.png';
import intermediate from '../assets/intermediate.png';
import master from '../assets/master.png';
import { useNavigation } from '@react-navigation/native';
const Quiz = () => {
  const navigation=useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Choose Your Level</Text>
      <VideoCard onPress={()=>{
        navigation.navigate('BeginnerQuiz');
      }}
      link={begin}
      text="Beginner Quiz"
      />

      <VideoCard onPress={()=>{
      navigation.navigate('IntermediateQuiz');
      
    }}
    link={intermediate}
    text="Intermediate Quiz"
    />

      <VideoCard onPress={()=>{
    navigation.navigate('MasterQuiz');

      }}
      link={master}
      text="Master Quiz"
      />

    </View>
  )
}

export default Quiz

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        gap:20,
        
    },
    text:{
      color:'black',
      fontSize:25,
      paddingTop:'20%',

    }
})