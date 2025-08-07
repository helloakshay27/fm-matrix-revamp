import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Clock, Settings, Shield, UserPlus, Search, Filter, Download, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchFMUsers, FMUser } from '@/store/slices/fmUserSlice';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
export const MSafeDashboard = () => {
  const dispatch = useAppDispatch();
  const {
    data: fmUsersData,
    loading,
    error
  } = useAppSelector(state => state.fmUsers);
  const fm_users = fmUsersData?.fm_users || [];
  const [searchTerm, setSearchTerm] = useState('');
  const cardData = [{
    title: "User Management",
    count: fm_users?.length || 25,
    icon: Users
  }, {
    title: "Active Users",
    count: fm_users?.filter(user => user.lock_user_permission_status === 'approved').length || 18,
    icon: UserCheck
  }, {
    title: "Pending Approvals",
    count: fm_users?.filter(user => user.lock_user_permission_status === 'pending').length || 7,
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
    hideable: true,
    width: '80px'
  }, {
    key: 'id',
    label: 'ID',
    sortable: true,
    hideable: true,
    width: '60px'
  }, {
    key: 'user_name',
    label: 'User Name',
    sortable: true,
    hideable: false,
    width: '150px'
  }, {
    key: 'gender',
    label: 'Gender',
    sortable: true,
    hideable: true,
    width: '80px'
  }, {
    key: 'mobile',
    label: 'Mobile Number',
    sortable: true,
    hideable: true,
    width: '120px'
  }, {
    key: 'email',
    label: 'Email',
    sortable: true,
    hideable: true,
    width: '200px'
  }, {
    key: 'company_name',
    label: 'Vendor Company Name',
    sortable: true,
    hideable: true,
    width: '180px'
  }, {
    key: 'entity_id',
    label: 'Entity Name',
    sortable: true,
    hideable: true,
    width: '120px'
  }, {
    key: 'unit_id',
    label: 'Unit',
    sortable: true,
    hideable: true,
    width: '80px'
  }, {
    key: 'designation',
    label: 'Role',
    sortable: true,
    hideable: true,
    width: '120px'
  }, {
    key: 'employee_id',
    label: 'Employee ID',
    sortable: true,
    hideable: true,
    width: '120px'
  }, {
    key: 'created_by_id',
    label: 'Created By',
    sortable: true,
    hideable: true,
    width: '100px'
  }, {
    key: 'access_level',
    label: 'Access Level',
    sortable: true,
    hideable: true,
    width: '120px'
  }, {
    key: 'user_type',
    label: 'Type',
    sortable: true,
    hideable: true,
    width: '100px'
  }, {
    key: 'lock_user_permission_status',
    label: 'Status',
    sortable: true,
    hideable: true,
    width: '100px'
  }, {
    key: 'face_added',
    label: 'Face Recognition',
    sortable: true,
    hideable: true,
    width: '130px'
  }, {
    key: 'app_downloaded',
    label: 'App Downloaded',
    sortable: true,
    hideable: true,
    width: '130px'
  }];
  const renderCell = (user: FMUser, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case 'active':
        return <div className="flex justify-center">
            <Switch checked={user.lock_user_permission_status === 'approved'} onCheckedChange={() => {}} />
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
  const renderActions = (user: FMUser) => <div className="flex items-center justify-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => {}} className="h-8 w-8 p-0">
        <Eye className="h-4 w-4" />
      </Button>
    </div>;
  const handleRefresh = () => {
    dispatch(fetchFMUsers());
  };
  return <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">MSafe Dashboard</h1>
        <p className="text-gray-600">Manage your security operations and user access</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => <div key={index} className="bg-[#f6f4ee] rounded-lg p-6 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FBEDEC] rounded-full flex items-center justify-center">
              <card.icon className="w-6 h-6 text-[#C72030]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#C72030]">{card.count}</div>
              <div className="text-sm font-medium text-gray-600">{card.title}</div>
            </div>
          </div>)}
      </div>

      {/* Action Buttons */}
      

      {/* Enhanced Table */}
      <div className="rounded-lg shadow-sm">
        <div className="p-6">
          <EnhancedTable data={fm_users || []} columns={columns} renderCell={renderCell} renderActions={renderActions} storageKey="msafe-fm-users" searchTerm={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search FM users..." enableExport={true} exportFileName="fm-users" pagination={true} pageSize={10} loading={loading} enableSearch={true} onRowClick={user => console.log('Row clicked:', user)} />
        </div>
      </div>
    </div>;
};