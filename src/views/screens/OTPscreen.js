import React,{useState,useContext,useEffect} from 'react';
import {Image,Text,View,SafeAreaView,TouchableOpacity,StyleSheet,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../../AuthContext';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { baseUrl } from '../../constants/Constants';
export default function VerifyOTP(props) {
    const [data, setData] = useState('')
    const [otpdata, setotpData] = useState('')
    const [resetOTP, setresetOTP] = useState('')
  const {  navigation } = props
  const phone = 9999999999
  // const {name,email,phone,password} = props.route.params;
  const [counter, setCounter] = React.useState(30);
  React.useEffect(() => {
      const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
  }, [counter]);
  const {isLoading, register,googlelogin} = useContext(AuthContext);
// console.log(name,phone,password)
   const VerifyOTP = () => {
        
   
      console.log(resetOTP)
      console.log(email)
       fetch (`${baseUrl}/verify-password-reset-otp`,
       {
           method:'POST',
           headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            "email":email,
            "code":resetOTP,
          }),
          
       })
       .then((response) => response.json())
       .then((json) => setData(json),newpasswordscreen())
       .then((data) => JSON.stringify(data))
       .catch((error) => console.error(error))
       console.log('hello',data)
   }
   const newpasswordscreen = () => {
     if (data?.success != 'true')
     return console.log('succs'),register(name,email,phone,password)
     else 
     return alert('inValid OTP')
   }

   const resendotp = () => {
    fetch (`${baseUrl}/rend-otp`,
    {
        method:'POST',
        headers: {
         "content-type": "application/json",
       },
       body: JSON.stringify({
        //  "phone":9585878759,
         
       }),
       
    })
    .then((response) => response.json())
    .then((json) => setotpData(json))
    .then((data) => JSON.stringify(data))
    .catch((error) => console.error(error))
    console.log('resend',otpdata)
   }



    return(
      <SafeAreaView style={{backgroundColor: 'white',height:800}}>

      <View style={styles.head}>
          <View style={styles.backbutn}>
           <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} style={{left:30}} />
         </View>
         <View style={{flexDirection:'row',height:155}}>
         <View style={{width:'60%'}}>
             <Text style={styles.login}>RESEND OTP</Text>
             <Text style={styles.log}>An Authentication code hase been sent to {phone}</Text>
         </View>
         <View style={{width:'50%'}}>
         <Image
           style={{ width: '46%', height: 150,justifyContent:"center",left:50}}
            source={require('../../assets/Forget.png')}></Image>
         </View>
      </View>
      </View>
      <View style={styles.content}>
          <View style={styles.fields}>
              
              
{/* <OTPInputView
    style={{width: '80%', height: 200}}
    pinCount={4}
    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
    // onCodeChanged = {code => { this.setState({code})}}
    autoFocusOnLoad
    codeInputFieldStyle={styles.underlineStyleBase}
    codeInputHighlightStyle={styles.underlineStyleHighLighted}
    onCodeFilled = {(code => {
        console.log(`Code is ${code}, you are good to go!`)
    })}
/> */}
                <TextInput
                  name="Otp"
                  placeholder="Enter OTP"
                  style={styles.efield}
                  onChangeText={text => setresetOTP(text)}
                  value={resetOTP}
                  textAlign='center'
                  keyboardType={'numeric'}
                  maxLength={5}
                />
                <TouchableOpacity style={{width:'100%',}}
                onPress={()=>VerifyOTP()}
             
                >
                  <Text style={styles.button}>Verify OTP</Text>
                </TouchableOpacity>
                
              
   
      </View>
      <View style={{flexDirection:'row'}}>
      <Text style={{fontWeight:'500'}}>Resend OTP in </Text>
        <Text style={{color:'red'}}>00:{counter}</Text>
      </View>

        {counter == 0 ?(
         <View >
          <TouchableOpacity  onPress={()=>resendotp()}>
             <Text style={{top:15,borderRadius:10,color:'white',color:'green',borderBottomWidth:0.3,
             paddingBottom:4,fontWeight:'500',
             borderBottomColor:'green' }}>Resend OTP</Text>
          </TouchableOpacity>
          </View>
        ):( <View style={{opacity:0.3}}>
           <Text  style={{top:15,borderRadius:10,color:'white',color:'green',borderBottomWidth:0.3,
             paddingBottom:4,fontWeight:'500',
             borderBottomColor:'green' }}>Resend OTP</Text>
          </View>)}
        
      </View>
     

    </SafeAreaView>
        
    );
}
const styles = StyleSheet.create({
  head:{
      backgroundColor:'#f2f4f9',
      width:'100%',
      height:200,
      },
 backbutn:{
    backgroundColor:'#f2f4f9',
    width:'100%',
    top:10
      },
      login:{
          top:80,
          fontWeight:'bold',
          fontSize:20,
          color:'black',
          left:16,
          fontFamily: "Segoe UI",
      },
      log:{
          top:90,
          left:16
      },
      content:{
          width:'100%',
          height:400,
          alignItems:'center'
      },
      fields:{
        width:'80%',
        height:200,
        alignItems:'center',
        top:30
      },
      efield:{
          width:'100%',
          backgroundColor:'white',
          borderBottomColor:'silver',
          borderBottomWidth:1,
          marginBottom:30,
          height:56,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
      },
      button:{
        backgroundColor:'orange',
        color:'white',
        height:44,
        textAlign:'center',
        borderRadius:5,
        paddingTop:12,
        fontWeight:'bold',
        fontSize:16
        
        },
        but:{
            backgroundColor:'white',
            color:'#b8b8b8',
            height:44,
            textAlign:'center',
            borderRadius:5,
            paddingTop:12,
            fontWeight:'bold',
            fontSize:12,
            borderWidth:1,
            borderColor:'#b8b8b8'
            },
        errorText: {
            fontSize: 12,
            color: '#ffa29c',
            bottom:26,
            right:80
          },
 
});