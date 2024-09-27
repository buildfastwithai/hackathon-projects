import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image,Alert } from 'react-native';
import Voice from '@react-native-voice/voice';
import mic from '../assets/mic.png';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const questions = ['sunday', 'monday', ]; 

const VoiceTest = () => {
    const correct=()=>{
    Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Rightly said',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 10,
        bottomOffset: 40,
      });
    };
    
      const wrong = () => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Common Try again',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 10,
          bottomOffset: 40,
        });
      };
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState('');

  const [testEnded, setTestEnded] = useState(false);
  const [voiceTestMarks, setVoiceTestMarks] = useState('0');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [currentQuestionIndex]);

  const onSpeechStart = () => {
    console.log('Speech started');
  };

  const onSpeechEnd = () => {
    console.log('Speech ended');
  };

  const onSpeechResults = (e) => {
    setResult(e.value[0]);
    console.log('Speech results:', e.value[0]);
  
   
    if (e.value[0].toLowerCase() === questions[currentQuestionIndex]) {
      setVoiceTestMarks(parseInt(voiceTestMarks) + 1); 
      correct();
    } else {
      wrong();
    }
  

    if (currentQuestionIndex === questions.length - 1) {
      endTest();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.log('Error starting recognition:', e);
    }
  };

  const endTest = () => {
    setTestEnded(true);
    handleUpdateMarks();
    Voice.destroy();
  };

  const retakeTest = () => {
    setTestEnded(false);
    setCurrentQuestionIndex(0);
    setVoiceTestMarks(0);
    setResult('');
  };
  const [username, setUsername] = useState('');
  useEffect(() => {
    const fetchData = async () => {
        try {
            const storedName = await AsyncStorage.getItem('name');
            setUsername(storedName);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);

const handleUpdateMarks = async () => {
  try {
    const response = await axios.put('https://nodenode.vercel.app/user/update-voice-test-marks', {
      username: username,
      voiceTestMarks: parseInt(voiceTestMarks) 
    });

    if (response.data.message) {
      Alert.alert(response.data.message);
    } else {
      Alert.alert('Voice test marks updated successfully');
    }
  } catch (error) {
    console.error('Error updating voice test marks:', error);
    Alert.alert('Failed to update voice test marks. Please try again later.');
  }
};



  return (
    <View style={styles.container}>
      <Toast />
      <Text style={styles.head}>Voice Test</Text>

      {!testEnded ? (
        <>
          {/* Display current question */}
          <Text style={styles.question}>{questions[currentQuestionIndex]}</Text>

          <TouchableOpacity onPress={startRecognizing}>
            <Image source={mic} style={styles.img} />
          </TouchableOpacity>

          <Text style={styles.result}>Result: {result}</Text>
          <Text style={styles.score}>Score: {voiceTestMarks}</Text>
        </>
      ) : (
        <>
          <Text style={styles.finalScore}>Final Score: {voiceTestMarks} / {questions.length}</Text>
          <TouchableOpacity onPress={retakeTest} style={styles.button}>
            <Text style={styles.buttonText}>Retake Test</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={endTest} style={styles.button}>
            <Text style={styles.buttonText}>End Test</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default VoiceTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    color: 'black',
    padding: 10,
    fontSize: 25,
    fontWeight: '800',
  },
  question: {
    color:'green',
    marginTop: 20,
    fontSize: 50,
    fontWeight: 'bold',
  },
  img: {
    marginTop: 20,
    width: 100,
    height: 100,
  },
  result: {
      color:'black',
    marginTop: 20,
    fontSize: 20,
  },
  score: {
      color:'black',

    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  finalScore: {
    color:'black',
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
