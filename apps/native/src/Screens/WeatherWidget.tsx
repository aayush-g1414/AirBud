import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { HOST } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WeatherWidget = (props) => {
  const [weather, setWeather] = useState(null);
  const [temp, setTemp] = useState(null);
  const [precip, setPrecip] = useState(null);
  const { latitude, longitude } = props;

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async (key, setter) => {
    try {
      if (key === 'weatherData') {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setter(JSON.parse(value));
        }
      } else { 
        const value = (await AsyncStorage.getItem(key) as GLfloat);
        if (value !== null) {
          setter(value);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (latitude === undefined || longitude === undefined) {
          loadData('temp', setTemp)
        loadData('precip', setPrecip)
        loadData('weatherData', setWeather)
        
        } else {


        const response = await fetch(`http://${HOST}:8000/getDestWeatherData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude, longitude }), // Pass latitude and longitude as props
        });
  
        const weatherData = await response.json();
        console.log(weatherData);
        console.log(typeof weatherData.hourly.temperature_2m[0])
        saveData('weatherData', weatherData.toString());
        saveData('temp', weatherData.hourly.temperature_2m[0].toString());
        saveData('precip', weatherData.hourly.precipitation[0].toString());
        setWeather(weatherData);
        setTemp(weatherData.hourly.temperature_2m[0])
        setPrecip(weatherData.hourly.precipitation[0])
      }

      } catch (error) {
        //console.error(error);
      }
    };
  
    fetchWeather();
  }, [latitude, longitude]); // Make sure to include latitude and longitude in the dependency array
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Weather Update</Text>
      </View>
      {weather ? (
        <View style={styles.content}>
          <View style={styles.temperatureSection}>
            <Text style={styles.temperatureText}>{temp}°C</Text>
            <Text style={styles.weatherDescription}>{precip} mm precipitation</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 15,
    margin: 10,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  temperatureSection: {
    alignItems: 'flex-start',
  },
  temperatureText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5733', // A vibrant color for the temperature
  },
  weatherDescription: {
    fontSize: 16,
    color: '#555555',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WeatherWidget;
