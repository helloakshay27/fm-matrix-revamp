
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AddAssetAuditPage = () => {
  const navigate = useNavigate();
  const [basicDetailsExpanded, setBasicDetailsExpanded] = useState(true);
  const [auditTypeExpanded, setAuditTypeExpanded] = useState(true);
  
  const [formData, setFormData] = useState({
    auditName: '',
    startDate: '',
    endDate: '',
    conductedBy: '',
    basedOn: 'Location',
    site: '',
    building: '',
    department: '',
    assetGroup: '',
    assetSubGroup: ''
  });

  const handleSubmit = (type: 'create' | 'saveAndCreate') => {
    if (!formData.auditName || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    console.log('Audit form submitted:', formData);
    
    if (type === 'create') {
      toast.success('Audit created successfully!');
      navigate('/maintenance/audit/assets');
    } else {
      toast.success('Audit saved and ready for new audit!');
      // Reset form for new audit
      setFormData({
        auditName: '',
        startDate: '',
        endDate: '',
        conductedBy: '',
        basedOn: 'Location',
        site: '',
        building: '',
        department: '',
        assetGroup: '',
        assetSubGroup: ''
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          Audit &gt; Create New Audit
        </div>

        <h1 className="text-2xl font-bold mb-6">NEW AUDIT</h1>

        <div className="space-y-6">
          {/* Basic Details Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer border-b"
              onClick={() => setBasicDetailsExpanded(!basicDetailsExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">1</span>
                </div>
                <h2 className="text-lg font-semibold text-blue-600">BASIC DETAILS</h2>
              </div>
              {basicDetailsExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>

            {basicDetailsExpanded && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="auditName" className="text-sm font-medium">
                      Audit Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="auditName"
                      value={formData.auditName}
                      onChange={(e) => updateFormData('auditName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      Start Date<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData('startDate', e.target.value)}
                      className="mt-1"
                      placeholder="dd-mm-yyyy"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      End Date<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateFormData('endDate', e.target.value)}
                      className="mt-1"
                      placeholder="dd-mm-yyyy"
                    />
                  </div>

                  <div>
                    <Label htmlFor="conductedBy" className="text-sm font-medium">
                      Conducted By<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.conductedBy} onValueChange={(value) => updateFormData('conductedBy', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abhishek">Abhishek Sharma</SelectItem>
                        <SelectItem value="abdul">Abdul Ghaffar</SelectItem>
                        <SelectItem value="vinayak">Vinayak Mane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Audit Type Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer border-b"
              onClick={() => setAuditTypeExpanded(!auditTypeExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">2</span>
                </div>
                <h2 className="text-lg font-semibold text-blue-600">Audit Type</h2>
              </div>
              {auditTypeExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>

            {auditTypeExpanded && (
              <div className="p-6">
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    Based On<span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.basedOn}
                    onValueChange={(value) => updateFormData('basedOn', value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Location" id="location" />
                      <Label htmlFor="location">Location</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Asset" id="asset" />
                      <Label htmlFor="asset">Asset</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div>
                    <Label htmlFor="site" className="text-sm font-medium">
                      Site<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.site} onValueChange={(value) => updateFormData('site', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="site1">Site 1</SelectItem>
                        <SelectItem value="site2">Site 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="building" className="text-sm font-medium">
                      Building<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.building} onValueChange={(value) => updateFormData('building', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="building1">Building 1</SelectItem>
                        <SelectItem value="building2">Building 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department" className="text-sm font-medium">
                      Department<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.department} onValueChange={(value) => updateFormData('department', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="facilities">Facilities</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="assetGroup" className="text-sm font-medium">
                      Asset Group<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.assetGroup} onValueChange={(value) => updateFormData('assetGroup', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="group1">Group 1</SelectItem>
                        <SelectItem value="group2">Group 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="assetSubGroup" className="text-sm font-medium">
                      Asset SubGroup<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.assetSubGroup} onValueChange={(value) => updateFormData('assetSubGroup', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subgroup1">SubGroup 1</SelectItem>
                        <SelectItem value="subgroup2">SubGroup 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => handleSubmit('create')}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
            >
              Create Audit
            </Button>
            <Button 
              onClick={() => handleSubmit('saveAndCreate')}
              variant="outline"
              className="border-gray-300 px-8"
            >
              Save And Create New Audit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
