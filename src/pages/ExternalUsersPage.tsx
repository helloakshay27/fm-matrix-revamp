import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Eye, Plus } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchProjectExternalUsers } from '@/store/slices/projectUsersSlice';
import { toast } from 'sonner';
import ExternalUserModal from '@/components/ExternalUserModal';
import { fetchCompanies } from '@/store/slices/projectCompanySlice';
import { fetchProjectRoles } from '@/store/slices/projectRoleSlice';
import { fetchOrganizations } from '@/store/slices/organizationsSlice';

interface ExternalUser {
  id: number;
  firstname: string;
  lastname: string;
  organization_name: string;
  user_company_name: string;
  mobile: string;
  email: string;
  lock_role: {
    name: string;
  };
  invite: string;
  active: boolean;
}

const columns: ColumnConfig[] = [
  {
    key: 'userName',
    label: 'User Name',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'organisation',
    label: 'Organisation',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'company',
    label: 'Company',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'mobileNo',
    label: 'Mobile No.',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'emailId',
    label: 'Email Id',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'invitationStatus',
    label: 'Invitation Status',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'active',
    label: 'Status',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

const transformedUser = (data) => {
  return data.map((item: ExternalUser) => {
    return {
      userName: item.firstname + ' ' + item.lastname,
      organization: item.organization_name,
      company: item.user_company_name,
      mobileNo: item.mobile,
      emailId: item.email,
      role: item.lock_role.name,
      invitationStatus: item.invite,
      active: item.active,
    };
  });
};

export const ExternalUsersPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState<ExternalUser | {}>({});
  const [externalUsersData, setExternalUsersData] = useState<ExternalUser[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
  const [organizations, setOrganizations] = useState([])
  const [companies, setCompanies] = useState([])
  const [rolesData, setRolesData] = useState([])

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await dispatch(fetchProjectExternalUsers({ baseUrl, token })).unwrap();
      setExternalUsersData(transformedUser(response));
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const getOrganizations = async () => {
    try {
      const response = await dispatch(fetchOrganizations({ baseUrl, token })).unwrap();
      setOrganizations(response.organizations)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getCompanies = async () => {
    try {
      const response = await dispatch(fetchCompanies({ baseUrl, token })).unwrap();
      setCompanies(response)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getRoles = async () => {
    try {
      const response = await dispatch(fetchProjectRoles({ baseUrl, token })).unwrap();
      setRolesData(response)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchData();
    getOrganizations();
    getCompanies();
    getRoles();
  }, [])

  const renderCell = (item, columnKey: string) => {
    switch (columnKey) {
      case 'invitationStatus':
        const statusStyles = {
          'Accepted': 'bg-green-100 text-green-800',
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Declined': 'bg-red-100 text-red-800',
          'Expired': 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[item.invite as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
            {item.invite}
          </span>
        );
      case 'active':
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() => { }}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={updatingStatus[item.id]}
          />
        );
      default:
        return item[columnKey as keyof ExternalUser] || '-';
    }
  };

  const renderActions = (item: ExternalUser) => {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/settings/manage-users/external-users/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => {
            setIsEditing(true);
            setShowAddModal(true);
            setRecord(item);
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const leftActions = (
    <Button
      className="bg-[#C72030] hover:bg-[#A01020] text-white"
      onClick={() => setShowAddModal(true)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={[...externalUsersData].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        pagination={true}
        pageSize={10}
        loading={loadingData}
      />

      <ExternalUserModal
        openDialog={showAddModal}
        handleCloseDialog={() => setShowAddModal(false)}
        isEditing={isEditing}
        record={record}
        fetchData={fetchData}
        companies={companies}
        roles={rolesData}
        organizations={organizations}
      />
    </div>
  );
};