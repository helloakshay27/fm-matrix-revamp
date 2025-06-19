
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Edit, Plus, X } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  status: boolean;
}

export const DepartmentDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: '1', status: true },
    { id: 2, name: 'ABC', status: false },
    { id: 3, name: 'abc', status: true },
    { id: 4, name: 'Accounts', status: true },
    { id: 5, name: 'Admin', status: true },
    { id: 6, name: 'Aeronautics department', status: true },
    { id: 7, name: 'BMC DEPARTMENT', status: true },
    { id: 8, name: 'Chokidar', status: true },
    { id: 9, name: 'DEMO DEPT', status: true },
  ]);

  const handleAddSubmit = () => {
    if (departmentName.trim()) {
      const newDepartment: Department = {
        id: departments.length + 1,
        name: departmentName,
        status: true,
      };
      setDepartments([...departments, newDepartment]);
      setDepartmentName('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditSubmit = () => {
    if (editingDepartment && editingDepartment.name.trim()) {
      setDepartments(departments.map(dept => 
        dept.id === editingDepartment.id ? editingDepartment : dept
      ));
      setEditingDepartment(null);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (department: Department) => {
    setEditingDepartment({ ...department });
    setIsEditDialogOpen(true);
  };

  const toggleStatus = (id: number) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, status: !dept.status } : dept
    ));
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">DEPARTMENT</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Header with Add Department button */}
          <div className="flex justify-between items-center mb-6">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="bg-purple-600 text-white p-3 -m-6 mb-4 rounded-t-lg">
                    Add Department
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="departmentName">Enter Department Name</Label>
                    <Input
                      id="departmentName"
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      placeholder="Enter Department Name"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAddSubmit}
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="flex items-center gap-4">
              <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                <option>25 entries per page</option>
                <option>50 entries per page</option>
                <option>100 entries per page</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search"
              className="max-w-xs"
            />
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id} className="hover:bg-gray-50">
                  <TableCell>{department.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={department.status}
                      onCheckedChange={() => toggleStatus(department.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openEditDialog(department)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Department Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md [&>button]:hidden">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <DialogTitle className="text-lg font-semibold">Edit Details</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="editDepartmentName" className="text-sm font-medium text-gray-700">
                  Department Name
                </Label>
                <Input
                  id="editDepartmentName"
                  value={editingDepartment?.name || ''}
                  onChange={(e) => setEditingDepartment(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                  className="mt-1"
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleEditSubmit}
                  className="w-full h-10 text-white"
                  style={{ backgroundColor: '#7c3aed' }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SetupLayout>
  );
};
