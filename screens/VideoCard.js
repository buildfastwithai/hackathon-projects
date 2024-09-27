import { StyleSheet, Text, View,TouchableOpacity ,Image,useWindowDimensions} from 'react-native'
import React from 'react'
const Dimensions=useWindowDimensions;
const VideoCard = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
        <Image source={props.link} style={styles.image}></Image>
        <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default VideoCard

const styles = StyleSheet.create({
    container:{
        display:'flex',
        justifyContent:'space-evenly',
        alignItems:'center',
        flexDirection:'row',
        borderTopRightRadius:20,
        borderBottomLeftRadius:20,
        borderTopLeftRadius:10,
        borderBottomRightRadius:5,
        backgroundColor:'#6a5acd',
        height:130,
        width:300,
        alignSelf:'center',
        marginTop:10,
    },
    image:{
        width:75,
        height:75,
        padding:10
    },
    text:{
        width:150,
        fontSize:20,
        fontWeight:'900',
        color:'white',
        padding:5,
    }
})