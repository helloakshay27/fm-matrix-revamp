import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus, FileSpreadsheet, FileText, File, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText, Box, Avatar, Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAssetsData } from '@/store/slices/assetsSlice';
import { createAMC, resetAmcCreate } from '@/store/slices/amcCreateSlice';
import { apiClient } from '@/utils/apiClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchInventoryAssets } from '@/store/slices/inventoryAssetsSlice';
import { TimeSetupStep } from '@/components/schedule/TimeSetupStep';
// Removed Material-UI checkbox imports - using custom styled components

interface Service {
  id: string | number;
  service_name: string;
}

export const AddAMCPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const inventoryAssetsState = useSelector((state: RootState) => state.inventoryAssets);
  const { data: assetsData, loading: assetsLoading } = useAppSelector(state => state.assets);
  // Removed suppliers slice usage; we'll fetch directly
  const { data: servicesData, loading: servicesLoading } = useAppSelector(state => state.services);
  const { success: amcCreateSuccess, error: amcCreateError } = useAppSelector(state => state.amcCreate);
  const [services, setServices] = useState<Service[]>([]);

  // Local state for submission tracking
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<'show' | 'schedule' | null>(null);
  const [assetList, setAssetList] = useState<any[]>([]); // [setAssetList]
  // Assets remote search using global enhancer
  const [assetOptions, setAssetOptions] = useState<any[]>([]);
  const [assetQuery, setAssetQuery] = useState('');
  const [assetSearchLoading, setAssetSearchLoading] = useState(false);
  const [assetMenuId] = useState(() => `asset-menu-${Math.random().toString(36).slice(2)}`);
  // Suppliers remote search using global enhancer
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
  const [supplierQuery, setSupplierQuery] = useState('');
  const [supplierSearchLoading, setSupplierSearchLoading] = useState(false);
  const [supplierMenuId] = useState(() => `supplier-menu-${Math.random().toString(36).slice(2)}`);
  // Technician state
  const [technicianOptions, setTechnicianOptions] = useState<any[]>([]);
  const [techniciansLoading, setTechniciansLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    details: 'Asset',
    type: 'Individual',
    assetName: '',
    asset_ids: [] as number[],
    group: '',
    subgroup: '',
    service_ids: [] as number[],
    supplier: '',
    technician: '',
    startDate: '',
    endDate: '',
    cost: '',
    contractName: '',
    paymentTerms: '',
    firstService: '',
    noOfVisits: '',
    remarks: ''
  });

  // Step management state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showPreviousSections, setShowPreviousSections] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const totalSteps = 4;
  const AMC_DRAFT_STORAGE_KEY = 'add_amc_page_draft';

  // Error state for validation
  const [errors, setErrors] = useState({
    asset_ids: '',
    group: '',
    supplier: '',
    service_ids: '',
    startDate: '',
    endDate: '',
    cost: '',
    contractName: '',
    paymentTerms: '',
    firstService: '',
    noOfVisits: ''
  });

  const [attachments, setAttachments] = useState({
    contracts: [] as File[],
    invoices: [] as File[]
  });

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

  const [assetGroups, setAssetGroups] = useState<Array<{ id: number, name: string, sub_groups: Array<{ id: number, name: string }> }>>([]);
  const [subGroups, setSubGroups] = useState<Array<{ id: number, name: string }>>([]);
  const { assets, loading: AssetsLoading } = inventoryAssetsState as unknown as { assets: Array<{ id: number; name: string }> | null, loading: boolean };

  const [loading, setLoading] = useState(false);

  const suppliers: any[] = []; // not used now; kept for group type select reuse logic below
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      if (field === 'details' && prev.details !== value) {
        return {
          ...prev,
          [field]: value,
          assetName: '',
          asset_ids: [],
          group: '',
          subgroup: '',
          service_ids: [],
          supplier: ''
        };
      }
      if (field === 'type' && prev.type !== value) {
        return {
          ...prev,
          [field]: value,
          group: '',
          subgroup: '',
          service_ids: [],
          supplier: '',
          asset_ids: [],
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

  useEffect(() => {
    dispatch(fetchAssetsData({ page: 1 }));
    dispatch(fetchInventoryAssets());
    // Initial supplier load
    // const initialLoad = async () => {
    //   try {
    //     const baseUrl = localStorage.getItem('baseUrl');
    //     const token = localStorage.getItem('token');
    //     if (!baseUrl || !token) return;
    //     setSuppliersLoading(true);
    //     const resp = await fetch(`https://${baseUrl}/pms/suppliers/get_suppliers.json`, { headers: { Authorization: `Bearer ${token}` } });
    //     if (resp.ok) {
    //       const data = await resp.json();
    //       const arr = Array.isArray(data) ? data : (Array.isArray(data?.pms_suppliers) ? data.pms_suppliers : (Array.isArray(data?.suppliers) ? data.suppliers : []));
    //       setSupplierOptions(arr);
    //     }
    //   } catch (e) {
    //     console.error('Initial suppliers load error', e);
    //   } finally {
    //     setSuppliersLoading(false);
    //   }
    // };
    // initialLoad();

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
        toast.error("Failed to fetch services.");
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
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedDraft = localStorage.getItem(AMC_DRAFT_STORAGE_KEY);
    if (storedDraft) {
      setHasSavedDraft(true);
      setShowDraftModal(true);
    }
  }, []);

  // Seed initial options from the fetched asset list
  useEffect(() => {
    if (Array.isArray(assetList) && assetList.length) {
      setAssetOptions(assetList);
    }
  }, [assetList]);

  // Listen to global enhancer search input only within the Assets menu
  useEffect(() => {
    const onInput = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t || !(t instanceof HTMLInputElement)) return;
      if (!t.classList.contains('mui-search-input')) return;
      const paper = t.closest('.MuiMenu-paper, .MuiPaper-root') as HTMLElement | null;
      if (!paper || paper.id !== assetMenuId) return;
      setAssetQuery(t.value || '');
    };
    document.addEventListener('input', onInput, true);
    return () => document.removeEventListener('input', onInput, true);
  }, [assetMenuId]);

  // Listen within the Supplier menu
  useEffect(() => {
    const onInput = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t || !(t instanceof HTMLInputElement)) return;
      if (!t.classList.contains('mui-search-input')) return;
      const paper = t.closest('.MuiMenu-paper, .MuiPaper-root') as HTMLElement | null;
      if (!paper || paper.id !== supplierMenuId) return;
      setSupplierQuery(t.value || '');
    };
    document.addEventListener('input', onInput, true);
    return () => document.removeEventListener('input', onInput, true);
  }, [supplierMenuId]);

  // Clear back to initial options when below threshold
  useEffect(() => {
    if (assetQuery.length < 3) {
      setAssetOptions(assetList || []);
      setAssetSearchLoading(false);
    }
  }, [assetQuery, assetList]);

  // Debounced remote search for assets after 3+ chars
  useEffect(() => {
    if (assetQuery.length < 3) return;
    let active = true;
    const handler = setTimeout(async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        setAssetSearchLoading(true);
        const url = `https://${baseUrl}/pms/assets/get_assets.json?q[name_cont]=${encodeURIComponent(assetQuery)}`;
        const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!active) return;
        if (resp.ok) {
          const data = await resp.json();
          const arr = Array.isArray(data) ? data : (Array.isArray(data?.assets) ? data.assets : []);
          setAssetOptions(arr);
        } else {
          setAssetOptions([]);
        }
      } catch (err) {
        console.error('Asset search error', err);
      } finally {
        if (active) setAssetSearchLoading(false);
      }
    }, 350);
    return () => { active = false; clearTimeout(handler); };
  }, [assetQuery]);

  // Reset to initial suppliers when search is cleared (re-fetch base list)
  useEffect(() => {
    if (supplierQuery.length === 0) {
      (async () => {
        try {
          const baseUrl = localStorage.getItem('baseUrl');
          const token = localStorage.getItem('token');
          if (!baseUrl || !token) return;
          setSupplierSearchLoading(true);
          const resp = await fetch(`https://${baseUrl}/pms/suppliers/get_suppliers.json`, { headers: { Authorization: `Bearer ${token}` } });
          if (resp.ok) {
            const data = await resp.json();
            const arr = Array.isArray(data) ? data : (Array.isArray(data?.pms_suppliers) ? data.pms_suppliers : (Array.isArray(data?.suppliers) ? data.suppliers : []));
            setSupplierOptions(arr);
          } else {
            setSupplierOptions([]);
          }
        } catch (e) {
          console.error('Suppliers reset load error', e);
          setSupplierOptions([]);
        } finally {
          setSupplierSearchLoading(false);
        }
      })();
    }
  }, [supplierQuery]);

  // Debounced remote search for suppliers on any input (1+ char)
  useEffect(() => {
    if (supplierQuery.length === 0) return;
    let active = true;
    const handler = setTimeout(async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        setSupplierSearchLoading(true);
        const url = `https://${baseUrl}/pms/suppliers/get_suppliers.json?q[company_name_cont]=${encodeURIComponent(supplierQuery)}`;
        const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!active) return;
        if (resp.ok) {
          const data = await resp.json();
          const arr = Array.isArray(data) ? data : (Array.isArray(data?.pms_suppliers) ? data.pms_suppliers : (Array.isArray(data?.suppliers) ? data.suppliers : []));
          setSupplierOptions(arr);
        } else {
          setSupplierOptions([]);
        }
      } catch (err) {
        console.error('Supplier search error', err);
      } finally {
        if (active) setSupplierSearchLoading(false);
      }
    }, 350);
    return () => { active = false; clearTimeout(handler); };
  }, [supplierQuery]);

  useEffect(() => {
    if (amcCreateSuccess) {
      dispatch(resetAmcCreate());
      setIsSubmitting(false);
      setSubmittingAction(null);
      // navigate('/maintenance/amc');
      window.scrollTo({ top: 0, behavior: 'smooth' });

    }
  }, [amcCreateSuccess, dispatch, navigate]);

  useEffect(() => {
    if (amcCreateError) {
      toast.error(amcCreateError);
      dispatch(resetAmcCreate());
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  }, [amcCreateError, dispatch]);

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

  // Step validation functions
  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = {
      asset_ids: '',
      group: '',
      supplier: '',
      service_ids: '',
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
        if (!formData.supplier) {
          newErrors.supplier = 'Please select a supplier.';
          isValid = false;
        }
      } else if (formData.details === 'Service' && formData.type === 'Individual') {
        if (!formData.service_ids || formData.service_ids.length === 0) {
          newErrors.service_ids = 'Please select a service.';
          isValid = false;
        }
        if (!formData.supplier) {
          newErrors.supplier = 'Please select a supplier.';
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
      group: '',
      supplier: '',
      service_ids: '',
      startDate: '',
      endDate: '',
      cost: '',
      contractName: '',
      paymentTerms: '',
      firstService: '',
      noOfVisits: ''
    };

    // AMC Configuration validation
    if (formData.details === 'Asset' && formData.type === 'Individual') {
      if (formData.asset_ids.length === 0) {
        newErrors.asset_ids = 'Please select at least one asset.';
        isValid = false;
      }
      if (!formData.supplier) {
        newErrors.supplier = 'Please select a supplier.';
        isValid = false;
      }
    } else if (formData.details === 'Service' && formData.type === 'Individual') {
      if (!formData.service_ids || formData.service_ids.length === 0) {
        newErrors.service_ids = 'Please select a service.';
        isValid = false;
      }
      if (!formData.supplier) {
        newErrors.supplier = 'Please select a supplier.';
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

    setErrors(newErrors);
    return isValid;
  };

  const showValidationToastForStep = (step: number) => {
    if (step === 0) {
      const missingFields: string[] = [];
      if (formData.details === 'Asset' && formData.type === 'Individual') {
        if (formData.asset_ids.length === 0) missingFields.push('Assets');
        if (!formData.supplier) missingFields.push('Supplier');
      } else if (formData.details === 'Service' && formData.type === 'Individual') {
        if (!formData.service_ids || formData.service_ids.length === 0) missingFields.push('Service');
        if (!formData.supplier) missingFields.push('Supplier');
      } else if (formData.type === 'Group') {
        if (!formData.group) missingFields.push('Group');
        if (!formData.supplier) missingFields.push('Supplier');
      }

      if (missingFields.length > 0) {
        toast.error(`Please fill the following mandatory fields: ${missingFields.join(', ')}`);
      } else {
        toast.error("Please fill all required fields in the AMC Configuration step.");
      }
    } else if (step === 1) {
      const missingFields: string[] = [];
      if (!formData.startDate) missingFields.push('Start Date');
      if (!formData.endDate) missingFields.push('End Date');
      if (!formData.firstService) missingFields.push('First Service Date');
      if (!formData.cost) missingFields.push('Cost');
      if (!formData.contractName) missingFields.push('Contract Name');
      if (!formData.paymentTerms) missingFields.push('Payment Terms');
      if (!formData.noOfVisits) missingFields.push('No. of Visits');

      if (missingFields.length > 0) {
        toast.error(`Please fill the following mandatory fields: ${missingFields.join(', ')}`);
      } else {
        toast.error("Please fill all required fields in the AMC Details step.");
      }
    } else {
      toast.error("Please fill all required fields in the current step.");
    }
  };

  const ensureCurrentStepValidWithToast = () => {
    const isValid = validateStep(currentStep);
    if (!isValid) {
      showValidationToastForStep(currentStep);
    }
    return isValid;
  };

  const saveDraftToStorage = (data: any) => {
    try {
      localStorage.setItem(AMC_DRAFT_STORAGE_KEY, JSON.stringify(data));
      setHasSavedDraft(true);
    } catch (error) {
      console.error('Failed to save AMC draft:', error);
      toast.error('Unable to save draft. Please check storage permissions.');
    }
  };

  const loadDraftFromStorage = () => {
    try {
      const raw = localStorage.getItem(AMC_DRAFT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Failed to load AMC draft:', error);
      return null;
    }
  };

  const clearDraftFromStorage = () => {
    localStorage.removeItem(AMC_DRAFT_STORAGE_KEY);
  };

  // Proceed to Save: go to next step directly or enter preview mode
  const handleProceedToSave = () => {
    if (!ensureCurrentStepValidWithToast()) {
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    if (currentStep === totalSteps - 1) {
      setIsPreviewMode(true);
      setShowPreviousSections(true);
    } else {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
      setShowPreviousSections(false);
    }
  };

  // Preview button handler - only for attachments step
  const handlePreview = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setIsPreviewMode(true);
      setShowPreviousSections(true);
    } else {
      toast.error("Please fill all required fields in the current step.");
    }
  };

  // Save to Draft: save current section data and move to next section
  const handleSaveToDraft = () => {
    if (!ensureCurrentStepValidWithToast()) {
      return;
    }

    const updatedCompletedSteps = completedSteps.includes(currentStep)
      ? completedSteps
      : [...completedSteps, currentStep];
    const resumeStep = currentStep < totalSteps - 1 ? currentStep + 1 : currentStep;

    const draftData = {
      formData,
      timeSetupData,
      currentStep: resumeStep,
      completedSteps: updatedCompletedSteps,
      showPreviousSections: true,
      isPreviewMode: currentStep === totalSteps - 1 ? isPreviewMode : false,
      savedAt: new Date().toISOString()
    };

    saveDraftToStorage(draftData);

    setCompletedSteps(updatedCompletedSteps);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(resumeStep);
    }
    setShowPreviousSections(true);

    toast.success("Progress saved to draft successfully!");
  };

  const handleContinueWithDraft = () => {
    const draft = loadDraftFromStorage();
    if (!draft) {
      setShowDraftModal(false);
      return;
    }

    if (draft.formData) {
      setFormData(draft.formData);
    }
    if (typeof draft.currentStep === 'number') {
      const safeStep = Math.min(Math.max(draft.currentStep, 0), totalSteps - 1);
      setCurrentStep(safeStep);
    }
    if (Array.isArray(draft.completedSteps)) {
      setCompletedSteps(draft.completedSteps);
    }
    if (draft.timeSetupData) {
      setTimeSetupData(draft.timeSetupData);
    }
    setShowPreviousSections(!!draft.showPreviousSections);
    setIsPreviewMode(!!draft.isPreviewMode);
    setShowDraftModal(false);

    toast.info("Draft restored! Continue from where you left off (attachments need re-upload).", {
      position: 'top-right',
      duration: 3000,
      style: {
        background: '#fff',
        color: 'black',
        border: 'none',
      },
    });
  };

  const handleStartFresh = () => {
    clearDraftFromStorage();
    setShowDraftModal(false);
    setHasSavedDraft(false);
    toast.info("Starting fresh! Previous draft has been cleared.", {
      position: 'top-right',
      duration: 3000,
      style: {
        background: '#fff',
        color: 'black',
        border: 'none',
      },
    });
  };

  // Step navigation functions
  const goToNextStep = () => {
    if (!ensureCurrentStepValidWithToast()) {
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Show previous sections when going back
      setShowPreviousSections(true);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step);
      // Show previous sections when navigating to steps
      setShowPreviousSections(true);
    }
  };

  const validateCurrentStep = () => {
    return validateStep(currentStep);
  };

  // Handle step click - from Add Schedule page
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
          toast.error(`Please complete step ${i + 1} before proceeding to step ${step + 1}.`);
          return;
        }
      }

      // Validate current step before allowing navigation to next step
      if (step === currentStep + 1 && !validateCurrentStep()) {
        toast.error(`Please complete all required fields in step ${currentStep + 1} before proceeding to step ${step + 1}.`);
        return;
      }
    }

    if (step > currentStep) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
        // Show success message for the completed step
        const stepMessages = {
          0: "AMC Configuration completed successfully!",
          1: "AMC Details completed successfully!",
          2: "Schedule completed successfully!",
          3: "Attachments completed successfully!"
        };
        const currentStepMessage = stepMessages[currentStep as keyof typeof stepMessages];
        if (currentStepMessage) {
          toast.success(currentStepMessage, {
            position: 'top-right',
            duration: 4000,
            style: {
              background: '#fff',
              color: 'black',
              border: 'none',
            },
          });
        }
      }
    }
    setCurrentStep(step);
    // Hide previous sections when navigating via stepper
    setShowPreviousSections(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async (action: 'show' | 'schedule') => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmittingAction(action);

    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      setIsSubmitting(false);
      setSubmittingAction(null);
      return;
    }

    const sendData = new FormData();
    // sendData.append('pms_asset_amc);

    sendData.append('pms_asset_amc[supplier_id]', formData.supplier);
    sendData.append('pms_asset_amc[checklist_type]', formData.details);
    sendData.append('pms_asset_amc[amc_cost]', formData.cost);
    sendData.append('pms_asset_amc[contract_name]', formData.contractName);
    sendData.append('pms_asset_amc[amc_start_date]', formData.startDate);
    sendData.append('pms_asset_amc[amc_end_date]', formData.endDate);
    sendData.append('pms_asset_amc[amc_first_service]', formData.firstService);
    sendData.append('pms_asset_amc[payment_term]', formData.paymentTerms);
    sendData.append('pms_asset_amc[no_of_visits]', formData.noOfVisits);
    sendData.append('pms_asset_amc[remarks]', formData.remarks);
    sendData.append('pms_asset_amc[checklist_type]', formData.details === 'Asset' ? "Asset" : "Service");
    sendData.append('pms_asset_amc[time_expression]', buildCronExpression());

    sendData.append('pms_asset_amc[amc_details_type]', formData.type.toLowerCase()); // Add amc_details_type parameter

    if (action === 'schedule') {
      sendData.append('pms_asset_amc[schedule_immediately]', 'true');
    }

    if (formData.details === 'Asset' || formData.details === 'Service') {
      if (formData.type === 'Group' && formData.group) {
        sendData.append('group_id', formData.group);
        if (formData.subgroup) {
          sendData.append('sub_group_id', formData.subgroup);
        }
      }
    }

    // Include selected asset IDs for Individual Asset flow
    if (formData.details === 'Asset' && formData.type === 'Individual' && Array.isArray(formData.asset_ids) && formData.asset_ids.length > 0) {
      formData.asset_ids.forEach((id) => {
        // Append as array param
        sendData.append('asset_ids[]', String(id));
      });
    }

    // Service (Individual) specific parameter - pass service_ids as array
    if (formData.details === 'Service') {
      if (formData.type === 'Individual' && Array.isArray(formData.service_ids) && formData.service_ids.length > 0) {
        formData.service_ids.forEach((id) => {
          // Append as array param, matching asset_ids pattern
          sendData.append('service_ids[]', String(id));
        });
      }
    }

    // Pass technician_id as single value
    if (formData.technician) {
      sendData.append('technician_id', String(formData.technician));
    }

    attachments.contracts.forEach((file) => {
      sendData.append('amc_contracts[content][]', file);
    });

    attachments.invoices.forEach((file) => {
      sendData.append('amc_invoices[content][]', file);
    });

    try {
      const result = await dispatch(createAMC(sendData)).unwrap();

      if (action === 'show') {
        const amcId = result?.id;
        if (amcId) {
          navigate(`/maintenance/amc/details/${amcId}`);
        } else {
          const errorMessage =
            result?.message || result?.error || "AMC created, but no ID returned for redirection.";
          toast.error(errorMessage);
        }
      }
      else if (action === 'schedule') {
        const amcId = result?.id;
        if (!amcId) {
          const errorMessage =
            result?.message || result?.error || result?.errors?.[0] || "AMC was not scheduled: no ID returned.";
          toast.error(errorMessage);
          return;
        }

        setFormData({
          details: 'Asset',
          type: 'Individual',
          assetName: '',
          asset_ids: [],
          group: '',
          subgroup: '',
          service_ids: [],
          supplier: '',
          technician: '',
          startDate: '',
          endDate: '',
          cost: '',
          contractName: '',
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
          group: '',
          supplier: '',
          service_ids: '',
          startDate: '',
          endDate: '',
          cost: '',
          contractName: '',
          paymentTerms: '',
          firstService: '',
          noOfVisits: ''
        });
        setTimeSetupData(initialTimeSetupState);
        toast.success("AMC has been successfully created and scheduled.");
        navigate(`/maintenance/amc/details/${amcId}`);
        return;
      }
    } catch (error: any) {
      toast.error(`Failed to create AMC: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };

  // Field styles - matching Add Schedule page
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

  // Custom input styles for non-Material-UI elements
  const inputStyles = "w-full h-[40px] px-3 py-2 border border-[#ddd] rounded-md bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] disabled:bg-gray-50 disabled:text-gray-500";
  const labelStyles = "block text-sm font-semibold text-[#1a1a1a] mb-2";
  const errorStyles = "text-red-500 text-sm mt-1";

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

  console.log(assetList)

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
        'Sunday': '1',
        'Monday': '2',
        'Tuesday': '3',
        'Wednesday': '4',
        'Thursday': '5',
        'Friday': '6',
        'Saturday': '7'
      };
      dayOfWeek = timeSetupData.selectedWeekdays.map(day => weekdayMap[day]).join(',');
      dayOfMonth = '?';
    } else if (timeSetupData.dayMode === 'specific' && timeSetupData.selectedDays.length > 0) {
      dayOfMonth = timeSetupData.selectedDays.join(',');
      dayOfWeek = '?';
    }

    if (timeSetupData.monthMode === 'specific' && timeSetupData.selectedMonths.length > 0) {
      const monthMap: Record<string, string> = {
        'January': '1',
        'February': '2',
        'March': '3',
        'April': '4',
        'May': '5',
        'June': '6',
        'July': '7',
        'August': '8',
        'September': '9',
        'October': '10',
        'November': '11',
        'December': '12'
      };
      month = timeSetupData.selectedMonths.map(m => monthMap[m]).join(',');
    } else if (timeSetupData.monthMode === 'between') {
      const monthMap: Record<string, number> = {
        'January': 1,
        'February': 2,
        'March': 3,
        'April': 4,
        'May': 5,
        'June': 6,
        'July': 7,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12
      };
      const startMonth = monthMap[timeSetupData.betweenMonthStart];
      const endMonth = monthMap[timeSetupData.betweenMonthEnd];
      if (startMonth && endMonth) {
        month = `${startMonth}-${endMonth}`;
      }
    }

    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  };

  // Stepper component - Matching schedule page design
  const StepperComponent = () => {
    const steps = ['AMC Configuration', 'AMC Details', 'Schedule', 'Attachments'];

    return (
      <Box sx={{ mb: 4 }}>
        {/* Main Stepper - Show all steps with proper progression */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: 0 // Remove gap between stepper boxes
        }}>
          {steps.map((label, index) => (
            <Box key={`step-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Stepper Border Padding Box */}
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
                {/* Inner Stepper Box */}
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
                    // Responsive width adjustments
                    '@media (max-width: 1200px)': {
                      width: '40px'
                    },
                    '@media (max-width: 900px)': {
                      width: '30px'
                    },
                    '@media (max-width: 600px)': {
                      width: '20px'
                    }
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const getServiceNamesFromIds = (idsInput?: Array<string | number>) => {
    const source = Array.isArray(idsInput)
      ? idsInput
      : (Array.isArray(formData.service_ids) ? formData.service_ids : []);
    if (!source.length) return '';

    return source
      .map(id => {
        const idStr = id?.toString?.() || '';
        if (!idStr) return '';
        const match = services.find(service => service.id?.toString() === idStr);
        return match?.service_name || '';
      })
      .filter(Boolean)
      .join(', ');
  };

  const renderServiceSelectValue = (selected: any) => {
    const ids = Array.isArray(selected) ? selected : [];
    const label = getServiceNamesFromIds(ids);
    if (!label) {
      return <span style={{ color: '#aaa' }}>Select Services</span>;
    }
    return label;
  };

  // Render completed sections (similar to Add Schedule page)
  const renderCompletedSections = () => {
    if (completedSteps.length === 0) return null;

    return (
      <div className="mt-8">
        {/* Completed Steps with Actual Content */}
        <div className="space-y-4">
          {completedSteps.map((stepIndex) => (
            <div
              key={`completed-section-${stepIndex}`}
              className="mb-4"
            >
              {/* Step Header */}
              {/* <div className="flex items-center mb-4">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3 font-medium">
                  ✓
                </span>
                <h3 className="text-[#C72030]" style={{ 
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '26px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}>
                  {stepIndex === 0 && 'AMC Configuration'}
                  {stepIndex === 1 && 'AMC Details'}
                  {stepIndex === 2 && 'Schedule'}
                  {stepIndex === 3 && 'Attachments'}
                </h3>
              </div> */}

              {/* Step Content - AMC Configuration */}
              {stepIndex === 0 && (
                <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                  borderRadius: '4px',
                  background: '#FFF',
                  boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
                }}>
                  <CardHeader className="bg-[#F6F4EE] ">
                    <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                      <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">1</span>
                      AMC CONFIGURATION
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Details</label>
                      <div className="flex gap-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="details"
                            value="Asset"
                            checked={formData.details === 'Asset'}
                            readOnly
                                                    disabled
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                          />
                          <span className="text-[#1a1a1a] font-medium">Asset</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="details"
                            value="Service"
                            checked={formData.details === 'Service'}
                            readOnly
                                                    disabled
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                          />
                          <span className="text-[#1a1a1a] font-medium">Service</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Type</label>
                      <div className="flex gap-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value="Individual"
                            checked={formData.type === 'Individual'}
                            readOnly
                                                    disabled
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                          />
                          <span className="text-[#1a1a1a] font-medium">Individual</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value="Group"
                            checked={formData.type === 'Group'}
                            readOnly
                                                    disabled
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                          />
                          <span className="text-[#1a1a1a] font-medium">Group</span>
                        </label>
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
                              readOnly
                                                      disabled
                              renderValue={(selected) => {
                                if (!selected || selected.length === 0) {
                                  return <span style={{ color: '#aaa' }}>Select Assets</span>;
                                }
                                const all = [...(assetList || []), ...(assetOptions || [])];
                                const map = new Map<number, string>();
                                all.forEach(a => map.set(Number(a.id), a.name));
                                const labels = (selected as number[]).map(id => map.get(Number(id)) || String(id));
                                return labels.join(', ');
                              }}
                            >
                              <MenuItem value="">Select Assets</MenuItem>
                              {assetOptions.map((a) => (
                                <MenuItem key={a.id} value={Number(a.id)}>
                                  {a.name}
                                </MenuItem>
                              ))}
                            </MuiSelect>
                          </FormControl>
                        ) : (
                          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                            <InputLabel shrink>Service <span style={{ color: '#C72030' }}>*</span></InputLabel>
                            <MuiSelect
                              multiple
                              label="Service"
                              notched
                              displayEmpty
                              value={formData.service_ids}
                              readOnly
                                                      disabled
                              renderValue={renderServiceSelectValue}
                            >
                              <MenuItem value=""><em>Select a Service...</em></MenuItem>
                              {Array.isArray(services) && services.map((service) => (
                                <MenuItem key={service.id} value={service.id}>
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
                            value={formData.supplier}
                            readOnly
                                                    disabled
                          >
                            <MenuItem value=""><em>Select Supplier</em></MenuItem>
                            {Array.isArray(supplierOptions) && supplierOptions.map((supplier) => (
                              <MenuItem key={supplier.id} value={supplier.id?.toString?.() || String(supplier.id)}>
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
                            readOnly
                                                    disabled
                          >
                            <MenuItem value=""><em>Select Technician</em></MenuItem>
                            {Array.isArray(technicianOptions) && technicianOptions.map((technician) => (
                              <MenuItem key={technician.id} value={technician.id?.toString?.() || String(technician.id)}>
                                {technician.full_name || technician.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                            <InputLabel shrink>Group</InputLabel>
                            <MuiSelect
                              label="Group"
                              displayEmpty
                              value={formData.group}
                              readOnly
                                                      disabled
                            >
                              <MenuItem value=""><em>Select Group</em></MenuItem>
                              {Array.isArray(assetGroups) && assetGroups.map((group) => (
                                <MenuItem key={group.id} value={group.id.toString()}>
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
                              readOnly
                                                      disabled
                            >
                              <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                              {Array.isArray(subGroups) && subGroups.map((subGroup) => (
                                <MenuItem key={subGroup.id} value={subGroup.id.toString()}>
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
                              readOnly
                                                      disabled
                            >
                              <MenuItem value=""><em>Select Supplier</em></MenuItem>
                              {Array.isArray(supplierOptions) && supplierOptions.map((supplier) => (
                                <MenuItem key={supplier.id} value={supplier.id.toString()}>
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
                              readOnly
                                                      disabled
                            >
                              <MenuItem value=""><em>Select Technician</em></MenuItem>
                              {Array.isArray(technicianOptions) && technicianOptions.map((technician) => (
                                <MenuItem key={technician.id} value={technician.id?.toString?.() || String(technician.id)}>
                                  {technician.full_name || technician.name}
                                </MenuItem>
                              ))}
                            </MuiSelect>
                          </FormControl>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step Content - AMC Details */}
              {stepIndex === 1 && (
                <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                  borderRadius: '4px',
                  background: '#FFF',
                  boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
                }}>
                  <CardHeader className="bg-[#F6F4EE] ">
                    <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                      <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">2</span>
                      AMC DETAILS
                    </CardTitle>
                  </CardHeader>
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

                      <div></div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step Content - Schedule */}
              {stepIndex === 2 && (
                <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                  borderRadius: '4px',
                  background: '#FFF',
                  boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
                }}>
                  <CardHeader className="bg-[#F6F4EE] ">
                    <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                      <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">3</span>
                      SCHEDULE
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <TimeSetupStep data={timeSetupData} hideTitle disabled showEditButton={false} />
                  </CardContent>
                </Card>
              )}

              {/* Step Content - Attachments */}
              {stepIndex === 3 && (
                <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                  borderRadius: '4px',
                  background: '#FFF',
                  boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
                }}>
                  <CardHeader className="bg-[#F6F4EE] ">
                    <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                      <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">4</span>
                      ATTACHMENTS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold mb-4 text-[#1a1a1a]">AMC Contracts</label>
                        <div className="border-2 border-dashed border-[#D9D9D9] rounded-lg p-6 text-center">
                          <p className="text-sm text-gray-600">
                            {attachments.contracts.length} file(s) uploaded
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-4 text-[#1a1a1a]">AMC Invoices</label>
                        <div className="border-2 border-dashed border-[#D9D9D9] rounded-lg p-6 text-center">
                          <p className="text-sm text-gray-600">
                            {attachments.invoices.length} file(s) uploaded
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      <div className="p-6">
        {/* <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/maintenance/amc')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC List
        </Button>
          <h1 className="flex items-center" style={{
            color: '#C72030',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '26px',
            fontWeight: 600,
            lineHeight: 'normal'
          }}>
            <span className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">
              ⚙️
            </span>
            AMC Configuration
          </h1>
        </div> */}

        {/* Stepper Component - Hide in preview mode */}
        {!isPreviewMode && <StepperComponent />}

        {/* Preview Mode - Show all sections */}
        {isPreviewMode && (
          <div className="px-4 md:px-6 py-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center mb-6">
              <span className="font-bold text-orange-600">Preview</span>
            </div>

            {/* AMC Configuration Preview */}
            <div className="mb-4">
              {/* Step Header */}
              <div className="flex items-center mb-4">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3 font-medium">
                  ✓
                </span>
                <h3 className="text-[#C72030]" style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '26px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}>
                  AMC Configuration
                </h3>
              </div>



              {/* Step Content - AMC Configuration (single card) */}
              <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                borderRadius: '4px',
                background: '#FFF',
                boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
              }}>
                {/* <CardHeader className="bg-[#F6F4EE] ">
                  <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                    <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">1</span>
                    AMC CONFIGURATION
                  </CardTitle>
                </CardHeader> */}
                <CardContent className="space-y-6 p-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Details</label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="details"
                          value="Asset"
                          checked={formData.details === 'Asset'}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                          disabled
                        />
                        <span className="text-[#1a1a1a] font-medium">Asset</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="details"
                          value="Service"
                          checked={formData.details === 'Service'}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                          disabled
                        />
                        <span className="text-[#1a1a1a] font-medium">Service</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Type</label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="Individual"
                          checked={formData.type === 'Individual'}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                          disabled
                        />
                        <span className="text-[#1a1a1a] font-medium">Individual</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="Group"
                          checked={formData.type === 'Group'}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                          disabled
                        />
                        <span className="text-[#1a1a1a] font-medium">Group</span>
                      </label>
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
                            readOnly
                            disabled
                            renderValue={(selected) => {
                              if (!selected || selected.length === 0) {
                                return <span style={{ color: '#aaa' }}>Select Assets</span>;
                              }
                              const all = [...(assetList || []), ...(assetOptions || [])];
                              const map = new Map<number, string>();
                              all.forEach(a => map.set(Number(a.id), a.name));
                              const labels = (selected as number[]).map(id => map.get(Number(id)) || String(id));
                              return labels.join(', ');
                            }}
                          >
                            <MenuItem value="">Select Assets</MenuItem>
                            {assetOptions.map((a) => (
                              <MenuItem key={a.id} value={Number(a.id)}>
                                {a.name}
                              </MenuItem>
                            ))}

                          </MuiSelect>
                        </FormControl>
                      ) : (
                        <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                          <InputLabel shrink>Service <span style={{ color: '#C72030' }}>*</span></InputLabel>
                          <MuiSelect
                            multiple
                            label="Service"
                            notched
                            displayEmpty
                            value={formData.service_ids}
                            disabled
                            renderValue={renderServiceSelectValue}
                          >
                            <MenuItem value=""><em>Select a Service...</em></MenuItem>
                            {Array.isArray(services) && services.map((service) => (
                              <MenuItem key={service.id} value={service.id}>
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
                          value={formData.supplier}
                          readOnly
                          disabled
                        >
                          <MenuItem value=""><em>Select Supplier</em></MenuItem>
                          {Array.isArray(supplierOptions) && supplierOptions.map((supplier) => (
                            <MenuItem key={supplier.id} value={supplier.id?.toString?.() || String(supplier.id)}>
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
                          {Array.isArray(technicianOptions) && technicianOptions.map((technician) => (
                            <MenuItem key={technician.id} value={technician.id?.toString?.() || String(technician.id)}>
                              {technician.full_name || technician.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                          <InputLabel shrink>Group</InputLabel>
                          <MuiSelect
                            label="Group"
                            displayEmpty
                            value={formData.group}
                            readOnly
                            disabled
                          >
                            <MenuItem value=""><em>Select Group</em></MenuItem>
                            {Array.isArray(assetGroups) && assetGroups.map((group) => (
                              <MenuItem key={group.id} value={group.id.toString()}>
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
                            readOnly
                            disabled
                          >
                            <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                            {Array.isArray(subGroups) && subGroups.map((subGroup) => (
                              <MenuItem key={subGroup.id} value={subGroup.id.toString()}>
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
                            readOnly
                            disabled
                          >
                            <MenuItem value=""><em>Select Supplier</em></MenuItem>
                            {Array.isArray(supplierOptions) && supplierOptions.map((supplier) => (
                              <MenuItem key={supplier.id} value={supplier.id.toString()}>
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
                            {Array.isArray(technicianOptions) && technicianOptions.map((technician) => (
                              <MenuItem key={technician.id} value={technician.id?.toString?.() || String(technician.id)}>
                                {technician.full_name || technician.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* AMC Details Preview */}
            <div className="mb-4">
              {/* Step Header */}
              <div className="flex items-center mb-4">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3 font-medium">
                  ✓
                </span>
                <h3 className="text-[#C72030]" style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '26px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}>
                  AMC Details
                </h3>
              </div>

              {/* Step Content - AMC Details */}
              <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                borderRadius: '4px',
                background: '#FFF',
                boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
              }}>
                {/* <CardHeader className="bg-[#F6F4EE] ">
                  <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                    <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">2</span>
                    AMC DETAILS
                  </CardTitle>
                </CardHeader> */}
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

                    <div></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule Preview */}
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3 font-medium">
                  ✓
                </span>
                <h3 className="text-[#C72030]" style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '26px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}>
                  Schedule
                </h3>
              </div>
              <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                borderRadius: '4px',
                background: '#FFF',
                boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
              }}>
                {/* <CardHeader className="bg-[#F6F4EE] ">
                    <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                      <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">3</span>
                      SCHEDULE
                    </CardTitle>
                  </CardHeader> */}
                <CardContent className="p-4">
                  <TimeSetupStep data={timeSetupData} hideTitle disabled showEditButton={false} />
                </CardContent>
              </Card>
            </div>

            {/* Attachments Preview */}
            <div className="mb-6">
              {/* Step Header */}
              <div className="flex items-center mb-4">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3 font-medium">
                  ✓
                </span>
                <h3 className="text-[#C72030]" style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '26px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}>
                  Attachments
                </h3>
              </div>

              {/* Step Content - Attachments */}
              <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm" style={{
                borderRadius: '4px',
                background: '#FFF',
                boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
              }}>
                {/* <CardHeader className="bg-[#F6F4EE] ">
                  <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                    <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">4</span>
                    ATTACHMENTS
                  </CardTitle>
                </CardHeader> */}
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold mb-4 text-[#1a1a1a]">AMC Contracts</label>
                      <div className="border-2 border-dashed border-[#D9D9D9] rounded-lg p-6 min-h-[200px]">
                        {attachments.contracts.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {attachments.contracts.map((file, index) => {
                              const isImage = file.type.startsWith('image/');
                              const isPdf = file.type === 'application/pdf';
                              const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                              const fileURL = URL.createObjectURL(file);

                              return (
                                <div
                                  key={`${file.name}-${file.lastModified}`}
                                  className="relative flex flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
                                >
                                  {isImage ? (
                                    <img
                                      src={fileURL}
                                      alt={file.name}
                                      className="w-[80px] h-[80px] object-cover rounded border mb-1"
                                    />
                                  ) : isPdf ? (
                                    <div className="w-20 h-20 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                                      <FileText className="w-8 h-8" />
                                    </div>
                                  ) : isExcel ? (
                                    <div className="w-20 h-20 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                                      <FileSpreadsheet className="w-8 h-8" />
                                    </div>
                                  ) : (
                                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded text-gray-500 mb-1">
                                      <FileText className="w-8 h-8" />
                                    </div>
                                  )}
                                  <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                                  <button
                                    type="button"
                                    className="absolute top-1 right-1 h-6 w-6 p-0 text-gray-600 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-100 hover:text-red-600"
                                    onClick={() => removeFile('contracts', index)}
                                    disabled={isSubmitting}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-gray-500">No files uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-4 text-[#1a1a1a]">AMC Invoices</label>
                      <div className="border-2 border-dashed border-[#D9D9D9] rounded-lg p-6 min-h-[200px]">
                        {attachments.invoices.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {attachments.invoices.map((file, index) => {
                              const isImage = file.type.startsWith('image/');
                              const isPdf = file.type === 'application/pdf';
                              const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                              const fileURL = URL.createObjectURL(file);

                              return (
                                <div
                                  key={`${file.name}-${file.lastModified}`}
                                  className="relative flex flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
                                >
                                  {isImage ? (
                                    <img
                                      src={fileURL}
                                      alt={file.name}
                                      className="w-[80px] h-[80px] object-cover rounded border mb-1"
                                    />
                                  ) : isPdf ? (
                                    <div className="w-20 h-20 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                                      <FileText className="w-8 h-8" />
                                    </div>
                                  ) : isExcel ? (
                                    <div className="w-20 h-20 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                                      <FileSpreadsheet className="w-8 h-8" />
                                    </div>
                                  ) : (
                                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded text-gray-500 mb-1">
                                      <FileText className="w-8 h-8" />
                                    </div>
                                  )}
                                  <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                                  <button
                                    type="button"
                                    className="absolute top-1 right-1 h-6 w-6 p-0 text-gray-600 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-100 hover:text-red-600"
                                    onClick={() => removeFile('invoices', index)}
                                    disabled={isSubmitting}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-gray-500">No files uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Mode Buttons */}
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
                onClick={async () => {
                  // Validate form before submitting
                  if (!validateForm()) {
                    toast.error("Please fill all required fields before saving.");
                    return;
                  }

                  try {
                    setIsSubmitting(true);
                    setSubmittingAction('schedule');
                    await handleSubmit('schedule');
                    toast.success('AMC saved successfully!');
                    setIsPreviewMode(false);
                  } catch (error) {
                    console.error('Error saving AMC:', error);
                    toast.error('Failed to save AMC. Please try again.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="px-6 py-2 font-medium disabled:opacity-50"
                style={{
                  backgroundColor: '#C72030',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Saving...
                  </>
                ) : (
                  'Proceed to Save'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: AMC Configuration */}
        {currentStep === 0 && (
          <>
            {/* Header above card */}
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
              <CardContent className="space-y-6 p-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-[#1a1a1a]">Details</label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="details"
                        value="Asset"
                        checked={formData.details === 'Asset'}
                        onChange={e => handleInputChange('details', e.target.value)}
                        className="mr-2 w-4 h-4"
                        style={{ accentColor: '#C72030' }}
                        disabled={isSubmitting}
                      />
                      <span className="text-[#1a1a1a] font-medium">Asset</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="details"
                        value="Service"
                        checked={formData.details === 'Service'}
                        onChange={e => handleInputChange('details', e.target.value)}
                        className="mr-2 w-4 h-4"
                        style={{ accentColor: '#C72030' }}
                        disabled={isSubmitting}
                      />
                      <span className="text-[#1a1a1a] font-medium">Service</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-[#1a1a1a]">Type</label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="Individual"
                        checked={formData.type === 'Individual'}
                        onChange={e => handleInputChange('type', e.target.value)}
                        className="mr-2 w-4 h-4"
                        style={{ accentColor: '#C72030' }}
                        disabled={isSubmitting}
                      />
                      <span className="text-[#1a1a1a] font-medium">Individual</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="Group"
                        checked={formData.type === 'Group'}
                        onChange={e => handleInputChange('type', e.target.value)}
                        className="mr-2 w-4 h-4"
                        style={{ accentColor: '#C72030' }}
                        disabled={isSubmitting}
                      />
                      <span className="text-[#1a1a1a] font-medium">Group</span>
                    </label>
                  </div>
                </div>

                {formData.type === 'Individual' ? (
                  <>
                    {formData.details === 'Asset' ? (
                      <FormControl fullWidth variant="outlined" error={!!errors.asset_ids} sx={{ '& .MuiInputBase-root': fieldStyles }}>
                        <InputLabel shrink>Assets <span style={{ color: '#C72030' }}>*</span></InputLabel>
                        <MuiSelect
                          multiple
                          label="Assets"
                          notched
                          displayEmpty
                          value={formData.asset_ids}
                          onChange={(e) => {
                            const val = e.target.value as (string[] | number[]);
                            const ids = (Array.isArray(val) ? val : []).map(v => Number(v));
                            setFormData(prev => ({ ...prev, asset_ids: ids }));
                            setErrors(prev => ({ ...prev, asset_ids: '' }));
                          }}
                          renderValue={(selected) => {
                            if (!selected || selected.length === 0) {
                              return <span style={{ color: '#aaa' }}>Select Assets</span>;
                            }
                            const all = [...(assetList || []), ...(assetOptions || [])];
                            const map = new Map<number, string>();
                            all.forEach(a => map.set(Number(a.id), a.name));
                            const labels = (selected as number[]).map(id => map.get(Number(id)) || String(id));
                            return labels.join(', ');
                          }}
                          disabled={isSubmitting}
                        >
                          <MenuItem disabled>
                            {assetQuery.length > 0 && assetQuery.length < 3
                              ? 'Type at least 3 characters…'
                              : (assetSearchLoading ? 'Searching…' : 'Select assets')}
                          </MenuItem>
                          {assetOptions.map((a) => (
                            <MenuItem key={a.id} value={Number(a.id)}>
                              {a.name}
                            </MenuItem>
                          ))}
                          {!assetSearchLoading && assetOptions.length === 0 && (
                            <MenuItem disabled>No results</MenuItem>
                          )}
                        </MuiSelect>
                        {errors.asset_ids && <FormHelperText>{errors.asset_ids}</FormHelperText>}
                      </FormControl>
                    ) : (
                      <FormControl fullWidth variant="outlined" error={!!errors.service_ids} sx={{ '& .MuiInputBase-root': fieldStyles }}>
                        <InputLabel shrink>Service <span style={{ color: '#C72030' }}>*</span></InputLabel>
                        <MuiSelect
                          label="Service"
                          displayEmpty
                          multiple
                          value={formData.service_ids}
                          onChange={e => {
                            const values = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                            const serviceIdArray: number[] = [];
                            values.forEach(v => {
                              const num = typeof v === 'string' ? parseInt(v, 10) : v;
                              if (!isNaN(num)) serviceIdArray.push(num);
                            });
                            setFormData(prev => ({
                              ...prev,
                              service_ids: serviceIdArray
                            }));
                          }}
                          disabled={loading || servicesLoading || isSubmitting}
                        >
                          <MenuItem value=""><em>Select Services...</em></MenuItem>
                          {Array.isArray(services) && services.map((service) => (
                            <MenuItem key={service.id} value={service.id}>
                              {service.service_name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                        {errors.service_ids && <FormHelperText>{errors.service_ids}</FormHelperText>}
                      </FormControl>
                    )}

                    <FormControl fullWidth variant="outlined" error={!!errors.supplier} sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Supplier <span style={{ color: '#C72030' }}>*</span></InputLabel>
                      <MuiSelect
                        label="Supplier"
                        displayEmpty
                        value={formData.supplier}
                        onChange={e => handleInputChange('supplier', e.target.value)}
                        disabled={loading || suppliersLoading || isSubmitting}
                      >
                        <MenuItem value=""><em>Select Supplier</em></MenuItem>
                        {supplierSearchLoading && <MenuItem disabled>Searching…</MenuItem>}
                        {!supplierSearchLoading && supplierOptions.length === 0 && (
                          <MenuItem disabled>No results</MenuItem>
                        )}
                        {Array.isArray(supplierOptions) && supplierOptions.map((supplier) => (
                          <MenuItem key={supplier.id} value={supplier.id?.toString?.() || String(supplier.id)}>
                            {supplier.company_name || supplier.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                      {errors.supplier && <FormHelperText>{errors.supplier}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Technician</InputLabel>
                      <MuiSelect
                        label="Technician"
                        displayEmpty
                        value={formData.technician}
                        onChange={e => handleInputChange('technician', e.target.value)}
                        disabled={loading || techniciansLoading || isSubmitting}
                      >
                        <MenuItem value=""><em>Select Technician</em></MenuItem>
                        {Array.isArray(technicianOptions) && technicianOptions.map((technician) => (
                          <MenuItem key={technician.id} value={technician.id.toString()}>
                            {technician.full_name || technician.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormControl fullWidth variant="outlined" error={!!errors.group} sx={{ '& .MuiInputBase-root': fieldStyles }}>
                        <InputLabel shrink>Group</InputLabel>
                        <MuiSelect
                          label="Group"
                          displayEmpty
                          value={formData.group}
                          onChange={e => handleGroupChange(e.target.value)}
                          disabled={loading || isSubmitting}
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

                      <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                        <InputLabel shrink>SubGroup</InputLabel>
                        <MuiSelect
                          label="SubGroup"
                          displayEmpty
                          value={formData.subgroup}
                          onChange={e => handleInputChange('subgroup', e.target.value)}
                          disabled={!formData.group || loading || isSubmitting}
                        >
                          <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                          {Array.isArray(subGroups) && subGroups.map((subGroup) => (
                            <MenuItem key={subGroup.id} value={subGroup.id.toString()}>
                              {subGroup.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>

                      <FormControl fullWidth variant="outlined" error={!!errors.supplier} sx={{ '& .MuiInputBase-root': fieldStyles }}>
                        <InputLabel shrink>Supplier <span style={{ color: '#C72030' }}>*</span></InputLabel>
                        <MuiSelect
                          label="Supplier"
                          displayEmpty
                          value={formData.supplier}
                          onChange={e => handleInputChange('supplier', e.target.value)}
                          disabled={loading || suppliersLoading || isSubmitting}
                        >
                          <MenuItem value=""><em>Select Supplier</em></MenuItem>
                          {Array.isArray(supplierOptions) && supplierOptions.map((supplier) => (
                            <MenuItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.company_name || supplier.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                        {errors.supplier && <FormHelperText>{errors.supplier}</FormHelperText>}
                      </FormControl>

                      <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                        <InputLabel shrink>Technician</InputLabel>
                        <MuiSelect
                          label="Technician"
                          displayEmpty
                          value={formData.technician}
                          onChange={e => handleInputChange('technician', e.target.value)}
                          disabled={loading || techniciansLoading || isSubmitting}
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
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 2: AMC Details */}
        {currentStep === 1 && (
          <>
            {/* Header above card */}
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
                  <TextField
                    disabled={isSubmitting}
                    label={<span>Contract Name <span style={{ color: 'red' }}>*</span></span>}
                    placeholder="Enter Contract Name"
                    fullWidth
                    value={formData.contractName}
                    onChange={e => handleInputChange('contractName', e.target.value)}
                    error={!!errors.contractName}
                    helperText={errors.contractName}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    disabled={isSubmitting}
                    label={<span>Start Date <span style={{ color: 'red' }}>*</span></span>}
                    type="date"
                    fullWidth
                    value={formData.startDate || ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    disabled={!formData.startDate || isSubmitting}
                    label={<span>End Date <span style={{ color: 'red' }}>*</span></span>}
                    type="date"
                    fullWidth
                    value={formData.endDate || ''}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    inputProps={{ min: formData.startDate || undefined }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                    sx={{ mb: 3 }}
                  />

                  {/* Row 2: First Service Date | Payment Terms | AMC Cost */}
                  <TextField
                    disabled={isSubmitting}
                    label={<span>First Service Date <span style={{ color: 'red' }}>*</span></span>}
                    type="date"
                    fullWidth
                    value={formData.firstService || ''}
                    onChange={(e) => handleInputChange('firstService', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.firstService}
                    helperText={errors.firstService}
                    sx={{ mb: 3 }}
                  />

                  <FormControl fullWidth variant="outlined" error={!!errors.paymentTerms} sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Payment Terms <span style={{ color: '#C72030' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Payment Terms"
                      displayEmpty
                      value={formData.paymentTerms}
                      onChange={e => handleInputChange('paymentTerms', e.target.value)}
                      disabled={isSubmitting}
                    >
                      <MenuItem value=""><em>Select Payment Terms</em></MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="quarterly">Quarterly</MenuItem>
                      <MenuItem value="half-yearly">Half Yearly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                      <MenuItem value="full_payment">Full Payment</MenuItem>
                      <MenuItem value="visit_based_payment">Visit Based Payment</MenuItem>
                    </MuiSelect>
                    {errors.paymentTerms && <FormHelperText>{errors.paymentTerms}</FormHelperText>}
                  </FormControl>

                  <TextField
                    disabled={isSubmitting}
                    label={<span>Cost <span style={{ color: 'red' }}>*</span></span>}
                    placeholder="Enter Cost"
                    type="number"
                    fullWidth
                    value={formData.cost}
                    onChange={e => handleInputChange('cost', e.target.value)}
                    error={!!errors.cost}
                    helperText={errors.cost}
                    sx={{ mb: 3 }}
                  />

                  {/* Row 3: No. of Visits | Remarks */}
                  <TextField
                    disabled={isSubmitting}
                    label={<span>No. of Visits <span style={{ color: 'red' }}>*</span></span>}
                    placeholder="Enter No. of Visits"
                    type="number"
                    fullWidth
                    value={formData.noOfVisits}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleInputChange('noOfVisits', value);
                      }
                    }}
                    error={!!errors.noOfVisits}
                    helperText={errors.noOfVisits}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    disabled={isSubmitting}
                    label="Remarks"
                    placeholder="Enter Remarks"
                    fullWidth
                    value={formData.remarks}
                    onChange={e => handleInputChange('remarks', e.target.value)}
                    sx={{ mb: 3 }}
                  />

                  {/* Empty column to match the 3-column layout */}
                  <div></div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: Schedule */}
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
                {/* Selected time summary */}
                {(() => {
                  const joinOrAll = (arr: string[], map?: Record<string, string>) => {
                    if (!arr || arr.length === 0) return 'All';
                    const vals = map ? arr.map(v => map[v] ?? v) : arr;
                    return vals.join(', ');
                  };
                  const weekdayMap: Record<string, string> = {
                    'Monday': 'Mon', 'Tuesday': 'Tue', 'Wednesday': 'Wed', 'Thursday': 'Thu', 'Friday': 'Fri', 'Saturday': 'Sat', 'Sunday': 'Sun'
                  };
                  const monthMap: Record<string, string> = {
                    'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr', 'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug', 'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
                  };
                  const hours = timeSetupData.hourMode === 'specific' ? joinOrAll(timeSetupData.selectedHours) : 'All';
                  const minutes = timeSetupData.minuteMode === 'specific' ? joinOrAll(timeSetupData.selectedMinutes) : `${timeSetupData.betweenMinuteStart}-${timeSetupData.betweenMinuteEnd}`;
                  const days = timeSetupData.dayMode === 'weekdays' ? joinOrAll(timeSetupData.selectedWeekdays, weekdayMap)
                    : (timeSetupData.dayMode === 'specific' ? joinOrAll(timeSetupData.selectedDays) : 'All');
                  const months = timeSetupData.monthMode === 'specific' ? joinOrAll(timeSetupData.selectedMonths, monthMap)
                    : (timeSetupData.monthMode === 'between' ? `${monthMap[timeSetupData.betweenMonthStart]}-${monthMap[timeSetupData.betweenMonthEnd]}` : 'All');
                  return (
                    <div className="mb-3 text-sm text-[#1a1a1a]">
                      <div><span className="font-semibold">Hours:</span> {hours}</div>
                      <div><span className="font-semibold">Minutes:</span> {minutes}</div>
                      <div><span className="font-semibold">Days:</span> {days}</div>
                      <div><span className="font-semibold">Months:</span> {months}</div>
                      <div className="mt-1"><span className="font-semibold">Cron:</span> {buildCronExpression()}</div>
                    </div>
                  );
                })()}
                <TimeSetupStep
                  data={timeSetupData}
                  onChange={(field, value) => {
                    setTimeSetupData(prev => ({ ...prev, [field]: value }));
                  }}
                  hideTitle
                />
              </CardContent>
            </Card>
          </>

        )}

        {/* Step 4: Attachments - Hide in preview mode */}
        {currentStep === 3 && !isPreviewMode && (
          <>
            {/* Header above card */}
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
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold mb-4 text-[#1a1a1a]">AMC Contracts</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white flex flex-col items-center justify-center">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        id="contracts-upload"
                        onChange={e => handleFileUpload('contracts', e.target.files)}
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-[#C72030] font-medium" style={{ fontSize: '14px' }}>
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
                        disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                    <label className="block text-sm font-semibold mb-4 text-[#1a1a1a]">AMC Invoice</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center bg-white">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        id="invoices-upload"
                        onChange={e => handleFileUpload('invoices', e.target.files)}
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-[#C72030] font-medium" style={{ fontSize: '14px' }}>
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
                        disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
          </>
        )}

        {/* Step Navigation Buttons - Hide in preview mode */}
        {!isPreviewMode && (
          <div className="flex gap-4 justify-center mt-8">
            {/* {currentStep > 0 && (
          <Button
            type="button"
              onClick={goToPreviousStep}
              className="px-6 py-2 font-medium"
              style={{ 
                backgroundColor: '#FFF',
                color: '#C72030',
                border: '1px solid #C72030',
                borderRadius: '4px'
              }}
            >
              Previous
            </Button>
          )} */}

            {currentStep < totalSteps - 1 ? (
              <>
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
                <Button
                  type="button"
                  onClick={handleSaveToDraft}
                  className="px-6 py-2 font-medium"
                  style={{
                    backgroundColor: '#FFF',
                    color: '#C72030',
                    border: '1px solid #C72030',
                    borderRadius: '4px'
                  }}
                >
                  Save to draft
                </Button>
              </>
            ) : (
              <>
                {/* Preview button for attachments step */}
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
                  onClick={handleSaveToDraft}
                  className="px-6 py-2 font-medium"
                  style={{
                    backgroundColor: '#FFF',
                    color: '#C72030',
                    border: '1px solid #C72030',
                    borderRadius: '4px'
                  }}
                >
                  Save to draft
                </Button>
              </>
            )}
          </div>
        )}

        {/* Progress indicator - Hide in preview mode */}
        {!isPreviewMode && (
          <div className="text-center mt-4 text-sm text-gray-600">
            You've completed {completedSteps.length} out of {totalSteps} steps.
          </div>
        )}

        {/* Read-only Previous Sections - Only show when using Save to Draft and NOT in preview mode */}
        {currentStep > 0 && showPreviousSections && !isPreviewMode && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>
              Previous Sections
            </h3>
            <div className="space-y-6">
              {/* Show only non-completed previous steps as read-only */}
              {Array.from({ length: currentStep }, (_, index) => {
                // Only show if this step is not in completedSteps
                if (completedSteps.includes(index)) return null;
                return (
                  <div key={`readonly-${index}`} className="bg-gray-50 border border-gray-200 rounded-md p-6">
                    {/* Step Header */}
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
                      <h4 className="text-[#C72030]" style={{
                        fontFamily: 'Work Sans, sans-serif',
                        fontWeight: 600,
                        fontSize: '26px',
                        lineHeight: '100%',
                        letterSpacing: '0%'
                      }}>
                        {index === 0 && 'AMC Configuration'}
                        {index === 1 && 'AMC Details'}
                        {index === 2 && 'Schedule'}
                        {index === 3 && 'Attachments'}
                      </h4>
                    </div>

                    {/* Read-only Content */}
                    <div className="opacity-75 pointer-events-none">
                      {index === 0 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">Details</label>
                            <div className="flex gap-6">
                              <div className="flex items-center">
                                <input type="radio" checked={formData.details === 'Asset'} readOnly className="mr-2" />
                                <span className="text-sm text-gray-600">Asset</span>
                              </div>
                              <div className="flex items-center">
                                <input type="radio" checked={formData.details === 'Service'} readOnly className="mr-2" />
                                <span className="text-sm text-gray-600">Service</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">Type</label>
                            <div className="flex gap-6">
                              <div className="flex items-center">
                                <input type="radio" checked={formData.type === 'Individual'} readOnly className="mr-2" />
                                <span className="text-sm text-gray-600">Individual</span>
                              </div>
                              <div className="flex items-center">
                                <input type="radio" checked={formData.type === 'Group'} readOnly className="mr-2" />
                                <span className="text-sm text-gray-600">Group</span>
                              </div>
                            </div>
                          </div>
                          {formData.type === 'Individual' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">
                                  {formData.details === 'Asset' ? 'Assets' : 'Service'}
                                </label>
                                <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                                  {getServiceNamesFromIds() || 'Not selected'}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Supplier</label>
                                <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                                  {formData.supplier || 'Not selected'}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Technician</label>
                                <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                                  {technicianOptions.find(t => t.id?.toString?.() === formData.technician)?.full_name || technicianOptions.find(t => t.id?.toString?.() === formData.technician)?.name || 'Not selected'}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Group</label>
                                <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                                  {assetGroups.find(g => g.id?.toString?.() === formData.group)?.name || 'Not selected'}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Sub Group</label>
                                <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                                  {subGroups.find(s => s.id?.toString?.() === formData.subgroup)?.name || 'Not selected'}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Supplier</label>
                                <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                                  {formData.supplier || 'Not selected'}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Technician</label>
                                <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                                  {technicianOptions.find(t => t.id?.toString?.() === formData.technician)?.full_name || technicianOptions.find(t => t.id?.toString?.() === formData.technician)?.name || 'Not selected'}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {index === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">Contract Name</label>
                            <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                              {formData.contractName || 'Not filled'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">Start Date</label>
                            <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                              {formData.startDate || 'Not selected'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">End Date</label>
                            <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                              {formData.endDate || 'Not selected'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">First Service Date</label>
                            <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                              {formData.firstService || 'Not selected'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">Payment Terms</label>
                            <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                              {formData.paymentTerms || 'Not filled'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">Cost</label>
                            <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                              {formData.cost || 'Not filled'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">Visits</label>
                            <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                              {formData.noOfVisits || 'Not filled'}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-gray-600">Remarks</label>
                            <div className="p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600">
                              {formData.remarks || 'Not filled'}
                            </div>
                          </div>
                        </div>
                      )}

                      {index === 2 && (
                        <Card className="mb-4 border-[#D9D9D9] bg-white shadow-sm" style={{
                          borderRadius: '4px',
                          background: '#FFF',
                          boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
                        }}>
                          <CardHeader className="bg-[#F6F4EE] ">
                            <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium">3</span>
                              SCHEDULE
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            {/* Selected time summary */}
                            {(() => {
                              const joinOrAll = (arr: string[], map?: Record<string, string>) => {
                                if (!arr || arr.length === 0) return 'All';
                                const vals = map ? arr.map(v => map[v] ?? v) : arr;
                                return vals.join(', ');
                              };
                              const weekdayMap: Record<string, string> = {
                                'Monday': 'Mon', 'Tuesday': 'Tue', 'Wednesday': 'Wed', 'Thursday': 'Thu', 'Friday': 'Fri', 'Saturday': 'Sat', 'Sunday': 'Sun'
                              };
                              const monthMap: Record<string, string> = {
                                'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr', 'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug', 'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
                              };
                              const hours = timeSetupData.hourMode === 'specific' ? joinOrAll(timeSetupData.selectedHours) : 'All';
                              const minutes = timeSetupData.minuteMode === 'specific' ? joinOrAll(timeSetupData.selectedMinutes) : `${timeSetupData.betweenMinuteStart}-${timeSetupData.betweenMinuteEnd}`;
                              const days = timeSetupData.dayMode === 'weekdays' ? joinOrAll(timeSetupData.selectedWeekdays, weekdayMap)
                                : (timeSetupData.dayMode === 'specific' ? joinOrAll(timeSetupData.selectedDays) : 'All');
                              const months = timeSetupData.monthMode === 'specific' ? joinOrAll(timeSetupData.selectedMonths, monthMap)
                                : (timeSetupData.monthMode === 'between' ? `${monthMap[timeSetupData.betweenMonthStart]}-${monthMap[timeSetupData.betweenMonthEnd]}` : 'All');
                              return (
                                <div className="mb-3 text-sm text-[#1a1a1a]">
                                  <div><span className="font-semibold">Hours:</span> {hours}</div>
                                  <div><span className="font-semibold">Minutes:</span> {minutes}</div>
                                  <div><span className="font-semibold">Days:</span> {days}</div>
                                  <div><span className="font-semibold">Months:</span> {months}</div>
                                  <div className="mt-1"><span className="font-semibold">Cron:</span> {buildCronExpression()}</div>
                                </div>
                              );
                            })()}
                            <TimeSetupStep data={timeSetupData} hideTitle disabled showEditButton={false} />
                          </CardContent>
                        </Card>
                      )}

                      {index === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">AMC Contracts</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-100">
                              <p className="text-sm text-gray-500">
                                {attachments.contracts.length} file(s) uploaded
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">AMC Invoices</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-100">
                              <p className="text-sm text-gray-500">
                                {attachments.invoices.length} file(s) uploaded
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Sections - Hide in preview mode */}
        {!isPreviewMode && renderCompletedSections()}

        <MuiDialog
          open={showDraftModal}
          onClose={() => { }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: '#C72030',
              color: 'white',
              fontFamily: 'Work Sans, sans-serif',
              fontWeight: 600
            }}
          >
            AMC Draft Found
          </DialogTitle>
          <DialogContent sx={{ padding: '24px' }}>
            <Typography
              sx={{
                fontFamily: 'Work Sans, sans-serif',
                fontSize: '14px',
                color: '#333'
              }}
            >
              We found a saved draft from your previous session. Continue with the draft to pick up where you left off, or start fresh to clear it.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px', gap: 2 }}>
            <Button
              variant="outline"
              onClick={handleStartFresh}
              className="px-6 py-2 font-medium border border-[#C72030] text-[#C72030]"
            >
              Start Fresh
            </Button>
            <Button
              onClick={handleContinueWithDraft}
              className="px-6 py-2 font-medium bg-[#C72030] text-white hover:bg-[#C72030]/90"
            >
              Continue with Draft
            </Button>
          </DialogActions>
        </MuiDialog>
      </div>
    </div>
  );
};