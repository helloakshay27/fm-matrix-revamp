import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { AddBannerModal } from '@/components/AddBannerModal';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Eye, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/LayoutContext';

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
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState<ProjectTeam | {}>({});
  const [projectTeamsData, setProjectTeamsData] = useState<ProjectTeam[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  const loadProjectTeams = useCallback(async () => {
    try {
      setLoadingData(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockTeamsData: ProjectTeam[] = [
        {
          id: 1,
          teamName: 'Frontend Development Team',
          teamLead: 'John Doe',
          teamMembers: ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Lisa Davis'],
          totalMembers: 4,
          created_on: '15/09/2025, 10:30 AM',
          created_by: 'Admin',
          active: true,
        },
        {
          id: 2,
          teamName: 'Backend Development Team',
          teamLead: 'Jane Smith',
          teamMembers: ['Jane Smith', 'David Brown', 'Alex Chen', 'Maria Rodriguez'],
          totalMembers: 4,
          created_on: '14/09/2025, 02:15 PM',
          created_by: 'Admin',
          active: true,
        },
        {
          id: 3,
          teamName: 'QA Testing Team',
          teamLead: 'Robert Wilson',
          teamMembers: ['Robert Wilson', 'Emma Johnson', 'Tom Anderson'],
          totalMembers: 3,
          created_on: '13/09/2025, 09:45 AM',
          created_by: 'Admin',
          active: false,
        },
        {
          id: 4,
          teamName: 'DevOps Team',
          teamLead: 'Sophie Williams',
          teamMembers: ['Sophie Williams', 'David Thompson'],
          totalMembers: 2,
          created_on: '12/09/2025, 03:20 PM',
          created_by: 'Admin',
          active: true,
        },
      ];

      setProjectTeamsData(mockTeamsData);
    } catch (error) {
      console.error('Failed to load project teams:', error);
      toast({
        title: "Error",
        description: "Failed to load project teams",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    setCurrentSection('Settings');
    loadProjectTeams();
  }, [setCurrentSection, loadProjectTeams]);

  const handleCheckboxChange = async (item: ProjectTeam) => {
    const newStatus = !item.active;
    const itemId = item.id;

    if (updatingStatus[itemId]) return;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProjectTeamsData((prevData) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, active: newStatus } : row
        )
      );

      toast({
        title: "Success",
        description: `Team ${newStatus ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error updating active status:", error);
      toast({
        title: "Error",
        description: "Failed to update active status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

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
            onCheckedChange={() => handleCheckboxChange(item)}
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
      onClick={() => setShowAddModal(true)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  const handleAddEditSubmit = async () => {
    // This would be implemented in AddBannerModal
    await loadProjectTeams();
  };

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

      <AddBannerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setIsEditing(false);
          setRecord({});
        }}
        fetchData={handleAddEditSubmit}
        isEditing={isEditing}
        record={record}
      />
    </div>
  );
};