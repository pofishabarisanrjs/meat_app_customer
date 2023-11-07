import React, { useEffect, useState,useContext,useRef } from 'react';
import {SafeAreaView,StyleSheet,View,Button,Platform,Image,Text,Animated,FlatList, Pressable} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import {AuthContext} from '../../../AuthContext'
import { useFocusEffect } from '@react-navigation/native';
import { baseUrl } from '../../constants/Constants';




const App = (props) => {
const {navigation} = props

const {userInfo,userinfo, splashLoading,setNotificationnumber} = useContext(AuthContext);
const [notification, setNotification] = useState([]);
const [isFocused, setIsFocused] = useState(false);
  const user_id = userInfo?.id;
  const token = userInfo?.auth_token;
  
const Notificationapi = () =>{
  
  // console.log(user_id)
    fetch(`${baseUrl}/get-user-notifications`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "user_id":user_id,
      "token" : token
    }),
    })
      .then((response) =>response.json())
      .then((result) => {
     //   console.log("sabaris ---->",result)
        setNotification(result)
      })
      .catch((error) => console.error(error))
     
  
}

const readMarkall=()=>{

  console.log(`${baseUrl}/mark-all-notification-read`)
  fetch(`${baseUrl}/mark-all-notification-read`,{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "user_id":user_id,
    "token" : token,

  }),
  })
    .then((response) =>response.json())
    .then((result) => {
      console.log("sabaris ---->",result)
      setNotification(result)
      const unreadData = result.filter(item => item.is_read === 0);

      // Calculate the length of unread data
      const unreadDataLength = unreadData.length;
setNotificationnumber(unreadDataLength)      
      // if(data.unique_order_id)
      // {
      //   navigation.navigate('OrderDetailscreen', {
      //     id: item.id,
      //     orderid: data.unique_order_id,
      //     orderstatus: data.title
      //   })      }
    })
    .catch((error) => console.error(error))
}
const readMark=(item,data)=>{
  console.log("sabaris",data.unique_order_id)
  if(item.is_read!==1)
  fetch(`${baseUrl}/mark-one-notification-read`,{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "user_id":user_id,
    "token" : token,
    "notification_id":item.id

  }),
  })
    .then((response) =>response.json())
    .then((result) => {
      console.log("sabaris ---->",result)
      setNotification(result)
      const unreadData = result.filter(item => item.is_read === 0);

      // Calculate the length of unread data
      const unreadDataLength = unreadData.length;
setNotificationnumber(unreadDataLength)      
      // if(data.unique_order_id)
      // {
      //   navigation.navigate('OrderDetailscreen', {
      //     id: item.id,
      //     orderid: data.unique_order_id,
      //     orderstatus: data.title
      //   })      }
    })
    .catch((error) => console.error(error))
}

const NotificationItem = ({ item }) => {
  const data = JSON.parse(item.data);
console.log(data)
  return (
    <Pressable onPress={ ()=> readMark(item,data)} style={[styles.notificationItem, item.is_read ? styles.readItem : styles.unreadItem]} >
<Text>{data?.unique_order_id}</Text>
      <Text style={styles.titleText}>{data.title}</Text>
      <Text style={styles.messageText}>{data.message}</Text> 
    </Pressable>
  );
};

useFocusEffect(
  React.useCallback(() => {
    // Call your function here
    Notificationapi()
  }, [])
);


  return (
    <SafeAreaView style={{flex:1}} >
              <View style={{backgroundColor:'white',flexDirection:'row',height:50,justifyContent:'space-between',alignItems:'center'}}>

        <View style={{backgroundColor:'white',flexDirection:'row',height:50}}>
      <Icon name="arrow-back-ios" size={24} onPress={navigation.goBack} style={{left:20,top:15}} />
      <Text style={{
        fontSize:18,
        fontWeight:'500',
        left:40,
        top:15,
        color:'black'
      }}>ALERTS</Text>
      </View>
{/* <TouchableOpacity style={{marginRight:10}} onPress={()=>readMarkall()}>
      <Text style={{color:'orange'}}>Read All</Text>
      </TouchableOpacity> */}
</View>
      
      {
  !notification || notification.length === 0 ? 
    <>
      
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        {/* <TouchableOpacity onPress={handleLikeAnimation} > */}
        <Feather name="bell" size={250} color='#6c757d12'></Feather>
    
        {/* </TouchableOpacity> */}
     
    <Text style={{fontFamily:'FontAwesome5_Solid',color:'#6c757d1f'}}>No new alerts</Text>
      </View>
      </>
      :
    <>
<FlatList
      data={notification}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <NotificationItem item={item} />}
    />

    </>

      }
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 16,
    backgroundColor: '#ffffff',

  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform:'capitalize',
    color:'#000'
  },
  messageText: {
    fontSize: 16,
    color:'#000',
  },
  timestampText: {
    fontSize: 14,
    color: '#888',
  },
  readItem: {
    backgroundColor: '#f0f0f0', // Add a background color for read items
  },
  unreadItem: {
    backgroundColor: '#fff', // Add a background color for unread items
  },
});



export default App;

