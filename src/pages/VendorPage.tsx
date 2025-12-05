import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Upload, X, Loader2 } from 'lucide-react';
import { vendorService } from '@/services/vendorService';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
interface Vendor {
  id: number;
  company_name: string;
  supplier_type: string[] | null;
  email: string;
  mobile1: string;
  active: boolean;
  ext_business_partner_code: string | null;
  gstin_number: string | null;
  pan_number: string | null;
  financial_summary: {
    po_outstanding_amount: number;
    wo_outstanding_amount: number;
  };
  average_rating: number | null;
  signed_on_contract: string | null;
  re_kyc_date: string | null;
}

export const VendorPage = () => {
  const navigate = useNavigate();
  // Initialize permission hook
  const { shouldShow } = useDynamicPermissions();
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const fetchVendors = useCallback(async (page: number, search: string) => {
    setLoading(true);
    setIsSearching(!!search);
    setError(null);
    try {
      const data = await vendorService.getVendors(page, search);
      if (data && data.pms_suppliers) {
        setVendors(data.pms_suppliers);
        if (data.pagination) {
          setCurrentPage(data.pagination.current_page);
          setTotalPages(data.pagination.total_pages);
          setTotalCount(data.pagination.total_count);
        } else {
          setCurrentPage(1);
          setTotalPages(1);
          setTotalCount(data.pms_suppliers.length);
        }
      } else {
        setVendors([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err) {
      setError('Failed to fetch vendors.');
      toast.error('Failed to fetch vendors.');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchVendors]);

  const handleGlobalSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleAddVendor = () => navigate('/maintenance/vendor/add');
  const handleViewVendor = (id: number) => navigate(`/maintenance/vendor/view/${id}`);
  
  const handleImport = () => {
    setShowImportModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['.xlsx', '.xls', '.csv'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (validTypes.includes(fileExtension)) {
        setSelectedFile(file);
      } else {
        toast.error('Please select a valid file format (CSV, Excel .xlsx, .xls)');
        event.target.value = '';
      }
    }
  };

  const handleImportSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }

    const formData = new FormData();
    formData.append('supplier_file', selectedFile);

    setIsImporting(true);

    try {
      toast.loading('Importing suppliers...', { id: 'import-loading' });
      
      const response = await fetch(getFullUrl('/pms/assets/supplier_import.json'), {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`Import failed: ${response.statusText}`);
      }

      const result = await response.json();
      toast.dismiss('import-loading');
      
      console.log('Import API Response:', result);
      
      // Check for different possible success indicators
      if (result.success === true || result.status === 'success' || response.status === 200) {
        toast.success(result.message || 'Suppliers imported successfully!');
        // Refresh the vendor list to show imported data
        fetchVendors(currentPage, searchTerm);
        setShowImportModal(false);
        setSelectedFile(null);
      } else {
        toast.error(result.message || result.error || 'Import failed');
      }
    } catch (error) {
      toast.dismiss('import-loading');
      console.error('Import error:', error);
      toast.error('Failed to import suppliers. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadSample = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = getFullUrl('/assets/supplier.xlsx');
    link.download = 'supplier_sample_format.xlsx';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Sample format downloaded successfully');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ['.xlsx', '.xls', '.csv'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (validTypes.includes(fileExtension)) {
        setSelectedFile(file);
      } else {
        toast.error('Please select a valid file format (CSV, Excel .xlsx, .xls)');
      }
    }
  };
  const handleExport = async () => {
    try {
      toast.loading('Preparing export...', { id: 'export-loading' });
      // Use API config helpers
      const { BASE_URL, TOKEN, ENDPOINTS } = await import('@/config/apiConfig');
      const token = TOKEN;
      const baseUrl = BASE_URL;
      if (!token || !baseUrl) {
        toast.dismiss('export-loading');
        toast.error('Authentication required. Please log in again.');
        return;
      }
      // Use the endpoint from config
      const exportUrl = `${baseUrl}${ENDPOINTS.SUPPLIERS_EXPORT}?access_token=${token}`;
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = `suppliers_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.dismiss('export-loading');
      toast.success('Export started successfully');
    } catch (error) {
      toast.dismiss('export-loading');
      console.error('Export error:', error);
      toast.error('Failed to export suppliers data');
    }
  };
  const handleClearSelection = () => { setShowActionPanel(false); };
  console.log("vendors:---", vendors);
  
  const columns = [
    { key: 'actions', label: 'Action', sortable: false },
    { key: 'id', label: 'ID', sortable: true },
    { key: 'company_name', label: 'Company Name', sortable: true },
    { key: 'ext_business_partner_code', label: 'Company Code', sortable: true },
    { key: 'gstin_number', label: 'GSTIN Number', sortable: true },
    { key: 'pan_number', label: 'PAN Number', sortable: true },
    { key: 'supplier_type', label: 'Supplier Type', sortable: true },
    // { key: 'average_rating', label: 'Ratings', sortable: true },
    // { key: 'signed_on_contract', label: 'Signed On Contract', sortable: true },
    { key: 'kyc_end_in_days', label: 'KYC End In Days', sortable: true },
  ];
console.log("vendors:-",vendors);

  const renderCell = (item: Vendor, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex gap-1">
            {shouldShow("vendors", "view") && (
              <Button variant="ghost" size="sm" onClick={() => handleViewVendor(item.id)}>
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        );
      case 'supplier_type':
        const types = item.supplier_type;
        if (Array.isArray(types) && types.length > 0) {
          return types.join(', ');
        }
        return '-';
      case 'ext_business_partner_code':
        return item.ext_business_partner_code ?? '-';
      case 'gstin_number':
        return item.gstin_number ?? '-';
      case 'pan_number':
        return item.pan_number ?? '-';
      case 'po_outstandings':
        return item.financial_summary?.po_outstanding_amount ?? '-';
      case 'wo_outstandings':
        return item.financial_summary?.wo_outstanding_amount ?? '-';
      case 'average_rating':
        return item.average_rating ?? '-';
      case 'signed_on_contract':
        return item.signed_on_contract ? new Date(item.signed_on_contract).toLocaleDateString() : '-';
      case 'kyc_end_in_days':
        if (!item.re_kyc_date) return '-';
        const endDate = new Date(item.re_kyc_date);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 'Expired';
      default:
        return item[columnKey as keyof Vendor] as React.ReactNode;
    }
  };

  const renderCustomActions = () => shouldShow("vendors", "add") ? (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Button 
        onClick={() => setShowActionPanel((prev) => !prev)}
        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
        Action
      </Button>
    </div>
  ) : null;

  const renderListTab = () => (
    <div className="space-y-4">
      {showActionPanel && (
        <SelectionPanel
          onAdd={shouldShow("vendors", "add") ? handleAddVendor : undefined}
          onImport={shouldShow("vendors", "import") ? handleImport : undefined}
          onClearSelection={handleClearSelection}
        />
      )}

        <>
          <EnhancedTable
            data={vendors}
            columns={columns}
            renderCell={renderCell}
            pagination={false}
            enableExport={shouldShow("vendors", "export")}
            exportFileName="vendors"
            storageKey="vendors-table"
            enableGlobalSearch={true}
            onGlobalSearch={handleGlobalSearch}
            searchPlaceholder="Search vendors (company, code, GST, PAN, email, mobile)..."
            leftActions={renderCustomActions()}
            loading={isSearching || loading}
            loadingMessage={isSearching ? "Searching vendors..." : "Loading vendors..."}
          />

          {!searchTerm && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <Toaster position="top-right" richColors closeButton />
      <div className="w-full">
        {renderListTab()}
      </div>

      {/* Import Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Bulk Upload</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowImportModal(false)} className="p-1">
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </DialogHeader>
          <div className="space-y-6">
            <div 
              className="border-2 border-dashed border-red-700 rounded-lg p-8 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-red-700" />
              <p className="text-sm mb-2">
                <span className="text-gray-600">Drag & Drop or </span>
                <label className="text-red-700 cursor-pointer font-medium">
                  Choose File
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">Supports: CSV, Excel (.xlsx, .xls)</p>
              {selectedFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-700">Selected file:</p>
                  <p className="text-xs text-green-600">{selectedFile.name}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleDownloadSample}
                className="text-red-700 border-red-700 hover:bg-red-50"
              >
                Download Sample Format
              </Button>
              <Button 
                onClick={handleImportSubmit}
                disabled={!selectedFile || isImporting}
                className="bg-red-700 text-white hover:bg-red-800 disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  'Import'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
