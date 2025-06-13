
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { OutwardsFilterModal } from '@/components/OutwardsFilterModal';

const outwardsData = [
  {
    id: '26366',
    type: 'Faulty',
    returnableNonReturnable: 'Returnable',
    expectedReturnDate: '24/01/2024',
    category: 'Staff',
    personName: 'Sumitra Patil',
    profileImage: '/placeholder.svg',
    passNo: '',
    modeOfTransport: 'By Vehicle',
    lrNo: 'Ahhs',
    tripId: '2189-10137',
    gateEntry: '0',
    itemDetails: 'Switch - - 1'
  },
  {
    id: '2832',
    type: 'Fresh',
    returnableNonReturnable: 'Returnable',
    expectedReturnDate: '16/06/2023',
    category: 'Vendor',
    personName: 'Vodafone',
    profileImage: '/placeholder.svg',
    passNo: '40005',
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10135',
    gateEntry: '',
    itemDetails: 'Switch - 678 - 100'
  },
  {
    id: '2616',
    type: 'RS&R',
    returnableNonReturnable: 'Returnable',
    expectedReturnDate: '22/06/2023',
    category: 'Vendor',
    personName: 'Reliance Digital',
    profileImage: '/placeholder.svg',
    passNo: '36583',
    modeOfTransport: 'By Vehicle',
    lrNo: 'Ghj',
    tripId: '2189-10132',
    gateEntry: '0',
    itemDetails: 'Passive Infra - -'
  },
  {
    id: '2604',
    type: 'Faulty',
    returnableNonReturnable: 'Returnable',
    expectedReturnDate: '15/06/2023',
    category: 'Vendor',
    personName: 'TBS ELECTRICAL',
    profileImage: '/placeholder.svg',
    passNo: '37523',
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10129',
    gateEntry: '',
    itemDetails: 'Switch - -'
  },
  {
    id: '1944',
    type: 'SRN',
    returnableNonReturnable: 'Non Returnable',
    expectedReturnDate: '',
    category: 'Visitor',
    personName: 'Rajnish',
    profileImage: '/placeholder.svg',
    passNo: '',
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10126',
    gateEntry: '',
    itemDetails: 'Installation Material - 456 - 50'
  }
];

export const OutwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Outwards</span>
          <span>&gt;</span>
          <span>Outwards</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Outward List</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returnable/Non Returnable</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Return Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode of Transport</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LR No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gate Entry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {outwardsData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{item.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.returnableNonReturnable}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.expectedReturnDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{item.personName}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <img 
                      src={item.profileImage} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full bg-orange-100"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.passNo}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.modeOfTransport}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.lrNo}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.tripId}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.gateEntry}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate">{item.itemDetails}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OutwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
