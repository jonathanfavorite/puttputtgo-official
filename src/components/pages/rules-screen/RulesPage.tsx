import React, {useContext, useEffect, useRef, useState} from 'react'
import './RulesPage.scss';
import {useNavigate, useParams} from 'react-router-dom';
import {GameContext} from '../../../contexts/GameContext';
import CompanyHelper from '../../../helpers/CompanyHelper';
import WelcomeTemplate from '../../templates/welcome-screen/WelcomeTemplate';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';

function RulesPage() {
    const _gameContext = useContext(GameContext);
    const { business_name } = useParams();
    const [isReady, setIsReady] = useState(false);
    const navigate = useNavigate();

    const [viewPortHeight, setViewPortHeight] = useState(window.innerHeight);
    const rulesBodyRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if(pageRef.current)
      { 
        pageRef.current.style.height = `${viewPortHeight}px`;
      }
      if(rulesBodyRef.current)
      {
        let percentage = 0.2;
        rulesBodyRef.current.style.height = `${viewPortHeight - (viewPortHeight * percentage)}px`;
      }

    }, [rulesBodyRef, footerRef, pageRef, viewPortHeight]); 

    useEffect(() => {
        // add listener for resize
        window.addEventListener('resize', handleResize);
    }, []);

    function handleResize() {
      setViewPortHeight(window.innerHeight);
    }
     
    return (
      <DataAssuranceHOC companyParam={business_name!}>
       
       <div ref={pageRef} className='rules-page'>
        <div ref={rulesBodyRef} className='rules-body-wrap'>
               <div className='rules-body' dangerouslySetInnerHTML={_gameContext.getTextByID("rules:body")}>

                </div>
                </div>
               <div ref={footerRef} className='rules-footer'>
                    <div className='back-button'>
                    <img src={_gameContext.getAssetByID("settings-button")?.assetLocation} onClick={() => navigate("/")} />
                    <span>{_gameContext.getPlainTextByID("gameplay:back")}</span>
                    </div>
                    
                </div>
            </div>
       
      </DataAssuranceHOC>
    );
  }

export default RulesPage
