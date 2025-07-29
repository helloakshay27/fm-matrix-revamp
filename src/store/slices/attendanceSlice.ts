import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'

export interface AttendanceRecord {
  id: number;
  user_id: number; // Adding user_id to store the actual user ID from API
  name: string;
  department: string;
}

// Fetch attendance data from API
export const fetchAttendanceData = createAsyncThunk(
  'attendance/fetchAttendanceData',
  async (_, { rejectWithValue }) => {
    const baseUrl = localStorage.getItem('baseUrl');
    try {
      const response = await apiClient.get(`https://${baseUrl}/pms/attendances.json`)
      
      // Map API response to our AttendanceRecord interface
      const mappedData: AttendanceRecord[] = response.data.map((item: any, index: number) => ({
        id: index + 1, // Keep this for table row identification
        user_id: item.id || index + 1, // Use actual user ID from API, fallback to index
        name: item.full_name || '-',
        department: item.department_name || '-'
      }))
      
      return mappedData
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch attendance data'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const attendanceSlice = createApiSlice<AttendanceRecord[]>('attendance', fetchAttendanceData)

// Export reducer
export const attendanceReducer = attendanceSlice.reducer

// Export the default reducer
export default attendanceReducer