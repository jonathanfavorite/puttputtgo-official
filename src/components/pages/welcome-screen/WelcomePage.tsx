import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';
import {GameContext, GameStatus} from '../../../contexts/GameContext';
import CompanyHelper from '../../../helpers/CompanyHelper';
import WelcomeTemplate from '../../templates/welcome-screen/WelcomeTemplate';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';
import './WelcomePage.scss';
import { PlayerContext } from '../../../contexts/PlayerContext';
import { CourseContext } from '../../../contexts/CourseContext';
import ConsoleHelper from '../../../helpers/ConsoleHelper';

function WelcomePage() {
    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);
    const _courseContext = useContext(CourseContext);
    const { business_name } = useParams();
    const [isReady, setIsReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(_gameContext.activePage != 'donotshow_existing_game')
        {
            _gameContext.updateactivePage("welcome");
        }
        
    }, []);

    const goTo = (route: string, relative: boolean = true) => {
        console.log(_gameContext.companyData.customerID);
        if(!relative)
        {
            navigate(route);
            return;
        }
        if(_gameContext.companyData.customerID != 'default')
        {

            navigate(`/${_gameContext.companyData.customerID}${route}`);
            return;
        }
        
        navigate(route);
        
    }
    
    const isNull = (value: any) => {
        return value === undefined || value === null;
    }
    const handleContinueGameClick = () => {
    
        ConsoleHelper.log_value({color: "green", title: "GetCurrentCourse", value: _courseContext.getCurrentCourse()});
        ConsoleHelper.log_value({color: "green", title: "CurrentHole", value: _courseContext.getCurrentHole()});
        ConsoleHelper.log_value({color: "green", title: "Players", value: _playerContext.getAllPlayers()});
        goTo('/game');
    };

    const handleCreateGameClick = () => {
        if(_gameContext.companyData.courses && _gameContext.companyData.courses.length > 1)
        {
            goTo('/course-selection');
        }
        else
        {
            goTo('/create-game');
        }
    };

    const handleRulesClick = () => {
        goTo('/rules');
    };


    

    const handleViewResultsClick =  () => {
        goTo('/results');
    }

    const handleSettingsClick = () => {
        goTo('/settings');
    }
    return (
      <DataAssuranceHOC companyParam={business_name!}>
        <WelcomeTemplate>
            <div className='welcome-page'>
                <div className="welcome-buttons">
                    
                    {_gameContext.gameStatus === GameStatus.Active && _playerContext.getAllPlayers().length > 0 && (
                    <div className='button continue-game-button' onClick={handleContinueGameClick}>
                        <span>{_gameContext.getPlainTextByID("welcome:continue-game")}</span>
                        <img src={_gameContext.getAssetByID("continue-game-button")?.assetLocation} />
                    </div>
                )}
                {_gameContext.gameStatus === GameStatus.Finished && (
                    <div className='button continue-game-button' onClick={handleViewResultsClick}>
                        <span>{_gameContext.getPlainTextByID("welcome:view-results")}</span>
                        <img src={_gameContext.getAssetByID("continue-game-button")?.assetLocation} />
                    </div>
                )}
                    <div className='button create-game-button' onClick={handleCreateGameClick}>
                    <span>{_gameContext.getPlainTextByID("welcome:new-game")}</span>
                        <img src={_gameContext.getAssetByID("create-game-button")?.assetLocation} />
                    </div>
                    <div className='button rules-button' onClick={handleRulesClick}>
                    <span>{_gameContext.getPlainTextByID("welcome:rules")}</span>
                        <img src={_gameContext.getAssetByID("rules-button")?.assetLocation} />
                    </div>
                    <div className='button rules-button' onClick={handleSettingsClick}>
                    <span>{_gameContext.getPlainTextByID("welcome:settings")}</span>
                        <img src={_gameContext.getAssetByID("settings-button")?.assetLocation} />
                    </div>
                    

                   
                 {/*
                     */}
                        
                    </div>
            </div>
        </WelcomeTemplate>
      </DataAssuranceHOC>
    );
  }

export default WelcomePage
