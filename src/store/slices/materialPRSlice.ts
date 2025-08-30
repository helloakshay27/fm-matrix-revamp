import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import createApiSlice from "../api/apiSlice"

export const getSuppliers = createAsyncThunk(
    'getSuppliers',
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/get_suppliers.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get suppliers'
            return rejectWithValue(message)
        }
    }
)

export const getPlantDetails = createAsyncThunk(
    'getPlantDetails',
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/get_plant_detail.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get plants'
            return rejectWithValue(message)
        }
    }
)

export const getAddresses = createAsyncThunk(
    'getAddresses',
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/get_admin_invoice_addresses.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get addresses'
            return rejectWithValue(message)
        }
    }
)

export const getInventories = createAsyncThunk(
    'getInventories',
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/inventories/get_inventories_for_purchase_order.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get inventories'
            return rejectWithValue(message)
        }
    }
)

export const createMaterialPR = createAsyncThunk(
    'createMaterialPR',
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/purchase_orders.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create material PR'
            return rejectWithValue(message)
        }
    }
)

export const updateMaterialPR = createAsyncThunk(
    'updateMaterialPR',
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/pms/purchase_orders/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create material PR'
            return rejectWithValue(message)
        }
    }
)

export const getMaterialPR = createAsyncThunk(
    "getMaterialPR",
    async (
        {
            baseUrl,
            token,
            page,
            reference_number,
            external_id,
            supplier_name,
            approval_status,
        }: {
            baseUrl: string;
            token: string;
            page?: number;
            reference_number?: string;
            external_id?: string;
            supplier_name?: string;
            approval_status?: string; // "" should still be valid
        },
        { rejectWithValue }
    ) => {
        try {
            const queryParams = new URLSearchParams();

            if (reference_number) {
                queryParams.append("q[reference_number_eq]", reference_number);
            }
            if (external_id) {
                queryParams.append("q[external_id_eq]", external_id);
            }
            if (supplier_name) {
                queryParams.append("q[pms_supplier_company_name_cont]", supplier_name);
            }

            if (approval_status !== undefined && approval_status !== null) {
                queryParams.append("q[all_level_approved_eq]", approval_status);
            }

            const response = await axios.get(
                `https://${baseUrl}/pms/purchase_orders/letter_of_indents.json?page=${page}${queryParams.toString() ? `&${queryParams}` : ""
                }`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                (error as any).message ||
                "Failed to fetch material PR";
            return rejectWithValue(message);
        }
    }
);

export const getMaterialPRById = createAsyncThunk(
    "getMaterialPRById",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const respones = await axios.get(`https://${baseUrl}/pms/purchase_orders/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return respones.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch data.'
            return rejectWithValue(message)
        }
    }
)

export const changePlantDetails = createAsyncThunk(
    'changePlantDetails',
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/wbs_costs/get_by_plant_code.json?plant_code=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to change plant details'
            return rejectWithValue(message)
        }
    }
)

export const fetchWBS = createAsyncThunk(
    'fetchWBS',
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/wbs_costs.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch WBS'
            return rejectWithValue(message)
        }
    }
)

export const getFeeds = createAsyncThunk(
    'getFeeds',
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/${id}/feeds.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch feeds'
            return rejectWithValue(message)
        }
    }
)

export const updateActiveStaus = createAsyncThunk(
    'updateActiveStaus',
    async ({ baseUrl, token, id, data }: { baseUrl: string, token: string, id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/pms/purchase_orders/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to update active status'
            return rejectWithValue(message)
        }
    }
)

const getSuppliersSlice = createApiSlice("getSuppliers", getSuppliers);
const getPlantDetailsSlice = createApiSlice("getPlantDetails", getPlantDetails);
const getAddressesSlice = createApiSlice("getAddresses", getAddresses);
const getInventoriesSlice = createApiSlice("getInventories", getInventories);
const createMaterialPRSlice = createApiSlice("createMaterialPR", createMaterialPR);
const getMaterialPRSlice = createApiSlice("getMaterialPR", getMaterialPR);
const getMaterialPRByIdSlice = createApiSlice("getMaterialPRById", getMaterialPRById);
const changePlantDetailsSlice = createApiSlice("changePlantDetails", changePlantDetails);
const fetchWBSSlice = createApiSlice("fetchWBS", fetchWBS);
const getFeedsSlice = createApiSlice("getFeeds", getFeeds);
const updateActiveStausSlice = createApiSlice("updateActiveStaus", updateActiveStaus);
const updateMaterialPRSlice = createApiSlice("updateMaterialPR", updateMaterialPR);

export const getSuppliersReducer = getSuppliersSlice.reducer
export const getPlantDetailsReducer = getPlantDetailsSlice.reducer
export const getAddressesReducer = getAddressesSlice.reducer
export const getInventoriesReducer = getInventoriesSlice.reducer
export const createMaterialPRReducer = createMaterialPRSlice.reducer
export const getMaterialPRReducer = getMaterialPRSlice.reducer
export const getMaterialPRByIdReducer = getMaterialPRByIdSlice.reducer
export const changePlantDetailsReducer = changePlantDetailsSlice.reducer
export const fetchWBSReducer = fetchWBSSlice.reducer
export const getFeedsReducer = getFeedsSlice.reducer
export const updateActiveStausReducer = updateActiveStausSlice.reducer
export const updateMaterialPRReducer = updateMaterialPRSlice.reducer
