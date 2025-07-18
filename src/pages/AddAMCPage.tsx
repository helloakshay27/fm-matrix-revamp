import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { apiClient } from '@/utils/apiClient';
export const AddAMCPage = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    details: 'Asset',
    type: 'Individual',
    assetName: '',
    vendor: '',
    group: '',
    subgroup: '',
    service: '',
    supplier: '',
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
    invoices: [] as File[]
  });
  
  const [assetGroups, setAssetGroups] = useState<Array<{id: number, name: string, sub_groups: Array<{id: number, name: string}>}>>([]);
  const [subGroups, setSubGroups] = useState<Array<{id: number, name: string}>>([]);
  const [suppliers, setSuppliers] = useState<Array<{id: number, company_name: string}>>([]);
  const [assets, setAssets] = useState<Array<{id: number, name: string}>>([]);
  const [services, setServices] = useState<Array<{id: number, name: string}>>([]);
  const [loading, setLoading] = useState(false);
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      // Clear the assetName when switching between Asset and Service
      if (field === 'details' && prev.details !== value) {
        return {
          ...prev,
          [field]: value,
          assetName: ''
        };
      }
      // Clear group-related fields when switching between Individual and Group
      if (field === 'type' && prev.type !== value) {
        return {
          ...prev,
          [field]: value,
          group: '',
          subgroup: '',
          service: '',
          supplier: ''
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };
  const handleFileUpload = (type: 'contracts' | 'invoices', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(prev => ({
        ...prev,
        [type]: [...prev[type], ...fileArray]
      }));
    }
  };
  const removeFile = (type: 'contracts' | 'invoices', index: number) => {
    setAttachments(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // Fetch asset groups from API
  useEffect(() => {
    const fetchAssetGroups = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/pms/assets/get_asset_group_sub_group.json');
        console.log('API Response:', response.data);
        
        // Ensure we always set an array
        if (Array.isArray(response.data)) {
          setAssetGroups(response.data);
        } else if (response.data && Array.isArray(response.data.asset_groups)) {
          setAssetGroups(response.data.asset_groups);
        } else {
          console.warn('API response is not an array:', response.data);
          setAssetGroups([]);
        }
      } catch (error) {
        console.error('Error fetching asset groups:', error);
        setAssetGroups([]); // Ensure it stays as an array
        toast({
          title: "Error",
          description: "Failed to fetch asset groups.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await apiClient.get('/pms/suppliers.json');
        console.log('Suppliers API Response:', response.data);
        
        // Handle different possible response structures for suppliers
        if (Array.isArray(response.data)) {
          setSuppliers(response.data);
        } else if (response.data && Array.isArray(response.data.suppliers)) {
          setSuppliers(response.data.suppliers);
        } else {
          console.warn('Suppliers API response is not an array:', response.data);
          setSuppliers([]);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setSuppliers([]);
        toast({
          title: "Error",
          description: "Failed to fetch suppliers.",
          variant: "destructive"
        });
      }
    };

    const fetchAssets = async () => {
      try {
        const response = await apiClient.get('/pms/assets/get_assets.json');
        console.log('Assets API Response:', response.data);
        
        // Handle different possible response structures for assets
        if (Array.isArray(response.data)) {
          setAssets(response.data);
        } else if (response.data && Array.isArray(response.data.assets)) {
          setAssets(response.data.assets);
        } else {
          console.warn('Assets API response is not an array:', response.data);
          setAssets([]);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
        setAssets([]);
        toast({
          title: "Error",
          description: "Failed to fetch assets.",
          variant: "destructive"
        });
      }
    };

    const fetchServices = async () => {
      try {
        const response = await apiClient.get('/pms/services/get_services.json');
        console.log('Services API Response:', response.data);
        
        // Handle different possible response structures for services
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else if (response.data && Array.isArray(response.data.services)) {
          setServices(response.data.services);
        } else {
          console.warn('Services API response is not an array:', response.data);
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
        toast({
          title: "Error",
          description: "Failed to fetch services.",
          variant: "destructive"
        });
      }
    };

    fetchAssetGroups();
    fetchSuppliers();
    fetchAssets();
    fetchServices();
  }, [toast]);

  // Update sub-groups when group changes
  const handleGroupChange = async (groupId: string) => {
    console.log('=== GROUP CHANGED ===');
    console.log('Selected Group ID:', groupId);
    
    handleInputChange('group', groupId);
    handleInputChange('subgroup', ''); // Clear subgroup selection
    
    if (groupId) {
      setLoading(true);
      try {
        console.log('Making API call for subgroups...');
        const response = await apiClient.get(`/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`);
        console.log('SubGroup API Response - Full response:', response);
        console.log('SubGroup API Response - Data only:', response.data);
        console.log('SubGroup API Response - Data type:', typeof response.data);
        console.log('SubGroup API Response - Is Array?', Array.isArray(response.data));
        
        // Handle different possible response structures for subgroups
        if (Array.isArray(response.data)) {
          console.log('Setting subgroups - Direct array:', response.data);
          setSubGroups(response.data);
        } else if (response.data && Array.isArray(response.data.asset_groups)) {
          console.log('Setting subgroups - asset_groups property:', response.data.asset_groups);
          setSubGroups(response.data.asset_groups);
        } else if (response.data && Array.isArray(response.data.sub_groups)) {
          console.log('Setting subgroups - sub_groups property:', response.data.sub_groups);
          setSubGroups(response.data.sub_groups);
        } else if (response.data && Array.isArray(response.data.asset_sub_groups)) {
          console.log('Setting subgroups - asset_sub_groups property:', response.data.asset_sub_groups);
          setSubGroups(response.data.asset_sub_groups);
        } else {
          console.warn('SubGroup API response structure unknown:', response.data);
          console.log('Available keys in response.data:', Object.keys(response.data || {}));
          setSubGroups([]);
        }
      } catch (error) {
        console.error('Error fetching subgroups:', error);
        setSubGroups([]);
        toast({
          title: "Error",
          description: "Failed to fetch subgroups.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.log('No group selected, clearing subgroups');
      setSubGroups([]);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AMC Data:', formData);
    console.log('Attachments:', attachments);
    toast({
      title: "AMC Created",
      description: "AMC has been successfully created."
    });
    navigate('/maintenance/amc');
  };
  const handleSaveAndSchedule = () => {
    console.log('Save & Schedule AMC:', formData);
    console.log('Attachments:', attachments);
    toast({
      title: "AMC Saved & Scheduled",
      description: "AMC has been saved and scheduled successfully."
    });
    navigate('/maintenance/amc');
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
  return <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/maintenance/amc')} className="mb-4">
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
                  <input type="radio" name="details" value="Asset" checked={formData.details === 'Asset'} onChange={e => handleInputChange('details', e.target.value)} className="mr-2" style={{
                  accentColor: '#C72030'
                }} />
                  Asset
                </label>
                <label className="flex items-center">
                  <input type="radio" name="details" value="Service" checked={formData.details === 'Service'} onChange={e => handleInputChange('details', e.target.value)} className="mr-2" style={{
                  accentColor: '#C72030'
                }} />
                  Service
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="type" value="Individual" checked={formData.type === 'Individual'} onChange={e => handleInputChange('type', e.target.value)} className="mr-2" style={{
                  accentColor: '#C72030'
                }} />
                  Individual
                </label>
                <label className="flex items-center">
                  <input type="radio" name="type" value="Group" checked={formData.type === 'Group'} onChange={e => handleInputChange('type', e.target.value)} className="mr-2" style={{
                  accentColor: '#C72030'
                }} />
                  Group
                </label>
              </div>
            </div>

            {/* Conditional rendering based on type selection */}
            {formData.type === 'Individual' ? (
              <>
                {formData.details === 'Asset' ? (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="asset-select-label" shrink>Assets</InputLabel>
                    <MuiSelect 
                      labelId="asset-select-label" 
                      label="Assets" 
                      displayEmpty 
                      value={formData.assetName} 
                      onChange={e => handleInputChange('assetName', e.target.value)} 
                      sx={fieldStyles}
                      disabled={loading}
                    >
                      <MenuItem value=""><em>Select an Option...</em></MenuItem>
                      {Array.isArray(assets) && assets.map((asset) => (
                        <MenuItem key={asset.id} value={asset.id.toString()}>
                          {asset.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                ) : (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="service-select-label" shrink>Service</InputLabel>
                    <MuiSelect 
                      labelId="service-select-label" 
                      label="Service" 
                      displayEmpty 
                      value={formData.assetName} 
                      onChange={e => handleInputChange('assetName', e.target.value)} 
                      sx={fieldStyles}
                      disabled={loading}
                    >
                      <MenuItem value=""><em>Select a Service...</em></MenuItem>
                      {Array.isArray(services) && services.map((service) => (
                        <MenuItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                )}

                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="vendor-select-label" shrink>Supplier</InputLabel>
                    <MuiSelect 
                      labelId="vendor-select-label" 
                      label="Supplier" 
                      displayEmpty 
                      value={formData.vendor} 
                      onChange={e => handleInputChange('vendor', e.target.value)} 
                      sx={fieldStyles}
                      disabled={loading}
                    >
                      <MenuItem value=""><em>Select Supplier</em></MenuItem>
                      {Array.isArray(suppliers) && suppliers.map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.company_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
              </>
            ) : (
              <>
                {/* Group fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="group-select-label" shrink>Group</InputLabel>
                      <MuiSelect 
                        labelId="group-select-label" 
                        label="Group" 
                        displayEmpty 
                        value={formData.group} 
                        onChange={e => handleGroupChange(e.target.value)} 
                        sx={fieldStyles}
                        disabled={loading}
                      >
                        <MenuItem value=""><em>Select Group</em></MenuItem>
                        {Array.isArray(assetGroups) && assetGroups.map((group) => (
                          <MenuItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="subgroup-select-label" shrink>SubGroup</InputLabel>
                      <MuiSelect 
                        labelId="subgroup-select-label" 
                        label="SubGroup" 
                        displayEmpty 
                        value={formData.subgroup} 
                        onChange={e => handleInputChange('subgroup', e.target.value)} 
                        sx={fieldStyles}
                        disabled={!formData.group || loading}
                      >
                        <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                        {Array.isArray(subGroups) && subGroups.map((subGroup) => (
                          <MenuItem key={subGroup.id} value={subGroup.id.toString()}>
                            {subGroup.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Only show Service dropdown when Details is "Service" */}
                  {formData.details === 'Service' && (
                    <div>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="group-service-select-label" shrink>Service</InputLabel>
                        <MuiSelect labelId="group-service-select-label" label="Service" displayEmpty value={formData.service} onChange={e => handleInputChange('service', e.target.value)} sx={fieldStyles}>
                          <MenuItem value=""><em>Select Service</em></MenuItem>
                          <MenuItem value="preventive-maintenance">Preventive Maintenance</MenuItem>
                          <MenuItem value="corrective-maintenance">Corrective Maintenance</MenuItem>
                          <MenuItem value="emergency-service">Emergency Service</MenuItem>
                          <MenuItem value="inspection-service">Inspection Service</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>
                  )}

                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="group-supplier-select-label" shrink>Supplier</InputLabel>
                      <MuiSelect 
                        labelId="group-supplier-select-label" 
                        label="Supplier" 
                        displayEmpty 
                        value={formData.supplier} 
                        onChange={e => handleInputChange('supplier', e.target.value)} 
                        sx={fieldStyles}
                        disabled={loading}
                      >
                        <MenuItem value=""><em>Select Supplier</em></MenuItem>
                        {Array.isArray(suppliers) && suppliers.map((supplier) => (
                          <MenuItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.company_name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
              </>
            )}
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
        <TextField label="Cost" placeholder="Enter Cost" name="cost" type="number" value={formData.cost} onChange={e => handleInputChange('cost', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
      </div>

      <div>
        <TextField required label="Start Date" placeholder="Select Date" name="startDate" type="date" value={formData.startDate} onChange={e => handleInputChange('startDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
      </div>

      <div>
        <TextField required label="First Service Date" placeholder="Select Date" name="firstService" type="date" value={formData.firstService} onChange={e => handleInputChange('firstService', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
      </div>

      <div>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="payment-terms-select-label" shrink>
            Payment Terms
          </InputLabel>
          <MuiSelect labelId="payment-terms-select-label" label="Payment Terms" displayEmpty value={formData.paymentTerms} onChange={e => handleInputChange('paymentTerms', e.target.value)} sx={fieldStyles}>
            <MenuItem value=""><em>Select Payment Term</em></MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
            <MenuItem value="half-yearly">Half Yearly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </MuiSelect>
        </FormControl>
      </div>

      <div>
        <TextField required label="End Date" placeholder="Select Date" name="endDate" type="date" value={formData.endDate} onChange={e => handleInputChange('endDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
      </div>

      <div>
        <TextField label="No. of Visits" placeholder="Enter No. of Visit" name="noOfVisits" type="number" value={formData.noOfVisits} onChange={e => handleInputChange('noOfVisits', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
      </div>

      {/* Remarks Field - full width in grid */}
     <div className="md:col-span-3">
  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
    Remarks
  </label>
  <textarea id="remarks" name="remarks" value={formData.remarks} onChange={e => handleInputChange('remarks', e.target.value)} placeholder="Enter Remarks" rows={3} className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] resize-none" />
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
              {/* AMC Contracts */}
              <div>
                <label className="block text-sm font-medium mb-2">AMC Contracts</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white flex flex-col items-center justify-center">
                  <input type="file" multiple className="hidden" id="contracts-upload" onChange={e => handleFileUpload('contracts', e.target.files)} />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-[#C72030] font-medium cursor-pointer" style={{
                    fontSize: '14px'
                  }} onClick={() => document.getElementById('contracts-upload')?.click()}>
                      Choose File
                    </span>
                    <span className="text-gray-500" style={{
                    fontSize: '14px'
                  }}>
                      {attachments.contracts.length > 0 ? `${attachments.contracts.length} file(s) selected` : 'No file chosen'}
                    </span>
                  </div>
                  <Button type="button" onClick={() => document.getElementById('contracts-upload')?.click()} className="!bg-[#f6f4ee] !text-[#C72030] !border-none text-sm flex items-center justify-center">
  <Plus className="w-4 h-4 mr-1" />
  Upload Files
                </Button>

                </div>
                {attachments.contracts.length > 0 && <div className="mt-2 space-y-1">
                    {attachments.contracts.map((file, index) => <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFile('contracts', index)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>)}
                  </div>}
              </div>

              {/* AMC Invoice */}
              <div>
                <label className="block text-sm font-medium mb-2">AMC Invoice</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center bg-white">
                  <input type="file" multiple className="hidden" id="invoices-upload" onChange={e => handleFileUpload('invoices', e.target.files)} />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-[#C72030] font-medium cursor-pointer" style={{
                    fontSize: '14px'
                  }} onClick={() => document.getElementById('invoices-upload')?.click()}>
                      Choose File
                    </span>
                    <span className="text-gray-500" style={{
                    fontSize: '14px'
                  }}>
                      {attachments.invoices.length > 0 ? `${attachments.invoices.length} file(s) selected` : 'No file chosen'}
                    </span>
                  </div>
                  <Button type="button" onClick={() => document.getElementById('invoices-upload')?.click()} className="!bg-[#f6f4ee] !text-[#C72030] !border-none hover:!bg-[#f6f4ee]/90 text-sm flex items-center justify-center">
  <Plus className="w-4 h-4 mr-1" />
  Upload Files
                </Button>

                </div>
                {attachments.invoices.length > 0 && <div className="mt-2 space-y-1">
                    {attachments.invoices.map((file, index) => <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFile('invoices', index)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>)}
                  </div>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" onClick={handleSaveAndSchedule} style={{
          backgroundColor: '#C72030'
        }} className="text-white hover:bg-[#C72030]/90">
            Save & Show Details
          </Button>
          <Button type="submit" style={{
          backgroundColor: '#C72030'
        }} className="text-white hover:bg-[#C72030]/90">
            Save & Schedule AMC
          </Button>
        </div>
      </form>
    </div>;
};