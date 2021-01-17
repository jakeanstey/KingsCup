import { mediaDevices } from 'react-native-webrtc';
import Peer from 'react-native-peerjs';  
import IO from 'socket.io-client';
import InCallManager from 'react-native-incall-manager';
import { AppState } from 'react-native';
import config from './Files/config.json';

export default class AppData
{
    static current = AppData.current || new AppData();

    username = '';
    gender = '';
    roomCode = '';
    videoStream = null;
    peerServer = null;
    peerID = '';
    socket = null;
    events = {};
    muted = false;
    isHost = false;
    paused = false;
    started = false;
    myTurn = false;
    voting = false;
    twoForYou = false;
    chooseDate = false;
    rockPaperScisors = false;
    lastToTap = false;
    kingCount = 0;
    leaveGameCallback = null;
    speakerphone = true;

    constructor()
    {
        AppState.addEventListener('change', state =>
        {
            if(this.videoStream !== undefined && this.videoStream !== null)
            {
                if(state === 'active')
                {
                    this.videoStream.getVideoTracks().forEach(track => track.enabled = true);
                }
                else if(state == 'background')
                {
                    this.videoStream.getVideoTracks().forEach(track => track.enabled = false);
                }
            }
        });

        console.log('Kings Cup: Connecting to socket server');
        if(__DEV__)
        {
            this.socket = IO(config.debugSocketSettings.url, config.debugSocketSettings.options);
        }
        else
        {
            this.socket = IO(config.socketSettings.url, config.socketSettings.options);
        }        

        this.socket.on('connect', () => 
        {
            console.log('connected');
            console.log('Kings Cup: Connected to socket server');
        });

        this.socket.on('connect_error', error => 
        {
            console.log("error", error);
            console.error('Kings Cup: Error connecting to socket server', error);
        });

        this.socket.on('connect_timeout', error => 
        {
            console.log("error", error);
        });

        this.socket.on('kicked', () =>
        { 
            console.log('Kings Cup: kicked by host')
            this.disconnectAndEndGame();
        });
    }

    on(eventName, callback)
    {
        if(this.events[eventName] !== undefined && this.events[eventName] !== null)
        {
            this.events[eventName].push(callback);
        }
        else
        {
            this.events[eventName] = [callback];
        }
    }

    raise(eventName, ...args)
    {
        if(this.events[eventName] !== undefined && this.events[eventName] !== null)
        {
            for(var i = 0; i < this.events[eventName].length; i++)
            {
                this.events[eventName][i]?.(...args);
            }
        }
    }

