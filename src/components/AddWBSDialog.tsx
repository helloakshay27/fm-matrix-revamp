
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AddWBSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddWBSDialog = ({ open, onOpenChange }: AddWBSDialogProps) => {
  const [formData, setFormData] = useState({
    plantCode: '',
    category: '',
    categoryWBSCode: '',
    wbsName: '',
    wbsCode: ''
  });

  const handleSubmit = () => {
    if (!formData.plantCode || !formData.category || !formData.wbsName) {
      toast.error('Please fill all required fields');
      return;
    }

    console.log('Adding WBS:', formData);
    toast.success('WBS added successfully!');
    
    // Reset form
    setFormData({
      plantCode: '',
      category: '',
      categoryWBSCode: '',
      wbsName: '',
      wbsCode: ''
    });
    
    onOpenChange(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Add New WBS</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plantCode" className="text-sm font-medium">
                Plant Code
              </Label>
              <Select value={formData.plantCode} onValueChange={(value) => updateFormData('plantCode', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="-- Select Plant --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P001">Plant 001</SelectItem>
                  <SelectItem value="P002">Plant 002</SelectItem>
                  <SelectItem value="P003">Plant 003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat1">Category 1</SelectItem>
                  <SelectItem value="cat2">Category 2</SelectItem>
                  <SelectItem value="cat3">Category 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryWBSCode" className="text-sm font-medium">
                Category WBS Code
              </Label>
              <Input
                id="categoryWBSCode"
                value={formData.categoryWBSCode}
                onChange={(e) => updateFormData('categoryWBSCode', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="wbsName" className="text-sm font-medium">
                WBS Name
              </Label>
              <Input
                id="wbsName"
                value={formData.wbsName}
                onChange={(e) => updateFormData('wbsName', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="wbsCode" className="text-sm font-medium">
              WBS Code
            </Label>
            <Input
              id="wbsCode"
              value={formData.wbsCode}
              onChange={(e) => updateFormData('wbsCode', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
