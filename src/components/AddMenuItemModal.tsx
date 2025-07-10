
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from "lucide-react";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (menuItem: any) => void;
}

const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"];
const subCategories = ["Continental", "Indian", "Italian", "Chinese", "South Indian"];

export const AddMenuItemModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: AddMenuItemModalProps) => {
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
    description: "",
    masterPrice: "",
    active: "Yes"
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (formData.productName.trim() && formData.sku.trim()) {
      onSubmit({
        ...formData,
        active: formData.active === "Yes"
      });
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
        description: "",
        masterPrice: "",
        active: "Yes"
      });
      setSelectedFile(null);
      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-black">
            ADD PRODUCT
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

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
              onChange={(e) => setFormData(prev => ({ ...prev, masterPrice: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="Display Price"
              placeholder="Display Price"
              type="number"
              value={formData.displayPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, displayPrice: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="Stock"
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
              <InputLabel shrink>Active</InputLabel>
              <MuiSelect
                value={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.value }))}
                label="Active"
                notched
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </MuiSelect>
            </FormControl>
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
                  <MenuItem key={category} value={category}>{category}</MenuItem>
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
                  <MenuItem key={subCategory} value={subCategory}>{subCategory}</MenuItem>
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
              sx={textareaFieldStyles}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              Manuals Upload
            </Label>
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx"
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
