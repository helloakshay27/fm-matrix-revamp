import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from '@mui/material';
import { X } from "lucide-react";
import { toast } from 'sonner';

interface SeatType {
  id: number;
  name: string;
  active: boolean;
  createdOn: string;
}

interface EditSeatTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seatType: SeatType | null;
  onSubmit: (data: { categoryName: string; file?: File }) => void;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff !important',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#E5E7EB',
    },
    '&:hover fieldset': {
      borderColor: '#D1D5DB',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#DA7756',
      borderWidth: '1px',
    },
  },
};

export const EditSeatTypeDialog: React.FC<EditSeatTypeDialogProps> = ({
  open,
  onOpenChange,
  seatType,
  onSubmit,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (seatType) {
      setCategoryName(seatType.name);
    }
  }, [seatType]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    onSubmit({
      categoryName: categoryName.trim(),
      file: selectedFile || undefined,
    });

    setCategoryName('');
    setSelectedFile(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    setCategoryName('');
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md [&>button]:hidden !bg-white">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <DialogTitle className="text-lg font-semibold">Edit Category</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <TextField
            fullWidth
            variant="outlined"
            label="Category Name *"
            placeholder="Enter Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              ...fieldStyles,
              '& .MuiInputLabel-root': {
                color: '#6B7280',
                '&.Mui-focused': {
                  color: '#DA7756',
                },
              },
            }}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Upload Category Icon</label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-brand text-brand hover:bg-brand-selected"
                onClick={() => document.getElementById('file-upload-edit-seat-type')?.click()}
              >
                Choose File
              </Button>
              <span className="text-sm text-gray-500 truncate">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
              <input
                id="file-upload-edit-seat-type"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <div className="w-24 h-24 bg-gray-100 rounded border overflow-hidden">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto"
            >
              Submit
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-brand text-brand px-8 w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
