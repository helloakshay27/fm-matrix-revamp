import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { ArrowLeft, Calendar, Settings, Globe, X, Plus } from "lucide-react";
import { TextField } from "@mui/material";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { toast } from "sonner";
import { editCustomer, getCustomerById } from "@/store/slices/cusomerSlice";
import ReactSelect from 'react-select';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

interface Lease {
    id?: number;
    leaseStartDate: string;
    leaseEndDate: string;
    freeParking: string;
    paidParking: string;
}

interface Domain {
    id?: number;
    domain: string;
    _destroy?: boolean;
}

const requiredLabel = (text: string) => (
    <span>
        {text}
        <span className="fm-required-mark">*</span>
    </span>
);

// Enable Sites multi-select — Asset form ke MUI field jaisi height/border
const siteSelectStyles = {
    control: (base: any) => ({
        ...base,
        minHeight: '45px',
        border: '1px solid #c4c4c4',
        // theme.css ka --radius-input — MUI fields jaisa same radius
        borderRadius: 'var(--radius-input)',
        boxShadow: 'none',
        '&:hover': { border: '1px solid #1a1a1a' }
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    menu: (base: any) => ({ ...base, zIndex: 9999 }),
    multiValue: (base: any) => ({
        ...base,
        backgroundColor: '#f1f5f9',
        borderRadius: '4px'
    }),
    multiValueLabel: (base: any) => ({ ...base, color: '#334155' }),
    multiValueRemove: (base: any) => ({
        ...base,
        color: '#64748b',
        borderRadius: '0px',
        '&:hover': { backgroundColor: '#e2e8f0', color: '#475569' }
    })
};

export const EditCrmCustomer = () => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const { id } = useParams();
    const navigate = useNavigate();
    const { setCurrentSection } = useLayout();
    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        mobile: "",
        customerType: "",
        customerCode: "",
        companyCode: "",
        colorCode: "#000",
        ssid: "",
    });
    const [leases, setLeases] = useState<Lease[]>([
        {
            id: undefined,
            leaseStartDate: "",
            leaseEndDate: "",
            freeParking: "",
            paidParking: "",
        },
    ]);
    const [domains, setDomains] = useState<Domain[]>([{ domain: "" }]);
    const [isSaving, setIsSaving] = useState(false);
    const [sites, setSites] = useState<{ id: number; name: string }[]>([]);
    const [selectedSiteIds, setSelectedSiteIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await dispatch(
                    getCustomerById({ id: Number(id), baseUrl, token })
                ).unwrap();
                setFormData({
                    customerName: response.entity.name,
                    email: response.entity.email,
                    mobile: response.entity.mobile,
                    customerType: response.entity.customer_type,
                    customerCode: response.entity.ext_customer_code,
                    companyCode: response.entity.company_code,
                    colorCode: response.entity.color_code,
                    ssid: response.entity.ssid,
                });
                setLeases(
                    response.customer_leases.map((lease) => ({
                        id: lease.id,
                        leaseStartDate: lease.lease_start_date,
                        leaseEndDate: lease.lease_end_date,
                        freeParking: lease.free_parking,
                        paidParking: lease.paid_parking,
                    }))
                );
                setDomains(
                    response.domains && response.domains.length > 0
                        ? response.domains.map((domain) => ({
                            id: domain.id,
                            domain: domain.domain,
                        }))
                        : [{ domain: "" }]
                );
                if (response.entity.enable_site_ids && Array.isArray(response.entity.enable_site_ids)) {
                    setSelectedSiteIds(response.entity.enable_site_ids);
                }
            } catch (error: unknown) {
                const errorMessage =
                    error instanceof Error ? error.message : "Failed to fetch customer";
                console.error(errorMessage);
                toast.error(errorMessage);
            }
        };

        fetchCustomer();
    }, [dispatch, id, baseUrl, token]);

    useEffect(() => {
        setCurrentSection("CRM");
        fetchSites();
    }, [setCurrentSection]);

    const fetchSites = async () => {
        try {
            const userData = localStorage.getItem('user');
            let userId = '12437';
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    userId = parsedUser.id || parsedUser.user_id || '12437';
                } catch (e) {
                    console.warn('Could not parse user data from localStorage');
                }
            }
            const response = await fetch(getFullUrl(`/pms/sites/allowed_sites.json?user_id=${userId}`), {
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.sites && Array.isArray(data.sites)) {
                    setSites(data.sites);
                } else {
                    setSites([]);
                }
            }
        } catch (error) {
            console.error('Error fetching sites:', error);
            toast.error('Failed to fetch sites');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleLeaseChange = (index: number, field: string, value: string) => {
        setLeases((prev) =>
            prev.map((lease, i) =>
                i === index
                    ? {
                        ...lease,
                        [field]: value,
                    }
                    : lease
            )
        );
    };

    const addNewLease = () => {
        const newLease = {
            id: undefined,
            leaseStartDate: "",
            leaseEndDate: "",
            freeParking: "",
            paidParking: "",
        };
        setLeases((prev) => [...prev, newLease]);
    };

    const removeLease = (index: number) => {
        if (leases.length > 1) {
            setLeases((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleDomainChange = (index: number, value: string) => {
        setDomains((prev) =>
            prev.map((domain, i) => (i === index ? { ...domain, domain: value } : domain))
        );
    };

    const addNewDomain = () => {
        setDomains((prev) => [...prev, { domain: "" }]);
    };

    const removeDomain = (index: number) => {
        const domain = domains[index];
        if (domain.id) {
            // Mark existing (server-side) domain for deletion via _destroy
            setDomains((prev) =>
                prev.map((d, i) => (i === index ? { ...d, _destroy: true } : d))
            );
        } else {
            // Only allow removing an unsaved domain if there's at least one other visible domain
            const visibleCount = domains.filter((d) => !d._destroy).length;
            if (visibleCount > 1) {
                setDomains((prev) => prev.filter((_, i) => i !== index));
            }
        }
    };

    const validateForm = () => {
        if (!formData.customerName) {
            toast.error("Customer name is required");
            return false;
        }
        // if (!formData.email) {
        //     toast.error("Email is required");
        //     return false;
        // }
        // if (!formData.mobile) {
        //     toast.error("Mobile number is required");
        //     return false;
        // }
        // for (const lease of leases) {
        //     if (!lease.leaseStartDate) {
        //         toast.error("Lease start date is required");
        //         return false;
        //     }
        //     if (!lease.leaseEndDate) {
        //         toast.error("Lease end date is required");
        //         return false;
        //     }
        //     if (!lease.freeParking) {
        //         toast.error("Free parking is required");
        //         return false;
        //     }
        //     if (!lease.paidParking) {
        //         toast.error("Paid parking is required");
        //         return false;
        //     }
        // }
        return true
    }

    const handleSave = async () => {
        if (!validateForm()) return
        if (isSaving) return;
        setIsSaving(true);
        const payload = {
            site_ids: selectedSiteIds,
            entity: {
                name: formData.customerName,
                email: formData.email,
                mobile: formData.mobile,
                customer_type: formData.customerType,
                ext_customer_code: formData.customerCode,
                company_code: formData.companyCode,
                color_code: formData.colorCode,
                ssid: formData.ssid,
                customer_leases_attributes: leases.map((lease) => ({
                    ...(lease.id != null && { id: lease.id }),
                    site_id: localStorage.getItem("selectedSiteId"),
                    lease_start_date: lease.leaseStartDate,
                    lease_end_date: lease.leaseEndDate,
                    free_parking: lease.freeParking,
                    paid_parking: lease.paidParking,
                })),
                entity_domains_attributes: domains
                    .filter((domain) => domain._destroy || domain.domain.trim() !== "")
                    .map((domain) => ({
                        ...(domain.id != null && { id: domain.id }),
                        ...(domain._destroy
                            ? { _destroy: true }
                            : { domain: domain.domain }
                        ),
                    })),
            },
        };

        try {
            await dispatch(
                editCustomer({ baseUrl, token, data: payload, id: Number(id) })
            ).unwrap();
            toast.success("Customer updated successfully");
            navigate(`/crm/customers`);
        } catch (error: any) {
            console.log(error);
            const message = typeof error === 'string'
                ? error
                : error?.response?.data?.error || error?.message || "Failed to update customer";
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span>Customer List</span>
                <span>{">"}</span>
                <span className="text-gray-900 font-medium">Edit Customer</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EDIT CUSTOMER</h1>
            </div>

            <div className="space-y-4 sm:space-y-6">
                {/* Basic Details */}
                <FormSection title="BASIC DETAILS" icon={Settings}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <TextField
                            label={requiredLabel("Customer Name")}
                            placeholder="Enter Customer Name"
                            variant="outlined"
                            fullWidth
                            value={formData.customerName}
                            onChange={(e) => handleInputChange("customerName", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        />
                        <TextField
                            label="Email"
                            placeholder="Enter Email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            onBlur={(e) => {
                                const value = e.target.value;
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (value && !emailRegex.test(value)) {
                                    toast.error("Please enter a valid email address");
                                }
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        />
                        <TextField
                            label="Mobile"
                            placeholder="Enter Mobile"
                            variant="outlined"
                            fullWidth
                            value={formData.mobile}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,10}$/.test(value)) {
                                    handleInputChange("mobile", value);
                                }
                            }}
                            inputProps={{
                                maxLength: 10,
                                inputMode: "numeric",
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        />
                        <TextField
                            label="Customer Type"
                            placeholder="Enter Customer Type"
                            variant="outlined"
                            fullWidth
                            value={formData.customerType}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("customerType", value);
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        />
                        <TextField
                            label={requiredLabel("Company Code")}
                            placeholder="Enter Company Code"
                            variant="outlined"
                            fullWidth
                            value={formData.companyCode}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("companyCode", value);
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        />
                        {/* <TextField
                            label="Customer Code"
                            variant="outlined"
                            fullWidth
                            value={formData.customerCode}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("customerCode", value);
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        /> */}
                        {/* Swatch field ke andar — baaki inputs ki tarah same row, same radius */}
                        <TextField
                            label="Color Code"
                            variant="outlined"
                            fullWidth
                            value={formData.colorCode}
                            onChange={(e) => handleInputChange("colorCode", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                sx: assetFieldStyles,
                                startAdornment: (
                                    <input
                                        type="color"
                                        value={formData.colorCode}
                                        onChange={(e) => handleInputChange("colorCode", e.target.value)}
                                        aria-label="Pick color"
                                        className="w-7 h-7 ml-2 shrink-0 cursor-pointer rounded-md border border-gray-200 bg-transparent p-0.5"
                                    />
                                ),
                            }}
                        />
                    </div>

                    {/* Enable Sites Multi-Select */}
                    <div className="mt-6">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            {requiredLabel("Enable Sites")}
                        </label>
                        <ReactSelect
                            isMulti
                            options={sites.map(site => ({
                                value: site.id,
                                label: site.name
                            }))}
                            onChange={(selected) => {
                                if (!selected || selected.length === 0) {
                                    setSelectedSiteIds([]);
                                    return;
                                }
                                setSelectedSiteIds(selected.map(s => s.value));
                            }}
                            value={sites
                                .filter(site => selectedSiteIds.includes(site.id))
                                .map(site => ({
                                    value: site.id,
                                    label: site.name
                                }))
                            }
                            placeholder="Select sites..."
                            noOptionsMessage={() => "No sites available"}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={siteSelectStyles}
                        />
                    </div>
                </FormSection>

                {/* Lease Information */}
                <FormSection
                    title="LEASE INFORMATION"
                    icon={Calendar}
                    headerActions={
                        <button type="button" onClick={addNewLease} className="fm-custom-field-btn">
                            <Plus className="w-4 h-4" />
                            Add Lease
                        </button>
                    }
                >
                    <div className="space-y-4">
                        {leases.map((lease, index) => (
                            <div
                                key={index}
                                className={index > 0 ? "pt-4 border-t border-gray-200" : undefined}
                            >
                                {leases.length > 1 && (
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700">Lease {index + 1}</h4>
                                        {lease.id === undefined && (
                                            <button
                                                type="button"
                                                onClick={() => removeLease(index)}
                                                className="flex items-center justify-center h-7 w-7 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors"
                                                aria-label={`Remove lease ${index + 1}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <TextField
                                        label="Lease Start Date"
                                        variant="outlined"
                                        fullWidth
                                        type="date"
                                        value={lease.leaseStartDate}
                                        onChange={(e) => handleLeaseChange(index, "leaseStartDate", e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ sx: assetFieldStyles }}
                                    />
                                    <TextField
                                        label="Lease End Date"
                                        variant="outlined"
                                        fullWidth
                                        type="date"
                                        value={lease.leaseEndDate}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (lease.leaseStartDate && value < lease.leaseStartDate) {
                                                toast.error("End date cannot be earlier than start date");
                                                return;
                                            }
                                            handleLeaseChange(index, "leaseEndDate", value);
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ min: lease.leaseStartDate || undefined }}
                                        InputProps={{ sx: assetFieldStyles }}
                                    />
                                    <TextField
                                        label={requiredLabel("Free Parking")}
                                        placeholder="Enter Free Parking"
                                        variant="outlined"
                                        fullWidth
                                        type="number"
                                        value={lease.freeParking}
                                        onChange={(e) => handleLeaseChange(index, "freeParking", e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ sx: assetFieldStyles }}
                                    />
                                    <TextField
                                        label="Paid Parking"
                                        placeholder="Enter Paid Parking"
                                        variant="outlined"
                                        fullWidth
                                        type="number"
                                        value={lease.paidParking}
                                        onChange={(e) => handleLeaseChange(index, "paidParking", e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ sx: assetFieldStyles }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </FormSection>

                {/* Domains */}
                <FormSection
                    title="DOMAINS"
                    icon={Globe}
                    headerActions={
                        <button type="button" onClick={addNewDomain} className="fm-custom-field-btn">
                            <Plus className="w-4 h-4" />
                            Add Domain
                        </button>
                    }
                >
                    <div className="space-y-4">
                        {domains
                            .filter((domain) => !domain._destroy)
                            .map((domain, index) => {
                                const actualIndex = domains.findIndex((d, i) => d === domain);
                                return (
                                    <div
                                        key={actualIndex}
                                        className="flex items-center gap-3"
                                    >
                                        <TextField
                                            label={`Domain ${index + 1}`}
                                            variant="outlined"
                                            fullWidth
                                            value={domain.domain}
                                            onChange={(e) => handleDomainChange(actualIndex, e.target.value)}
                                            placeholder="e.g., example.com"
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: assetFieldStyles }}
                                        />
                                        {/* Show trash for existing domains always; for new domains only when not the last visible one */}
                                        {(domain.id ||
                                            domains.filter((d) => !d._destroy).length > 1) && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeDomain(actualIndex)}
                                                    className="flex items-center justify-center h-7 w-7 shrink-0 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors"
                                                    aria-label={`Remove domain ${index + 1}`}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                    </div>
                                );
                            })}
                    </div>
                </FormSection>

                <FormActionBar
                    onCancel={() => navigate(-1)}
                    onSubmit={handleSave}
                    submitLabel="Save"
                    isSubmitting={isSaving}
                />
            </div>
        </div>
    );
};
