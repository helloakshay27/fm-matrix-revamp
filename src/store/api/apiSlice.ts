import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

interface ApiState<T> {
    loading: boolean;
    success: boolean;
    error: string | null;
    data: T;
}

const createApiSlice = <T>(name: string, fetchThunk: any) => {
    const initialState: ApiState<T> = {
        loading: false,
        success: false,
        error: null,
        data: [] as unknown as T,
    };

    return createSlice({
        name,
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(fetchThunk.pending, (state) => {
                    state.loading = true;
                    state.success = false;
                    state.error = null;
                })
                .addCase(fetchThunk.fulfilled, (state, action: PayloadAction<T>) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;
                    state.data = action.payload as Draft<T>;
                })
                .addCase(fetchThunk.rejected, (state, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.payload || action.error.message;
                });
        },
    });
};

export default createApiSlice;