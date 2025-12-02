import { createSlice } from "@reduxjs/toolkit";
import type { UserType } from "../types/userType";

interface GuardianState {
    recordData: UserType[];
    loading: boolean;
    error: string | null | undefined;
}

const initialState: GuardianState = {
    recordData: [],
    loading: false,
    error: null
}

const GuardianSlice = createSlice({
    name: "Guardian",
    initialState,
    reducers: {
        fetchGuardianStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchGuardianSuccess: (state, action) => {
            state.recordData = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchGuardianFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchGuardianStart, fetchGuardianSuccess, fetchGuardianFailure } = GuardianSlice.actions;
export default GuardianSlice.reducer;