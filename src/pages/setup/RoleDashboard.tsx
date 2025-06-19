
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
import { Edit, Plus, Search } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

interface Department {
  id: number;
  name: string;
  status: boolean;
}

export const RoleDashboard = () => {
  const [selectedDropdown, setSelectedDropdown] = useState<'department' | 'role'>('department');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editDepartmentName, setEditDepartmentName] = useState('');

  const [roles, setRoles] = useState<Role[]>([
    { id: 154, name: 'Admin', description: 'Administrator role', status: true },
    { id: 155, name: 'Soft Skill Personal', description: 'Soft skills management', status: true },
    { id: 156, name: 'Staff', description: 'General staff role', status: true },
    { id: 293, name: 'Sales Manager', description: 'Sales management role', status: true },
    { id: 338, name: 'Security', description: 'Security personnel', status: true },
    { id: 381, name: 'Accountant', description: 'Accounting role', status: true },
    { id: 419, name: 'Supervisor', description: 'Supervisor role', status: true },
    { id: 458, name: 'Helpdesk Executive', description: 'Help desk support', status: true },
    { id: 459, name: 'Operation Manager', description: 'Operations management', status: true },
    { id: 461, name: 'Branch Manager', description: 'Branch management', status: true },
  ]);

  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: '1', status: true },
    { id: 2, name: 'ABC', status: false },
    { id: 3, name: 'abc', status: true },
    { id: 4, name: 'Accounts', status: true },
    { id: 5, name: 'Admin', status: true },
    { id: 6, name: 'Aeronautics department', status: true },
    { id: 7, name: 'BMC DEPARTMENT', status: true },
    { id: 8, name: 'Chokidar', status: true },
  ]);

  const toggleRoleStatus = (id: number) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, status: !role.status } : role
    ));
  };

  const toggleDepartmentStatus = (id: number) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, status: !dept.status } : dept
    ));
  };

  const handleAddDepartment = () => {
    if (newDepartmentName.trim()) {
      const newDepartment: Department = {
        id: departments.length + 1,
        name: newDepartmentName,
        status: true,
      };
      setDepartments([...departments, newDepartment]);
      setNewDepartmentName('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setEditDepartmentName(department.name);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDepartment = () => {
    if (editingDepartment && editDepartmentName.trim()) {
      setDepartments(departments.map(dept =>
        dept.id === editingDepartment.id
          ? { ...dept, name: editDepartmentName }
          : dept
      ));
      setIsEditDialogOpen(false);
      setEditingDepartment(null);
      setEditDepartmentName('');
    }
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          Account &gt; Role
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ROLE</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Dropdown Selection */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedDropdown('department')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedDropdown === 'department'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Department
            </button>
            <button
              onClick={() => setSelectedDropdown('role')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedDropdown === 'role'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Role
            </button>
          </div>

          {selectedDropdown === 'department' ? (
            <>
              {/* Department Header with Add Department button */}
              <div className="flex justify-between items-center mb-6">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="bg-[#8B5CF6] text-white p-3 -m-6 mb-4 rounded-t-lg">
                        Add Department
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <Label htmlFor="departmentName">Enter Department Name</Label>
                        <Input
                          id="departmentName"
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          placeholder="Enter Department Name"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleAddDepartment}
                          className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
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
                  <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
                    Submit
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="mb-4">
                <Input
                  placeholder="Search"
                  className="max-w-xs"
                />
              </div>

              {/* Department Table */}
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
                          onCheckedChange={() => toggleDepartmentStatus(department.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditDepartment(department)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <>
              {/* Role Header with Add Role button */}
              <div className="flex justify-between items-center mb-6">
                <a 
                  href="/setup/user-role/role/add"
                  className="inline-flex items-center px-4 py-2 bg-[#C72030] hover:bg-[#A01020] text-white rounded-md text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </a>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded">
                    <span className="text-orange-600 font-medium">All Functions</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded">
                    <span className="text-orange-600 font-medium">Inventory</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded">
                    <span className="text-orange-600 font-medium">Setup</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded">
                    <span className="text-orange-600 font-medium">Quickgate</span>
                  </div>
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option>25 entries per page</option>
                    <option>50 entries per page</option>
                    <option>100 entries per page</option>
                  </select>
                </div>
              </div>

              {/* Search */}
              <div className="mb-4 flex items-center gap-2">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search Role"
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  Search Role
                </Button>
              </div>

              {/* Role Table */}
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Role Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Description</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-gray-50">
                      <TableCell>{role.id} - {role.name}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <Switch
                          checked={role.status}
                          onCheckedChange={() => toggleRoleStatus(role.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>

        {/* Edit Department Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="bg-[#8B5CF6] text-white p-3 -m-6 mb-4 rounded-t-lg">
                Edit Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="editDepartmentName">Department Name</Label>
                <Input
                  id="editDepartmentName"
                  value={editDepartmentName}
                  onChange={(e) => setEditDepartmentName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleUpdateDepartment}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6"
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
