import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

export default function CategoriesTimerWithButton({ next, lost }) {
    const [countdown, setCountdown] = useState(0.0);
    const timeoutRef = useRef(null);

    useEffect(() =>
    {
        var date = new Date();
        date.setSeconds(date.getSeconds() + 6);

        updateTime(date);

        return () => clearTimeout(timeoutRef.current);
    }, []);

    const updateTime = (targetDate) =>
    {
        timeoutRef.current = setTimeout(() =>
        {
            const currentTime = new Date();
            if(currentTime >= targetDate)
            {
                setCountdown("0.0");
                lost();
            }
            else
            {
                setCountdown(((targetDate - currentTime) / 1000.0).toFixed(1));
                updateTime(targetDate);
            }
        }, 100);
    }

    const nextClicked = () =>
    {
        next();
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={styles.header}>Categories: Name An Item</Text>
                <Text style={styles.timer}>{countdown}</Text>
                <TouchableOpacity style={{width: '100%', marginTop: 20}} activeOpacity={1} onPress={nextClicked}>
                    <Text style={styles.button}>NEXT</Text>
                </TouchableOpacity>
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
        backgroundColor: '#ffffff55',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: '80%',
        borderColor: 'black',
        borderRadius: 10,
        borderWidth: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20
    },
    timer: {
        fontSize: 40
    },
    button: {
        backgroundColor: 'blue',
        color: 'white',
        padding: 10,
        width: '100%',
        textAlign: 'center',
        fontSize: 30
    },
    header: {
        fontSize: 25,
        marginBottom: 10
    }
})
