import React, { useState, useEffect, useContext } from 'react';

// import all the components we are going to use
import { SafeAreaView, View, Text, StyleSheet, Image, PermissionsAndroid, Platform, Button, Dimensions, } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Popularlocations from '../components/Popularlocations';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import CurrentLocation from '../components/Currentlocation';
import { TextInput } from 'react-native-gesture-handler';
import SaveAddress from '../components/SaveAddress';
import { AuthContext } from '../../../AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
const App = (props) => {
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  const [showinput, setShowInput] = useState(false);
  const [SettingData,setSettingData]=useState([])
  const { navigation } = props
const{userInfo}=useContext(AuthContext)

useEffect(()=>{

  _retrieveData()

},[])

const _retrieveData = async () => {
  try {
      const value = await AsyncStorage.getItem('AppSettings');
      if (value !== null) {
          console.log(JSON.parse(value));
          setSettingData(JSON.parse(value))
      }
  } catch (error) {
console.log(error)
  }
}


//console.log(userInfo?.auth_token )
  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     if (Platform.OS === 'ios') {
  //       getOneTimeLocation();
  //       subscribeLocationLocation();
  //     } else {
  //       try {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //           {
  //             title: 'Location Access Required',
  //             message: 'This App needs to Access your location',
  //           }
  //         );
  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           getOneTimeLocation();
  //           subscribeLocationLocation();
  //         } else {
  //           setLocationStatus('Permission Denied');
  //         }
  //       } catch (err) {
  //         console.warn(err);
  //       }
  //     }
  //   };
  //   requestLocationPermission();
  //   return () => {
  //     Geolocation.clearWatch(watchID);
  //   };
  // }, []);

  // const getOneTimeLocation = () => {
  //   setLocationStatus('Getting Location ...');
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       setLocationStatus('You are Here');
  //       const currentLongitude = JSON.stringify(position.coords.longitude);
  //       const currentLatitude = JSON.stringify(position.coords.latitude);
  //       setCurrentLongitude(currentLongitude);
  //       setCurrentLatitude(currentLatitude);
  //     },
  //     (error) => {
  //       setLocationStatus(error.message);
  //     },
  //     { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 }
  //   );
  // };

  // const subscribeLocationLocation = () => {
  //   watchID = Geolocation.watchPosition(
  //     (position) => {
  //       setLocationStatus('You are Here');
  //       //Will give you the location on location change
  //       console.log(position);
  //       const currentLongitude = JSON.stringify(position.coords.longitude);
  //       //getting the Longitude from the location json
  //       const currentLatitude = JSON.stringify(position.coords.latitude);
  //       //getting the Latitude from the location json
  //       setCurrentLongitude(currentLongitude);
  //       //Setting state Longitude to re re-render the Longitude Text
  //       setCurrentLatitude(currentLatitude);
  //       //Setting state Latitude to re re-render the Longitude Text
  //     },
  //     (error) => {
  //       setLocationStatus(error.message);
  //     },
  //     { enableHighAccuracy: false, maximumAge: 1000 }
  //   );


  // };
  
  const onLocationReceived =(data)=>{
    console.log("sabaris",data)
    if(data !==null)
    navigation.navigate('Detail', {
      lat: data.latitude,
      lng: data.longitude

    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start', marginBottom: 10 }}>
        <Icon name="arrow-back" size={32} color={'#000'} onPress={navigation.goBack}
          style={{ backgroundColor: 'white', height: 44, padding: 6 }}
        />
        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>Enter your area or apartment name</Text>

      </View>
      {
        !showinput ?
          <>
            <View style={{
              flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start', marginBottom: 10, borderWidth: 0.5, marginLeft: 10, width: '90%',borderRadius:10,
              borderColor: '#9d9fa1'

            }}>
              <Icon name="search" size={32} color={'#9d9fa1'}
                style={{ backgroundColor: 'white', height: 44, padding: 6,borderRadius:10}}
              />

              <TextInput placeholder='Search your area...' style={{ width: '100%' }}
                onPressIn={() => setShowInput(true)}
              />
            </View>
            <CurrentLocation onLocationReceived={onLocationReceived} />
<Popularlocations/>
{
  userInfo?.auth_token !==undefined &&
 <>
  <SaveAddress/>
  
</>

}

          </>
          :
          <View style={{ height: Dimensions.get('window').height - 20 }}>
            <GooglePlacesAutocomplete
              style={{ zIndex: 2, height: 100 }}
              placeholder='Search your area...'
              minLength={1}
              autoFocus={false}
              returnKeyType={'search'}
              listViewDisplayed='auto'
              fetchDetails={true}

              onPress={(data, details) =>
                navigation.navigate('Detail', {
                  lat: details.geometry.location.lat,
                  lng: details.geometry.location.lng
                })
              }
              getDefaultValue={() => ''}
              query={{
                key: 'AIzaSyCsSMOQKo0RE0mKvmqjQWMGhHmVVqqEmsU',
                language: 'en',
              }}
              styles={{
                container: {
                  flex: 1, // Set the container to take up available vertical space
                },
                textInputContainer: {
                  width: '90%',
                  borderColor: '#9d9fa1',
                  borderWidth: 0.5,
                  marginHorizontal: 10,
                  borderRadius:10
                },
                description: {
                  fontWeight: 'bold',
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                }
              }}
              currentLocation={true}
              currentLocationLabel="Current location"
              nearbyPlacesAPI='GooglePlacesSearch'
              GoogleReverseGeocodingQuery={{
              }}
              renderLeftButton={() => <Icon name="search" size={28} color={'#9d9fa1'}
                style={{ backgroundColor: 'white', height: 44, padding: 6 ,   alignSelf:'center',               borderRadius:10              }}
              />}
              renderRightButton={() => <Icon name="close" size={28} color={'#9d9fa1'}
              onPress={()=>setShowInput(false)}
              style={{ backgroundColor: 'white', height: 44, padding: 6,                  borderRadius:10            }}
            />}
            />
          </View>
      }


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  currentloc: {
    left: 30,
    color: 'black',
    bottom: 190,
    fontSize: 16,
    borderWidth: 0.3,
    width: '50%',
    backgroundColor: '#eaecee',
    borderColor: '#eaecee',
    borderRadius: 5,
    padding: 8
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
    right: 400
  },
});

export default App;
