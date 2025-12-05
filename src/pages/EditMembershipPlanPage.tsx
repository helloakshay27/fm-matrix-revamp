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
    amenities: [] as string[],
    active: true,
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
    try {
      setLoading(true);
      const response = await axios.get(`https://${baseUrl}/membership_plans/${id}.json`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })

      const data = response.data;
      console.log(data)

      setFormData({
        ...formData,
        name: data.name,
        price: data.price,
        userLimit: data.user_limit,
        renewalTerms: data.renewal_terms,
        amenities: data.plan_amenities.map((amenity) => amenity.id),
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
          plan_amenities_attributes: formData.amenities.map(amenity => ({
            facility_setup_id: amenity,
            access: "free"
          }))
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
    navigate("/club-management/vas/membership-plan/setup");
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
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
                <InputLabel>Renewal Terms*</InputLabel>
                <Select
                  value={formData.renewalTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, renewalTerms: e.target.value })
                  }
                  label="Renewal Terms*"
                >
                  <MenuItem value="">
                    <em>Select Renewal Terms</em>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <FormControlLabel
                  key={amenity.value}
                  control={
                    <Checkbox
                      checked={formData.amenities.includes(amenity.value)}
                      onChange={() => handleAmenityToggle(amenity.value)}
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
