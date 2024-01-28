import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TextInput, FlatList, Text, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
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
          <MaterialCommunityIcons name="send-circle" size={32} color={colors.blue} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#eeeded',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 10,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  name: {
    fontWeight: '600',
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eeeded',
  },
});