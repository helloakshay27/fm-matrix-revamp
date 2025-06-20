
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AddSubCategoryModal } from './AddSubCategoryModal';
import { EditCategoryModal } from './EditCategoryModal';
import { DeletePatrollingModal } from './DeletePatrollingModal';

interface SubCategory {
  id: number;
  category: string;
  subCategory: string;
  active: boolean;
}

interface EditSubCategoryData {
  category: string;
  subCategory: string;
  id: number;
}

const mockSubCategoriesData: SubCategory[] = [
  {
    id: 1,
    category: 'Breakfast',
    subCategory: 'Continental',
    active: true
  },
  {
    id: 2,
    category: 'Lunch',
    subCategory: 'North Indian',
    active: true
  },
  {
    id: 3,
    category: 'Dinner',
    subCategory: 'South Indian',
    active: true
  }
];

export const SubCategoriesSetupTable = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>(mockSubCategoriesData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<number | null>(null);

  const handleAddSubCategory = (newSubCategory: { category: string; subCategory: string }) => {
    const subCategory: SubCategory = {
      id: subCategories.length + 1,
      category: newSubCategory.category,
      subCategory: newSubCategory.subCategory,
      active: true
    };
    setSubCategories([...subCategories, subCategory]);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubCategory = (updatedSubCategory: EditSubCategoryData) => {
    setSubCategories(subCategories.map(subCat => 
      subCat.id === updatedSubCategory.id ? { ...subCat, category: updatedSubCategory.category, subCategory: updatedSubCategory.subCategory } : subCat
    ));
  };

  const handleDeleteSubCategory = (id: number) => {
    setSubCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (subCategoryToDelete) {
      setSubCategories(subCategories.filter(subCat => subCat.id !== subCategoryToDelete));
      setSubCategoryToDelete(null);
    }
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

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-center">Actions</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Sub Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCategories.map((subCategory) => (
              <TableRow key={subCategory.id}>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSubCategory(subCategory)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubCategory(subCategory.id)}
                      className="text-red-600 hover:text-red-800"
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

      <EditCategoryModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedSubCategory}
        onSubmit={handleUpdateSubCategory}
      />

      <DeletePatrollingModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        patrollingId={subCategoryToDelete || 0}
      />
    </div>
  );
};
