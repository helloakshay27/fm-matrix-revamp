import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

export const AddInventoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    category: '',
    subCategory: '',
    brand: '',
    model: '',
    quantity: '',
    unit: '',
    location: '',
    condition: '',
    purchaseDate: '',
    warrantyExpiry: '',
    supplier: '',
    purchasePrice: '',
    currentValue: '',
    description: ''
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [dynamicFields, setDynamicFields] = useState([
    { id: Date.now(), label: '', value: '', type: 'text' }
  ]);

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const addField = () => {
    setDynamicFields([...dynamicFields, { 
      id: Date.now(), 
      label: '', 
      value: '', 
      type: 'text' 
    }]);
  };

  const updateDynamicField = (id: number, field: string, value: string) => {
    setDynamicFields(dynamicFields.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeDynamicField = (id: number) => {
    if (dynamicFields.length > 1) {
      setDynamicFields(dynamicFields.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inventory Data:', { ...formData, dynamicFields, selectedFiles });
    
    toast({
      title: "Success",
      description: "Inventory item created successfully!",
    });
    
    navigate('/maintenance/inventory');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/inventory')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory List
        </Button>
        <p className="text-[#1a1a1a] opacity-70 mb-2">Inventory &gt; Add Inventory Item</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD INVENTORY ITEM</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
              BASIC INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <TextField
                  required
                  label="Item Name"
                  placeholder="Enter Item Name"
                  name="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <TextField
                  required
                  label="Item Code"
                  placeholder="Enter Item Code"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={(e) => handleInputChange('itemCode', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="category-select-label" shrink>Category</InputLabel>
                  <MuiSelect
                    labelId="category-select-label"
                    label="Category"
                    displayEmpty
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Category</em></MenuItem>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="furniture">Furniture</MenuItem>
                    <MenuItem value="office-supplies">Office Supplies</MenuItem>
                    <MenuItem value="equipment">Equipment</MenuItem>
                    <MenuItem value="tools">Tools</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="subcategory-select-label" shrink>Sub Category</InputLabel>
                  <MuiSelect
                    labelId="subcategory-select-label"
                    label="Sub Category"
                    displayEmpty
                    value={formData.subCategory}
                    onChange={(e) => handleInputChange('subCategory', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                    <MenuItem value="computers">Computers</MenuItem>
                    <MenuItem value="printers">Printers</MenuItem>
                    <MenuItem value="desks">Desks</MenuItem>
                    <MenuItem value="chairs">Chairs</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <TextField
                  label="Brand"
                  placeholder="Enter Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <TextField
                  label="Model"
                  placeholder="Enter Model"
                  name="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <TextField
                  required
                  label="Quantity"
                  placeholder="Enter Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="unit-select-label" shrink>Unit</InputLabel>
                  <MuiSelect
                    labelId="unit-select-label"
                    label="Unit"
                    displayEmpty
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Unit</em></MenuItem>
                    <MenuItem value="pcs">Pieces</MenuItem>
                    <MenuItem value="kg">Kilogram</MenuItem>
                    <MenuItem value="ltr">Liters</MenuItem>
                    <MenuItem value="box">Box</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <TextField
                  label="Location"
                  placeholder="Enter Location"
                  name="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="condition-select-label" shrink>Condition</InputLabel>
                  <MuiSelect
                    labelId="condition-select-label"
                    label="Condition"
                    displayEmpty
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Condition</em></MenuItem>
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="fair">Fair</MenuItem>
                    <MenuItem value="poor">Poor</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <TextField
                  label="Purchase Date"
                  placeholder="Select Date"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      ...fieldStyles,
                      '& .MuiInputBase-input': {
                        ...fieldStyles['& .MuiInputBase-input, & .MuiSelect-select'],
                        fontSize: { xs: '11px', sm: '12px', md: '13px' },
                      }
                    }
                  }}
                />
              </div>

              <div>
                <TextField
                  label="Warranty Expiry"
                  placeholder="Select Date"
                  name="warrantyExpiry"
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) => handleInputChange('warrantyExpiry', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      ...fieldStyles,
                      '& .MuiInputBase-input': {
                        ...fieldStyles['& .MuiInputBase-input, & .MuiSelect-select'],
                        fontSize: { xs: '11px', sm: '12px', md: '13px' },
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <TextField
                  label="Supplier"
                  placeholder="Enter Supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <TextField
                  label="Purchase Price"
                  placeholder="Enter Purchase Price"
                  name="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <TextField
                  label="Current Value"
                  placeholder="Enter Current Value"
                  name="currentValue"
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => handleInputChange('currentValue', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
            </div>

            <div className="mb-4">
              <TextField
                label="Description"
                placeholder="Enter item description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Files Upload */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
              FILES UPLOAD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-8">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  id="file-upload"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10"
                >
                  Choose Files
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'No files chosen'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Fields Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
                ADDITIONAL FIELDS
              </div>
              <Button 
                type="button"
                onClick={addField}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dynamicFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <TextField
                      label="Field Label"
                      placeholder="Enter field label"
                      value={field.label}
                      onChange={(e) => updateDynamicField(field.id, 'label', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                    />
                  </div>
                  
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id={`field-type-${field.id}`} shrink>Field Type</InputLabel>
                      <MuiSelect
                        labelId={`field-type-${field.id}`}
                        label="Field Type"
                        value={field.type}
                        onChange={(e) => updateDynamicField(field.id, 'type', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="select">Dropdown</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    {field.type === 'select' ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id={`field-value-${field.id}`} shrink>Field Value</InputLabel>
                        <MuiSelect
                          labelId={`field-value-${field.id}`}
                          label="Field Value"
                          displayEmpty
                          value={field.value}
                          onChange={(e) => updateDynamicField(field.id, 'value', e.target.value)}
                          sx={fieldStyles}
                        >
                          <MenuItem value=""><em>Select Value</em></MenuItem>
                          <MenuItem value="option1">Option 1</MenuItem>
                          <MenuItem value="option2">Option 2</MenuItem>
                          <MenuItem value="option3">Option 3</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    ) : (
                      <TextField
                        label="Field Value"
                        placeholder="Enter field value"
                        type={field.type}
                        value={field.value}
                        onChange={(e) => updateDynamicField(field.id, 'value', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                      />
                    )}
                  </div>

                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeDynamicField(field.id)}
                      disabled={dynamicFields.length === 1}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            type="submit"
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Save Inventory Item
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate('/maintenance/inventory')}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};
