
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AddSubCategoryModal } from "./AddSubCategoryModal";
import { EditSubCategoryModal } from "./EditSubCategoryModal";

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

export const SubCategoriesSetupTable = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>(mockSubCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

  const handleAddSubCategory = (subCategoryData: { category: string; subCategory: string; description: string }) => {
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

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-medium">Actions</TableHead>
              <TableHead className="font-medium text-center">Category</TableHead>
              <TableHead className="font-medium text-center">Sub Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCategories.map((subCategory) => (
              <TableRow key={subCategory.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(subCategory)}
                      className="p-1 h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(subCategory)}
                      className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">{subCategory.category}</TableCell>
                <TableCell className="text-center">{subCategory.subCategory}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
