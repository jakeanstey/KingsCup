import React from 'react';
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';

export default function RockPaperScissors({ style, rockPaperScissorsChosen }) {
    return (
        <View style={{...style, ...styles.wrapper}}>
            <View style={styles.choices}>
                <TouchableOpacity onPress={() => rockPaperScissorsChosen('rock')}>
                    <Text style={styles.choice}>Rock</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rockPaperScissorsChosen('paper')}>
                    <Text style={styles.choice}>Paper</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rockPaperScissorsChosen('scissors')}>
                    <Text style={styles.choice}>Scissors</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    choices: {
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    choice: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingTop: 20,
        paddingBottom: 20
    }
})