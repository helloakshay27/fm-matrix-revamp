import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchProjectInternalUsers, fetchProjectUsers } from '@/store/slices/projectUsersSlice';
import { fetchCompanies } from '@/store/slices/projectCompanySlice';
import { fetchProjectRoles } from '@/store/slices/projectRoleSlice';
import InternalUsersModal from '@/components/InternalUsersModal';

interface InternalUser {
  id: number;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  user_company_name: string;
  lock_role: {
    name: string;
  };
  report_to: {
    name: string;
  };
  associated_projects_count: string;
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
    key: 'company',
    label: 'Company',
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
    key: 'reportsTo',
    label: 'Reports To',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'associatedProjects',
    label: 'Associated Projects',
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
  return data.map((item: InternalUser) => {
    return {
      userName: item.firstname + ' ' + item.lastname,
      mobileNo: item.mobile,
      emailId: item.email,
      company: item.user_company_name,
      role: item.lock_role.name,
      reportsTo: item.report_to.name,
      associatedProjects: item.associated_projects_count,
      active: item.active,
    };
  });
};

export const InternalUsersPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState<InternalUser | {}>({});
  const [internalUsersData, setInternalUsersData] = useState<InternalUser[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
  const [companies, setCompanies] = useState([])
  const [rolesData, setRolesData] = useState([])
  const [users, setUsers] = useState([])

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchProjectInternalUsers({ baseUrl, token })).unwrap();
      setInternalUsersData(transformedUser(response));
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

  const getUsers = async () => {
    try {
      const response = await dispatch(fetchProjectUsers({ baseUrl, token })).unwrap();
      setUsers(response)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchData();
    getCompanies();
    getRoles();
    getUsers();
  }, []);

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
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
        return item[columnKey as keyof InternalUser] || '-';
    }
  };

  const renderActions = (item: InternalUser) => {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/settings/manage-users/internal-users/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => {
            setIsEditing(true);
            setShowModal(true);
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
      onClick={() => setShowModal(true)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={[...internalUsersData].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        pagination={true}
        pageSize={10}
        loading={loadingData}
      />

      <InternalUsersModal
        openDialog={showModal}
        handleCloseDialog={() => setShowModal(false)}
        isEditing={isEditing}
        record={record}
        fetchData={fetchData}
        companies={companies}
        roles={rolesData}
        users={users}
      />
    </div>
  );
};