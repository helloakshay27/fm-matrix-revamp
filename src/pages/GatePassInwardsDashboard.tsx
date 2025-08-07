
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SlidersHorizontal } from 'lucide-react';
import { GatePassInwardsFilterModal } from '@/components/GatePassInwardsFilterModal';

export const GatePassInwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Data matching the screenshot
  const inwardData = [
    {
      id: "4102",
      type: "",
      category: "Visitor",
      personName: "Aniket",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10027",
      itemDetails: "- Drill machine serials 1244 -"
    },
    {
      id: "1083",
      type: "Faulty",
      category: "Vendor",
      personName: "Haven infoline",
      profileImage: "/placeholder.svg",
      passNo: "143",
      modeOfTransport: "By Hand",
      lrNo: "Bbvbb",
      tripId: "0",
      gateEntry: "7-10026",
      itemDetails: "RAN - 1 - MW - -"
    },
    {
      id: "864",
      type: "SRN",
      category: "Visitor",
      personName: "Yash",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10025",
      itemDetails: "Transmission - - MW - -"
    },
    {
      id: "863",
      type: "SRN",
      category: "Staff",
      personName: "demo demo",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10024",
      itemDetails: "Transmission - - 5 Transmission - -"
    },
    {
      id: "862",
      type: "Fresh",
      category: "Visitor",
      personName: "Prashant",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10023",
      itemDetails: "Transmission - - Transmission - - Transmission - -"
    },
    {
      id: "861",
      type: "SRN",
      category: "Visitor",
      personName: "bilal",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10022",
      itemDetails: "MW - - Transmission - - Transmission - -"
    },
    {
      id: "860",
      type: "Faulty",
      category: "Visitor",
      personName: "Saurabh",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10021",
      itemDetails: "MW - - Transmission - -"
    }
  ];

  const handleViewDetails = (id: string) => {
    console.log('View details for:', id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Inward List</h1>
          
          {/* Add and Filters Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-4 py-2 rounded-none flex items-center gap-2"
              onClick={() => window.location.href = '/security/gate-pass/inwards/add'}
            >
              Add
            </Button>
            <Button 
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-4 py-2 rounded-none flex items-center gap-2"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left font-semibold">ID</TableHead>
                <TableHead className="text-left font-semibold">Type</TableHead>
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
              {inwardData.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-600">
                    <button
                      onClick={() => handleViewDetails(entry.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {entry.id}
                    </button>
                  </TableCell>
                  <TableCell>{entry.type}</TableCell>
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

      <GatePassInwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
