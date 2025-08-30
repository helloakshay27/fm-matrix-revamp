import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { vendorService } from '@/services/vendorService';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
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
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [showActionPanel, setShowActionPanel] = useState(false);

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
  const handleImport = () => { console.log("Import action triggered"); toast.info("Import functionality not yet implemented."); };
  const handleExport = () => { console.log("Export action triggered"); toast.info("Export functionality not yet implemented."); };
  const handleDownloadSample = () => { console.log("Download sample action triggered"); toast.info("Download sample functionality not yet implemented."); };
  const handleClearSelection = () => { setShowActionPanel(false); };

  const columns = [
    { key: 'actions', label: 'Action', sortable: false },
    { key: 'id', label: 'ID', sortable: true },
    { key: 'company_name', label: 'Company Name', sortable: true },
    { key: 'ext_business_partner_code', label: 'Company Code', sortable: true },
    { key: 'gstin_number', label: 'GSTIN Number', sortable: true },
    { key: 'pan_number', label: 'PAN Number', sortable: true },
    { key: 'supplier_type', label: 'Supplier Type', sortable: true },
    { key: 'po_outstandings', label: 'PO Outstandings', sortable: true },
    { key: 'wo_outstandings', label: 'WO Outstandings', sortable: true },
    { key: 'average_rating', label: 'Ratings', sortable: true },
    { key: 'signed_on_contract', label: 'Signed On Contract', sortable: true },
    { key: 'kyc_end_in_days', label: 'KYC End In Days', sortable: true },
  ];

  const renderCell = (item: Vendor, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleViewVendor(item.id)}>
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'supplier_type':
        const types = item.supplier_type;
        if (Array.isArray(types) && types.length > 0) {
          return types.join(', ');
        }
        return 'N/A';
      case 'ext_business_partner_code':
        return item.ext_business_partner_code ?? 'N/A';
      case 'gstin_number':
        return item.gstin_number ?? 'N/A';
      case 'pan_number':
        return item.pan_number ?? 'N/A';
      case 'po_outstandings':
        return item.financial_summary?.po_outstanding_amount ?? 'N/A';
      case 'wo_outstandings':
        return item.financial_summary?.wo_outstanding_amount ?? 'N/A';
      case 'average_rating':
        return item.average_rating ?? 'N/A';
      case 'signed_on_contract':
        return item.signed_on_contract ? new Date(item.signed_on_contract).toLocaleDateString() : 'N/A';
      case 'kyc_end_in_days':
        if (!item.re_kyc_date) return 'N/A';
        const endDate = new Date(item.re_kyc_date);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 'Expired';
      default:
        return item[columnKey as keyof Vendor] as React.ReactNode;
    }
  };

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Button 
        onClick={() => setShowActionPanel((prev) => !prev)}
        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
        Action
      </Button>
    </div>
  );

  const renderListTab = () => (
    <div className="space-y-4">
      {showActionPanel && (
        <SelectionPanel
          onAdd={handleAddVendor}
          onImport={handleImport}
          onExport={handleExport}
          onDownloadSample={handleDownloadSample}
          onClearSelection={handleClearSelection}
        />
      )}

      {loading && !isSearching ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <EnhancedTable
            data={vendors}
            columns={columns}
            renderCell={renderCell}
            pagination={false}
            enableExport={true}
            exportFileName="vendors"
            storageKey="vendors-table"
            enableGlobalSearch={true}
            onGlobalSearch={handleGlobalSearch}
            searchPlaceholder="Search by company name..."
            leftActions={renderCustomActions()}
            loading={isSearching || loading}
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
      )}
    </div>
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <Toaster position="top-right" richColors closeButton />
      <div className="w-full">
        {renderListTab()}
      </div>
    </div>
  );
};
