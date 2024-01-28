import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native'
import colors from '../assets/Colors'
import sizes from '../assets/Sizes'
import { useFonts } from 'expo-font'
import Button from '../Components/Button'
import Lines from '../Components/Lines'
import { useNavigation } from '@react-navigation/native'
import OpenAI from "openai";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { HOST } from '@env';
type NavigationProps = {
    navigation: any,
    onPress: () => void
}


// Access your HOST variable
console.log(HOST);

export default function WelcomeScreenOne(props: NavigationProps) {

    const [flightNumber, setFlightNumber] = useState(0);
    const [name, setName] = useState('');
  const getInfo = async () => {
    
    
    

  };


  async function main() {
    console.log("Sending request...");
    try {
        const normalResponse = await fetch(`http://${HOST}:8000/getOpenaiJSON`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: text}), 
        });
        const normalData = await normalResponse.json();
        console.log(normalData);
        const parsedData = normalData;
      // console.log(parsedData.message.content)
      const json = JSON.parse(parsedData["response"]);
      console.log(json)

      const date = json["date"];
      const origin = json["origin"];
      const destination = json["destination"];
    
    const response = await fetch(`http://${HOST}:8001/flights?date=${date}&origin=${origin}&destination=${destination}`);
    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
      // console.log(data[i].departureTime, json["departureTime"])
      if (data[i].departureTime === json["departureTime"]) {
        console.log(data[i].flightNumber)
        setFlightNumber(data[i].flightNumber);
        setTimeout(() => {

            // pass in `AA${flightNumber}` as a prop
            props.navigation.navigate('HomeScreen', {flightNumber: `AA${data[i].flightNumber}`, name: name}) 
            }
            , 2000);
        break;
      }
    }
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return undefined;
    }
}


  const [text, setText] = useState('');

    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat.ttf'),
        MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
    })

    if(!loaded) {
        return null;
    }

  return (
    <View style={styles.container}>

       <View style={styles.inputContainer}> 
      {flightNumber === 0 ? <Text style={styles.textSecondary}>Loading...</Text> : 
                            <Text style={styles.textMain}>AA{flightNumber}</Text>
        }
        <TextInput style={styles.textinput} placeholder="Enter your name" onChangeText={name_text => setName(name_text)} defaultValue={name} />
      <TextInput style={styles.textinput} placeholder="Enter your flight details or number" onChangeText={flight_text => setText(flight_text)} defaultValue={text} />
      </View>
      
      <StatusBar style="auto" />
    
        {/* <Text style={styles.textMain}>Enjoy Your Trip</Text>
        <Text style={styles.textSecondary}>Easy discovering new places and share those between your friends!</Text> */}
        
        <View style={styles.pictureContainer}>
            <Image style={styles.picture} source={require("../Images/plane.png")} />
        </View>
        
        <Text style={styles.textMain}>Connect Mid-Flight</Text>
        <Text style={styles.textSecondary}>Forge connections in the clouds, tap into smart support, and seamlessly communicate with companions.</Text>

        <Lines colorOne={`${colors.gray}`} colorTwo={`${colors.red}`}/>

        <Button 
            onPress={() => {
            console.log("Pressed!");
            main();
            }}
            name="Take me away!"
        />




    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-end',

    },
    textMain:{
        fontFamily: 'MontserratBold',
        fontSize: sizes.headerSize,
        color: colors.main,
        alignSelf: 'center',
        marginBottom: 18,
    },
    textSecondary:{
        fontFamily: 'MontserratBold',
        fontWeight: '700',
        fontSize: sizes.paragraphSize,
        color: colors.secondary,
        textAlign: 'center',
        marginHorizontal: 45,
        marginBottom: 45,
    },
    pictureContainer:{
        position: 'absolute',
        top: 60,
        width: '100%',
        justifyContent: 'center',
    },
    picture:{
        width: '97%',
        height: 200,
        alignSelf: 'center',
        // move the image down
        marginTop: 25,
    },
    header: {
        fontWeight: "bold",
        marginBottom: 20,
        fontSize: 36,
    },
    textinput: {
        height: 40,
        width: 240,
        borderColor: "gray",
        borderWidth: 1,
        alignSelf:'center',
    },
    inputContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 230,
    },
})