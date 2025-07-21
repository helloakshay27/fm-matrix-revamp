import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Upload, Eye, Pencil } from "lucide-react";
import { AddMenuItemModal } from "./AddMenuItemModal";
import { ImportDataModal } from "./ImportDataModal";
import { StatusBadge } from "./ui/status-badge";

interface MenuItem {
  id: number;
  sku: string;
  productName: string;
  masterPrice: number;
  displayPrice: number;
  category: string;
  subCategory: string;
  createdOn: string;
  updatedOn: string;
  status: 'Active' | 'Inactive';
}

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    sku: "Imperial Rolls",
    productName: "Imperial Rolls",
    masterPrice: 250,
    displayPrice: 250,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "21/03/2023",
    status: 'Inactive'
  },
  {
    id: 2,
    sku: "Corn Fritters",
    productName: "Corn Fritters",
    masterPrice: 220,
    displayPrice: 220,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "20/04/2023",
    status: 'Active'
  },
  {
    id: 3,
    sku: "Spring Rolls",
    productName: "Spring Rolls",
    masterPrice: 200,
    displayPrice: 200,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 4,
    sku: "Chicken Satay",
    productName: "Chicken Satay",
    masterPrice: 300,
    displayPrice: 300,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "20/04/2023",
    status: 'Active'
  },
  {
    id: 5,
    sku: "Tofu Satay",
    productName: "Tofu Satay",
    masterPrice: 300,
    displayPrice: 300,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 6,
    sku: "Dumpling",
    productName: "Dumpling",
    masterPrice: 200,
    displayPrice: 200,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 7,
    sku: "Golden Triangles",
    productName: "Golden Triangles",
    masterPrice: 250,
    displayPrice: 250,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 8,
    sku: "Tom Yum Gai",
    productName: "Tom Yum Gai",
    masterPrice: 200,
    displayPrice: 200,
    category: "Soups",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 9,
    sku: "Glass Noodles Soup",
    productName: "Glass Noodles Soup",
    masterPrice: 250,
    displayPrice: 250,
    category: "Soups",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 10,
    sku: "Beef Noodle Soup",
    productName: "Beef Noodle Soup",
    masterPrice: 280,
    displayPrice: 280,
    category: "Soups",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 11,
    sku: "Larb Gai",
    productName: "Larb Gai",
    masterPrice: 200,
    displayPrice: 200,
    category: "Soups",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 12,
    sku: "Ginger Salad",
    productName: "Ginger Salad",
    masterPrice: 200,
    displayPrice: 200,
    category: "Salads",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "18/04/2023",
    status: 'Inactive'
  },
  {
    id: 13,
    sku: "Fish Cake Salad",
    productName: "Fish Cake Salad",
    masterPrice: 280,
    displayPrice: 280,
    category: "Salads",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 14,
    sku: "Shrimp Salad",
    productName: "Shrimp Salad",
    masterPrice: 300,
    displayPrice: 300,
    category: "Salads",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 15,
    sku: "Duck Salad",
    productName: "Duck Salad",
    masterPrice: 340,
    displayPrice: 340,
    category: "Salads",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  }
];

export const RestaurantMenuTable = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const handleAddMenuItem = (menuItemData: any) => {
    const newMenuItem: MenuItem = {
      id: Math.max(...menuItems.map(item => item.id), 0) + 1,
      sku: menuItemData.sku,
      productName: menuItemData.productName,
      masterPrice: parseFloat(menuItemData.masterPrice),
      displayPrice: parseFloat(menuItemData.displayPrice),
      category: menuItemData.category,
      subCategory: menuItemData.subCategory,
      createdOn: new Date().toLocaleDateString(),
      updatedOn: new Date().toLocaleDateString(),
      status: menuItemData.active ? 'Active' : 'Inactive'
    };
    setMenuItems([...menuItems, newMenuItem]);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-start gap-2">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
        <Button
          onClick={() => setIsImportModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-medium">Actions</TableHead>
              <TableHead className="font-medium text-center">SKU</TableHead>
              <TableHead className="font-medium text-center">Products</TableHead>
              <TableHead className="font-medium text-center">Master Price</TableHead>
              <TableHead className="font-medium text-center">Display Price</TableHead>
              <TableHead className="font-medium text-center">Category</TableHead>
              <TableHead className="font-medium text-center">Subcategory</TableHead>
              <TableHead className="font-medium text-center">Created On</TableHead>
              <TableHead className="font-medium text-center">Updated On</TableHead>
              <TableHead className="font-medium text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No menu items found. Click "Add" to create your first menu item.
                </TableCell>
              </TableRow>
            ) : (
              menuItems.map((menuItem) => (
                <TableRow key={menuItem.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-8 w-8"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-8 w-8"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{menuItem.sku}</TableCell>
                  <TableCell className="text-center">{menuItem.productName}</TableCell>
                  <TableCell className="text-center">₹{menuItem.masterPrice}</TableCell>
                  <TableCell className="text-center">₹{menuItem.displayPrice}</TableCell>
                  <TableCell className="text-center">{menuItem.category}</TableCell>
                  <TableCell className="text-center">{menuItem.subCategory}</TableCell>
                  <TableCell className="text-center">{menuItem.createdOn}</TableCell>
                  <TableCell className="text-center">{menuItem.updatedOn}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge 
                      status={menuItem.status === 'Active' ? 'accepted' : 'rejected'}
                    >
                      {menuItem.status}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
