import React, { useEffect, useState, useContext, useRef } from 'react';
import { FlatList, AppState, Text, View, StyleSheet, Image, ImageBackground, KeyboardAvoidingView, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../../AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Overlay } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useKeyboard } from '@react-native-community/hooks';
import { baseUrl,domainUrl } from '../../constants/Constants';
export default function App(props) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [removecart, setremovecart] = useState([]);
  const [cart_list, setcart_list] = useState([]);
  const [result, setresult] = useState([]);
  const [mylocation, setmylocation] = useState(" select location")
  const [count, setCount] = useState('Delivery');
  const [refreshing, setRefreshing] = React.useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [nameArr, setnameArr] = useState('')
  const [coupon, setcoupon] = useState('')
  const [appcoupon, setappcoupon] = useState(null)
  const [couponerror, setcouponerror] = useState('')
  // const { restid} = props.route.params;
  const { navigation } = props;
  const isFocused = useIsFocused();
  const { userInfo, userinfo,setCartnumber,refresh } = useContext(AuthContext);
  //console.log("sabaris userinfo", userinfo)
  const user_id = userInfo?.id
  const token = userInfo.auth_token
  const [visible, setVisible] = useState(false);
  const [myloc, setmyloc] = useState("");
  const [myloct, setmyloct] = useState("");
  const keyboard = useKeyboard()
  const showkeyboard = keyboard.keyboardShown
  const [removecoupon, setRemovecoupon] = useState(false)
  // console.log(showkeyboard)
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    _retrieveData()
  }, [refresh])

  const _retrieveData = async () => {
    try {

      const mylocation = await AsyncStorage.getItem('mylocation')
      if (mylocation !== null) {

      }
      setmylocation(mylocation)

    } catch (e) {

    }
  }

  const _retrievedata = async () => {
    try {
      const value = await AsyncStorage.getItem('myloc')
      if (value !== null) {
      }
      setmyloc(value)

    } catch (e) {
    }
  }

  useEffect(() => {
    isFocused ? (_retrievedata()) : (_retrieveData())
  }, [myloc, isFocused,refresh])


  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('myloct')
      if (value !== null) {

      }
      setmyloct(value)

    } catch (e) {
      console.log('error', e)
    }
  }
  useEffect(() => {
    isFocused ? (retrieveData()) : (retrieveData())
  }, [myloct, isFocused,refresh])
  // console.log(myloc,myloct)
  useEffect(() => {
    isFocused ? (cartlist()) : (cartlist())

  }, [isFocused,refresh, size])


  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
   // console.log(lat1, lon1, lat2, lon2)
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }



  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  const cartlist = () => {

    fetch(`${baseUrl}/cart-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user_id": user_id
      }),
    })
      .then((response) => (response.json()))
      .then((result) => {
        console.log(result)
        setcart_list(result.cart_list);

      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cartlist();
  }, [])

  if (cart_list !== null && cart_list !== undefined) {
    var size = Object.values(cart_list).length;
    // Use the values array as needed
  }
  // -------------ADD TO CART API-------------  //

  var check = 0;
  const addtocart = (item_id, id, action) => {
   // console.log("DSGSDFGSDFGSDFGSWDFGSDFGSDFGSDFGSDFGSDGDF =====================================================================================>",item_id)

   console.log(item_id)
    const itemid = item_id
    const restaurant_id = id
    const user_id = userInfo?.id
    let quantity = getcartqty(item_id)
    //   console.log(restaurant_id)
  console.log(quantity)
      if (check == 0) {
        check = 1
        if (action == 'add')
        {
          if(quantity<100)
          {
      
            quantity = quantity + 1
          }
          else{
            alert('Maximum 100 quantity only able to add at a time')
          }
        }
      

        else
          quantity = quantity - 1
   //  console.log("DSGSDFGSDFGSDFGSWDFGSDFGSDFGSDFGSDFGSDGDF =====================================================================================>",quantity)
        if (quantity == 0)
          removefromcart(item_id)
        else
      {
        console.log({
          "item_id": itemid,
                "restaurant_id": restaurant_id,
                "quantity": quantity,
                "user_id": user_id
        })
        fetch(`${baseUrl}/add-cart`,
        {
          method: 'POST',
  
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            "item_id": itemid,
            "restaurant_id": restaurant_id,
            "quantity": quantity,
            "user_id": user_id
          }),
        })
  
        .then((response) => (response.json()))
        .then((result) => {
          console.log("add to cart",result)
          if(result?.success)
        { 
           setcart_list(result.cart_list);
           check = 0
           if (appcoupon !== null)
           Applycoupon()
          }
          else{
            cartlist()
          }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
      }
        // console.log(cart_list)
      }
    
    
    
  };
  const getcartqty = (id) => {
    const found = cart_list.find(el => el.item_id === id);
    // console.log(found)
    if (found != undefined)
      return found.quantity
    else
      return 0
  }
  if (cart_list !== null && cart_list !== undefined) {
    var size = Object.values(cart_list).length;
    // Use the values array as needed
  }

  //  -------Remove from Cart---------   //
  const removefromcart = (item_id) => {

    const itemid = item_id
    const user_id = userInfo?.id

    fetch(`${baseUrl}/remove-cart`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        "item_id": itemid,
        "user_id": user_id
      }),

    })
      .then((response) => (response.json()))
      .then((result) => {
      //  console.log(result.cart_list)
        setcart_list(result.cart_list);
        setCartnumber(result.cart_list)
        if (appcoupon !== null)
          Applycoupon()
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };


  const gettotalamount = () => {
    var totalamount = 0.00
    var i = 0
    for (i = 0; i < cart_list.length; i++) {
      totalamount = totalamount + cart_list[i].total_price;
    }
    //  nameArr( totalamount.split(','))

    return totalamount.toFixed(2);
  }
  const gettotalpayamount = () => {
    var totalamount = 0.00
    var i = 0
    const deliverycharge = count == 'Delivery' ? cart_list[i]?.restaurant?.delivery_charges : '0'

    for (i = 0; i < cart_list.length; i++) {
      totalamount = Number(gettotalamount()) + Number(deliverycharge) + Number(cart_list[i].restaurant.restaurant_charges);
    }
    return totalamount.toFixed(2);

  }
  // console.log(gettotalpayamount())
  const getvalue = () => {
    gettotalpayamount();
    return gettotalamount();
  }
  const Applycoupon = () => {
    console.log("hdsafoahsdfoahso")
    const restaurant_id = cart_list[0]?.item_detail?.restaurant_id
 



    fetch(`${baseUrl}/apply-coupon`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "coupon": coupon,
        "restaurant_id": restaurant_id,
        "subtotal": gettotalamount(),
        "token": token
      })
    })
      .then((response) => (response.json()))
      .then((json) => {
       // console.log(json)
        if (json.success === true) {
          setappcoupon(json)
          setRemovecoupon(true)
        }
        else {
          setappcoupon(json)
          // alert("Invalid Coupon")
        }
      })
      .then((appcoupon) => JSON.stringify(appcoupon))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  }
  //  if ( appcoupon.success != false )
  //   return setcouponerror('Invalid Coupon')


  const i = 0
  return (
    isLoading ? (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <SkeletonPlaceholder>
          <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
            <View style={{ width: 60, height: 60, borderRadius: 10 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 250, height: 20, borderRadius: 4 }} />
              <View
                style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
              />
            </View>
          </View>
          <View
            style={{ left: 10, marginTop: 6, width: 330, height: 50, borderRadius: 4 }}
          />
          <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
            <View style={{ width: 60, height: 60, borderRadius: 10 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 250, height: 20, borderRadius: 4 }} />
              <View
                style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
            <View style={{ width: 60, height: 60, borderRadius: 10 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 250, height: 20, borderRadius: 4 }} />
              <View
                style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
            <View style={{ width: 60, height: 60, borderRadius: 10 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 250, height: 20, borderRadius: 4 }} />
              <View
                style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
            <View style={{ width: 60, height: 60, borderRadius: 10 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 250, height: 20, borderRadius: 4 }} />
              <View
                style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
              />
            </View>
          </View>

        </SkeletonPlaceholder>
      </View>
    ) : (
      size == 0 ? (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
          <View style={{ backgroundColor: 'white', flexDirection: 'row', height: 50, }}>
            <Icon name="arrow-back-ios" size={24} onPress={navigation.goBack} style={{ left: 20, top: 15 }} />
            <Text style={{
              fontSize: 18,
              fontWeight: '500',
              left: 40,
              top: 15,
              color: 'black'
            }}>CART</Text>
          </View>
          <Image
            style={{ width: '100%', height: '80%', resizeMode: 'center' }} source={{ uri: `${domainUrl}assets/img/various/cart-empty.png` }}
          ></Image>
          <Text style={{ textAlign: 'center', fontSize: 20, color: 'orange', fontStyle: 'FontAwesome5_Solid', fontWeight: '700' }} >No items in Cart</Text>
        </View>
      ) : (
        <View style={{ flex: 1, }}>
          <View style={{ backgroundColor: 'white', flexDirection: 'row', height: 50, }}>
            <Icon name="arrow-back-ios" size={24} onPress={navigation.goBack} style={{ left: 20, top: 15 }} />
            <Text style={{
              fontSize: 18,
              fontWeight: '500',
              left: 40,
              top: 15,
              color: 'black'
            }}>CART</Text>
          </View>

          {/* <View style={{ flex: 1, justifyContent: 'flex-start' }} /> */}


          <View style={{ flexBasis: 'auto', }}>
            {/* content goes here */}
            <ScrollView>


              <View>
                <View style={styles.hotel}>
                  <FlatList

                    data={cart_list?.slice(0, 1)}
                    keyExtractor={(item, index) => item}
                    renderItem={({ item }) => (
                      <View style={{ flexDirection: 'row', left: 14, top: 10, height: 100 }}>
                        <View style={{ bottom: 10 }}>
                          <Image
                            style={{ width: 100, height: 100, resizeMode: 'contain', justifyContent: "center", borderRadius: 2 }}
                            source={{
                              uri: `https://hyfifood.com${item.restaurant.image}`
                            }}
                          >

                          </Image>
                        </View>

                        <View>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', top: 4, left: 10, fontFamily: 'FontAwesome', color: 'black' }}>
                            {item.restaurant.name}
                          </Text>
                          <Text numberOfLines={1} style={{ top: 10, width: '22%', left: 10, fontSize: 12 }}>{item.restaurant.description}</Text>
                          <View style={{ flexDirection: 'row', top: 20, left: 14 }}>
                            <Icon size={15}
                              name='star' color={'orange'} style={{ top: 1 }} />
                            <Text style={styles.description}> {item.restaurant.rating}</Text>
                            <Image
                              style={{ width: 10, height: 10, top: 5, right: 4 }}
                              source={require('../../assets/time.png')}></Image>
                            <Text style={styles.description}>{item.restaurant.delivery_time} MIN</Text>
                            <Image
                              style={{ width: 10, height: 10, top: 5, right: 8 }}
                              source={require('../../assets/Path.png')}></Image>
                            <Image
                              style={{ width: 10, height: 10, top: 5, right: 4 }}
                              source={require('../../assets/rupee.png')}></Image>
                            <Text style={styles.description}>{item.restaurant.price_range}</Text>

                          </View>


                          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                            <View style={{ width: 260, height: 180, justifyContent: 'center', }}>
                              <Text style={{ textAlign: 'center', fontSize: 16, color: 'black', fontFamily: 'FontAwesome5_Solid' }}>Choose Delivery Type</Text>
                              <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>

                                <TouchableOpacity style={{ padding: 26, }} onPress={() => { toggleOverlay(), setCount('Delivery') }}>
                                  <Image
                                    style={{ width: 46, height: 50, }}
                                    source={{
                                      uri: `${domainUrl}assets/img/various/home-delivery.png`
                                    }}></Image>
                                  <Text style={{ top: 4, right: 10, fontFamily: 'FontAwesome', color: 'black' }}>   Delivery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 26 }} onPress={() => { toggleOverlay(), setCount('SelfPickup') }}>
                                  <Image
                                    style={{ width: 46, height: 50, left: 16 }}
                                    source={{
                                      uri: `${domainUrl}assets/img/various/self-pickup.png`
                                    }}></Image>
                                  <Text style={{ top: 4, right: 10, fontFamily: 'FontAwesome', color: 'black', left: 4 }}>Self Pickup</Text>
                                </TouchableOpacity>

                              </View>
                            </View>
                          </Overlay>
                          <View>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                  <Text style={{ fontSize: 13, color: 'black', left: 10, fontFamily: 'FontAwesome5_Regular', bottom: 18 }}>Hotel Accepts Both Delivery and Self Pickup options.</Text>
                  <View style={{ flexDirection: 'row', left: 10, bottom: 11 }}>
                    <Text style={{ color: 'black', fontSize: 13 }}>You have selected</Text>
                    <Text style={{ color: 'orange', fontSize: 13 }}>  {count}</Text>
                    <TouchableOpacity onPress={toggleOverlay}>
                      <Text style={{ color: 'red', fontSize: 13 }}>   (Change)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.items}>
                  <View style={{ height: 60 }}>
                    <Text style={styles.cartheading}>ITEMS IN CART</Text>
                  </View>
                  <View >
                    <FlatList
                      data={cart_list}
                      keyExtractor={(item, index) => item.id}
                      renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', paddingBottom: 10, left: 20, marginBottom: 15 }}>


                          <Text numberOfLines={1} style={{ marginRight: 50, width: 120, color: 'black', fontFamily: 'FontAwesome5_Regular', fontWeight: 'bold', marginBottom: 5 }}>{item.item_detail.name}</Text>


                          <View style={{ flexDirection: 'row', width: '20%', marginLeft: -15 }}>
                            <View style={{ flexDirection: 'row' }}>
                              {getcartqty(item.item_id) == 1 ? (
                                <TouchableOpacity
                                  onPress={() => addtocart(item.item_id, item.restaurant.id, 'sub')}>
                                  <Text style={{
                                    borderTopLeftRadius: 4, borderBottomLeftRadius: 4,
                                    color: 'black', paddingTop: 3, borderWidth: 0.6, width: 34, height: 25, textAlign: 'center', borderColor: '#57575730'
                                  }}><Icon size={16} color='red' name="delete-outline" /></Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => addtocart(item.item_id, item.restaurant.id, 'sub')}>
                                  <Text style={{
                                    color: 'black', borderWidth: 0.6, width: 34, height: 25, textAlign: 'center', borderColor: '#57575730', fontSize: 18, borderTopLeftRadius: 4, borderBottomLeftRadius: 4
                                  }}>-</Text>
                                </TouchableOpacity>
                              )}


                              <Text style={{ fontStyle: 'FontAwesome5_Solid', color: 'orange', borderBottomWidth: 0.6, borderColor: '#57575730', textAlign: 'center', paddingTop: 3, width: 40, borderTopWidth: 0.6, height: 25 }}>   {getcartqty(item.item_id)}  </Text>
                              <TouchableOpacity
                                onPress={() => addtocart(item.item_id, item.restaurant.id, 'add')}>
                                <Text style={{
                                  color: 'black', borderWidth: 0.6, borderTopRightRadius: 4, borderBottomRightRadius: 4,
                                  width: 34, height: 25, textAlign: 'center', borderColor: '#57575730', fontSize: 18
                                }}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={{ flexDirection: 'row', marginLeft: 44 }}>
                            <Image
                              style={{ width: 10, height: 10, justifyContent: "center", top: 5, right: 4 }}
                              source={require('../../assets/rupee.png')}></Image>
                            <Text style={{ color: 'black', fontWeight: '600' }}>{item.total_price}</Text>
                          </View>
                        </View>
                      )}

                    />
                    <View>

                    </View>
                  </View>
                </View>
                {/* ---------coupon-------- */}

                {!userInfo.auth_token ? (

                  <View style={{ top: 30, height: 100, backgroundColor: 'white', width: '94%', left: 10, borderRadius: 10 }} >
                    <View style={{ flexDirection: 'row', backgroundColor: 'white', top: 10, justifyContent: 'center', opacity: 0.1 }}>
                      <Image
                        style={{ width: 15, height: 15, top: 18, right: 10 }}
                        source={require('../../assets/offer.png')} ></Image>

                      <TextInput style={{ width: 220, borderBottomWidth: 0.3, borderBottomColor: 'grey', paddingBottom: 5 }}
                        placeholder='Coupon' placeholderTextColor='black' editable={false} >
                      </TextInput>

                      <TouchableOpacity style={{ backgroundColor: 'black', left: 20, width: 70, borderRadius: 8 }}>
                        <Text style={{ color: 'white', textAlign: 'center', top: 10, fontWeight: 'bold', right: 10 }} >Apply</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity onPressIn={() => navigation.navigate('Login')}>
                        <Text style={{ textAlign: 'center', top: 25 }}><Ionicons name='md-alert-circle-outline' size={16} /> Login to apply coupon</Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                ) : (

                  removecoupon === true ?
                    <View style={{ top: 30, backgroundColor: 'white', width: '94%', left: 10, borderRadius: 10 }} >
                      <View style={{ flexDirection: 'row', paddingHorizontal: 20, backgroundColor: 'white', justifyContent: 'space-between' }}>

                        <Text style={{ fontWeight: 'bold', color: '#000' }}>Coupon Applied</Text>
                        <Pressable onPress={() => {
                          setRemovecoupon(false);
                          setappcoupon(null)
                        }}>
                          <Text style={{ fontWeight: 'bold', color: 'red' }}>Remove Coupon</Text>
                        </Pressable>
                      </View>
                    </View>
                    :
                    <View style={{ top: 30, height: 100, backgroundColor: 'white', width: '94%', left: 10, borderRadius: 10 }} >
                      <View style={{ flexDirection: 'row', backgroundColor: 'white', top: 26, justifyContent: 'center' }}>
                        {/* <Image
           style={{width:18,height:18,top:16,right:10}} 
            source={require('../../assets/offer.png')} ></Image> */}
                        <MaterialIcons name='local-offer' size={20} style={{ top: 16, right: 8 }}></MaterialIcons>
                        <TextInput style={{ width: 220, borderBottomWidth: 0.3, borderBottomColor: 'grey', paddingBottom: 5 }}
                          placeholder='C O U P O N' placeholderTextColor='black' value={coupon} 
                          maxLength={15}
                          onChangeText={text => setcoupon(text)}>
                        </TextInput>

                        <TouchableOpacity onPress={() => Applycoupon()} style={{ backgroundColor: 'black', left: 14, width: 70, borderRadius: 8, right: 10 }}>
                          <Text style={{ color: 'white', textAlign: 'center', top: 10, fontWeight: 'bold' }} >Apply</Text>
                        </TouchableOpacity>

                      </View>
                      {isLoading ?
                        (<Text style={{ height: 0 }}>Loading </Text>) :
                        (
                          appcoupon?.success != false ? <Text style={{ height: 0 }}></Text> :
                            <View >
                              <Text style={{
                                top: 32, backgroundColor: '#f44333',
                                textAlign: 'center', height: 26,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                paddingTop: 2, color: 'white'
                              }}>Invalid Coupon</Text>
                            </View>
                        )}


                    </View>

                )}
                {/* //  --------Bill details---------  // */}
                <View style={{ height: userinfo.auth_token ? (700) : (630) }}>
                  <View style={styles.bill}>
                    <Text style={styles.billheading}>BILL DETAILS</Text>
                    <View style={{ top: 30, left: 16 }}>
                      <FlatList
                        data={cart_list?.slice(0, 1)}
                        keyExtractor={(item, index) => item}
                        renderItem={({ item }) => (
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '70%' }}>
                              <Text style={styles.billdetails}> Item  Total</Text>
                              <Text style={styles.billdetails}> Store  charges</Text>
                              {count != 'Delivery' ? (
                                <Text style={{ height: 0 }}></Text>
                              ) : (
                                <Text style={styles.billdetails}> Delivery  charges</Text>
                              )}
                              {appcoupon?.success == true ? (
                                <View style={[styles.billdetails, { bottom: 6, height: 56 }]}>
                                  <Text style={{ fontSize: 16 }} > Discount</Text>
                                  <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 10 }}> Coupon Applied -</Text>
                                    <Text style={{ fontSize: 10, color: 'red' }}> {appcoupon.name}</Text>
                                    <Text style={{ fontSize: 10, color: 'red' }}> ({appcoupon.discount_type == 'PERCENTAGE' ? `${appcoupon.discount}%` : `${appcoupon.discount}%`})</Text>
                                  </View>

                                </View>
                              ) : (<Text></Text>)}


                              <Text style={styles.billdetailspay}> To Pay</Text>
                              {/* <Text style={{fontSize:18,color:'red',fontWeight:'500'}}> You have selected {count}</Text> */}
                            </View>
                            <View style={{  width: '30%' }} >
                              <View style={{ flexDirection: 'row' }}>

                                <Text style={[styles.billdetails]}><Image style={{ width: 10, height: 10, }} source={require('../../assets/rupee.png')}></Image> {gettotalamount()}</Text>
                              </View>

                              <Text style={[styles.billdetails]}><Image style={{ width: 10, height: 10 }} source={require('../../assets/rupee.png')}></Image> {item.restaurant.restaurant_charges ? item.restaurant.restaurant_charges : '0.00'}</Text>
                              {count != 'Delivery' ? (
                                <Text style={{ height: 0 }}></Text>
                              ) : (
                                <Text style={[styles.billdetails]}><Image style={{ width: 10, height: 10 }} source={require('../../assets/rupee.png')}></Image> {item.restaurant.delivery_charges ? item.restaurant.delivery_charges : '0.00'}</Text>
                              )}
                              {appcoupon?.success == true ? (
                                <Text style={[styles.billdetails, { color: 'red' }]}> <FontAwesome name="rupee" size={13} style={{ left: 4 }} /> {appcoupon?.discounted_amount} - </Text>
                              ) : (
                                <Text></Text>
                              )}

                              <Text style={styles.billtotal}><Image style={{ width: 10, height: 10, top: 5, right: 6 }} source={require('../../assets/rupee.png')}></Image>{appcoupon?.success == true ? `${gettotalpayamount()}` - `${appcoupon?.discounted_amount}` : `${gettotalpayamount()}`}</Text>
                              {/* <Text style={styles.billtotal}><Image style={{ width:10, height: 10,top:5,right:6}}source={require('../../assets/rupee.png')}></Image>{appcoupon.applied_details.final_total} {getvalue()}</Text> */}
                            </View>

                          </View>

                        )}

                      />

                    </View>
                  </View>
                  <Image
                    style={{ width: '93%', height: 30, top: 24, left: 13 }}
                    source={require('../../assets/spikebill.png')}></Image>
                </View>
              </View>


            </ScrollView>
          </View>

          {/* fill space at the bottom*/}

          <View style={{ justifyContent: 'flex-end', height: 10 }} />
          {showkeyboard == true ? <Text style={{ height: 0 }}></Text> :
            userInfo.auth_token ?


              (
                <View style={[styles.bottomView, { padding: 10 }]}>
                  {count == 'Delivery' ? (
                    <View style={{ backgroundColor: 'white', width: '106%', bottom: 10, height: 150, borderTopColor: '#f3f3f3', borderTopWidth: 1.2 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: 10 }}>
                        <Text style={{ color: 'black', fontSize: 16, padding: 10, fontFamily: 'FontAwesome5_Solid' }}>DELIEVER TO</Text>
                        <TouchableOpacity onPress={
                          () => navigation.navigate('ManageAddress')}>
                          <Text style={{
                            color: 'orange', right: 14, top: 5, borderRadius: 3, textAlign: 'center',
                            paddingLeft: 8, paddingRight: 6,
                            borderWidth: 0.3, borderColor: 'grey', height: 25, paddingTop: 5, fontFamily: 'FontAwesome5_Solid', backgroundColor: "#f3f3f3"
                          }}>CHANGE</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={{ width: 100, top: 20 }}>{(userInfo == null && userInfo == undefined) ? (
                        <TouchableOpacity onPress={
                          () => navigation.navigate('LocationView')}>
                          <Text>   {mylocation}</Text>

                        </TouchableOpacity>

                      ) : (
                        <View>
                          {/* <Text style={{padding:5,width:'60%',top:10}}>{Object.values(userinfo[i].latitude)}</Text> */}
                          <Text style={{ padding: 5, width: '60%', top: 10 }}>{userInfo?.default_address?.address}</Text>
                        </View>

                      )}</Text>

                      {

                        (getDistanceFromLatLonInKm(cart_list?.slice(0, 1)[0].restaurant?.latitude,
                        cart_list?.slice(0, 1)[0].restaurant?.longitude, userInfo?.default_address?.latitude, userInfo?.default_address?.longitude).toFixed(2) < cart_list?.slice(0, 1)[0].restaurant.delivery_radius) ?
                          <TouchableOpacity style={{
                            bottom
                              : 10
                          }}
                            onPress={() =>
                              navigation.navigate('PaymentScreen', {
                                topay: appcoupon?.success == true ? `${gettotalpayamount()}` - `${appcoupon?.discounted_amount}` : `${gettotalpayamount()}`,
                                quantity: getcartqty(),
                                deliverytype: count,
                                address: userInfo?.default_address?.address,
                                couponname: coupon,
                                lat: userInfo?.default_address?.latitude,
                                long: userInfo?.default_address?.longitude,

                              })
                            }
                          >
                            <View style={{
                              textAlign: 'center', height: 58,
                              justifyContent: 'center', backgroundColor: 'orange', top: 45
                            }}>

                              <Text style={{
                                fontSize: 20, color: 'white',
                                width: '100%', textAlign: 'center',
                                fontFamily: 'FontAwesome5_Solid'
                              }}>Proceed to checkout</Text>

                            </View>
                          </TouchableOpacity>
                          :
                          <View style={{
                            bottom
                              : 10
                          }}

                          >
                            <View style={{
                              textAlign: 'center', height: 58,
                              justifyContent: 'center', backgroundColor: '#ef5350', top: 45
                            }}>

                              <Text style={{
                                fontSize: 15, color: 'white',
                                width: '100%', textAlign: 'center',
                                fontFamily: 'FontAwesome5_Solid'
                              }}>Restaurant is not operational on your selected location.</Text>

                            </View>
                          </View>
                      }

                    </View>
                  ) : (
                    (getDistanceFromLatLonInKm(myloct,
                      myloc, userInfo?.default_address?.latitude, userInfo?.default_address?.longitude).toFixed(2) < cart_list?.slice(0, 1)[0].restaurant.delivery_radius) ?


                    <TouchableOpacity style={styles.bottomview}
                      onPress={() =>
                        navigation.navigate('PaymentScreen', {
                          topay: appcoupon?.success == true ? `${gettotalpayamount()}` - `${appcoupon?.discounted_amount}` : `${gettotalpayamount()}`,
                          quantity: getcartqty(),
                          deliverytype: count,
                          address: userInfo?.default_address?.address,
                          couponname: coupon,
                          lat: userInfo?.default_address?.latitude,
                          long: userInfo?.default_address?.longitude,
                        })}>
                      <View style={{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center', top: 8 }}>
                        <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'FontAwesome5_Solid', fontWeight: 'bold', padding: 8 }}>Proceed to checkout</Text>
                      </View>
                    </TouchableOpacity>
                     :
                     <View style={{
                      bottom
                        : 10
                    }}

                    >
                      <View style={{
                        textAlign: 'center', height: 58,
                        justifyContent: 'center', backgroundColor: '#ef5350', top: 45
                      }}>

                        <Text style={{
                          fontSize: 15, color: 'white',
                          width: '100%', textAlign: 'center',
                          fontFamily: 'FontAwesome5_Solid'
                        }}>Restaurant is not operational on your selected location.</Text>

                      </View>
                    </View>



                  )}

                </View>
              )
              : (

                <View style={styles.bottomViewlogin}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AccountScreen', {
                      fromcart: 3006
                    })}>
                    <View style={{
                      flexDirection: 'row',
                      textAlign: 'center',
                      justifyContent: 'center',
                      padding: 20, fontSize: 20, fontFamily: 'FontAwesome5_Solid'
                    }}>
                      <Text>LOGIN TO CONTINUE</Text>
                    </View>
                  </TouchableOpacity>

                </View>

              )}
        </View>

      )

    )

  );

};

