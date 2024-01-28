import React, { useState, useEffect } from 'react';
import { SafeAreaView, Image, StyleSheet, TextInput, FlatList, Text, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../assets/Colors';
import { Platform } from 'react-native';
import socketIOClient from "socket.io-client";
import io from "socket.io-client";

import { HOST } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Chat {
  name: string;
  message: string;
}

const socket = io(`http://${HOST}:8000`); // Moved outside of the component for persistent connection

export default function InFlightChatScreen() {
    const [chat, setChat] = useState<Chat[]>([]); // Chat entries stored
    const [input, setInput] = useState<string>(""); // Message input
  
    useEffect(() => {
      if (socket) {
        const handleChatMessageReceive = (data) => {
          // Using a callback to ensure we get the most current state
          setChat((currentChat) => [...currentChat, data]);
        };
    
        socket.on("chat_message_receive", handleChatMessageReceive);
    
        // Cleanup function to remove the event listener when the component unmounts
        return () => {
          socket.off("chat_message_receive", handleChatMessageReceive);
        };
      }
    }, [socket]); // Dependency array should ideally contain only stable values


  
    const sendMessage = (): void => {
      if (input.trim()) {
        // Emit a chat_message combined with sender's name
        // async function getName() {
        // const value = await AsyncStorage.getItem(key);
        // return value;
        // }
      
        socket.emit("chat_message", { name: "anonymous", message: input });
        setInput("");
      }
    };

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <FlatList
        data={chat}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message here..."
          onSubmitEditing={sendMessage} // Allow sending message with the return key
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
    backgroundColor: colors.background, // Use airline brand color or any suitable color
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    marginTop: 30, // Add space at the bottom so the input field doesn't overlap
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#cccccc',
    borderTopWidth: 1,
    backgroundColor: 'white', // Improved visibility for input area
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9', // Light background for input field
    borderRadius: 20, // Rounded corners for input field
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#dddddd', // Subtle border for input field
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
    color: colors.blue, // Brand text color or any contrasting color
    marginBottom: 4, // Spacing between name and message
  },
  message: {
    marginBottom: 5,
    padding: 10,
    borderRadius: 15,
    backgroundColor: colors.blue, // Secondary color for message bubbles
    color: 'white', // Text color inside the message bubble
    maxWidth: '80%', // For better bubble alignment
    alignSelf: 'flex-end', // Align your messages to the right
  },
});
