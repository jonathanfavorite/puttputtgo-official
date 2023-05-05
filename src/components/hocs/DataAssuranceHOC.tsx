import React, {useContext, useEffect} from 'react'
import {GameContext, GameStatus} from '../../contexts/GameContext';
import GeneralLoadingTemplate from '../templates/general-loading/GeneralLoadingTemplate';
import AssetLoader from '../loadings/asset-loader/AssetLoader';
import CompanyHelper from '../../helpers/CompanyHelper';
import ExistingGame from '../molecules/existing-game/ExistingGame';
import WelcomeTemplate from '../templates/welcome-screen/WelcomeTemplate';

interface IProps {
    children: any;
    companyParam: string;
}

const formatCompanyNameForDirectory = (companyName : string) => {
    return "/customers/" + companyName + "";
}

function DataAssuranceHOC(props : IProps) {

  const [checkingForExistingGame, setCheckingForExistingGame] = React.useState(true);
  const [existingGameFound, setExistingGameFound] = React.useState(false);

  const [allowContinueGame, setAllowContinueGame] = React.useState(false);

    const _gameContext = useContext(GameContext);

    useEffect(() => {
        _gameContext.updateCompanyParam(props.companyParam);
    }, []);

    useEffect(() => {
      let findGame = _gameContext.doesGameStateExistInLocalStorage();
      if(findGame)
      {
        setExistingGameFound(true);
      }
      else
      {
        setExistingGameFound(false);
      }
    }, []);

    useEffect(() => {
      if(_gameContext.clickedContinueGame)
      {
          setAllowContinueGame(true);
      }
    }, [_gameContext.clickedContinueGame]);

    useEffect(() => {
        if(_gameContext.companyParam != "" && _gameContext.gameLoading){ 
          if(_gameContext.companyParam === undefined)
          {
            //console.log("PARAM IS EMPTY");
            _gameContext.loadDefaultData();
          }
          else
          {
            //console.log("PARAM SUPPLIED:", _gameContext.companyParam);
            if(CompanyHelper.DoesCompanyExist(_gameContext.companyParam))
            {
              _gameContext.loadData(formatCompanyNameForDirectory(_gameContext.companyParam));
            }
            else
            {
              _gameContext.loadDefaultData();
            }
           
          }
         
        }
    }, [_gameContext.companyParam]);

    useEffect(() => {
      if (_gameContext.companyData && _gameContext.companyData.directoryLocation && !_gameContext.customStylesLoaded) {
        
          const styleOverridePath = `${process.env.PUBLIC_URL}${_gameContext.companyData.directoryLocation}style-override.css`;
          //console.log(styleOverridePath);
          const link = document.createElement('link'); 
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = styleOverridePath;
          link.id = 'style-override'; 
  
          // Remove any existing style-override link elements to avoid duplicate styles
          const existingLink = document.getElementById('style-override');
          if (existingLink) {
              existingLink.parentNode?.removeChild(existingLink);
          }
  
          document.head.appendChild(link);
          _gameContext.updateCustomStylesLoaded(true);
      }
  }, [_gameContext.companyData]);


  // if (_gameContext.gameError) {
  //   return <GeneralLoadingTemplate>Sorry, we couldn't locate this course. It either does not exist or is not activated for play.</GeneralLoadingTemplate>
  // }
  // Show the loading screen while the context is loading
  if (_gameContext.gameLoading) {
    return <GeneralLoadingTemplate>Game is loading...</GeneralLoadingTemplate>
  }

  if(!_gameContext.gameLoading && !_gameContext.preloadedAssets)
  {
    return <GeneralLoadingTemplate><AssetLoader /></GeneralLoadingTemplate>
  }

  if(!_gameContext.gameLoading && _gameContext.gameStatus == GameStatus.Active && !_gameContext.clickedContinueGame)
  {
    return <WelcomeTemplate><ExistingGame /></WelcomeTemplate>
  }

  // Render the children when the context is fully loaded and the arrays are defined
  return props.children;
}

export default DataAssuranceHOC
