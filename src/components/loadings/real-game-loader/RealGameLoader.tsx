import React, { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { GameContext } from '../../../contexts/GameContext';
import { ScoreContext } from '../../../contexts/ScoreContext';
import { PlayerContext } from '../../../contexts/PlayerContext';
import { env } from 'process';

function RealGameLoader() {

    const _gameContext = useContext(GameContext);
    const _scoreContext = useContext(ScoreContext);
    const _playerContext = useContext(PlayerContext);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const gameID = queryParams.get('gameID');

    const [checkingForExistingGame, setCheckingForExistingGame] = React.useState(true);
    const [existingGameFound, setExistingGameFound] = React.useState(false);

    const getData = async () => {
        let response = fetch(`${process.env.REACT_APP_API_URL}/Game/GetGameData/${gameID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.success)
                {
                    let gameData = JSON.parse(data.gameData);
                    console.log(gameData.players); 
                    console.log(gameData.scores);

                    _playerContext.addPlayers(gameData.players);

                

                    _scoreContext.addScores(gameData.scores);

                    cleanUp();

                    

                    setCheckingForExistingGame(false);
                    setExistingGameFound(true);
                }
                else
                {
                    setCheckingForExistingGame(false);
                    setExistingGameFound(false);
                }
                
                //console.log(data); 
            })
            .catch(err => {
                console.log(err);
            });
    };

    const cleanUp =() => {
        console.log("cleaning up");
        _gameContext.updatePreloadedLocalStorage(true);
        setTimeout(() => {
            _gameContext.updateGameLoadingFromWeb(true);
        }, 200);
    }

    useEffect(() => {
       
        // async run getData
        getData();

        
    }, []);

    return (
        <div>RealGameLoader: {existingGameFound ? 'Found' : 'Not Found'}</div>
    )
}

export default RealGameLoader
