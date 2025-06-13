
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: ""
  });

  const handleSubmit = () => {
    console.log("Adding category:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Add Category</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Category <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Enter category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-purple-700 hover:bg-purple-800 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
