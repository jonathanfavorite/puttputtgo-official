import RGBModel from "../color/RGBModel";

export default interface PlayerModel {
    id: number;
    name: string;
    userKey?: string;
    profileImage?: string;
    avatarIndex?: number;
    color?: RGBModel;
}