import React, { useState, useEffect, useRef } from 'react';
import { 
    View ,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    BackHandler,
    Alert,
    Share
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import OptionsMenu from 'react-native-options-menu';
import Toast from 'react-native-simple-toast';
// Singleton
import AppData from '../AppData';
// Images
import micOn from '../Images/mic_on.png';
import micOff from '../Images/mic_off.png';
import copy from '../Images/copy.png';
import moreIcon from '../Images/more.png';
import backButton from '../Images/back_button.png';
import crown from '../Images/crown.png';
import play from '../Images/play.png';
import speakerphoneOn from '../Images/speakerphone_on.png';
import speakerphoneOff from '../Images/speakerphone_off.png';
// Partials
import VideoFeed from '../Partials/VideoFeed';
import PickCardView from '../Partials/PickCardView';
import MessageView from '../Partials/MessageView';
import CardView from '../Partials/CardView';
import EndTurnButton from '../Partials/EndTurnButton';
import DrinkView from '../Partials/DrinkView';
import NeverHaveIEver from '../Partials/NeverHaveIEver';
import RockPaperScissors from '../Partials/RockPaperScissors';
import GameOverButton from '../Partials/GameOverButton';
import HowToPlay from './HowToPlay';
import PlayersList from '../Partials/PlayersList';
import CategoriesTimerWithButton from '../Partials/CategoriesTimerWithButton';

export default function GameRoom() {
    const [stream, setStream] = useState();
    const [streams, _setStreams] = useState([]);
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);
    const [micIcon, setMicIcon] = useState(micOn);
    const [isHost, setIsHost] = useState(AppData.current.isHost);
    const [playPauseSource, setPlayPauseSource] = useState(play);
    const [pickCardVisible, setPickCardVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [card, setCard] = useState(null);
    const [endTurnVisible, setEndTurnVisible] = useState(false);
    const [drinkReason, setDrinkReason] = useState(null);
    const [neverHaveIEverVisible, setNeverHaveIEverVisible] = useState(false);
    const [neverHaveIEverLives, setNeverHaveIEverLives] = useState(null);
    const [rockPaperScissorsVisible, setRockPaperScissorsVisible] = useState(false);
    const [endGameVisible, setEndGameVisible] = useState(false);
    const [helpVisible, setHelpVisible] = useState();
    const [speakerphoneSource, setSpeakerphoneSource] = useState(speakerphoneOn);
    const [videosHeight, setVideosHeight] = useState(0);
    const [playersList, setPlayersList] = useState([]);
    const [lowestCard, setLowestCard] = useState(null);
    const [categoriesStartButtonVisible, setCategoriesStartButtonVisible] = useState(false);
    const [categoryTurn, setCategoriesTurn] = useState(false);

    // any reference from an event must use the ref value
    const streamsRef = useRef(streams);
    const setStreams = streams =>
    {
        streamsRef.current = streams;
        _setStreams(streams);
    }

    const handleBackButton = () =>
    {
        Alert.alert("Leaving game", "Are you sure you would like to leave the game?", [
            { text: "Cancel", onPress: () => null },
            { text: "Yes", onPress: leaveClicked } 
        ])
        return true;
    }

    useEffect(() =>
    {
        setStream(AppData.current.videoStream);
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        AppData.current.on('stream', (peerID, username, otherStream) =>
        {
            setStreams([...streamsRef.current, { peerID, username, stream: otherStream, lives: null, lowestCard: null, categoriesTurn: false }]);
        });
        AppData.current.on('player-disconnected', peerID =>
        {
            setStreams(streamsRef.current.filter(stream => stream.peerID !== peerID));
        });
        AppData.current.on('game-state-changed', playing =>
        {
            if(AppData.current.isHost && playing)
            {
                setPlayPauseSource(null);
            }
        });
        AppData.current.on('my-turn', () =>
        {
            setPickCardVisible(true);
        });
        AppData.current.on('set-player-turn', (peerID, username) =>
        {
            setMessage(username + "'s turn");
        });
        AppData.current.on('card-dealt', (card, username) =>
        {
            setCard(card);
            setTimeout(() =>
            {
                setCard(null);
                AppData.current.actionCard(card, username);
            }, 3 * 1000);
        });
        AppData.current.on('message', message =>
        {
            setMessage(message);
        });
        AppData.current.on('turn-over', () =>
        {
            setEndTurnVisible(true);
        });
        AppData.current.on('drink', reason =>
        {
            setDrinkReason(reason);
        });
        AppData.current.on('never-have-i-ever', myTurn =>
        {
            setEndTurnVisible(false);
            if(myTurn)
            {
                setNeverHaveIEverVisible(false);
            }
            else
            {
                setNeverHaveIEverVisible(true);
            }
        });
        AppData.current.on('never-have-i-ever-ended', () =>
        {
            setNeverHaveIEverVisible(false);
            setNeverHaveIEverLives(null);
            setStreams(streamsRef.current.map(stream =>
                {
                    stream.lives = null;
                    return stream;
                }))
            if(AppData.current.myTurn)
            {
                setEndTurnVisible(true);
            }
        });
        AppData.current.on('start-never-have-i-ever', () =>
        {
            setNeverHaveIEverLives(3);
            setStreams(streamsRef.current.map(stream => 
            {
                stream.lives = 3;
                return stream;
            }));
        });
        AppData.current.on('never-have-i-ever-lives-changed', (peerID, lives) =>
        {
            setStreams(streamsRef.current.map(stream =>
            {
                if(stream.peerID === peerID)
                {
                    stream.lives = lives;
                }

                return stream
            }));
        });
        AppData.current.on('rock-paper-scissors', () =>
        {
            setRockPaperScissorsVisible(true);
        });
        AppData.current.on('game-over', () =>
        {
            setEndGameVisible(true);
        });
        AppData.current.on('lowest-card', (cards, callback) =>
        {
            setLowestCard(cards.find(card => card.peerID === AppData.current.peerID).card);
            setStreams(streamsRef.current.map(stream => 
            {
                stream.lowestCard = cards.find(card => card.peerID === stream.peerID).card;
                return stream;
            }));

            setTimeout(() =>
            {
                setLowestCard(null);
                setStreams(streamsRef.current.map(stream =>
                {
                    stream.lowestCard = null;
                    return stream;
                }));
                callback();
            }, 3 * 1000);
        });
        AppData.current.on('start-categories', () =>
        {
            // set the start button to visible
            setCategoriesStartButtonVisible(true);
        });
        AppData.current.on('categories-my-turn', () =>
        {
            setStreams(streamsRef.current.map(stream =>
            {
                stream.categoriesTurn = false;
                return stream;
            }));
            setCategoriesTurn(true);
        });
        AppData.current.on('categories-turn', peerID =>
        {
            if(peerID !== null)
            {
                setMessage(null);
            }
            setCategoriesTurn(false);
            setStreams(streamsRef.current.map(stream =>
            {
                stream.categoriesTurn = peerID === stream.peerID;
                return stream;
            }));
        });

        return function cleanup()
        {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
            AppData.current.clearAllEventCallbacks();
        }
    }, [])

    useEffect(() =>
    {
        if(message !== null)
        {
            setTimeout(() => setMessage(null), 3 * 1000);
        }
    }, [message]);

    useEffect(() =>
    {
        if(drinkReason !== null)
        {
            setTimeout(() => 
            {
                setDrinkReason(null);
                AppData.current.notifyDates();
            }, 3 * 1000);
        }
    }, [drinkReason])

    const gotDimensions = (e) =>
    {
        const { width, height } = e.nativeEvent.layout;
        const usableHeight = height - 40;
        setVideosHeight(usableHeight);
        setVideoWidth(width / 2);
        setVideoHeight((usableHeight) / 3);
    }

    const toggleMute = () =>
    {
        AppData.current.toggleMute();

        if(AppData.current.muted)
        {
            setMicIcon(micOff);
        }
        else
        {
            setMicIcon(micOn);
        }
    }

    const copyRoomCode = async () =>
    {
        Clipboard.setString(AppData.current.roomCode);
        Toast.showWithGravity("Copied!", Toast.SHORT, Toast.TOP);
        await Share.share({
            title: "Join King's Cup Game",
            message: "Join my King's Cup Game: https://www.kingssolocup.com/joinroom/" + AppData.current.roomCode
        });
    }

    const playPause = () =>
    {
        AppData.current.playPause();
    }

    const pickCard = () =>
    {
        AppData.current.pickCard();
        setPickCardVisible(false);
    }

    const playerClicked = (peerID, username) =>
    {
        AppData.current.playerClicked(peerID, username);
    }

    const endTurn = () =>
    {
        AppData.current.endTurn();
        setEndTurnVisible(false);
        setNeverHaveIEverLives(null);
        setNeverHaveIEverVisible(false);
        setStreams(streamsRef.current.filter(stream => {
            stream.lives = null;
            return stream;
        }))
    }

    const neverHaveIEver = (iHave) =>
    {
        setNeverHaveIEverVisible(false);
        if(iHave)
        {
            setNeverHaveIEverLives(neverHaveIEverLives - 1);
        }
        AppData.current.neverHaveIEver(iHave);
    }

    const rockPaperScissorsChosen = (choice) =>
    {
        AppData.current.chooseRockPaperScisors(choice);
        setRockPaperScissorsVisible(false);
    }

    const helpClicked = () =>
    {
        setHelpVisible(true);
    }
    
    const leaveClicked = () =>
    {
        AppData.current.disconnectAndEndGame()
    }

    const closeHelp = () =>
    {
        setHelpVisible(false);
    }

    const toggleSpeakerphone = () =>
    {
        const state = AppData.current.toggleSpeakerphone();
        setSpeakerphoneSource(state ? speakerphoneOn : speakerphoneOff);
    }

    const kickPlayerClicked = () =>
    {
        AppData.current.socket.emit('get-current-players', (players) =>
        {
            players = JSON.parse(players);
            players = players.filter(player => player.peerID !== AppData.current.peerID);
            if(players.length === 0)
            {
                Toast.show("No players to kick", Toast.SHORT);
            }
            else
            {
                setPlayersList(players);
            }            
        });
    }

    const playerListItemClicked = (player) =>
    {
        // TODO: process selection type for scalability, if the need to re-use the control arises
        AppData.current.socket.emit('kick-player', player.peerID);
        cancelPlayerSelection();
    }
    
    const cancelPlayerSelection = () =>
    {
        setPlayersList([]);
    }

    const categoriesNext = () =>
    {
        AppData.current.socket.emit('categories-next');
        setCategoriesTurn(false);
    }

    const categoriesLost = () =>
    {
        AppData.current.socket.emit('categories-lost', AppData.current.peerID, AppData.current.username);
        setCategoriesTurn(false);
    }

    const startCategories = () =>
    {
        setMessage(null);
        setCategoriesStartButtonVisible(false);
        AppData.current.socket.emit('start-categories');
    }

    return (
        <View style={styles.wrapper} onLayout={gotDimensions}>
            <View style={styles.statusBar}>
                { isHost && 
                <OptionsMenu button={crown} buttonStyle={styles.crown}
                options={["Kick Player", "Cancel"]} 
                actions={[kickPlayerClicked, () => {}]}
                destructiveIndex={1} />
                }
                <View style={styles.roomCodeGroup}>
                    <Text style={styles.roomCode}>Code: {AppData.current.roomCode.toUpperCase()}</Text>
                    <TouchableOpacity onPress={copyRoomCode}>
                        <Image source={copy} style={styles.copy} />
                    </TouchableOpacity>
                </View>
                { isHost &&
                <TouchableOpacity onPress={playPause} activeOpacity={1}>
                    <Image source={playPauseSource} style={styles.playPause} />
                </TouchableOpacity>
                }
                <TouchableOpacity onPress={toggleSpeakerphone} activeOpacity={1}>
                    <Image source={speakerphoneSource} style={styles.speakerphone} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleMute} activeOpacity={1}>
                    <Image source={micIcon} style={styles.mic} />
                </TouchableOpacity>
                <OptionsMenu button={moreIcon} buttonStyle={{height: 28, width: undefined, aspectRatio: 121 / 431, marginLeft: 20, marginRight: 10}}
                    options={["Help", "Leave", "Cancel"]} 
                    actions={[helpClicked, leaveClicked, () => {}]}
                    destructiveIndex={1} />
            </View>
            <View style={{...styles.content, height: videosHeight}}>
                { stream && 
                <>
                <VideoFeed style={styles.video} stream={stream} username={AppData.current.username} width={videoWidth} height={videoHeight} peerID={AppData.current.peerID} onClick={playerClicked} neverHaveIEverLives={neverHaveIEverLives} lowestCard={lowestCard} categoriesTurn={false} />
                </>
                }
                { streams.length > 0 && 
                streams.map(stream =>
                    {
                        return <VideoFeed style={styles.video} stream={stream.stream} username={stream.username} width={videoWidth} height={videoHeight} key={stream.peerID} peerID={stream.peerID} onClick={playerClicked} neverHaveIEverLives={stream.lives} lowestCard={stream.lowestCard} categoriesTurn={stream.categoriesTurn} />
                    })
                }
                { endTurnVisible &&
                <EndTurnButton onClick={endTurn} />
                }
                { endGameVisible &&
                <GameOverButton onClick={() => AppData.current.disconnectAndEndGame()} />
                }
                { neverHaveIEverVisible &&
                <NeverHaveIEver callback={neverHaveIEver} />
                }
                { pickCardVisible &&
                <PickCardView pickCard={pickCard} />
                }
                { rockPaperScissorsVisible &&
                <RockPaperScissors style={styles.rockPaperScissors} rockPaperScissorsChosen={rockPaperScissorsChosen} />
                }
                { message !== null &&
                <MessageView message={message} />
                }
                { drinkReason !== null &&
                <DrinkView reason={drinkReason} />
                }
                { card !== null &&
                <CardView card={card} />
                }
                { categoryTurn === true &&
                <CategoriesTimerWithButton next={categoriesNext} lost={categoriesLost} />
                }
                { categoriesStartButtonVisible &&
                <View style={styles.categoriesStartButtonWrapper}>
                    <TouchableOpacity style={styles.categoriesStartButton} onPress={startCategories}>
                        <Text style={styles.categoriesStartButtonText}>START CATEGORIES</Text>
                    </TouchableOpacity>
                </View>
                }
                { playersList.length > 0 &&
                <PlayersList players={playersList} playerClicked={playerListItemClicked} cancel={cancelPlayerSelection} />
                }
            </View>
            { helpVisible &&
            <View style={styles.helpWrapper}>
                <View style={styles.helpHeader}>
                    <TouchableOpacity onPress={closeHelp} activeOpacity={1}>
                        <Image source={backButton} />
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>How To Play</Text>
                </View>
                <HowToPlay />
            </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    statusBar: {
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#EAF1F6'
    },  
    roomCode: {
        fontSize: 20,
    },
    roomCodeGroup: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row'
    },
    copy: {
        height: 28,
        width: undefined,
        aspectRatio: 314/434,
        marginLeft: 10
    },
    mic: {
        height: 28,
        width: undefined,
        aspectRatio: 286/447
    },
    content: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    video: {
        
    },
    crown: {
        width: 32,
        height: undefined,
        aspectRatio: 450/232,
        marginRight: 10
    },
    playPause: {
        height: 28,
        width: undefined,
        aspectRatio: 300/500,
        marginRight: 10
    },
    rockPaperScissors: {

    },
    helpWrapper: {
        position: 'absolute',
        left: 0,
        top: 40,
        right: 0,
        bottom: 0,
        backgroundColor: 'white'
    },
    helpHeader: {
        display: 'flex',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
    },
    navTitle: {
        fontSize: 30,
        alignSelf: 'center',
        flexGrow: 1,
        marginLeft: 20
    },
    speakerphone: {
        height: 28,
        width: undefined,
        aspectRatio: 470 / 380,
        marginRight: 10
    },
    categoriesStartButtonWrapper: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff55'
    },
    categoriesStartButton: {
        width: '80%',
        backgroundColor: 'blue',
        padding: 10
    },
    categoriesStartButtonText: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center'
    }
})