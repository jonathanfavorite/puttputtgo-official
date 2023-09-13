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
    static dataURLToBlob(dataURL: String) : Blob {
        // Split the base64 string in data and contentType
        const parts = dataURL.split(';base64,');
        const byteCharacters = atob(parts[1]);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
    
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
    
        return new Blob(byteArrays, {type: parts[0].split(':')[1]});
    }
    
}