import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Plus, ChevronDown, Trash2, Upload, Search } from 'lucide-react';
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
  
  useEffect(() => {
    console.log('MaterialMasterPage component mounted');
    setCurrentSection('Master');
  }, [setCurrentSection]);

  const [isFormOpen, setIsFormOpen] = useState(true);
  const [formData, setFormData] = useState<MaterialFormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [materials, setMaterials] = useState(materialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Calculate total estimated cost automatically
  useEffect(() => {
    const quantity = typeof formData.quantityUsed === 'number' ? formData.quantityUsed : 0;
    const unitCost = typeof formData.estimatedUnitCost === 'number' ? formData.estimatedUnitCost : 0;
    setFormData(prev => ({
      ...prev,
      totalEstimatedCost: quantity * unitCost
    }));
  }, [formData.quantityUsed, formData.estimatedUnitCost]);

  const handleInputChange = (field: keyof MaterialFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.componentName || !formData.category || !formData.quantityUsed || !formData.unitOfMeasure || !formData.estimatedUnitCost) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields marked with *",
        variant: "destructive"
      });
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-GB');
    
    if (editingId) {
      // Update existing material
      setMaterials(prev => prev.map(material => 
        material.id === editingId 
          ? {
              ...material,
              componentName: formData.componentName,
              category: formData.category,
              specification: formData.specification,
              quantityUsed: formData.quantityUsed as number,
              unitOfMeasure: formData.unitOfMeasure,
              estimatedUnitCost: formData.estimatedUnitCost as number,
              totalEstimatedCost: formData.totalEstimatedCost,
              consumedIn: formData.consumedIn,
              remarks: formData.remarks,
              includedInCapEx: formData.includedInCapEx,
              inventoryTracking: formData.inventoryTracking,
              attachment: formData.attachment?.name || material.attachment,
              updatedOn: currentDate
            }
          : material
      ));
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Material updated successfully"
      });
    } else {
      // Add new material
      const newMaterial = {
        id: Math.max(...materials.map(m => m.id)) + 1,
        ...formData,
        quantityUsed: formData.quantityUsed as number,
        estimatedUnitCost: formData.estimatedUnitCost as number,
        attachment: formData.attachment?.name || null,
        createdOn: currentDate,
        updatedOn: currentDate
      };
      setMaterials(prev => [...prev, newMaterial]);
      toast({
        title: "Success",
        description: "Material added successfully"
      });
    }
    
    resetForm();
  };

  const handleEdit = (material: any) => {
    setFormData({
      componentName: material.componentName,
      category: material.category,
      specification: material.specification,
      quantityUsed: material.quantityUsed,
      unitOfMeasure: material.unitOfMeasure,
      estimatedUnitCost: material.estimatedUnitCost,
      totalEstimatedCost: material.totalEstimatedCost,
      consumedIn: material.consumedIn,
      remarks: material.remarks,
      includedInCapEx: material.includedInCapEx,
      inventoryTracking: material.inventoryTracking,
      attachment: null
    });
    setEditingId(material.id);
    setIsEditDialogOpen(true);
  };

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

  const MaterialForm = ({ isInDialog = false }: { isInDialog?: boolean }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="componentName">Component Name*</Label>
          <Input
            id="componentName"
            placeholder="Enter component name"
            value={formData.componentName}
            onChange={(e) => handleInputChange('componentName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Component Category*</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Camera">Camera</SelectItem>
              <SelectItem value="Cable">Cable</SelectItem>
              <SelectItem value="Connector">Connector</SelectItem>
              <SelectItem value="Sensor">Sensor</SelectItem>
              <SelectItem value="Mounting Kit">Mounting Kit</SelectItem>
              <SelectItem value="Misc">Misc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specification">Specification/Model*</Label>
          <Input
            id="specification"
            placeholder="Enter specification or model"
            value={formData.specification}
            onChange={(e) => handleInputChange('specification', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantityUsed">Quantity Used*</Label>
          <Input
            id="quantityUsed"
            type="number"
            placeholder="Enter quantity"
            value={formData.quantityUsed}
            onChange={(e) => handleInputChange('quantityUsed', Number(e.target.value) || '')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitOfMeasure">Unit of Measure*</Label>
          <Select value={formData.unitOfMeasure} onValueChange={(value) => handleInputChange('unitOfMeasure', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nos">Nos</SelectItem>
              <SelectItem value="Meters">Meters</SelectItem>
              <SelectItem value="Packs">Packs</SelectItem>
              <SelectItem value="Boxes">Boxes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedUnitCost">Estimated Unit Cost (INR)*</Label>
          <Input
            id="estimatedUnitCost"
            type="number"
            placeholder="Enter unit cost"
            value={formData.estimatedUnitCost}
            onChange={(e) => handleInputChange('estimatedUnitCost', Number(e.target.value) || '')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalEstimatedCost">Total Estimated Cost (INR)</Label>
          <Input
            id="totalEstimatedCost"
            type="number"
            value={formData.totalEstimatedCost}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consumedIn">Consumed In</Label>
          <Input
            id="consumedIn"
            placeholder="Enter installation area or asset subsystem"
            value={formData.consumedIn}
            onChange={(e) => handleInputChange('consumedIn', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachment">Attachment</Label>
          <div className="flex items-center gap-2">
            <Input
              id="attachment"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('attachment')?.click()}
              className="w-full justify-start"
            >
              <Upload className="w-4 h-4 mr-2" />
              {formData.attachment ? formData.attachment.name : 'Upload File'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks/Notes</Label>
          <Textarea
            id="remarks"
            placeholder="Enter any additional remarks or notes"
            value={formData.remarks}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includedInCapEx"
              checked={formData.includedInCapEx}
              onCheckedChange={(checked) => handleInputChange('includedInCapEx', checked)}
            />
            <Label htmlFor="includedInCapEx">Included in CapEx</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="inventoryTracking"
              checked={formData.inventoryTracking}
              onCheckedChange={(checked) => handleInputChange('inventoryTracking', checked)}
            />
            <Label htmlFor="inventoryTracking">Inventory Tracking</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-4">
        <Button variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-[#C72030] hover:bg-[#C72030]/90">
          {editingId ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">MATERIAL MASTER (E-BOM MODULE)</h1>

        {/* Material Setup Form */}
        <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between text-left font-semibold p-4 h-auto"
            >
              <span>Material Component Setup</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isFormOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 mt-4">
            <MaterialForm />
          </CollapsibleContent>
        </Collapsible>

        {/* Existing Materials Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Existing Material Components</h2>
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
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(material)}>
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Material Component</DialogTitle>
            </DialogHeader>
            <MaterialForm isInDialog={true} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
