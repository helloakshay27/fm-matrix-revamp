
import React, { useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AddCategoryModal } from '@/components/AddCategoryModal';

export const ParkingCategoriesDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const mockData = [
    { id: 1, name: '2 Wheeler', active: true, createdOn: '18/04/2023' },
    { id: 2, name: '4 Wheeler', active: true, createdOn: '18/04/2023' },
  ];

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Parking</span>
          <span>&gt;</span>
          <span>Category</span>
        </div>
        
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-6">PARKING CATEGORIES</h1>
        
        {/* Add Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Active/Inactive</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created On</th>
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
                    <td className="px-4 py-3 border-r text-sm">{item.name}</td>
                    <td className="px-4 py-3 border-r">
                      <Switch checked={item.active} />
                    </td>
                    <td className="px-4 py-3 text-sm">{item.createdOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};
