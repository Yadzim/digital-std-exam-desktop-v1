/** @format */

import { IBaseModel } from "./base.models";

export interface IDormitoryCategoryType extends Omit<IBaseModel, "order"> {
  name: string;
  ball: null | number;
  hostel_category_id: number;
}

export interface IDormitoryCategory extends IBaseModel {
  key: string;
  name: string;
  types: IDormitoryCategoryType[];
}

export interface IDormitoryPetition extends IBaseModel {
  ball: null | number;
  conclution: string | null;
  description: null | string;
  edu_year_id: number;
  faculty_id: number;
  student_id: number;
  user_id: number;
  hostelDoc: Array<IDormitoryDocument>;
  is_deleted: number;
}

export interface IDormitoryDocument extends IBaseModel {
  file: string;
  description: null | string;
  hostel_app_id: number;
  hostel_category_id: number;
  hostel_category_type_id: number;
  is_checked: null | number;
  student_id: number;
  type: null | number;
  user_id: number;
}
