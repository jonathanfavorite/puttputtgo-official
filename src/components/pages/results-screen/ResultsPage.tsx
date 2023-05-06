import React, {Fragment, useContext, useEffect, useRef} from 'react'
import './ResultsPage.scss';
import ConfettiCanvas from './confettiCanvas';

import {GameContext, GameStatus} from '../../../contexts/GameContext';
import StyleHelper from '../../../helpers/StyleHelper';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';
import {useNavigate, useParams} from 'react-router-dom';
import {PlayerContext, formatRGBToCSS} from '../../../contexts/PlayerContext';
import { ScoreContext } from '../../../contexts/ScoreContext';
import LeaderboardModel from '../../../models/score/LeaderboardModel';
import { CourseContext } from '../../../contexts/CourseContext';

function ResultsPage() {
    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);
    const _courseContext = useContext(CourseContext);
    const _scoreContext = useContext(ScoreContext);
    const {business_name} = useParams();
    const navigate = useNavigate();


    const GetFirstPlacePlayer = () : LeaderboardModel => {
        return _scoreContext.getAllPlayersScores()[0];
    }

    useEffect(() => {
        console.log(_playerContext.getAllPlayers());
        _gameContext.updateGameStatus(GameStatus.Finished);
    }, []);

    
  const textRef = useRef<HTMLDivElement | null>(null);

  function adjustFontSize() {
    if (textRef.current) {
        console.log(textRef.current);
      const textLength = textRef.current.textContent!.length;
      const baseFontSize = 5;
      const threshold = 1;

      if (textLength > threshold) {
        const newFontSize = baseFontSize - (textLength - threshold) * 0.2;
        textRef.current.style.fontSize = `${newFontSize}rem`;
      } else {
        textRef.current.style.fontSize = `${baseFontSize}rem`;
      }
    }
  }

  useEffect(() => {
    if(textRef.current)
    {
        adjustFontSize();
    }
    
  }, [textRef]);

    return (
        <DataAssuranceHOC companyParam={
            business_name ! ? business_name : "default"
        }>
            <div className='results-page'>

                <div className='header'>
                    <div className='left' onClick={() => navigate("/")}>menu</div>
                    <div className='center'></div>
                    <div className='right'>share</div>

                </div>
                <div className='body'>
                    <div className='winner-top'
                        style={
                            {
                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("results-background"))
                            }
                    }>
                      <div className='gradient'style={
                            {
                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("results-gradient"))
                            }
                    }></div>

                        <div className='winner-content'>
                            <div className='winner-left'>
                                <div className='ball-color-container'>
                                    <div className='ball-color'
                                        style={
                                            {
                                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                                backgroundColor: formatRGBToCSS(
                                                    GetFirstPlacePlayer().player.color!,
                                                    1
                                                )
                                            }
                                    }></div>
                                </div>
                            </div>
                            <div className='winner-right'>
                                <ConfettiCanvas/>

                                <div className='title'><img src={
                                            _gameContext.getAssetByID("crown") ?. assetLocation
                                        }
                                        className='crown'/><span>winner</span>
                                </div>
                               
                                <div className='name' ref={textRef}>{GetFirstPlacePlayer().player.name}</div>
                                <div className='score'>Score: {GetFirstPlacePlayer().score}</div>
                            </div>
                        </div>
                        <div className='winner-text'>
                            Bravo, noble golfer!<br/>You've conquered the treacherous Castle Golf realm and emerged victorious!
                        </div>

                    </div>



                    <div className='result-list content'>
                        <div className='result-list-header results-header'>
                          <div className='left'></div>
                          <div className='text'>results</div>
                          <div className='right'></div>
                            
                        </div>
                        {
                           _scoreContext.getAllPlayersScores().map((score, index) => {

                            return <>
                            <div className='list-item'>
                            <div className='left'>
                            <div className='ball-color-container'>
                                    <div className='ball-color'
                                        style={
                                            {
                                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                                backgroundColor: formatRGBToCSS(
                                                 score.player.color!,
                                                    1
                                                )
                                            }
                                    }></div>
                                </div>
                            </div>
                            <div className='right'>
                               {score.player.name}<br />
                               <small>score: {score.score}</small>
                            </div>
                        </div>
                        </>
                          })
                        }
                        
                    </div>
                 

                    {/* <div className='scorecard-wrap content'>
                          <div className='results-header'>
                            <div className='left'></div>
                            <div className='text'>Scorecard</div>
                            <div className='right'></div>                            
                        </div> */}

                        {/* <div className='scorecard-table'>
                            <div className='table-header'>
                            <div className='row'>
                                    <div className='cell header-cell'>Hole</div>
                                    {
                                        Array.from(Array(18).keys()).map((hole, index) => {
                                            return <div className='cell'>{index + 1}</div>
                                        })
                                    }
                          
                                </div>
                            </div>
                           
                                {
                                    _playerContext.getAllPlayers().map((player, index) => {
                                        return <Fragment>
                                             <div className='row'>
                                            <div className='cell header-cell'>{player.name}</div>
                                            {_courseContext.getAllHoles().map((hole, index) => {
                                                return <div className='cell'>{_scoreContext.getScoreByHoleAndPlayer(hole.number, player.id)}</div>
                                            })}
                                            </div>
                                            </Fragment>

                                    })
                                }
                                    {/* <div className='cell header-cell'>Jon</div>
                                    {
                                        Array.from(Array(18).keys()).map((hole, index) => {
                                            return <div className='cell'>0</div>
                                        })
                                    } */}
                          
                               






                </div>
            </div>
        </DataAssuranceHOC>
    )
}

export default ResultsPage
