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
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    userLimit: "",
    renewalTerms: "",
    amenities: [] as string[],
    active: true,
    createdAt: "",
    createdBy: "",
  });

  const fetchMembershipPlanDetails = async () => {
    try {
      setLoading(true);
      
      // Static data for testing
      const staticData: any = {
        "1": { name: "Gold Membership", price: "50000", user_limit: "4", renewal_terms: "yearly", amenities: ["Swimming Pool", "Gym", "Spa", "Tennis Court", "Restaurant"], active: true, created_at: "2024-01-15", created_by: "Admin User" },
        "2": { name: "Silver Membership", price: "30000", user_limit: "2", renewal_terms: "quarterly", amenities: ["Swimming Pool", "Gym", "Cafe"], active: true, created_at: "2024-02-20", created_by: "Admin User" },
        "3": { name: "Platinum Membership", price: "100000", user_limit: "6", renewal_terms: "yearly", amenities: ["Swimming Pool", "Gym", "Spa", "Tennis Court", "Basketball Court", "Sauna", "Steam Room", "Jacuzzi", "Restaurant", "Bar"], active: true, created_at: "2024-01-10", created_by: "John Doe" },
        "4": { name: "Bronze Membership", price: "15000", user_limit: "1", renewal_terms: "monthly", amenities: ["Gym", "Yoga Studio"], active: false, created_at: "2024-03-05", created_by: "Jane Smith" },
        "5": { name: "Family Membership", price: "75000", user_limit: "8", renewal_terms: "yearly", amenities: ["Swimming Pool", "Gym", "Kids Play Area", "Game Room", "Restaurant", "Cafe"], active: true, created_at: "2024-02-01", created_by: "Admin User" },
      };

      const data = staticData[id || "1"];
      if (data) {
        setFormData({
          name: data.name || "",
          price: data.price || "",
          userLimit: data.user_limit || "",
          renewalTerms: data.renewal_terms || "",
          amenities: data.amenities || [],
          active: data.active || false,
          createdAt: data.created_at || "",
          createdBy: data.created_by || "",
        });
      }

      // Uncomment below to use API
      // const response = await axios.get(
      //   `https://${baseUrl}/pms/admin/membership_plans/${id}.json`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // const data = response.data.membership_plan;
      // setFormData({
      //   name: data.name || "",
      //   price: data.price || "",
      //   userLimit: data.user_limit || "",
      //   renewalTerms: data.renewal_terms || "",
      //   amenities: data.amenities || [],
      //   active: data.active || false,
      //   createdAt: data.created_at || "",
      //   createdBy: data.created_by || "",
      // });
    } catch (error) {
      console.error("Error fetching membership plan details:", error);
      toast.error("Failed to fetch membership plan details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipPlanDetails();
  }, [id]);

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
                label="Plan Name"
                value={formData.name}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Price"
                value={`₹${formData.price}`}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="User Limit"
                value={formData.userLimit}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Renewal Terms"
                value={formData.renewalTerms ? formData.renewalTerms.charAt(0).toUpperCase() + formData.renewalTerms.slice(1) : ""}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Created On"
                value={formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : ""}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Created By"
                value={formData.createdBy}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  formData.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {formData.active ? "Active" : "Inactive"}
              </span>
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
              {AMENITIES_OPTIONS.map((amenity) => (
                <FormControlLabel
                  key={amenity}
                  control={
                    <Checkbox
                      checked={formData.amenities.includes(amenity)}
                      disabled
                      sx={{
                        color: "#C72030",
                        "&.Mui-checked": {
                          color: "#C72030",
                        },
                      }}
                    />
                  }
                  label={amenity}
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
