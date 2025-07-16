import { configureStore } from '@reduxjs/toolkit'
import { testReducer, loginReducer } from './slices/testSlice'
import { amcReducer } from './slices/amcSlice'
import { departmentReducer } from './slices/departmentSlice'
import roleReducer from './slices/roleSlice'

export const store = configureStore({
  reducer: {
    test: testReducer,
    login: loginReducer,
    amc: amcReducer,
    department: departmentReducer,
    role: roleReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch