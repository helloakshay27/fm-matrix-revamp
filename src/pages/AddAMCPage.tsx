import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus, FileSpreadsheet, FileText, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';
import { ResponsiveDatePicker } from '@/components/ui/responsive-date-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAssetsData } from '@/store/slices/assetsSlice';
import { fetchSuppliersData } from '@/store/slices/suppliersSlice';
import { fetchServicesData } from '@/store/slices/servicesSlice';
import { createAMC, resetAmcCreate } from '@/store/slices/amcCreateSlice';
import { apiClient } from '@/utils/apiClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchInventoryAssets } from '@/store/slices/inventoryAssetsSlice';
import { Autocomplete, Checkbox, CircularProgress } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


export const AddAMCPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const inventoryAssetsState = useSelector((state: RootState) => state.inventoryAssets);
  const { data: assetsData, loading: assetsLoading } = useAppSelector(state => state.assets);
  const { data: suppliersData, loading: suppliersLoading } = useAppSelector(state => state.suppliers);
  const { data: servicesData, loading: servicesLoading } = useAppSelector(state => state.services);
  const { loading: amcCreateLoading, success: amcCreateSuccess, error: amcCreateError } = useAppSelector(state => state.amcCreate);

  // Form state
  const [formData, setFormData] = useState({
    details: 'Asset',
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

  // Error state for validation
  const [errors, setErrors] = useState({
    asset_ids: '',
    vendor: '',
    group: '',
    supplier: '',
    service: '',
    startDate: '',
    endDate: '',
    cost: '',
    paymentTerms: '',
    firstService: '',
    noOfVisits: ''
  });

  const [attachments, setAttachments] = useState({
    contracts: [] as File[],
    invoices: [] as File[]
  });

  const [assetGroups, setAssetGroups] = useState<Array<{ id: number, name: string, sub_groups: Array<{ id: number, name: string }> }>>([]);
  const [subGroups, setSubGroups] = useState<Array<{ id: number, name: string }>>([]);
  const { assets, loading: AssetsLoading } = inventoryAssetsState as unknown as { assets: Array<{ id: number; name: string }> | null, loading: boolean };
  const [loading, setLoading] = useState(false);

  // Extract data from Redux state
  const suppliers = Array.isArray((suppliersData as any)?.suppliers) ? (suppliersData as any).suppliers : Array.isArray(suppliersData) ? suppliersData : [];
  const services = Array.isArray(servicesData) ? servicesData : [];
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      // Clear the assetName when switching between Asset and Service
      if (field === 'details' && prev.details !== value) {
        return {
          ...prev,
          [field]: value,
          assetName: '',
          asset_ids: [],
          vendor: '',
          group: '',
          subgroup: '',
          service: '',
          supplier: ''
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
          supplier: '',
          asset_ids: [],
          vendor: ''
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    // Clear error for the field being updated
    setErrors(prev => ({ ...prev, [field]: '' }));
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
    dispatch(fetchInventoryAssets());
    dispatch(fetchSuppliersData());
    dispatch(fetchServicesData());

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
        toast.error("Failed to fetch asset groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssetGroups();
  }, [dispatch]);

  // Handle AMC creation success
  useEffect(() => {
    if (amcCreateSuccess) {
      toast.success("AMC has been successfully created.");
      dispatch(resetAmcCreate());
      navigate('/maintenance/amc');
    }
  }, [amcCreateSuccess, dispatch, navigate]);

  // Handle AMC creation error
  useEffect(() => {
    if (amcCreateError) {
      toast.error(amcCreateError);
      dispatch(resetAmcCreate());
    }
  }, [amcCreateError, dispatch]);

  // Update sub-groups when group changes
  const handleGroupChange = async (groupId: string) => {
    handleInputChange('group', groupId);
    handleInputChange('subgroup', '');

    if (groupId) {
      setLoading(true);
      try {
        const response = await apiClient.get(`/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`);
        if (Array.isArray(response.data)) {
          setSubGroups(response.data);
        } else if (response.data && Array.isArray(response.data.asset_groups)) {
          setSubGroups(response.data.asset_groups);
        } else if (response.data && Array.isArray(response.data.sub_groups)) {
          setSubGroups(response.data.sub_groups);
        } else if (response.data && Array.isArray(response.data.asset_sub_groups)) {
          setSubGroups(response.data.asset_sub_groups);
        } else {
          setSubGroups([]);
        }
      } catch (error) {
        console.error('Error fetching subgroups:', error);
        setSubGroups([]);
        toast.error("Failed to fetch subgroups.");
      } finally {
        setLoading(false);
      }
    } else {
      setSubGroups([]);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      asset_ids: '',
      vendor: '',
      group: '',
      supplier: '',
      service: '',
      startDate: '',
      endDate: '',
      cost: '',
      paymentTerms: '',
      firstService: '',
      noOfVisits: ''
    };

    if (formData.details === 'Asset' && formData.type === 'Individual') {
      if (formData.asset_ids.length === 0) {
        newErrors.asset_ids = 'Please select at least one asset.';
        isValid = false;
      }
      if (!formData.vendor) {
        newErrors.vendor = 'Please select a supplier.';
        isValid = false;
      }
    } else if (formData.details === 'Service' && formData.type === 'Individual') {
      if (!formData.assetName) {
        newErrors.service = 'Please select a service.';
        isValid = false;
      }
      if (!formData.vendor) {
        newErrors.vendor = 'Please select a supplier.';
        isValid = false;
      }
    } else if (formData.type === 'Group') {
      if (!formData.group) {
        newErrors.group = 'Please select a group.';
        isValid = false;
      }
      if (!formData.supplier) {
        newErrors.supplier = 'Please select a supplier.';
        isValid = false;
      }
      if (formData.details === 'Service' && !formData.service) {
        newErrors.service = 'Please select a service.';
        isValid = false;
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Please select a start date.';
      isValid = false;
    }
    if (!formData.endDate) {
      newErrors.endDate = 'Please select an end date.';
      isValid = false;
    }
    if (!formData.firstService) {
      newErrors.firstService = 'Please select a first service date.';
      isValid = false;
    }
    if (!formData.cost) {
      newErrors.cost = 'Please enter the cost.';
      isValid = false;
    }
    if (!formData.paymentTerms) {
      newErrors.paymentTerms = 'Please select payment terms.';
      isValid = false;
    }
    if (!formData.noOfVisits) {
      newErrors.noOfVisits = 'Please enter the number of visits.';
      isValid = false;
    } else if (!Number.isInteger(Number(formData.noOfVisits))) {
      newErrors.noOfVisits = 'Please enter a whole number.';
      isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    const sendData = new FormData();
    sendData.append('pms_asset_amc[asset_id]', formData.details === 'Asset' && formData.type === 'Individual' && formData.asset_ids.length > 0 ? formData.asset_ids[0] : '');
    sendData.append('pms_asset_amc[service_id]', formData.details === 'Service' ? formData.assetName : '');
    sendData.append('pms_asset_amc[pms_site_id]', '1');
    sendData.append('pms_asset_amc[supplier_id]', formData.vendor || formData.supplier);
    sendData.append('pms_asset_amc[checklist_type]', formData.details);
    sendData.append('pms_asset_amc[amc_cost]', formData.cost);
    sendData.append('pms_asset_amc[amc_start_date]', formData.startDate);
    sendData.append('pms_asset_amc[amc_end_date]', formData.endDate);
    sendData.append('pms_asset_amc[amc_first_service]', formData.firstService);
    sendData.append('pms_asset_amc[payment_term]', formData.paymentTerms);
    sendData.append('pms_asset_amc[no_of_visits]', formData.noOfVisits);
    sendData.append('pms_asset_amc[remarks]', formData.remarks);
    sendData.append('pms_asset_amc[resource_id]', formData.details === 'Asset' ? (formData.type === 'Individual' ? JSON.stringify(formData.asset_ids) : formData.group) : '1');
    sendData.append('pms_asset_amc[resource_type]', formData.details === 'Asset' ? "Pms::Asset" : "Pms::Site");

    if (formData.type === 'Group') {
      sendData.append('group_id', formData.group);
      sendData.append('sub_group_id', formData.subgroup);
    }

    if (formData.details === 'Asset' && formData.type === 'Individual' && formData.asset_ids.length > 0) {
      formData.asset_ids.forEach(id => sendData.append('asset_ids[]', id));
    }

    attachments.contracts.forEach((file) => {
      sendData.append('amc_contracts[content][]', file);
    });

    attachments.invoices.forEach((file) => {
      sendData.append('amc_invoices[content][]', file);
    });

    // Dispatch the createAMC action and wait for the result
    const result = await dispatch(createAMC(sendData));

    if (createAMC.fulfilled.match(result)) {
      // Clear form fields after successful submission
      setFormData({
        details: 'Asset',
        type: 'Individual',
        assetName: '',
        asset_ids: [],
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
      setAttachments({
        contracts: [],
        invoices: []
      });
      setErrors({
        asset_ids: '',
        vendor: '',
        group: '',
        supplier: '',
        service: '',
        startDate: '',
        endDate: '',
        cost: '',
        paymentTerms: '',
        firstService: '',
        noOfVisits: ''
      });
      toast.success("AMC has been successfully created and scheduled.");
    }
  };

  const handleSaveAndSchedule = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    const sendData = new FormData();
    sendData.append('pms_asset_amc[asset_id]', formData.details === 'Asset' && formData.type === 'Individual' && formData.asset_ids.length > 0 ? formData.asset_ids[0] : '');
    sendData.append('pms_asset_amc[service_id]', formData.details === 'Service' ? formData.assetName : '');
    sendData.append('pms_asset_amc[pms_site_id]', '1');
    sendData.append('pms_asset_amc[supplier_id]', formData.vendor || formData.supplier);
    sendData.append('pms_asset_amc[checklist_type]', formData.details);
    sendData.append('pms_asset_amc[amc_cost]', formData.cost);
    sendData.append('pms_asset_amc[amc_start_date]', formData.startDate);
    sendData.append('pms_asset_amc[amc_end_date]', formData.endDate);
    sendData.append('pms_asset_amc[amc_first_service]', formData.firstService);
    sendData.append('pms_asset_amc[payment_term]', formData.paymentTerms);
    sendData.append('pms_asset_amc[no_of_visits]', formData.noOfVisits);
    sendData.append('pms_asset_amc[remarks]', formData.remarks);
    sendData.append('pms_asset_amc[resource_id]', formData.details === 'Asset' ? (formData.type === 'Individual' ? JSON.stringify(formData.asset_ids) : formData.group) : '1');
    sendData.append('pms_asset_amc[resource_type]', formData.details === 'Asset' ? "Pms::Asset" : "Pms::Site");
    sendData.append('pms_asset_amc[schedule_immediately]', 'true');

    if (formData.type === 'Group') {
      sendData.append('group_id', formData.group);
      sendData.append('sub_group_id', formData.subgroup);
    }

    if (formData.details === 'Asset' && formData.type === 'Individual' && formData.asset_ids.length > 0) {
      formData.asset_ids.forEach(id => sendData.append('asset_ids[]', id));
    }

    attachments.contracts.forEach((file) => {
      sendData.append('amc_contracts[content][]', file);
    });

    attachments.invoices.forEach((file) => {
      sendData.append('amc_invoices[content][]', file);
    });

    // Dispatch the createAMC action and wait for the result
    const result = await dispatch(createAMC(sendData));

    if (createAMC.fulfilled.match(result)) {
      const amcId = result.payload?.id; // Assuming the API returns the created AMC ID
      if (amcId) {
        navigate(`/maintenance/amc/details/${amcId}`); // Redirect to the details page
      } else {
        toast.error("AMC created, but no ID returned for redirection.");
      }
    }
  };




  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validateForm()) {
  //     toast.error("Please fill all required fields.");
  //     return;
  //   }

  //   const sendData = new FormData();
  //   sendData.append('pms_asset_amc[asset_id]', formData.details === 'Asset' && formData.type === 'Individual' && formData.asset_ids.length > 0 ? formData.asset_ids[0] : '');
  //   sendData.append('pms_asset_amc[service_id]', formData.details === 'Service' ? formData.assetName : '');
  //   sendData.append('pms_asset_amc[pms_site_id]', '1');
  //   sendData.append('pms_asset_amc[supplier_id]', formData.vendor || formData.supplier);
  //   sendData.append('pms_asset_amc[checklist_type]', formData.details);
  //   sendData.append('pms_asset_amc[amc_cost]', formData.cost);
  //   sendData.append('pms_asset_amc[amc_start_date]', formData.startDate);
  //   sendData.append('pms_asset_amc[amc_end_date]', formData.endDate);
  //   sendData.append('pms_asset_amc[amc_first_service]', formData.firstService);
  //   sendData.append('pms_asset_amc[payment_term]', formData.paymentTerms);
  //   sendData.append('pms_asset_amc[no_of_visits]', formData.noOfVisits);
  //   sendData.append('pms_asset_amc[remarks]', formData.remarks);
  //   sendData.append('pms_asset_amc[resource_id]', formData.details === 'Asset' ? (formData.type === 'Individual' ? JSON.stringify(formData.asset_ids) : formData.group) : '1');
  //   sendData.append('pms_asset_amc[resource_type]', formData.details === 'Asset' ? "Pms::Asset" : "Pms::Site");

  //   if (formData.type === 'Group') {
  //     sendData.append('group_id', formData.group);
  //     sendData.append('sub_group_id', formData.subgroup);
  //   }

  //   if (formData.details === 'Asset' && formData.type === 'Individual' && formData.asset_ids.length > 0) {
  //     formData.asset_ids.forEach(id => sendData.append('asset_ids[]', id));
  //   }

  //   attachments.contracts.forEach((file) => {
  //     sendData.append('amc_contracts[content][]', file);
  //   });

  //   attachments.invoices.forEach((file) => {
  //     sendData.append('amc_invoices[content][]', file);
  //   });

  //   dispatch(createAMC(sendData));
  // };

  // const handleSaveAndSchedule = async () => {
  //   if (!validateForm()) {
  //     toast.error("Please fill all required fields.");
  //     return;
  //   }

  //   const sendData = new FormData();
  //   sendData.append('pms_asset_amc[asset_id]', formData.details === 'Asset' && formData.type === 'Individual' && formData.asset_ids.length > 0 ? formData.asset_ids[0] : '');
  //   sendData.append('pms_asset_amc[service_id]', formData.details === 'Service' ? formData.assetName : '');
  //   sendData.append('pms_asset_amc[pms_site_id]', '1');
  //   sendData.append('pms_asset_amc[supplier_id]', formData.vendor || formData.supplier);
  //   sendData.append('pms_asset_amc[checklist_type]', formData.details);
  //   sendData.append('pms_asset_amc[amc_cost]', formData.cost);
  //   sendData.append('pms_asset_amc[amc_start_date]', formData.startDate);
  //   sendData.append('pms_asset_amc[amc_end_date]', formData.endDate);
  //   sendData.append('pms_asset_amc[amc_first_service]', formData.firstService);
  //   sendData.append('pms_asset_amc[payment_term]', formData.paymentTerms);
  //   sendData.append('pms_asset_amc[no_of_visits]', formData.noOfVisits);
  //   sendData.append('pms_asset_amc[remarks]', formData.remarks);
  //   sendData.append('pms_asset_amc[resource_id]', formData.details === 'Asset' ? (formData.type === 'Individual' ? JSON.stringify(formData.asset_ids) : formData.group) : '1');
  //   sendData.append('pms_asset_amc[resource_type]', formData.details === 'Asset' ? "Pms::Asset" : "Pms::Site");
  //   sendData.append('pms_asset_amc[schedule_immediately]', 'true');

  //   if (formData.type === 'Group') {
  //     sendData.append('group_id', formData.group);
  //     sendData.append('sub_group_id', formData.subgroup);
  //   }

  //   if (formData.details === 'Asset' && formData.type === 'Individual' && formData.asset_ids.length > 0) {
  //     formData.asset_ids.forEach(id => sendData.append('asset_ids[]', id));
  //   }

  //   attachments.contracts.forEach((file) => {
  //     sendData.append('amc_contracts[content][]', file);
  //   });

  //   attachments.invoices.forEach((file) => {
  //     sendData.append('amc_invoices[content][]', file);
  //   });

  //   dispatch(createAMC(sendData));
  // };

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/maintenance/amc')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC List
        </Button>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">NEW AMC</h1>
      </div>

      <form onSubmit={handleSubmit}>
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

            {formData.type === 'Individual' ? (
              <>
                {formData.details === 'Asset' ? (
                  <Autocomplete
                    multiple
                    size="small"
                    disableCloseOnSelect
                    options={assets || []}
                    loading={AssetsLoading}
                    getOptionLabel={(option) => option.name}
                    value={assets?.filter(asset => formData.asset_ids.includes(asset.id.toString())) || []}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        asset_ids: newValue.map(asset => asset.id.toString())
                      }));
                      setErrors(prev => ({ ...prev, asset_ids: '' }));
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Assets"
                        placeholder="Search Assets..."
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.asset_ids}
                        helperText={errors.asset_ids}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 'auto',
                            minHeight: '45px',
                            alignItems: 'flex-start',
                            paddingTop: '4px',
                            paddingBottom: '4px',
                          },
                          '& .MuiInputBase-root': {
                            flexWrap: 'wrap',
                            maxHeight: '100px',
                            overflowY: 'auto',
                          },
                          '& .MuiChip-root': {
                            margin: '2px',
                          },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {AssetsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    disabled={loading || AssetsLoading || amcCreateLoading}
                  />
                ) : (
                  <FormControl fullWidth variant="outlined" error={!!errors.service}>
                    <InputLabel id="service-select-label" shrink>Service</InputLabel>
                    <MuiSelect
                      labelId="service-select-label"
                      label="Service"
                      displayEmpty
                      value={formData.assetName}
                      onChange={e => handleInputChange('assetName', e.target.value)}
                      sx={fieldStyles}
                      disabled={loading || servicesLoading || amcCreateLoading}
                    >
                      <MenuItem value=""><em>Select a Service...</em></MenuItem>
                      {Array.isArray(services) && services.map((service) => (
                        <MenuItem key={service.id} value={service.id.toString()}>
                          {service.service_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                    {errors.service && <FormHelperText>{errors.service}</FormHelperText>}
                  </FormControl>
                )}

                <div>
                  <FormControl fullWidth variant="outlined" error={!!errors.vendor}>
                    <InputLabel id="vendor-select-label" shrink>Supplier</InputLabel>
                    <MuiSelect
                      labelId="vendor-select-label"
                      label="Supplier"
                      displayEmpty
                      value={formData.vendor}
                      onChange={e => handleInputChange('vendor', e.target.value)}
                      sx={fieldStyles}
                      disabled={loading || suppliersLoading || amcCreateLoading}
                    >
                      <MenuItem value=""><em>Select Supplier</em></MenuItem>
                      {Array.isArray(suppliers) && suppliers.map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.company_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                    {errors.vendor && <FormHelperText>{errors.vendor}</FormHelperText>}
                  </FormControl>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormControl fullWidth variant="outlined" error={!!errors.group}>
                      <InputLabel id="group-select-label" shrink>Group</InputLabel>
                      <MuiSelect
                        labelId="group-select-label"
                        label="Group"
                        displayEmpty
                        value={formData.group}
                        onChange={e => handleGroupChange(e.target.value)}
                        sx={fieldStyles}
                        disabled={loading || amcCreateLoading}
                      >
                        <MenuItem value=""><em>Select Group</em></MenuItem>
                        {Array.isArray(assetGroups) && assetGroups.map((group) => (
                          <MenuItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                      {errors.group && <FormHelperText>{errors.group}</FormHelperText>}
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
                        disabled={!formData.group || loading || amcCreateLoading}
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
                      <FormControl fullWidth variant="outlined" error={!!errors.service}>
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
                        {errors.service && <FormHelperText>{errors.service}</FormHelperText>}
                      </FormControl>
                    </div>
                  )}

                  <div>
                    <FormControl fullWidth variant="outlined" error={!!errors.supplier}>
                      <InputLabel id="group-supplier-select-label" shrink>Supplier</InputLabel>
                      <MuiSelect
                        labelId="group-supplier-select-label"
                        label="Supplier"
                        displayEmpty
                        value={formData.supplier}
                        onChange={e => handleInputChange('supplier', e.target.value)}
                        sx={fieldStyles}
                        disabled={loading || suppliersLoading || amcCreateLoading}
                      >
                        <MenuItem value=""><em>Select Supplier</em></MenuItem>
                        {Array.isArray(suppliers) && suppliers.map((supplier) => (
                          <MenuItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.company_name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                      {errors.supplier && <FormHelperText>{errors.supplier}</FormHelperText>}
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
                  error={!!errors.cost}
                  helperText={errors.cost}
                />
              </div>

              <div>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  sx={{
                    height: '45px',
                    '& .MuiInputBase-root': {
                      height: '45px',
                    },
                  }}
                />
              </div>

              <div>
                <TextField
                  fullWidth
                  label="First Service Date"
                  type="date"
                  value={formData.firstService || ''}
                  onChange={(e) => handleInputChange('firstService', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.firstService}
                  helperText={errors.firstService}
                  sx={{
                    height: '45px',
                    '& .MuiInputBase-root': {
                      height: '45px',
                    },
                  }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined" error={!!errors.paymentTerms}>
                  <InputLabel id="payment-terms-select-label" shrink>Payment Terms</InputLabel>
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
                  {errors.paymentTerms && <FormHelperText>{errors.paymentTerms}</FormHelperText>}
                </FormControl>
              </div>

              <div>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  inputProps={{
                    min: formData.startDate || undefined, // enforce minDate
                  }}
                  sx={{
                    height: '45px',
                    '& .MuiInputBase-root': {
                      height: '45px',
                    },
                  }}
                />
              </div>

              <div>
                <TextField
                  label="No. of Visits"
                  placeholder="Enter No. of Visit"
                  name="noOfVisits"
                  type="number"
                  value={formData.noOfVisits}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange('noOfVisits', value);
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  error={!!errors.noOfVisits}
                  helperText={errors.noOfVisits}
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
                  inputProps={{ maxLength: 250 }}
                  slotProps={{ inputLabel: { shrink: true } }}
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
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.remarks.length}/250
                </div>
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
              <div>
                <label className="block text-sm font-medium mb-2">AMC Contracts</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white flex flex-col items-center justify-center">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="contracts-upload"
                    onChange={e => handleFileUpload('contracts', e.target.files)}
                  />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span
                      className="text-[#C72030] font-medium cursor-pointer"
                      style={{ fontSize: '14px' }}
                      onClick={() => document.getElementById('contracts-upload')?.click()}
                    >
                      Choose File
                    </span>
                    <span className="text-gray-500" style={{ fontSize: '14px' }}>
                      {attachments.contracts.length > 0 ? `${attachments.contracts.length} file(s) selected` : 'No file chosen'}
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('contracts-upload')?.click()}
                    className="!bg-[#f6f4ee] !text-[#C72030] !border-none text-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Upload Files
                  </Button>
                </div>

                {attachments.contracts.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {attachments.contracts.map((file, index) => {
                      const isImage = file.type.startsWith('image/');
                      const isPdf = file.type === 'application/pdf';
                      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                      const fileURL = URL.createObjectURL(file);

                      return (
                        <div
                          key={`${file.name}-${file.lastModified}`}
                          className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
                        >
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
                            <div className="w-[40px] h-[40px] flex items-center justify-center bg-gray-100 border rounded text-gray-500 mb-1">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                          <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 h-4 w-4 p-0 text-gray-600"
                            onClick={() => removeFile('contracts', index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">AMC Invoice</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center bg-white">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="invoices-upload"
                    onChange={e => handleFileUpload('invoices', e.target.files)}
                  />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span
                      className="text-[#C72030] font-medium cursor-pointer"
                      style={{ fontSize: '14px' }}
                      onClick={() => document.getElementById('invoices-upload')?.click()}
                    >
                      Choose File
                    </span>
                    <span className="text-gray-500" style={{ fontSize: '14px' }}>
                      {attachments.invoices.length > 0 ? `${attachments.invoices.length} file(s) selected` : 'No file chosen'}
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('invoices-upload')?.click()}
                    className="!bg-[#f6f4ee] !text-[#C72030] !border-none hover:!bg-[#f6f4ee]/90 text-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Upload Files
                  </Button>
                </div>
                {attachments.invoices.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {attachments.invoices.map((file, index) => {
                      const isImage = file.type.startsWith("image/");
                      const isPdf = file.type === "application/pdf";
                      const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.name.endsWith(".csv");
                      const fileURL = URL.createObjectURL(file);

                      return (
                        <div
                          key={`${file.name}-${file.lastModified}`}
                          className="flex relative flex-col items-center border rounded pt-6 p-3 w-[120px] bg-[#F9F8F4] shadow-sm"
                        >
                          {isImage ? (
                            <img src={fileURL} alt={file.name} className="w-10 h-10 object-cover rounded border mb-1" />
                          ) : isPdf ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                              <FileText className="w-4 h-4" />
                            </div>
                          ) : isExcel ? (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                              <FileSpreadsheet className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-600 bg-white mb-1">
                              <File className="w-4 h-4" />
                            </div>
                          )}
                          <span className="text-[10px] text-center truncate max-w-[90px] mb-1">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 h-4 w-4 p-0 text-gray-500"
                            onClick={() => removeFile("invoices", index)}
                          >
                            <X className="w-3 h-3" />
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
            onClick={handleSaveAndSchedule}
            disabled={amcCreateLoading}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            {amcCreateLoading ? 'Saving...' : 'Save & Show Details'}
          </Button>
          <Button
            type="submit"
            disabled={amcCreateLoading}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            {amcCreateLoading ? 'Saving...' : 'Save & Schedule AMC'}
          </Button>
        </div>
      </form>
    </div>
  );
};