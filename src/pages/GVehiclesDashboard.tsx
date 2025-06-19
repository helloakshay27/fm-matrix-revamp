
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, SlidersHorizontal, Edit } from 'lucide-react';
import { AddGVehicleModal } from '@/components/AddGVehicleModal';
import { GVehicleImportModal } from '@/components/GVehicleImportModal';
import { GVehicleFilterModal } from '@/components/GVehicleFilterModal';
import { useNavigate } from 'react-router-dom';

const vehicleData = [
  {
    id: 1,
    vehicleNumber: '5000',
    parkingSlot: '',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Hatchback',
    stickerNumber: '',
    category: 'Owned',
    registrationNumber: '',
    activeInactive: true,
    insuranceNumber: '',
    insuranceValidTill: '22/02/2023',
    staffName: '',
    status: 'Active',
    qrCode: '🔲'
  },
  {
    id: 2,
    vehicleNumber: '2341',
    parkingSlot: '12',
    vehicleCategory: '2 Wheeler',
    vehicleType: '',
    stickerNumber: '11',
    category: 'Staff',
    registrationNumber: '',
    activeInactive: true,
    insuranceNumber: '55555555',
    insuranceValidTill: '20/02/2023',
    staffName: 'demo demo',
    status: 'Active',
    qrCode: '🔲'
  },
  {
    id: 3,
    vehicleNumber: '4321',
    parkingSlot: '',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'SUV',
    stickerNumber: '',
    category: 'Owned',
    registrationNumber: '',
    activeInactive: false,
    insuranceNumber: '',
    insuranceValidTill: '19/02/2023',
    staffName: '',
    status: 'Inactive',
    qrCode: '🔲'
  },
  {
    id: 4,
    vehicleNumber: '4564',
    parkingSlot: '',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Sedan',
    stickerNumber: '65464',
    category: 'Staff',
    registrationNumber: '5646456',
    activeInactive: true,
    insuranceNumber: '64565464',
    insuranceValidTill: '30/10/2020',
    staffName: 'clone stage',
    status: 'Active',
    qrCode: '🔲'
  },
  {
    id: 5,
    vehicleNumber: '464564645',
    parkingSlot: '903',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Hatchback',
    stickerNumber: '4466',
    category: 'Staff',
    registrationNumber: '456464',
    activeInactive: true,
    insuranceNumber: '46464',
    insuranceValidTill: '31/10/2020',
    staffName: 'check Major',
    status: 'Active',
    qrCode: '🔲'
  },
  {
    id: 6,
    vehicleNumber: '7777',
    parkingSlot: '902',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Scooter',
    stickerNumber: '454',
    category: 'Owned',
    registrationNumber: '354353gdd',
    activeInactive: true,
    insuranceNumber: '3454354fg',
    insuranceValidTill: '31/10/2020',
    staffName: '',
    status: 'Active',
    qrCode: '🔲'
  },
  {
    id: 7,
    vehicleNumber: '7890',
    parkingSlot: '901',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Truck',
    stickerNumber: '9001',
    category: 'Workshop',
    registrationNumber: '12345',
    activeInactive: true,
    insuranceNumber: '34567',
    insuranceValidTill: '31/10/2020',
    staffName: 'V O',
    status: 'Active',
    qrCode: '🔲'
  }
];

export const GVehiclesDashboard = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleHistoryClick = () => {
    navigate('/security/vehicle/g-vehicles/history');
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>vehicle parkings</span>
          <span>&gt;</span>
          <span>Vehicle Parkings</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">VEHICLE PARKINGS</h1>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Action Buttons */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
              <Button 
                onClick={() => setIsImportModalOpen(true)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Import
              </Button>
              <Button 
                onClick={() => setIsFilterModalOpen(true)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={handleHistoryClick}
              className="px-6 py-3 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700"
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('All')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'All'
                  ? 'border-[#8B4A9C] text-[#8B4A9C] bg-[#8B4A9C]/5'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('In')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'In'
                  ? 'border-[#198754] text-[#198754] bg-[#198754]/5'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              In
            </button>
            <button
              onClick={() => setActiveTab('Out')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'Out'
                  ? 'border-[#8B4A9C] text-[#8B4A9C] bg-[#8B4A9C]/5'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Out
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Actions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Vehicle Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Parking Slot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Vehicle Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Vehicle Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Sticker Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Registration Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Active/Inactive</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Insurance Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Insurance Valid Till</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Staff Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qr Code</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicleData.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap border-r">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium border-r">{vehicle.vehicleNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{vehicle.parkingSlot}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 border-r">{vehicle.vehicleCategory}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{vehicle.vehicleType}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{vehicle.stickerNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{vehicle.category}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{vehicle.registrationNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap border-r">
                      <input 
                        type="checkbox" 
                        checked={vehicle.activeInactive} 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{vehicle.insuranceNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{vehicle.insuranceValidTill}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{vehicle.staffName}</td>
                    <td className="px-4 py-4 whitespace-nowrap border-r">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.qrCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddGVehicleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <GVehicleImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />
      
      <GVehicleFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  );
};
