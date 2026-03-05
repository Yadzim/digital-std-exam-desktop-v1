import { IBaseModel } from "./base.models"




export interface ISubject extends IBaseModel {
    name: string
    parent_id: number
    kafedra_id: number
    semestr_id: number
}


export interface ISubjectCategory extends IBaseModel {
    name: string | null
}

