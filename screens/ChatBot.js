import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ChatBot = () => {
  const API_KEY = 'AIzaSyDfhEK6nTkKkHrfM8kSFAReicL6TyB2Z-w'; 
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  const genAI = new GoogleGenerativeAI(API_KEY);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true); 
    

    try {
      const newChatHistory = [...chatHistory, { text: inputText, sender: 'user' }];
      setChatHistory(newChatHistory); 
      setInputText(''); 

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); 
      const result = await model.generateContent(inputText);
      const response = await result.response;
      const botResponse = response.text();
      setChatHistory([...newChatHistory, { text: botResponse, sender: 'bot' }]); 
    } catch (error) {
      console.error('Error fetching response:', error);
      console.error(error.response); 
      setChatHistory([...chatHistory, { text: 'An error occurred. Please try again later.', sender: 'bot' }]);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Ask Anything...</Text>
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {chatHistory.map((chat, index) => (
          <View
            key={index}
            style={[
              styles.chatBubble,
              { alignSelf: chat.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: chat.sender === 'user' ? 'skyblue' : 'lightgreen' },
            ]}
          >
            <Text style={styles.chat}>{chat.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setInputText}
          value={inputText}
          placeholder="Type your message..."
          placeholderTextColor={'grey'}
        />
        <Button style={styles.but} title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 140,
  
  },
  input: {
    color: 'black',
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: 20,
    padding: 8,
  },
  chatBubble: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  chat: {
    color: 'black',
    fontSize: 23,
  },
  head: {
    color: 'black',
    padding: 5,
    fontSize: 30,
    fontWeight: '700',
  },
  but: {
    borderRadius: 30,
    padding: 8,
  }
});

export default ChatBot;
