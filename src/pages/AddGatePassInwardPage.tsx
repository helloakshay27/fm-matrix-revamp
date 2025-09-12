import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Box, Typography, IconButton, Button as MuiButton, Autocomplete } from '@mui/material';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { AttachFile, Close } from '@mui/icons-material';
import { useToast } from '@/hooks/use-toast';
import { gateNumberService } from '@/services/gateNumberService';
import { gatePassInwardService } from '@/services/gatePassInwardService';
import { gatePassTypeService } from '@/services/gatePassTypeService';
import { API_CONFIG } from '@/config/apiConfig';
import { useSelector } from 'react-redux';

interface AttachmentFile {
  id: string;
  file: File;
  name: string;
  url: string;
}

interface DropdownOption {
  id: number;
  name: string;
  quantity?: number;
  unit?: string;
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

export const AddGatePassInwardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [materialRows, setMaterialRows] = useState<MaterialRow[]>([
    { id: 1, itemTypeId: null, itemCategoryId: null, itemNameId: null, quantity: '', unit: '', description: '', maxQuantity: null }
  ]);

  const [visitorDetails, setVisitorDetails] = useState({
    visitorName: '',
    mobileNo: '',
    vehicleNo: '',
    reportingTime: '',
    modeOfTransport: '',
    driverName: '',
    driverContactNo: '',
    contactPerson: '',
    contactPersonNo: '',
    gateNoId: null as number | null,
    expectedReturnDate: '', // Add expected return date
    returnable: false, // Add returnable status
  });

  const [gatePassDetails, setGatePassDetails] = useState({
    gatePassTypeId: null as number | null,
    gatePassDate: '',
    buildingId: null as number | null,
    remarks: '',
    gateNumberId: null as number | null,
    vendorId: null as number | null, // Add vendorId
    quantity: '', // Add quantity
    unit: '', // Add unit
  });

  const [companies, setCompanies] = useState<DropdownOption[]>([]);
  const [gatePassTypes, setGatePassTypes] = useState<DropdownOption[]>([]);
  const [sites, setSites] = useState<DropdownOption[]>([]);
  const [buildings, setBuildings] = useState<DropdownOption[]>([]);
  const [itemTypeOptions, setItemTypeOptions] = useState<DropdownOption[]>([]);
  const [itemCategoryOptions, setItemCategoryOptions] = useState<{ [key: number]: DropdownOption[] }>({});
  const [itemNameOptions, setItemNameOptions] = useState<{ [key: number]: DropdownOption[] }>({});
  const [gateNumbers, setGateNumbers] = useState<DropdownOption[]>([]);
  const [vendors, setVendors] = useState<DropdownOption[]>([]);

  // Get selected company and site from Redux (Header)
  const selectedCompany = useSelector((state: any) => state.project.selectedCompany);
  const selectedSite = useSelector((state: any) => state.site.selectedSite);

  useEffect(() => {
    gateNumberService.getCompanies().then(setCompanies);
    gatePassInwardService.getInventoryTypes().then(setItemTypeOptions);
    gatePassTypeService.getGatePassTypes().then(data => setGatePassTypes(data.map(d => ({ id: d.id, name: d.name }))));
    gateNumberService.getSites().then(setSites);
    
    // Fetch vendors for dropdown
    fetch(`${API_CONFIG.BASE_URL}/pms/suppliers/get_suppliers.json`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setVendors(data))
      .catch(() => setVendors([]));
  }, []);

  console.log("Fetching buildings for siteId:", selectedSite, buildings);
  useEffect(() => {
    if (selectedSite?.id) {
      
      gateNumberService.getProjectsBySite(selectedSite?.id).then(setBuildings);
    } else {
      setBuildings([]);
    }
  }, [selectedSite?.id]);

  useEffect(() => {
    if (gatePassDetails.buildingId) {
      fetch(`${API_CONFIG.BASE_URL}/gate_numbers.json?q[building_id_eq]=${gatePassDetails.buildingId}`, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => setGateNumbers(data.gate_numbers || data))
        .catch(() => setGateNumbers([]));
    } else {
      setGateNumbers([]);
    }
  }, [gatePassDetails.buildingId]);

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
      const updatedRows = newRows.map(row => row.id === id ? { ...row, itemCategoryId: null, itemNameId: null, maxQuantity: null, quantity: '', unit: '' } : row);
      setMaterialRows(updatedRows);
      setItemNameOptions(prev => ({ ...prev, [id]: [] }));

