import React from 'react'
import { 
    View,
    StyleSheet,
    Text,
    Button
} from 'react-native'

export default function Disclaimer({confirm}) {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.header}>Disclaimer</Text>
            <Text style={styles.paragraph}>
                You are responsible for any item consumed, and any quantity of consumption of anything while using this app. We bear no responsibility for any injuries or accidents, or any other incident while you are using this app. We are not responsible for what is shown in any video feed, or what is broadcasted through communications with other users in any form. This app requires a data connection, be aware of your usage and billing where applicable. We are not responsible for data overages or other charges incurred while you use this app. Use at your own discretion and play attention to your surroundings.
            </Text>
            <Button onPress={confirm} title="I Understand" />
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
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        backgroundColor: 'white'
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10
    },
    paragraph: {
    },
})