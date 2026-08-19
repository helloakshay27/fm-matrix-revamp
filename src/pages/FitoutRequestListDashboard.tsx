import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { FitoutRequestFilterDialog } from '@/components/FitoutRequestFilterDialog';
import { EditProjectModal } from '@/components/EditProjectModal';
import { StatusBadge } from '@/components/ui/status-badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface FitoutProject {
  id: number;
  user: string;
  category: string;
  description: string;
  tower: string;
  unit: string;
  supplier: string;
  masterStatus: string;
  createdOn: string;
}

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, hideable: true, defaultVisible: true },
  { key: 'user', label: 'User', sortable: true, hideable: true, defaultVisible: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, defaultVisible: true },
  { key: 'description', label: 'Description', sortable: true, hideable: true, defaultVisible: true },
  { key: 'tower', label: 'Tower', sortable: true, hideable: true, defaultVisible: true },
  { key: 'unit', label: 'Unit', sortable: true, hideable: true, defaultVisible: true },
  { key: 'supplier', label: 'Supplier', sortable: true, hideable: true, defaultVisible: true },
  { key: 'masterStatus', label: 'Master Status', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdOn', label: 'Created on', sortable: true, hideable: true, defaultVisible: true },
];

export const FitoutRequestListDashboard = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<FitoutProject | null>(null);
  const [projects, setProjects] = useState<FitoutProject[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('fitoutProjects') || '[]');
    setProjects(savedProjects);
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    const q = searchTerm.toLowerCase();
    return projects.filter((project) =>
      Object.values(project).some((value) =>
        String(value).toLowerCase().includes(q)
      )
    );
  }, [projects, searchTerm]);

  const handleAddClick = () => {
    navigate('/transitioning/fitout/add-project');
  };

  const handleEditClick = (project: FitoutProject) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleEditSubmit = (updatedProject: FitoutProject) => {
    const updatedProjects = projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('fitoutProjects', JSON.stringify(updatedProjects));
    setShowEditModal(false);
    setSelectedProject(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(filteredProjects.map((p) => String(p.id)));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects((prev) => [...prev, id]);
    } else {
      setSelectedProjects((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'approved':
      case 'active':
        return 'accepted';
      case 'rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  const renderCell = (item: FitoutProject, columnKey: string) => {
    if (columnKey === 'masterStatus') {
      return (
        <StatusBadge status={getStatusVariant(item.masterStatus)}>
          {item.masterStatus}
        </StatusBadge>
      );
    }
    return <span>{item[columnKey as keyof FitoutProject] ?? '-'}</span>;
  };

  const renderActions = (item: FitoutProject) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-black hover:bg-gray-100"
      onClick={(e) => {
        e.stopPropagation();
        handleEditClick(item);
      }}
      title="Edit"
    >
      <Edit className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">
          Fitout Requests &gt; Fitout Request List
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Fitout Requests
        </h1>
      </div>

      <EnhancedTable
        data={filteredProjects}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="fitout-request-table"
        emptyMessage="No fitout requests found. Click 'Add' to create your first project."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search fitout requests..."
        enableSearch
        pagination
        pageSize={10}
        selectable
        selectedItems={selectedProjects}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={(item) => String(item.id)}
        onFilterClick={() => setShowFilters(true)}
        leftActions={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddClick}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
        }
      />

      <FitoutRequestFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      <EditProjectModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};
