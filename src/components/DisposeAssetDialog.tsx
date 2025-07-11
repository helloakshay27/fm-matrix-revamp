
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
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] 2xl:max-w-[70vw] max-h-[90vh] flex flex-col">
          <DialogHeader className="px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                DISPOSE ASSET
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
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
          </div>

          {/* Submit Button - Fixed at bottom */}
          <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-center flex-shrink-0 bg-white">
            <Button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-2 text-sm font-medium rounded-none w-full sm:w-auto"
            >
              SUBMIT
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};
