import Search from '../components/Search';
import React, {useState,useEffect,useContext} from 'react';
import {Image,PixelRatio,RefreshControl,StyleSheet,Text,View,TouchableOpacity,ScrollView,Button} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Nearyou from '../components/Nearyou';
import Blog from '../components/Blog';
import Curtains from '../components/Curtains';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../../../AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
const HomeScreen = (props) => {
  const { route, navigation } = props
  const [mylocation,setmylocation] = useState("Select address")
  const [updaterefresh, setRefreshing] = React.useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const {userinfo,refresh} = useContext(AuthContext);
 
  console.log(refresh)
   const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  


  useEffect(() => {
    _retrieveData()
   }, [mylocation,refresh])
   
 const _retrieveData = async () => {
   try {
    
     const mylocation = await AsyncStorage.getItem('mylocation')
     console.log("sabairsa page refresh",mylocation)

     if(mylocation !== null) {
 
     }
     setmylocation(mylocation)
     setRefreshing(!refreshing)
   } catch(e) {
 
   }
 }

  var i =0
  return (
   <SafeAreaView>
     <ScrollView stickyHeaderIndices={[0]}
   
     >     
        <View style={style.header}>
      <Image 
      style={style.logo}
      source={require('../../assets/HyFilogo.png')}
      width="20%"
      height="60%"
    />
    {!userinfo.auth_token ? (
         
    <View style={style.location}>
    {(userinfo[i] == null && userinfo[i] == undefined) ? ( 
      <View>
        <TouchableOpacity onPress={
          () => navigation.navigate('LocationView')}>
            <View style={{width:32,height:42,position:'absolute',top:-8}}>
             <LottieView
                          source={require('../../assets/hloc.json')}
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
          <Text style={{left:30,top:3,fontSize:9,marginRight:5}}>{mylocation}</Text>
        </TouchableOpacity>
        </View>
      ):(
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={
          () => navigation.navigate('LocationView')}>
             <View style={{width:32,height:42,position:'absolute',top:-8}}>
             <LottieView
             
                          source={require('../../assets/hloc.json')}
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
          <Text style={{left:30,top:3,fontSize:9,marginRight:5}}>{Object.values(userinfo[i].address)}</Text>
        </TouchableOpacity>
        </View>
      )}
    
   
      </View>
    ):(
         
    <View style={style.location}>
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={
          () => navigation.navigate('LocationView')}>
             <View style={{width:32,height:42,position:'absolute',top:-8}}>
             <LottieView
             
                          source={require('../../assets/hloc.json')}
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
          <Text style={{left:30,top:3,fontSize:9,marginRight:5}}>{mylocation}</Text>
        </TouchableOpacity>
        </View>
      </View>
    )}
   
      </View>
      <TouchableOpacity onPress={
          () => navigation.navigate('Explore')}>
       <Search/>
      </TouchableOpacity>
      <Blog />
      <View>
      <Curtains />
      <Nearyou refreshing={updaterefresh}/> 

      </View>
     {/* <View style={style.View}>

      </View>
      <View style={{bottom:46}}>
      </View>
      <View  style={{bottom:18}}>
      <Nearyou/> 
      </View> */}
        
    </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    justifyContent:'center',
    paddingHorizontal: 20,
    backgroundColor:'white',
    height:60,
    // alignItems:'center'
  },
  logo:{
      width: PixelRatio.getPixelSizeForLayoutSize(44),
      height: PixelRatio.getPixelSizeForLayoutSize(16),
      top:9
    },
    location:{
        color:'black',
        alignSelf:'flex-end',
        width:"50%",
        height:35,
        alignItems:"center",
        marginRight:4,
        bottom:22
    },
    View:{
       width:'100%',
       height:30,
       flexDirection:'row',
       top:68,
       zIndex:6,
       alignItems:'center',

    },
    imagestyle: {
      height: 20,
      width: 20,
     left:340,
     top:62,
     backgroundColor:'white',
     
    },
  });

export default HomeScreen;

