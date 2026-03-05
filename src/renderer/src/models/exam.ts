import { IBaseModel } from "./base.models";
import { IEducationSemesterSubject } from "./education";
import { ISubject } from "./subject";
import { IStudent } from "./user";

export interface IExamControl extends IBaseModel {
  archived: null | number;
  course_id: number;
  direction_id: number;
  duration: null | number;
  duration2: null | number;
  edu_plan_id: number;
  edu_semester_id: number;
  edu_year_id: number;
  faculty_id: number;
  finish: number | null;
  finish2: number | null;
  language_id: number;
  max_ball: number | null;
  max_ball2: number | null;
  name: string | null;
  old_exam_control_id: number;
  order: number;
  question: string | null;
  question2: string | null;
  question2_file: string | null;
  question_file: string | null;
  semester_id: number;
  start: number | null;
  start2: number | null;
  status: number;
  status2: number;
  appeal_at: number | null;
  appeal2_at: number | null;
  subject?: ISubject;
  subject_category_id: number;
  subject_id: number;
  teacher_access_id: number;
  teacher_user_id: number;
  time_table_id: number;
  examControlStudents?: any[];
}

export interface IExamControlStudent {
  answer: string | null;
  answer2: string | null;
  answer2_file: string | null;
  answer_file: string | null;
  archived: null;
  ball: number | null;
  ball2: number | null;
  category: number;
  conclution: number | null;
  conclution2: number | null;
  course_id: number;
  created_at: number | null;
  created_by: number | null;
  direction_id: number | null;
  duration: string | number | null;
  edu_plan_id: number | null;
  edu_semester_id: number | null;
  edu_year_id: number | null;
  exam_control_id: number | null;
  faculty_id: number | null;
  id: number | null;
  is_checked: 0 | 1;
  is_deleted: 0 | 1;
  language_id: number | null;
  main_ball: number | null;
  old_ball: number | null;
  old_ball2: number | null;
  old_exam_control_id: number | null;
  order: number;
  plagiat2_file: string | null;
  plagiat2_percent: string | null;
  plagiat_file: string | null;
  plagiat_percent: number | string | null;
  semester_id: number | null;
  start: number | null;
  status: number;
  status2: number | null;
  appeal: number | null;
  appeal2: number | null;
  appeal_text: string | null;
  appeal2_text: string | null;
  appeal_status: number | null;
  appeal2_status: number | null;
  appeal_conclution: string | null;
  appeal2_conclution: string | null;
  student_id: number | null;
  subject_category_id: number | null;
  subject_id: number | null;
  teacher_user_id: number | null;
  type: number | string | null;
  student?: IStudent;
}

export interface IExam {
  appeal_finish: string | null;
  appeal_start: string | null;
  archived: number;
  category: number;
  created_at: number;
  created_by: number;
  direction_id: number;
  duration: number;
  eduSemestrSubject: IEducationSemesterSubject;
  edu_semestr_subject_id: number;
  subject?: ISubject;
  examStudent: IExamStudent[];
  examType: IExamType;
  exam_type_id: number;
  faculty_id: number;
  finish: string;
  id: number;
  hasAccess?: number;
  is_protected: number;
  max_ball: number;
  min_ball: number;
  name: string;
  old_exam_id: number | null;
  order: number;
  question_count_by_type: number | null;
  question_count_by_type_with_ball: string;
  studentSubjectRestrict?: IStudentSubjectRestrict;
  start: string;
  status: number;
  status_appeal: number;
  surveyAnswer: IExamSurveyAnswer[];
  surveyStatus: number;
  updated_at: number;
  updated_by: number | null;
  myComputer?: IMyComputer;
}

export interface IExamType {
  created_at: number;
  created_by: number;
  id: number;
  name: string;
  order: number;
  status: number;
  updated_at: number;
  updated_by: number;
}

