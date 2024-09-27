import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import game1 from '../assets/game1.jpg';
import game2 from '../assets/game2.jpg';
import game3 from '../assets/game3.jpg';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GamePlay from './GamePlay';

const Stack = createNativeStackNavigator();

const Game = () => {
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('GamePlay', { link: 'https://play.famobi.com/7-words' });
        }}>
          <Image source={game1} style={styles.img} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          navigation.navigate('GamePlay', { link: 'https://play.famobi.com/alien-quest' });

        }}>
          <Image source={game2} style={styles.img} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          navigation.navigate('GamePlay', { link: 'https://play.famobi.com/wordguess-2-heavy' });

        }}>
          <Image source={game3} style={styles.img} />
        </TouchableOpacity>

      </View>
    </>
  )
}

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  img: {
    height: 200,
    width: 200,
    borderRadius: 10,
    borderWidth:2,
    borderColor:'violet'
  }
});
