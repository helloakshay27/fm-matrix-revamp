import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stepper,
  Step,
  StepLabel,
  Button as MuiButton,
  Paper,
  Box,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  styled,
  StepConnector,
  TextareaAutosize,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  ArrowLeft,
  Building,
  MapPin,
  Landmark,
  User,
  FileText,
  Upload,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { vendorService } from '@/services/vendorService';
import { toast } from 'sonner';
import { useApiData } from '@/hooks/useApiData';

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#E0E0E0',
    borderTopWidth: 2,
    borderStyle: 'dotted',
  },
}));

const CustomStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#fff',
  zIndex: 1,
  color: '#A0A0A0',
  width: 'auto',
  height: 40,
  display: 'flex',
  paddingLeft: '24px',
  paddingRight: '24px',
  borderRadius: '4px',
  border: '1px solid #E0E0E0',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 500,
  fontFamily: 'Work Sans, sans-serif',
  fontSize: '14px',
  ...(ownerState.active && {
    backgroundColor: '#C72030',
    color: 'white',
    border: '1px solid #C72030',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#C72030',
    color: 'white',
    border: '1px solid #C72030',
  }),
}));

function CustomStepIcon(props: {
  active?: boolean;
  completed?: boolean;
  className?: string;
  icon: React.ReactNode;
}) {
  const { active, completed, icon } = props;
  const stepLabel = steps[Number(icon) - 1];

  return (
    <CustomStepIconRoot ownerState={{ completed, active }}>
      {stepLabel}
    </CustomStepIconRoot>
  );
}

const RedButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#C72030',
  color: 'white',
  borderRadius: 0,
  textTransform: 'none',
  padding: '8px 16px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  boxShadow: '0 2px 4px rgba(199, 32, 48, 0.2)',
  '&:hover': {
    backgroundColor: '#B8252F',
    boxShadow: '0 4px 8px rgba(199, 32, 48, 0.3)',
  },
}));

const DraftButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#f6f4ee',
  color: '#C72030',
  borderRadius: 0,
  textTransform: 'none',
  padding: '8px 16px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#f0ebe0',
  },
}));

const SectionCard = styled(Paper)({
  backgroundColor: 'white',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  borderRadius: 0,
  overflow: 'hidden',
  marginBottom: '24px',
});

const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  backgroundColor: '#F6F4EE',
  borderBottom: '1px solid #E0E0E0',
});

const SectionTitle = styled('h3')({
  fontSize: '18px',
  fontWeight: 700,
  color: '#333',
});

const steps = [
  'Company Information',
  'Address',
  'Bank Details',
  'Contact Person',
  'KYC Details',
  'Attachments',
];

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

const initialFormData = {
  companyName: '',
  primaryPhone: '',
  secondaryPhone: '',
  email: '',
  pan: '',
  gst: '',
  supplierType: '',
  websiteUrl: '',
  serviceDescription: '',
  date: null as Date | null,
  services: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  addressLine1: '',
  addressLine2: '',
  accountName: '',
  accountNumber: '',
  bankBranchName: '',
  ifscCode: '',
  reKyc: '',
  customDate: null as Date | null,
};

const initialContactPerson = {
  firstName: '',
  lastName: '',
  primaryEmail: '',
  secondaryEmail: '',
  primaryMobile: '',
  secondaryMobile: '',
};

