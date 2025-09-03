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
import { gatePassTypeService } from '@/services/gatePassTypeService';
import { toast } from 'sonner';

export interface GatePassType {
  id: number;
  name: string;
  value: string;
  active: boolean;
}

const GatePassTypePage = () => {
  const navigate = useNavigate();
  const [gatePassTypes, setGatePassTypes] = useState<GatePassType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGatePassTypes = async () => {
      try {
        setLoading(true);
        const data = await gatePassTypeService.getGatePassTypes();
        setGatePassTypes(data);
      } catch (error) {
        toast.error('Failed to fetch gate pass types.');
      } finally {
        setLoading(false);
      }
    };

    fetchGatePassTypes();
  }, []);

  const handleAdd = () => {
    navigate('/master/gate-pass-type/add');
  };

  const handleEdit = (id: number) => {
    navigate(`/master/gate-pass-type/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this gate pass type?')) {
      try {
        await gatePassTypeService.deleteGatePassType(id);
        setGatePassTypes(gatePassTypes.filter(gpt => gpt.id !== id));
        toast.success('Gate pass type deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete gate pass type.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gate Pass Types</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Gate Pass Type
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : gatePassTypes.length > 0 ? (
              gatePassTypes.map((gatePassType) => (
                <TableRow key={gatePassType.id}>
                  <TableCell>{gatePassType.name}</TableCell>
                  <TableCell>{gatePassType.value}</TableCell>
                  <TableCell>{gatePassType.active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(gatePassType.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(gatePassType.id)}>
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
                <TableCell colSpan={4} className="text-center">
                  No gate pass types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GatePassTypePage;
