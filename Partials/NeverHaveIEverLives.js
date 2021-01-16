import React, { useState, useEffect } from 'react';
import { 
    View,
    StyleSheet
} from 'react-native';

export default function NeverHaveIEverLives({ style, lives }) {
    const [lifeArray, setLifeArray] = useState(null);
    useEffect(() =>
    {
        let result = [];
        for(var i = 0; i < lives; i++)
        {
            result.push(i);
        }
        setLifeArray(result);
    }, [lives]);

    return (
        <View style={{...style, ...styles.wrapper}}>
            { lifeArray !== null && 
            lifeArray.map(life =>
                {
                    return <View style={styles.life} key={life} />
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    life: {
        backgroundColor: 'white',
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 5
    }
});