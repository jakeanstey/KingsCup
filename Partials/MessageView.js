import React from 'react';import { 
    View,
    StyleSheet,
    Text
} from 'react-native';

export default function MessageView({ message }) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.box}>
                <Text style={styles.message}>{message}</Text>
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
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10
    },
    message: {
        fontSize: 30,
        padding: 20,
    }
});