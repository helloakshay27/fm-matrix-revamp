import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Clock, Settings, CheckCircle, AlertTriangle, XCircle, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { toast } from 'sonner';
import StatusDropdown from '@/components/StatusDropdown';
import AssetAuditFilterModal, { FilterParams } from '@/components/AssetAuditFilterModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface AuditRecord {
  id: number;
  auditName: string;
  auditId: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  conductedBy: string;
  report: boolean;
}

const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Actions', sortable: false, defaultVisible: true },
  { key: 'auditName', label: 'Audit Name', sortable: true, defaultVisible: true },
  { key: 'auditId', label: 'Audit ID', sortable: true, defaultVisible: true },
  { key: 'type', label: 'Type', sortable: true, defaultVisible: true },
  { key: 'startDate', label: 'Start Date', sortable: true, defaultVisible: true },
  { key: 'endDate', label: 'End Date', sortable: true, defaultVisible: true },
  { key: 'status', label: 'Audit Status', sortable: true, defaultVisible: true },
  { key: 'conductedBy', label: 'Conducted By', sortable: true, defaultVisible: true },
  { key: 'report', label: 'Report', sortable: false, defaultVisible: true },
];

// Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to normalize status from API to display
const normalizeStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'scheduled': 'Scheduled',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'overdue': 'Overdue',
    'closed': 'Closed'
  };
  return statusMap[status.toLowerCase()] || status;
};

// Helper function to convert display status back to API format
const convertStatusToApi = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'scheduled': 'scheduled',
    'in progress': 'in_progress',
    'completed': 'completed',
    'overdue': 'overdue',
    'closed': 'closed'
  };
  return statusMap[status.toLowerCase()] || status.toLowerCase().replace(/\s+/g, '_');
};

