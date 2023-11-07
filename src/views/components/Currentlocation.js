import React, { useState } from 'react';
import { TouchableOpacity, Text, View, PermissionsAndroid ,Alert,Linking} from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';

const CurrentLocation = ({ onLocationReceived }) => {
  const [loading,setLoading]=useState(false)
  const handleLocationButtonClick =  async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to function properly.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
console.log(PermissionsAndroid.RESULTS)

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, you can now access the location.

        getCurrentLocation();
      } else {
        // Permission denied, show a prompt to the user.
        Alert.alert(
          'Permission Denied',
          'Please grant location permission to use this app.',
          [
            {
              text: 'Ask Again',
              onPress: () => Linking.openSettings(),
            },
            {
              text: 'Cancel',
              onPress: () => console.log('Permission denied by user.'),
              style: 'cancel',
            },
          ]
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationReceived({})
        // Do something with the latitude and longitude, e.g., display it on the screen.
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        onLocationReceived({ latitude, longitude });
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <>
      {
        loading?
        <Text style={{ color: 'orange', fontWeight: 'bold', marginLeft: 10, fontSize: 15 }}>Collecting your Location ....</Text>
        :
        <TouchableOpacity onPress={handleLocationButtonClick}>

        <View style={{ borderBottomColor: '#9d9fa1', borderBottomWidth: 0.5, marginBottom: 10, paddingBottom: 15, marginHorizontal: 10, flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start' }}>
          <Icon name="location-arrow" size={17} color={'orange'} />
          <Text style={{ color: 'orange', fontWeight: 'bold', marginLeft: 10, fontSize: 15 }}>Use my current location</Text>
        </View>
      </TouchableOpacity>
  

      }
      </>
  );
};

export default CurrentLocation;
