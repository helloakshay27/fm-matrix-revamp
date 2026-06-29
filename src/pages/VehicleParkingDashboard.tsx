
import React, { useState } from 'react';
import { Plus,  Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { AddVehicleParkingModal } from '../components/AddVehicleParkingModal';

const mockVehicleData = [
  {
    id: 1,
    vehicleNumber: 'MH-12-AB-1234',
    parkingSlot: 'A-101',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Sedan',
    stickerNumber: 'ST001',
    category: 'Staff',
    registrationNumber: 'MH12AB1234',
    activeInactive: true,
    insuranceNumber: 'INS001',
    insuranceValidTill: '2025-12-31',
    staffName: 'John Doe',
    status: 'Active',
    qrCode: 'QR001'
  },
  {
    id: 2,
    vehicleNumber: 'MH-12-CD-5678',
    parkingSlot: 'B-202',
    vehicleCategory: '2 Wheeler',
    vehicleType: 'Motorcycle',
    stickerNumber: 'ST002',
    category: 'Visitor',
    registrationNumber: 'MH12CD5678',
    activeInactive: false,
    insuranceNumber: 'INS002',
    insuranceValidTill: '2025-06-30',
    staffName: 'Jane Smith',
    status: 'Inactive',
    qrCode: 'QR002'
  }
];

export const VehicleParkingDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState(mockVehicleData);

  const handleStatusToggle = (vehicleId: number) => {
    console.log(`Toggling status for Vehicle ${vehicleId}`);
    
    setVehicleData(prev => 
      prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, status: vehicle.status === 'Active' ? 'Inactive' : 'Active' }
          : vehicle
      )
    );
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>vehicle parkings</span>
          <span>&gt;</span>
          <span>Vehicle Parkings</span>
        </div>
        
        <Heading level="h1" variant="default" className="uppercase mb-6">
          VEHICLE PARKINGS
        </Heading>
        
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
                {vehicleData.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-4 py-8 text-center text-gray-500">
                      No vehicle parking records found
                    </td>
                  </tr>
                ) : (
                  vehicleData.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-r">
                        <button className="text-gray-400 hover:text-gray-600">
                          ⋮
                        </button>
                      </td>
                      <td className="px-4 py-3 border-r text-blue-600">{vehicle.vehicleNumber}</td>
                      <td className="px-4 py-3 border-r">{vehicle.parkingSlot}</td>
                      <td className="px-4 py-3 border-r">{vehicle.vehicleCategory}</td>
                      <td className="px-4 py-3 border-r">{vehicle.vehicleType}</td>
                      <td className="px-4 py-3 border-r">{vehicle.stickerNumber}</td>
                      <td className="px-4 py-3 border-r">{vehicle.category}</td>
                      <td className="px-4 py-3 border-r">{vehicle.registrationNumber}</td>
                      <td className="px-4 py-3 border-r">
                        <input 
                          type="checkbox" 
                          checked={vehicle.activeInactive} 
                          readOnly
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-3 border-r">{vehicle.insuranceNumber}</td>
                      <td className="px-4 py-3 border-r">{vehicle.insuranceValidTill}</td>
                      <td className="px-4 py-3 border-r">{vehicle.staffName}</td>
                      <td className="px-4 py-3 border-r">
                        <div className="flex items-center">
                          <div
                            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                              vehicle.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                            onClick={() => handleStatusToggle(vehicle.id)}
                          >
                            <span
                              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                vehicle.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{vehicle.qrCode}</td>
                    </tr>
                  ))
                )}
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
