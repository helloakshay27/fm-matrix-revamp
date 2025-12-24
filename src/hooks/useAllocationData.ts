import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

interface Department {
  id: number;
  department_name: string;
  site_id: number;
  company_id: number;
  active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  site_name: string;
}

interface User {
  id: number;
  full_name: string;
}

export const useAllocationData = (type?: string, siteId?: number | null) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState({
    departments: false,
    users: false,
  });

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    setLoading(prev => ({ ...prev, departments: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/departments.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setLoading(prev => ({ ...prev, departments: false }));
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (siteId) params.append('site_id', siteId.toString());

      const queryString = params.toString();
      const url = queryString
        ? `${API_CONFIG.BASE_URL}/pms/users/get_escalate_to_users.json?${queryString}`
        : `${API_CONFIG.BASE_URL}/pms/users/get_escalate_to_users.json`;

      const response = await fetch(url, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, [type, siteId]);

  // Load data on mount and when type/siteId changes
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    departments,
    users,
    loading,
  };
};