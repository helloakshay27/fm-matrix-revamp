
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Category {
  id: number;
  category: string;
  timings: string;
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
    timings: ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        timings: category.timings
      });
    }
  }, [category]);

  const handleSubmit = () => {
    if (category) {
      onSubmit({
        ...category,
        category: formData.category,
        timings: formData.timings
      });
    }
    setFormData({ category: "", timings: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category" className="text-sm">
              Category
            </Label>
            <Input
              id="edit-category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-timings" className="text-sm">
              Timings
            </Label>
            <Input
              id="edit-timings"
              value={formData.timings}
              onChange={(e) => setFormData(prev => ({ ...prev, timings: e.target.value }))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
