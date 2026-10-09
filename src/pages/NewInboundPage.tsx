import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Settings, Package, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';

interface FormData {
    vendor: string;
    dateOfReceiving: string;
}

interface PackageData {
    id: number;
    recipient: string;
    sender: string;
    mobile: string;
    awbNumber: string;
    company: string;
    companyAddressLine1: string;
    companyAddressLine2: string;
    state: string;
    city: string;
    pincode: string;
    type: string;
    otherType: string;
    attachments: File[];
}

interface PackageValidationErrors {
    recipient?: string;
    sender?: string;
    mobile?: string;
    companyAddressLine1?: string;
    type?: string;
    otherType?: string;
    attachments?: string;
}

const MAIL_INBOUND_ENDPOINT = '/pms/admin/mail_inbounds.json';

export const NewInboundPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState<FormData>({
        vendor: '',
        dateOfReceiving: '',
    });

    const [packages, setPackages] = useState<PackageData[]>([
        {
            id: 1,
            recipient: '',
            sender: '',
            mobile: '',
            awbNumber: '',
            company: '',
            companyAddressLine1: '',
            companyAddressLine2: '',
            state: '',
            city: '',
            pincode: '',
            type: '',
            otherType: '',
            attachments: []
        }
    ]);

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
    const [vendorName, setVendorName] = useState('');
    const [trackUrl, setTrackUrl] = useState('');
    const [vendors, setVendors] = useState<Array<{ id: number; name: string }>>([]);
    const [isLoadingVendors, setIsLoadingVendors] = useState(false);
    const [recipients, setRecipients] = useState<Array<{ id: number; full_name: string; resource_id?: number; resource_type?: string }>>([]);
    const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
    const [statesList, setStatesList] = useState<Array<{ id: number; name: string }>>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [packageErrors, setPackageErrors] = useState<Record<number, PackageValidationErrors>>({});

    // Fetch vendors on component mount
    useEffect(() => {
        fetchVendors();
        fetchRecipients();
        fetchStates();
    }, []);

    const formatDateToDDMMYYYY = (value: string) => {
        if (!value) return '';
        const [year, month, day] = value.split('-');
        if (!year || !month || !day) return value;
        return `${day}/${month}/${year}`;
    };

    const sanitizeText = (value: string) => value?.trim() || '';
    const MOBILE_NUMBER_REGEX = /^\d{10}$/;
    const isValidMobileNumber = (value: string) => MOBILE_NUMBER_REGEX.test(value);

    const getSelectedSiteId = () => {
        if (typeof window === 'undefined') return '';
        return localStorage.getItem('selectedSiteId') || '';
    };

    const clearPackageFieldError = (packageId: number, field: keyof PackageValidationErrors) => {
        setPackageErrors(prev => {
            if (!prev[packageId] || !prev[packageId][field]) {
                return prev;
            }

            const updatedPackageErrors = { ...prev[packageId] };
            delete updatedPackageErrors[field];

            const nextErrors = { ...prev };
            if (Object.keys(updatedPackageErrors).length === 0) {
                const { [packageId]: _removed, ...rest } = nextErrors;
                return rest;
            }

            nextErrors[packageId] = updatedPackageErrors;
            return nextErrors;
        });
    };

    const fetchVendors = async () => {
        setIsLoadingVendors(true);
        try {
            const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.DELIVERY_VENDORS), {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch vendors');
            }

            const data = await response.json();
            // Assuming the API returns an array of vendors with id and name
            setVendors(data.delivery_vendors || data || []);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast({
                title: 'Error',
                description: 'Failed to load vendors',
                variant: 'destructive',
            });
        } finally {
            setIsLoadingVendors(false);
        }
    };

    const fetchRecipients = async () => {
        setIsLoadingRecipients(true);
        try {
            const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.ESCALATION_USERS), {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recipients');
            }

            const data = await response.json();
            // Assuming the API returns an array of users
            setRecipients(data.users || data || []);
        } catch (error) {
            console.error('Error fetching recipients:', error);
            toast({
                title: 'Error',
                description: 'Failed to load recipients',
                variant: 'destructive',
            });
        } finally {
            setIsLoadingRecipients(false);
        }
    };

    const fetchStates = async () => {
        setIsLoadingStates(true);
        try {
            const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.MAIL_INBOUND_STATES), {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch states');
            }

            const data = await response.json();
            // Assuming the API returns an array of state names
            setStatesList(data.states || data || []);
        } catch (error) {
            console.error('Error fetching states:', error);
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
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handlePackageInputChange = (
        packageId: number,
        field: keyof Omit<PackageData, 'id' | 'attachments'>,
        value: string
    ) => {
        let updatedValue = value;

        if (field === 'mobile') {
            updatedValue = value.replace(/\D/g, '').slice(0, 10);
        }

        setPackages(prev => prev.map(pkg =>
            pkg.id === packageId ? { ...pkg, [field]: updatedValue } : pkg
        ));

        const errorFields: Array<keyof PackageValidationErrors> = ['recipient', 'sender', 'mobile', 'companyAddressLine1', 'type', 'otherType'];
        if (errorFields.includes(field as keyof PackageValidationErrors)) {
            if (field === 'mobile') {
                if (isValidMobileNumber(updatedValue)) {
                    clearPackageFieldError(packageId, 'mobile');
                }
            } else {
                clearPackageFieldError(packageId, field as keyof PackageValidationErrors);
            }
        }

        if (field === 'type' && value !== 'Others') {
            clearPackageFieldError(packageId, 'otherType');
        }
    };

    const handleFileUpload = (packageId: number, files: FileList | null) => {
        if (files) {
            setPackages(prev => prev.map(pkg =>
                pkg.id === packageId ? { ...pkg, attachments: Array.from(files) } : pkg
            ));
            clearPackageFieldError(packageId, 'attachments');
        }
    };

    const handleAddPackage = () => {
        const newId = packages.length ? Math.max(...packages.map(p => p.id)) + 1 : 1;
        const newPackage: PackageData = {
            id: newId,
            recipient: '',
            sender: '',
            mobile: '',
            awbNumber: '',
            company: '',
            companyAddressLine1: '',
            companyAddressLine2: '',
            state: '',
            city: '',
            pincode: '',
            type: '',
            otherType: '',
            attachments: []
        };
        setPackages(prev => [...prev, newPackage]);
    };

    const handleRemovePackage = (packageId: number) => {
        if (packages.length > 1) {
            setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
            setPackageErrors(prev => {
                if (!prev[packageId]) return prev;
                const { [packageId]: _removed, ...rest } = prev;
                return rest;
            });
        } else {
            toast({
                title: 'Error',
                description: 'At least one package is required',
                variant: 'destructive',
            });
        }
    };

    const validateForm = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        const newPackageErrors: Record<number, PackageValidationErrors> = {};

        if (!formData.vendor) newErrors.vendor = 'Vendor is required';
        if (!formData.dateOfReceiving) newErrors.dateOfReceiving = 'Date of Receiving is required';

        packages.forEach(pkg => {
            const errorsForPackage: PackageValidationErrors = {};

            if (!pkg.recipient) errorsForPackage.recipient = 'Recipient is required';
            if (!pkg.sender.trim()) errorsForPackage.sender = 'Sender is required';
            if (!isValidMobileNumber(pkg.mobile)) {
                errorsForPackage.mobile = 'Enter a valid 10-digit mobile number';
            }
            if (!pkg.companyAddressLine1.trim()) errorsForPackage.companyAddressLine1 = 'Address Line 1 is required';
            if (!pkg.type) errorsForPackage.type = 'Type is required';
            if (pkg.type === 'Others' && !pkg.otherType.trim()) {
                errorsForPackage.otherType = 'Please specify the type';
            }
            // if (!pkg.attachments.length) {
            //     errorsForPackage.attachments = 'At least one attachment is required';
            // }

            if (Object.keys(errorsForPackage).length > 0) {
                newPackageErrors[pkg.id] = errorsForPackage;
            }
        });

        const hasErrors = Object.keys(newErrors).length > 0 || Object.keys(newPackageErrors).length > 0;

        setErrors(newErrors);
        setPackageErrors(newPackageErrors);

        if (hasErrors) {
            toast({
                title: 'Error',
                description: 'Please fill all required fields highlighted in red',
                variant: 'destructive',
            });
        }

        return !hasErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formattedDate = formatDateToDDMMYYYY(formData.dateOfReceiving);
            const payload = new FormData();
            const selectedSiteId = getSelectedSiteId();

            payload.append('delivery_vendor_id', formData.vendor);
            payload.append('receive_date', formattedDate);

            packages.forEach((pkg, index) => {
                const recipientDetails = recipients.find(recipient => recipient.id.toString() === pkg.recipient);
                const baseKey = `user[mail_inbounds_attributes][${index}]`;
                const itemType = pkg.type === 'Others' ? pkg.otherType : pkg.type;
                const normalizedItemType = sanitizeText(itemType);

                payload.append(`${baseKey}[delivery_vendor_id]`, formData.vendor);
                payload.append(`${baseKey}[receive_date]`, formattedDate);

                if (selectedSiteId) {
                    payload.append(`${baseKey}[resource_id]`, selectedSiteId);
                }
                payload.append(`${baseKey}[resource_type]`, recipientDetails?.resource_type || 'Pms::Site');
                payload.append(`${baseKey}[user_id]`, pkg.recipient);
                payload.append(`${baseKey}[sender_name]`, sanitizeText(pkg.sender));
                payload.append(`${baseKey}[sender_mobile]`, sanitizeText(pkg.mobile));
                payload.append(`${baseKey}[awb_number]`, sanitizeText(pkg.awbNumber));
                payload.append(`${baseKey}[sender_company]`, sanitizeText(pkg.company));
                payload.append(`${baseKey}[sender_address]`, sanitizeText(pkg.companyAddressLine1));
                payload.append(`${baseKey}[sender_address1]`, sanitizeText(pkg.companyAddressLine2));
                payload.append(`${baseKey}[spree_state_id]`, pkg.state);
                payload.append(`${baseKey}[city]`, sanitizeText(pkg.city));
                payload.append(`${baseKey}[pincode]`, sanitizeText(pkg.pincode));

                payload.append(`${baseKey}[mail_items_attributes][0][quantity]`, '1');
                payload.append(`${baseKey}[mail_items_attributes][0][item_type]`, normalizedItemType);

                pkg.attachments.forEach((file, attachmentIndex) => {
                    payload.append(`${baseKey}[attachments_attributes][${attachmentIndex}][document]`, file);
                });
            });

            const response = await fetch(getFullUrl(MAIL_INBOUND_ENDPOINT), {
                method: 'POST',
                headers: {
                    'Authorization': getAuthHeader(),
                },
                body: payload,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create inbound');
            }

            await response.json().catch(() => ({}));

            toast({
                title: 'Success',
                description: 'Inbound created successfully',
            });

            // Navigate back or to inbound list
            // navigate('/vas/mailroom/inbound');
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create inbound',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitVendor = async () => {
        if (!vendorName.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter vendor name',
                variant: 'destructive',
            });
            return;
        }

        try {
            const payload = {
                delivery_vendor: {
                    name: vendorName,
                    track_url: trackUrl
                }
            };

            const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.DELIVERY_VENDORS), {
                method: 'POST',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add vendor');
            }

            toast({
                title: 'Success',
                description: 'Vendor added successfully',
            });

            // Refresh vendor list
            await fetchVendors();

            // Close modal and reset fields
            setIsAddVendorModalOpen(false);
            setVendorName('');
            setTrackUrl('');
        } catch (error) {
            console.error('Error adding vendor:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to add vendor',
                variant: 'destructive',
            });
        }
    };

    const fieldStyles = {
        backgroundColor: '#fff',
        '& .MuiOutlinedInput-root': {
            minHeight: '44px',
            fontSize: '13.5px',
            fontWeight: 500,
        },
    };

    const footerBtnClass =
        'inline-flex h-[42px] w-[160px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-[22px] text-[13px] font-semibold leading-none text-white hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50';

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div style={{ padding: '24px 32px 48px' }}>
                <button
                    type="button"
                    onClick={() => navigate('/vas/mailroom/inbound')}
                    className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[12.5px] font-semibold text-[var(--color-ink-48)] hover:text-[var(--color-text)]"
                    style={{ marginBottom: 12 }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Inbound List
                </button>
                <h1
                    className="uppercase text-[var(--color-text)]"
                    style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.2, margin: '0 0 22px' }}
                >
                    NEW INBOUND
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <section
                        className="bg-white"
                        style={{ border: '1px solid var(--color-line-card)', borderRadius: 16, padding: '22px 24px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-ink-68)]"
                                style={{ marginRight: 8 }}
                            >
                                <Settings className="h-4 w-4" />
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--color-text)' }}>
                                BASIC DETAILS
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 14 }}>
                                {/* Vendor */}
                                <div>
                                    <FormControl fullWidth variant="outlined" error={!!errors.vendor}>
                                        <InputLabel shrink>
                                            Vendor <span style={{ color: 'var(--color-danger)' }}>*</span>
                                        </InputLabel>
                                        <MuiSelect
                                            label="Vendor"
                                            displayEmpty
                                            value={formData.vendor}
                                            onChange={e => handleInputChange('vendor', e.target.value)}
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
                                        {errors.vendor && <FormHelperText>{errors.vendor}</FormHelperText>}
                                    </FormControl>
                                </div>

                                {/* Date of Receiving */}
                                <div>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label={
                                            <span>
                                                Date of Receiving <span style={{ color: 'var(--color-danger)' }}>*</span>
                                            </span>
                                        }
                                        value={formData.dateOfReceiving}
                                        onChange={e => handleInputChange('dateOfReceiving', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={fieldStyles}
                                        error={!!errors.dateOfReceiving}
                                        helperText={errors.dateOfReceiving}
                                    />
                                </div>
                            </div>
                        </section>

                    {packages.map((pkg, index) => (
                        <section
                            key={pkg.id}
                            className="bg-white"
                            style={{ border: '1px solid var(--color-line-card)', borderRadius: 16, padding: '22px 24px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
                                <div className="flex items-center">
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-ink-68)]"
                                        style={{ marginRight: 8 }}
                                    >
                                        <Package className="h-4 w-4" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--color-text)' }}>
                                        PACKAGE DETAILS {packages.length > 1 && `(${index + 1})`}
                                    </span>
                                </div>
                                {packages.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePackage(pkg.id)}
                                        className="inline-flex h-8 items-center justify-center rounded-lg border border-[var(--color-line)] bg-white px-3 text-xs font-semibold text-[var(--color-danger)] hover:bg-[var(--color-surface)]"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 14 }}>
                                    {/* Recipient */}
                                    <div>
                                        <FormControl fullWidth variant="outlined" error={!!packageErrors[pkg.id]?.recipient}>
                                            <InputLabel shrink>
                                                Recipient <span style={{ color: 'var(--color-danger)' }}>*</span>
                                            </InputLabel>
                                            <MuiSelect
                                                label="Recipient"
                                                displayEmpty
                                                value={pkg.recipient}
                                                onChange={e => handlePackageInputChange(pkg.id, 'recipient', e.target.value)}
                                                sx={fieldStyles}
                                                disabled={isLoadingRecipients}
                                            >
                                                <MenuItem value="">
                                                    <em>{isLoadingRecipients ? 'Loading recipients...' : 'Select Recipient'}</em>
                                                </MenuItem>
                                                {recipients.map((recipient) => (
                                                    <MenuItem key={recipient.id} value={recipient.id.toString()}>
                                                        {recipient.full_name}
                                                    </MenuItem>
                                                ))}
                                            </MuiSelect>
                                            {packageErrors[pkg.id]?.recipient && (
                                                <FormHelperText>{packageErrors[pkg.id]?.recipient}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </div>

                                    {/* Sender */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label={
                                                <span>
                                                    Sender <span style={{ color: 'var(--color-danger)' }}>*</span>
                                                </span>
                                            }
                                            placeholder="Enter Sender's Name"
                                            value={pkg.sender}
                                            onChange={e => handlePackageInputChange(pkg.id, 'sender', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                            error={!!packageErrors[pkg.id]?.sender}
                                            helperText={packageErrors[pkg.id]?.sender}
                                        />
                                    </div>

                                    {/* Mobile */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Mobile"
                                            placeholder="Enter Sender's Mobile"
                                            value={pkg.mobile}
                                            onChange={e => handlePackageInputChange(pkg.id, 'mobile', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                                            error={!!packageErrors[pkg.id]?.mobile}
                                            helperText={packageErrors[pkg.id]?.mobile}
                                        />
                                    </div>

                                    {/* AWB Number */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="AWB Number"
                                            placeholder="Enter AWB Number"
                                            value={pkg.awbNumber}
                                            onChange={e => handlePackageInputChange(pkg.id, 'awbNumber', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Company"
                                            placeholder="Enter Company's Name"
                                            value={pkg.company}
                                            onChange={e => handlePackageInputChange(pkg.id, 'company', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Company's Address Line 1 */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label={
                                                <span>
                                                    Company's Address Line 1 <span style={{ color: 'var(--color-danger)' }}>*</span>
                                                </span>
                                            }
                                            placeholder="Enter Company's Address Line 1"
                                            value={pkg.companyAddressLine1}
                                            onChange={e => handlePackageInputChange(pkg.id, 'companyAddressLine1', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                            error={!!packageErrors[pkg.id]?.companyAddressLine1}
                                            helperText={packageErrors[pkg.id]?.companyAddressLine1}
                                        />
                                    </div>

                                    {/* Company's Address Line 2 */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Company's Address Line 2"
                                            placeholder="Enter Company's Address Line 2"
                                            value={pkg.companyAddressLine2}
                                            onChange={e => handlePackageInputChange(pkg.id, 'companyAddressLine2', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>State</InputLabel>
                                            <MuiSelect
                                                label="State"
                                                displayEmpty
                                                value={pkg.state}
                                                onChange={e => handlePackageInputChange(pkg.id, 'state', e.target.value)}
                                                sx={fieldStyles}
                                                disabled={isLoadingStates}
                                            >
                                                <MenuItem value="">
                                                    <em>{isLoadingStates ? 'Loading states...' : 'Select State'}</em>
                                                </MenuItem>
                                                {statesList.map(state => (
                                                    <MenuItem key={state.id} value={state.id.toString()}>
                                                        {state.name}
                                                    </MenuItem>
                                                ))}
                                            </MuiSelect>
                                        </FormControl>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            placeholder="Enter City"
                                            value={pkg.city}
                                            onChange={e => handlePackageInputChange(pkg.id, 'city', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Pincode */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Pincode"
                                            placeholder="Enter Pincode"
                                            value={pkg.pincode}
                                            onChange={e => handlePackageInputChange(pkg.id, 'pincode', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <FormControl fullWidth variant="outlined" error={!!packageErrors[pkg.id]?.type}>
                                            <InputLabel shrink>
                                                Type <span style={{ color: 'var(--color-danger)' }}>*</span>
                                            </InputLabel>
                                            <MuiSelect
                                                label="Type"
                                                displayEmpty
                                                value={pkg.type}
                                                onChange={e => handlePackageInputChange(pkg.id, 'type', e.target.value)}
                                                sx={fieldStyles}
                                            >
                                                <MenuItem value="">
                                                    <em>Select Type</em>
                                                </MenuItem>
                                                <MenuItem value="Mail">Mail</MenuItem>
                                                <MenuItem value="Consumer Goods">Consumer Goods</MenuItem>
                                                <MenuItem value="Pallet Shipments">Pallet Shipments</MenuItem>
                                                <MenuItem value="Legal Documents">Legal Documents</MenuItem>
                                                <MenuItem value="Financial Documents">Financial Documents</MenuItem>
                                                <MenuItem value="Others">Others</MenuItem>
                                            </MuiSelect>
                                            {packageErrors[pkg.id]?.type && (
                                                <FormHelperText>{packageErrors[pkg.id]?.type}</FormHelperText>
                                            )}
                                        </FormControl>

                                        {/* Other Type Input - Shows when "Others" is selected */}
                                        {pkg.type === 'Others' && (
                                            <TextField
                                                fullWidth
                                                label="Specify Other Type"
                                                placeholder="Enter Type"
                                                value={pkg.otherType}
                                                onChange={e => handlePackageInputChange(pkg.id, 'otherType', e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{ sx: fieldStyles }}
                                                className="mt-2"
                                                error={!!packageErrors[pkg.id]?.otherType}
                                                helperText={packageErrors[pkg.id]?.otherType}
                                            />
                                        )}
                                    </div>

                                    <div className="lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink-68)' }}>
                                            Attachments
                                        </label>
                                        <div
                                            style={{
                                                border: '2px dashed #EBE9E2',
                                                borderRadius: 12,
                                                padding: 18,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                background: '#fff',
                                            }}
                                        >
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                id={`attachments-upload-${pkg.id}`}
                                                onChange={e => handleFileUpload(pkg.id, e.target.files)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById(`attachments-upload-${pkg.id}`)?.click()}
                                                className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--color-line)] bg-white px-[22px] text-[13px] font-semibold text-[var(--color-ink-68)] hover:border-[rgba(26,26,24,0.28)] hover:text-[var(--color-text)]"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Choose file
                                            </button>
                                            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--color-ink-48)' }}>
                                                {pkg.attachments.length > 0
                                                    ? `${pkg.attachments.length} file(s) selected`
                                                    : 'No file chosen'}
                                            </span>
                                            {packageErrors[pkg.id]?.attachments && (
                                                <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-danger)' }}>
                                                    {packageErrors[pkg.id]?.attachments}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                        </section>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                        <button
                            type="button"
                            onClick={() => navigate('/vas/mailroom/inbound')}
                            className="inline-flex h-[42px] w-[160px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[var(--color-line)] bg-white px-[22px] text-[13px] font-semibold leading-none text-[var(--color-ink-68)] hover:border-[rgba(26,26,24,0.28)] hover:text-[var(--color-text)]"
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className={footerBtnClass}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>

                {/* Add Vendor Modal */}
                <Dialog open={isAddVendorModalOpen} onOpenChange={setIsAddVendorModalOpen}>
                    <DialogContent className="gap-0 sm:max-w-[580px]" style={{ padding: 28, borderRadius: 24 }}>
                        <DialogHeader className="flex flex-row items-center justify-between space-y-0 text-left" style={{ marginBottom: 20 }}>
                            <DialogTitle style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>Add Vendor</DialogTitle>
                            <button
                                type="button"
                                onClick={() => setIsAddVendorModalOpen(false)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-0 bg-transparent text-[var(--color-ink-48)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </DialogHeader>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <Label htmlFor="vendorName" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink-68)' }}>
                                    Name <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </Label>
                                <Input
                                    id="vendorName"
                                    type="text"
                                    placeholder="Enter Name"
                                    value={vendorName}
                                    onChange={(e) => setVendorName(e.target.value)}
                                    className="h-[44px] min-h-[44px] w-full rounded-xl px-3.5 text-[13.5px] font-medium"
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <Label htmlFor="trackUrl" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink-68)' }}>
                                    Track Url
                                </Label>
                                <Input
                                    id="trackUrl"
                                    type="text"
                                    placeholder="Enter Track Url"
                                    value={trackUrl}
                                    onChange={(e) => setTrackUrl(e.target.value)}
                                    className="h-[44px] min-h-[44px] w-full rounded-xl px-3.5 text-[13.5px] font-medium"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                            <button type="button" onClick={handleSubmitVendor} className={footerBtnClass}>
                                Submit
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default NewInboundPage;
