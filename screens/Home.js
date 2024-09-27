import { ScrollView, StyleSheet, Text, View ,Dimensions, Image,TouchableOpacity} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {React,useEffect,useState} from 'react'
import report from '../assets/reportin.png';
import syll from '../assets/syll.png';
import test from '../assets/test.png';
import pay from '../assets/payment.png';
import menu from '../assets/bar.png';
import notification from '../assets/notification.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
const Home = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedName = await AsyncStorage.getItem('name');
                setName(storedName || '');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

  return (
    <View style={styles.container}>
      <View style={styles.first}>

        <TouchableOpacity style={{marginLeft:20,backgroundColor:'lightgrey',borderRadius:50,padding:10}}
        onPress={()=>{
            navigation.navigate('Profile');
        }}
        >
            <Image source={menu} style={{height:25,width:25}}/>
        </TouchableOpacity>

        <TouchableOpacity style={{marginRight:20,backgroundColor:'lightgrey',borderRadius:50,padding:10}}
        onPress={()=>{
            navigation.navigate('Notification');
        }}
        >
            <Image source={notification} style={{height:25,width:25}}/>
        </TouchableOpacity>
        
      </View>

      <ScrollView contentContainerStyle={styles.second}>

        <View style={styles.one}>
            <Text style={styles.wel}>மீண்டும் வருக</Text>
            <Text style={styles.name}>{name}</Text>

            <View style={styles.card}>

                <View style={styles.attend}>
                    <Text style={{color:'white'}}>Attendance</Text>
                    <Text style={{color:'white',fontSize:25,}}>Jan 2024</Text>
                </View>

                <View style={styles.prog}>
                    <Text style={{color:'white',fontSize:30}}>93%</Text>
                </View>

            </View>

        </View>

        <View style={styles.two}>

            <Text style={styles.quick}>Quick Links</Text>

            <View style={styles.card2}>

                <TouchableOpacity style={{display:'flex',flexDirection:'column',gap:8}}
                onPress={()=>{
                    navigation.navigate('report');
                }}
                >
                    <View style={{backgroundColor:'#978cd0',borderRadius:50,padding:15,borderColor:'darkblue',borderWidth:1.7}}>
                        <Image source={report} style={{height:22,width:22}}/>
                    </View>
                    <Text style={{color:'grey',alignSelf:'center'}}>Notes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{display:'flex',flexDirection:'column',gap:8}}
                onPress={()=>{
                    navigation.navigate('VoiceTest');
                }}
                >
                    <View style={{backgroundColor:'#978cd0',borderRadius:50,padding:15,borderColor:'darkblue',borderWidth:1.7}}>
                        <Image source={syll} style={{height:22,width:22}}/>
                    </View>
                    <Text style={{color:'grey',alignSelf:'center'}}>Voice</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{display:'flex',flexDirection:'column',gap:8}}
                onPress={()=>{
                    navigation.navigate('History');
                }}
                >
                    <View style={{backgroundColor:'#978cd0',borderRadius:50,padding:15,borderColor:'darkblue',borderWidth:1.7}}>
                        <Image source={test} style={{height:22,width:22}}/>
                    </View>
                    <Text style={{color:'grey',alignSelf:'center'}}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{display:'flex',flexDirection:'column',gap:8}}
                onPress={()=>{
                    navigation.navigate('Story');
                }}
                >
                    <View style={{backgroundColor:'#978cd0',borderRadius:50,padding:15,borderColor:'darkblue',borderWidth:1.7}}>
                        <Image source={pay} style={{height:22,width:22,alignSelf:'center'}}/>
                    </View>
                    <Text style={{color:'grey',alignSelf:'center'}}>Story</Text>
                </TouchableOpacity>

            </View>


        </View>
        <TouchableOpacity style={styles.gam}
        onPress={()=>{
            navigation.navigate('Game');
        }}
        >
            <Text style={styles.game}>GAMES</Text>
        </TouchableOpacity>


        <View style={styles.three}>

            <Text style={styles.quick}>உங்கள் நிலையை தேர்வு செய்யவும்(03)</Text>

            <TouchableOpacity style={styles.card3}
            onPress={()=>{
                navigation.navigate('Beginner');
            }}
            >

                <View style={{flexDirection:'row', gap:5}}>
                    <Image source={report} style={{height:20,width:20,alignSelf:'center',marginLeft:8}}/>
                    <Text style={{fontWeight:'500',fontSize:18,color:'black'}}>ஆரம்பநிலை</Text>

                </View>

                <View style={{flexDirection:'column',alignSelf:'center',marginRight:8}}>
                    <Text  style={{color:'black'}}>LVL</Text>
                    <Text style={{fontSize:25,color:'black'}}>01</Text>
                </View>

            </TouchableOpacity>
            
            <TouchableOpacity style={styles.card3}
            onPress={()=>{
            navigation.navigate('Intermediate');
            }}
            >

            <View style={{flexDirection:'row', gap:5}}>
                    <Image source={test} style={{height:20,width:20,alignSelf:'center',marginLeft:8}}/>
                    <Text style={{fontWeight:'500',fontSize:18,color:'black'}}>இடைநிலை</Text>

                </View>

                <View style={{flexDirection:'column',alignSelf:'center',marginRight:8}}>
                    <Text style={{color:'black'}}>LVL</Text>
                    <Text style={{fontSize:25,color:'black'}}>02</Text>
                </View>

            </TouchableOpacity>

            <TouchableOpacity style={styles.card3}
                        onPress={()=>{
                            navigation.navigate('Master');
                        }}
            >

                <View style={{flexDirection:'row', gap:5}}>
                    <Image source={report} style={{height:20,width:20,alignSelf:'center',marginLeft:8}}/>
                    <Text style={{fontWeight:'500',fontSize:18,color:'black'}}>குரு</Text>

                </View>

                <View style={{flexDirection:'column',alignSelf:'center',marginRight:8}}>
                    <Text style={{color:'black'}}>LVL</Text>
                    <Text style={{fontSize:25,color:'black'}}>03</Text>
                </View>

            </TouchableOpacity>
            
            
            <View style={{height:50}}>

            </View>

            <View style={{height:50}}>
            </View>

            <View style={{height:50}}>

            </View>

        </View>

      </ScrollView>

    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        height:height,
        width:width,
        marginTop:'6%',
        justifyContent:'center',
        alignItems:'center',
       
        
        gap:10,
    },
    first:{
       
        
        flexDirection:'row',
        alignItems:'center',
        width:width,
        height:50,
        justifyContent:'space-between',
        gap:0,
    },
    second:{
       
        width:width,
        
        
        gap:15,
        
        
        alignItems:'center',
    },
    one:{
        display:'flex',
        width:width-40,
        
    },
    two:{
        display:'flex',
        width:width-40,
       
        
        
    },
    three:{
        display:'flex',
        width:width-40,
       
        gap:10,

    },
    wel:{
        fontWeight:'400',
        marginLeft:"2%",
        color:'black',
    },
    name:{
        marginLeft:"2%",
        fontSize:25,
        fontWeight:'600',
        color:'black',
        
    },
    card:{
        alignSelf:'center',
        height:160,
        width:width-40,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        gap:90,
        marginTop:'5%',
        backgroundColor:'#77b5fe',
        borderRadius:20,
    },
    card2:{
        alignSelf:'center',
        height:125,
        width:width-40,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        gap:30,
        marginTop:'5%',
        backgroundColor:'#dcd9ef',
        borderRadius:20,
    },
    card3:{
        alignSelf:'center',
        height:55,
        width:width-40,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
       
        
        backgroundColor:'#77dd77',
        borderRadius:10,
    },
    attend:{
        display:'flex',
        justifyContent:'center',
       
        
    },
    prog:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        
        
    },
    quick:{
        marginLeft:"2%",
        fontSize:15,
        fontWeight:'400',
        color:'black',
    },
    gam:{
        backgroundColor:'orange',
        width:width-40,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,

    },
    game:{
        fontSize:30,
        padding:8,
        color:'white',

    }
})
export default Home