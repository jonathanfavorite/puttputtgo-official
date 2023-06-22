import React, { useContext, useEffect } from 'react'
import { GameContext } from '../../../../contexts/GameContext';
import StyleHelper from '../../../../helpers/StyleHelper';
import { PlayerContext } from '../../../../contexts/PlayerContext';
import { ScoreContext } from '../../../../contexts/ScoreContext';
import ScoreModel from '../../../../models/score/ScoreModel';
import { CourseContext } from '../../../../contexts/CourseContext';
import { TransitionContext } from '../../../../contexts/TransitionContext';

function GamePlayFooter() {
    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);
    const _scoreContext = useContext(ScoreContext);
    const _courseContext = useContext(CourseContext);
    const _transitionContext = useContext(TransitionContext);
    let scores_layout = [
        [
            1, 2, 3
        ],
        [
            4, 5, 6
        ],
        [
            -1, 7, 0
        ]
    ];

    const nextHoleTransitionTexts = () => {
        let nextHole = _courseContext.getCurrentHole().number + 1;
        _transitionContext.updateHeadingText(`Round ${nextHole}`);
        _transitionContext.updateDescText(``);
    };
    

    const handleNextHoleClick = () => {
        if(_courseContext.holesRemaining() <= 1) {
        }
        else
        {
            let playersWhoHaventGone = _scoreContext.hasEveryPlayerPlayedThisHole(_courseContext.getCurrentHole().number);

            if(playersWhoHaventGone.length <= 0)
            {
                _courseContext.toggleNextHole();
                //_gameContext.saveToLocalStorage();
                nextHoleTransitionTexts();
                setTimeout(() => {
                    _courseContext.toggleNextHole();
                    _playerContext.updateCurrentPlayer(0);
                }, 1500);
                
            }
            else
            {
                scrollToPlayerWhoHasNotGone(playersWhoHaventGone[0].playerID);
            }
        }
        
    }

    const scrollToPlayerWhoHasNotGone = (playerID: number) => {
        _playerContext.updateCurrentPlayer(playerID);
    }

    const handleScoreAddClick = (value: number) => {
        let score : ScoreModel = {
            courseID: _courseContext.getCurrentCourse().ID,
            playerID: _playerContext.getCurrentPlayer().id,
            holeID: _courseContext.getCurrentHole().number,
            score: value
        }
      _scoreContext.addScore(score);

      let playersWhoHaventGone = _scoreContext.hasEveryPlayerPlayedThisHole(_courseContext.getCurrentHole().number);
      
      if(_playerContext.getCurrentPlayer().id == _playerContext.getLastPlayer().id)
      {

        if(playersWhoHaventGone.length > 0 && playersWhoHaventGone[0].playerID != _playerContext.getCurrentPlayer().id)
        {
            scrollToPlayerWhoHasNotGone(playersWhoHaventGone[0].playerID);
        }
        else
        {
            _gameContext.saveToLocalStorage();
            nextHoleTransitionTexts();
            setTimeout(() => {
                _courseContext.toggleNextHole();
                _playerContext.updateCurrentPlayer(0);
            }, 300);
           
        }
      }
      else
      {
        _playerContext.toggleNextPlayer();
      }
       // scrollToActivePlayer();
    }

    useEffect(() => {
       _transitionContext.handleAnimationToggle();
    }, [_courseContext.getCurrentHole()]);

    const scrollToActivePlayer = () => {
        let activePlayer = document.querySelector('.active-player');
        if (activePlayer) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                   activePlayer!.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                });
            });
        }
    }

    useEffect(() => {
        scrollToActivePlayer();
    }, [_playerContext.getCurrentPlayer()]);
  return (
    <div className='footer-content'>
                    <div className='numbers-wrap'>
                        <div className='numbers'>
                            {
                            scores_layout.map((row, index) => {
                                return (
                                    <div 
                                    className='row'
                                        key={index}>
                                        {
                                        row.map((score, index) => {
                                            return (
                                                <button 
                                                onClick={() => handleScoreAddClick(score)}
                                                className='score'
                                                    key={index}  style={
                                                      {
                                                          backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-score-button'))
                                                      }}>
                                                    {score}</button>
                                            )
                                        })
                                    } </div>
                                )
                            })
                        } </div>
                    </div>
                    <button
                    onClick={handleNextHoleClick}
                    className='next-hole' style={
                {
                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-next-hole-button'))
                }}>
                        <span>Next Player<br/></span>
                    </button>
                </div>
  )
}

export default GamePlayFooter