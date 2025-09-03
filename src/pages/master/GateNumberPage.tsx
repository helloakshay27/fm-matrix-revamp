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
import { gateNumberService } from '@/services/gateNumberService';
import { toast } from 'sonner';

export interface GateNumber {
  id: number;
  gate_number: string;
  company_name: string;
  pms_site_name: string;
  building_name: string;
  active: boolean;
}

const GateNumberPage = () => {
  const navigate = useNavigate();
  const [gateNumbers, setGateNumbers] = useState<GateNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGateNumbers = async () => {
      try {
        setLoading(true);
        const data = await gateNumberService.getGateNumbers();
        setGateNumbers(data);
      } catch (error) {
        toast.error('Failed to fetch gate numbers.');
      } finally {
        setLoading(false);
      }
    };

    fetchGateNumbers();
  }, []);

  const handleAddGateNumber = () => {
    navigate('/master/gate-number/add');
  };

  const handleEdit = (id: number) => {
    navigate(`/master/gate-number/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this gate number?')) {
      try {
        await gateNumberService.deleteGateNumber(id);
        setGateNumbers(gateNumbers.filter(gn => gn.id !== id));
        toast.success('Gate number deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete gate number.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gate Numbers</h1>
        <Button onClick={handleAddGateNumber}>
          <Plus className="mr-2 h-4 w-4" /> Add Gate Number
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gate Number</TableHead>
              <TableHead>Company</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead>Project</TableHead>
              <TableHead>Building</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : gateNumbers.length > 0 ? (
              gateNumbers.map((gateNumber) => (
                <TableRow key={gateNumber.id}>
                  <TableCell>{gateNumber.gate_number}</TableCell>
                  <TableCell>{gateNumber.company_name}</TableCell>
                  <TableCell>{gateNumber.pms_site_name}</TableCell>
                  <TableCell>{gateNumber.building_name}</TableCell>
                  {/* <TableCell>{gateNumber.active ? 'Active' : 'Inactive'}</TableCell> */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(gateNumber.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(gateNumber.id)}>
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
                  No gate numbers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GateNumberPage;
