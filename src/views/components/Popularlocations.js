import React, { useEffect, useState } from 'react';
import { FlatList, Text, View,StyleSheet,Image,Pressable,Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
// import Geolocation from 'react-native-geolocation-service';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { baseUrl } from '../../constants/Constants';

const delivery = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [mylocation,setmylocation] = useState("")
  const navigation = useNavigation();


 
  useEffect(() => {
   
    fetch(`${baseUrl}/popular-geo-locations`,{
      method: 'POST', 
           
            headers: {
              'Content-Type': 
                'application/x-www-form-urlencoded;charset=UTF-8',
            },
          })
        
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const count = Object.keys(data). length;
  return (

    <View style={styles.categories}>  
       {isLoading ? 
       <SkeletonPlaceholder>
       <View style={{flexDirection:'row'}}>
       <View style={{margin:10}}>
         <View style={{ top:10 }}>
         </View>
          <View
             style={{ marginTop: 6, width: 100, height: 40, borderRadius: 30 }}
           />
       </View>
       <View style={{margin:10}}>
         <View style={{ top:10 }}>
         </View>
          <View
             style={{ marginTop: 6, width: 100, height: 40, borderRadius: 30 }}
           />
       </View>
       <View style={{margin:10}}>
         <View style={{ top:10 }}>
         </View>
          <View
             style={{ marginTop: 6, width: 100, height: 40, borderRadius: 30 }}
           />
       </View>
       
       </View>
     </SkeletonPlaceholder>
       : 
      
      ( <View >
        <Text style={{left:10,marginTop:10,fontWeight:'bold',color:'#6c757d'}} >POPULAR PLACES</Text>
        {count == 0 ?(
              <Text style={{textAlign:'center'}}>Currently No places Avaliable </Text>
        ):(
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>

{
  data?.map((item)=>{
    return(
      <Pressable 
      style={{marginTop:10}}
                    onPress={() =>
                      navigation.navigate('Detail', {
                            lat:(item.latitude) ,
                            lng: (item.longitude)
                        })
                    }
      >
          
      <View >
         
          <Text style={styles.text}>{item.name} </Text>
      </View>
      
      </Pressable>
    )
  })
}
          {/* <FlatList
              
              horizontal={true}
              data={data}
              // ItemSeparatorComponent={FlatListItemSeparator}
              keyExtractor={({ id }, index) => id}
              renderItem={({ item }) => (
                <Pressable 
                style={{flexDirection:'row',justifyContent:'space-evenly',flexWrap:'nowrap'}}
                              onPress={() =>
                                navigation.navigate('Detail', {
                                      lat:(item.latitude) ,
                                      lng: (item.longitude)
                                  })
                              }
                >
                    
                <View >
                   
                    <Text style={styles.text}>{item.name} </Text>
                </View>
                
                </Pressable>
              )}
            /> */}
            </View>
        )

        }
  
      
          
        </View>
      )}
         {/* <Text style={{top:80,left:40,fontWeight:'bold',color:'#ababab',borderBottomColor:'black',borderBottomWidth:1,width:'22%'}}>Saved places</Text>
         <Text style={{fontSize:14,top:100,left:40,width:'80%'}} numberOfLines={4}>{mylocation}</Text>  */}
    </View>
  );
};
const styles = StyleSheet.create({
         
          text:{
            // marginRight:10,
            borderRadius:28,
            borderWidth:0.5,
            backgroundColor:'#eaecee',
            borderColor:'#eaecee',
            fontSize:13,
            fontWeight:'600',
            height:'auto',
             marginLeft:10,
              padding:10,
              color:'#171717'
          }
      
      });

export default delivery;