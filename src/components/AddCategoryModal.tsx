
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: { category: string; timings?: string; amount?: string }) => void;
  showTimings?: boolean;
  showAmount?: boolean;
}

export const AddCategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  showTimings = true,
}: AddCategoryModalProps) => {
  const [formData, setFormData] = useState({
    category: "",
    timings: "",
  });

  const validateForm = () => {
    if (!formData.category) {
      toast.error('Please enter Category Name');
      return false;
    }
    else if (!formData.timings) {
      toast.error('Please enter timings');
      return false;
    }
    return true;
  }

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (formData.category.trim()) {
      onSubmit(formData);
      setFormData({ category: "", timings: "" });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">ADD Category</DialogTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-md transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <TextField
            fullWidth
            variant="outlined"
            label="Category Name*"
            placeholder="Enter Category Name"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            InputLabelProps={{
              shrink: true,
            }}
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

          {showTimings && (
            <TextField
              fullWidth
              variant="outlined"
              label="Timings*"
              placeholder="Enter Timings"
              value={formData.timings}
              onChange={(e) => setFormData(prev => ({ ...prev, timings: e.target.value }))}
              InputLabelProps={{
                shrink: true,
              }}
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
