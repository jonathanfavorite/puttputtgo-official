export default class CompanyHelper {
    static ListOfBusinesses = [
        "ppg",
        "castle-golf1122",
        "bonanza-golf"
    ];
    static DoesCompanyExist(companyName: string): boolean {
        return this.ListOfBusinesses.includes(companyName);
    }
}