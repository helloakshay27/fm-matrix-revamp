
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { X } from 'lucide-react';
import { SubCategory } from './SubCategoriesSetupTable';
import { editSubCategory, fetchRestaurantCategory } from '@/store/slices/f&bSlice';
import { useAppDispatch } from '@/store/hooks';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface EditSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subCategory: SubCategory | null;
  fetchData: () => Promise<void>;
}

export const EditSubCategoryModal = ({
  isOpen,
  onClose,
  subCategory,
  fetchData
}: EditSubCategoryModalProps) => {
  const dispatch = useAppDispatch()
  const baseUrl = localStorage.getItem('baseUrl')
  const token = localStorage.getItem('token')
  const { id } = useParams();

  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    description: ""
  });
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(fetchRestaurantCategory({ baseUrl, token, id: Number(id) })).unwrap();
        setCategories(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (subCategory) {
      setFormData({
        category: subCategory.category_id,
        subCategory: subCategory.name,
        description: subCategory.description
      });
    }
  }, [subCategory]);

  const validateForm = () => {
    if (!formData.category) {
      toast.error('Please select Category');
      return false;
    }
    else if (!formData.subCategory) {
      toast.error('Please enter Sub-Category Name');
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const payload = {
      spree_manage_restaurant_sub_category: {
        category_id: Number(formData.category),
        name: formData.subCategory,
        description: formData.description
      },
      restaurant_id: Number(id)
    }

    try {
      await dispatch(editSubCategory({ baseUrl, token, id: Number(id), subId: subCategory?.id, data: payload })).unwrap();
      setFormData({ category: "", subCategory: "", description: "" });
      fetchData();
      onClose();
      toast.success('Subcategory edited successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to edit subcategory');
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
              Edit Sub Category
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
                "& .MuiOutlinedInput-root": {
                  height: "auto !important",
                  padding: "2px !important",
                  display: "flex",
                },
                "& .MuiInputBase-input[aria-hidden='true']": {
                  flex: 0,
                  width: 0,
                  height: 0,
                  padding: "0 !important",
                  margin: 0,
                  display: "none",
                },
                "& .MuiInputBase-input": {
                  resize: "none !important",
                },
              }}
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
      </Dialog >
    </>
  );
};
