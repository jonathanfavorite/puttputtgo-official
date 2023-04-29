export default class StyleHelper {
    static format_css_url(asset: any) {
        if(asset == null || asset == undefined) return '';
        return `url('${
            asset.assetLocation
        }')`;
    }
}