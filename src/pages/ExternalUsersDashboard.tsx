import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Clock, Settings, Shield, UserPlus, Search, Filter, Download, RefreshCw, Eye, Trash2, Plus, UploadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchFMUsers, FMUser } from '@/store/slices/fmUserSlice';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { MSafeImportModal } from '@/components/MSafeImportModal';
import { MSafeFilterDialog } from '@/components/MSafeFilterDialog';
import { toast } from 'sonner';
import axios from 'axios';

// Define External User interface (different from FMUser)
interface ExternalUser {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  mobile: string;
  email: string;
  company_name: string;
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
  lock_user_permission: { access_level: number };
  line_manager_name?: string;
  line_manager_mobile?: string;
  department?: string;
  circle?: string;
  cluster?: string;
}

export const ExternalUsersDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Dummy External User data (10 records) in state
  const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([
    {
      id: 1, firstname: 'Anand', lastname: 'Pawar', gender: 'Male', mobile: '8355857800', email: 'anandpawar54136@gmail.com', company_name: 'External Vendor A', entity_id: 1, unit_id: 1, designation: 'Shift Engineer', employee_id: 'EXT001', created_by_id: 1, access_level: 3, user_type: 'external', lock_user_permission_status: 'approved', face_added: true, app_downloaded: true, lock_user_permission: { access_level: 3 }, department: 'FM', line_manager_name: 'Manager A', line_manager_mobile: '9876543210'
    },
    {
      id: 2, firstname: 'Tapish', lastname: 'Choudhary', gender: 'Male', mobile: '7701944124', email: 'taapish@gmail.com', company_name: 'External Vendor B', entity_id: 2, unit_id: 2, designation: 'Security Guard', employee_id: 'EXT002', created_by_id: 1, access_level: 3, user_type: 'external', lock_user_permission_status: 'pending', face_added: false, app_downloaded: false, lock_user_permission: { access_level: 3 }, department: 'Security', circle: 'North', cluster: 'Zone 1'
    },
    {
      id: 3, firstname: 'Amrit', lastname: 'Gupta', gender: 'Male', mobile: '9006485383', email: 'amritkumargupta900@gmail.com', company_name: 'Cleaning Services Ltd', entity_id: 3, unit_id: 3, designation: 'Cleaner', employee_id: 'EXT003', created_by_id: 1, access_level: 3, user_type: 'external', lock_user_permission_status: 'approved', face_added: true, app_downloaded: false, lock_user_permission: { access_level: 3 }, department: 'Housekeeping', circle: 'South', cluster: 'Zone 2'
    },
    {
      id: 4, firstname: 'Moiz', lastname: 'Tuv', gender: 'Male', mobile: '7411874016', email: '7411874016@gmail.com', company_name: 'Maintenance Corp', entity_id: 4, unit_id: 4, designation: 'Technician', employee_id: 'EXT004', created_by_id: 1, access_level: 3, user_type: 'external', lock_user_permission_status: 'pending', face_added: false, app_downloaded: true, lock_user_permission: { access_level: 3 }, department: 'Maintenance', line_manager_name: 'Manager B', line_manager_mobile: '9876543211'
    },
    {
      id: 5, firstname: 'Maruf', lastname: 'Khan', gender: 'Male', mobile: '8808632149', email: '8808632149@gmail.com', company_name: 'Security Solutions', entity_id: 5, unit_id: 5, designation: 'Security Officer', employee_id: 'EXT005', created_by_id: 1, access_level: 3, user_type: 'external', lock_user_permission_status: 'approved', face_added: true, app_downloaded: true, lock_user_permission: { access_level: 3 }, department: 'Security', circle: 'East', cluster: 'Zone 3'
    },
    {
      id: 6, firstname: 'Shivam', lastname: 'Kumar', gender: 'Male', mobile: '9997888699', email: 'shivam.kumar@godrejproperties.com', company_name: 'Godrej Properties', entity_id: 6, unit_id: 6, designation: 'Manager', employee_id: 'EXT006', created_by_id: 1, access_level: 2, user_type: 'external', lock_user_permission_status: 'rejected', face_added: false, app_downloaded: false, lock_user_permission: { access_level: 2 }, department: 'Management', circle: 'West', cluster: 'Zone 4'
    },
    {
      id: 7, firstname: 'Firasat', lastname: 'Khan', gender: 'Male', mobile: '7897365833', email: 'firasatalkhan786@gmail.com', company_name: 'Landscaping Inc', entity_id: 7, unit_id: 7, designation: 'Gardener', employee_id: 'EXT007', created_by_id: 1, access_level: 3, user_type: 'external', lock_user_permission_status: 'approved', face_added: true, app_downloaded: false, lock_user_permission: { access_level: 3 }, department: 'Landscaping', line_manager_name: 'Manager C', line_manager_mobile: '9876543212'
    },
    {
      id: 8, firstname: 'Vineet', lastname: 'Chauhan', gender: 'Male', mobile: '8209305825', email: 'vineet.chauhan@godrejproperties.com', company_name: 'Godrej Properties', entity_id: 8, unit_id: 8, designation: 'Supervisor', employee_id: 'EXT008', created_by_id: 1, access_level: 2, user_type: 'external', lock_user_permission_status: 'pending', face_added: false, app_downloaded: true, lock_user_permission: { access_level: 2 }, department: 'Operations', circle: 'Central', cluster: 'Zone 5'
    },
    {
      id: 9, firstname: 'Avinash', lastname: 'Kamble', gender: 'Male', mobile: '9833842276', email: '9833842276@gmail.com', company_name: 'Transport Services', entity_id: 9, unit_id: 9, designation: 'Driver', employee_id: 'EXT009', created_by_id: 1, access_level: 3, user_type: 'external', lock_user_permission_status: 'approved', face_added: true, app_downloaded: true, lock_user_permission: { access_level: 3 }, department: 'Transport', circle: 'North', cluster: 'Zone 6'
    },
    {
      id: 10, firstname: 'Parveen', lastname: 'Kumar', gender: 'Male', mobile: '9785669937', email: '9785669937@gmail.com', company_name: 'Catering Services', entity_id: 10, unit_id: 10, designation: 'Cook', employee_id: 'EXT010', created_by_id: 1, access_level: 3, user_type: 'external', lock_user_permission_status: 'rejected', face_added: false, app_downloaded: false, lock_user_permission: { access_level: 3 }, department: 'Catering', line_manager_name: 'Manager D', line_manager_mobile: '9876543213'
    },
  ]);
  const loading = false;
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const cardData = [{
    title: "External Users",
    count: externalUsers?.length || 10,
    icon: Users
  }, {
    title: "Active Users",
    count: externalUsers?.filter(user => user.lock_user_permission_status === 'approved').length || 5,
    icon: UserCheck
  }, {
    title: "Pending Approvals",
    count: externalUsers?.filter(user => user.lock_user_permission_status === 'pending').length || 3,
    icon: Clock
  }, {
    title: "Rejected Users",
    count: externalUsers?.filter(user => user.lock_user_permission_status === 'rejected').length || 2,
    icon: Shield
  }];

  useEffect(() => {
    dispatch(fetchFMUsers());
  }, [dispatch]);

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

  const columns: ColumnConfig[] = [{
    key: 'active',
    label: 'Active',
    sortable: false,
    hideable: true
  }, {
    key: 'id',
    label: 'ID',
    sortable: true,
    hideable: true
  }, {
    key: 'user_name',
    label: 'User Name',
    sortable: true,
    hideable: false
  }, {
    key: 'gender',
    label: 'Gender',
    sortable: true,
    hideable: true
  }, {
    key: 'mobile',
    label: 'Mobile Number',
    sortable: true,
    hideable: true
  }, {
    key: 'email',
    label: 'Email',
    sortable: true,
    hideable: true
  }, {
    key: 'company_name',
    label: 'Vendor Company Name',
    sortable: true,
    hideable: true
  }, {
    key: 'department',
    label: 'Department',
    sortable: true,
    hideable: true
  }, {
    key: 'circle',
    label: 'Circle',
    sortable: true,
    hideable: true
  }, {
    key: 'cluster',
    label: 'Cluster',
    sortable: true,
    hideable: true
  }, {
    key: 'designation',
    label: 'Role',
    sortable: true,
    hideable: true
  }, {
    key: 'employee_id',
    label: 'Employee ID',
    sortable: true,
    hideable: true
  }, {
    key: 'line_manager_name',
    label: 'Line Manager Name',
    sortable: true,
    hideable: true
  }, {
    key: 'line_manager_mobile',
    label: 'Line Manager Mobile',
    sortable: true,
    hideable: true
  }, {
    key: 'access_level',
    label: 'Access Level',
    sortable: true,
    hideable: true
  }, {
    key: 'user_type',
    label: 'Type',
    sortable: true,
    hideable: true
  }, {
    key: 'lock_user_permission_status',
    label: 'Status',
    sortable: true,
    hideable: true
  }, {
    key: 'face_added',
    label: 'Face Recognition',
    sortable: true,
    hideable: true
  }, {
    key: 'app_downloaded',
    label: 'App Downloaded',
    sortable: true,
    hideable: true
  }];

  // Toggle active status handler (local state update for dummy data)
  const handleToggleActive = (user: ExternalUser) => {
    setExternalUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id
          ? { ...u, lock_user_permission_status: u.lock_user_permission_status === 'approved' ? 'pending' : 'approved' }
          : u
      )
    );
  };

  const renderCell = (user: ExternalUser, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case 'active':
        return <div className="flex justify-center">
          <Switch
            checked={user.lock_user_permission_status === 'approved'}
            onCheckedChange={() => handleToggleActive(user)}
          />
        </div>;
      case 'user_name':
        return `${user.firstname} ${user.lastname}`;
      case 'company_name':
        return user.company_name || 'N/A';
      case 'department':
        return user.department || 'N/A';
      case 'circle':
        return user.circle || 'N/A';
      case 'cluster':
        return user.cluster || 'N/A';
      case 'line_manager_name':
        return user.line_manager_name || 'N/A';
      case 'line_manager_mobile':
        return user.line_manager_mobile || 'N/A';
      case 'access_level':
        return (user.lock_user_permission?.access_level || 'N/A').toString();
      case 'user_type':
        return getTypeBadge(user.user_type);
      case 'lock_user_permission_status':
        return getStatusBadge(user.lock_user_permission_status);
      case 'face_added':
        return getYesNoBadge(user.face_added);
      case 'app_downloaded':
        return getYesNoBadge(user.app_downloaded);
      default:
        const value = user[columnKey as keyof ExternalUser];
        return value?.toString() || '';
    }
  };

  const renderActions = (user: ExternalUser) => (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/maintenance/m-safe/user/${user.id}`, { state: { user } })}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => { }} className="h-8 w-8 p-0">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(externalUsers.map(user => user.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

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

  const handleApplyFilters = (filters: { name: string; email: string; mobile: string; department: string; circle: string }) => {
    // Apply filters to the external users data
    console.log('Filtered External Users:', filters);
  }

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
              { label: 'Import', icon: UploadIcon, onClick: () => setImportModalOpen(true) },
            ]}
            onClearSelection={() => setShowActionPanel(false)}
          />
        )}

        <div className="rounded-lg">
          <EnhancedTable 
            data={externalUsers || []} 
            leftActions={
              <Button
                onClick={handleActionClick}
                className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
              >
                <Plus className="w-4 h-4" />
                Action
              </Button>
            } 
            columns={columns} 
            onFilterClick={handleFiltersClick}
            renderCell={renderCell} 
            renderActions={renderActions} 
            onSelectAll={handleSelectAll} 
            storageKey="msafe-external-users" 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            searchPlaceholder="Search external users..." 
            handleExport={handleExport} 
            enableExport={true} 
            exportFileName="external-users" 
            pagination={true} 
            pageSize={10} 
            loading={loading} 
            enableSearch={true} 
            onRowClick={user => console.log('Row clicked:', user)} 
          />
        </div>

        <MSafeImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImport} />
        <MSafeFilterDialog isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApplyFilters={handleApplyFilters} />
      </div>
    </>
  )
};