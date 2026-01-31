import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, DollarSign ,NotepadText,FileCog } from "lucide-react";
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

export const BillCyclesDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);

    const [amenities, setAmenities] = useState([])
    // const [formData, setFormData] = useState({
    //     name: "",
    //     price: "",
    //     userLimit: "",
    //     renewalTerms: "",
    //     paymentFrequency: "",
    //     usageLimits: "",
    //     discountEligibility: "",
    //     amenities: [] as string[],
    //     amenityDetails: {} as Record<string, {
    //         frequency: string;
    //         slotLimit: string;
    //         canBookAfterSlotLimit: boolean;
    //         price: string;
    //         allowMultipleSlots: boolean;
    //         multipleSlots: string;
    //     }>,
    //     active: true,
    //     createdAt: "",
    //     createdBy: "",
    // });

    const [formData, setFormData] = useState({
  billCycleName: "",
  startDate: "",
  endDate: "",
  paymentDueDays: "",
  billCycleFrequency: "",
  fine: "",
  interest: "",
  charges: "",
  expense: false,
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
                paymentFrequency: data.payment_plan?.name || "",
                usageLimits: data.usage_limits || "",
                discountEligibility: data.discount_eligibility || "",
                amenities: data.plan_amenities.map((amenity) => amenity.facility_setup_id),
                amenityDetails: amenityDetailsMap,
                active: data.active,
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
        navigate("/settings/bill-cycles");
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
                            Back to Bill Cycle List
                        </Button>
                        {/* <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handleEditClick}
                                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                            >
                                Edit
                            </Button>
                        </div> */}
                    </div>
                </div>


                <div className="space-y-6">
  <div className="bg-white rounded-lg border-2 p-6 space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
        <FileCog className="w-4 h-4" />
      </div>
      <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
        Bill Cycle Details
      </h3>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="flex items-start">
        <span className="text-gray-500 min-w-[140px]">Bill Cycle Name</span>
        <span className="text-gray-500 mx-2">:</span>
        <span className="text-gray-900 font-medium">
          {formData.billCycleName || "-"}
        </span>
      </div>

      <div className="flex items-start">
        <span className="text-gray-500 min-w-[140px]">Start Date</span>
        <span className="text-gray-500 mx-2">:</span>
        <span className="text-gray-900 font-medium">
          {formData.startDate
            ? new Date(formData.startDate).toLocaleDateString("en-GB")
            : "-"}
        </span>
      </div>

      <div className="flex items-start">
        <span className="text-gray-500 min-w-[140px]">End Date</span>
        <span className="text-gray-500 mx-2">:</span>
        <span className="text-gray-900 font-medium">
          {formData.endDate
            ? new Date(formData.endDate).toLocaleDateString("en-GB")
            : "-"}
        </span>
      </div>

      <div className="flex items-start">
        <span className="text-gray-500 min-w-[140px]">Payment Due (Days)</span>
        <span className="text-gray-500 mx-2">:</span>
        <span className="text-gray-900 font-medium">
          {formData.paymentDueDays || "-"}
        </span>
      </div>

      <div className="flex items-start">
        <span className="text-gray-500 min-w-[140px]">Bill Cycle Frequency</span>
        <span className="text-gray-500 mx-2">:</span>
        <span className="text-gray-900 font-medium">
          {formData.billCycleFrequency || "-"}
        </span>
      </div>

      <div className="flex items-start">
        <span className="text-gray-500 min-w-[140px]">Fine</span>
        <span className="text-gray-500 mx-2">:</span>
        <span className="text-gray-900 font-medium">
          {formData.fine || "-"}
        </span>
      </div>

      <div className="flex items-start">
        <span className="text-gray-500 min-w-[140px]">Interest</span>
        <span className="text-gray-500 mx-2">:</span>
        <span className="text-gray-900 font-medium">
          {formData.interest || "-"}
        </span>
      </div>

      <div className="flex items-start">
        <span className="text-gray-500 min-w-[140px]">Charges</span>
        <span className="text-gray-500 mx-2">:</span>
        <span className="text-gray-900 font-medium">
          {formData.charges || "-"}
        </span>
      </div>

      <div className="flex items-start">
        <span className="text-gray-500 min-w-[140px]">Expense</span>
        <span className="text-gray-500 mx-2">:</span>
        <span className="text-gray-900 font-medium">
          {formData.expense ? "Yes" : "No"}
        </span>
      </div>
    </div>
  </div>
</div>

            </div>
        </ThemeProvider>
    );
};
