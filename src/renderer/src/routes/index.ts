/** @format */

import { RoutesTypeSubmenu } from "./types";
import { FaBriefcase } from "react-icons/fa";
import { BiCalendarCheck, BiHomeAlt } from "react-icons/bi";
import Login from "pages/login";
import ExamInfo from "pages/exam/pages/exam_info";
import ExamQuestionAnswersView from "pages/exam/components/ExamQuestionAnswersView";
import StudentExamHomePage from "pages/exam";
import ExamWriting from "pages/exam/pages/exam_writing";
import WebcamAuth from "pages/webcam/old";
export const public_routes: Array<RoutesTypeSubmenu> = [
  {
    name: "Login",
    path: "/",
    component: Login,
    config: {
      key: "unlock",
      icon: FaBriefcase,
      structure: "nonlayout",
      exact: true,
      isShowLink: false,
    },
  },
];

export const student_routes: Array<RoutesTypeSubmenu> = [
  {
    name: "Home",
    path: "/",
    component: StudentExamHomePage,
    config: {
      key: "unlock",
      icon: BiHomeAlt,
      structure: "student_layout",
      exact: true,
      isShowLink: true,
    },
  },
  {
    name: "Login",
    path: "/login",
    component: Login,
    config: {
      key: "unlock",
      icon: FaBriefcase,
      structure: "nonlayout",
      exact: true,
      isShowLink: false,
    },
  },
  {
    name: "Webcam",
    path: "/webcam",
    component: WebcamAuth,
    config: {
      key: "unlock",
      icon: BiHomeAlt,
      structure: "student_layout",
      exact: true,
      isShowLink: true,
    },
  },
  {
    name: "Imtihon",
    path: "/exam/info/:exam_id",
    component: ExamInfo,
    config: {
      key: "unlock",
      icon: BiCalendarCheck,
      structure: "student_layout",
      exact: true,
      isShowLink: false,
    },
  },
  {
    name: "Exams New",
    path: "/exam/pass/:exam_id/:password",
    component: ExamWriting,
    config: {
      key: "unlock",
      icon: BiCalendarCheck,
      structure: "student_layout",
      exact: true,
      isShowLink: false,
    },
  },
  {
    name: "Imtihon",
    path: "/exam/student/answers/:exam_id",
    component: ExamQuestionAnswersView,
    config: {
      key: "unlock",
      icon: BiCalendarCheck,
      structure: "student_layout",
      exact: true,
      isShowLink: false,
    },
  },
];
