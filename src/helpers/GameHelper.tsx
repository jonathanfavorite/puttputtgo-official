export default class GameHelper {
    static generateUniqueId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                id += characters[Math.floor(Math.random() * characters.length)];
            }
            if (i < 2) id += '-';
        }
        return id;
    }
    
}