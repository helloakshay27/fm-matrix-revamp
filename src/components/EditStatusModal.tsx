
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField } from '@mui/material';
import { X } from 'lucide-react';

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditStatusModal: React.FC<EditStatusModalProps> = ({ isOpen, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleSubmit = () => {
    console.log('Selected status:', selectedStatus);
    onClose();
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
            <DialogTitle className="text-lg font-semibold text-gray-900">Edit Status</DialogTitle>
            <button
              onClick={onClose}
              className="absolute right-0 top-0 p-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <TextField
              fullWidth
              variant="outlined"
              label="Select Status"
              placeholder="Enter Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '6px',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  '& fieldset': {
                    borderColor: '#E0E0E0',
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
                  '&.Mui-focused': {
                    color: '#C72030',
                  },
                },
              }}
            />

            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleSubmit}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
