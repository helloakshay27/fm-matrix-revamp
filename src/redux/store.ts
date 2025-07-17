import { configureStore } from "@reduxjs/toolkit";
import {
    changeCompanyReducer,
    changeSiteReducer,
    fetchCompanyListReducer,
    fetchSiteListReducer,
    loginReducer,
    oaganizationsByEmailReducer,
} from "./login/loginSlice";

export const store = configureStore({
    reducer: {
        //login
        oaganizationsByEmail: oaganizationsByEmailReducer,
        login: loginReducer,
        fetchCompanyList: fetchCompanyListReducer,
        changeCompany: changeCompanyReducer,
        fetchSiteList: fetchSiteListReducer,
        changeSite: changeSiteReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
