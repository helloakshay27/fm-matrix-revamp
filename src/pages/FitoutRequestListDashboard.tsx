
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from 'react-router-dom';
import { FitoutRequestFilterDialog } from '@/components/FitoutRequestFilterDialog';
import { EditProjectModal } from '@/components/EditProjectModal';
import { StatusBadge } from '@/components/ui/status-badge';

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

export const FitoutRequestListDashboard = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<FitoutProject | null>(null);
  const [projects, setProjects] = useState<FitoutProject[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('fitoutProjects') || '[]');
    setProjects(savedProjects);
  }, []);

  const handleAddClick = () => {
    navigate('/transitioning/fitout/add-project');
  };

  const handleEditClick = (project: FitoutProject) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleEditSubmit = (updatedProject: FitoutProject) => {
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('fitoutProjects', JSON.stringify(updatedProjects));
    setShowEditModal(false);
    setSelectedProject(null);
  };

  const handleProjectSelect = (projectId: number, checked: boolean) => {
    if (checked) {
      setSelectedProjects([...selectedProjects, projectId]);
    } else {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(projects.map(p => p.id));
    } else {
      setSelectedProjects([]);
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

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Fitout Requests &gt; Fitout Request List</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">FITOUT REQUEST LIST</h1>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button 
          onClick={handleAddClick}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2 text-white stroke-white" />
          Add
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(true)}
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold w-12">
                <Checkbox 
                  checked={selectedProjects.length === projects.length && projects.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-[#C72030] data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                />
              </TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Tower</TableHead>
              <TableHead className="font-semibold">Unit</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">Master Status</TableHead>
              <TableHead className="font-semibold">Created on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={(checked) => handleProjectSelect(project.id, checked as boolean)}
                      className="border-[#C72030] data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#C72030] hover:bg-[#C72030]/10"
                      onClick={() => handleEditClick(project)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.user}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.tower}</TableCell>
                  <TableCell>{project.unit}</TableCell>
                  <TableCell>{project.supplier}</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusVariant(project.masterStatus)}>
                      {project.masterStatus}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{project.createdOn}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                  No fitout requests found. Click "Add" to create your first project.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Filter Dialog */}
      <FitoutRequestFilterDialog 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Edit Modal */}
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
