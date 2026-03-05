import instance from ".";
import { asyncN } from "utils/notifications";
import store from "store";
import { logout } from "store/auth";
import { message } from "antd";
import { createBrowserHistory } from "history";
import { EXAM_ACTIONS } from "store/exam";
import { resetFaceID } from "store/faceID";

export const _logoutExam = async () => {
  try {
    const history = createBrowserHistory();
    const formdata = new FormData();
    formdata.append("is_main", "2");
    const response = await instance({
      url: "/auth/logout",
      method: "POST",
      data: formdata,
    });
    if (response.data?.status === 1) {
      localStorage.removeItem("access_token");
      asyncN("success", "read", response.data?.message).then(() => {
        localStorage.clear();
        store.dispatch(EXAM_ACTIONS.clrearExamData());
        sessionStorage.clear();
        history.push("/");
        store.dispatch(logout());
        store.dispatch(resetFaceID({}));
      });
    }
  } catch (error: any) {
    message.error(error?.response?.message);
  }
};

const _logout = async () => {
  try {
    const history = createBrowserHistory();
    const formdata = new FormData();
    formdata.append("is_main", "2");
    const response = await instance({
      url: "/auth/logout",
      method: "POST",
      data: formdata,
    });
    if (response.data?.status === 1) {
      localStorage.removeItem("access_token");
      asyncN("success", "read", response.data?.message).then(() => {
        // localStorage.clear();
        store.dispatch(EXAM_ACTIONS.clrearExamData());
        sessionStorage.clear();
        history.push("/");
        store.dispatch(logout());
        store.dispatch(resetFaceID({}));
      });
    }
  } catch (error: any) {
    message.error(error?.response?.message);
  }
};

export default _logout;
