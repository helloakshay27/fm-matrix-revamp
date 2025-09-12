import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Filter, Eye, Plus } from 'lucide-react';
import { GatePassOutwardsFilterModal } from '@/components/GatePassOutwardsFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG } from '@/config/apiConfig';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';

// Define your API base URL here or import it from your config/environment
const API_BASE_URL = API_CONFIG.BASE_URL;

export const GatePassOutwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [outwardData, setOutwardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [filters, setFilters] = useState({
    gateNumber: '',
    createdBy: '',
    materialName: '',
    supplierName: '',
    materialType: '',
    expectedReturnDate: '',
  });
  const navigate = useNavigate();

  // Helper to build query params from filters
  const buildQueryParams = () => {
    const params: Record<string, string> = {};
    if (filters.gateNumber) params['q[gate_number_gate_number_cont]'] = filters.gateNumber;
    if (filters.createdBy) params['q[created_by_full_name_cont]'] = filters.createdBy;
    if (filters.materialName) params['q[gate_pass_materials_pms_inventory_name_cont]'] = filters.materialName;
    if (filters.supplierName) params['q[pms_supplier_company_name_cont]'] = filters.supplierName;
    if (filters.materialType) params['q[gate_pass_materials_pms_inventory_type_name_cont]'] = filters.materialType;
    if (filters.expectedReturnDate) params['q[expected_return_date_eq]'] = filters.expectedReturnDate;
    params['q[gate_pass_category_eq]'] = 'outward';
    return params;
  };

  // Fetch data with filters
  useEffect(() => {
    const params = buildQueryParams();
    const queryString = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    setLoading(true);
    fetch(`${API_BASE_URL}/gate_passes.json?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setOutwardData(data.gate_passes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  const handleViewDetails = (id: string) => {
    navigate(`/security/gate-pass/outwards/${id}`);
  };

  const handleAddOutward = () => {
    navigate('/security/gate-pass/outwards/add');
  };

  // Column configuration for the enhanced table
  const columns: ColumnConfig[] = [
    { key: 'sNo', label: 'Sr No.', sortable: false, hideable: false, draggable: false },
    { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false },
    { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true },
    // { key: 'type', label: 'Type', sortable: true, hideable: true, draggable: true },
    { key: 'returnableNonReturnable', label: 'Returnable', sortable: true, hideable: true, draggable: true },
    // { key: 'expectedReturnDate', label: 'Expected Return Date', sortable: true, hideable: true, draggable: true },
    { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true },
    { key: 'personName', label: 'Person Name', sortable: true, hideable: true, draggable: true },
    // { key: 'profileImage', label: 'Profile Image', sortable: false, hideable: true, draggable: true },
    { key: 'passNo', label: 'Pass No.', sortable: true, hideable: true, draggable: true },
    { key: 'modeOfTransport', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true },
    // { key: 'lrNo', label: 'LR No.', sortable: true, hideable: true, draggable: true },
    // { key: 'tripId', label: 'Trip ID', sortable: true, hideable: true, draggable: true },
    { key: 'gateEntry', label: 'Gate Entry', sortable: true, hideable: true, draggable: true },
    // { key: 'itemDetails', label: 'Item Details', sortable: false, hideable: true, draggable: true }
  ];

    // Prepare data with index for the enhanced table
  const dataWithIndex = outwardData.map((item, index) => ({
    sNo: index + 1,
    id: item.id,
    type: item.gate_pass_category || '--',
    category: item.gate_pass_type_name || '--',
    personName: item.created_by_name || '--',
    profileImage: '/placeholder.svg', // or use a real field if available
    passNo: item.gate_pass_no || '--',
    modeOfTransport: item.vehicle_no || '--',
    lrNo: item.lr_no || '--',
    tripId: item.trip_id || '--',
    gateEntry: item.gate_number || '--',
    returnableNonReturnable: item.returnable === true ? 'check' : 'cross',
    itemDetails: (item.gate_pass_materials || [])
      .map(m => `ID:${m.pms_inventory_id} Qty:${m.gate_pass_qty ?? '--'}`)
      .join(', ')
  }));
  
  // Render row function for enhanced table
  const renderRow = (entry: any) => ({
    sNo: entry.sNo,
    actions: (
      <div className="flex gap-2 justify-center">
        <div title="View details">
          <Eye 
            className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]" 
            onClick={() => handleViewDetails(entry.id)}
          />
        </div>
      </div>
    ),
    id: entry.id,
    type: entry.type,
    category: entry.category,
    personName: entry.personName,
    profileImage: (
      <img 
        src={entry.profileImage} 
        alt={`${entry.personName} profile`}
        className="w-8 h-8 rounded-full object-cover border border-gray-200 mx-auto"
      />
    ),
    passNo: entry.passNo,
    modeOfTransport: entry.modeOfTransport,
    lrNo: entry.lrNo,
    tripId: entry.tripId,
    gateEntry: entry.gateEntry,
    returnableNonReturnable: entry.returnableNonReturnable === 'check' ? (
      <span title="Returnable" style={{color: 'green', fontSize: '18px'}}>&#10003;</span>
    ) : entry.returnableNonReturnable === 'cross' ? (
      <span title="Non Returnable" style={{color: 'red', fontSize: '18px'}}>&#10007;</span>
    ) : (
      <span style={{color: '#888', fontSize: '18px'}}>-</span>
    ),
    itemDetails: (
      <div className="max-w-xs">
        <div className="truncate" title={entry.itemDetails}>
          {entry.itemDetails}
        </div>
      </div>
    )
  });

  const selectionActions = [
    { label: 'Add', icon: Plus, onClick: handleAddOutward },
    // { label: 'Import', icon: Filter, onClick: () => setIsFilterModalOpen(true) },
  ];

  const renderActionButton = () => (
    <Button
      onClick={() => setShowActionPanel((prev) => !prev)}
      className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium mr-2"
    >
      <Plus className="w-4 h-4 mr-2" />
      Action
    </Button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Outward List</h1>
      {/* Action Panel overlay */}
      {showActionPanel && (
        <SelectionPanel
          actions={selectionActions}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      <EnhancedTable
        data={dataWithIndex}
        columns={columns}
        renderRow={renderRow}
        storageKey="outward-gate-pass-table"
        emptyMessage="No outward entries available"
        enableSearch={true}
        // enableExport={true}
        onFilterClick={() => setIsFilterModalOpen(true)}
        searchPlaceholder="Search outward entries..."
        exportFileName="outward-gate-pass-entries"
        leftActions={renderActionButton()}
        loading={loading}
      />
      <GatePassOutwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};
