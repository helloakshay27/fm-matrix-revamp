
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Pre-populate with existing service data
  const [formData, setFormData] = useState({
    serviceName: 'test',
    site: 'Lockated',
    building: 'Tower 4',
    wing: 'Wing2',
    area: 'South',
    floor: '',
    room: '',
    group: 'Electrical',
    subGroup: 'AC, AV, Electrical'
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleSaveAndShowDetails = () => {
    console.log('Saving service and showing details:', formData);
    alert('Service updated successfully!');
    navigate(`/maintenance/service/details/${id}`);
  };

  const handleSaveAndAddAMC = () => {
    console.log('Saving service and adding AMC:', formData);
    alert('Service updated and redirecting to AMC setup!');
  };

  const handleSaveAndAddPPM = () => {
    console.log('Saving service and adding PPM:', formData);
    alert('Service updated and redirecting to PPM setup!');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving service and creating new:', formData);
    alert('Service updated! Creating new service...');
    navigate('/maintenance/service/add');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/service')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Service List
        </Button>
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Service List &gt; Create Service</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">CREATE SERVICE</h1>
        </div>
      </div>

      {/* Basic Details */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
              👤
            </div>
            <h2 className="text-lg font-semibold text-orange-500">BASIC DETAILS</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Name<span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.serviceName}
                  onChange={(e) => handleInputChange('serviceName', e.target.value)}
                  placeholder="Enter service name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Floor</label>
                <Select onValueChange={(value) => handleInputChange('floor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground Floor</SelectItem>
                    <SelectItem value="first">First Floor</SelectItem>
                    <SelectItem value="second">Second Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Site<span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(value) => handleInputChange('site', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lockated" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lockated">Lockated</SelectItem>
                    <SelectItem value="tower4">Tower 4</SelectItem>
                    <SelectItem value="sebc">SEBC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Room</label>
                <Select onValueChange={(value) => handleInputChange('room', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room101">Room 101</SelectItem>
                    <SelectItem value="room102">Room 102</SelectItem>
                    <SelectItem value="room201">Room 201</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Building</label>
                <Select onValueChange={(value) => handleInputChange('building', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tower 4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tower4">Tower 4</SelectItem>
                    <SelectItem value="wing2">Wing2</SelectItem>
                    <SelectItem value="main">Main Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Group</label>
                <Select onValueChange={(value) => handleInputChange('group', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Electrical" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Wing</label>
                <Select onValueChange={(value) => handleInputChange('wing', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wing2" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wing2">Wing2</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="north">North</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sub-Group</label>
                <Select onValueChange={(value) => handleInputChange('subGroup', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="AC, AV, Electrical" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ac-av-electrical">AC, AV, Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="fire-safety">Fire Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Area</label>
              <Select onValueChange={(value) => handleInputChange('area', value)}>
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder="South" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Files Upload */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
              📁
            </div>
            <h2 className="text-lg font-semibold text-orange-500">FILES UPLOAD</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Site<span className="text-red-500">*</span>
            </label>
            <Select>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lockated">Lockated</SelectItem>
                <SelectItem value="tower4">Tower 4</SelectItem>
                <SelectItem value="sebc">SEBC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="service-file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label 
              htmlFor="service-file-upload" 
              className="text-orange-500 hover:text-orange-600 cursor-pointer"
            >
              Choose File
            </label>
            <div className="text-sm text-gray-500 mt-2">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button 
          onClick={handleSaveAndShowDetails}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & show details
        </Button>
        <Button 
          onClick={handleSaveAndAddAMC}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & Add AMC
        </Button>
        <Button 
          onClick={handleSaveAndAddPPM}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & Add PPM
        </Button>
        <Button 
          onClick={handleSaveAndCreateNew}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & Create New Service
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};
