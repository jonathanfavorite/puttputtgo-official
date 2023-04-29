import React, { useContext } from 'react'
import StyleHelper from '../../../../helpers/StyleHelper';
import { GameContext } from '../../../../contexts/GameContext';
import { PlayerContext, formatRGBToCSS } from '../../../../contexts/PlayerContext';
import { ScoreContext } from '../../../../contexts/ScoreContext';
import { CourseContext } from '../../../../contexts/CourseContext';

function PlayersContainer() {

    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);
    const _scoreContext = useContext(ScoreContext);
    const _courseContext = useContext(CourseContext);
    
    const handlePlayerClick = (playerID: number) => {
        _playerContext.updateCurrentPlayer(playerID);
    }

    return (
        <div className='player-container'>
            {
            _playerContext.getAllPlayers().sort().map((player, index) => {
                let active = index === _playerContext.getCurrentPlayer().id ? 'active-player' : '';
                return (
                    <div className={
                            `player ${active}`
                        }
                        onClick={() => handlePlayerClick(player.id)}
                        key={index}
                        style={
                            {
                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-background'))
                            }
                    }>
                        <div className='ball-color-container'>
                            <div className='ball-color'
                                style={
                                    {
                                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                        backgroundColor: formatRGBToCSS(player.color!, 1)
                                    }
                            }></div>
                        </div>
                        <div className='player-details'
                            style={
                                {
                                    color: 'white'
                                }
                        }>
                            <div className='name'>
                                {
                                player.name
                            }</div>
                            <div className='totalScore'>Score:
                                <b>{_scoreContext.getPlayerTotalScore(player.id)}</b>
                            </div>
                        </div>
                        <div className='player-round-score'>
                            <div className='round-score' style={
                                {
                                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-score-background'))
                                }
                            }>
                                <span>{_scoreContext.getScoreByHoleAndPlayer(_courseContext.getCurrentHole().number, player.id) == -10 ? "" : _scoreContext.getScoreByHoleAndPlayer(_courseContext.getCurrentHole().number, player.id)}</span></div>
                        </div>
                    </div>
                )
            })
        } </div>
    )
}

export default PlayersContainer
