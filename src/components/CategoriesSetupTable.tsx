
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AddCategoryModal } from './AddCategoryModal';
import { EditCategoryModal } from './EditCategoryModal';
import { DeletePatrollingModal } from './DeletePatrollingModal';

interface Category {
  id: number;
  category: string;
  timings: string;
  active: boolean;
}

const mockCategoriesData: Category[] = [
  {
    id: 1,
    category: 'Breakfast',
    timings: '9 Am to 1 Pm',
    active: true
  },
  {
    id: 2,
    category: 'Lunch',
    timings: '1 Pm to 3:30 Pm',
    active: true
  },
  {
    id: 3,
    category: 'Dinner',
    timings: '5 Pm to 11:45 Pm',
    active: true
  }
];

export const CategoriesSetupTable = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategoriesData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleAddCategory = (newCategory: { category: string; amount: string }) => {
    const category: Category = {
      id: categories.length + 1,
      category: newCategory.category,
      timings: newCategory.amount, // Using amount field as timings
      active: true
    };
    setCategories([...categories, category]);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
  };

  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete));
      setCategoryToDelete(null);
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
              <TableHead className="text-center">Category Name</TableHead>
              <TableHead className="text-center">Timings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">{category.category}</TableCell>
                <TableCell className="text-center">{category.timings}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddCategoryModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      <EditCategoryModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
        onSubmit={handleUpdateCategory}
      />

      <DeletePatrollingModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        patrollingId={categoryToDelete || 0}
      />
    </div>
  );
};