export interface IExamStudent {
  act: number;
  archived: number;
  attempt: number;
  ball: string | null;
  conclusion: string | null;
  created_at: number;
  created_by: number;
  duration: number;
  examStudentAnswers: IExamStudentAnswer[];
  exam_id: number;
  finish: string | null;
  has_answer: number;
  id: number;
  in_ball: number | null;
  is_checked: number;
  is_checked_full: number;
  is_plagiat: number;
  lang_id: 1;
  on1: number | null;
  on2: number | null;
  order: number;
  password: string;
  plagiat_file: string | null;
  plagiat_percent: number;
  start: number;
  status: number;
  student_id: number;
  teacher_access_id: number | null;
  type: number | null;
  updated_at: number;
  updated_by: number;
}

export interface IExamStudentAnswer extends IBaseModel {
  answer: string | null;
  appeal_teacher_conclusion: string | null;
  archived: number;
  attempt: number;
  ball: string | null;
  examStudentAnswerSubQuestion: IExamStudentAnswerSubQuestion[];
  exam_id: number;
  exam_student_id: number;
  file: string | null;
  max_ball: number;
  option_id: number | null;
  parent_id: number | null;
  question: IQuestion;
  question_id: number;
  question_type: string;
  student_id: number;
  teacher_access_id: number | null;
  teacher_conclusion: string | null;
  type: number;
}
export interface IExamStudentAnswerSubQuestion extends IBaseModel {
  exam_student_answer_id: number;
  sub_question_id: number;
  subQuestion?: ISubQuestion;
  teacher_conclusion: string | null;
  answer: string | null;
  ball: string | null;
  max_ball: number;
  appeal_teacher_conclusion: string | null;
  old_ball: string | null;
  is_cheked: number | null;
  archived: number;
}

export interface IQuestion {
  course_id: number | null;
  description: string | null;
  file: string | null;
  id: number;
  lang_id: number;
  level: number;
  options: any[];
  question: string | null;
  question_file: string | null;
  question_type_id: number;
  semestr_id: number;
  status: number;
  subQuestion: ISubQuestion[];
  subject_id: number;
  subject: ISubject;
}

export interface IQuestionType extends IBaseModel {
  name: string;
}

export interface ISubQuestion {
  id: number;
  percent: number;
  question: string | null;
  question_id: number;
}

export interface IExamSurvey extends IBaseModel {
  max: number;
  min: number;
  question: string;
  type: number;
}

export interface IExamSurveyAnswer extends IBaseModel {
  ball: number;
  exam_id: number;
  student_id: number;
  subject_id: number;
  survey_question_id: number;
  user_id: number;
}

export interface IExamQuestion extends IBaseModel {
  answer: string | null;
  appeal_teacher_conclusion: string | null;
  archived: number;
  attempt: number;
  ball: string | null;
  exam?: IExam;
  exam_id: number;
  exam_student_id: number;
  file: string | null;
  id: number;
  max_ball: number;
  option_id: number | null;
  parent_id: number | null;
  question: IQuestion;
  question_id: number;
  question_type: string;
  student_id: number;
  teacher_access_id: number;
  teacher_conclusion: string | null;
  type: number;
  examStudentAnswerSubQuestion?: IExamStudentAnswerSubQuestion[];
}

export interface IGetExamQuestion {
  new: boolean;
  questions: IExamQuestion[];
  status: boolean;
  times: {
    duration: number;
    finish: string;
    now: string;
    start: string;
  };
}

export interface IStudentSubjectRestrict extends Omit<IBaseModel, "order"> {
  description: string | null;
  edu_plan_id: number;
  edu_semestr_id: number;
  edu_semestr_subject_id: number;
  edu_year_id: number;
  faculty_id: number;
  is_deleted: number;
  semestr_id: number;
  student_id: number;
  subject_id: number;
}

export interface IMyComputer {
  building: string;
  building_id: number;
  column: number | null;
  current_ip: string;
  id: number;
  ip_address: string;
  is_right_computer: boolean;
  mac_address: string | null;
  number: string;
  room: string;
  room_id: number;
  row: string | null;
  status: number;
  is_in_time: 0 | 1;
  date: string | null;
  start: string | null;
  end: string | null;
}
