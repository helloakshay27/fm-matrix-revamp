import { configureStore } from '@reduxjs/toolkit'
import { testReducer, loginReducer } from './slices/testSlice'
import { amcReducer } from './slices/amcSlice'

export const store = configureStore({
  reducer: {
    test: testReducer,
    login: loginReducer,
    amc: amcReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch