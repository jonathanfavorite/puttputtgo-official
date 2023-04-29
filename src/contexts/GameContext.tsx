import React, { createContext, useContext, useEffect, useState } from "react";
import { PlayerContext } from "./PlayerContext";
import { ScoreContext } from "./ScoreContext";
import { CompanyDataAssetModel, CompanyDataModel } from "../models/data/CompanyDataModel";
import LocalStorageGameDataModel from "../models/data/LocalStorageGameDataModel";
import { JsxFragment } from "typescript";
import { CourseContext } from "./CourseContext";

const GameContext = createContext<GameContextProps>({} as GameContextProps);

type customerLocation = string;

interface GameContextProps {
  resetGame: () => void;
  loadData: (location: customerLocation) => void;
  loadDefaultData: () => void;
  toggleGameLoading: (bool: boolean) => void;
  toggleAssetsLoaded: (bool: boolean) => void;
  toggleGameError: (bool: boolean) => void;
  addGameErrorMessage: (message: string) => void;
  gameLoading: boolean;
  preloadedAssets: boolean;
  gameError: boolean;
  gameMessages: string[];
  companyData: CompanyDataModel;
  companyParam: string;
  updateCompanyParam: (param: string) => void;
  getAssetByID: (name: string) => CompanyDataAssetModel | null;
  getTextByID: (textID: string) => JSX.Element[] | string;
  updateSelectedCourseID: (id: number) => void;
  selectedCourceID: number;
  customStylesLoaded: boolean;
  updateCustomStylesLoaded: (bool: boolean) => void;
  updateSelectedLanguage: (language: string) => void;
  selectedLanguage: string;
  startNewGameWithExistingPlayers: () => void;
}

