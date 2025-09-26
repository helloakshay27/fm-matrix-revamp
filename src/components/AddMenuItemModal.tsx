import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from "lucide-react";
import { useAppDispatch } from '@/store/hooks';
import { fetchRestaurantCategory, fetchSubcategory } from '@/store/slices/f&bSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (menuItem: any, file?: File) => void;
}

export const AddMenuItemModal = ({
  isOpen,
  onClose,
  onSubmit
}: AddMenuItemModalProps) => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const { id } = useParams();

  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    displayPrice: "",
    stock: "",
    category: "",
    subCategory: "",
    sgstAmount: "",
    sgstRate: "",
    cgstRate: "",
    cgstAmount: "",
    igstRate: "",
    igstAmount: "",
    description: "",
    masterPrice: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(fetchRestaurantCategory({ baseUrl, token, id: Number(id) })).unwrap();
        setCategories(response);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await dispatch(fetchSubcategory({ baseUrl, token, id: Number(id) })).unwrap();
        setSubCategories(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
    fetchSubCategories();
  }, [dispatch, baseUrl, token, id]);

  useEffect(() => {
    const calculateTaxAmounts = () => {
      const displayPrice = parseFloat(formData.displayPrice) || 0;
      const sgstRate = parseFloat(formData.sgstRate) || 0;
      const cgstRate = parseFloat(formData.cgstRate) || 0;
      const igstRate = parseFloat(formData.igstRate) || 0;

      const sgstAmount = (displayPrice * sgstRate) / 100;
      const cgstAmount = (displayPrice * cgstRate) / 100;
      const igstAmount = (displayPrice * igstRate) / 100;

      setFormData({
        ...formData,
        sgstAmount: sgstAmount.toFixed(2),
        cgstAmount: cgstAmount.toFixed(2),
        igstAmount: igstAmount.toFixed(2),
      });
    };

    calculateTaxAmounts();
  }, [formData.displayPrice, formData.sgstRate, formData.cgstRate, formData.igstRate]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const validateForm = () => {
    if (!formData.productName) {
      toast.error('Please enter Product Name');
      return false;
    } else if (!formData.sku) {
      toast.error('Please enter SKU');
      return false;
    } else if (!formData.masterPrice) {
      toast.error('Please enter Master Price');
      return false;
    } else if (!formData.stock) {
      toast.error('Please enter Stock');
      return false;
    } else if (!formData.category) {
      toast.error('Please select Category');
      return false;
    } else if (!formData.subCategory) {
      toast.error('Please select Sub Category');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (formData.productName.trim() && formData.sku.trim()) {
      onSubmit(formData, selectedFile);
      setFormData({
        productName: "",
        sku: "",
        displayPrice: "",
        stock: "",
        category: "",
        subCategory: "",
        sgstAmount: "",
        sgstRate: "",
        cgstRate: "",
        cgstAmount: "",
        igstRate: "",
        igstAmount: "",
        description: "",
        masterPrice: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, JPG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      setSelectedFile(file);
    }
  };

  const fieldStyles = {
    '& .MuiInputBase-root': {
      height: { xs: '36px', sm: '45px' },
      borderRadius: '6px',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      backgroundColor: '#FFFFFF',
      '& fieldset': {
        borderColor: '#E0E0E0',
        borderRadius: '6px',
      },
      '&:hover fieldset': {
        borderColor: '#1A1A1A',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#1A1A1A',
      fontWeight: 500,
      fontSize: '16px',
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
    '& .MuiInputBase-input': {
      padding: '8px 14px',
      fontSize: '14px',
    }
  };

  const textareaFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      backgroundColor: '#FFFFFF',
      minHeight: '80px',
      '& fieldset': {
        borderColor: '#E0E0E0',
        borderRadius: '6px',
      },
      '&:hover fieldset': {
        borderColor: '#1A1A1A',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#1A1A1A',
      fontWeight: 500,
      fontSize: '16px',
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  const selectFieldStyles = {
    '& .MuiInputBase-root': {
      height: { xs: '36px', sm: '45px' },
      borderRadius: '6px',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      backgroundColor: '#FFFFFF',
      '& fieldset': {
        borderColor: '#E0E0E0',
        borderRadius: '6px',
      },
      '&:hover fieldset': {
        borderColor: '#1A1A1A',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#1A1A1A',
      fontWeight: 500,
      fontSize: '16px',
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
    '& .MuiSelect-select': {
      padding: '8px 14px',
      display: 'flex',
      alignItems: 'center',
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} PaperProps={{
      sx: {
        width: '100%',
        maxWidth: '60rem',
        borderRadius: 2,
      },
    }}>
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto bg-white" sx={{ width: '100%' }}>
        <div className="flex items-center justify-between">
          <DialogTitle
            sx={{
              fontSize: '18px',
              fontWeight: 550,
              color: '#000000',
              padding: '12px 0px',
            }}
          >
            ADD PRODUCT
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          <div className="space-y-2">
            <TextField
              label="Product Name*"
              placeholder="Product Name"
              value={formData.productName}
              onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="SKU*"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="Master Price*"
              placeholder="Master Price"
              type="number"
              value={formData.masterPrice}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
                  setFormData(prev => ({ ...prev, masterPrice: value }));
                }
              }}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
              inputProps={{ min: 0 }}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="Display Price"
              placeholder="Display Price"
              type="number"
              value={formData.displayPrice}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
                  setFormData(prev => ({ ...prev, displayPrice: value }));
                }
              }}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
              inputProps={{ min: 0 }}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="Stock*"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" sx={selectFieldStyles}>
              <InputLabel shrink>Category*</InputLabel>
              <MuiSelect
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                label="Category*"
                notched
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" sx={selectFieldStyles}>
              <InputLabel shrink>Select Subcategory*</InputLabel>
              <MuiSelect
                value={formData.subCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                label="Select Subcategory*"
                notched
              >
                {subCategories.map(subCategory => (
                  <MenuItem key={subCategory.id} value={subCategory.id}>{subCategory.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <TextField
              label="SGST Rate"
              placeholder="SGST Rate"
              value={formData.sgstRate}
              onChange={(e) => setFormData(prev => ({ ...prev, sgstRate: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="SGST Amount"
              placeholder="SGST Amount"
              value={formData.sgstAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, sgstAmount: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="CGST Rate"
              placeholder="CGST Rate"
              value={formData.cgstRate}
              onChange={(e) => setFormData(prev => ({ ...prev, cgstRate: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="CGST Amount"
              placeholder="CGST Amount"
              value={formData.cgstAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, cgstAmount: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="IGST Rate"
              placeholder="IGST Rate"
              value={formData.igstRate}
              onChange={(e) => setFormData(prev => ({ ...prev, igstRate: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="IGST Amount"
              placeholder="IGST Amount"
              value={formData.igstAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, igstAmount: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <TextField
              label="Description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              InputLabelProps={{ shrink: true }}
              sx={{
                "&.MuiFormControl-root:has(.MuiInputBase-multiline)": {
                  margin: "0 !important",
                },
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

          <div className="space-y-2">
            <Label className="text-sm">Image Upload</Label>
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/jpeg,image/png,image/jpg"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-gray-600 hover:text-gray-800"
              >
                <div className="text-sm">
                  {selectedFile ? (
                    <span className="text-green-600">Selected: {selectedFile.name}</span>
                  ) : (
                    <>
                      Drag & Drop or <span className="text-orange-500">Choose File</span> No file chosen
                    </>
                  )}
                </div>
              </label>
            </div>
            {previewUrl && (
              <div className="mt-4">
                <div className="relative w-[200px]">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      toast.success('Selected image removed');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};