import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

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

// Sample data to find the measurement by ID
const sampleMeasurements: MeasurementData[] = [
  {
    id: '1637136',
    assetName: 'Diesel Generator',
    parameterName: 'Diesel Generator KWH',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  },
  {
    id: '1637137',
    assetName: 'Diesel Generator',
    parameterName: 'DG Voltage ( R )',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  }
];

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

  useEffect(() => {
    if (id) {
      // Find the measurement by ID
      const measurement = sampleMeasurements.find(m => m.id === id);
      if (measurement) {
        setFormData(measurement);
      }
    }
  }, [id]);

  const handleInputChange = (field: keyof MeasurementData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting measurement data:', formData);
    // Here you would typically make an API call to save the data
    navigate('/utility/daily-readings');
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
        Editing Measurement
      </h1>

      {/* Form Card */}
      <Card className="bg-white border border-gray-200 rounded-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            NEW MEASUREMENT
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

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Asset Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Asset Name
                  </label>
                  <Input
                    value={formData.assetName}
                    onChange={(e) => handleInputChange('assetName', e.target.value)}
                    className="h-10 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                    placeholder="Asset Name"
                  />
                </div>

                {/* Closing */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Closing
                  </label>
                  <Input
                    value={formData.reading}
                    onChange={(e) => handleInputChange('reading', e.target.value)}
                    className="h-10 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                    placeholder="MSR Value"
                  />
                </div>

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
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  className="bg-[#6B2D5C] hover:bg-[#5A2449] text-white px-8 py-2 h-10 rounded-none font-medium transition-colors duration-200"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}