import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { GameContext } from '../../../contexts/GameContext';
import { ScoreContext } from '../../../contexts/ScoreContext';
import { PlayerContext } from '../../../contexts/PlayerContext';
import { env } from 'process';

function RealGameLoader() {

    const _gameContext = useContext(GameContext);
    const _scoreContext = useContext(ScoreContext);
    const _playerContext = useContext(PlayerContext);

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const gameID = queryParams.get('gameID');

    const [checkingForExistingGame, setCheckingForExistingGame] = React.useState(true);
    const [existingGameFound, setExistingGameFound] = React.useState<boolean | null>(null);
    const [statusText, setStatusText] = React.useState('');
    const [error, setError] = React.useState(false);

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
                    setError(false);
                    setStatusText('Found Game!');
                    let gameData = JSON.parse(data.gameData);
                    console.log("PARSED", gameData);
                   // console.log(gameData.players); 
                   //console.log(gameData.scores);

                   

                    if(gameData.selectedLanguage)
                    {
                        _gameContext.updateSelectedLanguage(gameData.selectedLanguage);
                    }
                    else
                    {
                        _gameContext.updateSelectedLanguage('en');
                    }

                    _playerContext.addPlayers(gameData.players);

                

                    _scoreContext.addScores(gameData.scores);

                    //console.log("MEEE", gameData);

                    if(data.images)
                   {
                    for(let i = 0; i < data.images.length; i++)
                    {
                    console.log(data.images[i]);
                        _gameContext.addPicture(data.images[i].filename);
                    }
                   }
                   

                    cleanUp();

                    

                    setCheckingForExistingGame(false);
                    setExistingGameFound(true);
                }
                else
                {
                    setError(true);
                    setStatusText('Game not found');
                    setCheckingForExistingGame(false);
                    setExistingGameFound(true);
                }
                
                //console.log(data); 
            })
            .catch(err => {
                setCheckingForExistingGame(false);
            setError(true);
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
        <>
          {error ? (
            <div><>
            <div
              style={{
                marginTop: '1rem',
                color: 'red',
              }}
            >
              Game Not Found
            </div>
            <div
              style={{
                marginTop: '1rem',
                fontSize: '1rem',
              }}
              onClick={() => navigate(`/${_gameContext.companyData.customerID}/`)}
            >
              Back
            </div>
          </></div>
          ) : checkingForExistingGame ? (
            <div>Talking with game server...</div>
          ) : existingGameFound ? (
            'Found Game!'
          ) : (
            <>
              <div
                style={{
                  marginTop: '1rem',
                  color: 'red',
                }}
              >
                Game Not Found
              </div>
              <div
                style={{
                  marginTop: '1rem',
                  fontSize: '1rem',
                }}
                onClick={() => navigate(`/${_gameContext.companyData.customerID}/`)}
              >
                Back
              </div>
            </>
          )}
        </>
      );
}

export default RealGameLoader
