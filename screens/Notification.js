import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, FlatList, ActivityIndicator } from 'react-native';
const { width, height } = Dimensions.get('window');

const Card = ({ message, date }) => {
  return (
    <View style={styles.carder}>
      <Text style={{ padding: 20 ,color:'black'}}>{message}</Text>
      <Text style={{ marginLeft: '65%', padding: 3 ,color:'black'}}>{date}</Text>
    </View>
  );
};

const Notification = () => {
  const url = 'http://localhost:5000/get';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    setLoading(true);
  
    try {
      const response = await fetch('https://noder-blond.vercel.app/get');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log(responseData.Messages);
  
      if (responseData.status === 'ok') {
        const users = responseData.users;
  
        // Sort the array of users based on the timestamp or any other field that indicates the order
        
  
        // Update the state or perform any other actions with the sorted users
        setData(users);
      } else {
        console.error('Error fetching data:', responseData.message);
        // Handle the error or show an error message to the user.
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error or show an error message to the user.
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  // Call the getPosts function when needed, for example, in a useEffect
  useEffect(() => {
    getPosts();
  }, []); // The empty dependency array ensures that the effect runs once after the initial render

  return (
    <View style={styles.container}>

      {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
          ) : (
              <FlatList
              data={data}
            //   keyExtractor={(item) => item._id}
              renderItem={({ item }) => <Card message={item.message} date={item.date} />}
              />
              )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: width,
    alignItems: 'center',
    height:height,
  },
  carder: {
    backgroundColor: '#dcd9ef',
    borderRadius: 15,
    width: width - 40,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'column',
  },
});
