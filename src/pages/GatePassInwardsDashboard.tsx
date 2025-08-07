
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SlidersHorizontal } from 'lucide-react';
import { GatePassInwardsFilterModal } from '@/components/GatePassInwardsFilterModal';

export const GatePassInwardsDashboard = () => {
  const navigate = useNavigate();
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Inward List</h1>
        
        {/* Add and Filters Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="!bg-[#F2EEE9] border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => navigate('/security/gate-pass/inwards/add')}
          >
            <span className="text-lg">+</span>
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
      <div className="bg-white rounded-lg border overflow-x-auto">
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
            {inwardData.map((entry) => (
              <TableRow key={entry.id}>
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

      <GatePassInwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
