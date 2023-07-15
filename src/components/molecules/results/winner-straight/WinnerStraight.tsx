import React, { useContext, useEffect, useRef } from 'react'
import StyleHelper from '../../../../helpers/StyleHelper'
import ConfettiCanvas from '../../../pages/results-screen/confettiCanvas'
import { GameContext } from '../../../../contexts/GameContext';
import { formatRGBToCSS } from '../../../../contexts/PlayerContext';
import { CourseContext } from '../../../../contexts/CourseContext';
import { ScoreContext } from '../../../../contexts/ScoreContext';
import { TrueResults } from '../../../../models/results/ResultModels';
import './WinnerStraight.scss';

interface Props {
    results: TrueResults;
}

function WinnerStraight(props: Props) {
    const _gameContext = useContext(GameContext);
    const _scoreContext = useContext(ScoreContext);

    const textRef = useRef < HTMLDivElement | null > (null);

    function adjustFontSize() {
        if (textRef.current) {
            const textLength = textRef.current.textContent !.length;
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
        if (textRef.current) {
            adjustFontSize();
        }
    }, [textRef]);
    
  return (
    <div className='winner-content'>

                            <div className='winner-left'>
                                <div className='ball-color-container'>
                                    <div className='ball-color'
                                        style={
                                            {
                                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                                backgroundColor: formatRGBToCSS( _scoreContext.getAllPlayersScores()[0].player.color !, 1)
                                            }
                                    }></div>
                                </div>
                            </div>
                            <div className='winner-right'>
                                <ConfettiCanvas/>

                                <div className='title'><img src={
                                            _gameContext.getAssetByID("crown") ?. assetLocation
                                        }
                                        className='crown'/><span>{_gameContext.getPlainTextByID("results:winner")}</span>
                                </div>

                                <div className='name'
                                    ref={textRef}>
                                    {
                                    props.results.trueFirstPlace.player.name
                                }</div>
                                <div className='score'>{_gameContext.getPlainTextByID("gameplay:score")}: {
                                    props.results.trueFirstPlace.score
                                }</div>
                            </div>

                        </div>
  )
}

export default WinnerStraight