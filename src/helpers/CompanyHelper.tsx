export default class CompanyHelper {
    static ListOfBusinesses = [
        "ppg",
        "castle-golf",
        "bonanza-golf",
        "smugglers-cove",
        "jungle-golf",
        "pink-paradise",
    ];
    static DoesCompanyExist(companyName: string): boolean {
        return this.ListOfBusinesses.includes(companyName);
    }
}