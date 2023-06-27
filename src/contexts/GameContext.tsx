import React, {createContext, useContext, useEffect, useState} from "react";
import {PlayerContext} from "./PlayerContext";
import {ScoreContext} from "./ScoreContext";
import {CompanyDataAssetModel, CompanyDataModel} from "../models/data/CompanyDataModel";
import LocalStorageGameDataModel from "../models/data/LocalStorageGameDataModel";
import {JsxFragment} from "typescript";
import {CourseContext} from "./CourseContext";
import ConsoleHelper from "../helpers/ConsoleHelper";

const GameContext = createContext < GameContextProps > ({} as GameContextProps);

type customerLocation = string;

enum GameStatus {
    NotStarted,
    Active,
    Finished
}

interface GameContextProps {
    resetGame: () => void;
    loadData: (location : customerLocation) => void;
    loadDefaultData: () => void;
    toggleGameLoading: (bool : boolean) => void;
    toggleAssetsLoaded: (bool : boolean) => void;
    toggleGameError: (bool : boolean) => void;
    addGameErrorMessage: (message : string) => void;
    gameLoading: boolean;
    preloadedAssets: boolean;
    gameError: boolean;
    gameMessages: string[];
    companyData: CompanyDataModel;
    companyParam: string;
    updateCompanyParam: (param : string) => void;
    getAssetByID: (name : string) => CompanyDataAssetModel | null;
    getTextByID: (textID : string) => {
        __html : string
    };
    updateSelectedCourseID: (id : number) => void;
    selectedCourceID: number;
    customStylesLoaded: boolean;
    updateCustomStylesLoaded: (bool : boolean) => void;
    updateSelectedLanguage: (language : string) => void;
    selectedLanguage: string;
    startNewGameWithExistingPlayers: () => void;
    doesGameStateExistInLocalStorage: () => boolean;
    loadFromLocalStorage: () => void;
    preloadedLocalStorage: boolean;
    saveToLocalStorageAsync: () => void;
    didClickContinueGame: () => void;
    clickedContinueGame: boolean;
    gameStatus: GameStatus;
    updateGameStatus: (status : GameStatus) => void;
    showGameInProgressPopup: boolean;
    updateShowGameInProgressPopup: (bool : boolean) => void;
    activePage: string;
    updateactivePage: (page : string) => void;
    updatePreloadedLocalStorage: (bool : boolean) => void;
    isSavingToLocalStorage: boolean;
}

