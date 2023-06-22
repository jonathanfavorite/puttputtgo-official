import React, { createRef, useContext, useEffect, useRef, useState } from "react";
import "./GamePage.scss";
import { GameContext } from "../../../contexts/GameContext";
import DataAssuranceHOC from "../../hocs/DataAssuranceHOC";
import { useNavigate, useParams } from "react-router-dom";
import StyleHelper from "../../../helpers/StyleHelper";
import TextBasedHeader from "../../organisms/gameplay/header/TextBasedHeader";
import RoundsContainer from "../../organisms/gameplay/rounds-container/RoundsContainer";
import PlayersContainer from "../../organisms/gameplay/players-container/PlayersContainer";
import GamePlayFooter from "../../organisms/gameplay/footer/GamePlayFooter";
import { TransitionContext, TransitionContextProvider } from "../../../contexts/TransitionContext";
import Transition from "../../molecules/transition/Transition";
import PlayerRecordHOC from "../../hocs/PlayerRecordHOC";
import { PlayerContext } from "../../../contexts/PlayerContext";
import { CourseContext } from "../../../contexts/CourseContext";
function GamePage() {
  const _gameContext = useContext(GameContext);
  const _courseContext = useContext(CourseContext);
  const _playerContext = useContext(PlayerContext);
  const _transitionContext = useContext(TransitionContext);
  const { business_name } = useParams();
  const navigate = useNavigate();

  const gamePageAssets = {
    playerBackground: _gameContext.getAssetByID("gameplay-player-background"),
    playerBallFrame: _gameContext.getAssetByID("gameplay-player-ball-frame"),
    scoreButton: _gameContext.getAssetByID("gameplay-score-button"),
    nextHoleButton: _gameContext.getAssetByID("gameplay-next-hole-button"),
  };


  useEffect(() => {
    if(_playerContext.getAllPlayers().length <= 0)
    {
      navigate(`/${business_name}/create-game`);
    } 
  }, []);

  
  return (
    <DataAssuranceHOC companyParam={business_name! ? business_name : "default"}>
        <TransitionContextProvider>
          
      <div
        className="game-page"
        style={{
          backgroundImage: StyleHelper.format_css_url(
            _gameContext.getAssetByID("gameplay-game-background")
          ),
        }}
      >

        <Transition />

        <TextBasedHeader />
        <RoundsContainer />

        <div className="game-body">
          <PlayersContainer />
        </div>
        <div className="footer">
          <GamePlayFooter />
        </div>
      </div>
      </TransitionContextProvider>
    </DataAssuranceHOC>
  );
}

export default GamePage;
