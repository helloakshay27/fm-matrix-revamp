
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from '@mui/material';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/store/hooks';
import { editCategory } from '@/store/slices/f&bSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
  timing?: string;
  amount?: string;
  active: boolean;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  showTimings?: boolean;
  showAmount?: boolean;
  fetchData: () => void
}

export const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  showTimings = true,
  showAmount = false,
  fetchData
}: EditCategoryModalProps) => {
  const dispatch = useAppDispatch()
  const baseUrl = localStorage.getItem('baseUrl')
  const token = localStorage.getItem('token')
  const { id } = useParams()

  const [formData, setFormData] = useState({
    category: "",
    timing: "",
    amount: ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category: category.name,
        timing: category.timing || "",
        amount: category.amount || ""
      });
    }
  }, [category]);

  const validateForm = () => {
    if (!formData.category) {
      toast.error('Please enter Category Name');
      return false;
    }
    else if (!formData.timing) {
      toast.error('Please enter timings');
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const payload = {
      spree_manage_restaurant_category: {
        name: formData.category,
        timing: formData.timing,
      },
      restaurant_id: Number(id)
    }
    try {
      await dispatch(editCategory({ baseUrl, token, id: Number(id), catId: category?.id, data: payload })).unwrap();
      setFormData({ category: "", timing: "", amount: "" });
      fetchData()
      onClose();
    } catch (error) {
      console.log(error)
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
        <DialogContent className="max-w-sm">
          <DialogHeader className="relative">
            <DialogTitle className="text-lg font-semibold">Edit Status</DialogTitle>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <TextField
              label="Category Name"
              placeholder="Enter Category Name"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              fullWidth
              variant="outlined"
              InputProps={{
                style: { borderRadius: '6px' }
              }}
              InputLabelProps={{ shrink: true }}
            />

            {showTimings && (
              <TextField
                label="Timings"
                placeholder="Enter Timings"
                value={formData.timing}
                onChange={(e) => setFormData(prev => ({ ...prev, timing: e.target.value }))}
                fullWidth
                variant="outlined"
                InputProps={{
                  style: { borderRadius: '6px' }
                }}
                InputLabelProps={{ shrink: true }}
              />
            )}

            {showAmount && (
              <TextField
                label="Amount"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                fullWidth
                variant="outlined"
                InputProps={{
                  style: { borderRadius: '6px' }
                }}
                InputLabelProps={{ shrink: true }}
              />
            )}
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
