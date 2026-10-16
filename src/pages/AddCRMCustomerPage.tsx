import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { ArrowLeft,
  Calendar,
  Settings,
  Globe,
  X,
  Plus,
} from "lucide-react";
import { TextField } from "@mui/material";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createCustomer } from "@/store/slices/cusomerSlice";
import { toast } from "sonner";
import ReactSelect from 'react-select';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

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
    '&:hover': {
      border: '1px solid #1a1a1a'
    }
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 9999
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: '#f1f5f9',
    borderRadius: '4px'
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: '#334155'
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: '#64748b',
    borderRadius: '0px',
    '&:hover': {
      backgroundColor: '#e2e8f0',
      color: '#475569'
    }
  })
};

export const AddCRMCustomerPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();

  // Form state
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

  const [leases, setLeases] = useState([
    {
      id: 1,
      leaseStartDate: "",
      leaseEndDate: "",
      freeParking: "",
      paidParking: "",
    },
  ]);

  const [domains, setDomains] = useState([
    {
      id: 1,
      domain: "",
    },
  ]);

  const [sites, setSites] = useState<{ id: number; name: string }[]>([]);
  const [selectedSiteIds, setSelectedSiteIds] = useState<number[]>([]);

  useEffect(() => {
    setCurrentSection("CRM");
    fetchSites();
  }, [setCurrentSection]);

  const fetchSites = async () => {
    try {
      const userData = localStorage.getItem('user');
      let userId = '12437'; // default fallback
      
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

  const handleLeaseChange = (leaseId: number, field: string, value: string) => {
    setLeases((prev) =>
      prev.map((lease) =>
        lease.id === leaseId
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
      id: Date.now(),
      leaseStartDate: "",
      leaseEndDate: "",
      freeParking: "",
      paidParking: "",
    };
    setLeases((prev) => [...prev, newLease]);
  };

  const removeLease = (leaseId: number) => {
    if (leases.length > 1) {
      setLeases((prev) => prev.filter((lease) => lease.id !== leaseId));
    }
  };

  const handleDomainChange = (domainId: number, value: string) => {
    setDomains((prev) =>
      prev.map((domain) =>
        domain.id === domainId ? { ...domain, domain: value } : domain
      )
    );
  };

  const addNewDomain = () => {
    const newDomain = {
      id: Date.now(),
      domain: "",
    };
    setDomains((prev) => [...prev, newDomain]);
  };

  const removeDomain = (domainId: number) => {
    if (domains.length > 1) {
      setDomains((prev) => prev.filter((domain) => domain.id !== domainId));
    }
  };

  const validateForm = () => {
    if (!formData.customerName) {
      toast.error("Customer name is required");
      return false;
    }
    // if (!formData.customerCode) {
    //   toast.error("Customer code is required");
    //   return false;
    // }
    if (selectedSiteIds.length === 0) {
      toast.error("Please select at least one site");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const payload = {
      site_ids: selectedSiteIds,
      entity: {
        name: formData.customerName,
        email: formData.email || undefined,
        mobile: formData.mobile || undefined,
        ...(formData.customerType && { customer_type: formData.customerType }),
        ext_customer_code: formData.customerCode,
        company_code: formData.companyCode || undefined,
        color_code: formData.colorCode,
        ssid: formData.ssid || undefined,
        customer_leases_attributes: leases.map((lease) => ({
          site_id: localStorage.getItem("selectedSiteId"),
          lease_start_date: lease.leaseStartDate || undefined,
          lease_end_date: lease.leaseEndDate || undefined,
          free_parking: lease.freeParking || undefined,
          paid_parking: lease.paidParking || undefined,
        })),
        entity_domains_attributes: domains
          .filter((d) => d.domain.trim() !== "")
          .map((domain) => ({
            domain: domain.domain,
            entity_code: formData.customerCode,
          })),
      },
    };

    try {
      await dispatch(
        createCustomer({ baseUrl, token, data: payload })
      ).unwrap();
      toast.success("Customer created successfully");
      navigate(`/crm/customers`);
    } catch (error: any) {
      console.log(error);
      const message = typeof error === 'string'
        ? error
        : error?.response?.data?.error || error?.message || "Failed to create customer";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel? Any unsaved changes will be lost."
    );
    if (confirmed) {
      navigate(-1);
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
          <span className="text-gray-900 font-medium">Create New Customer</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW CUSTOMER</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Basic Details Section */}
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
              label="Company Code"
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
              label="Customer Code*"
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
              onChange={(e) =>
                handleInputChange("colorCode", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: assetFieldStyles,
                startAdornment: (
                  <input
                    type="color"
                    value={formData.colorCode}
                    onChange={(e) =>
                      handleInputChange("colorCode", e.target.value)
                    }
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
                const siteIds = selected.map(s => s.value);
                setSelectedSiteIds(siteIds);
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

        {/* Domain Section */}
        <FormSection
          title="DOMAIN INFORMATION"
          icon={Globe}
          headerActions={
            <button type="button" onClick={addNewDomain} className="fm-custom-field-btn">
              <Plus className="w-4 h-4" />
              Add Domain
            </button>
          }
        >
          <div className="space-y-4">
            {domains.map((domain, index) => (
              <div key={domain.id} className="flex items-center gap-3">
                <TextField
                  label={`Domain ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={domain.domain}
                  onChange={(e) =>
                    handleDomainChange(domain.id, e.target.value)
                  }
                  placeholder="e.g., lockated.com"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: assetFieldStyles }}
                />
                {domains.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDomain(domain.id)}
                    className="flex items-center justify-center h-7 w-7 shrink-0 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors"
                    aria-label={`Remove domain ${index + 1}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </FormSection>

        {/* Lease Information Section */}
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
                key={lease.id}
                className={index > 0 ? "pt-4 border-t border-gray-200" : undefined}
              >
                {leases.length > 1 && (
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Lease {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeLease(lease.id)}
                      className="flex items-center justify-center h-7 w-7 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors"
                      aria-label={`Remove lease ${index + 1}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <TextField
                    label="Lease Start Date"
                    variant="outlined"
                    fullWidth
                    type="date"
                    value={lease.leaseStartDate}
                    onChange={(e) =>
                      handleLeaseChange(
                        lease.id,
                        "leaseStartDate",
                        e.target.value
                      )
                    }
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
                      if (
                        lease.leaseStartDate &&
                        value < lease.leaseStartDate
                      ) {
                        toast.error(
                          "End date cannot be earlier than start date"
                        );
                        return;
                      }
                      handleLeaseChange(lease.id, "leaseEndDate", value);
                    }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: lease.leaseStartDate || undefined,
                    }}
                    InputProps={{ sx: assetFieldStyles }}
                  />
                  <TextField
                    label="Free Parking"
                    placeholder="Enter Free Parking"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={lease.freeParking}
                    onChange={(e) =>
                      handleLeaseChange(
                        lease.id,
                        "freeParking",
                        e.target.value
                      )
                    }
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
                    onChange={(e) =>
                      handleLeaseChange(
                        lease.id,
                        "paidParking",
                        e.target.value
                      )
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: assetFieldStyles }}
                  />
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        <FormActionBar
          onCancel={handleCancel}
          onSubmit={handleSave}
          submitLabel="Submit"
        />
      </div>
    </div>
  );
};