export const AddVendorPage = () => {
  const navigate = useNavigate();
  const { suppliers, services, loading } = useApiData();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<any>({});
  const [contactPersons, setContactPersons] = useState([initialContactPerson]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [panAttachments, setPanAttachments] = useState<File[]>([]);
  const [tanAttachments, setTanAttachments] = useState<File[]>([]);
  const [gstAttachments, setGstAttachments] = useState<File[]>([]);
  const [kycAttachments, setKycAttachments] = useState<File[]>([]);
  const [complianceAttachments, setComplianceAttachments] = useState<File[]>([]);
  const [otherAttachments, setOtherAttachments] = useState<File[]>([]);

  const validateStep = () => {
    const newErrors: any = {};
    let isValid = true;
    
    // Phone number validation regex (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    // PAN validation regex (5 letters, 4 digits, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    // GST validation regex (15 characters alphanumeric)
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    // URL validation regex
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    // Alphabetic validation regex (only letters and spaces)
    const alphabeticRegex = /^[a-zA-Z\s]+$/;

    // Helper function to validate alphabetic fields
    const validateAlphabeticField = (value: string, fieldName: string) => {
      if (value.trim() && !alphabeticRegex.test(value.trim())) {
        newErrors[fieldName.toLowerCase()] = `${fieldName} should only contain alphabets and spaces`;
        isValid = false;
        return false;
      }
      return true;
    };
    
    if (activeStep === 0) {
      // Company Name validation (REQUIRED - has red asterisk)
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company Name is required';
        isValid = false;
      }
      
      // Email validation (REQUIRED - has red asterisk)
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        isValid = false;
      }
      
      // Optional fields - only validate format if provided
      if (formData.primaryPhone.trim() && !phoneRegex.test(formData.primaryPhone.trim())) {
        newErrors.primaryPhone = 'Please enter a valid 10-digit phone number';
        isValid = false;
      }
      
      if (formData.secondaryPhone.trim() && !phoneRegex.test(formData.secondaryPhone.trim())) {
        newErrors.secondaryPhone = 'Please enter a valid 10-digit phone number';
        isValid = false;
      }
      
      if (formData.pan.trim() && !panRegex.test(formData.pan.trim().toUpperCase())) {
        newErrors.pan = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
        isValid = false;
      }
      
      if (formData.gst.trim() && !gstRegex.test(formData.gst.trim().toUpperCase())) {
        newErrors.gst = 'Please enter a valid GST number (15 characters)';
        isValid = false;
      }
      
      if (formData.websiteUrl.trim() && !urlRegex.test(formData.websiteUrl.trim())) {
        newErrors.websiteUrl = 'Please enter a valid website URL';
        isValid = false;
      }
    }
    
    // Address validation for step 1
    if (activeStep === 1) {
      // Country validation (REQUIRED - has red asterisk)
      if (!formData.country.trim()) {
        newErrors.country = 'Country is required';
        isValid = false;
      } else {
        validateAlphabeticField(formData.country, 'Country');
      }
      
      // State validation (REQUIRED - has red asterisk)
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
        isValid = false;
      } else {
        validateAlphabeticField(formData.state, 'State');
      }
      
      // City validation (REQUIRED - has red asterisk)
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
        isValid = false;
      } else {
        validateAlphabeticField(formData.city, 'City');
      }
      
      // Address Line1 validation (REQUIRED - has red asterisk)
      if (!formData.addressLine1.trim()) {
        newErrors.addressLine1 = 'Address Line 1 is required';
        isValid = false;
      }
      
      // Optional fields - only validate format if provided
      if (formData.pincode.trim()) {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(formData.pincode.trim())) {
          newErrors.pincode = 'Please enter a valid 6-digit pincode';
          isValid = false;
        }
      }
    }
    
    // Bank Details validation for step 2 (all optional - no red asterisks)
    if (activeStep === 2) {
      // Only validate format if provided
      if (formData.accountNumber.trim() && !/^[0-9]{9,18}$/.test(formData.accountNumber.trim())) {
        newErrors.accountNumber = 'Please enter a valid account number (9-18 digits)';
        isValid = false;
      }
      
      if (formData.ifscCode.trim()) {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(formData.ifscCode.trim().toUpperCase())) {
          newErrors.ifscCode = 'Please enter a valid IFSC code (e.g., SBIN0001234)';
          isValid = false;
        }
      }
    }
    
    // Contact Person validation for step 3
    if (activeStep === 3) {
      contactPersons.forEach((contact, index) => {
        // First name validation (REQUIRED - has red asterisk)
        if (!contact.firstName.trim()) {
          newErrors[`contact_${index}_firstName`] = 'First name is required';
          isValid = false;
        }
        
        // Last name validation (REQUIRED - has red asterisk)
        if (!contact.lastName.trim()) {
          newErrors[`contact_${index}_lastName`] = 'Last name is required';
          isValid = false;
        }
        
        // Optional fields - only validate format if provided
        if (contact.primaryMobile.trim() && !phoneRegex.test(contact.primaryMobile.trim())) {
          newErrors[`contact_${index}_primaryMobile`] = 'Please enter a valid 10-digit mobile number';
          isValid = false;
        }
        
        if (contact.secondaryMobile.trim() && !phoneRegex.test(contact.secondaryMobile.trim())) {
          newErrors[`contact_${index}_secondaryMobile`] = 'Please enter a valid 10-digit mobile number';
          isValid = false;
        }
        
        if (contact.primaryEmail.trim() && !/\S+@\S+\.\S+/.test(contact.primaryEmail)) {
          newErrors[`contact_${index}_primaryEmail`] = 'Please enter a valid email address';
          isValid = false;
        }
        
        if (contact.secondaryEmail.trim() && !/\S+@\S+\.\S+/.test(contact.secondaryEmail)) {
          newErrors[`contact_${index}_secondaryEmail`] = 'Please enter a valid email address';
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateStep()) {
      toast.error("Please fill all required fields before submitting.");
      return;
    }
    setIsSubmitting(true);

    const apiFormData = new FormData();

    // Step 0: Company Information - Send all fields (empty as empty strings to match curl)
    apiFormData.append('pms_supplier[company_name]', formData.companyName || '');
    apiFormData.append('pms_supplier[mobile1]', formData.primaryPhone || '');
    apiFormData.append('pms_supplier[mobile2]', formData.secondaryPhone || '');
    apiFormData.append('pms_supplier[email]', formData.email || '');
    apiFormData.append('pms_supplier[pan_number]', formData.pan || '');
    apiFormData.append('pms_supplier[gstin_number]', formData.gst || '');
    if (formData.supplierType) {
      apiFormData.append('pms_supplier[supplier_type][]', formData.supplierType);
    }
    apiFormData.append('pms_supplier[service_description]', formData.serviceDescription || '');
    if (formData.date) {
      apiFormData.append('pms_supplier[signed_on_contract]', "true");
    }
    if (formData.services) {
      apiFormData.append('pms_supplier[services_ids][]', formData.services);
    }

    // Step 1: Address - Send all fields
    apiFormData.append('pms_supplier[country]', formData.country || '');
    apiFormData.append('pms_supplier[state]', formData.state || '');
    apiFormData.append('pms_supplier[city]', formData.city || '');
    apiFormData.append('pms_supplier[pincode]', formData.pincode || '');
    apiFormData.append('pms_supplier[address]', formData.addressLine1 || '');
    apiFormData.append('pms_supplier[address2]', formData.addressLine2 || '');

    // Step 2: Bank Details - Send all fields
    apiFormData.append('pms_supplier[account_name]', formData.accountName || '');
    apiFormData.append('pms_supplier[account_number]', formData.accountNumber || '');
    apiFormData.append('pms_supplier[bank_branch_name]', formData.bankBranchName || '');
    apiFormData.append('pms_supplier[ifsc_code]', formData.ifscCode || '');

    // Step 3: Contact Person - Send all contact fields
    contactPersons.forEach((contact, index) => {
      if (contact.firstName || contact.lastName) {
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][first_name]`, contact.firstName || '');
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][last_name]`, contact.lastName || '');
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][email1]`, contact.primaryEmail || '');
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][email2]`, contact.secondaryEmail || '');
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][mobile1]`, contact.primaryMobile || '');
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][mobile2]`, contact.secondaryMobile || '');
      }
    });

    // Step 4: KYC Details - Fix the re_kyc_in value (should be text, not file)
    if (formData.reKyc) {
      let reKycValue = formData.reKyc;
      if (reKycValue !== 'custom') {
        // Convert '3m', '6m', etc. to '3_months', '6_months', etc.
        reKycValue = `${formData.reKyc.replace('m', '')}_months`;
      } else if (formData.customDate) {
        // For custom date, send the formatted date string
        reKycValue = formData.customDate.toISOString().split('T')[0];
      }
      apiFormData.append('pms_supplier[re_kyc_in]', reKycValue);
    }

    // Step 5: Attachments - Append files if they exist
    panAttachments.forEach(file => apiFormData.append('pan_attachments[]', file));
    tanAttachments.forEach(file => apiFormData.append('tan_attachments[]', file));
    gstAttachments.forEach(file => apiFormData.append('gst_attachments[]', file));
    kycAttachments.forEach(file => apiFormData.append('kyc_attachments[]', file));
    complianceAttachments.forEach(file => apiFormData.append('compliance_attachments[]', file));
    otherAttachments.forEach(file => apiFormData.append('cancle_checque[]', file));

    // Hardcoded values from API spec
    apiFormData.append('pms_supplier[society_id]', '1');
    apiFormData.append('pms_supplier[active]', 'true');

    // Debug: Log the FormData contents
    console.log('FormData contents:');
    for (const [key, value] of apiFormData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await vendorService.createVendor(apiFormData);
      toast.success('Vendor created successfully!');
      navigate('/maintenance/vendor');
    } catch (error: any) {
      // Handle 422 Unprocessable Entity (validation errors)
      if (error.status === 422 && error.validationErrors) {
        const validationErrors = error.validationErrors;
        
        // Check which step the errors belong to and navigate accordingly
        const companyInfoFields = ['company_name', 'email', 'mobile1', 'mobile2', 'pan_number', 'gstin_number'];
        const addressFields = ['country', 'state', 'city', 'pincode', 'address', 'address2'];
        const bankFields = ['account_name', 'account_number', 'bank_branch_name', 'ifsc_code'];
        
        // Set validation errors in the form
        const formErrors: any = {};
        let targetStep = activeStep; // Default to current step
        
        Object.keys(validationErrors).forEach(field => {
          const errorMessage = Array.isArray(validationErrors[field]) 
            ? validationErrors[field].join(', ') 
            : validationErrors[field];
            
          // Map API field names to form field names
          const fieldMapping: { [key: string]: string } = {
            'company_name': 'companyName',
            'mobile1': 'primaryPhone',
            'mobile2': 'secondaryPhone',
            'pan_number': 'pan',
            'gstin_number': 'gst',
            'address': 'addressLine1',
            'address2': 'addressLine2',
            'account_number': 'accountNumber',
            'bank_branch_name': 'bankBranchName',
            'ifsc_code': 'ifscCode',
            'account_name': 'accountName'
          };
          
          const formFieldName = fieldMapping[field] || field;
          formErrors[formFieldName] = errorMessage;
          
          // Determine which step to navigate to
          if (companyInfoFields.includes(field)) {
            targetStep = 0; // Company Information step
          } else if (addressFields.includes(field)) {
            targetStep = 1; // Address step
          } else if (bankFields.includes(field)) {
            targetStep = 2; // Bank Details step
          }
        });
        
        // Set the errors and navigate to the appropriate step
        setErrors(formErrors);
        setActiveStep(targetStep);
        
        // Show error toast with the validation message
        const firstError = Object.values(validationErrors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        toast.error(errorMessage || 'Please check the form for errors');
        
      } else {
        // Handle other errors
        toast.error('Failed to create vendor. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps((prev) => [...prev, activeStep]);
      }
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleStepClick = (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
    } else if (validateStep()) {
      if (completedSteps.includes(step) || step < activeStep) {
        setActiveStep(step);
      }
    }
  };

  const addContactPerson = () => {
    const newContactPerson = {
      firstName: '',
      lastName: '',
      primaryEmail: '',
      secondaryEmail: '',
      primaryMobile: '',
      secondaryMobile: '',
    };
    setContactPersons([...contactPersons, newContactPerson]);
  };

  const removeContactPerson = (index: number) => {
    if (contactPersons.length > 1) {
      const newContacts = [...contactPersons];
      newContacts.splice(index, 1);
      setContactPersons(newContacts);
    }
  };

  const handleContactPersonChange = (index: number, field: string, value: string) => {
    const newContacts = [...contactPersons];
    (newContacts[index] as any)[field] = value;
    setContactPersons(newContacts);
  };

  const FileUploadBox = ({ title, onFileSelect, currentFiles }: { title: string, onFileSelect: (files: File[]) => void, currentFiles: File[] }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const files = Array.from(event.target.files);
        onFileSelect(files);
      }
    };

    const fileNames = currentFiles.map(f => f.name);

    return (
      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${fileNames.length > 0 ? 'border-[#C72030] bg-red-50' : 'border-gray-300'}`}>
        <p className="text-gray-600 font-medium mb-2">{title}</p>
        <label className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Drag & Drop or <span className="text-[#C72030] font-semibold">Choose Files</span></p>
          </div>
          <input type="file" multiple className="hidden" onChange={handleFileChange} />
        </label>
        {fileNames.length > 0 ? (
          <div className="mt-3 p-2 bg-white rounded border">
            <p className="text-xs text-[#C72030] font-semibold mb-1">{fileNames.length} file(s) selected:</p>
            <div className="max-h-20 overflow-y-auto">
              {fileNames.map((fileName, index) => (
                <p key={index} className="text-xs text-gray-700 truncate" title={fileName}>
                  📎 {fileName}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-2">No file chosen</p>
        )}
      </div>
    );
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SectionCard>
            <SectionHeader>
              <Building className="text-[#C72030]" />
              <SectionTitle>COMPANY INFORMATION</SectionTitle>
            </SectionHeader>
            <Box p={3}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <TextField
                  label={<span>Company Name <span style={{ color: 'red' }}>*</span></span>}
                  fullWidth
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                />
                <TextField
                  label="Primary Phone No."
                  type='numeric'
                  fullWidth
                  value={formData.primaryPhone}
                  onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                  error={!!errors.primaryPhone}
                  helperText={errors.primaryPhone}
                />
                <TextField
                  label="Secondary Phone No."
                  fullWidth
                  value={formData.secondaryPhone}
                  onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                  error={!!errors.secondaryPhone}
                  helperText={errors.secondaryPhone}
                />
                <TextField
                  label={<span>Email <span style={{ color: 'red' }}>*</span></span>}
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  label="PAN"
                  fullWidth
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  error={!!errors.pan}
                  helperText={errors.pan}
                  placeholder="ABCDE1234F"
                />
                <TextField
                  label="GST"
                  fullWidth
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value.toUpperCase() })}
                  error={!!errors.gst}
                  helperText={errors.gst}
                  placeholder="22AAAAA0000A1Z5"
                />
                <TextField
                  label="Supplier Type"
                  select
                  fullWidth
                  value={formData.supplierType}
                  onChange={(e) => setFormData({ ...formData, supplierType: e.target.value })}
                  disabled={loading.suppliers}
                  InputProps={{
                    endAdornment: loading.suppliers ? <CircularProgress size={20} /> : null,
                  }}
                >
                  {loading.suppliers ? (
                    <MenuItem value="">Loading...</MenuItem>
                  ) : (
                    suppliers.map((supplier: any) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
                <TextField
                  label="Website Url"
                  fullWidth
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  error={!!errors.websiteUrl}
                  helperText={errors.websiteUrl}
                  placeholder="https://example.com"
                />
                <TextField
                  label={
                    <span>
                      Date
                    </span>
                  }
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  placeholder="Select Date"
                  inputProps={{
                    max: formData.date || undefined,
                  }}
                />
                <TextField
                  label="Services"
                  select
                  fullWidth
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  disabled={loading.services}
                  InputProps={{
                    endAdornment: loading.services ? <CircularProgress size={20} /> : null,
                  }}
                >
                  {loading.services ? (
                    <MenuItem value="">Loading...</MenuItem>
                  ) : (
                    services.map((service: any) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="relative w-full">
                    <textarea
                      id="serviceDescription"
                      value={formData.serviceDescription}
                      onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                      rows={3}
                      placeholder=" "
                      className="peer block w-full appearance-none rounded border border-gray-300 bg-white px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent 
            focus:outline-none 
            focus:border-[2px] 
            focus:border-[rgb(25,118,210)] 
            resize-vertical"
                    />
                    <label
                      htmlFor="serviceDescription"
                      className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200
            peer-placeholder-shown:top-4
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-400
            peer-focus:-top-[10px]
            peer-focus:text-sm
            peer-focus:text-[rgb(25,118,210)]"
                    >
                      Service Description
                    </label>
                  </div>
                </div>
              </div>
            </Box>
          </SectionCard>
        );
      case 1:
        return (
          <SectionCard>
            <SectionHeader>
              <MapPin className="text-[#C72030]" />
              <SectionTitle>ADDRESS</SectionTitle>
            </SectionHeader>
            <Box p={3}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TextField
                  label={<span>Country <span style={{ color: 'red' }}>*</span></span>}
                  fullWidth
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  onKeyDown={(e) => {
                    const char = e.key;
                    if (!/[a-zA-Z\s]/.test(char) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) {
                      e.preventDefault();
                    }
                  }}
                  error={!!errors.country}
                  helperText={errors.country}
                  placeholder="e.g., India"
                />
                <TextField
                  label={<span>State <span style={{ color: 'red' }}>*</span></span>}
                  fullWidth
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  onKeyDown={(e) => {
                    const char = e.key;
                    if (!/[a-zA-Z\s]/.test(char) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) {
                      e.preventDefault();
                    }
                  }}
                  error={!!errors.state}
                  helperText={errors.state}
                  placeholder="e.g., Maharashtra"
                />
                <TextField
                  label={<span>City <span style={{ color: 'red' }}>*</span></span>}
                  fullWidth
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  onKeyDown={(e) => {
                    const char = e.key;
                    if (!/[a-zA-Z\s]/.test(char) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) {
                      e.preventDefault();
                    }
                  }}
                  error={!!errors.city}
                  helperText={errors.city}
                  placeholder="e.g., Mumbai"
                />
                <TextField
                  label="Pincode"
                  fullWidth
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                  placeholder="123456"
                />
                <div className="lg:col-span-2">
                  <TextField
                    label={<span>Address Line1 <span style={{ color: 'red' }}>*</span></span>}
                    fullWidth
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1}
                  />
                </div>
                <div className="lg:col-span-3">
                  <TextField
                    label="Address Line2"
                    fullWidth
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  />
                </div>
              </div>
            </Box>
          </SectionCard>
        );
      case 2:
        return (
          <SectionCard>
            <SectionHeader>
              <Landmark className="text-[#C72030]" />
              <SectionTitle>BANK DETAILS</SectionTitle>
            </SectionHeader>
            <Box p={3}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <TextField
                  label="Account Name"
                  fullWidth
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                />
                <TextField
                  label="Account Number"
                  fullWidth
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber}
                  placeholder="123456789012"
                />
                <TextField
                  label="Bank & Branch Name"
                  fullWidth
                  value={formData.bankBranchName}
                  onChange={(e) => setFormData({ ...formData, bankBranchName: e.target.value })}
                />
                <TextField
                  label="IFSC Code"
                  fullWidth
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                  error={!!errors.ifscCode}
                  helperText={errors.ifscCode}
                  placeholder="SBIN0001234"
                />
              </div>
            </Box>
          </SectionCard>
        );
      case 3:
        return (
          <SectionCard>
            <SectionHeader>
              <User className="text-[#C72030]" />
              <SectionTitle>CONTACT PERSON</SectionTitle>
            </SectionHeader>
            <Box p={3}>
              {contactPersons.map((contact, index) => (
                <div key={index} className="relative border rounded-lg p-4 mb-4 bg-gray-50">
                  {/* Header with Contact Number and Delete Button */}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Contact Person {index + 1}
                    </h4>
                    {contactPersons.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                        onClick={() => removeContactPerson(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {errors[`contact_${index}_general`] && (
                      <div className="col-span-full">
                        <p className="text-red-500 text-sm mt-1">{errors[`contact_${index}_general`]}</p>
                      </div>
                    )}
                    <TextField
                      label={<span>First Name <span style={{ color: 'red' }}>*</span></span>}
                      fullWidth
                      value={contact.firstName}
                      onChange={(e) => handleContactPersonChange(index, 'firstName', e.target.value)}
                      error={!!errors[`contact_${index}_firstName`]}
                      helperText={errors[`contact_${index}_firstName`]}
                    />
                    <TextField
                      label={<span>Last Name <span style={{ color: 'red' }}>*</span></span>}
                      fullWidth
                      value={contact.lastName}
                      onChange={(e) => handleContactPersonChange(index, 'lastName', e.target.value)}
                      error={!!errors[`contact_${index}_lastName`]}
                      helperText={errors[`contact_${index}_lastName`]}
                    />
                    <TextField
                      label="Primary Email"
                      type="email"
                      fullWidth
                      value={contact.primaryEmail}
                      onChange={(e) => handleContactPersonChange(index, 'primaryEmail', e.target.value)}
                      error={!!errors[`contact_${index}_primaryEmail`]}
                      helperText={errors[`contact_${index}_primaryEmail`]}
                    />
                    <TextField
                      label="Secondary Email"
                      type="email"
                      fullWidth
                      value={contact.secondaryEmail}
                      onChange={(e) => handleContactPersonChange(index, 'secondaryEmail', e.target.value)}
                      error={!!errors[`contact_${index}_secondaryEmail`]}
                      helperText={errors[`contact_${index}_secondaryEmail`]}
                    />
                    <TextField
                      label="Primary Mobile"
                      fullWidth
                      value={contact.primaryMobile}
                      onChange={(e) => handleContactPersonChange(index, 'primaryMobile', e.target.value)}
                      error={!!errors[`contact_${index}_primaryMobile`]}
                      helperText={errors[`contact_${index}_primaryMobile`]}
                      placeholder="9876543210"
                    />
                    <TextField
                      label="Secondary Mobile"
                      fullWidth
                      value={contact.secondaryMobile}
                      onChange={(e) => handleContactPersonChange(index, 'secondaryMobile', e.target.value)}
                      error={!!errors[`contact_${index}_secondaryMobile`]}
                      helperText={errors[`contact_${index}_secondaryMobile`]}
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addContactPerson} className="mt-4">
                <Plus className="w-4 h-4 mr-2" /> Add Contact
              </Button>
            </Box>
          </SectionCard>
        );
      case 4:
        return (
          <SectionCard>
            <SectionHeader>
              <FileText className="text-[#C72030]" />
              <SectionTitle>KYC DETAILS</SectionTitle>
            </SectionHeader>
            <Box p={3}>
              <RadioGroup
                row
                name="re-kyc"
                value={formData.reKyc}
                onChange={(e) => setFormData({ ...formData, reKyc: e.target.value })}
              >
                <FormControlLabel value="3m" control={<Radio />} label="3 months" />
                <FormControlLabel value="6m" control={<Radio />} label="6 months" />
                <FormControlLabel value="9m" control={<Radio />} label="9 months" />
                <FormControlLabel value="12m" control={<Radio />} label="12 months" />
                <FormControlLabel value="custom" control={<Radio />} label="Custom date" />
              </RadioGroup>
              {formData.reKyc === 'custom' && (
                // <LocalizationProvider dateAdapter={AdapterDateFns}>
                //   <DatePicker
                //     label="Custom Date"
                //     value={formData.customDate}
                //     onChange={(date) => setFormData({ ...formData, customDate: date })}
                //   />
                // </LocalizationProvider>
                <TextField
                  label={
                    <span>
                      Start Date <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  id="startFrom"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={formData.customDate}
                  onChange={(e) => setFormData({ ...formData, customDate: e.target.value ? new Date(e.target.value) : null })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                  placeholder="Select Date"
                  inputProps={{
                    max: formData.customDate || undefined,
                  }}
                />
              )}
            </Box>
          </SectionCard>
        );
      case 5:
        return (
          <SectionCard>
            <SectionHeader>
              <Upload className="text-[#C72030]" />
              <SectionTitle>ATTACHMENTS</SectionTitle>
            </SectionHeader>
            <Box p={3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUploadBox title="PAN Document" onFileSelect={setPanAttachments} currentFiles={panAttachments} />
                <FileUploadBox title="TAN Document" onFileSelect={setTanAttachments} currentFiles={tanAttachments} />
                <FileUploadBox title="GST Document" onFileSelect={setGstAttachments} currentFiles={gstAttachments} />
                <FileUploadBox title="KYC Document" onFileSelect={setKycAttachments} currentFiles={kycAttachments} />
                <FileUploadBox title="Labour Compliance Document" onFileSelect={setComplianceAttachments} currentFiles={complianceAttachments} />
                <FileUploadBox title="Other Document" onFileSelect={setOtherAttachments} currentFiles={otherAttachments} />
              </div>
            </Box>
          </SectionCard>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Back Button and Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <button
            onClick={() => navigate('/maintenance/vendor')}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Vendor List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Add New Vendor</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">ADD VENDOR</h1>
      </div>

      <Box sx={{ mb: 4, overflow: 'auto' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: 'fit-content',
          minWidth: '100%',
          px: 2
        }}>
          {steps.map((label, index) => (
            <Box key={`step-${index}`} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Box
                onClick={() => handleStepClick(index)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: (index === activeStep || completedSteps.includes(index)) ? '#C72030' : 'white',
                  color: (index === activeStep || completedSteps.includes(index)) ? 'white' : '#C4B89D',
                  border: `2px solid ${(index === activeStep || completedSteps.includes(index)) ? '#C72030' : '#C4B89D'}`,
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 500,
                  textAlign: 'center',
                  minWidth: '140px',
                  maxWidth: '140px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: index === activeStep ? '0 2px 4px rgba(199, 32, 48, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Work Sans, sans-serif',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&:hover': {
                    opacity: 0.9
                  },
                }}
              >
                {label}
              </Box>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: '30px',
                    height: '2px',
                    backgroundImage: `repeating-linear-gradient(to right, ${(index < activeStep || completedSteps.includes(index)) ? '#C72030' : '#C4B89D'} 0px, ${(index < activeStep || completedSteps.includes(index)) ? '#C72030' : '#C4B89D'} 6px, transparent 6px, transparent 12px)`,
                    margin: '0 0px',
                    flexShrink: 0
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <div className="mt-8">
        {getStepContent(activeStep)}
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <DraftButton disabled={activeStep === 0} onClick={handleBack}>
          Back
        </DraftButton>
        {activeStep === steps.length - 1 ? (
          <RedButton onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Vendor'}
          </RedButton>
        ) : (
          <RedButton onClick={handleNext}>
            Next
          </RedButton>
        )}
      </div>
    </div>
  );
};
