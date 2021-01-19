import React, { useEffect, useState, useRef } from 'react'
import { 
    View,
    Text,
    StyleSheet
} from 'react-native'

export default function CategoriesTimer() {
    const [countdown, setCountdown] = useState(0.0);
    const timeoutRef = useRef();

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
                // cancel
            }
            else
            {
                setCountdown(((targetDate - currentTime) / 1000.0).toFixed(1));
                updateTime(targetDate);
            }
        }, 100);
    }

    return (
        <View style={styles.timerWrapper}>
            <Text style={styles.timer}>{countdown}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    timerWrapper: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timer: {
        fontSize: 22,
        padding: 10,
        backgroundColor: '#ffffff55'
    }
})
