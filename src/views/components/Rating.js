// React Native Custom Star Rating Bar
// https://aboutreact.com/react-native-custom-star-rating-bar/

// import React in our code
import React, {useContext, useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { domainUrl } from '../../constants/Constants';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomRating = (props) => {
  // To set the default Star Selected
  const [defaultRating, setDefaultRating] = useState(1);
  const { id, orderid, orderstatus } = props.route.params;
  const navigation = useNavigation();
const {userInfo}=useContext(AuthContext)
  // To set the max number of Stars
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  // Filled Star. You can also give the path from local
  const starImageFilled =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
  // Empty Star. You can also give the path from local
  const starImageCorner =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';

  const CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setDefaultRating(item)}>
              <Image
                style={styles.starImageStyle}
                source={
                  item <= defaultRating
                    ? {uri: starImageFilled}
                    : {uri: starImageCorner}
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const Rating =()=>{
      
    console.log(`${domainUrl}public/api/rate-order`,JSON.stringify({
        "token":userInfo?.auth_token,
        "order_id":id,
        "rating_delivery":defaultRating,
        "rating_store":defaultRating, 
        "review_delivery":"",
        "review_store":""
    }))
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON if sending JSON data
          // You may need to include other headers like authentication tokens here
        },
        body:JSON.stringify({
            "token":userInfo?.auth_token,
            "order_id":id,
            "rating_delivery":defaultRating,
            "rating_store":defaultRating, 
            "review_delivery":"",
            "review_store":"",
            "user_id":262
        })
      };
      
    fetch(`${domainUrl}public/api/rate-order`,requestOptions)
    .then(response => {
       return response.json();
    })
    .then(data => {

    console.log(data)
    navigation.navigate('Myorders')
    })
    .catch(error => {
      // Handle errors here
      console.error("Fetch error:", error);
    });

}

  return (
    <SafeAreaView style={styles.container}>
           <View style={{ backgroundColor: 'white', flexDirection: 'row', height: 70, }}>
          <Icon name="arrow-back-ios" size={24} onPress={navigation.goBack} style={{ left: 20, top: 25 }} />
          <Text style={{
            fontSize: 18,
            fontWeight: '500',
            left: 40,
            top: 25,
            color: 'black'
          }}>{orderid}</Text>
        </View>
      <View style={styles.container}>
       <Text style={styles.textStyle}>
        RATE YOUR ORDER

        </Text>
        <Text style={styles.textStyleSmall}>
          Please Rate Us
        </Text>
        {/* View to hold our Stars */}
        <CustomRatingBar />
        <Text style={styles.textStyle}>
          {/* To show the rating selected */}
          {defaultRating} / {Math.max.apply(null, maxRating)}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={() => Rating()}>
          {/* Clicking on button will show the rating as an alert */}
          <Text style={styles.buttonTextStyle}>
            Submit your Rating
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CustomRating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 23,
    color: '#000',
    marginTop: 15,
  },
  textStyleSmall: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginTop: 15,
  },
  buttonStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    padding: 15,
    backgroundColor: 'orange',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  starImageStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
});