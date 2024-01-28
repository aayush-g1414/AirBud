import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../assets/Colors';
import getToKnow from '../database/gettingToKnowDatabase';
import { Platform } from 'react-native';

interface ChatEntry {
  question: string;
  answer: string;
}

const questions: string[] = getToKnow.questions;

export default function TourScreenOne() {
    const [chatEntries, setChatEntries] = useState<ChatEntry[]>([
        { question: "So, what are you waiting for? Introduce yourselves!", answer: "Remember, strangers are just friends waiting to happen :)" } // The initial question
      ]);
      const [inputText, setInputText] = useState<string>("");
    

  const addEntry = (answer: string): void => {
    const randomIndex: number = Math.floor(Math.random() * questions.length);
    const newQuestion: string = questions[randomIndex];
    setChatEntries([...chatEntries, { question: newQuestion, answer }]);
  };

  const sendMessage = (): void => {
    if (inputText.trim()) {
      addEntry(inputText);
      setInputText("");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
      <FlatList
        data={chatEntries}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.message}>{item.answer}</Text>
            <Text style={styles.questionText}>{item.question}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
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

// ... styles remain the same

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff', // White background
    },
    questionContainer: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8E8', // Light grey border for subtle separation
      backgroundColor: 'white', // Ensuring the background is white
    },
    questionText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333', // Dark grey for better readability
      marginBottom: 10, // Give some space below the question
    },
    messagesContainer: {
      flex: 1,
      padding: 20, // Padding around the messages for a cleaner look
    },
    message: {
      fontSize: 14,
      lineHeight: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: '#F0F0F0', // Light border for message bubbles
      borderRadius: 15, // Rounded corners for message bubbles
      backgroundColor: '#FAFAFA', // Slightly off-white for the message background
      marginBottom: 10, // Space between messages
      alignSelf: 'flex-start', // Align messages to the start
    },
    inputContainer: {
      borderTopWidth: 1,
      borderTopColor: '#E8E8E8', // Light grey border to separate input area
      padding: 10,
      backgroundColor: 'white', // Ensuring the background is white
      flexDirection: 'row', // Align input and button in a row
      alignItems: 'center', // Center items vertically
    },
    input: {
      flex: 1,
      height: 40,
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: '#E8E8E8', // Light grey border for the input
      borderRadius: 20, // Rounded corners for the input field
      paddingHorizontal: 15, // Inner spacing for text
      backgroundColor: '#FAFAFA', // Slightly off-white for the input background
      fontSize: 14,
      color: '#333', // Dark grey for input text
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
  });
  
