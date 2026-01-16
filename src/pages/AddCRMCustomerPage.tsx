import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { Button } from "../components/ui/button";
import {
  Calendar,
  Trash2,
  Settings,
  ArrowLeft,
  Globe,
  Plus,
  X,
} from "lucide-react";
import { TextField } from "@mui/material";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createCustomer } from "@/store/slices/cusomerSlice";
import { toast } from "sonner";

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

  useEffect(() => {
    setCurrentSection("CRM");
  }, [setCurrentSection]);

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
    if (!formData.customerCode) {
      toast.error("Customer code is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const payload = {
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
    } catch (error) {
      console.log(error);
      toast.error("Failed to create customer");
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Add New Customer
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto p-6 space-y-4">
        {/* Basic Details Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E5E0D3] rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-[#C72030]" />
              </div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Basic Details
              </h2>
            </div>
          </div>

          <div className="p-6">
            {/* Customer Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <TextField
                  label="Customer Name*"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.customerName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(value)) {
                      handleInputChange("customerName", value);
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
              <div>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  size="small"
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
              <div>
                <TextField
                  label="Mobile"
                  variant="outlined"
                  fullWidth
                  size="small"
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
              <div>
                <TextField
                  label="Customer Type"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.customerType}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange("customerType", value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
              <div>
                <TextField
                  label="Customer Code*"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.customerCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange("customerCode", value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
              <div>
                <TextField
                  label="Company Code"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.companyCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange("companyCode", value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.colorCode}
                      onChange={(e) =>
                        handleInputChange("colorCode", e.target.value)
                      }
                      className="w-10 h-10 rounded border border-gray-300 cursor-pointer flex-shrink-0 hover:border-gray-400 transition-colors"
                    />
                    <TextField
                      label="Color Code"
                      variant="outlined"
                      size="small"
                      value={formData.colorCode}
                      onChange={(e) =>
                        handleInputChange("colorCode", e.target.value)
                      }
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          height: "40px",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E5E0D3] rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#C72030]" />
              </div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Domain Information
              </h2>
            </div>
          </div>

          <div className="p-6">
            {domains.map((domain, index) => (
              <div
                key={domain.id}
                className="flex items-center gap-4 mb-4 last:mb-0"
              >
                <TextField
                  label={`Domain ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={domain.domain}
                  onChange={(e) =>
                    handleDomainChange(domain.id, e.target.value)
                  }
                  placeholder="e.g., lockated.com"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                {domains.length > 1 && (
                  <button
                    onClick={() => removeDomain(domain.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            ))}
            <Button
              onClick={addNewDomain}
              variant="outline"
              className="mt-4 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Domain
            </Button>
          </div>
        </div>

        {/* Lease Information Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E5E0D3] rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#C72030]" />
              </div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Lease Information
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {leases.map((lease, index) => (
              <div
                key={lease.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                {index > 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Lease {index + 1}
                    </h4>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <TextField
                      label="Lease Start Date"
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="date"
                      value={lease.leaseStartDate}
                      onChange={(e) =>
                        handleLeaseChange(
                          lease.id,
                          "leaseStartDate",
                          e.target.value
                        )
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                  </div>

                  <div>
                    <TextField
                      label="Lease End Date"
                      variant="outlined"
                      fullWidth
                      size="small"
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: lease.leaseStartDate || undefined,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Free Parking"
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="number"
                      value={lease.freeParking}
                      onChange={(e) =>
                        handleLeaseChange(
                          lease.id,
                          "freeParking",
                          e.target.value
                        )
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Paid Parking Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-end gap-2">
                      <TextField
                        label="Paid Parking"
                        variant="outlined"
                        fullWidth
                        size="small"
                        type="number"
                        value={lease.paidParking}
                        onChange={(e) =>
                          handleLeaseChange(
                            lease.id,
                            "paidParking",
                            e.target.value
                          )
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                      {leases.length > 1 && (
                        <button
                          onClick={() => removeLease(lease.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors h-10"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Lease Button */}
            <Button
              onClick={addNewLease}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lease
            </Button>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-4 pt-6 border-t">
          <Button
            onClick={handleSave}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-11 w-40"
          >
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-40 h-11"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
