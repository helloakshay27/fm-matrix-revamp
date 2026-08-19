import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Search, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GRNFilterDialog } from "@/components/GRNFilterDialog";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppDispatch } from '@/store/hooks';
import { getGRN } from '@/store/slices/grnSlice';
import { cache } from '@/utils/cacheUtils';
import { buildReturnToPath } from '@/utils/listBackNavigation';

const CACHE_TTL = 5 * 60 * 1000;
const STALE_TTL = 30 * 60 * 1000;
const CACHE_PREFIX = 'grn';

const buildCacheKey = (siteId: string, page: number, params: Record<string, any>) => {
  const { grn_number = '', po_number = '', supplier_name = '', approval_status = '', search = '' } = params;
  return `${CACHE_PREFIX}_site${siteId}_p${page}_grn${grn_number}_po${po_number}_sup${supplier_name}_status${approval_status}_q${search}`;
};

export const GRNDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const urlParams = new URLSearchParams(location.search);
  const urlPage = Number(urlParams.get('page')) || 1;
  const initialSearch = urlParams.get('search') || '';
  const initialFilters = {
    grnNumber: urlParams.get('grn_number') || '',
    poNumber: urlParams.get('po_number') || '',
    supplierName: urlParams.get('supplier_name') || '',
    status: urlParams.get('approval_status') || '',
  };

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [grnData, setGrnData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current_page: urlPage,
    total_count: 0,
    total_pages: 0,
  });

  const bgRefreshingRef = useRef(false);
  const currentSiteRef = useRef(localStorage.getItem('selectedSiteId') || '');

  const applyResponse = (response: any) => {
    setGrnData(response.grns ?? response.data ?? []);
    if (response.pagination) {
      setPagination(prev => ({
        ...prev,
        total_count: response.pagination.total_count,
        total_pages: response.pagination.total_pages,
      }));
    }
  };

  const filtersToApiParams = (f: typeof appliedFilters) => ({
    grn_number: f.grnNumber,
    po_number: f.poNumber,
    supplier_name: f.supplierName,
    approval_status: f.status,
  });

  const fetchData = async (page: number = 1, filterOverrides: Record<string, any> = {}) => {
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const params = {
      ...filtersToApiParams(appliedFilters),
      search: searchQuery,
      ...filterOverrides,
    };
    const cacheKey = buildCacheKey(siteId, page, params);

    const fresh = cache.get<any>(cacheKey, CACHE_TTL);
    if (fresh) { applyResponse(fresh); return; }

    const stale = cache.get<any>(cacheKey, STALE_TTL);
    if (stale) {
      applyResponse(stale);
      if (!bgRefreshingRef.current) {
        bgRefreshingRef.current = true;
        dispatch(getGRN({ baseUrl, token, page, ...params }))
          .unwrap()
          .then(res => { cache.set(cacheKey, res, CACHE_TTL); applyResponse(res); })
          .catch(console.error)
          .finally(() => { bgRefreshingRef.current = false; });
      }
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(getGRN({ baseUrl, token, page, ...params })).unwrap();
      cache.set(cacheKey, response, CACHE_TTL);
      applyResponse(response);
    } catch (error) {
      console.log(error);
      toast.error('Failed to load GRN data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(urlPage);
  }, [urlPage]);

  // Invalidate cache and refetch on site change
  useEffect(() => {
    const interval = setInterval(() => {
      const newSiteId = localStorage.getItem('selectedSiteId') || '';
      if (newSiteId !== currentSiteRef.current) {
        currentSiteRef.current = newSiteId;
        cache.invalidatePattern(`${CACHE_PREFIX}*`);
        fetchData(1);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Sync URL when page/filters/search change
  useEffect(() => {
    const params = new URLSearchParams();
    if (pagination.current_page > 1) params.set('page', pagination.current_page.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (appliedFilters.grnNumber) params.set('grn_number', appliedFilters.grnNumber);
    if (appliedFilters.poNumber) params.set('po_number', appliedFilters.poNumber);
    if (appliedFilters.supplierName) params.set('supplier_name', appliedFilters.supplierName);
    if (appliedFilters.status) params.set('approval_status', appliedFilters.status);
    navigate({ search: params.toString() }, { replace: true });
  }, [pagination.current_page, searchQuery, appliedFilters, navigate]);

  const handleFilterApply = (filters: typeof appliedFilters) => {
    cache.invalidatePattern(`${CACHE_PREFIX}*`);
    setAppliedFilters(filters);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchData(1, filtersToApiParams(filters));
    toast.success('Filters applied');
  };

  const handleSearch = () => {
    cache.invalidatePattern(`${CACHE_PREFIX}*`);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchData(1, { search: searchQuery });
  };

  const handleReset = () => {
    cache.invalidatePattern(`${CACHE_PREFIX}*`);
    const empty = { grnNumber: '', poNumber: '', supplierName: '', status: '' };
    setSearchQuery('');
    setAppliedFilters(empty);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchData(1, { search: '', ...filtersToApiParams(empty) });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) return;
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) return null;
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>{1}</PaginationLink>
        </PaginationItem>
      );
      if (currentPage > 4) {
        items.push(<PaginationItem key="e1"><PaginationEllipsis /></PaginationItem>);
      }
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>{i}</PaginationLink>
          </PaginationItem>
        );
      }
      if (currentPage < totalPages - 3) {
        items.push(<PaginationItem key="e2"><PaginationEllipsis /></PaginationItem>);
      }
      items.push(
        <PaginationItem key={totalPages} className="cursor-pointer">
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>{i}</PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <div className="p-6">
      <div className="mb-4 text-sm text-gray-600">GRN / SRN</div>
      <h1 className="text-2xl font-bold mb-6">GRN LIST</h1>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => navigate('/finance/grn-srn/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
          <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Supplier, PO Number, or GRN Number"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent w-80"
            />
          </div>
          <Button className="bg-[#C72030] hover:bg-[#A01020] text-white px-4" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outline" className="px-4" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">GRN Number</TableHead>
              <TableHead className="font-semibold">PO Number</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">GRN Date</TableHead>
              <TableHead className="font-semibold">GRN Qty</TableHead>
              <TableHead className="font-semibold">GRN Amount</TableHead>
              <TableHead className="font-semibold">Approval Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">Loading...</TableCell>
              </TableRow>
            ) : grnData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">No GRN records found.</TableCell>
              </TableRow>
            ) : (
              grnData.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1"
                      onClick={() => navigate(`/finance/grn-srn/details/${item.id}`, {
                        state: { returnTo: buildReturnToPath(location.pathname, location.search) },
                      })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-blue-600 cursor-pointer hover:underline">{item.external_id || '—'}</TableCell>
                  <TableCell>{item.po_number || item.pms_purchase_order?.external_id || '—'}</TableCell>
                  <TableCell>{item.supplier_name || item.pms_supplier?.company_name || '—'}</TableCell>
                  <TableCell>{item.grn_date || item.created_at?.split('T')[0] || '—'}</TableCell>
                  <TableCell>{item.total_quantity ?? '—'}</TableCell>
                  <TableCell>{item.total_amount ?? '—'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.approve_status)}`}>
                      {item.approve_status || '—'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Total: {pagination.total_count} records
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <GRNFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={appliedFilters}
        setFilters={setAppliedFilters}
        onApplyFilters={handleFilterApply}
      />
    </div>
  );
};
