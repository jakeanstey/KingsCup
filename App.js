import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Linking,
  Alert
} from 'react-native';
import MainMenu from './Components/MainMenu';
import GameRoom from './Components/GameRoom';
import AppData from './AppData';

const App = () => {
  const [currentPage, setCurrentPage] = useState('main');
  useEffect(() =>
  {
    (async () =>
    {
      const url = await Linking.getInitialURL();
      console.log(url)
      if(url !== null)
      {
        // extract the code - must be 6 digits
        const roomCode = url.split('/joinroom/')[1].split('/')[0];
        console.log(roomCode);
        if(roomCode.length === 6)
        {
          AppData.current.fillRoomCode(roomCode);
        }
      }
    })()
    AppData.current.leaveGameCallback = endGame;
  }, []);

  const startGame = () =>
  {
    console.log('starting');
    setCurrentPage('gameRoom');
  }

  const endGame = () =>
  { 
    console.log('game over');
    setCurrentPage('main');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        { currentPage === 'main' &&
          <>
            <MainMenu startGameCallback={startGame} />
          </>
        }
        { currentPage === 'gameRoom' &&
        <>
          <GameRoom />
        </>
        }
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
