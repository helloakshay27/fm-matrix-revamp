import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, RadioGroup, FormControlLabel, Radio, Box, Typography, IconButton, Button as MuiButton, Autocomplete } from '@mui/material';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { AttachFile, Close } from '@mui/icons-material';
import { gateNumberService } from '@/services/gateNumberService';
import { gatePassInwardService } from '@/services/gatePassInwardService';
import { gatePassTypeService } from '@/services/gatePassTypeService';
import { useToast } from '@/hooks/use-toast';

// Define DropdownOption type
type DropdownOption = {
  id: number;
  name: string;
  [key: string]: any;
};


interface AttachmentFile {
  id: string;
  file: File;
  name: string;
  url: string;
}

interface MaterialRow {
  id: number;
  itemTypeId: number | null;
  itemCategoryId: number | null;
  itemNameId: number | null;
  quantity: string;
  unit: string;
  description: string;
  maxQuantity: number | null;
}

export const GatePassOutwardsAddPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [returnableStatus, setReturnableStatus] = useState<'returnable' | 'non-returnable'>('returnable');

  const [materialRows, setMaterialRows] = useState<MaterialRow[]>([
    { id: 1, itemTypeId: null, itemCategoryId: null, itemNameId: null, quantity: '', unit: '', description: '', maxQuantity: null }
  ]);

  const [visitorDetails, setVisitorDetails] = useState({
    visitorName: '',
    mobileNo: '',
    companyId: null as number | null,
    vehicleNo: '',
    reportingTime: '',
    modeOfTransport: ''
  });

  const [gatePassDetails, setGatePassDetails] = useState({
    gatePassTypeId: null as number | null,
    gatePassDate: '',
    siteId: null as number | null,
    buildingId: null as number | null,
    remarks: '',
  });

  const [companies, setCompanies] = useState<DropdownOption[]>([]);
  const [gatePassTypes, setGatePassTypes] = useState<DropdownOption[]>([]);
  const [sites, setSites] = useState<DropdownOption[]>([]);
  const [buildings, setBuildings] = useState<DropdownOption[]>([]);
  const [itemTypeOptions, setItemTypeOptions] = useState<DropdownOption[]>([]);
  const [itemCategoryOptions, setItemCategoryOptions] = useState<{ [key: number]: DropdownOption[] }>({});
  const [itemNameOptions, setItemNameOptions] = useState<{ [key: number]: DropdownOption[] }>({});

  useEffect(() => {
    gateNumberService.getCompanies().then(setCompanies);
    gatePassInwardService.getInventoryTypes().then(setItemTypeOptions);
    gatePassTypeService.getGatePassTypes().then(data => setGatePassTypes(data.map(d => ({ id: d.id, name: d.name }))));
    gateNumberService.getSites().then(setSites);
  }, []);

  useEffect(() => {
    if (gatePassDetails.siteId) {
      gateNumberService.getProjectsBySite(gatePassDetails.siteId).then(setBuildings);
    } else {
      setBuildings([]);
    }
  }, [gatePassDetails.siteId]);

  const handleVisitorChange = (field: keyof typeof visitorDetails, value: any) => {
    setVisitorDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleGatePassChange = (field: keyof typeof gatePassDetails, value: any) => {
    if (field === 'siteId') {
      setGatePassDetails(prev => ({ ...prev, siteId: value, buildingId: null }));
    } else {
      setGatePassDetails(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddRow = () => {
    const newId = materialRows.length > 0 ? Math.max(...materialRows.map(r => r.id)) + 1 : 1;
    setMaterialRows([...materialRows, { id: newId, itemTypeId: null, itemCategoryId: null, itemNameId: null, quantity: '', unit: '', description: '', maxQuantity: null }]);
  };

  const handleDeleteRow = (id: number) => {
    setMaterialRows(materialRows.filter(row => row.id !== id));
  };

  const handleRowChange = async (id: number, field: keyof Omit<MaterialRow, 'id'>, value: any) => {
    const newRows = materialRows.map(row => row.id === id ? { ...row, [field]: value } : row);

    if (field === 'itemTypeId') {
      const updatedRows = newRows.map(row => row.id === id ? { ...row, itemCategoryId: null, itemNameId: null, maxQuantity: null, quantity: '' } : row);
      setMaterialRows(updatedRows);
      setItemNameOptions(prev => ({ ...prev, [id]: [] }));

      if (value) {
        const subTypes = await gatePassInwardService.getInventorySubTypes(value);
        setItemCategoryOptions(prev => ({ ...prev, [id]: subTypes }));
      } else {
        setItemCategoryOptions(prev => ({ ...prev, [id]: [] }));
      }
    } else if (field === 'itemCategoryId') {
      const updatedRows = newRows.map(row => row.id === id ? { ...row, itemNameId: null, maxQuantity: null, quantity: '' } : row);
      setMaterialRows(updatedRows);

      const currentItemTypeId = newRows.find(row => row.id === id)?.itemTypeId;
      if (value && currentItemTypeId) {
        const inventories = await gatePassInwardService.getInventories(currentItemTypeId, value);
        setItemNameOptions(prev => ({ ...prev, [id]: inventories }));
      } else {
        setItemNameOptions(prev => ({ ...prev, [id]: [] }));
      }
    } else if (field === 'itemNameId') {
      const selectedItem = (itemNameOptions[id] || []).find(item => item.id === value);
      const updatedRows = newRows.map(row => row.id === id ? { ...row, maxQuantity: selectedItem?.quantity ?? null, quantity: '' } : row);
      setMaterialRows(updatedRows);
    } else if (field === 'quantity') {
      const currentRow = newRows.find(row => row.id === id);
      if (currentRow && currentRow.maxQuantity !== null && Number(value) > currentRow.maxQuantity) {
        toast({
          title: "Validation Error",
          description: `Quantity cannot be greater than ${currentRow.maxQuantity}.`,
          variant: "destructive"
        });
        return;
      }
      setMaterialRows(newRows);
    } else {
      setMaterialRows(newRows);
    }
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

    // Basic validation (can be expanded as needed)
    if (!gatePassDetails.gatePassTypeId || !gatePassDetails.gatePassDate || !gatePassDetails.siteId) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();

    // Append gate pass details
    formData.append('gate_pass[gate_pass_category]', 'outward');
    formData.append('gate_pass[gate_pass_type_id]', gatePassDetails.gatePassTypeId?.toString() ?? '');
    formData.append('gate_pass[gate_pass_date]', gatePassDetails.gatePassDate);
    formData.append('gate_pass[status]', 'pending');
    formData.append('gate_pass[site_id]', gatePassDetails.siteId?.toString() ?? '');
    formData.append('gate_pass[company_id]', visitorDetails.companyId ? visitorDetails.companyId.toString() : '');
    formData.append('gate_pass[vehicle_no]', visitorDetails.vehicleNo ? visitorDetails.vehicleNo : '');
    formData.append('gate_pass[remarks]', gatePassDetails.remarks ? gatePassDetails.remarks : '');
    formData.append('gate_pass[building_id]', gatePassDetails.buildingId?.toString() ?? '');

    // Append material details
    materialRows.forEach((row, index) => {
      if (row.itemNameId) {
        formData.append(`gate_pass[gate_pass_materials_attributes][${index}][pms_inventory_id]`, row.itemNameId.toString());
        if (row.itemTypeId) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][pms_inventory_type_id]`, row.itemTypeId.toString());
        if (row.itemCategoryId) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][pms_inventory_sub_type_id]`, row.itemCategoryId.toString());
        if (row.quantity) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][gate_pass_qty]`, row.quantity);
        // Add other_material_name, other_material_description, remarks as per payload
        formData.append(`gate_pass[gate_pass_materials_attributes][${index}][other_material_name]`, row.unit ?? '');
        formData.append(`gate_pass[gate_pass_materials_attributes][${index}][other_material_description]`, row.description ?? '');
        formData.append(`gate_pass[gate_pass_materials_attributes][${index}][remarks]`, gatePassDetails.remarks ?? '');
      }
    });

    // Append attachments
    attachments.forEach(attachment => {
      formData.append('gate_pass[attachments][]', attachment.file);
    });

    try {
      // Use fetch directly for outward API
      // const response = await fetch('/gate_passes.json', {
      //   method: 'POST',
      //   body: formData,
      // });
      // if (!response.ok) throw new Error('Failed to create entry');

      await gatePassInwardService.createGatePassInward(formData);

      toast({
        title: "Success",
        description: "Gate pass outward entry created successfully!"
      });
      navigate('/security/gate-pass/outwards');
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
          onClick={() => navigate('/security/gate-pass/outwards')}
          className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Outward List
        </div>
        <div className="flex justify-between items-center my-4">
          <h1 className="text-2xl font-bold text-gray-800">Create Gate Pass</h1>
        </div>

        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="returnable-status"
            name="returnable-status"
            value={returnableStatus}
            onChange={(e) => setReturnableStatus(e.target.value as 'returnable' | 'non-returnable')}
          >
            <span className="text-sm font-medium text-gray-700 mr-4 self-center">Returnable Status:</span>
            <FormControlLabel value="returnable" control={<Radio sx={{
              color: '#C72030',
              '&.Mui-checked': {
                color: '#C72030',
              },
            }} />} label="Returnable" />
            <FormControlLabel value="non-returnable" control={<Radio sx={{
              color: '#C72030',
              '&.Mui-checked': {
                color: '#C72030',
              },
            }} />} label="Non-Returnable" />
          </RadioGroup>
        </FormControl>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 rounded-lg p-10 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1 */}
          <Autocomplete
            options={gatePassTypes}
            getOptionLabel={(option) => option.name}
            value={gatePassTypes.find(c => c.id === gatePassDetails.gatePassTypeId) || null}
            onChange={(_, newValue) => handleGatePassChange('gatePassTypeId', newValue ? newValue.id : null)}
            renderInput={(params) => <TextField {...params} label="Gate Pass Type" placeholder="Select Type" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} sx={{ '& .MuiInputBase-root': fieldStyles }} />}
          />
          <TextField label="Gate Pass Date" type="date" fullWidth variant="outlined" required value={gatePassDetails.gatePassDate} onChange={(e) => handleGatePassChange('gatePassDate', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
          <Autocomplete
            options={sites}
            getOptionLabel={(option) => option.name}
            value={sites.find(c => c.id === gatePassDetails.siteId) || null}
            onChange={(_, newValue) => handleGatePassChange('siteId', newValue ? newValue.id : null)}
            renderInput={(params) => <TextField {...params} label="Site" placeholder="Select Site" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} sx={{ '& .MuiInputBase-root': fieldStyles }} />}
          />
          <Autocomplete
            options={buildings}
            getOptionLabel={(option) => option.name}
            value={buildings.find(c => c.id === gatePassDetails.buildingId) || null}
            onChange={(_, newValue) => handleGatePassChange('buildingId', newValue ? newValue.id : null)}
            disabled={!gatePassDetails.siteId}
            renderInput={(params) => <TextField {...params} label="Building" placeholder="Select Building" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} sx={{ '& .MuiInputBase-root': fieldStyles }} />}
          />
          {returnableStatus === 'returnable' && (
            <TextField
              label="Expected Return Date *"
              type="date"
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          )}
          {/* Row 2 */}
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <TextField label="Gate No." placeholder="Enter Gate No" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
          </FormControl>
          <TextField label="Contact Person" placeholder="Enter Contact Person" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
          <TextField label="Contact No" placeholder="Enter Contact No" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
          <TextField
            label="Reporting Time *"
            type="time"
            fullWidth
            variant="outlined"
            required
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
          />
          <Autocomplete
            options={companies}
            getOptionLabel={(option) => option.name}
            value={companies.find(c => c.id === visitorDetails.companyId) || null}
            onChange={(_, newValue) => handleVisitorChange('companyId', newValue ? newValue.id : null)}
            renderInput={(params) => <TextField {...params} label="Company Name" placeholder="Select Company" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} sx={{ '& .MuiInputBase-root': fieldStyles }} />}
          />
          {/* Row 3 */}
          <FormControl fullWidth variant="outlined" required sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Select Mode Of Transport *</InputLabel>
            <MuiSelect label="Select Mode Of Transport *" notched displayEmpty>
              <MenuItem value="">Type here</MenuItem>
              <MenuItem value="by-hand">By Hand</MenuItem>
              <MenuItem value="by-vehicle">By Vehicle</MenuItem>
              <MenuItem value="by-courier">By Courier</MenuItem>
            </MuiSelect>
          </FormControl>
          <TextField label="Driver Name" placeholder="Enter Driver Name" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
          <TextField label="Driver Contact No" placeholder="Enter Driver Contact No" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
          <TextField value={visitorDetails.vehicleNo} onChange={(e) => handleVisitorChange('vehicleNo', e.target.value)} label="Vehicle No." placeholder="Enter Vehicle No" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
          <TextField label="Remarks" placeholder="Enter remarks" fullWidth variant="outlined" value={gatePassDetails.remarks} onChange={(e) => handleGatePassChange('remarks', e.target.value)} InputLabelProps={{ shrink: true }} multiline rows={2} />

        </div>


        {/* Material / Asset Details Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Item Details</h2>
            <Button type="button" onClick={handleAddRow} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white text-sm px-4 py-2">Add Item</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-white uppercase bg-[#C72030]">
                <tr>
                  <th scope="col" className="px-6 py-3">Sr.No.</th>
                  <th scope="col" className="px-6 py-3">Item Type</th>
                  <th scope="col" className="px-6 py-3">Item Category</th>
                  <th scope="col" className="px-6 py-3">Item Name</th>
                  <th scope="col" className="px-6 py-3">Quantity</th>
                  <th scope="col" className="px-6 py-3">Unit</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {materialRows.map((row, index) => (
                  <tr key={row.id} className="bg-white border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2" style={{ minWidth: 150 }}>
                      <Autocomplete
                        options={itemTypeOptions}
                        getOptionLabel={(option) => option.name}
                        value={itemTypeOptions.find(o => o.id === row.itemTypeId) || null}
                        onChange={(_, newValue) => handleRowChange(row.id, 'itemTypeId', newValue ? newValue.id : null)}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="Select Type" />}
                      />
                    </td>
                    <td className="px-4 py-2" style={{ minWidth: 150 }}>
                      <Autocomplete
                        options={itemCategoryOptions[row.id] || []}
                        getOptionLabel={(option) => option.name}
                        value={(itemCategoryOptions[row.id] || []).find(o => o.id === row.itemCategoryId) || null}
                        onChange={(_, newValue) => handleRowChange(row.id, 'itemCategoryId', newValue ? newValue.id : null)}
                        disabled={!row.itemTypeId}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="Select Category" />}
                      />
                    </td>
                    <td className="px-4 py-2" style={{ minWidth: 150 }}>
                      <Autocomplete
                        options={itemNameOptions[row.id] || []}
                        getOptionLabel={(option) => option.name}
                        value={(itemNameOptions[row.id] || []).find(o => o.id === row.itemNameId) || null}
                        onChange={(_, newValue) => handleRowChange(row.id, 'itemNameId', newValue ? newValue.id : null)}
                        disabled={!row.itemCategoryId}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="Select Item" />}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <TextField
                        variant="outlined"
                        size="small"
                        type="number"
                        value={row.maxQuantity !== null ? row.maxQuantity : ''}
                        onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)}
                        inputProps={{ max: row.maxQuantity ?? undefined, min: 0 }}
                      // helperText={row.maxQuantity !== null ? `Max: ${row.maxQuantity}` : ''}
                      />
                    </td>
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
          <Box sx={{ gap: 2, mb: 2 }}>
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
                      '&:hover': {
                        borderColor: '#999'
                      }
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        width: 20,
                        height: 20,
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      <Close sx={{ fontSize: 12 }} />
                    </IconButton>

                    {isImage ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        style={{
                          maxWidth: '100px',
                          maxHeight: '100px',
                          objectFit: 'contain',
                          marginBottom: 8,
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <AttachFile sx={{ fontSize: 24, color: '#666', mb: 1 }} />
                    )}
                    {!isImage && (
                      <Typography
                        variant="caption"
                        sx={{
                          textAlign: 'center',
                          px: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%',
                        }}
                      >
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
                borderColor: '#C72030',
                color: '#C72030',
                textTransform: 'none',
                fontFamily: 'Work Sans, sans-serif',
                fontWeight: 500,
                borderRadius: '0',
                padding: '8px 16px',
                '&:hover': {
                  borderColor: '#B8252F',
                  backgroundColor: 'rgba(199, 32, 48, 0.04)',
                },
              }}
            >
              Add Attachment
            </MuiButton>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </Box>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="submit" className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2">Submit</Button>
          <Button type="button" variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-8 py-2" onClick={() => navigate('/security/gate-pass/outwards')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};