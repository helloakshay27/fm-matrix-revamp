import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// Interface definitions for API response
interface CustomerName {
  name: string | null;
  id: number | null;
}

interface ApiMeasurement {
  id: number;
  asset_name: string;
  parameter_name: string;
  opening: number;
  reading: number | null;
  consumption: number | null;
  total_consumption: number | null;
  customer_name: CustomerName;
}

interface MeasurementData {
  id: string;
  assetName: string;
  parameterName: string;
  opening: string;
  reading: string;
  consumption: string;
  totalConsumption: string;
  customerName: string;
  date: string;
}

// Transform API response to form data
const transformApiMeasurement = (measurement: ApiMeasurement): MeasurementData => {
  return {
    id: measurement.id.toString(),
    assetName: measurement.asset_name.trim(),
    parameterName: measurement.parameter_name,
    opening: measurement.opening?.toString() || '0.0',
    reading: measurement.reading?.toString() || '',
    consumption: measurement.consumption?.toString() || '',
    totalConsumption: measurement.total_consumption?.toString() || '',
    customerName: measurement.customer_name?.name || '',
    date: new Date().toISOString().split('T')[0]
  };
};

export default function EditMeasurementPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<MeasurementData>({
    id: '',
    assetName: '',
    parameterName: '',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch measurement data from API
  const fetchMeasurement = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEASUREMENTS}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiMeasurement[] = await response.json();
      const measurement = data.find(m => m.id.toString() === id);

      if (measurement) {
        setFormData(transformApiMeasurement(measurement));
      } else {
        throw new Error('Measurement not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching measurement';
      setError(errorMessage);
      console.error('Failed to fetch measurement:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurement();
  }, [id]);

  const handleInputChange = (field: keyof MeasurementData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast({
        title: "Error",
        description: "Measurement ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      // Prepare payload for PUT request
      const payload = {
        pms_measurement: {
          msr_value: formData.reading,
          opening: formData.opening,
          consumption: formData.consumption
        }
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/measurements/${id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Measurement updated successfully",
      });

      navigate('/utility/daily-readings');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating measurement';
      console.error('Failed to update measurement:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/utility/daily-readings');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Back Button and Breadcrumb */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="p-0 h-auto hover:bg-transparent"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
        <div className="text-sm text-gray-600">
          Utility &gt; Daily Readings &gt; Edit Measurement
        </div>
      </div>

      {/* Page Title */}
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
        Editing Measurement {id && `#${id}`}
      </h1>

      {/* Loading or Error State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span>Loading measurement data...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchMeasurement} variant="outline">
            Try Again
          </Button>
        </div>
      ) : (
        /* Form Card */
        <Card className="bg-white border border-gray-200 rounded-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              EDIT MEASUREMENT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Measurement Reading Section */}
              <div className="bg-orange-50 border-l-4 border-[#C72030] p-4 rounded-none">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">3</span>
                  </div>
                  <h3 className="text-[#C72030] font-medium text-sm uppercase tracking-wide">
                    MEASUREMENT READING
                  </h3>
                </div>

                {/* Asset Information (Read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Asset Name
                    </label>
                    <Input
                      value={formData.assetName}
                      readOnly
                      className="h-10 border border-gray-300 rounded-none bg-gray-50"
                      placeholder="Asset Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Parameter Name
                    </label>
                    <Input
                      value={formData.parameterName}
                      readOnly
                      className="h-10 border border-gray-300 rounded-none bg-gray-50"
                      placeholder="Parameter Name"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Opening */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Opening
                    </label>
                    <Input
                      value={formData.opening}
                      onChange={(e) => handleInputChange('opening', e.target.value)}
                      className="h-10 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                      placeholder="0.0"
                      type="number"
                      step="0.01"
                    />
                  </div>

                  {/* Closing (Reading) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Reading (MSR Value)
                    </label>
                    <Input
                      value={formData.reading}
                      onChange={(e) => handleInputChange('reading', e.target.value)}
                      className="h-10 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                      placeholder="MSR Value"
                      type="number"
                      step="0.01"
                    />
                  </div>

                  {/* Consumption */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Consumption
                    </label>
                    <Input
                      value={formData.consumption}
                      onChange={(e) => handleInputChange('consumption', e.target.value)}
                      className="h-10 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                      placeholder="Enter Consumption"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-8 py-2 h-10 rounded-none font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#6B2D5C] hover:bg-[#5A2449] text-white px-8 py-2 h-10 rounded-none font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {saving ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}