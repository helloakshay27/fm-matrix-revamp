import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Clock, Shield, Eye, Trash2, Plus, UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { MSafeImportModal } from '@/components/MSafeImportModal';
import { toast } from 'sonner';
import axios from 'axios';
import { useDebounce } from '@/hooks/useDebounce';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { ExternalFilterDialog } from './ExternalFilterDialog';

// Define External User interface (different from FMUser)
interface ExternalUser {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  mobile: string;
  email: string;
  company_name: string;
  ext_company_name?: string; // added: external company name field
  entity_id: number;
  unit_id: number;
  designation: string;
  employee_id: string;
  created_by_id: number;
  access_level: number;
  user_type: string;
  lock_user_permission_status: string;
  face_added: boolean | string;
  app_downloaded: boolean | string;
  lock_user_permission: { id?: number; access_level: string | number; joining_date?: string; role_name?: string; circle_name?: string; department_name?: string; status?: string; employee_id?: string | number; active?: boolean; designation?: string; lock_role_id?: number; department_id?: number; circle_id?: number };
  line_manager_name?: string;
  line_manager_mobile?: string;
  department?: string;
  circle?: string;
  cluster?: string;
  active?: boolean;
  org_user_id?: string | number;
  birth_date?: string;
  joining_date?: string;
  status?: string;
  cluster_name?: string;
  work_location?: string;
  role_name?: string;
  employee_type?: string;
  created_at?: string;
  lock_role?: { active: number };
  report_to?: { name?: string; email?: string; mobile?: string };
}

interface ApiPagination { current_page: number; total_pages: number; total_count: number }

