import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import VideoCard from './VideoCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import teach from '../assets/smart.png';
const History = () => {
  const navigation = useNavigation();
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('videoData');
        if (storedData) {
          setVideoData(JSON.parse(storedData).reverse());
        }
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchData();
  }, []);

  const handleVideoPress = (link) => {
    navigation.navigate('Player', { link });
  };

  return (
    <ScrollView style={styles.container}>
      {videoData.map((video, index) => (
        <VideoCard
          key={index}
          link={teach}
          text={video.text}
          onPress={() => handleVideoPress(video.link)}
        />
      ))}
    </ScrollView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
  },
});
