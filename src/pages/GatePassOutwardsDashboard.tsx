
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
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Breadcrumb */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Outwards</span>
            <span>&gt;</span>
            <span>Outwards</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Outward List</h1>
            
            {/* Add and Filters buttons */}
            <div className="flex items-center gap-3">
              <Button 
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2"
                onClick={() => navigate('/security/gate-pass/outwards/add')}
              >
                Add
              </Button>
              
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-none flex items-center gap-2"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left font-semibold">View</TableHead>
                <TableHead className="text-left font-semibold">ID</TableHead>
                <TableHead className="text-left font-semibold">Type</TableHead>
                <TableHead className="text-left font-semibold">Returnable/Non Returnable</TableHead>
                <TableHead className="text-left font-semibold">Expected Return Date</TableHead>
                <TableHead className="text-left font-semibold">Category</TableHead>
                <TableHead className="text-left font-semibold">Person Name</TableHead>
                <TableHead className="text-left font-semibold">Profile Image</TableHead>
                <TableHead className="text-left font-semibold">Pass No.</TableHead>
                <TableHead className="text-left font-semibold">Mode of Transport</TableHead>
                <TableHead className="text-left font-semibold">LR No.</TableHead>
                <TableHead className="text-left font-semibold">Trip ID</TableHead>
                <TableHead className="text-left font-semibold">Gate Entry</TableHead>
                <TableHead className="text-left font-semibold">Item Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outwardData.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50">
                  <TableCell>
                    <button 
                      onClick={() => handleViewDetails(entry.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableCell>
                  <TableCell 
                    className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(entry.id)}
                  >
                    {entry.id}
                  </TableCell>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.returnableNonReturnable}</TableCell>
                  <TableCell>{entry.expectedReturnDate}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell className="font-medium">{entry.personName}</TableCell>
                  <TableCell>
                    <img 
                      src={entry.profileImage} 
                      alt={`${entry.personName} profile`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{entry.passNo}</TableCell>
                  <TableCell>{entry.modeOfTransport}</TableCell>
                  <TableCell>{entry.lrNo}</TableCell>
                  <TableCell>{entry.tripId}</TableCell>
                  <TableCell>{entry.gateEntry}</TableCell>
                  <TableCell className="max-w-xs">{entry.itemDetails}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <GatePassOutwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
