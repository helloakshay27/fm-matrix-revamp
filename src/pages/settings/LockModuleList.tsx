import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { moduleService, LockModule } from '@/services/moduleService';
import { CreateModuleDialog } from './CreateModuleDialog';
import { EditModuleDialog } from './EditModuleDialog';

export const LockModuleList = () => {
  const [modules, setModules] = useState<LockModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LockModule | null>(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await moduleService.fetchModules();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.show_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateModule = () => {
    setCreateDialogOpen(true);
  };

  const handleEditModule = (module: LockModule) => {
    setSelectedModule(module);
    setEditDialogOpen(true);
  };

  const handleDeleteModule = async (module: LockModule) => {
    if (!module.id) return;
    
    if (!confirm(`Are you sure you want to delete the module "${module.name}"?`)) {
      return;
    }

    try {
      await moduleService.deleteModule(module.id);
      toast.success('Module deleted successfully');
      fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  };

  const handleModuleCreated = () => {
    fetchModules();
    setCreateDialogOpen(false);
  };

  const handleModuleUpdated = () => {
    fetchModules();
    setEditDialogOpen(false);
    setSelectedModule(null);
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">Lock Modules</h1>
        <Button onClick={handleCreateModule} className="bg-[#C72030] hover:bg-[#A11D2A] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search modules by name, abbreviation, or display name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>

                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Display Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Abbreviation</TableHead>
                <TableHead className="font-semibold text-gray-700">Module Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading modules...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredModules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No modules found matching your search' : 'No modules found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredModules.map((module) => (
                  <TableRow key={module.id} className="hover:bg-gray-50">
                      <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditModule(module)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteModule(module)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{module.name}</TableCell>
                    <TableCell>{module.show_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {module.abbreviation}
                      </Badge>
                    </TableCell>
                    <TableCell>{module.module_type || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={module.active ? "default" : "secondary"}>
                        {module.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {module.rate ? `${module.rate} (${module.rate_type})` : '-'}
                    </TableCell>
                  
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Module Dialog */}
      <CreateModuleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onModuleCreated={handleModuleCreated}
      />

      {/* Edit Module Dialog */}
      {selectedModule && (
        <EditModuleDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          module={selectedModule}
          onModuleUpdated={handleModuleUpdated}
        />
      )}
    </div>
  );
};
