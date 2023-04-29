import React, {useContext, useEffect, useState} from 'react'

import {useParams} from 'react-router-dom';
import {GameContext} from '../../../../contexts/GameContext';
import CompanyHelper from '../../../../helpers/CompanyHelper';
import WelcomeTemplate from '../../../templates/welcome-screen/WelcomeTemplate';
import DataAssuranceHOC from '../../../hocs/DataAssuranceHOC';

function TestCompanyDataPage() {
    const _gameContext = useContext(GameContext);
    const {business_name} = useParams();
    const [isReady, setIsReady] = useState(false);

    return (
        <DataAssuranceHOC companyParam={
            business_name !
        }>
            <WelcomeTemplate>
                <div className='test-page'>
                    <h1>Data</h1>
                    <p>Company Name: {_gameContext.companyData.customerName}</p>
                    <p>Company Logo: {_gameContext.getAssetByID("logo")?.assetLocation}</p>
                    <p>Welcome Background: {_gameContext.getAssetByID("logo")?.assetLocation}</p>
                    <p>Rules Button: {_gameContext.getAssetByID("logo")?.assetLocation}</p>
   
                    <button onClick={() => console.log(_gameContext.companyData)}>Log Company Data</button> 

                </div>
            </WelcomeTemplate>
        </DataAssuranceHOC>
    );
}

export default TestCompanyDataPage
