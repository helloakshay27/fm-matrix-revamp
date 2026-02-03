import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, ArrowLeft } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useToast } from '@/hooks/use-toast';

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

export const AddMaterialPage = () => {
  const { setCurrentSection } = useLayout();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);

  const [formData, setFormData] = useState<MaterialFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.componentName || !formData.category || !formData.quantityUsed || !formData.unitOfMeasure || !formData.estimatedUnitCost) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields marked with *",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // API call will go here
      console.log('Form data to submit:', formData);
      
      toast({
        title: "Success",
        description: id ? "Material updated successfully" : "Material added successfully"
      });
      
      // Navigate back to list
      navigate('/materials');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save material",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/materials');
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCancel}
            className="hover:bg-gray-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            {id ? 'Edit Material Component' : 'Add Material Component'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Component Name */}
              <div className="space-y-2">
                <Label htmlFor="componentName" className="text-sm font-medium">
                  Component Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="componentName"
                  placeholder="Enter component name"
                  value={formData.componentName}
                  onChange={(e) => handleInputChange('componentName', e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Component Category <span className="text-red-500">*</span>
                </Label>
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

              {/* Specification */}
              <div className="space-y-2">
                <Label htmlFor="specification" className="text-sm font-medium">
                  Specification/Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="specification"
                  placeholder="Enter specification or model"
                  value={formData.specification}
                  onChange={(e) => handleInputChange('specification', e.target.value)}
                  required
                />
              </div>

              {/* Quantity Used */}
              <div className="space-y-2">
                <Label htmlFor="quantityUsed" className="text-sm font-medium">
                  Quantity Used <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantityUsed"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantityUsed}
                  onChange={(e) => handleInputChange('quantityUsed', Number(e.target.value) || '')}
                  required
                />
              </div>

              {/* Unit of Measure */}
              <div className="space-y-2">
                <Label htmlFor="unitOfMeasure" className="text-sm font-medium">
                  Unit of Measure <span className="text-red-500">*</span>
                </Label>
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

              {/* Estimated Unit Cost */}
              <div className="space-y-2">
                <Label htmlFor="estimatedUnitCost" className="text-sm font-medium">
                  Estimated Unit Cost (INR) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="estimatedUnitCost"
                  type="number"
                  placeholder="Enter unit cost"
                  value={formData.estimatedUnitCost}
                  onChange={(e) => handleInputChange('estimatedUnitCost', Number(e.target.value) || '')}
                  required
                />
              </div>

              {/* Total Estimated Cost */}
              <div className="space-y-2">
                <Label htmlFor="totalEstimatedCost" className="text-sm font-medium">
                  Total Estimated Cost (INR)
                </Label>
                <Input
                  id="totalEstimatedCost"
                  type="number"
                  value={formData.totalEstimatedCost}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Consumed In */}
              <div className="space-y-2">
                <Label htmlFor="consumedIn" className="text-sm font-medium">
                  Consumed In
                </Label>
                <Input
                  id="consumedIn"
                  placeholder="Enter installation area or asset subsystem"
                  value={formData.consumedIn}
                  onChange={(e) => handleInputChange('consumedIn', e.target.value)}
                />
              </div>

              {/* Attachment */}
              <div className="space-y-2">
                <Label htmlFor="attachment" className="text-sm font-medium">
                  Attachment
                </Label>
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

            {/* Remarks */}
            <div className="mt-6 space-y-2">
              <Label htmlFor="remarks" className="text-sm font-medium">
                Remarks/Notes
              </Label>
              <Textarea
                id="remarks"
                placeholder="Enter any additional remarks or notes"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={4}
              />
            </div>

            {/* Checkboxes */}
            <div className="mt-6 flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includedInCapEx"
                  checked={formData.includedInCapEx}
                  onCheckedChange={(checked) => handleInputChange('includedInCapEx', checked)}
                />
                <Label htmlFor="includedInCapEx" className="font-normal cursor-pointer">
                  Included in CapEx
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inventoryTracking"
                  checked={formData.inventoryTracking}
                  onCheckedChange={(checked) => handleInputChange('inventoryTracking', checked)}
                />
                <Label htmlFor="inventoryTracking" className="font-normal cursor-pointer">
                  Inventory Tracking
                </Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-[#C72030] hover:bg-[#C72030]/90"
              >
                {isLoading ? 'Saving...' : (id ? 'Update Material' : 'Save Material')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
