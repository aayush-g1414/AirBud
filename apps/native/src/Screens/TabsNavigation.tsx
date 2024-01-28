import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigation from './AuthNavigation';
import HomeScreen from './HomeScreen';
import LlmChatScreen from './LlmChatScreen';
import InFlightChatScreen from './InFlightChatScreen';
import { DefaultTheme } from '@react-navigation/native';
import colors from '../assets/Colors';
import AuthStackScreen from './AuthStackScreen';
import AppStackScreen from './AppStackScreen';
import React, { useState, useEffect } from 'react';
import WelcomeScreenOne from './WelcomeScreenOne';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

function TabsNavigation() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
          try {
            const userToken = await AsyncStorage.getItem('name');
            console.log(!userToken);
            setIsAuthenticated(!!userToken);
          } catch (e) {
            console.error(e);
          }
        };
    
        checkAuthStatus();
      }, []);

  return (
    <NavigationContainer theme={{
        ...DefaultTheme,
        colors:{
          ...DefaultTheme.colors,
          background: 'transparent',
          notification: colors.greenLight,
          
        },
        
      }}>
    <Tab.Navigator>
    <Tab.Screen name="Welcome" component={AuthNavigation} options={{headerShown: false}} />
    <Tab.Screen name="Home Screen" component={HomeScreen} options={{headerShown: false}} />
        <Tab.Screen name="LlmChatScreen" component={LlmChatScreen} options={{headerShown: false}} />
        <Tab.Screen name="InFlightChatScreen" component={InFlightChatScreen} options={{headerShown: false}} />
    

    </Tab.Navigator>
    </NavigationContainer>
  );
}

export default TabsNavigation;