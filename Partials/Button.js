import {
    TouchableOpacity 
} from "react-native";

import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function Button({ text, backgroundColor = 'white', textColor = 'black', onClick, style }) {
const click = () =>
{
    console.log('here');
}

    return (
        <TouchableOpacity style={{ ...style, ...styles.button, backgroundColor: backgroundColor }} onPress={onClick}>
            <Text style={{...styles.text, color: textColor}}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '80%',
        height: 48,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1
    },
    text: {
        fontSize: 30
    }
});