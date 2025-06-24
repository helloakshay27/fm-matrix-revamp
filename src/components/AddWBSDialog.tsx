
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface AddWBSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddWBSDialog: React.FC<AddWBSDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    plantCode: '',
    category: '',
    categoryWBSCode: '',
    wbsName: '',
    wbsCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('WBS Form submitted:', formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      plantCode: '',
      category: '',
      categoryWBSCode: '',
      wbsName: '',
      wbsCode: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-semibold">Add New WBS</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Plant Code</label>
              <Select value={formData.plantCode} onValueChange={(value) => setFormData({...formData, plantCode: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Select Plant --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plant1">Plant 1</SelectItem>
                  <SelectItem value="plant2">Plant 2</SelectItem>
                  <SelectItem value="plant3">Plant 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Input 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category WBS Code</label>
              <Input 
                value={formData.categoryWBSCode}
                onChange={(e) => setFormData({...formData, categoryWBSCode: e.target.value})}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">WBS Name</label>
              <Input 
                value={formData.wbsName}
                onChange={(e) => setFormData({...formData, wbsName: e.target.value})}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">WBS Code</label>
            <Input 
              value={formData.wbsCode}
              onChange={(e) => setFormData({...formData, wbsCode: e.target.value})}
              className="w-full"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-8"
            >
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
