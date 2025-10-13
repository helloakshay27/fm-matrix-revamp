import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Filter, Eye, Plus, Flag, Upload, Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { GatePassInwardsFilterModal } from '@/components/GatePassInwardsFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG } from '@/config/apiConfig';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationContent,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

/**
 * DUMMY MODE ENABLED: 
 * The receive/handover functionality is using localStorage instead of API calls.
 * All handover data is stored in localStorage with key: 'gatePassHandoverData'
 * API calls for receive functionality are commented out.
 * To re-enable API mode, uncomment the API calls in handleSubmitReceive and initial data load.
 */

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
    flagged: undefined as boolean | undefined,
    gatePassNo: '',
    gatePassTypeId: '',
    gatePassDate: '',
    vehicleNo: '',
    vendorCompany: '',
    vendor: '',
    visitorName: '',
    visitorContact: '',
    buildingId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const pageSize = 10;

  // COMMENTED: Receive modal state (moved to detail page)
  // const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  // const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  // const [handoverTo, setHandoverTo] = useState('');
  // const [receivedDate, setReceivedDate] = useState('');
  // const [remarks, setRemarks] = useState('');
  // const [attachments, setAttachments] = useState<File[]>([]);
  // const [handoverData, setHandoverData] = useState<{ [key: number]: any }>(() => {
  //   // Load handoverData from localStorage on initialization
  //   const saved = localStorage.getItem('gatePassHandoverData');
  //   return saved ? JSON.parse(saved) : {};
  // });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  // COMMENTED: Save handoverData to localStorage (moved to detail page)
  // useEffect(() => {
  //   localStorage.setItem('gatePassHandoverData', JSON.stringify(handoverData));
  // }, [handoverData]);

  // Helper to build query params from filters
  const buildQueryParams = () => {
    const params: Record<string, string> = {};
    // Existing params
    if (filters.gateNumber) params['q[gate_number_gate_number_cont]'] = filters.gateNumber;
    if (filters.createdBy) params['q[created_by_full_name_cont]'] = filters.createdBy;
    if (filters.materialName) params['q[gate_pass_materials_pms_inventory_name_cont]'] = filters.materialName;
    if (filters.supplierName) params['q[pms_supplier_company_name_cont]'] = filters.supplierName;
    if (filters.materialType) params['q[gate_pass_materials_pms_inventory_type_name_cont]'] = filters.materialType;
    // New fields from filter modal
    if (filters.gatePassNo) params['q[gate_pass_no_cont]'] = filters.gatePassNo;
    if (filters.gatePassTypeId) params['q[gate_pass_type_id_eq]'] = filters.gatePassTypeId;
    if (filters.gatePassDate) params['q[gate_pass_date_eq]'] = filters.gatePassDate;
    if (filters.vehicleNo) params['q[vehicle_no_cont]'] = filters.vehicleNo;
    if (filters.vendorCompany) params['q[vendor_company_name_or_pms_supplier_company_name_cont]'] = filters.vendorCompany;
    if (filters.vendor) params['q[pms_supplier_company_name_cont]'] = filters.vendor;
    if (filters.visitorName) params['q[contact_person_cont]'] = filters.visitorName;
    if (filters.visitorContact) params['q[contact_person_no_cont]'] = filters.visitorContact;
    if (filters.flagged === true) params['q[is_flagged_eq]'] = 'true';
    if (filters.flagged === false) params['q[is_flagged_eq]'] = 'false';
    if (filters.buildingId) params['q[building_id_eq]'] = filters.buildingId;
    params['q[gate_pass_category_eq]'] = 'inward';
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
        const gatePasses = data.gate_passes || [];
        setInwardData(gatePasses);
        setTotalPages(data.pagination?.total_pages || 1);
        setTotalCount(data.pagination?.total_count || (gatePasses.length || 0));
        
        // COMMENTED: API-based handover data merge (using localStorage instead)
        // setHandoverData(prev => {
        //   const updatedHandoverData = { ...prev };
        //   gatePasses.forEach((gatePass: any) => {
        //     if (gatePass.recieved_date || gatePass.handover_to) {
        //       updatedHandoverData[gatePass.id] = {
        //         handoverTo: gatePass.handover_to || '',
        //         receivedDate: gatePass.recieved_date || '',
        //         remarks: gatePass.remarks || '',
        //         attachments: gatePass.attachments || [],
        //         submittedAt: gatePass.updated_at || gatePass.created_at || new Date().toISOString(),
        //       };
        //     }
        //   });
        //   return updatedHandoverData;
        // });
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters, currentPage]);

  // Column configuration for the enhanced table
  const columns = useMemo(() => {
    // Get all unique custom fields from the current data
    const customFieldKeys = new Set<string>();
    inwardData.forEach(item => {
      if (item.custom_fields) {
        Object.keys(item.custom_fields).forEach(key => {
          customFieldKeys.add(key);
        });
      }
    });

    const cols = [
      { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false, defaultVisible: true },
      { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      // { key: 'updates', label: 'Updates', sortable: false, hideable: true, draggable: true, defaultVisible: true },
      // { key: 'returnableNonReturnable', label: 'Goods Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'category', label: 'Gate Pass Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'personName', label: 'Created By', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'passNo', label: 'Gate Pass No.', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'modeOfTransport', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'gateEntry', label: 'Gate Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'visitorName', label: 'Visitor Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'visitorContact', label: 'Visitor Contact', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'numberOfMaterials', label: 'No. of Materials', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'supplierName', label: 'Vendor', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      // { key: 'isFlagged', label: 'Flag', sortable: false, hideable: true, draggable: true, defaultVisible: true },
      // { key: 'flaggedAt', label: 'Flagged At', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'vendorCompanyName', label: 'Company Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'buildingName', label: 'Building', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      // Invoice fields
      { key: 'invoiceNo', label: 'Invoice No.', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'invoiceAmount', label: 'Invoice Amount', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'invoiceDate', label: 'Invoice Date', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      // Add dynamic custom field columns
      ...Array.from(customFieldKeys).map(fieldKey => ({
        key: `customField_${fieldKey.replace(/\s+/g, '_')}`,
        label: fieldKey,
        sortable: true,
        hideable: true,
        draggable: true,
        defaultVisible: true
      }))
    ];
    console.log('Columns configuration:', cols);
    return cols;
  }, [inwardData]);

  // Prepare data with index for the enhanced table
  const dataWithIndex = inwardData.map((item, index) => {
    const materials = Array.isArray(item.gate_pass_materials) ? item.gate_pass_materials : [];
    
    // Build custom fields data
    const customFieldsData: { [key: string]: string } = {};
    if (item.custom_fields) {
      Object.keys(item.custom_fields).forEach(fieldKey => {
        const customFieldKey = `customField_${fieldKey.replace(/\s+/g, '_')}`;
        customFieldsData[customFieldKey] = item.custom_fields[fieldKey]?.field_value || '--';
      });
    }

    const mappedData = {
      actions: '', // Placeholder, will be filled by renderRow
      id: item.id,
      vendorCompanyName: item.vendor_company_name || '--',
      buildingName: item.building_name || '--',
      returnableNonReturnable: item.returnable === true ? 'check' : item.returnable === false ? 'cross' : '-',
      category: item.gate_pass_type_name || '--',
      personName: item.created_by_name || '--',
      passNo: item.gate_pass_no || '--',
      modeOfTransport: item.vehicle_no || '--',
      gateEntry: item.gate_number || '--',
      visitorName: item.contact_person || '--',
      visitorContact: item.contact_person_no || '--',
      numberOfMaterials: materials.length,
      supplierName: item.supplier_name || '--',
      isFlagged: item.is_flagged === true,
      flaggedAt: item.flagged_at ? new Date(item.flagged_at).toLocaleString() : '--',
      // Invoice fields
      invoiceNo: item.invoice_no || '--',
      invoiceAmount: item.invoice_amount ? `$${item.invoice_amount}` : '--',
      invoiceDate: item.invoice_date ? new Date(item.invoice_date).toLocaleDateString() : '--',
      // Add custom fields data
      ...customFieldsData,
      _raw: item, // keep original for flag toggling
      // updates: item.id, // Removed - updates column moved to detail page
    };
    console.log('Mapped data item:', mappedData);
    return mappedData;
  });

  // COMMENTED: handoverData console.log (moved to detail page)
  // console.log("handoverData:----", handoverData);
  console.log("dataWithIndex:", dataWithIndex);


  // Flag toggle handler
  const handleFlagToggle = useCallback(async (entry: any) => {
    const baseUrl = localStorage.getItem('baseUrl') || API_BASE_URL;
    const token = localStorage.getItem('token') || API_CONFIG.TOKEN;
    if (!baseUrl || !token) {
      toast.error('Missing base URL or token');
      return;
    }
    const id = entry.id;
    if (togglingIds.has(id)) return;
    setTogglingIds(prev => new Set(prev).add(id));
    try {
      const isCurrentlyFlagged = entry.isFlagged;
      const payload: any = {
        gate_pass: {
          is_flagged: !isCurrentlyFlagged,
          flagged_at: !isCurrentlyFlagged ? new Date().toISOString() : null,
        }
      };
      const res = await fetch(`https://${baseUrl}/gate_passes/${id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update flag');
      toast.success(`Flag ${!isCurrentlyFlagged ? 'activated' : 'removed'} for Gate Pass ${id}`);
      
      // Refresh data by refetching list after flag change
      const params = buildQueryParams();
      params['page'] = currentPage.toString();
      const queryString = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      fetch(`${API_BASE_URL}/gate_passes.json?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          const gatePasses = data.gate_passes || [];
          setInwardData(gatePasses);
          setTotalPages(data.pagination?.total_pages || 1);
          setTotalCount(data.pagination?.total_count || (gatePasses.length || 0));
          
          // COMMENTED: API-based handover data merge (using localStorage instead)
          // setHandoverData(prev => {
          //   const updatedHandoverData = { ...prev };
          //   gatePasses.forEach((gatePass: any) => {
          //     if (gatePass.recieved_date || gatePass.handover_to) {
          //       updatedHandoverData[gatePass.id] = {
          //         handoverTo: gatePass.handover_to || '',
          //         receivedDate: gatePass.recieved_date || '',
          //         remarks: gatePass.remarks || '',
          //         attachments: gatePass.attachments || [],
          //         submittedAt: gatePass.updated_at || gatePass.created_at || new Date().toISOString(),
          //       };
          //     }
          //   });
          //   return updatedHandoverData;
          // });
        });
    } catch (err) {
      toast.error('Failed to update flag');
    } finally {
      setTogglingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [togglingIds, currentPage, filters]);

  const handleViewDetails = (id: string) => {
    navigate(`/security/gate-pass/inwards/detail/${id}`);
  };

  const handleAddInward = () => {
    navigate('/security/gate-pass/inwards/add');
  };

  // COMMENTED: Receive handlers (moved to detail page)
  // const handleReceiveClick = (id: number) => {
  //   setSelectedEntryId(id);
  //   setIsReceiveModalOpen(true);
  //   // Only reset fields if this is a new receive (not viewing existing handover)
  //   if (!handoverData[id]) {
  //     setHandoverTo('');
  //     setReceivedDate('');
  //     setRemarks('');
  //     setAttachments([]);
  //   }
  // };

  // const handleSubmitReceive = async () => { ... };
  // const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };

  // Export handler for inward gate pass
  const handleExport = async () => {
    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;
    try {
      if (!baseUrl || !token) {
        toast.error('Missing base URL or token');
        return;
      }
      // Build query string for export (use same filters as table)
      const params = buildQueryParams();
      const queryString = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      const url = `${baseUrl}/gate_passes.xlsx?${queryString}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        referrerPolicy: 'no-referrer',
        mode: 'cors',
      });
      if (!response.ok) {
        toast.error('Failed to export data');
        return;
      }
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'gate_passes_inward.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success('Exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  // Render row function for enhanced table
  const renderRow = (entry: any) => {
    console.log('Entry data:', entry);
    console.log('Entry ID:', entry.id);

    // Build the base row data
    const rowData: any = {
      actions: (
        <div className="flex gap-2 justify-center" style={{ maxWidth: '80px' }}>
          <div title="View details">
            <Eye
              className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]"
              onClick={() => handleViewDetails(entry.id)}
            />
          </div>
          <div title={entry.isFlagged ? 'Remove Flag' : 'Flag'}>
            <Flag
              className={`w-4 h-4 cursor-pointer ${entry.isFlagged ? 'text-red-500 fill-red-500' : 'text-gray-600'} ${togglingIds.has(entry.id) ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => !togglingIds.has(entry.id) && handleFlagToggle(entry)}
            />
          </div>
        </div>
      ),
      id: <span style={{ maxWidth: '60px' }}>{entry.id}</span>,
      vendorCompanyName: entry.vendorCompanyName,
      buildingName: entry.buildingName,
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
      numberOfMaterials: entry.numberOfMaterials,
      supplierName: entry.supplierName,
      isFlagged: (
        <div title={entry.isFlagged ? 'Remove Flag' : 'Flag'}>
          <Flag
            className={`w-4 h-4 cursor-pointer ${entry.isFlagged ? 'text-red-500 fill-red-500' : 'text-gray-600'} ${togglingIds.has(entry.id) ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => !togglingIds.has(entry.id) && handleFlagToggle(entry)}
          />
        </div>
      ),
      flaggedAt: entry.flaggedAt,
      // Invoice fields
      invoiceNo: entry.invoiceNo,
      invoiceAmount: entry.invoiceAmount,
      invoiceDate: entry.invoiceDate,
    };

    // Add all custom field values dynamically
    Object.keys(entry).forEach(key => {
      if (key.startsWith('customField_')) {
        rowData[key] = entry[key];
      }
    });

    return rowData;
  };

  // SelectionPanel actions (customize as needed)
  const selectionActions = [
    { label: 'Add', icon: Plus, onClick: handleAddInward },
  ];

  // Render Action button for leftActions
  const renderActionButton = () => (
    // <Button
    //   onClick={() => setShowActionPanel((prev) => !prev)}
    //   className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium mr-2"
    // >
    //   <Plus className="w-4 h-4 mr-2" />
    //   Action
    // </Button>
    <Button
      size="sm"
      className="mr-2"
      onClick={() => setShowActionPanel((prev) => !prev)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Action
    </Button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
        storageKey="inward-gate-pass-table-v2"
        emptyMessage="No inward entries available"
        enableSearch={true}
        enableExport={true}
        handleExport={handleExport}
        onFilterClick={() => setIsFilterModalOpen(true)}
        searchPlaceholder="Search inward entries..."
        exportFileName="inward-gate-pass-entries"
        leftActions={renderActionButton()}
        loading={loading}
        selectedItems={selectedItems}
        onSelectItem={(id, checked) => setSelectedItems(checked ? [...selectedItems, id] : selectedItems.filter(i => i !== id))}
        onSelectAll={checked => setSelectedItems(checked ? dataWithIndex.map(d => d.id) : [])}
      />
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
      <GatePassInwardsFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {/* COMMENTED: Receive Modal (moved to detail page) */}
      {/* 
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        ...
      </Dialog>
      */}

      {/* Document Viewer Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDoc?.name || 'Document Viewer'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {selectedDoc?.type === 'image' ? (
              <img
                src={selectedDoc.url}
                alt={selectedDoc.name}
                className="max-w-full h-auto rounded-md border"
              />
            ) : selectedDoc?.type === 'pdf' ? (
              <iframe
                src={selectedDoc.url}
                className="w-full h-[70vh] border rounded-md"
                title={selectedDoc.name}
              />
            ) : (
              <div className="text-center">
                <p className="mb-4">Preview not available for this file type.</p>
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedDoc?.url;
                    link.download = selectedDoc?.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-[#C72030] hover:bg-[#C72030]/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