      if (value) {
        const subTypes = await gatePassInwardService.getInventorySubTypes(value);
        setItemCategoryOptions(prev => ({ ...prev, [id]: subTypes }));
      } else {
        setItemCategoryOptions(prev => ({ ...prev, [id]: [] }));
      }
    } else if (field === 'itemCategoryId') {
      const updatedRows = newRows.map(row => row.id === id ? { ...row, itemNameId: null, maxQuantity: null, quantity: '', unit: '' } : row);
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
        console.log("selected",selectedItem);
        
        const updatedRows = newRows.map(row => row.id === id ? {
          ...row,
          maxQuantity: selectedItem?.quantity ?? null,
          quantity: '',
          unit: selectedItem?.unit ?? '' // Set unit from selected item
        } : row);
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData();

    // Append gate pass details
    formData.append('gate_pass[gate_pass_category]', 'inward');
    if (gatePassDetails.gatePassTypeId) formData.append('gate_pass[gate_pass_type_id]', gatePassDetails.gatePassTypeId.toString());
    if (gatePassDetails.gatePassDate) formData.append('gate_pass[gate_pass_date]', gatePassDetails.gatePassDate);
    formData.append('gate_pass[status]', 'pending');
    if (gatePassDetails.buildingId) formData.append('gate_pass[building_id]', gatePassDetails.buildingId.toString());
    if (selectedSite?.id) formData.append('gate_pass[site_id]', selectedSite.id.toString());
    if (selectedCompany?.id) formData.append('gate_pass[company_id]', selectedCompany.id.toString());
    if (visitorDetails.vehicleNo) formData.append('gate_pass[vehicle_no]', visitorDetails.vehicleNo);
    if (gatePassDetails.remarks) formData.append('gate_pass[remarks]', gatePassDetails.remarks);
    if (visitorDetails.gateNoId) formData.append('gate_pass[gate_number_id]', visitorDetails.gateNoId.toString());
    if (gatePassDetails.gateNumberId) formData.append('gate_pass[gate_number_id]', gatePassDetails.gateNumberId.toString());

    // Vendor
    if (gatePassDetails.vendorId) formData.append('gate_pass[pms_supplier_id]', gatePassDetails.vendorId.toString());
   // Due at (reporting time)
    if (visitorDetails.reportingTime) formData.append('gate_pass[due_at]', visitorDetails.reportingTime);
    if(visitorDetails.contactPerson) formData.append('gate_pass[contact_person]', visitorDetails.contactPerson);
    if(visitorDetails.contactPersonNo) formData.append('gate_pass[contact_person_no]', visitorDetails.contactPersonNo);

    // Append material details
    materialRows.forEach((row, index) => {
      console.log("row", row);
      
      if (row.itemNameId) {
        formData.append(`gate_pass[gate_pass_materials_attributes][${index}][pms_inventory_id]`, row.itemNameId.toString());
        if (row.itemTypeId) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][pms_inventory_type_id]`, row.itemTypeId.toString());
        if (row.itemCategoryId) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][item_category]`, row.itemCategoryId.toString());
        if (row.quantity || row.maxQuantity) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][gate_pass_qty]`, String(Number(row.quantity || row.maxQuantity)));
        if (row.unit) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][unit]`, row.unit);
        if (row.description) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][other_material_description]`, row.description);
      }
    });

    // Append attachments
    attachments.forEach(attachment => {
      formData.append('gate_pass[attachments][]', attachment.file);
    });
    console.log("formData", JSON.stringify(Object.fromEntries(formData)));

    try {
      await gatePassInwardService.createGatePassInward(formData);
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
    } finally {
      setIsSubmitting(false);
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

      <form onSubmit={handleSubmit} className="space-y-8 border border-gray-200 rounded-lg p-10 bg-white" onMouseDown={e => e.stopPropagation()}>
        
        {/* Visitor Detail Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Visitor Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TextField label={<span>Visitor Name <span style={{ color: 'red' }}>*</span></span>} placeholder="Enter Name" fullWidth variant="outlined" value={visitorDetails.contactPerson} onChange={(e) => {
    const value = e.target.value;
    if (/^[a-zA-Z ]*$/.test(value)) handleVisitorChange('contactPerson', value);
  }} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} inputProps={{ maxLength: 50, pattern: '^[a-zA-Z ]+$' }} />
            <TextField label={<span>Mobile No. <span style={{ color: 'red' }}>*</span></span>} placeholder="+91" fullWidth variant="outlined" value={visitorDetails.contactPersonNo} onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) handleVisitorChange('contactPersonNo', value);
            }} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} inputProps={{ maxLength: 10, pattern: '\\d{10}' }} />
            <TextField
              label={<span>Company <span style={{ color: 'red' }}>*</span></span>}
              value={selectedCompany ? selectedCompany.name : ''}
              fullWidth
              variant="outlined"
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputBase-root': fieldStyles }}
            />
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Vendor <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect
                label="Vendor"
                notched
                displayEmpty
                value={gatePassDetails.vendorId || ''}
                onChange={e => handleGatePassChange('vendorId', e.target.value)}
              >
                <MenuItem value="">Select Vendor</MenuItem>
                {vendors.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Mode Of Transport <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect label="Mode Of Transport" notched displayEmpty value={visitorDetails.modeOfTransport} onChange={(e) => handleVisitorChange('modeOfTransport', e.target.value)}>
                <MenuItem value="">Select Transport</MenuItem>
                <MenuItem value="car">Car</MenuItem>
                <MenuItem value="bike">Bike</MenuItem>
                <MenuItem value="truck">Truck</MenuItem>
                <MenuItem value="walk">Walking</MenuItem>
                <MenuItem value="self">Self</MenuItem>
              </MuiSelect>
            </FormControl>
            {(visitorDetails.modeOfTransport == "car" || visitorDetails.modeOfTransport == "bike" || visitorDetails.modeOfTransport == "truck") && (
              <TextField label="Vehicle No." placeholder="MH04BA-1009" fullWidth variant="outlined" value={visitorDetails.vehicleNo} onChange={(e) => handleVisitorChange('vehicleNo', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            )}
            <TextField label={<span>Reporting Time <span style={{ color: 'red' }}>*</span></span>} type="time" fullWidth variant="outlined" value={visitorDetails.reportingTime} onChange={(e) => handleVisitorChange('reportingTime', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            {/* <TextField label="Driver Name" placeholder="Enter Driver Name" fullWidth variant="outlined" value={visitorDetails.driverName} onChange={(e) => handleVisitorChange('driverName', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            <TextField label="Driver Contact No." placeholder="Enter Driver Contact No." fullWidth variant="outlined" value={visitorDetails.driverContactNo} onChange={(e) => handleVisitorChange('driverContactNo', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            <TextField label="Contact Person" placeholder="Enter Contact Person" fullWidth variant="outlined" value={visitorDetails.contactPerson} onChange={(e) => handleVisitorChange('contactPerson', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            <TextField label="Contact Person No." placeholder="Enter Contact Person No." fullWidth variant="outlined" value={visitorDetails.contactPersonNo} onChange={(e) => handleVisitorChange('contactPersonNo', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} /> */}
          </div>
        </div>

        {/* Gate Pass Details Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Gate Pass Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Move Site and Building fields to the top */}
            <TextField
              label={<span>Site <span style={{ color: 'red' }}>*</span></span>}
              value={selectedSite ? selectedSite.name : ''}
              fullWidth
              variant="outlined"
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputBase-root': fieldStyles }}
            />
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Building <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect
                label="Building"
                notched
                displayEmpty
                value={gatePassDetails.buildingId || ''}
                onChange={e => handleGatePassChange('buildingId', e.target.value)}
              >
                <MenuItem value="">Select Building</MenuItem>
                {buildings.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Gate Number <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect
                label="Gate Number"
                notched
                displayEmpty
                value={gatePassDetails.gateNumberId || ''}
                onChange={e => handleGatePassChange('gateNumberId', e.target.value)}
              >
                <MenuItem value="">Select Gate Number</MenuItem>
                {gateNumbers.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.gate_number || option.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Gate Pass Type <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect
                label="Gate Pass Type"
                notched
                displayEmpty
                value={gatePassDetails.gatePassTypeId || ''}
                onChange={e => handleGatePassChange('gatePassTypeId', e.target.value)}
              >
                <MenuItem value="">Select Type</MenuItem>
                {gatePassTypes.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            
            <TextField label={<span>Gate Pass Date <span style={{ color: 'red' }}>*</span></span>} type="date" fullWidth variant="outlined" value={gatePassDetails.gatePassDate} onChange={(e) => handleGatePassChange('gatePassDate', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            <div className="lg:col-span-3">
              <TextField
                label="Remarks"
                placeholder="Enter remarks"
                fullWidth
                variant="outlined"
                value={gatePassDetails.remarks}
                onChange={(e) => handleGatePassChange('remarks', e.target.value)}
                InputLabelProps={{ shrink: true }}
                // Removed multiline and rows for single-line input
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              />
            </div>
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
                  <th scope="col" className="px-4 py-3" style={{ width: '30px' }}>Sr.No.</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '180px' }}>Item Type</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '180px' }}>Item Category</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '180px' }}>Item Name</th>
                  <th scope="col" className="px-4 py-3" /* Quantity: balance width */>Quantity</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '80px' }}>Unit</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '180px' }}>Description</th>
                  <th scope="col" className="px-4 py-3" style={{ width: '80px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {materialRows.map((row, index) => (
                  <tr key={row.id} className="bg-white border-b">
                    <td className="px-4 py-2 pt-4" style={{ width: '30px' }}>{index + 1}</td>
                    <td className="px-4 py-2 pt-4" style={{ minWidth: 180 }}>
                      <FormControl fullWidth variant="outlined" size="small" >
                        <InputLabel shrink>Item Type <span style={{ color: 'red' }}>*</span></InputLabel>
                        <MuiSelect
                          label="Item Type"
                          notched
                          displayEmpty
                          value={row.itemTypeId || ''}
                          onChange={e => handleRowChange(row.id, 'itemTypeId', e.target.value)}
                        >
                          <MenuItem value="">Select Type</MenuItem>
                          {itemTypeOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </td>
                    <td className="px-4 py-2 pt-4" style={{ minWidth: 180 }}>
                      <FormControl fullWidth variant="outlined" size="small" >
                        <InputLabel shrink>Item Category <span style={{ color: 'red' }}>*</span></InputLabel>
                        <MuiSelect
                          label="Item Category"
                          notched
                          displayEmpty
                          value={row.itemCategoryId || ''}
                          onChange={e => handleRowChange(row.id, 'itemCategoryId', e.target.value)}
                          disabled={!row.itemTypeId}
                        >
                          <MenuItem value="">Select Category</MenuItem>
                          {(itemCategoryOptions[row.id] || []).map((option) => (
                            <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </td>
                    <td className="px-4 py-2 pt-4" style={{ minWidth: 180 }}>
                      <FormControl fullWidth variant="outlined" size="small" >
                        <InputLabel shrink>Item Name <span style={{ color: 'red' }}>*</span></InputLabel>
                        <MuiSelect
                          label="Item Name"
                          notched
                          displayEmpty
                          value={row.itemNameId || ''}
                          onChange={e => handleRowChange(row.id, 'itemNameId', e.target.value)}
                          disabled={!row.itemCategoryId}
                        >
                          <MenuItem value="">Select Item</MenuItem>
                          {(itemNameOptions[row.id] || []).map((option) => (
                            <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </td>
                    <td className="px-4 py-2 pt-4">
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
                    <td className="px-4 py-2 pt-4">
                      <TextField
                        variant="outlined"
                        size="small"
                        value={row.unit}
                        onChange={e => {
                          const value = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(value)) handleRowChange(row.id, 'unit', value);
                        }}
                        inputProps={{ maxLength: 20, pattern: '[a-zA-Z\s]*' }}
                      />
                    </td>
                    <td className="px-4 py-2 pt-4"><TextField variant="outlined" size="small" value={row.description} onChange={(e) => handleRowChange(row.id, 'description', e.target.value)} /></td>
                    <td className="px-4 py-2 pt-4" style={{ width: '80px' }}>
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
                    {attachments.length > 0 && (
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h2>
                    )}
                    <div className="flex gap-4" >
        
                    {attachments.map((attachment) => {
                      const isImage = attachment.file.type.startsWith('image/');
                      return (
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
                      );
                    })}
                    </div>
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
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button type="submit" className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
          <Button type="button" variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-8 py-2" onClick={() => navigate('/security/gate-pass/inwards')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};