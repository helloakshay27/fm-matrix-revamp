import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Clock, Settings, Shield, UserPlus, Search, Filter, Download, RefreshCw, Eye, Trash2, Plus, UploadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchFMUsers, FMUser } from '@/store/slices/fmUserSlice';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { MSafeImportModal } from '@/components/MSafeImportModal';
// Replacing basic filter dialog with advanced FMUserFilterDialog
import { FMUserFilterDialog } from '@/components/FMUserFilterDialog';
import { toast } from 'sonner';
import axios from 'axios';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { useDebounce } from '@/hooks/useDebounce';


interface ApiPagination { current_page: number; total_pages: number; total_count: number }

export const MSafeDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [fmUsers, setFmUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({ firstname: '', lastname: '', email: '', mobile: '', cluster: '', cluster_id: '', circle: '', department: '', role: '', report_to_id: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ApiPagination>({ current_page: 1, total_pages: 1, total_count: 0 });


  const cardData = [
    {
      title: "User Management",
      count: fmUsers?.length || 0,
      icon: Users
    },
    {
      title: "Active Users",
      count: fmUsers?.filter(user => user.status === 'approved').length || 0,
      icon: UserCheck
    },
    {
      title: "Pending Approvals",
      count: fmUsers?.filter(user => user.status === 'pending').length || 0,
      icon: Clock
    },
    {
      title: "System Settings",
      count: 12,
      icon: Settings
    }
  ];


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) {
          setFmUsers([]);
          setLoading(false);
          return;
        }
        let url = `https://${baseUrl}/pms/users/fte_users.json?page=${page}`;
        const hasFilters = Object.values(filters).some(v => v && v !== '');
        if (hasFilters) {
          const params: string[] = [];
          if (filters.firstname) params.push(`q[firstname_cont]=${encodeURIComponent(filters.firstname.trim())}`);
          if (filters.lastname) params.push(`q[lastname_cont]=${encodeURIComponent(filters.lastname.trim())}`);
          if (filters.email) params.push(`q[email_cont]=${encodeURIComponent(filters.email)}`);
          // prefer explicit mobile param
          if (filters.mobile) params.push(`q[mobile_cont]=${encodeURIComponent(filters.mobile)}`);
          // Prefer exact cluster id match when available; fallback to name contains
          if (filters.cluster_id) {
            params.push(`q[company_cluster_id_eq]=${encodeURIComponent(String(filters.cluster_id))}`);
          } else if (filters.cluster) {
            params.push(`q[company_cluster_cluster_name_cont]=${encodeURIComponent(filters.cluster)}`);
          }
          if (filters.circle) params.push(`q[lock_user_permissions_circle_name_cont]=${encodeURIComponent(filters.circle)}`);
          if (filters.department) params.push(`q[lock_user_permissions_pms_department_department_name_cont]=${encodeURIComponent(filters.department)}`);
          if (filters.role) params.push(`q[lock_user_permissions_lock_role_name_cont]=${encodeURIComponent(filters.role)}`);
          if (filters.report_to_id) params.push(`q[report_to_email_cont]=${encodeURIComponent(filters.report_to_id)}`);
          if (params.length) url += `&${params.join('&')}`;
        } else {
          const emailQuery = debouncedSearch.trim();
          if (emailQuery) {
            url += `&q[email_cont]=${encodeURIComponent(emailQuery)}`;
          }
        }
        const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = response.data;
        const users = Array.isArray(data.users) ? data.users : (Array.isArray(data) ? data : data.users || []);
        setFmUsers(users);
        if (data.pagination) {
          setPagination({
            current_page: data.pagination.current_page,
            total_pages: data.pagination.total_pages,
            total_count: data.pagination.total_count,
          });
        } else {
          setPagination({ current_page: page, total_pages: 1, total_count: users.length });
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setFmUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, debouncedSearch, filters]);

  // Reset to first page only when search/filters values actually change (not on page clicks)
  const prevSearchRef = useRef<string>('');
  const prevFiltersRef = useRef<typeof filters>(filters);
  useEffect(() => {
    const hasFilters = Object.values(filters).some(v => v && v !== '');
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);
    const searchChanged = debouncedSearch !== prevSearchRef.current;
    if ((searchChanged && debouncedSearch) || (filtersChanged && hasFilters)) {
      setPage(1);
    }
    prevSearchRef.current = debouncedSearch;
    prevFiltersRef.current = filters;
  }, [debouncedSearch, filters]);
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
  const getTypeBadge = (type: string) => {
    if (!type) {
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
    }
    switch (type.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Admin</Badge>;
      case 'site':
        return <Badge className="bg-purple-500 text-white hover:bg-purple-600">Site</Badge>;
      case 'company':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Company</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{type}</Badge>;
    }
  };
  const getYesNoBadge = (value: boolean | string) => {
    const isYes = value === true || value === 'yes' || value === 'Yes';
    return <Badge className={isYes ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"}>
      {isYes ? 'Yes' : 'No'}
    </Badge>;
  };
  const columns: ColumnConfig[] = [
    { key: 'name', label: 'Name', sortable: true, hideable: true },
    { key: 'org_user_id', label: 'Emp ID', sortable: true, hideable: true },
    { key: 'email', label: 'Email', sortable: true, hideable: true },
    { key: 'mobile', label: 'Mobile', sortable: true, hideable: true },
    { key: 'gender', label: 'Gender', sortable: true, hideable: true },
    { key: 'active', label: 'Active', sortable: true, hideable: true },
    { key: 'birth_date', label: 'Birth Date', sortable: true, hideable: true },
    { key: 'joining_date', label: 'Joining Date', sortable: true, hideable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true },
    { key: 'cluster_name', label: 'Cluster', sortable: true, hideable: true },
    { key: 'department_name', label: 'Department', sortable: true, hideable: true },
    { key: 'circle_name', label: 'Circle', sortable: true, hideable: true },
    { key: 'work_location', label: 'Work Location', sortable: true, hideable: true },
    { key: 'company_name', label: 'Company Name', sortable: true, hideable: true },
    { key: 'role_name', label: 'Role', sortable: true, hideable: true },
    { key: 'employee_type', label: 'Employee Type', sortable: true, hideable: true },
    { key: 'created_at', label: 'Created At', sortable: true, hideable: true },
    { key: 'line_manager_name', label: 'Line Manager Name', sortable: false, hideable: true },
    { key: 'line_manager_email', label: 'Line Manager Email', sortable: false, hideable: true },
    { key: 'line_manager_mobile', label: 'Line Manager Mobile', sortable: false, hideable: true },
  ];

  const handleToggleActive = (user: any) => {
    setFmUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id
          ? { ...u, active: !u.active }
          : u
      )
    );
  };

  const renderCell = (user: any, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case 'name':
        return `${user.firstname || ''} ${user.lastname || ''}`.trim() || '-';
      case 'org_user_id':
        return user.org_user_id || user.lock_user_permission?.employee_id || user.employee_id || '-';
      case 'email':
        return user.email || '-';
      case 'mobile':
        return user.mobile || '-';
      case 'gender':
        return user.gender || '-';
      case 'active': {
        const isActive = user.lock_role && typeof user.lock_role.active !== 'undefined' ? user.lock_role.active === 1 : !!user.active;
        return (
          <div className="flex justify-center text-sm font-medium">
            {String(isActive)}
          </div>
        );
      }
      case 'birth_date':
        return user.birth_date || '-';
      case 'joining_date':
        return user.lock_user_permission?.joining_date || user.joining_date || '-';
      case 'status': {
        const statusVal = user.lock_user_permission?.status || user.status;
        return statusVal ? getStatusBadge(statusVal) : '-';
      }
      case 'cluster_name':
        return user.cluster_name || '-';
      case 'department_name':
        return user.lock_user_permission?.department_name || user.department_name || '-';
      case 'circle_name':
        return user.lock_user_permission?.circle_name || user.circle_name || '-';
      case 'work_location':
        return user.work_location || '-';
      case 'company_name':
        return user.user_company_name || '-';
      case 'role_name':
        return user.lock_user_permission?.role_name || user.role_name || user.lock_role?.name || user.lock_role?.display_name || '-';
      case 'employee_type':
        return user.employee_type || '-';
      case 'created_at':
        if (!user.created_at) return '-';
        try {
          const date = new Date(user.created_at);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch {
          return user.created_at;
        }
      case 'line_manager_name':
        return user.report_to?.name || 'NA';
      case 'line_manager_email':
        return user.report_to?.email || 'NA';
      case 'line_manager_mobile':
        return user.report_to?.mobile || 'NA';
      default:
        return '-';
    }
  };
  const renderActions = (user: FMUser) =>
  (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/maintenance/m-safe/user/${user.id}`, { state: { user } })}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(fmUsers.map(user => user.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.total_pages || newPage === page) return;
    setPage(newPage);
  };

  const paginationItems = useMemo(() => {
    const items: React.ReactNode[] = [];
    const totalPages = pagination.total_pages;
    const current = pagination.current_page;
    if (totalPages <= 1) return items;
    const pushPage = (p: number) => {
      items.push(
        <PaginationItem key={p}>
          <PaginationLink className='cursor-pointer' isActive={current === p} onClick={() => handlePageChange(p)}>
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
      if (current <= 3) {
        for (let i = 2; i <= 4; i++) pushPage(i);
        pushEllipsis('e1');
      } else if (current >= totalPages - 2) {
        pushEllipsis('e1');
        for (let i = totalPages - 3; i < totalPages; i++) pushPage(i);
      } else {
        pushEllipsis('e1');
        for (let i = current - 1; i <= current + 1; i++) pushPage(i);
        pushEllipsis('e2');
      }
      pushPage(totalPages);
    }
    return items;
  }, [pagination]);


  const handleRefresh = () => {
    dispatch(fetchFMUsers());
  };
  const handleActionClick = () => {
    setShowActionPanel(true);
  };
  const handleExport = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    try {
      if (!baseUrl || !token) {
        toast.error('Missing base URL or token');
        return;
      }

      let url = `api`;
      if (selectedItems.length > 0) {
        const ids = selectedItems.join(',');
        url += `&ids=${ids}`;
      }

      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data || response.data.size === 0) {
        toast.error('Empty file received from server');
        return;
      }

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'm-safe.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success('M-Safe data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export M-Safe data');
    }
  };


  const handleImport = (file) => {
    alert(`Imported file: ${file.name}`);
  };


  const handleFiltersClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = (newFilters: { firstname: string; lastname: string; email: string; mobile: string; cluster?: string; cluster_id?: string | number; circle?: string; department?: string; role?: string; report_to_id?: string | number }) => {
    setFilters({
      firstname: newFilters.firstname || '',
      lastname: newFilters.lastname || '',
      email: newFilters.email || '',
      mobile: newFilters.mobile || '',
      cluster: newFilters.cluster || '',
      cluster_id: newFilters.cluster_id ? String(newFilters.cluster_id) : '',
      circle: newFilters.circle || '',
      department: newFilters.department || '',
      role: newFilters.role || '',
      report_to_id: newFilters.report_to_id ? String(newFilters.report_to_id) : ''
    });
    // If all filters are cleared, also clear search to truly reset table
    if (!(newFilters.firstname || newFilters.lastname || newFilters.email || newFilters.mobile || newFilters.cluster || newFilters.cluster_id || newFilters.circle || newFilters.department || newFilters.role || newFilters.report_to_id)) {
      setSearchTerm('');
    }
  };


  return (
    <>
      <div className="p-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div> */}

        {showActionPanel && (
          <SelectionPanel
            actions={[
              { label: 'Import', icon: UploadIcon, onClick: () => setImportModalOpen(true) },
            ]}
            onClearSelection={() => setShowActionPanel(false)}
          />
        )}

        <div className="rounded-lg">
          <EnhancedTable data={fmUsers || []} columns={columns} onFilterClick={handleFiltersClick}
            renderCell={renderCell} renderActions={renderActions} onSelectAll={handleSelectAll} storageKey="msafe-fm-users" searchTerm={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search..." handleExport={handleExport} exportFileName="fm-users" pagination={false} pageSize={10} loading={loading} enableSearch={true} onRowClick={user => console.log('Row clicked:', user)} />
          {!loading && pagination.total_pages > 1 && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <div className="text-sm text-gray-600">Page {pagination.current_page} of {pagination.total_pages} | Total {pagination.total_count}</div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious className='cursor-pointer' onClick={() => handlePageChange(page - 1)} />
                  </PaginationItem>
                  {paginationItems}
                  <PaginationItem>
                    <PaginationNext className='cursor-pointer' onClick={() => handlePageChange(page + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        <MSafeImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImport} />
        <FMUserFilterDialog isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApplyFilters={handleApplyFilters} />
      </div>
    </>
  )
};