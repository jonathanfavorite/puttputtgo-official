import React, {createContext, useContext, useState} from 'react'
import ScoreModel from '../models/score/ScoreModel'
import { PlayerContext } from './PlayerContext';
import LeaderboardModel from '../models/score/LeaderboardModel';
import { CourseContext } from './CourseContext';

const ScoreContext = createContext<ScoreContextProps>({} as ScoreContextProps)

type holeNumber = number;
type playerID = number;

interface ScoreContextProps {
    resetScores: () => void;
    addScore: (score: ScoreModel) => void;
    addScores: (scores: ScoreModel[]) => void;
    removeScore: (score: ScoreModel) => void;
    getAllScores: () => ScoreModel[];
    getScoreByHoleAndPlayer: (holeNumber: holeNumber, playerID: playerID) => number;
    getPlayerTotalScore: (id: number) => number;
    getAllPlayersScores: () => LeaderboardModel[];
    hasEveryPlayerPlayedThisHole: (hole: holeNumber) => PlayersNotPlayedThisHole[];
}
interface PlayersNotPlayedThisHole {
    playerID: number;
    playerName: string;
}

function ScoreContextProvider(props: any) {

    const _playerContext = useContext(PlayerContext);
    const [scores, setScores] = useState<ScoreModel[]>([]);


    const resetScores = () => {
        setScores(old => []);
    }

    const addScore = (score: ScoreModel) => {
        // if scores already exists for this hole and player, remove it
        for (let i = 0; i < scores.length; i++) {
            if (scores[i].holeID == score.holeID && scores[i].playerID == score.playerID) {
                removeScore(scores[i]);
            }
        }
        setScores(old => [...old, score]);
    }

    const addScores = (scores: ScoreModel[]) => {
        setScores(old => [...old, ...scores]);
    }

    const removeScore = (score: ScoreModel) => {
        setScores(old => old.filter(s => s !== score));
    }

    const getScoreByHoleAndPlayer = (holeNumber: number, playerID: number) => {
        for (let i = 0; i < scores.length; i++) {
            if (scores[i].holeID == holeNumber && scores[i].playerID == playerID) {
                return scores[i].score;
            }
        }
        return -10;
    }

    const getPlayerTotalScore = (id: number) => {
        let total: number = 0;
        for (let i = 0; i < scores.length; i++) {
            if (scores[i].playerID == id) {
                total += scores[i].score;
            }
        }
        return total;
    };

    const getAllScores = () => {
        return scores;
    }

    const getAllPlayersScores = () => {
        let leaderboard : LeaderboardModel[] = [];
        for (let i = 0; i < _playerContext.getAllPlayers().length; i++) {
           let player = _playerContext.getAllPlayers()[i];
           let score = getPlayerTotalScore(player.id);
           leaderboard.push({player: player, score: score});
       }

       // Sort the leaderboard
       leaderboard.sort((a, b) => {
           return a.score - b.score;
       });
       return leaderboard;
    }

    const hasEveryPlayerPlayedThisHole = (hole: holeNumber) => {
        const playersNotPlayedThisHole: PlayersNotPlayedThisHole[] = [];
        for (let i = 0; i < _playerContext.getAllPlayers().length; i++) {
            let player = _playerContext.getAllPlayers()[i];
            if (getScoreByHoleAndPlayer(hole, player.id) == -10) {
                playersNotPlayedThisHole.push({playerID: player.id, playerName: player.name});
            }
        }

        return playersNotPlayedThisHole;
    };
    


    const contextValues: ScoreContextProps = {
        resetScores,
        addScore,
        addScores,
        removeScore,
        getAllScores,
        getScoreByHoleAndPlayer,
        getPlayerTotalScore,
        getAllPlayersScores,
        hasEveryPlayerPlayedThisHole
    }

    return <ScoreContext.Provider value={contextValues}>
        {props.children}
    </ScoreContext.Provider>
}

export { ScoreContext, ScoreContextProvider }