
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { X } from 'lucide-react';

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

  const fieldStyles = {
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
        borderColor: '#000000',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666',
      fontSize: '16px',
      '&.Mui-focused': {
        color: '#000000',
      },
    },
    '& .MuiInputBase-input': {
      padding: '8px 14px',
      fontSize: '14px',
    }
  };

  const selectStyles = {
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
        borderColor: '#000000',
      },
    },
    '& .MuiSelect-select': {
      padding: '8px 14px',
      display: 'flex',
      alignItems: 'center',
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold" style={{ color: '#000000' }}>
              ADD Category
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-md transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormControl fullWidth>
            <InputLabel 
              id="category-label" 
              shrink={true}
              sx={{ 
                color: '#666',
                fontSize: '16px',
                '&.Mui-focused': { color: '#000000' }
              }}
            >
              Category
            </InputLabel>
            <Select
              labelId="category-label"
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              sx={selectStyles}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            variant="outlined"
            label="SubCategory"
            placeholder="Enter SubCategory"
            value={formData.subCategory}
            onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
            InputLabelProps={{
              shrink: true,
            }}
            sx={fieldStyles}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Description"
            placeholder="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            InputLabelProps={{
              shrink: true,
            }}
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
                  borderColor: '#000000',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#666',
                fontSize: '16px',
                '&.Mui-focused': {
                  color: '#000000',
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
            className="bg-black hover:bg-gray-800 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
