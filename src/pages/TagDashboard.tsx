
import React, { useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export const TagDashboard = () => {
  const [formData, setFormData] = useState({
    companyTagName: '',
    tagType: '',
    mom: false,
    task: false,
    tagColour: ''
  });

  const mockData = [
    { id: 10, companyTagName: 'FM Matrix', tagType: 'Product', mom: 'Yes', task: 'Yes', tagColour: '#ee0000', active: true },
    { id: 11, companyTagName: 'GoPhygital', tagType: 'Client', mom: 'Yes', task: 'Yes', tagColour: '#000000', active: true },
    { id: 12, companyTagName: 'HiSociaty', tagType: 'Product', mom: 'Yes', task: 'Yes', tagColour: '#ffa400', active: true },
    { id: 13, companyTagName: 'Snag360', tagType: 'Product', mom: 'Yes', task: 'Yes', tagColour: '#1fd600', active: true },
    { id: 17, companyTagName: 'Lead Infinity', tagType: 'Product', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 23, companyTagName: 'Appointmentz', tagType: 'Product', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 25, companyTagName: 'Engineering', tagType: 'Product', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 26, companyTagName: 'PSPL', tagType: 'Client', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 27, companyTagName: 'Vodafone', tagType: 'Client', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 28, companyTagName: 'Godrej Living', tagType: 'Client', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 29, companyTagName: 'Godrej Snag360', tagType: 'Client', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 30, companyTagName: 'Runwal', tagType: 'Client', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 31, companyTagName: 'Arvind', tagType: 'Client', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 32, companyTagName: 'Panchshil', tagType: 'Client', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
    { id: 33, companyTagName: 'TRIL', tagType: 'Client', mom: 'Yes', task: 'Yes', tagColour: '', active: true },
  ];

  const handleSubmit = () => {
    console.log('Submitting tag data:', formData);
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Company Tag List</span>
          <span>&gt;</span>
          <span>Create Company Tag</span>
        </div>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">COMPANY TAGS DETAILS</h2>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Tag Name*</label>
              <Input
                value={formData.companyTagName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyTagName: e.target.value }))}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tag Type*</label>
              <Select value={formData.tagType} onValueChange={(value) => setFormData(prev => ({ ...prev, tagType: value }))}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Tag Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tag Colour*</label>
              <Input
                value={formData.tagColour}
                onChange={(e) => setFormData(prev => ({ ...prev, tagColour: e.target.value }))}
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="flex gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.mom}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, mom: checked }))}
              />
              <label className="text-sm font-medium text-gray-700">MOM</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.task}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, task: checked }))}
              />
              <label className="text-sm font-medium text-gray-700">Task</label>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Active/Inactive</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Company Tag Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Tag Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">MOM</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Task</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tag Colour</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 border-r">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="px-4 py-3 border-r text-sm">{item.id}</td>
                    <td className="px-4 py-3 border-r">
                      <Switch checked={item.active} />
                    </td>
                    <td className="px-4 py-3 border-r text-sm">{item.companyTagName}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.tagType}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.mom}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.task}</td>
                    <td className="px-4 py-3 text-sm">
                      {item.tagColour && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: item.tagColour }}
                          />
                          {item.tagColour}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
