import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import colors from '../assets/Colors'
import sizes from '../assets/Sizes'
import { useFonts } from 'expo-font'
import Button from '../Components/Button'
import Lines from '../Components/Lines'
import { useNavigation } from '@react-navigation/native'

type NavigationProps = {
    navigation: any,
    onPress: () => void
}

export default function WelcomeScreenOne(props: NavigationProps) {

    const navigation = useNavigation();
    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-SemiBold.ttf'),
        MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
    })

    if(!loaded) {
        return null;
    }

  return (
    <View style={styles.container}>

        <Text style={styles.textTitle}>Airbud</Text>

        <View style={styles.pictureContainer}>
            <Image style={styles.picture} source={require("../Images/airbud_logo.png")} />
        </View>        

        <Text style={styles.textMain}>Elevate Your Journey</Text>
        <Text style={styles.textSecondary}>Turn strangers into friends, seek AI assistance, and message others you can't quite reach.</Text>

        <Lines colorOne={`${colors.red}`} colorTwo={`${colors.gray}`}/>

        <Button name="Next" onPress={ () => props.navigation.navigate('WelcomeScreenTwo')} />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-end',
    },
    textTitle:{
        fontFamily: 'Montserrat-Bold',
        fontWeight: '700',
        fontSize: sizes.bellSize,
        color: colors.main,
        alignSelf: 'center',
        marginTop: 50,
    },
    textMain:{
        fontFamily: 'Montserrat-SemiBold',
        fontWeight: '700',
        fontSize: sizes.headerSize,
        color: colors.main,
        alignSelf: 'center',
        marginBottom: 18,
    },
    textSecondary:{
        fontFamily: 'Montserrat-SemiBold',
        fontWeight: '700',
        fontSize: sizes.paragraphSize,
        color: colors.secondary,
        textAlign: 'center',
        marginHorizontal: 45,
        marginBottom: 45,
    },
    pictureContainer:{
        position: 'absolute',
        top: 24,
        width: '100%',
        justifyContent: 'center',
    },
    picture:{
        width: '100%',
        height: 280,
        alignSelf: 'center',
        marginTop: 170,
    },
    // image: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     // push to the back
    //     zIndex: -1,
    //     opacity: 0.55,
    //     // make the image longer
    //     height: '100%',
    //   },
})