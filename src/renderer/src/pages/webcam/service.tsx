import { createAsyncThunk } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import instance from "../../config/_axios";

const CheckFaceID = createAsyncThunk(
  "exam/face-check",
  async (data: { id: number; file: string }, { rejectWithValue }) => {
    try {
      let response = null;

      const formdata = new FormData();
      formdata.append("base64Image", data.file);

      response = await instance({
        url: `/exams/face-check/${data?.id}`,
        method: "POST",
        data: formdata,
      });

      const responseData = response.data;

      // if (responseData.status === 1) {
      //   if (responseData?.data?.permissions.length < 0) {
      //     message.error("ERR: user permissions are invalid !!!");
      //   } else {
      //     message.success(responseData?.message);
      //   }
      // }

      return responseData;
    } catch (error: any) {
      // message.error(error.response.data.message)
      // for (let index = 0; index < error.response.data.errors.length; index++) {
      //     message.error(error.response.data.errors[index])
      // }
      if (error.response.status === 422) {
        const errors = error.response.data?.errors ? (Array.isArray(error.response.data?.errors) ? error.response.data?.errors : Object.values(error.response.data?.errors)) ?? [] : [];

        notification.error({
          message: "Yuz tekshishda xatolik",
          description: <div>
            {errors?.map((err: any) => typeof err === "string" ? <p>{err}</p> : null)}
          </div>,
          placement: "top"
        })
      }

      return rejectWithValue(error.response);
    }
  }
);

export default CheckFaceID;
