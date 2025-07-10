
import React from 'react';
import { ChevronDown, ChevronUp, Package, Plus, X } from 'lucide-react';
import { TextField } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectChangeEvent } from '@mui/material';

const fieldStyles = {
  height: {
    xs: 28,
    sm: 36,
    md: 45
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: {
      xs: '8px',
      sm: '10px',
      md: '12px'
    }
  }
};

interface AssetDetailsProps {
  isExpanded: boolean;
  onToggle: () => void;
  formData: {
    assetName: string;
    assetNo: string;
    modelNo: string;
    serialNo: string;
    manufacturer: string;
    vendor: string;
    group: string;
    subgroup: string;
    commissioningDate: string;
    status: string;
  };
  onInputChange: (field: string, value: string | boolean) => void;
  customFields: Array<{ id: string; name: string; value: string; }>;
  onCustomFieldChange: (id: string, value: string) => void;
  onRemoveCustomField: (id: string) => void;
  onOpenCustomFieldModal: () => void;
}

export const AssetDetailsSection: React.FC<AssetDetailsProps> = ({
  isExpanded,
  onToggle,
  formData,
  onInputChange,
  customFields,
  onCustomFieldChange,
  onRemoveCustomField,
  onOpenCustomFieldModal
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div onClick={onToggle} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
          <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          ASSET DETAILS
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCustomFieldModal();
            }}
            className="px-3 py-1 rounded-md text-sm flex items-center gap-1 bg-[#f6f4ee] text-red-700"
          >
            <Plus className="w-4 h-4" />
            Custom Field
          </button>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 sm:p-6">
          {/* First Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            <TextField
              required
              label="Asset Name"
              placeholder="Enter Asset Name"
              name="assetName"
              value={formData.assetName}
              onChange={(e) => onInputChange('assetName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              required
              label="Asset No"
              placeholder="Enter Asset No"
              name="assetNo"
              value={formData.assetNo}
              onChange={(e) => onInputChange('assetNo', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              required
              label="Model No"
              placeholder="Enter Model No"
              name="modelNo"
              value={formData.modelNo}
              onChange={(e) => onInputChange('modelNo', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Serial No"
              placeholder="Enter Serial No"
              name="serialNo"
              value={formData.serialNo}
              onChange={(e) => onInputChange('serialNo', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              required
              label="Manufacturer"
              placeholder="Enter Manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => onInputChange('manufacturer', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="vendor-select-label" shrink>Vendor</InputLabel>
              <MuiSelect
                labelId="vendor-select-label"
                label="Vendor"
                displayEmpty
                value={formData.vendor}
                onChange={(e: SelectChangeEvent) => onInputChange('vendor', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Vendor</em></MenuItem>
                <MenuItem value="vendor1">Vendor 1</MenuItem>
                <MenuItem value="vendor2">Vendor 2</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="group-select-label" shrink>Group</InputLabel>
              <MuiSelect
                labelId="group-select-label"
                label="Group"
                displayEmpty
                value={formData.group}
                onChange={(e: SelectChangeEvent) => onInputChange('group', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Group</em></MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Mechanical">Mechanical</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="subgroup-select-label" shrink>Subgroup</InputLabel>
              <MuiSelect
                labelId="subgroup-select-label"
                label="Subgroup"
                displayEmpty
                value={formData.subgroup}
                onChange={(e: SelectChangeEvent) => onInputChange('subgroup', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Sub-Group</em></MenuItem>
                <MenuItem value="Electric Meter">Electric Meter</MenuItem>
                <MenuItem value="Water Meter">Water Meter</MenuItem>
              </MuiSelect>
            </FormControl>
            <TextField
              label="Commissioning Date"
              placeholder="dd/mm/yyyy"
              name="commissioningDate"
              type="date"
              value={formData.commissioningDate}
              onChange={(e) => onInputChange('commissioningDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
              {customFields.map((field) => (
                <div key={field.id} className="relative">
                  <TextField
                    label={field.name}
                    placeholder={`Enter ${field.name}`}
                    value={field.value}
                    onChange={(e) => onCustomFieldChange(field.id, e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                  <button
                    onClick={() => onRemoveCustomField(field.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Status Section */}
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <span className="text-red-700 font-normal">Status</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="status-inuse"
                    name="status"
                    value="in-use"
                    checked={formData.status === 'in-use'}
                    onChange={(e) => onInputChange('status', e.target.value)}
                    className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="status-inuse" className="text-sm">In Use</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="status-breakdown"
                    name="status"
                    value="breakdown"
                    checked={formData.status === 'breakdown'}
                    onChange={(e) => onInputChange('status', e.target.value)}
                    className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="status-breakdown" className="text-sm">Breakdown</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
