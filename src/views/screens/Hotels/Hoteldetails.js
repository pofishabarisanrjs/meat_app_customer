import React, { useEffect, useState, useContext, useRef } from 'react';
import { Animated, Pressable, Dimensions, useWindowDimensions, Platform, UIManager, Button, View, Text, StyleSheet, ImageBackground, Image, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome';

import { AuthContext } from '../../../../AuthContext';
import { Overlay } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SvgUri } from 'react-native-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ConstantClass } from '../Hotels/cartfind';
import Feather from 'react-native-vector-icons/Feather'
import { BoxShadow } from "react-native-shadow";
import { useFocusEffect } from '@react-navigation/native';
import { baseUrl,domainUrl } from '../../../constants/Constants';
import AsyncStorage from '@react-native-community/async-storage';
import MyVerticalSectionList from '../../components/OfferList';

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


export default function Hoteldetails(props) {
  const [isLoading, setLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [cartdata, setcartdata] = useState([]);
  const [cart_list, setcart_list] = useState([]);
  const [itemdata, setitemdata] = useState([]);
  const [storeCoupon, setStoreCoupon] = useState([])
  const [filters, setfilters] = useState([]);
  const [menuitem, setMenuitems] = useState([]);
  const [search, setSearch] = useState([]);
  const { navigation } = props
  const { id, slug, name } = props.route.params;
  const { userInfo } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [isvisible, setisVisible] = useState(false);
  const [selected, setselected] = useState('0');
  const [variable, setvariable] = useState(false);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const progress = useRef(new Animated.Value(0)).current;
  const [hasLiked, setHasLiked] = useState(false);
  var addi
  var addk
  // console.log(userInfo?.id)
  // console.log(slug)
  //  -----Overlay-----
  const toggleOverlay = () => {
    setisVisible(!isvisible);
  };



  //  -------Dialog-----
  const showDialog = (i, k) => {
    // console.log('values',i,k)
    ConstantClass.Email = i;
    ConstantClass.Password = k;
    console.log('valuesitems', addi, addk)
    setVisible(!visible);
  };
  const addtocart1 = () => {
    // console.log('afterclick',itemdata.latitude,itemdata.longitude)
    //  AsyncStorage.setItem('myloc',itemdata.longitude)
    //  AsyncStorage.setItem('myloct',itemdata.latitude)

    addtocart(ConstantClass.Email, ConstantClass.Password, 'add', 1)
    setVisible(!visible);

  }


  const handleDelete = () => {
    setVisible(false);
  };

  const handleLikeAnimation = () => {
    const newValue = hasLiked ? 0 : 1;

    Animated.timing(progress, {
      toValue: newValue,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setHasLiked(!hasLiked);
  };

  // ------------Hotel details API-------------- //     

  useEffect(() => {

    console.log(`${baseUrl}/get-restaurant-info-by-id/${id}`)
    fetch(`${baseUrl}/get-restaurant-info-by-id/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        AsyncStorage.setItem("restaurant_latitude", json.latitude);
        AsyncStorage.setItem("restuarnt_longitude", json.longitude);
        console.log(json)
        setitemdata(json)
        setStoreCoupon(json?.store_coupon)
        console.log("sadfaskdjfhajksd", storeCoupon)


      })
      .then((itemdata) => JSON.stringify(itemdata))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    // console.log(itemdata)


  }, []);

  // ----------Filters--------- //

  const Filterbuttons = () => {

    fetch(`${baseUrl}/get-menu-categories`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify()
    })
      .then((response) => (response.json()))
      .then((json) => setMenuitems(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  }
  useEffect(() => {
    Filterbuttons()
  }, [])




  // console.log(index);

  // ------------Menu Items API-------------- //





  const fetchData = (id) => {
    console.log('original', id)
    if (id == undefined) {
      id = 0
    }
    console.log(`${baseUrl}/get-restaurant-items/${slug}?&category_id=${id}`)

    fetch(`${baseUrl}/get-restaurant-items/${slug}?&category_id=${id}`,
      {
        method: 'POST',

        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },

      })

      .then((response) => response.json())
      .then((json) => {
        console.log('item data ===========>', json)
        setData(json); cartlist()
      })
      .then((Data) => JSON.stringify(Data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  }




  const itemcount = (Data.items != null && Data.items != undefined) ? (
    Object.values(Data.items).length
  ) : (
    <Spinner visible={isLoading} />
  )
  //  console.log('items count',itemcount)


  useFocusEffect(
    React.useCallback(() => {
      fetchData()

    }, [])
  );

  // ---------------cartlist-------- //


  const cartlist = () => {
    const user_id = userInfo?.id
    fetch(`${baseUrl}/cart-list`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        "user_id": user_id
      }),
    })
      .then((response) => (response.json()))
      .then((result) => {
        // console.log(result.cart_list)
        setcart_list(result.cart_list);

      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  }


  // -------------ADD TO CART API-------------  //
  var check = 0;
  const addtocart = (i, k, action, forceadd = 0) => {

    //  console.log(check)
    // console.log('item',i)
    const item_id = i
    const restaurant_id = k

    const user_id = userInfo?.id

    if (check == 0) {
      check = 1
      if (forceadd == 0 && cart_list.length > 0 && restaurant_id != cart_list[0].restaurant_id)
        return showDialog(i, k)

      let quantity = getcartqty(i)

      if (action == 'add')
      {
        if (quantity < 100) {

          quantity = quantity + 1
        }
        else
        {
          alert('Maximum 100 quantity only able to add at a time')
        }
      }
     
      else
        quantity = quantity - 1

        if (quantity == 0)
          removefromcart(i)
        else


          fetch(`${baseUrl}/add-cart`,
            {
              method: 'POST',

              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                "item_id": item_id,
                "restaurant_id": restaurant_id,
                "quantity": quantity,
                "user_id": user_id,
                "force_add": forceadd
              }),
            })

            .then((response) => (response.json()))
            .then((result) => {
              // console.log(result)
              setcart_list(result.cart_list);
              // console.log(cart_list.restaurant_id)
              check = 0
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
      


    }
  };
  const size = (cart_list != null && cart_list != undefined) ? (
    Object.values(cart_list).length
  ) : (
    <Spinner visible={isLoading} />
  )
  // console.log(size)

  //  console.log(size); 

  // -----------check cart_list--------- //

  const checkcartexist = (id) => {

    // console.log(cart_list)
    const found = cart_list?.find(el => el.item_id === id);

    if (!found)
      return true
    else
      return false
  }

  // ----------quantity---------//

  const getcartqty = (id) => {
    const found = cart_list?.find(el => el.item_id === id);
    //  console.log(found)
    if (found != undefined)
      return found.quantity
    else
      return 0
  }

  //  ----------total amount------//

  const gettotalamount = () => {
    var totalamount = 0
    var i = 0
    for (i = 0; i < cart_list.length; i++) {
      totalamount = totalamount + cart_list[i].total_price;
    }
    return totalamount;
  }
  //  --------REMOVE FROM CART API---------  //

  const removefromcart = async (i) => {
    const item_id = i
    const user_id = userInfo?.id

    await fetch(`${baseUrl}/remove-cart`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        "item_id": item_id,
        "user_id": user_id
      }),

    })
      .then((response) => (response.json()))
      .then((result) => {
        // console.log(result.cart_list)
        setcart_list(result.cart_list);
        check = 0
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }

  const itemfilterexist = (ids) => {
    // console.log(ids)
    const found = Data.find(el => el.item.id === ids);
    if (!found)
      return true
    else
      return false
  }
  // -------items render --------- //


  const shadowOpt = {
    width: 76,
    height: 30,
    color: "#000",
    border: 2,
    radius: 3,
    opacity: 0.1,
    x: 0,
    y: -10,
    style: { left: 10, marginVertical: 10, }
  };




  const _renderItem = () => {
    return (
      <View key={Data}>


        {(Data.items != null && Data.items != undefined) ? (
          Object.entries(Data.items).map(([key, value]) => {
            const arr = [];
            for (let i = 0; i < value.length; i++) {
              arr.push(
                value[i].is_active == 1 &&
                <View key={Data} style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <View key={Data} style={{ width: '70%' }}>

                    <View style={{ flexDirection: 'row', left: 10, borderBottomColor: 'grey', }}>
                      <ImageBackground
                        style={{ width: 84, height: 78, margin: 10, borderRadius: 10 }}
                        source={{ uri: `${domainUrl}${value[i].image}` }}>
                        {checkcartexist(value[i].id) ? (
                          <Text></Text>
                        ) : (<Text style={styles.qtyimg}>{getcartqty(value[i].id)}</Text>)}
                      </ImageBackground>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ marginTop: 5, fontWeight: '500', color: 'black',textTransform:'capitalize', width: Dimensions.get('window').width / 2 }} >{value[i].name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon1 name='rupee' size={13} style={{ marginTop: 5 }} color='#ED1F24' />
                            <Text style={{ marginTop: 5, color: '#ED1F24' }}> {value[i].price}</Text>
                          </View>
                          {
                            value[i].old_price != 0 &&
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                              <Icon1 name='rupee' style={{ marginTop: 5 }} size={13} />
                              <Text style={{ marginTop: 5, textDecorationLine: 'line-through' }}> {value[i].old_price}</Text>
                            </View>

                          }

                        </View>

                        {value[i].is_popular != 0 ? (<Text style={{ color: 'green', fontSize: 14 }}>Popular</Text>) : null}
                        {
                          value[i].net_weight ? (<Text style={{ fontSize: 10 }}>Net wt :{value[i].net_weight} {value[i].net_unit}</Text>) : null
                        }
                        {
                          value[i].gross_weight ? (<Text style={{ fontSize: 10 }}>Gross wt :{value[i].gross_weight} {value[i].gross_unit}</Text>) : null
                        }

                      </View>
                    </View>


                  </View>
                  <View style={{ width: '30%', justifyContent: 'center' }}>
                    <View style={styles.stepper}>

                      <BoxShadow setting={shadowOpt}>
                        {checkcartexist(value[i].id) ? (
                          <TouchableOpacity onPress={() => addtocart(value[i].id, value[i].restaurant_id, 'add')}
                            style={{
                              width: 76,
                              height: 32,
                              backgroundColor: "#fff",
                              borderRadius: 4,
                              marginVertical: 5,
                              bottom: 16,
                              overflow: "hidden",
                              borderWidth: 0.3,
                              borderColor: '#c4c4c4'
                            }}
                          >
                            <Text style={{ textAlign: 'center', top: 5, fontWeight: 'bold', color: 'green' }}>ADD</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => addtocart(value[i].id, value[i].restaurant_id, 'sub')}
                              style={{
                                width: 38,
                                height: 28,
                                backgroundColor: "#fff",
                                marginVertical: 5,
                                bottom: 16,
                                overflow: "hidden",
                                borderColor: '#c4c4c4',
                                borderLeftWidth: 0.3,
                                borderTopWidth: 0.2,
                                borderTopLeftRadius: 4,
                                borderBottomLeftRadius: 4,
                                borderTopColor: '#c4c4c4'
                              }}
                            >
                              <Text style={{ textAlign: 'center', top: 3, fontWeight: 'bold', color: 'green' }}>-</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => addtocart(value[i].id, value[i].restaurant_id, 'add')}
                              style={{
                                width: 38,
                                height: 28,
                                backgroundColor: "#fff",
                                //  borderRadius: 4,
                                borderTopRightRadius: 4,
                                borderBottomRightRadius: 4,
                                marginVertical: 5,
                                bottom: 16,
                                overflow: "hidden",
                                //  borderWidth:0.3,
                                borderColor: '#c4c4c4',
                                borderLeftWidth: 0.3,
                                borderTopWidth: 0.2,
                                borderTopColor: '#c4c4c4'
                              }}
                            >
                              <Text style={{ textAlign: 'center', top: 3, fontWeight: 'bold', color: 'green' }}>+</Text>
                            </TouchableOpacity>
                          </View>


                        )}
                      </BoxShadow>
                      <View style={styles.container}>

                        <Dialog.Container visible={visible}>
                          <Dialog.Description>Are you sure clear cart and update new items</Dialog.Description>

                          <Dialog.Button color={'orange'} label="confirm" onPress=
                            {() => addtocart1()} />
                          <Dialog.Button color={'orange'} label="Cancel" onPress={handleDelete} />
                        </Dialog.Container>
                      </View>
                    </View>


                  </View>
                </View>
              );

            }
            return (

              <View >
                <TouchableOpacity >
                  <Text key={Data} style={{
                    marginTop: 5,
                    fontWeight: 'bold',
                    fontSize: 16, color: 'black',
                    backgroundColor: 'white',
                    left: 10
                  }}>{key}</Text>
                </TouchableOpacity>
                {arr}


              </View>
            );
          })
        ) : (
          <Text></Text>

        )}
      </View>
    )

  }


  var i = []
  return (
    <View style={{ flex: 1, }}>
      <View style={{ backgroundColor: 'white', flexDirection: 'row', height: 70, }}>
        <Icon name="arrow-back-ios" size={24} onPress={navigation.goBack} style={{ left: 20, top: 25 }} />
        <Text style={{
          fontSize: 18,
          fontWeight: '500',
          left: 40,
          top: 25,
          color: 'black'
        }}>{name}</Text>
      </View>

      <View style={{ flex: 1, flexBasis: 'auto', backgroundColor: 'white', }}>
        <ScrollView style={{ marginBottom: 10 }}>
          {isLoading ? (
            <View style={{ backgroundColor: 'white' }}>
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
            <View style={{ backgroundColor: 'white' }}>

              <View>
                <ScrollView style={{ backgroundColor: 'white' }}>
                  {/* <-------HOTEL DETAILS SECTION ------------> */}
                  <View>
                    <View style={styles.hotel} >

                      <View>

                        <Image
                          style={{ width: 93, height: 78, top: 24, left: 20, borderRadius: 14 }}
                          source={{ uri: `${domainUrl}${itemdata.image}` }}></Image>

                      </View>

                      <View style={styles.content}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{itemdata.name}</Text>
                        <Text>{itemdata.operation_hrs}</Text>
                        <View style={styles.botcont}>
                          <Icon size={15}
                            name='star' color={'orange'} />
                          <View style={{
                            borderRightWidth: 0.5,
                            width: 50, bottom: 2,
                            borderColor: '#5757'
                          }}>
                            <Text> {itemdata.rating}</Text></View>
                          <View style={{
                            marginLeft: 30,
                            flexDirection: 'row',
                            borderRightWidth: 0.5,
                            width: 50,
                            borderColor: '#5757'
                          }}>
                            <Image
                              style={{ width: 12, height: 12, top: 5, right: 6 }}
                              source={require('../../../assets/time.png')}></Image>
                            <Text >{itemdata.delivery_time}</Text>
                          </View>
                          <View style={{ marginLeft: 30, flexDirection: 'row' }}>
                            <AntDesign style={{ right: 12, top: 3 }} name='wallet' size={14}></AntDesign>
                            <Image
                              style={{ width: 10, height: 10, top: 5, right: 8 }}
                              source={require('../../../assets/rupee.png')}></Image>
                            <Text>{itemdata.price_range}</Text>
                          </View>

                        </View>

                      </View>

                    </View>
                    {
                      storeCoupon !== null && storeCoupon !== undefined &&
                      <MyVerticalSectionList storeCoupon={storeCoupon} />
                    }

                    <View style={{ height: 120 }}>
                    <FlatList
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  data={menuitem}
  keyExtractor={(item, index) => item.id.toString()} // Use a unique identifier as the key
  renderItem={({ item }) => {
    const parts = item?.image.split('.');
    const extension = parts[parts.length - 1];
    if (item.is_enabled === 1)
      return (
        <View style={{ height: 40  }}>
          {itemfilterexist ? (
                          <View style={{ margin: 5, top: 10 }}>

            <TouchableOpacity
              onPress={() => {
                fetchData(item.id);
                setselected(item.id);
                console.log('hari>>filters>>hotel>>', selected);
              }}>
                {
                  extension === "svg" ? (
                    <SvgUri
                      width='55'
                      height='55'
                      style={{ left: 16, bottom: 6 }}
                      uri={item?.image ? `${domainUrl}${item.image}` : ''}
                    />
                  ) : (
                    <>
                      {
                        console.log('hyfo ', `${domainUrl}${item.image}`)
                      }
                      <Image
                        source={{ uri: `${domainUrl}${item.image}` }}
                        style={{ width: '60%', height: '60%' }} // Set the desired width and height
                      />
                    </>
                  )
                }
                <Pressable  onPress={() => {
                fetchData(item.id);
                setselected(item.id);
                console.log('hari>>filters>>hotel>>', selected);
              }}>
                <Text style={{
                  width: 86,
                  textAlign: 'center',
                  fontSize: 14,
                  backgroundColor: 'black',
                  borderRadius: 18,
                  height: 26,
                  top: 10,
                  textAlign: 'center',
                  paddingTop: 3,
                  color: 'white',
                  backgroundColor: selected === item.id ? 'red' : 'black',
                  bottom: 4
                }}>{item.name}</Text>
                </Pressable>
            </TouchableOpacity>
            </View>

          ) : (
              <Text>Currently Not Avaliable</Text>
            )
          }
        </View>
      )
    else
      return null
  }}
/>

                    </View>
                    <View style={{ top: 20, marginBottom: 30 }}>
                      {itemcount == 0 ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                           <SvgUri
                      width='300'
                      height='300'
                      style={{ left: 16, bottom: 6 }}
                      uri={ `${domainUrl}assets/website/images/icons/no_product_img.svg`}
                    />
                          <Text style={{ fontFamily: 'FontAwesome5_Solid', color: 'black' }}>No Products Found</Text>
                          <Text style={{ top: 10 }}>Try with another shop</Text>

                        </View>
                      ) : (
                        _renderItem()

                      )}
                    </View>
                  </View>
                </ScrollView>

              </View>

            </View>

          )}
        </ScrollView>

      </View>

      {/* fill space at the bottom*/}
      <View style={{ justifyContent: 'flex-end' }} />
      {size == 0 ?
        (
          <Text style={{ height: 0 }}></Text>
        ) : (

          <View style={[styles.bottomView, styles.elevation]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart',
                { restid: id }
              )}>
              <View style={{ flexDirection: 'row', bottom: 14 }}>
                <Text style={styles.totalitems}>{size} items</Text>
                <Text style={styles.totalamt}> <Image
                  style={{ width: 10, height: 10, top: 10, right: 7 }}
                  source={require('../../../assets/rupee.png')}></Image>  {gettotalamount()} </Text>
                <Text style={styles.cart}>VIEW CART  <Feather name='shopping-cart' size={15} /></Text>
              </View>
            </TouchableOpacity>
          </View>

        )}
    </View>
  );
};
const styles = StyleSheet.create({
  hotel: {
    width: "100%",
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 130,

  },
  content: {
    top: 24,
    left: 26
  },
  botcont: {
    flexDirection: 'row',
    top: 10,
    justifyContent: 'center',
    left: 10
  },
  search: {
    width: '90%',
    height: 42,
    backgroundColor: 'white',
    left: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    top: 10
  },
  bottomView: {
    width: '100%',
    height: 46,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    bottom: 0,
    // flex:1,
    // borderRadius:10,
    // left:10,

  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
  qtyimg: {
    backgroundColor: 'orange',
    width: 30,
    borderBottomRightRadius: 10,
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    fontFamily: 'FontAwesome5_Solid',
  },
  totalitems: {
    width: '24%',
    top: 14,
    fontSize: 16,
    left: 22,
    fontWeight: 'bold',
    borderRightWidth: 0.3,
    color: 'white'
  },
  totalamt: {
    width: '46%',
    top: 14,
    fontSize: 16,
    left: 40,
    fontWeight: 'bold',
    color: 'white'
  },
  cart: {
    width: '30%',
    top: 14,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },


  stepper: {

    elevation: 10,
  },
  text: {
    color: 'white',
    width: 80,
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  opacity: {
    width: 200,
    height: 200,
  },
});
