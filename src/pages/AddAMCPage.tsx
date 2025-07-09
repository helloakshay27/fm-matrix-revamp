import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

export const AddAMCPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    details: 'Asset',
    type: 'Individual',
    assetName: '',
    vendor: '',
    startDate: '',
    endDate: '',
    cost: '',
    paymentTerms: '',
    firstService: '',
    noOfVisits: '',
    remarks: ''
  });
  const [attachments, setAttachments] = useState({
    contracts: [] as File[],
    invoices: [] as File[],
    manuals: [] as File[],
    insurance: [] as File[],
    purchaseInvoice: [] as File[],
    amc: [] as File[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: keyof typeof attachments, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(prev => ({
        ...prev,
        [type]: [...prev[type], ...fileArray]
      }));
    }
  };

  const removeFile = (type: keyof typeof attachments, index: number) => {
    setAttachments(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AMC Data:', formData);
    console.log('Attachments:', attachments);
    
    toast({
      title: "AMC Created",
      description: "AMC has been successfully created.",
    });
    
    navigate('/maintenance/amc');
  };

  const handleSaveAndSchedule = () => {
    console.log('Save & Schedule AMC:', formData);
    console.log('Attachments:', attachments);
    
    toast({
      title: "AMC Saved & Scheduled",
      description: "AMC has been saved and scheduled successfully.",
    });
    
    navigate('/maintenance/amc');
  };

  // Responsive styles for TextField and Select
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/amc')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC List
        </Button>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">NEW AMC</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* AMC Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
              AMC CONFIGURATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Details</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="details"
                    value="Asset"
                    checked={formData.details === 'Asset'}
                    onChange={(e) => handleInputChange('details', e.target.value)}
                    className="mr-2"
                    style={{ accentColor: '#C72030' }}
                  />
                  Asset
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="details"
                    value="Service"
                    checked={formData.details === 'Service'}
                    onChange={(e) => handleInputChange('details', e.target.value)}
                    className="mr-2"
                    style={{ accentColor: '#C72030' }}
                  />
                  Service
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="Individual"
                    checked={formData.type === 'Individual'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="mr-2"
                    style={{ accentColor: '#C72030' }}
                  />
                  Individual
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="Group"
                    checked={formData.type === 'Group'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="mr-2"
                    style={{ accentColor: '#C72030' }}
                  />
                  Group
                </label>
              </div>
            </div>

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="asset-select-label" shrink>Assets</InputLabel>
                <MuiSelect
                  labelId="asset-select-label"
                  label="Assets"
                  displayEmpty
                  value={formData.assetName}
                  onChange={(e) => handleInputChange('assetName', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select an Option...</em></MenuItem>
                  <MenuItem value="adani-electric-meter">Adani Electric Meter</MenuItem>
                  <MenuItem value="laptop-dell">Laptop Dell Vostro</MenuItem>
                  <MenuItem value="samsung">Samsung</MenuItem>
                  <MenuItem value="vinayak-testing-1">Vinayak Testing 1</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="vendor-select-label" shrink>Supplier</InputLabel>
                <MuiSelect
                  labelId="vendor-select-label"
                  label="Supplier"
                  displayEmpty
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Supplier</em></MenuItem>
                  <MenuItem value="tbs-electrical">TBS ELECTRICAL</MenuItem>
                  <MenuItem value="modwin-networks">MODWIN NETWORKS PVT.LTD</MenuItem>
                  <MenuItem value="reliance-digital">Reliance Digital</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </CardContent>
        </Card>

        {/* AMC Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
              AMC DETAILS
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <TextField
                  label="Cost"
                  placeholder="Enter Cost"
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <TextField
                  required
                  label="Start Date"
                  placeholder="Select Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <TextField
                  required
                  label="First Service Date"
                  placeholder="Select Date"
                  name="firstService"
                  type="date"
                  value={formData.firstService}
                  onChange={(e) => handleInputChange('firstService', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="payment-terms-select-label" shrink>
                    Payment Terms
                  </InputLabel>
                  <MuiSelect
                    labelId="payment-terms-select-label"
                    label="Payment Terms"
                    displayEmpty
                    value={formData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Payment Term</em></MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="half-yearly">Half Yearly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <TextField
                  required
                  label="End Date"
                  placeholder="Select Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <TextField
                  label="No. of Visits"
                  placeholder="Enter No. of Visit"
                  name="noOfVisits"
                  type="number"
                  value={formData.noOfVisits}
                  onChange={(e) => handleInputChange('noOfVisits', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              {/* Remarks Field - full width in grid */}
              <div className="md:col-span-3">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Enter Remarks"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
              ATTACHMENTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manuals Upload */}
              <div>
                <label className="block font-medium mb-2" style={{ fontSize: '14px', color: '#6b7280' }}>Manuals Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    id="manuals-upload"
                    onChange={(e) => handleFileUpload('manuals', e.target.files)}
                  />
                  <div className="space-y-3">
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      <span style={{ color: '#C72030' }}>Choose File</span> <span>No file chosen</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('manuals-upload')?.click()}
                      className="bg-gray-100 hover:bg-gray-200 text-[#C72030] border-0"
                      style={{ fontSize: '14px' }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Upload Files
                    </Button>
                  </div>
                </div>
                {attachments.manuals.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.manuals.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('manuals', index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Insurance Details */}
              <div>
                <label className="block font-medium mb-2" style={{ fontSize: '14px', color: '#6b7280' }}>Insurance Details</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    id="insurance-upload"
                    onChange={(e) => handleFileUpload('insurance', e.target.files)}
                  />
                  <div className="space-y-3">
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      <span style={{ color: '#C72030' }}>Choose File</span> <span>No file chosen</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('insurance-upload')?.click()}
                      className="bg-gray-100 hover:bg-gray-200 text-[#C72030] border-0"
                      style={{ fontSize: '14px' }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Upload Files
                    </Button>
                  </div>
                </div>
                {attachments.insurance.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.insurance.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('insurance', index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchaselah Invoice */}
              <div>
                <label className="block font-medium mb-2" style={{ fontSize: '14px', color: '#6b7280' }}>Purchaselah Invoice</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    id="purchase-invoice-upload"
                    onChange={(e) => handleFileUpload('purchaseInvoice', e.target.files)}
                  />
                  <div className="space-y-3">
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      <span style={{ color: '#C72030' }}>Choose File</span> <span>No file chosen</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('purchase-invoice-upload')?.click()}
                      className="bg-gray-100 hover:bg-gray-200 text-[#C72030] border-0"
                      style={{ fontSize: '14px' }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Upload Files
                    </Button>
                  </div>
                </div>
                {attachments.purchaseInvoice.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.purchaseInvoice.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('purchaseInvoice', index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AMC */}
              <div>
                <label className="block font-medium mb-2" style={{ fontSize: '14px', color: '#6b7280' }}>AMC</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    id="amc-upload"
                    onChange={(e) => handleFileUpload('amc', e.target.files)}
                  />
                  <div className="space-y-3">
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      <span style={{ color: '#C72030' }}>Choose File</span> <span>No file chosen</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('amc-upload')?.click()}
                      className="bg-gray-100 hover:bg-gray-200 text-[#C72030] border-0"
                      style={{ fontSize: '14px' }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Upload Files
                    </Button>
                  </div>
                </div>
                {attachments.amc.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.amc.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('amc', index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="button" 
            onClick={handleSaveAndSchedule}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Save & Show Details
          </Button>
          <Button 
            type="submit" 
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Save & Schedule AMC
          </Button>
        </div>
      </form>
    </div>
  );
};
