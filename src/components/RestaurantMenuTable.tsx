
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { AddProductModal } from './AddProductModal';
import { ImportMenuModal } from './ImportMenuModal';

interface MenuItem {
  id: number;
  sku: string;
  products: string;
  masterPrice: number;
  displayPrice: number;
  category: string;
  subcategory: string;
  createdOn: string;
  updatedOn: string;
  status: string;
}

const mockMenuData: MenuItem[] = [];

export const RestaurantMenuTable = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleAddProduct = (newProduct: any) => {
    const menuItem: MenuItem = {
      id: menuItems.length + 1,
      sku: newProduct.sku,
      products: newProduct.productName,
      masterPrice: parseFloat(newProduct.masterPrice),
      displayPrice: parseFloat(newProduct.displayPrice),
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      createdOn: new Date().toLocaleDateString(),
      updatedOn: new Date().toLocaleDateString(),
      status: newProduct.active ? 'Active' : 'Inactive'
    };
    setMenuItems([...menuItems, menuItem]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
        <Button
          onClick={() => setIsImportModalOpen(true)}
          variant="outline"
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 flex items-center gap-2"
        >
          Import
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-center">Actions</TableHead>
              <TableHead className="text-center">SKU</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-center">Master Price</TableHead>
              <TableHead className="text-center">Display Price</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Subcategory</TableHead>
              <TableHead className="text-center">Created On</TableHead>
              <TableHead className="text-center">Updated On</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No menu items found. Click "Add" to create your first product.
                </TableCell>
              </TableRow>
            ) : (
              menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      {/* Action buttons would go here */}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{item.sku}</TableCell>
                  <TableCell className="text-center">{item.products}</TableCell>
                  <TableCell className="text-center">₹{item.masterPrice}</TableCell>
                  <TableCell className="text-center">₹{item.displayPrice}</TableCell>
                  <TableCell className="text-center">{item.category}</TableCell>
                  <TableCell className="text-center">{item.subcategory}</TableCell>
                  <TableCell className="text-center">{item.createdOn}</TableCell>
                  <TableCell className="text-center">{item.updatedOn}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      <ImportMenuModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};
