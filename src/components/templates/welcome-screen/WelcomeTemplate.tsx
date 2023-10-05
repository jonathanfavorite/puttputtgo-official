import React, { useContext, useEffect, useRef } from 'react'
import './WelcomeTemplate.scss';
import { GameContext } from '../../../contexts/GameContext';
import GameConfetti from '../../pages/game-screen/GameConfetti';
import { CompanyDataAssetAttributesModel, CompanyDataTextsLocaleModel } from '../../../models/data/CompanyDataModel';
import ConfirmationModal from '../../molecules/confirmation-modal/ConfirmationModal';
import StyleHelper from '../../../helpers/StyleHelper';
import { SignedInContext } from '../../../contexts/SignedInContext';
import { SignUpRegisterContext } from '../../../contexts/SignUpRegisterContext';
import { useNavigate } from 'react-router-dom';

interface IWelcomeTemplateProps {
  specifiedClass?: string;
  children: any
}



function WelcomeTemplate(props: IWelcomeTemplateProps) {
  const navigate = useNavigate();
  const _gameContext = useContext(GameContext);
  const _signUpRegisterContext = useContext(SignUpRegisterContext);
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

  const [showFlags, setShowFlags] = React.useState(false);

  const handlePrimaryLanguageClick = () => {
    setShowFlags((old) => !old);
  }
  const handleNewFlagClick = (local: CompanyDataTextsLocaleModel) => {
    _gameContext.updateSelectedLanguage(local.locale)
    setShowFlags(false);
  }

  const getSelectedFlag = () => {

    let trueFlagID = _gameContext.selectedLanguage + "-flag";
    let selectedFlag = _gameContext.getFlagAssetByID(trueFlagID);

    return selectedFlag;
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
     
          <div className='bottom-navi'>
                    <div className='bottom-navi-left'>
                        <div className='language-button-wrap' style={{
                             
                            }}>
                                   <div className='current-flag' style={{
                                        backgroundImage: StyleHelper.format_css_url_without_asset(getSelectedFlag()?.assetLocation)
                                    }}></div>
                            <div className='language-button'>

                       



                              <div className='language-list-wrap' style={{
                                display: showFlags ? 'flex' : 'none'
                               }}>
                               <div className='flags' >
                       
                  
{
  welcomeTextLocals.map((local, index) => {
    // Search for the flag with the matching attributeID.
    const flag = _gameContext.getFlagAssetByID(local.locale + "-flag");

    // If a flag is found, display it.
    if (flag) {
      return (
        <div 
          className={`flag ${local.locale === _gameContext.selectedLanguage ? 'active-flag' : ''}`} 
          key={index} 
          onClick={() => handleNewFlagClick(local)}
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
                              





                                <div className='current-language-flag' onClick={handlePrimaryLanguageClick}>
                                   
                                </div>
                                <span onClick={handlePrimaryLanguageClick}>language</span>
                            </div>
                        </div>
                    </div>
                    <div className='bottom-navi-center'>
                       <div className='powered-by-text'>
                        <span>powered by</span>
                        <span>puttputtgo</span>
                       </div>
                      </div>
                    <div className='bottom-navi-right'>
                    <div className='sign-in-button-wrap' style={{
                              backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("welcome-sign-in-button-background"))
                            }}>
                            <div className='sign-in-button' onClick={() => navigate(`/${_gameContext.companyParam}/signin`)}>
                                <span>{_signUpRegisterContext.signedInUser ? _signUpRegisterContext.signedInUser.Username : 'sign in'}</span>
                            </div>
                        </div>
                    </div>
                    
          </div>
     
      </div>
        
    </div>
  )
}

export default WelcomeTemplate