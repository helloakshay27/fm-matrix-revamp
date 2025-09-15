import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Filter, Eye, Plus } from 'lucide-react';
import { GatePassOutwardsFilterModal } from '@/components/GatePassOutwardsFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG } from '@/config/apiConfig';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { render } from '@fullcalendar/core/preact.js';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
    supplierName: '',
    expectedReturnDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();

  // Helper to build query params from filters
  const buildQueryParams = () => {
    const params: Record<string, string> = {};
    if (filters.gateNumber) params['q[gate_number_gate_number_cont]'] = filters.gateNumber;
    if (filters.createdBy) params['q[created_by_full_name_cont]'] = filters.createdBy;
    // if (filters.materialName) params['q[gate_pass_materials_pms_inventory_name_cont]'] = filters.materialName;
    if (filters.supplierName) params['q[pms_supplier_company_name_cont]'] = filters.supplierName;
    // if (filters.materialType) params['q[gate_pass_materials_pms_inventory_type_name_cont]'] = filters.materialType;
    if (filters.expectedReturnDate) params['q[expected_return_date_eq]'] = filters.expectedReturnDate;
    params['q[gate_pass_category_eq]'] = 'outward';
    return params;
  };

  // Fetch data with filters and pagination
  useEffect(() => {
    const params = buildQueryParams();
    params['page'] = currentPage.toString();
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
        setTotalPages(data.pagination?.total_pages || 1);
        setTotalCount(data.pagination?.total_count || (data.gate_passes?.length || 0));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters, currentPage]);

  const handleViewDetails = (id: string) => {
    navigate(`/security/gate-pass/outwards/${id}`);
  };

  const handleAddOutward = () => {
    navigate('/security/gate-pass/outwards/add');
  };

  // Clear localStorage for table columns and order on mount to force reset
  useEffect(() => {
    localStorage.removeItem('outward-gate-pass-table-columns');
    localStorage.removeItem('outward-gate-pass-table-column-order');
  }, []);

  // Column configuration for the enhanced table
  const columns: ColumnConfig[] = [
    { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false, defaultVisible: true },
    { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'returnableNonReturnable', label: 'Goods Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'category', label: 'Gate Pass Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'personName', label: 'Created By', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'passNo', label: 'Gate Pass No.', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'modeOfTransport', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'gateEntry', label: 'Gate Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'visitorName', label: 'Visitor Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'visitorContact', label: 'Visitor Contact', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    // { key: 'materialName', label: 'Material Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    // { key: 'materialCategory', label: 'Material Category', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    // { key: 'materialQuantity', label: 'Material Quantity', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    // { key: 'unit', label: 'Unit', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'numberOfMaterials', label: 'No. of Materials', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'supplierName', label: 'Vendor', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  ];

  // Prepare data with index for the enhanced table
  const dataWithIndex = outwardData.map((item, index) => {
    const materials = Array.isArray(item.gate_pass_materials) ? item.gate_pass_materials : [];
    const getJoined = (key: keyof typeof materials[0]) =>
      materials.length ? materials.map(m => m?.[key] ?? '--').join(', ') : '--';
    return {
      sNo: index + 1,
      actions: '', // Placeholder, will be filled by renderRow
      id: item.id,
      returnableNonReturnable: item.returnable === true ? 'check' : 'cross',
      category: item.gate_pass_type_name || '--',
      personName: item.created_by_name || '--',
      passNo: item.gate_pass_no || '--',
      modeOfTransport: item.vehicle_no || '--',
      gateEntry: item.gate_number || '--',
      visitorName: item.contact_person || '--',
      visitorContact: item.contact_person_no || '--',
      numberOfMaterials: materials.length,
      // materialName: getJoined('material'),
      // materialCategory: getJoined('item_category'),
      // materialQuantity: getJoined('gate_pass_qty'),
      // unit: getJoined('unit'),
      supplierName: item.supplier_name || '--',
    };
  });
  console.log("Data with Index:", dataWithIndex);
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
    returnableNonReturnable: entry.returnableNonReturnable === 'check'
      ? 'Returnable'
      : entry.returnableNonReturnable === 'cross'
        ? 'Non Returnable'
        : '-',
    category: entry.category,
    personName: entry.personName,
    passNo: entry.passNo,
    modeOfTransport: entry.modeOfTransport,
    gateEntry: entry.gateEntry,
    visitorName: entry.visitorName,
    visitorContact: entry.visitorContact,
    materialName: entry.materialName,
    materialCategory: entry.materialCategory,
    materialQuantity: entry.materialQuantity,
    unit: entry.unit,
    supplierName: entry.supplierName,
    numberOfMaterials: entry.numberOfMaterials,
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
      <div style={{overflowX: 'auto'}}>
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
      </div>
      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from(
                { length: Math.min(totalPages, 10) },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 10 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-center mt-2 text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} ({totalCount} total entries)
          </div>
        </div>
      )}
      <GatePassOutwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};
