import { domainUrl } from "./Constants"
import AsyncStorage from "@react-native-community/async-storage";
const Settings =(cb)=>{
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON if sending JSON data
          // You may need to include other headers like authentication tokens here
        },
      };
      
    console.log("asdfasdfas",`${domainUrl}api/get-settings`)
    fetch(`${domainUrl}api/get-settings`,requestOptions)
    .then(response => {
       return response.json();
    })
    .then(data => {
    //   console.log("setting api =====>",data);
    //   AsyncStorage.setItem("AppSettings",JSON.stringify(data))
    cb(data)
    })
    .catch(error => {
      // Handle errors here
      console.error("Fetch error:", error);
    });
  
}

export default Settings