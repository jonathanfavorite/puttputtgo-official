import React, {useContext} from 'react'
import './UnfinishedGame.scss';
import {GameContext} from '../../../contexts/GameContext';
import {CourseContext} from '../../../contexts/CourseContext';
import {ScoreContext} from '../../../contexts/ScoreContext';
import StyleHelper from '../../../helpers/StyleHelper';
import { PlayerContext } from '../../../contexts/PlayerContext';

function UnfinishedGame() {
    const _gameContext = useContext(GameContext);
    const _courseContext = useContext(CourseContext);
    const _playerContext = useContext(PlayerContext);
    const _scoreContext = useContext(ScoreContext);

    interface IsValidProps {
        holeNumber: number;
        firstPlayer: number;
    }

    const isInvalid = (holeNumber: number) : IsValidProps | null => {
        let found : IsValidProps | null = null;
        _scoreContext.gameSubmissionReport.invalidHoles.some((invalidHole) => {
            if(invalidHole.hole.number === holeNumber)
            {
                found =  {
                    holeNumber: invalidHole.hole.number,
                    firstPlayer: invalidHole.playerIDs[0]
                }
            }
        })
        return found;
    }

    const handleBackButton = () => {
        _gameContext.toggleShowFinalGamePopup(false);
        _scoreContext.resetGameSubmissionReport();
    }

    const handleHoleClick = (prop: IsValidProps | null) => {
        if(prop) {
            _courseContext.updateCurrentHole(prop.holeNumber);
            _playerContext.updateCurrentPlayer(prop.firstPlayer);
            _scoreContext.resetGameSubmissionReport();
        }
        
    }

    return (
        <div className='unfinished-game'>
            <div className='title'>Oops!</div>
            <div className='subtitle'>some players have missing scores.<br/>Please fix the scores for the following holes:</div>

            <div className='holes-container'>
                {
                    /*
 if(showComplete || showWarning) {
                                if(showComplete) {
                                    icon = _gameContext.getAssetByID('completed-hole');
                                }
                                else{
                                    icon = _gameContext.getAssetByID('incomplete-hole');
                                }
                            }
                    */
                _courseContext.getCurrentCourse().holes.map((hole, index) => {
                    let properBackground = _gameContext.getAssetByID('gameplay-round-button');
                    let className = '';
                    let IsHoleInvalid = isInvalid(hole.number);
                    if (IsHoleInvalid) {
                        console.log(IsHoleInvalid);
                        className = 'invalid';
                        properBackground = _gameContext.getAssetByID('gameplay-round-active-button')
                    }
                    return <div onClick={() => handleHoleClick(IsHoleInvalid)} className={`hole ${className}`} key={index}
                    style={{
                        backgroundImage: StyleHelper.format_css_url(properBackground)
                    }}><span>{hole.number}</span></div>
                })
            } </div>

<div className='finalize-button' onClick={handleBackButton} style={{
        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('settings-button'))
      }}>Back</div>

        </div>
    )
}

export default UnfinishedGame
