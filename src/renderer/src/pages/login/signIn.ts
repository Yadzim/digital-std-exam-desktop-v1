import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import instance from "../../config/_axios";

const SignIn = createAsyncThunk(
  "user/SignIn",
  async (data: { type: string; data?: any }, { rejectWithValue }) => {
    try {
      let response = null;
      if (data.type === "login") {
        response = await instance({
          url: "/auth/login",
          method: "POST",
          data: data?.data ? data.data : null,
        });
      } else {
        response = await instance({
          url: "/users/me",
          method: "GET",
          params: { is_main: 2 },
        });
      }
      const responseData = response.data;
      if (responseData?.data?.access_token) {
        localStorage.setItem("access_token", responseData.data.access_token);
      }

      if (responseData.status === 1) {
        if (responseData?.data?.permissions.length < 0) {
          message.error("ERR: user permissions are invalid !!!");
        } else {
          message.success(responseData?.message);
        }
      }

      return responseData;
    } catch (error: any) {
      // message.error(error.response.data.message)
      // for (let index = 0; index < error.response.data.errors.length; index++) {
      //     message.error(error.response.data.errors[index])
      // }

      return rejectWithValue(error.response);
    }
  }
);

export default SignIn;
