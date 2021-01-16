import React, { useState } from 'react'
import { 
    View,
    StyleSheet, 
    TouchableOpacity,
    Text
} from 'react-native'

export default function NeverHaveIEver({ callback }) {
    const [width, setWidth] = useState(0);

    const onLayout = (e) =>
    {
        const { x, y, width, height } = e.nativeEvent.layout;
        setWidth(width);
    }

    return (
        <View style={styles.wrapper} onLayout={onLayout}>
            <TouchableOpacity onPress={() => callback(true)}>
                <View style={{...styles.iHave, width: width / 2}}>
                    <Text style={styles.buttonLabel}>I Have</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => callback(false)}>
                <View style={{...styles.iHavent, width: width / 2}}>
                    <Text style={styles.buttonLabel}>I Haven't</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        left: 0,
        right: 0,
        bottom: 80,
        height: 40,
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center'
    },
    iHave: {
        height: 40,
        backgroundColor: '#00293F',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iHavent: {
        height: 40,
        backgroundColor: '#0086CF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonLabel: {
        color: 'white'
    }
});