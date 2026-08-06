import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Plus, Edit, Eye, X } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { useToast } from '@/hooks/use-toast';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

interface ConsumptionRecord {
  id: number;
  asset_id: number;
  asset_msr_id: number;
  entity_id: number;
  from_date: string;
  to_date: string;
  consumption: number;
  adjustment_factor: number;
  total_consumption: number;
  rate: number;
  amount: number;
  customer_name: string;
  asset_name: string;
  locations: string;
}

const columns: ColumnConfig[] = [
  { key: 'customer_name', label: 'Client Name', sortable: true, defaultVisible: true },
  { key: 'asset_name', label: 'Meter No.', sortable: true, defaultVisible: true },
  { key: 'locations', label: 'Location', sortable: true, defaultVisible: true },
  { key: 'from_date', label: 'From Date', sortable: true, defaultVisible: true },
  { key: 'to_date', label: 'To Date', sortable: true, defaultVisible: true },
  { key: 'adjustment_factor', label: 'Adjustment Factor', sortable: true, defaultVisible: true },
  { key: 'rate', label: 'Rate/KWH', sortable: true, defaultVisible: true },
  { key: 'consumption', label: 'Actual Consumption', sortable: true, defaultVisible: true },
  { key: 'total_consumption', label: 'Total Consumption', sortable: true, defaultVisible: true },
  { key: 'amount', label: 'Amount', sortable: true, defaultVisible: true },
];

const UtilityConsumptionDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { shouldShow } = useDynamicPermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({ clientName: "", meterNo: "" });
  const [data, setData] = useState<ConsumptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 15;

  const fetchData = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const url = new URL(getFullUrl("/customer_monthly_consumptions.json"));
        if (API_CONFIG.TOKEN) {
          url.searchParams.append("access_token", API_CONFIG.TOKEN);
        }
        url.searchParams.append("page", page.toString());
        url.searchParams.append("per_page", pageSize.toString());

        const response = await fetch(
          url.toString(),
          getAuthenticatedFetchOptions()
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const json = await response.json();
        setData(json.customer_monthly_consumptions || []);
        if (json.pagination) {
          setTotalPages(json.pagination.total_pages || 1);
          setTotalCount(json.pagination.total_count || 0);
          setCurrentPage(json.pagination.current_page || 1);
        }
      } catch (error) {
        console.error("Error fetching consumption data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.customer_name?.toLowerCase().includes(search) ||
      item.asset_name?.toLowerCase().includes(search) ||
      item.locations?.toLowerCase().includes(search) ||
      String(item.id).includes(search)
    );
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(
      checked ? filteredData.map((item) => String(item.id)) : []
    );
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
  };

  const handleEdit = (item: ConsumptionRecord) => {
    console.log("Edit item:", item);
  };

  const handleView = (item: ConsumptionRecord) => {
    console.log("View item:", item);
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    fetchData(1);
  };

  const handleResetFilters = () => {
    setFilters({ clientName: "", meterNo: "" });
  };

  const renderCell = (item: ConsumptionRecord, columnKey: string) => {
    switch (columnKey) {
      case 'customer_name':
        return <span className="font-medium text-gray-900">{item.customer_name || '-'}</span>;
      case 'asset_name':
        return <span className="text-sm text-gray-900">{item.asset_name || '-'}</span>;
      case 'locations':
        return <span className="text-sm text-gray-900">{item.locations || '-'}</span>;
      case 'from_date':
        return <span>{item.from_date || '-'}</span>;
      case 'to_date':
        return <span>{item.to_date || '-'}</span>;
      case 'adjustment_factor':
        return <span className="font-medium">{item.adjustment_factor}</span>;
      case "rate":
        return <span className="font-medium">₹{item.rate}</span>;
      case "consumption":
        return <span className="font-medium">{item.consumption}</span>;
      case "total_consumption":
        return <span className="font-medium">{item.total_consumption}</span>;
      case 'amount':
        return <span className="font-medium text-gray-900">₹{item.amount}</span>;
      default:
        return (item as any)[columnKey] ?? "-";
    }
  };

  const renderActions = (item: ConsumptionRecord) => (
    <div className="flex items-center justify-center gap-1">
      {shouldShow("Utility Consumption", "update") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(item);
          }}
          className="h-8 w-8 p-0 text-[#C72030] hover:bg-[#C72030]/10 hover:text-[#C72030]"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
      {shouldShow("Utility Consumption", "show") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleView(item);
          }}
          className="h-8 w-8 p-0 text-[#C72030] hover:bg-[#C72030]/10 hover:text-[#C72030]"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Utility &gt; Calculations</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Calculations
        </h1>
      </div>

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        selectedItems={selectedItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search calculations..."
        enableSearch
        enableExport={false}
        hideColumnsButton={false}
        pagination={false}
        pageSize={pageSize}
        emptyMessage="No calculation data found"
        selectable
        storageKey="utility-consumption-table"
        loading={isLoading}
        loadingMessage="Loading..."
        onFilterClick={() => setIsFilterModalOpen(true)}
        leftActions={
          shouldShow("Utility Consumption", "create") ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/utility/utility-consumption/generate-bill')}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate New
              </Button>
            </div>
          ) : undefined
        }
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to{' '}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={`cursor-pointer ${currentPage === 1 || isLoading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => currentPage > 1 && !isLoading && fetchData(currentPage - 1)}
                />
              </PaginationItem>

              {currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink className="cursor-pointer" onClick={() => fetchData(1)} isActive={currentPage === 1}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 4 && (
                    <PaginationItem><PaginationEllipsis /></PaginationItem>
                  )}
                </>
              )}

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, currentPage - 2) + i;
                if (pageNumber > totalPages) return null;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      className="cursor-pointer"
                      onClick={() => fetchData(pageNumber)}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }).filter(Boolean)}

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <PaginationItem><PaginationEllipsis /></PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink className="cursor-pointer" onClick={() => fetchData(totalPages)} isActive={currentPage === totalPages}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  className={`cursor-pointer ${currentPage === totalPages || isLoading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => currentPage < totalPages && !isLoading && fetchData(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-white">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium text-gray-900">
                Filter
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterModalOpen(false)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Client Name
                </label>
                <Input
                  placeholder="Client Name"
                  value={filters.clientName}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                  className="h-10 rounded-md border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Meter No.
                </label>
                <Input
                  placeholder="Meter No."
                  value={filters.meterNo}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, meterNo: e.target.value }))
                  }
                  className="h-10 rounded-md border-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="px-8 py-2 h-10 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="px-8 py-2 h-10 rounded-md !bg-brand hover:!bg-brand-hover !text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UtilityConsumptionDashboard;