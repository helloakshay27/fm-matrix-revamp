
import React from 'react';
import { ChevronDown, ChevronUp, Percent, Plus, X } from 'lucide-react';
import { TextField } from '@mui/material';

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

interface ItAssetDetailsProps {
  isExpanded: boolean;
  onToggle: () => void;
  itAssetData: {
    os: string;
    totalMemory: string;
    processor: string;
    model: string;
    serialNo: string;
    capacity: string;
  };
  onItAssetChange: (field: string, value: string) => void;
  itCustomFields: Array<{
    id: string;
    name: string;
    value: string;
    section: 'System Details' | 'Hard Disk Details';
  }>;
  onItCustomFieldChange: (id: string, value: string) => void;
  onRemoveItCustomField: (id: string) => void;
  onOpenCustomFieldModal: () => void;
}

export const ItAssetDetailsSection: React.FC<ItAssetDetailsProps> = ({
  isExpanded,
  onToggle,
  itAssetData,
  onItAssetChange,
  itCustomFields,
  onItCustomFieldChange,
  onRemoveItCustomField,
  onOpenCustomFieldModal
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div onClick={onToggle} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
          <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
            <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          IT Asset Details
          <div className="flex items-center gap-2 ml-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-green-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
            <span className="text-sm text-gray-600">If Applicable</span>
          </div>
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
          {/* System Details Section */}
          <div className="mb-6">
            <h3 className="text-[#C72030] font-semibold text-sm mb-4">SYSTEM DETAILS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextField
                label="OS"
                placeholder="Enter OS"
                name="os"
                value={itAssetData.os}
                onChange={(e) => onItAssetChange('os', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Total Memory"
                placeholder="Enter Total Memory"
                name="totalMemory"
                value={itAssetData.totalMemory}
                onChange={(e) => onItAssetChange('totalMemory', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Processor"
                placeholder="Enter Processor"
                name="processor"
                value={itAssetData.processor}
                onChange={(e) => onItAssetChange('processor', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              
              {/* Custom Fields for System Details */}
              {itCustomFields.filter(field => field.section === 'System Details').map((field) => (
                <div key={field.id} className="relative">
                  <TextField
                    label={field.name}
                    placeholder={`Enter ${field.name}`}
                    value={field.value}
                    onChange={(e) => onItCustomFieldChange(field.id, e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                  <button
                    onClick={() => onRemoveItCustomField(field.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Hard Disk Details Section */}
          <div>
            <h3 className="text-[#C72030] font-semibold text-sm mb-4">HARD DISK DETAILS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextField
                label="Model"
                placeholder="Enter Model"
                name="model"
                value={itAssetData.model}
                onChange={(e) => onItAssetChange('model', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Serial No."
                placeholder="Enter Serial No."
                name="serialNo"
                value={itAssetData.serialNo}
                onChange={(e) => onItAssetChange('serialNo', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Capacity"
                placeholder="Enter Capacity"
                name="capacity"
                value={itAssetData.capacity}
                onChange={(e) => onItAssetChange('capacity', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              
              {/* Custom Fields for Hard Disk Details */}
              {itCustomFields.filter(field => field.section === 'Hard Disk Details').map((field) => (
                <div key={field.id} className="relative">
                  <TextField
                    label={field.name}
                    placeholder={`Enter ${field.name}`}
                    value={field.value}
                    onChange={(e) => onItCustomFieldChange(field.id, e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                  <button
                    onClick={() => onRemoveItCustomField(field.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
