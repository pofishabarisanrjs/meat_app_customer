import React,{useState,useEffect,useContext,useRef} from 'react';
import {Alert,Image,Animated,ScrollView, StyleSheet,ActivityIndicator,View,Text,BackHandler,Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getPreciseDistance } from 'geolib';
import { AuthContext } from '../../../AuthContext';
import AsyncStorage from '@react-native-community/async-storage';  
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CommonActions, useIsFocused,useNavigation } from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import call from 'react-native-phone-call';
import LottieView from "lottie-react-native";
import { baseUrl,domainUrl } from '../../constants/Constants';

 export default function OrderDetailscreen (props)  {
  const [data, setData] = useState([]);
  const [result, setresult] = useState([]);
  const [results, setresults] = useState([]);
  const [itemstatus, setitemstatus] = useState([]);
  const [items, setitems] = useState([]);
  const [myloc,setmyloc] = useState("");
  const [myloct,setmyloct] = useState("");
  const [mylocation,setmylocation] = useState("Select address")
  const { orderid} = props;
  //console.log(orderid,'< ----------------- >')
  const [isLoading, setLoading] = useState(true);
  const {userinfo,userInfo} = useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();
  const { route } = props
  const navigation=useNavigation()
  const progress = useRef(new Animated.Value(0)).current;
  const [hasLiked, setHasLiked] = useState(false);
  const [orderStatus,setOrderStatus]=useState()
  const [stopupdate, setStopUpdate] = useState(true);
  const [userlatitude,setuserLatitue]=useState()
  const [userlongitude,setuserlongitude]=useState()
  const [deliverylatitude,setDeliveryLatitude]=useState()
  const [deliverylongitude,setDeliveryLongitude]=useState()

  const handleLikeAnimation = () => {
    const newValue = hasLiked ? 1 : 0;

    Animated.timing(progress, {
      toValue: newValue,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setHasLiked(!hasLiked);
  };
  var [lat,setlat] = useState ('')
  var [long,setlong] = useState ('')
    //console.log(id)

    const  handleBackButtonClick = () => {
      navigation.navigate('Near Me');
      return true;
    }
    
    useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
      };
    }, []);
 
    const triggerCall = () => {
      const phone = results.phone
      const result =  phone

      const args = {
        number: result,
        prompt: true,
      };
      call(args).catch(console.error);
    };


    useEffect(() => {
      _retrieveData()
     }, [])
    
   const _retrieveData = async () => {
     try {
       const value = await AsyncStorage.getItem('myloc')
       if(value !== null) {
       }
       setmyloc(value)
       
     } catch(e) {
     }
   }
   useEffect(() => {
    retrieveData()
   }, [])
   
  const retrieveData = async () => {
   try {
     const value = await AsyncStorage.getItem('myloct')
     if(value !== null) {
  
     }
     setmyloct(value)
     
   } catch(e) {
  
   }
  }
  useEffect(() => {
    _retrieve()
   }, [mylocation])
   
 const _retrieve = async () => {
   try {
    
     const mylocation = await AsyncStorage.getItem('mylocation')
     if(mylocation !== null) {
 
     }
     setmylocation(mylocation)
     
   } catch(e) {
 
   }
 }


    const token = userInfo.auth_token
    const userid = userinfo.id
    const Orderdetails = () =>{
      var i =0
        fetch(`${domainUrl}api/get-orders-detail` ,
        
          {
            method: 'POST', 
                 
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify({
                    "token":token,
                    "order_id":orderid,
                  })
                })
              
                .then((response) =>(response.json()))
                .then((itemstatus) => {
                  // console.log('hello',data)
                  setitemstatus(itemstatus)
                  console.log('Mendal',itemstatus)
                 })
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
              }
              useEffect(() => {
                Orderdetails()
               }, [])


    const Delivery = async  () => {
      console.log("console.of saboasdfosdf +========================================================================================>update-user-info",new Date())
      await fetch(`${baseUrl}/update-user-info`,{
          method:'POST',
          headers: {
            "content-type": "application/json",
          },
          body:JSON.stringify({
            "token":token,
             "unique_order_id":orderid,
             "user_id":userid
          })
        })
        .then((response) =>(response.json()))
        .then((result) => {
          console.log('hello sabaris')
         // console.log('home lat',result?.data?.default_address?.latitude)
         //  console.log('home long',result?.data?.default_address?.longitude)
          setuserLatitue(result?.data?.default_address?.latitude)
          setuserlongitude(result?.data?.default_address?.longitude)
          
         // console.log('delivery lat',result?.data?.delivery_details?.delivery_lat)
         // console.log('delivery long',result?.data?.delivery_details?.delivery_long)
          if (result?.running_order === null && result?.delivery_details === null) {


            fetch(`${domainUrl}api/get-orders-detail`,

              {
                method: 'POST',

                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  "token": token,
                  "order_id": orderid,

                })
              })

              .then((response) => (response.json()))
              .then((itemstatus) => {
                console.log('hello', itemstatus[0]?.orderstatus?.name)
                if (itemstatus[0]?.orderstatus?.name === "Canceled") {
                  setStopUpdate(false)
                  Alert.alert('Your meals is cancelled', 'Your order has been canceled. We apologize for any inconvenience', [
                    {
                      text: 'Thank You',
                      onPress: () => navigation.navigate('Near Me'),
                    }
                  ],)

                }
                else {
                  Alert.alert('Delivery  Successfull', 'Your Food has been delivered. Enjoy your meal', [
                    {
                      text: 'Thank You',
                      onPress: () => navigation.navigate('Near Me'),
                    }
                  ],


                  )
                  
                  setStopUpdate(false)
                }

                // setitemstatus(itemstatus)
             //   console.log('Mendal', itemstatus)
              })
              .catch((error) => console.error(error))
              .finally(() => setLoading(false));





          }
           else
          {
            setresult(result.data)
            setresults(result.delivery_details) 
            setOrderStatus(result?.running_order?.orderstatus_id)
            // setlat(result.delivery_details.delivery_lat), 
            // setlong(result.delivery_details.delivery_long)
  
          }
          
         })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
        //   //  console.log('item',data)
      } 
      
      useEffect(() => {
        Delivery()
        if(stopupdate)
        {
          const intervalId = setInterval(Delivery, 5000);
          return () => {
            clearInterval(intervalId);
          };
        }
       
      }, [stopupdate])

  const [coordinates] = useState([
    {
      latitude: 11.0247,
      longitude: 77.0106,
    },
    {
      latitude: 11.0346,
      longitude:  11.0346,
    },
  ]);
  var i = 0;
  
  var userlat = userinfo[i] == null && userinfo[i] == undefined ? (myloct ):((userinfo[0].latitude))
  var userlong =userinfo[i] == null && userinfo[i] == undefined ? (myloc):((userinfo[0].longitude))
  //  lat =  data[i] != undefined ? (data[i]?.restaurant?.latitude):(1111)
  //  long = data[i] != undefined ? (data[i]?.restaurant?.longitude):(1111)
  // if(userlat != '')
  // locationview()

  // async function locationview () {
  //   await delay(1000)
  // }

  var lat1 = userlatitude
  var lat2 = userlongitude
  
  const calculatePreciseDistance = () => {
    var pdis = getPreciseDistance(
      {
      latitude: userlat,
      longitude: userlong,
      },
      {
        latitude: lat,
        longitude: long,
      },
    );
    alert(`Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
  };
 
 var i = 0;
 //console.log('hello',lat1,lat2)
 const orderstatus = itemstatus[0] != undefined && itemstatus[0] != null ? (itemstatus[i].orderstatus.name):('Order Placed') 
 
 return (
  isLoading ? (   
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
          <Image style={{width:250,height:250}}
           source={require('../../assets/loader.gif')} >
        </Image>
        </View>):(
<View style={{ flex: 1, }}>
  <View style={{ flex: 1,flexBasis:'auto', backgroundColor: 'white',}}>
    <ScrollView >
      
    <View>
      {orderStatus == 4 ? (
        
        <View style={styles.container}>
  <MapView
  style={styles.maps}
  showsUserLocation={false}
  initialRegion={{
    latitude: Number(lat1),
    longitude: Number(lat2),
    latitudeDelta: 0.005, // Adjust this value as needed
    longitudeDelta: 0.005, // Adjust this value as needed
  }}
>
  <MapView.Marker
    coordinate={{
      latitude: Number(userlatitude),
      longitude: Number(userlongitude),
    }}
    title="User Marker"
  >
    <Image
      style={{ width: 20, height: 30 }}
      source={require('../../assets/markerhome.png')}
    />
  </MapView.Marker>
  <MapView.Marker
    coordinate={{
      latitude: Number(results?.delivery_lat),
      longitude: Number(results?.delivery_long),
    }}
    title="Delivery Marker"
  >
    <Image
      style={{ width: 20, height: 30 }}
      source={require('../../assets/markerdelivery.png')}
    />
  </MapView.Marker>
  <MapViewDirections
    origin={{
      latitude: Number(userlatitude),
      longitude: Number(userlongitude),
    }}
    destination={{
      latitude: Number(results?.delivery_lat),
      longitude: Number(results?.delivery_long),
    }}
    apikey="AIzaSyCsSMOQKo0RE0mKvmqjQWMGhHmVVqqEmsU"
    strokeWidth={3}
    strokeColor="black"
  />
</MapView>

 
 <View style={{top:20}}>
 <View style={{width:'100%',height:50,alignItems:'center',flexDirection:'row',flex:1,justifyContent:'space-evenly',bottom:6,}}>
 <Text style={{ fontFamily: 'FontAwesome5_Solid', color: 'black',fontSize:12 }}>
                      Your delivery will be handled by {results?.name} today
                        </Text>
   <TouchableOpacity onPress={triggerCall} style={{fontFamily:'FontAwesome5_Solid',color:'black',borderWidth:0.3,textAlign:'center',padding:9,flexDirection:'row'}}>
     <Text style={{fontFamily:'FontAwesome5_Solid',color:'black',right:4}}>Call Now</Text>
     <SimpleLineIcons name='call-out' size={14} color="black" />
     </TouchableOpacity>
     
   </View>
   <View style={{width:'100%',height:46,borderWidth:0.3,borderColor:'grey', alignItems:'center',flexDirection:'row',flex:1,justifyContent:'center',bottom:5}}>
     <Text style={{fontFamily:'FontAwesome5_Solid'}}>Delivery Pin : </Text>
     <Text style={{fontFamily:'FontAwesome5_Solid',color:'orange'}}>{result?.delivery_pin}</Text>
   </View>
          <View style={{width:'94%',height:80,left:10,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3}}>
        <View style={{width:'60%',height:300,left:10}}>
        <Text style={{ fontFamily: 'FontAwesome5_Solid', color: 'black' }}>Order on the way</Text>
            <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>Order has been placed up and is on its way</Text>
        </View>
        <View style={{width:70,height:70,}}></View>
        <Image  style={{width:70,height:70,transform: [{ scaleX: -1 }]}}  
     source={{uri:`${domainUrl}assets/img/order-onway.gif`}} />
    </View>
        <View style={{width:'94%',height:80,top:10,left:10,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3}}>
        <View style={{width:'60%',height:300,left:10}}>
            <Text style={{fontFamily:'FontAwesome5_Solid',color:'black'}}>{orderstatus}</Text>
            <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>On the way to pick up your order</Text>
        </View>
        <View style={{width:70,height:70,}}></View>
        <Image  style={{width:70,height:70,}} 
     source={{uri:`${domainUrl}assets/img/order-onway.gif` }} />
    </View>
     <View style={{width:'94%',height:80,left:10,top:20,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3}}>
     <View style={{width:'60%',height:300,left:10}}>
         <Text style={{fontFamily:'FontAwesome5_Solid',color:'black'}}>Chef at work!!</Text>
         <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>Restaurant is preparing your order</Text>
     </View>
     <View style={{width:70,height:70,}}></View>
     <Image  style={{width:70,height:70,}} 
  source={{uri:`${domainUrl}assets/img/order-preparing.gif` }} />
 </View>
 <View style={{width:'94%',height:80,left:10,top:24,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3,bottom:30}}>
          <View style={{width:'60%',height:300,left:10}}>
              <Text style={{fontFamily:'FontAwesome5_Solid',color:'black'}}>Order Placed Successfully</Text>
              <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>Waiting for the restaurant to confirm your order</Text>
          </View>
          <View style={{width:70,height:70,}}></View>
          <Image  style={{width:70,height:70,}} 
    source={{uri:`${domainUrl}assets/img/order-placed.gif` }} />
      </View>
 </View>  
 
 </View>

     ):(<Text style={{height:0}}></Text>)}
     {orderStatus == 2 ? (
       <View>
        <View style={{width:'94%',height:80,left:10,top:10,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3}}>
        <View style={{width:'60%',height:300,left:10}}>
            <Text style={{fontFamily:'FontAwesome5_Solid',color:'black'}}>Chef at work!!</Text>
            <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>Restaurant is preparing your order</Text>
        </View>
        <View style={{width:70,height:70,}}></View>
        <Image  style={{width:70,height:70,}} 
     source={{uri:`${domainUrl}assets/img/order-preparing.gif` }} />
    </View>
     <View style={{width:'94%',height:80,left:10,top:26,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3}}>
     <View style={{width:'60%',left:10}}>
         <Text style={{fontFamily:'FontAwesome5_Solid',color:'black'}}>Order Placed Successfully</Text>
         <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>Waiting for the restaurant to confirm your order</Text>
     </View>
     <View style={{width:70,height:70,}}></View>
     <Image  style={{width:70,height:70,}} 
source={{uri:`${domainUrl}assets/img/order-placed.gif` }} />
 </View></View>
      ):(<Text style={{height:0}}></Text>)
      }
    {orderStatus == 3 ? (
      <View>
         <View style={{width:'94%',height:80,left:10,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3}}>
         <View style={{width:'60%',height:300,left:10}}>
             <Text style={{fontFamily:'FontAwesome5_Solid',color:'black'}}>{orderstatus}</Text>
             <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>On the way to pick up your order</Text>
         </View>
         <View style={{width:70,height:70,}}></View>
         <Image  style={{width:70,height:70,}} 
      source={{uri:`${domainUrl}assets/img/order-onway.gif` }} />
     </View>
      <View style={{width:'94%',height:80,left:10,top:20,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3}}>
      <View style={{width:'60%',height:300,left:10}}>
          <Text style={{fontFamily:'FontAwesome5_Solid',color:'black'}}>Chef at work!!</Text>
          <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>Restaurant is preparing your order</Text>
      </View>
      <View style={{width:70,height:70,}}></View>
      <Image  style={{width:70,height:70,}} 
   source={{uri:`${domainUrl}assets/img/order-preparing.gif` }} />
  </View>
  <View style={{width:'94%',height:80,left:10,top:32,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3}}>
          <View style={{width:'60%',left:10}}>
              <Text style={{fontFamily:'FontAwesome5_Solid',color:'black'}}>Order Placed Successfully</Text>
              <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>Waiting for the restaurant to confirm your order</Text>
          </View>
          <View style={{width:70,height:70,}}></View>
          <Image  style={{width:70,height:70,}} 
    source={{uri:`${domainUrl}assets/img/order-placed.gif` }} />
      </View>
  </View>
      ):(<Text style={{height:0}}></Text>)}
     
  {orderStatus == 1 ? (
      
      <View style={{width:'94%',height:80,left:10,top:3,flexDirection:'row',borderBottomColor:'#57575730',borderBottomWidth:0.3}}>
          <View style={{width:'60%',left:10}}>
              <Text style={{fontFamily:'FontAwesome5_Solid',color:'black'}}>Order Placed Successfully</Text>
              <Text style={{top:10,fontFamily:'FontAwesome5_Regular',width:'100%'}}>Waiting for the restaurant to confirm your order</Text>
          </View>
          <View style={{width:70,height:70,}}></View>
          <Image  style={{width:70,height:70,}} 
    source={{uri:`${domainUrl}assets/img/order-placed.gif` }} />
      </View>
  ):(<Text></Text>)}
    </View>
    
    </ScrollView>
  
  </View>
 
  {/* fill space at the bottom*/}
  <View style={{ justifyContent: 'flex-end' }}/>
        <View style={styles.bottomView}>
        <TouchableOpacity  
        onPressIn={() =>{
          Delivery(),
          handleLikeAnimation()}}>
          <View style={{flexDirection:'row',width:220,top:4}}>
          <Text style={styles.textStyle}>Refresh order Status</Text> 
       <LottieView style={{width:25,height:25,left:5,bottom:1}} progress={progress}  source={require('../../assets/orderrefresh.json')}/>
          </View>
       
        </TouchableOpacity>
      </View>
 
</View>
        )
);
}

const styles = StyleSheet.create({
containerMain: {
flex: 1,
backgroundColor:'white'
},
container: {
backgroundColor:'white'
},
bottomView: {
  width: '100%',
  height: 50,
  // top:40,
  backgroundColor: '#9ccc67',
  justifyContent: 'center',
  alignItems: 'center',
  justifyContent:'center',
  // bottom:0,
  flexDirection:'row'
  },
textStyle: {
color: '#fff',
fontSize: 18,
fontFamily:'FontAwesome5_Solid'
},
maps: {
width: Dimensions.get('screen').width,
height: 300,
},
bottomview:{
  width: '100%',
  height: 50,
  backgroundColor: '#9ccc67',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
}
});