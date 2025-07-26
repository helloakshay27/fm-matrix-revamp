import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AddCategoryModal } from "./AddCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { useAppDispatch } from '@/store/hooks';
import { createRestaurantCategory, deleteCategory, fetchRestaurantCategory } from '@/store/slices/f&bSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { SelectionPanel } from './water-asset-details/PannelTab';

interface Category {
  id: number;
  name: string;
  timing: string;
  active: boolean;
}

export const CategoriesSetupTable = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchRestaurantCategory({ baseUrl, token, id: Number(id) })).unwrap();
      setCategories(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, id, baseUrl, token]);

  const handleAddCategory = async (categoryData: { category: string; timings?: string }) => {
    const payload = {
      spree_manage_restaurant_category: {
        restaurant_id: Number(id),
        name: categoryData.category,
        timing: categoryData.timings
      },
      restaurant_id: Number(id)
    };
    try {
      await dispatch(createRestaurantCategory({ baseUrl, token, data: payload, id: Number(id) })).unwrap();
      fetchData();
      toast.success('Category added successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to add category');
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await dispatch(deleteCategory({ baseUrl, token, id: Number(id), catId: Number(selectedCategory?.id) })).unwrap();
      fetchData();
      toast.success('Category deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete category');
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnConfig[] = [
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
      draggable: true,
    },
    {
      key: 'timing',
      label: 'Timings',
      sortable: true,
      draggable: true,
    },
  ];

  const renderCell = (item: Category, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return item.name || '';
      case 'timing':
        return item.timing || '';
      default:
        return item[columnKey as keyof Category]?.toString() || '';
    }
  };

  const renderActions = (category: Category) => (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => openEditModal(category)}
        className="p-1 h-8 w-8"
      >
        <Pencil className="w-4 h-4" />
      </Button>
      {/* <Button
        variant="ghost"
        size="sm"
        onClick={() => openDeleteDialog(category)}
        className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button> */}
    </div>
  );

  const leftActions = (
    <div className="flex flex-wrap gap-2">
      <Button
        className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white w-[106px] h-[36px] py-[10px] px-[20px]"
        onClick={() => setShowActionPanel(true)}
      >
        <Plus className="w-4 h-4" />
        Action
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {showActionPanel && (
        <SelectionPanel
          // actions={selectionActions}
          onAdd={() => setIsAddModalOpen(true)}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      <EnhancedTable
        data={[...categories].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="categories-setup-table"
        className="min-w-full"
        emptyMessage="No categories available"
        leftActions={leftActions}
        enableSearch={true}
        enableSelection={false}
        hideTableExport={true}
        pagination={true}
        pageSize={5}
      />

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
        fetchData={fetchData}
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
              onClick={handleDeleteCategory}
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