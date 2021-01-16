import React from 'react';
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';

export default function PickCardView({ pickCard }) {
    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={pickCard}>
                <View style={styles.box}>
                    <Text style={styles.pickCard}>Pick a Card</Text>
                </View>
            </TouchableOpacity>
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
    pickCard: {
        fontSize: 30,
        padding: 20,
    }
});