import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { fetchFacilityBookings, type BookingData } from '@/services/bookingService'

// Create async thunk for fetching facility bookings
export const fetchFacilityBookingsData = createAsyncThunk(
  'facilityBookings/fetchFacilityBookingsData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchFacilityBookings()
      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch facility bookings')
    }
  }
)

// Create slice using the createApiSlice utility
export const facilityBookingsSlice = createApiSlice<BookingData[]>('facilityBookings', fetchFacilityBookingsData)

// Export reducer
export const facilityBookingsReducer = facilityBookingsSlice.reducer