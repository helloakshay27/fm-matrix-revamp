import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Box, Typography, IconButton, Button as MuiButton, Autocomplete } from '@mui/material';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import { AttachFile, Close } from '@mui/icons-material';
import { useToast } from '@/hooks/use-toast';
import { gateNumberService } from '@/services/gateNumberService';
import { gatePassInwardService } from '@/services/gatePassInwardService';
import { gatePassTypeService } from '@/services/gatePassTypeService';
import { API_CONFIG } from '@/config/apiConfig';
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import { AddCustomFieldModal } from '@/components/AddCustomFieldModal';

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
  otherMaterialName?: string; // For "Other"
}

export const AddGatePassInwardPage = () => {
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [materialRows, setMaterialRows] = useState<MaterialRow[]>([
    { id: 1, itemTypeId: null, itemCategoryId: null, itemNameId: null, quantity: '', unit: '', description: '', maxQuantity: null, otherMaterialName: '' }
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
    invoiceId: '', // Add invoice ID
    invoiceDate: '', // Add invoice date
    invoiceAmount: '', // Add invoice amount
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
  const [vendorCompanyName, setVendorCompanyName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Custom fields state
  const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [customFields, setCustomFields] = useState<{ [key: string]: any[] }>({
    visitorDetails: [],
    gatePassDetails: [],
    goodsDetails: [],
  });

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
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
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
      fetch(`${API_CONFIG.BASE_URL}/gate_numbers.json?q[active_eq]=true&q[building_id_eq]=${gatePassDetails.buildingId}`, {
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
      const updatedRows = newRows.map(row => row.id === id ? { ...row, itemCategoryId: null, itemNameId: null, maxQuantity: null, quantity: '', unit: '', otherMaterialName: '' } : row);
      setMaterialRows(updatedRows);
      setItemNameOptions(prev => ({ ...prev, [id]: [] }));

      if (value) {
        const subTypes = await gatePassInwardService.getInventorySubTypes();
        setItemCategoryOptions(prev => ({ ...prev, [id]: subTypes }));
      } else {
        setItemCategoryOptions(prev => ({ ...prev, [id]: [] }));
      }
    } else if (field === 'itemCategoryId') {
      const updatedRows = newRows.map(row => row.id === id ? { ...row, itemNameId: null, maxQuantity: null, quantity: '', unit: '', otherMaterialName: '' } : row);
      setMaterialRows(updatedRows);

      const currentItemTypeId = newRows.find(row => row.id === id)?.itemTypeId;
      if (value && currentItemTypeId && value !== -1) {
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
        unit: selectedItem?.unit ?? ''
      } : row);
      setMaterialRows(updatedRows);
    } else if (field === 'otherMaterialName') {
      setMaterialRows(newRows);
    } else {
      setMaterialRows(newRows);
    }
  };
  console.log("itemCategoryOptions:----", itemCategoryOptions);

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

  // Custom field handlers
  const openCustomFieldModal = (section: string) => {
    setCurrentSection(section);
    setCustomFieldModalOpen(true);
  };

  const handleAddCustomField = (fieldName: string) => {
    if (!fieldName.trim()) {
      toast.error("Field name cannot be empty");
      return;
    }

    setCustomFields((prev) => ({
      ...prev,
      [currentSection]: [
        ...(prev[currentSection] || []),
        { name: fieldName, value: "" },
      ],
    }));
    setCustomFieldModalOpen(false);
    toast.success(`Custom field "${fieldName}" added successfully`);
  };

  const handleCustomFieldChange = (section: string, index: number, value: string) => {
    setCustomFields((prev) => ({
      ...prev,
      [section]: prev[section].map((field, i) =>
        i === index ? { ...field, value } : field
      ),
    }));
  };

  const handleRemoveCustomField = (section: string, index: number) => {
    setCustomFields((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
    toast.success("Custom field removed");
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
  // Field-level error state
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit

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
    if (!gatePassDetails.gateNumberId) {
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

    setIsSubmitting(true); // Only set after validation passes
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
    if (visitorDetails.modeOfTransport) formData.append('gate_pass[mode_of_transport]', visitorDetails.modeOfTransport);
    if (gatePassDetails.remarks) formData.append('gate_pass[remarks]', gatePassDetails.remarks);
    if (visitorDetails.gateNoId) formData.append('gate_pass[gate_number_id]', visitorDetails.gateNoId.toString());
    if (gatePassDetails.gateNumberId) formData.append('gate_pass[gate_number_id]', gatePassDetails.gateNumberId.toString());

    // Vendor
    if (gatePassDetails.vendorId) formData.append('gate_pass[pms_supplier_id]', gatePassDetails.vendorId.toString());
    // Due at (reporting time)
    if (visitorDetails.reportingTime) formData.append('gate_pass[due_at]', visitorDetails.reportingTime);
    if (visitorDetails.contactPerson) formData.append('gate_pass[contact_person]', visitorDetails.contactPerson);
    if (visitorDetails.contactPersonNo) formData.append('gate_pass[contact_person_no]', visitorDetails.contactPersonNo);

    // Vendor Company Name
    if (vendorCompanyName) formData.append('gate_pass[vendor_company_name]', vendorCompanyName);

    // Append Invoice fields
    if (gatePassDetails.invoiceId) formData.append('gate_pass[invoice_no]', gatePassDetails.invoiceId);
    if (gatePassDetails.invoiceDate) formData.append('gate_pass[invoice_date]', gatePassDetails.invoiceDate);
    if (gatePassDetails.invoiceAmount) formData.append('gate_pass[invoice_amount]', gatePassDetails.invoiceAmount);

    // Append custom fields as extra_fields_attributes
    customFields.gatePassDetails.forEach((field, index) => {
      formData.append(`gate_pass[extra_fields_attributes][${index}][field_name]`, field.name);
      formData.append(`gate_pass[extra_fields_attributes][${index}][field_value]`, field.value);
    });

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
    console.log("formData", JSON.stringify(Object.fromEntries(formData)));

    try {
      await gatePassInwardService.createGatePassInward(formData);
      toast.success("Gate pass inward entry created successfully!");
      navigate('/security/gate-pass/inwards');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to create entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/security/gate-pass/inwards');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Gate Pass Inward List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Create New Gate Pass Inward</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          NEW GATE PASS INWARD
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 border border-gray-200 rounded-lg p-10 bg-white" onMouseDown={e => e.stopPropagation()}>

        {/* Visitor Detail Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Visitor Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TextField label={<span>Visitor Name <span style={{ color: 'red' }}>*</span></span>} placeholder="Enter Name" fullWidth variant="outlined" value={visitorDetails.contactPerson} onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-Z ]*$/.test(value)) handleVisitorChange('contactPerson', value);
            }} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} inputProps={{ maxLength: 50, pattern: '^[a-zA-Z ]+$' }}
              error={!!fieldErrors.contactPerson}
              helperText={fieldErrors.contactPerson}
            />
            <TextField label={<span>Mobile No. <span style={{ color: 'red' }}>*</span></span>} placeholder="+91" fullWidth variant="outlined" value={visitorDetails.contactPersonNo} onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) handleVisitorChange('contactPersonNo', value);
            }} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} inputProps={{ maxLength: 10, pattern: '\\d{10}' }}
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
              <TextField label="Vehicle No." placeholder="MH04BA-1009" fullWidth variant="outlined" value={visitorDetails.vehicleNo} onChange={(e) => handleVisitorChange('vehicleNo', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }} />
            )}
            <TextField label={<span>Reporting Time <span style={{ color: 'red' }}>*</span></span>} type="time" fullWidth variant="outlined" value={visitorDetails.reportingTime} onChange={(e) => handleVisitorChange('reportingTime', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }}
              error={!!fieldErrors.reportingTime}
              helperText={fieldErrors.reportingTime}
            />
            {/* NEW: Vendor Company Name field, placed next to Reporting Time */}
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
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.vendorId}>
              <InputLabel shrink>Vendor</InputLabel>
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
              {fieldErrors.vendorId && <Typography variant="caption" color="error">{fieldErrors.vendorId}</Typography>}
            </FormControl>
          </div>
        </div>

        {/* Gate Pass Details Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Gate Pass Details</h2>
            <button
              type="button"
              onClick={() => openCustomFieldModal("gatePassDetails")}
              className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
            >
              <Plus className="w-4 h-4" />
              Custom Field
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Move Site and Building fields to the top */}
            {/* <TextField
              label={<span>Site <span style={{ color: 'red' }}>*</span></span>}
              value={selectedSite ? selectedSite.name : ''}
              fullWidth
              variant="outlined"
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputBase-root': fieldStyles }}
              error={!!fieldErrors.site}
              helperText={fieldErrors.site}
            /> */}
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.buildingId}>
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
              {fieldErrors.buildingId && <Typography variant="caption" color="error">{fieldErrors.buildingId}</Typography>}
            </FormControl>
            {/* <TextField
              label={<span>Company <span style={{ color: 'red' }}>*</span></span>}
              value={selectedCompany ? selectedCompany.name : ''}
              fullWidth
              variant="outlined"
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputBase-root': fieldStyles }}
              error={!!fieldErrors.company}
              helperText={fieldErrors.company}
            /> */}

            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!fieldErrors.gateNumberId}>
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
              {fieldErrors.gateNumberId && <Typography variant="caption" color="error">{fieldErrors.gateNumberId}</Typography>}
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

            <TextField label={<span>Gate Pass Date <span style={{ color: 'red' }}>*</span></span>} type="date" fullWidth variant="outlined" value={gatePassDetails.gatePassDate} onChange={(e) => handleGatePassChange('gatePassDate', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ sx: fieldStyles }}
              error={!!fieldErrors.gatePassDate}
              helperText={fieldErrors.gatePassDate}
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
            />

            <TextField
              label="Invoice ID"
              placeholder="Enter Invoice ID"
              fullWidth
              variant="outlined"
              value={gatePassDetails.invoiceId}
              onChange={(e) => handleGatePassChange('invoiceId', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              label="Invoice Date"
              type="date"
              fullWidth
              variant="outlined"
              value={gatePassDetails.invoiceDate}
              onChange={(e) => handleGatePassChange('invoiceDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              label="Invoice Amount"
              placeholder="Enter Amount"
              fullWidth
              variant="outlined"
              type="text"
              value={gatePassDetails.invoiceAmount}
              onChange={(e) => {
                // allow digits and a single dot, limit to two decimals
                const raw = e.target.value.replace(/[^\d.]/g, '');
                const match = raw.match(/^(\d+(\.\d{0,2})?|\.\d{0,2})/);
                const next = match ? match[0] : '';
                handleGatePassChange('invoiceAmount', next);
              }}
              onBlur={(e) => {
                let v = e.target.value;
                if (!v) return;
                if (v.startsWith('.')) v = '0' + v;   // ".5" -> "0.5"
                if (v.endsWith('.')) v = v + '00';    // "10." -> "10.00"
                const num = Number(v);
                if (!isNaN(num)) {
                  handleGatePassChange('invoiceAmount', num.toFixed(2)); // normalize to 2 decimals
                }
              }}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              inputProps={{ inputMode: 'decimal', pattern: '^\\d*(\\.\\d{0,2})?$' }}
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

            {/* Render custom fields for gate pass details */}
            {customFields.gatePassDetails?.map((field, index) => (
              <div key={index} style={{ position: "relative" }}>
                <TextField
                  label={field.name}
                  placeholder={`Enter ${field.name}`}
                  fullWidth
                  variant="outlined"
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange("gatePassDetails", index, e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleRemoveCustomField("gatePassDetails", index);
                  }}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#000",
                    cursor: "pointer",
                    lineHeight: "1",
                    border: "1.5px solid #000",
                    borderRadius: "50%",
                    padding: "4px",
                    backgroundColor: "#fff",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10
                  }}
                  title="Remove field"
                >
                  ✕
                </div>
              </div>
            ))}
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
                  <th scope="col" className="px-4 py-3">Quantity</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '80px' }}>Unit</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '180px' }}>Description</th>
                  {/* <th scope="col" className="px-4 py-3 sticky right-0 bg-white z-10" style={{ width: '120px' }}>Attachments</th> */}
                  <th scope="col" className="px-4 py-3" style={{ width: '80px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {materialRows.map((row, index) => (
                  <tr key={row.id} className="bg-white border-b">
                    <td className="px-4 py-2 pt-4" style={{ width: '30px' }}>{index + 1}</td>
                    <td className="px-4 py-2 pt-4" style={{ minWidth: 180 }}>
                      <FormControl fullWidth variant="outlined" size="small">
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
                      <FormControl fullWidth variant="outlined" size="small">
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
                            // If "Other" is selected, set itemCategoryId to -1 (number)
                            // If a valid option is selected, set itemCategoryId to its id (string or number)
                            // If empty, set to null
                            if (value === String(-1)) {
                              handleRowChange(row.id, 'itemCategoryId', -1);
                            } else if (value === '') {
                              handleRowChange(row.id, 'itemCategoryId', null);
                            } else {
                              // If not "Other", set to the id (convert to number if possible)
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
                    <td className="px-4 py-2 pt-4" style={{ minWidth: 180 }}>
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
                        <FormControl fullWidth variant="outlined" size="small">
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
                    <td className="px-4 py-2 pt-4">
                      <TextField
                        variant="outlined"
                        size="small"
                        type="number"
                        value={row.quantity}

                        placeholder='Quantity'
                        onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 pt-4">
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Unit"

                        value={row.unit}
                        onChange={e => {
                          const value = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(value)) handleRowChange(row.id, 'unit', value);
                        }}
                        inputProps={{ maxLength: 20, pattern: '[a-zA-Z\s]*' }}
                      />
                    </td>
                    <td className="px-4 py-2 pt-4"><TextField variant="outlined" size="small" placeholder='Enter Description' value={row.description} onChange={(e) => handleRowChange(row.id, 'description', e.target.value)} /></td>
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

      {/* Custom Field Modal */}
      <AddCustomFieldModal
        isOpen={customFieldModalOpen}
        onClose={() => setCustomFieldModalOpen(false)}
        onAddField={handleAddCustomField}
        isItAsset={false}
      />
    </div>
  );
};