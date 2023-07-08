import HoleModel from "../hole/HoleModel";

interface InvalidHole {
    hole: HoleModel;
    playerIDs: number[];
}

interface GameSubmissionReport {
    invalidHoles: InvalidHole[];
}

export type { GameSubmissionReport, InvalidHole}