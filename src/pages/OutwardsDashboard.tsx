
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter } from 'lucide-react';
import { OutwardsFilterModal } from '@/components/OutwardsFilterModal';

const mockOutwardsData = [
  {
    id: 26366,
    type: 'Faulty',
    returnableNonReturnable: 'Returnable',
    expectedReturnDate: '24/01/2024',
    category: 'Staff',
    personName: 'Sumitra Patil',
    profileImage: '/lovable-uploads/aca9d017-a2ca-4403-86ee-394b4bb0b4d9.png',
    passNo: '',
    modeOfTransport: 'By Vehicle',
    lrNo: 'Ahhs',
    tripId: '2189-10137',
    gateEntry: '0',
    itemDetails: 'Switch - - 1'
  },
  {
    id: 2832,
    type: 'Fresh',
    returnableNonReturnable: 'Returnable',
    expectedReturnDate: '16/06/2023',
    category: 'Vendor',
    personName: 'Vodafone',
    profileImage: '/lovable-uploads/aca9d017-a2ca-4403-86ee-394b4bb0b4d9.png',
    passNo: 40005,
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10135',
    gateEntry: '',
    itemDetails: 'Switch - 678 - 100'
  },
  {
    id: 2616,
    type: 'RS&R',
    returnableNonReturnable: 'Returnable',
    expectedReturnDate: '22/06/2023',
    category: 'Vendor',
    personName: 'Reliance Digital',
    profileImage: '/lovable-uploads/aca9d017-a2ca-4403-86ee-394b4bb0b4d9.png',
    passNo: 36583,
    modeOfTransport: 'By Vehicle',
    lrNo: 'Ghj',
    tripId: '2189-10132',
    gateEntry: '0',
    itemDetails: 'Passive Infra - -'
  },
  {
    id: 2604,
    type: 'Faulty',
    returnableNonReturnable: 'Returnable',
    expectedReturnDate: '15/06/2023',
    category: 'Vendor',
    personName: 'TBS ELECTRICAL',
    profileImage: '/lovable-uploads/aca9d017-a2ca-4403-86ee-394b4bb0b4d9.png',
    passNo: 37523,
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10129',
    gateEntry: '',
    itemDetails: 'Switch - -'
  },
  {
    id: 1944,
    type: 'SRN',
    returnableNonReturnable: 'Non Returnable',
    expectedReturnDate: '',
    category: 'Visitor',
    personName: 'Rajnish',
    profileImage: '/lovable-uploads/aca9d017-a2ca-4403-86ee-394b4bb0b4d9.png',
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
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Goods In/Out</span>
          <span>&gt;</span>
          <span>Outwards</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Outward List</h2>
            
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
                  <TableHead>Returnable/Non Returnable</TableHead>
                  <TableHead>Expected Return Date</TableHead>
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
                {mockOutwardsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.returnableNonReturnable}</TableCell>
                    <TableCell>{item.expectedReturnDate}</TableCell>
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
        </div>
      </div>

      <OutwardsFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  );
};
