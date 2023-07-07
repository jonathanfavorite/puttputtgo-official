import React, { useContext } from 'react'
import './FinishGame.scss';
import { GameContext, GameStatus } from '../../../contexts/GameContext';
import StyleHelper from '../../../helpers/StyleHelper';
import { useNavigate } from 'react-router-dom';

function FinishGame() {
  const _gameContext = useContext(GameContext);
  const navigate = useNavigate();

  const handleViewResultsClick = () => {
    _gameContext.updateGameStatus(GameStatus.Finished);
    _gameContext.toggleShowFinalGamePopup(false);
    navigate(`/${_gameContext.companyParam}/results`);
  }

  return (
    <div className='finish-game-overlay'>
      <div className='title'>game over</div>
      <div className='subtitle'>you have finished the game. if all scores are correct, please press view results. If not, press 'take me back'.</div>
      <div className='finalize-button' onClick={handleViewResultsClick} style={{
        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('continue-game-button'))
      }}>
        View Results
      </div>
      <div className='take-me-back' onClick={() => _gameContext.toggleShowFinalGamePopup(false)}>
        Take me back
      </div>
    </div>
  )
}

export default FinishGame