
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AddPermitPage = () => {
  const navigate = useNavigate();
  const [permitData, setPermitData] = useState({
    // Requestor Details
    name: 'Ankit Gupta',
    contactNumber: '91 7388997281',
    department: '',
    unit: '',
    site: 'Lockated',
    
    // Basic Details
    permitFor: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
    clientSpecific: 'Internal',
    copyTo: '',
    
    // Permit Details
    permitType: '',
    permitDescription: '',
    activity: '',
    subActivity: '',
    categoryOfHazards: '',
    risks: '',
    vendor: '',
    comment: '',
    
    // Attachments
    attachments: null as File | null
  });

  const [activities, setActivities] = useState([
    { activity: '', subActivity: '', categoryOfHazards: '' }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setPermitData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPermitData(prev => ({
        ...prev,
        attachments: file
      }));
      toast.success('File uploaded successfully');
    }
  };

  const handleAddActivity = () => {
    setActivities(prev => [...prev, { activity: '', subActivity: '', categoryOfHazards: '' }]);
  };

  const handleRemoveActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleActivityChange = (index: number, field: string, value: string) => {
    setActivities(prev => prev.map((activity, i) => 
      i === index ? { ...activity, [field]: value } : activity
    ));
  };

  const handleSubmit = () => {
    console.log('Permit Data:', permitData);
    console.log('Activities:', activities);
    toast.success('Permit request raised successfully!');
    navigate('/maintenance/permit');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Permit List</span>
          <span className="mx-2">{'>'}</span>
          <span>New Permit</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">NEW PERMIT</h1>
      </div>

      {/* Permit Requestor Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <span className="mr-2">🔸</span>
            PERMIT REQUESTOR DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label>Name</Label>
              <Input
                value={permitData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter Name"
              />
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input
                value={permitData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                placeholder="Enter Contact Number"
              />
            </div>
            <div>
              <Label>Site</Label>
              <Input
                value={permitData.site}
                onChange={(e) => handleInputChange('site', e.target.value)}
                placeholder="Enter Site"
              />
            </div>
            <div>
              <Label>Department</Label>
              <Input
                value={permitData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Enter Department"
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Input
                value={permitData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                placeholder="Enter Unit"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <span className="mr-2">🔸</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Permit For*</Label>
              <Input
                value={permitData.permitFor}
                onChange={(e) => handleInputChange('permitFor', e.target.value)}
                placeholder="Enter Permit For"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Building*</Label>
                <Select onValueChange={(value) => handleInputChange('building', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building-a">Building A</SelectItem>
                    <SelectItem value="building-b">Building B</SelectItem>
                    <SelectItem value="building-c">Building C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Wing</Label>
                <Select onValueChange={(value) => handleInputChange('wing', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Building First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wing-1">Wing 1</SelectItem>
                    <SelectItem value="wing-2">Wing 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Area</Label>
                <Select onValueChange={(value) => handleInputChange('area', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area-1">Area 1</SelectItem>
                    <SelectItem value="area-2">Area 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Floor</Label>
                <Select onValueChange={(value) => handleInputChange('floor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Wing First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="floor-1">Floor 1</SelectItem>
                    <SelectItem value="floor-2">Floor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Room</Label>
                <Select onValueChange={(value) => handleInputChange('room', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Wing First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room-1">Room 1</SelectItem>
                    <SelectItem value="room-2">Room 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Copy To</Label>
                <Select onValueChange={(value) => handleInputChange('copyTo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Client Specific</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientSpecific"
                    value="Internal"
                    checked={permitData.clientSpecific === 'Internal'}
                    onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                    className="mr-2"
                  />
                  Internal
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientSpecific"
                    value="Client"
                    checked={permitData.clientSpecific === 'Client'}
                    onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                    className="mr-2"
                  />
                  Client
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permit Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <span className="mr-2">🔸</span>
            PERMIT DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Select Permit Type*</Label>
              <div className="mt-2 p-4 border rounded-lg">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="permitType"
                    value="test"
                    checked={permitData.permitType === 'test'}
                    onChange={(e) => handleInputChange('permitType', e.target.value)}
                    className="mr-2"
                  />
                  test
                </label>
              </div>
            </div>

            <div>
              <Label>Enter Permit Description*</Label>
              <Textarea
                value={permitData.permitDescription}
                onChange={(e) => handleInputChange('permitDescription', e.target.value)}
                placeholder="Enter description"
                className="min-h-[100px]"
              />
            </div>

            {/* Dynamic Activities */}
            {activities.map((activity, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                {activities.length > 1 && (
                  <button
                    onClick={() => handleRemoveActivity(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Activity*</Label>
                    <Select onValueChange={(value) => handleActivityChange(index, 'activity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="installation">Installation</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Sub Activity*</Label>
                    <Select onValueChange={(value) => handleActivityChange(index, 'subActivity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Sub Activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="hvac">HVAC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category of Hazards*</Label>
                    <Select onValueChange={(value) => handleActivityChange(index, 'categoryOfHazards', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category of Hazards" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Risks*</Label>
                  <Textarea
                    value={permitData.risks}
                    onChange={(e) => handleInputChange('risks', e.target.value)}
                    placeholder="Enter risks"
                  />
                </div>
              </div>
            ))}

            <Button
              onClick={handleAddActivity}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              + Add Activity
            </Button>

            <div>
              <Label>Vendor</Label>
              <Select onValueChange={(value) => handleInputChange('vendor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor-1">Vendor 1</SelectItem>
                  <SelectItem value="vendor-2">Vendor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Comment(Optional)</Label>
              <Textarea
                value={permitData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                placeholder="Enter Comment"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <span className="mr-2">📎</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                Choose Files
              </label>
              <span className="ml-4 text-sm text-gray-500">
                {permitData.attachments ? permitData.attachments.name : 'No file chosen'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 px-8 py-3 text-lg"
        >
          Raise a Request
        </Button>
      </div>
    </div>
  );
};

export default AddPermitPage;
