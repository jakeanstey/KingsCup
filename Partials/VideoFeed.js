import React from 'react';
import { 
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import NeverHaveIEverLives from './NeverHaveIEverLives';

export default function VideoFeed({ username, stream, onClick, style, width, height, peerID, neverHaveIEverLives }) {

    return (
        <TouchableOpacity onPress={() => onClick(peerID, username)} activeOpacity={1}>
            <View style={{...style, ...styles.videoView}}>
                <RTCView streamURL={stream.toURL()} style={{...styles.video, width: width, height: height}} mirror={true} />
                <Text style={styles.username} numberOfLines={1}>{username}</Text>
                { neverHaveIEverLives !== null &&
                <NeverHaveIEverLives lives={neverHaveIEverLives} style={styles.neverHaveIEverLives} />
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

    }
});