import React, { useContext } from 'react'
import './HoleInOnePopup.scss'
import StyleHelper from '../../../helpers/StyleHelper'
import { GameContext } from '../../../contexts/GameContext';

function HoleInOnePopup() {
    const _gameContext = useContext(GameContext);
  return (
    <div className='hole-in-one-wrap'>
    <div className='hole-in-one-content' style={{
        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-hole-in-one-background'))
    }}>
        <div className='hio-text'>
            <div className='first-line'>hole in</div>
            <div className='second-line'>one!</div>
        </div>
    </div>
</div>

  )
}

export default HoleInOnePopup