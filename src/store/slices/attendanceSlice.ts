import { createAsyncThunk } from '@reduxjs/toolkit';
import createApiSlice from '../api/apiSlice';
import { apiClient } from '@/utils/apiClient';

export interface AttendanceRecord {
  id: number;
  user_id: number;
  name: string;
  department: string;
}

export interface AttendancePagination {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface AttendanceData {
  items: AttendanceRecord[];
  pagination: AttendancePagination;
  total_attendances?: number;
}

export const fetchAttendanceData = createAsyncThunk(
  'attendance/fetchAttendanceData',
  async (
    params: { departmentFilter?: string; page?: number; perPage?: number } | string = '',
    { rejectWithValue }
  ) => {
    const baseUrl = localStorage.getItem('baseUrl');
    try {
      // Normalize params for backward compatibility with old string payload
      let departmentFilter = '';
      let page: number | undefined = undefined;
      let perPage: number | undefined = undefined;
      if (typeof params === 'string') {
        departmentFilter = params || '';
      } else if (params && typeof params === 'object') {
        departmentFilter = params.departmentFilter || '';
        page = params.page;
        perPage = params.perPage;
      }

      const searchParams = new URLSearchParams();
      if (departmentFilter) {
        searchParams.set('q[department_department_name_cont]', departmentFilter);
      }
      if (page) searchParams.set('page', String(page));
      if (perPage) searchParams.set('per_page', String(perPage));

      const qs = searchParams.toString();
      const url = `https://${baseUrl}/pms/attendances.json${qs ? `?${qs}` : ''}`;

      const response = await apiClient.get(url);

      const users = Array.isArray(response.data?.users) ? response.data.users : [];
      // Map API response to our AttendanceRecord interface
      const mappedData: AttendanceRecord[] = users.map((item: any, index: number) => ({
        id: item.id || index + 1,
        user_id: item.id || index + 1,
        name: item.full_name || '-',
        department: item.department_name || '-',
      }));

      const pag = response.data?.pagination || {};
      const pagination: AttendancePagination = {
        current_page: Number(pag.current_page || page || 1),
        total_pages: Number(pag.total_pages || 1),
        total_count: Number(pag.total_count || mappedData.length),
      };

      const payload: AttendanceData = {
        items: mappedData,
        pagination,
        total_attendances: response.data?.total_attendances,
      };

      return payload;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch attendance data';
      return rejectWithValue(message);
    }
  }
);

export const attendanceSlice = createApiSlice<AttendanceData>('attendance', fetchAttendanceData);

export const attendanceReducer = attendanceSlice.reducer;

export default attendanceReducer;