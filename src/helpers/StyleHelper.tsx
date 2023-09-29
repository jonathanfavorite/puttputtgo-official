export default class StyleHelper {
    static format_css_url(asset: any) {
        if(asset == null || asset == undefined) return '';
        return `url('${
            asset.assetLocation
        }')`;
    }
    static format_css_url_without_asset(url: any) {
      if(url == null || url == undefined) return '';
      return `url('${
          url
      }')`;
  }
    static RGBToHSL = (r:number, g:number, b:number) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s
          ? l === r
            ? (g - b) / s
            : l === g
            ? 2 + (b - r) / s
            : 4 + (r - g) / s
          : 0;
        return [
          60 * h < 0 ? 60 * h + 360 : 60 * h,
          100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
          (100 * (2 * l - s)) / 2,
        ];
      };
}