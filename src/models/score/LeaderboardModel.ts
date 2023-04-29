import PlayerModel from "../player/PlayerModel";


export default interface LeaderboardModel {
    player: PlayerModel;
    score: number;
}