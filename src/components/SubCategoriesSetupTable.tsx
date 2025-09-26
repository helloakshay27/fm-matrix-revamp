
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash } from "lucide-react";
import { AddSubCategoryModal } from "./AddSubCategoryModal";
import { EditSubCategoryModal } from "./EditSubCategoryModal";
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { createSubcategory, deleteSubCategory, fetchSubcategory } from '@/store/slices/f&bSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { SelectionPanel } from './water-asset-details/PannelTab';
import { Switch } from './ui/switch';
import axios from 'axios';

export interface SubCategory {
  id: number;
  category_id: string;
  category_name: string;
  name: string;
  description: string;
  active: boolean;
}

const columns: ColumnConfig[] = [
  { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true },
  { key: 'subCategory', label: 'Sub Category', sortable: true, hideable: true, draggable: true },
  { key: 'description', label: 'Description', sortable: true, hideable: true, draggable: true },
];

export const SubCategoriesSetupTable = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const { id } = useParams();

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchSubcategory({ baseUrl, token, id: Number(id) })).unwrap();
      setSubCategories(response);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubCategory = async (subCategoryData: { category: string; subCategory: string; description: string }) => {
    const payload = {
      spree_manage_restaurant_sub_category: {
        category_id: Number(subCategoryData.category),
        name: subCategoryData.subCategory,
        description: subCategoryData.description
      },
      restaurant_id: Number(id)
    }
    try {
      await dispatch(createSubcategory({ baseUrl, token, id: Number(id), data: payload })).unwrap();
      fetchData();
      toast.success('Subcategory added successfully');
    } catch (error) {
      console.log(error)
    }
  };

  const handleDeleteSubCategory = async () => {
    try {
      await dispatch(deleteSubCategory({ baseUrl, token, id: Number(id), subId: selectedSubCategory?.id })).unwrap();
      fetchData();
      toast.success('Subcategory deleted successfully');
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete subcategory');
    }
  };

  const openEditModal = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const handleCheckboxChange = async (item: any) => {
    const newStatus = !item.active;
    const itemId = item.id;

    if (updatingStatus[itemId]) return;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      const payload = {
        spree_manage_restaurant_sub_category: {
          active: newStatus
        },
        restaurant_id: Number(id)
      }

      await axios.put(`https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_sub_categories/${item.id}.json`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setSubCategories((prevData: any[]) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, active: newStatus } : row
        )
      );
      fetchData();
      toast.success(`Subcategory deleted successfully`);
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error(error || "Failed to update active status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const renderRow = (item: SubCategory) => ({
    category: item.category_name,
    subCategory: item.name,
    description: item.description,
  });

  const renderActions = (item: SubCategory) => (
    <div className="flex items-center justify-center gap-2">
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
        onClick={() => handleCheckboxChange(item)}
        className="p-1 h-8 w-8"
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {showActionPanel && (
        <SelectionPanel
          onAdd={() => setIsAddModalOpen(true)}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      <EnhancedTable
        data={[...subCategories].reverse()}
        columns={columns}
        renderRow={renderRow}
        renderActions={renderActions}
        enableSearch={true}
        enableSelection={true}
        enableExport={false}
        storageKey="subcategories-table"
        pagination={true}
        pageSize={5}
        leftActions={
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white w-[106px] h-[36px] py-[10px] px-[20px]"
              onClick={() => setShowActionPanel(true)}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        }
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