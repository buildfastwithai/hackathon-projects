import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import VideoCard from './VideoCard'
import teach from '../assets/smart.png';
import { useNavigation } from '@react-navigation/native';
const Master = () => {
    const navigation=useNavigation();
  return (
    <ScrollView style={styles.container}>

      <VideoCard link={teach} text={"#1 Gerunds and Infinitives"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/CbPy_CjJR90?si=vwsjMBu7xbHvKyAe"});
      }}/>
      <VideoCard link={teach} text={"#2 Conditionals"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/exIcb2_PTVM?si=URj_L3z47HwWqsce"});
      }}/>
      <VideoCard link={teach} text={"#3 Reported Speech and The sequence of Tenses"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/sX7eLnvedMo?si=I3yt1ckpPOuf5Gwe"});
      }}/>
      <VideoCard link={teach} text={"#4 Inversion"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/Db4AC9iaj4c?si=bDkVTMvhnQuWg_uB"});
      }}/>
      <VideoCard link={teach} text={"#5 Modal Verbs"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/Q_7Uow5vXZM?si=pdBX48PoEE-xycAM"});
      }}/>
      <VideoCard link={teach} text={"#6 Perfect Infinitive + Perfect Gerund"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/TOixidGqEeY?si=iVZ8ALb__GSfybpj"});
      }}/>
      <VideoCard link={teach} text={"#7 Complex Gerunds and Infinitives *1"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/4SoEvIbzwh0?si=US1YMLs6xtukJxhg"});
      }}/>
      <VideoCard link={teach} text={"#8 Complex Gerunds and Infinitives *2"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/HZ0CBUsI93E?si=iIVZWjTBKubCw4V-"});
      }}/>
      <VideoCard link={teach} text={"#9 Ergative Verbs"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/gA7vk0GVOHc?si=wwcb-dOpvbi8jUV3"});
      }}/>
      <VideoCard link={teach} text={"#10 Stative Verbs *1"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/tj6fCMTUbKM?si=zCX1nhFU1m3kaLX8"});
      }}/>
      <VideoCard link={teach} text={"#11 Stative Verbs *2"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/F1P4bBy00vg?si=ONqM3TptDFtKz8yN"});
      }}/>
      <VideoCard link={teach} text={"#12 Subjunctive"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/rWmd39oMZws?si=mejafUSFVw5_L65c"});
      }}/>
      <VideoCard link={teach} text={"#13 Gradable and Non Gradable Adjectives"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/IfsMvzf5yHA?si=viNsWmEbe1PTkKUC"});
      }}/>
      <VideoCard link={teach} text={"#14 Determiners *1"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/eByGdzdn_rw?si=8MtwT53k6XvvFLVu"});
      }}/>
      <VideoCard link={teach} text={"#15 Determiners *2"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/oBYfoG5wBP8?si=lRJU9z8Rgv8qNWtX"});
      }}/>
      <VideoCard link={teach} text={"#16 Parallelism *1"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/YzInQMQ7hWE?si=M7rBLKN1Jl6RE4T3"});
      }}/>
      <VideoCard link={teach} text={"#17 Pareallelism *2"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/F5WDeNw9_Ek?si=DLwXNVfnEJ1QtZqL"});
      }}/>
      <VideoCard link={teach} text={"#18 Subject Verb Agreement"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/vNTiUh72lFo?si=uCRtCU1tHvreuJNK"});
      }}/>
      <VideoCard link={teach} text={"#19 IT/THERE"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/3Lj0_D1FZ3g?si=dv025nTdwHy9z4qB"});
      }}/>
      <VideoCard link={teach} text={"#20 Participle vs Gerund *1"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/BLJ9pFRy-No?si=WgBZR7ybp4Bgdur4"});
      }}/>
      <VideoCard link={teach} text={"#21 Grammar Misconceptions"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/HuNnWNu7gw0?si=5XznHaDjgiyMpcP_"});
      }}/>
      <VideoCard link={teach} text={"#22 Participle vs Gerund *2"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/wuBE2I6Dn-Y?si=Kc1GgIOwPt5FbDAM"});
      }}/>
      <VideoCard link={teach} text={"#23 Finite and Non-finite verb forms"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/1CAKkdFeOK4?si=KFrgnNdvy6q0XdKs"});
      }}/>
      <VideoCard link={teach} text={"#24 Relative or Content Clause?"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/-Qb99jxYPxg?si=mL4x0xYz4NhbAOnc"});
      }}/>
      <VideoCard link={teach} text={"#25 Types of Clause"} onPress={()=>{
        navigation.navigate('Player',{link:"https://www.youtube.com/embed/agMpwm7VnvM?si=lYFSL5pBcGfLmuQi"});
      }}/>
      <VideoCard link={teach} text={"#26 Complement inversion"} onPress={()=>{
          navigation.navigate('Player',{link:"https://www.youtube.com/embed/agMpwm7VnvM?si=lYFSL5pBcGfLmuQi"});
        }}/>
      <VideoCard link={teach} text={"#27 Fronting"} onPress={()=>{
          navigation.navigate('Player',{link:"https://www.youtube.com/embed/agMpwm7VnvM?si=lYFSL5pBcGfLmuQi"});
        }}/>


    </ScrollView>
  )
}

export default Master

const styles = StyleSheet.create({
container:{
    // display:'flex',
    // justifyContent:'center',
    // alignItems:'center',
    // gap:20,
}
})