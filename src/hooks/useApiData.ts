import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

export const useApiData = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({ suppliers: false, services: false });

  const loadSuppliers = async () => {
    setLoading(prev => ({ ...prev, suppliers: true }));
    try {
      // Use the correct suppliers endpoint that returns the proper data structure
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/suppliers/get_suppliers.json`, {
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
      
      // The API returns an array directly with {id, name} structure
      if (Array.isArray(data)) {
        setSuppliers(data);
      } else {
        console.warn('Unexpected suppliers data format:', data);
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Failed to load suppliers:', error);
      toast.error("Failed to load suppliers. Using fallback data.", {
        duration: 4000,
      });
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  };

  const loadServices = async () => {
    setLoading(prev => ({ ...prev, services: true }));
    try {
      // Use the correct services endpoint that returns the proper data structure
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
      
      // The API returns an array directly with {id, service_name} structure
      if (Array.isArray(data)) {
        // Transform the data to have consistent id and name structure
        const transformedServices = data.map((service: any) => ({
          id: service.id,
          name: service.service_name
        }));
        setServices(transformedServices);
      } else {
        console.warn('Unexpected services data format:', data);
        setServices([]);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error("Failed to load services. Using fallback data.", {
        duration: 4000,
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