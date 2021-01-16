import React, { useState, useEffect, useRef } from 'react';
import { 
    View ,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
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
    const [endTurnVisible, setEndTurnVisible] = useState(true);
    const [drinkReason, setDrinkReason] = useState(null);
    const [neverHaveIEverVisible, setNeverHaveIEverVisible] = useState(false);
    const [neverHaveIEverLives, setNeverHaveIEverLives] = useState(null);
    const [rockPaperScissorsVisible, setRockPaperScissorsVisible] = useState(false);
    const [endGameVisible, setEndGameVisible] = useState(false);
    const [helpVisible, setHelpVisible] = useState();
    const [speakerphoneSource, setSpeakerphoneSource] = useState(speakerphoneOn);

    // any reference from an event must use the ref value
    const streamsRef = useRef(streams);
    const setStreams = streams =>
    {
        streamsRef.current = streams;
        _setStreams(streams);
    }

    useEffect(() =>
    {
        setStream(AppData.current.videoStream);
        AppData.current.on('stream', (peerID, username, otherStream) =>
        {
            setStreams([...streamsRef.current, {peerID, username, stream: otherStream, lives: null}]);
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
                    stream.lives = 0;
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

        return function cleanup()
        {
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
            setTimeout(() => setDrinkReason(null), 3 * 1000);
        }
        else
        {
            AppData.current.notifyDates();
        }
    }, [drinkReason])

    const gotDimensions = (e) =>
    {
        const { x, y, width, height } = e.nativeEvent.layout;
        setVideoWidth(width / 2);
        setVideoHeight((height - 40) / 3);
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

    const copyRoomCode = () =>
    {
        Clipboard.setString(AppData.current.roomCode);
        Toast.showWithGravity("Copied!", Toast.SHORT, Toast.TOP);
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

    return (
        <>
        <View style={styles.statusBar}>
            { isHost && 
            <Image source={crown} style={styles.crown} />
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
            <OptionsMenu button={moreIcon} buttonStyle={{height: 32, width: undefined, aspectRatio: 121 / 431, marginLeft: 20, marginRight: 10}}
                options={["Help", "Leave", "Cancel"]} 
                actions={[helpClicked, leaveClicked, () => {}]}
                destructiveIndex={1} />
        </View>
        <View style={styles.content} onLayout={gotDimensions}>
            { stream && 
            <>
            <VideoFeed style={styles.video} stream={stream} username={AppData.current.username} width={videoWidth} height={videoHeight} peerID={AppData.current.peerID} onClick={playerClicked} neverHaveIEverLives={neverHaveIEverLives} />
            </>
            }
            { streams.length > 0 && 
            streams.map(stream =>
                {
                    return <VideoFeed style={styles.video} stream={stream.stream} username={stream.username} width={videoWidth} height={videoHeight} key={stream.peerID} peerID={stream.peerID} onClick={playerClicked} neverHaveIEverLives={stream.lives} />
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
        </>
    )
}

const styles = StyleSheet.create({
    statusBar: {
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
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
        height: 32,
        width: undefined,
        aspectRatio: 286/447
    },
    content: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'gray'
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
        aspectRatio: 353/500,
        marginRight: 10
    },
    rockPaperScissors: {

    },
    helpWrapper: {
        position: 'absolute',
        left: 0,
        top: 40,
        right: 0,
        bottom: 40,
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
    }
})