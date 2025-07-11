import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AttachmentsSection } from './AttachmentsSection';
import { X, ChevronDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CustomTextField } from '@/components/ui/custom-text-field';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField,
  createTheme, 
  ThemeProvider 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [disposeDate, setDisposeDate] = useState<Date | null>(null);
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

  // Mock data for the selected assets table
  const mockAssets = [
    {
      name: 'sdcsdc',
      code: '#02e0d956a50e6203182a',
      status: 'Disposed',
      site: 'Lockated',
      purchaseCost: 'NA',
      currentBookValue: 'NA',
      soldValue: ''
    }
  ];

  const disposeReasons = [
    'End of Life',
    'Damage Beyond Repair',
    'Obsolete Technology',
    'Cost of Repair Exceeds Value',
    'Safety Concerns',
    'Other'
  ];

  const vendors = [
    'ABC Disposal Services',
    'Green Recycling Co.',
    'Tech Waste Solutions',
    'EcoFriendly Disposal',
    'Secure Asset Disposal'
  ];

  const statusOptions = [
    'Disposed',
    'Pending Disposal',
    'In Transit',
    'Scrapped'
  ];

  const breakdownOptions = [
    'Breakdown',
    'Maintenance Required',
    'Operational',
    'Under Repair',
    'Non-Functional'
  ];

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              <div className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[15%]">Asset Name</TableHead>
                      <TableHead className="w-[20%]">Asset Code</TableHead>
                      <TableHead className="w-[15%]">Asset Status</TableHead>
                      <TableHead className="w-[12%]">Site</TableHead>
                      <TableHead className="w-[13%]">Purchase Cost</TableHead>
                      <TableHead className="w-[13%]">Current Book Value</TableHead>
                      <TableHead className="w-[12%]">Sold Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssets.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{asset.code}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 h-9 px-3 justify-between min-w-[120px]"
                              >
                                {breakdown}
                                <ChevronDown className="h-4 w-4 ml-2" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[120px] bg-white border shadow-md">
                              {breakdownOptions.map((option) => (
                                <DropdownMenuItem
                                  key={option}
                                  onClick={() => setBreakdown(option)}
                                  className="cursor-pointer hover:bg-gray-100"
                                >
                                  {option}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>{asset.site}</TableCell>
                        <TableCell>{asset.purchaseCost}</TableCell>
                        <TableCell>{asset.currentBookValue}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            placeholder="Enter Sold Value"
                            value={soldValue}
                            onChange={(e) => setSoldValue(e.target.value)}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6 items-start">
                {/* Dispose Date */}
                <div className="space-y-2">
                  <FormControl fullWidth>
                    <DatePicker
                      label="Dispose Date"
                      value={disposeDate}
                      onChange={(newValue) => setDisposeDate(newValue)}
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          fullWidth: true,
                          InputLabelProps: { shrink: true }
                        }
                      }}
                    />
                  </FormControl>
                </div>

                {/* Dispose Reason */}
                <div className="space-y-2">
                  <FormControl fullWidth>
                    <InputLabel shrink>Dispose Reason *</InputLabel>
                    <Select
                      value={disposeReason}
                      onChange={(e) => setDisposeReason(e.target.value)}
                      label="Dispose Reason *"
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Reason
                      </MenuItem>
                      {disposeReasons.map((reason) => (
                        <MenuItem key={reason} value={reason}>
                          {reason}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Handed Over To */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Handed Over To
                </Label>
                <RadioGroup
                  value={handedOverTo}
                  onValueChange={setHandedOverTo}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vendor" id="vendor" />
                    <Label htmlFor="vendor" className="text-sm">Vendor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="text-sm">User</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Vendor Selection */}
              <div className="space-y-2">
                <FormControl className="max-w-sm">
                  <InputLabel shrink>Vendor *</InputLabel>
                  <Select
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    label="Vendor *"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Vendor
                    </MenuItem>
                    {vendors.map((vendorName) => (
                      <MenuItem key={vendorName} value={vendorName}>
                        {vendorName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Comments and Attachments in one row */}
              <div className="grid grid-cols-2 gap-6 items-start">
                {/* Comments - 50% width */}
                <div className="space-y-2">
                  <FormControl fullWidth>
                    <InputLabel shrink>Comments</InputLabel>
                    <TextField
                      multiline
                      rows={4}
                      placeholder="Type a comment.."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      variant="outlined"
                      fullWidth
                      label="Comments"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 'auto',
                          minHeight: '96px',
                        },
                      }}
                    />
                  </FormControl>
                </div>

                {/* Attachments - 50% width */}
                <div className="space-y-2">
                  <AttachmentsSection />
                </div>
              </div>

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
      </LocalizationProvider>
    </ThemeProvider>
  );
};
