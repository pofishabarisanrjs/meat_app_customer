import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { PersistGate } from 'redux-persist/integration/react';
import {AuthProvider} from './AuthContext';
import Navigation from './Navigation';
// import { AddProvider } from './Addcontext';
import SplashScreen from  "react-native-splash-screen";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import { baseurl } from './src/constants/Constants';


const Stack = createStackNavigator();

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <InternetConnectionAlert
    onChange={(connectionState) => {
      // console.log("Connection State: ", connectionState.details);
     }}>

    <AuthProvider>
          <Navigation/>
    </AuthProvider>
   
    </InternetConnectionAlert>
  );
};

export default App;

