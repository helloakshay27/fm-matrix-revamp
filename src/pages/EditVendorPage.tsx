import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
        backgroundColor: '#DA7756',
        color: 'white',
        border: '1px solid #DA7756',
    }),
    ...(ownerState.completed && {
        backgroundColor: '#DA7756',
        color: 'white',
        border: '1px solid #DA7756',
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
    backgroundColor: '#fffaf6',
    color: '#DA7756',
    minWidth: '128px',
    height: '44px',
    borderRadius: '10px',
    fontSize: '14px',
    textTransform: 'none',
    padding: '8px 16px',
    fontFamily: 'Work Sans, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.02em',
    border: '1px solid #DA7756',
    boxShadow: '0 4px 10px rgba(218, 119, 86, 0.12)',
    '&, &.MuiButton-root': {
        color: '#DA7756',
    },
    '&:hover': {
        backgroundColor: '#fdf0ea',
        boxShadow: '0 6px 14px rgba(218, 119, 86, 0.16)',
    },
}));

const DraftButton = styled(MuiButton)(({ theme }) => ({
    backgroundColor: '#fffaf6',
    color: '#DA7756',
    minWidth: '108px',
    height: '44px',
    borderRadius: '10px',
    fontSize: '14px',
    textTransform: 'none',
    padding: '8px 16px',
    fontFamily: 'Work Sans, sans-serif',
    fontWeight: 600,
    border: '1px solid #E2D3C6',
    '&:hover': {
        backgroundColor: '#fdf0ea',
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
            borderColor: '#DA7756',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#DA7756',
        },
    },
    '& .MuiInputLabel-root': {
        fontSize: '14px',
        '&.Mui-focused': {
            color: '#DA7756',
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
    date: '' as string,
    services: '',
    gstTreatment: '',
    gstin: '',
    businessLegalName: '',
    businessTradeName: '',
    placeOfSupply: '',
    accountName: '',
    accountNumber: '',
    bankBranchName: '',
    ifscCode: '',
    reKyc: '',
    customDate: null as Date | null,
};

const initialContactPerson = {
    id: null as number | null,
    firstName: '',
    lastName: '',
    primaryEmail: '',
    secondaryEmail: '',
    primaryMobile: '',
    secondaryMobile: '',
};

export const EditVendorPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { suppliers, services, loading } = useApiData();
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<any>({});
    const [contactPersons, setContactPersons] = useState([initialContactPerson]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [billingAddress, setBillingAddress] = useState({
        country: '',
        state: '',
        city: '',
        pincode: '',
        addressLine1: '',
        addressLine2: '',
    });
    const [shippingAddress, setShippingAddress] = useState({
        country: '',
        state: '',
        city: '',
        pincode: '',
        addressLine1: '',
        addressLine2: '',
    });

    const [panAttachments, setPanAttachments] = useState<File[]>([]);
    const [tanAttachments, setTanAttachments] = useState<File[]>([]);
    const [gstAttachments, setGstAttachments] = useState<File[]>([]);
    const [kycAttachments, setKycAttachments] = useState<File[]>([]);
    const [complianceAttachments, setComplianceAttachments] = useState<File[]>([]);
    const [otherAttachments, setOtherAttachments] = useState<File[]>([]);
    const [openingBalances, setOpeningBalances] = useState([
        { id: null as number | null, billNo: '', date: '', dueDate: '', accountType: 'Bill', amount: '' }
    ]);
    const [loadingVendor, setLoadingVendor] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const loadVendor = async () => {
            if (!id) {
                setFetchError('Vendor ID is missing.');
                setLoadingVendor(false);
                return;
            }

            setLoadingVendor(true);
            try {
                const data: any = await vendorService.getVendorById(id);

                const normalizeVendorType = () => {
                    if (Array.isArray(data.supplier_type)) {
                        return data.supplier_type[0] ? String(data.supplier_type[0]) : '';
                    }
                    return data.supplier_type ? String(data.supplier_type) : '';
                };

                const normalizeService = () => {
                    if (Array.isArray(data.services)) {
                        return data.services[0]?.id ? String(data.services[0].id) : '';
                    }
                    return data.services?.id ? String(data.services.id) : '';
                };

                const normalizeContacts = () => {
                    if (!Array.isArray(data.contacts) || data.contacts.length === 0) {
                        return [initialContactPerson];
                    }
                    return data.contacts.map((contact: any) => ({
                        id: contact.id ?? null,
                        firstName: contact.first_name || '',
                        lastName: contact.last_name || '',
                        primaryEmail: contact.email1 || '',
                        secondaryEmail: contact.email2 || '',
                        primaryMobile: contact.mobile1 || '',
                        secondaryMobile: contact.mobile2 || '',
                    }));
                };

                const billing: any = data.default_billing_address ||
                    (Array.isArray(data.billing_addresses) ? data.billing_addresses[0] : null) || {};
                const shipping: any = data.default_shipping_address ||
                    (Array.isArray(data.shipping_addresses) ? data.shipping_addresses[0] : null) || {};

                let reKycValue = '';
                let customDateValue: Date | null = null;
                if (data.re_kyc_in) {
                    const raw = String(data.re_kyc_in);
                    const monthsMatch = raw.match(/^(\d+)_months?$/);
                    if (monthsMatch) {
                        reKycValue = `${monthsMatch[1]}m`;
                    } else if (['3m', '6m', '9m', '12m'].includes(raw)) {
                        reKycValue = raw;
                    } else if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
                        reKycValue = 'custom';
                        customDateValue = new Date(raw);
                    } else if (raw === 'custom' && data.re_kyc_date) {
                        reKycValue = 'custom';
                        customDateValue = new Date(data.re_kyc_date);
                    }
                }
                setFormData({
                    companyName: data.company_name || '',
                    primaryPhone: data.mobile1 || '',
                    secondaryPhone: data.mobile2 || '',
                    email: data.email || '',
                    pan: data.pan_number || '',
                    gst: data.gstin_number || data.primary_gst_detail?.gstin || '',
                    supplierType: normalizeVendorType(),
                    websiteUrl: data.website_url || data.website || '',
                    serviceDescription: data.service_description || '',
                    date: data.signed_on_contract ? String(data.signed_on_contract) : '',
                    services: normalizeService(),
                    gstTreatment: data.gst_preference || data.primary_gst_detail?.gst_preference || '',
                    gstin: data.primary_gst_detail?.gstin || data.gstin_number || '',
                    businessLegalName: data.primary_gst_detail?.business_legal_name || '',
                    businessTradeName: data.primary_gst_detail?.business_trade_name || '',
                    placeOfSupply: data.primary_gst_detail?.place_of_supply || '',
                    accountName: data.account_name || '',
                    accountNumber: data.account_number || '',
                    bankBranchName: data.bank_branch_name || '',
                    ifscCode: data.ifsc_code || '',
                    reKyc: reKycValue,
                    customDate: customDateValue,
                });

                setBillingAddress({
                    country: billing.country || '',
                    state: billing.state || '',
                    city: billing.city || '',
                    pincode: billing.pin_code || '',
                    addressLine1: billing.address || '',
                    addressLine2: billing.address_line_two || '',
                });

                setShippingAddress({
                    country: shipping.country || '',
                    state: shipping.state || '',
                    city: shipping.city || '',
                    pincode: shipping.pin_code || '',
                    addressLine1: shipping.address || '',
                    addressLine2: shipping.address_line_two || '',
                });

                setContactPersons(normalizeContacts());

                if (Array.isArray(data.opening_balances) && data.opening_balances.length > 0) {
                    setOpeningBalances(
                        data.opening_balances.map((row: any) => ({
                            id: row.id ?? null,
                            billNo: row.bill_no || '',
                            date: row.date || '',
                            dueDate: row.due_date || '',
                            accountType: row.account_type || 'Bill',
                            amount: row.amount != null ? String(Math.abs(Number(row.amount))) : '',
                        }))
                    );
                }
            } catch (error) {
                console.error('Failed to load vendor details for edit', error);
                setFetchError('Failed to load vendor details.');
            } finally {
                setLoadingVendor(false);
            }
        };

        loadVendor();
    }, [id]);

    const validateStep = () => {
        const newErrors: any = {};
        let isValid = true;

        const phoneRegex = /^[6-9]\d{9}$/;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        const alphabeticRegex = /^[a-zA-Z\s]+$/;

        const validateAlphabeticField = (value: string, fieldName: string) => {
            if (value.trim() && !alphabeticRegex.test(value.trim())) {
                newErrors[fieldName.toLowerCase()] = `${fieldName} should only contain alphabets and spaces`;
                isValid = false;
                return false;
            }
            return true;
        };

        if (activeStep === 0) {
            if (!formData.companyName.trim()) {
                newErrors.companyName = 'Company Name is required';
                isValid = false;
            }

            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
                isValid = false;
            }

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

            if (!formData.gstTreatment.trim()) {
                newErrors.gstTreatment = 'GST Treatment is required';
                isValid = false;
            } else {
                if (formData.gstin.trim() && !gstRegex.test(formData.gstin.trim().toUpperCase())) {
                    newErrors.gstin = 'Invalid GSTIN format. e.g. 27AAAAA1234A1Z5';
                    isValid = false;
                }

                if ((formData.gstTreatment === 'registered_regular' || formData.gstTreatment === 'registered_composition') &&
                    formData.businessLegalName.trim() && !alphabeticRegex.test(formData.businessLegalName.trim())) {
                    newErrors.businessLegalName = 'Business Legal Name should only contain alphabets and spaces';
                    isValid = false;
                }

                if ((formData.gstTreatment === 'registered_regular' || formData.gstTreatment === 'registered_composition') &&
                    formData.businessTradeName.trim() && !alphabeticRegex.test(formData.businessTradeName.trim())) {
                    newErrors.businessTradeName = 'Business Trade Name should only contain alphabets and spaces';
                    isValid = false;
                }
            }

            if (formData.websiteUrl.trim() && !urlRegex.test(formData.websiteUrl.trim())) {
                newErrors.websiteUrl = 'Please enter a valid website URL';
                isValid = false;
            }
        }

        if (activeStep === 1) {
            const alphabeticRegexAddress = /^[a-zA-Z\s]+$/;
            const addresses = [
                { address: billingAddress, type: 'billing', label: 'Billing Address' },
                { address: shippingAddress, type: 'shipping', label: 'Shipping Address' },
            ];

            addresses.forEach(({ address, type, label }) => {
                if (!address.country.trim()) {
                    newErrors[`address_${type}_country`] = `${label} - Country is required`;
                    isValid = false;
                } else if (!alphabeticRegexAddress.test(address.country.trim())) {
                    newErrors[`address_${type}_country`] = `${label} - Country should only contain alphabets`;
                    isValid = false;
                }

                if (!address.state.trim()) {
                    newErrors[`address_${type}_state`] = `${label} - State is required`;
                    isValid = false;
                } else if (!alphabeticRegexAddress.test(address.state.trim())) {
                    newErrors[`address_${type}_state`] = `${label} - State should only contain alphabets`;
                    isValid = false;
                }

                if (!address.city.trim()) {
                    newErrors[`address_${type}_city`] = `${label} - City is required`;
                    isValid = false;
                } else if (!alphabeticRegexAddress.test(address.city.trim())) {
                    newErrors[`address_${type}_city`] = `${label} - City should only contain alphabets`;
                    isValid = false;
                }

                if (!address.addressLine1.trim()) {
                    newErrors[`address_${type}_addressLine1`] = `${label} - Address Line 1 is required`;
                    isValid = false;
                }

                if (address.pincode.trim() && !/^[0-9]{6}$/.test(address.pincode.trim())) {
                    newErrors[`address_${type}_pincode`] = `${label} - Enter valid 6-digit pincode`;
                    isValid = false;
                }
            });
        }

        if (activeStep === 2) {
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

        if (activeStep === 3) {
            contactPersons.forEach((contact, index) => {
                if (!contact.firstName.trim()) {
                    newErrors[`contact_${index}_firstName`] = 'First name is required';
                    isValid = false;
                }

                if (!contact.lastName.trim()) {
                    newErrors[`contact_${index}_lastName`] = 'Last name is required';
                    isValid = false;
                }

                if (!contact.primaryEmail.trim()) {
                    newErrors[`contact_${index}_primaryEmail`] = 'Primary email is required';
                    isValid = false;
                } else if (!/\S+@\S+\.\S+/.test(contact.primaryEmail)) {
                    newErrors[`contact_${index}_primaryEmail`] = 'Please enter a valid email address';
                    isValid = false;
                }

                if (contact.primaryMobile.trim() && !phoneRegex.test(contact.primaryMobile.trim())) {
                    newErrors[`contact_${index}_primaryMobile`] = 'Please enter a valid 10-digit mobile number';
                    isValid = false;
                }

                if (contact.secondaryMobile.trim() && !phoneRegex.test(contact.secondaryMobile.trim())) {
                    newErrors[`contact_${index}_secondaryMobile`] = 'Please enter a valid 10-digit mobile number';
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
            toast.error('Please fill all required fields before submitting.');
            return;
        }

        if (!id) {
            toast.error('Vendor ID is missing.');
            return;
        }

        setIsSubmitting(true);

        const apiFormData = new FormData();
        apiFormData.append('pms_supplier[company_name]', formData.companyName || '');
        apiFormData.append('pms_supplier[mobile1]', formData.primaryPhone || '');
        apiFormData.append('pms_supplier[mobile2]', formData.secondaryPhone || '');
        apiFormData.append('pms_supplier[email]', formData.email || '');
        if (formData.supplierType) {
            apiFormData.append('pms_supplier[supplier_type][]', formData.supplierType);
        }
        apiFormData.append('pms_supplier[service_description]', formData.serviceDescription || '');
        if (formData.date) {
            apiFormData.append('pms_supplier[signed_on_contract]', 'true');
        }
        if (formData.services) {
            apiFormData.append('pms_supplier[services_ids][]', formData.services);
        }

        if (formData.gstTreatment) {
            apiFormData.append('pms_supplier[gst_preference]', formData.gstTreatment);
            apiFormData.append('pms_supplier[primary_gst_detail_attributes][gst_preference]', formData.gstTreatment);
            apiFormData.append('pms_supplier[primary_gst_detail_attributes][gstin]', formData.gstin || '');

            if (formData.gstTreatment === 'registered_regular' || formData.gstTreatment === 'registered_composition') {
                apiFormData.append('pms_supplier[primary_gst_detail_attributes][business_legal_name]', formData.businessLegalName || '');
            } else {
                apiFormData.append('pms_supplier[primary_gst_detail_attributes][business_legal_name]', '');
            }

            if (formData.gstTreatment === 'registered_regular' || formData.gstTreatment === 'registered_composition') {
                apiFormData.append('pms_supplier[primary_gst_detail_attributes][business_trade_name]', formData.businessTradeName || '');
            } else {
                apiFormData.append('pms_supplier[primary_gst_detail_attributes][business_trade_name]', '');
            }

            if (formData.gstTreatment !== 'overseas') {
                apiFormData.append('pms_supplier[primary_gst_detail_attributes][place_of_supply]', formData.placeOfSupply || '');
            } else {
                apiFormData.append('pms_supplier[primary_gst_detail_attributes][place_of_supply]', '');
            }
        }

        apiFormData.append('pms_supplier[pan_number]', formData.pan || '');

        apiFormData.append('pms_supplier[addresses_attributes][0][address]', billingAddress.addressLine1 || '');
        apiFormData.append('pms_supplier[addresses_attributes][0][address_type]', 'billing');
        apiFormData.append('pms_supplier[addresses_attributes][0][country]', billingAddress.country || '');
        apiFormData.append('pms_supplier[addresses_attributes][0][state]', billingAddress.state || '');
        apiFormData.append('pms_supplier[addresses_attributes][0][city]', billingAddress.city || '');
        apiFormData.append('pms_supplier[addresses_attributes][0][pin_code]', billingAddress.pincode || '');
        apiFormData.append('pms_supplier[addresses_attributes][0][address_line_two]', billingAddress.addressLine2 || '');
        apiFormData.append('pms_supplier[addresses_attributes][0][default_address]', 'true');
        apiFormData.append('pms_supplier[addresses_attributes][0][default_shipping_address]', 'false');

        apiFormData.append('pms_supplier[addresses_attributes][1][address]', shippingAddress.addressLine1 || '');
        apiFormData.append('pms_supplier[addresses_attributes][1][address_type]', 'shipping');
        apiFormData.append('pms_supplier[addresses_attributes][1][country]', shippingAddress.country || '');
        apiFormData.append('pms_supplier[addresses_attributes][1][state]', shippingAddress.state || '');
        apiFormData.append('pms_supplier[addresses_attributes][1][city]', shippingAddress.city || '');
        apiFormData.append('pms_supplier[addresses_attributes][1][pin_code]', shippingAddress.pincode || '');
        apiFormData.append('pms_supplier[addresses_attributes][1][address_line_two]', shippingAddress.addressLine2 || '');
        apiFormData.append('pms_supplier[addresses_attributes][1][default_address]', 'true');
        apiFormData.append('pms_supplier[addresses_attributes][1][default_shipping_address]', 'true');

        apiFormData.append('pms_supplier[account_name]', formData.accountName || '');
        apiFormData.append('pms_supplier[account_number]', formData.accountNumber || '');
        apiFormData.append('pms_supplier[bank_branch_name]', formData.bankBranchName || '');
        apiFormData.append('pms_supplier[ifsc_code]', formData.ifscCode || '');

        contactPersons.forEach((contact, index) => {
            if (contact.firstName || contact.lastName || contact.primaryEmail) {
                const prefix = `pms_supplier[pms_supplier_contacts_attributes][${index}]`;
                if (contact.id) {
                    apiFormData.append(`${prefix}[id]`, String(contact.id));
                }
                apiFormData.append(`${prefix}[first_name]`, contact.firstName || '');
                apiFormData.append(`${prefix}[last_name]`, contact.lastName || '');
                apiFormData.append(`${prefix}[email1]`, contact.primaryEmail || '');
                apiFormData.append(`${prefix}[email2]`, contact.secondaryEmail || '');
                apiFormData.append(`${prefix}[mobile1]`, contact.primaryMobile || '');
                apiFormData.append(`${prefix}[mobile2]`, contact.secondaryMobile || '');
            }
        });

        if (formData.reKyc) {
            let reKycValue = formData.reKyc;
            if (reKycValue === 'custom') {
                if (formData.customDate) {
                    reKycValue = formData.customDate instanceof Date
                        ? formData.customDate.toISOString().split('T')[0]
                        : String(formData.customDate);
                }
            } else {
                // "12m" → "12_months", "3m" → "3_months", etc.
                reKycValue = reKycValue.replace(/^(\d+)m$/, '$1_months');
            }
            apiFormData.append('pms_supplier[re_kyc_in]', reKycValue);
        }

        panAttachments.forEach(file => apiFormData.append('pan_attachments[]', file));
        tanAttachments.forEach(file => apiFormData.append('tan_attachments[]', file));
        gstAttachments.forEach(file => apiFormData.append('gst_attachments[]', file));
        kycAttachments.forEach(file => apiFormData.append('kyc_attachments[]', file));
        complianceAttachments.forEach(file => apiFormData.append('compliance_attachments[]', file));
        otherAttachments.forEach(file => apiFormData.append('cancle_checque[]', file));

        openingBalances.forEach((row, index) => {
            if (row.billNo || row.date || row.dueDate || row.amount) {
                const prefix = `pms_supplier[opening_balance_details_attributes][${index}]`;
                const absAmount = row.amount ? Math.abs(Number(row.amount)) : 0;
                const signedAmount = row.accountType === 'Vendor credit' ? -absAmount : absAmount;
                if (row.id) {
                    apiFormData.append(`${prefix}[id]`, String(row.id));
                }
                apiFormData.append(`${prefix}[bill_no]`, row.billNo || '');
                apiFormData.append(`${prefix}[date]`, row.date || '');
                apiFormData.append(`${prefix}[due_date]`, row.dueDate || '');
                apiFormData.append(`${prefix}[account_type]`, row.accountType || 'Bill');
                apiFormData.append(`${prefix}[amount]`, String(signedAmount));
            }
        });

        apiFormData.append('pms_supplier[active]', 'true');

        try {
            await vendorService.updateVendor(id, apiFormData);
            toast.success('Vendor updated successfully!');
            navigate('/accounting/vendor');
        } catch (error: any) {
            if (error.status === 422 && error.validationErrors) {
                const validationErrors = error.validationErrors;
                const companyInfoFields = ['company_name', 'email', 'mobile1', 'mobile2', 'pan_number', 'gstin_number'];
                const addressFields = ['country', 'state', 'city', 'pincode', 'address', 'address2'];
                const bankFields = ['account_name', 'account_number', 'bank_branch_name', 'ifsc_code'];

                const formErrors: any = {};
                let targetStep = activeStep;

                Object.keys(validationErrors).forEach(field => {
                    const errorMessage = Array.isArray(validationErrors[field])
                        ? validationErrors[field].join(', ')
                        : validationErrors[field];

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
                        'account_name': 'accountName',
                        'pms_supplier_contacts.email1': 'contact_0_primaryEmail',
                        'pms_supplier_contacts.email2': 'contact_0_secondaryEmail',
                        'pms_supplier_contacts.mobile1': 'contact_0_primaryMobile',
                    };

                    const formFieldName = fieldMapping[field] || field;
                    formErrors[formFieldName] = errorMessage;

                    if (companyInfoFields.includes(field)) {
                        targetStep = 0;
                    } else if (addressFields.includes(field)) {
                        targetStep = 1;
                    } else if (bankFields.includes(field)) {
                        targetStep = 2;
                    } else if (field.startsWith('pms_supplier_contacts')) {
                        targetStep = 3;
                    }
                });

                setErrors(formErrors);
                setActiveStep(targetStep);

                const firstErrorValue = Object.values(validationErrors)[0];
                const errorMessage = Array.isArray(firstErrorValue) ? firstErrorValue[0] : firstErrorValue;
                toast.error(errorMessage || 'Please check the form for errors');
            } else {
                toast.error('Failed to update vendor. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (!validateStep()) {
            toast.error('Please fill in all required fields before proceeding to the next step');
            return;
        }

        if (!completedSteps.includes(activeStep)) {
            setCompletedSteps((prev) => [...prev, activeStep]);
        }
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        setErrors({});
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
        setErrors({});
    };

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
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${fileNames.length > 0 ? 'border-[#DA7756] bg-[#fef6f4]' : 'border-gray-300'}`}>
                <p className="text-gray-600 font-medium mb-2">{title}</p>
                <label className="cursor-pointer">
                    <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Drag & Drop or <span className="text-[#DA7756] font-semibold">Choose Files</span></p>
                    </div>
                    <input type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
                {fileNames.length > 0 ? (
                    <div className="mt-3 p-2 bg-white rounded border">
                        <p className="text-xs text-[#DA7756] font-semibold mb-1">{fileNames.length} file(s) selected:</p>
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
                    <>
                        <SectionCard>
                            <SectionHeader>
                                <Building className="text-[#DA7756]" />
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
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                        <SectionCard>
                            <SectionHeader>
                                <Landmark className="text-[#C72030]" />
                                <SectionTitle>OTHER DETAILS</SectionTitle>
                            </SectionHeader>
                            <Box p={3}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    <TextField
                                        label={<span>GST Treatment <span style={{ color: 'red' }}>*</span></span>}
                                        select
                                        fullWidth
                                        value={formData.gstTreatment}
                                        onChange={(e) => setFormData({ ...formData, gstTreatment: e.target.value })}
                                        error={!!errors.gstTreatment}
                                        helperText={errors.gstTreatment}
                                    >
                                        <MenuItem value="">Select GST Treatment</MenuItem>
                                        <MenuItem value="registered_regular">Registered Business – Regular</MenuItem>
                                        <MenuItem value="registered_composition">Registered Business – Composition</MenuItem>
                                        <MenuItem value="unregistered">Unregistered Business</MenuItem>
                                        <MenuItem value="consumer">Consumer</MenuItem>
                                        <MenuItem value="overseas">Overseas</MenuItem>
                                        <MenuItem value="sez_unit">Special Economic Zone (SEZ) Unit</MenuItem>
                                        <MenuItem value="deemed_export">Deemed Export</MenuItem>
                                        <MenuItem value="tax_deductor">Tax Deductor</MenuItem>
                                        <MenuItem value="sez_developer">SEZ Developer</MenuItem>
                                        <MenuItem value="isd">Input Service Distributor (ISD)</MenuItem>
                                    </TextField>

                                    {(formData.gstTreatment === 'registered_regular' ||
                                        formData.gstTreatment === 'registered_composition') && (
                                            <>
                                                <TextField
                                                    label="GSTIN / UIN"
                                                    fullWidth
                                                    value={formData.gstin}
                                                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                                                    error={!!errors.gstin}
                                                    helperText={errors.gstin || (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(formData.gstin) ? 'Invalid GSTIN format. e.g. 27AAAAA1234A1Z5' : '')}
                                                    placeholder="Enter 15 digit GSTIN"
                                                    inputProps={{ maxLength: 15, style: { textTransform: 'uppercase' } }}
                                                />
                                                <TextField
                                                    label="Business Legal Name"
                                                    fullWidth
                                                    value={formData.businessLegalName}
                                                    onChange={(e) => setFormData({ ...formData, businessLegalName: e.target.value })}
                                                    error={!!errors.businessLegalName}
                                                    helperText={errors.businessLegalName}
                                                />
                                                <TextField
                                                    label="Business Trade Name"
                                                    fullWidth
                                                    value={formData.businessTradeName}
                                                    onChange={(e) => setFormData({ ...formData, businessTradeName: e.target.value })}
                                                    error={!!errors.businessTradeName}
                                                    helperText={errors.businessTradeName}
                                                />
                                            </>
                                        )}

                                    {formData.gstTreatment !== 'overseas' && formData.gstTreatment && (
                                        <TextField
                                            label="Place of Supply"
                                            select
                                            fullWidth
                                            value={formData.placeOfSupply}
                                            onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
                                            error={!!errors.placeOfSupply}
                                            helperText={errors.placeOfSupply}
                                        >
                                            <MenuItem value="">Select State</MenuItem>
                                            <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                                            <MenuItem value="Karnataka">Karnataka</MenuItem>
                                            <MenuItem value="Delhi">Delhi</MenuItem>
                                            <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                                            <MenuItem value="Telangana">Telangana</MenuItem>
                                            <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                                            <MenuItem value="Gujarat">Gujarat</MenuItem>
                                            <MenuItem value="West Bengal">West Bengal</MenuItem>
                                            <MenuItem value="Punjab">Punjab</MenuItem>
                                            <MenuItem value="Rajasthan">Rajasthan</MenuItem>
                                        </TextField>
                                    )}

                                    <TextField
                                        label="PAN"
                                        fullWidth
                                        value={formData.pan}
                                        onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                                        error={!!errors.pan}
                                        helperText={errors.pan}
                                        placeholder="ABCDE1234F"
                                    />
                                </div>
                            </Box>
                        </SectionCard>
                        <SectionCard>
                            <SectionHeader>
                                <Landmark className="text-[#C72030]" />
                                <SectionTitle>OPENING BALANCE</SectionTitle>
                            </SectionHeader>
                            <Box p={3}>
                                <div className="space-y-3">
                                    {openingBalances.map((row, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <TextField
                                                label="Bill No"
                                                placeholder="Enter bill number"
                                                size="small"
                                                value={row.billNo}
                                                onChange={(e) => {
                                                    const updated = [...openingBalances];
                                                    updated[index].billNo = e.target.value;
                                                    setOpeningBalances(updated);
                                                }}
                                                sx={{ flex: 1 }}
                                            />
                                            <TextField
                                                label="Bill Date"
                                                type="date"
                                                size="small"
                                                value={row.date}
                                                onChange={(e) => {
                                                    const updated = [...openingBalances];
                                                    updated[index].date = e.target.value;
                                                    if (updated[index].dueDate && updated[index].dueDate <= e.target.value) {
                                                        updated[index].dueDate = '';
                                                    }
                                                    setOpeningBalances(updated);
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                inputProps={{
                                                    min: new Date().toISOString().split('T')[0],
                                                }}
                                                sx={{ flex: 1 }}
                                            />
                                            <TextField
                                                label="Due Date"
                                                type="date"
                                                size="small"
                                                value={row.dueDate}
                                                onChange={(e) => {
                                                    const updated = [...openingBalances];
                                                    updated[index].dueDate = e.target.value;
                                                    setOpeningBalances(updated);
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                inputProps={{
                                                    min: row.date ? row.date : new Date().toISOString().split('T')[0],
                                                }}
                                                sx={{ flex: 1 }}
                                            />
                                            <TextField
                                                select
                                                label="Type"
                                                size="small"
                                                value={row.accountType || 'Bill'}
                                                onChange={(e) => {
                                                    const updated = [...openingBalances];
                                                    updated[index].accountType = e.target.value;
                                                    setOpeningBalances(updated);
                                                }}
                                                sx={{ flex: 1 }}
                                            >
                                                <MenuItem value="Bill">Bill</MenuItem>
                                                <MenuItem value="Vendor credit">Vendor Credit</MenuItem>
                                            </TextField>
                                            <TextField
                                                label="Amount"
                                                placeholder="Enter amount"
                                                size="small"
                                                value={row.amount}
                                                onChange={(e) => {
                                                    const updated = [...openingBalances];
                                                    updated[index].amount = e.target.value.replace(/^-/, '');
                                                    setOpeningBalances(updated);
                                                }}
                                                InputProps={{
                                                    startAdornment: row.accountType === 'Vendor credit' && row.amount !== ''
                                                        ? <span style={{ marginRight: 2 }}>-</span>
                                                        : null,
                                                }}
                                                sx={{ flex: 1 }}
                                            />
                                            <IconButton
                                                onClick={() => {
                                                    if (index === openingBalances.length - 1) {
                                                        setOpeningBalances([...openingBalances, { billNo: '', date: '', dueDate: '', accountType: 'Bill', amount: '' }]);
                                                    } else {
                                                        setOpeningBalances(openingBalances.filter((_, i) => i !== index));
                                                    }
                                                }}
                                                sx={{
                                                    border: '1px solid #C72030',
                                                    borderRadius: '4px',
                                                    color: '#C72030',
                                                    width: 36,
                                                    height: 36,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {index === openingBalances.length - 1 ? <Plus size={16} /> : <Trash2 size={16} />}
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </Box>
                        </SectionCard>
                    </>
                );
            case 1:
                return (
                    <SectionCard>
                        <SectionHeader>
                            <MapPin className="text-[#DA7756]" />
                            <SectionTitle>ADDRESS</SectionTitle>
                        </SectionHeader>
                        <Box p={3}>
                            <div className="space-y-6">

                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="mb-4">
                                        <span className="text-sm font-semibold text-gray-700">Billing Address</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                        <TextField
                                            label={<span>Country <span style={{ color: 'red' }}>*</span></span>}
                                            fullWidth
                                            value={billingAddress.country}
                                            onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                                            onKeyDown={(e) => { const char = e.key; if (!/[a-zA-Z\s]/.test(char) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) e.preventDefault(); }}
                                            error={!!errors['address_billing_country']}
                                            helperText={errors['address_billing_country']}
                                            placeholder="e.g., India"
                                        />
                                        <TextField
                                            label={<span>State <span style={{ color: 'red' }}>*</span></span>}
                                            fullWidth
                                            value={billingAddress.state}
                                            onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                                            onKeyDown={(e) => { const char = e.key; if (!/[a-zA-Z\s]/.test(char) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) e.preventDefault(); }}
                                            error={!!errors['address_billing_state']}
                                            helperText={errors['address_billing_state']}
                                            placeholder="e.g., Maharashtra"
                                        />
                                        <TextField
                                            label={<span>City <span style={{ color: 'red' }}>*</span></span>}
                                            fullWidth
                                            value={billingAddress.city}
                                            onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                                            onKeyDown={(e) => { const char = e.key; if (!/[a-zA-Z\s]/.test(char) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) e.preventDefault(); }}
                                            error={!!errors['address_billing_city']}
                                            helperText={errors['address_billing_city']}
                                            placeholder="e.g., Mumbai"
                                        />
                                        <TextField
                                            label="Pincode"
                                            fullWidth
                                            value={billingAddress.pincode}
                                            onChange={(e) => setBillingAddress({ ...billingAddress, pincode: e.target.value })}
                                            error={!!errors['address_billing_pincode']}
                                            helperText={errors['address_billing_pincode']}
                                            placeholder="123456"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <TextField
                                            label={<span>Address Line 1 <span style={{ color: 'red' }}>*</span></span>}
                                            fullWidth
                                            value={billingAddress.addressLine1}
                                            onChange={(e) => setBillingAddress({ ...billingAddress, addressLine1: e.target.value })}
                                            error={!!errors['address_billing_addressLine1']}
                                            helperText={errors['address_billing_addressLine1']}
                                        />
                                        <TextField
                                            label="Address Line 2"
                                            fullWidth
                                            value={billingAddress.addressLine2}
                                            onChange={(e) => setBillingAddress({ ...billingAddress, addressLine2: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="mb-4">
                                        <span className="text-sm font-semibold text-gray-700">Shipping Address</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                        <TextField
                                            label={<span>Country <span style={{ color: 'red' }}>*</span></span>}
                                            fullWidth
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                            onKeyDown={(e) => { const char = e.key; if (!/[a-zA-Z\s]/.test(char) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) e.preventDefault(); }}
                                            error={!!errors['address_shipping_country']}
                                            helperText={errors['address_shipping_country']}
                                            placeholder="e.g., India"
                                        />
                                        <TextField
                                            label={<span>State <span style={{ color: 'red' }}>*</span></span>}
                                            fullWidth
                                            value={shippingAddress.state}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                            onKeyDown={(e) => { const char = e.key; if (!/[a-zA-Z\s]/.test(char) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) e.preventDefault(); }}
                                            error={!!errors['address_shipping_state']}
                                            helperText={errors['address_shipping_state']}
                                            placeholder="e.g., Maharashtra"
                                        />
                                        <TextField
                                            label={<span>City <span style={{ color: 'red' }}>*</span></span>}
                                            fullWidth
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                            onKeyDown={(e) => { const char = e.key; if (!/[a-zA-Z\s]/.test(char) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) e.preventDefault(); }}
                                            error={!!errors['address_shipping_city']}
                                            helperText={errors['address_shipping_city']}
                                            placeholder="e.g., Mumbai"
                                        />
                                        <TextField
                                            label="Pincode"
                                            fullWidth
                                            value={shippingAddress.pincode}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                                            error={!!errors['address_shipping_pincode']}
                                            helperText={errors['address_shipping_pincode']}
                                            placeholder="123456"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <TextField
                                            label={<span>Address Line 1 <span style={{ color: 'red' }}>*</span></span>}
                                            fullWidth
                                            value={shippingAddress.addressLine1}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                                            error={!!errors['address_shipping_addressLine1']}
                                            helperText={errors['address_shipping_addressLine1']}
                                        />
                                        <TextField
                                            label="Address Line 2"
                                            fullWidth
                                            value={shippingAddress.addressLine2}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                                        />
                                    </div>
                                </div>

                            </div>
                        </Box>
                    </SectionCard>
                );
            case 2:
                return (
                    <SectionCard>
                        <SectionHeader>
                            <Landmark className="text-[#DA7756]" />
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
                            <User className="text-[#DA7756]" />
                            <SectionTitle>CONTACT PERSON</SectionTitle>
                        </SectionHeader>
                        <Box p={3}>
                            {contactPersons.map((contact, index) => (
                                <div key={index} className="relative border rounded-lg p-4 mb-4 bg-gray-50">
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
                                            label={<span>Primary Email <span style={{ color: 'red' }}>*</span></span>}
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
                            <FileText className="text-[#DA7756]" />
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
                                    value={
                                        formData.customDate instanceof Date
                                            ? formData.customDate.toISOString().split('T')[0]
                                            : formData.customDate || ''
                                    }
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
                            <Upload className="text-[#DA7756]" />
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

    if (loadingVendor) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading vendor details...</p>
                </div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/accounting/vendor')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="border-red-200 bg-red-50 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Vendor</h2>
                        <p className="text-red-700 mb-4">{fetchError}</p>
                        <Button onClick={() => navigate('/accounting/vendor')} variant="outline">Back to Vendor List</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#F6F4EE] min-h-screen">
            <div className="mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <button
                        onClick={() => navigate('/accounting/vendor')}
                        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span>Vendor List</span>
                    <span>{'>'}</span>
                    <span className="text-gray-900 font-medium">Edit Vendor</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">EDIT VENDOR</h1>
            </div>

            <Box sx={{ mb: 4, overflow: 'auto' }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: 'fit-content',
                    minWidth: '100%',
                    px: 2,
                }}>
                    {steps.map((label, index) => (
                        <Box key={`step-${index}`} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <Box
                                onClick={() => handleStepClick(index)}
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: (index === activeStep || completedSteps.includes(index)) ? '#DA7756' : 'white',
                                    color: (index === activeStep || completedSteps.includes(index)) ? 'white' : '#C4B89D',
                                    border: `2px solid ${(index === activeStep || completedSteps.includes(index)) ? '#DA7756' : '#C4B89D'}`,
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
                                    boxShadow: index === activeStep ? '0 2px 4px rgba(218, 119, 86, 0.3)' : 'none',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'Work Sans, sans-serif',
                                    position: 'relative',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    '&:hover': {
                                        opacity: 0.9,
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
                                        backgroundImage: `repeating-linear-gradient(to right, ${(index < activeStep || completedSteps.includes(index)) ? '#DA7756' : '#C4B89D'} 0px, ${(index < activeStep || completedSteps.includes(index)) ? '#DA7756' : '#C4B89D'} 6px, transparent 6px, transparent 12px)`,
                                        margin: '0 0px',
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>

            <div className="mt-8">{getStepContent(activeStep)}</div>

            <div className="flex justify-end gap-4 mt-8" style={{ marginBottom: '100px' }}>
                <DraftButton disabled={activeStep === 0} onClick={handleBack}>
                    Back
                </DraftButton>
                {activeStep === steps.length - 1 ? (
                    <RedButton onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Vendor'}
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
