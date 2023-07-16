import React, {useContext, useEffect, useState} from 'react'
import './SettingsPage.scss';
import {useNavigate, useParams} from 'react-router-dom';
import {GameContext, GameStatus} from '../../../contexts/GameContext';
import CompanyHelper from '../../../helpers/CompanyHelper';
import WelcomeTemplate from '../../templates/welcome-screen/WelcomeTemplate';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';
import { PlayerContext } from '../../../contexts/PlayerContext';
import RGBModel from '../../../models/color/RGBModel';
import { ScoreContext } from '../../../contexts/ScoreContext';
import { CourseContext } from '../../../contexts/CourseContext';

function SettingsPage() {
    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);
    const _scoreContext = useContext(ScoreContext);
    const _courseContext = useContext(CourseContext);
    const { business_name } = useParams();
    const [isReady, setIsReady] = useState(false);
    const navigate = useNavigate();
    const [adminMode, setAdminMode] = useState(false);

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

    const handleOtherThemeClick = (place: string) => {
        _gameContext.updateCompanyParam('');
        window.location.href = place;
    };


    const handleTempAddPlayersClick = () => {

        _scoreContext.resetScores();
        _playerContext.resetPlayers();
    
        let names : any[string] = ["Jonathan", "Melanie", "Jessica", "Hunter", "Katie"];
        names = names.sort(() => Math.random() - 0.5);
        let colors : RGBModel[] = [
         { name: "red", r: 255, g: 0, b: 0 },
            { name: "yellow", r: 255, g: 255, b: 0 },
            { name: "green", r: 0, g: 255, b: 0 },
            { name: "blue", r: 0, g: 0, b: 255 },
            { name: "white", r: 255, g: 255, b: 255 },
            { name: "purple", r: 128, g: 0, b: 128 },
            { name: "black", r: 0, g: 0, b: 0 },
            { name: "teal", r: 0, g: 128, b: 128 },
            { name: "lime_green", r: 50, g: 205, b: 50 },
            { name: "orange", r: 255, g: 165, b: 0 },
            { name: "dark_blue", r: 0, g: 0, b: 139 },
            { name: "pink", r: 255, g: 192, b: 203 },
        
        ]
    
        let colors_random = colors.sort(() => Math.random() - 0.5);
    
        for (let i = 0; i < names.length; i++) {
          
          let rgb = colors_random[i];
          let myName = names[i];
          _playerContext.addPlayer({
            id: i,
            name: myName,
            color: rgb,
          });
          for (let x = 0; x < _courseContext.getCurrentCourse().holes.length - 1; x++) {
            _scoreContext.addScore({
              courseID: _courseContext.getCurrentCourse().ID,
              holeID: _courseContext.getCurrentCourse().holes[x].number,
              playerID: i,
              score: Math.floor(Math.random() * 4) + 1,
            });
          }
        }
        _gameContext.updateGameStatus(GameStatus.Active);
        _courseContext.updateCurrentHole(17);
        
      };

     
    return (
      <DataAssuranceHOC companyParam={business_name!}>
        <WelcomeTemplate specifiedClass='settings-override'>
            <div className='settings-page'>
               <div className='settings-body'>

                <div className='admin-mode-wrap'>
                    <div className='title' onClick={() => setAdminMode(!adminMode)}>{!adminMode ? 'Enter' : 'Exit'} Admin Mode</div>
                    <div className='admin-mode-hidden' style={{
                        display: adminMode ? 'block' : 'none'
                    }}>

                    <div onClick={handleTempAddPlayersClick}> -- Add Temp Players</div><br />
                    <div onClick={() => _gameContext.resetGame()}> -- Reset Game</div><br />

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




<div className='button rules-button' style={{
    marginTop: '20px'
}}>
                        <div onClick={() => handleOtherThemeClick('/')}>PuttPuttGo</div>
                    </div><br />
                     <div className='button rules-button'>
                        <div onClick={() => handleOtherThemeClick('/castle-golf/')}>Castle Golf</div>
                    </div><br />
                    <div className='button rules-button'>
                        <div onClick={() => handleOtherThemeClick('/bonanza-golf/')}>Bonanza Golf Golf</div><br />
                    </div>

                    </div>
                </div>

                   
                    
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
