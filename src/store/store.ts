import { configureStore } from '@reduxjs/toolkit'
import testSlice from './slices/testSlice'

export const store = configureStore({
  reducer: {
    test: testSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch