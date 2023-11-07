/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// Initialize Firebase
async function initFirebase() {
    await messaging().registerDeviceForRemoteMessages();
    await messaging().setAutoInitEnabled(true);
  }

  initFirebase();

AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;