import { configureStore } from '@reduxjs/toolkit'
import { testReducer, loginReducer } from './slices/testSlice'
import { amcReducer } from './slices/amcSlice'
import { departmentReducer } from './slices/departmentSlice'
import roleReducer from './slices/roleSlice'
import { functionReducer } from './slices/functionSlice'
import fmUserReducer from './slices/fmUserSlice'
import userCountsReducer from './slices/userCountsSlice'

export const store = configureStore({
  reducer: {
    test: testReducer,
    login: loginReducer,
    amc: amcReducer,
    department: departmentReducer,
    role: roleReducer,
    function: functionReducer,
    fmUsers: fmUserReducer,
    userCounts: userCountsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch