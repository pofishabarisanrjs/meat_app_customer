import React, { useEffect, useState,useContext } from 'react';
import {Modal,Alert, FlatList, Text, View,StyleSheet,Image,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { AuthContext } from '../../../AuthContext';
import { SvgUri } from 'react-native-svg';
import RazorpayCheckout from 'react-native-razorpay';
import LottieView from 'lottie-react-native';
import {  Overlay } from 'react-native-elements';
import { err } from 'react-native-svg/lib/typescript/xml';
import AsyncStorage from '@react-native-community/async-storage';
import { getDistance,getPreciseDistance } from 'geolib';
import OrderStatus from './OrderStatus';
import { baseUrl,domainUrl } from '../../constants/Constants';
import Settings from '../../constants/Settings';

export default function App (props) {
  const [isLoading, setLoading] = useState(true);
  const [Loading ,setisloading] = useState(true)
  const [data, setData] = useState([]);
  const [result, setdata] = useState([]);
  const {  topay,deliverytype,address,couponname,lat,long,quantity } = props.route.params;
  const {  navigation } = props
  const {userinfo,userInfo} = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [distances,setdistance]=useState(0)
const [razarkey,setRazarKey]=useState()
const [storeData,setStoreData]=useState()

  
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
    Settings((cb)=>{
      console.log("data for payment",cb)
      const razorpayKeyId = cb.find(item => item.key === 'razorpayKeyId').value;
      console.log(razorpayKeyId)
      setRazarKey(razorpayKeyId)
      setStoreData(cb)
    })
   getDistances()
    fetch(`${baseUrl}/get-payment-gateways`,{
      method:'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      {"token": userInfo.auth_token}
    )
    })
   
    .then((response) => response.json())
    .then((json) => {
      console.log("payment ----->",JSON.stringify(json))
      //alert(JSON.stringify(json))
      setData(json)})
    .then((data) => JSON.stringify(data))
   
    .catch((error) => console.error(error))
    .finally(() => setisloading(false));
     
  }, []);
  console.log('hari>>itemid>>ordernavi>>>makepayment>>id',userInfo.auth_token  )


