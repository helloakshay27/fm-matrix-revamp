import { createAsyncThunk } from "@reduxjs/toolkit";
import createApiSlice from "../api/apiSlice";
import {
  fetchFacilityBookings,
  type FacilityBookingsResponse,
} from "@/services/bookingService";
import axios from "axios";

interface FetchBookingDetails {
  baseUrl: string;
  token: string;
  id: string;
}

export interface FacilityBookingDetails {
  id: number;
  current_status: string;
  booked_by_name: string;
  startdate: string;
  show_schedule_24_hour: string;
  created_at: string;
  comment: string;
  sgst: number;
  gst: number;
  payment_method: string;
  facility_name: string;
  created_by_name: string;
  fac_type: string;
  user_id?: number;
  selected_slots?: any[];
  member_count?: number;
  member_charges?: number;
  guest_count?: number;
  guest_charges?: number;
  slot_charges?: number;
  sub_total?: number;
  discount?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  conv_charge?: number;
  amount_full?: number;
  payment_status?: string;
  payment_mode?: string;
  amount_paid?: number;
  pg_state?: string;
  pg_transaction_id?: string;
  pg_response_code?: string;
  deposit_amount?: number;
  can_cancel_bool?: boolean;
  /** @deprecated superseded by cancellation_tiers / cancellation_type — ignore in new cancellation flow */
  can_cancel?: {
    amount: number;
    return_percentage: number;
  };
  cancellation_tiers?: {
    tier: string | number;
    /** Minutes before the slot at/after which this tier's refund applies. */
    min_before?: number;
    return_percentage: number;
    amount: number;
  }[];
  cancellation_type?: "free" | "paid";
  return_percentage?: number;
  returned_amount?: number;
  free_cancellation_reason?: string;
  cancelled_on?: string;
  booked_members?: any[];
  facility_booking_accessories?: {
    facility_booking_accessory: {
      id: number;
      quantity: number;
      price: number;
      total: number;
      name: string;
    };
  }[];
  total?: number;
  facility_charge?: number;
  facility_gst?: number;
  facility_sgst?: number;
  charge_type?: string;
  tentative_price?: number;
  coupon?: {
    code?: string;
    discount?: number;
  } | null;
}

export interface FacilityBookingResponse {
  facility_booking: FacilityBookingDetails;
}

// Create async thunk for fetching facility bookings
export const fetchFacilityBookingsData = createAsyncThunk(
  "facilityBookings/fetchFacilityBookingsData",
  async ({ baseUrl, token, pageSize, currentPage, userId }: { baseUrl: string, token: string, pageSize: number, currentPage: number, userId?: number }, { rejectWithValue }) => {
    try {
      const data = await fetchFacilityBookings({ baseUrl, token, pageSize, currentPage, userId });
      console.log(data)
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch facility bookings"
      );
    }
  }
);

export const fetchBookingDetails = createAsyncThunk(
  "fetchBookingDetails",
  async ({ baseUrl, token, id }: FetchBookingDetails, { rejectWithValue }) => {
    try {
      const response = await axios.get<FacilityBookingResponse>(
        `https://${baseUrl}/pms/admin/facility_bookings/${id}.json`,
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
        "Failed to fetch booking details";
      return rejectWithValue(message);
    }
  }
);

export const exportReport = createAsyncThunk(
  "exportReport",
  async (
    { baseUrl, token }: { baseUrl: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/admin/facility_bookings.xlsx`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch booking details";
      return rejectWithValue(message);
    }
  }
);

export const facilityBookingSetupDetails = createAsyncThunk(
  "facilityBookingSetupDetails",
  async ({ baseUrl, token, id }: FetchBookingDetails, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/admin/facility_setups/${id}.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.facility_setup;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch booking details";
      return rejectWithValue(message);
    }
  }
);

export const editFacilityBookingSetup = createAsyncThunk(
  "editFacilityBookingSetup",
  async ({ baseUrl, token, id, data }: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://${baseUrl}/pms/admin/facility_setups/${id}.json`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.facility_setup;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch booking details";
      return rejectWithValue(message);
    }
  }
);

export const filterBookings = createAsyncThunk(
  "filterBookings",
  async (
    {
      baseUrl,
      token,
      queryString
    }: {
      baseUrl: string;
      token: string;
      queryString: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/admin/facility_bookings.json?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch facility bookings"
      );
    }
  }
);

export const fetchFacilitySetupBooking = createAsyncThunk(
  "fetchFacilitySetupBooking",
  async ({ baseUrl, token, id }: FetchBookingDetails, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/admin/facility_setups/${id}.json`,
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
        "Failed to fetch booking details";
      return rejectWithValue(message);
    }
  }
)

export const getLogs = createAsyncThunk(
  "getLogs",
  async ({ baseUrl, token, id }: FetchBookingDetails, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/facility_booking_logs.json?booking_id=${id}`,
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
        "Failed to fetch booking details";
      return rejectWithValue(message);
    }
  }
)

// Create slice using the createApiSlice utility
export const facilityBookingsSlice = createApiSlice<FacilityBookingsResponse>(
  "facilityBookings",
  fetchFacilityBookingsData
);
export const fetchBookingDetailsSlice = createApiSlice(
  "fetchBookingDetails",
  fetchBookingDetails
);
export const exportReportSlice = createApiSlice("exportReport", exportReport);
export const facilityBookingSetupDetailsSlice = createApiSlice(
  "facilityBookingSetupDetails",
  facilityBookingSetupDetails
);
export const editFacilityBookingSetupSlice = createApiSlice(
  "editFacilityBookingSetup",
  editFacilityBookingSetup
);
export const filterBookingsSlice = createApiSlice(
  "filterBookings",
  filterBookings
);
export const fetchFacilitySetupBookingSlice = createApiSlice(
  "fetchFacilitySetupBooking",
  fetchFacilitySetupBooking
)
export const getLogsSlice = createApiSlice(
  "getLogs",
  getLogs
)

// Export reducer
export const facilityBookingsReducer = facilityBookingsSlice.reducer;
export const fetchBookingDetailsReducer = fetchBookingDetailsSlice.reducer;
export const exportReportReducer = exportReportSlice.reducer;
export const facilityBookingSetupDetailsReducer =
  facilityBookingSetupDetailsSlice.reducer;
export const editFacilityBookingSetupReducer =
  editFacilityBookingSetupSlice.reducer;
export const filterBookingsReducer = filterBookingsSlice.reducer;
export const fetchFacilitySetupBookingReducer = fetchFacilitySetupBookingSlice.reducer
export const getLogsReducer = getLogsSlice.reducer