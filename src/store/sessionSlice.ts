import { createSlice } from "@reduxjs/toolkit";

interface SessionType {
    _id: string;
    name: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
}
interface SessionState {
    recordData: SessionType[];
    loading: boolean;
    error: string | null | undefined;
}

const initialState: SessionState = {
    recordData: [],
    loading: false,
    error: null
}

const SessionSlice = createSlice({
    name: "Session",
    initialState,
    reducers: {
        fetchSessionStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSessionSuccess: (state, action) => {
            state.recordData = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchSessionFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchSessionStart, fetchSessionSuccess, fetchSessionFailure } = SessionSlice.actions;
export default SessionSlice.reducer;