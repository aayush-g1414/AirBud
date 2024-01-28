import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import sizes from '../assets/Sizes'
import colors from '../assets/Colors'
import { useFonts } from 'expo-font'

type NameProps = {
    name: string,
    onPress: () => void
}

export default function WelcomeText(props: NameProps) {
const [loaded] = useFonts({
  MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
})

    if(!loaded){
    return null;
}

  return (
    <View style={styles.textWrapper}>
        

        <TouchableOpacity onPress={props.onPress}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={sizes.bellSize}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.textWelcome}>Hi, {props.name}👋</Text>
          <Text style={styles.textTravel}>Happy Flying!</Text>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
    textWelcome:{
        fontFamily: 'MontserratBold',
        fontWeight: '700',
        fontSize: sizes.welcomeText,
        color: colors.secondary,
      },
      textTravel:{
        fontFamily: 'MontserratBold',
        fontWeight: '700',
        fontSize: sizes.buttonTextSize,
      },
      textWrapper:{
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 35,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 42,
      },
})