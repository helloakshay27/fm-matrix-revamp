
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AddSubCategoryModal } from "./AddSubCategoryModal";
import { EditSubCategoryModal } from "./EditSubCategoryModal";
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface SubCategory {
  id: number;
  category: string;
  subCategory: string;
  description: string;
  active: boolean;
}

const mockSubCategories: SubCategory[] = [
  { id: 1, category: "Breakfast", subCategory: "Continental", description: "Continental breakfast items", active: true },
  { id: 2, category: "Lunch", subCategory: "Indian", description: "Traditional Indian lunch", active: true },
  { id: 3, category: "Dinner", subCategory: "Italian", description: "Italian dinner specialties", active: true },
];

const columns: ColumnConfig[] = [
  { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true },
  { key: 'subCategory', label: 'Sub Category', sortable: true, hideable: true, draggable: true },
  { key: 'description', label: 'Description', sortable: true, hideable: true, draggable: true },
  { key: 'active', label: 'Active', sortable: true, hideable: true, draggable: true },
  { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false }
];

export const SubCategoriesSetupTable = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>(mockSubCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

  const handleAddSubCategory = (subCategoryData: { category: string; subCategory: string; description: string; icon?: File }) => {
    const newSubCategory: SubCategory = {
      id: Math.max(...subCategories.map(c => c.id), 0) + 1,
      category: subCategoryData.category,
      subCategory: subCategoryData.subCategory,
      description: subCategoryData.description,
      active: true
    };
    setSubCategories([...subCategories, newSubCategory]);
  };

  const handleEditSubCategory = (updatedSubCategory: SubCategory) => {
    setSubCategories(subCategories.map(cat => 
      cat.id === updatedSubCategory.id ? updatedSubCategory : cat
    ));
  };

  const handleDeleteSubCategory = () => {
    if (selectedSubCategory) {
      setSubCategories(subCategories.filter(cat => cat.id !== selectedSubCategory.id));
      setSelectedSubCategory(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditModal = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteDialogOpen(true);
  };

  const renderRow = (item: SubCategory) => ({
    category: item.category,
    subCategory: item.subCategory,
    description: item.description,
    active: (
      <span className={`px-2 py-1 rounded-full text-xs ${
        item.active 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {item.active ? 'Active' : 'Inactive'}
      </span>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openEditModal(item)}
          className="p-1 h-8 w-8"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openDeleteDialog(item)}
          className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <EnhancedTable
        data={subCategories}
        columns={columns}
        renderRow={renderRow}
        enableSearch={true}
        enableSelection={true}
        enableExport={true}
        storageKey="subcategories-table"
      />

      <AddSubCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubCategory}
      />

      <EditSubCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subCategory={selectedSubCategory}
        onSubmit={handleEditSubCategory}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>app.lockated.com says</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubCategory}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
