
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AddSubCategoryModal } from './AddSubCategoryModal';

interface SubCategory {
  id: number;
  category: string;
  subCategory: string;
  amount: number;
}

const mockSubCategoriesData: SubCategory[] = [];

export const SubCategoriesSetupTable = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>(mockSubCategoriesData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  const handleAddSubCategory = (newSubCategory: Omit<SubCategory, 'id'>) => {
    const subCategory: SubCategory = {
      id: subCategories.length + 1,
      ...newSubCategory
    };
    setSubCategories([...subCategories, subCategory]);
  };

  const handleEditSubCategory = (updatedSubCategory: SubCategory) => {
    setSubCategories(subCategories.map(subCat => 
      subCat.id === updatedSubCategory.id ? updatedSubCategory : subCat
    ));
    setEditingSubCategory(null);
  };

  const handleDeleteSubCategory = (id: number) => {
    setSubCategories(subCategories.filter(subCat => subCat.id !== id));
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
              <TableHead className="text-center">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No sub categories found. Click "Add" to create your first sub category.
                </TableCell>
              </TableRow>
            ) : (
              subCategories.map((subCategory) => (
                <TableRow key={subCategory.id}>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSubCategory(subCategory)}
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubCategory(subCategory.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{subCategory.category}</TableCell>
                  <TableCell className="text-center">{subCategory.subCategory}</TableCell>
                  <TableCell className="text-center">₹{subCategory.amount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddSubCategoryModal 
        isOpen={isAddModalOpen || editingSubCategory !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSubCategory(null);
        }}
        onSubmit={editingSubCategory ? handleEditSubCategory : handleAddSubCategory}
        initialData={editingSubCategory}
      />
    </div>
  );
};