function GameContextProvider(props: any) {
    const _courseContext = useContext(CourseContext);
    const _playerContext = useContext(PlayerContext);
    const _scoreContext = useContext(ScoreContext);

    const [companyData, setCompanyData] = useState < CompanyDataModel > ({} as CompanyDataModel);

    const [companyParam, setCompanyParam] = useState < string > ("");
    const [selectedCourceID, setSelectedCourceID] = useState < number > (1);

    const [gameLoading, setGameLoading] = useState < boolean > (true);
    const [gameMessages, setGameMessages] = useState < string[] > ([]);
    const [gameError, setGameError] = useState < boolean > (false);

    const [gameFinished, setGameFinished] = useState < boolean > (false);

    const [preloadedAssets, setPreloadedAssets] = useState < boolean > (false);
    const [customStylesLoaded, setCustomStylesLoaded] = useState < boolean > (false);
    const [preloadedLocalStorage, setPreloadedLocalStorage] = useState < boolean > (false);

    const [selectedLanguage, setSelectedLanguage] = useState < string > ("en");

    const [activePage, setActivePage] = useState < string > ("");

    const [hasExistingGame, setHasExistingGame] = useState < boolean > (false);
    const [showContinueGamePopup, setShowContinueGamePopup] = useState < boolean > (false);

    const [showGameInProgressPopup, setShowGameInProgressPopup] = useState < boolean > (false);

    const [clickedContinueGame, setClickedContinueGame] = useState < boolean > (false);

    const [gameStatus, setGameStatus] = useState < GameStatus > (GameStatus.NotStarted);

    const [isSavingToLocalStorage, setIsSavingToLocalStorage] = useState < boolean > (false);
    
  
    const updatePreloadedLocalStorage = (bool : boolean) => {
        setPreloadedLocalStorage((old) => bool);    
    }


    const resetGame = () => {
        setGameLoading(false);
        setGameError(false);
        setGameMessages(old => []);
        clearLocalStorage();
        setClickedContinueGame(false);

        console.log("RESETTING GAME");

        _playerContext.resetPlayers();
        _scoreContext.resetScores();
    };

    const didClickContinueGame = () => {
        setClickedContinueGame(old => true);
    }

    const getGameStatus = () => {
        return gameStatus;
    }

    const updateGameStatus = (status : GameStatus) => {
        setGameStatus(old => status);
    }

    const startNewGameWithExistingPlayers = () => {
        _courseContext.updateCurrentHole(1);
        _playerContext.updateCurrentPlayer(0);
        _scoreContext.resetScores();

        let currentHole = _courseContext.getCurrentHole();

         //saveToLocalStorage();
    }

    const saveToLocalStorage = () => {
        console.log("active page: " , activePage)
        if (activePage !== "welcome") {
            console.log("HEYEYEEYYYEYYYEYEYYEEYEYEYEYYEEY");
            let gameState: LocalStorageGameDataModel = {
                players: _playerContext.getAllPlayers(),
                scores: _scoreContext.getAllScores(),
                currentHole: _courseContext.getCurrentHole().number,
                currentPlayer: _playerContext.getCurrentPlayer().id,
                currentCourse: _courseContext.getCurrentCourse(),
                companyID: companyData.customerID
            };

            ConsoleHelper.log({
                obj: gameState,
            })

            setIsSavingToLocalStorage(true);

            ConsoleHelper.log_value({color: "black", title: "currentHole", value: _scoreContext.getAllScores()});
            localStorage.setItem("gameState", JSON.stringify(gameState));
            console.log("sETTTTTTING");
            setTimeout(() => {
                setIsSavingToLocalStorage(false);
            }, 1000);
            
          
        }
    };
    const completedSaveToLocalStorage = () => {
        setIsSavingToLocalStorage(false);
    }
    const saveToLocalStorageAsync = async () => {
        setIsSavingToLocalStorage(true);
        let p = new Promise((resolve, reject) => {
            let gameState: LocalStorageGameDataModel = {
                players: _playerContext.getAllPlayers(),
                scores: _scoreContext.getAllScores(),
                currentHole: _courseContext.getCurrentHole().number,
                currentPlayer: _playerContext.getCurrentPlayer().id,
                currentCourse: _courseContext.getCurrentCourse(),
                companyID: companyData.customerID
            };
            localStorage.setItem("gameState", JSON.stringify(gameState));
            resolve(null);
        });

        p.then(completedSaveToLocalStorage);

    };

    // useEffect(() => {

    // if(_playerContext.getAllPlayers().length > 0)
    // {
    //     saveToLocalStorage();
    // }

    // }, [_courseContext.getCurrentHole()]);

    // useEffect(() => {
    // // if (localStorage.getItem("gameState")) {
    // //     if(_playerContext.getAllPlayers().length > 0)
    // //     {
    // //       console.log("SAVING TO LOCAL STORAGE");
    // //       saveToLocalStorage();
    // //     }
    // // }
    // // else
    // // {
        
    // // }
    // if(_playerContext.getAllPlayers().length > 0)
    // {
    //     if(activePage != "welcome")
    //     {
    //         saveToLocalStorage();
    //     }
    // }
    // else
    // {
    //    // localStorage.setItem("gameState", "");
        
    // }

    // }, [_courseContext.toggleNextHole, gameFinished, gameStatus, _courseContext.getCurrentHole()]);

    const clearLocalStorage = () => {
        localStorage.removeItem("gameState");
    };

    const updateCompanyParam = (param : string) => {
        setCompanyParam((old) => param);
    };

    const updateCustomStylesLoaded = (bool : boolean) => {
        setCustomStylesLoaded((old) => bool);
    };

    const doesGameStateExistInLocalStorage = () => {
        let gameState = localStorage.getItem("gameState");
        if (gameState) {
            setHasExistingGame((old) => true);
            return true;
        }
        setHasExistingGame((old) => false);
        return false;
    };


    const [loadedLocalStorageData, setLoadedLocalStorageData] = useState < LocalStorageGameDataModel | null > (null);
    useEffect(() => {
        if(loadedLocalStorageData != null)
        {

            if(_scoreContext.hasEveryPlayerPlayedThisHole(loadedLocalStorageData.currentHole).length <= 0)
            {
                console.log("loadedLocalStorageData - YES");
                _courseContext.updateCurrentHole(loadedLocalStorageData.currentHole + 1);
            }
            else
            {
                console.log("loadedLocalStorageData - NO", _scoreContext.hasEveryPlayerPlayedThisHole(loadedLocalStorageData.currentHole));
                _courseContext.updateCurrentHole(loadedLocalStorageData.currentHole);
            }
        }
    }, [loadedLocalStorageData]);

    const loadFromLocalStorage = async () => {
        if (!preloadedLocalStorage) {
          
        
            console.log("LOADING FROM LOCAL STORAGE")
            
            let gameState = localStorage.getItem("gameState")
           
      
            if(gameState) {
                let parsedGameState: LocalStorageGameDataModel = JSON.parse(gameState);
            
                _courseContext.addCourseAndHoles(parsedGameState.currentCourse, parsedGameState.currentHole);

                _scoreContext.resetScores();

                _scoreContext.addScores(parsedGameState.scores);

                _playerContext.updateCurrentPlayer(parsedGameState.currentPlayer);
            
                _playerContext.resetPlayers();
                _playerContext.addPlayers(parsedGameState.players);

                setLoadedLocalStorageData(parsedGameState);
            
                
                
              }
            
        }
    };


    const toggleGameLoading = (bool : boolean) => {
        setGameLoading((old) => bool);
    };

    const toggleAssetsLoaded = (bool : boolean) => {
        setPreloadedAssets((old) => bool);
    };

    const toggleGameError = (bool : boolean) => {
        setGameError((old) => bool);
    };

    const updateSelectedCourseID = (id : number) => {
        setSelectedCourceID((old) => id);
    };

    const addGameErrorMessage = (message : string) => {
        setGameMessages((old) => [
            ...old,
            message
        ]);
    };

    const getAssetByID = (name : string) => {
        if (!companyData.assets) {
            return null;
        }
        let asset = companyData.assets.find((asset) => asset.assetID === name);
        if (asset) {
            return asset;
        }
        return null;
    }

    const getTextByID = (textID : string) => {
        if (!companyData.texts) {
            return {__html: textID};
        }
        let text = companyData.texts.find((text) => text.textID === textID);
        if (text) {
            let localText = text.locals.find((myText) => myText.locale === selectedLanguage);
            if (localText) {
                let parts = localText.text.split('||');
                const joinedParts = parts.map(
                    (part, index) => `${part}${
                        index < parts.length - 1 ? '<br>' : ''
                    }`
                ).join('');
                return {__html: joinedParts};
            }
        }
        return {__html: textID};
    };

    function setContextData(data: CompanyDataModel) {
        _courseContext.addCourses(data.courses);


    }

    const loadDefaultData = () => {
        return fetch("/customers/default/data.json").then((defaultRequest) => defaultRequest.json()).then((defaultData) => {
            let retrievedCompanyData: CompanyDataModel = defaultData;
            setCompanyData((old) => retrievedCompanyData);
            setContextData(retrievedCompanyData);
            setGameLoading(false);
        }).catch((error) => {
            // console.log(error);
            setGameError(true); // Set the error state here
            addGameErrorMessage("Could not load the game data.");
        });
    };


    const loadData = (location : customerLocation) => {
        addGameErrorMessage("Fetching course data (" + location + ")" + "...");
        let dataFile = "data.json";
        // console.log(location + "/" + dataFile);

        if (location === undefined || location === "") {
            console.log("NO LOCATION")
            return loadDefaultData();
        }
        fetch(location + "/" + dataFile).then((request) => request.json()).then((data) => {
            let retrievedCompanyData: CompanyDataModel = data;
            setCompanyData((old) => retrievedCompanyData);
            addGameErrorMessage("Game data loaded successfully:");
            setContextData(retrievedCompanyData);
            // console.log(retrievedCompanyData.courses);
            // console.log(_courseContext.getAllHoles())
        }).catch((error) => {
            //console.log("ERROR", error);
            setGameError(true); // Set the error state here
            addGameErrorMessage("Could not load the game data.");
            return loadDefaultData();
        }). finally(() => {
            setGameLoading(false);
        });


    };

    const updateSelectedLanguage = (language : string) => {
        setSelectedLanguage((old) => language);
    }

    const updateShowGameInProgressPopup = (bool : boolean) => {
        setShowGameInProgressPopup(old => bool);
    }

    const updateactivePage = (page : string) => {
        setActivePage(old => page);
    }


    const contextValues: GameContextProps = {
        resetGame,
        loadData,
        loadDefaultData,
        toggleGameLoading,
        toggleAssetsLoaded,
        preloadedAssets,
        toggleGameError,
        addGameErrorMessage,
        gameLoading,
        gameError,
        gameMessages,
        companyData,
        companyParam,
        updateCompanyParam,
        getAssetByID,
        getTextByID,
        selectedCourceID,
        updateSelectedCourseID,
        customStylesLoaded,
        updateCustomStylesLoaded,
        updateSelectedLanguage,
        selectedLanguage,
        startNewGameWithExistingPlayers,
        doesGameStateExistInLocalStorage,
        loadFromLocalStorage,
        preloadedLocalStorage,
        saveToLocalStorageAsync,
        didClickContinueGame,
        clickedContinueGame,
        updateGameStatus,
        gameStatus,
        showGameInProgressPopup,
        updateShowGameInProgressPopup,
        activePage,
        updateactivePage,
        updatePreloadedLocalStorage,
        isSavingToLocalStorage
    };

    return(< GameContext.Provider value = {
        contextValues
    } > {
        props.children
    } </GameContext.Provider>
  );
}

export { GameContext, GameContextProvider, GameStatus };
