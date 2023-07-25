import CourseModel from "../course/CourseModel"

interface CompanyDataModel {
    directoryLocation: string,
    customerID: string,
    customerName: string,
    courses: CourseModel[],
    customerDescription: string,
    assets: CompanyDataAssetModel[],
    texts: CompanyDataTextsModel[],
    holes: CompanyDataHoleData[],
    rulesData: string
}

interface CompanyDataAssetModel {
    assetType: string,
    assetID: string,
    assetName: string,
    assetLocation: string
}

interface CompanyDataTextsModel {
    textID: string,
    locals: CompanyDataTextsLocaleModel[]
}

interface CompanyDataTextsLocaleModel {
    locale: string,
    text: string
}

interface CompanyDataHoleData {
    courseID: number,
    number: number,
    par: number,
    name: string,
    optional: boolean
}

export type{ CompanyDataModel, CompanyDataAssetModel, CompanyDataHoleData, CompanyDataTextsLocaleModel }