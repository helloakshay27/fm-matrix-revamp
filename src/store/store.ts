import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import testSlice from './slices/testSlice'

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    test: testSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch