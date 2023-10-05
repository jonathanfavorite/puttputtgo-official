import UserModel from "./UserModel";

export interface SignedInUserModel {
    accessToken: string;
    refreshToken: string;
    user: UserModel;
}