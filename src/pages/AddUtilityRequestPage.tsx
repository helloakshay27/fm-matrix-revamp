import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

interface UtilizationFormData {
  entity: string;
  plantDetail: string;
  fromDate: string;
  toDate: string;
  totalConsumption: string;
  rate: string;
  readingType: string;
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

  const entities = [
    'SIFY TECHNOLOGIES LTD',
    'Tata Starbucks Private Limited',
    'Storybook Ventures',
    'CREST DIGITAL PRIVATE LIMITED',
    'Reliance Jio Infocomm Limited',
    'Synechron Technologies Pvt. Ltd.-SE',
    'Northern Operating Solutions Pvt. L',
    'ALTERA DIGITAL HEALTH (INDIA) LLP'
  ];

  const plantDetails = [
    'Plant A - Main Building',
    'Plant B - Secondary',
    'Plant C - Backup',
    'Plant D - Emergency'
  ];

  const readingTypes = [
    'DGKVAH',
    'KWH',
    'KVAR',
    'KVA'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your API
    // For now, we'll just navigate back
    navigate('/utility/utility-request');
  };

  const handleCancel = () => {
    navigate('/utility/utility-request');
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
                  >
                    {entities.map((entity) => (
                      <MenuItem key={entity} value={entity}>
                        {entity}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  >
                    {plantDetails.map((plant) => (
                      <MenuItem key={plant} value={plant}>
                        {plant}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                      <MenuItem key={type} value={type}>
                        {type}
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
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};