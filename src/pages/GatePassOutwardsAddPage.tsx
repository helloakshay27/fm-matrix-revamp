import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { ArrowLeft, Upload } from 'lucide-react';

export const GatePassOutwardsAddPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'RETURNABLE' | 'NON RETURNABLE'>('RETURNABLE');

  // Field styles for Material-UI components
  const fieldStyles = {
    height: '45px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      height: '45px',
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#C72030',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    navigate('/security/gate-pass/outwards');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/security/gate-pass/outwards')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Outward List
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Goods Outwards</span>
          <span>&gt;</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('RETURNABLE')}
            className={`px-4 py-2 border text-sm font-medium ${
              activeTab === 'RETURNABLE'
                ? 'bg-[#C72030] text-white border-[#C72030]'
                : 'bg-white text-[#C72030] border-[#C72030]'
            }`}
          >
            RETURNABLE
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('NON RETURNABLE')}
            className={`px-4 py-2 border text-sm font-medium ${
              activeTab === 'NON RETURNABLE'
                ? 'bg-[#C72030] text-white border-[#C72030]'
                : 'bg-white text-[#C72030] border-[#C72030]'
            }`}
          >
            NON RETURNABLE
          </button>
        </div>

        {/* Goods Detail Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#C72030] mb-4">GOODS DETAIL</h2>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <FormControl
              fullWidth
              variant="outlined"
              required
              sx={{ '& .MuiInputBase-root': fieldStyles }}
            >
              <InputLabel shrink>Item Type</InputLabel>
              <MuiSelect
                label="Item Type"
                notched
                displayEmpty
              >
                <MenuItem value="">Select Item Type</MenuItem>
                <MenuItem value="equipment">Equipment</MenuItem>
                <MenuItem value="material">Material</MenuItem>
                <MenuItem value="document">Document</MenuItem>
              </MuiSelect>
            </FormControl>
            
            <FormControl
              fullWidth
              variant="outlined"
              required
              sx={{ '& .MuiInputBase-root': fieldStyles }}
            >
              <InputLabel shrink>Item Category</InputLabel>
              <MuiSelect
                label="Item Category"
                notched
                displayEmpty
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="machinery">Machinery</MenuItem>
                <MenuItem value="tools">Tools</MenuItem>
              </MuiSelect>
            </FormControl>
            
            <TextField
              label="Item Name"
              placeholder="Fill Item Name"
              fullWidth
              variant="outlined"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
            />

            <TextField
              label="Item Quantity"
              placeholder="01"
              fullWidth
              variant="outlined"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <TextField
              label="Unit"
              placeholder="01"
              fullWidth
              variant="outlined"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
            />
            
            <TextField
              label="Description"
              placeholder="Type Here"
              fullWidth
              variant="outlined"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
            />
            
            <TextField
              label="Attachments"
              type="file"
              fullWidth
              variant="outlined"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
                endAdornment: (
                  <Button type="button" size="sm" variant="outline">
                    <Upload className="w-4 h-4" />
                  </Button>
                ),
              }}
            />
            
            <div className="flex items-end">
              <Button 
                type="button"
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white text-sm px-4 py-2 h-[45px] w-full"
              >
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Visitor Detail Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#C72030] mb-4">VISITOR DETAIL</h2>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <FormControl
              fullWidth
              variant="outlined"
              required
              sx={{ '& .MuiInputBase-root': fieldStyles }}
            >
              <InputLabel shrink>Visitor Name</InputLabel>
              <MuiSelect
                label="Visitor Name"
                notched
                displayEmpty
              >
                <MenuItem value="">Enter Name</MenuItem>
                <MenuItem value="john">John Doe</MenuItem>
                <MenuItem value="jane">Jane Smith</MenuItem>
                <MenuItem value="mike">Mike Johnson</MenuItem>
              </MuiSelect>
            </FormControl>
            
            <TextField
              label="Mobile No."
              placeholder="+91-"
              fullWidth
              variant="outlined"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
            />
            
            <TextField
              label="Company Name"
              placeholder="Located"
              fullWidth
              variant="outlined"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
            />
            
            <TextField
              label="Vehicle No."
              placeholder="MH04L1109"
              fullWidth
              variant="outlined"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormControl
              fullWidth
              variant="outlined"
              required
              sx={{ '& .MuiInputBase-root': fieldStyles }}
            >
              <InputLabel shrink>Select Mode Of Transport</InputLabel>
              <MuiSelect
                label="Select Mode Of Transport"
                notched
                displayEmpty
              >
                <MenuItem value="">Type here</MenuItem>
                <MenuItem value="by-hand">By Hand</MenuItem>
                <MenuItem value="by-vehicle">By Vehicle</MenuItem>
                <MenuItem value="by-courier">By Courier</MenuItem>
              </MuiSelect>
            </FormControl>
            
            <TextField
              label="Reporting Time"
              placeholder="12:24 Pm"
              fullWidth
              variant="outlined"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button 
            type="submit"
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-12 py-3"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};