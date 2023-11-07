import React from 'react';

//import all the components we are going to use
import { SafeAreaView } from 'react-native';

import { WebView } from 'react-native-webview';

const Webview = (props) => {
    const {url} = props.route.params
    
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: `${url}` }}
        style={{ flex: 1, marginTop: 20 }}
      />
    </SafeAreaView>
  );
};

export default Webview;