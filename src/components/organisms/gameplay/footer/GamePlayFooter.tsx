import React, {useContext, useEffect, useRef} from 'react'
import {GameContext} from '../../../../contexts/GameContext';
import StyleHelper from '../../../../helpers/StyleHelper';
import {PlayerContext} from '../../../../contexts/PlayerContext';
import {ScoreContext} from '../../../../contexts/ScoreContext';
import ScoreModel from '../../../../models/score/ScoreModel';
import {CourseContext} from '../../../../contexts/CourseContext';
import {TransitionContext} from '../../../../contexts/TransitionContext';
import HoleModel from '../../../../models/hole/HoleModel';
import {GameSubmissionReport} from '../../../../models/game/GameSubmissionReportModel';
import PlayerModel from '../../../../models/player/PlayerModel';
import { Icons } from '../../../atoms/Icons';
import { useNavigate } from 'react-router-dom';

function GamePlayFooter() {
    const navigate = useNavigate();
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


    const [nextHoleButtonText, setNextHoleButtonText] = React.useState < string > (_gameContext.getPlainTextByID("gameplay:clear"));
    const [nextHoleButtonBackgroundColor, setNextHoleButtonBackgroundColor] = React.useState < string > ('green');
    const [showFinishGameButton, setShowFinishGameButton] = React.useState < boolean > (false);
    const nextHoleButtonRef = useRef < HTMLDivElement > (null);

    const defaultHoleTextSize = '2.3rem';
    const smallTextHoleSize = '1.5rem';
    const [nextHoleTextSize, setNextHoleTextSize] = React.useState < string > (defaultHoleTextSize);
    useEffect(() => {
        if (nextHoleButtonRef.current) {
            console.log("triggering", nextHoleButtonRef.current.querySelector('span')!.innerText.length);
            if (nextHoleButtonRef.current.querySelector('span')!.innerText.length >= 10) {
                setNextHoleTextSize('1.3rem');
            } else if (nextHoleButtonRef.current.querySelector('span')!.innerText.length >= 8) {
                setNextHoleTextSize(smallTextHoleSize);
            } else {
                setNextHoleTextSize(defaultHoleTextSize);
            }
            console.log("size", nextHoleTextSize);

        }
    }, [nextHoleButtonRef]);

    useEffect(() => {
        let timer: any;
        if (showFinishGameButton) {
            if (nextHoleButtonRef.current != null) {
                let i = 0;
                timer = setInterval(() => {

                    if (i % 2 == 0) {
                        nextHoleButtonRef.current ?. classList.remove('darken');
                    } else {
                        nextHoleButtonRef.current ?. classList.add('darken');
                    }
                    // setNextHoleButtonBackgroundColor()
                    ++ i;
                }, 500);
            }

        } else {
            nextHoleButtonRef.current ?. classList.remove('darken');
            clearInterval(timer);
        }
        return() => {
            clearInterval(timer);
        }

    }, [showFinishGameButton]);


    // CLEAR / NEXT PLAYER BUTTON / NEXT HOLE BUTTON
    const handleNextHoleClick = () => {


        let removeMe = {
            courseID: _courseContext.getCurrentCourse().ID,
            playerID: _playerContext.getCurrentPlayer().id,
            holeID: _courseContext.getCurrentHole().number,
            score: -10
        }

        let holesRemaining = _courseContext.holesRemaining();

        console.log("holes remaining", holesRemaining)
        if (holesRemaining <= 1) { // last hole
            let lastHole = _courseContext.getCurrentCourse().holes[_courseContext.getCurrentCourse().holes.length - 1];
            if (_courseContext.getCurrentHole().number == lastHole.number) {
                console.log("this is the last hole");
                let gameReport = GetGameSubmissionReport();
                console.log(gameReport);
                if (gameReport.invalidHoles.length > 0) {
                    if(showFinishGameButton)
                    {
                        _scoreContext.addGameSubmissionReport(gameReport);
                        setNextHoleButtonText(_gameContext.getPlainTextByID("gameplay:clear"));
                        setShowFinishGameButton(false);
                        console.log("showing modal");
                    }
                    else
                    {
                        _scoreContext.removeScore(removeMe);
                    console.log("removing score~", removeMe);
                    }
                   

                } else {

                    _scoreContext.addGameSubmissionReport({invalidHoles: []});
                    _gameContext.toggleShowFinalGamePopup(true);
                    console.log("showing final game popup");
                }
            } else {
                console.log("not the last hole");
                _scoreContext.removeScore(removeMe);
            }
        } else { // they are not on final hole
            console.log("5");
            _scoreContext.removeScore(removeMe);
            console.log("removing score 2", removeMe);
        }
    }

    const scrollToPlayerWhoHasNotGone = (playerID : number) => {
        _playerContext.updateCurrentPlayer(playerID);
    }

    const [clickedAddScoreButton, setClickedAddScoreButton] = React.useState < ScoreModel | null > (null);
    const [movingToNextPlayer, setMovingToNextPlayer] = React.useState < boolean > (false);

    useEffect(() => {
        let lastHole = _courseContext.getCurrentCourse().holes[_courseContext.getCurrentCourse().holes.length - 1].number;
        let isLastHole = _courseContext.getCurrentHole().number == lastHole;
        if(isLastHole)
        {
            let playersRemaining = _scoreContext.hasEveryPlayerPlayedThisHole(lastHole);
            if(playersRemaining.length <= 0)
            {
                setNextHoleButtonText("finish game");
                setShowFinishGameButton(true);
            }
            else
            {
                setNextHoleButtonText("Clear");
                                setShowFinishGameButton(false);
            }
        }
        else
        {
            setNextHoleButtonText("Clear");
                                setShowFinishGameButton(false);
        }
    }, [_courseContext.getCurrentHole().number]);

    useEffect(() => {

      
    
      

        if (clickedAddScoreButton != null) {
            let playersRemaining = _scoreContext.hasEveryPlayerPlayedThisHole(_courseContext.getCurrentHole().number);
            let doesNextHoleHaveScores = _scoreContext.hasAnyPlayerPlayedThisHole(_courseContext.getCurrentHole().number + 1);
            // console.table({
            //     playersRemaining, 
            //     doesNextHoleHaveScores 
            // });
            //console.log("score was added, acting accordingly");
            _playerContext.toggleNextPlayer();
            if (playersRemaining.length <= 0) {
                console.log("%c no players need scores", 'background: pink; color: black;');
                if (doesNextHoleHaveScores) { 
                    // do not move to next hole, this person is obviously editing their previous scores
                    // console log with background color
                   // console.log("%c next hole does have scores", 'background: yellow; color: black;');
                } 
                else { 
                   
                    // no players need scores, move to next hole
                    let lastHole = _courseContext.getCurrentCourse().holes[_courseContext.getCurrentCourse().holes.length - 1].number;
                    let secondHoleFromLastHole = _courseContext.getCurrentCourse().holes[_courseContext.getCurrentCourse().holes.length - 2].number;
                    let currentHole = _courseContext.getCurrentHole().number;
                    if(secondHoleFromLastHole == currentHole || lastHole == currentHole)
                    {
                        if(lastHole == currentHole)
                        {
                            if(playersRemaining.length <= 0)
                            {
                                setNextHoleButtonText("finish game");
                                setShowFinishGameButton(true);
                            }
                            else
                            {
                                //console.log("%c this is the last hole", 'background: red; color: black;');
                                _gameContext.saveToLocalStorageAsync();
                                setTimeout(() => {
                                    _courseContext.toggleNextHole();
                                    _playerContext.updateCurrentPlayer(0);
                                }, 300);
                            }    
                        }
                        else
                        {
                           // console.log("%c this is the second to last hole", 'background: green; color: white;');
                            _transitionContext.updateHeadingText(`final round`);
                            _transitionContext.updateDescText(`prepare yourself`);
                            setMovingToNextPlayer(true);
                            _gameContext.saveToLocalStorageAsync();
                            setTimeout(() => {
                                _courseContext.toggleNextHole();
                                _playerContext.updateCurrentPlayer(0);
                            }, 300);
                        }
                       
                    }
                    else
                    {
                        //console.log("%c moving to next player", 'background: gray; color: black;');
                        nextHoleTransitionTexts();
                        setMovingToNextPlayer(true);
                        _gameContext.saveToLocalStorageAsync();
                        setTimeout(() => {
                            _courseContext.toggleNextHole();
                            _playerContext.updateCurrentPlayer(0);
                        }, 300);
                    }
                }
            }
        }
    }, [clickedAddScoreButton]);

    const handleScoreAddClick = (value : number) => {

        let score: ScoreModel = {
            courseID: _courseContext.getCurrentCourse().ID,
            playerID: _playerContext.getCurrentPlayer().id,
            holeID: _courseContext.getCurrentHole().number,
            score: value
        }

        _scoreContext.addScore(score);
        setClickedAddScoreButton(score);
    }

    useEffect(() => {
        if (movingToNextPlayer) {
            _transitionContext.handleAnimationToggle();
            setMovingToNextPlayer(false);
        }
    }, [movingToNextPlayer]);

    const scrollToActivePlayer = () => {
        let activePlayer = document.querySelector('.active-player');
        if (activePlayer) {
            if (activePlayer.getAttribute('data-id') == '0') {
                setTimeout(() => {
                    activePlayer !.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                }, 400); // adjust delay as needed
            } else {
                setTimeout(() => {
                    activePlayer !.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                }, 300); // adjust delay as needed
            }

        }
    }


    const GetGameSubmissionReport = () : GameSubmissionReport => {
        let missingScores: GameSubmissionReport = {
            invalidHoles: []
        }
        _courseContext.getCurrentCourse().holes.forEach(hole => {
            _playerContext.getAllPlayers().forEach(player => {
                let score = _scoreContext.getScoreByHoleAndPlayer(hole.number, player.id);
                if (score == null || score == -10) { // only add to missingScores.invalidHoles if the hole is not already in the array
                    if (missingScores.invalidHoles.filter(x => x.hole.number == hole.number).length == 0) { // console.log("NOT");
                        missingScores.invalidHoles.push({
                            hole: hole,
                            playerIDs: [player.id]
                        });
                    } else {
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
                            <div className='row'
                                key={index}>
                                {
                                row.map((score, index) => {
                                    return (
                                        <button onClick={
                                                () => handleScoreAddClick(score)
                                            }
                                            className='score'
                                            key={index}
                                            style={
                                                {
                                                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-score-button'))
                                                }
                                        }>
                                            {score}</button>
                                    )
                                })
                            } </div>
                        )
                    })
                } </div>
            </div>

            <div className='options-group'>
                <div className='clear-button' onClick={handleNextHoleClick} ref={nextHoleButtonRef} style={
                    {
                        fontSize: nextHoleTextSize,
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-next-hole-button')),
                        backgroundColor: nextHoleButtonBackgroundColor
                    }}><span>{nextHoleButtonText}</span></div>
                    <div className='smaller-options'>
                        <div className='option-indi' onClick={() => _gameContext.updateSnapPictureEnabled(true)} style={
                    {
                        fontSize: nextHoleTextSize,
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-next-hole-button')),
                        backgroundColor: "#063306"
                    }}><Icons.Camera /></div>
                        <div className='option-indi'
                        onClick={() => navigate("/" + _gameContext.companyData.customerID + "/settings") }
                        style={
                    {
                        fontSize: nextHoleTextSize,
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-next-hole-button')),
                        backgroundColor: "#1e1c1c"
                    }}><Icons.Settings /></div>
                    </div>
            </div>

            {/* <button ref={nextHoleButtonRef}
                onClick={handleNextHoleClick}
                className='next-hole'
                style={
                    {
                        fontSize: nextHoleTextSize,
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-next-hole-button')),
                        backgroundColor: nextHoleButtonBackgroundColor
                    }
            }>
                <span>{nextHoleButtonText}<br/></span>
            </button> */}
        </div>
    )
}

export default GamePlayFooter
