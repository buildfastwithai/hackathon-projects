import { StyleSheet, Text, View , TouchableOpacity,Image,Dimensions, ScrollView, Linking,BackHandler} from 'react-native'
import React from 'react'
import AntDesign from '../assets/back.png';
import notification from '../assets/notification.png';
const { width, height } = Dimensions.get('window');
import report from '../assets/reportin.png';
import download from '../assets/download.png';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const Card=(props)=>{
    return(
    <>
    <View style={styles.carder}>
                <TouchableOpacity style={{display:'flex',flexDirection:'row',gap:8,padding:10}}>
                    <View style={{backgroundColor:'#978cd0',borderRadius:50,padding:15,borderColor:'darkblue',borderWidth:1.7}}>
                        <Image source={report} style={{height:20,width:20}}/>
                    </View>
                    <Text style={{color:'grey',alignSelf:'center',color:'black'}}>{props.name}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{padding:10}} onPress={()=>{
                  Linking.openURL(props.url);
                }}>
                    <Image source={download} style={{height:30,width:30,alignSelf:'center'}}/>
                </TouchableOpacity>
    </View>
    </>
    )
}

const Report = () => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
      
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

    
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
    const navigation=useNavigation();
  return (
    <View style={styles.container}>
    <View style={styles.head}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={{ marginLeft: 10, paddingRight: 10 }}>
        <Image source={AntDesign} style={{height:20,width:20}}/>
        </TouchableOpacity>
        <Text style={{ fontSize: 20 ,color:'black'}}>Reference Documents</Text>
      </View>
      <TouchableOpacity style={{ marginRight: 10, backgroundColor: 'lightgrey', borderRadius: 50, padding: 10 }}
      onPress={()=>{
        navigation.navigate('Notification');
      }}
      >
        <Image source={notification} style={{ height: 25, width: 25 }} />
      </TouchableOpacity>
    </View>

    <ScrollView contentContainerStyle={styles.second}>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1t_4DaxLV9Jg3AVSiBQPoUDLifZ8DFnBN/view?usp=sharing"/>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1B86JpDtqEYC6-vxmoNB2-fbShvivG2uC/view?usp=sharing"/>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1ZL21YoLQqpgUWJWLNYoDdetm4boIgoEB/view?usp=sharing"/>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1PE3vtb9gZQU6fh5h6EPFYlCvZSPdQfIi/view?usp=sharing"/>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1UzWoRqyMDiI8LDOvPeOpQHoONqxGgKuB/view?usp=sharing"/>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1LM6Zx3xTbuwt2aBY_R0CVrrfshOiH_Y7/view?usp=sharing"/>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1nwUDg0BN8nQn1QZ3eilwbNONRrB3xu6D/view?usp=sharing"/>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1Pl7X2HF-1tIxAM8cG_fNMZOtaERBV3N8/view?usp=sharing"/>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1zhXGkJc39izmVFOpX_TB0OLS_z-gfGR3/view?usp=sharing"/>
        <Card name="resources.pdf" url="https://drive.google.com/file/d/1_a3yaJmTUADzAkeoBUo_JHkPBN_5bq1K/view?usp=sharing"/>


    </ScrollView>


    </View>
  )
}

export default Report

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: width,
        gap:20,
      },
      head: {
        width: width,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: '5%',
      },
      second:{
        alignSelf:'center',
        display:'flex',
        alignItems:'center',
        gap:20,
      },
      carder:{
        width:width-60,
        height:100,
        borderColor:'#9e77ed',
        borderWidth:2,
        borderRadius:15,
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
      }
})