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


type NavigationProps = {
  navigation: any,
  onPress: () => void
}

export default function HomeScreen(props: NavigationProps) {
  
  const route = useRoute();





  const [name, setName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');

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
  const clearData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      if (key === 'name') setName('');
      if (key === 'flightNumber') setFlightNumber('');
    } catch (error) {
      console.log(error);
    }
  };

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
    

    if (route.params?.name) {
      saveData('name', route.params.name);
      setName(route.params.name);
    }
    if (route.params?.flightNumber) {
      saveData('flightNumber', route.params.flightNumber);
      setFlightNumber(route.params.flightNumber);
    }
    // force re-render
    
  }, [route.params?.name, route.params?.flightNumber]);

  const [loaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
  })
  
  if(!loaded){
    return null;
  }


  return (
    <View style={styles.container}>
        <WelcomeText name={name} onPress={ () => props.navigation.navigate('MenuScreen')} />
        <InputBox />
        <Offer onPress={ () => props.navigation.navigate('TreasureScreen')} />
        <Text style={styles.textCategory}>{flightNumber}</Text>
        <View style={styles.wrapper}>
        

          <Text style={styles.textCategory}>Popular Tours</Text>
          <TouchableOpacity>
              <Text style={styles.textView}>See All</Text>
          </TouchableOpacity>
        </View>
 
        <Button title="Clear All Cache" onPress={clearAllData} />

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Card header={`${cardInfoDatabase.header[0]}`} result={`${cardInfoDatabase.result[0]}`} reviews={`${cardInfoDatabase.reviews[0]}`} image={require('../Images/tent.jpg')} onPress={ () => props.navigation.navigate('TourScreenOne') } /> 
            <Card header={`${cardInfoDatabase.header[1]}`} result={`${cardInfoDatabase.result[1]}`} reviews={`${cardInfoDatabase.reviews[1]}`} image={require('../Images/caravan.jpg')} onPress={ () => props.navigation.navigate('TourScreenTwo', {"name": name}) }/>  
            <Card header={`${cardInfoDatabase.header[2]}`} result={`${cardInfoDatabase.result[2]}`} reviews={`${cardInfoDatabase.reviews[2]}`} image={require('../Images/cannoing.jpg')} onPress={ () => props.navigation.navigate('TourScreenThree') }/> 
        </ScrollView>
        
    </View>
  )
}

const styles = StyleSheet.create({
  textView:{
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: sizes.menuText,
    color: colors.secondary,
    marginRight: 25,
  },
  textCategory:{
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: sizes.buttonTextSize,
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
})