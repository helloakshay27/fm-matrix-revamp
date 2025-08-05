import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchRestaurants = createAsyncThunk(
    "fetchRestaurants",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.restaurants;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch restaurants";
            return rejectWithValue(message);
        }
    }
);

export const createRestaurant = createAsyncThunk(
    "createRestaurant",
    async (
        { baseUrl, token, data }: { baseUrl: string; token: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/pms/admin/restaurants.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create restaurant";
            return rejectWithValue(message);
        }
    }
);

export const fetchRestaurantDetails = createAsyncThunk(
    "fetchRestaurantDetails",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch restaurant details";
            return rejectWithValue(message);
        }
    }
);

export const editRestaurant = createAsyncThunk(
    "editRestaurant",
    async (
        {
            baseUrl,
            token,
            id,
            data,
        }: { baseUrl: string; token: string; id: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/pms/admin/restaurants/${id}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to edit restaurant";
            return rejectWithValue(message);
        }
    }
);

export const createRestaurantStatus = createAsyncThunk(
    "createRestaurantStatus",
    async (
        {
            baseUrl,
            token,
            data,
            id,
        }: { baseUrl: string; token: string; data: any; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_statuses.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create restaurant status";
            return rejectWithValue(message);
        }
    }
);

export const fetchRestaurantStatuses = createAsyncThunk(
    "fetchRestaurantStatuses",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_statuses.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.statuses;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch restaurant statuses";
            return rejectWithValue(message);
        }
    }
);

