import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IExam,
  IExamQuestion,
  IExamSurvey,
  IGetExamQuestion,
} from "models/exam";
import { GetExamInfo, GetExamQuestion } from "pages/exam/service.requests";
// import { createBrowserHistory } from 'history';

export type InitialStateExamStore = {
  isPrivate: boolean;
  isAuthenticatedExam: boolean;
  faceId: {
    url: string | null;
    urlBase64: string | null;
    isAuthenticated: boolean;
  };
  faceError: boolean;
  exam_info: {
    data: Partial<IExam>;
    isLoading: boolean;
    isAgreement: number | null;
    exam_survey_questions: (IExamSurvey & { ball: number })[] | null;
  };
  pass_exam: {
    time: IGetExamQuestion["times"] | null;
    exam_question: IExamQuestion | null;
    exam_questions: IExamQuestion[] | null;
    isLoading: boolean;
    question_count: number[];
    fontSize: number;
  };
  exam_errors: {
    isError: number;
    has_answer: number;
  };
};

const initialState: InitialStateExamStore = {
  isPrivate: false,
  isAuthenticatedExam: false,
  faceId: {
    url: null,
    urlBase64: null,
    isAuthenticated: false,
  },
  faceError: false,
  exam_info: {
    data: {},
    isLoading: false,
    isAgreement: null,
    exam_survey_questions: null,
  },
  pass_exam: {
    time: null,
    exam_question: null,
    exam_questions: null,
    isLoading: false,
    question_count: [],
    fontSize: 0,
  },
  exam_errors: {
    isError: 0,
    has_answer: 0,
  },
};

const examSlice = createSlice({
  name: "exam",
  initialState: initialState,
  reducers: {
    selectExamQuestion(
      state,
      action: PayloadAction<{ exam_question_id: number }>
    ) {
      const { exam_question_id } = action.payload;
      if (exam_question_id) {
        const findExamQuestion = state.pass_exam.exam_questions?.find(
          (e) => e.id === exam_question_id
        );

        if (findExamQuestion) {
          state.pass_exam.exam_question = findExamQuestion;
        }
      }
    },
    customCatchErrors(
      state,
      action: PayloadAction<{
        key: keyof InitialStateExamStore["exam_errors"];
        value: number;
      }>
    ) {
      const { key, value } = action.payload;
      state.exam_errors.isError = value;
      state.exam_errors[key] = value;
    },
    clrearExamData(state) {
      state.exam_info = initialState.exam_info;
      state.exam_errors = initialState.exam_errors;
      state.pass_exam = initialState.pass_exam;
      state.faceId.url = null;
      state.faceId.urlBase64 = null;
      state.faceId.isAuthenticated = false;
    },
    agreementToggle(
      state,
      action: PayloadAction<{ isAgreement: number | null }>
    ) {
      state.exam_info.isAgreement = action.payload.isAgreement;
    },
    setSurveyStatus(state) {
      state.exam_info.data.surveyStatus = 1;
    },
    setFaceId(
      state,
      action: PayloadAction<{
        url: string;
        urlBase64: string | null;
        user_id: number;
      }>
    ) {
      const { url, urlBase64 } = action.payload;
      state.faceId.url = url;
      state.faceId.urlBase64 = urlBase64;
      // sessionStorage.setItem(`${user_id}_${state.exam_info?.data?.id}`, url)
    },
    clearFaceId(state) {
      state.faceId = initialState.faceId;
    },
    toggleFontSize(
      state,
      action: PayloadAction<{ type: "increment" | "decrement" }>
    ) {
      let { fontSize } = state.pass_exam;

      if (action.payload.type === "increment") {
        if (fontSize < 15) {
          state.pass_exam.fontSize = ++fontSize;
        }
      } else {
        if (fontSize >= 0) {
          state.pass_exam.fontSize = --fontSize;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetExamInfo.pending, (state) => {
        state.exam_info.isLoading = true;
      })
      .addCase(
        GetExamInfo.fulfilled,
        (
          state,
          action: PayloadAction<{
            exam_info: IExam;
            exam_survey_questions: (IExamSurvey & { ball: number })[] | null;
          }>
        ) => {
          const { exam_info, exam_survey_questions } = action.payload;

          state.exam_info.data = exam_info;
          state.exam_info.exam_survey_questions = exam_survey_questions;
          state.exam_info.isLoading = false;
          // if (Array.isArray(exam_info.examStudent) && exam_info.examStudent.length) {

          //     if (!exam_info.examStudent[0].start) {
          //         state.exam_info.isAgreement = true;
          //     }
          // }
        }
      )
      .addCase(GetExamInfo.rejected, (state) => {
        state.exam_info.isLoading = false;
      })
      .addCase(GetExamQuestion.pending, (state) => {
        state.pass_exam.isLoading = true;
      })
      .addCase(
        GetExamQuestion.fulfilled,
        (
          state,
          action: PayloadAction<{
            time: IGetExamQuestion["times"];
            exam_questions: IExamQuestion[];
            exam_question: IExamQuestion | null;
            link: string;
          }>
        ) => {
          // const history = createBrowserHistory();

          const { exam_questions, exam_question, time } = action.payload;

          if (exam_questions.length) {
            state.pass_exam.exam_question = exam_question;
            state.pass_exam.exam_questions = exam_questions;

            if (exam_questions.length > 1) {
              state.pass_exam.question_count = exam_questions.map((e) => e.id);
            }
          }
          // if(link) history.push(link);
          state.pass_exam.time = time;
          state.pass_exam.isLoading = false;
          state.faceId.isAuthenticated = true;
          state.faceError = false;
        }
      )
      .addCase(
        GetExamQuestion.rejected,
        (state, action: PayloadAction<any>) => {
          state.pass_exam.isLoading = false;

          console.log(action.payload);

          if (action.payload?.errors?.FaceError) {
            state.faceError = true;
          }

          // if (Array.isArray(action.payload?.errors)) {
          //   action.payload?.errors?.forEach((err: string) => {
          //     if (err.includes("Face ID")) {
          //       state.faceId = initialState.faceId;
          //       return;
          //     }
          //   });
          // } else {
          //   if (action.payload?.errors?.faceID) {
          //     state.faceId = initialState.faceId;
          //     return;
          //   }
          // }
        }
      );
  },
});

export const EXAM_ACTIONS = examSlice.actions;

export default examSlice;
