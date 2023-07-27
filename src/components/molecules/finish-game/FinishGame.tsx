import React, {useContext} from 'react'
import './FinishGame.scss';
import {GameContext, GameStatus} from '../../../contexts/GameContext';
import StyleHelper from '../../../helpers/StyleHelper';
import {useNavigate} from 'react-router-dom';
import PlayerModel from '../../../models/player/PlayerModel';
import ScoreModel from '../../../models/score/ScoreModel';
import { PlayerContext } from '../../../contexts/PlayerContext';
import { ScoreContext } from '../../../contexts/ScoreContext';

function FinishGame() {
    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);
    const _scoreContext =  useContext(ScoreContext);
    const navigate = useNavigate();

    const handleViewResultsClick = () => {

        interface RawGamePayLoad {
            selectedLanguage?: string;
            players: PlayerModel[];
            scores: ScoreModel[];
        }

        let savePayLoad: RawGamePayLoad = {
            players: _playerContext.getAllPlayers(),
            scores: _scoreContext.getAllScores(),
            selectedLanguage: _gameContext.selectedLanguage
        }

        let finalPayload = {
            CustomerKey: _gameContext.companyData.customerID,
            GameID: _gameContext.gameID,
            GameData: JSON.stringify(savePayLoad)
        }

        let snapshotPlayers = _scoreContext.getAllPlayersScores().map((leaderboard) => {
            return {
                name: leaderboard.player.name,
                score: leaderboard.score,
                color: leaderboard.player.color,
            };
          });

        let snapshotPayload = {
            customerKey: _gameContext.companyData.customerID,
            gameID: _gameContext.gameID,
            players: snapshotPlayers
        }

        console.log("SNAPSHOT", snapshotPayload);
        // console.log(JSON.stringify(savePayLoad));

        //console.log("TEST", process.env.REACT_APP_IMAGEGEN_URL);

        let response = fetch(`${process.env.REACT_APP_IMAGEGEN_URL}/shareable`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(snapshotPayload)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });


        fetch(`${
            process.env.REACT_APP_API_URL
        }/Game/SaveGameData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalPayload)
        }).catch(err => {
            console.log(err);
        });

        let smsPayload = {
            customerKey: _gameContext.companyData.customerID,
            gameID: _gameContext.gameID
        }
        fetch(`${process.env.REACT_APP_IMAGEGEN_URL}/admin/actions/game_ended_sms.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(smsPayload)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });



        _gameContext.updateGameStatus(GameStatus.Finished);
        _gameContext.toggleShowFinalGamePopup(false);
        _gameContext.updateAllowGameLoadingFromWeb(false);
        navigate(`/${
            _gameContext.companyParam
        }/results?gameID=${_gameContext.gameID}`);
    }

    return (
        <div className='finish-game-overlay'>
            <div className='title'>game over</div>
            <div className='subtitle'></div>
            <div className='finalize-button'
                onClick={handleViewResultsClick}
                style={
                    {
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('continue-game-button'))
                    }
            }>
                View Results
            </div>
            <div className='take-me-back'
                onClick={
                    () => _gameContext.toggleShowFinalGamePopup(false)
            }>
                Take me back
            </div>
        </div>
    )
}

export default FinishGame
