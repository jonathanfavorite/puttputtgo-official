import CourseModel from "../course/CourseModel";
import HoleModel from "../hole/HoleModel";
import PlayerModel from "../player/PlayerModel";
import ScoreModel from "../score/ScoreModel";

export default interface GameModel {
    id: number;
    course: CourseModel;
    players: PlayerModel[];
    scores: ScoreModel[];
    holes: HoleModel[];
    currentHole: number;
    currentPlayer: number;
}
    