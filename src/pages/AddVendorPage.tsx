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
    if (activeStep === 0) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company Name is required';
        isValid = false;
      }
      if (!formData.primaryPhone.trim()) {
        newErrors.primaryPhone = 'Primary Phone is required';
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        isValid = false;
      }
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

    // Step 0: Company Information
    apiFormData.append('pms_supplier[company_name]', formData.companyName);
    apiFormData.append('pms_supplier[mobile1]', formData.primaryPhone);
    apiFormData.append('pms_supplier[mobile2]', formData.secondaryPhone);
    apiFormData.append('pms_supplier[email]', formData.email);
    apiFormData.append('pms_supplier[pan_number]', formData.pan);
    apiFormData.append('pms_supplier[gstin_number]', formData.gst);
    apiFormData.append('pms_supplier[supplier_type][]', formData.supplierType);
    apiFormData.append('pms_supplier[service_description]', formData.serviceDescription);
    if (formData.date) {
      apiFormData.append('pms_supplier[signed_on_contract]', "true");
    }
    if(formData.services) {
      apiFormData.append('pms_supplier[services_ids][]', formData.services);
    }

    // Step 1: Address
    apiFormData.append('pms_supplier[country]', formData.country);
    apiFormData.append('pms_supplier[state]', formData.state);
    apiFormData.append('pms_supplier[city]', formData.city);
    apiFormData.append('pms_supplier[pincode]', formData.pincode);
    apiFormData.append('pms_supplier[address]', formData.addressLine1);
    apiFormData.append('pms_supplier[address2]', formData.addressLine2);

    // Step 2: Bank Details
    apiFormData.append('pms_supplier[account_name]', formData.accountName);
    apiFormData.append('pms_supplier[account_number]', formData.accountNumber);
    apiFormData.append('pms_supplier[bank_branch_name]', formData.bankBranchName);
    apiFormData.append('pms_supplier[ifsc_code]', formData.ifscCode);

    // Step 3: Contact Person
    contactPersons.forEach((contact, index) => {
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][first_name]`, contact.firstName);
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][last_name]`, contact.lastName);
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][email1]`, contact.primaryEmail);
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][email2]`, contact.secondaryEmail);
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][mobile1]`, contact.primaryMobile);
        apiFormData.append(`pms_supplier[pms_supplier_contacts_attributes][${index}][mobile2]`, contact.secondaryMobile);
    });
    
    // Step 4: KYC Details
    if (formData.reKyc) {
        let reKycValue = formData.reKyc;
        if (reKycValue !== 'custom') {
            reKycValue = `${formData.reKyc.replace('m', '')}_months`;
        }
        apiFormData.append('pms_supplier[re_kyc_in]', reKycValue);
    }

    // Step 5: Attachments
    panAttachments.forEach(file => apiFormData.append('pan_attachments[]', file));
    tanAttachments.forEach(file => apiFormData.append('tan_attachments[]', file));
    gstAttachments.forEach(file => apiFormData.append('gst_attachments[]', file));
    kycAttachments.forEach(file => apiFormData.append('kyc_attachments[]', file));
    complianceAttachments.forEach(file => apiFormData.append('compliance_attachments[]', file));
    otherAttachments.forEach(file => apiFormData.append('cancle_checque[]', file));

    // Hardcoded values from API spec
    apiFormData.append('pms_supplier[society_id]', '1');
    apiFormData.append('pms_supplier[active]', 'true');

    try {
        await vendorService.createVendor(apiFormData);
        toast.success('Vendor created successfully!');
        navigate('/maintenance/vendor');
    } catch (error) {
        // The service handles error toast
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
    setContactPersons([...contactPersons, { ...initialContactPerson }]);
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

  const FileUploadBox = ({ title, onFileSelect }: { title: string, onFileSelect: (files: File[]) => void }) => {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            onFileSelect(files);
            setFileNames(files.map(f => f.name));
        }
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-600">{title}</p>
            <label className="cursor-pointer">
                <p className="text-sm text-gray-500 mt-2">Drag & Drop or <span className="text-[#C72030] font-semibold">Choose Files</span></p>
                <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
            <p className="text-xs text-gray-400 mt-1">{fileNames.length > 0 ? fileNames.join(', ') : 'No file chosen'}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <TextField 
                  label="Company Name*" 
                  fullWidth 
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                />
                <TextField 
                  label="Primary Phone No." 
                  fullWidth
                  value={formData.primaryPhone}
                  onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                />
                <TextField 
                  label="Secondary Phone No." 
                  fullWidth 
                  value={formData.secondaryPhone}
                  onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                />
                <TextField 
                  label="Email*" 
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
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                />
                <TextField 
                  label="GST" 
                  fullWidth 
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                />
                <TextField 
                  label="Supplier Type" 
                  select 
                  fullWidth
                  value={formData.supplierType}
                  onChange={(e) => setFormData({ ...formData, supplierType: e.target.value })}
                >
                  <MenuItem value="type1">Type 1</MenuItem>
                  <MenuItem value="type2">Type 2</MenuItem>
                </TextField>
                <TextField 
                  label="Website Url" 
                  fullWidth 
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                />
                <div className="lg:col-span-2">
                  <TextareaAutosize
                    minRows={3}
                    placeholder="Service Description"
                    className="w-full border rounded p-2"
                    value={formData.serviceDescription}
                    onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                  />
                </div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker 
                    label="Date" 
                    value={formData.date}
                    onChange={(date) => setFormData({ ...formData, date })}
                  />
                </LocalizationProvider>
                <TextField 
                  label="Services" 
                  select 
                  fullWidth
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                >
                    <MenuItem value="service1">Service 1</MenuItem>
                </TextField>
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
                  label="Country" 
                  fullWidth 
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
                <TextField 
                  label="State" 
                  fullWidth 
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
                <TextField 
                  label="City" 
                  fullWidth 
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <TextField 
                  label="Pincode" 
                  fullWidth 
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
                <div className="lg:col-span-2">
                    <TextField 
                      label="Address Line1" 
                      fullWidth 
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
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
                <div key={index} className="relative border-b pb-8 mb-4">
                  {contactPersons.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 text-red-500"
                      onClick={() => removeContactPerson(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <TextField 
                      label="First Name" 
                      fullWidth 
                      value={contact.firstName}
                      onChange={(e) => handleContactPersonChange(index, 'firstName', e.target.value)}
                    />
                    <TextField 
                      label="Last Name" 
                      fullWidth 
                      value={contact.lastName}
                      onChange={(e) => handleContactPersonChange(index, 'lastName', e.target.value)}
                    />
                    <TextField 
                      label="Primary Email" 
                      type="email" 
                      fullWidth 
                      value={contact.primaryEmail}
                      onChange={(e) => handleContactPersonChange(index, 'primaryEmail', e.target.value)}
                    />
                    <TextField 
                      label="Secondary Email" 
                      type="email" 
                      fullWidth 
                      value={contact.secondaryEmail}
                      onChange={(e) => handleContactPersonChange(index, 'secondaryEmail', e.target.value)}
                    />
                    <TextField 
                      label="Primary Mobile" 
                      fullWidth 
                      value={contact.primaryMobile}
                      onChange={(e) => handleContactPersonChange(index, 'primaryMobile', e.target.value)}
                    />
                    <TextField 
                      label="Secondary Mobile" 
                      fullWidth 
                      value={contact.secondaryMobile}
                      onChange={(e) => handleContactPersonChange(index, 'secondaryMobile', e.target.value)}
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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker 
                    label="Custom Date" 
                    value={formData.customDate}
                    onChange={(date) => setFormData({ ...formData, customDate: date })}
                  />
                </LocalizationProvider>
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
                <FileUploadBox title="PAN Document" onFileSelect={setPanAttachments} />
                <FileUploadBox title="TAN Document" onFileSelect={setTanAttachments} />
                <FileUploadBox title="GST Document" onFileSelect={setGstAttachments} />
                <FileUploadBox title="KYC Document" onFileSelect={setKycAttachments} />
                <FileUploadBox title="Labour Compliance Document" onFileSelect={setComplianceAttachments} />
                <FileUploadBox title="Other Document" onFileSelect={setOtherAttachments} />
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
      <div className="flex items-center mb-6">
        <IconButton onClick={() => navigate('/maintenance/vendor')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </IconButton>
        <h1 className="text-2xl font-bold text-gray-900">Add Vendor</h1>
      </div>

      <Box sx={{ mb: 4 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          {steps.map((label, index) => (
            <Box key={`step-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                onClick={() => handleStepClick(index)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: (index === activeStep || completedSteps.includes(index)) ? '#C72030' : 'white',
                  color: (index === activeStep || completedSteps.includes(index)) ? 'white' : '#C4B89D',
                  border: `2px solid ${(index === activeStep || completedSteps.includes(index)) ? '#C72030' : '#C4B89D'}`,
                  padding: '12px 20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  textAlign: 'center',
                  minWidth: '140px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: index === activeStep ? '0 2px 4px rgba(199, 32, 48, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Work Sans, sans-serif',
                  position: 'relative',
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
                    width: '60px',
                    height: '2px',
                    backgroundImage: `repeating-linear-gradient(to right, ${ (index < activeStep || completedSteps.includes(index)) ? '#C72030' : '#C4B89D'} 0px, ${ (index < activeStep || completedSteps.includes(index)) ? '#C72030' : '#C4B89D'} 8px, transparent 8px, transparent 16px)`,
                    margin: '0 0px'
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
