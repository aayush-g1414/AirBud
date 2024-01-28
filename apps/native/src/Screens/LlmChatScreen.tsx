import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../assets/Colors';
import axios from 'axios';
import { HOST } from '@env';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function InFlightChatScreen() {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  // Load user and flight information from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      setName((await AsyncStorage.getItem('name')) || "Anonymous");
      setFlightNumber((await AsyncStorage.getItem('flightNumber')) || "");
      setLatitude((await AsyncStorage.getItem('latitude')) || "");
      setLongitude((await AsyncStorage.getItem('longitude')) || "");
      setArrivalTime((await AsyncStorage.getItem('arrivalTime')) || "");
    };
    
    loadData();

    
  }, []);

  // A function to send the message. It includes necessary flight details.
  const sendMessage = async () => {
    if (input.trim()) {
      setChat((currentChat) => [...currentChat, { name: "anonymous", message: input }]);
      setInput("");
      const messageData = {
        message: input,
        flight_number: flightNumber,
        destination: `${latitude}, ${longitude}`,
        arrival_time: arrivalTime,
        // Assumes destination_city is either part of your stored data or determinable from latitude and longitude
        destination_city: ""
      };

      try {
        // Replace the URL with the endpoint you've set up to handle POST requests
        const response = await axios.post(`http://${HOST}:8000/query`, messageData);
        // console.log(typeof response)
        // console.log(response);
        // console.log(response.data);
        // console.log(response.data.response);
        if (response.data.response === undefined) {
          setChat((currentChat) => [...currentChat, { name: "AI", message: response.data.toString() }]);
        }
        else {
        setChat((currentChat) => [...currentChat, { name: "AI", message: response.data.response.toString() }]);
        }
      } catch (error) {
        // console.error('Error sending message:', error);
      }

      // Emit through the socket for real-time communication
      
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <FlatList
        data={chat}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        style={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message here..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Image source={require("../Images/aa_sendbutton.png")} style={styles.sendButtonImage} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
    marginTop: 30, // Add space at the bottom so the input field doesn't overlap

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#eeeeee',
    borderTopWidth: 1
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 10
  },
  sendButton: {
    marginLeft: 10, // Add space between the input field and the send button
    marginRight: 10, // Add space on the right side if needed
  },
  sendButtonImage: {
    width: 80, // Set the width of the button
    height: 80, // Set the height of the button
    resizeMode: 'contain', // Ensure the image is scaled correctly
  },
  name: {
    fontWeight: 'bold',
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eeeeee'
  },
});