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
import { API_CONFIG } from '@/config/apiConfig';
import { useSelector } from 'react-redux';
import { toast } from "sonner";

// Define DropdownOption type
interface DropdownOption {
  id: number;
  name: string;
  quantity?: number;
  unit?: string;
}

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
  unit: string | null;
  description: string;
  maxQuantity: number | null;
  otherMaterialName?: string; // NEW: for "Other"
}

export const GatePassOutwardsAddPage = () => {
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [returnableStatus, setReturnableStatus] = useState<'returnable' | 'non-returnable'>('returnable');

  const [materialRows, setMaterialRows] = useState<MaterialRow[]>([
    { id: 1, itemTypeId: null, itemCategoryId: null, itemNameId: null, quantity: '', unit: '', description: '', maxQuantity: null, otherMaterialName: '' }
  ]);

  const [visitorDetails, setVisitorDetails] = useState({
    visitorName: '',
    mobileNo: '',
    companyId: null as number | null,
    vehicleNo: '',
    reportingTime: '',
    modeOfTransport: '',
    driverName: '',
    driverContactNo: '',
    contactPerson: '',
    contactPersonNo: '',
    gateNoId: null as number | null,
    expectedReturnDate: '',
  });

  const [gatePassDetails, setGatePassDetails] = useState({
    gatePassTypeId: null as number | null,
    gatePassDate: '',
    siteId: null as number | null,
    buildingId: null as number | null,
    remarks: '',
    vendorId: null as number | null,
    quantity: '', // Add quantity field
    unit: '', // Add unit field
  });

  const [companies, setCompanies] = useState<DropdownOption[]>([]);
  const [gatePassTypes, setGatePassTypes] = useState<DropdownOption[]>([]);
  const [sites, setSites] = useState<DropdownOption[]>([]);
  const [buildings, setBuildings] = useState<DropdownOption[]>([]);
  const [itemTypeOptions, setItemTypeOptions] = useState<DropdownOption[]>([]);
  const [itemCategoryOptions, setItemCategoryOptions] = useState<{ [key: number]: DropdownOption[] }>({});
  const [itemNameOptions, setItemNameOptions] = useState<{ [key: number]: DropdownOption[] }>({});
  const [gateNumbers, setGateNumbers] = useState<DropdownOption[]>([]);

  const selectedSite = useSelector((state: any) => state.site.selectedSite);
  const selectedBuilding = useSelector((state: any) => state.project.selectedBuilding);
  const selectedCompany = useSelector((state: any) => state.project.selectedCompany);

  useEffect(() => {
    // Fetch suppliers for Company Name dropdown
    fetch(`${API_CONFIG.BASE_URL}/pms/suppliers/get_suppliers.json`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setCompanies(Array.isArray(data) ? data : []))
      .catch(() => setCompanies([]));

    gatePassInwardService.getInventoryTypes().then(setItemTypeOptions);
    gatePassTypeService.getGatePassTypes().then(data => setGatePassTypes(data.map(d => ({ id: d.id, name: d.name }))));
    gateNumberService.getSites().then(setSites);
    // Fetch gate numbers for dropdown using API_CONFIG
    fetch(`${API_CONFIG.BASE_URL}/gate_numbers.json`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setGateNumbers(data || data))
      .catch(() => setGateNumbers([]));
  }, []);

  useEffect(() => {
    if (selectedSite?.id) {
      gateNumberService.getProjectsBySite(selectedSite?.id).then(setBuildings);
    } else {
      setBuildings([]);
    }
  }, [selectedSite?.id]);

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
    setMaterialRows([...materialRows, { id: newId, itemTypeId: null, itemCategoryId: null, itemNameId: null, quantity: '', unit: '', description: '', maxQuantity: null, otherMaterialName: '' }]);
  };

  const handleDeleteRow = (id: number) => {
    setMaterialRows(materialRows.filter(row => row.id !== id));
  };

  // Always add "Other" to itemCategoryOptions
  const getItemCategoryOptionsWithOther = (rowId: number) => {
    const options = itemCategoryOptions[rowId] || [];
    const hasOther = options.some(opt => opt.id === -1);
    return hasOther
      ? options
      : [...options, { id: -1, name: 'Other' }];
  };

  const handleRowChange = async (id: number, field: keyof Omit<MaterialRow, 'id'>, value: any) => {
    let newRows = materialRows.map(row => row.id === id ? { ...row, [field]: value } : row);

    if (field === 'itemTypeId') {
      const updatedRows = newRows.map(row => row.id === id ? { ...row, itemCategoryId: null, itemNameId: null, maxQuantity: null, quantity: '', unit: '' } : row);
      setMaterialRows(updatedRows);
      setItemNameOptions(prev => ({ ...prev, [id]: [] }));

      if (value) {
        const subTypes = await gatePassInwardService.getInventorySubTypes();
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
      const updatedRows = newRows.map(row => row.id === id ? {
        ...row,
        maxQuantity: selectedItem?.quantity ?? null,
        quantity: '',
        unit: selectedItem?.unit ?? '' // Ensure unit is set from selected item
      } : row);
      console.log("Selected Item:", selectedItem);

      setMaterialRows(updatedRows);
    } else if (field === 'otherMaterialName') {
      setMaterialRows(newRows);
    } else if (field === 'quantity') {
      // const currentRow = newRows.find(row => row.id === id);
      // if (currentRow && currentRow.maxQuantity !== null && Number(value) > currentRow.maxQuantity) {
      //   toast.error(`Quantity cannot be greater than ${currentRow.maxQuantity}.`);
      //   return;
      // }
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

  // Field-level error state
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [vendorCompanyName, setVendorCompanyName] = useState<string>(''); // NEW: vendor company name field
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW: submission state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit
    setIsSubmitting(true);
    // Field-level validation
    if (!visitorDetails.contactPerson) {
          toast.error("Visitor Name is required");
          return;
        }
        if (!visitorDetails.contactPersonNo) {
          toast.error("Mobile No. is required");
          return;
        }
        if (visitorDetails.contactPersonNo.length !== 10) {
          toast.error("Mobile No. must be 10 digits");
          return;
        }
        
        if (!visitorDetails.modeOfTransport) {
          toast.error("Mode Of Transport is required");
          return;
        }
        if (!visitorDetails.vehicleNo && (visitorDetails.modeOfTransport == "car" || visitorDetails.modeOfTransport == "bike" || visitorDetails.modeOfTransport == "truck")) {
          toast.error("Vehicle No. is required");
          return;
        }
        if (!visitorDetails.reportingTime) {
          toast.error("Reporting Time is required");
          return;
        }
        if (!selectedSite) {
          toast.error("Site is required");
          return;
        }
        if (!gatePassDetails.buildingId) {
          toast.error("Building is required");
          return;
        }
        if (!selectedCompany) {
          toast.error("Company is required");
          return;
        }
        if (!gatePassDetails.vendorId) {
          toast.error("Vendor is required");
          return;
        }
        console.log("Gate Pass Details:", gatePassDetails);

        if (!visitorDetails.gateNoId) {
          toast.error("Gate Number is required");
          return;
        }
        if (!gatePassDetails.gatePassTypeId) {
          toast.error("Gate Pass Type is required");
          return;
        }
        if (!gatePassDetails.gatePassDate) {
          toast.error("Gate Pass Date is required");
          return;
        }
    
        // Validate all item details and show toast for each missing field
        for (let idx = 0; idx < materialRows.length; idx++) {
          const row = materialRows[idx];
          if (!row.itemTypeId) {
            toast.error(`Item Type is required for row ${idx + 1}`);
            return;
          }
          if (!row.itemCategoryId) {
            toast.error(`Item Category is required for row ${idx + 1}`);
            return;
          }
          // Require either itemNameId or otherMaterialName (for "Other")
          if (
            (row.itemCategoryId === -1 && !row.otherMaterialName) ||
            (row.itemCategoryId !== -1 && !row.itemNameId)
          ) {
            toast.error(`Item Name is required for row ${idx + 1}`);
            return;
          }
        }

    // setFieldErrors(errors);
    // if (Object.keys(errors).length > 0) return;

    const formData = new FormData();

    // Append gate pass details
    formData.append('gate_pass[gate_pass_category]', 'outward');
    formData.append('gate_pass[gate_pass_type_id]', gatePassDetails.gatePassTypeId?.toString() ?? '');
    formData.append('gate_pass[gate_pass_date]', gatePassDetails.gatePassDate);
    formData.append('gate_pass[status]', 'pending');
    formData.append('gate_pass[site_id]', selectedSite?.id?.toString() ?? '');
    formData.append('gate_pass[company_id]', selectedCompany?.id?.toString() ?? '');
    formData.append('gate_pass[vehicle_no]', visitorDetails.vehicleNo ? visitorDetails.vehicleNo : '');
    if (visitorDetails.modeOfTransport) formData.append('gate_pass[mode_of_transport]', visitorDetails.modeOfTransport);
    formData.append('gate_pass[due_at]', visitorDetails.reportingTime ? visitorDetails.reportingTime : '');
    formData.append('gate_pass[remarks]', gatePassDetails.remarks ? gatePassDetails.remarks : '');
    formData.append('gate_pass[building_id]', gatePassDetails.buildingId?.toString() ?? '');
    if (visitorDetails.gateNoId) formData.append('gate_pass[gate_number_id]', visitorDetails.gateNoId.toString());
    if (visitorDetails.driverName) formData.append('gate_pass[driver_name]', visitorDetails.driverName);
    if (visitorDetails.driverContactNo) formData.append('gate_pass[driver_contact_no]', visitorDetails.driverContactNo);
    if (visitorDetails.contactPerson) formData.append('gate_pass[contact_person]', visitorDetails.contactPerson);
    if (visitorDetails.contactPersonNo) formData.append('gate_pass[contact_person_no]', visitorDetails.contactPersonNo);

    if(vendorCompanyName) formData.append('gate_pass[vendor_company_name]', vendorCompanyName); // NEW: Append vendor company name
    if (gatePassDetails.vendorId) formData.append('gate_pass[pms_supplier_id]', gatePassDetails.vendorId.toString());
    // Returnable: pass 'true' if returnable, 'false' if non-returnable
    formData.append('gate_pass[returnable]', returnableStatus === 'returnable' ? 'true' : 'false');
    // Expected Return Date
    if (visitorDetails.expectedReturnDate) formData.append('gate_pass[expected_return_date]', visitorDetails.expectedReturnDate);
    // Quantity and Unit
    // if (gatePassDetails.quantity) formData.append('gate_pass[quantity]', gatePassDetails.quantity);
    // if (gatePassDetails.unit) formData.append('gate_pass[unit]', gatePassDetails.unit);

    // Append material details
    materialRows.forEach((row, index) => {
      if (row.itemCategoryId === -1) {
        if (row.otherMaterialName)
          formData.append(`gate_pass[gate_pass_materials_attributes][${index}][other_material_name]`, row.otherMaterialName);        
        if (row.itemTypeId) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][pms_inventory_type_id]`, row.itemTypeId.toString());
        if (row.itemCategoryId) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][item_category]`, row.itemCategoryId.toString() || 'Other');
        if (row.quantity || row.maxQuantity) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][gate_pass_qty]`, String(Number(row.quantity || row.maxQuantity)));
        if (row.unit) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][unit]`, row.unit);
        formData.append(`gate_pass[gate_pass_materials_attributes][${index}][other_material_description]`, row.description ?? '');
        formData.append(`gate_pass[gate_pass_materials_attributes][${index}][remarks]`, gatePassDetails.remarks ?? '');
      } else {
        formData.append(`gate_pass[gate_pass_materials_attributes][${index}][pms_inventory_id]`, row.itemNameId.toString());
        if (row.itemTypeId) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][pms_inventory_type_id]`, row.itemTypeId.toString());
        if (row.itemCategoryId) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][item_category]`, row.itemCategoryId.toString());
        if (row.quantity || row.maxQuantity) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][gate_pass_qty]`, String(Number(row.quantity || row.maxQuantity)));
        if (row.unit) formData.append(`gate_pass[gate_pass_materials_attributes][${index}][unit]`, row.unit);
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
      toast.success("Gate pass outward entry created successfully!");
      navigate('/security/gate-pass/outwards');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to create entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
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

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Visitor Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Row 1 */}
            <TextField label={<span>Contact Person <span style={{ color: 'red' }}>*</span></span>} placeholder="Enter Contact Person" fullWidth variant="outlined" value={visitorDetails.contactPerson} onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-Z\s]*$/.test(value)) handleVisitorChange('contactPerson', value);
            }} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }}
              error={!!fieldErrors.contactPerson}
              helperText={fieldErrors.contactPerson}
            />
            <TextField label={<span>Contact No <span style={{ color: 'red' }}>*</span></span>} placeholder="Enter Contact No" fullWidth variant="outlined" value={visitorDetails.contactPersonNo} onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) handleVisitorChange('contactPersonNo', value);
            }} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }}
              error={!!fieldErrors.contactPersonNo}
              helperText={fieldErrors.contactPersonNo}
            />
            
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.modeOfTransport}>
              <InputLabel shrink>Mode Of Transport <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect label="Mode Of Transport" notched displayEmpty value={visitorDetails.modeOfTransport} onChange={(e) => handleVisitorChange('modeOfTransport', e.target.value)}>
                <MenuItem value="">Select Transport</MenuItem>
                <MenuItem value="car">Car</MenuItem>
                <MenuItem value="bike">Bike</MenuItem>
                <MenuItem value="truck">Truck</MenuItem>
                <MenuItem value="walk">Walking</MenuItem>
                <MenuItem value="self">Self</MenuItem>
              </MuiSelect>
              {fieldErrors.modeOfTransport && <Typography variant="caption" color="error">{fieldErrors.modeOfTransport}</Typography>}
            </FormControl>
            {(visitorDetails.modeOfTransport == "car" || visitorDetails.modeOfTransport == "bike" || visitorDetails.modeOfTransport == "truck") && (
              <TextField label={<span>Vehicle No. <span style={{ color: 'red' }}>*</span></span>} placeholder="MH04BA-1009" fullWidth variant="outlined" value={visitorDetails.vehicleNo} onChange={(e) => handleVisitorChange('vehicleNo', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            )}
            <TextField
              label={<span>Reporting Time <span style={{ color: 'red' }}>*</span></span>}
              type="time"
              fullWidth
              variant="outlined"
              value={visitorDetails.reportingTime}
              onChange={(e) => handleVisitorChange('reportingTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              error={!!fieldErrors.reportingTime}
              helperText={fieldErrors.reportingTime}
            />
            <TextField
              label="Company Name"
              placeholder="Enter Company Name"
              fullWidth
              variant="outlined"
              value={vendorCompanyName}
              onChange={e => setVendorCompanyName(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            {returnableStatus === 'returnable' && (
              <TextField
                label={<span>Expected Return Date <span style={{ color: 'red' }}>*</span></span>}
                type="date"
                fullWidth
                variant="outlined"
                value={visitorDetails.expectedReturnDate}
                onChange={e => handleVisitorChange('expectedReturnDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
                error={!!fieldErrors.expectedReturnDate}
                helperText={fieldErrors.expectedReturnDate}
              />
            )}

            
            {/* <TextField label="Driver Name" placeholder="Enter Driver Name" fullWidth variant="outlined" value={visitorDetails.driverName} onChange={(e) =>{
            const value = e.target.value;
            if (/^[a-zA-Z\s]*$/.test(value)) handleVisitorChange('driverName', value);
          }} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
          <TextField label="Driver Contact No" placeholder="Enter Driver Contact No" fullWidth variant="outlined" value={visitorDetails.driverContactNo} onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) handleVisitorChange('driverContactNo', value);
          }} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} /> */}

            
            

            {/* Quantity and Unit fields */}
            {/* <TextField
            label="Quantity"
            placeholder="Enter Quantity"
            fullWidth
            variant="outlined"
            value={gatePassDetails.quantity}
            onChange={e => handleGatePassChange('quantity', e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
          />
          <TextField
            label="Unit"
            placeholder="Enter Unit"
            fullWidth
            variant="outlined"
            value={gatePassDetails.unit}
            onChange={e => handleGatePassChange('unit', e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
          /> */}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Gate Pass Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.site}>
              <InputLabel shrink>Site <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect
                label="Site"
                notched
                displayEmpty
                value={selectedSite ? selectedSite.id : ''}
                disabled
              >
                <MenuItem value="">Select Site</MenuItem>
                {selectedSite && <MenuItem value={selectedSite.id}>{selectedSite.name}</MenuItem>}
              </MuiSelect>
              {fieldErrors.site && <Typography variant="caption" color="error">{fieldErrors.site}</Typography>}
            </FormControl> */}
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.buildingId}>
              <InputLabel shrink>Building <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect
                label="Building"
                notched
                displayEmpty
                value={gatePassDetails.buildingId || ''}
                onChange={e => handleGatePassChange('buildingId', e.target.value)}
                disabled={!selectedSite}
              >
                <MenuItem value="">Select Building</MenuItem>
                {buildings.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
              </MuiSelect>
              {fieldErrors.buildingId && <Typography variant="caption" color="error">{fieldErrors.buildingId}</Typography>}
            </FormControl>
            {/* <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.company}>
              <InputLabel shrink>Company Name <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect
                label="Company Name"
                notched
                displayEmpty
                value={selectedCompany ? selectedCompany.id : ''}
                disabled
              >
                <MenuItem value="">Select Company</MenuItem>
                {selectedCompany && <MenuItem value={selectedCompany.id}>{selectedCompany.name}</MenuItem>}
              </MuiSelect>
              {fieldErrors.company && <Typography variant="caption" color="error">{fieldErrors.company}</Typography>}
            </FormControl> */}

            {/* Vendor Dropdown */}
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.vendorId}>
              <InputLabel shrink>Vendor <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect
                label="Vendor"
                notched
                displayEmpty
                value={gatePassDetails.vendorId || ''}
                onChange={e => handleGatePassChange('vendorId', e.target.value)}
              >
                <MenuItem value="">Select Vendor</MenuItem>
                {companies.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
              </MuiSelect>
              {fieldErrors.vendorId && <Typography variant="caption" color="error">{fieldErrors.vendorId}</Typography>}
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.gateNoId}>
              <InputLabel shrink>Gate No. <span style={{ color: 'red' }}>*</span></InputLabel>
              <MuiSelect
                label="Gate No."
                notched
                displayEmpty
                value={visitorDetails.gateNoId || ''}
                onChange={e => handleVisitorChange('gateNoId', e.target.value)}
              >
                <MenuItem value="">Select Gate No</MenuItem>
                {gateNumbers.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.gate_number || option.name}</MenuItem>
                ))}
              </MuiSelect>
              {fieldErrors.gateNoId && <Typography variant="caption" color="error">{fieldErrors.gateNoId}</Typography>}
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.gatePassTypeId}>
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
              {fieldErrors.gatePassTypeId && <Typography variant="caption" color="error">{fieldErrors.gatePassTypeId}</Typography>}
            </FormControl>
            <TextField
              label={<span>Gate Pass Date <span style={{ color: 'red' }}>*</span></span>}
              type="date"
              fullWidth
              variant="outlined"
              value={gatePassDetails.gatePassDate}
              onChange={(e) => handleGatePassChange('gatePassDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              error={!!fieldErrors.gatePassDate}
              helperText={fieldErrors.gatePassDate}
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
            />
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
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4" style={{ minWidth: 150 }}>
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
                    <td className="px-4 py-4" style={{ minWidth: 150 }}>
                      <FormControl fullWidth variant="outlined" size="small" >
                        <InputLabel shrink>Item Category <span style={{ color: 'red' }}>*</span></InputLabel>
                        <MuiSelect
                          label="Item Category"
                          notched
                          displayEmpty
                          value={
        row.itemCategoryId !== null && row.itemCategoryId !== undefined
          ? String(row.itemCategoryId)
          : ''
      }
      onChange={e => {
        const value = e.target.value;
        if (value === String(-1)) {
          handleRowChange(row.id, 'itemCategoryId', -1);
        } else if (value === '') {
          handleRowChange(row.id, 'itemCategoryId', null);
        } else {
          const numVal = Number(value);
          handleRowChange(row.id, 'itemCategoryId', isNaN(numVal) ? value : numVal);
        }
      }}
      disabled={!row.itemTypeId}
    >
      <MenuItem value="">Select Category</MenuItem>
      {(itemCategoryOptions[row.id] || [])
        .filter(option => option.id !== "" && option.name !== "")
        .map((option) => (
          <MenuItem key={option.id} value={String(option.id)}>
            <span style={{
              display: 'inline-block',
              maxWidth: 180,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {option.name}
            </span>
          </MenuItem>
        ))}
      <MenuItem key={-1} value={String(-1)}>Other</MenuItem>
    </MuiSelect>
  </FormControl>
</td>
<td className="px-4 py-4" style={{ minWidth: 150 }}>
  {/* If "Other" is selected, show input, else dropdown */}
  {row.itemCategoryId === -1 ? (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Enter Item Name"
      value={row.otherMaterialName || ''}
      onChange={e => handleRowChange(row.id, 'otherMaterialName', e.target.value)}
      required
    />
  ) : (
    <FormControl fullWidth variant="outlined" size="small" >
      <InputLabel shrink>Item Name <span style={{ color: 'red' }}>*</span></InputLabel>
      <MuiSelect
        label="Item Name"
        notched
        displayEmpty
        value={row.itemNameId || ''}
        onChange={e => handleRowChange(row.id, 'itemNameId', e.target.value)}
        disabled={!row.itemCategoryId}
        MenuProps={{
          PaperProps: {
            style: {
              maxWidth: 200,
            },
          },
        }}
      >
        <MenuItem value="">Select Item</MenuItem>
        {(itemNameOptions[row.id] || []).map((option) => (
          <MenuItem key={option.id} value={option.id}>
            <span style={{
              display: 'inline-block',
              maxWidth: 180,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {option.name}
            </span>
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )}
</td>
<td className="px-4 py-4">
                      <TextField
                        variant="outlined"
                        size="small"
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)}
                        inputProps={{
                          // Remove max validation to avoid browser tooltip
                          min: 0,
                          step: 'any'
                        }}
                        // helperText={row.maxQuantity !== null ? `Max: ${row.maxQuantity}` : ''}
                      />
                    </td>
                    <td className="px-4 py-4"><TextField variant="outlined" size="small" value={row.unit} onChange={(e) => {
                      const value = e.target.value;
                      if (/^[a-zA-Z\s]*$/.test(value)) handleRowChange(row.id, 'unit', value);
                    }}
                      inputProps={{ pattern: "[a-zA-Z\s]*" }}
                    /></td>
                    <td className="px-4 py-4"><TextField variant="outlined" size="small" value={row.description} onChange={(e) => handleRowChange(row.id, 'description', e.target.value)} /></td>
                    <td className="px-4 py-4">
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
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
  type="submit"
  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2"
  disabled={isSubmitting}
>
  Submit
</Button>
          <Button type="button" variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-8 py-2" onClick={() => navigate('/security/gate-pass/outwards')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};