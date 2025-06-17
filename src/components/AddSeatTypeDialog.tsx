
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface AddSeatTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { categoryName: string; file?: File }) => void;
}

export const AddSeatTypeDialog: React.FC<AddSeatTypeDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    onSubmit({ 
      categoryName: categoryName.trim(),
      file: selectedFile || undefined 
    });
    
    // Reset form
    setCategoryName('');
    setSelectedFile(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    setCategoryName('');
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Create Category</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Category Name<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="text-sm h-10"
            />
          </div>
          
          <div className="text-center">
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-6">
              <Input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-seat-type"
                accept="image/*"
              />
              <label 
                htmlFor="file-upload-seat-type" 
                className="text-orange-500 hover:text-orange-600 cursor-pointer font-medium"
              >
                Choose File
              </label>
              <div className="mt-2 text-sm text-gray-600">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white h-10"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
