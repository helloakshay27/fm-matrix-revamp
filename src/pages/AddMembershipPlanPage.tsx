import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, DollarSign, Trash2 } from "lucide-react";
import { TextField, FormControl, InputLabel, Select, MenuItem, ThemeProvider, createTheme } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

// Custom theme for MUI components
const muiTheme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
      defaultProps: {
        shrink: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiSelect-select": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
    },
  },
});

// Available amenities options
const AMENITIES_OPTIONS = [
  "Swimming Pool",
  "Gym",
  "Spa",
  "Tennis Court",
  "Basketball Court",
  "Badminton Court",
  "Yoga Studio",
  "Meditation Room",
  "Sauna",
  "Steam Room",
  "Jacuzzi",
  "Kids Play Area",
  "Game Room",
  "Library",
  "Conference Room",
  "Business Center",
  "Lounge",
  "Restaurant",
  "Cafe",
  "Bar",
];

export const AddMembershipPlanPage = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [amenities, setAmenities] = useState([])
  const [paymentPlans, setPaymentPlans] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    userLimit: "",
    renewalTerms: "",
    payment_plan_id: "",
    usageLimits: "Unlimited",
    discountEligibility: "No",
    amenities: [] as string[],
    amenityDetails: {} as Record<string, {
      frequency: string;
      slotLimit: string;
      canBookAfterSlotLimit: boolean;
      price: string;
      allowMultipleSlots: boolean;
      multipleSlots: string;
    }>,
  });

  const getAmenities = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/membership_plans/amenitiy_list.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      setAmenities(response.data.ameneties)
    } catch (error) {
      console.log(error)
    }
  }

  const getPaymentPlans = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/payment_plans.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      setPaymentPlans(response.data.plans || [])
    } catch (error) {
      console.log(error)
    }
  }

  console.log(amenities)

  useEffect(() => {
    getAmenities()
    getPaymentPlans()
  }, [])

  const validateForm = () => {
    if (!formData.name) {
      toast.error("Please enter Plan Name");
      return false;
    }
    if (!formData.price) {
      toast.error("Please enter Price");
      return false;
    }
    if (!formData.userLimit) {
      toast.error("Please enter User Limit");
      return false;
    }
    if (!formData.renewalTerms) {
      toast.error("Please select Renewal Terms");
      return false;
    }
    if (formData.amenities.length === 0) {
      toast.error("Please select at least one amenity");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = {
        membership_plan: {
          name: formData.name,
          site_id: localStorage.getItem("selectedSiteId"),
          price: formData.price,
          user_limit: formData.userLimit,
          renewal_terms: formData.renewalTerms,
          payment_plan_id: formData.payment_plan_id ? parseInt(formData.payment_plan_id) : null,
          usage_limits: formData.usageLimits,
          discount_eligibility: formData.discountEligibility,
          active: true,
          plan_amenities_attributes: formData.amenities.map(amenityId => {
            const details = formData.amenityDetails[amenityId];
            return {
              id: null,
              facility_setup_id: amenityId,
              access: "s",
              frequency: details.frequency,
              slot_limit: details.slotLimit ? parseInt(details.slotLimit) : 0,
              can_book_after_slot_limit: details.canBookAfterSlotLimit,
              price: details.price ? parseFloat(details.price) : 0,
              allow_multiple_slots: details.allowMultipleSlots,
              multiple_slots: details.multipleSlots ? parseInt(details.multipleSlots) : 0,
              _destroy: false
            };
          })
        }
      };

      await axios.post(`https://${baseUrl}/membership_plans.json`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      toast.success("Membership plan created successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error saving membership plan:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="p-6 bg-white">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Membership Plan List
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                BASIC INFO
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                label="Plan Name*"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow letters and spaces, no numbers
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    setFormData({ ...formData, name: value });
                  }
                }}
                variant="outlined"
              />

              <TextField
                label="Price*"
                type="text"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only positive numbers with max 2 decimal places
                  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                    setFormData({ ...formData, price: value });
                  }
                }}
                variant="outlined"
                placeholder="0.00"
              />

              <TextField
                label="User Limit*"
                type="text"
                value={formData.userLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only positive integers (no decimals, no negatives)
                  if (value === '' || /^\d+$/.test(value)) {
                    setFormData({ ...formData, userLimit: value });
                  }
                }}
                variant="outlined"
                placeholder="0"
              />

              <FormControl variant="outlined">
                <InputLabel>Membership Type*</InputLabel>
                <Select
                  value={formData.renewalTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, renewalTerms: e.target.value })
                  }
                  label="Membership Type*"
                >
                  <MenuItem value="">
                    <em>Select Membership Type</em>
                  </MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quaterly">Quarterly</MenuItem>
                  <MenuItem value="half_yearly">Half Yearly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined">
                <InputLabel>Payment Plan</InputLabel>
                <Select
                  value={formData.payment_plan_id}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_plan_id: e.target.value })
                  }
                  label="Payment Plan"
                >
                  <MenuItem value="">
                    <em>Select Payment Plan</em>
                  </MenuItem>
                  {paymentPlans.map((plan, index) => (
                    <MenuItem key={index} value={index.toString()}>
                      {plan.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                AMENITIES
              </h3>
            </div>

            <EnhancedTaskTable
              data={amenities}
              hideColumnsButton={true}
              columns={[
                { key: "name", label: "Amenity Name", sortable: true },
                { key: "frequency", label: "Frequency", sortable: false },
                { key: "slotLimit", label: "Slot Limit", sortable: false },
                { key: "canBookAfterSlotLimit", label: "Can Book After Limit", sortable: false },
                { key: "price", label: "Price", sortable: false },
                { key: "allowMultipleSlots", label: "Allow Multiple Slots", sortable: false },
                { key: "multipleSlots", label: "Multiple Slots Count", sortable: false },
              ] as ColumnConfig[]}
              renderCell={(item, columnKey) => {
                const amenityId = item.value;
                const details = formData.amenityDetails[amenityId] || {
                  frequency: "",
                  slotLimit: "",
                  canBookAfterSlotLimit: false,
                  price: "",
                  allowMultipleSlots: false,
                  multipleSlots: "",
                };

                if (columnKey === "name") return item.name;

                if (columnKey === "frequency") {
                  return (
                    <select
                      value={details.frequency}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          amenityDetails: {
                            ...prev.amenityDetails,
                            [amenityId]: {
                              ...details,
                              frequency: e.target.value,
                            },
                          },
                        }));
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Select Frequency</option>
                      {formData.renewalTerms && (
                        <>
                          {formData.renewalTerms === "monthly" && (
                            <>
                              <option value="monthly">Monthly</option>
                            </>
                          )}
                          {formData.renewalTerms === "quaterly" && (
                            <>
                              <option value="monthly">Monthly</option>
                              <option value="quaterly">Quarterly</option>
                            </>
                          )}
                          {formData.renewalTerms === "half_yearly" && (
                            <>
                              <option value="monthly">Monthly</option>
                              <option value="quaterly">Quarterly</option>
                              <option value="half_yearly">Half Yearly</option>
                            </>
                          )}
                          {formData.renewalTerms === "yearly" && (
                            <>
                              <option value="monthly">Monthly</option>
                              <option value="quaterly">Quarterly</option>
                              <option value="half_yearly">Half Yearly</option>
                              <option value="yearly">Yearly</option>
                            </>
                          )}
                        </>
                      )}
                    </select>
                  );
                }

                if (columnKey === "slotLimit") {
                  return (
                    <input
                      type="number"
                      min="0"
                      value={details.slotLimit}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow positive integers
                        if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
                          setFormData((prev) => ({
                            ...prev,
                            amenityDetails: {
                              ...prev.amenityDetails,
                              [amenityId]: {
                                ...details,
                                slotLimit: value,
                              },
                            },
                          }));
                        }
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                      placeholder="0"
                    />
                  );
                }

                if (columnKey === "price") {
                  return (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={details.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow positive numbers with max 2 decimal places
                        if (value === '' || (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value || '0') >= 0)) {
                          setFormData((prev) => ({
                            ...prev,
                            amenityDetails: {
                              ...prev.amenityDetails,
                              [amenityId]: {
                                ...details,
                                price: value,
                              },
                            },
                          }));
                        }
                      }}
                      disabled={!details.canBookAfterSlotLimit}
                      className={`px-2 py-1 border border-gray-300 rounded text-sm w-24 ${!details.canBookAfterSlotLimit ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      placeholder="0.00"
                    />
                  );
                }

                if (columnKey === "canBookAfterSlotLimit") {
                  return (
                    <input
                      type="checkbox"
                      checked={details.canBookAfterSlotLimit}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          amenityDetails: {
                            ...prev.amenityDetails,
                            [amenityId]: {
                              ...details,
                              canBookAfterSlotLimit: e.target.checked,
                            },
                          },
                        }));
                      }}
                      className="cursor-pointer"
                    />
                  );
                }

                if (columnKey === "allowMultipleSlots") {
                  return (
                    <input
                      type="checkbox"
                      checked={details.allowMultipleSlots}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          amenityDetails: {
                            ...prev.amenityDetails,
                            [amenityId]: {
                              ...details,
                              allowMultipleSlots: e.target.checked,
                              multipleSlots: e.target.checked ? details.multipleSlots : "",
                            },
                          },
                        }));
                      }}
                      className="cursor-pointer"
                    />
                  );
                }

                if (columnKey === "multipleSlots") {
                  return (
                    <input
                      type="number"
                      min="0"
                      value={details.multipleSlots}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow positive integers
                        if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
                          setFormData((prev) => ({
                            ...prev,
                            amenityDetails: {
                              ...prev.amenityDetails,
                              [amenityId]: {
                                ...details,
                                multipleSlots: value,
                              },
                            },
                          }));
                        }
                      }}
                      disabled={!details.allowMultipleSlots}
                      className={`px-2 py-1 border border-gray-300 rounded text-sm w-24 ${!details.allowMultipleSlots ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      placeholder="0"
                    />
                  );
                }

                return "";
              }}
              selectable={true}
              selectedItems={formData.amenities}
              getItemId={(item) => item.value}
              onSelectItem={(itemId, checked) => {
                if (checked) {
                  setFormData((prev) => ({
                    ...prev,
                    amenities: [...prev.amenities, itemId],
                    amenityDetails: {
                      ...prev.amenityDetails,
                      [itemId]: {
                        frequency: "",
                        slotLimit: "",
                        canBookAfterSlotLimit: false,
                        price: "",
                        allowMultipleSlots: false,
                        multipleSlots: "",
                      },
                    },
                  }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    amenities: prev.amenities.filter((a) => a !== itemId),
                    amenityDetails: (() => {
                      const newDetails = { ...prev.amenityDetails };
                      delete newDetails[itemId];
                      return newDetails;
                    })(),
                  }));
                }
              }}
              onSelectAll={(checked) => {
                if (checked) {
                  const newDetails = {};
                  amenities.forEach((a) => {
                    newDetails[a.value] = {
                      frequency: "",
                      slotLimit: "",
                      canBookAfterSlotLimit: false,
                      price: "",
                      allowMultipleSlots: false,
                      multipleSlots: "",
                    };
                  });
                  setFormData((prev) => ({
                    ...prev,
                    amenities: amenities.map((a) => a.value),
                    amenityDetails: newDetails,
                  }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    amenities: [],
                    amenityDetails: {},
                  }));
                }
              }}
              emptyMessage="Select amenities to configure"
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
