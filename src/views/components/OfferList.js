import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const data = [
//   { key: '1', text: 'Item 1' },
//   { key: '2', text: 'Item 2' },
//   { key: '3', text: 'Item 3' },
//   // Add more items as needed
// ];

const MyVerticalSectionList = (props) => {
    const {storeCoupon}=props
    console.log("abdsfasj dafdasf",storeCoupon)

  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[storeCoupon]}
        renderItem={({ item }) =>{
            console.log(item)
            {
               if(item.is_active ===1 )
               return (
                <>
                <View style={{ width: 250, height: 100, borderColor: 'lightgray',borderWidth:1, margin: 10}}>
                <View style={{ margin: 10, justifyContent: 'flex-start', alignItems: 'center',flexDirection:'row' }}>
                    <Icon name='brightness-percent' size={32} color={'orange'}/>
                  <Text style={{marginLeft:10,color:'red',fontWeight:'bold'}}>{item.code}</Text>
                </View>
                <Text style={{fontSize:13,marginHorizontal:12}}>
                {item.discount} % off up to ₹ on orders above ₹ {item.min_subtotal}
                </Text>
                </View>
               
                </>
              )
              else
              return null
                
            }
           
        }}
      />
    </View>
  );
};

export default MyVerticalSectionList;
