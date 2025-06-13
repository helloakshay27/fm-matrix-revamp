
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { InwardsFilterModal } from '@/components/InwardsFilterModal';

const inwardsData = [
  {
    id: '8002',
    type: 'Faulty',
    category: 'Staff',
    personName: 'Sumitra Patil',
    profileImage: '/placeholder.svg',
    passNo: '',
    modeOfTransport: 'By Courier',
    lrNo: '',
    tripId: '2189-10136',
    gateEntry: '',
    itemDetails: 'Fiber - - 10 Passive Infra - - 15'
  },
  {
    id: '2831',
    type: 'Fresh',
    category: 'Vendor',
    personName: 'Reliance Digital',
    profileImage: '/placeholder.svg',
    passNo: '36583',
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10134',
    gateEntry: '',
    itemDetails: 'Passive Infra - - 46'
  },
  {
    id: '2615',
    type: 'RS&R',
    category: 'Vendor',
    personName: 'Reliance Digital',
    profileImage: '/placeholder.svg',
    passNo: '36583',
    modeOfTransport: 'By Vehicle',
    lrNo: '56 Njhn',
    tripId: '2189-10131',
    gateEntry: '0',
    itemDetails: 'Switch - 456 - 245'
  },
  {
    id: '2603',
    type: 'Fresh',
    category: 'Vendor',
    personName: 'Vodafone',
    profileImage: '/placeholder.svg',
    passNo: '40005',
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10128',
    gateEntry: '',
    itemDetails: 'RAN - 344 - 12 Transmission - 577 - 24 Switch - 5678 - 56'
  },
  {
    id: '2523',
    type: 'Fresh',
    category: 'Visitor',
    personName: 'Abdul g',
    profileImage: '/placeholder.svg',
    passNo: '',
    modeOfTransport: 'By Hand',
    lrNo: 'Fuffgghf76',
    tripId: '2189-10127',
    gateEntry: '6555776',
    itemDetails: 'Passive Infra - - Fiber - 123554/ new package - 40'
  }
];

export const InwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Inwards</span>
          <span>&gt;</span>
          <span>Inwards</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Inward List</h1>
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
              {inwardsData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{item.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
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

      <InwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
