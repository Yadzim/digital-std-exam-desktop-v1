import store from "store";
import { logout } from "store/auth";
import _logout from "./logout";
import { message } from "antd";
import { AxiosError } from "axios";
import { EXAM_ACTIONS } from "store/exam";

export class ResponseError {
  error!: AxiosError<any>;

  constructor(error: AxiosError<any>) {
    this.error = error;
    this.errors(error.response?.status);
  }

  private errors(status: number | undefined) {
    switch (status) {
      case 401:
        this[401]();
        break;
      case 403:
        this[403]();
        break;
      case 404:
        this[404]();
        break;
      case 422:
        this[422]();
        break;
      case 500:
        this[500]();
        break;
    }
  }

  private 401(): void {
    localStorage.removeItem("access_token");
    store.dispatch(logout());
    store.dispatch(EXAM_ACTIONS.clrearExamData());
    // let Backlen = window.history.length;
    // window.history.go(-Backlen);
    // // window.location.href = '/'
    // if(window.history.forward() !== null){
    //     window.history.forward();
    // }
    // const browserHistory = createBrowserHistory();
    // browserHistory.push('');

    // createBrowserHistory().deleteAll()
    if (
      Array.isArray(this.error.response?.data?.errors) &&
      this.error.response?.data?.errors.length
    ) {
      message.error(this.error.response?.data?.errors[0]);
    }
  }

  private 403(): void {
    message.error(this.error.response?.data?.message || this.error.message);
  }

  private 404(): void {
    message.error("Ma'lumot topilmadi!");
  }
  private 422(): void {
    const _errors = this.error.response?.data?.errors;

    if (this.error.response?.config.url?.includes("exams/face-check")) {
    } else if (
      this.error.response?.config.url?.includes("exam-student-answers") &&
      (this.error.response.config.method === "post" ||
        this.error.response.config.method === "put")
    ) {
      if (Array.isArray(_errors) && _errors.length === 2) {
        if (_errors[1]?.status) {
          message.error(this.error.message);
        }
      } else if (Array.isArray(_errors) && _errors.length) {
        message.error(_errors[0]);
      } else if (typeof _errors === "object") {
        for (const key in _errors) {
          message.error(key + ":  " + _errors[key]);
          return;
        }
      } else {
        message.error(this.error.message);
      }
    } else {
      if (Array.isArray(_errors) && _errors.length) {
        _errors as Array<Record<string | number, string> | string>;
        _errors.forEach((objectElement) => {
          if (typeof objectElement === "string") {
            message.error(objectElement);
          } else {
            const fieldName = Object.getOwnPropertyNames(objectElement);
            if (fieldName[0] !== "status") {
              message.error(JSON.stringify(objectElement[fieldName[0]]));
            }
          }
        });
      } else {
        message.error(this.error.message);
      }
    }
  }
  private 500(): void {
    message.error(this.error.message);
  }
}
