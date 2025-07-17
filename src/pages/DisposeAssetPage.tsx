import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createTheme, ThemeProvider } from '@mui/material';
import { DisposalFormFields } from '@/components/DisposalFormFields';
import { DisposalAssetTable } from '@/components/DisposalAssetTable';
import { HandedOverToSection } from '@/components/HandedOverToSection';
import { CommentsAttachmentsSection } from '@/components/CommentsAttachmentsSection';
console.log('DisposeAssetPage module is being loaded');

// Custom theme for MUI components
const muiTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            // rounded-md
            backgroundColor: '#FFFFFF',
            height: '45px',
            '@media (max-width: 768px)': {
              height: '36px'
            },
            '& fieldset': {
              borderColor: '#E0E0E0'
            },
            '&:hover fieldset': {
              borderColor: '#1A1A1A'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C72030',
              borderWidth: 2
            }
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#1A1A1A',
          fontWeight: 500,
          '&.Mui-focused': {
            color: '#C72030'
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          // rounded-md
          backgroundColor: '#FFFFFF',
          height: '45px',
          '@media (max-width: 768px)': {
            height: '36px'
          }
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            // rounded-md
            height: '45px',
            '@media (max-width: 768px)': {
              height: '36px'
            }
          }
        }
      }
    }
  }
});
export const DisposeAssetPage: React.FC = () => {
  console.log('DisposeAssetPage component is being loaded');
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAssets = location.state?.selectedAssets || [];
  const [disposeDate, setDisposeDate] = useState<Date>();
  const [disposeReason, setDisposeReason] = useState('');
  const [handedOverTo, setHandedOverTo] = useState('vendor');
  const [vendor, setVendor] = useState('');
  const [comments, setComments] = useState('');
  const [assetStatus, setAssetStatus] = useState('Disposed');
  const [soldValue, setSoldValue] = useState('');
  const [breakdown, setBreakdown] = useState('Breakdown');
  const [vendorBids, setVendorBids] = useState([{
    vendorName: '',
    biddingCost: ''
  }]);
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
      breakdown,
      vendorBids
    });
    navigate('/maintenance/asset');
  };
  const handleBack = () => {
    navigate('/maintenance/asset');
  };
  return <ThemeProvider theme={muiTheme}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="shadow-sm bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  DISPOSE ASSET
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 space-y-8">
              {/* Assets Table */}
              <div className="space-y-4">
                <DisposalAssetTable selectedAssets={selectedAssets} breakdown={breakdown} onBreakdownChange={setBreakdown} soldValue={soldValue} onSoldValueChange={setSoldValue} />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <DisposalFormFields disposeDate={disposeDate} onDisposeDateChange={setDisposeDate} disposeReason={disposeReason} onDisposeReasonChange={setDisposeReason} />
              </div>

              {/* Handed Over To Section */}
              <div className="space-y-4">
                <HandedOverToSection handedOverTo={handedOverTo} onHandedOverToChange={setHandedOverTo} vendor={vendor} onVendorChange={setVendor} vendorBids={vendorBids} onVendorBidsChange={setVendorBids} />
              </div>

              {/* Comments and Attachments */}
              <div className="space-y-4">
                <CommentsAttachmentsSection comments={comments} onCommentsChange={setComments} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-2 text-sm font-medium rounded-none w-full sm:w-auto">
                  SUBMIT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>;
};