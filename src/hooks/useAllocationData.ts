import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/apiConfig';

interface Department {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email?: string;
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
      const response = await axios.get(`${API_CONFIG.BASE_URL}/pms/departments.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` }
      });
      setDepartments(response.data || []);
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
      const response = await axios.get(`${API_CONFIG.BASE_URL}/pms/account_setups/get_fm_users.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` }
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

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