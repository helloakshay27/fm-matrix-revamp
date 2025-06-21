
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add New WBS</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Plant Code</label>
              <Select value={formData.plantCode} onValueChange={(value) => setFormData({...formData, plantCode: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Select Plant --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plant1">Plant 1</SelectItem>
                  <SelectItem value="plant2">Plant 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category WBS Code</label>
              <Input 
                value={formData.categoryWBSCode}
                onChange={(e) => setFormData({...formData, categoryWBSCode: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">WBS Name</label>
              <Input 
                value={formData.wbsName}
                onChange={(e) => setFormData({...formData, wbsName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">WBS Code</label>
            <Input 
              value={formData.wbsCode}
              onChange={(e) => setFormData({...formData, wbsCode: e.target.value})}
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="text-white px-8"
              style={{ backgroundColor: '#C72030' }}
            >
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
