
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";

interface WBSFormData {
  plantCode: string;
  category: string;
  categoryWBSCode: string;
  wbsName: string;
  wbsCode: string;
  site: string;
}

interface AddWBSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WBSFormData) => void;
}

export const AddWBSDialog: React.FC<AddWBSDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const [formData, setFormData] = useState<WBSFormData>({
    plantCode: '',
    category: '',
    categoryWBSCode: '',
    wbsName: '',
    wbsCode: '',
    site: ''
  });

  const [errors, setErrors] = useState<Partial<WBSFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<WBSFormData> = {};

    if (!formData.plantCode.trim()) {
      newErrors.plantCode = 'Plant Code is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.categoryWBSCode.trim()) {
      newErrors.categoryWBSCode = 'Category WBS Code is required';
    }
    if (!formData.wbsName.trim()) {
      newErrors.wbsName = 'WBS Name is required';
    }
    if (!formData.wbsCode.trim()) {
      newErrors.wbsCode = 'WBS Code is required';
    }
    if (!formData.site.trim()) {
      newErrors.site = 'Site is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log('WBS Form submitted:', formData);
    onSubmit(formData);
    
    // Reset form
    setFormData({
      plantCode: '',
      category: '',
      categoryWBSCode: '',
      wbsName: '',
      wbsCode: '',
      site: ''
    });
    setErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof WBSFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    setFormData({
      plantCode: '',
      category: '',
      categoryWBSCode: '',
      wbsName: '',
      wbsCode: '',
      site: ''
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add New WBS</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Plant Code *</label>
              <Select 
                value={formData.plantCode} 
                onValueChange={(value) => handleInputChange('plantCode', value)}
              >
                <SelectTrigger className={errors.plantCode ? 'border-red-500' : ''}>
                  <SelectValue placeholder="-- Select Plant --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLT001">Plant 001</SelectItem>
                  <SelectItem value="PLT002">Plant 002</SelectItem>
                  <SelectItem value="PLT003">Plant 003</SelectItem>
                </SelectContent>
              </Select>
              {errors.plantCode && <p className="text-sm text-red-500">{errors.plantCode}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <Input 
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Enter category"
                className={errors.category ? 'border-red-500' : ''}
              />
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category WBS Code *</label>
              <Input 
                value={formData.categoryWBSCode}
                onChange={(e) => handleInputChange('categoryWBSCode', e.target.value)}
                placeholder="Enter WBS code"
                className={errors.categoryWBSCode ? 'border-red-500' : ''}
              />
              {errors.categoryWBSCode && <p className="text-sm text-red-500">{errors.categoryWBSCode}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">WBS Name *</label>
              <Input 
                value={formData.wbsName}
                onChange={(e) => handleInputChange('wbsName', e.target.value)}
                placeholder="Enter WBS name"
                className={errors.wbsName ? 'border-red-500' : ''}
              />
              {errors.wbsName && <p className="text-sm text-red-500">{errors.wbsName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">WBS Code *</label>
            <Input 
              value={formData.wbsCode}
              onChange={(e) => handleInputChange('wbsCode', e.target.value)}
              placeholder="Enter WBS code"
              className={errors.wbsCode ? 'border-red-500' : ''}
            />
            {errors.wbsCode && <p className="text-sm text-red-500">{errors.wbsCode}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Site *</label>
            <Select 
              value={formData.site} 
              onValueChange={(value) => handleInputChange('site', value)}
            >
              <SelectTrigger className={errors.site ? 'border-red-500' : ''}>
                <SelectValue placeholder="-- Select Site --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Site A">Site A</SelectItem>
                <SelectItem value="Site B">Site B</SelectItem>
                <SelectItem value="Site C">Site C</SelectItem>
              </SelectContent>
            </Select>
            {errors.site && <p className="text-sm text-red-500">{errors.site}</p>}
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 px-8"
            >
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
