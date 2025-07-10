
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface AddSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subCategory: { category: string; subCategory: string; description: string }) => void;
}

const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"];

export const AddSubCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: AddSubCategoryModalProps) => {
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    description: ""
  });

  const handleSubmit = () => {
    if (formData.category.trim() && formData.subCategory.trim()) {
      onSubmit(formData);
      setFormData({ category: "", subCategory: "", description: "" });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold" style={{ color: '#C72030' }}>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-sm flex items-center justify-center"
                style={{ backgroundColor: '#C72030' }}
              >
                <span className="text-white text-xs font-bold">+</span>
              </div>
              ADD Category
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormControl fullWidth>
            <InputLabel 
              id="category-label" 
              sx={{ 
                color: '#666',
                fontSize: '14px',
                '&.Mui-focused': { color: '#C72030' }
              }}
            >
              Category
            </InputLabel>
            <Select
              labelId="category-label"
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              sx={{
                height: { xs: '36px', sm: '45px' },
                borderRadius: '6px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9ca3af',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C72030',
                  },
                },
                '& .MuiSelect-select': {
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                }
              }}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="SubCategory"
            placeholder="Enter SubCategory"
            value={formData.subCategory}
            onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
            sx={{
              '& .MuiInputBase-root': {
                height: { xs: '36px', sm: '45px' },
                borderRadius: '6px',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C72030',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#666',
                fontSize: '14px',
                '&.Mui-focused': {
                  color: '#C72030',
                },
              },
              '& .MuiInputBase-input': {
                padding: '8px 14px',
                fontSize: '14px',
              }
            }}
          />

          <TextField
            fullWidth
            label="Description"
            placeholder="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C72030',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#666',
                fontSize: '14px',
                '&.Mui-focused': {
                  color: '#C72030',
                },
              },
              '& .MuiInputBase-input': {
                padding: '8px 14px',
                fontSize: '14px',
              }
            }}
          />
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
