
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
import { Edit, Plus } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  status: boolean;
}

export const DepartmentDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
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

  const handleSubmit = () => {
    if (departmentName.trim()) {
      const newDepartment: Department = {
        id: departments.length + 1,
        name: departmentName,
        status: true,
      };
      setDepartments([...departments, newDepartment]);
      setDepartmentName('');
      setIsDialogOpen(false);
    }
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      onClick={handleSubmit}
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
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SetupLayout>
  );
};
