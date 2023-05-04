import React, {useContext} from 'react'
import './ResultsPage.scss';
import ConfettiCanvas from './confettiCanvas';

import {GameContext} from '../../../contexts/GameContext';
import StyleHelper from '../../../helpers/StyleHelper';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';
import {useNavigate, useParams} from 'react-router-dom';
import {formatRGBToCSS} from '../../../contexts/PlayerContext';

function ResultsPage() {
    const _gameContext = useContext(GameContext);
    const {business_name} = useParams();
    const navigate = useNavigate();

    return (
        <DataAssuranceHOC companyParam={
            business_name ! ? business_name : "default"
        }>
            <div className='results-page'>

                <div className='header'>
                    <div className='left'>menu</div>
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
                                                    {
                                                        r: 255,
                                                        g: 0,
                                                        b: 255
                                                    },
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
                                <div className='name'>Jessica</div>
                                <div className='score'>Score: 100</div>
                            </div>
                        </div>
                        <div className='winner-text'>
                            Bravo, noble golfer!<br/>You've conquered the treacherous Castle Golf realm and emerged victorious!
                        </div>

                    </div>



                    <div className='result-list'>
                        <div className='result-list-header'>
                          <div className='left'></div>
                          <div className='text'>results</div>
                          <div className='right'></div>
                            
                        </div>
                        {
                          Array.from(Array(4).keys()).map((item, index) => {
                            let randomRGB = {
                                r: Math.floor(Math.random() * 255),
                                g: Math.floor(Math.random() * 255),
                                b: Math.floor(Math.random() * 255)
                            }
                            return <>
                            <div className='list-item'>
                            <div className='left'>
                            <div className='ball-color-container'>
                                    <div className='ball-color'
                                        style={
                                            {
                                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                                backgroundColor: formatRGBToCSS(
                                                  randomRGB,
                                                    1
                                                )
                                            }
                                    }></div>
                                </div>
                            </div>
                            <div className='right'>
                                player {index + 1}
                            </div>
                        </div>
                        </>
                          })
                        }
                        
                    </div>





                </div>
            </div>
        </DataAssuranceHOC>
    )
}

export default ResultsPage
