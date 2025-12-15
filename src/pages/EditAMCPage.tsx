import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus, FileText, FileSpreadsheet, File, Eye, Download, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText, Box, Avatar } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAssetsData } from '@/store/slices/assetsSlice';
import { fetchServicesData } from '@/store/slices/servicesSlice';
import { fetchAMCDetails } from '@/store/slices/amcDetailsSlice';
import { apiClient } from '@/utils/apiClient';
import { debounce } from 'lodash';
import { TimeSetupStep } from '@/components/schedule/TimeSetupStep';

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
  // Suppliers will be fetched directly (no Redux slice)
  const { data: servicesData, loading: servicesLoading } = useAppSelector(state => state.services);
  const { data: amcData, loading: amcLoading, error: amcError } = useAppSelector(state => state.amcDetails);

  // Form state
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
    contractName: '', // Added new field
    paymentTerms: '',
    firstService: '',
    noOfVisits: '',
    remarks: '',
    technician: ''
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
    contractName: '', // Added new error field
    paymentTerms: '',
    firstService: '',
    noOfVisits: ''
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
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceNames, setSelectedServiceNames] = useState<string[]>([]);
  const [technicianOptions, setTechnicianOptions] = useState<any[]>([]);
  const [techniciansLoading, setTechniciansLoading] = useState(false);
  const [visitLogs, setVisitLogs] = useState<any[]>([]);

  // Step management state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const totalSteps = 4;

  // Time setup state
  const initialTimeSetupState = {
    hourMode: 'specific',
    minuteMode: 'specific',
    dayMode: 'weekdays',
    monthMode: 'all',
    selectedHours: ['12'],
    selectedMinutes: ['00'],
    selectedWeekdays: [] as string[],
    selectedDays: [] as string[],
    selectedMonths: [] as string[],
    betweenMinuteStart: '00',
    betweenMinuteEnd: '59',
    betweenMonthStart: 'January',
    betweenMonthEnd: 'December'
  };
  const [timeSetupData, setTimeSetupData] = useState(initialTimeSetupState);

  // Extract data from Redux state
  // const assets = Array.isArray((assetsData as any)?.assets) ? (assetsData as any).assets : Array.isArray(assetsData) ? assetsData : [];
  const [assetList, setAssetList] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const fetchAsset = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem("token"); // Get token from localStorage

    try {
      const response = await fetch(`https://${baseUrl}/pms/assets/get_assets.json`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure token is a Bearer token if needed
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAssetList(data)
      console.log('SAC data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching SAC:', error);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, []);

  // Parse cron expression to time setup data
  const parseCronToTimeSetup = (cronExpression?: string | null) => {
    if (!cronExpression || typeof cronExpression !== 'string') {
      return initialTimeSetupState;
    }

    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length < 5) {
      return initialTimeSetupState;
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    const timeSetup = { ...initialTimeSetupState };

    // Parse minutes
    if (minute === '*') {
      timeSetup.minuteMode = 'all';
      timeSetup.selectedMinutes = ['00'];
    } else if (minute.includes('-')) {
      const [start, end] = minute.split('-');
      timeSetup.minuteMode = 'between';
      timeSetup.betweenMinuteStart = start.padStart(2, '0');
      timeSetup.betweenMinuteEnd = end.padStart(2, '0');
    } else {
      timeSetup.minuteMode = 'specific';
      timeSetup.selectedMinutes = minute.split(',').map(m => m.padStart(2, '0'));
    }

    // Parse hours
    if (hour === '*') {
      timeSetup.hourMode = 'all';
      timeSetup.selectedHours = ['12'];
    } else {
      timeSetup.hourMode = 'specific';
      timeSetup.selectedHours = hour.split(',').map(h => h.padStart(2, '0'));
    }

    // Parse days
    const weekdayMap: Record<string, string> = {
      '1': 'Sunday', '2': 'Monday', '3': 'Tuesday', '4': 'Wednesday',
      '5': 'Thursday', '6': 'Friday', '7': 'Saturday'
    };

    if (dayOfWeek !== '?' && dayOfWeek !== '*') {
      timeSetup.dayMode = 'weekdays';
      timeSetup.selectedWeekdays = dayOfWeek.split(',').map(code => weekdayMap[code] || '').filter(Boolean);
      timeSetup.selectedDays = [];
    } else if (dayOfMonth !== '?' && dayOfMonth !== '*') {
      timeSetup.dayMode = 'specific';
      timeSetup.selectedDays = dayOfMonth.split(',').map(d => d);
      timeSetup.selectedWeekdays = [];
    } else {
      timeSetup.dayMode = 'all';
    }

    // Parse months
    const monthMap: Record<string, string> = {
      '1': 'January', '2': 'February', '3': 'March', '4': 'April',
      '5': 'May', '6': 'June', '7': 'July', '8': 'August',
      '9': 'September', '10': 'October', '11': 'November', '12': 'December'
    };

    if (month === '*') {
      timeSetup.monthMode = 'all';
      timeSetup.selectedMonths = [];
    } else if (month.includes('-')) {
      const [startRaw, endRaw] = month.split('-');
      timeSetup.monthMode = 'between';
      timeSetup.betweenMonthStart = monthMap[startRaw] || 'January';
      timeSetup.betweenMonthEnd = monthMap[endRaw] || 'December';
    } else {
      timeSetup.monthMode = 'specific';
      timeSetup.selectedMonths = month.split(',').map(m => monthMap[m] || '').filter(Boolean);
    }

    return timeSetup;
  };

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
      const resourceDetailType = data.resource_type === 'Pms::Service' ? 'Service' : 'Asset';
      const amcType = data.amc_type === 'Service'
        ? 'Service'
        : data.amc_type === 'Asset'
          ? 'Asset'
          : resourceDetailType;
      const isGroupType = data.amc_details_type === 'group';

      let assetIds: string[] = [];
      if (Array.isArray(data.amc_assets)) {
        assetIds = data.amc_assets
          .map((item: any) => item.asset_id?.toString())
          .filter(Boolean);
      }

      const supplierId = data.supplier_id?.toString();
      const foundSupplier = suppliers.find(
        (supplier) => supplier.id.toString() === supplierId
      );

      // Extract service info from amc_services if available
      let serviceIdToUse = data.service_id?.toString();
      let serviceNameFromApi = '';

      if (Array.isArray(data.amc_services) && data.amc_services.length > 0) {
        // For Individual type, use the first service from amc_services
        const firstService = data.amc_services[0];
        serviceIdToUse = firstService.service_id?.toString() || serviceIdToUse;
        serviceNameFromApi = firstService.service_name || '';
      }

      const foundService = services.find(
        (service) => service.id.toString() === serviceIdToUse
      );

      // Extract visit logs if available
      if (Array.isArray(data.amc_visit_logs)) {
        setVisitLogs(data.amc_visit_logs);
      }

      // Determine technician ID: prioritize visit logs first, then amc_technicians
      let technicianId = '';
      if (Array.isArray(data.amc_visit_logs) && data.amc_visit_logs.length > 0 && data.amc_visit_logs[0].technician) {
        technicianId = data.amc_visit_logs[0].technician.id?.toString();
      } else if (Array.isArray(data.amc_technicians) && data.amc_technicians.length > 0) {
        technicianId = data.amc_technicians[0].id?.toString();
      }

      setFormData({
        details: amcType,
        type: isGroupType ? 'Group' : 'Individual',
        assetName: foundService || serviceIdToUse
          ? serviceIdToUse
          : data.resource_id === 'Pms::Service'
            ? data.resource_id
            : '',
        asset_ids: assetIds,
        vendor: foundSupplier ? supplierId : '',
        group: data.group_id ? data.group_id.toString() : formData.group,
        subgroup: data.sub_group_id ? data.sub_group_id.toString() : formData.subgroup,
        service: foundService || serviceIdToUse
          ? serviceIdToUse
          : data.service_id?.toString() || formData.service,
        supplier: foundSupplier ? supplierId : '',
        startDate: data.amc_start_date || '',
        endDate: data.amc_end_date || '',
        cost: data.amc_cost?.toString() || '',
        contractName: data.contract_name || '',
        paymentTerms: data.payment_term || '',
        firstService: data.amc_first_service || '',
        noOfVisits: data.no_of_visits?.toString() || '',
        remarks: data.remarks || '',
        technician: technicianId
      });

      // Extract service names from amc_services for Group type display
      if (Array.isArray(data.amc_services) && data.amc_services.length > 0) {
        const serviceNames = data.amc_services.map((service: any) => service.service_name).filter(Boolean);
        setSelectedServiceNames(serviceNames);
      } else {
        setSelectedServiceNames([]);
      }

      // Extract and flatten contract/invoice documents for preview
      const contracts = Array.isArray(data.amc_contracts)
        ? data.amc_contracts.flatMap((c: any) => Array.isArray(c.documents) ? c.documents : [])
        : [];
      const invoices = Array.isArray(data.amc_invoices)
        ? data.amc_invoices.flatMap((c: any) => Array.isArray(c.documents) ? c.documents : [])
        : [];
      setExistingFiles({ contracts, invoices });

      // Parse and set time setup data from cron expression
      if (data.time_expression || data.cron_expression) {
        const parsedTimeSetup = parseCronToTimeSetup(data.time_expression || data.cron_expression);
        setTimeSetupData(parsedTimeSetup);
      }

      // Mark all steps as completed since we're editing existing data
      setCompletedSteps([0, 1, 2, 3]);

      if (data.group_id) {
        // Always load subgroups if group_id is present, for both Individual and Group types
        handleGroupChange(data.group_id.toString(), data.sub_group_id ? data.sub_group_id.toString() : undefined);
      }
    }
  }, [amcData, assetList, suppliers, services]);


  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} to ${value}`);
    setFormData(prev => {
      if (field === 'details' && prev.details !== value) {
        return {
          ...prev,
          [field]: value,
          assetName: '',
          asset_ids: []
        };
      }
      // Do NOT clear group, subgroup, service, or supplier when switching type
      if (field === 'type' && prev.type !== value) {
        return {
          ...prev,
          [field]: value
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
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

  // Fetch data using Redux slices (assets/services) & direct suppliers
  useEffect(() => {
    dispatch(fetchAssetsData({ page: 1 }));
    // Direct suppliers load
    const loadSuppliers = async () => {
      try {
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) {
          console.warn('Missing baseUrl or token for suppliers fetch');
          return;
        }
        // Remove protocol if user stored full URL
        baseUrl = baseUrl.replace(/^https?:\/\//i, '');
        setSuppliersLoading(true);
        const endpoint = `https://${baseUrl}/pms/suppliers/get_suppliers.json`;
        const resp = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        console.debug('Suppliers fetch status', resp.status, 'url', endpoint);
        if (!resp.ok) {
          console.warn('Suppliers response not ok');
          setSuppliers([]);
          return;
        }
        const data = await resp.json();
        console.debug('Suppliers raw payload', data);
        const arr = Array.isArray(data)
          ? data
          : (Array.isArray(data?.pms_suppliers)
            ? data.pms_suppliers
            : (Array.isArray(data?.suppliers) ? data.suppliers : (Array.isArray(data?.data) ? data.data : [])));
        setSuppliers(arr);
        if (!arr.length) {
          toast({ title: 'No suppliers', description: 'Supplier list empty from API.', variant: 'destructive' });
        }
      } catch (e) {
        console.error('Suppliers load error', e);
        setSuppliers([]);
        toast({ title: 'Error', description: 'Failed to load suppliers.', variant: 'destructive' });
      } finally {
        setSuppliersLoading(false);
      }
    };
    loadSuppliers();

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
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
        toast({
          title: "Error",
          description: "Failed to fetch services.",
          variant: "destructive",
        });
      }
    };

    fetchService();
    fetchAssetGroups();

    // Fetch technicians
    const fetchTechnicians = async () => {
      setTechniciansLoading(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const response = await fetch(
          `https://${baseUrl}/pms/users/get_escalate_to_users.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTechnicianOptions(data.users || []);
        }
      } catch (error) {
        console.error('Error fetching technicians:', error);
        setTechnicianOptions([]);
      } finally {
        setTechniciansLoading(false);
      }
    };
    fetchTechnicians();
  }, [dispatch, toast]);

  // Accept optional subgroupId to select after loading subgroups
  const handleGroupChange = async (groupId: string, subgroupId?: string) => {
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

        // Select the intended subgroup if provided and present
        const intendedSubgroup = subgroupId || formData.subgroup;
        if (intendedSubgroup && subgroups.some(sub => sub.id.toString() === intendedSubgroup)) {
          handleInputChange('subgroup', intendedSubgroup);
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

  // Step validation functions
  const validateStep = (step: number) => {
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
      contractName: '',
      paymentTerms: '',
      firstService: '',
      noOfVisits: ''
    };

    if (step === 0) {
      // AMC Configuration validation
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
      }
    } else if (step === 1) {
      // AMC Details validation
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
      if (!formData.contractName) {
        newErrors.contractName = 'Please enter the contract name.';
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
    }
    // Steps 2 and 3 (Schedule and Attachments) are optional for validation

    setErrors(newErrors);
    return isValid;
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
      contractName: '',
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
    if (!formData.contractName) {
      newErrors.contractName = 'Please enter the contract name.';
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
  const handleSubmit = useCallback(async (action: string) => {
    if (!id) return;

    if (assetsLoading || suppliersLoading || servicesLoading || loading) {
      toast({
        title: 'Error',
        description: 'Please wait for all data to load.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields correctly.',
        variant: 'destructive',
      });
      return;
    }

    setUpdateLoading(true);

    try {
      const sendData = new FormData();

      // Append common form data
      // Use the correct supplier field: 'vendor' is used for Individual type forms, 'supplier' for Group type
      const supplierIdForSubmit = formData.type === 'Group' ? formData.supplier : formData.vendor;
      sendData.append('pms_asset_amc[supplier_id]', supplierIdForSubmit);
      sendData.append('pms_asset_amc[amc_cost]', parseFloat(formData.cost).toString());
      sendData.append('pms_asset_amc[contract_name]', formData.contractName);
      sendData.append('pms_asset_amc[amc_start_date]', formData.startDate);
      sendData.append('pms_asset_amc[amc_end_date]', formData.endDate);
      sendData.append('pms_asset_amc[amc_first_service]', formData.firstService);
      sendData.append('pms_asset_amc[amc_frequency]', formData.paymentTerms);
      sendData.append('pms_asset_amc[amc_period]', `${formData.startDate} - ${formData.endDate}`);
      sendData.append('pms_asset_amc[no_of_visits]', parseInt(formData.noOfVisits).toString());
      sendData.append('pms_asset_amc[payment_term]', formData.paymentTerms);
      sendData.append('pms_asset_amc[remarks]', formData.remarks || '');
      sendData.append('pms_asset_amc[pms_site_id]', (amcData as any)?.pms_site_id || '');
      sendData.append('pms_asset_amc[type]', formData.type);
      sendData.append('pms_asset_amc[time_expression]', buildCronExpression());
      sendData.append('pms_asset_amc[check_box_time]', 'true');

      // Pass technician_id as single value
      if (formData.technician) {
        sendData.append('technician_id', String(formData.technician));
      }

      // Set resource details
      if (formData.details === 'Asset') {
        sendData.append('pms_asset_amc[resource_type]', 'Pms::Asset');
        if (formData.type === 'Individual') {
          sendData.append('pms_asset_amc[resource_id]', formData.asset_ids.join(','));
        } else if (formData.type === 'Group') {
          sendData.append('group_id', formData.group || '');
          sendData.append('sub_group_id', formData.subgroup || '');
        }
      } else if (formData.details === 'Service') {
        sendData.append('pms_asset_amc[resource_type]', 'Pms::Service');
        if (formData.type === 'Group') {
          sendData.append('pms_asset_amc[resource_id]', formData.service);
          sendData.append('group_id', formData.group || '');
          sendData.append('sub_group_id', formData.subgroup || '');
        } else if (formData.type === 'Individual') {
          sendData.append('pms_asset_amc[resource_id]', formData.assetName || formData.service);
        }
      }

      // Append attachments
      attachments.contracts.forEach(file => {
        sendData.append('amc_contracts[content][]', file);
      });
      attachments.invoices.forEach(file => {
        sendData.append('amc_invoices[content][]', file);
      });

      // Append existing file IDs
      existingFiles.contracts.forEach(file => {
        sendData.append('pms_asset_amc[existing_contract_ids][]', file.attachment_id.toString());
      });
      existingFiles.invoices.forEach(file => {
        sendData.append('pms_asset_amc[existing_invoice_ids][]', file.attachment_id.toString());
      });

      sendData.append('subaction', 'save');

      // Log payload (optional debugging)
      // for (const [key, value] of sendData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      const response = await apiClient.put(`/pms/asset_amcs/${id}.json`, sendData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response?.data;

      // ✅ Check backend response validity
      if (!result?.id) {
        toast({
          title: 'Error',
          description:
            result?.message || result?.error || result?.errors?.[0] || 'Failed to update AMC: No ID returned.',
          variant: 'destructive',
        });
        return;
      }

      // ✅ Show success and navigate
      toast({
        title: 'AMC Updated',
        description: 'AMC has been successfully updated.',
      });

      if (action === 'updated with details') {
        navigate(`/maintenance/amc/details/${id}`);
      } else if (action === 'updated new service') {
        navigate('/maintenance/amc');
      }
    } catch (error: any) {
      console.error('API Error:', error.response?.data);
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdateLoading(false);
    }
  }, [
    id,
    formData,
    attachments,
    existingFiles,
    amcData,
    suppliers,
    toast,
    navigate,
    assetsLoading,
    suppliersLoading,
    servicesLoading,
    loading,
    timeSetupData,
  ]);

  // Build cron expression from time setup data
  const buildCronExpression = () => {
    let minute = '*';
    let hour = '*';
    let dayOfMonth = '?';
    let month = '*';
    let dayOfWeek = '?';

    if (timeSetupData.minuteMode === 'specific' && timeSetupData.selectedMinutes.length > 0) {
      minute = timeSetupData.selectedMinutes.join(',');
    } else if (timeSetupData.minuteMode === 'between') {
      const start = parseInt(timeSetupData.betweenMinuteStart, 10);
      const end = parseInt(timeSetupData.betweenMinuteEnd, 10);
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        minute = `${start}-${end}`;
      }
    }

    if (timeSetupData.hourMode === 'specific' && timeSetupData.selectedHours.length > 0) {
      hour = timeSetupData.selectedHours.join(',');
    }

    if (timeSetupData.dayMode === 'weekdays' && timeSetupData.selectedWeekdays.length > 0) {
      const weekdayMap: Record<string, string> = {
        'Sunday': '1', 'Monday': '2', 'Tuesday': '3', 'Wednesday': '4',
        'Thursday': '5', 'Friday': '6', 'Saturday': '7'
      };
      dayOfWeek = timeSetupData.selectedWeekdays.map(day => weekdayMap[day]).join(',');
      dayOfMonth = '?';
    } else if (timeSetupData.dayMode === 'specific' && timeSetupData.selectedDays.length > 0) {
      dayOfMonth = timeSetupData.selectedDays.join(',');
      dayOfWeek = '?';
    }

    if (timeSetupData.monthMode === 'specific' && timeSetupData.selectedMonths.length > 0) {
      const monthMap: Record<string, string> = {
        'January': '1', 'February': '2', 'March': '3', 'April': '4',
        'May': '5', 'June': '6', 'July': '7', 'August': '8',
        'September': '9', 'October': '10', 'November': '11', 'December': '12'
      };
      month = timeSetupData.selectedMonths.map(m => monthMap[m]).join(',');
    } else if (timeSetupData.monthMode === 'between') {
      const monthMap: Record<string, number> = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
      };
      const startMonth = monthMap[timeSetupData.betweenMonthStart];
      const endMonth = monthMap[timeSetupData.betweenMonthEnd];
      if (startMonth && endMonth) {
        month = `${startMonth}-${endMonth}`;
      }
    }

    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  };

  // Responsive styles for TextField and Select
  const fieldStyles = {
    height: {
      xs: 28,
      sm: 36,
      md: 45
    },
  };

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

  // Step navigation functions
  const handleProceedToSave = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields in the current step.',
        variant: 'destructive',
      });
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    if (currentStep === totalSteps - 1) {
      setIsPreviewMode(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreview = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setIsPreviewMode(true);
    } else {
      toast({
        title: 'Error',
        description: 'Please fill all required fields in the current step.',
        variant: 'destructive',
      });
    }
  };

  const handleStepClick = (step: number) => {
    // In preview mode, clicking steps should scroll to sections instead of changing step
    if (isPreviewMode) {
      const ids = ['section-config', 'section-details', 'section-schedule', 'section-attachments'] as const;
      const target = document.getElementById(ids[step]);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // Prevent clicking on future steps without completing previous steps
    if (step > currentStep) {
      // Check if all previous steps are completed
      for (let i = 0; i < step; i++) {
        if (!completedSteps.includes(i)) {
          toast({
            title: 'Error',
            description: `Please complete step ${i + 1} before proceeding to step ${step + 1}.`,
            variant: 'destructive',
          });
          return;
        }
      }

      // Validate current step before allowing navigation to next step
      if (step === currentStep + 1 && !validateStep(currentStep)) {
        toast({
          title: 'Error',
          description: `Please complete all required fields in step ${currentStep + 1} before proceeding to step ${step + 1}.`,
          variant: 'destructive',
        });
        return;
      }
    }

    setCurrentStep(step);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Stepper component - Matching AddAMCPage design
  const StepperComponent = () => {
    const steps = ['AMC Configuration', 'AMC Details', 'Schedule', 'Attachments'];

    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: 0
        }}>
          {steps.map((label, index) => (
            <Box key={`step-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: '213px',
                  height: '50px',
                  padding: '5px',
                  borderRadius: '4px',
                  boxShadow: '0px 4px 14.2px 0px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box
                  onClick={() => handleStepClick(index)}
                  sx={{
                    cursor: (index > currentStep && !completedSteps.includes(index - 1)) ? 'not-allowed' : 'pointer',
                    width: '187px',
                    height: '40px',
                    backgroundColor: (index === currentStep || completedSteps.includes(index)) ? '#C72030' :
                      (index > currentStep && !completedSteps.includes(index - 1)) ? 'rgba(245, 245, 245, 1)' : 'rgba(255, 255, 255, 1)',
                    color: (index === currentStep || completedSteps.includes(index)) ? 'white' :
                      (index > currentStep && !completedSteps.includes(index - 1)) ? 'rgba(150, 150, 150, 1)' : 'rgba(196, 184, 157, 1)',
                    border: (index === currentStep || completedSteps.includes(index)) ? '2px solid #C72030' :
                      (index > currentStep && !completedSteps.includes(index - 1)) ? '1px solid rgba(200, 200, 200, 1)' : '1px solid rgba(196, 184, 157, 1)',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: 500,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: index === currentStep ? '0 2px 4px rgba(199, 32, 48, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Work Sans, sans-serif',
                    position: 'relative',
                    borderRadius: '4px',
                    '&:hover': {
                      opacity: (index > currentStep && !completedSteps.includes(index - 1)) ? 1 : 0.9
                    },
                    '&::before': completedSteps.includes(index) && index !== currentStep ? {
                      content: '"✓"',
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    } : {}
                  }}
                >
                  {label}
                </Box>
              </Box>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: '60px',
                    height: '0px',
                    border: '1px dashed rgba(196, 184, 157, 1)',
                    borderWidth: '1px',
                    borderStyle: 'dashed',
                    borderColor: 'rgba(196, 184, 157, 1)',
                    opacity: 1,
                    margin: '0 0px',
                    '@media (max-width: 1200px)': { width: '40px' },
                    '@media (max-width: 900px)': { width: '30px' },
                    '@media (max-width: 600px)': { width: '20px' }
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const getAssetNames = () => {
    if (!Array.isArray(formData.asset_ids) || !formData.asset_ids.length) return 'Not selected';
    return formData.asset_ids
      .map(id => {
        const asset = assetList.find(a => a.id?.toString() === id.toString());
        return asset?.name || id;
      })
      .join(', ');
  };

  const getSupplierName = (id?: string) => {
    if (!id) return 'Not selected';
    const supplier = suppliers.find(s => s.id?.toString() === id?.toString());
    return supplier ? (supplier.company_name || supplier.name || id) : id;
  };

  const getGroupName = () => {
    if (!formData.group) return 'Not selected';
    const group = assetGroups.find(g => g.id?.toString() === formData.group?.toString());
    return group?.name || formData.group;
  };

  const getSubGroupName = () => {
    if (!formData.subgroup) return 'Not selected';
    const subGroup =
      subGroups.find(sub => sub.id?.toString() === formData.subgroup?.toString()) ||
      assetGroups
        .flatMap(group => group.sub_groups || [])
        .find(sub => sub.id?.toString() === formData.subgroup?.toString());
    return subGroup?.name || formData.subgroup;
  };

  const getServiceName = () => {
    if (!formData.assetName) return 'Not selected';
    const service = services.find(s => s.id?.toString() === formData.assetName?.toString());
    return service?.service_name || formData.assetName;
  };

  /*
  const renderCompletedSections = () => {
    if (!completedSteps.length || isPreviewMode) return null;

    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Previously completed sections
        </h3>
        <div className="space-y-4">
          {completedSteps.sort().map(stepIndex => (
            <Card key={`completed-${stepIndex}`} className="border-[#D9D9D9] bg-white shadow-sm">
              <CardHeader className="bg-[#F6F4EE]">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">
                    ✓
                  </span>
                  {['AMC Configuration', 'AMC Details', 'Schedule', 'Attachments'][stepIndex]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {stepIndex === 0 && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Details</p>
                      <p className="text-sm text-gray-900">{formData.details || 'Asset'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Type</p>
                      <p className="text-sm text-gray-900">{formData.type}</p>
                    </div>
                    {formData.type === 'Individual' ? (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            {formData.details === 'Asset' ? 'Assets' : 'Service'}
                          </p>
                          <p className="text-sm text-gray-900">
                            {formData.details === 'Asset' ? getAssetNames() : getServiceName()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Supplier</p>
                          <p className="text-sm text-gray-900">{getSupplierName(formData.vendor)}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Group</p>
                            <p className="text-sm text-gray-900">{getGroupName()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Sub Group</p>
                            <p className="text-sm text-gray-900">{getSubGroupName()}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Supplier</p>
                          <p className="text-sm text-gray-900">{getSupplierName(formData.supplier)}</p>
                        </div>
                      </>
                    )}
                  </>
                )}

                {stepIndex === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-900">
                    <div>
                      <p className="font-medium text-gray-600 mb-1">Contract Name</p>
                      <p>{formData.contractName || 'Not filled'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 mb-1">Start Date</p>
                      <p>{formData.startDate || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 mb-1">End Date</p>
                      <p>{formData.endDate || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 mb-1">First Service Date</p>
                      <p>{formData.firstService || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 mb-1">Payment Terms</p>
                      <p>{formData.paymentTerms || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 mb-1">Cost</p>
                      <p>{formData.cost || 'Not filled'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 mb-1">No. of Visits</p>
                      <p>{formData.noOfVisits || 'Not filled'}</p>
                    </div>
                    <div className="md:col-span-3">
                      <p className="font-medium text-gray-600 mb-1">Remarks</p>
                      <p>{formData.remarks || 'Not filled'}</p>
                    </div>
                  </div>
                )}

                {stepIndex === 2 && (
                  <div>
                    <div className="mb-3 text-sm text-[#1a1a1a]">
                      <div><span className="font-semibold">Hours:</span> {timeSetupData.selectedHours.join(', ') || 'All'}</div>
                      <div><span className="font-semibold">Minutes:</span> {timeSetupData.selectedMinutes.join(', ') || 'All'}</div>
                      <div><span className="font-semibold">Days:</span> {timeSetupData.selectedWeekdays.join(', ') || 'All'}</div>
                    </div>
                    <TimeSetupStep data={timeSetupData} hideTitle disabled showEditButton={false} />
                  </div>
                )}

                {stepIndex === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">AMC Contracts</p>
                      <p className="text-sm text-gray-900">{attachments.contracts.length + existingFiles.contracts.length} file(s)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">AMC Invoices</p>
                      <p className="text-sm text-gray-900">{attachments.invoices.length + existingFiles.invoices.length} file(s)</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  */

  const downloadAttachment = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl');

      if (!token || !baseUrl) {
        console.error('Missing token or base URL');
        return;
      }

      const apiUrl = `https://${baseUrl}/attachfiles/${file.attachment_id}?show_file=true`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.document_name || `document_${file.attachment_id}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };


  // Field styles - matching AddAMCPage
  const fieldStylesMUI = {
    height: '40px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      height: '40px',
      fontSize: '14px',
      '& fieldset': { borderColor: '#ddd' },
      '&:hover fieldset': { borderColor: '#C72030' },
      '&.Mui-focused fieldset': { borderColor: '#C72030' },
    },
    '& .MuiInputLabel-root': {
      fontSize: '14px',
      '&.Mui-focused': { color: '#C72030' },
    },
  };

  const getScheduleSummary = () => {
    const joinOrAll = (arr: string[], map?: Record<string, string>) => {
      if (!arr || arr.length === 0) return 'All';
      return arr
        .map(value => (map ? map[value] || value : value))
        .filter(Boolean)
        .join(', ');
    };

    const weekdayMapShort: Record<string, string> = {
      Sunday: 'Sun',
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
    };

    const monthMapShort: Record<string, string> = {
      January: 'Jan',
      February: 'Feb',
      March: 'Mar',
      April: 'Apr',
      May: 'May',
      June: 'Jun',
      July: 'Jul',
      August: 'Aug',
      September: 'Sep',
      October: 'Oct',
      November: 'Nov',
      December: 'Dec',
    };

    const hours =
      timeSetupData.hourMode === 'specific'
        ? joinOrAll(timeSetupData.selectedHours)
        : 'All';

    const minutes =
      timeSetupData.minuteMode === 'specific'
        ? joinOrAll(timeSetupData.selectedMinutes)
        : `${timeSetupData.betweenMinuteStart}-${timeSetupData.betweenMinuteEnd}`;

    const days =
      timeSetupData.dayMode === 'weekdays'
        ? joinOrAll(timeSetupData.selectedWeekdays, weekdayMapShort)
        : timeSetupData.dayMode === 'specific'
          ? joinOrAll(timeSetupData.selectedDays)
          : 'All';

    const months =
      timeSetupData.monthMode === 'specific'
        ? joinOrAll(timeSetupData.selectedMonths, monthMapShort)
        : timeSetupData.monthMode === 'between'
          ? `${monthMapShort[timeSetupData.betweenMonthStart]}-${monthMapShort[timeSetupData.betweenMonthEnd]}`
          : 'All';

    return {
      hours,
      minutes,
      days,
      months,
      cron: buildCronExpression(),
    };
  };

  const renderConfigurationCard = (options?: { includeHeader?: boolean }) => {
    const renderAssetValue = (selected: any) => {
      const values = Array.isArray(selected) ? selected : [];
      if (!values.length) {
        return <span style={{ color: '#aaa' }}>Select Assets</span>;
      }
      return values
        .map((id: string) => {
          const asset = assetList.find(a => a.id?.toString() === id);
          return asset?.name || id;
        })
        .join(', ');
    };

    const renderServiceValue = (selected: any) => {
      // For Group type with amc_services, display service names
      if (formData.type === 'Group' && selectedServiceNames.length > 0) {
        return selectedServiceNames.join(', ');
      }
      // For Individual type, find service by ID
      if (!selected || selected === '') {
        // Check if we have selectedServiceNames as fallback
        if (selectedServiceNames.length > 0) {
          return selectedServiceNames.join(', ');
        }
        return <span style={{ color: '#aaa' }}>Select a Service...</span>;
      }
      const service = services.find(s => s.id?.toString() === selected.toString());
      // If service not found in services array, check selectedServiceNames (from amc_services)
      if (!service && selectedServiceNames.length > 0) {
        return selectedServiceNames[0]; // For Individual type, show the first service name
      }
      return service?.service_name || selected;
    };

    const renderGroupValue = (selected: any) => {
      if (!selected) {
        return <span style={{ color: '#aaa' }}>Select Group</span>;
      }
      const group = assetGroups.find(g => g.id?.toString() === selected.toString());
      return group?.name || selected;
    };

    const renderSubgroupValue = (selected: any) => {
      if (!selected) {
        return <span style={{ color: '#aaa' }}>Select Sub Group</span>;
      }
      const subGroup =
        subGroups.find(sub => sub.id?.toString() === selected.toString()) ||
        assetGroups
          .flatMap(group => group.sub_groups || [])
          .find(sub => sub.id?.toString() === selected.toString());
      return subGroup?.name || selected;
    };

    return (
      <Card
        className="mb-6 border-[#D9D9D9] bg-white shadow-sm"
        style={{
          borderRadius: '4px',
          background: '#FFF',
          boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)',
        }}
      >
        {options?.includeHeader && (
          <CardHeader className="bg-[#F6F4EE] ">
            <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">
                1
              </span>
              AMC CONFIGURATION
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Details</label>
            <div className="flex gap-6">
              {['Asset', 'Service'].map(option => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`preview-details-${option}`}
                    value={option}
                    checked={formData.details === option}
                    readOnly
                    disabled
                    className="mr-2 w-4 h-4"
                    style={{ accentColor: '#C72030' }}
                  />
                  <span className="text-[#1a1a1a] font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Type</label>
            <div className="flex gap-6">
              {['Individual', 'Group'].map(option => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`preview-type-${option}`}
                    value={option}
                    checked={formData.type === option}
                    readOnly
                    disabled
                    className="mr-2 w-4 h-4"
                    style={{ accentColor: '#C72030' }}
                  />
                  <span className="text-[#1a1a1a] font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {formData.type === 'Individual' ? (
            <>
              {formData.details === 'Asset' ? (
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Assets <span style={{ color: '#C72030' }}>*</span></InputLabel>
                  <MuiSelect
                    multiple
                    label="Assets"
                    notched
                    displayEmpty
                    value={formData.asset_ids}
                    disabled
                    renderValue={renderAssetValue}
                  >
                    <MenuItem value=""><em>Select Assets</em></MenuItem>
                    {Array.isArray(assetList) && assetList.map(asset => (
                      <MenuItem key={asset.id} value={asset.id?.toString()}>
                        {asset.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              ) : (
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Service <span style={{ color: '#C72030' }}>*</span></InputLabel>
                  <MuiSelect
                    label="Service"
                    displayEmpty
                    value={formData.assetName || formData.service || ''}
                    disabled
                    renderValue={renderServiceValue}
                  >
                    <MenuItem value=""><em>Select a Service...</em></MenuItem>
                    {Array.isArray(services) && services.map(service => (
                      <MenuItem key={service.id} value={service.id?.toString()}>
                        {service.service_name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              )}

              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Supplier <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Supplier"
                  displayEmpty
                  value={formData.vendor}
                  disabled
                >
                  <MenuItem value=""><em>Select Supplier</em></MenuItem>
                  {Array.isArray(suppliers) && suppliers.map(supplier => (
                    <MenuItem key={supplier.id} value={supplier.id?.toString()}>
                      {supplier.company_name || supplier.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Technician</InputLabel>
                <MuiSelect
                  label="Technician"
                  displayEmpty
                  value={formData.technician}
                  disabled
                >
                  <MenuItem value=""><em>Select Technician</em></MenuItem>
                  {Array.isArray(technicianOptions) && technicianOptions.map(technician => (
                    <MenuItem key={technician.id} value={technician.id?.toString()}>
                      {technician.full_name || technician.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Group</InputLabel>
                <MuiSelect
                  label="Group"
                  displayEmpty
                  value={formData.group}
                  disabled
                  renderValue={renderGroupValue}
                >
                  <MenuItem value=""><em>Select Group</em></MenuItem>
                  {Array.isArray(assetGroups) && assetGroups.map(group => (
                    <MenuItem key={group.id} value={group.id?.toString()}>
                      {group.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>SubGroup</InputLabel>
                <MuiSelect
                  label="SubGroup"
                  displayEmpty
                  value={formData.subgroup}
                  disabled
                  renderValue={renderSubgroupValue}
                >
                  <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                  {Array.isArray(subGroups) && subGroups.map(subGroup => (
                    <MenuItem key={subGroup.id} value={subGroup.id?.toString()}>
                      {subGroup.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Supplier <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Supplier"
                  displayEmpty
                  value={formData.supplier}
                  disabled
                >
                  <MenuItem value=""><em>Select Supplier</em></MenuItem>
                  {Array.isArray(suppliers) && suppliers.map(supplier => (
                    <MenuItem key={supplier.id} value={supplier.id?.toString()}>
                      {supplier.company_name || supplier.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Display Services for Group type */}
              {formData.details === 'Service' && selectedServiceNames.length > 0 && (
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Services</InputLabel>
                  <MuiSelect
                    label="Services"
                    displayEmpty
                    value="services"
                    disabled
                    renderValue={() => selectedServiceNames.join(', ')}
                  >
                    <MenuItem value="services">{selectedServiceNames.join(', ')}</MenuItem>
                  </MuiSelect>
                </FormControl>
              )}

              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Technician</InputLabel>
                <MuiSelect
                  label="Technician"
                  displayEmpty
                  value={formData.technician}
                  disabled
                >
                  <MenuItem value=""><em>Select Technician</em></MenuItem>
                  {Array.isArray(technicianOptions) && technicianOptions.map(technician => (
                    <MenuItem key={technician.id} value={technician.id?.toString()}>
                      {technician.full_name || technician.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderDetailsCard = (options?: { includeHeader?: boolean }) => (
    <Card
      className="mb-6 border-[#D9D9D9] bg-white shadow-sm"
      style={{
        borderRadius: '4px',
        background: '#FFF',
        boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)',
      }}
    >
      {options?.includeHeader && (
        <CardHeader className="bg-[#F6F4EE] ">
          <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">
              2
            </span>
            AMC DETAILS
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextField
            disabled
            label={<span>Contract Name <span style={{ color: 'red' }}>*</span></span>}
            placeholder="Enter Contract Name"
            fullWidth
            value={formData.contractName}
            sx={{ mb: 3 }}
          />

          <TextField
            disabled
            label={<span>Start Date <span style={{ color: 'red' }}>*</span></span>}
            type="date"
            fullWidth
            value={formData.startDate || ''}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />

          <TextField
            disabled
            label={<span>End Date <span style={{ color: 'red' }}>*</span></span>}
            type="date"
            fullWidth
            value={formData.endDate || ''}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />

          <TextField
            disabled
            label={<span>First Service Date <span style={{ color: 'red' }}>*</span></span>}
            type="date"
            fullWidth
            value={formData.firstService || ''}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Payment Terms <span style={{ color: '#C72030' }}>*</span></InputLabel>
            <MuiSelect
              label="Payment Terms"
              displayEmpty
              value={formData.paymentTerms}
              disabled
            >
              <MenuItem value=""><em>Select Payment Terms</em></MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="half-yearly">Half Yearly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
              <MenuItem value="full_payment">Full Payment</MenuItem>
              <MenuItem value="visit_based_payment">Visit Based Payment</MenuItem>
            </MuiSelect>
          </FormControl>

          <TextField
            disabled
            label={<span>Cost <span style={{ color: 'red' }}>*</span></span>}
            placeholder="Enter Cost"
            type="number"
            fullWidth
            value={formData.cost}
            sx={{ mb: 3 }}
          />

          <TextField
            disabled
            label={<span>No. of Visits <span style={{ color: 'red' }}>*</span></span>}
            placeholder="Enter No. of Visits"
            type="number"
            fullWidth
            value={formData.noOfVisits}
            sx={{ mb: 3 }}
          />

          <TextField
            disabled
            label="Remarks"
            placeholder="Enter Remarks"
            fullWidth
            value={formData.remarks}
            sx={{ mb: 3 }}
          />

          <div />
        </div>
      </CardContent>
    </Card>
  );

  const renderScheduleCard = (options?: { includeHeader?: boolean }) => {
    const { hours, minutes, days, months, cron } = getScheduleSummary();
    return (
      <Card
        className="mb-6 border-[#D9D9D9] bg-white shadow-sm"
        style={{
          borderRadius: '4px',
          background: '#FFF',
          boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)',
        }}
      >
        {options?.includeHeader && (
          <CardHeader className="bg-[#F6F4EE] ">
            <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">
                3
              </span>
              SCHEDULE
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="p-4">
          <div className="mb-3 text-sm text-[#1a1a1a] space-y-1">
            <div><span className="font-semibold">Hours:</span> {hours}</div>
            <div><span className="font-semibold">Minutes:</span> {minutes}</div>
            <div><span className="font-semibold">Days:</span> {days}</div>
            <div><span className="font-semibold">Months:</span> {months}</div>
            <div><span className="font-semibold">Cron:</span> {cron}</div>
          </div>
          <TimeSetupStep data={timeSetupData} hideTitle disabled showEditButton={false} />
        </CardContent>
      </Card>
    );
  };

  const getTotalAttachmentCount = (type: 'contracts' | 'invoices') =>
    attachments[type].length + existingFiles[type].length;

  const renderAttachmentsSummaryCard = (options?: { includeHeader?: boolean }) => (
    <Card
      className="mb-6 border-[#D9D9D9] bg-white shadow-sm"
      style={{
        borderRadius: '4px',
        background: '#FFF',
        boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)',
      }}
    >
      {options?.includeHeader && (
        <CardHeader className="bg-[#F6F4EE] ">
          <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">
              4
            </span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold mb-4 text-[#1a1a1a]">AMC Contracts</label>
            <div className="border-2 border-dashed border-[#D9D9D9] rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600">
                {getTotalAttachmentCount('contracts')} file(s) ready
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-4 text-[#1a1a1a]">AMC Invoices</label>
            <div className="border-2 border-dashed border-[#D9D9D9] rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600">
                {getTotalAttachmentCount('invoices')} file(s) ready
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAttachmentPreviewTiles = (type: 'contracts' | 'invoices') => {
    const isContract = type === 'contracts';
    const label = isContract ? 'AMC Contracts' : 'AMC Invoices';

    const renderNewFiles = () => {
      if (!attachments[type].length) return null;
      return (
        <div className="flex flex-wrap gap-3">
          {attachments[type].map((file, index) => {
            const isImage = file.type.startsWith('image/');
            const isPdf = file.type === 'application/pdf';
            const isExcel = file.name.match(/\.(xlsx|xls|csv)$/i);
            const fileURL = URL.createObjectURL(file);
            return (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="relative flex flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
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
                  <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-500 bg-white mb-1">
                    <File className="w-4 h-4" />
                  </div>
                )}
                <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-4 w-4 p-0 text-gray-600"
                  onClick={() => removeFile(type, index)}
                  disabled={updateLoading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      );
    };

    const renderExistingFiles = () => {
      if (!existingFiles[type].length) return null;
      return (
        <div className="flex flex-wrap gap-3">
          {existingFiles[type].map(file => {
            const isImage = file.document_name.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
            const isPdf = file.document_name.endsWith('.pdf');
            const isExcel = file.document_name.match(/\.(xlsx|xls|csv)$/i);
            return (
              <div
                key={`${file.document_name}-${file.attachment_id}`}
                className="relative flex flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
              >
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-4 w-4 p-0 text-[#C72030]"
                  onClick={() => downloadAttachment(file)}
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      );
    };

    const hasFiles = attachments[type].length > 0 || existingFiles[type].length > 0;

    return (
      <div>
        <label className="block text-sm font-semibold mb-4 text-[#1a1a1a]">{label}</label>
        <div className="border-2 border-dashed border-[#D9D9D9] rounded-lg p-6 min-h-[200px]">
          {hasFiles ? (
            <div className="space-y-4">
              {renderNewFiles()}
              {renderExistingFiles()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-500">No files uploaded</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAttachmentsPreviewCard = () => (
    <Card
      className="mb-6 border-[#D9D9D9] bg-white shadow-sm"
      style={{
        borderRadius: '4px',
        background: '#FFF',
        boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)',
      }}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderAttachmentPreviewTiles('contracts')}
          {renderAttachmentPreviewTiles('invoices')}
        </div>
      </CardContent>
    </Card>
  );

  const PreviewStepSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <div className="flex items-center mb-4">
        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3 font-medium">
          ✓
        </span>
        <h3
          className="text-[#C72030]"
          style={{
            fontFamily: 'Work Sans, sans-serif',
            fontWeight: 600,
            fontSize: '26px',
            lineHeight: '100%',
            letterSpacing: '0%',
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const renderCompletedSections = () => {
    if (!completedSteps.length) return null;
    const sections = [
      renderConfigurationCard({ includeHeader: true }),
      renderDetailsCard({ includeHeader: true }),
      renderScheduleCard({ includeHeader: true }),
      renderAttachmentsSummaryCard({ includeHeader: true }),
    ];

    const sortedSteps = [...new Set(completedSteps)].sort((a, b) => a - b);

    return (
      <div className="mt-8">
        <div className="space-y-4">
          {sortedSteps.map(stepIndex => (
            <div key={`completed-section-${stepIndex}`}>
              {sections[stepIndex]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      <div className="p-6">
        {/* Stepper Component - Hide in preview mode */}
        {!isPreviewMode && <StepperComponent />}

        {/* Preview Mode - Show all sections */}
        {isPreviewMode && (
          <div className="px-4 md:px-6 py-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center mb-6">
              <span className="font-bold text-orange-600">Preview</span>
            </div>

            <PreviewStepSection title="AMC Configuration">
              {renderConfigurationCard()}
            </PreviewStepSection>

            <PreviewStepSection title="AMC Details">
              {renderDetailsCard()}
            </PreviewStepSection>

            <PreviewStepSection title="Schedule">
              {renderScheduleCard()}
            </PreviewStepSection>

            <PreviewStepSection title="Attachments">
              {renderAttachmentsPreviewCard()}
            </PreviewStepSection>

            <div className="flex gap-4 justify-center">
              <Button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="px-6 py-2 font-medium"
                style={{
                  backgroundColor: '#FFF',
                  color: '#C72030',
                  border: '1px solid #C72030',
                  borderRadius: '4px'
                }}
              >
                Back to Edit
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit('updated with details')}
                disabled={updateLoading}
                className="px-6 py-2 font-medium disabled:opacity-50"
                style={{
                  backgroundColor: '#C72030',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Updating...
                  </>
                ) : (
                  'Update AMC'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step-based form rendering - Hide in preview mode */}
        {!isPreviewMode && (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit('updated with details'); }}>
            {/* Step 0: AMC Configuration */}
            {currentStep === 0 && (
              <>
                <div className="flex items-center mb-4">
                  <Avatar sx={{
                    bgcolor: '#C72030',
                    color: 'white',
                    width: 32,
                    height: 32,
                    mr: 2,
                    fontSize: '16px'
                  }}>
                    <SettingsOutlinedIcon fontSize="small" />
                  </Avatar>
                  <h2 className="text-[#C72030]" style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '26px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}>
                    AMC Configuration
                  </h2>
                </div>
                <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                  borderRadius: '4px',
                  background: '#FFF',
                  boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
                }}>
                  {/* <CardHeader className='bg-[#fffff] mb-4'> */}
                  {/* <CardTitle className="text-lg text-black flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
              AMC CONFIGURATION
            </CardTitle> */}
                  {/* </CardHeader> */}
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Details</label>
                      <div className="flex gap-8">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="details"
                            value="Asset"
                            checked={formData.details === 'Asset'}
                            onChange={e => handleInputChange('details', e.target.value)}
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                            disabled={true}
                          />
                          <span className="text-[#1a1a1a] font-medium">Asset</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="details"
                            value="Service"
                            checked={formData.details === 'Service'}
                            onChange={e => handleInputChange('details', e.target.value)}
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                            disabled={true}
                          />

                          <span className="text-[#1a1a1a] font-medium">Service</span>

                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Type</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value="Individual"
                            checked={formData.type === 'Individual'}
                            onChange={e => handleInputChange('type', e.target.value)}
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                          /> <span className="text-[#1a1a1a] font-medium">Individual</span>

                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value="Group"
                            checked={formData.type === 'Group'}
                            onChange={e => handleInputChange('type', e.target.value)}
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                          />
                          <span className="text-[#1a1a1a] font-medium">Group</span>
                        </label>
                      </div>
                    </div>

                    {/* Conditional rendering based on type selection */}
                    {formData.type === 'Individual' ? (
                      <>
                        {formData.details === 'Asset' ? (
                          <FormControl fullWidth variant="outlined" error={!!errors.asset_ids}>
                            <InputLabel id="asset-select-label" shrink>
                              Assets <span style={{ color: '#C72030' }}>*</span>
                            </InputLabel>
                            <MuiSelect
                              labelId="asset-select-label"
                              label="Assets"
                              multiple
                              displayEmpty
                              value={formData.asset_ids}
                              onChange={e => {
                                const value = e.target.value as string[];
                                setFormData(prev => ({
                                  ...prev,
                                  asset_ids: value
                                }));
                                setErrors(prev => ({ ...prev, asset_ids: '' }));
                              }}
                              sx={fieldStylesMUI}
                              disabled={updateLoading}
                              renderValue={(selected) => {
                                if (selected.length === 0) {
                                  return <em>Select Assets...</em>;
                                }
                                return selected.map(id => {
                                  const asset = assetList.find(a => a.id.toString() === id);
                                  return asset?.name;
                                }).join(', ');
                              }}
                            >
                              {Array.isArray(assetList) && assetList.map((asset) => (
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
                            {errors.asset_ids && <FormHelperText>{errors.asset_ids}</FormHelperText>}
                          </FormControl>
                        ) : (
                          <FormControl fullWidth variant="outlined" error={!!errors.service}>
                            <InputLabel id="service-select-label" shrink>
                              Service <span style={{ color: '#C72030' }}>*</span>
                            </InputLabel>
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
                            {errors.service && <FormHelperText>{errors.service}</FormHelperText>}
                          </FormControl>
                        )}

                        <div>
                          <FormControl fullWidth variant="outlined" error={!!errors.vendor}>
                            <InputLabel id="vendor-select-label" shrink>
                              Supplier <span style={{ color: '#C72030' }}>*</span>
                            </InputLabel>
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
                                return supplier ? (supplier.company_name || supplier.name) : selected;
                              }}
                            >
                              <MenuItem value=""><em>Select Supplier</em></MenuItem>
                              {Array.isArray(suppliers) && suppliers.map((supplier) => (
                                <MenuItem key={supplier.id} value={supplier.id.toString()}>
                                  {supplier.company_name || supplier.name}
                                </MenuItem>
                              ))}
                            </MuiSelect>
                          </FormControl>
                        </div>

                        <div>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel shrink>Technician</InputLabel>
                            <MuiSelect
                              label="Technician"
                              displayEmpty
                              value={formData.technician}
                              onChange={e => handleInputChange('technician', e.target.value)}
                              sx={fieldStyles}
                              disabled={loading || techniciansLoading || updateLoading}
                            >
                              <MenuItem value=""><em>Select Technician</em></MenuItem>
                              {Array.isArray(technicianOptions) && technicianOptions.map((technician) => (
                                <MenuItem key={technician.id} value={technician.id.toString()}>
                                  {technician.full_name || technician.name}
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
                            <FormControl fullWidth variant="outlined" error={!!errors.group}>
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
                                  <MenuItem key={group.id} value={group.id}>
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

                          {/* Display Services for Group type */}
                          {formData.details === 'Service' && selectedServiceNames.length > 0 && (
                            <div>
                              <FormControl fullWidth variant="outlined">
                                <InputLabel shrink>Services</InputLabel>
                                <MuiSelect
                                  label="Services"
                                  displayEmpty
                                  value="services"
                                  disabled
                                  sx={fieldStyles}
                                  renderValue={() => selectedServiceNames.join(', ')}
                                >
                                  <MenuItem value="services">{selectedServiceNames.join(', ')}</MenuItem>
                                </MuiSelect>
                              </FormControl>
                            </div>
                          )}

                          <div>
                            <FormControl fullWidth variant="outlined" error={!!errors.supplier}>
                              <InputLabel id="group-supplier-select-label" shrink>
                                Supplier <span style={{ color: '#C72030' }}>*</span>
                              </InputLabel>
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
                                    {supplier.company_name || supplier.name}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                              {errors.supplier && <FormHelperText>{errors.supplier}</FormHelperText>}
                            </FormControl>
                          </div>

                          <div>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel shrink>Technician</InputLabel>
                              <MuiSelect
                                label="Technician"
                                displayEmpty
                                value={formData.technician}
                                onChange={e => handleInputChange('technician', e.target.value)}
                                sx={fieldStyles}
                                disabled={loading || techniciansLoading || updateLoading}
                              >
                                <MenuItem value=""><em>Select Technician</em></MenuItem>
                                {Array.isArray(technicianOptions) && technicianOptions.map((technician) => (
                                  <MenuItem key={technician.id} value={technician.id.toString()}>
                                    {technician.full_name || technician.name}
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
              </>
            )}

            {/* Step 1: AMC Details */}
            {currentStep === 1 && (
              <>
                <div className="flex items-center mb-4">
                  <Avatar sx={{
                    bgcolor: '#C72030',
                    color: 'white',
                    width: 32,
                    height: 32,
                    mr: 2,
                    fontSize: '16px'
                  }}>
                    <SettingsOutlinedIcon fontSize="small" />
                  </Avatar>
                  <h2 className="text-[#C72030]" style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '26px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}>
                    AMC Details
                  </h2>
                </div>
                <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                  borderRadius: '4px',
                  background: '#FFF',
                  boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
                }}>
                  <CardContent className="space-y-4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Row 1: Contract Name | Start Date | End Date */}
                      <div>
                        <TextField
                          label={<span>Contract Name<span style={{ color: '#C72030' }}>*</span></span>}
                          placeholder="Enter Contract Name"
                          name="contractName"
                          value={formData.contractName}
                          onChange={e => handleInputChange('contractName', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ sx: fieldStyles }}
                          error={!!errors.contractName}
                          helperText={errors.contractName}
                        />
                      </div>

                      <div>
                        <TextField
                          fullWidth
                          type="date"
                          label={<span>Start Date<span style={{ color: '#C72030' }}>*</span></span>}
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { height: 46 } }}
                          sx={{ '& .MuiInputBase-root': { height: 46 } }}
                          error={!!errors.startDate}
                          helperText={errors.startDate}
                        />
                      </div>

                      <div>
                        <TextField
                          fullWidth
                          type="date"
                          label={<span>End Date<span style={{ color: '#C72030' }}>*</span></span>}
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { height: 46 }, min: formData.startDate || undefined }}
                          sx={{ '& .MuiInputBase-root': { height: 46 } }}
                          error={!!errors.endDate}
                          helperText={errors.endDate || (!formData.startDate && "Please select a start date first.")}
                          disabled={!formData.startDate || updateLoading}
                        />
                      </div>

                      {/* Row 2: First Service Date | Payment Terms | AMC Cost */}
                      <div>
                        <TextField
                          fullWidth
                          type="date"
                          label={<span>First Service Date<span style={{ color: '#C72030' }}>*</span></span>}
                          value={formData.firstService}
                          onChange={(e) => handleInputChange('firstService', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { height: 46 } }}
                          sx={{ '& .MuiInputBase-root': { height: 46 } }}
                          error={!!errors.firstService}
                          helperText={errors.firstService}
                        />
                      </div>

                      <div>
                        <FormControl fullWidth variant="outlined" error={!!errors.paymentTerms}>
                          <InputLabel id="payment-terms-select-label" shrink>Payment Terms <span style={{ color: '#C72030' }}>*</span></InputLabel>
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
                            <MenuItem value="full_payment" >Full Payment</MenuItem>
                            <MenuItem value="visit_based_payment" >Visit Based Payment</MenuItem>
                          </MuiSelect>
                          {errors.paymentTerms && <FormHelperText>{errors.paymentTerms}</FormHelperText>}
                        </FormControl>
                      </div>

                      <div>
                        <TextField
                          label={<span>Cost<span style={{ color: '#C72030' }}>*</span></span>}
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

                      {/* Row 3: No. of Visits */}
                      <div>
                        <TextField
                          label={<span>No. of Visits<span style={{ color: '#C72030' }}>*</span></span>}
                          placeholder="Enter No. of Visits"
                          name="noOfVisits"
                          type="text"
                          value={formData.noOfVisits}
                          onChange={e => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              handleInputChange('noOfVisits', value);
                            }
                          }}
                          onKeyDown={e => {
                            const allowedKeys = [
                              'Backspace',
                              'Delete',
                              'ArrowLeft',
                              'ArrowRight',
                              'Tab'
                            ];
                            if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                              e.preventDefault();
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
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "auto !important",
                              padding: "2px !important",
                              display: "flex",
                            },
                            "& .MuiInputBase-input[aria-hidden='true']": {
                              flex: 0,
                              width: 0,
                              height: 0,
                              padding: "0 !important",
                              margin: 0,
                              display: "none",
                            },
                            "& .MuiInputBase-input": {
                              resize: "none !important",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Step 2: Schedule */}
            {currentStep === 2 && (
              <>
                <div className="flex items-center mb-4">
                  <Avatar sx={{
                    bgcolor: '#C72030',
                    color: 'white',
                    width: 32,
                    height: 32,
                    mr: 2,
                    fontSize: '16px'
                  }}>
                    <SettingsOutlinedIcon fontSize="small" />
                  </Avatar>
                  <h2 className="text-[#C72030]" style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '26px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}>
                    Schedule
                  </h2>
                </div>
                <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                  borderRadius: '4px',
                  background: '#FFF',
                  boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
                }}>
                  <CardContent className="p-4">
                    <TimeSetupStep
                      data={timeSetupData}
                      onChange={(field, value) => {
                        setTimeSetupData(prev => ({ ...prev, [field]: value }));
                      }}
                      hideTitle
                      showEditButton={false}
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {/* Step 3: Attachments */}
            {currentStep === 3 && (
              <>
                <div className="flex items-center mb-4">
                  <Avatar sx={{
                    bgcolor: '#C72030',
                    color: 'white',
                    width: 32,
                    height: 32,
                    mr: 2,
                    fontSize: '16px'
                  }}>
                    <SettingsOutlinedIcon fontSize="small" />
                  </Avatar>
                  <h2 className="text-[#C72030]" style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '26px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}>
                    Attachments
                  </h2>
                </div>
                <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                  borderRadius: '4px',
                  background: '#FFF',
                  boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
                }}>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* AMC Contracts */}
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
                            {existingFiles.contracts.map((doc) => {
                              const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(doc.document_name);
                              const isPdf = doc.document_name.endsWith('.pdf');
                              const isExcel = doc.document_name.endsWith('.xlsx') || doc.document_name.endsWith('.xls') || doc.document_name.endsWith('.csv');
                              return (
                                <div key={`${doc.document_name}-${doc.attachment_id}`} className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm">
                                  {isImage ? (
                                    <img src={doc.document_url} alt={doc.document_name} className="w-[40px] h-[40px] object-cover rounded border mb-1" />
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
                                  <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{doc.document_name}</span>
                                  <Button type="button" variant="ghost" size="sm" className="absolute top-1 right-1 h-4 w-4 p-0 text-[#C72030]" onClick={() => downloadAttachment(doc)}>
                                    <Download className="w-3 h-3" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* AMC Invoices */}
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
                                  <Button type="button" variant="ghost" size="sm" className="absolute top-1 right-1 h-4 w-4 p-0 text-[#C72030]" onClick={() => downloadAttachment(file)}>
                                    <Download className="w-3 h-3" />
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
                                  <Button type="button" variant="ghost" size="sm" className="absolute top-1 right-1 h-4 w-4 p-0 text-[#C72030]" onClick={() => downloadAttachment(file)}>
                                    <Download className="w-3 h-3" />
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
              </>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex gap-4 justify-center mt-8">
              {currentStep < totalSteps - 1 ? (
                <Button
                  type="button"
                  onClick={handleProceedToSave}
                  className="px-6 py-2 font-medium"
                  style={{
                    backgroundColor: '#C72030',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Proceed to save
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={handlePreview}
                    className="px-6 py-2 font-medium"
                    style={{
                      backgroundColor: '#C72030',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSubmit('updated with details')}
                    disabled={updateLoading}
                    className="px-6 py-2 font-medium disabled:opacity-50"
                    style={{
                      backgroundColor: '#C72030',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    {updateLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                        Updating...
                      </>
                    ) : (
                      'Update AMC'
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Progress indicator */}
            <div className="text-center mt-4 text-sm text-gray-600">
              You've completed {completedSteps.length} out of {totalSteps} steps.
            </div>
          </form>
        )}
        {!isPreviewMode && renderCompletedSections()}
      </div>
    </div>
  );
};

export default EditAMCPage;