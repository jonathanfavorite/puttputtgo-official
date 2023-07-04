import React, { useEffect, useState, useContext } from 'react'
import {GameContext, GameStatus} from '../../contexts/GameContext';
import GeneralLoadingTemplate from '../templates/general-loading/GeneralLoadingTemplate';
import AssetLoader from '../loadings/asset-loader/AssetLoader';
import CompanyHelper from '../../helpers/CompanyHelper';
import ExistingGame from '../molecules/existing-game/ExistingGame';
import WelcomeTemplate from '../templates/welcome-screen/WelcomeTemplate';
import { CourseContext } from '../../contexts/CourseContext';
import LocalStoragePreloader from '../loadings/local-storage-preloader/LocalStoragePreloader';

const formatCompanyNameForDirectory = (companyName : string) => {
    return "/customers/" + companyName + "";
}

interface IProps {
    children: any;
    companyParam: string;
}

const DataAssuranceHOC: React.FC<IProps> = ({ children, companyParam }) => {
    const _gameContext = useContext(GameContext);
    const _courseContext = useContext(CourseContext);
    const { clickedContinueGame, gameLoading, companyParam: contextCompanyParam, 
        companyData, customStylesLoaded, preloadedAssets, preloadedLocalStorage, 
        gameStatus } = _gameContext;

    useEffect(() => {
        _gameContext.updateCompanyParam(companyParam);
    }, [companyParam]);

    useEffect(() => {
        if(contextCompanyParam && gameLoading){ 
            if(CompanyHelper.DoesCompanyExist(contextCompanyParam)) {
              console.log("company does exist");
                _gameContext.loadData(formatCompanyNameForDirectory(contextCompanyParam));
            } else {
              console.log("company does not exist");
                _gameContext.loadDefaultData();
            }
        }
    }, [contextCompanyParam, gameLoading]);

    useEffect(() => {
        if (companyData && companyData.directoryLocation && !customStylesLoaded) {
            const styleOverridePath = `${process.env.PUBLIC_URL}${companyData.directoryLocation}style-override.css`;
            const link = document.createElement('link'); 
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = styleOverridePath;
            link.id = 'style-override'; 
            const existingLink = document.getElementById('style-override');
            if (existingLink) {
                existingLink.parentNode?.removeChild(existingLink);
            }
            document.head.appendChild(link);
            _gameContext.updateCustomStylesLoaded(true);
        }
    }, [companyData, customStylesLoaded]);

    if (_gameContext.gameLoading) {
      return <GeneralLoadingTemplate>Game is loading...</GeneralLoadingTemplate>
    }
    else if(!_gameContext.gameLoading && !_gameContext.preloadedAssets) {
      return <GeneralLoadingTemplate><AssetLoader /></GeneralLoadingTemplate>
    }
    else if(!_gameContext.gameLoading && !_gameContext.preloadedLocalStorage &&  _gameContext.gameStatus == GameStatus.Active  && !_gameContext.clickedContinueGame) {
      return <WelcomeTemplate><ExistingGame /></WelcomeTemplate>
    }
    else if(!_gameContext.preloadedLocalStorage) {
      return <GeneralLoadingTemplate><LocalStoragePreloader /></GeneralLoadingTemplate>
    }
    else {
      return <>
      <div className='debug-wrap'>
        Current Hole #: {_courseContext.getCurrentHole().number}<br />
      </div>
      {children}</>
    }
}

export default DataAssuranceHOC;
