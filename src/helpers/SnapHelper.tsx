import SnapModel from "../models/snaps/SnapModel";

export default class SnapHelper {
    static CreateNewPicture() : SnapModel {
        return {
            id: '',
            filename: '',
            processed: false,
            failure: false
        }
    }
    static CreateNewPictureWithValues(id: string, filename: string, processed: boolean) : SnapModel {
        return {
            id: id,
            filename: filename,
            processed: processed,
            failure: false
        }
    }
    static generateRandomString(length: number) : string {
        let allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for(let i = 0; i < length; i++)
        {
            result += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
        }
        return result;
    }
}