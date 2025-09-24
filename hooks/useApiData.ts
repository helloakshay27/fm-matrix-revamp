import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { assetService } from '../services/assetService';
import { API_CONFIG } from '../config/api';
import { getAuthHeader } from '../utils/auth';

export const useApiData = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({ suppliers: false, services: false });

  const loadSuppliers = async () => {
    setLoading(prev => ({ ...prev, suppliers: true }));
    try {
      const data = await assetService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
      toast.error("Failed to load suppliers. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  };

  const loadServices = async () => {
    setLoading(prev => ({ ...prev, services: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/services/get_services.json`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error("Failed to load services. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  useEffect(() => {
    loadSuppliers();
    loadServices();
  }, []);

  return {
    suppliers,
    services,
    loading,
    refetch: {
      suppliers: loadSuppliers,
      services: loadServices,
    },
  };
};
