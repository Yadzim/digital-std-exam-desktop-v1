import { IBaseModel } from "./base.models"
import { ISubject } from "./subject"



export interface IEducationSemester extends IBaseModel {
    name: string
    start_date: string
    end_date: string
    course_id: number
    semestr_id: number
    edu_plan_id: number
    edu_year_id: number
    credit: number
    is_checked: number
    optional_subject_count: number
    required_subject_count: number
    semestr?: ISemester
}

export interface IEducationSemesterSubject extends IBaseModel {
    edu_semestr_id: number
    all_ball_yuklama: number
    credit: number
    is_checked: number
    max_ball: number
    subject: ISubject
    subject_id: number
    subject_type_id: number
    selection: any
}


export interface IEducationPlan extends IBaseModel {
    name: string
    course: number
    direction_id: number | null
    edu_form_id: null | number
    edu_type_id: number
    edu_year_id: number
    faculty_id: number
    fall_end: string | null
    fall_start: string | null
    semestr: number | null
    is_deleted: number
    spring_end: string
    spring_start: string
    eduSemestrs?: IEducationSemester[]
}



export interface IPara extends IBaseModel {
    end_time: string | null
    name: string | null
    start_time: string | null
}

export interface ISemester extends IBaseModel {
    name: string
    type: number
}


