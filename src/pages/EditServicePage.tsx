import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Folder } from 'lucide-react';

const EditServicePage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceCode: '',
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    console.log('Selected files:', files);
    // handle file logic
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    // Submit to backend
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#1a1a1a]">
        Edit Service - ID: {id}
      </h1>

      {/* Basic Details Section */}
      <div className="bg-white rounded-lg border mb-8 p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-semibold text-[#C72030]">BASIC DETAILS</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: 'Service Name', key: 'serviceName' },
            { label: 'Service Code', key: 'serviceCode' },
            { label: 'Site', key: 'site' },
            { label: 'Building', key: 'building' },
            { label: 'Wing', key: 'wing' },
            { label: 'Area', key: 'area' },
            { label: 'Floor', key: 'floor' },
            { label: 'Room', key: 'room' },
          ].map(({ label, key }) => (
            <div key={key} className="flex flex-col">
              <Label className="mb-1 text-sm text-[#1a1a1a]">{label}</Label>
              <Input
                type="text"
                value={formData[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <div className="sm:col-span-2 flex justify-end mt-4">
            <Button type="submit" className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
            <Folder className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-semibold text-[#C72030]">FILES UPLOAD</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-2 text-sm">Upload Service File</Label>
            <Input type="file" multiple onChange={handleFileUpload} />
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServicePage;
