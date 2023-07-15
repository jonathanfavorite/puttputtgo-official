import React, { useContext } from 'react'
import './GroupComparison.scss';
import StyleHelper from '../../../../helpers/StyleHelper'
import { GameContext } from '../../../../contexts/GameContext';
import { PlayerContext } from '../../../../contexts/PlayerContext';
import { ScoreContext } from '../../../../contexts/ScoreContext';
import { CourseContext } from '../../../../contexts/CourseContext';


interface GroupComparisonValue {
    value: number;
    color: string;
    boxColor: string;
    betterWorse: string;
}


function GroupComparison() {
    const _gameContext = useContext(GameContext);
    const _scoreContext = useContext(ScoreContext);
    const _playerContext = useContext(PlayerContext);
    const _courseContext = useContext(CourseContext);

    const groupComparisonValue = () : GroupComparisonValue =>  {
        //let math = -1 * ((50 - 55) / 55) * 100;
        // Adjusted Percentage Difference = -1 * ((Team Score - Average Group Score) / Average Group Score) * 100
        let players = _playerContext.getAllPlayers();
        let totalScore = 0;
        players.forEach(player => {
            totalScore += _scoreContext.getPlayerTotalScore(player.id);
        });
        totalScore = totalScore / players.length;
        let averageGroupScore = _courseContext.getCurrentCourse().stats.averageGroupScore;
        let math = -1 * ((totalScore - averageGroupScore) / averageGroupScore) * 100;
        let rounded = Math.round(math);
        return {
            value: Math.abs(rounded),
            color: math < 0 ? 'red' : 'green',
            betterWorse: math < 0 ? 'worse' : 'better',
            boxColor: math < 0 ? '#eb4141' : '#517b4b'
        }
    }

    const replaceBetterWorsePlaceHolder = (data: string, compareData: GroupComparisonValue) => {
        let newData = data.replace(/~(.*?)~/g, function(match, p1) {
            return `<span class='color ${compareData.color}'>${p1.replace("NUMX", `${compareData.value}%`)}</span>`;
        });
        return newData;
    }

  return (
    <div className='group-comparison-wrap'>
                            <div className='left'>
                                <div className='box' style={{
                                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('group-comparison-background')),
                                    backgroundColor: groupComparisonValue().boxColor
                                }}>
                                    <div>
                                    <span className='number'>{groupComparisonValue().value}</span>
                                    <span className='percent'>%</span>
                                    </div>
                                </div>
                            </div>
                            <div className='right'>
                                
                                <div className='box-content' dangerouslySetInnerHTML={
                                    {__html: replaceBetterWorsePlaceHolder(_gameContext.getTextByID(`results:${groupComparisonValue().betterWorse}-than`).__html, groupComparisonValue())}
                                    
                                }></div>
                            </div>
                        </div>
  )
}

export default GroupComparison