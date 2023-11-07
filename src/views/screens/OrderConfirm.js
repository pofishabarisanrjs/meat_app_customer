import React, { useEffect, useState,useContext } from 'react';
import {Text,Alert,Button,ActivityIndicator,FlatList, View,StyleSheet,Image,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../../../AuthContext';
import {  Overlay } from 'react-native-elements';
import RazorpayCheckout from 'react-native-razorpay';
import { isLoading } from 'expo-font';
import Delivery from './ManageAddress';
import { domainUrl } from '../../constants/Constants';

export default function OrderConfirm (props) {
  const [Loading, setLoading] = useState(true);
  const [result, setData] = useState([]);
  const {name ,amount,type} = props.route.params;
  const { route, navigation } = props
  const [cart_list,setcart_list] = useState([]);
  const [visible,setVisible] = useState(false);
  const {userinfo,userInfo} = useContext(AuthContext);
  const [mylocation,setmylocation] = useState("Select address")
  const [distances,setdistance]=useState(0)

  // console.log(userInfo.auth_token)
  console.log(type,name)
  const toggleOverlay = () => {
    setVisible(!visible);
    if(visible != true)
    return makepayment()
  };

  const getDistances= async()=>{
    const user_latitue=await AsyncStorage.getItem('myloc')  
    const user_longitude=await AsyncStorage.getItem('myloct') 
    const restaurant_latitude= await AsyncStorage.getItem('restaurant_latitude')
    const restuarnt_longitude= await AsyncStorage.getItem('restuarnt_longitude') 
    console.log(user_latitue,user_longitude) 
    console.log(restaurant_latitude,restuarnt_longitude)
    const distance = getPreciseDistance(
      {latitude: user_latitue, longitude: user_longitude},
      {latitude:restuarnt_longitude, longitude: restaurant_latitude},
    );
    console.log('distance----------->',distance/1000)
    setdistance(distance/1000)
   }          
     useEffect(() => {
     getDistances()
    _retrieveData()
   }, [])
  const _retrieveData = async () => {
    try {
      const mylocation = await AsyncStorage.getItem('mylocation')
      if(mylocation !== null) {
      }
      setmylocation(mylocation) 
    } catch(e) {
    }
  }
  let options = {
    description: 'Online',
    currency: 'INR',
    amount: amount * 100,
    key: 'rzp_test_eKSxlmsMoMXNua',
    name: userInfo.name,
    prefill: {
      email: userInfo.email,
      contact: userInfo.phone,
      name: userInfo.name,
    },
    theme: {color: '#528FF0'},
  };

  const onPressButton = () => {
    RazorpayCheckout.open(options)
      .then((data) => {
        // toggleOverlay(true)
      })
      .catch((error) => {
        Alert.alert('Transaction cancelled');
      });
  };
  
  
  const makepayment = () =>{
   var location = (userinfo[0] == null && userinfo[0] == undefined) ?
    (mylocation):
    (Object.values(userinfo[0].address)) 
            
   const token = userInfo.auth_token     
   const id = userInfo?.id
   const user_latitue=AsyncStorage.getItem('myloc')   
   const user_longitude=AsyncStorage.getItem('myloct') 
   const restaurant_latitude=AsyncStorage.getItem('restaurant_latitude')
   const restuarnt_longitude=AsyncStorage.getItem('restuarnt_longitude')              
   console.log("restuarnt_longitude restuarnt_longitude ",user_latitue,user_longitude,restaurant_latitude,restuarnt_longitude,mylocation)
   // console.log(token)
    // console.log(id)
    // console.log(name)
    // console.log(location)
    // fetch(`${domainUrl}public/api/place-order`,{
    //   method:'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    // },
    // body:JSON.stringify ({ "coupon":"",
    // "delivery_type":"delivery",
    // "dis":distances,
    // "location": mylocation,
    // "method":"COD",
    // "order_comment":"",
    // "partial_wallet":false,
    // "payment_token":"",
    // "pending_payment":false,
    // "tipAmount":0,
    // "token":token,
    // "user_id":31,
    // "total":{"productQuantity":2,"totalPrice":100}})
    // })
    
    // .then((response) =>(response.json()))
    // .then((result) => {
    //   console.log(result)
    //   setLoading(false)
    //   setData(result.data)
     
    // })
    // .catch((error) => console.error(error))
    // .finally(() => setLoading(false));
  }

  const itemid = result.unique_order_id
  const iditem = result.id
  console.log(result,'result' )

  // const ordernavi = () =>{

  //     navigation.navigate('OrderStatus',{
  //       id:iditem,
  //       orderid:itemid
  //     })

  // }


  return (
     <View>
        
        <View style={style.header}>
          
        <Text style={{color:'black',fontSize:16,top:20}}>Confirm Order</Text>
       
      </View>
      
         <View style={style.container}>
         <Text style={style.text} >{name} </Text>
         <Text style={style.text}  >Topay : {amount}</Text>
         {name != 'Cash On Delivery' ? (
          <TouchableOpacity onPressIn={makepayment()}>
          <Text style={style.orderplace} >Place Order</Text>
          </TouchableOpacity>
         ):(
          <TouchableOpacity onPressIn={()=>onPressButton()}>
          <Text style={style.orderplace} >Place Order</Text>
          
          </TouchableOpacity>
         )}
         <Text>{result?.unique_order_id}</Text>
         </View>
         
{/*     
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
       { Loading && result == '' && itemid == undefined ? (<Text style={{padding:90,width:'100%',textAlign:'center',paddingVertical:10,}}>Processing...</Text>):
        (ordernavi())}
      </Overlay> */}

      
      
     </View>
    
  );
};

const style = StyleSheet.create ({
  header: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor:'white',
    height:60
    
  },
  body:{
      justifyContent:'center',
      alignItems:'center',
      margin:10,
      top:10
  },
  name:{
      color:'black',
      fontSize:20,
      borderWidth:1,
      padding:10,
      backgroundColor:'white'
  },
  container:{
      width:'100%',
      alignItems:'center',
      backgroundColor:'white',
      height:900
  },
  text:{
    fontSize:20,
    fontWeight:'600',
    margin:15,
    top:80,
    color:'black',
  },
  orderplace:{
      margin:15,
      fontSize:18,
      backgroundColor:'orange',
      color:'white',
      padding:8,
      borderRadius:10,
      top:80,
      width:300,
      textAlign:'center'
  },
  spinnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: '#9ccc67',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily:'FontAwesome5_Solid'
  },
 
});