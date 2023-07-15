import { GameStatus } from "../../contexts/GameContext";
import CourseModel from "../course/CourseModel";
import HoleModel from "../hole/HoleModel";
import PlayerModel from "../player/PlayerModel";
import ScoreModel from "../score/ScoreModel";
import { CompanyDataModel } from "./CompanyDataModel";

type LocalStorageGameDataModel = {
    currentHole: number,
    currentPlayer: number,
    currentCourse: CourseModel,
    players: PlayerModel[],
    scores: ScoreModel[],
    companyID: string,
    gameState: number,
    selectedLanguage: string,
}

export default LocalStorageGameDataModel;