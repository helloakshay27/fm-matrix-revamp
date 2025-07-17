import { useState, useEffect } from 'react';
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

export const useAllocationData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState({
    departments: false,
    users: false,
  });

  // Fetch departments
  const fetchDepartments = async () => {
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
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/users/get_escalate_to_users.json`, {
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
  };

  // Load data on mount
  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  return {
    departments,
    users,
    loading,
  };
};