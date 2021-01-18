import React, { useState, useEffect } from 'react';
import { 
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import NeverHaveIEverLives from './NeverHaveIEverLives';
import cards from '../Images/cards';

export default function VideoFeed({ username, stream, onClick, style, width, height, peerID, neverHaveIEverLives, lowestCard }) {

    const [cardSource, setCardSource] = useState(null);

    useEffect(() =>
    {
        if(lowestCard !== null)
        {
            let cardName = lowestCard.faceName;
            switch (lowestCard.suit)
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
            console.log(cardName);
            setCardSource(cards[cardName].uri);
        }
        else
        {
            setCardSource(null);
        }
    }, [lowestCard]);

    return (
        <TouchableOpacity onPress={() => onClick(peerID, username)} activeOpacity={1}>
            <View style={{...style, ...styles.videoView}}>
                <RTCView streamURL={stream.toURL()} style={{...styles.video, width: width, height: height}} mirror={true} />
                <Text style={styles.username} numberOfLines={1}>{username}</Text>
                { neverHaveIEverLives !== null &&
                <NeverHaveIEverLives lives={neverHaveIEverLives} style={styles.neverHaveIEverLives} />
                }
                { cardSource !== null && 
                <View style={styles.cardWrapper}>
                    <Image source={cardSource} style={styles.card} />
                </View>
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    videoView: {
        position: 'relative',
        backgroundColor: 'black',
    },
    video: {
    },
    username: {
        position: 'absolute',
        color: 'black',
        left: 5,
        top: 10,
        right: 5,
        backgroundColor: '#ffffff88',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2,
        overflow: 'hidden',
    },
    neverHaveIEverLives: {
        position: 'absolute',
        top: 10,
        right: 0,

    },
    cardWrapper: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    card: {
        height: '80%',
        width: undefined,
        aspectRatio: 691/1056
    }
});