import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const questions = [
  {
    questionText: 'What is the past participle of the verb "eat"?',
    answerOptions: [
      { answerText: 'Eat', isCorrect: false },
      { answerText: 'Ate', isCorrect: false },
      { answerText: 'Eaten', isCorrect: false },
      { answerText: 'Eating', isCorrect: true },
    ],
  },
  {
    questionText: 'What does the word "ubiquitous" mean?',
    answerOptions: [
      { answerText: 'Rare', isCorrect: false },
      { answerText: 'Common', isCorrect: false },
      { answerText: 'Temporary', isCorrect: false },
      { answerText: 'Obscure', isCorrect: true },
    ],
  },
  {
    questionText: 'What is the main idea of the passage you just read?',
    answerOptions: [
      { answerText: 'The benefits of exercise', isCorrect: false},
      { answerText: 'The history of the internet', isCorrect: false },
      { answerText: 'Tips for cooking healthy meals', isCorrect: true},
      { answerText: 'The importance of recycling', isCorrect: false },
    ],
  },
  {
    questionText: 'What did the speaker say was the reason for the delay?',
    answerOptions: [
      { answerText: 'Traffic', isCorrect: false },
      { answerText: 'Weather', isCorrect: true },
      { answerText: 'Mechanical issues', isCorrect: false },
      { answerText: 'Construction', isCorrect: false },
    ],
  },
  {
    questionText: 'Which sentence is grammatically correct?',
    answerOptions: [
      { answerText: '', isCorrect: false },
      { answerText: 'Good Bye', isCorrect: false },
      { answerText: 'Thank You', isCorrect: true},
      { answerText: 'Sory', isCorrect: false },
    ],
  },
  {
    questionText: 'What is the synonym of "sufficient"?',
    answerOptions: [
      { answerText: 'How are you?', isCorrect: false},
      { answerText: 'Thank you', isCorrect: false },
      { answerText: 'Good Bye', isCorrect: true },
      { answerText: 'Excuse me', isCorrect: false },
    ],
  },
  {
    questionText: 'Rewrite the following sentence using the passive voice: "The cat chased the mouse."',
    answerOptions: [
      { answerText: 'In', isCorrect: false },
      { answerText: 'Into', isCorrect: true },
      { answerText: 'On', isCorrect: false },
      { answerText: 'Onto', isCorrect: false },
    ],
  },
  {
    questionText: 'What is the author opinion on climate change?',
    answerOptions: [
      { answerText: 'I am sorry', isCorrect: false },
      { answerText: 'How are you?', isCorrect: false },
      { answerText: 'Please', isCorrect: false },
      { answerText: 'Excuse me?', isCorrect: true },
    ],
  },
  {
    questionText: 'What was the main topic of the lecture you just heard? ',
    answerOptions: [
      { answerText: 'Good Night', isCorrect: false },
      { answerText: 'Good Morning', isCorrect: true },
      { answerText: 'Good AfterNoon', isCorrect: false },
      { answerText: 'How are you?', isCorrect: false },
    ],
  },
  {
    questionText: 'Choose the correct form of the verb to complete the sentence: "She ________ to the store yesterday."',
    answerOptions: [
      { answerText: 'Thank You', isCorrect: false },
      { answerText: 'Excuse me', isCorrect: true },
      { answerText: 'You are welcome', isCorrect: false },
      { answerText: 'Soory', isCorrect: false },
    ],
  },
  
  // Add more questions here
];

export default function IntermediateQuiz() {
  const navigation=useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setQuizEnded(true);
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
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
          <Text style={styles.scoreText}>Your score: {score}/{questions.length}</Text>
          <TouchableOpacity style={styles.retakeButton} onPress={retakeQuiz}>
            <Text style={styles.buttonText}>Retake Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => {}}>
            <Text style={styles.buttonText}
            onPress={()=>{

            }}  
            >Close</Text>
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
