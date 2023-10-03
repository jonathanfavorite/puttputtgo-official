import SnapModel from "../models/snaps/SnapModel";

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

export type GlobalCompositeOp = "source-over" | "source-in" | "source-out" | "source-atop" | "destination-over" | "destination-in" | "destination-out" | "destination-atop" | "lighter" | "copy" | "xor" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "color" | "luminosity";


export default class SnapHelper {
    static CreateNewPicture(): SnapModel {
        return {id: '', filename: '', processed: false, failure: false}
    }
    static CreateNewPictureWithValues(id : string, filename : string, processed : boolean, type?: number): SnapModel {
        return {id: id, filename: filename, processed: processed, failure: false, type: type}
    }
    static generateRandomString(length : number): string {
        let allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
        }
        return result;
    }
    static dataURLToBlob(dataURL : String): Blob { // Split the base64 string in data and contentType
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

        return new Blob(byteArrays, {
            type: parts[0].split(':')[1]
        });
    }
    static generateSmallThumb = (picture : string): Promise < string > => {
        return new Promise((resolve, reject) => { // create a canvas element
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const image = new Image()
            image.src = picture
            image.onload = function () { // Determine the aspect ratio
                const aspectRatio = image.height / image.width

                // Calculate new dimensions
                const targetWidth = 40
                const targetHeight = targetWidth * aspectRatio

                // Set canvas dimensions
                canvas.width = targetWidth
                canvas.height = targetHeight

                // Draw source image into the off-screen canvas:
                ctx !.drawImage(image, 0, 0, targetWidth, targetHeight)

                // Encode image to data-uri with base64 version of compressed image
                let smallThumb = canvas.toDataURL('image/jpeg', 0.5)
                resolve(smallThumb)
            }
            image.onerror = function () {
                reject(new Error('Failed to load the image.'))
            }
        })
    }

    static toBlendMode(value : string): BlendMode | undefined {
        const blendModes: BlendMode[] = [
            'normal',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'soft-light',
            'difference',
            'exclusion',
            'hue',
            'saturation',
            'color',
            'luminosity'
        ];
        if (blendModes.includes(value as BlendMode)) {
            return value as BlendMode;
        }
        return undefined; // or default to 'normal', depending on your requirement
    }

    static blendModeToCompositeOp(blendMode : BlendMode): GlobalCompositeOp {
        const map: Record<BlendMode, GlobalCompositeOp> = {
            'normal': 'source-over',
            'multiply': 'multiply',
            'screen': 'screen',
            'overlay': 'overlay',
            'darken': 'darken',
            'lighten': 'lighten',
            'color-dodge': 'color-dodge',
            'color-burn': 'color-burn',
            'hard-light': 'hard-light',
            'soft-light': 'soft-light',
            'difference': 'difference',
            'exclusion': 'exclusion',
            'hue': 'hue', // Not a direct match in canvas
            'saturation': 'saturation', // Not a direct match in canvas
            'color': 'color', // Not a direct match in canvas
            'luminosity': 'luminosity' // Not a direct match in canvas
        };

        return map[blendMode] || 'source-over'; // default to 'source-over' if not found
    }

}
