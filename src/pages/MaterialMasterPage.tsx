import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useToast } from '@/hooks/use-toast';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

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

type MaterialRow = (typeof materialData)[number];

const columns: ColumnConfig[] = [
  { key: 'componentName', label: 'Component Name', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'specification', label: 'Specification', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'quantityUsed', label: 'Qty Used', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'unitOfMeasure', label: 'Unit', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'estimatedUnitCost', label: 'Unit Cost (₹)', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'totalEstimatedCost', label: 'Total Cost (₹)', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'consumedIn', label: 'Consumed In', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'includedInCapEx', label: 'CapEx', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'inventoryTracking', label: 'Tracking', sortable: true, hideable: true, defaultVisible: true, draggable: true },
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
  const { shouldShow } = useDynamicPermissions();
  const { setCurrentSection } = useLayout();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('MaterialMasterPage component mounted');
    setCurrentSection('Master');
  }, [setCurrentSection]);

  const [materials, setMaterials] = useState<typeof materialData>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMaterials(materialData);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: number) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
    toast({
      title: "Success",
      description: "Material deleted successfully"
    });
  };

  // Search sirf name / category / specification pe (pehle jaisa) — isliye
  // EnhancedTable ka client search band karke khud filter karte hain
  const filteredMaterials = materials.filter(material =>
    material.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.specification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCell = (material: MaterialRow, columnKey: string) => {
    switch (columnKey) {
      case 'componentName':
        return <span className="font-medium">{material.componentName}</span>;
      case 'estimatedUnitCost':
        return `₹${material.estimatedUnitCost.toLocaleString()}`;
      case 'totalEstimatedCost':
        return `₹${material.totalEstimatedCost.toLocaleString()}`;
      case 'includedInCapEx':
        return material.includedInCapEx ? 'Yes' : 'No';
      case 'inventoryTracking':
        return material.inventoryTracking ? 'Yes' : 'No';
      default:
        return material[columnKey as keyof MaterialRow] as React.ReactNode;
    }
  };

  const renderActions = (material: MaterialRow) => (
    <div className="flex items-center gap-2">
      {shouldShow("Material Master -> EBom", "update") && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/materials/edit/${material.id}`)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      )}
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
  );

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">MATERIAL MASTER (E-BOM MODULE)</h1>

        {/* Materials Table */}
        <EnhancedTable
          data={filteredMaterials}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(material) => String(material.id)}
          storageKey="material-master-ebom-table"
          enableSearch={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          disableClientSearch={true}
          searchPlaceholder="Search materials..."
          emptyMessage="No materials found"
          loading={loading}
          pagination={true}
          pageSize={10}
          leftActions={
            shouldShow("Material Master -> EBom", "create") ? (
              <Button
                onClick={() => navigate('/materials/add')}
                className="bg-brand hover:bg-brand-hover text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Material
              </Button>
            ) : null
          }
        />
      </div>
    </div>
  );
};
