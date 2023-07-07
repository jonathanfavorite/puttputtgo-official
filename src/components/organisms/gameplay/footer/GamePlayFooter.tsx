import React, { useContext, useEffect, useRef } from 'react'
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

        
    const [nextHoleButtonText, setNextHoleButtonText] = React.useState<string>('Next Player');
    const [nextHoleButtonBackgroundColor, setNextHoleButtonBackgroundColor] = React.useState<string>('green');
    const [showFinishGameButton, setShowFinishGameButton] = React.useState<boolean>(false);
    const nextHoleButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        let timer : any;
        if(showFinishGameButton)
        {
            if(nextHoleButtonRef.current != null)
            {
                let i = 0;
                timer = setInterval(() => {
                    
                    if(i % 2 == 0)
                    {
                        nextHoleButtonRef.current?.classList.remove('darken');
                    }
                    else{
                        nextHoleButtonRef.current?.classList.add('darken');
                    }
                    //setNextHoleButtonBackgroundColor()
                    ++i;
                },500);
            }
            
        }
        return () => {
            clearInterval(timer);
        }

    }, [showFinishGameButton]);



    // NEXT PLAYER BUTTON / NEXT HOLE BUTTON
    const handleNextHoleClick = () => {

    if(_courseContext.holesRemaining() <= 1) {
                    
        let lastHole = _courseContext.getCurrentCourse().holes[_courseContext.getCurrentCourse().holes.length - 1];
        if(_courseContext.getCurrentHole().number == lastHole.number)
        {
            _gameContext.saveToLocalStorageAsync();
          _gameContext.toggleShowFinalGamePopup(true);
        }
    }
        
    }

    const scrollToPlayerWhoHasNotGone = (playerID: number) => {
        _playerContext.updateCurrentPlayer(playerID);
    }

    const [clickedAddScoreButton, setClickedAddScoreButton] = React.useState<ScoreModel | null>(null);
    const [movingToNextPlayer, setMovingToNextPlayer] = React.useState<boolean>(false);

    useEffect(() => {
        let timeout : any;
        if(clickedAddScoreButton != null)
        {
           
           

            let playersWhoHaventGone = _scoreContext.hasEveryPlayerPlayedThisHole(_courseContext.getCurrentHole().number);
            
            if(_playerContext.getCurrentPlayer().id == _playerContext.getLastPlayer().id)
            {
      
              if(playersWhoHaventGone.length > 0 && playersWhoHaventGone[0].playerID != _playerContext.getCurrentPlayer().id)
              {
                  scrollToPlayerWhoHasNotGone(playersWhoHaventGone[0].playerID);
              }
              else
              {
               
                    _gameContext.saveToLocalStorageAsync();
                    
                    if(_courseContext.holesRemaining() <= 1) {
                    
                        let lastHole = _courseContext.getCurrentCourse().holes[_courseContext.getCurrentCourse().holes.length - 1];
                        if(_courseContext.getCurrentHole().number == lastHole.number)
                        {
                          //_gameContext.toggleShowFinalGamePopup(true);
                            setNextHoleButtonText("finish game");
                            //setNextHoleButtonBackgroundColor("red");
                            setShowFinishGameButton(true);
                        }
                        else
                        {
                            _transitionContext.updateHeadingText(`final round`);
                            _transitionContext.updateDescText(`prepare yourself`);
                            //nextHoleTransitionTexts();
                            setMovingToNextPlayer(true);

                            setTimeout(() => {
                                _courseContext.toggleNextHole();
                                  _playerContext.updateCurrentPlayer(0);
                              }, 300);
                        }
                    }
                    else {
                        nextHoleTransitionTexts();
                        setMovingToNextPlayer(true);
                        setTimeout(() => {
                            _courseContext.toggleNextHole();
                              _playerContext.updateCurrentPlayer(0);
                          }, 300);
                    }

                  
                 
              }
            }
            else
            {
              _playerContext.toggleNextPlayer();
              timeout = setTimeout(() => {
                _gameContext.saveToLocalStorageAsync();
              }, 300);

             
              
            }
            setClickedAddScoreButton(null);
        }

        return () => {
            clearTimeout(timeout);
          }
    }, [clickedAddScoreButton]);

    const handleScoreAddClick = (value: number) => {
       
        let score : ScoreModel = {
            courseID: _courseContext.getCurrentCourse().ID,
            playerID: _playerContext.getCurrentPlayer().id,
            holeID: _courseContext.getCurrentHole().number,
            score: value
        }
        
      
        _scoreContext.addScore(score);
        setClickedAddScoreButton(score);

     
       // scrollToActivePlayer();
    }

    useEffect(() => {
        if(movingToNextPlayer)
        {
            _transitionContext.handleAnimationToggle();
            setMovingToNextPlayer(false);
        }
    }, [movingToNextPlayer]);

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
                    ref={nextHoleButtonRef}
                    onClick={handleNextHoleClick}
                    className='next-hole' style={
                {
                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-next-hole-button')),
                    backgroundColor: nextHoleButtonBackgroundColor
                }}>
                        <span>{nextHoleButtonText}<br/></span>
                    </button>
                </div>
  )
}

export default GamePlayFooter