
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const EditAssetAuditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [basicDetailsExpanded, setBasicDetailsExpanded] = useState(true);
  const [auditTypeExpanded, setAuditTypeExpanded] = useState(true);
  
  // Pre-populate with existing data (in real app, this would come from API)
  const [formData, setFormData] = useState({
    auditName: 'Name Latest',
    startDate: '2025-04-09',
    endDate: '2025-06-27',
    conductedBy: 'Abhishek Sharma',
    basedOn: 'Location',
    site: 'Sai Radhe, Bund Garden',
    building: 'World Trade Centre T3',
    wing: 'A Wing',
    area: '',
    floor: '',
    department: '',
    assetGroup: 'Carpenting',
    assetSubGroup: 'Furniture, Doors and Locks, Work station'
  });

  const handleSubmit = () => {
    if (!formData.auditName || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    console.log('Updated audit data:', formData);
    toast.success('Audit updated successfully!');
    navigate(`/maintenance/audit/assets/details/${id}`);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">EDIT AUDIT</h1>

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
                        <SelectItem value="Abhishek Sharma">Abhishek Sharma</SelectItem>
                        <SelectItem value="Abdul Ghaffar">Abdul Ghaffar</SelectItem>
                        <SelectItem value="Vinayak Mane">Vinayak Mane</SelectItem>
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

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  <div>
                    <Label htmlFor="site" className="text-sm font-medium">
                      Site<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.site} onValueChange={(value) => updateFormData('site', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sai Radhe, Bund Garden">Sai Radhe, Bund Garden</SelectItem>
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
                        <SelectItem value="World Trade Centre T3">World Trade Centre T3</SelectItem>
                        <SelectItem value="building2">Building 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="wing" className="text-sm font-medium">
                      Wing<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.wing} onValueChange={(value) => updateFormData('wing', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A Wing">A Wing</SelectItem>
                        <SelectItem value="B Wing">B Wing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="area" className="text-sm font-medium">
                      Area<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.area} onValueChange={(value) => updateFormData('area', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="area1">Area 1</SelectItem>
                        <SelectItem value="area2">Area 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="floor" className="text-sm font-medium">
                      Floor<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.floor} onValueChange={(value) => updateFormData('floor', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ground">Ground Floor</SelectItem>
                        <SelectItem value="first">First Floor</SelectItem>
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
                        <SelectItem value="Carpenting">Carpenting</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
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
                        <SelectItem value="Furniture, Doors and Locks, Work station">Furniture, Doors and Locks, Work station</SelectItem>
                        <SelectItem value="subgroup2">SubGroup 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
            >
              Update Audit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
