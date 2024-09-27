import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState,useEffect } from 'react'
import Tts from 'react-native-tts';

const Story = () => {
    const [story,setStory]=useState('');
    const[loading,setLoading]=useState(false);
    const[controll,setControll]=useState('Speak');
    useEffect(() => {
        const fetchUserDetails = async () => {
          try {
            const response = await fetch(`https://new-node-917j.vercel.app/user/story`);
            if (!response) {
              throw new Error('Failed to fetch user details');
            }
            const userData = await response.json();
            setStory(userData.email);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        };
    
        fetchUserDetails();
      },[]);
    const handleSpeech=()=>{
        if(controll==='Speak'){
          setControll('STOP');
        Tts.speak(story,{
            androidParams:{
                KEY_PARAM_PAN:-1,
                KEY_PARAM_VOLUME:0.5,
                KEY_PARAM_STREAM:'STREAM_MUSIC',
            },
        });
    }
    else{
        Tts.stop();
        setControll('Speak');
    }
    };
  return (
    <>
    <ScrollView>
        <Text style={styles.head}>Today's Story</Text>
        {
            loading?(
                <LottieView
                source={require('../assets/welcomee.json')}
                autoPlay
                loop
                onError={console.error}
                style={{
                  height: 90,
                  width: 90,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: -45,
                  marginTop: -45,
                }}
              />
            ):
            ( 

                <Text style={styles.text}>{story}</Text>
            )
        }
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={()=>{
          handleSpeech();
        }}>
        <Text style={styles.speak}>{controll}</Text>
      </TouchableOpacity>
          </>
  )
}

export default Story

const styles = StyleSheet.create({

    text:{
        fontSize:15,
        // width:'80%',
        color:'black',
        padding:8,
        paddingLeft:10,
    },
    button:{
        display:'flex',
        position:'relative',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'black',
        padding:15,
        bottom:0,
    },
    speak:{
        color:'white',
        fontSize:26,
    },
    head:{
        color:'black',
        fontSize:30,
        fontWeight:'800',
        padding:10,
    }
})