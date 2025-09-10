import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Filter, Eye, Plus } from 'lucide-react';
import { GatePassInwardsFilterModal } from '@/components/GatePassInwardsFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG } from '@/config/apiConfig';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';

// Define your API base URL here or import it from your config/environment
const API_BASE_URL = API_CONFIG.BASE_URL;

export const GatePassInwardsDashboard = () => {
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [inwardData, setInwardData] = useState<any[]>([]);
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

  // Helper to build query params from filters
  const buildQueryParams = () => {
    const params: Record<string, string> = {};
    if (filters.gateNumber) params['q[gate_number_gate_number_cont]'] = filters.gateNumber;
    if (filters.createdBy) params['q[created_by_full_name_cont]'] = filters.createdBy;
    if (filters.materialName) params['q[gate_pass_materials_pms_inventory_name_cont]'] = filters.materialName;
    if (filters.supplierName) params['q[pms_supplier_company_name_cont]'] = filters.supplierName;
    if (filters.materialType) params['q[gate_pass_materials_pms_inventory_type_name_cont]'] = filters.materialType;
    if (filters.expectedReturnDate) params['q[expected_return_date_eq]'] = filters.expectedReturnDate;
    params['q[gate_pass_category_eq]'] = 'inward';
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
        setInwardData(data.gate_passes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  // Column configuration for the enhanced table
  const columns: ColumnConfig[] = [
    { key: 'sNo', label: 'Sr No.', sortable: false, hideable: false, draggable: false },
    { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false },
    { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true },
    // { key: 'type', label: 'Type', sortable: true, hideable: true, draggable: true },
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

  const handleViewDetails = (id: string) => {
    navigate(`/security/gate-pass/inwards/detail/${id}`);
  };

  const handleAddInward = () => {
    navigate('/security/gate-pass/inwards/add');
  };

  // Prepare data with index for the enhanced table
  const dataWithIndex = inwardData.map((item, index) => ({
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
    itemDetails: (item.gate_pass_materials || [])
      .map(m => `ID:${m.pms_inventory_id} Qty:${m.gate_pass_qty ?? '--'}`)
      .join(', ')
  }));

  console.log("Data with index:", dataWithIndex);

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
    id: (
      <button
        onClick={() => handleViewDetails(entry.id)}
        className="text-[#C72030] hover:underline hover:text-[#C72030]/80 transition-colors font-medium"
      >
        {entry.id}
      </button>
    ),
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
    itemDetails: (
      <div className="max-w-xs">
        <div className="truncate" title={entry.itemDetails}>
          {entry.itemDetails}
        </div>
      </div>
    )
  });

  // SelectionPanel actions (customize as needed)
  const selectionActions = [
    { label: 'Add', icon: Plus, onClick: handleAddInward },
  ];

  // Render Action button for leftActions
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inward List</h1>
      {/* Action Panel overlay */}
      {showActionPanel && (
        <SelectionPanel
          actions={selectionActions}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <EnhancedTable
          data={dataWithIndex}
          columns={columns}
          renderRow={renderRow}
          storageKey="inward-gate-pass-table"
          emptyMessage="No inward entries available"
          enableSearch={true}
          // enableExport={true}
          onFilterClick={() => setIsFilterModalOpen(true)}          
          searchPlaceholder="Search inward entries..."
          exportFileName="inward-gate-pass-entries"
          leftActions={renderActionButton()}
        />
      )}
      <GatePassInwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};
