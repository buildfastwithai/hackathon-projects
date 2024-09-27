import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image ,Alert} from 'react-native';
import login from '../assets/login.png';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const LoginScreen = ({ route }) => {
  
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
  
    const showToast1 = () => {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Incorrect Password',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 10,
        bottomOffset: 40,
      });
    };
    
    const showToast2 = () => {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'User does not exist',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 10,
        bottomOffset: 40,
      });
    };
    
    const showToast3 = () => {
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'User Registration Success',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 10,
        bottomOffset: 40,
      });
    };
    
    const navigation=useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (username==='' || password==='') {
      fillin();
    } else {
      setLoading(true);
      let userName = username;
      try {
        const response = await fetch('https://new-node-917j.vercel.app/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName, password }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const result = await response.json();
        if (result === 'success') {
          await AsyncStorage.setItem('userLoggedIn', 'true');
          await AsyncStorage.setItem('name', username);
          navigation.navigate('main');
          setLoading(false);
        } else if (result === 'incorrect') {
          setLoading(false);
          showToast1();
        } else{
          setLoading(false);
          showToast2();
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  useEffect(() => {
    if (route.params?.showToast1) {
      showToast3();
    }
  }, [route.params?.showToast1]);

  const handleRegister = () => {
    navigation.navigate('register');
  };

  return (
    <>
      {loading ? (
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
      ) : (
        <View style={styles.container}>
          <Image source={login} style={styles.logo} />
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Username"
              placeholderTextColor="#003f5c"
              value={username}
              onChangeText={(text) => setUsername(text)}
              />
          </View>
              <Toast/>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 160,
    width: 160,
    marginBottom: 20,
  },
  inputView: {
    width: '80%',
    borderBottomColor: 'black',
    borderWidth: 1.3,
    borderRadius: 25,
    height: 50,
    marginBottom: 15,
    justifyContent: 'center',
    padding: 20,
    borderBlockStartColor: '#5218fa',
    borderBlockEndColor: '#cc00cc',
    borderRightWidth: 5,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#5218fa',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  loginText: {
    color: 'white',
  },
  registerBtn: {
    width: '80%',
    backgroundColor: '#cc00cc',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  registerText: {
    color: 'white',
  },
});
