import React, { useContext, useEffect, useRef } from 'react'
import { GameContext } from '../../../../contexts/GameContext';
import StyleHelper from '../../../../helpers/StyleHelper';
import { PlayerContext } from '../../../../contexts/PlayerContext';
import { ScoreContext } from '../../../../contexts/ScoreContext';
import ScoreModel from '../../../../models/score/ScoreModel';
import { CourseContext } from '../../../../contexts/CourseContext';
import { TransitionContext } from '../../../../contexts/TransitionContext';
import HoleModel from '../../../../models/hole/HoleModel';
import { GameSubmissionReport } from '../../../../models/game/GameSubmissionReportModel';
import PlayerModel from '../../../../models/player/PlayerModel';

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

        
    const [nextHoleButtonText, setNextHoleButtonText] = React.useState<string>(_gameContext.getPlainTextByID("gameplay:next-player"));
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
        else 
        {
            clearInterval(timer);
        }
        return () => {
            clearInterval(timer);
        }

    }, [showFinishGameButton]);



    // NEXT PLAYER BUTTON / NEXT HOLE BUTTON
    const handleNextHoleClick = () => {

    if(_courseContext.holesRemaining() <= 1) {
                    
        console.log("last hole");
        let lastHole = _courseContext.getCurrentCourse().holes[_courseContext.getCurrentCourse().holes.length - 1];
        if(_courseContext.getCurrentHole().number == lastHole.number)
        {
            let gameReport = GetGameSubmissionReport();
            if(gameReport.invalidHoles.length > 0)
            {
                // let table = [];
                // for(let i = 0; i < gameReport.invalidHoles.length; i++)
                // {
                //     let currentHole = gameReport.invalidHoles[i];
                //     table.push([currentHole.hole.number, currentHole.playerIDs.join(", ")]);
                // }
                // console.table(table);
                _scoreContext.addGameSubmissionReport(gameReport);
                setShowFinishGameButton(false);

            }
            else{
                _scoreContext.addGameSubmissionReport({invalidHoles: []});
                _gameContext.toggleShowFinalGamePopup(true);
                
            }
            //_gameContext.saveToLocalStorageAsync();
          //_gameContext.toggleShowFinalGamePopup(true);
        }
        else{
           // alert('pressed');
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
                console.log("last player");
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
                //console.log("saving");
              _playerContext.toggleNextPlayer();
              
              timeout = setTimeout(() => {
                //_gameContext.saveToLocalStorageAsync();
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
            if(activePlayer.getAttribute('data-id') == '0')
            {
                setTimeout(() => {
                    activePlayer!.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                }, 400); // adjust delay as needed
            }
            else{
                setTimeout(() => {
                    activePlayer!.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                }, 300); // adjust delay as needed
            }
           
        }
    }



    const GetGameSubmissionReport = () : GameSubmissionReport => {
        let missingScores : GameSubmissionReport = {
            invalidHoles: []
        }
        _courseContext.getCurrentCourse().holes.forEach(hole => {
            _playerContext.getAllPlayers().forEach(player => {
                let score = _scoreContext.getScoreByHoleAndPlayer(hole.number, player.id);
                if(score == null || score == -10)
                {
                    // only add to missingScores.invalidHoles if the hole is not already in the array
                    if(missingScores.invalidHoles.filter(x => x.hole.number == hole.number).length == 0)
                    {
                        //console.log("NOT");
                        missingScores.invalidHoles.push({
                            hole: hole,
                            playerIDs: [player.id]
                        });
                    }
                    else
                    {
                        let invalidHole = missingScores.invalidHoles.filter(x => x.hole.number == hole.number)[0];
                        invalidHole.playerIDs.push(player.id);
                    }
                }
            });
        });
        return missingScores;
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