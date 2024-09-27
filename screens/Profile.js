import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, ActivityIndicator,TextInput,Alert } from 'react-native';
import AntDesign from '../assets/back.png';
import notification from '../assets/notification.png';
const { width, height } = Dimensions.get('window');
import profill from '../assets/prof.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
const Card = (props) => {
    return (
        <>
      <View style={styles.profill}>
        <Text style={{ fontSize: 25, fontWeight: '500', alignSelf: 'center',color:'black' }}>{props.name}</Text>
        <Image source={profill} style={{ height: 55, width: 55, borderRadius: 50, alignSelf: 'center' }} />
      </View>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 70, padding: 15 }}>
          <Text style={{color:'grey'}}>User Name:</Text>
          <Text style={{color:'grey'}}>{props.userName}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 70, padding: 15 }}>
          <Text style={{color:'grey'}}>Mail Id:</Text>
          <Text style={{color:'grey'}}>{props.email}</Text>
        </View>
      </View>
    </>
  );
};

const Profile = () => {
  
    const navigation=useNavigation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [feedback, setFeedback] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedName = await AsyncStorage.getItem('name');
                setName(storedName);
                setUsername(storedName);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const updateFeedback = () => {
      if (!username || !feedback) {
        Alert.alert('Error', 'Please provide both username and feedback');
        return;
      }
  
      axios.put('https://new-node-917j.vercel.app/user/update-feedback', { username, feedback })
        .then(response => {
          Alert.alert('Success', response.data.message);
          
          setUsername('');
          setFeedback('');
        })
        .catch(error => {
          Alert.alert('Error', 'Failed to update feedback');
          console.error('Error updating feedback:', error);
        });
    };
    
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`https://new-node-917j.vercel.app/user/${name}`);
          if (!response) {
            throw new Error('Failed to fetch user details');
          }
          const userData = await response.json();
          setUser(userData);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
  
      fetchUserDetails();
    }, [name]); 

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={{ marginLeft: 10, paddingRight: 10 }}>
            <Image source={AntDesign} style={{height:20,width:20}}/>
          </TouchableOpacity>
          <Text style={{ fontSize: 20 ,color:'black'}}>Profile</Text>
        </View>
        <TouchableOpacity style={{ marginRight: 10, backgroundColor: 'lightgrey', borderRadius: 50, padding: 10 }}
        onPress={()=>{
            navigation.navigate('Notification');
        }}
        >
          <Image source={notification} style={{ height: 25, width: 25 }} />
        </TouchableOpacity>
      </View>
      <View>
        {loading ? (
          <ActivityIndicator size="50%" color="#978cd0" style={{top:"60%"}}/>
        ) : (
          <Card {...user} name={name}/>
        )}
      </View>
      <TextInput
              style={styles.inputText}
              placeholder="Feedback"
              placeholderTextColor="#003f5c"
              value={feedback}
              onChangeText={(text) => setFeedback(text)}
            />

      <TouchableOpacity style={styles.logout} onPress={()=>{
        updateFeedback();
      }}>
        <Text style={styles.log}>SEND</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={()=>{
        AsyncStorage.removeItem('userLoggedIn');
        AsyncStorage.removeItem('name');
        navigation.navigate('login');
      }}>
        <Text style={styles.log}>LOGOUT</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: width,
  },
  head: {
    width: width,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '5%',
  },
  card: {
    marginTop: '5%',
    alignItems: 'center',
    backgroundColor: '#dcd9ef',
    width: width - 50,
    borderRadius: 15,
    alignSelf: 'center',
  },
  profill: {
    width: width - 60,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: '10%',
    flexDirection: 'row',
  },
  logout:{
    marginTop:15,
    alignSelf:'center',
    display:'flex',
    alignItems:'center',
    backgroundColor:'black',
    width:'50%',
    borderRadius:20,
  },
  log:{
    fontSize:24,
    padding:10,
    color:'white',
  },
  inputText: {
    marginTop:20,
    height: 100,
    color: 'black',
    borderWidth:1,
    borderColor:'black',
    width:'85%',
    alignSelf:'center',
    borderRadius:15,
  },
});
