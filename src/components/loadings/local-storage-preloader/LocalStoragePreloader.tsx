import React, { useContext, useEffect } from 'react'
import { CourseContext } from '../../../contexts/CourseContext';
import { GameContext, GameStatus } from '../../../contexts/GameContext';





function LocalStoragePreloader() {
    const _courseContext = useContext(CourseContext);
    const _gameContext = useContext(GameContext);


    useEffect(() => {
        
        let findGame = _gameContext.doesGameStateExistInLocalStorage();
        if(findGame)
        {
          console.log("FOUND GAME");
          _gameContext.updateGameStatus(GameStatus.Active);
          _gameContext.loadFromLocalStorage();

         
        }
        let timeout = setTimeout(() => {
          _gameContext.updatePreloadedLocalStorage(true);
        }, 200);
        return () => {
          clearTimeout(timeout);
        }
        
      }, []);


   
  return (
    <div>LocalStoragePreloader</div>
  )
}

export default LocalStoragePreloader