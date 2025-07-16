import { configureStore } from '@reduxjs/toolkit'
import { testReducer, loginReducer } from './slices/testSlice'

export const store = configureStore({
  reducer: {
    test: testReducer,
    login: loginReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch