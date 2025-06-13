
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GoodsFilterModal } from '../components/GoodsFilterModal';

const outwardsData = [
  {
    id: 26366,
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
    id: 2832,
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
    id: 2616,
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
    id: 2604,
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
    id: 1944,
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
  },
  {
    id: 1593,
    type: 'Faulty',
    returnableNonReturnable: 'Non Returnable',
    expectedReturnDate: '',
    category: 'Staff',
    personName: 'Nupura Waradkar',
    profileImage: '/placeholder.svg',
    passNo: '',
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10123',
    gateEntry: '',
    itemDetails: 'Switch - 456 - 345'
  },
  {
    id: 1535,
    type: 'Faulty',
    returnableNonReturnable: 'Non Returnable',
    expectedReturnDate: '',
    category: 'Staff',
    personName: 'Sumitra Patil',
    profileImage: '/placeholder.svg',
    passNo: '',
    modeOfTransport: 'By Vehicle',
    lrNo: '467',
    tripId: '2189-10119',
    gateEntry: '111',
    itemDetails: 'Fiber - 345 - 5'
  }
];

export const OutwardsDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Outwards</span>
          <span>&gt;</span>
          <span>Outwards</span>
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Outward List</h1>

        {/* Filter Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsFilterOpen(true)}
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
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
                {outwardsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.returnableNonReturnable}</TableCell>
                    <TableCell>{item.expectedReturnDate}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.personName}</TableCell>
                    <TableCell>
                      <img 
                        src={item.profileImage} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    </TableCell>
                    <TableCell>{item.passNo}</TableCell>
                    <TableCell>{item.modeOfTransport}</TableCell>
                    <TableCell>{item.lrNo}</TableCell>
                    <TableCell>{item.tripId}</TableCell>
                    <TableCell>{item.gateEntry}</TableCell>
                    <TableCell className="whitespace-pre-line text-sm">
                      {item.itemDetails}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <GoodsFilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
};
