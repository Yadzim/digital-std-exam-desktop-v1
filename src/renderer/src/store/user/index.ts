import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStudent } from 'models/user';
import UserMe from 'services';


export type TypeInitialStateUser = {
    user: IStudent | null,
    isLoading: boolean
}

const initialState: TypeInitialStateUser = {
    user: null,
    isLoading: false
}


const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(UserMe.pending, (state) => {
                state.isLoading = true
            })
            .addCase(UserMe.fulfilled, (state, action: PayloadAction<{ status: number, message: string, data: IStudent }>) => {
                if (action.payload && action?.payload?.status === 1) {
                    state.user = action.payload.data
                }
                state.isLoading = false
            })
            .addCase(UserMe.rejected, (state) => {
               
                    state.isLoading = false
                
            })
    }
})


export const USER_ACTIONS = UserSlice.actions;
export default UserSlice;


