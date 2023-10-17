import React, { useContext, useEffect, useRef, useState } from "react";
import "./CreateGamePage.scss";
import DataAssuranceHOC from "../../hocs/DataAssuranceHOC";
import { useNavigate, useParams } from "react-router-dom";
import { GameContext, GameStatus } from "../../../contexts/GameContext";
import TextBasedHeader from "../../organisms/gameplay/header/TextBasedHeader";
import { PlayerContext, formatRGBToCSS } from "../../../contexts/PlayerContext";
import StyleHelper from "../../../helpers/StyleHelper";
import RGBModel from "../../../models/color/RGBModel";
import CreatePlayerModal from "../../molecules/create-player-modal/CreatePlayerModal";
import { CourseContext } from "../../../contexts/CourseContext";
import { ScoreContext } from "../../../contexts/ScoreContext";
import ConfirmationModal from "../../molecules/confirmation-modal/ConfirmationModal";
import { SignUpRegisterContext } from "../../../contexts/SignUpRegisterContext";

function CreateGamePage() {
  const { business_name } = useParams();
  const _gameContext = useContext(GameContext);
  const _playerContext = useContext(PlayerContext);
  const _courseContext = useContext(CourseContext);
  const _scoreContext = useContext(ScoreContext);
  const _signUpRegisterContext = useContext(SignUpRegisterContext);
  const navigate = useNavigate();

  const headerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const [alreadyChosenColors, setAlreadyChosenColors] = useState<RGBModel[]>([]);
  const [alreadyChosenAvatarIndexes, setAlreadyChosenAvatarIndexes] = useState<number[]>([]);

  const handleOnPlayerCreate = (player: any) => {
    setAlreadyChosenColors(old => [...old, player.color]);
    setAlreadyChosenAvatarIndexes(old => [...old, player.avatarIndex]);
  };

  const [showStartGameConfirmationModal, setShowStartGameConfirmationModal] = useState<boolean>(false);
  const [showAddPlayerConfirmationModal, setShowAddPlayerConfirmationModal] = useState<boolean>(false);

  const handleCourseClick = (courseID: number) => {
    _gameContext.updateSelectedCourseID(courseID);

    navigate("/create-game");
  };

  const [viewPortHeight, setViewPortHeight] = useState(0);

  useEffect(() => {
    setViewPortHeight(window.innerHeight);

    if (_signUpRegisterContext.signedInUser && _playerContext.getAllPlayers().length == 0) {
      const user = _signUpRegisterContext.signedInUser.user;
      _playerContext.addPlayer({
          id: 1,
          userKey: user.UserKey,
          name: user.Username,
          profileImage: `${process.env.REACT_APP_STORAGE_ACCOUNT_URL}/profile-pics/${user.ProfileImage}`,
          color: {
              r: 255,
              g: 255,
              b: 255
          }
      });
  }
  }, []);

  useEffect(() => {
    //_gameContext.updateSelectedLanguage("en");
    _gameContext.updateactivePage("create-game");

    //console.log("LOOOOOOODED");
    
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

    _playerContext.getAllPlayers().forEach((player) => {
      setAlreadyChosenColors(old => [...old, player.color!]);
      setAlreadyChosenAvatarIndexes(old => [...old, player.avatarIndex!]);
    });

    return () => {
      window.removeEventListener("resize", updateScrollableHeight); // Cleanup on component unmount
    };
  }, []);

  const handleClearDummyData = () => {
    _playerContext.resetPlayers();
  };

  const handleStartGameButton = async () => {
    if (_playerContext.getAllPlayers().length > 0) {
      setShowStartGameConfirmationModal(true);
      
    } else {
      //alert("Please add at least one player to start the game");
      setShowAddPlayerConfirmationModal(true);
    }
  };

  
  const handleConfirmStartGame = () => {
    _gameContext.startNewGameWithExistingPlayers();
    _courseContext.updateCurrentHole(1);
    _gameContext.updateGameStatus(GameStatus.Active);
    _gameContext.didClickContinueGame();
    _gameContext.saveToLocalStorageAsync();
    setShowStartGameConfirmationModal(false);
    navigate(`/${_gameContext.companyParam}/game`);
  };

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const handleAddPlayerButton = () => {
    setShowCreateModal(true);
  };
  const handleHideCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleAddPlayerConfirmClick = () => {
    setShowAddPlayerConfirmationModal(false);
    setShowCreateModal(true);
  }

  const handleRemovePlayerClicked = (playerID: number) => {
   
    //remove player from already chosen colors
    const player = _playerContext.getAllPlayers().find(player => player.id === playerID);
    if(player)
    {
      setAlreadyChosenColors(old => old.filter(color => color.r !== player.color?.r && color.g !== player.color?.g && color.b !== player.color?.b));
      setAlreadyChosenAvatarIndexes(old => old.filter(index => index !== player.avatarIndex));
    }
    _playerContext.removePlayer(playerID);
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
          height: viewPortHeight + "px",
          backgroundImage: `url(${
            _gameContext.getAssetByID("create-game-background")?.assetLocation
          })`,
        }}
      >
        {showStartGameConfirmationModal && <ConfirmationModal 
                                            onConfirm={handleConfirmStartGame} 
                                            confirmText="Start Game"
                                            cancelText="Cancel"
                                            onCancel={() => setShowStartGameConfirmationModal(false)}>are you ready to start the game?
                                            </ConfirmationModal>
                                          }
        {showAddPlayerConfirmationModal && <ConfirmationModal 
                                            confirmText="Add Players"
                                            onConfirm={handleAddPlayerConfirmClick}>Please add at least one player to start the game.
                                            </ConfirmationModal>}
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
              <span>{_gameContext.getPlainTextByID("start-game:add-player")}</span>
            </div>
          </div>
          <div className="scrollable" ref={scrollableRef}>
            
            <div className="player-list">
              {_playerContext.getAllPlayers().map((player, index) => {
                const backgroundPosition = StyleHelper.getProfilePictureAtIndex(player.avatarIndex!);
                return (
                  <div className="player" key={index}>
                   
                    {/* <div className="player-color">
                     
                     
                     {player.profileImage ?  <div
                        className="player-circle-profile">
                        <div className="profile-image" style={{
                          backgroundImage: `url(${player.profileImage})`
                        }}></div>

                        <div className="profile-overlay" style={{
                          backgroundImage: StyleHelper.format_css_url(
                            _gameContext.getAssetByID(
                              "gameplay-player-ball-frame"
                            )
                          ),
                        }}></div>
                          
                        
                      </div> 
                      
                      : 
                      
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
                      >
                      </div>} 
                     

                    </div>*/}

                    <div className="player-avatar-wrap" style={{
                      backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('avatar-sprites')),
                      backgroundPosition: backgroundPosition,
                      backgroundColor: formatRGBToCSS(player.color!, 1)
                    }}>
                      <div className="avatar-frame" style={{
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame'))
                      
                      }}></div>
                    </div>

                    <div className="player-name">{player.name}</div>
                    <div className="delete-wrap">
                      <div
                        onClick={() => handleRemovePlayerClicked(player.id)}
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
            {_gameContext.getPlainTextByID("start-game:start-game")}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreatePlayerModal
        chosenColors={alreadyChosenColors}
        chosenAvatarIndexs={alreadyChosenAvatarIndexes}
        onCreatedPlayer={handleOnPlayerCreate}
        closeModal={handleHideCreateModal} />
      )}
    </DataAssuranceHOC>
  );
}

export default CreateGamePage;