export const AssetAuditDashboard = () => {
  const navigate = useNavigate();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    closed: 0
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterParams>({});
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');

  // Fetch data from API
  const fetchAudits = async (page: number = 1, filters: FilterParams = {}, statusFilter: string = '') => {
    try {
      setLoading(true);
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));

      // Add status filter if provided
      if (statusFilter) {
        queryParams.append('q[status_eq]', statusFilter);
      }

      // Add filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value) && value.length > 0) {
            // For array parameters, use the format q[field_name][]=value
            value.forEach(v => queryParams.append(`q[${key}][]`, v));
          } else if (!Array.isArray(value)) {
            // For single value parameters, use the format q[field_name]=value
            queryParams.append(`q[${key}]`, String(value));
          }
        }
      });

      console.log('Fetching audits with params:', queryParams.toString());

      const response = await fetch(`https://${baseUrl}/pms/asset_audits.json?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audits');
      }

      const data = await response.json();

      // Map API response to AuditRecord format
      const mappedAudits: AuditRecord[] = data.audits.map((audit: any) => ({
        id: audit.id,
        auditName: audit.name,
        auditId: String(audit.id),
        type: audit.audit_type || '',
        startDate: formatDate(audit.start_date),
        endDate: formatDate(audit.end_date),
        status: normalizeStatus(audit.status),
        conductedBy: audit.conducted_by || '',
        report: true // Assuming all audits have reports
      }));

      setAudits(mappedAudits);

      // Initialize selectedStatus with current statuses
      const initialStatuses: { [key: string]: string } = {};
      mappedAudits.forEach(audit => {
        initialStatuses[audit.id] = convertStatusToApi(audit.status);
      });
      setSelectedStatus(initialStatuses);

      // Set stats from API response
      setStats({
        scheduled: data.scheduled_count || 0,
        inProgress: data.in_progress_count || 0,
        completed: data.completed_count || 0,
        overdue: data.overdue_count || 0,
        closed: data.closed_count || 0
      });

      // Set pagination from API response
      setPagination({
        current_page: data.pagination?.current_page || page,
        total_count: data.pagination?.total_count || 0,
        total_pages: data.pagination?.total_pages || 1
      });
    } catch (error) {
      console.error('Error fetching audits:', error);
      // Optionally set empty state or show error message
      setAudits([]);
      toast.error('Failed to fetch audits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits(currentPage, appliedFilters, selectedStatusFilter);
  }, [currentPage, appliedFilters, selectedStatusFilter]);

  const handleStatusUpdate = async (newStatus: string, auditId: number) => {
    // Store previous status for rollback
    const previousStatus = selectedStatus[auditId] || convertStatusToApi(audits.find(a => a.id === auditId)?.status || 'scheduled');

    // Optimistic update
    setSelectedStatus((prev) => ({
      ...prev,
      [auditId]: newStatus,
    }));

    setAudits((prevAudits) =>
      prevAudits.map((audit) =>
        audit.id === auditId ? { ...audit, status: normalizeStatus(newStatus) } : audit
      )
    );

    const body = {
      pms_asset_audit: {
        status: newStatus,
      },
    };

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/asset_audits/${auditId}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Audit status updated successfully!');

      // Refetch to update stats
      fetchAudits(currentPage, appliedFilters, selectedStatusFilter);
    } catch (err) {
      console.error('Error updating status:', err);

      // Rollback on error
      setSelectedStatus((prev) => ({
        ...prev,
        [auditId]: previousStatus,
      }));

      setAudits((prevAudits) =>
        prevAudits.map((audit) =>
          audit.id === auditId ? { ...audit, status: normalizeStatus(previousStatus) } : audit
        )
      );

      toast.error('Failed to update audit status');
    }
  };

  const handleAddClick = () => {
    navigate('/maintenance/audit/assets/add');
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = (filters: FilterParams) => {
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleCardClick = (status: string) => {
    // If clicking the same status, clear the filter
    if (selectedStatusFilter === status) {
      setSelectedStatusFilter('');
    } else {
      setSelectedStatusFilter(status);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleAuditNameClick = (auditId: string) => {
    navigate(`/maintenance/audit/assets/details/${auditId}`);
  };

  const handleDownloadReport = async (auditId: string, status: string) => {
    // Only allow download for completed or closed audits
    if (!['Completed', 'Closed'].includes(status)) {
      toast.error('Report is only available for Completed or Closed audits');
      return;
    }

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/asset_audits/${auditId}/audited_pdf_report`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Audit_Report_${auditId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download the report');
    }
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'Scheduled': return 'bg-blue-500';
  //     case 'In Progress': return 'bg-orange-500';
  //     case 'Completed': return 'bg-green-500';
  //     case 'Overdue': return 'bg-red-500';
  //     case 'Closed': return 'bg-gray-500';
  //     default: return 'bg-gray-500';
  //   }
  // };
  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled', color: '#C4B89D' },
    { value: 'in_progress', label: 'In Progress', color: '#F4C790' },
    { value: 'completed', label: 'Completed', color: '#AAB9C5' },
    { value: 'overdue', label: 'Overdue', color: '#E4626F' },
    { value: 'closed', label: 'Closed', color: '#bbf7d0' },
  ];

  const getStatusStyle = (status: string): React.CSSProperties => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
    const statusMap: { [key: string]: string } = {
      'scheduled': '#C4B89D',
      'in_progress': '#F4C790',
      'completed': '#AAB9C5',
      'overdue': '#E4626F',
      'closed': '#bbf7d0',
    };
    const color = statusMap[normalizedStatus];
    return {
      backgroundColor: color,
      color: '#000',
      border: 'none',
    };
  };


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(audits.map(item => String(item.id)));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleBulkDelete = (selectedItems: AuditRecord[]) => {
    const selectedIds = selectedItems.map(item => item.id);
    setAudits(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedItems([]);
  };

  const renderCell = (item: AuditRecord, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAuditNameClick(item.auditId);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        );
      case 'auditName':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAuditNameClick(item.auditId);
            }}
            className="text-black hover:underline font-medium"
          >
            {item.auditName}
          </button>
        );
      case 'auditId':
        return item.auditId;
      case 'type':
        return item.type || '-';
      case 'startDate':
        return item.startDate;
      case 'endDate':
        return item.endDate;
      // case 'status':
      //   return (
      //     <div className="min-w-[120px]">
      //       <Select
      //         value={item.status}
      //         onValueChange={(value) => handleStatusUpdate(item.id, value)}
      //       >
      //         <SelectTrigger
      //           className={`w-full md:w-32 text-white px-3 py-1.5 text-sm rounded-md truncate ${getStatusColor(item.status)}`}
      //         >
      //           <SelectValue />
      //         </SelectTrigger>
      //         <SelectContent>
      //           <SelectItem value="Scheduled">Scheduled</SelectItem>
      //           <SelectItem value="In Progress">In Progress</SelectItem>
      //           <SelectItem value="Completed">Completed</SelectItem>
      //           <SelectItem value="Overdue">Overdue</SelectItem>
      //           <SelectItem value="Closed">Closed</SelectItem>
      //         </SelectContent>
      //       </Select>
      //     </div>
      //   );
      // case 'conductedBy':

      case 'status':
        return (
          <div className="min-w-[140px]">
            <StatusDropdown
              data={item}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusUpdate}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
              statusOptions={statusOptions}
              getStatusStyle={getStatusStyle}
            />
          </div>
        );
      case 'conductedBy':
        return item.conductedBy;
      case 'report':
        return ['Completed', 'Closed'].includes(item.status) ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadReport(item.auditId, item.status);
            }}
          >
            <Download className="w-4 h-4" />
          </Button>
        ) : '-';
      default:
        return '-';
    }
  };

  // Pagination handlers
  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }

    try {
      setPagination((prev) => ({ ...prev, current_page: page }));
      setCurrentPage(page);
      await fetchAudits(page, appliedFilters, selectedStatusFilter);
    } catch (error) {
      console.error('Error changing page:', error);
      toast.error('Failed to load page data. Please try again.');
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPageState = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPageState === 1}
            aria-disabled={loading}
            className={loading ? 'pointer-events-none opacity-50' : ''}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPageState > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPageState === i}
                aria-disabled={loading}
                className={loading ? 'pointer-events-none opacity-50' : ''}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPageState > 3 && currentPageState < totalPages - 2) {
        for (let i = currentPageState - 1; i <= currentPageState + 1; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPageState === i}
                aria-disabled={loading}
                className={loading ? 'pointer-events-none opacity-50' : ''}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPageState < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item: any) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPageState === i}
                  aria-disabled={loading}
                  className={loading ? 'pointer-events-none opacity-50' : ''}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPageState === totalPages}
              aria-disabled={loading}
              className={loading ? 'pointer-events-none opacity-50' : ''}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPageState === i}
              aria-disabled={loading}
              className={loading ? 'pointer-events-none opacity-50' : ''}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: handleBulkDelete,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">AUDIT LIST</h1>

        {/* Statistics Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading audits...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
              <div
                className={`bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] cursor-pointer transition-all hover:shadow-lg ${selectedStatusFilter === 'scheduled' ? 'ring-2 ring-[#D92818] ring-offset-2' : ''
                  }`}
                onClick={() => handleCardClick('scheduled')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#D92818]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{stats.scheduled}</span>
                    <span className="font-medium text-sm text-black">Scheduled</span>
                  </div>
                </div>
              </div>

              <div
                className={`bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] cursor-pointer transition-all hover:shadow-lg ${selectedStatusFilter === 'in_progress' ? 'ring-2 ring-[#D92818] ring-offset-2' : ''
                  }`}
                onClick={() => handleCardClick('in_progress')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-[#D92818]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{stats.inProgress}</span>
                    <span className="font-medium text-sm text-black">In Progress</span>
                  </div>
                </div>
              </div>

              <div
                className={`bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] cursor-pointer transition-all hover:shadow-lg ${selectedStatusFilter === 'completed' ? 'ring-2 ring-[#D92818] ring-offset-2' : ''
                  }`}
                onClick={() => handleCardClick('completed')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#D92818]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{stats.completed}</span>
                    <span className="font-medium text-sm text-black">Completed</span>
                  </div>
                </div>
              </div>

              <div
                className={`bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] cursor-pointer transition-all hover:shadow-lg ${selectedStatusFilter === 'overdue' ? 'ring-2 ring-[#D92818] ring-offset-2' : ''
                  }`}
                onClick={() => handleCardClick('overdue')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-[#D92818]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{stats.overdue}</span>
                    <span className="font-medium text-sm text-black">Overdue</span>
                  </div>
                </div>
              </div>

              <div
                className={`bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] cursor-pointer transition-all hover:shadow-lg ${selectedStatusFilter === 'closed' ? 'ring-2 ring-[#D92818] ring-offset-2' : ''
                  }`}
                onClick={() => handleCardClick('closed')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-[#D92818]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{stats.closed}</span>
                    <span className="font-medium text-sm text-black">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Table */}
            <EnhancedTable
              data={audits}
              columns={columns}
              renderCell={renderCell}


              storageKey="asset-audit-dashboard-table"
              emptyMessage="No audit records found"
              searchPlaceholder="Search audits..."
              enableExport={true}
              exportFileName="audit-records"
              bulkActions={bulkActions}
              showBulkActions={true}
              pagination={true}
              pageSize={10}
              onFilterClick={handleFilterClick}
              leftActions={
                <Button
                  onClick={handleAddClick}
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Action Audit
                </Button>
              }
            />

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                      className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                      className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}

        {/* Filter Modal */}
        <AssetAuditFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={appliedFilters}
        />
      </div>
    </div>
  );
};


