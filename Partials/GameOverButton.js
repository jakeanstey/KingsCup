import React from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native'

export default function GameOverButton({ onClick }) {
    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.container} onPress={onClick}>
                <Text style={styles.text}>Leave Game</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        right: 0,
        bottom: 100,
    },
    container: {        
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    text: {
        color: 'white'
    }
});