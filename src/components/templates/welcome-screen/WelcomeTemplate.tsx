import React, { useContext, useEffect, useRef } from 'react'
import './WelcomeTemplate.scss';
import { GameContext } from '../../../contexts/GameContext';
import GameConfetti from '../../pages/game-screen/GameConfetti';
import { CompanyDataAssetAttributesModel, CompanyDataTextsLocaleModel } from '../../../models/data/CompanyDataModel';
import ConfirmationModal from '../../molecules/confirmation-modal/ConfirmationModal';

interface IWelcomeTemplateProps {
  specifiedClass?: string;
  children: any
}



function WelcomeTemplate(props: IWelcomeTemplateProps) {
  const _gameContext = useContext(GameContext);

  const pageRef  = useRef<HTMLDivElement>(null);
  const [viewPortHeight, setViewPortHeight] = React.useState(window.innerHeight);

  const [welcomeTextLocals, setWelcomeTextLocals] = React.useState<CompanyDataTextsLocaleModel[]>([]);

  useEffect(() => {

    if(pageRef.current)
    { 
      pageRef.current.style.height = `${viewPortHeight}px`;
    }

    // get every local under textID: welcome:new-game
    setWelcomeTextLocals(_gameContext.getLocalsByID("welcome:new-game"));

    console.log(_gameContext.globalAssets.flags);


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
  welcomeTextLocals.map((local, index) => {
    // Search for the flag with the matching attributeID.
    const flag = _gameContext.globalAssets.flags.find(f => 
      f.attributes && f.attributes.some(attr => 
        attr.attributeID === 'language' && attr.attributeValue === local.locale
      )
    );

    // If a flag is found, display it.
    if (flag) {
      return (
        <div 
          className={`flag ${local.locale === _gameContext.selectedLanguage ? 'active-flag' : ''}`} 
          key={index} 
          onClick={() => _gameContext.updateSelectedLanguage(local.locale)}
        >
          <img src={flag.assetLocation} alt={flag.assetName} />
        </div>
      );
    }
    
    return null;  // Return null if no flag is found.
  })
}

                   </div>
      </div>
        
    </div>
  )
}

export default WelcomeTemplate