import React, { 
    useState, 
    useRef,
    useEffect
} from 'react'
import {
    Text,
    Image,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Switch,
    Platform,
    ScrollView,
    Alert
} from 'react-native';
import Button from '../Partials/Button';
import fanOfKings from '../Images/fan_of_kings.png';
import backButton from '../Images/back_button.png';
import AppData from '../AppData';
import HowToPlay from './HowToPlay';
import Disclaimer from '../Partials/Disclaimer';

export default function MainMenu({ startGameCallback }) {
    const [currentSection, setCurrentSection] = useState('main');
    const [backButtonVisible, setBackButtonVisible] = useState(false);
    const [navTitle, setNavTitle] = useState('');
    const [username, setUsername] = useState('');
    const [male, setMale] = useState(false);
    const [female, setFemale] = useState(true);
    const [roomCode, setRoomCode] = useState('');
    const [viewHeight, setViewHeight] = useState();
    const [disclaimerVisible, setDisclaimerVisible] = useState(false);

    const bank = 'abcdefghijklmnopqrstuvwxyz1234567890';

    const playGameClicked = () =>
    {
        setNavTitle('Host or Join');
        setBackButtonVisible(true);
        setCurrentSection('hostOrJoin');
    }

    const backButtonPressed = () =>
    {
        switch(currentSection)
        {
            default:
            case 'howToPlay':
            case 'hostOrJoin':
                setBackButtonVisible(false);
                setNavTitle('');
                setCurrentSection('main');
                break;
            case 'join':
                setNavTitle('Host or Join');
                setCurrentSection('hostOrJoin');
                break;
        }
    }

    const toggleGender = (gender) => 
    {
        if(gender === 'female')
        {
            setMale(false);
            setFemale(true);
        }
        else
        {
            setMale(true);
            setFemale(false);
        }
    }

    const hostClicked = () =>
    {
        if(username !== '' && (male || female))
        {
            const len = 6;
            let code = '';
            for(var i = 0; i < len; i++)
            {
                const rnd = parseInt(Math.random() * bank.length);
                code += bank[rnd];
            }
            AppData.current.roomCode = code;
            AppData.current.username = strip(username);
            AppData.current.gender = male ? 'male' : 'female';
            AppData.current.isHost = true;
            AppData.current.canIHostGame(code, (hostable) =>
            {
                if(hostable)
                {
                    setDisclaimerVisible(true);
                }
                else
                {
                    Alert.alert("Unable to host game", "Something went wrong while trying to host your game, please try again.", [{ text: "OK"}], {});
                }
            });                   
        }
    }

    const joinClicked = () =>
    {
        if(username !== '' && (male || female))
        {
            AppData.current.username = strip(username);
            AppData.current.gender = male ? 'male' : 'female';
            setCurrentSection('join');
        }
    }

    const joinRoomClicked = () =>
    {
        if(roomCode !== '')
        {
            AppData.current.roomCode = strip(roomCode);
            AppData.current.canIJoinGame(AppData.current.roomCode, (joinable) =>
            {
                if(joinable)
                {
                    setDisclaimerVisible(true);
                }
                else
                {
                    Alert.alert("Unable to join room", "The room code you entered is incorrect, please try again.", [{ text: "OK"}], {});
                }
            });            
        }
    }

    const strip = (string) => 
    {
        let result = '';
        const usernameBank  = bank + ' ';
        for(let i = 0; i < string.length; i++)
        {
            let match = null;
            for(let j = 0; j < usernameBank.length; j++)
            {
                if(usernameBank[j] === string[i].toLowerCase())
                {
                    match = usernameBank[j];
                    break;
                }
            }

            if(match !== null)
            {
                result += match;
            }
        }

        return result;
    }

    const howToPlayClicked = () =>
    {
        setNavTitle('How to Play');
        setBackButtonVisible(true);
        setCurrentSection('howToPlay');
    }

    const gotDimensions = (e) =>
    {
        const { height } = e.nativeEvent.layout;
        //setViewHeight(height);
    }

    const agreedToDisclaimer = () =>
    {
        AppData.current.startCameraFeed(() =>
        {
            startGameCallback();
        });     
    }

    return (
        <ScrollView style={styles.scroll} onLayout={gotDimensions} contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.main}>
                <View style={styles.navBar}>
                { backButtonVisible && 
                <>
                <TouchableOpacity onPress={backButtonPressed}>
                    <Image style={styles.backButton} source={backButton} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>{navTitle}</Text>
                </>
                }
                </View>
                { currentSection !== 'howToPlay' && 
                <Text style={styles.title}>King's Cup</Text>
                }

                { currentSection === 'main' &&
                <View style={styles.buttonWrapper}>
                    <Button style={styles.button} text="Play" backgroundColor="#1C5616" textColor="white" onClick={playGameClicked} />
                    <Button style={styles.button} text="How To Play" onClick={howToPlayClicked} />
                </View>
                }
                { currentSection === 'hostOrJoin' &&
                <View style={styles.buttonWrapper}>
                    <TextInput style={styles.usernameInput} onChangeText={text => setUsername(text)} placeholder="Username" value={username} />
                    <View style={styles.radioGroup}>
                        <Text style={styles.radioGroupLabel}>Female</Text>
                        <Switch style={styles.radioGroupSwitch} onValueChange={on => toggleGender(on ? 'female' : 'male')} value={female} />
                    </View>
                    <View style={styles.radioGroup}>
                        <Text style={styles.radioGroupLabel}>Male</Text>
                        <Switch style={styles.radioGroupSwitch} onValueChange={on => toggleGender(on ? 'male' : 'female')} value={male} />
                    </View>
                    <Button style={styles.button} text="Host" onClick={hostClicked} />
                    <Button style={styles.button} text="Join" onClick={joinClicked} />
                </View>
                }
                { currentSection === 'join' &&
                <View style={styles.buttonWrapper}>
                    <TextInput style={styles.usernameInput} onChangeText={value => setRoomCode(value)} placeholder="Room Code" value={roomCode} />
                    <Button style={styles.button} text="Join" onClick={joinRoomClicked} />
                </View>
                }
                { currentSection === 'howToPlay' &&
                <HowToPlay />
                }
                { currentSection !== 'howToPlay' &&
                <Image style={styles.cards} source={fanOfKings} />
                }
                { disclaimerVisible &&
                <Disclaimer confirm={agreedToDisclaimer} />
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scroll: {
        width: '100%',
        height: '100%'
    },
    navBar: {
        margin: 10,
        height: 48,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
    },
    navTitle: {
        fontSize: 30,
        alignSelf: 'center',
        flexGrow: 1,
        marginLeft: 20
    },
    main: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        
    },
    title: {
        marginTop: 10,
        fontSize: 60,
        textAlign: 'center',
        width: '100%',
        flexGrow: 1,
    },
    cards: {
        justifyContent: 'flex-end',
        alignSelf: 'center'
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        
    },
    button: {
        margin: 10
    },
    usernameInput: {
        height: 48,
        width: '80%',
        borderWidth: 1,
        borderColor: 'gray',
        fontSize: 28,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10,
        paddingTop: 0,
        paddingBottom: 0
    },
    radioGroup: {
        height: 35,
        width: '80%',
        display: 'flex',
        flexDirection:'row',
    },
    radioGroupLabel: {
        fontSize: 20,
        flexGrow: 1
    },
    radioGroupSwitch: {

    }
});