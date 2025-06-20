
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CategoryData {
  id: number;
  category: string;
  timings?: string;
  subCategory?: string;
  active: boolean;
}

interface EditCategoryData {
  category: string;
  timings?: string;
  subCategory?: string;
  id: number;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryData | null;
  onSubmit: (category: EditCategoryData) => void;
}

export const EditCategoryModal = ({ isOpen, onClose, category, onSubmit }: EditCategoryModalProps) => {
  const [formData, setFormData] = useState({
    category: "",
    timings: "",
    subCategory: ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        timings: category.timings || "",
        subCategory: category.subCategory || ""
      });
    }
  }, [category]);

  const handleSubmit = () => {
    if (category) {
      const updatedData: EditCategoryData = {
        id: category.id,
        category: formData.category
      };

      if (category.timings !== undefined) {
        updatedData.timings = formData.timings;
      }

      if (category.subCategory !== undefined) {
        updatedData.subCategory = formData.subCategory;
      }

      onSubmit(updatedData);
    }
    setFormData({ category: "", timings: "", subCategory: "" });
    onClose();
  };

  const isSubCategory = category?.subCategory !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isSubCategory ? 'Edit Sub Category' : 'Edit Category'}
          </DialogTitle>
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

          {!isSubCategory && (
            <div className="space-y-2">
              <Label htmlFor="edit-timings">Timings</Label>
              <Input
                id="edit-timings"
                placeholder=""
                value={formData.timings}
                onChange={(e) => setFormData(prev => ({ ...prev, timings: e.target.value }))}
                className="w-full"
              />
            </div>
          )}

          {isSubCategory && (
            <div className="space-y-2">
              <Label htmlFor="edit-subcategory">Sub Category</Label>
              <Input
                id="edit-subcategory"
                placeholder=""
                value={formData.subCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
