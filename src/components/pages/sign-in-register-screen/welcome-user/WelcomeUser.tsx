import React, { useContext, useEffect } from 'react'
import './WelcomeUser.scss';
import { Icons } from '../../../atoms/Icons';
import { GameContext } from '../../../../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { SignInRegisterScreenPages, SignUpRegisterContext } from '../../../../contexts/SignUpRegisterContext';
import { PlayerContext } from '../../../../contexts/PlayerContext';
import PlayerModel from '../../../../models/player/PlayerModel';

function WelcomeUser() {
  const _gameContext = useContext(GameContext);
  const _playerContext = useContext(PlayerContext);
  const _signupContext = useContext(SignUpRegisterContext);
  const navigate = useNavigate();


  const handleWelcomeButtonClick = () => {

    let newPlayer : PlayerModel = {
      id: _playerContext.getAllPlayers().length + 1,
      name: _signupContext.signedInUser?.user.Username || '',
      userKey: _signupContext.signedInUser?.user.UserKey || '',
      color: {
        r: 255,
        g: 255,
        b: 255
      }
    }

    _playerContext.addPlayer(newPlayer);

    _gameContext.saveToLocalStorageAsync();

    if(_gameContext.companyData.customerID == "default")
    {
      _signupContext.updateCurrentScreen(SignInRegisterScreenPages.SwitchBoard);
      navigate(`/`);
    }
    else
    {
      _signupContext.updateCurrentScreen(SignInRegisterScreenPages.SwitchBoard);
      navigate(`/${_gameContext.companyData.customerID}/`);
    }
   
  }
  return (
    <div className='welcome-user-screen-wrap' style={{
        backgroundImage: `url(${_gameContext.getAssetByID("signin-welcome-background")?.assetLocation})`
    }}>
        <div className='header'>
        <div className='_top-bar'>
            <div className='_left'>
               
            </div>
            <div className='_middle'>
                <div className='logo'>
                    <Icons.PPG_Logo color='#fff' />
                </div>
            </div>
            <div className='_right'>

            </div>
        </div>
      </div>
      <div className='welcome-content-wrap'>
        <div className='welcome-content'>
    
          <div className='welcome-name-container'>
            <div className='welcome-text'>welcome</div>
            <div className='welcome-name'>{_signupContext.signedInUser?.user.Username}</div>
          </div>

          <div className='welcome-large-text'>
            <span>your adventure</span>
            <span>starts here</span>
          </div>
    
        </div>
        <div className='welcome-footer'>
          <div className='welcome-footer-text'>
          <span>100 go-points have been added</span>
          <span>to your account</span>
          </div>
        <div className='welcome-button'
                    onClick={handleWelcomeButtonClick}>
                    start your adventure
                    </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeUser