
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GoodsFilterModal } from '../components/GoodsFilterModal';

const inwardsData = [
  {
    id: 8002,
    type: 'Faulty',
    category: 'Staff',
    personName: 'Sumitra Patil',
    profileImage: '/placeholder.svg',
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
    profileImage: '/placeholder.svg',
    passNo: '36583',
    modeOfTransport: 'By Vehicle',
    lrNo: '',
    tripId: '2189-10134',
    gateEntry: '',
    itemDetails: 'Passive Infra - - 46'
  },
  {
    id: 2615,
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
    id: 2603,
    type: 'Fresh',
    category: 'Vendor',
    personName: 'Vodafone',
    profileImage: '/placeholder.svg',
    passNo: '40005',
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
    profileImage: '/placeholder.svg',
    passNo: '',
    modeOfTransport: 'By Hand',
    lrNo: 'Fuffgghh76',
    tripId: '2189-10127',
    gateEntry: '6555776',
    itemDetails: 'Passive Infra - -'
  },
  {
    id: 1943,
    type: 'RS&R',
    category: 'Visitor',
    personName: 'Rajnish',
    profileImage: '/placeholder.svg',
    passNo: '',
    modeOfTransport: 'By Hand',
    lrNo: '',
    tripId: '2189-10125',
    gateEntry: '',
    itemDetails: 'Fiber - 123554/ new package - 40\nSwitch - - 30\nRAN - - 20'
  },
  {
    id: 1850,
    type: 'Faulty',
    category: 'Vendor',
    personName: 'Reliance Digital',
    profileImage: '/placeholder.svg',
    passNo: '36583',
    modeOfTransport: 'By Courier',
    lrNo: '',
    tripId: '2189-10124',
    gateEntry: '',
    itemDetails: 'Passive Infra - - 33'
  }
];

export const InwardsDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Inwards</span>
          <span>&gt;</span>
          <span>Inwards</span>
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Inward List</h1>

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
                {inwardsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
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
