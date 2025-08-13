import { createAsyncThunk } from '@reduxjs/toolkit';
import createApiSlice from '../api/apiSlice';
import { apiClient } from '@/utils/apiClient';

export interface AttendanceRecord {
  id: number;
  user_id: number;
  name: string;
  department: string;
}

export const fetchAttendanceData = createAsyncThunk(
  'attendance/fetchAttendanceData',
  async (departmentFilter: string = '', { rejectWithValue }) => {
    const baseUrl = localStorage.getItem('baseUrl');
    try {
      // Construct the API URL with the department filter if provided
      let url = `https://${baseUrl}/pms/attendances.json`;
      if (departmentFilter) {
        url += `?q[department_department_name_cont]=${encodeURIComponent(departmentFilter)}`;
      }

      const response = await apiClient.get(url);

      // Map API response to our AttendanceRecord interface
      const mappedData: AttendanceRecord[] = response.data.map((item: any, index: number) => ({
        id: index + 1, // Keep this for table row identification
        user_id: item.id || index + 1, // Use actual user ID from API, fallback to index
        name: item.full_name || '-',
        department: item.department_name || '-',
      }));

      return mappedData;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch attendance data';
      return rejectWithValue(message);
    }
  }
);

export const attendanceSlice = createApiSlice<AttendanceRecord[]>('attendance', fetchAttendanceData);

export const attendanceReducer = attendanceSlice.reducer;

export default attendanceReducer;