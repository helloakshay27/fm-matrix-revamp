
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { X, Upload } from 'lucide-react';

interface AddSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subCategory: { category: string; subCategory: string; description: string; icon?: File }) => void;
}

// const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"];

export const AddSubCategoryModal = ({
  isOpen,
  onClose,
  onSubmit
}: AddSubCategoryModalProps) => {
  const dispatch = useAppDispatch()
  const { id } = useParams();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    description: ""
  });
  const [iconFile, setIconFile] = useState<File | null>(null);

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIconFile(file);
    }
  };

  const handleSubmit = () => {
    if (formData.category.trim() && formData.subCategory.trim()) {
      onSubmit({ ...formData, icon: iconFile || undefined });
      setFormData({ category: "", subCategory: "", description: "" });
      setIconFile(null);
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
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="max-w-md">
        <div className="flex items-center justify-between">
          <DialogTitle
            sx={{
              fontSize: '18px',
              fontWeight: 550,
              color: '#000000',
              padding: '12px 0px',
            }}
          >
            ADD Subcategory
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

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
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
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

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Icon
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor="icon-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Icon
                  </span>
                </Button>
              </label>
              <input
                id="icon-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleIconChange}
              />
              {iconFile && (
                <span className="text-sm text-gray-600">{iconFile.name}</span>
              )}
            </div>
          </div>
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
    </Dialog >
  );
};
