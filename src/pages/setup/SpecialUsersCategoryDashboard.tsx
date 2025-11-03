import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Column configuration
const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, draggable: false },
  { key: "sNo", label: "S No", sortable: true, draggable: true },
  { key: "categoryName", label: "Category Name", sortable: true, draggable: true },
];

// Sample data
const sampleCategories = [
  {
    id: "1",
    sNo: 1,
    categoryName: "Other",
  },
  {
    id: "2",
    sNo: 2,
    categoryName: "Committee Member",
  },
  {
    id: "3",
    sNo: 3,
    categoryName: "Pregnant Lady",
  },
  {
    id: "4",
    sNo: 4,
    categoryName: "Senior Citizen",
  },
  {
    id: "5",
    sNo: 5,
    categoryName: "Prioritize Complaint",
  },
  {
    id: "6",
    sNo: 6,
    categoryName: "New User",
  },
  {
    id: "7",
    sNo: 7,
    categoryName: "Test Category",
  },
  {
    id: "8",
    sNo: 8,
    categoryName: "Abc",
  },
];

export const SpecialUsersCategoryDashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(sampleCategories);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleAddCategory = () => {
    setShowAddDialog(true);
  };

  const handleSubmitCategory = () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const newCategory = {
      id: `category-${Date.now()}`,
      sNo: categories.length + 1,
      categoryName: categoryName,
    };

    setCategories([...categories, newCategory]);
    setCategoryName("");
    setShowAddDialog(false);
    toast.success("Category added successfully!");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map((c) => c.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    }
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.categoryName);
      setShowEditDialog(true);
    }
  };

  const handleSubmitEdit = () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setCategories(categories.map((c) => 
      c.id === editingCategory.id 
        ? { ...c, categoryName: categoryName }
        : c
    ));
    
    setCategoryName("");
    setEditingCategory(null);
    setShowEditDialog(false);
    toast.success("Category updated successfully!");
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId));
    toast.success("Category deleted successfully!");
  };

  // Render cell content based on column key
  const renderCell = (category: any, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleEditCategory(category.id)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="p-1 hover:bg-gray-100 rounded text-red-600"
              title="Delete"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      case "sNo":
        return (
          <div className="text-center">
            <span className="text-sm text-gray-900">{category.sNo}</span>
          </div>
        );
      case "categoryName":
        return (
          <div className="text-center">
            <span className="text-sm text-gray-900">{category.categoryName || "-"}</span>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <span className="text-sm text-gray-900">{category[columnKey] || "-"}</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">Special Users Category</h1>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <EnhancedTable
            columns={columns}
            data={categories}
            onRowClick={(category) => console.log("Row clicked:", category)}
            renderCell={renderCell}
            selectedItems={selectedCategories}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectCategory}
            enableSelection={true}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search..."
            leftActions={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddCategory}
                  className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white border-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            }
          />
        </div>

        {/* Add Category Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">Add Category</DialogTitle>
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="categoryName"
                  placeholder="Enter Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowAddDialog(false)}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitCategory}
                  className="px-6 py-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
                >
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">Edit Category</DialogTitle>
                <button
                  onClick={() => {
                    setShowEditDialog(false);
                    setCategoryName("");
                    setEditingCategory(null);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="editCategoryName" className="text-sm font-medium text-gray-700">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editCategoryName"
                  placeholder="Enter Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowEditDialog(false);
                    setCategoryName("");
                    setEditingCategory(null);
                  }}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitEdit}
                  className="px-6 py-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SpecialUsersCategoryDashboard;
