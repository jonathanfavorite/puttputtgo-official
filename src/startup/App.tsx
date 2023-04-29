import React, { useContext, useEffect } from 'react';
import './App.scss';
import { ScoreContext } from '../contexts/ScoreContext';
import { PlayerContext } from '../contexts/PlayerContext';
import { GameContext } from '../contexts/GameContext';
import PlayerModel from '../models/player/PlayerModel';
import HoleModel from '../models/hole/HoleModel';
import { useParams } from 'react-router-dom';

function App(props: any) {

  const gameCtx = useContext(GameContext);



  return (
    <div className="app">
      {props.children}
    </div>
  );
}

export default App;
