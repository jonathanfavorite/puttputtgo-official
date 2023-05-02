import React, {useContext, useEffect, useState} from 'react'
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

     
    return (
      <DataAssuranceHOC companyParam={business_name!}>
        <WelcomeTemplate specifiedClass='rules-override'>
            <div className='rules-page'>
               <div className='rules-body' dangerouslySetInnerHTML={_gameContext.getTextByID("rules:body")}>

                </div>
               <div className='rules-footer'>
                    <img src={_gameContext.getAssetByID("welcome-back-button")?.assetLocation} onClick={() => navigate("/")} />
                </div>
            </div>
        </WelcomeTemplate>
      </DataAssuranceHOC>
    );
  }

export default RulesPage
