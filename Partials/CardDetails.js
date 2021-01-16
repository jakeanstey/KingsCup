import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import cards from '../Images/cards';

export default function CardDetails({ card, name, details }) {
    const [cardImage, setCardImage] = useState(null);

    useEffect(() =>
    {
        setCardImage(cards[card].uri);
    }, []);

    return (
        <View style={styles.cardSection}>
            <Image style={styles.card} source={cardImage} />
            <View style={styles.cardDetails}>
                <Text style={styles.cardHeader}>{name}</Text>
                <Text>{details}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardSection: {
        display: 'flex',
        flexDirection: 'row',
        width: '70%',
        marginTop: 5
    },
    card: {
        width: 80,
        height: undefined,
        aspectRatio: 691/1056
    },
    cardDetails: {
        flexGrow: 1,
        paddingLeft: 10
    },
    cardHeader: {
        fontWeight: 'bold',
        marginBottom: 2
    }
})
