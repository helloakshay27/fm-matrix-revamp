
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, SlidersHorizontal, Edit } from 'lucide-react';
import { AddVehicleParkingModal } from '@/components/AddVehicleParkingModal';

const vehicleData = [
  {
    id: 1,
    vehicleNumber: 'MH12AA227',
    parkingSlot: '123',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Sedan',
    stickerNumber: '55646',
    category: 'Owned',
    registrationNumber: '46165645',
    activeInactive: true,
    insuranceNumber: '4565465',
    insuranceValidTill: '02/03/2024',
    staffName: '',
    statusCode: 'Active',
    qrCode: '🔲'
  },
  {
    id: 2,
    vehicleNumber: '3422',
    parkingSlot: '',
    vehicleCategory: '2 Wheeler',
    vehicleType: '',
    stickerNumber: '',
    category: 'Staff',
    registrationNumber: '',
    activeInactive: false,
    insuranceNumber: '',
    insuranceValidTill: '',
    staffName: 'Anurag Sharma',
    statusCode: 'Inactive',
    qrCode: '🔲'
  },
  {
    id: 3,
    vehicleNumber: '5532',
    parkingSlot: '',
    vehicleCategory: '2 Wheeler',
    vehicleType: '',
    stickerNumber: '',
    category: 'Owned',
    registrationNumber: '',
    activeInactive: true,
    insuranceNumber: '',
    insuranceValidTill: '',
    staffName: '',
    statusCode: 'Active',
    qrCode: '🔲'
  },
  {
    id: 4,
    vehicleNumber: '43278',
    parkingSlot: '12',
    vehicleCategory: '2 Wheeler',
    vehicleType: 'Sedan',
    stickerNumber: '11',
    category: 'Owned',
    registrationNumber: '5566',
    activeInactive: true,
    insuranceNumber: '9872930303',
    insuranceValidTill: '01/04/2023',
    staffName: '',
    statusCode: 'Active',
    qrCode: '🔲'
  },
  {
    id: 5,
    vehicleNumber: 'GA02G7984',
    parkingSlot: '9',
    vehicleCategory: '2 Wheeler',
    vehicleType: 'Scooter',
    stickerNumber: '5678',
    category: 'Owned',
    registrationNumber: '2022',
    activeInactive: true,
    insuranceNumber: '756696',
    insuranceValidTill: '31/12/2024',
    staffName: '',
    statusCode: 'Active',
    qrCode: '🔲'
  },
  {
    id: 6,
    vehicleNumber: 'GA02G7909',
    parkingSlot: '8',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Hatchback',
    stickerNumber: '',
    category: 'Workshop',
    registrationNumber: '',
    activeInactive: true,
    insuranceNumber: '',
    insuranceValidTill: '',
    staffName: '',
    statusCode: 'Active',
    qrCode: '🔲'
  }
];

export const RVehiclesDashboard = () => {
  const [activeTab, setActiveTab] = useState('History');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
                className="bg-[#8B5A3C] hover:bg-[#7A4D33] text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Import
              </Button>
              <Button 
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
            {['History', 'All', 'In', 'Out'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#8B5A3C] text-[#8B5A3C] bg-[#8B5A3C]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parking Slot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sticker Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active/Inactive</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Valid Till</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicleData.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{vehicle.vehicleNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.parkingSlot}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{vehicle.vehicleCategory}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.vehicleType}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.stickerNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.category}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.registrationNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={vehicle.activeInactive} 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.insuranceNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.insuranceValidTill}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.staffName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.statusCode === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.statusCode}
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

      <AddVehicleParkingModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};
