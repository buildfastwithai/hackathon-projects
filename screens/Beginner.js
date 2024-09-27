import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import VideoCard from './VideoCard';
import teach from '../assets/smart.png';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Beginner = () => {
  const navigation = useNavigation();
  const handleVideoPress = async (text, link) => {
    try {
      const storedData = await AsyncStorage.getItem('videoData');
      const videoData = storedData ? JSON.parse(storedData) : [];

      videoData.push({ text, link });

    
      await AsyncStorage.setItem('videoData', JSON.stringify(videoData));

      navigation.navigate('Player', { link });
    } catch (error) {
      console.error('Error storing video data:', error);
    }
  };

  const videos = [
    { title: '#1 English Grammar Lessons', link: 'https://www.youtube.com/embed/gb_OixUVBrQ?si=TYHFX0da1Gycbtz4' },
    { title: '#2 Parts of Speech', link: 'https://www.youtube.com/embed/I7sVjQC5ndE?si=Yuyo9RVGqPJLp6kT' },
    { title: '#3 Noun', link: 'https://www.youtube.com/embed/42dsfpdACTw?si=LZh783Ud_50y82u' },
    { title: '#4 Collective Noun', link: 'https://www.youtube.com/embed/Bvc2jmDXurg?si=btpZ0xwxZN6A_5PH' },
    { title: '#5 Abstract Noun', link: 'https://www.youtube.com/embed/Kiiu1y24Bm4?si=TYhil16Ne-9HY-G6' },
    { title: '#6 Countable Noun', link: 'https://www.youtube.com/embed/seZjaGTV4IE?si=7RLy5VqQuoUyj9-Y' },
    { title: '#7 Pronoun', link: 'https://www.youtube.com/embed/ZcEoIc0fuBw?si=7iaIbtb0-IU5JmwD' },
    { title: '#8 Personal Pronoun', link: 'https://www.youtube.com/embed/d-S8TXb06Xo?si=P1GDrqC4CERJVojp' },
    { title: '#9 Possesive Pronoun', link: 'https://www.youtube.com/embed/d-S8TXb06Xo?si=jhMjScUHK3wJmc5m' },
    { title: '#10 Distributive Pronoun', link: 'https://www.youtube.com/embed/TJOgzse4OHo?si=yqoiQzM2YDUEn9_v' },
    { title: '#11 Relative Pronoun', link: 'https://www.youtube.com/embed/KmoA25POd3o?si=s1mWkcaEIIYJyfTP' },
    { title: '#12 Emphasizing Pronoun', link: 'https://www.youtube.com/embed/FdlY4kKlyqc?si=mq-iD1nVD_vke2Bs' },
    { title: '#13 100 Words *3', link: 'https://www.youtube.com/embed/dGr0gDcsNXY?si=RsfwHPaU0vFwhcS1' },
    { title: '#14 100 Words *4', link: 'https://www.youtube.com/embed/dGr0gDcsNXY?si=Jzw6d58hM83XZKer' },
    { title: '#15 100 Words *5', link: 'https://www.youtube.com/embed/wHT7ueHuAnY?si=V4gWYcxqQVimzSjj' },
    { title: '#16 500 Sentences Learning', link: 'https://www.youtube.com/embed/ahpVxJBp380?si=xfkAbw3PZ4pU18gk' },
    { title: '#17 25 Phrases', link: 'https://www.youtube.com/embed/Gt-JVw625rw?si=gS-L1817lA9bMw1a' },
    { title: '#18 500 Sentences *2', link: 'https://www.youtube.com/embed/Gt-JVw625rw?si=93bb5DEMmyDIVsk_' },
    { title: '#19 Noun', link: 'https://www.youtube.com/embed/ITRv30bJhPw?si=LuYz7g_V8djcFO_Y' },
    { title: '#20 Collective Noun', link: 'https://www.youtube.com/embed/ZUvSwQQHhps?si=LjnWO7bnJEu8-Hq9' },
    { title: '#21 Abstract Noun', link: 'https://www.youtube.com/embed/ZUvSwQQHhps?si=cygNA-xOpP3N8zfE' },
    { title: '#22 Countable Noun', link: 'https://www.youtube.com/embed/jpquA89elWs?si=dgTrwQ9Q2RJvgT_L' },
    { title: '#23 Pronoun', link: 'https://www.youtube.com/embed/jpquA89elWs?si=5iGJtb9ey6ljvMt6' },
    { title: '#24 Relative Pronoun', link: 'https://www.youtube.com/embed/3xKYSIXFYr0?si=Yo3NztV9zZV8ANgt' },
    { title: '#25 Direct and Indirect Speech', link: 'https://www.youtube.com/embed/5IcE--dtY5U?si=6iq0c1hKOxd9CEGp' },
  ];

  return (
    <ScrollView style={styles.container}>
      {videos.map((video, index) => (
        <VideoCard
          key={index}
          link={teach}
          text={video.title}
          onPress={() => handleVideoPress(video.title,video.link)}
        />
      ))}
    </ScrollView>
  );
};

export default Beginner;

const styles = StyleSheet.create({
container:{
    
  
}
})