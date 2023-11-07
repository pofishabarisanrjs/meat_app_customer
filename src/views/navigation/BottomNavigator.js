import 'react-native-gesture-handler';
import React,{useContext,useState,useEffect} from 'react';
import { Text,View } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconBadge from 'react-native-icon-badge';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import Notification from '../screens/Notification';
import Searchscreen from '../screens/Searchscreen';
import AccountScreen from '../screens/AccountScreen';
import ProfileScreen from '../screens/ProfileScreen'
import {AuthContext} from '../../../AuthContext'
import { useIsFocused } from '@react-navigation/native';
import { ConstantClass } from '../components/Locfind';
import { useFocusEffect } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Snackbar from 'react-native-snackbar';
import { baseUrl } from '../../constants/Constants';
import { StyleSheet, ToastAndroid, Button, StatusBar} from 'react-native';

const Tab = createBottomTabNavigator();
const TOPIC = 'MyNews';

ConstantClass.email = global.MyVar
const BottomNavigator = () => {
  const {userInfo,userinfo,cartNumber, notificationNumber,setNotificationnumber} = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [result, setresult] = useState([]);
  const [cart_list,setcart_list] = useState();
  const [isLoading, setLoading] = useState(true);
const [notificationLength,setNotificationLength]=useState(notificationNumber)
  const isFocused = useIsFocused(); 
  const user_id = userInfo?.id;
  const token = userInfo?.auth_token

  const requestUserPermission = async () => {
    
    const authStatus = await messaging().requestPermission();
    console.log('Authorization status(authStatus):', authStatus);
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };
  

  
  useEffect(() => {
    if (requestUserPermission()) {
      /**
       * Returns an FCM token for this device
       */
      console.log('sabaros')
      messaging()
        .getToken()
        .then((fcmToken) => {
          console.log('FCM Token -> ', fcmToken);
          console.log('helow',userInfo)
          console.log("token body ---->",{
            "token" : token,
            "push_token":fcmToken
          })
        if(fcmToken)
        {
          if(token )
          {
            fetch(`${baseUrl}/save-notification-token`,{
              method:'POST',
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                "token" : token,
                "push_token":fcmToken
              }),
            }).then((response)=>{
              console.log("fcmresponse------->",response)
            }).catch((error)=>{
              console.log(error)
            })
          }

        }
          
        });
    } else console.log('Not Authorization status:', authStatus);

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'getInitialNotification:' +
              'Notification caused app to open from quit state',
          );
          console.log(remoteMessage);
          if(token)
          Notificationapi()
        }
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage) {
        console.log(
          'onNotificationOpenedApp: ' +
            'Notification caused app to open from background state',
        );
        console.log(remoteMessage);
        if(token)
        Notificationapi()
      }
    });

   
    messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log(
          'Message handled in the background!',
          remoteMessage
        );
        if(token)
        Notificationapi();

    });

 
    const unsubscribe = messaging().onMessage(
      async (remoteMessage) => {
        console.log(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage)
        );
        Snackbar.show({
          text: remoteMessage.notification.title,
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            text: 'UNDO',
            textColor: 'green',
            onPress: () => { /* Do something. */ },
          },
        });
      
      }
    );

   
    messaging()
      .subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Topic: ${TOPIC} Suscribed`);
      });

    return () => {
      unsubscribe;
   
    };
  }, [token]);

  const cartlist = () =>{

    // console.log(user_id)
      fetch(`${baseUrl}/cart-list`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user_id":user_id
      }),
      })
        .then((response) =>response.json())
        .then((result) => {
          console.log(result)
          setcart_list(result.cart_list);
        //  alert(JSON.stringify(user_id))

        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
       
    
  }
//console.log("tokn",notificationNumber)
  const Notificationapi = () =>{

    // console.log(user_id)
      fetch(`${baseUrl}/get-user-notifications`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user_id":user_id,
        "token" : token
      }),
      })
        .then((response) =>response.json())
        .then((result) => {
         // console.log("sabaris ---->",result)
          const unreadData = result.filter(item => item.is_read === 0);

// Calculate the length of unread data
const unreadDataLength = unreadData.length;

console.log("Unread data length:", unreadDataLength);

          setNotificationLength(unreadDataLength)
          setNotificationnumber(unreadDataLength)
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
       
    
  }
  const size =(cart_list != null && cart_list != undefined)?(
    Object.values(cart_list).length
  ):('0')  
 
  useFocusEffect(
    React.useCallback(() => {
       cartlist()
       if(token)
       Notificationapi()
      else
      setNotificationnumber(0)

    }, [user_id,cartNumber,notificationNumber])
  );

  
//console.log(size)

  return (

    <Tab.Navigator
    tabBarOptions={{
      activeTintColor: 'orange', // Change this to your desired active label color
    }}
    initialRouteName={ConstantClass.email == 'somevalue' ? 'Cart':'Near Me'}
     keyboardHidesTabBar={true}
      screenOptions={{
        
        tabBarHideOnKeyboard:true,
        headerShadowVisible:true,
        keyboardHidesTabBar:true,
        showLabel: true,
        activeTintColor: 'orange',
        width:'90%',
        bottom:10,
        backgroundColor: 'transparent',
        fontFamily:'FontAwesome5_Solid',
        tabBarStyle:{
          width:'94%',
          left:12,
          bottom:6,
          backgroundColor:'white',
          borderRadius:10,
          marginBottom:7,
          marginTop:5,
          height:56
        },
        tabBarLabelStyle: {
          fontFamily:'FontAwesome5_Solid',
          fontSize:12,
          bottom:4
        },
        
      }}>

          <Tab.Screen
          name="Near Me"
          component={HomeScreen}
          options={{
           
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={24} />
            ),
            headerShown:false,
            
          }}
        />
    
        
      
      <Tab.Screen
        name="Alerts"
        component={Notification}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({color}) => (
            <IconBadge
            MainElement={
              <View style={{
                width:20,
                height:22,
                margin:12,
                
              }}><Icon name="bell" color={color} size={22} /></View>
            }
            BadgeElement={
              <Text style={{color:'#FFFFFF',fontSize:8}}>{notificationNumber}</Text>
            }

            IconBadgeStyle={
              {width:2,
              height:20,
              top:6,
              backgroundColor: 'orange',
              }
            }
            />
          ),
          headerShown:false
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Searchscreen}
        options={{
          tabBarIcon: ({color}) => (
              <Icon name="search-web" color={color} size={26} />
          ),
          headerShown:false
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarStyle: { display: "none" },

          tabBarIcon: ({color}) => (
            <IconBadge
            MainElement={
              <View style={{
                width:20,
                height:22,
                margin:12,
              
              }}><Icon name="cart" color={color} size={22} /></View>
            }
            BadgeElement={
              <Text style={{color:'#FFFFFF',fontSize:8,fontFamily:'FontAwesome5_Solid'}}>{size}</Text>
            }

            IconBadgeStyle={
              {width:2,
              height:20,
              top:6,
              backgroundColor: 'orange'}
            }
            />
          ),
          headerShown:false
        }}
      />
       { userInfo?.auth_token? (
          <Tab.Screen name="Account"
           component={ProfileScreen}
           options={{
            
            tabBarIcon: ({color}) => (
              <Icon name="account" color={color} size={28} />
            ),
            headerShown:false
          }}
           />
        ) : (
          <>
            <Tab.Screen
              name="Login"
              component={AccountScreen}
              options={{
                tabBarStyle: { display: "none" },
                tabBarIcon: ({color}) => (
                  <Icon name="account" color={color} size={22} />
                ),
                headerShown:false
              }}
            />
           
          </>
        )}
    </Tab.Navigator>
   
  );
};

export default BottomNavigator;
