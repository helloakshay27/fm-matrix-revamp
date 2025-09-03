import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { inventoryTypeService } from '@/services/inventoryTypeService';
import { toast } from 'sonner';

export interface InventoryType {
  id: number;
  name: string;
  material_type_code: string;
  category: string;
  material_type_description: string;
}

const InventoryTypePage = () => {
  const navigate = useNavigate();
  const [inventoryTypes, setInventoryTypes] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryTypes = async () => {
      try {
        setLoading(true);
        const data = await inventoryTypeService.getInventoryTypes();
        setInventoryTypes(data);
      } catch (error) {
        toast.error('Failed to fetch inventory types.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryTypes();
  }, []);

  const handleAdd = () => {
    navigate('/master/inventory-type/add');
  };

  const handleEdit = (id: number) => {
    navigate(`/master/inventory-type/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this inventory type?')) {
      try {
        await inventoryTypeService.deleteInventoryType(id);
        setInventoryTypes(inventoryTypes.filter(it => it.id !== id));
        toast.success('Inventory type deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete inventory type.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Types</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Inventory Type
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : inventoryTypes.length > 0 ? (
              inventoryTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.material_type_code}</TableCell>
                  <TableCell>{type.category}</TableCell>
                  <TableCell>{type.material_type_description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(type.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(type.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No inventory types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryTypePage;
