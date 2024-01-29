import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native'
import WelcomeText from '../Components/WelcomeText'
import InputBox from '../Components/InputBox'
import Offer from '../Components/Offer'
import Card from '../Components/Card'
import cardInfoDatabase from '../database/cardInfoDatabase'
import nameDatabase from '../database/nameDatabase'
import { useFonts } from 'expo-font'
import sizes from '../assets/Sizes'
import colors from '../assets/Colors'
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
// Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../Components/Button'
import WeatherWidget from './WeatherWidget';
import TimeUntilArrivalWidget from './estTime';


type NavigationProps = {
  navigation: any,
  onPress: () => void
}

export default function HomeScreen(props: NavigationProps) {
  
  const route = useRoute();





  const [name, setName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [seat, setSeat] = useState('');

  // Save data to AsyncStorage
  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  };

  // Load data from AsyncStorage
  const loadData = async (key, setter) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setter(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Clear specific cached data by key

  // Clear all cached data
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setName('');
      setFlightNumber('');
      props.navigation.navigate('WelcomeScreenOne');
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData('name', setName);
    loadData('flightNumber', setFlightNumber);
    loadData('latitude', setLatitude);
    loadData('longitude', setLongitude);
    loadData('arrivalTime', setArrivalTime);
    loadData('seat', setSeat)
    

    if (route.params?.name) {
      saveData('name', route.params.name);
      setName(route.params.name);
      
    }
    if (route.params?.flightNumber) {
      saveData('flightNumber', route.params.flightNumber);
      setFlightNumber(route.params.flightNumber);
    }

    if (route.params?.latitude) {
      saveData('latitude', route.params.latitude.toString());
      setLatitude(route.params.latitude.toString());
    }

    if (route.params?.longitude) {
      saveData('longitude', route.params.longitude.toString());
      setLongitude(route.params.longitude.toString());
    }

    if (route.params?.arrivalTime) {
      saveData('arrivalTime', route.params.arrivalTime.toString());
      setArrivalTime(route.params.arrivalTime.toString());
    }

    if (route.params?.seat) {
      saveData('seat', route.params.seat.toString());
      setSeat(route.params.seat.toString());
    }
    // force re-render
    
  }, [route.params?.name, route.params?.flightNumber, route.params?.latitude, route.params?.longitude, route.params?.arrivalTime, route.params?.seat]);

  const [loaded] = useFonts({
    MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
  })
  
  if(!loaded){
    return null;
  }


  return (
    <View style={styles.container}>
        <WelcomeText name={name} onPress= {clearAllData} />
        <WeatherWidget latitude={parseFloat(latitude)} longitude={parseFloat(longitude)} arrivalTime={arrivalTime as Date} />
        <TimeUntilArrivalWidget arrivalTime={arrivalTime as Date} />
       <Text style={styles.textCategory_flight}>{flightNumber}</Text>
        <View style={styles.wrapper}>
        

        <View style={styles.banner}>
      <Text style={styles.bannerText}>Entertainment</Text>
    </View>

          {/* <TouchableOpacity>
              <Text style={styles.textView}>See All</Text>
          </TouchableOpacity> */}
        </View>
 
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Card header={`${cardInfoDatabase.header[0]}`} image={require('../Images/icon1.png')} onPress={ () => props.navigation.navigate('TourScreenOne') } /> 
            <Card header={`${cardInfoDatabase.header[1]}`} image={require('../Images/icon2.jpg')} onPress={ () => props.navigation.navigate('TourScreenTwo', {"name": name, "seat": seat, "flightNumber":flightNumber}) }/>  
            <Card header={`${cardInfoDatabase.header[2]}`}  image={require('../Images/icon3.jpg')} onPress={ () => props.navigation.navigate('TourScreenThree') }/> 
        </ScrollView>
        
    </View>
  )
}

const styles = StyleSheet.create({
  textView:{
    fontFamily: 'MontserratBold',
    fontWeight: '700',
    fontSize: sizes.menuText,
    color: colors.secondary,
    marginRight: 25,
  },
  textCategory_flight:{
    fontFamily: 'MontserratBold',
    fontWeight: '700',
    fontSize: sizes.hugeSize,
    // center text
    alignSelf: 'center',
  },
  wrapper:{
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 35,
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  container:{
    flex: 1,
    marginTop: 50,
  },
  textCategory_phrase:{
    fontFamily: 'MontserratBold',
    fontWeight: '700',
    fontSize: sizes.menuText,
    // center text
    marginLeft: 95,
  },
  banner: {
    backgroundColor: '#14ACDC',
    width: '100%', // Full width
    alignItems: 'center', // Center content horizontally
    paddingVertical: 10, // Add some padding vertically
    borderRadius: 10,
  },
  bannerText: {
    fontFamily: 'MontserratBold',
    fontWeight: '700',
    fontSize: sizes.menuText,
    color: 'white', // White text color
  },

})