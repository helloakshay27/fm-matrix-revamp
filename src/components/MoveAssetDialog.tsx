
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { CustomTextField } from '@/components/ui/custom-text-field';
import { TextField, MenuItem, ThemeProvider, createTheme } from '@mui/material';

interface MoveAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: any[];
}

// Custom theme for MUI dropdowns
const dropdownTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px', // rounded-md
            backgroundColor: '#FFFFFF',
            height: '45px', // Desktop height
            '@media (max-width: 768px)': {
              height: '36px', // Mobile height
            },
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
            '&.Mui-focused': {
              color: '#C72030',
            },
          },
          '& .MuiSelect-select': {
            color: '#1A1A1A',
            fontSize: '14px',
            '@media (max-width: 768px)': {
              fontSize: '12px',
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
          '&.Mui-selected': {
            backgroundColor: '#C72030',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#B01E2F',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '6px',
        },
      },
    },
  },
});

export const MoveAssetDialog: React.FC<MoveAssetDialogProps> = ({
  isOpen,
  onClose,
  selectedAssets
}) => {
  const [allocateTo, setAllocateTo] = useState('department');
  const [site, setSite] = useState('');
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = () => {
    console.log('Moving assets:', selectedAssets);
    onClose();
  };

  // Sample options for dropdowns
  const siteOptions = ['Haven Infoline', 'Site 2', 'Site 3'];
  const buildingOptions = ['Jyoti Tower', 'Building 2', 'Building 3'];
  const wingOptions = ['J', 'A', 'B', 'C'];
  const areaOptions = ['East', 'West', 'North', 'South'];
  const floorOptions = ['1', '2', '3', '4', '5'];
  const roomOptions = ['R 101', 'R 102', 'R 201', 'R 202', 'R 301'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] 2xl:max-w-[70vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
              MOVE ASSET
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
          {/* Asset Table */}
          <div className="mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1200px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Name</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Code</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Status</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Site</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Building</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Wing</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Floor</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Area</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Room</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Department/User</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-t border-gray-200">
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Dell Laptop</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">#3423</td>
                      <td className="px-2 sm:px-3 py-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          In Use
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Haven Infoline</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Jyoti Tower</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">J</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">2</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">East</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">R 202</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-blue-600">👤 Technical</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Computer Table</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">#1233</td>
                      <td className="px-2 sm:px-3 py-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                          Breakdown
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Haven Infoline</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Jyoti Tower</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">J</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">2</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">East</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">R 202</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-orange-600">👤 Rakesh K.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Movement To Section */}
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Movement To</h3>
            <ThemeProvider theme={dropdownTheme}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                <TextField
                  select
                  label="Site*"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Select Site"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9CA3AF' }}>Select Site</span>;
                      }
                      return selected as string;
                    },
                  }}
                >
                  {siteOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Building*"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Select Building"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9CA3AF' }}>Select Building</span>;
                      }
                      return selected as string;
                    },
                  }}
                >
                  {buildingOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Wing*"
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Select Wing"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9CA3AF' }}>Select Wing</span>;
                      }
                      return selected as string;
                    },
                  }}
                >
                  {wingOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Area*"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Select Area"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9CA3AF' }}>Select Area</span>;
                      }
                      return selected as string;
                    },
                  }}
                >
                  {areaOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Floor*"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Select Floor"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9CA3AF' }}>Select Floor</span>;
                      }
                      return selected as string;
                    },
                  }}
                >
                  {floorOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Room*"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Select Room"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9CA3AF' }}>Select Room</span>;
                      }
                      return selected as string;
                    },
                  }}
                >
                  {roomOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </ThemeProvider>
          </div>

          {/* Allocate To Section */}
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Allocate To</h3>
            <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
              <div className="flex-shrink-0">
                <RadioGroup value={allocateTo} onValueChange={setAllocateTo} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="department" id="department" />
                    <Label htmlFor="department" className="text-sm">Department</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="text-sm">User</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex-1 max-w-full lg:max-w-xs">
                <CustomTextField
                  label="Department*"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Select Department"
                  size="small"
                />
              </div>
            </div>
          </div>
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
  );
};
