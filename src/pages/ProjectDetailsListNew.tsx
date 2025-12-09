import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

interface Project {
  id: number;
  project_name: string;
  property_type: string;
  SFDC_Project_Id: string;
  status: string;
  configurations: Array<{ name: string }>;
  project_tag: string;
  published: boolean;
  show_on_home: boolean;
}

const ProjectDetailsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const fetchProjects = useCallback(async (page: number, search: string) => {
    setLoading(true);
    setIsSearching(!!search);
    setError(null);
    try {
      const response = await fetch(getFullUrl('/get_projects_all.json'), {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      const data = await response.json();
      const projectsData = data?.projects || [];
      
      // Client-side search filtering
      let filteredProjects = projectsData;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProjects = projectsData.filter((project: Project) =>
          project.project_name?.toLowerCase().includes(searchLower) ||
          project.property_type?.toLowerCase().includes(searchLower) ||
          project.SFDC_Project_Id?.toLowerCase().includes(searchLower) ||
          project.status?.toLowerCase().includes(searchLower) ||
          project.project_tag?.toLowerCase().includes(searchLower)
        );
      }
      
      // Client-side pagination
      const itemsPerPage = 10;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
      
      setProjects(paginatedProjects);
      setCurrentPage(page);
      setTotalPages(Math.ceil(filteredProjects.length / itemsPerPage));
      setTotalCount(filteredProjects.length);
      
      // Cache all projects
      sessionStorage.setItem('cached_projects', JSON.stringify(projectsData));
    } catch (err) {
      setError('Failed to fetch projects.');
      toast.error('Failed to fetch projects.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchProjects]);

  const handleGlobalSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleAddProject = () => navigate('/setup-member/project-details-create');
  const handleViewProject = (id: number) => navigate(`/setup-member/project-details-view/${id}`);
  const handleEditProject = (id: number) => navigate(`/setup-member/project-details-edit/${id}`);
  
  const handleClearSelection = () => { setShowActionPanel(false); };

  const columns = [
    { key: 'actions', label: 'Action', sortable: false },
    { key: 'id', label: 'ID', sortable: true },
    { key: 'project_name', label: 'Project Name', sortable: true },
    { key: 'property_type', label: 'Property Type', sortable: true },
    { key: 'SFDC_Project_Id', label: 'SFDC Project ID', sortable: true },
    { key: 'status', label: 'Construction Status', sortable: true },
    { key: 'configurations', label: 'Configuration Type', sortable: true },
    { key: 'project_tag', label: 'Project Tag', sortable: true },
  ];

  const renderCell = (item: Project, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleViewProject(item.id)} title="View">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleEditProject(item.id)} title="Edit">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'configurations':
        const configs = item.configurations;
        if (Array.isArray(configs) && configs.length > 0) {
          return configs.map(c => c.name).join(', ');
        }
        return '-';
      case 'SFDC_Project_Id':
        return item.SFDC_Project_Id ?? '-';
      case 'status':
        return item.status ?? '-';
      case 'project_tag':
        return item.project_tag ?? '-';
      default:
        return item[columnKey as keyof Project] as React.ReactNode ?? '-';
    }
  };

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Button 
        onClick={() => setShowActionPanel((prev) => !prev)}
        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
        Action
      </Button>
    </div>
  );

  const renderListTab = () => (
    <div className="space-y-4">
      {showActionPanel && (
        <SelectionPanel
          onAdd={handleAddProject}
          onClearSelection={handleClearSelection}
        />
      )}
      <>
        <EnhancedTable
          data={projects}
          columns={columns}
          renderCell={renderCell}
          pagination={false}
          enableExport={true}
          exportFileName="projects"
          storageKey="projects-table"
          enableGlobalSearch={true}
          onGlobalSearch={handleGlobalSearch}
          searchPlaceholder="Search projects (name, type, ID, status, tag)..."
          leftActions={renderCustomActions()}
          loading={isSearching || loading}
          loadingMessage={isSearching ? "Searching projects..." : "Loading projects..."}
        />
        {!searchTerm && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <Toaster position="top-right" richColors closeButton />
      <div className="w-full">
        {renderListTab()}
      </div>
    </div>
  );
};

export default ProjectDetailsList;
