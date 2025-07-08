import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Plus, X } from 'lucide-react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    height: '44px',
    '& fieldset': {
      borderColor: '#d1d5db',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    fontSize: '14px',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

// Mock data for units
const unitData = [
  {
    id: 1,
    site: 'Lockaed',
    building: 'Tower 4',
    wing: 'Wing1',
    area: 'North',
    floor: '1st',
    unit: '111',
    entity: '',
    active: true
  },
  {
    id: 2,
    site: 'Lockaed',
    building: 'The Address by Wadhwa Boulevard',
    wing: 'B4',
    area: '',
    floor: '29D',
    unit: '278',
    entity: '',
    active: true
  },
  {
    id: 3,
    site: 'Lockaed',
    building: 'The Address by Wadhwa Boulevard',
    wing: 'B3',
    area: '',
    floor: '29C',
    unit: '278',
    entity: '',
    active: true
  },
  {
    id: 4,
    site: 'Lockaed',
    building: 'The Address by Wadhwa Boulevard',
    wing: 'B2',
    area: '',
    floor: '29B',
    unit: '278',
    entity: '',
    active: true
  },
  {
    id: 5,
    site: 'Lockaed',
    building: 'The Address by Wadhwa Boulevard',
    wing: 'B1',
    area: '',
    floor: '29A',
    unit: '278',
    entity: '',
    active: true
  },
  {
    id: 6,
    site: 'Lockaed',
    building: 'ABS',
    wing: '',
    area: '',
    floor: '1st',
    unit: 'HELP DESK',
    entity: '',
    active: true
  },
  {
    id: 7,
    site: 'Lockaed',
    building: 'Chicago plaza',
    wing: 'A',
    area: 'east',
    floor: '2nd floor',
    unit: 'Reception',
    entity: 'Noid 62',
    active: true
  },
  {
    id: 8,
    site: 'Lockaed',
    building: 'TCS Lab',
    wing: 'A6',
    area: '',
    floor: '12th Floor',
    unit: '101 TCS',
    entity: 'TCS',
    active: true
  },
  {
    id: 9,
    site: 'Lockaed',
    building: 'Jyoti Tower',
    wing: '',
    area: '',
    floor: '2nd Floor',
    unit: '512',
    entity: 'GoPhygital',
    active: true
  }
];

export const UnitMasterPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [formData, setFormData] = useState({
    building: '',
    wing: '',
    area: '',
    floor: '',
    entity: '',
    unitName: ''
  });
  const [editFormData, setEditFormData] = useState({
    building: '',
    wing: '',
    area: '',
    floor: '',
    entity: '',
    unitName: '',
    areaValue: ''
  });

  const handleAddUnitClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting unit data:', formData);
    // Add submit logic here
  };

  const handleEditSubmit = () => {
    console.log('Updating unit data:', editFormData);
    // Add update logic here
    setShowEditModal(false);
  };

  const handleSampleFormat = () => {
    console.log('Download sample format');
  };

  const handleImport = () => {
    console.log('Import units');
  };

  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    setEditFormData({
      building: unit.building,
      wing: unit.wing,
      area: unit.area,
      floor: unit.floor,
      entity: unit.entity,
      unitName: unit.unit,
      areaValue: '50000'
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUnit(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={handleAddUnitClick}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Unit
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#C72030' }}>Add New Unit</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Building</InputLabel>
              <MuiSelect
                value={formData.building}
                onChange={(e) => handleInputChange('building', e.target.value)}
                label="Select Building"
              >
                <MenuItem value="">Select Building</MenuItem>
                <MenuItem value="Tower 4">Tower 4</MenuItem>
                <MenuItem value="The Address by Wadhwa Boulevard">The Address by Wadhwa Boulevard</MenuItem>
                <MenuItem value="ABS">ABS</MenuItem>
                <MenuItem value="Chicago plaza">Chicago plaza</MenuItem>
                <MenuItem value="TCS Lab">TCS Lab</MenuItem>
                <MenuItem value="Jyoti Tower">Jyoti Tower</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Wing</InputLabel>
              <MuiSelect
                value={formData.wing}
                onChange={(e) => handleInputChange('wing', e.target.value)}
                label="Select Wing"
              >
                <MenuItem value="">Select Wing</MenuItem>
                <MenuItem value="Wing1">Wing1</MenuItem>
                <MenuItem value="B4">B4</MenuItem>
                <MenuItem value="B3">B3</MenuItem>
                <MenuItem value="B2">B2</MenuItem>
                <MenuItem value="B1">B1</MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="A6">A6</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Area</InputLabel>
              <MuiSelect
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                label="Select Area"
              >
                <MenuItem value="">Select Area</MenuItem>
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="east">east</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Floor</InputLabel>
              <MuiSelect
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', e.target.value)}
                label="Select Floor"
              >
                <MenuItem value="">Select Floor</MenuItem>
                <MenuItem value="1st">1st</MenuItem>
                <MenuItem value="29D">29D</MenuItem>
                <MenuItem value="29C">29C</MenuItem>
                <MenuItem value="29B">29B</MenuItem>
                <MenuItem value="29A">29A</MenuItem>
                <MenuItem value="2nd floor">2nd floor</MenuItem>
                <MenuItem value="12th Floor">12th Floor</MenuItem>
                <MenuItem value="2nd Floor">2nd Floor</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Entity</InputLabel>
              <MuiSelect
                value={formData.entity}
                onChange={(e) => handleInputChange('entity', e.target.value)}
                label="Select Entity"
              >
                <MenuItem value="">Select Entity</MenuItem>
                <MenuItem value="Noid 62">Noid 62</MenuItem>
                <MenuItem value="TCS">TCS</MenuItem>
                <MenuItem value="GoPhygital">GoPhygital</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="mb-6">
            <TextField
              fullWidth
              label="Unit Name"
              placeholder="Enter Unit Name"
              value={formData.unitName}
              onChange={(e) => handleInputChange('unitName', e.target.value)}
              variant="outlined"
              sx={fieldStyles}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              Submit
            </Button>
            
            <Button 
              onClick={handleSampleFormat}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              Sample Format
            </Button>
            
            <Button 
              onClick={handleImport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              Import
            </Button>
          </div>
        </div>
      )}

      {/* Edit Unit Modal */}
      <Dialog 
        open={showEditModal} 
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <span style={{ color: '#333', fontWeight: 600 }}>Edit Details</span>
          <IconButton onClick={handleCloseEditModal} size="small">
            <X size={20} />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Building</InputLabel>
              <MuiSelect
                value={editFormData.building}
                onChange={(e) => handleEditInputChange('building', e.target.value)}
                label="Select Building"
              >
                <MenuItem value="">Select Building</MenuItem>
                <MenuItem value="Tower 4">Tower 4</MenuItem>
                <MenuItem value="The Address by Wadhwa Boulevard">The Address by Wadhwa Boulevard</MenuItem>
                <MenuItem value="ABS">ABS</MenuItem>
                <MenuItem value="Chicago plaza">Chicago plaza</MenuItem>
                <MenuItem value="TCS Lab">TCS Lab</MenuItem>
                <MenuItem value="Jyoti Tower">Jyoti Tower</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Wing</InputLabel>
              <MuiSelect
                value={editFormData.wing}
                onChange={(e) => handleEditInputChange('wing', e.target.value)}
                label="Select Wing"
              >
                <MenuItem value="">Select Wing</MenuItem>
                <MenuItem value="Wing1">Wing1</MenuItem>
                <MenuItem value="B4">B4</MenuItem>
                <MenuItem value="B3">B3</MenuItem>
                <MenuItem value="B2">B2</MenuItem>
                <MenuItem value="B1">B1</MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="A6">A6</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Area</InputLabel>
              <MuiSelect
                value={editFormData.area}
                onChange={(e) => handleEditInputChange('area', e.target.value)}
                label="Select Area"
              >
                <MenuItem value="">Select Area</MenuItem>
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="east">east</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Floor</InputLabel>
              <MuiSelect
                value={editFormData.floor}
                onChange={(e) => handleEditInputChange('floor', e.target.value)}
                label="Select Floor"
              >
                <MenuItem value="">Select Floor</MenuItem>
                <MenuItem value="1st">1st</MenuItem>
                <MenuItem value="29D">29D</MenuItem>
                <MenuItem value="29C">29C</MenuItem>
                <MenuItem value="29B">29B</MenuItem>
                <MenuItem value="29A">29A</MenuItem>
                <MenuItem value="2nd floor">2nd floor</MenuItem>
                <MenuItem value="12th Floor">12th Floor</MenuItem>
                <MenuItem value="2nd Floor">2nd Floor</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField
              fullWidth
              label="Unit Name"
              value={editFormData.unitName}
              onChange={(e) => handleEditInputChange('unitName', e.target.value)}
              variant="outlined"
              sx={fieldStyles}
            />

            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Select Entity</InputLabel>
              <MuiSelect
                value={editFormData.entity}
                onChange={(e) => handleEditInputChange('entity', e.target.value)}
                label="Select Entity"
              >
                <MenuItem value="">Select Entity</MenuItem>
                <MenuItem value="Noid 62">Noid 62</MenuItem>
                <MenuItem value="TCS">TCS</MenuItem>
                <MenuItem value="GoPhygital">GoPhygital</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="mb-4">
            <TextField
              fullWidth
              label="Area"
              value={editFormData.areaValue}
              onChange={(e) => handleEditInputChange('areaValue', e.target.value)}
              variant="outlined"
              sx={fieldStyles}
            />
          </div>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleEditSubmit}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>Active/Inactive</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Entity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unitData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditClick(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={item.active}
                    sx={{
                      color: '#C72030',
                      '&.Mui-checked': {
                        color: '#C72030',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>{item.site}</TableCell>
                <TableCell>{item.building}</TableCell>
                <TableCell>{item.wing}</TableCell>
                <TableCell>{item.area}</TableCell>
                <TableCell>{item.floor}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.entity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
