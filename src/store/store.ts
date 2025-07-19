
import { configureStore } from '@reduxjs/toolkit'
import { testReducer, loginReducer } from './slices/testSlice'
import { amcReducer } from './slices/amcSlice'
import { amcDetailsReducer } from './slices/amcDetailsSlice'
import { servicesReducer } from './slices/servicesSlice'
import { serviceDetailsReducer } from './slices/serviceDetailsSlice'
import { departmentReducer } from './slices/departmentSlice'
import roleReducer from './slices/roleSlice'
import { functionReducer } from './slices/functionSlice'
import fmUserReducer from './slices/fmUserSlice'
import userCountsReducer from './slices/userCountsSlice'
import occupantUsersReducer from './slices/occupantUsersSlice'
import occupantUserCountsReducer from './slices/occupantUserCountsSlice'
import projectReducer from './slices/projectSlice'
import siteReducer from './slices/siteSlice'
import helpdeskCategoriesReducer from './slices/helpdeskCategoriesSlice'
import responseEscalationReducer from './slices/responseEscalationSlice'
import resolutionEscalationReducer from './slices/resolutionEscalationSlice'
import costApprovalReducer from './slices/costApprovalSlice'
import { facilityBookingsReducer } from './slices/facilityBookingsSlice'
import entitiesReducer from './slices/entitiesSlice'
import facilitySetupsReducer from './slices/facilitySetupsSlice'
import { assetsReducer } from './slices/assetsSlice'
import { suppliersReducer } from './slices/suppliersSlice'
import { amcCreateReducer } from './slices/amcCreateSlice'
import { inventoryReducer } from './slices/inventorySlice'
import { locationReducer } from './slices/locationSlice'
import serviceLocationReducer from './slices/serviceLocationSlice'
import { attendanceReducer } from './slices/attendanceSlice'
import { inventoryAssetsReducer } from './slices/inventoryAssetsSlice'
import inventoryEditReducer from './slices/inventoryEditSlice'
import serviceEditReducer from './slices/serviceSlice'

export const store = configureStore({
  reducer: {
    test: testReducer,
    login: loginReducer,
    amc: amcReducer,
    amcDetails: amcDetailsReducer,
    services: servicesReducer,
    serviceDetails: serviceDetailsReducer,
    department: departmentReducer,
    role: roleReducer,
    function: functionReducer,
    fmUsers: fmUserReducer,
    userCounts: userCountsReducer,
    occupantUsers: occupantUsersReducer,
    occupantUserCounts: occupantUserCountsReducer,
    project: projectReducer,
    site: siteReducer,
    helpdeskCategories: helpdeskCategoriesReducer,
    responseEscalation: responseEscalationReducer,
    resolutionEscalation: resolutionEscalationReducer,
    costApproval: costApprovalReducer,
    facilityBookings: facilityBookingsReducer,
    entities: entitiesReducer,
    facilitySetups: facilitySetupsReducer,
    assets: assetsReducer,
    suppliers: suppliersReducer,
    amcCreate: amcCreateReducer,
    inventory: inventoryReducer,
    location: locationReducer,
    serviceLocation: serviceLocationReducer,
    attendance: attendanceReducer,
    inventoryAssets: inventoryAssetsReducer,
    inventoryEdit: inventoryEditReducer,
    serviceEdit: serviceEditReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
