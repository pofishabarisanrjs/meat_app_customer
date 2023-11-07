import { StyleSheet, Text, View,FlatList,Pressable  } from 'react-native'
import React, { useContext, useEffect,useState } from 'react'
import { AuthContext } from '../../../AuthContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart'; 
import { baseUrl } from '../../constants/Constants';
const SaveAddress = () => {

    const[address,setAddress]=useState();
    const [isLoading, setLoading] = useState(true);
    const{userInfo,setRefreshing,refresh,DefaultAddress}=useContext(AuthContext)
    const token = userInfo.auth_token
    const userid =userInfo?.id
    const navigation = useNavigation();

    //console.log(userInfo)
    useEffect(()=>{
getAddress();
    },[])

    const getAddress=()=>{
        fetch(`${baseUrl}/get-addresses?` ,
        {
          method: 'POST', 
            body:JSON.stringify({
            "token":token,
            "user_id":userid
            }) ,  
              headers: {
              'Content-Type': 'application/json',
               },
              })
              .then((response) => response.json())
              .then((json) => setAddress(json))
              .catch((error) => console.error(error))
              .finally(() => setLoading(false));

    }

 
    const saveLocationSelect = async (item) => {
      try {
        await AsyncStorage.setItem('mylocation', item.address);
        await AsyncStorage.setItem('myloc', JSON.stringify(item.longitude));
        await AsyncStorage.setItem('myloct', JSON.stringify(item.latitude));
        navigation.navigate('Near Me');
        setRefreshing(!refresh)
      } catch (e) {
        console.log(e);
      }
    };
  


    const Locationsetting= async (item)=>{
      console.log(item.latitude,item.longitude,"------------->>>>>>>>>")
    //   navigation.navigate('Detail', {
    //     lat:(item.latitude) ,
    //     lng: (item.longitude)
    // })
   
      if (!userInfo.auth_token) {
      saveLocationSelect(item);
      saveLocation(item);
      RNRestart.Restart();
    } else {
      saveLocationSelect(item);
   
    }
    }
   
  return (
    <View >
      <Text style={{left:10,marginTop:15,fontWeight:'bold',color:'#6c757d'}} >RECENT SEARCH</Text>
      <FlatList
            data={address}
            keyExtractor={({ id }, index) => id} 
          
            renderItem={({ index,item }) =>{
            //  console.log(item)
              // const hasValues = Object.values(userInfo?.default_address?.address).some((value) => value !== null);
              // const isUserDefault = (
              //   userInfo?.default_address?.address === item.address &&
              //   userInfo?.default_address?.latitude === item.latitude &&
              //   userInfo?.default_address?.longitude === item.longitude
              // );
               const borderColor =  '#f4f4f4';
                if(index <5)
              return(

                <Pressable  onPress={()=>{Locationsetting(item)}}>
                <Text style={[styles.address,{ borderColor,borderWidth:1,fontSize:12 }]}>{item.address}</Text>
              
             
              </Pressable>
            )
          
          }
                }
          />
    
    </View>
  )
}

export default SaveAddress

const styles = StyleSheet.create({
    address:{
        fontSize:16,
        backgroundColor:'white',
        margin:10,
        borderRadius:10,
        padding:10,
        color:'#282c3f',
        fontFamily:'-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
        fontWeight:'400'
    } ,
})