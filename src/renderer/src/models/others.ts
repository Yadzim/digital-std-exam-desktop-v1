import { IBaseModel } from "./base.models"
import { IEducationSemester, IPara } from "./education"
import { IExamControl } from "./exam"
import { ILanguage } from "./language"
import { ISubject, ISubjectCategory } from "./subject"

export interface IWeek extends IBaseModel {
    name: string | null
}


export interface IBuilding extends IBaseModel {
    name: string | null
}


export interface IRoom extends IBaseModel {
    name: string | null
    description: string | null
    building_id: number
    capacity: number | null
    building?: IBuilding
}


export interface ITimeTable extends IBaseModel {
    para_id: number
    course_id: number
    semester_id: number
    edu_semester_id: number
    edu_year_id: number
    subject_id: number
    room_id: number
    week_id: number
    parent_id: number | null
    lecture_id: null | number
    language_id: number
    teacher_access_id: number
    selected: number
    selectedCount: number
    subject?: ISubject | null
    subjectCategory?: ISubjectCategory
    language?: ILanguage,
    eduSemestr?: IEducationSemester,
    building?: IBuilding,
    room?: IRoom,
    week?: IWeek,
    para?: IPara,
    child: ITimeTable[],
    seminar: ITimeTable[],
    subjectType: number,
    studentTimeTable?: IStudentTimeTable
    subject_category_id: number
    teacher?: {
        id: number,
        first_name: string,
        last_name: string,
        middle_name: string | null
    },
    examControl: IExamControl
}

export interface ILanguageCertificateType extends Omit<IBaseModel, 'updated_by'> {
    is_deleted: number,
    lang: string
    name: string
}


export interface ICitizenship {
    name: string
    description: string | null
}


export interface INationality extends IBaseModel {
    name: string
}

export interface IEducationType extends IBaseModel {
    name: string
}

export interface IEducationForm extends IBaseModel {
    name: string
}

export interface IEducationYear extends IBaseModel {
    name: string
    year: string
}

export interface IFaculty extends IBaseModel {
    name: string
    user_id: number
}

export interface IDirection extends IBaseModel {
    code: string
    faculty_id: number
    name: string
}

export interface ICourse extends IBaseModel {
    name: string
}

export interface IEducationCategory extends IBaseModel {
    name: string
}


export interface ICountry {
    id: number
    name: string
    ISO: string
    ISO3: string
    num_code: number
    phone_code: number
}


export interface IRegion extends Omit<IBaseModel, 'order'> {
    name: string
    country_id: number
    lat: null | number
    long: null | number
    name_kirill: string | null
    parent_id: null | number
    postcode: null | number
    slug: null | number
    type: number
}

export interface IArea {
    id: number
    lat: null | number
    long: null | number
    name: string
    postcode: null | number
    region_id: number
    sort: number
    status: number
    type: number
}


export interface ICohabitant extends IBaseModel {
    name: string
}


export interface IAreaStatus extends IBaseModel {
    name: string
}


export interface IStudentTimeTable extends IBaseModel {
    building?: IBuilding
    para?: IPara
    room?: IWeek
    student_id: number
    subject: ISubject
    subjectCategory?: ISubjectCategory
    teacher: { id: number, first_name: string, last_name: string, middle_name: string }
    time_table_id: number
    week?: IWeek,
    timeTable?: ITimeTable,
    child?: IStudentTimeTable[]
}

export interface ITimeOption extends IBaseModel {
    capacity: number | null
    description: string | null
    edu_plan_id: number
    edu_semester_id: number
    edu_year_id: number
    faculty_id: number
    key: string
    language_id: number | null
    name: string | null
    type: number | null
    selected: number
    selectedCount: number
    faculty?: IFaculty
    eduSemester?: IEducationSemester,
    timeTables?: ITimeTable[]
}

export interface IAttend {
    id: number
    date: string
    reason: 0 | 1
    student_id: number,
    timeTable?: ITimeTable
}