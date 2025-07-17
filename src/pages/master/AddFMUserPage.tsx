import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ArrowLeft } from 'lucide-react';

export const AddFMUserPage = () => {
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailAddress: '',
    gender: '',
    selectEntity: '',
    supplier: '',
    employeeId: '',
    baseSite: '',
    selectBaseUnit: '',
    selectDepartment: '',
    designation: '',
    selectUserType: '',
    selectRole: '',
    selectAccessLevel: '',
    selectEmailPreference: '',
    userType: 'internal',
    dailyHelpdeskReport: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add API call here
    navigate('/master/user/fm-users');
  };

  const handleCancel = () => {
    navigate('/master/user/fm-users');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Master &gt; User Master &gt; FM User &gt; Add FM User
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/master/user/fm-users')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Add FM User</h1>
      </div>

      {/* Rest of the content stays the same */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <Button variant="outline" className="w-full">
                  Upload Picture
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Upload a profile picture (JPG, PNG up to 2MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* All existing form content remains the same */}
              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={handleSubmit}
                  className="bg-[#C72030] hover:bg-[#a91b29] text-white"
                >
                  Submit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};