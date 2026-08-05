import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Department } from "@/services/departmentService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDepartmentData,
  addDepartment,
  updateDepartment,
} from "@/store/slices/departmentSlice";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import {
  DepartmentFilterDialog,
  type DepartmentFilters,
} from "@/components/DepartmentFilterDialog";

interface LocalDepartment extends Department {
  id: number;
  name: string;
  status: boolean;
}

const columns: ColumnConfig[] = [
  {
    key: "name",
    label: "Department",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    defaultVisible: true,
  },
];

const emptyFilters: DepartmentFilters = {
  name: "",
  status: "",
};

export const DepartmentDashboard = () => {
  const dispatch = useAppDispatch();
  const { shouldShow } = useDynamicPermissions();

  const { data: departmentData, loading, error } = useAppSelector(
    (state) => state.department
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [editingDepartment, setEditingDepartment] =
    useState<LocalDepartment | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DepartmentFilters>(emptyFilters);
  const [departments, setDepartments] = useState<LocalDepartment[]>([]);

  const transformDepartments = (
    apiDepartments: Department[]
  ): LocalDepartment[] => {
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

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => {
      const name = String(department.name || "").toLowerCase();
      const status = department.status ? "active" : "inactive";

      if (filters.name && !name.includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.status && status !== filters.status.toLowerCase()) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return name.includes(q) || status.includes(q);
      }

      return true;
    });
  }, [departments, filters, searchTerm]);

  const handleSubmit = async () => {
    if (!departmentName.trim()) {
      toast.error("Please enter a department name.");
      return;
    }

    try {
      await dispatch(addDepartment(departmentName.trim())).unwrap();
      setDepartmentName("");
      setIsDialogOpen(false);
      toast.success("Department added successfully!");
      dispatch(fetchDepartmentData());
    } catch (err) {
      console.error("Error adding department:", err);
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
        setEditDepartmentName("");
        setEditingDepartment(null);
        setIsEditDialogOpen(false);
        toast.success("Department updated successfully!");
        dispatch(fetchDepartmentData());
      } catch (err) {
        console.error("Error updating department:", err);
      }
    }
  };

  const openEditDialog = (department: LocalDepartment) => {
    setEditingDepartment(department);
    setEditDepartmentName(department.name);
    setIsEditDialogOpen(true);
  };

  const toggleStatus = (id: number) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, status: !dept.status } : dept
      )
    );
  };

  const handleApplyFilters = (nextFilters: DepartmentFilters) => {
    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    setFilters(emptyFilters);
  };

  const renderCell = (item: LocalDepartment, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <span className="font-medium text-gray-900">{item.name}</span>;
      case "status":
        return (
          <div className="flex items-center">
            <Switch
              checked={item.status}
              onCheckedChange={() => toggleStatus(item.id)}
            />
          </div>
        );
      default:
        return (item as Record<string, unknown>)[columnKey] != null
          ? String((item as Record<string, unknown>)[columnKey])
          : "-";
    }
  };

  const renderActions = (item: LocalDepartment) => (
    <div className="flex items-center justify-center gap-1">
      {shouldShow("Department", "update") && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            openEditDialog(item);
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const leftActions = shouldShow("Department", "create") ? (
    <Button
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
      onClick={() => setIsDialogOpen(true)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Department
    </Button>
  ) : null;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
        DEPARTMENT
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            {typeof error === "string"
              ? error
              : "Failed to fetch departments"}
          </p>
        </div>
      )}

      <EnhancedTable
        data={filteredDepartments}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="department-table"
        emptyMessage={
          searchTerm || Object.values(filters).some(Boolean)
            ? "No departments found matching your search"
            : "No departments found"
        }
        loading={loading}
        loadingMessage="Loading departments..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search departments..."
        disableClientSearch
        onFilterClick={() => setShowFilters(true)}
        hideTableExport
        pagination
        pageSize={10}
        getItemId={(item) => String(item.id)}
      />

      <DepartmentFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold">
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
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-brand text-brand hover:bg-brand-selected hover:text-brand"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-brand text-white hover:bg-brand-hover"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold">
              Edit Details
            </DialogTitle>
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
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-brand text-brand hover:bg-brand-selected hover:text-brand"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                className="bg-brand text-white hover:bg-brand-hover"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
