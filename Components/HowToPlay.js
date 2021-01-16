import React from 'react'
import { 
    ScrollView,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import CardDetails from '../Partials/CardDetails';

export default function HowToPlay() {
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
                <Text style={styles.heading}>Game Objective</Text>
                <View style={styles.paragraph}>
                    <Text>The objective is to pull cards from the deck, until all four (4) Kings are pulled. The player who gets dealt the last King must finish their drink, and the game is over.</Text>
                </View>
                <Text style={styles.heading}>Dealing the cards</Text>
                <View style={styles.paragraph}>
                    <Text>There is only one deck of cards per game. The cards are shuffled, and dealt by the server. The turns may not follow the same order as the order of players on your screen.</Text>
                </View>
                <Text style={styles.heading}>Card Actions</Text>
                <View style={styles.paragraph}>
                    <Text style={{marginBottom: 10}}>Each card face has an action associated with it. Some cards may benefit you, some cards may not.</Text>
                    <CardDetails card="AH" name="Ace" details="Everyone votes on a player they want to drink. The player with the most votes drinks." />
                    <CardDetails card="2H" name="Two" details="Choose someone to drink (tap on their video)." />
                    <CardDetails card="3H" name="Three" details="Three for me, but only drink once." />
                    <CardDetails card="4H" name="Four" details="More. Pick another card." />
                    <CardDetails card="5H" name="Five" details="Guys." />
                    <CardDetails card="6H" name="Six" details="Chicks." />
                    <CardDetails card="7H" name="Seven" details="Last person to tap the screen drinks." />
                    <CardDetails card="8H" name="Eight" details="Date. Choose another player to drink when you have to drink (tap on their video)." />
                    <CardDetails card="9H" name="Nine" details="Rock.Paper.Scissors. Choose someone to fight against. Loser drinks, obviously." />
                    <CardDetails card="10H" name="Ten" details="Categories. Name a category. Taking turns, each player names items that belong in said category. If you cant name an item or get or name an item that doesn't belong, drink. Court of public opinion." />
                    <CardDetails card="JH" name="Jack" details="Never have I ever.. Starts a minigame where each player has three lives. Each turn, the player whose turn it is must truthfully state something they have never done. If any of the other players have done this thing, they must select that they have. First one to 0 lives drinks." />
                    <CardDetails card="QH" name="Queen" details="Question Master. Name speaks for itself. If another player answers one of your questions, they drink." />
                    <CardDetails card="KH" name="King" details="Drink. And if this was the last king in the deck, finish it all." />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 10,
        display: 'flex',
        flexDirection: 'column'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
        marginTop: 10
    },
    paragraph: {
        paddingLeft: 10,
        paddingRight: 10
    }    
});