
import React, { useState, useEffect } from 'react';
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
import { Edit, Plus, Loader2 } from 'lucide-react';

import { departmentService, Department } from '@/services/departmentService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDepartmentData, addDepartment, updateDepartment } from '@/store/slices/departmentSlice';

interface LocalDepartment extends Department {
  id: number;
  name: string;
  status: boolean;
}

export const DepartmentDashboard = () => {
  const dispatch = useAppDispatch();
  const { data: departmentData, loading, error } = useAppSelector((state) => state.department);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<LocalDepartment | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState<LocalDepartment[]>([]);

  // Transform API data to local format
  const transformDepartments = (apiDepartments: Department[]): LocalDepartment[] => {
    return apiDepartments.map((dept) => ({
      id: dept.id || 0, // Use the actual record ID from API
      name: dept.department_name,
      status: dept.active,
      department_name: dept.department_name,
      active: dept.active
    }));
  };

  // Fetch departments from Redux store
  useEffect(() => {
    dispatch(fetchDepartmentData());
  }, [dispatch]);

  // Update local departments when Redux data changes
  useEffect(() => {
    if (departmentData && Array.isArray(departmentData)) {
      const transformedDepartments = transformDepartments(departmentData);
      setDepartments(transformedDepartments);
    } else if (error) {
      // Fallback to dummy data on error
      setDepartments([
        { id: 1, name: 'Sales', status: true, department_name: 'Sales', active: true },
        { id: 2, name: 'Marketing', status: false, department_name: 'Marketing', active: false },
      ]);
    }
  }, [departmentData, error]);

  const handleSubmit = async () => {
    if (departmentName.trim()) {
      try {
        // Call the API to add department
        await dispatch(addDepartment(departmentName.trim())).unwrap();
        
        // Clear form and close dialog
        setDepartmentName('');
        setIsDialogOpen(false);
        
        // Refresh the department list
        dispatch(fetchDepartmentData());
      } catch (error) {
        console.error('Error adding department:', error);
        // You can add toast notification here if needed
      }
    }
  };

  const handleEditSubmit = async () => {
    if (editDepartmentName.trim() && editingDepartment) {
      try {
        // Call the API to update department
        await dispatch(updateDepartment({ 
          id: editingDepartment.id, 
          departmentName: editDepartmentName.trim() 
        })).unwrap();
        
        // Clear form and close dialog
        setEditDepartmentName('');
        setEditingDepartment(null);
        setIsEditDialogOpen(false);
        
        // Refresh the department list
        dispatch(fetchDepartmentData());
      } catch (error) {
        console.error('Error updating department:', error);
        // You can add toast notification here if needed
      }
    }
  };

  const openEditDialog = (department: LocalDepartment) => {
    setEditingDepartment(department);
    setEditDepartmentName(department.name);
    setIsEditDialogOpen(true);
  };

  const toggleStatus = (id: number) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, status: !dept.status } : dept
    ));
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">DEPARTMENT</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading departments...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{typeof error === 'string' ? error : 'Failed to fetch departments'}</p>
          </div>
        )}

        {/* Content - only show if not loading */}
        {!loading && (
          <>
        {/* Header with Add Department button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
              <DialogHeader>
                <DialogTitle className="bg-[#C72030] text-white p-3 -m-6 mb-4 rounded-t-lg text-sm sm:text-base">
                  Add Department
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="departmentName" className="text-sm">Enter Department Name</Label>
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
                    className="bg-green-600 hover:bg-green-700 text-white px-6 w-full sm:w-auto"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <select className="border border-gray-300 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm flex-1 sm:flex-none">
              <option>25 entries per page</option>
              <option>50 entries per page</option>
              <option>100 entries per page</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs"
          />
        </div>

        {/* Mobile Cards View */}
        <div className="block sm:hidden space-y-3">
          {filteredDepartments.map((department) => (
            <div key={department.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Status: {department.status ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#C72030] hover:text-[#A11D2A] hover:bg-[#C72030]/10 p-2"
                  onClick={() => openEditDialog(department)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Toggle Status</span>
                <Switch
                  checked={department.status}
                  onCheckedChange={() => toggleStatus(department.id)}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={department.status}
                      onCheckedChange={() => toggleStatus(department.id)}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#C72030] hover:text-[#A11D2A] hover:bg-[#C72030]/10"
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
          <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-semibold">Edit Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editDepartmentName" className="text-sm">Department Name</Label>
                <Input
                  id="editDepartmentName"
                  value={editDepartmentName}
                  onChange={(e) => setEditDepartmentName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleEditSubmit}
                  className="bg-[#C72030] hover:bg-[#A11D2A] text-white px-6 w-full sm:w-auto"
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
          </>
        )}
      </div>
    </div>
  );
};
