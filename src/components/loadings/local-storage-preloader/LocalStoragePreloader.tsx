import React, { useContext, useEffect } from 'react';
import { CourseContext } from '../../../contexts/CourseContext';
import { GameContext, GameStatus } from '../../../contexts/GameContext';

function LocalStoragePreloader() {
    const _courseContext = useContext(CourseContext);
    const _gameContext = useContext(GameContext);

    useEffect(() => {
        const checkAndLoadGame = async () => {
            let findGame = _gameContext.doesGameStateExistInLocalStorage();
            if(findGame) {
                //console.log("FOUND GAME");
                _gameContext.updateGameStatus(GameStatus.Active);
                _gameContext.loadFromLocalStorage();
                _gameContext.updatePreloadedLocalStorage(true);
            }
            else {
                //console.log("NO GAME FOUND");
                _gameContext.updatePreloadedLocalStorage(true);
            }
        };
        checkAndLoadGame();
    }, []);

    useEffect(() => {
        //console.log("hmm", _gameContext.preloadedLocalStorage)
        if(_gameContext.preloadedLocalStorage) {
            //console.log("DONE");
        }
    }, [_gameContext.preloadedLocalStorage]);

    return (
        <div>Loading Local Storage</div>
    );
}

export default LocalStoragePreloader;
