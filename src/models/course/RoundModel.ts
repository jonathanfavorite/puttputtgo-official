import PlayerModel from "../player/PlayerModel";

export default interface RoundModel {
    id: number;
    courseID: number;
    players: PlayerModel[];
    holeID: number;
}