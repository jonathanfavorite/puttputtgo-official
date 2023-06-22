import React, {createContext, useContext, useState} from 'react'
import PlayerModel from '../models/player/PlayerModel';
import { ScoreContext } from './ScoreContext';
import { GameContext } from './GameContext';
import { CourseContext } from './CourseContext';
import RGBModel from '../models/color/RGBModel';

const PlayerContext = createContext<PlayerContextProps>({} as PlayerContextProps)

type playerID = number;

interface PlayerContextProps {
    resetPlayers: () => void;
    addPlayer: (player: PlayerModel) => void;
    addPlayers: (players: PlayerModel[]) => void;
    getAllPlayers: () => PlayerModel[];
    removePlayer: (playerID: playerID) => void;
    getCurrentPlayer: () => PlayerModel;
    updateCurrentPlayer: (playerID: playerID) => void;
    getLastPlayer: () => PlayerModel;
    getFirstPlayer: () => PlayerModel;
    getNextPlayer: () => PlayerModel;
    toggleNextPlayer: () => void;

}

function formatRGBToCSS(rgb: RGBModel, opacity: number = 0) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

function PlayerContextProvider(props: any) {

    const _gameContext = useContext(GameContext);
    const _courseContext = useContext(CourseContext);
    const _scoreContext = useContext(ScoreContext);

    const [players, setPlayers] = useState<PlayerModel[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  
    const resetPlayers = () => {
        setPlayers(old => []);
    }

    const addPlayer = (player: PlayerModel) => {
        setPlayers(old => [...old, player]);
    }

    const addPlayers = (players: PlayerModel[]) => {
        setPlayers(old => [...old, ...players]);
    }

    const getAllPlayers = () => {
        return players;
    }

    const removePlayer = (playerID: playerID) => {
        setPlayers(old => old.filter(player => player.id !== playerID));
    }

    const getCurrentPlayer = () => {
        if(players.length === 0)
        {
            return {
                id: 0,
                name: 'No Players',
                score: 0,
            }
        }
        return players[currentPlayer];
    }

    const updateCurrentPlayer = (playerID: playerID) => {
        const index = players.findIndex(player => player.id === playerID);
        if(index === -1)
        {
            if(players.length === 0)
            {
                return;
            }
            else
            {
                setCurrentPlayer(0);
                return;
            }
            
        }
        setCurrentPlayer(index);
    }

    const getLastPlayer = () => {
        return players[players.length - 1];
    }

    const getFirstPlayer = () => {
        return players[0];
    }

    const getNextPlayer = () => {
        if (currentPlayer === players.length - 1) {
            return players[0];
        }
        return players[currentPlayer + 1];
    }

    const toggleNextPlayer = () => {
        if (currentPlayer === players.length - 1) {
            setCurrentPlayer(0);
        } else {
            setCurrentPlayer(currentPlayer + 1);
        }
    }


    const contextValues: PlayerContextProps = {
        resetPlayers,
        addPlayer,
        addPlayers,
        getAllPlayers,
        removePlayer,
        getCurrentPlayer,
        updateCurrentPlayer,
        getLastPlayer,
        getFirstPlayer,
        getNextPlayer,
        toggleNextPlayer

    }

    return <PlayerContext.Provider value={contextValues}>
        {props.children}
    </PlayerContext.Provider>
}

export { PlayerContext, formatRGBToCSS, PlayerContextProvider }