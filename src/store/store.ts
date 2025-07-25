
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
import { editFacilityBookingSetupReducer, exportReportReducer, facilityBookingSetupDetailsReducer, facilityBookingsReducer, fetchBookingDetailsReducer, filterBookingsReducer } from './slices/facilityBookingsSlice'
import entitiesReducer from './slices/entitiesSlice'
import facilitySetupsReducer, { fetchFacilitySetupReducer } from './slices/facilitySetupsSlice'
import { assetsReducer } from './slices/assetsSlice'
import { suppliersReducer } from './slices/suppliersSlice'
import { amcCreateReducer } from './slices/amcCreateSlice'
import { inventoryReducer } from './slices/inventorySlice'
import { locationReducer } from './slices/locationSlice'
import serviceLocationReducer from './slices/serviceLocationSlice'
import { attendanceReducer } from './slices/attendanceSlice'
import { inventoryAssetsReducer } from './slices/inventoryAssetsSlice'
import inventoryEditReducer from './slices/inventoryEditSlice'
import serviceEditReducer, { createServiceReducer, fetchServiceReducer, updateServiceReducer } from './slices/serviceSlice'
import serviceFilterReducer from './slices/serviceFilterSlice'
import { createMenuReducer, createRestaurantCategoryReducer, createRestaurantReducer, createRestaurantStatusReducer, createSubcategoryReducer, deleteCategoryReducer, deleteRestaurantStatusReducer, deleteSubCategoryReducer, editCategoryReducer, editRestaurantReducer, editRestaurantStatusReducer, editSubCategoryReducer, exportOrdersReducer, fetchMenuDetailsReducer, fetchMenuReducer, fetchOrderDetailsReducer, fetchRestaurantBookingsReducer, fetchRestaurantCategoryReducer, fetchRestaurantDetailsReducer, fetchRestaurantsReducer, fetchRestaurantStatusesReducer, fetchSubcategoryReducer } from './slices/f&bSlice'
import { fetchMasterUnitsReducer } from './slices/unitMaster'
import { createInventoryConsumptionReducer, inventoryConsumptionReducer } from './slices/inventoryConsumptionSlice'
import { inventoryConsumptionDetailsReducer } from './slices/inventoryConsumptionDetailsSlice'
import { ecoFriendlyListReducer } from './slices/ecoFriendlyListSlice'
import buildingsReducer from './slices/buildingsSlice'
import wingsReducer from './slices/wingsSlice'
import floorsReducer from './slices/floorsSlice'
import zonesReducer from './slices/zonesSlice'
import roomsReducer from './slices/roomsSlice'

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
    serviceFilter: serviceFilterReducer,
    inventoryConsumption: inventoryConsumptionReducer,
    inventoryConsumptionDetails: inventoryConsumptionDetailsReducer,
    ecoFriendlyList: ecoFriendlyListReducer,
    buildings: buildingsReducer,
    wings: wingsReducer,
    floors: floorsReducer,
    zones: zonesReducer,
    rooms: roomsReducer,

    fetchBookingDetails: fetchBookingDetailsReducer,
    exportReport: exportReportReducer,
    fetchRestaurants: fetchRestaurantsReducer,
    createRestaurant: createRestaurantReducer,
    fetchRestaurantDetails: fetchRestaurantDetailsReducer,
    editRestaurant: editRestaurantReducer,
    createRestaurantStatus: createRestaurantStatusReducer,
    fetchRestaurantStatuses: fetchRestaurantStatusesReducer,
    createRestaurantCategory: createRestaurantCategoryReducer,
    fetchRestaurantCategory: fetchRestaurantCategoryReducer,
    deleteCategory: deleteCategoryReducer,
    editCategory: editCategoryReducer,
    createSubcategory: createSubcategoryReducer,
    fetchSubcategory: fetchSubcategoryReducer,
    deleteSubCategory: deleteSubCategoryReducer,
    deleteRestaurantStatus: deleteRestaurantStatusReducer,
    editRestaurantStatus: editRestaurantStatusReducer,
    editSubCategory: editSubCategoryReducer,
    fetchRestaurantBookings: fetchRestaurantBookingsReducer,
    createMenu: createMenuReducer,
    fetchMenu: fetchMenuReducer,
    fetchFacilitySetup: fetchFacilitySetupReducer,
    fetchMenuDetails: fetchMenuDetailsReducer,
    fetchOrderDetails: fetchOrderDetailsReducer,
    exportOrders: exportOrdersReducer,
    editFacilityBookingSetup: editFacilityBookingSetupReducer,
    filterBookings: filterBookingsReducer,

    // Unit Master
    fetchMasterUnits: fetchMasterUnitsReducer,
    createInventoryConsumption: createInventoryConsumptionReducer,
    facilityBookingSetupDetails: facilityBookingSetupDetailsReducer,

    // Service Slices
    fetchService: fetchServiceReducer,
    createService: createServiceReducer,
    updateService: updateServiceReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
