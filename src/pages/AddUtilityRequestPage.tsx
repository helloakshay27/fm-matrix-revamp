import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
                <Label htmlFor="entity" className="text-sm font-medium text-gray-700">
                  Select Entity
                </Label>
                <Select onValueChange={(value) => handleInputChange('entity', value)}>
                  <SelectTrigger className="h-12 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]">
                    <SelectValue placeholder="Select Entity" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {entities.map((entity) => (
                      <SelectItem key={entity} value={entity} className="hover:bg-gray-100">
                        {entity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Plant Detail */}
              <div className="space-y-2">
                <Label htmlFor="plantDetail" className="text-sm font-medium text-gray-700">
                  Plant Detail<span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleInputChange('plantDetail', value)}>
                  <SelectTrigger className="h-12 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]">
                    <SelectValue placeholder="Select Plant Detail" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {plantDetails.map((plant) => (
                      <SelectItem key={plant} value={plant} className="hover:bg-gray-100">
                        {plant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* From Date */}
              <div className="space-y-2">
                <Label htmlFor="fromDate" className="text-sm font-medium text-gray-700">
                  From Date<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => handleInputChange('fromDate', e.target.value)}
                  className="h-12 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  placeholder="Select Date"
                />
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <Label htmlFor="toDate" className="text-sm font-medium text-gray-700">
                  To Date<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="toDate"
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                  className="h-12 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  placeholder="Select Date"
                />
              </div>

              {/* Total Consumption */}
              <div className="space-y-2">
                <Label htmlFor="totalConsumption" className="text-sm font-medium text-gray-700">
                  Total Consumption<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalConsumption"
                  type="number"
                  step="0.01"
                  value={formData.totalConsumption}
                  onChange={(e) => handleInputChange('totalConsumption', e.target.value)}
                  className="h-12 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  placeholder="Total consumption"
                />
              </div>

              {/* Rate */}
              <div className="space-y-2">
                <Label htmlFor="rate" className="text-sm font-medium text-gray-700">
                  Rate<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  value={formData.rate}
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  className="h-12 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  placeholder="Enter Rate"
                />
              </div>

              {/* Reading Type */}
              <div className="space-y-2">
                <Label htmlFor="readingType" className="text-sm font-medium text-gray-700">
                  Reading Type<span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleInputChange('readingType', value)}>
                  <SelectTrigger className="h-12 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]">
                    <SelectValue placeholder="Select Reading Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {readingTypes.map((type) => (
                      <SelectItem key={type} value={type} className="hover:bg-gray-100">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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