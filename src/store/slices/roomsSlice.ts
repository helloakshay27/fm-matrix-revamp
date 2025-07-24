import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { ticketManagementAPI } from '@/services/ticketManagementAPI'

export interface Room {
  id: number;
  name: string;
}

export interface RoomsResponse {
  rooms: Room[];
}

// Async thunk for fetching rooms
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketManagementAPI.getRooms()
      // Handle array response
      const rooms = Array.isArray(response) ? response : [];
      return { rooms }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch rooms')
    }
  }
)

// Create the rooms slice
const roomsSlice = createApiSlice<RoomsResponse>('rooms', fetchRooms)

export default roomsSlice.reducer