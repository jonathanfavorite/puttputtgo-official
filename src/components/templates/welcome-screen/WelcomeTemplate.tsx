import React, { useContext, useEffect, useRef } from 'react'
import './WelcomeTemplate.scss';
import { GameContext } from '../../../contexts/GameContext';
import GameConfetti from '../../pages/game-screen/GameConfetti';

interface IWelcomeTemplateProps {
  specifiedClass?: string;
  children: any
}



function WelcomeTemplate(props: IWelcomeTemplateProps) {
  const _gameContext = useContext(GameContext);

  const pageRef  = useRef<HTMLDivElement>(null);
  const [viewPortHeight, setViewPortHeight] = React.useState(window.innerHeight);

  useEffect(() => {

    if(pageRef.current)
    { 
      pageRef.current.style.height = `${viewPortHeight}px`;
    }


  }, [pageRef]);

  useEffect(() => {
    // add listener for resize
    window.addEventListener('resize', handleResize);
  }, []);

  function handleResize() {
    setViewPortHeight(window.innerHeight);
  }

  return (
    <div className={`welcome-template ${props.specifiedClass && props.specifiedClass}`} style={{
        backgroundImage: `url(${_gameContext.companyData.assets.find((asset) => asset.assetID === "welcome-background")?.assetLocation})`
    }}>
       {/* <div className='game-confetti'>
                        <GameConfetti />
                    </div> */}
      <div className='top-section'>
        <img className='logo' src={_gameContext.getAssetByID("logo")?.assetLocation} />
      </div>
      <div className='middle-section'>
      {props.children}
      </div>
      <div className='bottom-section'>
      <div className='flags'>
                       
                       {
                           // get every local under textID: welcome:new-game
                           _gameContext.getLocalsByID("welcome:new-game").map((local, index) => {
                               return <div className={`flag ${local.locale === _gameContext.selectedLanguage ? 'active-flag' : ''}`} key={index} onClick={() => _gameContext.updateSelectedLanguage(local.locale)}>
                                   <img src={`/global-assets/flags/${local.locale}.jpg`} />
                                   </div>
                           })
                       }
                   </div>
      </div>
        
    </div>
  )
}

export default WelcomeTemplate