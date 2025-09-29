import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Eye, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchProjectTeams } from '@/store/slices/projectTeamsSlice';

interface ProjectTeam {
  id: number;
  teamName: string;
  teamLead: string;
  teamMembers: string[];
  totalMembers: number;
  created_on: string;
  created_by: string;
  active: boolean;
}

const columns: ColumnConfig[] = [
  {
    key: 'teamName',
    label: 'Team Name',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'teamLead',
    label: 'Team Lead',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'teamMembers',
    label: 'Team Members (TL+Members)',
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

export const ProjectTeamsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState<ProjectTeam | {}>({});
  const [projectTeamsData, setProjectTeamsData] = useState<ProjectTeam[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchProjectTeams({ baseUrl, token })).unwrap();
      setProjectTeamsData(response);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderCell = (item: ProjectTeam, columnKey: string) => {
    switch (columnKey) {
      case 'teamMembers':
        const formatTeamMembers = (members: string[]) => {
          if (members.length <= 3) {
            return members.join(', ');
          }
          return `${members.slice(0, 2).join(', ')} +${members.length - 2} more`;
        };
        return (
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">
              {formatTeamMembers(item.teamMembers)}
            </span>
            <span className="text-xs text-gray-400">
              Total: {item.totalMembers} members
            </span>
          </div>
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
        return item[columnKey as keyof ProjectTeam] || '-';
    }
  };

  const renderActions = (item: ProjectTeam) => {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/settings/manage-users/project-teams/${item.id}`)}
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
      onClick={() => navigate(`/settings/manage-users/project-teams/add`)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={[...projectTeamsData].reverse()}
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