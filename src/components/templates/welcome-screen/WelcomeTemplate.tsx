import React, { useContext, useEffect } from 'react'
import './WelcomeTemplate.scss';
import { GameContext } from '../../../contexts/GameContext';

interface IWelcomeTemplateProps {
  specifiedClass?: string;
  children: any
}

function WelcomeTemplate(props: IWelcomeTemplateProps) {
  const _gameContext = useContext(GameContext);

  return (
    <div className={`welcome-template ${props.specifiedClass && props.specifiedClass}`} style={{
        backgroundImage: `url(${_gameContext.companyData.assets.find((asset) => asset.assetID === "welcome-background")?.assetLocation})`
    }}>
      <div className='top-section'>
        <img className='logo' src={_gameContext.getAssetByID("logo")?.assetLocation} />
      </div>
      <div className='middle-section'>
      {props.children}
      </div>
      <div className='bottom-section'>

      </div>
        
    </div>
  )
}

export default WelcomeTemplate