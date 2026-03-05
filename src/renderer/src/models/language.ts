import { IBaseModel } from "./base.models";


export interface ILanguage extends IBaseModel {
    name: string | null
    lang_code: string
    default: number
    locale: string
    rtl: number
    sort: number
    is_deleted: number
}
