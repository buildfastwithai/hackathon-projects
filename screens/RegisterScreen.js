import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image,Alert } from 'react-native';
import register from '../assets/register.png';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';

const RegisterScreen = () => {

    const showToast2 = () => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Username already exists',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 10,
          bottomOffset: 40,
        });
      };

      const showToast3 = () => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Password and ConfirmPassword not Matched',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 10,
          bottomOffset: 40,
        });
      };

      const fillin = () => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Please Fill All Attributes',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 10,
          bottomOffset: 40,
        });
      };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const[loading,setLoading]=useState(false);
  const navigation=useNavigation();

  const handleRegister = async () => {
    if(username==="" || password==="" || confirmPassword==="" || email===""){
        fillin();
    }
    else if(password!==confirmPassword){
        showToast3();
    }
    else{
    const userName=username;
    try {
        setLoading(true);
      const response = await fetch('https://new-node-917j.vercel.app/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      console.log('Success', 'User created successfully');
      navigation.navigate('login',{showToast1: true});
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
}
  };
  
  return (
      <>
      {
        loading?
        (
            <LottieView source={require('../assets/welcomee.json')} autoPlay loop onError={console.error} style={{ height: 90,
                width: 90,
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: -45, 
                marginTop: -45,
            }} />
        ):
        (
    <View style={styles.container}>
        <Toast/>
                <Image source={register} style={styles.logo}></Image>
                <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setUsername(text)}
          />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
          />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
          />
      </View>
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>REGISTER</Text>
      </TouchableOpacity>
    </View>
)}
</>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  logo: {
    zIndex:1,
    height:160,
    width:160,
    marginBottom:20,
  },
  inputView: {
    width: '80%',
    borderBottomColor:'black',
    borderWidth:1.5,
    borderRadius: 25,
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    padding: 20,
    borderBlockStartColor:'#5218fa',
    borderBlockEndColor:'#cc00cc',
    borderRightWidth:5,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  registerBtn: {
    width: '80%',
    backgroundColor: '#5218fa',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  registerText: {
    color: 'white',
  },
});

export default RegisterScreen;
