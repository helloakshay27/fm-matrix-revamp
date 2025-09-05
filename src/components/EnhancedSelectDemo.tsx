import React, { useState } from 'react';
import { EnhancedSelect, SearchableSelect } from '@/components/ui/enhanced-select';
import { useEnhancedSelectStyles } from '@/hooks/useEnhancedSelectStyles';
import { getEnhancedSelectProps } from '@/utils/enhancedSelectUtils';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

// Example component demonstrating all enhanced select methods
export const EnhancedSelectDemo = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const { fieldStyles, menuProps } = useEnhancedSelectStyles();

  // Sample options
  const buildingOptions = [
    { value: '', label: 'Select Building' },
    { value: 'tower1', label: 'Tower 1 - Main Building' },
    { value: 'tower2', label: 'Tower 2 - Office Complex' },
    { value: 'tower3', label: 'Tower 3 - Residential Wing' },
    { value: 'tower4', label: 'Tower 4 - Commercial Space' },
    { value: 'warehouse', label: 'Warehouse Building' },
    { value: 'parking', label: 'Parking Structure' },
    { value: 'amenities', label: 'Amenities Center' },
    { value: 'security', label: 'Security Office' },
    { value: 'maintenance', label: 'Maintenance Facility' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Enhanced Select Implementation Examples</h1>
      
      {/* Method 1: SearchableSelect Component */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-blue-600">Method 1: SearchableSelect Component (With Search)</h2>
        <p className="text-sm text-gray-600">
          Uses custom SearchableSelect component with built-in search functionality, short height, and internal scroll.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableSelect
            label="Building (Searchable)"
            value={selectedBuilding}
            onChange={(value) => setSelectedBuilding(value as string)}
            options={buildingOptions}
            placeholder="Search and select building..."
          />
          <SearchableSelect
            label="Category (Searchable)"
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value as string)}
            options={categoryOptions}
            placeholder="Search categories..."
          />
        </div>
      </div>

      {/* Method 2: useEnhancedSelectStyles Hook */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-green-600">Method 2: useEnhancedSelectStyles Hook</h2>
        <p className="text-sm text-gray-600">
          Uses the hook to apply enhanced styling to standard MUI Select components.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Status</InputLabel>
            <MuiSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as string)}
              label="Status"
              displayEmpty
              variant="outlined"
              sx={fieldStyles}          // ✅ Short Height Control
              MenuProps={menuProps}     // ✅ Internal Scroll
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending Approval</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
              <MenuItem value="deleted">Deleted</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Priority</InputLabel>
            <MuiSelect
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as string)}
              label="Priority"
              displayEmpty
              variant="outlined"
              sx={fieldStyles}
              MenuProps={menuProps}
            >
              <MenuItem value="">Select Priority</MenuItem>
              <MenuItem value="urgent">🔴 Urgent</MenuItem>
              <MenuItem value="high">🟠 High</MenuItem>
              <MenuItem value="medium">🟡 Medium</MenuItem>
              <MenuItem value="low">🟢 Low</MenuItem>
              <MenuItem value="minimal">⚪ Minimal</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>
      </div>

      {/* Method 3: Utility Function */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-purple-600">Method 3: Utility Function</h2>
        <p className="text-sm text-gray-600">
          Uses getEnhancedSelectProps() utility to quickly enhance existing Select components.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Department</InputLabel>
            <MuiSelect
              value=""
              onChange={() => {}}
              label="Department"
              variant="outlined"
              {...getEnhancedSelectProps()}  // ✅ All features applied
            >
              <MenuItem value="">Select Department</MenuItem>
              <MenuItem value="hr">Human Resources</MenuItem>
              <MenuItem value="it">Information Technology</MenuItem>
              <MenuItem value="finance">Finance & Accounting</MenuItem>
              <MenuItem value="operations">Operations</MenuItem>
              <MenuItem value="marketing">Marketing & Sales</MenuItem>
              <MenuItem value="legal">Legal & Compliance</MenuItem>
              <MenuItem value="admin">Administration</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Location</InputLabel>
            <MuiSelect
              value=""
              onChange={() => {}}
              label="Location"
              variant="outlined"
              {...getEnhancedSelectProps()}
            >
              <MenuItem value="">Select Location</MenuItem>
              <MenuItem value="mumbai">Mumbai, Maharashtra</MenuItem>
              <MenuItem value="delhi">New Delhi, Delhi</MenuItem>
              <MenuItem value="bangalore">Bangalore, Karnataka</MenuItem>
              <MenuItem value="hyderabad">Hyderabad, Telangana</MenuItem>
              <MenuItem value="pune">Pune, Maharashtra</MenuItem>
              <MenuItem value="chennai">Chennai, Tamil Nadu</MenuItem>
              <MenuItem value="kolkata">Kolkata, West Bengal</MenuItem>
              <MenuItem value="ahmedabad">Ahmedabad, Gujarat</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-red-600">✨ Feature Showcase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">🔍 Search Functionality</h3>
            <p className="text-blue-600">Type in SearchableSelect to filter options in real-time</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800">📏 Short Height Control</h3>
            <p className="text-green-600">Consistent 36px/40px/45px heights across screen sizes</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800">📜 Internal Scroll</h3>
            <p className="text-purple-600">200px max height with automatic scrolling for long lists</p>
          </div>
        </div>
      </div>
    </div>
  );
};
