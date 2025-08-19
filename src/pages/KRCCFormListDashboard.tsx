
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Clock, Settings, Shield, Eye, Trash2, Plus, Filter, Download, RefreshCw } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { KRCCFormFilterDialog } from '@/components/KRCCFormFilterDialog';
import { toast } from 'sonner';
import axios from 'axios';

// Local debounce hook (kept here to avoid external dependency assumptions)
function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Define KRCC Form interface
interface KRCCForm {
  id: number;
  user: string;           // mapped from user.fullname
  user_email: string;     // mapped from user.email
  status: string;
  created_date?: string;  // created_at
  form_type?: string;     // form_details.form_type
}

interface ApiKRCCFormRecord {
  id: number;
  status: string;
  created_at: string;
  form_details?: { form_type?: string } & Record<string, any>;
  user?: { fullname?: string; email?: string };
}

interface KRCCApiResponse {
  krcc_forms: ApiKRCCFormRecord[];
  pagination?: { current_page: number; total_count: number; total_pages: number };
}

export const KRCCFormListDashboard = () => {
  const navigate = useNavigate();

  // Remote data state
  const [krccForms, setKrccForms] = useState<KRCCForm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [statusFilter] = useState<string>('Pending'); // As per requirement always using Pending for now
  const pageSize = 20; // API default (in sample it's 20 records)
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // Filter values from modal (email/circle)
  const [filterEmail, setFilterEmail] = useState<string>('');
  const [filterCircle, setFilterCircle] = useState<string>('');

  // KPI cards (Approved/Pending/Rejected derived from current page; total forms from API pagination total_count)
  const cardData = [
    {
      title: 'Total Forms',
      count: totalCount || krccForms.length,
      icon: Users
    },
    {
      title: 'Approved (page)',
      count: krccForms.filter(f => f.status?.toLowerCase() === 'approved').length,
      icon: UserCheck
    },
    {
      title: 'Pending (page)',
      count: krccForms.filter(f => f.status?.toLowerCase() === 'pending').length,
      icon: Clock
    },
    {
      title: 'Rejected (page)',
      count: krccForms.filter(f => f.status?.toLowerCase() === 'rejected').length,
      icon: Shield
    }
  ];
  // Fetch data from API
  const fetchKRCCForms = useCallback(async (page: number, searchValue?: string) => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      setError('Missing base URL or token');
      toast.error('Missing base URL or token');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const trimmed = (searchValue || '').trim();
      const emailMatch = trimmed.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      const cleanedSearch = emailMatch ? emailMatch[0] : trimmed;
      const searchActive = !!cleanedSearch;

      // Build base
      let url = `https://${baseUrl}/krcc_forms.json?approval=yes&page=${page}`;

      // Email param priority: explicit search box else filter email
      const effectiveEmail = searchActive ? cleanedSearch : (filterEmail || '').trim();
      const effectiveCircle = (filterCircle || '').trim();

      if (effectiveEmail) {
        url += `&q[user_email_cont]=${encodeURIComponent(effectiveEmail)}`;
      }
      if (effectiveCircle) {
        url += `&q[user_lock_user_permissions_circle_name_cont]=${encodeURIComponent(effectiveCircle)}`;
      }
      if (!effectiveEmail && !effectiveCircle) {
        url += `&status=${encodeURIComponent(statusFilter)}`; // default status filter only when no field filters
      }

      console.debug('[KRCC] Fetch URL:', url);

      let res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

      // Fallback to legacy param for email if needed
      if (searchActive && res.ok && effectiveEmail) {
        const firstPayload = await res.clone().json();
        if ((firstPayload.krcc_forms?.length ?? 0) === 0 && cleanedSearch.includes('@')) {
          const fallbackUrl = `https://${baseUrl}/krcc_forms.json?approval=yes&q[email_cont]=${encodeURIComponent(cleanedSearch)}&page=1`;
            res = await fetch(fallbackUrl, { headers: { Authorization: `Bearer ${token}` } });
        }
      }

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data: KRCCApiResponse = await res.json();
      const mapped: KRCCForm[] = (data.krcc_forms || []).map(item => ({
        id: item.id,
        status: item.status,
        user: item.user?.fullname || 'Unknown',
        user_email: item.user?.email || '-',
        created_date: item.created_at?.split('T')[0],
        form_type: item.form_details?.form_type,
      }));
      setKrccForms(mapped);
      if (data.pagination) {
        setCurrentPage(data.pagination.current_page);
        setTotalPages(data.pagination.total_pages);
        setTotalCount(data.pagination.total_count);
      } else {
        setTotalPages(1);
        setTotalCount(mapped.length);
      }
  if (searchActive && mapped.length === 0) {
        toast.info('No results found');
      }
    } catch (e: any) {
      console.error('KRCC fetch error', e);
      setError(e.message || 'Failed to load KRCC forms');
      toast.error('Failed to load KRCC forms');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, filterEmail, filterCircle]);

  // Reset to first page when search changes (debounced)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchKRCCForms(currentPage, debouncedSearch);
  }, [fetchKRCCForms, currentPage, debouncedSearch]);

  const handleRefresh = () => fetchKRCCForms(currentPage, debouncedSearch);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  // Build pagination items similar to M-Safe dashboard
  const paginationItems = React.useMemo(() => {
    const items: React.ReactNode[] = [];
    if (totalPages <= 1) return items;
    const pushPage = (p: number) => {
      items.push(
        <PaginationItem key={p}>
          <PaginationLink className='cursor-pointer' isActive={currentPage === p} onClick={() => handlePageChange(p)}>
            {p}
          </PaginationLink>
        </PaginationItem>
      );
    };
    const pushEllipsis = (key: string) => items.push(<PaginationItem key={key}><PaginationEllipsis /></PaginationItem>);
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pushPage(i);
    } else {
      pushPage(1);
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) pushPage(i);
        pushEllipsis('e1');
      } else if (currentPage >= totalPages - 2) {
        pushEllipsis('e1');
        for (let i = totalPages - 3; i < totalPages; i++) pushPage(i);
      } else {
        pushEllipsis('e1');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pushPage(i);
        pushEllipsis('e2');
      }
      pushPage(totalPages);
    }
    return items;
  }, [currentPage, totalPages]);


  const getStatusBadge = (status: string) => {
    if (!status) {
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
    }
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{status}</Badge>;
    }
  };

  const columns: ColumnConfig[] = [{
    key: 'action',
    label: 'Action',
    sortable: false,
    hideable: true
  }, {
    key: 'user',
    label: 'User',
    sortable: true,
    hideable: true
  }, {
    key: 'user_email',
    label: 'User Email',
    sortable: true,
    hideable: true
  }, {
    key: 'status',
    label: 'Status',
    sortable: true,
    hideable: true
  }, {
    key: 'delete',
    label: 'Delete',
    sortable: false,
    hideable: true
  }];

  const renderCell = (form: KRCCForm, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case 'action':
        return (
          <div className="flex justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/maintenance/krcc-list/${form.id}`)}
              className="h-8 w-8 p-0"
              title="View Form"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Download form:', form.id)}
              className="h-8 w-8 p-0"
              title="Download Form"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'user':
        return form.user;
      case 'user_email':
        return form.user_email;
      case 'status':
        return getStatusBadge(form.status);
      case 'delete':
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(form.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        const value = form[columnKey as keyof KRCCForm];
        return value?.toString() || '';
    }
  };

  const handleDelete = (formId: number) => {
    if (window.confirm('Are you sure you want to delete this KRCC form?')) {
      setKrccForms(prevForms => prevForms.filter(form => form.id !== formId));
      toast.success('KRCC form deleted successfully');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(krccForms.map(form => form.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleActionClick = () => {
    setShowActionPanel(true);
  };

  const handleExport = async () => {
    console.log('Exporting selected KRCC forms:', selectedItems);
    // Implement export logic here
  };

  const handleFiltersClick = () => {
    setIsFilterDialogOpen(true);
  };

  const handleApplyFilters = (filters: { email?: string; circle?: string }) => {
    setFilterEmail(filters.email || '');
    setFilterCircle(filters.circle || '');
    // Clear search so circle/email filters are visible in payload even if user previously searched
    setSearchTerm('');
    setCurrentPage(1);
    toast.success('Filters applied');
  };

  return (
    <>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54] rounded-full">
                <card.icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {card.count}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  {card.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showActionPanel && (
          <SelectionPanel
            actions={[
              { label: 'Export Selected', icon: Plus, onClick: handleExport },
            ]}
            onClearSelection={() => setShowActionPanel(false)}
          />
        )}

        <div className="rounded-lg">
          {error && (
            <div className="mb-4 p-3 border border-red-300 text-red-600 rounded bg-red-50 text-sm">{error}</div>
          )}
          <EnhancedTable
            data={krccForms || []}
            // leftActions={
            //   <Button
            //     onClick={handleActionClick}
            //     className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
            //   >
            //     <Plus className="w-4 h-4" />
            //     Action
            //   </Button>
            // }
            columns={columns}
            onFilterClick={handleFiltersClick}
            renderCell={renderCell}
            onSelectAll={handleSelectAll}
            storageKey="krcc-forms"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search..."
            handleExport={handleExport}
            enableExport={true}
            exportFileName="krcc-forms"
            pagination={false} // using server-side pagination below
            loading={loading}
            enableSearch={true}
            onRowClick={form => console.log('Row clicked:', form)}
          />
          {!loading && totalPages > 1 && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <div className="text-sm text-gray-600">Page {currentPage} of {totalPages} | Total {totalCount}</div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious className='cursor-pointer' onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                  {paginationItems}
                  <PaginationItem>
                    <PaginationNext className='cursor-pointer' onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                  {/* <PaginationItem>
                    <Button variant="outline" size="sm" onClick={handleRefresh} title="Refresh" disabled={loading}>
                      <RefreshCw className={"w-4 h-4" + (loading ? ' animate-spin' : '')} />
                    </Button>
                  </PaginationItem> */}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        <KRCCFormFilterDialog
          isOpen={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </>
  );
};
