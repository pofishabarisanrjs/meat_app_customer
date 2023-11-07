import React, { Component,useContext} from 'react';
import { Text, KeyboardAvoidingView, View,Image, ActivityIndicator, Button,StyleSheet,Dimensions,PermissionsAndroid,Linking,TextInput, ImageBackground} from 'react-native';
import MapView from "react-native-maps";
import geolocation from '@react-native-community/geolocation'
import {mapStyle} from '../../consts/Mapstyle'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../../AuthContext';
import RNRestart from 'react-native-restart'; 
import Geolocation from 'react-native-geolocation-service';

export default class Detail extends Component {

  constructor(props) {
    super(props);
    this.state = {text1: ''};
  
    this.state = {
      loading: true,
      region: {
        latitude: 10,
        longitude: 10,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      },
      markerRegion:{
        latitude: 10,
        longitude: 10,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      },
      isMapReady: false,
      marginTop: 1,
      userLocation: "",
      regionChangeProgress: false
    };
    
  }


    UNSAFE_componentWillMount() {
  
      this.getCurrentPosition()
      
  
  }

getCurrentPosition=async()=>{

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

      this.getCurrentLocation();
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
}


getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        };
        this.setState({
          region: region,
          markerRegion:region,
          loading: false,
          error: null,
          address:''
        });
      },
      (error) => {
        console.log(error);
        this.setState({
          error: error.message,
          loading: false
        })
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000, },
    );
};




  onMapReady = () => {
    this.setState({ isMapReady: true, marginTop: 0 });
  }

  fetchAddress = () => {
    const lat =  this.state.region.latitude + "," + this.state.region.longitude
    
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + lat + "&key=" + "AIzaSyCsSMOQKo0RE0mKvmqjQWMGhHmVVqqEmsU",{
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
    },
    })
      .then((response) =>  response.json())
      .then((responseJson) => {
        const userLocation = responseJson != undefined && responseJson != null ?
        (responseJson.results[0].formatted_address):("Loading..") 
        const formatedData=responseJson?.results[0]?.address_components
        .filter(item => item.types.includes("route") || item.types.includes("sublocality_level_1") || item.types.includes("locality") || item.types.includes("administrative_area_level_1") || item.types.includes("country") || item.types.includes("postal_code"))
        .map(item => item.long_name)
        .join(', ')
        console.log("formatedData ---->",formatedData);

        this.setState({
          userLocation: formatedData,
          // console.log(userLocation),
           regionChangeProgress: false
        });
      });
  }
  onRegionChange = region => {
    console.log("sava",region)
    this.setState({
     //region,
      regionChangeProgress: false,
      markerRegion:region
    });
  }
  onRegionChangeComplete = region => {
    console.log("sava",region)
    this.setState({
    region,
      regionChangeProgress: true,
     markerRegion:region
    }, () => this.fetchAddress());
  }
 
   onLocationSelect = async () => {
    {
      try {
       console.log("this.location saaa",this.state.userLocation)
        await AsyncStorage.setItem('mylocation', this.state.userLocation)
      } catch (e) {
       
      }
    }
  };
  
  onLocation = async () => {
    {
      try {
        console.log(this.state.region,"sabaris ----->")
        await AsyncStorage.setItem('myloc', JSON.stringify(this.state.region.longitude))
        await AsyncStorage.setItem('myloct', JSON.stringify(this.state.region.latitude))
      } catch (e) {
       
      }
    }
  };

   onMarkerDrag = (e) => {
    // Update the marker position when it's dragged
    console.log(e.nativeEvent.coordinate);
  };


  render() {
    
    const {  lat,lng } = this.props.route.params;
    if (this.state.loading) {
      return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
           <Image style={{width:250,height:250}}
            source={require('../../assets/loader.gif')} >
         </Image>
         </View>
      );
    } else {

      {
        console.log('this.marker',this.state.markerRegion)
      }
      return (
       
        <View style={styles.container}>
           <KeyboardAvoidingView
           behavior={Platform.OS === "ios" ? "padding" : "height"}
           style={{ flex: 1}}
         >
          <View style={{ flex: 1 }}>
              {!!this.state.region.latitude && !!this.state.region.longitude &&
              <MapView
                style={{ ...styles.map, marginTop: this.state.marginTop }}
                initialRegion={{
                  latitude: Number(lat),
                  longitude: Number(lng),
                  latitudeDelta: 0.00005,
                  longitudeDelta: 0.0021,
                  }}
                showsUserLocation={true}
                // customMapStyle={mapStyle}
                mapType={'standard'}
                onMapReady={this.onMapReady}
                onRegionChange={this.onRegionChange}
                onRegionChangeComplete={this.onRegionChangeComplete}
              >
              
                <MapView.Marker
                  coordinate={{ "latitude": this.state.markerRegion.latitude, "longitude": this.state.markerRegion.longitude }}
                  title= { this.state.userLocation }
                  description="This marker is not draggable"
                  draggable={false}                  
                  onDragEnd={this.onMarkerDrag}

                >
                    <ImageBackground style={{width:30,height:44}}  source={require('../../assets/markerhome.png')}>
                    </ImageBackground>
                </MapView.Marker>
                 
              </MapView>
            }
              
          </View>
          <View style={styles.deatilSection}>
            
            <Text style={{  fontSize: 12, fontWeight: "bold", fontFamily: "roboto", color: "#999" }}>YOUR LOCATION</Text>
            <Text numberOfLines={4} style={{ fontSize: 14, paddingVertical: 10, borderBottomColor: "silver", borderBottomWidth: 0.5 }}>
              {!this.state.regionChangeProgress ? this.state.userLocation : "Identifying Location..."}</Text>
              <Text style={{ fontSize: 12, fontWeight: "bold", fontFamily: "roboto",top:20, color: "#999" }}>ADDRESS</Text>
            <TextInput  
            style={{ fontSize: 14,
            top:10, 
            borderBottomColor: "silver", 
            borderBottomWidth: 0.5 }}
            onChangeText={(text1) => this.setState({text1})}
            placeholder={"House / Flat.no / office"}
            value={this.state.text1}> 
              </TextInput>
          </View>
          </KeyboardAvoidingView>
          <View style={styles.btnContainer}>
            <AuthContext.Consumer>
            
            {({ userInfo,registeradd,isLoading}) => (
             !userInfo.auth_token?(
              <View>
              <Spinner visible={isLoading} />
            <TouchableOpacity 
               onPress={() => {
                  this.onLocationSelect(); this.onLocation()
              ;RNRestart.Restart();
                 }} 
             >
            <Text style={{
             width:'94%',
             backgroundColor:'orange',
             color:'white',
             padding:12,
             borderRadius:10,
             textAlign:'center'}}>Save Address</Text>
           </TouchableOpacity>
           </View>
             ):(
              <View>
              <Spinner visible={isLoading} />
            <TouchableOpacity onPress={
              
               () => {registeradd(this.state.userLocation,
               this.state.region.latitude,
               this.state.region.longitude,
               this.state.text1,
               this.state.text2,
               this.props.navigation.navigate('Near Me'));
               this.onLocationSelect();
               this.onLocation();
              }
               
             } >
            <Text style={{
             width:'94%',
             backgroundColor:'orange',
             color:'white',
             padding:12,
             borderRadius:10,
             textAlign:'center'}}>Save Address</Text>
           </TouchableOpacity>
           </View>
             )
               )}
            </AuthContext.Consumer>

            </View>
        </View>
        
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width
  },
  map: {
    flex: 1,
  },
  mapMarkerContainer: {
    left: '47%',
    position: 'absolute',
    top: '42%'
  },
  mapMarker: {
    fontSize: 40,
    color: "red"
  },
  deatilSection: {
    //flex: 1,
    height:Dimensions.get('window').height/2.5,
    backgroundColor: "#fff",
    padding: 10,
//    display: "flex",
  //  justifyContent: "flex-start"
  },
  spinnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  btnContainer: {
    width: "100%",
    position: "absolute",
    bottom: 100,
    left: 10
  }
});