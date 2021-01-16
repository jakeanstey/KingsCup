import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import MainMenu from './Components/MainMenu';
import GameRoom from './Components/GameRoom';
import AppData from './AppData';

const App = () => {
  const [currentPage, setCurrentPage] = useState('main');
  useEffect(() =>
  {
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
