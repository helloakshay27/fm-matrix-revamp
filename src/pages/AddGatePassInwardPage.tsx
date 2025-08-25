import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Box, Typography, IconButton, Button as MuiButton } from '@mui/material';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { AttachFile, Close } from '@mui/icons-material';
import { useToast } from '@/hooks/use-toast';

interface AttachmentFile {
  id: string;
  file: File;
  name: string;
  url: string;
}

interface MaterialRow {
  id: number;
  itemType: string;
  itemCategory: string;
  itemName: string;
  quantity: string;
  unit: string;
  description: string;
}

export const AddGatePassInwardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [materialRows, setMaterialRows] = useState<MaterialRow[]>([
    { id: 1, itemType: '', itemCategory: '', itemName: '', quantity: '', unit: '', description: '' }
  ]);

  const [visitorDetails, setVisitorDetails] = useState({
    visitorName: '',
    mobileNo: '',
    companyName: '',
    vehicleNo: '',
    reportingTime: '',
    modeOfTransport: ''
  });

  const handleVisitorChange = (field: keyof typeof visitorDetails, value: string) => {
    setVisitorDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRow = () => {
    const newId = materialRows.length > 0 ? Math.max(...materialRows.map(r => r.id)) + 1 : 1;
    setMaterialRows([...materialRows, { id: newId, itemType: '', itemCategory: '', itemName: '', quantity: '', unit: '', description: '' }]);
  };

  const handleDeleteRow = (id: number) => {
    setMaterialRows(materialRows.filter(row => row.id !== id));
  };

  const handleRowChange = (id: number, field: keyof Omit<MaterialRow, 'id'>, value: string) => {
    setMaterialRows(materialRows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map(file => ({
        id: `${file.name}-${Date.now()}`,
        file: file,
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const fieldStyles = {
    height: '40px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      height: '40px',
      fontSize: '14px',
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
      fontSize: '14px',
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visitorDetails.visitorName || !visitorDetails.mobileNo) {
      toast({
        title: "Validation Error",
        description: "Please fill in visitor name and mobile number.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Visitor Details:', visitorDetails);
      console.log('Material Rows:', materialRows);
      console.log('Attachments:', attachments);
      
      toast({
        title: "Success",
        description: "Gate pass inward entry created successfully!"
      });
      
      navigate('/security/gate-pass/inwards');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to create entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
          <div 
            onClick={() => navigate('/security/gate-pass/inwards')}
            className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inward List
          </div>
        <div className="flex justify-between items-center my-4">
          <h1 className="text-2xl font-bold text-gray-800">Create Gate Pass Inward</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 border border-gray-200 rounded-lg p-10 bg-white">
        
        {/* Visitor Detail Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Visitor Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TextField label="Visitor Name" placeholder="Enter Name" fullWidth variant="outlined" required value={visitorDetails.visitorName} onChange={(e) => handleVisitorChange('visitorName', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            <TextField label="Mobile No." placeholder="+91" fullWidth variant="outlined" required value={visitorDetails.mobileNo} onChange={(e) => handleVisitorChange('mobileNo', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            <TextField label="Company Name" placeholder="Lockated" fullWidth variant="outlined" value={visitorDetails.companyName} onChange={(e) => handleVisitorChange('companyName', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            <FormControl fullWidth variant="outlined" required sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Mode Of Transport *</InputLabel>
              <MuiSelect label="Mode Of Transport *" notched displayEmpty value={visitorDetails.modeOfTransport} onChange={(e) => handleVisitorChange('modeOfTransport', e.target.value)}>
                <MenuItem value="">Select Transport</MenuItem>
                <MenuItem value="car">Car</MenuItem>
                <MenuItem value="bike">Bike</MenuItem>
                <MenuItem value="truck">Truck</MenuItem>
                <MenuItem value="walk">Walking</MenuItem>
                <MenuItem value="bicycle">Bicycle</MenuItem>
              </MuiSelect>
            </FormControl>
            <TextField label="Vehicle No." placeholder="MH04BA-1009" fullWidth variant="outlined" value={visitorDetails.vehicleNo} onChange={(e) => handleVisitorChange('vehicleNo', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            <TextField label="Reporting Time" type="time" fullWidth variant="outlined" required value={visitorDetails.reportingTime} onChange={(e) => handleVisitorChange('reportingTime', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
          </div>
        </div>

        {/* Goods Detail Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Item Details</h2>
            <Button type="button" onClick={handleAddRow} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white text-sm px-4 py-2">Add Item</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-white uppercase bg-[#C72030]">
                <tr>
                  <th scope="col" className="px-4 py-3">Sr.No.</th>
                  <th scope="col" className="px-4 py-3">Item Type</th>
                  <th scope="col" className="px-4 py-3">Item Category</th>
                  <th scope="col" className="px-4 py-3">Item Name</th>
                  <th scope="col" className="px-4 py-3">Quantity</th>
                  <th scope="col" className="px-4 py-3">Unit</th>
                  <th scope="col" className="px-4 py-3">Description</th>
                  <th scope="col" className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {materialRows.map((row, index) => (
                  <tr key={row.id} className="bg-white border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      <FormControl fullWidth variant="outlined" size="small">
                        <MuiSelect displayEmpty value={row.itemType} onChange={(e) => handleRowChange(row.id, 'itemType', e.target.value)}>
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="equipment">Equipment</MenuItem>
                          <MenuItem value="material">Material</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </td>
                    <td className="px-4 py-2">
                      <FormControl fullWidth variant="outlined" size="small">
                        <MuiSelect displayEmpty value={row.itemCategory} onChange={(e) => handleRowChange(row.id, 'itemCategory', e.target.value)}>
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="electronics">Electronics</MenuItem>
                          <MenuItem value="tools">Tools</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </td>
                    <td className="px-4 py-2">
                      <FormControl fullWidth variant="outlined" size="small">
                        <MuiSelect displayEmpty value={row.itemName} onChange={(e) => handleRowChange(row.id, 'itemName', e.target.value)}>
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="laptop">Laptop</MenuItem>
                          <MenuItem value="keyboard">Keyboard</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </td>
                    <td className="px-4 py-2"><TextField variant="outlined" size="small" value={row.quantity} onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)} /></td>
                    <td className="px-4 py-2"><TextField variant="outlined" size="small" value={row.unit} onChange={(e) => handleRowChange(row.id, 'unit', e.target.value)} /></td>
                    <td className="px-4 py-2"><TextField variant="outlined" size="small" value={row.description} onChange={(e) => handleRowChange(row.id, 'description', e.target.value)} /></td>
                    <td className="px-4 py-2">
                      <button type="button" onClick={() => handleDeleteRow(row.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Attachment Section */}
        <div>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {attachments.map((attachment) => {
              const isImage = attachment.file.type.startsWith('image/');
              return (
                <>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h2>
                  <Box
                    key={attachment.id}
                    sx={{
                      width: '120px',
                    height: '120px',
                    border: '2px dashed #ccc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    backgroundColor: '#fafafa',
                    '&:hover': { borderColor: '#999' }
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    sx={{
                      position: 'absolute', top: 4, right: 4,
                      backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      width: 20, height: 20,
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <Close sx={{ fontSize: 12 }} />
                  </IconButton>
                  {isImage ? (
                    <img src={attachment.url} alt={attachment.name} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', marginBottom: 8, borderRadius: 4 }} />
                  ) : (
                    <AttachFile sx={{ fontSize: 24, color: '#666', mb: 1 }} />
                  )}
                  {!isImage && (
                    <Typography variant="caption" sx={{ textAlign: 'center', px: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                      {attachment.name}
                    </Typography>
                  )}
                </Box>
                </>
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <MuiButton
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                borderColor: '#C72030', color: '#C72030', textTransform: 'none',
                fontWeight: 500, padding: '8px 16px',
                '&:hover': { borderColor: '#B8252F', backgroundColor: 'rgba(199, 32, 48, 0.04)' },
              }}
            >
              Add Attachment
            </MuiButton>
            <input type="file" ref={fileInputRef} multiple onChange={handleFileChange} className="hidden" />
          </Box>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="submit" className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2">Submit</Button>
          <Button type="button" variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-8 py-2" onClick={() => navigate('/security/gate-pass/inwards')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};