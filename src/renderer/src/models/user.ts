import { IBaseModel, ICreatedBy, IUpdatedBy, IUserField } from "./base.models"
import {  IEducationPlan } from "./education"
import { ILanguage } from "./language"
import { IArea, ICitizenship, ICountry, ICourse, IDirection, IFaculty, INationality, IRegion } from "./others"




export interface IStudent extends IBaseModel {
    area?: IArea
    categoryOfCohabitant?: any
    category_of_cohabitant_id: number | null
    citizenship?: ICitizenship
    country?: ICountry
    course?: ICourse
    course_id: number | null
    description: string | null
    diplom_date: string | null
    diplom_number: string | null
    diplom_seria: string | null
    direction?: IDirection
    direction_id: number | null
    eduPlan?: IEducationPlan
    eduLang?: ILanguage
    edu_form_id: number | null
    edu_lang_id: number | null
    edu_plan_id: number | null
    edu_type_id: number | null
    edu_year_id: number | null
    faculty?: IFaculty
    faculty_id: number | null
    is_contract: number
    last_education: string | null
    live_location: string | null
    nationality: INationality
    parent_phone: string | null
    partners_count: null | string
    permanentArea?: IArea
    permanentCountry?: ICountry
    permanentRegion?: IRegion
    profile?: IStudentProfile
    region?: IRegion
    res_person_phone: null | string
    residenceStatus?: any
    residence_status_id: number | null
    socialCategory?: any
    social_category_id: number | null
    status: number
    studentCategory?: any
    student_category_id: number | null
    tutor: ITutor
    tutor_id: number
    user: IUserField
    user_id: number
    createdBy?: ICreatedBy,
    updatedBy?: IUpdatedBy
}

export interface IStudentProfile extends IBaseModel {
    academic_degree_id: null | number
    address: string | null
    area_id: number | null
    birthday: string
    citizenship_id: number
    country_id: null | number
    degree_id: null | number
    degree_info_id: null | number
    diploma_type_id: null | number
    first_name: string
    gender: number
    image: null | string
    is_deleted: number
    is_foreign: number
    last_name: string
    email: null | string
    middle_name: string
    nationality_id: number
    order: number
    partiya_id: number
    passport_file: null | string
    passport_given_by: null | string
    passport_given_date: null | string
    passport_issued_date: null | string
    passport_number: null | string
    passport_pin: null | string
    passport_seria: null | string
    permanent_address: null | string
    permanent_area_id: number | null
    permanent_country_id: number | null
    permanent_region_id: number | null
    phone: string | null
    phone_secondary: null | string
    region_id: number | null
    status: number
    telegram_chat_id: null | number
    user_id: number
}


export interface ITutor extends IBaseModel {
    avatar: string | null
    email: string
    first_name: number
    last_name: string
    middle_name: string
    role: string[]
    status: number
    username: string
}