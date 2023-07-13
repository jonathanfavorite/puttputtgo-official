import React, { useContext } from 'react'
import { Icons } from '../../atoms/Icons'
import './ShareGames.scss';
import { GameContext } from '../../../contexts/GameContext';


function ShareGames() {
    const _gameContext = useContext(GameContext);
  return (
    <div className='share-game-wrap'>
        <div className='icon facebook'><a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.favoritecreative.com/puttputtgo/sharer.php?customerKey=${_gameContext.companyData.customerID}&gameID=${_gameContext.gameID}`}><Icons.Facebook /></a></div>
        <div className='icon twitter'><Icons.Twitter /></div>
        <div className='icon message'><Icons.Message /></div>
    </div>
  )
}

export default ShareGames