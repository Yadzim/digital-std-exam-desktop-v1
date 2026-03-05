import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "config/_axios"



const UserMe = createAsyncThunk(
    'user/UserMe',
    async (url: string, { rejectWithValue }) => {
        try {

            const response = await instance({ url, method: 'GET' });
            return response.data;


        } catch (error: any) {

            return rejectWithValue(error.response);
        }
    }
)

export default UserMe;