import PlayerModel from "../player/PlayerModel";
import LeaderboardModel from "../score/LeaderboardModel";
import ScoreModel from "../score/ScoreModel";
import ResultType from "./ResultType";

interface BestWorstHole {
    bestHole: number;
    bestPar: number;
    bestAvg: number;
    worstHole: number;
    worstPar: number;
    worstAvg: number;
 }
 interface PerformanceData {
    player: PlayerModel;
    scores: ScoreModel[];
}


interface TrueResults {
    type: ResultType;
    trueFirstPlace: LeaderboardModel;
    ties: LeaderboardModel[];
}

export type {BestWorstHole, PerformanceData, TrueResults}