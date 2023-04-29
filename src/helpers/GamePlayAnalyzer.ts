import PlayerModel from "../models/player/PlayerModel";
import ScoreModel from "../models/score/ScoreModel"

interface IAnalyzerResult {
    response: string;
    weight: number;
}
interface PlayerIDAndTotalScore {
    playerID: number;
    totalScore: number;
}
const Responses = [
    { type: "taken_lead", text: "%s has taken the lead!"}
];

const formatResponse = (response: string, ...args: string[]) => {
    let formattedResponse = response;
    for (let i = 0; i < args.length; i++) {
        formattedResponse = formattedResponse.replace("%s", args[i]);
    }
    return formattedResponse;
}

export default class GamePlayAnalyzer {
    private currentHoleID: number;
    private currentPlayerID: number;
    private scores: ScoreModel[];
    private players: PlayerModel[];

    constructor(currentHoleID: number, currentPlayerID: number, scores: ScoreModel[], players: PlayerModel[]) {
        this.currentHoleID = currentHoleID;
        this.currentPlayerID = currentPlayerID;
        this.scores = scores;
        this.players = players;
    }
    public Run = () : IAnalyzerResult[] => {
        let results : IAnalyzerResult[] = [];
        let HasSomeoneHakenLead = this.CheckForWinningUpToSpecificHole(this.currentHoleID);
        return results;
    }
    private CheckForWinningUpToSpecificHole(holeToCheckAgainst: number) : IAnalyzerResult | null
    {
        if(holeToCheckAgainst == 0 || holeToCheckAgainst == 1) return null;
        let previousRoundWinner = this.GetWinnerUpToTargetHole(holeToCheckAgainst - 1);
        let currentRoundWinner = this.GetWinnerUpToTargetHole(holeToCheckAgainst);
        let currentRoundWinnerName = this.players[currentRoundWinner].name;
        let response = formatResponse(Responses[0].text, currentRoundWinnerName);
        let final = { response: response, weight: 1 };
        return previousRoundWinner != currentRoundWinner ? final : null;
    }
    private GetWinnerUpToTargetHole(holeToCheckAgainst: number) : number {
       
        // create a model that has the playerID and the total score
        // for each player, add up the total score
        // return the playerID of the player with the lowest score
        let totalScoresByPlayer : PlayerIDAndTotalScore[] = [];
        for (let i = 0; i < this.scores.length; i++) {
            let score = this.scores[i];
            if (score.holeID <= holeToCheckAgainst) {
                let playerID = score.playerID;
                let totalScore = score.score;
                let playerIDAndTotalScore : PlayerIDAndTotalScore = { playerID: playerID, totalScore: totalScore };
                totalScoresByPlayer.push(playerIDAndTotalScore);
            }
        }
        let lowestScore = 1000;
        let lowestScorePlayerID = -1;
        for (let i = 0; i < totalScoresByPlayer.length; i++) {
            let playerIDAndTotalScore = totalScoresByPlayer[i];
            if (playerIDAndTotalScore.totalScore < lowestScore) {
                lowestScore = playerIDAndTotalScore.totalScore;
                lowestScorePlayerID = playerIDAndTotalScore.playerID;
            }
        }
        return lowestScorePlayerID;
    }
}