function GameContextProvider(props: any) {
  const _courseContext = useContext(CourseContext);
  const _playerContext = useContext(PlayerContext);
  const _scoreContext = useContext(ScoreContext);

  const [companyData, setCompanyData] = useState<CompanyDataModel>(
    {} as CompanyDataModel
  );

  const [companyParam, setCompanyParam] = useState<string>("");
  const [selectedCourceID, setSelectedCourceID] = useState<number>(1);

  const [gameLoading, setGameLoading] = useState<boolean>(true);
  const [gameMessages, setGameMessages] = useState<string[]>([]);
  const [gameError, setGameError] = useState<boolean>(false);

  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const [preloadedAssets, setPreloadedAssets] = useState<boolean>(false);
  const [customStylesLoaded, setCustomStylesLoaded] = useState<boolean>(false);

  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const [hasExistingGame, setHasExistingGame] = useState<boolean>(false);
  const [showContinueGamePopup, setShowContinueGamePopup] =
    useState<boolean>(false);

  const resetGame = () => {
    setGameLoading(true);
    setGameError(false);
    setGameMessages(old => []);
    clearLocalStorage();

    _playerContext.resetPlayers();
    _scoreContext.resetScores();
  };

  const startNewGameWithExistingPlayers = () => {
    _courseContext.updateCurrentHole(1);
    _playerContext.updateCurrentPlayer(0);
    _scoreContext.resetScores();
  }
  const saveToLocalStorage = () => {
    // let gameState: LocalStorageGameDataModel = {
    //   companyData!: companyData,
    //   players: _playerContext.getAllPlayers(),
    //   holes: _courseContext.getAllHoles(),
    //   scores: _scoreContext.getAllScores(),
    //   currentHole: 1,
    //   currentPlayer: 1,
    // };
    // console.log(gameState);
    // localStorage.setItem("gameState", JSON.stringify(gameState));
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("gameState");
  };

  const updateCompanyParam = (param: string) => {
    setCompanyParam((old) => param);
  };

  const updateCustomStylesLoaded = (bool: boolean) => {
    setCustomStylesLoaded((old) => bool);
  };

  const doesGameStateExistInLocalStorage = async () => {
    let gameState = localStorage.getItem("gameState");
    if (gameState) {
      setHasExistingGame((old) => true);
      return true;
    }
    return false;
  };

  const loadFromLocalStorage = async () => {
    let gameState = localStorage.getItem("gameState");
    let parsedGameState: LocalStorageGameDataModel = JSON.parse(gameState!);
    setCompanyData((old) => parsedGameState.companyData);
    _playerContext.addPlayers(parsedGameState.players);
    _courseContext.addHoles(parsedGameState.holes);
    _scoreContext.addScores(parsedGameState.scores);
    _courseContext.updateCurrentHole(parsedGameState.currentHole);
    _playerContext.updateCurrentPlayer(parsedGameState.currentPlayer);
  };

  useEffect(() => {
    if (localStorage.getItem("gameState")) {
      saveToLocalStorage();
    }
  }, [_courseContext.toggleNextHole, gameFinished]);

  const toggleGameLoading = (bool: boolean) => {
    setGameLoading((old) => bool);
  };

  const toggleAssetsLoaded = (bool: boolean) => {
    setPreloadedAssets((old) => bool);
  };

  const toggleGameError = (bool: boolean) => {
    saveToLocalStorage();
    setGameError((old) => bool);
  };

  const updateSelectedCourseID = (id: number) => {
    setSelectedCourceID((old) => id);
  };

  const addGameErrorMessage = (message: string) => {
    setGameMessages((old) => [...old, message]);
  };

  const getAssetByID = (name: string) => {
    if(!companyData.assets){
      return null;
    }
    let asset = companyData.assets.find((asset) => asset.assetID === name);
    if (asset) {
      return asset;
    }
    return null;
  }

  const getTextByID = (textID: string) => {
    if(!companyData.texts){
      return textID;
    }
    let text = companyData.texts.find((text) => text.textID === textID);
    if (text) {
      let localText = text.locals.find((myText) => myText.locale == selectedLanguage);
      if(localText){
        let parts = localText.text.split('||');
        return parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br />}
          </React.Fragment>
        ));
      }
    }
    return textID;
  }

  function setContextData(data: CompanyDataModel) {
    console.log("DATAAA", data);
    console.log("#####" + data.courses);
    _courseContext.addCourses(data.courses);

    
  }

  const loadDefaultData = () => {
    console.log("LOADING DEFAULT DATA");
    return fetch("/customers/default/data.json")
      .then((defaultRequest) => defaultRequest.json())
      .then((defaultData) => {
        let retrievedCompanyData: CompanyDataModel = defaultData;
        setCompanyData((old) => retrievedCompanyData);
        setContextData(retrievedCompanyData);
        setGameLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setGameError(true); // Set the error state here
        addGameErrorMessage("Could not load the game data.");
      });
  };


  const loadData = (location: customerLocation) => {
    addGameErrorMessage("Fetching course data (" + location + ")" + "...");
    let dataFile = "data.json";
    console.log(location + "/" + dataFile);
  
    if(location === undefined || location === "")
    {
      console.log("NO LOCATION")
      return loadDefaultData();
    }
    fetch(location + "/" + dataFile)
      .then((request) => request.json())
      .then((data) => {
        let retrievedCompanyData: CompanyDataModel = data;
        setCompanyData((old) => retrievedCompanyData);
        console.log("NEWDATA", retrievedCompanyData);
        addGameErrorMessage("Game data loaded successfully:");
        setContextData(retrievedCompanyData);
        console.log(retrievedCompanyData.courses);
        //console.log(_courseContext.getAllHoles())
      })
      .catch((error) => {
        console.log("ERROR", error);
        setGameError(true); // Set the error state here
        addGameErrorMessage("Could not load the game data.");
        return loadDefaultData();
      })
      .finally(() => {
        setGameLoading(false);
      });

      
  };

  const updateSelectedLanguage = (language: string) => {
    setSelectedLanguage((old) => language);
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
    startNewGameWithExistingPlayers
  };

  return (
    <GameContext.Provider value={contextValues}>
      {props.children}
    </GameContext.Provider>
  );
}

export { GameContext, GameContextProvider };
