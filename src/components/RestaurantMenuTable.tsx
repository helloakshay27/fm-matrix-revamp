import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Upload, Eye, Pencil } from "lucide-react";
import { AddMenuItemModal } from "./AddMenuItemModal";
import { ImportDataModal } from "./ImportDataModal";
import { StatusBadge } from "./ui/status-badge";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { createMenu, fetchMenu } from '@/store/slices/f&bSlice';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { SelectionPanel } from './water-asset-details/PannelTab';

interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  sku: string;
  master_price: number;
  discount: number | null;
  display_price: number;
  stock: number;
  active: number;
  category_id: number;
  sub_category_id: number;
  sgst_rate: number;
  sgst_amt: number;
  cgst_rate: number;
  cgst_amt: number;
  igst_rate: number | null;
  igst_amt: number | null;
  veg_menu: boolean | null;
  description: string;
  created_at: string;
  updated_at: string;
  discounted_amount: number;
}

export const RestaurantMenuTable = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const { id } = useParams();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const fetchMenuItems = async () => {
    try {
      const response = await dispatch(fetchMenu({ baseUrl, token, id: Number(id) })).unwrap();
      setMenuItems(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [dispatch, id, baseUrl, token]);

  const handleAddMenuItem = async (menuItemData: any, selectedFile: File) => {
    const menuItem = new FormData();

    menuItem.append('manage_restaurant_menu[name]', menuItemData.productName);
    menuItem.append('manage_restaurant_menu[restaurant_id]', id!);
    menuItem.append('manage_restaurant_menu[sku]', menuItemData.sku);
    menuItem.append('manage_restaurant_menu[master_price]', menuItemData.masterPrice);
    menuItem.append('manage_restaurant_menu[display_price]', menuItemData.displayPrice);
    menuItem.append('manage_restaurant_menu[stock]', menuItemData.stock);
    menuItem.append('manage_restaurant_menu[active]', menuItemData.active);
    menuItem.append('manage_restaurant_menu[category_id]', menuItemData.category);
    menuItem.append('manage_restaurant_menu[sub_category_id]', menuItemData.subCategory);
    menuItem.append('manage_restaurant_menu[sgst_rate]', menuItemData.sgstRate);
    menuItem.append('manage_restaurant_menu[sgst_amt]', menuItemData.sgstAmount);
    menuItem.append('manage_restaurant_menu[cgst_rate]', menuItemData.cgstRate);
    menuItem.append('manage_restaurant_menu[cgst_amt]', menuItemData.cgstAmount);
    menuItem.append('manage_restaurant_menu[description]', menuItemData.description);
    if (selectedFile) {
      menuItem.append('images[]', selectedFile);
    }
    menuItem.append('restaurant_id', id!);

    try {
      await dispatch(createMenu({ baseUrl, token, id: Number(id), data: menuItem })).unwrap();
      toast.success('Menu item added successfully');
      fetchMenuItems();
    } catch (error) {
      console.log(error);
      toast.error('Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = () => {
    if (selectedMenuItem) {
      setMenuItems(menuItems.filter(item => item.id !== selectedMenuItem.id));
      setSelectedMenuItem(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (menuItem: MenuItem) => {
    navigate(`/vas/fnb/details/${id}/restaurant-menu/${menuItem.id}`);
  };

  const handleEditProduct = (menuItem: MenuItem) => {
    navigate(`/vas/fnb/restaurant-menu/edit/${menuItem.id}`);
  };

  const columns: ColumnConfig[] = [
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      draggable: true,
    },
    {
      key: 'name',
      label: 'Products',
      sortable: true,
      draggable: true,
    },
    {
      key: 'master_price',
      label: 'Master Price',
      sortable: true,
      draggable: true,
    },
    {
      key: 'display_price',
      label: 'Display Price',
      sortable: true,
      draggable: true,
    },
    {
      key: 'category_id',
      label: 'Category',
      sortable: true,
      draggable: true,
    },
    {
      key: 'sub_category_id',
      label: 'Subcategory',
      sortable: true,
      draggable: true,
    },
    {
      key: 'created_at',
      label: 'Created On',
      sortable: true,
      draggable: true,
    },
    {
      key: 'updated_at',
      label: 'Updated On',
      sortable: true,
      draggable: true,
    },
    {
      key: 'active',
      label: 'Status',
      sortable: true,
      draggable: true,
    },
  ];

  const renderCell = (item: MenuItem, columnKey: string) => {
    switch (columnKey) {
      case 'sku':
        return item.sku || '';
      case 'name':
        return item.name || '';
      case 'master_price':
        return `₹${item.master_price}`;
      case 'display_price':
        return `₹${item.display_price}`;
      case 'category_id':
        return item.category_id || '';
      case 'sub_category_id':
        return item.sub_category_id || '';
      case 'created_at':
        return item.created_at.split('T')[0] || '';
      case 'updated_at':
        return item.updated_at.split('T')[0] || '';
      case 'active':
        return (
          <StatusBadge status={item.active === 1 ? 'accepted' : 'rejected'}>
            {item.active ? 'Active' : 'Inactive'}
          </StatusBadge>
        );
      default:
        return item[columnKey as keyof MenuItem]?.toString() || '';
    }
  };

  const renderActions = (menuItem: MenuItem) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewDetails(menuItem)}
        className="p-1 h-8 w-8"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditProduct(menuItem)}
        className="p-1 h-8 w-8"
      >
        <Pencil className="w-4 h-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex gap-2">
      <Button
        className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white w-[106px] h-[36px] py-[10px] px-[20px]"
        // onClick={() => setIsAddModalOpen(true)}
        onClick={() => setShowActionPanel(true)}
      >
        <Plus className="w-4 h-4" />
        Actions
      </Button>
      {/* <Button
        onClick={() => setIsImportModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Import
      </Button> */}
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
        data={[...menuItems].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="restaurant-menu-table"
        className="min-w-full"
        emptyMessage="No menu items found. Click 'Add' to create your first menu item."
        leftActions={leftActions}
        enableSearch={true}
        enableSelection={false}
        hideTableExport={true}
        pagination={true}
        pageSize={5}
      />

      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMenuItem}
      />

      <ImportDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
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
              onClick={handleDeleteMenuItem}
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