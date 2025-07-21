
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { X } from 'lucide-react';

interface SubCategory {
  id: number;
  name: string;
  subCategory?: string;
  description: string;
  active: boolean;
}

interface EditSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subCategory: SubCategory | null;
  onSubmit: (subCategory: SubCategory) => void;
}

const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"];

export const EditSubCategoryModal = ({
  isOpen,
  onClose,
  subCategory,
  onSubmit
}: EditSubCategoryModalProps) => {
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    description: ""
  });

  useEffect(() => {
    if (subCategory) {
      setFormData({
        category: subCategory.name,
        subCategory: subCategory.subCategory,
        description: subCategory.description
      });
    }
  }, [subCategory]);

  const handleSubmit = () => {
    if (subCategory) {
      const updatedSubCategory: SubCategory = {
        ...subCategory,
        name: formData.category,
        subCategory: formData.subCategory,
        description: formData.description
      };

      onSubmit(updatedSubCategory);
    }
    setFormData({ category: "", subCategory: "", description: "" });
    onClose();
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

  const textAreaStyles = {
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

  return (
    <>
      <style>{`
        .MuiInputLabel-root {
          font-size: 16px !important;
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader className="relative">
            <DialogTitle className="text-lg font-semibold">Edit Sub Category</DialogTitle>
            <button
              onClick={onClose}
              className="absolute right-0 top-0 p-1 rounded-md transition-colors hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormControl fullWidth>
              <InputLabel
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
              sx={textAreaStyles}
            />
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
    </>
  );
};
