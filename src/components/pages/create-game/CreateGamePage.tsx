import React, { useContext, useEffect, useRef, useState } from "react";
import "./CreateGamePage.scss";
import DataAssuranceHOC from "../../hocs/DataAssuranceHOC";
import WelcomeTemplate from "../../templates/welcome-screen/WelcomeTemplate";
import { useNavigate, useParams } from "react-router-dom";
import { GameContext, GameStatus } from "../../../contexts/GameContext";
import TextBasedHeader from "../../organisms/gameplay/header/TextBasedHeader";
import PlayerModel from "../../../models/player/PlayerModel";
import { PlayerContext, formatRGBToCSS } from "../../../contexts/PlayerContext";
import StyleHelper from "../../../helpers/StyleHelper";
import RGBModel from "../../../models/color/RGBModel";
import CreatePlayerModal from "../../molecules/create-player-modal/CreatePlayerModal";
import { CourseContext } from "../../../contexts/CourseContext";
import { ScoreContext } from "../../../contexts/ScoreContext";

function CreateGamePage() {
  const { business_name } = useParams();
  const _gameContext = useContext(GameContext);
  const _playerContext = useContext(PlayerContext);
  const _courseContext = useContext(CourseContext);
  const _scoreContext = useContext(ScoreContext);
  const navigate = useNavigate();

  const headerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const handleCourseClick = (courseID: number) => {
    _gameContext.updateSelectedCourseID(courseID);

    navigate("/create-game");
  };

  useEffect(() => {
    _gameContext.updateSelectedLanguage("en");
    _gameContext.updateactivePage("create-game");

    console.log("LOOOOOOODED");
    
    // handleCreateDummyData();
    const updateScrollableHeight = () => {
      if (
        !headerRef.current ||
        !topRef.current ||
        !footerRef.current ||
        !scrollableRef.current
      )
        return;

      const headerHeight = headerRef.current.clientHeight;
      const topHeight = topRef.current.clientHeight;
      const footerHeight = footerRef.current.clientHeight;
      const windowHeight = window.visualViewport!.height;

      const scrollableHeight =
        windowHeight - (headerHeight + topHeight + footerHeight + 0);
      scrollableRef.current.style.height = `${scrollableHeight}px`;
    };

    updateScrollableHeight(); // Update on component mount
    window.addEventListener("resize", updateScrollableHeight); // Update on window resize

    return () => {
      window.removeEventListener("resize", updateScrollableHeight); // Cleanup on component unmount
    };
  }, []);

  const handleClearDummyData = () => {
    _playerContext.resetPlayers();
  };

  const handleStartGameButton = async () => {
    if (_playerContext.getAllPlayers().length > 0) {
      _gameContext.startNewGameWithExistingPlayers();
      _courseContext.updateCurrentHole(1);
      _gameContext.updateGameStatus(GameStatus.Active);
      _gameContext.didClickContinueGame();
      _gameContext.saveToLocalStorageAsync();
      navigate(`/${_gameContext.companyParam}/game`);
      
    } else {
      alert("Please add at least one player to start the game");
    }
  };

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const handleAddPlayerButton = () => {
    setShowCreateModal(true);
  };
  const handleHideCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleTempAddPlayersClick = () => {


    _playerContext.addPlayer({ id: 0, name: "Jonathan", color: { r: 44, g: 29, b:255 }});
    _playerContext.addPlayer({ id: 1, name: "Jessica", color: { r: 255, g: 29, b:346 }});
    // _playerContext.addPlayer({ id: 1, name: "Hayden", color: { r: 242, g: 205, b:0 }});

    let currentCourse = _courseContext.getCurrentCourse().ID;
    // jonathan
    _scoreContext.addScore({ courseID: currentCourse, holeID: 1, playerID: 0, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 2, playerID: 0, score: 1});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 3, playerID: 0, score: 4});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 4, playerID: 0, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 5, playerID: 0, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 6, playerID: 0, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 7, playerID: 0, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 8, playerID: 0, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 9, playerID: 0, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 10, playerID: 0, score:2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 11, playerID: 0, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 12, playerID: 0, score: 1});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 13, playerID: 0, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 14, playerID: 0, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 15, playerID: 0, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 16, playerID: 0, score: 4});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 17, playerID: 0, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 18, playerID: 0, score: 3});

    // jessica
    _scoreContext.addScore({ courseID: currentCourse, holeID: 1, playerID: 1, score: 4});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 2, playerID: 1, score: 1});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 3, playerID: 1, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 4, playerID: 1, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 5, playerID: 1, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 6, playerID: 1, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 7, playerID: 1, score: 4});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 8, playerID: 1, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 9, playerID: 1, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 10, playerID: 1, score:3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 11, playerID: 1, score: 4});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 12, playerID: 1, score: 1});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 13, playerID: 1, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 14, playerID: 1, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 15, playerID: 1, score: 3});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 16, playerID: 1, score: 1});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 17, playerID: 1, score: 2});
    _scoreContext.addScore({ courseID: currentCourse, holeID: 18, playerID: 1, score: 4});

    // // hayden
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 1, playerID: 2, score: 3});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 2, playerID: 2, score: 4});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 3, playerID: 2, score: 4});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 4, playerID: 2, score: 3});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 5, playerID: 2, score: 4});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 6, playerID: 2, score: 4});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 7, playerID: 2, score: 4});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 8, playerID: 2, score: 3});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 9, playerID: 2, score: 3});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 10, playerID: 2, score:2});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 11, playerID: 2, score: 3});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 12, playerID: 2, score: 2});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 13, playerID: 2, score: 2});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 14, playerID: 2, score: 3});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 15, playerID: 2, score: 4});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 16, playerID: 2, score: 5});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 17, playerID: 2, score: 5});
    // _scoreContext.addScore({ courseID: currentCourse, holeID: 18, playerID: 2, score: 3});

    // let names = ["Jonathan", "Melanie", "Hunter", "Jessica", "Katie"];

    // for (let i = 0; i < names.length; i++) {
    //   let rgb: RGBModel = {
    //     r: Math.floor(Math.random() * 255),
    //     g: Math.floor(Math.random() * 255),
    //     b: Math.floor(Math.random() * 255),
    //   };
    //   let myName = names[i];
    //   _playerContext.addPlayer({
    //     id: i,
    //     name: myName,
    //     color: rgb,
    //   });
    //   for (let x = 0; x < _courseContext.getCurrentCourse().holes.length; x++) {
    //     _scoreContext.addScore({
    //       courseID: _courseContext.getCurrentCourse().ID,
    //       holeID: _courseContext.getCurrentCourse().holes[x].number,
    //       playerID: i,
    //       score: Math.floor(Math.random() * 6),
    //     });
    //   }
    // }
    _gameContext.updateGameStatus(GameStatus.Finished);
    
  };

  useEffect(() => {
    if(_gameContext.gameStatus === GameStatus.Finished) {
      _gameContext.saveToLocalStorageAsync();
    }
  }, [_gameContext.gameStatus]);

  return (
    <DataAssuranceHOC companyParam={business_name!}>
      <div
        className="create-game-page"
        style={{
          backgroundImage: `url(${
            _gameContext.getAssetByID("create-game-background")?.assetLocation
          })`,
        }}
      >
        <div className="header" ref={headerRef}>
          <TextBasedHeader />
        </div>
        <div className="body">
          <div className="top" ref={topRef}>
            <div className="heading">
              <h1
                dangerouslySetInnerHTML={_gameContext.getTextByID(
                  "start-game:choose-players-heading"
                )}
              ></h1>
            </div>
            <div
              onClick={handleAddPlayerButton}
              className="add-player-button"
              style={{
                backgroundImage: `url(${
                  _gameContext.getAssetByID("add-player-button")?.assetLocation
                })`,
              }}
            >
              <span>Add Player</span>
            </div>
          </div>
          <div className="scrollable" ref={scrollableRef}>
            <div onClick={handleTempAddPlayersClick}>Add Temp Players</div>
            <div className="player-list">
              {_playerContext.getAllPlayers().map((player, index) => {
                return (
                  <div className="player" key={index}>
                    <div className="player-color">
                      <div
                        className="player-circle"
                        style={{
                          backgroundImage: StyleHelper.format_css_url(
                            _gameContext.getAssetByID(
                              "gameplay-player-ball-frame"
                            )
                          ),
                          backgroundColor: formatRGBToCSS(player.color!, 1),
                        }}
                      ></div>
                    </div>
                    <div className="player-name">{player.name}</div>
                    <div className="delete-wrap">
                      <div
                        onClick={() => _playerContext.removePlayer(player.id)}
                        className="delete"
                        style={{
                          backgroundImage: StyleHelper.format_css_url(
                            _gameContext.getAssetByID("delete-player-button")
                          ),
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="footer" ref={footerRef}>
          <div
            className="create-game-button"
            onClick={handleStartGameButton}
            style={{
              backgroundImage: `url(${
                _gameContext.getAssetByID("start-new-game-button")
                  ?.assetLocation
              })`,
            }}
          >
            Start Game
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreatePlayerModal closeModal={handleHideCreateModal} />
      )}
    </DataAssuranceHOC>
  );
}

export default CreateGamePage;
