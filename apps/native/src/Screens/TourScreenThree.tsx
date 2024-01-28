import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import io from "socket.io-client";
import { HOST } from '@env';

const { height, width } = Dimensions.get('window');

// Assuming socket is initialized in a separate module and imported here
const socket = io(`http://${HOST}:8000`);

export default function TourScreenOne() {
    // Drawing state
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [isDrawing, setIsDrawing] = useState(true); // Track if it's drawing time

    // Chat state
    const [guess, setGuess] = useState('');
    const [inputText, setInputText] = useState('');
    const [chatEntries, setChatEntries] = useState([]);

    // Timer state

  const [isClearButtonClicked, setClearButtonClicked] = useState(false);
    const [timer, setTimer] = useState(20);

    useEffect(() => {
        // Listen for the end of drawing phase
        socket.on("drawing_complete", () => {
            setIsDrawing(false);
            startGuessingTimer();
        });

        // Listen for guesses
        socket.on("receive_guess", (data) => {
            setGuess(data.guess);
            addChatEntry(data.guess);
        });

        return () => {
            socket.off("drawing_complete");
            socket.off("receive_guess");
        };
    }, [socket]);

    const onTouchEnd = () => {
        paths.push(currentPath);
        setCurrentPath([]);
        setClearButtonClicked(false);
      };
    
      const onTouchMove = (event) => {
        const newPath = [...currentPath];
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        console.log(locationX)
        console.log(locationY)
        const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
        newPath.push(newPoint);
        setCurrentPath(newPath);
      };
    
      const handleClearButtonClick = () => {
        setPaths([]);
        setCurrentPath([]);
        setClearButtonClicked(true);
      };

    const startGuessingTimer = () => {
        setTimer(20);
        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 1) {
                    clearInterval(interval);
                    setIsDrawing(true); // Reset for the next round
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    const addChatEntry = (text) => {
        setChatEntries(prevEntries => [...prevEntries, text]);
    };

    const handleGuessSubmit = () => {
        socket.emit("send_guess", { guess: inputText });
        setInputText('');
    };

    const renderDrawingArea = () => (
        <View style={styles.container}>
      <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <Svg height={height * 0.7} width={width}>
          <Path
            d={paths.join('')}
            stroke={isClearButtonClicked ? 'transparent' : 'red'}
            fill={'transparent'}
            strokeWidth={3}
            strokeLinejoin={'round'}
            strokeLinecap={'round'}
          />
          {paths.length > 0 &&
            paths.map((item, index) => (
              <Path
                key={`path-${index}`}
                d={currentPath.join('')}
                stroke={isClearButtonClicked ? 'transparent' : 'red'}
                fill={'transparent'}
                strokeWidth={2}
                strokeLinejoin={'round'}
                strokeLinecap={'round'}
              />
            ))}
        </Svg>
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={handleClearButtonClick}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    </View>
    );

    const renderChatArea = () => (
        <View style={styles.chatArea}>
            <FlatList
                data={chatEntries}
                renderItem={({ item }) => <Text style={styles.chatEntry}>{item}</Text>}
                keyExtractor={(item, index) => index.toString()}
            />
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Guess here..."
                onSubmitEditing={handleGuessSubmit}
            />
            <TouchableOpacity onPress={handleGuessSubmit} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {isDrawing ? renderDrawingArea() : renderChatArea()}
            <Text style={styles.timerText}>{timer}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawingArea: {
        flex: 7,
        borderColor: 'black',
        borderWidth: 1,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatArea: {
        flex: 3,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '80%',
        padding: 10,
        marginBottom: 10,
    },
    sendButton: {
        backgroundColor: 'blue',
        padding: 10,
    },
    sendButtonText: {
        color: 'white',
    },
    timerText: {
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        top: 10,
    },
    chatEntry: {
        padding: 10,
        backgroundColor: 'lightgray',
        marginBottom: 10,
    },

});