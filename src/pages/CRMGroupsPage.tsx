import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddGroupModal } from '@/components/AddGroupModal';
import { EditGroupModal } from '@/components/EditGroupModal';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserGroups } from '@/store/slices/userGroupSlice';

interface Group {
  id: number;
  groupName: string;
  members: number;
  image: string;
  status: boolean;
}

const mapResponseToGroup = (response: any): Group => ({
  id: response.id,
  groupName: response.name,
  members: response.group_members.length,
  image: "",
  status: response.active,
});

const CRMGroupsPage = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchUserGroups({ baseUrl, token })).unwrap();
      const mappedGroups = response.map(mapResponseToGroup);
      setGroups(mappedGroups);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch groups");
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, baseUrl, token]);

  const columns: ColumnConfig[] = [
    {
      key: 'id',
      label: 'Id',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'groupName',
      label: 'Group Name',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'members',
      label: 'Members',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
  ];

  const renderActions = (group: Group) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:text-blue-700"
        onClick={() => handleViewGroup(group.id)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:text-blue-700"
        onClick={() => handleEditGroup(group)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={() => handleDeleteGroup(group.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  const handleStatusToggle = async (id: number) => {
    try {
      const response = await fetch(`https://${baseUrl}/groups/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: !groups.find((group) => group.id === id)?.status }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle status');
      }

      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === id ? { ...group, status: !group.status } : group
        )
      );
      toast.success('Group status updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update group status');
    }
  };

  const renderCell = (item: Group, columnKey: string) => {
    if (columnKey === 'image') {
      return (
        <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center mx-auto">
          <div className="w-6 h-6 rounded-full bg-orange-400"></div>
        </div>
      );
    }
    if (columnKey === 'status') {
      return (
        <div className="flex items-center justify-center">
          <div
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.status ? 'bg-green-500' : 'bg-gray-300'
              }`}
            onClick={() => handleStatusToggle(item.id)}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.status ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </div>
        </div>
      );
    }
    return item[columnKey as keyof Group];
  };

  const handleViewGroup = (groupId: number) => {
    navigate(`/crm/groups/details/${groupId}`);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const handleDeleteGroup = (groupId: number) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      setGroups(groups.filter((group) => group.id !== groupId));
      console.log('Deleted group with ID:', groupId);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Groups</h1>
        </div>
      </div>

      <EnhancedTable
        data={[...groups].reverse() || []}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="crm-groups-table"
        className="bg-white rounded-lg border border-gray-200"
        emptyMessage="No groups available"
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search groups..."
        enableExport={true}
        exportFileName="groups"
        pagination={true}
        pageSize={5}
        leftActions={
          <Button
            className="bg-[#C72030] hover:bg-[#B01E2A] text-white"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        }
      />

      <AddGroupModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} fetchGroups={fetchData} />
      <EditGroupModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        groupData={selectedGroup}
      />
    </div>
  );
};

export default CRMGroupsPage;