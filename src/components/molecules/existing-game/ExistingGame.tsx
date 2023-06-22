import React, { useContext } from 'react'
import './ExistingGame.scss';
import { GameContext, GameStatus } from '../../../contexts/GameContext';
import StyleHelper from '../../../helpers/StyleHelper';
import { useNavigate } from 'react-router-dom';
import { PlayerContext } from '../../../contexts/PlayerContext';

function ExistingGame() {
    const _playerContext = useContext(PlayerContext);
    const _gameContext = useContext(GameContext);
    const navigator = useNavigate();
    const handleNewGameButton = () => {
        _gameContext.resetGame();
        _gameContext.updateGameStatus(GameStatus.NotStarted);
        navigator(`/${_gameContext.companyParam}`);
    };
    const handleContinueButton = async () => {
        //await _gameContext.loadFromLocalStorage();
        const companyParam = _gameContext.companyParam;
        _gameContext.updateGameStatus(GameStatus.Active);
        _gameContext.didClickContinueGame();

        navigator(`/${companyParam}/game`);
    };
  return (
    <div className='existing-game-modal'>
        <div className='body'>
            <h1>Game in progress</h1>
            <p>Would you like to continue where you left off?</p>

            <div className='buttons'>
                
                <div className='button no' onClick={handleNewGameButton} style={{
                    backgroundImage: StyleHelper.format_css_url(
                        _gameContext.getAssetByID("red-button")
                      ),
                }}>New Game</div>
                <div className='button yes' onClick={handleContinueButton} style={{
                    backgroundImage: StyleHelper.format_css_url(
                        _gameContext.getAssetByID("green-button")
                      ),
                }}>Continue</div>
            </div>
        </div>
    </div>
  )
}

export default ExistingGame