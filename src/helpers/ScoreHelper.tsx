
export default class ScoreHelper {
    
    static getOrdinalSuffix(number: number) {
        let suffix = 'th';
        if (10 < number % 100 && number % 100 < 20) {
          suffix = 'th';
        } else {
          const suffixes : any = { 1: 'st', 2: 'nd', 3: 'rd' };
          suffix = suffixes[number % 10] || 'th';
        }
        return suffix;
      }

}