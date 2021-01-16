import React, { useEffect, useState } from 'react';
import { 
    View,
    StyleSheet,
    Image
} from 'react-native';
import cards from '../Images/cards';

export default function CardView({ card }) {
    const [imageSource, setImageSource] = useState();

    useEffect(() =>
    {
        if(card !== null)
        {
            let cardName = card.faceName;
            switch (card.suit)
            {
                case 0:
                    cardName += 'H';
                    break;
                case 1:
                    cardName += 'D';
                    break;
                case 2:
                    cardName += 'C';
                    break;
                case 3:
                    cardName += 'S';
                    break;
            }
            setImageSource(cards[cardName].uri);
        }
    }, []); 

    return (
        <View style={styles.wrapper}>
            <Image style={styles.cardImage} source={imageSource} />
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
    cardImage: {
        width: 250,
        height: undefined,
        aspectRatio: 691/1056
    }
});