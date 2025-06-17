
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Category {
  id: number;
  category: string;
  amount: string;
  active: boolean;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSubmit: (category: Category) => void;
}

export const EditCategoryModal = ({ isOpen, onClose, category, onSubmit }: EditCategoryModalProps) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        amount: category.amount
      });
    }
  }, [category]);

  const handleSubmit = () => {
    if (category) {
      onSubmit({
        ...category,
        category: formData.category,
        amount: formData.amount
      });
    }
    setFormData({ category: "", amount: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Edit Category</DialogTitle>
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
            <Label htmlFor="edit-category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-category"
              placeholder=""
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount</Label>
            <Input
              id="edit-amount"
              placeholder=""
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full"
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
