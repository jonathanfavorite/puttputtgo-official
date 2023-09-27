import React, {useContext, useEffect, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {GameContext, GameStatus} from '../../../contexts/GameContext';
import CompanyHelper from '../../../helpers/CompanyHelper';
import WelcomeTemplate from '../../templates/welcome-screen/WelcomeTemplate';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';
import './WelcomePage.scss';
import {PlayerContext} from '../../../contexts/PlayerContext';
import {CourseContext} from '../../../contexts/CourseContext';
import ConsoleHelper from '../../../helpers/ConsoleHelper';
import { browserName, browserVersion, deviceType, osName } from 'react-device-detect';
import SignInRegisterTemplate from '../../templates/sign-in-register-template/SignInRegisterTemplate';
import GameConfetti from '../game-screen/GameConfetti';
import useSwipe, { handleTouchMove, handleTouchStart } from '../../../hooks/use-swipe/useSwipe';
import { GameAudioContext } from '../../../contexts/GameAudioContext';

function WelcomePage() {
    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);
    const _courseContext = useContext(CourseContext);
    const _audioContext = useContext(GameAudioContext);
    const {business_name} = useParams();
    const [isReady, setIsReady] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const scanMethod = queryParams.get('method'); // getting the scan method
    

    useEffect(() => {
        if (_gameContext.activePage != 'donotshow_existing_game') {
            _gameContext.updateactivePage("welcome");
        }

    }, []);

    useEffect(() => {
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
        return () => {
          document.removeEventListener('touchstart', handleTouchStart);
          document.removeEventListener('touchmove', handleTouchMove);
        };
      }, []);


    useSwipe(() => {
        //alert('swipe left');
    }
    , () => {
        //alert('swipe right');
    });


    const [hasSendScan, setHasSendScan] = useState(false);
    useEffect(() => {
        if (!hasSendScan) {
            if (_gameContext.companyData.customerID) {
                if (scanMethod) {
                    if (scanMethod === 'qr') {
                       
                    }
                    else if(scanMethod == "qr_card")
                    {

                    }
                    let payload = {
                        customerKey: _gameContext.companyData.customerID,
                        gameID: _gameContext.gameID,
                        browser: browserName,
                        browserVersion: browserVersion,
                        device: deviceType,
                        OS: osName,
                        method: scanMethod
                    }
                    console.log("PAYLOAD", payload)
                    fetch(`${
                        process.env.REACT_APP_API_URL 
                    }/Game/SaveQRScan`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    }).catch(err => {
                        console.log(err); 
                    });
                    setHasSendScan(true); 
                }
            }
        }
    }, [_gameContext.companyData.customerID]);

    const goTo = (route : string, relative : boolean = true) => {
        console.log(_gameContext.companyData.customerID);
        if (!relative) {
            navigate(route);
            return;
        }
        if (_gameContext.companyData.customerID != 'default') {

            navigate(`/${
                _gameContext.companyData.customerID
            }${route}`);
            return;
        }

        navigate(route);

    }

    const isNull = (value : any) => {
        return value === undefined || value === null;
    }
    const handleContinueGameClick = () => {

        ConsoleHelper.log_value({color: "green", title: "GetCurrentCourse", value: _courseContext.getCurrentCourse()});
        ConsoleHelper.log_value({color: "green", title: "CurrentHole", value: _courseContext.getCurrentHole()});
        ConsoleHelper.log_value({color: "green", title: "Players", value: _playerContext.getAllPlayers()});
        goTo('/game');
    };

    const handleCreateGameClick = () => {
        if (_gameContext.companyData.courses && _gameContext.companyData.courses.length > 1) {
            goTo('/course-selection');
        } else {
            goTo('/create-game');
        }
    };

    const handleRulesClick = () => {
        goTo('/rules');
    };


    const handleViewResultsClick = () => {
        goTo('/results');
    }

    const handleSettingsClick = () => {
        goTo('/settings');
    }
    return (
        <DataAssuranceHOC companyParam={
            business_name !
        }>
            <WelcomeTemplate>
                <div className='welcome-page'>
                   
                    <div className="welcome-buttons">

                        {
                        _gameContext.gameStatus === GameStatus.Active && _playerContext.getAllPlayers().length > 0 && (
                            <div className='button continue-game-button'
                                onClick={handleContinueGameClick}>
                                <span>{
                                    _gameContext.getPlainTextByID("welcome:continue-game")
                                }</span>
                                <img src={
                                    _gameContext.getAssetByID("continue-game-button") ?. assetLocation
                                }/>
                            </div>
                        )
                    }
                        {
                        _gameContext.gameStatus === GameStatus.Finished && (
                            <div className='button continue-game-button'
                                onClick={handleViewResultsClick}>
                                <span>{
                                    _gameContext.getPlainTextByID("welcome:view-results")
                                }</span>
                                <img src={
                                    _gameContext.getAssetByID("continue-game-button") ?. assetLocation
                                }/>
                            </div>
                        )
                    }
                        <div className='button create-game-button'
                            onClick={handleCreateGameClick}>
                            <span>{
                                _gameContext.getPlainTextByID("welcome:new-game")
                            }</span>
                            <img src={
                                _gameContext.getAssetByID("create-game-button") ?. assetLocation
                            }/>
                        </div>
                        <div className='button rules-button'
                            onClick={handleRulesClick}>  
                            <span>{
                                _gameContext.getPlainTextByID("welcome:rules")
                            }</span>
                            <img src={
                                _gameContext.getAssetByID("rules-button") ?. assetLocation
                            }/>
                        </div>
                        <div className='button rules-button'
                            onClick={handleSettingsClick}> 
                            <span>{
                                _gameContext.getPlainTextByID("welcome:settings")
                            }</span>
                            <img src={
                                _gameContext.getAssetByID("settings-button") ?. assetLocation
                            }/>
                        </div>


                        {/*
                     */} </div>
                </div>
                
            </WelcomeTemplate>
        </DataAssuranceHOC>
    );
}

export default WelcomePage
