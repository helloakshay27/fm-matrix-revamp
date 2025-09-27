import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { deleteProjectRole, fetchProjectRoles, updateProjectRole } from '@/store/slices/projectRoleSlice';
import { format } from 'date-fns';
import ProjectRoleModal from '@/components/ProjectRoleModal';

interface Role {
  id: number;
  name: string;
  created_at: string;
  active: boolean;
}

const columns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Role Name',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'created_at',
    label: 'Created On',
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

export const RolesPage = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl')
  const token = localStorage.getItem('token')

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  const [record, setRecord] = useState<Role>({
    id: 0,
    name: '',
    created_at: '',
    active: false
  });

  const getRoles = async () => {
    setLoadingData(true)
    try {
      const response = await dispatch(fetchProjectRoles({ baseUrl, token })).unwrap();
      setRolesData(response)
    } catch (error) {
      console.log(error)
      toast.error(error)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    getRoles();
  }, [])

  const handleClose = () => {
    setIsEditing(false);
    setShowAddModal(false);
    setRecord({
      id: 0,
      name: '',
      created_at: '',
      active: false
    });
  };

  const handleCheckboxChange = async (item: any) => {
    const newStatus = !item.active;
    const itemId = item.id;

    if (updatingStatus[itemId]) return;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      await dispatch(
        updateProjectRole({
          baseUrl,
          token,
          id: itemId,
          data: {
            lock_role: {
              active: newStatus,
            },
          },
        })
      ).unwrap();

      setRolesData((prevData: any[]) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, active: newStatus } : row
        )
      );

      toast.success(`Role ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error(error || "Failed to update active status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await dispatch(deleteProjectRole({ baseUrl, token, id })).unwrap();
      toast.success("Role deleted successfully");
      getRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(error || "Failed to delete role. Please try again.");
    }
  };

  const renderCell = (item: Role, columnKey: string) => {
    switch (columnKey) {
      case 'active':
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() => handleCheckboxChange(item)}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={updatingStatus[item.id]}
          />
        );
      case 'created_at':
        return <span>{item.created_at && format(item.created_at, 'dd/MM/yyyy hh:mm a')}</span>
      default:
        return item[columnKey as keyof Role] || '-';
    }
  };

  const renderActions = (item: Role) => {
    return (
      <div className="flex gap-2">
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
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => deleteRole(item.id.toString())}
        >
          <Trash className="w-4 h-4" />
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
        data={[...rolesData].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        pagination={true}
        pageSize={10}
        loading={loadingData}
      />

      <ProjectRoleModal
        showAddModal={showAddModal}
        handleClose={handleClose}
        isEditing={isEditing}
        record={record}
        getRoles={getRoles}
      />
    </div>
  );
};