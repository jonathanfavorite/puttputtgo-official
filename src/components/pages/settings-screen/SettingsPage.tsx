import React, {useContext, useEffect, useState} from 'react'
import './SettingsPage.scss';
import {useNavigate, useParams} from 'react-router-dom';
import {GameContext} from '../../../contexts/GameContext';
import CompanyHelper from '../../../helpers/CompanyHelper';
import WelcomeTemplate from '../../templates/welcome-screen/WelcomeTemplate';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';

function SettingsPage() {
    const _gameContext = useContext(GameContext);
    const { business_name } = useParams();
    const [isReady, setIsReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() =>{
        _gameContext.updateactivePage("settings");
        console.log(_gameContext.gameStatus);
    }, []);

    const setGameStatus = (status: number) => {
        _gameContext.updateGameStatus(status);
    }

    const goBackButton = () => {
        _gameContext.updateactivePage("donotshow_existing_game");
        navigate(`/${business_name}`);
    };

     
    return (
      <DataAssuranceHOC companyParam={business_name!}>
        <WelcomeTemplate specifiedClass='settings-override'>
            <div className='settings-page'>
               <div className='settings-body'>
                    Game State: <br />
                    <button style={{
                        backgroundColor: _gameContext.gameStatus === 0 ? 'green' : '#fff'
                    }}
                    onClick={() => setGameStatus(0)}>Not Started</button>
                    <button style={{
                        backgroundColor: _gameContext.gameStatus === 1 ? 'green' : '#fff'
                    }}
                    onClick={() => setGameStatus(1)}>Active</button>
                    <button  style={{
                        backgroundColor: _gameContext.gameStatus === 2 ? 'green' : '#fff'
                    }}
                    onClick={() => setGameStatus(2)}>Finished</button>
                    
                </div>
               <div className='settings-footer'>
                    <div className='back-button'>
                        <span>Back</span>
                    <img src={_gameContext.getAssetByID("settings-button")?.assetLocation} onClick={goBackButton} />
                    </div>
                    
                </div>
            </div>
        </WelcomeTemplate>
      </DataAssuranceHOC>
    );
  }

export default SettingsPage