export const ExternalUsersDashboard = () => {

  const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500); // debounce like ServiceDashboard
  const [filters, setFilters] = useState({ firstname: '', lastname: '', email: '', mobile: '', cluster: '', cluster_id: '', circle: '', department: '', role: '', report_to_id: '' });
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<ExternalUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ApiPagination>({ current_page: 1, total_pages: 1, total_count: 0 });
  const navigate = useNavigate();
  const pageSize = 25; // backend default (adjust if needed)

  // Permission: show Action button only for these userIds
  const allowedActionIds = useMemo(() => new Set(['92501', '88468']), []);
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const canSeeActionButton = currentUserId ? allowedActionIds.has(String(currentUserId)) : false;


  useEffect(() => {
    const controller = new AbortController();
    const fetchExternalUsers = async () => {
      setLoading(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) {
          setExternalUsers([]);
          setLoading(false);
          return;
        }
        let url = `https://${baseUrl}/pms/users/non_fte_users.json?page=${page}`;
        // If any filter is applied, use the correct param for each filter
        const hasFilters = Object.values(filters).some(v => v && v !== '');
        const hasSearch = Boolean(debouncedSearch.trim());
        if (hasFilters) {
          const filterParams = [];
          if (filters.firstname) filterParams.push(`q[firstname_cont]=${encodeURIComponent(filters.firstname.trim())}`);
          if (filters.lastname) filterParams.push(`q[lastname_cont]=${encodeURIComponent(filters.lastname.trim())}`);
          if (filters.email) filterParams.push(`q[email_cont]=${encodeURIComponent(filters.email)}`);
          if (filters.mobile) filterParams.push(`q[mobile_cont]=${encodeURIComponent(filters.mobile)}`);
          // Prefer exact cluster id filter if present; fallback to name contains
          if (filters.cluster_id) {
            filterParams.push(`q[company_cluster_id_eq]=${encodeURIComponent(String(filters.cluster_id))}`);
          } else if (filters.cluster) {
            filterParams.push(`q[company_cluster_cluster_name_cont]=${encodeURIComponent(filters.cluster)}`);
          }
          if (filters.circle) filterParams.push(`q[lock_user_permissions_circle_name_cont]=${encodeURIComponent(filters.circle)}`);
          if (filters.department) filterParams.push(`q[lock_user_permissions_pms_department_department_name_cont]=${encodeURIComponent(filters.department)}`);
          if (filters.role) filterParams.push(`q[lock_user_permissions_lock_role_name_cont]=${encodeURIComponent(filters.role)}`);
          if (filters.report_to_id) filterParams.push(`q[report_to_email_cont]=${filters.report_to_id}`);
          url += `&${filterParams.join('&')}`;
        } else {
          // Only search by email if no filters
          const emailQuery = debouncedSearch.trim();
          if (emailQuery) {
            url += `&q[email_cont]=${encodeURIComponent(emailQuery)}`;
          }
        }
        const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal });
        let users = Array.isArray(response.data.users) ? response.data.users : (response.data.users || []);
        setExternalUsers(users);
        if (response.data.pagination) {
          setPagination({
            current_page: response.data.pagination.current_page,
            total_pages: response.data.pagination.total_pages,
            total_count: response.data.pagination.total_count,
          });
        } else {
          setPagination({ current_page: page, total_pages: 1, total_count: users.length });
        }
      } catch (err) {
        if (axios.isCancel?.(err) || (err as any)?.name === 'CanceledError' || (err as any)?.code === 'ERR_CANCELED') {
          // ignore canceled requests
        } else {
          setExternalUsers([]);
          console.error('Error fetching external users:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExternalUsers();
    return () => controller.abort();
  }, [page, debouncedSearch, filters]);

  // Reset to first page when new search or filters applied
  // Only reset to page 1 when filters/search change, not on page changes
  // Reset to first page only when the search or filters value actually changes
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

  const cardData = [
    {
      title: "External Users",
      count: Array.isArray(externalUsers) ? externalUsers.length : 0,
      icon: Users
    },
    {
      title: "Active Users",
      count: Array.isArray(externalUsers) ? externalUsers.filter(user => user.lock_user_permission_status === 'approved' || (user as any)?.status === 'approved').length : 0,
      icon: UserCheck
    },
    {
      title: "Pending Approvals",
      count: Array.isArray(externalUsers) ? externalUsers.filter(user => user.lock_user_permission_status === 'pending' || (user as any)?.status === 'pending').length : 0,
      icon: Clock
    },
    {
      title: "Rejected Users",
      count: Array.isArray(externalUsers) ? externalUsers.filter(user => user.lock_user_permission_status === 'rejected' || (user as any)?.status === 'rejected').length : 0,
      icon: Shield
    }
  ];


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
        // Present 'rejected' as 'Deactivated' per product requirement
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Deactivated</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    if (!type) {
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
    }
    switch (type.toLowerCase()) {
      case 'external':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">External</Badge>;
      case 'contractor':
        return <Badge className="bg-purple-500 text-white hover:bg-purple-600">Contractor</Badge>;
      case 'vendor':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Vendor</Badge>;
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
    { key: 'active', label: 'Active', sortable: false, hideable: true },
    { key: 'birth_date', label: 'Birth Date', sortable: true, hideable: true },
    { key: 'joining_date', label: 'Joining Date', sortable: true, hideable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true },
    { key: 'cluster_name', label: 'Cluster', sortable: true, hideable: true },
    { key: 'department', label: 'Department', sortable: true, hideable: true },
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


  const renderCell = (user: ExternalUser, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case 'name':
        return `${user.firstname || ''} ${user.lastname || ''}`.trim() || '-';
      case 'org_user_id':
        return (user as any).org_user_id || (user as any).lock_user_permission?.employee_id || (user as any).employee_id || '-';
      case 'email':
        return user.email || '-';
      case 'mobile':
        return user.mobile || '-';
      case 'gender':
        return user.gender || '-';
      case 'active': {
        const isActive = (user as any).lock_user_permission?.active ?? ((user as any).lock_role ? (user as any).lock_role.active === 1 : !!(user as any).active);
        const disabled = updatingIds.has(user.id);
        return (
          <div className="w-full flex justify-center">
            <div
              onClick={() => !disabled && handleToggleActive(user)}
              className={`mx-auto relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-400'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </div>
          </div>
        );
      }
      case 'birth_date':
        return (user as any).birth_date || '-';
      case 'joining_date':
        return (user as any).lock_user_permission?.joining_date || (user as any).joining_date || '-';
      case 'status': {
        const statusVal = (user as any).lock_user_permission?.status || (user as any).status || (user as any).lock_user_permission_status;
        return statusVal ? getStatusBadge(statusVal) : '-';
      }
      case 'cluster_name':
        return (user as any).cluster_name || user.cluster || '-';
      case 'department':
        return (user as any).lock_user_permission?.department_name || (user as any).department_name || (user as any).department || '-';
      case 'circle_name':
        return (user as any).lock_user_permission?.circle_name || (user as any).circle_name || (user as any).circle || '-';
      case 'work_location':
        return (user as any).work_location || '-';
      case 'company_name':
  return (user as any).ext_company_name || '-';
      case 'role_name':
        return (user as any).lock_user_permission?.role_name || (user as any).role_name || (user as any).lock_role?.name || (user as any).lock_role?.display_name || '-';
      case 'employee_type':
        return (user as any).employee_type || '-';
      case 'created_at': {
        const created = (user as any).created_at;
        if (!created) return '-';
        try {
          const d = new Date(created);
            const day = String(d.getDate()).padStart(2,'0');
            const month = String(d.getMonth()+1).padStart(2,'0');
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2,'0');
            const minutes = String(d.getMinutes()).padStart(2,'0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch { return created; }
      }
      case 'line_manager_name':
        return (user as any).report_to?.name || 'NA';
      case 'line_manager_email':
        return (user as any).report_to?.email || 'NA';
      case 'line_manager_mobile':
        return (user as any).report_to?.mobile || 'NA';
      default:
        return '-';
    }
  };

  const renderActions = (user: ExternalUser) => (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/maintenance/m-safe/external/user/${user.id}`, { state: { user } })}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {/* <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(user)} className="h-8 w-8 p-0">
        <Trash2 className="h-4 w-4" />
      </Button> */}
    </div>
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(externalUsers.map(user => user.id.toString()));
    } else {
      setSelectedItems([]);
    }
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
      link.download = 'external-users.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success('External Users data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export External Users data');
    }
  };

  const handleImport = (file: File) => {
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
    // Immediately reset pagination UI to avoid showing stale total pages
    setPage(1);
    setPagination({ current_page: 1, total_pages: 1, total_count: 0 });
  }

  const handleToggleActive = async (user: ExternalUser) => {
    const permission = user.lock_user_permission;     
    const previousStatus = permission?.status;
    const activeVal: any = permission?.active;
    const current = activeVal === true || activeVal === 1 || activeVal === '1';
    if (!permission?.id) {
      toast.error('Missing permission id');
      return;
    }
    const newValue = !current;
    const newStatus = newValue ? 'approved' : 'rejected';
    // optimistic update (also reflect status change)
    setExternalUsers(prev => prev.map(u => u.id === user.id ? { ...u, lock_user_permission: { ...u.lock_user_permission, active: newValue, status: newStatus }, status: newStatus } : u));
    setUpdatingIds(prev => new Set(prev).add(user.id));
    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      if (!baseUrl || !token) throw new Error('Missing base URL or token');
      const url = `https://${baseUrl}/pms/users/${user.id}/update_vi_user`;
      const payload = {
        user: {
          lock_user_permissions_attributes: [
            {
              id: permission.id,
              active: newValue ? 1 : 0,
              joining_date: permission.joining_date,
              designation: permission.designation,
              employee_id: permission.employee_id,
              department_id: permission.department_id,
              lock_role_id: permission.lock_role_id,
              circle_id: permission.circle_id,
              status: newStatus
            }
          ]
        }
      };
      await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`User ${newValue ? 'activated (approved)' : 'deactivated (rejected)'} successfully`);
    } catch (e:any) {
      // revert on error
      setExternalUsers(prev => prev.map(u => u.id === user.id ? { ...u, lock_user_permission: { ...u.lock_user_permission, active: current, status: previousStatus }, status: previousStatus } : u));
      toast.error('Failed to update active status');
      console.error('Active toggle error', e);
    } finally {
      setUpdatingIds(prev => { const n = new Set(prev); n.delete(user.id); return n; });
    }
  };

  const handleDeleteClick = (user: ExternalUser) => {
    setConfirmDeleteUser(user);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteUser) return;
    setDeleting(true);
    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      if (!baseUrl || !token) throw new Error('Missing base URL or token');
      const url = `https://${baseUrl}/pms/users/${confirmDeleteUser.id}/delete_vi_user`;
      await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      setExternalUsers(prev => prev.filter(u => u.id !== confirmDeleteUser.id));
      setPagination(prev => ({
        ...prev,
        total_count: Math.max(0, prev.total_count - 1)
      }));
      toast.success('User deleted successfully');
    } catch (e:any) {
      console.error('Delete user error', e);
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
      setConfirmDeleteUser(null);
    }
  };

  const handleCancelDelete = () => setConfirmDeleteUser(null);

  const handlePageChange = (newPage: number) => {
    // Relax guard: when server doesn't send total_pages for filtered queries,
    // allow navigation based on page bounds only; we'll fetch and adjust UI from results.
    if (newPage < 1 || newPage === page) return;
    setPage(newPage);
  };


  // New pagination items (ServiceDashboard style)
  const paginationItems = useMemo(() => {
    const items: React.ReactNode[] = [];
    const totalPages = pagination.total_pages;
    const current = page;
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
  }, [pagination.total_pages, page]);

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
          <EnhancedTable
            data={externalUsers || []}
            leftActions={
              <div className="flex gap-2">
                {canSeeActionButton && (
                  <Button
                    onClick={handleActionClick}
                    className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
                  >
                    <Plus className="w-4 h-4" />
                    Action
                  </Button>
                )}
                <Button
                  onClick={() => navigate('/maintenance/m-safe/external-users/multiple-delete')}
                  className="text-white bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Multiple User Delete
                </Button>
              </div>
            }
            columns={columns}
            onFilterClick={handleFiltersClick}
            renderCell={renderCell}
            renderActions={renderActions}
            onSelectAll={handleSelectAll}
            storageKey="msafe-external-users"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search..."
            handleExport={handleExport}
            exportFileName="external-users"
            pagination={false}
            pageSize={pageSize}
            loading={loading}
            enableSearch={true}
            onRowClick={user => console.log('Row clicked:', user)}
          />
          {!loading && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <div className="text-sm text-gray-600">
                Page {page}
                {pagination.total_pages > 1 ? ` of ${pagination.total_pages}` : ''}
                {typeof pagination.total_count === 'number' && pagination.total_count > 0 ? ` | Total ${pagination.total_count}` : ''}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={`cursor-pointer ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                      onClick={() => handlePageChange(page - 1)}
                    />
                  </PaginationItem>
                  {/* Render page numbers only when server provides total_pages > 1 */}
                  {pagination.total_pages > 1 ? paginationItems : null}
                  <PaginationItem>
                    {(() => {
                      const hasServerPages = pagination.total_pages > 1;
                      // If server pagination unknown (==1), allow Next when we received a full page of results.
                      const canGoNext = hasServerPages ? page < pagination.total_pages : (externalUsers?.length || 0) >= pageSize;
                      return (
                        <PaginationNext
                          className={`cursor-pointer ${!canGoNext ? 'pointer-events-none opacity-50' : ''}`}
                          onClick={() => canGoNext && handlePageChange(page + 1)}
                        />
                      );
                    })()}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        <MSafeImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImport} />
        <ExternalFilterDialog isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApplyFilters={handleApplyFilters} />
        {confirmDeleteUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <p>Are you sure you want to delete this user?</p>
                <p className="font-medium">{`${confirmDeleteUser.firstname || ''} ${confirmDeleteUser.lastname || ''}`.trim() || 'User'} (Email: {confirmDeleteUser.email})</p>
              </div>
              <div className="p-4 flex justify-end gap-2 border-t">
                <Button variant="outline" onClick={handleCancelDelete} disabled={deleting}>No</Button>
                <Button className="bg-[#C72030] text-white hover:bg-[#C72030]/90" onClick={handleConfirmDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Yes'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
};