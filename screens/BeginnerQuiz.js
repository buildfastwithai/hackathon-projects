import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView,Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
  {
    questionText: 'மேலே உள்ள இடத்தைக் குறிக்க நாம் என்ன முன்மொழிவைப் பயன்படுத்துகிறோம்?',
    answerOptions: [
      { answerText: 'In', isCorrect: false },
      { answerText: 'On', isCorrect: false },
      { answerText: 'Under', isCorrect: false },
      { answerText: 'Above', isCorrect: true },
    ],
  },
  {
    questionText: '"வணக்கம்" என்று சொல்வதன் அர்த்தம் என்ன?',
    answerOptions: [
      { answerText: 'Goodbye', isCorrect: false },
      { answerText: 'How are you?', isCorrect: false },
      { answerText: 'See you later', isCorrect: false },
      { answerText: 'Hi', isCorrect: true },
    ],
  },
  {
    questionText: 'யாராவது தும்மினால், அவர்களிடம் என்ன சொல்வீர்கள்?',
    answerOptions: [
      { answerText: 'Thank You', isCorrect: false},
      { answerText: 'You are Welcome', isCorrect: false },
      { answerText: 'Bless you', isCorrect: true},
      { answerText: 'Excuse Me', isCorrect: false },
    ],
  },
  {
    questionText: 'எதையாவது உள்ளே இருப்பதை விவரிக்க நாம் எந்த முன்மொழிவைப் பயன்படுத்துகிறோம்?',
    answerOptions: [
      { answerText: 'On', isCorrect: false },
      { answerText: 'Inside', isCorrect: true },
      { answerText: 'Outside', isCorrect: false },
      { answerText: 'Under', isCorrect: false },
    ],
  },
  {
    questionText: 'யாராவது உங்களுக்கு ஏதாவது கொடுத்தால் நீங்கள் என்ன சொல்கிறீர்கள்?',
    answerOptions: [
      { answerText: 'Hello', isCorrect: false },
      { answerText: 'Good Bye', isCorrect: false },
      { answerText: 'Thank You', isCorrect: true},
      { answerText: 'Sory', isCorrect: false },
    ],
  },
  {
    questionText: 'ஒரு இடத்தை விட்டு வெளியேறும்போது, ​​நீங்கள் பொதுவாக என்ன சொல்வீர்கள்?',
    answerOptions: [
      { answerText: 'How are you?', isCorrect: false},
      { answerText: 'Thank you', isCorrect: false },
      { answerText: 'Good Bye', isCorrect: true },
      { answerText: 'Excuse me', isCorrect: false },
    ],
  },
  {
    questionText: 'எந்த முன்மொழிவு ஒரு இடத்திலிருந்து மற்றொரு இடத்திற்கு நகர்வதைக் குறிக்கிறது?',
    answerOptions: [
      { answerText: 'In', isCorrect: false },
      { answerText: 'Into', isCorrect: true },
      { answerText: 'On', isCorrect: false },
      { answerText: 'Onto', isCorrect: false },
    ],
  },
  {
    questionText: 'உங்களுக்கு ஏதாவது புரியவில்லை மற்றும் பேச்சாளர் அதைத் திரும்பத் திரும்பச் சொல்ல விரும்பினால் நீங்கள் என்ன சொல்கிறீர்கள்?',
    answerOptions: [
      { answerText: 'I am sorry', isCorrect: false },
      { answerText: 'How are you?', isCorrect: false },
      { answerText: 'Please', isCorrect: false },
      { answerText: 'Excuse me?', isCorrect: true },
    ],
  },
  {
    questionText: 'காலையில் ஒருவரை வாழ்த்துவதற்கு நீங்கள் என்ன சொல்கிறீர்கள்?',
    answerOptions: [
      { answerText: 'Good Night', isCorrect: false },
      { answerText: 'Good Morning', isCorrect: true },
      { answerText: 'Good AfterNoon', isCorrect: false },
      { answerText: 'How are you?', isCorrect: false },
    ],
  },
  {
    questionText: 'நீங்கள் தற்செயலாக யாரையாவது குறுக்கிட்டால், நீங்கள் என்ன சொல்கிறீர்கள்?',
    answerOptions: [
      { answerText: 'Thank You', isCorrect: false },
      { answerText: 'Excuse me', isCorrect: true },
      { answerText: 'You are welcome', isCorrect: false },
      { answerText: 'Soory', isCorrect: false },
    ],
  },
  
  
];

export default function BeginnerQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testMarks, setTestMarks] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [username,setUsername]=useState('');

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
    const response = await axios.put('https://nodenode.vercel.app/user/update-test-marks', {
      username: username,
      testMarks: parseInt(testMarks) 
      
    });

    if (response.data.message) {
      Alert.alert(response.data.message);
    } else {
      Alert.alert('Test marks updated successfully');
    }
  } catch (error) {
    console.error('Error updating test marks:', error);
    Alert.alert('Failed to update test marks. Please try again later.');
  }
};


  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setTestMarks(testMarks + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setQuizEnded(true);
      handleUpdateMarks();
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0);
    setTestMarks(0);
    setQuizEnded(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!quizEnded ? (
        <View style={styles.quizContainer}>
          <Text style={styles.questionText}>{questions[currentQuestion].questionText}</Text>
          <View>
            {questions[currentQuestion].answerOptions.map((answerOption, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => handleAnswerOptionClick(answerOption.isCorrect)}
              >
                <Text style={styles.buttonText}>{answerOption.answerText}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Your score: {testMarks}/{questions.length}</Text>
          <TouchableOpacity style={styles.retakeButton} onPress={retakeQuiz}>
            <Text style={styles.buttonText}>Retake Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => {}}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    color:'purple',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  retakeButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical:10,
    paddingHorizontal:45,
  },
  scoreText: {
    color:'green',
    fontSize: 24,
    marginBottom: 20,
  },
});
