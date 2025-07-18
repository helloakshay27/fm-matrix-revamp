import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCDetails } from '@/store/slices/amcDetailsSlice';
export const EditAMCPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  
  const { data: amcData, loading, error } = useAppSelector(state => state.amcDetails);

  const [formData, setFormData] = useState({
    assetName: '',
    vendor: '',
    startDate: '',
    endDate: '',
    cost: '',
    paymentTerms: '',
    firstService: '',
    remarks: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  // Fetch AMC data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchAMCDetails(id));
    }
  }, [dispatch, id]);

  // Update form data when AMC data is loaded
  useEffect(() => {
    if (amcData && typeof amcData === 'object') {
      const data = amcData as any; // Type assertion for unknown data
      setFormData({
        assetName: data.asset_name || data.assetName || '',
        vendor: data.vendor || '',
        startDate: data.start_date || data.startDate || '',
        endDate: data.end_date || data.endDate || '',
        cost: data.cost?.toString() || '',
        paymentTerms: data.payment_terms || data.paymentTerms || '',
        firstService: data.first_service_date || data.firstService || '',
        remarks: data.remarks || ''
      });
    }
  }, [amcData]);
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(prev => [...prev, ...fileArray]);
    }
  };
  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated AMC Data:', {
      ...formData,
      attachments
    });
    // Handle form submission
    navigate(`/maintenance/amc/details/${id}`);
  };

  // Responsive styles for TextField and Select
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
  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/maintenance/amc/details/${id}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AMC Details
          </Button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT AMC - {id}</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">Loading AMC data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/maintenance/amc/details/${id}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AMC Details
          </Button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT AMC - {id}</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-red-600">Error loading AMC data: {error}</div>
        </div>
      </div>
    );
  }

  return <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(`/maintenance/amc/details/${id}`)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC Details
        </Button>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT AMC - {id}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030]">AMC Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="asset-select-label" shrink>Asset Name</InputLabel>
                  <MuiSelect labelId="asset-select-label" label="Asset Name" value={formData.assetName} onChange={e => handleInputChange('assetName', e.target.value)} sx={fieldStyles}>
                    <MenuItem value="adani-electric-meter">Adani Electric Meter</MenuItem>
                    <MenuItem value="laptop-dell">Laptop Dell Vostro</MenuItem>
                    <MenuItem value="samsung">Samsung</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="vendor-select-label" shrink>Vendor</InputLabel>
                  <MuiSelect labelId="vendor-select-label" label="Vendor" value={formData.vendor} onChange={e => handleInputChange('vendor', e.target.value)} sx={fieldStyles}>
                    <MenuItem value="tbs-electrical">TBS ELECTRICAL</MenuItem>
                    <MenuItem value="modwin-networks">MODWIN NETWORKS PVT.LTD</MenuItem>
                    <MenuItem value="reliance-digital">Reliance Digital</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <TextField required label="Start Date" placeholder="Select Date" name="startDate" type="date" value={formData.startDate} onChange={e => handleInputChange('startDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
              </div>

              <div>
                <TextField required label="End Date" placeholder="Select Date" name="endDate" type="date" value={formData.endDate} onChange={e => handleInputChange('endDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
              </div>

              <div>
                <TextField label="Cost" placeholder="Enter Cost" name="cost" type="number" value={formData.cost} onChange={e => handleInputChange('cost', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="payment-terms-select-label" shrink>Payment Terms</InputLabel>
                  <MuiSelect labelId="payment-terms-select-label" label="Payment Terms" value={formData.paymentTerms} onChange={e => handleInputChange('paymentTerms', e.target.value)} sx={fieldStyles}>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="half-yearly">Half Yearly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <TextField label="First Service Date" placeholder="Select Date" name="firstService" type="date" value={formData.firstService} onChange={e => handleInputChange('firstService', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
              </div>
            </div>

            <div className="md:col-span-3">
  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
    Remarks
  </label>
  <textarea id="remarks" name="remarks" value={formData.remarks} onChange={e => handleInputChange('remarks', e.target.value)} placeholder="Enter Remarks" rows={3} className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] resize-none" />
          </div>

          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030]">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-[#C72030] rounded-lg p-8 text-center ">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload files or drag and drop</p>
              <p className="text-gray-400 text-sm">PNG, JPG, PDF up to 10MB</p>
              <input type="file" multiple className="hidden" id="file-upload-edit" onChange={e => handleFileUpload(e.target.files)} />
              <Button type="button" variant="outline" className="mt-4" onClick={() => document.getElementById('file-upload-edit')?.click()}>
                Choose Files
              </Button>
              {attachments.length > 0 && <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                      <span>{file.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    </div>)}
                </div>}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/maintenance/amc/details/${id}`)}>
            Cancel
          </Button>
          <Button type="submit" style={{
          backgroundColor: '#C72030'
        }} className="text-white hover:bg-[#C72030]/90">
            Update AMC
          </Button>
        </div>
      </form>
    </div>;
};