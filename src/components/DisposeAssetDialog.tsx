
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { 
  createTheme, 
  ThemeProvider 
} from '@mui/material';
import { DisposalFormFields } from './DisposalFormFields';
import { DisposalAssetTable } from './DisposalAssetTable';
import { HandedOverToSection } from './HandedOverToSection';
import { CommentsAttachmentsSection } from './CommentsAttachmentsSection';

// Custom theme for MUI components
const muiTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px', // rounded-md
            backgroundColor: '#FFFFFF',
            height: '45px',
            '@media (max-width: 768px)': {
              height: '36px',
            },
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
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#1A1A1A',
          fontWeight: 500,
          '&.Mui-focused': {
            color: '#C72030',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '6px', // rounded-md
          backgroundColor: '#FFFFFF',
          height: '45px',
          '@media (max-width: 768px)': {
            height: '36px',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px', // rounded-md
            height: '45px',
            '@media (max-width: 768px)': {
              height: '36px',
            },
          },
        },
      },
    },
  },
});

interface DisposeAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: string[];
}

export const DisposeAssetDialog: React.FC<DisposeAssetDialogProps> = ({
  isOpen,
  onClose,
  selectedAssets
}) => {
  const [disposeDate, setDisposeDate] = useState<Date>();
  const [disposeReason, setDisposeReason] = useState('');
  const [handedOverTo, setHandedOverTo] = useState('vendor');
  const [vendor, setVendor] = useState('');
  const [comments, setComments] = useState('');
  const [assetStatus, setAssetStatus] = useState('Disposed');
  const [soldValue, setSoldValue] = useState('');
  const [breakdown, setBreakdown] = useState('Breakdown');

  const handleSubmit = () => {
    console.log('Dispose Asset submitted:', {
      disposeDate,
      disposeReason,
      handedOverTo,
      vendor,
      comments,
      selectedAssets,
      assetStatus,
      soldValue,
      breakdown
    });
    onClose();
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-none min-w-[95%] max-h-[80vh] overflow-y-auto p-0">
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-900 uppercase">
              DISPOSE ASSET
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-none hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Assets Table */}
            <DisposalAssetTable
              selectedAssets={selectedAssets}
              breakdown={breakdown}
              onBreakdownChange={setBreakdown}
              soldValue={soldValue}
              onSoldValueChange={setSoldValue}
            />

            {/* Form Fields */}
            <DisposalFormFields
              disposeDate={disposeDate}
              onDisposeDateChange={setDisposeDate}
              disposeReason={disposeReason}
              onDisposeReasonChange={setDisposeReason}
            />

            {/* Handed Over To Section */}
            <HandedOverToSection
              handedOverTo={handedOverTo}
              onHandedOverToChange={setHandedOverTo}
              vendor={vendor}
              onVendorChange={setVendor}
            />

            {/* Comments and Attachments */}
            <CommentsAttachmentsSection
              comments={comments}
              onCommentsChange={setComments}
            />

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSubmit}
                className="bg-blue-900 hover:bg-blue-800 text-white px-12 py-3 text-sm font-medium uppercase tracking-wide"
              >
                SUBMIT
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};
