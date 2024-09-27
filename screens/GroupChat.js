import React, { useEffect, useState } from 'react';
import { View ,Text,StyleSheet} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateID = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const GroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await AsyncStorage.getItem('name');
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const unsubscribeListener = firestore()
      .collection('groupMessages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const formattedMessages = querySnapshot.docs.map((doc) => {
          const message = doc.data();
          return {
            _id: doc.id,
            text: message.text,
            createdAt: message.createdAt.toDate(),
            user: {
              _id: message.senderId,
              name: message.senderName,
            },
          };
        });
        setMessages(formattedMessages); 
      });
  
    return () => unsubscribeListener();
  }, []);

  const onSend = async (newMessages = []) => {
    if (!user) return; 

    const message = {
      _id: generateID(),
      text: newMessages[0].text,
      createdAt: new Date(),
      senderId: user, 
      senderName: user,
    };
    await firestore()
      .collection('groupMessages')
      .add(message);
  };

  return (
    <View style={{ flex: 1, marginBottom:140 }}>
      <Text style={styles.head}>Learning Community</Text>
      <GiftedChat
        textInputProps={{
            style: { color: 'black',width:'80%' } 
        }}
        messages={messages}
        onSend={onSend}
        user={{
          _id: user,
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: 'lightgray' },
              right: { backgroundColor: 'green' },
            }}
          />
        )}
      />
    </View>
  );
};

export default GroupChat;
const styles=StyleSheet.create({
  head:{
    color:'black',
    fontSize:28,
    padding:12,
    fontWeight:'600',
  }
})