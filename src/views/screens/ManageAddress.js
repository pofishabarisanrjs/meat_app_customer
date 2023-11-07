import React, { useEffect, useState,useContext } from 'react';
import { FlatList, Text, View,StyleSheet,Button,RefreshControl,TouchableHighlight ,Image,ImageBackground,Alert, Pressable } from 'react-native';
import { ScrollView,TouchableOpacity} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MenuProvider } from 'react-native-popup-menu';
import {Menu,MenuOptions,MenuOption,MenuTrigger,} from 'react-native-popup-menu';
import { baseUrl } from '../../constants/Constants';


const Delivery = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const {userInfo,DefaultAddress} = useContext(AuthContext);
  const token = userInfo.auth_token
  const userid =userInfo?.id
  const {  navigation } = props
  console.log("userInfo ---->",userInfo)


const getaddress =() =>{
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
          .then((json) => setData(json))
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
          
  }
  useEffect(()=>{
    getaddress();
  },[data.length])
  const deleteaddress = (id) =>{
    fetch(`${baseUrl}/delete-address?` ,
    {
      method: 'POST', 
        body:JSON.stringify({
        "token":token,
        "user_id":userid,
        "address_id":id
        }) ,  
          headers: {
          'Content-Type': 'application/json',
           },
          })
          .then((response) => response.json())
          .then((json) =>  setData(json),getaddress())
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
          // console.log(data)
  }
  const checkcartexist = (id) =>{
    const found = data.find(el => el.item_id === id); 
    if (!found)  
    return true
    else 
    return false
     }

  return (
     isLoading ?
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white',}}>
            <Image style={{width:250,height:250}}
             source={require('../../assets/loader.gif')} >
          </Image>
          </View>:

    <View style={{ flex: 1, }}>
       <View style={{backgroundColor:'white',flexDirection:'row',height:70,}}>
      <Icon name="arrow-back-ios" size={24} onPress={navigation.goBack} style={{left:20,top:25}} />
      <Text style={{
        fontSize:18,
        fontWeight:'500',
        left:40,
        top:25,
        color:'black'
      }}>Manage Address</Text>
  </View>
      <View style={{ flex: 1,flexBasis:'auto'}}>
        <ScrollView style={{marginBottom:10}}>
        {isLoading ? (
          <View style={{backgroundColor:'white'}}>
          <SkeletonPlaceholder>
                <View style={{ flexDirection: "row", alignItems: "center",margin:10 }}>
             <View style={{ width: 60, height: 60, borderRadius: 10 }} />
             <View style={{ marginLeft: 20 }}>
               <View style={{ width: 250, height: 20, borderRadius: 4 }} />
               <View
                 style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
               />
             </View>
           </View>
           <View
               style={{ left:10, marginTop: 6, width: 330, height: 50, borderRadius: 4 }}
             />
           <View style={{ flexDirection: "row", alignItems: "center",margin:10  }}>
             <View style={{ width: 60, height: 60, borderRadius: 10 }} />
             <View style={{ marginLeft: 20 }}>
               <View style={{ width: 250, height: 20, borderRadius: 4 }} />
               <View
                 style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
               />
             </View>
           </View>
           <View style={{ flexDirection: "row", alignItems: "center",margin:10  }}>
             <View style={{ width: 60, height: 60, borderRadius: 10 }} />
             <View style={{ marginLeft: 20 }}>
               <View style={{ width: 250, height: 20, borderRadius: 4 }} />
               <View
                 style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
               />
             </View>
           </View>
           <View style={{ flexDirection: "row", alignItems: "center",margin:10  }}>
             <View style={{ width: 60, height: 60, borderRadius: 10 }} />
             <View style={{ marginLeft: 20 }}>
               <View style={{ width: 250, height: 20, borderRadius: 4 }} />
               <View
                 style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
               />
             </View>
           </View>
           <View style={{ flexDirection: "row", alignItems: "center",margin:10  }}>
             <View style={{ width: 60, height: 60, borderRadius: 10 }} />
             <View style={{ marginLeft: 20 }}>
               <View style={{ width: 250, height: 20, borderRadius: 4 }} />
               <View
                 style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
               />
             </View>
           </View>
          
          </SkeletonPlaceholder>
          </View>
        ):(
          <View>
        
          <View>
          <ScrollView >
          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id} 
          
            renderItem={({ index,item }) =>{
            //  const hasValues = Object.values(userInfo?.default_address?.address).some((value) => value !== null);
              const isUserDefault = (
                userInfo?.default_address?.address === item.address &&
                userInfo?.default_address?.latitude === item.latitude &&
                userInfo?.default_address?.longitude === item.longitude
              );
              console.log(isUserDefault)
               const borderColor = isUserDefault ? 'orange' : 'white';
              return(
                <Pressable  onPress={()=>{DefaultAddress(item.id,userInfo);navigation.goBack()}}>
                <Text style={[styles.address,{ borderColor,borderWidth:1 }]}>{item.address}</Text>
                {checkcartexist(item.id)?(
                  
                    <View style={styles.container}> 
                      <Pressable onPress={()=>{
                    
                    Alert.alert('Delete Address', 'Do you want to delete address', [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {text: 'OK', onPress: () => deleteaddress(item.id)},
                    ]);
                
                  
                  }}>
                    <Text style={styles.delete}>Delete</Text>
                    </Pressable>

                    </View>
                              
                ):(
                  <Text></Text>
                )}
             
              </Pressable>
            )}
                }
          />
         
          </ScrollView>
        
        </View>
        
        </View>
        
        )}
        </ScrollView>
      
      </View>
     
      {/* fill space at the bottom*/}
      <View style={{ justifyContent: 'flex-end' }} />
            <Pressable onPress={()=>navigation.navigate('LocationView')} style={styles.bottomView}>
        <Text style={styles.textStyle}>Add New Address</Text>
          </Pressable> 
    </View>
  );
};
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
    },
     address:{
         fontSize:16,
         backgroundColor:'white',
         margin:10,
         borderRadius:10,
         padding:10
     } ,
     bottomView: {
      width: '100%',
      // left:10,
      height: 50,
      backgroundColor: 'orange',
      justifyContent: 'center',
      alignItems: 'center',
      // position: 'absolute',
      bottom: 0,
      // flex:1,
      // borderRadius:10,
      
    },
    textStyle: {
      color: '#fff',
      fontSize: 18,
    },
     delete:{
         fontSize:14,
         color:'#fff',
         backgroundColor:'orange',
         padding:10,
         borderRadius:5,
         width:80,
        //  right:16,
         paddingLeft:14,
         textAlign:'center',
         left:16
        //  alignSelf:'flex-end'
     }
      
      });
      const optionsStyles = {
        optionsContainer: {
          padding: 5,
        },
        optionWrapper: {
          margin: 5,
        },
        optionTouchable: {
          activeOpacity: 70,
        },
        optionText: {
          color: 'brown',
          
        },
      };

export default Delivery;
