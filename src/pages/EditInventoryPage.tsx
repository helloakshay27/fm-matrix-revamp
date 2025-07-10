
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box, Collapse, IconButton } from '@mui/material';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const EditInventoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    assetName: '',
    inventoryName: 'test12',
    inventoryCode: '123987',
    serialNumber: '',
    quantity: '8.0',
    cost: '',
    unit: '',
    expiryDate: '',
    category: '',
    vendor: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: '',
    inventoryType: 'consumable',
    criticality: 'critical',
    ecoFriendly: false,
    taxApplicable: false,
    sacHsnCode: '',
    sgstRate: '',
    cgstRate: '',
    igstRate: ''
  });

  // Collapsible sections state
  const [inventoryDetailsOpen, setInventoryDetailsOpen] = useState(true);
  const [taxDetailsOpen, setTaxDetailsOpen] = useState(false);

  const handleBack = () => {
    navigate(`/maintenance/inventory/details/${id}`);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
  };

  const handleSave = () => {
    console.log('Saving inventory data:', formData);
    // Handle save logic here
    navigate(`/maintenance/inventory/details/${id}`);
  };

  return (
    <>
      <style>
        {`
          .MuiInputLabel-root {
            font-size: 16px !important;
          }
          .MuiOutlinedInput-root {
            border-radius: 6px !important;
          }
          .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #C72030 !important;
          }
          .MuiInputLabel-root.Mui-focused {
            color: #C72030 !important;
          }
        `}
      </style>
      
      <div className="p-6 min-h-screen bg-white">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030]">
              <ArrowLeft className="w-4 h-4" />
              <span>Inventory Details</span>
            </button>
            <span>&gt;</span>
            <span>Edit Inventory</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Edit Inventory</h1>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleBack}
                variant="outlined"
                sx={{ 
                  borderColor: '#C72030',
                  color: '#C72030',
                  '&:hover': {
                    backgroundColor: '#C72030',
                    color: 'white'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                sx={{ 
                  backgroundColor: '#C72030',
                  '&:hover': {
                    backgroundColor: '#A01A28'
                  }
                }}
                variant="contained"
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl">
          {/* Inventory Details Section */}
          <Card className="mb-6">
            <CardHeader 
              className="border-b bg-white cursor-pointer"
              onClick={() => setInventoryDetailsOpen(!inventoryDetailsOpen)}
            >
              <CardTitle className="flex items-center justify-between" style={{ color: '#C72030' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#C72030' }}>!</div>
                  INVENTORY DETAILS
                </div>
                <IconButton size="small">
                  {inventoryDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </IconButton>
              </CardTitle>
            </CardHeader>
            <Collapse in={inventoryDetailsOpen}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Asset Name"
                    value={formData.assetName}
                    onChange={handleInputChange('assetName')}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Inventory Name"
                    value={formData.inventoryName}
                    onChange={handleInputChange('inventoryName')}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Inventory Code"
                    value={formData.inventoryCode}
                    onChange={handleInputChange('inventoryCode')}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Serial Number"
                    value={formData.serialNumber}
                    onChange={handleInputChange('serialNumber')}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Quantity"
                    value={formData.quantity}
                    onChange={handleInputChange('quantity')}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                  <TextField
                    label="Cost"
                    value={formData.cost}
                    onChange={handleInputChange('cost')}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                  <TextField
                    label="Unit"
                    value={formData.unit}
                    onChange={handleInputChange('unit')}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={handleInputChange('expiryDate')}
                    fullWidth
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Category"
                    value={formData.category}
                    onChange={handleInputChange('category')}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Vendor"
                    value={formData.vendor}
                    onChange={handleInputChange('vendor')}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Max Stock Level"
                    value={formData.maxStockLevel}
                    onChange={handleInputChange('maxStockLevel')}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                  <TextField
                    label="Min Stock Level"
                    value={formData.minStockLevel}
                    onChange={handleInputChange('minStockLevel')}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                  <TextField
                    label="Min Order Level"
                    value={formData.minOrderLevel}
                    onChange={handleInputChange('minOrderLevel')}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                  <TextField
                    label="Inventory Type"
                    value={formData.inventoryType}
                    onChange={handleInputChange('inventoryType')}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Criticality"
                    value={formData.criticality}
                    onChange={handleInputChange('criticality')}
                    fullWidth
                    variant="outlined"
                  />
                  <div className="flex items-center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.ecoFriendly}
                          onChange={handleInputChange('ecoFriendly')}
                          sx={{
                            color: '#C72030',
                            '&.Mui-checked': {
                              color: '#C72030',
                            },
                          }}
                        />
                      }
                      label="Eco-friendly"
                    />
                  </div>
                </div>
              </CardContent>
            </Collapse>
          </Card>

          {/* Tax Details Section */}
          <Card>
            <CardHeader 
              className="border-b bg-white cursor-pointer"
              onClick={() => setTaxDetailsOpen(!taxDetailsOpen)}
            >
              <CardTitle className="flex items-center justify-between" style={{ color: '#C72030' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#C72030' }}>T</div>
                  TAX DETAILS
                </div>
                <IconButton size="small">
                  {taxDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </IconButton>
              </CardTitle>
            </CardHeader>
            <Collapse in={taxDetailsOpen}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center mb-4 md:col-span-2">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.taxApplicable}
                          onChange={handleInputChange('taxApplicable')}
                          sx={{
                            color: '#C72030',
                            '&.Mui-checked': {
                              color: '#C72030',
                            },
                          }}
                        />
                      }
                      label="Tax Applicable"
                    />
                  </div>
                  
                  {formData.taxApplicable && (
                    <>
                      <TextField
                        label="SAC/HSN Code"
                        value={formData.sacHsnCode}
                        onChange={handleInputChange('sacHsnCode')}
                        fullWidth
                        variant="outlined"
                      />
                      <TextField
                        label="SGST Rate (%)"
                        value={formData.sgstRate}
                        onChange={handleInputChange('sgstRate')}
                        fullWidth
                        variant="outlined"
                        type="number"
                      />
                      <TextField
                        label="CGST Rate (%)"
                        value={formData.cgstRate}
                        onChange={handleInputChange('cgstRate')}
                        fullWidth
                        variant="outlined"
                        type="number"
                      />
                      <TextField
                        label="IGST Rate (%)"
                        value={formData.igstRate}
                        onChange={handleInputChange('igstRate')}
                        fullWidth
                        variant="outlined"
                        type="number"
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Collapse>
          </Card>
        </div>
      </div>
    </>
  );
};
