import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
}

export const ProjectTeamsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [projectTeamsData, setProjectTeamsData] = useState<ProjectTeam[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    sNo: true,
    actions: true,
    teamName: true,
    teamLead: true,
    teamMembers: true
  });

  const [filteredTeams, setFilteredTeams] = useState<ProjectTeam[]>([]);

  // Load project teams from API (mock implementation)
  const loadProjectTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading project teams...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration - replace with actual API calls
      const mockTeamsData: ProjectTeam[] = [
        {
          id: 1,
          teamName: 'Frontend Development Team',
          teamLead: 'John Doe',
          teamMembers: ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Lisa Davis'],
          totalMembers: 4,
          created_on: '15/09/2025, 10:30 AM',
          created_by: 'Admin'
        },
        {
          id: 2,
          teamName: 'Backend Development Team',
          teamLead: 'Jane Smith',
          teamMembers: ['Jane Smith', 'David Brown', 'Alex Chen', 'Maria Rodriguez'],
          totalMembers: 4,
          created_on: '14/09/2025, 02:15 PM',
          created_by: 'Admin'
        },
        {
          id: 3,
          teamName: 'QA Testing Team',
          teamLead: 'Robert Wilson',
          teamMembers: ['Robert Wilson', 'Emma Johnson', 'Tom Anderson'],
          totalMembers: 3,
          created_on: '13/09/2025, 09:45 AM',
          created_by: 'Admin'
        },
        {
          id: 4,
          teamName: 'DevOps Team',
          teamLead: 'Sophie Williams',
          teamMembers: ['Sophie Williams', 'David Thompson'],
          totalMembers: 2,
          created_on: '12/09/2025, 03:20 PM',
          created_by: 'Admin'
        }
      ];
      
      setProjectTeamsData(mockTeamsData);
      setFilteredTeams(mockTeamsData);
    } catch (error) {
      console.error('Failed to load project teams:', error);
      toast({
        title: "Error",
        description: "Failed to load project teams",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Pagination calculations
  const totalRecords = filteredTeams.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = filteredTeams.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    loadProjectTeams();
  }, [loadProjectTeams]);

  useEffect(() => {
    const filtered = projectTeamsData.filter(team =>
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.teamLead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.teamMembers.some(member => 
        member.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredTeams(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, projectTeamsData]);

  const handleAdd = () => {
    navigate('/settings/manage-users/project-teams/add');
  };

  const handleEdit = (team: ProjectTeam) => {
    navigate(`/settings/manage-users/project-teams/edit/${team.id}`);
  };

  const handleRefresh = async () => {
    setSearchTerm('');
    setCurrentPage(1);
    await loadProjectTeams();
    toast({
      title: "Refreshed",
      description: "Data has been refreshed successfully",
    });
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  // Column definitions for visibility control
  const columns = [
    { key: 'sNo', label: 'S.No.', visible: visibleColumns.sNo },
    { key: 'actions', label: 'Actions', visible: visibleColumns.actions },
    { key: 'teamName', label: 'Team Name', visible: visibleColumns.teamName },
    { key: 'teamLead', label: 'Team Lead', visible: visibleColumns.teamLead },
    { key: 'teamMembers', label: 'Team Members (TL+Members)', visible: visibleColumns.teamMembers }
  ];

  const formatTeamMembers = (members: string[]) => {
    if (members.length <= 3) {
      return members.join(', ');
    }
    return `${members.slice(0, 2).join(', ')} +${members.length - 2} more`;
  };

  return (
    <>
      <div className="p-6 min-h-screen">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAdd}
            className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleRefresh}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              {visibleColumns.sNo && <TableHead className="w-20">S.No.</TableHead>}
              {visibleColumns.actions && <TableHead className="w-20">Actions</TableHead>}
              {visibleColumns.teamName && <TableHead className="w-48">Team Name</TableHead>}
              {visibleColumns.teamLead && <TableHead className="w-40">Team Lead</TableHead>}
              {visibleColumns.teamMembers && <TableHead className="w-64">Team Members (TL+Members)</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading project teams...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  {searchTerm ? `No project teams found matching "${searchTerm}"` : 'No project teams found'}
                  <br />
                  <span className="text-sm">Click "Add" to create your first project team</span>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((team, index) => (
                <TableRow key={team.id} className="hover:bg-gray-50">
                  {visibleColumns.sNo && (
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(team)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.teamName && (
                    <TableCell className="font-medium">
                      {team.teamName}
                    </TableCell>
                  )}
                  {visibleColumns.teamLead && <TableCell>{team.teamLead}</TableCell>}
                  {visibleColumns.teamMembers && (
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600">
                          {formatTeamMembers(team.teamMembers)}
                        </span>
                        <span className="text-xs text-gray-400">
                          Total: {team.totalMembers} members
                        </span>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(totalPages, 10) },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 10 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      </div>
    </>
  );
};