import React, { useEffect } from 'react'
import { 
    View,
    StyleSheet,
    Vibration,
    Text,
    Platform
} from 'react-native'

export default function DrinkView({ reason }) {
    useEffect(() =>
    {
        console.log('vibrating');
        if(Platform.OS == "android")
        {
            Vibration.vibrate(1000);
        }
        else
        {
            Vibration.vibrate([0,0], false);
        }
    }, []);

    return (
        <View style={styles.wrapper}>
            <View style={styles.box}>
                <Text style={styles.message}>{reason}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff88',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10
    },
    message: {
        fontSize: 30
    }
});