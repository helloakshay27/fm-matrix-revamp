
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter } from 'lucide-react';
import { InwardsFilterModal } from '@/components/InwardsFilterModal';

const mockInwardsData = [
  {
    id: 8002,
    type: 'Faulty',
    category: 'Staff',
    personName: 'Sumitra Patil',
    profileImage: '/lovable-uploads/f4ecae77-7945-4430-a247-43c409855968.png',
    passNo: '',
    modeOfTransport: 'By Courier',
    lrNo: '',
    tripId: '2189-10136',
    gateEntry: '',
    itemDetails: 'Fiber - - 10\nPassive Infra - - 15'
  },
  {
    id: 2831,
    type: 'Fresh',
    category: 'Vendor',
    personName: 'Reliance Digital',
    profileImage: '/lovable-uploads/f4ecae77-7945-4430-a247-43c409855968.png',
    passNo: 36583,
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10134',
    gateEntry: '',
    itemDetails: 'Passive infra - - 46'
  },
  {
    id: 2615,
    type: 'RS&R',
    category: 'Vendor',
    personName: 'Reliance Digital',
    profileImage: '/lovable-uploads/f4ecae77-7945-4430-a247-43c409855968.png',
    passNo: 36583,
    modeOfTransport: 'By Vehicle',
    lrNo: '56 Njhn',
    tripId: '2189-10131',
    gateEntry: '0',
    itemDetails: 'Switch - 456 - 245'
  },
  {
    id: 2603,
    type: 'Fresh',
    category: 'Vendor',
    personName: 'Vodafone',
    profileImage: '/lovable-uploads/f4ecae77-7945-4430-a247-43c409855968.png',
    passNo: 40005,
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10128',
    gateEntry: '',
    itemDetails: 'RAN - 344 - 12\nTransmission - 577 - 24\nSwitch - 5678 - 56'
  },
  {
    id: 2523,
    type: 'Fresh',
    category: 'Visitor',
    personName: 'Abdul g',
    profileImage: '/lovable-uploads/f4ecae77-7945-4430-a247-43c409855968.png',
    passNo: '',
    modeOfTransport: 'By Hand',
    lrNo: 'Fuffghh76',
    tripId: '2189-10127',
    gateEntry: 6555776,
    itemDetails: 'Passive Infra - -\n\nFiber - 123554/ new package - 40'
  }
];

export const InwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Goods In/Out</span>
          <span>&gt;</span>
          <span>Inwards</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Inward List</h2>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setIsFilterModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Person Name</TableHead>
                  <TableHead>Profile Image</TableHead>
                  <TableHead>Pass No.</TableHead>
                  <TableHead>Mode of Transport</TableHead>
                  <TableHead>LR No.</TableHead>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Gate Entry</TableHead>
                  <TableHead>Item Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInwardsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-blue-600">{item.personName}</TableCell>
                    <TableCell>
                      <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">👤</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.passNo}</TableCell>
                    <TableCell>{item.modeOfTransport}</TableCell>
                    <TableCell>{item.lrNo}</TableCell>
                    <TableCell>{item.tripId}</TableCell>
                    <TableCell>{item.gateEntry}</TableCell>
                    <TableCell className="whitespace-pre-line text-sm">{item.itemDetails}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-purple-600 text-white border-purple-600">1</Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">4</Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">5</Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-purple-600 text-white border-purple-600">&gt;</Button>
              <Button variant="outline" size="sm" className="px-3 h-8">Last &gt;</Button>
            </div>
          </div>
        </div>
      </div>

      <InwardsFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  );
};
