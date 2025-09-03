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
import { inventorySubTypeService } from '@/services/inventorySubTypeService';
import { toast } from 'sonner';

export interface InventorySubType {
  id: number;
  name: string;
  material_sub_type_code: string;
  pms_inventory_type_name: string;
  description: string;
  active: boolean;
}

const InventorySubTypePage = () => {
  const navigate = useNavigate();
  const [inventorySubTypes, setInventorySubTypes] = useState<InventorySubType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventorySubTypes = async () => {
      try {
        setLoading(true);
        const data = await inventorySubTypeService.getInventorySubTypes();
        setInventorySubTypes(data);
      } catch (error) {
        toast.error('Failed to fetch inventory sub-types.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventorySubTypes();
  }, []);

  const handleAdd = () => {
    navigate('/master/inventory-sub-type/add');
  };

  const handleEdit = (id: number) => {
    navigate(`/master/inventory-sub-type/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this inventory sub-type?')) {
      try {
        await inventorySubTypeService.deleteInventorySubType(id);
        setInventorySubTypes(inventorySubTypes.filter(it => it.id !== id));
        toast.success('Inventory sub-type deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete inventory sub-type.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Sub-Types</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Inventory Sub-Type
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Inventory Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : inventorySubTypes.length > 0 ? (
              inventorySubTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.material_sub_type_code || 'N/A'}</TableCell>
                  <TableCell>{type.pms_inventory_type_name}</TableCell>
                  <TableCell>{type.description || 'N/A'}</TableCell>
                  <TableCell>{type.active ? 'Active' : 'Inactive'}</TableCell>
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
                <TableCell colSpan={6} className="text-center">
                  No inventory sub-types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventorySubTypePage;
