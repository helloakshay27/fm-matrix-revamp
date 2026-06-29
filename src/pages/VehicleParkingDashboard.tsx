
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
    <div className="p-6 bg-[#F6F4EE] min-h-screen">
    vehicleType: 'Sedan',
        <div className="flex items-center gap-2 text-sm text-[#8a7e72] mb-4">
    category: 'Staff',
    registrationNumber: 'MH12AB1234',
    activeInactive: true,
    insuranceNumber: 'INS001',
    insuranceValidTill: '2025-12-31',
        <Heading level="h1" variant="default" className="uppercase mb-6 text-[#2D2A26]">
    status: 'Active',
    qrCode: 'QR001'
  },
  {
    id: 2,
    vehicleNumber: 'MH-12-CD-5678',
    parkingSlot: 'B-202',
            className="fm-button-fix border border-[#DA7756] bg-[#fffaf6] px-4 py-2 rounded-lg text-[#DA7756] hover:bg-[#fdf0ea] flex items-center gap-2"
    stickerNumber: 'ST002',
    category: 'Visitor',
    registrationNumber: 'MH12CD5678',
    activeInactive: false,
    insuranceNumber: 'INS002',
    insuranceValidTill: '2025-06-30',
            className="fm-button-fix border border-[#DA7756] bg-[#fffaf6] text-[#DA7756] px-4 py-2 rounded-lg hover:bg-[#fdf0ea] flex items-center gap-2"
    status: 'Inactive',
    qrCode: 'QR002'
  }
];

export const VehicleParkingDashboard = () => {
            className="fm-button-fix border border-[#DA7756] bg-[#fffaf6] text-[#DA7756] px-4 py-2 rounded-lg hover:bg-[#fdf0ea] flex items-center gap-2"
  const [vehicleData, setVehicleData] = useState(mockVehicleData);

  const handleStatusToggle = (vehicleId: number) => {
    console.log(`Toggling status for Vehicle ${vehicleId}`);
    
    setVehicleData(prev => 
      prev.map(vehicle => 
        <div className="flex gap-2 mb-6 bg-[#F6F4EE] border border-[#e4ddd4] rounded-lg p-1">
          <Button className="bg-[#DA7756] hover:bg-[#c9674a] text-white px-4 py-2 rounded-md shadow-none">
          : vehicle
      )
          <Button className="bg-[#DA7756] hover:bg-[#c9674a] text-white px-4 py-2 rounded-md shadow-none">
  };

          <Button className="bg-[#fffaf6] border border-[#DA7756] text-[#DA7756] px-4 py-2 rounded-md hover:bg-[#fdf0ea] shadow-none">
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
          <Button className="bg-[#fffaf6] border border-[#DA7756] text-[#DA7756] px-4 py-2 rounded-md hover:bg-[#fdf0ea] shadow-none">
          <span>vehicle parkings</span>
          <span>&gt;</span>
          <span>Vehicle Parkings</span>
        </div>
        
        <div className="bg-white rounded-lg border border-[#e4ddd4] overflow-hidden" style={{ boxShadow: 'none' }}>
          VEHICLE PARKINGS
        </Heading>
              <thead className="bg-[#f6f4ee]">
        {/* Action Buttons */}
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Vehicle Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Parking Slot</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Vehicle Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Vehicle Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Sticker Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Registration Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Active/Inactive</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Insurance Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Insurance Valid Till</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Staff Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f] border-r border-[#e4ddd4]">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4a453f]">Qr Code</th>
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
          >
                    <td colSpan={14} className="px-4 py-8 text-center text-[#8a7e72]">
            Filters
          </Button>
        </div>

        {/* Tab Navigation */}
                    <tr key={vehicle.id} className="hover:bg-[#fdfaf5]">
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">
                        <button className="text-[#b3a79b] hover:text-[#DA7756]">
          </Button>
          <Button className="bg-[#C72030] hover:bg-[#B01E2A] text-white px-4 py-2 rounded">
            All
                      <td className="px-4 py-3 border-r border-[#e4ddd4] text-[#1e40af]">{vehicle.vehicleNumber}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">{vehicle.parkingSlot}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">{vehicle.vehicleCategory}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">{vehicle.vehicleType}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">{vehicle.stickerNumber}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">{vehicle.category}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">{vehicle.registrationNumber}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">{vehicle.insuranceNumber}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">{vehicle.insuranceValidTill}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">{vehicle.staffName}</td>
                      <td className="px-4 py-3 border-r border-[#e4ddd4]">
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
