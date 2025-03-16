import React, {useState, useEffect, use} from "react";
import {Text, View, StyleSheet, Dimensions,ScrollView, ActivityIndicator} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import {Fontisto, Ionicons} from '@expo/vector-icons';

const {width:SCREEN_WIDTH}=Dimensions.get("window");

export default function App() {
  const [City, setCity]=useState("Loading...");
  const [days, setDays]  = useState([]);
  const [ok, setOk] = useState(true);
  
  const API_KEY = "21cde849aca23f3f35cbf6cfda08d5f7";

  const icons = {
    Clouds:"cloudy",
    Clear:"day-sunny",
    Rain : "rain",
    Snow : "snow"

  }
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy : 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setCity(location[0].street);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    console.log(json);
    setDays(
      json.list.filter((weather)=>{
        if(weather.dt_txt.includes("00:00:00")){
          return weather;
        }
      })
    );
  }; 
  useEffect(()=>{
    getWeather();
    },[])

  return( 
    <View style={styles.container}>
    <StatusBar style="light"/>
    <View style={styles.city}>
      <Text style={styles.cityName}>{City}</Text>
    </View>
    <ScrollView 
      pagingEnabled 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle ={styles.weather}>
        {days.length === 0 ?  
        <View style={styles.day}>
          <ActivityIndicator color="white" style={{marginTop : 10}} size="large"/>
        </View>
         : 
         days.map((day, index)=>
          <View key={index} style={styles.day}>
            <View style={{flexDirection: "row", alignItems:"center", width:"100%", justifyContent:"space-between"}}>
              <Text style={styles.temp}>
                {parseFloat(day.main.temp).toFixed(1)}
              </Text>
              <Fontisto name={icons[day.weather[0].main]} size={45} color="white" />
            </View>
            <Text style = {styles.description}>{day.weather[0].main}</Text>
            <Text style = {styles.tinyText}>{day.weather[0].description}</Text>
          </View>
         )
        }
    </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"skyblue",
  },
  city:{
    flex :1.5,
    backgroundColor : "skyblue",
    justifyContent : "center",
    alignItems : "center",
  },
  cityName:{
    fontSize:68,
    fontWeight:"500",
  },
  weather:{
  
  },
  day:{
      width:SCREEN_WIDTH,
      alignItems : "center",
  },
  temp:{
    fontSize:168,
    marginTop:50,
  },
  description:{
    marginTop:-30,
    fontSize:60,
  },
  tinyText:{
    fontSize:24,
  }
});
