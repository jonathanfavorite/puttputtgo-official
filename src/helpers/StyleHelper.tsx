export default class StyleHelper {
    static format_css_url(asset : any) {
        if (asset == null || asset == undefined) 
            return '';
        

        return `url('${
            asset.assetLocation
        }')`;
    }
    static format_css_url_without_asset(url : any) {
        if (url == null || url == undefined) 
            return '';
        

        return `url('${
            url
        }')`;
    }
    static RGBToHSL = (r : number, g : number, b : number) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s ? l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s : 0;
        return [
            60 * h < 0 ? 60 * h + 360 : 60 * h,
            100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
            (100 * (2 * l - s)) / 2,
        ];
    };

    static getProfilePictureAtIndex(index: number): string {
      // Calculate the row and column based on the index
      const row = Math.floor(index / 4); // 0 or 1 since you have 2 rows
      const col = index % 4; // 0, 1, 2, or 3 since you have 4 columns
  
      // Calculate the percentage for the background-position so it aligns with the stretched sprite sheet.
      const xPosPercentage = col * 33; // 0, 25, 50, or 75 (since there are four images per row, each taking up 25% of the stretched width)
      const yPosPercentage = row * 100; // 0 or 50 (since there are two rows, each taking up 50% of the height)
  
      // Return the background-position values as a string in percentage format.
      return `${xPosPercentage}% ${yPosPercentage}%`;
  }
  
  
  
}
