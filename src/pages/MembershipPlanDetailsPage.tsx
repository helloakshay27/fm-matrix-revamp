import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, DollarSign } from "lucide-react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, ThemeProvider, createTheme } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";

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
    amenities: [],
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

      setFormData({
        name: data.name,
        price: data.price,
        userLimit: data.user_limit,
        renewalTerms: data.renewal_terms,
        amenities: data.plan_amenities.map((amenity) => amenity.id),
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
    navigate(`/club-management/vas/membership-plan/setup/edit/${id}`);
  };

  const handleClose = () => {
    navigate("/club-management/vas/membership-plan/setup");
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <FormControlLabel
                  key={amenity.value}
                  control={
                    <Checkbox
                      checked={formData.amenities.includes(amenity.value)}
                      sx={{
                        color: "#C72030",
                        "&.Mui-checked": {
                          color: "#C72030",
                        },
                      }}
                    />
                  }
                  label={amenity.name}
                />
              ))}
            </div>

            {formData.amenities.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No amenities selected
              </p>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
