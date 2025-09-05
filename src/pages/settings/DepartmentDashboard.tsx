import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Edit, Plus } from 'lucide-react';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Department } from '@/services/departmentService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDepartmentData, addDepartment, updateDepartment } from '@/store/slices/departmentSlice';
import { toast } from 'sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

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
      id: dept.id || 0,
      name: dept.department_name,
      status: dept.active,
      department_name: dept.department_name,
      active: dept.active,
    }));
  };

  useEffect(() => {
    dispatch(fetchDepartmentData());
  }, [dispatch]);

  useEffect(() => {
    if (departmentData && Array.isArray(departmentData)) {
      const transformedDepartments = transformDepartments(departmentData);
      setDepartments(transformedDepartments.reverse());
    } else if (error) {
      setDepartments([]);
    }
  }, [departmentData, error]);

  const handleSubmit = async () => {
    if (!departmentName.trim()) {
      toast.error('Please enter a department name.');
      return;
    }

    try {
      await dispatch(addDepartment(departmentName.trim())).unwrap();
      setDepartmentName('');
      setIsDialogOpen(false);
      toast.success('Department added successfully!');
      dispatch(fetchDepartmentData());
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const handleEditSubmit = async () => {
    if (editDepartmentName.trim() && editingDepartment) {
      try {
        await dispatch(
          updateDepartment({
            id: editingDepartment.id,
            departmentName: editDepartmentName.trim(),
          })
        ).unwrap();
        setEditDepartmentName('');
        setEditingDepartment(null);
        setIsEditDialogOpen(false);
        toast.success('Department updated successfully!');
        dispatch(fetchDepartmentData());
      } catch (error) {
        console.error('Error updating department:', error);
      }
    }
  };

  const openEditDialog = (department: LocalDepartment) => {
    setEditingDepartment(department);
    setEditDepartmentName(department.name);
    setIsEditDialogOpen(true);
  };

  const toggleStatus = (id: number) => {
    setDepartments(
      departments.map((dept) =>
        dept.id === id ? { ...dept, status: !dept.status } : dept
      )
    );
  };

  // Define columns for EnhancedTable
  const columns: ColumnConfig[] = [
    {
      key: 'name',
      label: 'Department',
      sortable: true,
      defaultVisible: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      defaultVisible: true,
    },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'status':
        return (
          <Switch
            checked={item.status}
            onCheckedChange={() => toggleStatus(item.id)}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
          />
        );
      default:
        return item[columnKey];
    }
  }

  const renderActions = (item: any) => (
    <div className="flex gap-2 w-20 justify-center">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={(e) => {
          e.stopPropagation();
          openEditDialog(item);
        }}
      >
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <>
      <Button className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto" onClick={() => setIsDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Department
      </Button>
    </>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">DEPARTMENT</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{typeof error === 'string' ? error : 'Failed to fetch departments'}</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Header with Add Department button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
                  <DialogHeader>
                    <DialogTitle className="bg-[#C72030] text-white p-3 -m-6 mb-4 rounded-t-lg text-sm sm:text-base">
                      Add Department
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div>
                      <Label htmlFor="departmentName" className="text-sm">
                        Department Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="departmentName"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        placeholder="Department Name"
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
            </div>

            {/* Mobile Cards View */}
            <div className="block sm:hidden space-y-3">
              {departments
                .filter((department) =>
                  department.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((department) => (
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

            {/* Desktop Table View with EnhancedTable */}
            <div className="hidden sm:block overflow-x-auto">
              <EnhancedTable
                data={departments}
                columns={columns}
                searchTerm={searchTerm}
                renderCell={renderCell}
                renderActions={renderActions}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search departments..."
                enableSearch={true}
                enableExport={false} // Set to true if you want to enable export
                pagination={true}
                pageSize={10}
                loading={loading}
                leftActions={leftActions}
                emptyMessage="No departments found"
                storageKey="department-table"
                className="w-full"
              />
            </div>

            {/* Edit Department Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg font-semibold">Edit Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editDepartmentName" className="text-sm">
                      Department Name<span className="text-red-500">*</span>
                    </Label>
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