const styles = StyleSheet.create({
  header: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: 80

  },
  logo: {
    // left:12,
    width: '35%',
    height: 32,
    top: 24
  },
  location: {
    color: 'black',
    alignSelf: 'flex-end',
    width: 120,
    height: 20,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
    bottom: 40
  },
  locationicon: {
    width: 10,
    height: 13,
    right: 8,
    justifyContent: "center",
    alignItems: 'center',

  },
  licon: {
    width: 4,
    height: 8,
    right: 8,
    top: 2,
  },
  hotel: {
    width: '100%',
    height: 160,
    backgroundColor: '#f8f9fa',
  },
  items: {
    width: '94%',
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
    top: 20,
    // paddingBottom:20
  },
  cartheading: {
    left: 20,
    top: 15,
    paddingBottom: 8,
    borderBottomWidth: 0.2,
    width: '88%',
    borderBottomColor: '#57575730',
    color: 'black',
    fontFamily: 'FontAwesome',
    fontWeight: 'bold',
    height: 30
    // style={{fontSize:16,fontWeight:'bold',top:4,left:10,fontFamily:'FontAwesome',color:'black'}}
  },
  bill: {
    width: '94%',
    height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
    top: 40,
  },
  billheading: {
    left: 20,
    top: 20,
    width: '88%',
    color: 'black',
    borderBottomColor: '#57575730',
    color: 'black',
    fontFamily: 'FontAwesome',
    fontWeight: 'bold',
  },
  description: {
    flexDirection: 'row',
    marginRight: 40,
    fontSize: 12,
    fontFamily: 'FontAwesome',
    color: "#7F7F7F",
    top: 4
  },
  itemdetails: {
    flexDirection: 'row',
    top: 20
  },
  billdetails: {
    fontSize: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: '#57575730',
    height: 50,
    paddingTop: 12,

  },
  billdetailspay: {
    fontSize: 16,
    height: 30,
    paddingTop: 6,
    fontWeight: 'bold',
    color: 'black',
  },
  billtotal: {
    fontSize: 16,
    height: 30,
    paddingTop: 6,
    fontWeight: 'bold',
    color: 'black',
    width: 300,
  },
  deliverytype: {
    fontSize: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: '#57575730',
    height: 30,
    paddingTop: 6,
    fontWeight: 'bold',
    color: 'red',
    top: 4
  },
  bottomView: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'orange',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: -20,
  },
  bottomViewlogin: {
    width: '100%',
    height: 60,
    backgroundColor: 'orange',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  bottomview: {
    width: '110%',
    height: 60,
    backgroundColor: 'orange',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
  },
  coupon: {
    top: 30,
    width: '94%',
    backgroundColor: 'white',
    left: 12,
    borderRadius: 10,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center'
  },
  title: {
    width: '66%',
    fontSize: 20,
    color: 'black',
    fontWeight: '400',
    left: 26,
    top: 24
  },
  apply: {
    top: 20,
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 14,
    color: 'white',
    fontWeight: 'bold',
    left: 10,

  },
  couponlogin: {
    top: 30,
    width: '94%',
    height: 80,
    backgroundColor: 'white',
    left: 12,
    borderRadius: 10,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center'
  },

});