const type = deliverytype == 'Delivery' ? ('1'):('0')
console.log('hari>>itemid>>ordernavi>>>deliverytype>>type',type)


 const location = {'latitude':lat,'longitude':long,'address':address}
  const makepayment = () =>{
       
   const token = userInfo.auth_token    
   const id = userInfo?.id
console.log("send order in notification   -------------------->",JSON.stringify ({
  "coupon":couponname,
  "delivery_type":type ,
  "dis":distances,
  "location":location,
  "method":"COD",
  "order_comment":"",
  "partial_wallet":false,
  "payment_token":"",
  "pending_payment":false,
  "tipAmount":0,
  "token":token,
  "user_id":id,
  "total":{"productQuantity":quantity,"totalPrice":topay}
}))
    fetch(`${baseUrl}/place-order`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify ({
      "coupon":couponname,
      "delivery_type":type ,
      "dis":distances,
      "location":location,
      "method":"COD",
      "order_comment":"",
      "partial_wallet":false,
      "payment_token":"",
      "pending_payment":false,
      "tipAmount":0,
      "token":token,
      "user_id":id,
      "total":{"productQuantity":quantity,"totalPrice":topay}
    })
    })
   
    .then((response) =>(response.json()))
    .then((result) => {
     
    //  setLoading(false)
    //  alert(JSON.stringify(result))
      setdata(result.data)
     
    })
    .catch((error) => console.log(error))
    .finally(() => setLoading(false));
  }
  const makeonlinepayment = () =>{      
     const token = userInfo.auth_token    
     const id = userInfo?.id


      console.log('hari>>itemid>>ordernavi>>>makeonlinepayment>>location',location)
      fetch(`${baseUrl}/place-order`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
      },
      body:JSON.stringify ({
        "coupon":couponname,
        "delivery_type":type,
        "dis":distances,
        "location":location,
        method: "RAZORPAY",
        "order_comment":"",
        "partial_wallet":false,
        "payment_token":"",
        "pending_payment":false,
        "tipAmount":0,
        "token":token,
        "user_id":id,
        "total":{"productQuantity":quantity,"totalPrice":topay},
       // 'payment_id':payid
      })
      })
     
      .then((response) =>(response.json()))
      .then((result) => {
     
        setLoading(false)
        setdata(result.data)
       
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    }


  // let options = {
  //   description: 'Online',
  //   currency: 'INR',
  //   amount: topay * 100,
  //   key: 'rzp_live_BWjmuEYzA2unDa',
  //   name: userInfo.name,
  //   prefill: {
  //     email: userInfo.email,
  //     contact: userInfo.phone,
  //     name: userInfo.name,
  //   },
  //   theme: {color: '#528FF0'},
  // };


  const onlinepayment = () => {
    {
     
      console.log('topay---->',topay)
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Accept", "application/json");
     
      var raw = JSON.stringify({
        "totalAmount": topay,
        "token": userInfo.auth_token
      });
     
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
     
      fetch(`${baseUrl}/payment/process-razor-pay`, requestOptions)
      .then(result => result.json())
      .then(response =>{
        console.log("payment res",response)
       
  let options = {
    description: 'Online',
    amount: response?.response?.amount,
    image: `${domainUrl}assets/img/logos/${storeData.find(item=>item.key === 'storeLogo').value}`,
    key: razarkey,
    name:storeData.find(item => item.key === 'storeName').value,
    currency:storeData.find(item => item.key === 'currencyId').value,
    order_id: response.response.id,
    prefill: {
      email: userInfo.email,
      contact: userInfo.phone,
      name: userInfo.name,
    },
    handler:()=>makeonlinepayment(),
    theme: {color:storeData.find(item=>item.key === 'storeColor').value},
  };
        console.log('option------>',options)
   RazorpayCheckout.open(options)
    .then((data) => {
      console.log('data------------>',data)
      makeonlinepayment(),setShowModal(!showModal)
    })
    .catch((error) => {
      Alert.alert('Transaction cancelled');
    });
 
      })
      .catch(err => {
          console.log(err);
      });
 
      }
  }

  const getcartqty = (id) =>{
    const found = data.find(el => el.item_id === id);
     if (found != undefined )  
     return found.id
     else
     return 0
   }

   const somefunc = (item) =>{
     if (item.id == 1)
     return makepayment(),setShowModal(!showModal)
     else
     return onlinepayment()
   }


 
   const ordernavi = () =>{
    const itemid = result?.unique_order_id
    console.log('hari>>itemid>>ordernavi>>>',itemid)
    //  if (itemid != undefined && !isLoading){
    //    navigation.navigate('OrderStatus',{
    //     // id:iditem,
    //     orderid:itemid
    //   })
    //  }
   
 
 }


  return (
      <>
     {result?.unique_order_id === undefined ? (
        <View style={{backgroundColor:'white',flexDirection:'row',height:70,}}>
        <Icon name="arrow-back-ios" size={24} onPress={navigation.goBack} style={{left:20,top:25}} />
        <Text style={{
          fontSize:18,
          fontWeight:'500',
          left:40,
          top:25,
          color:'black'
        }}>TO PAY :  <Image
        style={{ width:15, height:15,top:5,right:4,}}
        source={require('../../assets/rupee.png')}></Image> {topay}</Text>
        </View>
     ):(
      <View style={{backgroundColor:'white',flexDirection:'row',height:70,}}>
      <Icon name="arrow-back-ios" size={24} onPress={navigation.goBack} style={{left:20,top:25}} />
      <Text style={{
        fontSize:18,
        fontWeight:'500',
        left:40,
        top:25,
        color:'black'
      }}>{result?.unique_order_id}</Text>
      </View>


     )
     
    }
       
 
      {result?.unique_order_id != undefined ? (
          <OrderStatus orderid ={result?.unique_order_id}/>
      ) : (


     
   
    <>
       <View>
       
    <View>
     
      {Loading ?
        <SkeletonPlaceholder>
        <View >
        <View style={{margin:10}}>
          <View style={{ top:10 }}>
          </View>
           <View
              style={{ marginTop: 6, width: 100, height: 40, borderRadius: 30 }}
            />
        </View>
        <View style={{margin:10}}>
          <View style={{ top:10 }}>
          </View>
           <View
              style={{ marginTop: 6, width: 100, height: 40, borderRadius: 30 }}
            />
        </View>
        <View style={{margin:10}}>
          <View style={{ top:10 }}>
          </View>
           <View
              style={{ marginTop: 6, width: 100, height: 40, borderRadius: 30 }}
            />
        </View>
        </View>
      </SkeletonPlaceholder>
      :
      (
       
      <View style={{alignItems:'center'}}>
         <Text style={{textAlign:'center',fontFamily:'FontAwesome5_Solid',color:'#6c757d',fontSize:16,top:40}}>Select your prefered payment method</Text>  
         
        <View style={{height:300,width:'100%',top:100,left:50,
        justifyContent:'center',alignItems:'center'}}>
         <FlatList
            data={data}
            keyExtractor={( item) => item}
            renderItem={({ item,index }) =>(
            <View >
           { !getcartqty(item.id)?(
              <TouchableOpacity onPress={()=>somefunc(item)}>
                <View key={index} style={{flexDirection:'row',right:20,elevation:10}}>
                <Text style={style.types} >{item.name}</Text>
               <SvgUri style={{right:200,top:32}}
              width="40%"
              height="40%"
              uri={`https://hyfifood.com${item.logo}`}
             
             />
                </View>
             
               </TouchableOpacity>
                   
               
               
              ):(
                <Text></Text>
              )}
      </View>
      )}

          />
         </View>
         </View>      
      )}
    </View>
    <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => {
          // alert("Modal has been closed.");
          setShowModal(!showModal);
        }}
      >
          <View style={style.modal}>
           
            {!isLoading ? (
              ordernavi()
            ):(
         
              <View style={style.centeredView}>
          <View style={style.modalView}>
          <View style={{width:200,height:200,position:'absolute',top:-28}}>
             <LottieView
                          source={require('../../assets/loadingorder.json')}
                          colorFilters={[
                            {
                              keypath: 'button',
                              color: '#F00000',
                            },
                            {
                              keypath: 'Sending Loader',
                              color: '#F00000',
                            },
                          ]}
                          autoPlay
                          loop
             
                          />
                          </View>
           
          </View>
        </View>
             
             
            )}
           
          </View>
        </Modal>
     </View>
    </>
      )}
      </>
  );
};


const style = StyleSheet.create ({
  header: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    height:80
   
  },
  logo:{
        // left:12,
        width:'35%',
        height:32,
        top:24
    },
  types:{
       width:'70%',
       padding:26,
       textAlign:'center',
       margin:20,
       color:'black',
       right:50,
       backgroundColor:'white',  
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    top:200
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 75,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});



