import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, Plus, Upload, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  TextField,
} from '@mui/material';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';

interface FormData {
  vendor: string;
  dateOfSending: string;
}

interface SenderOption {
  id: number;
  full_name: string;
}

interface StateOption {
  id: number;
  name: string;
}

interface PackageData {
  id: number;
  senderId: string;
  recipientName: string;
  recipientEmail: string;
  recipientMobile: string;
  awbNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  attachments: File[];
}

interface PackageErrors {
  senderId?: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientMobile?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  type?: string;
  attachments?: string;
}

const fieldStyles = {
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
const MOBILE_NUMBER_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidMobileNumber = (value: string) => MOBILE_NUMBER_REGEX.test(value);
const isValidEmail = (value: string) => EMAIL_REGEX.test(value);

export const NewOutboundPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    vendor: '',
    dateOfSending: '',
  });
  const [packages, setPackages] = useState<PackageData[]>([
    {
      id: 1,
      senderId: '',
      recipientName: '',
      recipientEmail: '',
      recipientMobile: '',
      awbNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      type: '',
      attachments: [],
    },
  ]);

  const [vendors, setVendors] = useState<Array<{ id: number; name: string }>>([]);
  const [senders, setSenders] = useState<SenderOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);

  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isLoadingSenders, setIsLoadingSenders] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [packageErrors, setPackageErrors] = useState<Record<number, PackageErrors>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVendors();
    fetchSenders();
    fetchStates();
  }, []);

  const fetchVendors = async () => {
    setIsLoadingVendors(true);
    try {
      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.DELIVERY_VENDORS), {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      setVendors(data.delivery_vendors || data || []);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to load vendors',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const fetchSenders = async () => {
    setIsLoadingSenders(true);
    try {
      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.ESCALATION_USERS), {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch senders');
      const data = await response.json();
      setSenders(data.users || data || []);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to load senders',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSenders(false);
    }
  };

  const fetchStates = async () => {
    setIsLoadingStates(true);
    try {
      const response = await fetch(
        getFullUrl(API_CONFIG.ENDPOINTS.MAIL_INBOUND_STATES),
        {
          method: 'GET',
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) throw new Error('Failed to fetch states');
      const data = await response.json();
      setStates(data.states || data || []);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to load states',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingStates(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updatePackageErrors = (
    packageId: number,
    field: keyof PackageErrors,
    value: string,
    options?: { isValid?: boolean; message?: string }
  ) => {
    const isValid = options?.isValid ?? !!value;
    const message = options?.message ?? '';
    setPackageErrors((prev) => {
      const updated = { ...(prev[packageId] || {}) };
      if (isValid) {
        delete updated[field];
      } else {
        updated[field] = message;
      }
      if (!Object.keys(updated).length) {
        const { [packageId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [packageId]: updated };
    });
  };

  const handlePackageInputChange = (
    packageId: number,
    field: keyof Omit<PackageData, 'id' | 'attachments'>,
    value: string,
  ) => {
    let updatedValue = value;

    if (field === 'recipientMobile') {
      updatedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    if (field === 'recipientEmail') {
      updatedValue = value.trim();
    }

    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === packageId ? { ...pkg, [field]: updatedValue } : pkg)),
    );

    if (field === 'recipientMobile') {
      updatePackageErrors(packageId, 'recipientMobile', updatedValue, {
        isValid: isValidMobileNumber(updatedValue),
        message: updatedValue
          ? 'Enter a valid 10-digit mobile number'
          : 'Recipient mobile is required',
      });
      return;
    }

    if (field === 'recipientEmail') {
      updatePackageErrors(packageId, 'recipientEmail', updatedValue, {
        isValid: updatedValue === '' || isValidEmail(updatedValue),
        message: 'Enter a valid email address',
      });
      return;
    }

    updatePackageErrors(packageId, field as keyof PackageErrors, updatedValue);
  };

  const handleFileUpload = (packageId: number, files: FileList | null) => {
    if (!files) return;
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === packageId ? { ...pkg, attachments: Array.from(files) } : pkg,
      ),
    );
    updatePackageErrors(packageId, 'attachments', 'file');
  };

  const handleAddPackage = () => {
    setPackages((prev) => [
      ...prev,
      {
        id: Math.max(...prev.map((p) => p.id)) + 1,
        senderId: '',
        recipientName: '',
        recipientEmail: '',
        recipientMobile: '',
        awbNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        type: '',
        attachments: [],
      },
    ]);
  };

  const handleRemovePackage = (packageId: number) => {
    if (packages.length === 1) {
      toast({
        title: 'Action blocked',
        description: 'At least one package is required',
        variant: 'destructive',
      });
      return;
    }
    setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
    setPackageErrors((prev) => {
      const { [packageId]: _, ...rest } = prev;
      return rest;
    });
  };

  const validateForm = () => {
    const newFormErrors: Partial<Record<keyof FormData, string>> = {};
    const newPackageErrors: Record<number, PackageErrors> = {};

    if (!formData.vendor) newFormErrors.vendor = 'Vendor is required';
    if (!formData.dateOfSending) newFormErrors.dateOfSending = 'Date of Sending is required';

    packages.forEach((pkg) => {
      const errors: PackageErrors = {};
      if (!pkg.senderId) errors.senderId = 'Sender is required';
      if (!pkg.recipientName.trim()) errors.recipientName = 'Recipient name is required';
      if (pkg.recipientEmail && !isValidEmail(pkg.recipientEmail)) {
        errors.recipientEmail = 'Enter a valid email address';
      }
      if (!isValidMobileNumber(pkg.recipientMobile)) {
        errors.recipientMobile = 'Enter a valid 10-digit mobile number';
      }
      if (!pkg.addressLine1.trim()) errors.addressLine1 = 'Address Line 1 is required';
      if (!pkg.city.trim()) errors.city = 'City is required';
      if (!pkg.state) errors.state = 'State is required';
      if (!pkg.pincode.trim()) errors.pincode = 'Pincode is required';
      if (!pkg.type) errors.type = 'Type is required';
      if (!pkg.attachments.length) errors.attachments = 'At least one attachment is required';

      if (Object.keys(errors).length) newPackageErrors[pkg.id] = errors;
    });

    setFormErrors(newFormErrors);
    setPackageErrors(newPackageErrors);

    if (Object.keys(newFormErrors).length || Object.keys(newPackageErrors).length) {
      toast({
        title: 'Validation error',
        description: 'Please fill all required fields marked in red',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getSelectedSiteId = (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('selectedSiteId') || '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formattedDate = formatDateToDDMMYYYY(formData.dateOfSending);
      const siteId = getSelectedSiteId();

      // Build mail_outbounds_attributes array from packages
      const mailOutboundsAttributes = packages.map((pkg) => {
        const sender = senders.find((s) => s.id.toString() === pkg.senderId);

        // Build mail_items_attributes
        const mailItemsAttributes = [{
          quantity: '1',
          item_type: pkg.type,
        }];

        // Build attachments_attributes using FormData
        const attachmentsData = pkg.attachments.map(() => ({
          document: 'FILE_UPLOAD_REQUIRED', // Will be replaced with actual file in FormData
        }));

        return {
          delivery_vendor_id: formData.vendor,
          receive_date: formattedDate,
          resource_id: siteId,
          resource_type: 'Pms::Site',
          user_id: pkg.senderId,
          sender_name: sender?.full_name || pkg.recipientName,
          sender_mobile: pkg.recipientMobile || '',
          awb_number: pkg.awbNumber || '',
          sender_company: '', // Not in form, leaving empty
          sender_address: pkg.addressLine1,
          sender_address1: pkg.addressLine2 || '',
          spree_state_id: pkg.state,
          city: pkg.city,
          pincode: pkg.pincode,
          mail_items_attributes: mailItemsAttributes,
          attachments_attributes: attachmentsData,
        };
      });

      // Build the complete payload
      const payload = {
        delivery_vendor_id: formData.vendor,
        receive_date: formattedDate,
        user: {
          mail_outbounds_attributes: mailOutboundsAttributes,
        },
      };

      // Create FormData for file upload
      const formDataPayload = new FormData();

      // Add the JSON payload as a stringified field or construct it differently
      // Based on Rails conventions, we'll construct it properly
      formDataPayload.append('delivery_vendor_id', formData.vendor);
      formDataPayload.append('receive_date', formattedDate);

      packages.forEach((pkg, pkgIndex) => {
        const sender = senders.find((s) => s.id.toString() === pkg.senderId);

        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][delivery_vendor_id]`, formData.vendor);
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][receive_date]`, formattedDate);
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][resource_id]`, siteId);
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][resource_type]`, 'Pms::Site');
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][user_id]`, pkg.senderId);
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][sender_name]`, sender?.full_name || pkg.recipientName);
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][sender_mobile]`, pkg.recipientMobile || '');
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][awb_number]`, pkg.awbNumber || '');
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][sender_company]`, '');
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][sender_address]`, pkg.addressLine1);
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][sender_address1]`, pkg.addressLine2 || '');
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][spree_state_id]`, pkg.state);
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][city]`, pkg.city);
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][pincode]`, pkg.pincode);

        // Add mail items
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][mail_items_attributes][0][quantity]`, '1');
        formDataPayload.append(`user[mail_outbounds_attributes][${pkgIndex}][mail_items_attributes][0][item_type]`, pkg.type);

        // Add attachments
        pkg.attachments.forEach((file, fileIndex) => {
          formDataPayload.append(
            `user[mail_outbounds_attributes][${pkgIndex}][attachments_attributes][${fileIndex}][document]`,
            file
          );
        });
      });

      const response = await fetch(getFullUrl('/pms/admin/mail_outbounds.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formDataPayload,
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = responseData?.message || responseData?.error || 'Failed to create outbound mail';
        throw new Error(errorMessage);
      }

      toast({
        title: 'Success',
        description: responseData?.message || 'Outbound mail created successfully',
      });

      navigate('/vas/mailroom/outbound');
    } catch (error) {
      console.error('Outbound submission failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create outbound mail',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/vas/mailroom/outbound')}
            className="mb-4 flex items-center gap-1 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Outbound List
          </Button>
          <h1
            className="text-2xl font-bold text-[#1a1a1a] uppercase"
            style={{ fontFamily: 'Work Sans, sans-serif' }}
          >
            NEW OUTBOUND
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card
            className="mb-6 border-[#D9D9D9] bg-white shadow-sm"
            style={{
              borderRadius: '4px',
              background: '#FFF',
              boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)',
            }}
          >
            <CardHeader className="bg-[#F6F4EE]">
              <CardTitle className="text-lg text-black flex items-center">
                <div
                  className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-2"
                  style={{ fontFamily: 'Work Sans, sans-serif' }}
                >
                  <Settings className="w-5 h-5" />
                </div>
                <span
                  style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600,
                    color: '#C72030',
                  }}
                >
                  BASIC DETAILS
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormControl fullWidth variant="outlined" error={!!formErrors.vendor}>
                    <InputLabel shrink>
                      Vendor <span style={{ color: '#C72030' }}>*</span>
                    </InputLabel>
                    <MuiSelect
                      label="Vendor"
                      displayEmpty
                      value={formData.vendor}
                      onChange={(e) => handleInputChange('vendor', e.target.value)}
                      sx={fieldStyles}
                      disabled={isLoadingVendors}
                    >
                      <MenuItem value="">
                        <em>{isLoadingVendors ? 'Loading vendors...' : 'Select Vendor'}</em>
                      </MenuItem>
                      {vendors.map((vendor) => (
                        <MenuItem key={vendor.id} value={vendor.id.toString()}>
                          {vendor.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                    {formErrors.vendor && <FormHelperText>{formErrors.vendor}</FormHelperText>}
                  </FormControl>
                </div>
                <div>
                  <TextField
                    fullWidth
                    type="date"
                    label={
                      <span>
                        Date of Sending <span style={{ color: '#C72030' }}>*</span>
                      </span>
                    }
                    value={formData.dateOfSending}
                    onChange={(e) => handleInputChange('dateOfSending', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ style: { height: 40 } }}
                    sx={{ '& .MuiInputBase-root': { height: 40 } }}
                    error={!!formErrors.dateOfSending}
                    helperText={formErrors.dateOfSending}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {packages.map((pkg, index) => (
            <Card
              key={pkg.id}
              className="mb-6 border-[#D9D9D9] bg-white shadow-sm"
              style={{
                borderRadius: '4px',
                background: '#FFF',
                boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)',
              }}
            >
              <CardHeader className="bg-[#F6F4EE]">
                <CardTitle className="text-lg text-black flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-2"
                      style={{ fontFamily: 'Work Sans, sans-serif' }}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    <span
                      style={{
                        fontFamily: 'Work Sans, sans-serif',
                        fontWeight: 600,
                        color: '#C72030',
                      }}
                    >
                      PACKAGE DETAILS {packages.length > 1 && `(${index + 1})`}
                    </span>
                  </div>
                  {packages.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemovePackage(pkg.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={!!packageErrors[pkg.id]?.senderId}
                    >
                      <InputLabel shrink>
                        Sender <span style={{ color: '#C72030' }}>*</span>
                      </InputLabel>
                      <MuiSelect
                        label="Sender"
                        displayEmpty
                        value={pkg.senderId}
                        onChange={(e) =>
                          handlePackageInputChange(pkg.id, 'senderId', e.target.value)
                        }
                        sx={fieldStyles}
                        disabled={isLoadingSenders}
                      >
                        <MenuItem value="">
                          <em>{isLoadingSenders ? 'Loading senders...' : 'Select Sender'}</em>
                        </MenuItem>
                        {senders.map((sender) => (
                          <MenuItem key={sender.id} value={sender.id.toString()}>
                            {sender.full_name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                      {packageErrors[pkg.id]?.senderId && (
                        <FormHelperText>{packageErrors[pkg.id]?.senderId}</FormHelperText>
                      )}
                    </FormControl>
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label={
                        <span>
                          Recipient Name <span style={{ color: '#C72030' }}>*</span>
                        </span>
                      }
                      placeholder="Enter Recipient's Name"
                      value={pkg.recipientName}
                      onChange={(e) =>
                        handlePackageInputChange(pkg.id, 'recipientName', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      error={!!packageErrors[pkg.id]?.recipientName}
                      helperText={packageErrors[pkg.id]?.recipientName}
                    />
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label="AWB Number"
                      placeholder="Enter AWB Number"
                      value={pkg.awbNumber}
                      onChange={(e) =>
                        handlePackageInputChange(pkg.id, 'awbNumber', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                    />
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label="Recipient's Email ID"
                      placeholder="Enter Recipient's Email"
                      type="email"
                      value={pkg.recipientEmail}
                      onChange={(e) =>
                        handlePackageInputChange(pkg.id, 'recipientEmail', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      error={!!packageErrors[pkg.id]?.recipientEmail}
                      helperText={packageErrors[pkg.id]?.recipientEmail}
                    />
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label="Recipient's Mobile"
                      placeholder="Enter Recipient's Mobile"
                      value={pkg.recipientMobile}
                      onChange={(e) =>
                        handlePackageInputChange(pkg.id, 'recipientMobile', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                      error={!!packageErrors[pkg.id]?.recipientMobile}
                      helperText={packageErrors[pkg.id]?.recipientMobile}
                    />
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label={
                        <span>
                          Recipient's Address Line 1 <span style={{ color: '#C72030' }}>*</span>
                        </span>
                      }
                      placeholder="Enter Address Line 1"
                      value={pkg.addressLine1}
                      onChange={(e) =>
                        handlePackageInputChange(pkg.id, 'addressLine1', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      error={!!packageErrors[pkg.id]?.addressLine1}
                      helperText={packageErrors[pkg.id]?.addressLine1}
                    />
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label="Recipient's Address Line 2"
                      placeholder="Enter Address Line 2"
                      value={pkg.addressLine2}
                      onChange={(e) =>
                        handlePackageInputChange(pkg.id, 'addressLine2', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                    />
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label={
                        <span>
                          City <span style={{ color: '#C72030' }}>*</span>
                        </span>
                      }
                      placeholder="Enter City"
                      value={pkg.city}
                      onChange={(e) => handlePackageInputChange(pkg.id, 'city', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      error={!!packageErrors[pkg.id]?.city}
                      helperText={packageErrors[pkg.id]?.city}
                    />
                  </div>

                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={!!packageErrors[pkg.id]?.state}
                    >
                      <InputLabel shrink>
                        State <span style={{ color: '#C72030' }}>*</span>
                      </InputLabel>
                      <MuiSelect
                        label="State"
                        displayEmpty
                        value={pkg.state}
                        onChange={(e) =>
                          handlePackageInputChange(pkg.id, 'state', e.target.value)
                        }
                        sx={fieldStyles}
                        disabled={isLoadingStates}
                      >
                        <MenuItem value="">
                          <em>{isLoadingStates ? 'Loading states...' : 'Select State'}</em>
                        </MenuItem>
                        {states.map((state) => (
                          <MenuItem key={state.id} value={state.id.toString()}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                      {packageErrors[pkg.id]?.state && (
                        <FormHelperText>{packageErrors[pkg.id]?.state}</FormHelperText>
                      )}
                    </FormControl>
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label={
                        <span>
                          Pincode <span style={{ color: '#C72030' }}>*</span>
                        </span>
                      }
                      placeholder="Enter Pincode"
                      value={pkg.pincode}
                      onChange={(e) =>
                        handlePackageInputChange(pkg.id, 'pincode', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      error={!!packageErrors[pkg.id]?.pincode}
                      helperText={packageErrors[pkg.id]?.pincode}
                    />
                  </div>

                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={!!packageErrors[pkg.id]?.type}
                    >
                      <InputLabel shrink>
                        Type <span style={{ color: '#C72030' }}>*</span>
                      </InputLabel>
                      <MuiSelect
                        label="Type"
                        displayEmpty
                        value={pkg.type}
                        onChange={(e) => handlePackageInputChange(pkg.id, 'type', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value="">
                          <em>Select Type</em>
                        </MenuItem>
                        <MenuItem value="Consumer Goods">Consumer Goods</MenuItem>
                        <MenuItem value="Documents">Documents</MenuItem>
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </MuiSelect>
                      {packageErrors[pkg.id]?.type && (
                        <FormHelperText>{packageErrors[pkg.id]?.type}</FormHelperText>
                      )}
                    </FormControl>
                  </div>

                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-2 text-[#1a1a1a]">
                      Attachments <span style={{ color: '#C72030' }}>*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        id={`attachments-upload-${pkg.id}`}
                        onChange={(e) => handleFileUpload(pkg.id, e.target.files)}
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          onClick={() =>
                            document.getElementById(`attachments-upload-${pkg.id}`)?.click()
                          }
                          className="!bg-[#C72030] !text-white text-sm"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose file
                        </Button>
                        <span className="text-sm text-gray-500">
                          {pkg.attachments.length
                            ? `${pkg.attachments.length} file(s) selected`
                            : 'No file chosen'}
                        </span>
                      </div>
                      {packageErrors[pkg.id]?.attachments && (
                        <p className="text-sm text-red-500 mt-2 text-left">
                          {packageErrors[pkg.id]?.attachments}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="mb-6 flex justify-start">
            <Button
              type="button"
              onClick={handleAddPackage}
              className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Package
            </Button>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 font-medium"
              style={{
                backgroundColor: '#C72030',
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOutboundPage;


