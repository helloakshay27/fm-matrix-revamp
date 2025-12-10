import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, DollarSign } from "lucide-react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, ThemeProvider, createTheme } from "@mui/material";
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

export const EditMembershipPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    userLimit: "",
    renewalTerms: "",
    amenities: [] as any[],
    amenityDetails: {} as Record<string, {
      frequency: string;
      limit: string;
      allowExtraBooking: boolean;
      extraBookingPrice: string;
      price: string;
      allowMultipleSlots: boolean;
      multipleSlotPrice: string;
    }>,
    active: true,
  });
  const [removedAmenities, setRemovedAmenities] = useState([]);

  console.log(formData)

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

  useEffect(() => {
    getAmenities()
  }, [])

  const fetchMembershipPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://${baseUrl}/membership_plans/${id}.json`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })

      const data = response.data;
      console.log(data)
      const amenityDetailsMap = {};
      data.plan_amenities.forEach((amenity) => {
        amenityDetailsMap[amenity.facility_setup_id] = {
          frequency: amenity.frequency || "",
          limit: amenity.limit || "",
          allowExtraBooking: amenity.allow_extra_booking || false,
          extraBookingPrice: amenity.extra_booking_price || "",
          price: amenity.price || "",
          allowMultipleSlots: amenity.allow_multiple_slots || false,
          multipleSlotPrice: amenity.multiple_slot_price || "",
        };
      });

      setFormData({
        ...formData,
        name: data.name,
        price: data.price,
        userLimit: data.user_limit,
        renewalTerms: data.renewal_terms,
        amenities: data.plan_amenities,
        amenityDetails: amenityDetailsMap,
      })
    } catch (error) {
      console.error("Error fetching membership plan details:", error);
      toast.error("Failed to fetch membership plan details");
    } finally {
      setLoading(false);
    }
  };

  console.log(formData)

  useEffect(() => {
    fetchMembershipPlanDetails();
  }, [id]);

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
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = {
        membership_plan: {
          name: formData.name,
          price: formData.price,
          user_limit: formData.userLimit,
          renewal_terms: formData.renewalTerms,
          plan_amenities_attributes: [
            ...formData.amenities.map(amenity => {
              const details = formData.amenityDetails[amenity.facility_setup_id] || {};
              return {
                id: amenity.id,
                facility_setup_id: amenity.facility_setup_id,
                access: "free",
                frequency: details.frequency,
                limit: details.limit,
                allow_extra_booking: details.allowExtraBooking,
                extra_booking_price: details.extraBookingPrice,
                price: details.price,
                allow_multiple_slots: details.allowMultipleSlots,
                multiple_slot_price: details.multipleSlotPrice,
                _destroy: false
              };
            }),
            ...removedAmenities.map(id => ({
              id: id,
              _destroy: true
            }))
          ]
        }
      };

      await axios.put(`https://${baseUrl}/membership_plans/${id}.json`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      toast.success("Membership plan updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating membership plan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate("/settings/vas/membership-plan/setup");
  };

  const handleAmenityToggle = (amenityValue: string) => {
    setFormData((prev) => {
      const amenityToRemove = prev.amenities.find(
        (item) => item.facility_setup_id === amenityValue
      );

      if (amenityToRemove) {
        // Track removed amenity if it has an id (from existing plan)
        if (amenityToRemove.id) {
          setRemovedAmenities((prevRemoved) => [
            ...prevRemoved,
            amenityToRemove.id,
          ]);
        }
        return {
          ...prev,
          amenities: prev.amenities.filter(
            (a) => a.facility_setup_id !== amenityValue
          ),
        };
      } else {
        const selectedAmenity = amenities.find(
          (a) => a.value === amenityValue
        );
        return {
          ...prev,
          amenities: selectedAmenity
            ? [
              ...prev.amenities,
              {
                id: null,
                facility_setup_id: selectedAmenity.value,
                access: "free",
              },
            ]
            : prev.amenities,
        };
      }
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
        </div>
      </div>
    );
  }

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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                variant="outlined"
              />

              <TextField
                label="Price*"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                variant="outlined"
              />

              <TextField
                label="User Limit*"
                type="number"
                value={formData.userLimit}
                onChange={(e) =>
                  setFormData({ ...formData, userLimit: e.target.value })
                }
                variant="outlined"
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
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
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
                { key: "limit", label: "Slots Limit", sortable: false },
                { key: "allowExtraBooking", label: "Allow Extra Booking", sortable: false },
                { key: "extraBookingPrice", label: "Extra Booking Price", sortable: false },
                { key: "allowMultipleSlots", label: "Multiple Slots Allowed", sortable: false },
                { key: "multipleSlotPrice", label: "Multiple Slots", sortable: false },
              ] as ColumnConfig[]}
              renderCell={(item, columnKey) => {
                const amenityId = item.value;
                const details = formData.amenityDetails[amenityId] || {
                  frequency: "",
                  limit: "",
                  allowExtraBooking: false,
                  extraBookingPrice: "",
                  price: "",
                  allowMultipleSlots: false,
                  multipleSlotPrice: "",
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
                          {formData.renewalTerms === "quarterly" && (
                            <>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                            </>
                          )}
                          {formData.renewalTerms === "yearly" && (
                            <>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </>
                          )}
                        </>
                      )}
                    </select>
                  );
                }

                if (columnKey === "limit") {
                  return (
                    <input
                      type="number"
                      min="0"
                      value={details.limit}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          amenityDetails: {
                            ...prev.amenityDetails,
                            [amenityId]: {
                              ...details,
                              limit: e.target.value,
                            },
                          },
                        }));
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
                        setFormData((prev) => ({
                          ...prev,
                          amenityDetails: {
                            ...prev.amenityDetails,
                            [amenityId]: {
                              ...details,
                              price: e.target.value,
                            },
                          },
                        }));
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-24"
                      placeholder="0.00"
                    />
                  );
                }

                if (columnKey === "allowExtraBooking") {
                  return (
                    <input
                      type="checkbox"
                      checked={details.allowExtraBooking}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          amenityDetails: {
                            ...prev.amenityDetails,
                            [amenityId]: {
                              ...details,
                              allowExtraBooking: e.target.checked,
                              extraBookingPrice: e.target.checked ? details.extraBookingPrice : "",
                            },
                          },
                        }));
                      }}
                      className="cursor-pointer"
                    />
                  );
                }

                if (columnKey === "extraBookingPrice") {
                  return (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={details.extraBookingPrice}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          amenityDetails: {
                            ...prev.amenityDetails,
                            [amenityId]: {
                              ...details,
                              extraBookingPrice: e.target.value,
                            },
                          },
                        }));
                      }}
                      disabled={!details.allowExtraBooking}
                      className={`px-2 py-1 border border-gray-300 rounded text-sm w-24 ${!details.allowExtraBooking ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      placeholder="0.00"
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
                              multipleSlotPrice: e.target.checked ? details.multipleSlotPrice : "",
                            },
                          },
                        }));
                      }}
                      className="cursor-pointer"
                    />
                  );
                }

                if (columnKey === "multipleSlotPrice") {
                  return (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={details.multipleSlotPrice}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          amenityDetails: {
                            ...prev.amenityDetails,
                            [amenityId]: {
                              ...details,
                              multipleSlotPrice: e.target.value,
                            },
                          },
                        }));
                      }}
                      disabled={!details.allowMultipleSlots}
                      className={`px-2 py-1 border border-gray-300 rounded text-sm w-24 ${!details.allowMultipleSlots ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      placeholder="0.00"
                    />
                  );
                }

                return "";
              }}
              selectable={true}
              selectedItems={formData.amenities.map((a) => a.facility_setup_id)}
              getItemId={(item) => item.value}
              onSelectItem={(itemId, checked) => {
                if (checked) {
                  const selectedAmenity = amenities.find((a) => a.value === itemId);
                  setFormData((prev) => ({
                    ...prev,
                    amenities: [
                      ...prev.amenities,
                      {
                        id: null,
                        facility_setup_id: itemId,
                        access: "free",
                      },
                    ],
                    amenityDetails: {
                      ...prev.amenityDetails,
                      [itemId]: {
                        frequency: "",
                        limit: "",
                        allowExtraBooking: false,
                        extraBookingPrice: "",
                        price: "",
                        allowMultipleSlots: false,
                        multipleSlotPrice: "",
                      },
                    },
                  }));
                } else {
                  const amenityToRemove = formData.amenities.find(
                    (item) => item.facility_setup_id === itemId
                  );
                  if (amenityToRemove?.id) {
                    setRemovedAmenities((prevRemoved) => [
                      ...prevRemoved,
                      amenityToRemove.id,
                    ]);
                  }
                  setFormData((prev) => ({
                    ...prev,
                    amenities: prev.amenities.filter(
                      (a) => a.facility_setup_id !== itemId
                    ),
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
                      limit: "",
                      allowExtraBooking: false,
                      extraBookingPrice: "",
                      price: "",
                      allowMultipleSlots: false,
                      multipleSlotPrice: "",
                    };
                  });
                  setFormData((prev) => ({
                    ...prev,
                    amenities: amenities.map((a) => ({
                      id: null,
                      facility_setup_id: a.value,
                      access: "free",
                    })),
                    amenityDetails: newDetails,
                  }));
                } else {
                  const idsToRemove = formData.amenities.filter((a) => a.id).map((a) => a.id);
                  setRemovedAmenities((prev) => [...prev, ...idsToRemove]);
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
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
