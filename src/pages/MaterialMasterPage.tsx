import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Plus, Trash2, Search } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useToast } from '@/hooks/use-toast';

// Mock data for materials
const materialData = [
  {
    id: 1,
    componentName: 'IP Camera HD',
    category: 'Camera',
    specification: 'Sony IMX291 4MP',
    quantityUsed: 12,
    unitOfMeasure: 'Nos',
    estimatedUnitCost: 8500,
    totalEstimatedCost: 102000,
    consumedIn: 'Lobby Area',
    remarks: 'Weather resistant camera for outdoor use',
    includedInCapEx: true,
    inventoryTracking: true,
    attachment: 'camera_datasheet.pdf',
    createdOn: '15/12/2024',
    updatedOn: '15/12/2024'
  },
  {
    id: 2,
    componentName: 'Cat6 Cable',
    category: 'Cable',
    specification: 'Unshielded Twisted Pair',
    quantityUsed: 500,
    unitOfMeasure: 'Meters',
    estimatedUnitCost: 25,
    totalEstimatedCost: 12500,
    consumedIn: 'Network Infrastructure',
    remarks: 'High quality cable for data transmission',
    includedInCapEx: false,
    inventoryTracking: true,
    attachment: null,
    createdOn: '14/12/2024',
    updatedOn: '14/12/2024'
  }
];

interface MaterialFormData {
  componentName: string;
  category: string;
  specification: string;
  quantityUsed: number | '';
  unitOfMeasure: string;
  estimatedUnitCost: number | '';
  totalEstimatedCost: number;
  consumedIn: string;
  remarks: string;
  includedInCapEx: boolean;
  inventoryTracking: boolean;
  attachment: File | null;
}

const initialFormData: MaterialFormData = {
  componentName: '',
  category: '',
  specification: '',
  quantityUsed: '',
  unitOfMeasure: '',
  estimatedUnitCost: '',
  totalEstimatedCost: 0,
  consumedIn: '',
  remarks: '',
  includedInCapEx: false,
  inventoryTracking: false,
  attachment: null
};

export const MaterialMasterPage = () => {
  const { setCurrentSection } = useLayout();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('MaterialMasterPage component mounted');
    setCurrentSection('Master');
  }, [setCurrentSection]);

  const [materials, setMaterials] = useState(materialData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: number) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
    toast({
      title: "Success",
      description: "Material deleted successfully"
    });
  };

  const filteredMaterials = materials.filter(material =>
    material.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.specification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">MATERIAL MASTER (E-BOM MODULE)</h1>
          <Button 
            onClick={() => navigate('/materials/add')}
            className="bg-[#C72030] hover:bg-[#C72030]/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Material Components</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f4ee]">
                <TableHead className="font-medium">Component Name</TableHead>
                <TableHead className="font-medium">Category</TableHead>
                <TableHead className="font-medium">Specification</TableHead>
                <TableHead className="font-medium">Qty Used</TableHead>
                <TableHead className="font-medium">Unit</TableHead>
                <TableHead className="font-medium">Unit Cost (₹)</TableHead>
                <TableHead className="font-medium">Total Cost (₹)</TableHead>
                <TableHead className="font-medium">Consumed In</TableHead>
                <TableHead className="font-medium">CapEx</TableHead>
                <TableHead className="font-medium">Tracking</TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{material.componentName}</TableCell>
                  <TableCell>{material.category}</TableCell>
                  <TableCell>{material.specification}</TableCell>
                  <TableCell>{material.quantityUsed}</TableCell>
                  <TableCell>{material.unitOfMeasure}</TableCell>
                  <TableCell>₹{material.estimatedUnitCost.toLocaleString()}</TableCell>
                  <TableCell>₹{material.totalEstimatedCost.toLocaleString()}</TableCell>
                  <TableCell>{material.consumedIn}</TableCell>
                  <TableCell>{material.includedInCapEx ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{material.inventoryTracking ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/materials/edit/${material.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the material component.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(material.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
