import React, { useContext, useEffect, useState } from "react";
import "./GamePage.scss";
import { GameContext } from "../../../contexts/GameContext";
import DataAssuranceHOC from "../../hocs/DataAssuranceHOC";
import { useNavigate, useParams } from "react-router-dom";
import StyleHelper from "../../../helpers/StyleHelper";
import TextBasedHeader from "../../organisms/gameplay/header/TextBasedHeader";
import RoundsContainer from "../../organisms/gameplay/rounds-container/RoundsContainer";
import PlayersContainer from "../../organisms/gameplay/players-container/PlayersContainer";
import GamePlayFooter from "../../organisms/gameplay/footer/GamePlayFooter";
import { TransitionContextProvider } from "../../../contexts/TransitionContext";
import Transition from "../../molecules/transition/Transition";
import { PlayerContext } from "../../../contexts/PlayerContext";
import { CourseContext } from "../../../contexts/CourseContext";
import FinishGame from "../../molecules/finish-game/FinishGame";
import GamePlayModalTemplate from "../../templates/gameplay-modal-template/GamePlayModalTemplate";
import UnfinishedGame from "../../molecules/unfinished-game/UnfinishedGame";
import { ScoreContext } from "../../../contexts/ScoreContext";
import SnapPictureModal from "../../molecules/snap-picture-modal/SnapPictureModal";
function GamePage() {
  const _gameContext = useContext(GameContext);
  const _courseContext = useContext(CourseContext);
  const _scoreContext = useContext(ScoreContext);
  const _playerContext = useContext(PlayerContext);
  const { business_name } = useParams();
  const navigate = useNavigate();

  const [viewPortHeight, setViewPortHeight] = useState(0);

  useEffect(() => {
    setViewPortHeight(window.innerHeight);
  }, []);


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
        className="game-page disable-scroll"
        style={{
          height: viewPortHeight + 'px',
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
        <div className="game-details">
          hole #{_courseContext.getCurrentHole().number} {_courseContext.getCurrentHole().name && ` - ${_courseContext.getCurrentHole().name}`}
        </div>
        <div className="footer">
          <GamePlayFooter />
        </div>
      </div>
      </TransitionContextProvider>

      {_gameContext.showFinalGamePopup && <FinishGame />}

      {_gameContext.snapPictureEnabled && <SnapPictureModal />}

      {_scoreContext.gameSubmissionReport.invalidHoles.length > 0 && <GamePlayModalTemplate><UnfinishedGame /></GamePlayModalTemplate>}

    </DataAssuranceHOC>
  );
}

export default GamePage;
