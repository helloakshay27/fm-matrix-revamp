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

export const MembershipPlanDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const [amenities, setAmenities] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    userLimit: "",
    renewalTerms: "",
    usageLimits: "",
    discountEligibility: "",
    amenities: [] as string[],
    amenityDetails: {} as Record<string, {
      frequency: string;
      slotLimit: string;
      canBookAfterSlotLimit: boolean;
      price: string;
      allowMultipleSlots: boolean;
      multipleSlots: string;
    }>,
    active: true,
    createdAt: "",
    createdBy: "",
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

  useEffect(() => {
    getAmenities()
  }, [])

  const fetchMembershipPlanDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://${baseUrl}/membership_plans/${id}.json`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })

      const data = response.data;
      const amenityDetailsMap = {};
      data.plan_amenities.forEach((amenity) => {
        amenityDetailsMap[amenity.facility_setup_id] = {
          frequency: amenity.frequency || "",
          slotLimit: amenity.slot_limit || "",
          canBookAfterSlotLimit: amenity.can_book_after_slot_limit || false,
          price: amenity.price || "",
          allowMultipleSlots: amenity.allow_multiple_slots || false,
          multipleSlots: amenity.multiple_slots || "",
        };
      });

      setFormData({
        name: data.name,
        price: data.price,
        userLimit: data.user_limit,
        renewalTerms: data.renewal_terms,
        usageLimits: data.usage_limits || "",
        discountEligibility: data.discount_eligibility || "",
        amenities: data.plan_amenities.map((amenity) => amenity.facility_setup_id),
        amenityDetails: amenityDetailsMap,
        active: data.status,
        createdAt: data.created_at,
        createdBy: data.created_by,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembershipPlanDetails();
  }, [id])

  const handleEditClick = () => {
    navigate(`/settings/vas/membership-plan/setup/edit/${id}`);
  };

  const handleClose = () => {
    navigate("/settings/vas/membership-plan/setup");
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
          <div className="flex items-end justify-between gap-2">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="p-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Membership Plan List
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleEditClick}
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                BASIC INFO
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Plan Name</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.name || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Price</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.price || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">User Limit</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.userLimit || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Renewal Terms</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.renewalTerms ? formData.renewalTerms.charAt(0).toUpperCase() + formData.renewalTerms.slice(1) : "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Usage Limits</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.usageLimits || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Discount Eligibility</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.discountEligibility || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Created On</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Created By</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.createdBy || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Status</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.active ? "Active" : "Inactive"}
                </span>
              </div>
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
              data={amenities.filter((a) => formData.amenities.includes(a.value))}
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
                    <span className="text-sm text-gray-700">
                      {details.frequency || "-"}
                    </span>
                  );
                }

                if (columnKey === "slotLimit") {
                  return (
                    <span className="text-sm text-gray-700">
                      {details.slotLimit || "-"}
                    </span>
                  );
                }

                if (columnKey === "price") {
                  return (
                    <span className="text-sm text-gray-700">
                      {details.canBookAfterSlotLimit ? details.price || "-" : "-"}
                    </span>
                  );
                }

                if (columnKey === "canBookAfterSlotLimit") {
                  return (
                    <input
                      type="checkbox"
                      checked={details.canBookAfterSlotLimit}
                      disabled
                      className="cursor-not-allowed"
                    />
                  );
                }

                if (columnKey === "allowMultipleSlots") {
                  return (
                    <input
                      type="checkbox"
                      checked={details.allowMultipleSlots}
                      disabled
                      className="cursor-not-allowed"
                    />
                  );
                }

                if (columnKey === "multipleSlots") {
                  return (
                    <span className="text-sm text-gray-700">
                      {details.allowMultipleSlots ? details.multipleSlots || "-" : "-"}
                    </span>
                  );
                }

                return "";
              }}
              emptyMessage="No amenities selected"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