    startCameraFeed(gotStreamCallback)
    {
        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind === 'videoinput' && sourceInfo.facing === (isFront ? 'front' : 'environment')) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }

            mediaDevices.getUserMedia({
                audio: true,
                video: {
                mandatory: {
                    minWidth: 500,
                    minHeight: 300,
                    minFrameRate: 30,
                },
                facingMode: (isFront ? 'user' : 'environment'),
                optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
                },
            })
            .then(videoStream => {
                console.log('here');
                InCallManager.start({media: 'video'});
                InCallManager.setKeepScreenOn(true);
                InCallManager.setSpeakerphoneOn(true);
                this.videoStream = videoStream;
                this.connectToSocketServer();
                this.connectToPeerServer();
                gotStreamCallback();
            })
            .catch(error => {
                console.log(error);
            });
        });
    }

    connectToSocketServer()
    {
        this.socket.on('user-joined', (username, peerID) =>
        {
            let call = this.peerServer.call(peerID, this.videoStream);
            call.on('stream', otherVideoStream =>
            {
                this.raise('stream', peerID, username, otherVideoStream);                
            });

            call.on('close', () =>
            {
                this.socket.emit('has-user-left', peerID, (left) =>
                {
                    if(left)
                    {
                        call = this.peerServer.call(peerID, this.videoStream);
                    }
                });
            });
        });

        this.socket.on('user-disconnected', peerID => 
        {
            this.raise('player-disconnected', peerID);
        });

        /// GAME LOGIC ///
        this.socket.on('game-started', () =>
        {
            this.started = true;
            // calling this here because it already raises the event to the UI
            this.resumeGame();

            this.socket.on('my-turn', () =>{
                this.voting = false;
                this.twoForYou = false;
                this.myTurn = true;
                this.chooseDate = false;
                this.rockPaperScisors = false;
                this.lastToTap = false;
                
                this.raise('my-turn');
            });

            this.socket.on('set-player-turn', (peerID, username) =>
            {
                this.voting = false;
                this.twoForYou = false;
                this.myTurn = false;
                this.chooseDate = false;
                this.rockPaperScisors = false;
                this.lastToTap = false;

                this.raise('set-player-turn', peerID, username);
            });

            this.socket.on('card-dealt', (card, username) => 
            {
                this.raise('card-dealt', JSON.parse(card), username);
            });

            this.socket.on('player-voted', (peerID, username) =>
            {
                if(peerID === this.peerID)
                {
                    this.raise('drink', 'You were the winner, now drink!');
                }
                else
                {
                    this.raise('message', username + ' had the most votes.')
                }
            });

            this.socket.on('drink', (peerID, username, reason) =>
            {
                console.log(username, reason);
                let translatedReason = '';
                switch(reason)
                {
                    case 'two-for-you':
                        translatedReason = peerID === this.peerID ? 'Two for you' : 'Two for ' + username;
                        break;
                    case 'date':
                        const [sender, date] = username.split(',');
                        translatedReason = peerID === this.peerID ? username + "'s date" : date + ' is ' + sender + "'s date";
                        break;
                    case 'never-have-i-ever':
                        translatedReason = peerID === this.peerID ? "You've done it all, now drink" : username + ' has done it all';
                        break;
                }

                if(peerID === this.peerID)
                {
                    this.raise('drink', translatedReason);
                }
                else
                {
                    this.raise('message', translatedReason);
                }

                // reset the turn 
                if(reason === 'never-have-i-ever')
                {
                    this.raise('never-have-i-ever-ended');
                }
            });

            this.socket.on('date-added', (senderPeerID, senderUsername, targetPeerID, targetUsername) =>
            {
                if(senderPeerID === this.peerID)
                {
                    this.raise('message', targetUsername + ' is now your date');
                }
                else
                {
                    this.raise('message', targetUsername + ' is now ' + senderUsername + "'s date");
                }
            });

            this.socket.on('never-have-i-ever', (peerID, username) =>
            {
                this.raise('never-have-i-ever', peerID === this.peerID);
                if(peerID === this.peerID)
                {
                    this.raise('message', 'Never have I ever...');
                }
                else
                {
                    this.raise('message', username + " has never...");
                }
            });

            this.socket.on('start-never-have-i-ever', () =>
            {
                this.raise('start-never-have-i-ever');
            });

            this.socket.on('never-have-i-ever-lives-changed', (peerID, lives) =>
            {
                this.raise('never-have-i-ever-lives-changed', peerID, lives);
            });

            this.socket.on('start-rock-paper-scissors', (initiatorPeerID, oponentPeerID) =>
            {
                if(this.peerID === initiatorPeerID || this.peerID === oponentPeerID)
                {
                    this.raise('rock-paper-scissors');
                }
            });

            this.socket.on('rock-paper-scissors-loser', (peerID, username) =>
            {
                if(peerID === this.peerID)
                {
                    this.raise('drink', 'You lost!')
                }
                else
                {
                    this.raise('message', username + ' lost');
                }
            });

            this.socket.on('rock-paper-scissors-draw', (peerIDOne, peerIDTwo) =>
            {
                if(this.peerID === peerIDOne || this.peerID === peerIDTwo)
                {
                    this.raise('drink', 'Draw, you both drink')
                }
                else
                {
                    this.raise('message', 'Draw');
                }
            });

            this.socket.on('last-to-tap-lost', (peerID, username) =>
            {
                if(this.peerID === peerID)
                {
                    this.raise('drink', 'You were the last to tap. Drink up!');
                }
                else
                {
                    this.raise('message', username + ' was the last to tap the screen');
                }
            });

            this.socket.on('game-paused', () =>
            {
                this.pauseGame();
            });
    
            this.socket.on('game-resumed', () =>
            {
                this.resumeGame();
            });

            this.socket.on('disconnect', () =>
            {
                this.disconnectAndEndGame();
            });
        });
    }

    connectToPeerServer()
    {
        console.log('Kings Cup: Connecting to peer server');
        this.peerServer = new Peer(config.peerSettings);     

        this.peerServer.on('error', (error) =>
        {
            console.error('Kings Cup: Peer server error:', error);
        });

        this.peerServer.on('open', myID => {
            this.peerID = myID;
            this.socket.emit('join-game', this.username, this.gender, this.roomCode.toUpperCase(), myID);
            console.log('Kings Cup: Connected to peer server', myID);
        });

        this.peerServer.on('connection', connection =>
        {
            connection.on('data', data =>
            {
                connection.send({ command: 'username', data: AppData.current.username });
            });
        });

        this.peerServer.on('call', call =>
        {
            call.answer(this.videoStream);
            call.on('stream', otherUserStream =>
            {
                const connection = this.peerServer.connect(call.peer);
                
                connection.on('open', () =>
                {
                    // arbitrary hello, the one whom opens the connection must send first data?
                    connection.send('Hello');

                    connection.on('error', error =>
                    {
                        console.error(error);
                    });

                    connection.on('data', data =>
                    {
                        if(data !== null)
                        {
                            switch(data.command)
                            {
                                case 'username':
                                    this.raise('stream', call.peer, data.data, otherUserStream);
                                    break;
                            }
                        }
                    });
                });
            });
        });        
    }

    toggleMute()
    {
        if(this.muted)
        {
            this.videoStream.getAudioTracks()[0].enabled = true;
            this.muted = false;
        }
        else
        {
            this.videoStream.getAudioTracks()[0].enabled = false;
            this.muted = true;
        }
    }

    playPause()
    {
        if(!this.started)
        {
            this.socket.emit('start-game');
        }
        else
        {
            if(this.paused)
            {
                this.socket.emit('resume-game');
                this.resumeGame();
            }
            else
            {
                this.socket.emit('pause-game');
                this.pauseGame();
            }
        }
    }

    pauseGame()
    {
        this.paused = true;
        this.raise('game-state-changed', false);
    }

    resumeGame()
    {
        this.paused = false;
        this.raise('game-state-changed', true);
    }

    pickCard()
    {
        if(this.myTurn)
        {
            this.socket.emit('pick-card');
        }
    }

    playerClicked(peerID, username)
    {
        if(this.voting)
        {
            this.socket.emit('vote', peerID, username);
            this.voting = false;
        }
        else if(this.twoForYou)
        {
            this.socket.emit('two-for-you', peerID, username);
            this.twoForYou = false;
        }
        else if(this.chooseDate)
        {
            this.socket.emit('choose-date', this.peerID, this.username, peerID, username);
            this.chooseDate = false;
        }
        else if(this.rockPaperScisors && peerID !== this.peerID)
        {
            this.socket.emit('rock-paper-scissors', this.peerID, this.username, peerID);
            this.raise('rock-paper-scissors');
            this.rockPaperScisors = false;
        }
        else if(this.lastToTap)
        {
            this.socket.emit('last-to-tap-the-screen', this.peerID, this.username);
            this.lastToTap = false;
        }
    }

    notifyDates()
    {
        this.socket.emit('notify-dates-to-drink', this.peerID, this.username);
    }

    neverHaveIEver(iHave)
    {
        this.socket.emit('never-have-i-ever', this.peerID, iHave);
    }

    chooseRockPaperScisors(choice)
    {
        this.socket.emit('choose-rock-paper-scissors', this.peerID, choice, this.username);
    }

    endTurn()
    {
        this.socket.emit('end-turn');
    }

    actionCard(card, username)
    {
        // Common cards
        switch(card.faceName)
        {
            case 'A':
                // vote
                this.voting = true;
                this.raise('message', 'Vote!');
                break;
            case '5':
                // guys
                if(this.gender === 'male')
                {
                    this.raise('drink', 'Guys');
                }
                else
                {
                    this.raise('message', 'Guys');
                }
                break;
            case '6':
                // chicks
                if(this.gender === 'female')
                {
                    this.raise('drink', 'Chicks');
                }
                else
                {
                    this.raise('message', 'Chicks');
                }
                break;
            case '7':
                this.lastToTap = true;
                this.raise('message', 'Last to tap the screen drinks!');
                break;
            case 'J':
                this.raise('message', 'Never have I ever');
                if(this.myTurn)
                {
                    this.socket.emit('start-never-have-i-ever');
                }
                break;
        }

        if(this.myTurn)
        {
            switch(card.faceName)
            {
                case '2':
                    this.twoForYou = true;
                    this.raise('message', 'Choose a player to drink');
                    break;
                case '3':
                    this.raise('drink', 'Three for me!');
                    break;
                case '4':
                    this.raise('message', 'More, pick again');
                    this.socket.emit('more');
                    break;
                case '8':
                    this.chooseDate = true;
                    this.raise('message', 'Choose a date');
                    break;
                case '9':
                    this.rockPaperScisors = true;
                    this.raise('message', 'Rock Paper Scisors. Choose someone');
                    break;
                case '10':
                    this.raise('message', 'Name a category');
                    break;
                case 'Q':
                    this.raise('message', 'You are the Question Master');
                    break
                case 'K':
                    this.raise('drink', 'King pulled, drink');
                    if(++this.kingCount == 4)
                    {
                        this.raise('drink', 'Game over. Finish your drink.');
                    }
                    break;
            }
            if(this.kingCount == 4)
            {
                this.raise('game-over');
            }
            else
            {
                this.raise('turn-over');
            }
        }
        else
        {
            switch(card.faceName)
            {
                case '2':
                    // do nothing
                    break;
                case '3':
                    this.raise('message', 'Three for ' + username);
                    break;
                case '8':

                    break;
                case '9':
                    this.raise('message', 'Rock Paper Scisors');
                    break;
                case '10':
                    this.raise('message', 'Categories');
                    break;
                case 'Q':
                    this.raise('message', username + ' is the Question Master');
                    break;
                case 'K':
                    this.raise('message', 'King pulled');
                    if(++this.kingCount == 4)
                    {
                        this.raise('message', 'Game Over');
                        this.raise('game-over');
                    }
                    break;
            }
        }
    }

    disconnectAndEndGame()
    {
        console.log('leaving game room');
        this.socket.emit('left-game');
        InCallManager.stop();
        this.peerServer.destroy();
        this.leaveGameCallback();
    }

    leaveGameRoom()
    {

    }

    clearAllEventCallbacks()
    {
        this.events = {};
    }

    toggleSpeakerphone()
    {
        this.speakerphone = !this.speakerphone;
        InCallManager.setSpeakerphoneOn(this.speakerphone);
        return this.speakerphone;
    }

    canIJoinGame(roomCode, callback)
    {
        this.socket.emit('can-i-join-game', roomCode, callback);
    }

    canIHostGame(roomCode, callback)
    {
        this.socket.emit('can-i-host-game', roomCode, callback);
    }
}