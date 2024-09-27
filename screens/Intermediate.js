import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import VideoCard from './VideoCard'
import teach from '../assets/smart.png';
import { useNavigation } from '@react-navigation/native';
const Intermediate = () => {
    const navigation=useNavigation();
  return (
    <ScrollView style={styles.container}>

      <VideoCard link={teach} text={"#1 Reading"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/oYI3dzny8n8?si=UFmnqrywF8RqAhk0"});
      }}/>
      <VideoCard link={teach} text={"#2 Listening"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/taOQboGLPfg?si=fglqMAx7AsY5tco4"});
      }}/>
      <VideoCard link={teach} text={"#3 Vocabulary"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/R-R_YNV9swM?si=COa1aMmyvGw2c_uF"});
      }}/>
      <VideoCard link={teach} text={"#4 Auxiliary Verbs"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/Ml545MtKgOg?si=dWw2-8TnK7U7EOU9"});
      }}/>
      <VideoCard link={teach} text={"#5 Vocabulary and Making Questions"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/gdCJkqsbEzA?si=MHbeSJo_QAge9hnz"});
      }}/>
      <VideoCard link={teach} text={"#6 Have & Have Got"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/TOixidGqEeY?si=iVZ8ALb__GSfybpj"});
      }}/>
      <VideoCard link={teach} text={"#7 Auxiliary Verbs & Making Questions"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/4SoEvIbzwh0?si=US1YMLs6xtukJxhg"});
      }}/>
      <VideoCard link={teach} text={"#8 Vocabulary"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/HZ0CBUsI93E?si=iIVZWjTBKubCw4V-"});
      }}/>
      <VideoCard link={teach} text={"#9 Present Simple & Continuous"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/gA7vk0GVOHc?si=wwcb-dOpvbi8jUV3"});
      }}/>
      <VideoCard link={teach} text={"#10 State & Dynamic Verbs"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/tj6fCMTUbKM?si=zCX1nhFU1m3kaLX8"});
      }}/>
      <VideoCard link={teach} text={"#11 Present Passive"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/F1P4bBy00vg?si=ONqM3TptDFtKz8yN"});
      }}/>
      <VideoCard link={teach} text={"#12 Vocabulary & PastSimple/Continuous"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/rWmd39oMZws?si=mejafUSFVw5_L65c"});
      }}/>
      <VideoCard link={teach} text={"#13 Vocabulary & Simple Sentences"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/IfsMvzf5yHA?si=viNsWmEbe1PTkKUC"});
      }}/>
      <VideoCard link={teach} text={"#14 Vocabulary & Compound Sentences"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/eByGdzdn_rw?si=8MtwT53k6XvvFLVu"});
      }}/>
      <VideoCard link={teach} text={"#15 Past Perfect *1"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/oBYfoG5wBP8?si=lRJU9z8Rgv8qNWtX"});
      }}/>
      <VideoCard link={teach} text={"#16 Past Perfect *2"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/YzInQMQ7hWE?si=M7rBLKN1Jl6RE4T3"});
      }}/>
      <VideoCard link={teach} text={"#17 Reading & Past Passive"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/F5WDeNw9_Ek?si=DLwXNVfnEJ1QtZqL"});
      }}/>
      <VideoCard link={teach} text={"#18 Vocabulary & Listening"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/vNTiUh72lFo?si=uCRtCU1tHvreuJNK"});
      }}/>
      <VideoCard link={teach} text={"#19 Listening & Modal Verbs"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/3Lj0_D1FZ3g?si=dv025nTdwHy9z4qB"});
      }}/>
      <VideoCard link={teach} text={"#20 Vocabulary & Modal Verbs"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/BLJ9pFRy-No?si=WgBZR7ybp4Bgdur4"});
      }}/>
      <VideoCard link={teach} text={"#21 Complex Sentences & Modal Verbs"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/HuNnWNu7gw0?si=5XznHaDjgiyMpcP_"});
      }}/>
      <VideoCard link={teach} text={"#22 How to make Requests"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/wuBE2I6Dn-Y?si=Kc1GgIOwPt5FbDAM"});
      }}/>
      <VideoCard link={teach} text={"#23 Making Comparisons"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/1CAKkdFeOK4?si=KFrgnNdvy6q0XdKs"});
      }}/>
      <VideoCard link={teach} text={"#24 Future *1"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/-Qb99jxYPxg?si=mL4x0xYz4NhbAOnc"});
      }}/>
      <VideoCard link={teach} text={"#25 Future *2"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/agMpwm7VnvM?si=lYFSL5pBcGfLmuQi"});
      }}/>


    </ScrollView>
  )
}

export default Intermediate

const styles = StyleSheet.create({
container:{
    // display:'flex',
    // justifyContent:'center',
    // alignItems:'center',
    // gap:20,
}
})