
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, SlidersHorizontal, Edit, Search } from 'lucide-react';
import { AddVehicleParkingModal } from '@/components/AddVehicleParkingModal';
import { RVehicleImportModal } from '@/components/RVehicleImportModal';
import { RVehicleFilterModal } from '@/components/RVehicleFilterModal';
import { useNavigate } from 'react-router-dom';

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
    qrCode: '🔲',
    status: 'In'
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
    qrCode: '🔲',
    status: 'In'
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
    qrCode: '🔲',
    status: 'In'
  },
  {
    id: 4,
    vehicleNumber: 'RJ02G7403',
    parkingSlot: '6',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Sedan',
    stickerNumber: '11',
    category: 'Leased',
    registrationNumber: '5566',
    activeInactive: true,
    insuranceNumber: '9872930303',
    insuranceValidTill: '01/04/2023',
    staffName: '',
    statusCode: 'Active',
    qrCode: '🔲',
    status: 'Out'
  },
  {
    id: 5,
    vehicleNumber: 'GJ02G7398',
    parkingSlot: '8',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Hatchback',
    stickerNumber: '5678',
    category: 'Workshop',
    registrationNumber: '2022',
    activeInactive: true,
    insuranceNumber: '756696',
    insuranceValidTill: '31/12/2024',
    staffName: '',
    statusCode: 'Active',
    qrCode: '🔲',
    status: 'Out'
  }
];

export const RVehiclesDashboard = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleHistoryClick = () => {
    navigate('/security/vehicle/r-vehicles/history');
  };

  const getFilteredData = () => {
    let filtered = vehicleData;
    
    if (activeTab === 'In') {
      filtered = vehicleData.filter(vehicle => vehicle.status === 'In');
    } else if (activeTab === 'Out') {
      filtered = vehicleData.filter(vehicle => vehicle.status === 'Out');
    }
    
    if (searchTerm) {
      filtered = filtered.filter(vehicle => 
        vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const renderCardView = () => {
    const filteredData = getFilteredData();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredData.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-600">{vehicle.vehicleNumber}</h3>
              <div className="flex items-center gap-2">
                {activeTab === 'In' && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    In
                  </span>
                )}
                {activeTab === 'Out' && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    Out
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              {vehicle.vehicleCategory === '4 Wheeler' ? (
                <div className="w-16 h-12 bg-blue-500 rounded flex items-center justify-center">
                  <svg className="w-8 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-12 bg-blue-500 rounded flex items-center justify-center">
                  <svg className="w-8 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM21 9v2h-2v7c0 1.1-.9 2-2 2h-2v-2h2v-5.5l-2.21-.66c-.44-.14-.75-.52-.75-.98 0-.61.45-1.11 1.06-1.11.18 0 .35.04.49.11l.7.21C16.07 10.24 16 10.62 16 11v1h2V9c0-1.1.9-2 2-2s2 .9 2 2zm-6.5 7.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
                  </svg>
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{vehicle.category}</span>
              </div>
              {vehicle.staffName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Staff:</span>
                  <span className="font-medium">{vehicle.staffName}</span>
                </div>
              )}
              {vehicle.parkingSlot && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Parking Slot:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    {vehicle.parkingSlot}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTableView = () => {
    return (
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
            {getFilteredData().map((vehicle) => (
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
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">VEHICLE PARKINGS</h1>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Action Buttons */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2"
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
            
            {(activeTab === 'In' || activeTab === 'Out') && (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search using Vehicle number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button 
                  style={{ backgroundColor: '#C72030' }}
                  className="hover:bg-[#C72030]/90 text-white px-6 py-2 rounded"
                >
                  Go!
                </Button>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {['History', 'All', 'In', 'Out'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'History') {
                    handleHistoryClick();
                  }
                }}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#C72030] text-[#C72030] bg-[#C72030]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'In' || activeTab === 'Out' ? renderCardView() : renderTableView()}
        </div>
      </div>

      <AddVehicleParkingModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <RVehicleImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />
      
      <RVehicleFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  );
};