export const deleteRestaurantStatus = createAsyncThunk("deleteRestaurantStatus", async ({ baseUrl, token, id, statusId, data }: { baseUrl: string; token: string; id: number; statusId: number; data: any }, { rejectWithValue }) => {
    try {
        const response = await axios.patch(
            `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_statuses/${statusId}.json`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to delete restaurant status";
        return rejectWithValue(message);
    }
})

export const editRestaurantStatus = createAsyncThunk("editRestaurantStatus", async ({ baseUrl, token, id, statusId, data }: { baseUrl: string; token: string; id: number; statusId: number; data: any }, { rejectWithValue }) => {
    try {
        const response = await axios.put(
            `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_statuses/${statusId}.json`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to edit restaurant status";
        return rejectWithValue(message);
    }
})

export const createRestaurantCategory = createAsyncThunk(
    "createRestaurantCategory",
    async (
        {
            baseUrl,
            token,
            data,
            id,
        }: { baseUrl: string; token: string; data: any; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_categories.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create restaurant category";
            return rejectWithValue(message);
        }
    }
);

export const fetchRestaurantCategory = createAsyncThunk(
    "fetchRestaurantCategory",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_categories.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.categories;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch restaurant category";
            return rejectWithValue(message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "deleteCategory",
    async (
        {
            baseUrl,
            token,
            id,
            catId,
        }: { baseUrl: string; token: string; id: number; catId: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.delete(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_categories/${catId}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete category";
            return rejectWithValue(message);
        }
    }
);

export const editCategory = createAsyncThunk(
    "editCategory",
    async (
        {
            baseUrl,
            token,
            id,
            catId,
            data,
        }: { baseUrl: string; token: string; id: number; catId: number; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_categories/${catId}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to edit category";
            return rejectWithValue(message);
        }
    }
);

export const createSubcategory = createAsyncThunk(
    "createSubcategory",
    async (
        {
            baseUrl,
            token,
            id,
            data,
        }: { baseUrl: string; token: string; id: number; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_sub_categories.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create subcategory";
            return rejectWithValue(message);
        }
    }
);

export const fetchSubcategory = createAsyncThunk(
    "fetchSubcategory",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_sub_categories.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.sub_categories;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create subcategory";
            return rejectWithValue(message);
        }
    }
);

export const deleteSubCategory = createAsyncThunk(
    "deleteSubCategory",
    async (
        {
            baseUrl,
            token,
            id,
            subId,
        }: { baseUrl: string; token: string; id: number; subId: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.delete(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_sub_categories/${subId}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete subcategory";
            return rejectWithValue(message);
        }
    }
);

export const editSubCategory = createAsyncThunk(
    "editSubCategory",
    async (
        {
            baseUrl,
            token,
            id,
            subId,
            data,
        }: { baseUrl: string; token: string; id: number; subId: number; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_sub_categories/${subId}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to edit subcategory";
            return rejectWithValue(message);
        }
    }
)

export const createMenu = createAsyncThunk(
    "createMenu",
    async ({ baseUrl, token, id, data }: { baseUrl: string; token: string; id: number; data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_menus.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create menu";
            return rejectWithValue(message);
        }
    }
)

export const fetchMenu = createAsyncThunk(
    "fetchMenu",
    async ({ baseUrl, token, id }: { baseUrl: string; token: string; id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_menus.json?active`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.restaurant_menu;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch menu";
            return rejectWithValue(message);
        }
    }
)

export const fetchRestaurantBookings = createAsyncThunk(
    "fetchRestaurantBookings",
    async ({ baseUrl, token, id }: { baseUrl: string; token: string; id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}/table_bookings.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch restaurant bookings";
            return rejectWithValue(message);
        }
    }
)

export const fetchRestaurantOrders = createAsyncThunk(
    "fetchRestaurantOrders",
    async ({ baseUrl, token, id, pageSize, currentPage }: { baseUrl: string; token: string; id: number; pageSize: number; currentPage: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}/food_orders.json?all=true&page=${currentPage}&per_page=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch restaurant orders";
            return rejectWithValue(message);
        }
    }
)

export const fetchMenuDetails = createAsyncThunk(
    "fetchMenuDetails",
    async ({ baseUrl, token, id, mid }: { baseUrl: string; token: string; id: number, mid: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_menus/${mid}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch menu details";
            return rejectWithValue(message);
        }
    }
)

export const updateMenu = createAsyncThunk(
    "updateMenu",
    async ({ baseUrl, token, id, mid, data }: { baseUrl: string; token: string; id: number, mid: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_menus/${mid}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update menu";
            return rejectWithValue(message);
        }
    }
)

export const fetchOrderDetails = createAsyncThunk(
    "fetchOrderDetails",
    async ({ baseUrl, token, id, oid }: { baseUrl: string; token: string; id: number, oid: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}/food_orders/${oid}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch order details";
            return rejectWithValue(message);
        }
    }
)

export const exportOrders = createAsyncThunk(
    "exportOrders",
    async ({ baseUrl, token, id }: { baseUrl: string; token: string; id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}/food_orders.xlsx`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    },
                    responseType: "blob",
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to export orders";
            return rejectWithValue(message);
        }
    }
)

export const fetchRestaurantsSlice = createApiSlice(
    "fetchRestaurants",
    fetchRestaurants
);
export const createRestaurantSlice = createApiSlice(
    "createRestaurant",
    createRestaurant
);
export const fetchRestaurantDetailsSlice = createApiSlice(
    "fetchRestaurantDetails",
    fetchRestaurantDetails
);
export const editRestaurantSlice = createApiSlice(
    "editRestaurant",
    editRestaurant
);
export const createRestaurantStatusSlice = createApiSlice(
    "createRestaurantStatus",
    createRestaurantStatus
);
export const fetchRestaurantStatusesSlice = createApiSlice(
    "fetchRestaurantStatuses",
    fetchRestaurantStatuses
);
export const createRestaurantCategorySlice = createApiSlice(
    "createRestaurantCategory",
    createRestaurantCategory
);
export const fetchRestaurantCategorySlice = createApiSlice(
    "fetchRestaurantCategory",
    fetchRestaurantCategory
);
export const deleteCategorySlice = createApiSlice(
    "deleteCategory",
    deleteCategory
);
export const editCategorySlice = createApiSlice("editCategory", editCategory);
export const createSubcategorySlice = createApiSlice(
    "createSubcategory",
    createSubcategory
);
export const fetchSubcategorySlice = createApiSlice(
    "fetchSubcategory",
    fetchSubcategory
);
export const deleteSubCategorySlice = createApiSlice(
    "deleteSubCategory",
    deleteSubCategory
);
export const editRestaurantStatusSlice = createApiSlice(
    "editRestaurantStatus",
    editRestaurantStatus
);
export const deleteRestaurantStatusSlice = createApiSlice(
    "deleteRestaurantStatus",
    deleteRestaurantStatus
);
export const editSubCategorySlice = createApiSlice(
    "editSubCategory",
    editSubCategory
);
export const fetchRestaurantBookingsSlice = createApiSlice(
    "fetchRestaurantBookings",
    fetchRestaurantBookings
);
export const createMenuSlice = createApiSlice(
    "createMenu",
    createMenu
);
export const fetchMenuSlice = createApiSlice(
    "fetchMenu",
    fetchMenu
);
export const fetchMenuDetailsSlice = createApiSlice(
    "fetchMenuDetails",
    fetchMenuDetails
);
export const fetchOrderDetailsSlice = createApiSlice(
    "fetchOrderDetails",
    fetchOrderDetails
);
export const exportOrdersSlice = createApiSlice(
    "exportOrders",
    exportOrders
);
export const fetchRestaurantOrdersSlice = createApiSlice(
    "fetchRestaurantOrders",
    fetchRestaurantOrders
)
export const updateMenuSlice = createApiSlice(
    "updateMenu",
    updateMenu
)

export const fetchRestaurantsReducer = fetchRestaurantsSlice.reducer;
export const createRestaurantReducer = createRestaurantSlice.reducer;
export const fetchRestaurantDetailsReducer =
    fetchRestaurantDetailsSlice.reducer;
export const editRestaurantReducer = editRestaurantSlice.reducer;
export const createRestaurantStatusReducer =
    createRestaurantStatusSlice.reducer;
export const fetchRestaurantStatusesReducer =
    fetchRestaurantStatusesSlice.reducer;
export const createRestaurantCategoryReducer =
    createRestaurantCategorySlice.reducer;
export const fetchRestaurantCategoryReducer =
    fetchRestaurantCategorySlice.reducer;
export const deleteCategoryReducer = deleteCategorySlice.reducer;
export const editCategoryReducer = editCategorySlice.reducer;
export const createSubcategoryReducer = createSubcategorySlice.reducer;
export const fetchSubcategoryReducer = fetchSubcategorySlice.reducer;
export const deleteSubCategoryReducer = deleteSubCategorySlice.reducer;
export const editRestaurantStatusReducer = editRestaurantStatusSlice.reducer;
export const deleteRestaurantStatusReducer = deleteRestaurantStatusSlice.reducer;
export const editSubCategoryReducer = editSubCategorySlice.reducer;
export const fetchRestaurantBookingsReducer = fetchRestaurantBookingsSlice.reducer;
export const createMenuReducer = createMenuSlice.reducer;
export const fetchMenuReducer = fetchMenuSlice.reducer;
export const fetchMenuDetailsReducer = fetchMenuDetailsSlice.reducer;
export const fetchOrderDetailsReducer = fetchOrderDetailsSlice.reducer;
export const exportOrdersReducer = exportOrdersSlice.reducer;
export const fetchRestaurantOrdersReducer = fetchRestaurantOrdersSlice.reducer
export const updateMenuReducer = updateMenuSlice.reducer
