
import React, { useState } from 'react';
import { Plus, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const ParkingBookingDashboard = () => {
  const navigate = useNavigate();

  // Sample data for the parking slots
  const parkingData = [
    { id: 'HSBC', clientName: 'HSBC', no2Wheeler: 0, no4Wheeler: 0, freeParking: 10, paidParking: 20, availableSlots: 30 },
    { id: 'located', clientName: 'located', no2Wheeler: 0, no4Wheeler: 0, freeParking: 20, paidParking: 20, availableSlots: 40 },
    { id: 'demo', clientName: 'demo', no2Wheeler: 0, no4Wheeler: 0, freeParking: 2, paidParking: 5, availableSlots: 7 },
    { id: 'Sohail Ansari', clientName: 'Sohail Ansari', no2Wheeler: 0, no4Wheeler: 0, freeParking: 5, paidParking: 5, availableSlots: 10 },
    { id: 'Dinesh Jain', clientName: 'Dinesh Jain', no2Wheeler: 0, no4Wheeler: 0, freeParking: 5, paidParking: 2, availableSlots: 7 },
    { id: 'Mahendra Longare', clientName: 'Mahendra Longare', no2Wheeler: 0, no4Wheeler: 0, freeParking: 2, paidParking: 1, availableSlots: 3 },
    { id: 'Rajnish Patil', clientName: 'Rajnish Patil', no2Wheeler: 0, no4Wheeler: 0, freeParking: 5, paidParking: 2, availableSlots: 7 },
    { id: 'demon', clientName: 'demon', no2Wheeler: 0, no4Wheeler: 0, freeParking: 2, paidParking: 2, availableSlots: 4 },
    { id: 'GGC', clientName: 'GGC', no2Wheeler: 0, no4Wheeler: 0, freeParking: 2, paidParking: 4, availableSlots: 6 },
    { id: 'Vinayak Test web 1', clientName: 'Vinayak Test web 1', no2Wheeler: 0, no4Wheeler: 0, freeParking: 1, paidParking: 10, availableSlots: 11 },
    { id: 'Vinayak Test', clientName: 'Vinayak Test', no2Wheeler: 0, no4Wheeler: 0, freeParking: 1, paidParking: 0, availableSlots: 1 }
  ];

  const totalStats = {
    vacantTwoWheeler: 4,
    vacantFourWheeler: 7,
    totalTwoWheelerAllotted: 0,
    totalFourWheelerAllotted: 0,
    totalAllotted: 0,
    totalVacant: 11
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Parking</span>
          <span>{'>'}	</span>
          <span>Parking Booking List</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">PARKING BOOKING LIST</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-green-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{totalStats.vacantTwoWheeler}</div>
            <div className="text-sm">Vacant Two Wheeler Slots</div>
          </div>
          <div className="bg-green-600 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{totalStats.vacantFourWheeler}</div>
            <div className="text-sm">Vacant Four Wheeler Slots</div>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{totalStats.totalTwoWheelerAllotted}</div>
            <div className="text-sm">Total Two Wheeler Allotted Slots</div>
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{totalStats.totalFourWheelerAllotted}</div>
            <div className="text-sm">Total Four Wheeler Allotted Slots</div>
          </div>
          <div className="bg-red-600 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{totalStats.totalAllotted}</div>
            <div className="text-sm">Total Allotted Slots</div>
          </div>
          <div className="bg-purple-600 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{totalStats.totalVacant}</div>
            <div className="text-sm">Total Vacant Slots</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={() => navigate('/property/parking/add')}
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
            onClick={() => navigate('/property/parking/view')}
            variant="outline" 
            className="border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Bookings
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Client Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">No. of 2 Wheeler</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">No. of 4 Wheeler</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Free Parking</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Paid Parking</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Available Parking Slots</th>
                </tr>
              </thead>
              <tbody>
                {parkingData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm border-r">{item.id}</td>
                    <td className="px-4 py-3 text-sm border-r">{item.clientName}</td>
                    <td className="px-4 py-3 text-sm border-r text-center">{item.no2Wheeler}</td>
                    <td className="px-4 py-3 text-sm border-r text-center">{item.no4Wheeler}</td>
                    <td className="px-4 py-3 text-sm border-r text-center">{item.freeParking}</td>
                    <td className="px-4 py-3 text-sm border-r text-center">{item.paidParking}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.availableSlots}</td>
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
