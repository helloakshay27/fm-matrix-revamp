import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, CircularProgress } from '@mui/material';

interface UtilizationFormData {
  entity: string;
  plantDetail: string;
  fromDate: string;
  toDate: string;
  totalConsumption: string;
  rate: string;
  readingType: string;
}

interface Entity {
  id: number;
  name: string;
  mobile: string;
  email: string;
  ext_project_code: string | null;
  company_code: string | null;
  ext_customer_code: string | null;
  color_code: string | null;
  customer_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  customer_leases: CustomerLease[];
}

interface PlantDetail {
  id: number;
  plant_name: string;
  site_name: string;
  valuation_area: string;
  plant_category: string;
  company_name: string;
  pms_site_id: number;
  created_at: string;
  updated_at: string;
  company_code: string;
  sale_org_code: string;
}

interface CustomerLease {
  id: number;
  lease_start_date: string;
  lease_end_date: string;
  free_parking: number;
  paid_parking: number;
}

export const AddUtilityRequestPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UtilizationFormData>({
    entity: '',
    plantDetail: '',
    fromDate: '',
    toDate: '',
    totalConsumption: '',
    rate: '',
    readingType: ''
  });

  const [entities, setEntities] = useState<Entity[]>([]);
  const [plantDetailsList, setPlantDetailsList] = useState<PlantDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPlants, setLoadingPlants] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [plantError, setPlantError] = useState<string | null>(null);

  // Fetch entities from API on component mount
  // Fetch entities from API on component mount
  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');

        if (!baseUrl || !token) {
          throw new Error('Base URL or token not found in localStorage');
        }

        // Construct the full URL
        let url = baseUrl;
        if (!/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
        }

        const response = await fetch(`${url}/entities.json`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch entities: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setEntities(data.entities || []);
      } catch (err) {
        console.error('Error fetching entities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch entities');
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  // Fetch plant details from API on component mount
  useEffect(() => {
    const fetchPlantDetails = async () => {
      setLoadingPlants(true);
      setPlantError(null);

      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');

        if (!baseUrl || !token) {
          throw new Error('Base URL or token not found in localStorage');
        }

        // Construct the full URL
        let url = baseUrl;
        if (!/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
        }

        const response = await fetch(`${url}/pms/purchase_orders/get_plant_detail.json`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch plant details: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPlantDetailsList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching plant details:', err);
        setPlantError(err instanceof Error ? err.message : 'Failed to fetch plant details');
      } finally {
        setLoadingPlants(false);
      }
    };

    fetchPlantDetails();
  }, []);

  // Plant details will be fetched from API

  const readingTypes = [
    { value: '', label: 'Select Reading Type' },
    { value: 'EBKVh', label: 'EBKVh' },
    { value: 'DGKVH', label: 'DGKVH' }
  ];

  const handleInputChange = (field: keyof UtilizationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    handleInputChange(name as keyof UtilizationFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.entity || !formData.plantDetail || !formData.fromDate ||
      !formData.toDate || !formData.totalConsumption || !formData.rate || !formData.readingType) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the baseUrl and token from localStorage
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');

      if (!baseUrl || !token) {
        throw new Error('Base URL or token not found in localStorage');
      }

      // Construct the full URL
      let url = baseUrl;
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }

      // Calculate amount based on total consumption and rate
      const totalConsumption = parseFloat(formData.totalConsumption);
      const rate = parseFloat(formData.rate);
      const amount = totalConsumption * rate;

      // Prepare the request payload
      const requestPayload = {
        compile_utilization: {
          entity_id: parseInt(formData.entity),
          from_date: formData.fromDate,
          to_date: formData.toDate,
          total_consumption: totalConsumption,
          rate: rate,
          amount: parseFloat(amount.toFixed(2)), // Round to 2 decimal places
          plant_detail_id: parseInt(formData.plantDetail),
          status: "pending",
          reading_type: formData.readingType
        }
      };

      // Make the API call
      const response = await fetch(`${url}/compile_utilizations.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to submit utilization: ${response.status} ${response.statusText}${errorData.error ? ': ' + errorData.error : ''}`);
      }

      const responseData = await response.json();
      console.log('Utilization submitted successfully:', responseData);

      // Show success message
      alert('Utilization compiled successfully!');

      // Navigate back to the utility requests page
      navigate('/utility/utility-request');
    } catch (error) {
      console.error('Error submitting utilization:', error);
      alert(`Failed to submit utilization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/utility/utility-request');
  };

  // Retry fetching entities if initial load failed
  const handleRetryFetch = async () => {
    const fetchEntities = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');

        if (!baseUrl || !token) {
          throw new Error('Base URL or token not found in localStorage');
        }

        // Construct the full URL
        let url = baseUrl;
        if (!/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
        }

        const response = await fetch(`${url}/entities.json`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch entities: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setEntities(data.entities || []);
      } catch (err) {
        console.error('Error fetching entities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch entities');
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  };

  // Retry fetching plant details if initial load failed
  const handleRetryPlantFetch = async () => {
    const fetchPlantDetails = async () => {
      setLoadingPlants(true);
      setPlantError(null);

      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');

        if (!baseUrl || !token) {
          throw new Error('Base URL or token not found in localStorage');
        }

        // Construct the full URL
        let url = baseUrl;
        if (!/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
        }

        const response = await fetch(`${url}/pms/purchase_orders/get_plant_detail.json`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch plant details: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPlantDetailsList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching plant details:', err);
        setPlantError(err instanceof Error ? err.message : 'Failed to fetch plant details');
      } finally {
        setLoadingPlants(false);
      }
    };

    fetchPlantDetails();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Utility Request &gt; Add
      </div>

      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Utility Requests
        </Button>
      </div>

      {/* Form Card */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-[#f6f4ee] border-b">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
            Compile Utilizations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Select Entity */}
              <div className="space-y-2">
                <FormControl fullWidth>
                  <InputLabel id="entity-label" className="text-sm font-medium text-gray-700">
                    Select Entity
                  </InputLabel>
                  <Select
                    labelId="entity-label"
                    name="entity"
                    value={formData.entity}
                    onChange={handleSelectChange}
                    label="Select Entity"
                    sx={{
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                      '& .MuiOutlinedInput-root': {
                        height: '45px',
                        backgroundColor: '#f6f4ee',
                      }
                    }}
                    disabled={loading}
                    startAdornment={loading ?
                      <CircularProgress color="inherit" size={20} /> : null
                    }
                  >
                    {entities.length > 0 ? (
                      entities.map((entity) => (
                        <MenuItem key={entity.id} value={entity.id.toString()}>
                          {entity.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        {error ? "Error loading entities" : "No entities found"}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
                {error && (
                  <div className="flex flex-col gap-1">
                    <p className="text-red-500 text-xs">{error}</p>
                    <Button
                      onClick={handleRetryFetch}
                      size="sm"
                      variant="outline"
                      className="text-xs py-1 h-auto"
                      disabled={loading}
                    >
                      {loading ? 'Retrying...' : 'Retry'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Plant Detail */}
              <div className="space-y-2">
                <FormControl fullWidth>
                  <InputLabel id="plant-detail-label" className="text-sm font-medium text-gray-700">
                    Plant Detail*
                  </InputLabel>
                  <Select
                    labelId="plant-detail-label"
                    name="plantDetail"
                    value={formData.plantDetail}
                    onChange={handleSelectChange}
                    label="Plant Detail*"
                    sx={{
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                      '& .MuiOutlinedInput-root': {
                        height: '45px',
                        backgroundColor: '#f6f4ee',
                      }
                    }}
                    disabled={loadingPlants}
                    startAdornment={loadingPlants ?
                      <CircularProgress color="inherit" size={20} /> : null
                    }
                  >
                    {plantDetailsList.length > 0 ? (
                      plantDetailsList.map((plant) => (
                        <MenuItem key={plant.id} value={plant.id.toString()}>
                          {plant.plant_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        {plantError ? "Error loading plant details" : "No plant details found"}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
                {plantError && (
                  <div className="flex flex-col gap-1">
                    <p className="text-red-500 text-xs">{plantError}</p>
                    <Button
                      onClick={handleRetryPlantFetch}
                      size="sm"
                      variant="outline"
                      className="text-xs py-1 h-auto"
                      disabled={loadingPlants}
                    >
                      {loadingPlants ? 'Retrying...' : 'Retry'}
                    </Button>
                  </div>
                )}
              </div>

              {/* From Date */}
              <div className="space-y-2">
                <TextField
                  label="From Date*"
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={(e) => handleInputChange('fromDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }
                  }}
                />
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <TextField
                  label="To Date*"
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }
                  }}
                />
              </div>

              {/* Total Consumption */}
              <div className="space-y-2">
                <TextField
                  label="Total Consumption*"
                  type="number"
                  name="totalConsumption"
                  value={formData.totalConsumption}
                  onChange={(e) => handleInputChange('totalConsumption', e.target.value)}
                  placeholder="Total consumption"
                  fullWidth
                  inputProps={{
                    step: "0.01"
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }
                  }}
                />
              </div>

              {/* Rate */}
              <div className="space-y-2">
                <TextField
                  label="Rate*"
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  placeholder="Enter Rate"
                  fullWidth
                  inputProps={{
                    step: "0.01"
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }
                  }}
                />
              </div>

              {/* Reading Type */}
              <div className="space-y-2">
                <FormControl fullWidth>
                  <InputLabel id="reading-type-label" className="text-sm font-medium text-gray-700">
                    Reading Type*
                  </InputLabel>
                  <Select
                    labelId="reading-type-label"
                    name="readingType"
                    value={formData.readingType}
                    onChange={handleSelectChange}
                    label="Reading Type*"
                    displayEmpty
                    sx={{
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                      '& .MuiOutlinedInput-root': {
                        height: '45px',
                        backgroundColor: '#f6f4ee',
                      }
                    }}
                  >
                    {readingTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value} disabled={type.value === ''}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="bg-[#C72030] hover:bg-[#A01B29] text-white px-8 py-3 rounded-none font-medium transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={16} color="inherit" className="mr-2" />
                    Submitting...
                  </>
                ) : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};