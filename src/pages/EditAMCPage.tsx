import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus, FileText, FileSpreadsheet, File, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAssetsData } from '@/store/slices/assetsSlice';
import { fetchSuppliersData } from '@/store/slices/suppliersSlice';
import { fetchServicesData } from '@/store/slices/servicesSlice';
import { fetchAMCDetails } from '@/store/slices/amcDetailsSlice';
import { apiClient } from '@/utils/apiClient';

interface Service {
  id: string | number;
  service_name: string;
}

export const EditAMCPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { id } = useParams();

  // Redux state
  const { data: assetsData, loading: assetsLoading } = useAppSelector(state => state.assets);
  const { data: suppliersData, loading: suppliersLoading } = useAppSelector(state => state.suppliers);
  const { data: servicesData, loading: servicesLoading } = useAppSelector(state => state.services);
  const { data: amcData, loading: amcLoading, error: amcError } = useAppSelector(state => state.amcDetails);

  const [formData, setFormData] = useState({
    details: '',
    type: 'Individual',
    assetName: '',
    asset_ids: [] as string[],
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

  const [existingFiles, setExistingFiles] = useState({
    contracts: [] as Array<{ document_url: string, document_name: string, attachment_id: number }>,
    invoices: [] as Array<{ document_url: string, document_name: string, attachment_id: number }>
  });

  const [assetGroups, setAssetGroups] = useState<Array<{ id: number, name: string, sub_groups: Array<{ id: number, name: string }> }>>([]);
  const [subGroups, setSubGroups] = useState<Array<{ id: number, name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]); // [newServices]


  // Extract data from Redux state
  const assets = Array.isArray((assetsData as any)?.assets) ? (assetsData as any).assets : Array.isArray(assetsData) ? assetsData : [];
  const suppliers = Array.isArray((suppliersData as any)?.suppliers) ? (suppliersData as any).suppliers : Array.isArray(suppliersData) ? suppliersData : [];
  // const services = Array.isArray(servicesData) ? servicesData : [];

  // Fetch AMC data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchAMCDetails(id));
    }
  }, [dispatch, id]);

  // Update form data when AMC data is loaded
  useEffect(() => {
    if (amcData && typeof amcData === 'object') {
      const data = amcData as any;
      const detailType = data.resource_type === 'Pms::Asset' ? 'Asset' : 'Service';
      const isGroupType = data.resource_type === 'Pms::Asset';

      // Set existing files from API response
      if (data.amc_contracts && Array.isArray(data.amc_contracts)) {
        const contractFiles = data.amc_contracts.flatMap((contract: any) =>
          contract.documents ? contract.documents.map((doc: any) => ({
            document_url: doc.document_url,
            document_name: doc.document_name,
            attachment_id: doc.attachment_id
          })) : []
        );
        setExistingFiles(prev => ({ ...prev, contracts: contractFiles }));
      }

      if (data.amc_invoices && Array.isArray(data.amc_invoices)) {
        const invoiceFiles = data.amc_invoices.flatMap((invoice: any) =>
          invoice.documents ? invoice.documents.map((doc: any) => ({
            document_url: doc.document_url,
            document_name: doc.document_name,
            attachment_id: doc.attachment_id
          })) : []
        );
        setExistingFiles(prev => ({ ...prev, invoices: invoiceFiles }));
      }

      // Determine the correct form values based on API response
      const isAssetType = data.asset_id ? true : false;
      const isServiceType = data.service_id ? true : false;
      const isIndividualType = data.resource_type === 'Pms::Asset';

      // Handle asset IDs
      let assetIds = [];
      if (data.asset_id) {
        if (typeof data.asset_id === 'string') {
          try {
            const parsed = JSON.parse(data.asset_id);
            assetIds = Array.isArray(parsed) ? parsed : [data.asset_id];
          } catch {
            assetIds = [data.asset_id];
          }
        } else if (Array.isArray(data.asset_id)) {
          assetIds = data.asset_id;
        } else {
          assetIds = [data.asset_id];
        }
        assetIds = assetIds.map(id => id.toString());
      }

      const supplierId = data.supplier_id?.toString();
      const foundSupplier = suppliers.find(supplier => supplier.id.toString() === supplierId);
      const serviceId = data.service_id?.toString();
      const foundService = services.find(service => service.id.toString() === serviceId);

      setFormData({
        details: detailType,
        type: isGroupType ? 'Group' : 'Individual',
        assetName: foundService ? serviceId : '',
        asset_ids: assetIds,
        vendor: foundSupplier ? supplierId : '',
        group: isGroupType ? (data.group_id?.toString() || '') : '',
        subgroup: data.sub_group_id || '',
        service: '',
        supplier: foundSupplier ? supplierId : '',
        startDate: data.amc_start_date || '',
        endDate: data.amc_end_date || '',
        cost: data.amc_cost?.toString() || '',
        paymentTerms: data.payment_term || '',
        firstService: data.amc_first_service || '',
        noOfVisits: data.no_of_visits?.toString() || '',
        remarks: data.remarks || ''
      });

      // Ensure handleGroupChange is called with the group_id
      if (isGroupType && data.group_id) {
        handleGroupChange(data.group_id.toString());
      }
    }
  }, [amcData, assets, suppliers, services]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      if (field === 'details' && prev.details !== value) {
        return {
          ...prev,
          [field]: value,
          assetName: '',
          asset_ids: []
        };
      }
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

  // Fetch data using Redux slices
  useEffect(() => {
    dispatch(fetchAssetsData({ page: 1 }));
    dispatch(fetchSuppliersData());
    // dispatch(fetchServicesData());

    const fetchAssetGroups = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/pms/assets/get_asset_group_sub_group.json');
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
        setAssetGroups([]);
        toast({
          title: "Error",
          description: "Failed to fetch asset groups.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    const fetchService = async () => {
      try {
        const response = await apiClient.get('/pms/services/get_services.json');
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else if (response.data && Array.isArray(response.data.services)) {
          setServices(response.data.services);
        } else {
          console.warn('API response is not an array:', response.data);
          setServices([]);
        }
      }
      catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
        toast({
          title: "Error",
          description: "Failed to fetch services.",
          variant: "destructive", // this styles it as an error
        });
      }
    }

    fetchService();

    fetchAssetGroups();
  }, [dispatch, toast]);

  const handleGroupChange = async (groupId: string) => {
    handleInputChange('group', groupId);

    if (groupId) {
      setLoading(true);
      try {
        const response = await apiClient.get(`/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`);

        let subgroups = [];
        if (Array.isArray(response.data)) {
          subgroups = response.data;
        } else if (response.data && Array.isArray(response.data.asset_groups)) {
          subgroups = response.data.asset_groups;
        } else if (response.data && Array.isArray(response.data.sub_groups)) {
          subgroups = response.data.sub_groups;
        } else {
          console.warn('SubGroup API response structure unknown:', response.data);
        }
        setSubGroups(subgroups);

        if (formData.subgroup && subgroups.some(sub => sub.id.toString() === formData.subgroup)) {
          handleInputChange('subgroup', formData.subgroup);
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
      setSubGroups([]);
    }
  };

  const handleSubmit = useCallback(async (action: string) => {
    if (!id) return;
    setUpdateLoading(true);

    try {
      const sendData = new FormData();

      // Append form data
      sendData.append('pms_asset_amc[amc_cost]', (parseFloat(formData.cost) || '0').toString());
      sendData.append('pms_asset_amc[amc_start_date]', formData.startDate || '');
      sendData.append('pms_asset_amc[amc_end_date]', formData.endDate || '');
      sendData.append('pms_asset_amc[amc_first_service]', formData.firstService || '');
      sendData.append('pms_asset_amc[amc_frequency]', formData.paymentTerms || '');
      sendData.append('pms_asset_amc[amc_period]', `${formData.startDate} - ${formData.endDate}`);
      sendData.append('pms_asset_amc[no_of_visits]', (parseInt(formData.noOfVisits) || 0).toString());
      sendData.append('pms_asset_amc[payment_term]', formData.paymentTerms || '');
      sendData.append('pms_asset_amc[remarks]', formData.remarks || '');
      sendData.append('pms_asset_amc[pms_site_id]', (amcData as any)?.pms_site_id || '');
      sendData.append('pms_asset_amc[site_name]', (amcData as any)?.site_name || '');
      sendData.append('pms_asset_amc[resource_id]', (amcData as any)?.resource_id || '');
      sendData.append('pms_asset_amc[resource_name]', (amcData as any)?.resource_name || '');
      sendData.append('pms_asset_amc[resource_type]', (amcData as any)?.resource_type || '');
      sendData.append('pms_asset_amc[supplier_id]', formData.vendor || formData.supplier || '');

      // Add supplier details
      const selectedSupplier = suppliers.find(s => s.id.toString() === (formData.vendor || formData.supplier));
      if (selectedSupplier) {
        sendData.append('pms_asset_amc[amc_vendor_name]', selectedSupplier.company_name || '');
        sendData.append('pms_asset_amc[amc_vendor_mobile]', selectedSupplier.mobile || '');
        sendData.append('pms_asset_amc[amc_vendor_email]', selectedSupplier.email || '');
      }

      // Add asset_ids, group_id, sub_group_id, or service_id based on details and type
      if (formData.details === 'Asset') {
        if (formData.type === 'Individual' && formData.asset_ids.length > 0) {
          formData.asset_ids.forEach((id, index) => {
            sendData.append(`pms_asset_amc[asset_ids][${index}]`, id);
          });
        } else if (formData.type === 'Group' && formData.group) {
          sendData.append('pms_asset_amc[group_id]', formData.group);
          if (formData.subgroup) {
            sendData.append('pms_asset_amc[sub_group_id]', formData.subgroup);
          }
        }
      } else if (formData.details === 'Service' && formData.assetName) {
        sendData.append('pms_asset_amc[service_id]', formData.assetName);
      }

      // Append attachments
      attachments.contracts.forEach(file => {
        sendData.append('amc_contracts[content][]', file);
      });
      attachments.invoices.forEach(file => {
        sendData.append('amc_invoices[content][]', file);
      });

      // Add subaction to indicate save action
      sendData.append('subaction', 'save');

      // Debug FormData

      // Make API call
      const response = await apiClient.put(`/pms/asset_amcs/${id}.json`, sendData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'AMC Updated',
        description: 'AMC has been successfully updated.',
      });

      // Navigate based on action
      if (action === 'updated with details') {
        navigate(`/maintenance/amc/details/${id}`);
      } else if (action === 'updated new service') {
        navigate('/maintenance/amc');
      }

    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update AMC: ${error.response?.data?.message || error.message || 'Please try again.'}`,
        variant: 'destructive',
      });
    } finally {
      setUpdateLoading(false);
    }
  }, [id, formData, attachments, amcData, suppliers, toast, navigate]);

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

  if (amcLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/maintenance/amc/details/${id}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            AMC {'>'} AMC List {'>'} Edit AMC
          </Button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT AMC - {id}</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">Loading AMC data...</div>
        </div>
      </div>
    );
  }

  if (amcError) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/maintenance/amc/details/${id}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            AMC {'>'} AMC List {'>'} Edit AMC
          </Button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT AMC - {id}</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-red-600">Error loading AMC data: {amcError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(`/maintenance/amc/details/${id}`)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          AMC {'>'} AMC List {'>'} Edit AMC
        </Button>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT AMC - {id}</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit('updated new service'); }}>
        {/* AMC Configuration */}
        <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
          <CardHeader className='bg-[#F6F4EE] mb-4'>
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
                    onChange={e => handleInputChange('details', e.target.value)}
                    className="mr-2"
                    style={{ accentColor: '#C72030' }}
                    disabled={true}
                  />
                  Asset
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="details"
                    value="Service"
                    checked={formData.details === 'Service'}
                    onChange={e => handleInputChange('details', e.target.value)}
                    className="mr-2"
                    style={{ accentColor: '#C72030' }}
                    disabled={true}
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
                    onChange={e => handleInputChange('type', e.target.value)}
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
                    onChange={e => handleInputChange('type', e.target.value)}
                    className="mr-2"
                    style={{ accentColor: '#C72030' }}
                  />
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
                      multiple
                      displayEmpty
                      value={formData.asset_ids}
                      onChange={e => {
                        const value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          asset_ids: typeof value === 'string' ? value.split(',') : value
                        }));
                      }}
                      sx={fieldStyles}
                      disabled={true}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <em>Select Assets...</em>;
                        }
                        return selected.map(id => {
                          const asset = assets.find(a => a.id.toString() === id);
                          return asset?.name;
                        }).join(', ');
                      }}
                    >
                      {Array.isArray(assets) && assets.map((asset) => (
                        <MenuItem key={asset.id} value={asset.id.toString()}>
                          <input
                            type="checkbox"
                            checked={formData.asset_ids.includes(asset.id.toString())}
                            readOnly
                            style={{ marginRight: '8px', accentColor: '#C72030' }}
                          />
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
                      disabled={loading || servicesLoading || updateLoading}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>Select a Service...</em>;
                        }
                        const service = services.find(s => s.id.toString() === selected);
                        return service ? service.service_name : selected;
                      }}
                    >
                      <MenuItem value=""><em>Select a Service...</em></MenuItem>
                      {Array.isArray(services) && services.map((service) => (
                        <MenuItem key={service.id} value={service.id.toString()}>
                          {service.service_name}
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
                      disabled={loading || suppliersLoading || updateLoading}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>Select Supplier</em>;
                        }
                        const supplier = suppliers.find(s => s.id.toString() === selected);
                        return supplier ? supplier.company_name : selected;
                      }}
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
                        disabled={loading || updateLoading}
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
                        value={`${formData.subgroup}`}
                        onChange={e => handleInputChange('subgroup', e.target.value)}
                        sx={fieldStyles}
                        disabled={!formData.group || loading || updateLoading}
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

                  {formData.details === 'Service' && (
                    <div>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="group-service-select-label" shrink>Service</InputLabel>
                        <MuiSelect
                          labelId="group-service-select-label"
                          label="Service"
                          displayEmpty
                          value={formData.service}
                          onChange={e => handleInputChange('service', e.target.value)}
                          sx={fieldStyles}
                        >
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
                        disabled={loading || suppliersLoading || updateLoading}
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
        <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
          <CardHeader className='bg-[#F6F4EE] mb-4'>
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
                  onChange={e => handleInputChange('cost', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { height: 46 } }}
                  sx={{ '& .MuiInputBase-root': { height: 46 } }}
                />
              </div>

              <div>
                <TextField
                  fullWidth
                  type="date"
                  label="First Service Date"
                  value={formData.firstService}
                  onChange={(e) => handleInputChange('firstService', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { height: 46 } }}
                  sx={{ '& .MuiInputBase-root': { height: 46 } }}
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
                    onChange={e => handleInputChange('paymentTerms', e.target.value)}
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
                  fullWidth
                  type="date"
                  label="End Date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { height: 46 } }}
                  sx={{ '& .MuiInputBase-root': { height: 46 } }}
                />
              </div>

              <div>
                <TextField
                  label="No. of Visits"
                  placeholder="Enter No. of Visit"
                  name="noOfVisits"
                  type="number"
                  value={formData.noOfVisits}
                  onChange={e => handleInputChange('noOfVisits', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div className="md:col-span-3">
                <TextField
                  id="remarks"
                  name="remarks"
                  label="Remarks"
                  placeholder="Enter Remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1D5DB',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
          <CardHeader className='bg-[#F6F4EE] mb-4'>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
              ATTACHMENTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ------------------- AMC Contracts ------------------- */}
              <div>
                <label className="block text-sm font-medium mb-2">AMC Contracts</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white flex flex-col items-center justify-center">
                  <input type="file" multiple className="hidden" id="contracts-upload" onChange={e => handleFileUpload('contracts', e.target.files)} />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-[#C72030] font-medium cursor-pointer text-sm" onClick={() => document.getElementById('contracts-upload')?.click()}>
                      Choose File
                    </span>
                    <span className="text-gray-500 text-sm">
                      {attachments.contracts.length > 0 ? `${attachments.contracts.length} file(s) selected` : 'No file chosen'}
                    </span>
                  </div>
                  <Button type="button" onClick={() => document.getElementById('contracts-upload')?.click()} className="!bg-[#f6f4ee] !text-[#C72030] !border-none text-sm flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-1" />
                    Upload Files
                  </Button>
                </div>

                {/* New Files */}
                {attachments.contracts.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {attachments.contracts.map((file, index) => {
                      const isImage = file.type.startsWith('image/');
                      const isPdf = file.type === 'application/pdf';
                      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                      const fileURL = URL.createObjectURL(file);

                      return (
                        <div key={`${file.name}-${file.lastModified}`} className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm">
                          {isImage ? (
                            <img src={fileURL} alt={file.name} className="w-[40px] h-[40px] object-cover rounded border mb-1" />
                          ) : isPdf ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                              <FileText className="w-4 h-4" />
                            </div>
                          ) : isExcel ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                              <FileSpreadsheet className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-500 bg-white mb-1">
                              <File className="w-4 h-4" />
                            </div>
                          )}
                          <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                          <Button type="button" variant="ghost" size="sm" className="absolute top-1 right-1 h-4 w-4 p-0 text-gray-600" onClick={() => removeFile('contracts', index)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Existing Files */}
                {existingFiles.contracts.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {existingFiles.contracts.map((file) => {
                      const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.document_name);
                      const isPdf = file.document_name.endsWith('.pdf');
                      const isExcel = file.document_name.endsWith('.xlsx') || file.document_name.endsWith('.xls') || file.document_name.endsWith('.csv');

                      return (
                        <div key={`${file.document_name}-${file.attachment_id}`} className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm">
                          {isImage ? (
                            <img src={file.document_url} alt={file.document_name} className="w-[40px] h-[40px] object-cover rounded border mb-1" />
                          ) : isPdf ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                              <FileText className="w-4 h-4" />
                            </div>
                          ) : isExcel ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                              <FileSpreadsheet className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-500 bg-white mb-1">
                              <File className="w-4 h-4" />
                            </div>
                          )}
                          <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.document_name}</span>
                          <Button type="button" variant="ghost" size="sm" className="absolute top-1 right-1 h-4 w-4 p-0 text-[#C72030]" onClick={() => window.open(file.document_url, '_blank')}>
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ------------------- AMC Invoices ------------------- */}
              <div>
                <label className="block text-sm font-medium mb-2">AMC Invoices</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white flex flex-col items-center justify-center">
                  <input type="file" multiple className="hidden" id="invoices-upload" onChange={e => handleFileUpload('invoices', e.target.files)} />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-[#C72030] font-medium cursor-pointer text-sm" onClick={() => document.getElementById('invoices-upload')?.click()}>
                      Choose File
                    </span>
                    <span className="text-gray-500 text-sm">
                      {attachments.invoices.length > 0 ? `${attachments.invoices.length} file(s) selected` : 'No file chosen'}
                    </span>
                  </div>
                  <Button type="button" onClick={() => document.getElementById('invoices-upload')?.click()} className="!bg-[#f6f4ee] !text-[#C72030] !border-none text-sm flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-1" />
                    Upload Files
                  </Button>
                </div>

                {/* New Files */}
                {attachments.invoices.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {attachments.invoices.map((file, index) => {
                      const isImage = file.type.startsWith('image/');
                      const isPdf = file.type === 'application/pdf';
                      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                      const fileURL = URL.createObjectURL(file);

                      return (
                        <div key={`${file.name}-${file.lastModified}`} className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm">
                          {isImage ? (
                            <img src={fileURL} alt={file.name} className="w-[40px] h-[40px] object-cover rounded border mb-1" />
                          ) : isPdf ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                              <FileText className="w-4 h-4" />
                            </div>
                          ) : isExcel ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                              <FileSpreadsheet className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-500 bg-white mb-1">
                              <File className="w-4 h-4" />
                            </div>
                          )}
                          <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                          <Button type="button" variant="ghost" size="sm" className="absolute top-1 right-1 h-4 w-4 p-0 text-gray-600" onClick={() => removeFile('invoices', index)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Existing Files */}
                {existingFiles.invoices.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {existingFiles.invoices.map((file) => {
                      const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.document_name);
                      const isPdf = file.document_name.endsWith('.pdf');
                      const isExcel = file.document_name.endsWith('.xlsx') || file.document_name.endsWith('.xls') || file.document_name.endsWith('.csv');

                      return (
                        <div key={`${file.document_name}-${file.attachment_id}`} className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm">
                          {isImage ? (
                            <img src={file.document_url} alt={file.document_name} className="w-[40px] h-[40px] object-cover rounded border mb-1" />
                          ) : isPdf ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                              <FileText className="w-4 h-4" />
                            </div>
                          ) : isExcel ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                              <FileSpreadsheet className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-500 bg-white mb-1">
                              <File className="w-4 h-4" />
                            </div>
                          )}
                          <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.document_name}</span>
                          <Button type="button" variant="ghost" size="sm" className="absolute top-1 right-1 h-4 w-4 p-0 text-[#C72030]" onClick={() => window.open(file.document_url, '_blank')}>
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </CardContent>


        </Card>

        <div className="flex gap-4 justify-center">
          <Button
            type="button"
            onClick={() => handleSubmit('updated with details')}
            disabled={updateLoading}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            {updateLoading ? 'Updating...' : 'Update'}
          </Button>
          <Button
            onClick={() => navigate(`/maintenance/amc/details/${id}`)}
            disabled={updateLoading}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            {updateLoading ? 'Cancel' : 'Cancel'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditAMCPage;