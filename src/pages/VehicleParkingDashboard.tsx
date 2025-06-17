
import React, { useState } from 'react';
import { Plus,  Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddVehicleParkingModal } from '../components/AddVehicleParkingModal';

export const VehicleParkingDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>vehicle parkings</span>
          <span>&gt;</span>
          <span>Vehicle Parkings</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">VEHICLE PARKINGS</h1>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Import
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-4 py-2 rounded">
            History
          </Button>
          <Button className="bg-[#C72030] hover:bg-[#B01E2A] text-white px-4 py-2 rounded">
            All
          </Button>
          <Button className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-4 py-2 rounded">
            In
          </Button>
          <Button className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-4 py-2 rounded">
            Out
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Vehicle Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Parking Slot</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Vehicle Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Vehicle Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Sticker Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Registration Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Active/Inactive</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Insurance Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Insurance Valid Till</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Staff Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Qr Code</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty state - no data to display */}
                <tr>
                  <td colSpan={14} className="px-4 py-8 text-center text-gray-500">
                    No vehicle parking records found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddVehicleParkingModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};
