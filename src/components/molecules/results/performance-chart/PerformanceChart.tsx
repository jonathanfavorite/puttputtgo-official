import React, { useContext, useState } from 'react'
import './PerformanceChart.scss';
import { GameContext } from '../../../../contexts/GameContext';
import PlayerModel from '../../../../models/player/PlayerModel';
import StyleHelper from '../../../../helpers/StyleHelper';
import { PlayerContext, formatRGBToCSS } from '../../../../contexts/PlayerContext';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface Props {
    flatPerformanceData: any[];
    playerColors: any;
}


function PerformanceChart(props: Props) {
    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);

    const [activePerformanceOverview, setActivePerformanceOverview] = useState<PlayerModel | null>(null);
    const [dropdownActive, setDropdownActive] = useState<boolean>(false);


    const handlePlayerPerformanceClicked = (player: PlayerModel | null) => {
        setActivePerformanceOverview(player);
        setDropdownActive(false);
    }

    const handleDropdownClicked = () => {
        setDropdownActive(!dropdownActive);
    }


  return (
    <div className='performance-wrap'>
                            <div className='title'>{_gameContext.getPlainTextByID("results:performances")}</div>
                            <div className='performance-dropdown'>
                                <div className='selected-option' onClick={handleDropdownClicked}>
                                    <div className='display'>
                                        <div className='icon'></div>
                                        <div className='text'>{activePerformanceOverview ? activePerformanceOverview.name : _gameContext.getPlainTextByID("results:performance-all")}</div>
                                    </div>
                                    <div className='close'>
                                        <div className='icon' onClick={handleDropdownClicked} style={{
                                            backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('performance-caret')),
                                            transform: dropdownActive ? 'rotate(180deg)' : 'rotate(0deg)'
                                        }}></div>
                                    </div>
                                </div>
                                <div className='list' style={{
                                    display: dropdownActive ? 'block' : 'none'
                                }}>
                                    
                                    {activePerformanceOverview && <div className='item' onClick={() => handlePlayerPerformanceClicked(null)}>
                                        <div className='icon'></div>
                                        <div className='text'>{_gameContext.getPlainTextByID("results:performance-all")}</div>
                                    </div>
}

                                    {_playerContext.getAllPlayers().map((player, index) => {
                                        if(activePerformanceOverview) {
                                            if(activePerformanceOverview.id === player.id) {
                                                return null;
                                            }
                                        }
                                        return <div key={index} className='item' onClick={() => handlePlayerPerformanceClicked(player)}>
                                        <div className='icon'
                                        style={
                                            {
                                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                                backgroundColor: formatRGBToCSS(player.color !, 1)
                                            }
                                    }></div>
                              
                                        <div className='text'>{player.name}</div>
                                    </div>
                                    })}
                                    
                                </div>
                            </div>
                            <div className='performance-chart'>
                            <ResponsiveContainer width={'100%'} height={'100%'}>
    <LineChart margin={{
        top:0,
        left:0,
        bottom: 0,
        right: 0
    }} data={props.flatPerformanceData}>

       {_playerContext.getAllPlayers().map((player, index) => { 
           const rgb = props.playerColors[`player${player.id}`];
           const notActiveRGB = `rgba(129, 104, 104, 0.5)`;
           let correctedColor = rgb;
           if(activePerformanceOverview) {
                if(activePerformanceOverview.id !== player.id) {
                     correctedColor = notActiveRGB;
                }
           }
            return <Line type="monotone" dataKey={`player${player.id}`} strokeWidth={3} dot={false} stroke={correctedColor} key={index} />;
        })}
    </LineChart>
      {/* <LineChart data={dummyData}>
        <Line type="monotone" dataKey="player1" stroke="blue" />
        <Line type="monotone" dataKey="player2" stroke="red" />
    </LineChart> */}
</ResponsiveContainer>
                            </div>
                        </div>
  )
}

export default PerformanceChart