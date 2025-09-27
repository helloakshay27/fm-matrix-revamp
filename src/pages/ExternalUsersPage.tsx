import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Eye, Plus } from 'lucide-react';

interface ExternalUser {
  id: number;
  userName: string;
  organisation: string;
  company: string;
  mobileNo: string;
  emailId: string;
  role: string;
  invitationStatus: string;
  created_on: string;
  created_by: string;
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

export const ExternalUsersPage = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState<ExternalUser | {}>({});
  const [externalUsersData, setExternalUsersData] = useState<ExternalUser[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {

  }, [])

  const mockUsersData: ExternalUser[] = [
    {
      id: 1,
      userName: 'Alex Chen',
      organisation: 'Tech Innovations Inc',
      company: 'ABC Corp',
      mobileNo: '+91 9876543213',
      emailId: 'alex.chen@techinnovations.com',
      role: 'Consultant',
      invitationStatus: 'Accepted',
      created_on: '15/09/2025, 10:30 AM',
      created_by: 'Admin',
      active: true,
    },
    {
      id: 2,
      userName: 'Maria Rodriguez',
      organisation: 'Global Solutions Ltd',
      company: 'XYZ Ltd',
      mobileNo: '+91 9876543214',
      emailId: 'maria.rodriguez@globalsolutions.com',
      role: 'External Auditor',
      invitationStatus: 'Pending',
      created_on: '14/09/2025, 02:15 PM',
      created_by: 'Admin',
      active: true,
    },
    {
      id: 3,
      userName: 'David Thompson',
      organisation: 'Expert Systems',
      company: 'ABC Corp',
      mobileNo: '+91 9876543215',
      emailId: 'david.thompson@expertsystems.com',
      role: 'Technical Advisor',
      invitationStatus: 'Accepted',
      created_on: '13/09/2025, 09:45 AM',
      created_by: 'Admin',
      active: false,
    },
    {
      id: 4,
      userName: 'Sophie Williams',
      organisation: 'Strategic Consulting',
      company: 'Digital Systems',
      mobileNo: '+91 9876543216',
      emailId: 'sophie.williams@strategic.com',
      role: 'Business Consultant',
      invitationStatus: 'Declined',
      created_on: '12/09/2025, 03:20 PM',
      created_by: 'Admin',
      active: true,
    },
  ];

  const renderCell = (item: ExternalUser, columnKey: string) => {
    switch (columnKey) {
      case 'invitationStatus':
        const statusStyles = {
          'Accepted': 'bg-green-100 text-green-800',
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Declined': 'bg-red-100 text-red-800',
          'Expired': 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[item.invitationStatus as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
            {item.invitationStatus}
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
        data={[...mockUsersData].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        pagination={true}
        pageSize={10}
        loading={loadingData}
      />
    </div>
  );
};