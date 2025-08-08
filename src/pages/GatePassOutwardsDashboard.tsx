
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Filter, Eye, Plus } from 'lucide-react';
import { GatePassOutwardsFilterModal } from '@/components/GatePassOutwardsFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

export const GatePassOutwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/security/gate-pass/outwards/${id}`);
  };

  // Column configuration for the enhanced table
  const columns: ColumnConfig[] = [
    { key: 'sNo', label: 'S No.', sortable: false, hideable: false, draggable: false },
    { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true },
    { key: 'type', label: 'Type', sortable: true, hideable: true, draggable: true },
    { key: 'returnableNonReturnable', label: 'Returnable/Non Returnable', sortable: true, hideable: true, draggable: true },
    { key: 'expectedReturnDate', label: 'Expected Return Date', sortable: true, hideable: true, draggable: true },
    { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true },
    { key: 'personName', label: 'Person Name', sortable: true, hideable: true, draggable: true },
    { key: 'profileImage', label: 'Profile Image', sortable: false, hideable: true, draggable: true },
    { key: 'passNo', label: 'Pass No.', sortable: true, hideable: true, draggable: true },
    { key: 'modeOfTransport', label: 'Mode of Transport', sortable: true, hideable: true, draggable: true },
    { key: 'lrNo', label: 'LR No.', sortable: true, hideable: true, draggable: true },
    { key: 'tripId', label: 'Trip ID', sortable: true, hideable: true, draggable: true },
    { key: 'gateEntry', label: 'Gate Entry', sortable: true, hideable: true, draggable: true },
    { key: 'itemDetails', label: 'Item Details', sortable: false, hideable: true, draggable: true, width: '300px' }
  ];

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

  // Prepare data with index for the enhanced table
  const dataWithIndex = outwardData.map((item, index) => ({
    ...item,
    sNo: index + 1
  }));

  // Render row function for enhanced table
  const renderRow = (entry: any) => ({
    sNo: entry.sNo,
    id: (
      <button
        onClick={() => handleViewDetails(entry.id)}
        className="text-[#C72030] hover:underline hover:text-[#C72030]/80 transition-colors font-medium"
      >
        {entry.id}
      </button>
    ),
    type: entry.type || '--',
    returnableNonReturnable: entry.returnableNonReturnable,
    expectedReturnDate: entry.expectedReturnDate || '--',
    category: entry.category,
    personName: entry.personName,
    profileImage: (
      <img 
        src={entry.profileImage} 
        alt={`${entry.personName} profile`}
        className="w-8 h-8 rounded-full object-cover border border-gray-200 mx-auto"
      />
    ),
    passNo: entry.passNo || '--',
    modeOfTransport: entry.modeOfTransport || '--',
    lrNo: entry.lrNo || '--',
    tripId: entry.tripId || '--',
    gateEntry: entry.gateEntry || '--',
    itemDetails: (
      <div className="max-w-xs">
        <div className="truncate" title={entry.itemDetails}>
          {entry.itemDetails}
        </div>
      </div>
    )
  });

  // Render actions for each row
  const renderActions = (entry: any) => (
    <div className="flex gap-2 justify-center">
      <div title="View details">
        <Eye 
          className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]" 
          onClick={() => handleViewDetails(entry.id)}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Outward List</h1>
      
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => navigate('/security/gate-pass/outwards/add')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        
        <Button 
          variant="outline"
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white p-2 rounded-md"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <EnhancedTable
        data={dataWithIndex}
        columns={columns}
        renderRow={renderRow}
        renderActions={renderActions}
        storageKey="outward-gate-pass-table"
        emptyMessage="No outward entries available"
        enableSearch={true}
        enableExport={true}
        searchPlaceholder="Search outward entries..."
        exportFileName="outward-gate-pass-entries"
      />

      <GatePassOutwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
