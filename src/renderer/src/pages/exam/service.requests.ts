import { createAsyncThunk } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import instance from "config/_axios";
import {
  IExam,
  IExamQuestion,
  IExamSurvey,
  IGetExamQuestion,
} from "models/exam";
import moment from "moment";
import { RouteComponentProps } from "react-router-dom";
import store from "store";
import { EXAM_ACTIONS } from "store/exam";

export const GetExamInfo = createAsyncThunk(
  "exam/info",
  async ({ exam_id }: { exam_id: number }) => {
    let exam_survey_questions: null | (IExamSurvey & { ball: number })[] = null;

    const exam = await instance({
      url: `/exams/${exam_id}?expand=surveyStatus,surveyAnswer,hasAccess,studentSubjectRestrict,examType,subject,type,examStudent.examStudentAnswerSubQuestion,examStudent.examStudentAnswer`,
      method: "GET",
    });

    const exam_info = (await exam.data.data) as IExam;

    if (!Boolean(exam_info.surveyStatus)) {
      const exam_surveys = await instance({
        url: `/survey-questions?sort=id`,
        method: "GET",
      });

      exam_survey_questions = exam_surveys.data.data.items;

      if (exam_survey_questions?.length) {
        const findBall = (survey_question_id: number) => {
          if (!exam_info.surveyAnswer.length) return 0;

          const findElement = exam_info.surveyAnswer.find(
            (e) => e.survey_question_id === survey_question_id
          );

          if (!findElement) return 0;

          return findElement.ball;
        };

        exam_survey_questions = exam_survey_questions.map((e) => {
          return { ...e, ball: findBall(e.id) };
        });
      }
    }

    return { exam_info, exam_survey_questions };
  }
);

export const GetExamQuestion = createAsyncThunk(
  "exam/question",
  async (
    params: {
      password: string;
      faceId: string;
      history: RouteComponentProps["history"];
      exam_id: number;
      is_protected?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const formdata = new FormData();
      formdata.append("exam_id", String(params.exam_id));

      if (params.is_protected) {
        formdata.append("password", params.password);
        if (params.faceId) formdata.append("base64Image", params.faceId);
      }

      const response = await instance({
        url: `/exam-student-answers/get-question?expand=type,question,examStudentAnswerSubQuestion`,
        method: "POST",
        data: formdata,
      });

      const exam_question_data = (await response.data.data) as IGetExamQuestion;

      let exam_question: IExamQuestion | null = null;

      let link = "";

      if (response.data.status === 1) {
        const checkTime = moment(exam_question_data.times.now).isBefore(
          exam_question_data.times.finish
        );

        if (checkTime) {
          const questions = exam_question_data.questions;

          if (Array.isArray(questions) && questions.length) {
            const exam_question_id = localStorage.getItem("exam_question_id");

            if (exam_question_id && questions.length > 1) {
              const findExamQuestion = questions.find(
                (question) => question.id === Number(exam_question_id)
              );

              if (findExamQuestion) {
                exam_question = findExamQuestion;
              } else {
                exam_question = questions[0];

                localStorage.setItem(
                  "exam_question_id",
                  String(exam_question.id)
                );
              }
            } else {
              exam_question = questions[0];

              localStorage.setItem(
                "exam_question_id",
                String(exam_question.id)
              );
            }

            questions.forEach((question) => {
              if (
                Array.isArray(question.examStudentAnswerSubQuestion) &&
                question.examStudentAnswerSubQuestion.length
              ) {
                const user_id = store.getState().auth.user.user_id;

                question.examStudentAnswerSubQuestion.forEach((element) => {
                  const key = `${user_id}_${question.exam_id}_${question.id}_${element.sub_question_id}`;

                  const isHasLocalStorage = localStorage.getItem(key);

                  // for checking in localeStorage saved only html tags if so , it should be cleared and saved instead of the response from the server
                  let htmlElement = document.createElement("DIV");

                  if (isHasLocalStorage) {
                    htmlElement.innerHTML = isHasLocalStorage;
                  }

                  if (
                    element.answer &&
                    user_id &&
                    (!isHasLocalStorage || !htmlElement.innerText?.trim())
                  ) {
                    localStorage.setItem(key, element.answer);
                  }
                });
              }
            });
          }
          params.history.push(
            `/exam/pass/${params.exam_id}/${window.btoa(
              params.is_protected ? params.password : "password"
            )}`
          );
          link = `/exam/pass/${params.exam_id}/${window.btoa(
            params.is_protected ? params.password : "password"
          )}`;
        } else {
          if (window.location.pathname.includes("exam/pass"))
            params.history.push(`/exam/info/${params.exam_id}`);
          // message.warning("SIZ UCHUN IMTIHON VAQTI TUGAGAN!");
          notification.warn({
            message: "SIZ UCHUN IMTIHON VAQTI TUGAGAN!",
            placement: "top",
            // description: "SIZ UCHUN IMTIHON VAQTI TUGAGAN!",
          });
        }
      } else {
        params.history.push(`/`);
        link = "/";
      }

      return {
        exam_questions: exam_question_data.questions,
        time: exam_question_data.times,
        exam_question,
        link,
      };
    } catch (error: any) {
      if (window.location.pathname.includes("exam/pass")) {
        params.history.push(`/exam/info/${params.exam_id}`);
      }

      return rejectWithValue(error?.response?.data);
    }
  }
);

export const checkIsHasStudentAnswer = async (
  exam_question_id: number,
  generate_key: (sub_question_id: number) => string | null,
  handleChange: (sub_question_id: number, value: string) => void
) => {
  try {
    const response = await instance({
      url: `/exam-student-answers/${exam_question_id}?expand=examStudentAnswerSubQuestion`,
      method: "GET",
    });

    const data = (await response.data.data) as IExamQuestion;

    if (response.data.status === 1) {
      store.dispatch(
        EXAM_ACTIONS.customCatchErrors({ key: "has_answer", value: 0 })
      );
    }

    if (data && data.examStudentAnswerSubQuestion?.length) {
      let answersNotInLocalStorage = [];
      data.examStudentAnswerSubQuestion.forEach((element) => {
        const key = generate_key(element.sub_question_id);

        if (key && element.answer) {
          const value = localStorage.getItem(key);

          if (!value) {
            answersNotInLocalStorage.push(1);
            handleChange(element.sub_question_id, element.answer);
          }
        }
      });

      if (answersNotInLocalStorage.length) {
        // window.location.reload();
      }
    }
  } catch (error) {
    store.dispatch(
      EXAM_ACTIONS.customCatchErrors({ key: "has_answer", value: 1 })
    );
  }
};

export const getStudentAnswerForView = async (exam_question_id: number) => {
  try {
    const response = await instance({
      url: `/exam-student-answers/${exam_question_id}?expand=question,examStudentAnswerSubQuestion.subQuestion&fields=*,question.question,question.question_file`,
      method: "GET",
    });

    const data = (await response.data.data) as IExamQuestion;

    return Promise.resolve({
      data: data,
    });
  } catch (error) {}
};
