import { CompanyDataAssetAttributesModel, CompanyDataAssetModel } from "./CompanyDataModel";

export interface GlobalAssetsModel {
    filters: CompanyDataAssetModel[],
    flags: CompanyDataAssetModel[],
}