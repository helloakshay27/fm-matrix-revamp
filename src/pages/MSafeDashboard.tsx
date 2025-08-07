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


export const MSafeDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const {
  //   data: fmUsersData,
  //   loading,
  //   error
  // } = useAppSelector(state => state.fmUsers);
  // const fm_users = fmUsersData?.fm_users || [];

  // Dummy FMUser data (10 records) in state
  const [fmUsers, setFmUsers] = useState<FMUser[]>([
    {
      id: 1, firstname: 'John', lastname: 'Doe', gender: 'Male', mobile: '1234567890', email: 'john@example.com', company_name: 'Acme Corp', entity_id: 1, unit_id: 1, designation: 'Manager', employee_id: 'EMP001', created_by_id: 1, user_type: 'admin', lock_user_permission_status: 'approved', face_added: true, app_downloaded: 'yes', lock_user_permission: { access_level: '1' }
    },
    {
      id: 2, firstname: 'Jane', lastname: 'Smith', gender: 'Female', mobile: '2345678901', email: 'jane@example.com', company_name: 'Beta Ltd', entity_id: 2, unit_id: 2, designation: 'Engineer', employee_id: 'EMP002', created_by_id: 1, user_type: 'site', lock_user_permission_status: 'pending', face_added: false, app_downloaded: 'no', lock_user_permission: { access_level: '2' }
    },
    {
      id: 3, firstname: 'Alice', lastname: 'Brown', gender: 'Female', mobile: '3456789012', email: 'alice@example.com', company_name: 'Gamma Inc', entity_id: 3, unit_id: 3, designation: 'Technician', employee_id: 'EMP003', created_by_id: 1, user_type: 'company', lock_user_permission_status: 'approved', face_added: true, app_downloaded: 'no', lock_user_permission: { access_level: '3' }
    },
    {
      id: 4, firstname: 'Bob', lastname: 'White', gender: 'Male', mobile: '4567890123', email: 'bob@example.com', company_name: 'Delta LLC', entity_id: 4, unit_id: 4, designation: 'Supervisor', employee_id: 'EMP004', created_by_id: 1, user_type: 'site', lock_user_permission_status: 'pending', face_added: false, app_downloaded: 'yes', lock_user_permission: { access_level: '2' }
    },
    {
      id: 5, firstname: 'Charlie', lastname: 'Green', gender: 'Male', mobile: '5678901234', email: 'charlie@example.com', company_name: 'Epsilon GmbH', entity_id: 5, unit_id: 5, designation: 'Operator', employee_id: 'EMP005', created_by_id: 1, user_type: 'admin', lock_user_permission_status: 'approved', face_added: true, app_downloaded: 'yes', lock_user_permission: { access_level: '1' }
    },
    {
      id: 6, firstname: 'Diana', lastname: 'King', gender: 'Female', mobile: '6789012345', email: 'diana@example.com', company_name: 'Zeta AG', entity_id: 6, unit_id: 6, designation: 'Clerk', employee_id: 'EMP006', created_by_id: 1, user_type: 'company', lock_user_permission_status: 'rejected', face_added: false, app_downloaded: 'no', lock_user_permission: { access_level: '2' }
    },
    {
      id: 7, firstname: 'Eve', lastname: 'Black', gender: 'Female', mobile: '7890123456', email: 'eve@example.com', company_name: 'Eta Pvt', entity_id: 7, unit_id: 7, designation: 'Lead', employee_id: 'EMP007', created_by_id: 1, user_type: 'site', lock_user_permission_status: 'approved', face_added: true, app_downloaded: 'no', lock_user_permission: { access_level: '3' }
    },
    {
      id: 8, firstname: 'Frank', lastname: 'Gray', gender: 'Male', mobile: '8901234567', email: 'frank@example.com', company_name: 'Theta Ltd', entity_id: 8, unit_id: 8, designation: 'Staff', employee_id: 'EMP008', created_by_id: 1, user_type: 'company', lock_user_permission_status: 'pending', face_added: false, app_downloaded: 'yes', lock_user_permission: { access_level: '1' }
    },
    {
      id: 9, firstname: 'Grace', lastname: 'Hill', gender: 'Female', mobile: '9012345678', email: 'grace@example.com', company_name: 'Iota Inc', entity_id: 9, unit_id: 9, designation: 'Admin', employee_id: 'EMP009', created_by_id: 1, user_type: 'admin', lock_user_permission_status: 'approved', face_added: true, app_downloaded: 'yes', lock_user_permission: { access_level: '2' }
    },
    {
      id: 10, firstname: 'Henry', lastname: 'Stone', gender: 'Male', mobile: '0123456789', email: 'henry@example.com', company_name: 'Kappa LLC', entity_id: 10, unit_id: 10, designation: 'Support', employee_id: 'EMP010', created_by_id: 1, user_type: 'site', lock_user_permission_status: 'rejected', face_added: false, app_downloaded: 'no', lock_user_permission: { access_level: '3' }
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
    title: "User Management",
    count: fmUsers?.length || 25,
    icon: Users
  }, {
    title: "Active Users",
    count: fmUsers?.filter(user => user.lock_user_permission_status === 'approved').length || 18,
    icon: UserCheck
  }, {
    title: "Pending Approvals",
    count: fmUsers?.filter(user => user.lock_user_permission_status === 'pending').length || 7,
    icon: Clock
  }, {
    title: "System Settings",
    count: 12,
    icon: Settings
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
    key: 'entity_id',
    label: 'Entity Name',
    sortable: true,
    hideable: true
  }, {
    key: 'unit_id',
    label: 'Unit',
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
    key: 'created_by_id',
    label: 'Created By',
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
  const handleToggleActive = (user: FMUser) => {
    setFmUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id
          ? { ...u, lock_user_permission_status: u.lock_user_permission_status === 'approved' ? 'pending' : 'approved' }
          : u
      )
    );
  };

  const renderCell = (user: FMUser, columnKey: string): React.ReactNode => {
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
        const value = user[columnKey as keyof FMUser];
        return value?.toString() || '';
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
      <Button variant="ghost" size="sm" onClick={() => { }} className="h-8 w-8 p-0">
        <Trash2 className="h-4 w-4" />
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

  const handleApplyFilters = (filters: { name: string; email: string; mobile: string }) => {
    // Apply filters to the fm_users data
    // const filteredUsers = fm_users.filter(user => {
    //   return (!filters.name || user.user_name.toLowerCase().includes(filters.name.toLowerCase())) &&
    //     (!filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
    //     (!filters.mobile || user.mobile.includes(filters.mobile));
    // });
    // Update the state or dispatch an action with the filtered users
    console.log('Filtered Users:');
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
          <EnhancedTable data={fmUsers || []} leftActions={
            <Button
              onClick={handleActionClick}
              className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
            >
              <Plus className="w-4 h-4" />
              Action
            </Button>
          } columns={columns} onFilterClick={handleFiltersClick}
            renderCell={renderCell} renderActions={renderActions} onSelectAll={handleSelectAll} storageKey="msafe-fm-users" searchTerm={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search..." handleExport={handleExport} enableExport={true} exportFileName="fm-users" pagination={true} pageSize={10} loading={loading} enableSearch={true} onRowClick={user => console.log('Row clicked:', user)} />
        </div>

        <MSafeImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImport} />
        <MSafeFilterDialog isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApplyFilters={handleApplyFilters} />
      </div>;
    </>
  )
};