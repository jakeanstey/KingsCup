import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

export default function PlayersList({ players = [], playerClicked, cancel }) {
    return (
        <View style={styles.wrapper}>
            { players.length > 0 &&
            players.map(player =>
                {
                    return (
                        <TouchableOpacity key={player.peerID} activeOpacity={1} onPress={() => playerClicked(player)}>
                            <View style={styles.listItem}>
                                <Text style={styles.listItemText} numberOfLines={1}>{player.username}</Text>
                            </View>
                        </TouchableOpacity>                    
                    )
                })
            }
            <TouchableOpacity activeOpacity={1} onPress={cancel}>
                <View style={{...styles.listItem, backgroundColor: '#00293F'}}>
                    <Text style={{...styles.listItemText, color: 'white'}}>Cancel</Text>
                </View>
            </TouchableOpacity>
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
        backgroundColor: "#FFFFFF55",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItem: {
        padding: 5,
        textAlign: 'center',
        width: 250,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        marginTop: 5
    },
    listItemText: {
        fontSize: 22,
        alignSelf: 'center'
    }
});