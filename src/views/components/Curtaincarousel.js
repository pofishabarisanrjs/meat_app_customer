import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { SvgUri } from 'react-native-svg';
import { AuthContext } from '../../../AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl } from '../../constants/Constants';

export default function Curtaincarousel(props) {
  const [isLoading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [myloc,setmyloc] = useState("");
  const [myloct,setmyloct] = useState("");
  const {userInfo,userinfo} = useContext(AuthContext);

  useEffect(() => {
    _retrieveData()
   }, [myloc])
  
 const _retrieveData = async () => {
   try {
     const value = await AsyncStorage.getItem('myloc')
     if(value !== null) {
     }
     console.log("data sabaris",value)
     setmyloc(value)
     
   } catch(e) {
   }
 }
 useEffect(() => {
  retrieveData()
 }, [myloct])
 
const retrieveData = async () => {
 try {

   const value = await AsyncStorage.getItem('myloct')

   if(value !== null) {
   }
   console.log("data sabaris2ed ",value)

   setmyloct(value)
   
 } catch(e) {

 }
}
var i = 0
const lat = userinfo[i] == null ? (myloct ):((userinfo[0].latitude))
const long =userinfo[i] == null  ? (myloc):((userinfo[0].longitude))


  useEffect(() => {
    const abortController = new AbortController(); // Create an AbortController
    const signal = abortController.signal;
  
    fetch(`${baseUrl}/get-menu-categories`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      signal, // Pass the signal to the fetch request
      body: JSON.stringify(),
    })
      .then((response) => {
        if (!signal.aborted) {
          // Check if the request was not aborted
          return response.json();
        }
        return Promise.reject(new Error('Request aborted'));
      })
      .then((json) => {
        if (!signal.aborted) {
          // Check if the component is still mounted before updating the state
          console.log("sabarids123 ",json)
          setData(json);
        }
      })
      .catch((error) => {
        if (!signal.aborted) {
          // Check if the component is still mounted before handling the error
          console.error(error);
        }
      })
      .finally(() => {
        if (!signal.aborted) {
          // Check if the component is still mounted before updating isLoading
          setLoading(false);
        }
      });
  
    // Return a cleanup function to cancel the fetch request if the component unmounts
    return () => {
      abortController.abort();
    };
  }, []);
  

  return (
    <View>
      {isLoading ? (
        <SkeletonPlaceholder>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ margin: 10 }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                }}
              />
              <View style={{ top: 10 }}></View>
              <View
                style={{
                  marginTop: 6,
                  width: 70,
                  height: 20,
                  borderRadius: 4,
                }}
              />
            </View>
            <View style={{ margin: 10 }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                }}
              />
              <View style={{ top: 10 }}></View>
              <View
                style={{
                  marginTop: 6,
                  width: 70,
                  height: 20,
                  borderRadius: 4,
                }}
              />
            </View>
            <View style={{ margin: 10 }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                }}
              />
              <View style={{ top: 10 }}></View>
              <View
                style={{
                  marginTop: 6,
                  width: 70,
                  height: 20,
                  borderRadius: 4,
                }}
              />
            </View>
            <View style={{ margin: 10 }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                }}
              />
              <View style={{ top: 10 }}></View>
              <View
                style={{
                  marginTop: 6,
                  width: 70,
                  height: 20,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        </SkeletonPlaceholder>
      ) : (
        <View>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>{
              const parts = item?.image.split('.');

             const extension = parts[parts.length - 1]; 
if(item.is_enabled ===1)
              return(
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('FiltersScreen', {
                      itemsid: [item.id],
                      lat,
                      long
                    })
                  }
                >
                  <View style={styles.catcard}>

                    {
                    extension ==="svg" ?
                    <SvgUri
                      width="60%"
                      height="60%"
                      uri={item?.image ? `https://hyfifood.com${item.image}` : ''}
                      /> 
                      :
                      <>
                     
                      <Image
                      
                      source={{uri: `https://hyfifood.com${item.image}`}}
                      style={{ width: '60%', height: '60%' }} // Set the desired width and height

                      />
                      </>
                      }
  
                    <Text style={styles.text}>{item?.name}</Text>
                  </View>
                </TouchableOpacity>
              )
              else
              return null
            } }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  catcard: {
    height: 100,
    width: 88,
    margin: 8,
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
    bottom: 20,
  },
  text: {
    color: 'white',
    width: 70,
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: 'black',
    borderRadius: 10,
  },
});
