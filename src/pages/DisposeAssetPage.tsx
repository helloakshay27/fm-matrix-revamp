// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft } from 'lucide-react';
// import { createTheme, ThemeProvider } from '@mui/material';
// import { DisposalFormFields } from '@/components/DisposalFormFields';
// import { DisposalAssetTable } from '@/components/DisposalAssetTable';
// import { HandedOverToSection } from '@/components/HandedOverToSection';
// import { CommentsAttachmentsSection } from '@/components/CommentsAttachmentsSection';

// // Custom theme for MUI components
// const muiTheme = createTheme({
//   components: {
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: '6px',
//             // rounded-md
//             backgroundColor: '#FFFFFF',
//             height: '45px',
//             '@media (max-width: 768px)': {
//               height: '36px'
//             },
//             '& fieldset': {
//               borderColor: '#E0E0E0'
//             },
//             '&:hover fieldset': {
//               borderColor: '#1A1A1A'
//             },
//             '&.Mui-focused fieldset': {
//               borderColor: '#C72030',
//               borderWidth: 2
//             }
//           }
//         }
//       }
//     },
//     MuiInputLabel: {
//       styleOverrides: {
//         root: {
//           color: '#1A1A1A',
//           fontWeight: 500,
//           '&.Mui-focused': {
//             color: '#C72030'
//           }
//         }
//       }
//     },
//     MuiSelect: {
//       styleOverrides: {
//         root: {
//           borderRadius: '6px',
//           // rounded-md
//           backgroundColor: '#FFFFFF',
//           height: '45px',
//           '@media (max-width: 768px)': {
//             height: '36px'
//           }
//         }
//       }
//     },
//     MuiFormControl: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: '6px',
//             // rounded-md
//             height: '45px',
//             '@media (max-width: 768px)': {
//               height: '36px'
//             }
//           }
//         }
//       }
//     }
//   }
// });
// export const DisposeAssetPage: React.FC = () => {
//   console.log('DisposeAssetPage component is being loaded');
//   const navigate = useNavigate();
//   const location = useLocation();
//   const selectedAssets = location.state?.selectedAssets || [];
//   const [disposeDate, setDisposeDate] = useState<Date>();
//   const [disposeReason, setDisposeReason] = useState('');
//   const [handedOverTo, setHandedOverTo] = useState('vendor');
//   const [vendor, setVendor] = useState('');
//   const [comments, setComments] = useState('');
//   const [assetStatus, setAssetStatus] = useState('Disposed');
//   const [soldValue, setSoldValue] = useState('');
//   const [breakdown, setBreakdown] = useState('Breakdown');
//   const [vendorBids, setVendorBids] = useState([{
//     vendorName: '',
//     biddingCost: ''
//   }]);

//   console.log(selectedAssets)
//   const handleSubmit = () => {
//     console.log('Dispose Asset submitted:', {
//       disposeDate,
//       disposeReason,
//       handedOverTo,
//       vendor,
//       comments,
//       selectedAssets,
//       assetStatus,
//       soldValue,
//       breakdown,
//       vendorBids
//     });
//     navigate('/maintenance/asset');
//   };
//   const handleBack = () => {
//     navigate('/maintenance/asset');
//   };
//   return <ThemeProvider theme={muiTheme}>
//       <div className="min-h-screen bg-gray-50">
//         {/* Header */}
//         <div className="shadow-sm bg-transparent">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
//                   <ArrowLeft className="h-4 w-4" />
//                 </Button>
//                 <h1 className="text-lg sm:text-xl font-bold text-gray-900">
//                   DISPOSE ASSET
//                 </h1>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
//           <div className="bg-white rounded-lg shadow-sm">
//             <div className="p-6 space-y-8">
//               {/* Assets Table */}
//               <div className="space-y-4">
//                 <DisposalAssetTable selectedAssets={selectedAssets} breakdown={breakdown} onBreakdownChange={setBreakdown} soldValue={soldValue} onSoldValueChange={setSoldValue} />
//               </div>

//               {/* Form Fields */}
//               <div className="space-y-4">
//                 <DisposalFormFields disposeDate={disposeDate} onDisposeDateChange={setDisposeDate} disposeReason={disposeReason} onDisposeReasonChange={setDisposeReason} />
//               </div>

//               {/* Handed Over To Section */}
//               <div className="space-y-4">
//                 <HandedOverToSection handedOverTo={handedOverTo} onHandedOverToChange={setHandedOverTo} vendor={vendor} onVendorChange={setVendor} vendorBids={vendorBids} onVendorBidsChange={setVendorBids} />
//               </div>

//               {/* Comments and Attachments */}
//               <div className="space-y-4">
//                 <CommentsAttachmentsSection comments={comments} onCommentsChange={setComments} />
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-center pt-6">
//                 <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-2 text-sm font-medium rounded-none w-full sm:w-auto">
//                   SUBMIT
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ThemeProvider>;
// };
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createTheme, ThemeProvider } from '@mui/material';
import { DisposalFormFields } from '@/components/DisposalFormFields';
import { DisposalAssetTable } from '@/components/DisposalAssetTable';
import { HandedOverToSection } from '@/components/HandedOverToSection';
import { CommentsAttachmentsSection } from '@/components/CommentsAttachmentsSection';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import axios from 'axios';

const muiTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
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
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedAssets, setSelectedAssets] = useState(location.state?.selectedAssets || []);

  // Per-asset breakdown and sold value states
  const [breakdowns, setBreakdowns] = useState<{ [key: string]: string }>({});
  const [soldValues, setSoldValues] = useState<{ [key: string]: string }>({});

  // Other form states
  const [disposeDate, setDisposeDate] = useState<Date>();
  const [disposeReason, setDisposeReason] = useState('');
  const [handedOverTo, setHandedOverTo] = useState<string>('vendor');
  const [vendor, setVendor] = useState('');
  const [user, setUser] = useState('');
  const [comments, setComments] = useState('');
const [vendorBids, setVendorBids] = useState([{ vendor_name: '', bidding_cost: '' }]);
  const [attachments, setAttachments] = useState<string[]>([]);

  // Function to refresh a specific asset's data
  const handleAssetUpdate = async (assetId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/assets/${assetId}.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        const updatedAssetData = await response.json();
        
        // Update the asset in selectedAssets state
        setSelectedAssets(prevAssets => 
          prevAssets.map(asset => 
            asset.id === assetId 
              ? { ...asset, status: updatedAssetData.status || asset.status }
              : asset
          )
        );
      }
    } catch (error) {
      console.error('Error refreshing asset data:', error);
    }
  };

  const handleSubmit = async () => {
    // Validation for required fields
    if (!disposeDate) {
      toast({
        title: "Validation Error",
        description: "Dispose date is required.",
        variant: "destructive",
      });
      return;
    }

    if (!disposeReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Dispose reason is required.",
        variant: "destructive",
      });
      return;
    }

    // Validate vendor or user selection based on handedOverTo
    if (handedOverTo === 'vendor' && !vendor.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a vendor.",
        variant: "destructive",
      });
      return;
    }

    if (handedOverTo === 'user' && !user.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a user.",
        variant: "destructive",
      });
      return;
    }

    let handedOverToId = '';
    let handedOverToType = '';
    if (handedOverTo === 'vendor') {
      handedOverToType = 'Vendor';
      handedOverToId = vendor;
    } else if (handedOverTo === 'user') {
      handedOverToType = 'User';
      handedOverToId = user;
    }

    // Prepare assets object for backend
    const assetsObj: Record<string, { id: string | number; sold_value: string | number }> = {};
    selectedAssets.forEach((asset: any, idx: number) => {
      assetsObj[idx] = {
        id: asset.id,
        sold_value: soldValues[asset.id] || ''
      };
    });

    // Prepare bidding array as stringified JSON
    const biddingStr = JSON.stringify(vendorBids);

    // Prepare payload
    const payload = {
      dispose_date: disposeDate ? disposeDate.toISOString().split('T')[0] : '',
      reason: disposeReason,
      handed_over_to_type: handedOverToType,
      handed_over_to_id: handedOverToId,
      comments,
      bidding: biddingStr,
      attachments,
      assets: assetsObj
    };

    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      await axios.post(`https://${baseUrl}/pms/asset_disposal`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Show success message
      toast({
        title: "Asset Disposal Successful",
        description: 'Asset is marked as "Disposed" and recorded successfully',
        variant: "default",
      });
      
      navigate('/maintenance/asset');
    } catch (error) {
      console.error('Dispose Asset API error:', error);
      
      // Show error message
      toast({
        title: "Asset Disposal Failed",
        description: "Failed to dispose asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate('/maintenance/asset');
  };

  // Handlers for per-asset breakdown and sold value
  const handleBreakdownChange = (breakdown: string, assetId?: string) => {
    if (assetId) {
      setBreakdowns(prev => ({ ...prev, [assetId]: breakdown }));
    }
  };

  const handleSoldValueChange = (value: string, assetId?: string) => {
    if (assetId) {
      setSoldValues(prev => ({ ...prev, [assetId]: value }));
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="shadow-sm bg-transparent">
          <div className="mx-auto px-4 sm:px-6 py-4">
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
        <div className="mx-auto px-4 sm:px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 space-y-8">
              {/* Assets Table */}
              <div className="space-y-4">
                <DisposalAssetTable
                  selectedAssets={selectedAssets}
                  breakdown={breakdowns}
                  onBreakdownChange={handleBreakdownChange}
                  soldValues={soldValues}
                  onSoldValueChange={handleSoldValueChange}
                  onAssetUpdate={handleAssetUpdate}
                />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <DisposalFormFields
                  disposeDate={disposeDate}
                  onDisposeDateChange={setDisposeDate}
                  disposeReason={disposeReason}
                  onDisposeReasonChange={setDisposeReason}
                />
              </div>

              {/* Handed Over To Section */}
              <div className="space-y-4">
                <HandedOverToSection
                  handedOverTo={handedOverTo}
                  onHandedOverToChange={setHandedOverTo}
                  vendor={vendor}
                  onVendorChange={setVendor}
                  vendorBids={vendorBids}
                  onVendorBidsChange={setVendorBids}
                />
              </div>

              {/* Comments and Attachments */}
              <div className="space-y-4">
                <CommentsAttachmentsSection
                  comments={comments}
                  onCommentsChange={setComments}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-2 text-sm font-medium rounded-none w-full sm:w-auto"
                >
                  SUBMIT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};