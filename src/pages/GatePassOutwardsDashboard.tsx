
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SlidersHorizontal, Eye } from 'lucide-react';
import { GatePassOutwardsFilterModal } from '@/components/GatePassOutwardsFilterModal';

export const GatePassOutwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/security/gate-pass/outwards/${id}`);
  };

  // Data matching the screenshot
  const outwardData = [
    {
      id: "850",
      type: "Fresh",
      returnableNonReturnable: "Non Returnable",
      expectedReturnDate: "",
      category: "Visitor",
      personName: "Suraj",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand,By Vehicle",
      lrNo: "",
      tripId: "7-10013",
      gateEntry: "",
      itemDetails: "Transmission - - MW - -"
    },
    {
      id: "845",
      type: "SRN",
      returnableNonReturnable: "Returnable",
      expectedReturnDate: "20/02/2023",
      category: "Visitor",
      personName: "kshitij r",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Courier,By Vehicle",
      lrNo: "12",
      tripId: "7-10008",
      gateEntry: "55",
      itemDetails: "MW - 4 - 2 Transmission - 8 - 2"
    },
    {
      id: "844",
      type: "SRN",
      returnableNonReturnable: "Returnable",
      expectedReturnDate: "20/02/2023",
      category: "Visitor",
      personName: "Din",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand,By Courier",
      lrNo: "123",
      tripId: "7-10007",
      gateEntry: "55",
      itemDetails: "Transmission - 12 - 55 MW - 4 - 3"
    },
    {
      id: "840",
      type: "",
      returnableNonReturnable: "Non Returnable",
      expectedReturnDate: "",
      category: "Staff",
      personName: "demo demo",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "",
      lrNo: "",
      tripId: "7-10003",
      gateEntry: "",
      itemDetails: "Transmission - 45 - 1 MW - 23 - 5"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Outward List</h1>
      
      <div className="flex items-center gap-3 mb-6">
        <Button 
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 flex items-center gap-2 border border-[#C72030]"
          onClick={() => navigate('/security/gate-pass/outwards/add')}
        >
          <span className="text-lg">+</span>
          Add
        </Button>
        
        <Button 
          variant="outline"
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 px-4 py-2 flex items-center gap-2"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>S No.</TableHead>
              <TableHead>Action</TableHead>
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
              <TableHead className="w-48">Item Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outwardData.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <div title="View details">
                      <Eye 
                        className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]" 
                        onClick={() => handleViewDetails(entry.id)}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <button
                    onClick={() => handleViewDetails(entry.id)}
                    className="text-[#C72030] hover:underline hover:text-[#C72030]/80 transition-colors font-medium"
                  >
                    {entry.id}
                  </button>
                </TableCell>
                <TableCell>{entry.type || '--'}</TableCell>
                <TableCell>{entry.returnableNonReturnable}</TableCell>
                <TableCell>{entry.expectedReturnDate || '--'}</TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>{entry.personName}</TableCell>
                <TableCell>
                  <img 
                    src={entry.profileImage} 
                    alt={`${entry.personName} profile`}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                </TableCell>
                <TableCell>{entry.passNo || '--'}</TableCell>
                <TableCell>{entry.modeOfTransport || '--'}</TableCell>
                <TableCell>{entry.lrNo || '--'}</TableCell>
                <TableCell>{entry.tripId || '--'}</TableCell>
                <TableCell>{entry.gateEntry || '--'}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={entry.itemDetails}>
                    {entry.itemDetails}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {outwardData.length === 0 && (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-12">
                  <div className="flex flex-col items-center text-gray-500">
                    <div className="text-lg font-medium mb-2">No outward entries available</div>
                    <div className="text-sm">There are no gate pass entries to display</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <GatePassOutwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
