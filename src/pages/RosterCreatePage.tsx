import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  Clock,
  Users,
  Loader2,
  Save,
  X,
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  TextField,
  Chip,
  Box,
  OutlinedInput,
  ListItemText,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { departmentService, Department } from "@/services/departmentService";
import { RootState } from "@/store/store";

// Section component for consistent layout (matches PatrollingCreatePage)
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <section className="bg-card rounded-lg border border-border shadow-sm">
    <div className="px-6 py-4 border-b border-border flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

// Types
interface FMUser {
  id: number;
  name: string;
  email?: string;
  department?: string;
}

interface Shift {
  id: number;
  start_hour: number;
  start_min: number;
  end_hour: number;
  end_min: number;
  timings: string;
  total_hour: number;
}

interface RosterFormData {
  templateName: string;
  selectedDays: string[];
  dayType: "Weekdays" | "Weekends" | "Recurring";
  weekSelection: string[];
  location: string;
  departments: number[];
  shift: number | null;
  selectedEmployees: number[];
  rosterType: "Permanent";
}

export const RosterCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // Redux state for site information
  const { selectedSite } = useSelector((state: RootState) => state.site);

  // Set document title
  useEffect(() => {
    document.title = "Create Roster Template";
  }, []);

  // Form state
  const [formData, setFormData] = useState<RosterFormData>({
    templateName: "",
    selectedDays: [],
    dayType: "Weekdays",
    weekSelection: [],
    location: "",
    departments: [],
    shift: null,
    selectedEmployees: [],
    rosterType: "Permanent",
  });

  // Period selection state
  const [period, setPeriod] = useState({
    startDate: new Date(2025, 7, 21), // Month is 0-indexed, so 7 = August
    endDate: new Date(2025, 8, 19)    // 8 = September
  });

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFMUsers, setLoadingFMUsers] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);

  // Data states
  const [fmUsers, setFMUsers] = useState<FMUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>("");

  // Filtered FM Users based on department selection
  const [filteredFMUsers, setFilteredFMUsers] = useState<FMUser[]>([]);
  const [loadingFilteredFMUsers, setLoadingFilteredFMUsers] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    templateName: false,
    selectedDays: false,
    dayType: false,
    location: false,
    departments: false,
    shift: false,
    selectedEmployees: false,
  });

  // Constants
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // MUI select styles to match PatrollingCreatePage
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
      padding: { xs: "8px", sm: "10px", md: "12px" },
    },
    backgroundColor: "#fafbfc",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e1e5e9",
      borderWidth: "1px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9ca3af",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6b7280",
      borderWidth: "2px",
    },
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFMUsers();
    fetchDepartments();
    fetchShifts();
    fetchCurrentLocation();
  }, []);

  // Update location when selectedSite changes
  useEffect(() => {
    if (selectedSite?.name) {
      setCurrentLocation(selectedSite.name);
      setFormData((prev) => ({ ...prev, location: selectedSite.name }));
    }
  }, [selectedSite]);

  // Fetch FM Users
  const fetchFMUsers = async () => {
    setLoadingFMUsers(true);
    try {
      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.FM_USERS);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("FM Users API Response:", data);

      // Adapt the response to our expected format
      const users = data.fm_users || data.users || data || [];
      setFMUsers(
        users.map((user: any) => ({
          id: user.id,
          name:
            user.name ||
            user.full_name ||
            `${user.firstname || ""} ${user.lastname || ""}`.trim(),
          email: user.email,
          department: user.department
            ? user.department.department_name
            : undefined,
        }))
      );
    } catch (error) {
      console.error("Error fetching FM Users:", error);
      toast.error("Failed to load FM users");
      setFMUsers([]);
    } finally {
      setLoadingFMUsers(false);
    }
  };

  // Fetch FM Users for selected departments
  const fetchFilteredFMUsers = async (departmentIds: number[]) => {
    if (!departmentIds || departmentIds.length === 0) {
      setFilteredFMUsers([]);
      return;
    }
    setLoadingFilteredFMUsers(true);
    try {
      const idsParam = departmentIds.join(",");
      const apiUrl = `${API_CONFIG.BASE_URL}/pms/admin/user_roasters/department_roasters.json?department_id=${idsParam}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Adapt response to FMUser[]
      const users = data.fm_users || data.users || data || [];
      setFilteredFMUsers(
        users.map((user: any) => ({
          id: user.id,
          name:
            user.name ||
            user.full_name ||
            `${user.firstname || ""} ${user.lastname || ""}`.trim(),
          email: user.email,
          department: user.department
            ? user.department.department_name
            : undefined,
        }))
      );
    } catch (error) {
      console.error("Error fetching filtered FM users:", error);
      toast.error("Failed to load employees for selected departments");
      setFilteredFMUsers([]);
    } finally {
      setLoadingFilteredFMUsers(false);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const departmentData = await departmentService.fetchDepartments();
      setDepartments(departmentData);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Fetch Shifts from the API
  const fetchShifts = async () => {
    setLoadingShifts(true);
    try {
      const apiUrl = getFullUrl("/pms/admin/user_shifts.json");
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Shifts API Response:", data);

      // Adapt the response to our expected format
      const shiftsData = data.user_shifts || data.shifts || data || [];
      setShifts(
        shiftsData.map((shift: any) => ({
          id: shift.id,
          start_hour: shift.start_hour,
          start_min: shift.start_min,
          end_hour: shift.end_hour,
          end_min: shift.end_min,
          timings: shift.timings,
          total_hour: shift.total_hour,
        }))
      );
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Failed to load shifts");
      setShifts([]);
    } finally {
      setLoadingShifts(false);
    }
  };

  // Fetch Current Location (from site context)
  const fetchCurrentLocation = async () => {
    try {
      // First try to get from Redux state
      if (selectedSite?.name) {
        setCurrentLocation(selectedSite.name);
        setFormData((prev) => ({ ...prev, location: selectedSite.name }));
        return;
      }

      // Fallback to localStorage
      const siteId = localStorage.getItem("selectedSiteId");
      const siteName = localStorage.getItem("selectedSiteName");
      const companyName = localStorage.getItem("selectedCompanyName");

      let locationName = "Current Site";

      if (siteName && siteName !== "null" && siteName !== "") {
        locationName = siteName;
      } else if (companyName && companyName !== "null" && companyName !== "") {
        locationName = companyName;
      }

      // Try to get from DOM if localStorage doesn't have it
      if (locationName === "Current Site") {
        const headerSiteElement = document.querySelector("[data-site-name]");
        if (headerSiteElement) {
          locationName =
            headerSiteElement.textContent?.trim() || "Current Site";
        }
      }

      setCurrentLocation(locationName);
      setFormData((prev) => ({ ...prev, location: locationName }));
    } catch (error) {
      console.error("Error fetching current location:", error);
      setCurrentLocation("Current Site");
      setFormData((prev) => ({ ...prev, location: "Current Site" }));
    }
  };

  // Handle day selection
  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));

    // Clear day error when user selects a day
    if (errors.selectedDays) {
      setErrors((prev) => ({ ...prev, selectedDays: false }));
    }
  };

  // Handle day type selection (Weekdays, Weekends, Recurring)
  const handleDayTypeChange = (type: "Weekdays" | "Weekends" | "Recurring") => {
    setFormData((prev) => ({
      ...prev,
      dayType: type,
      selectedDays: [],
      weekSelection: [],
    }));

    // Clear day error when user selects a type
    if (errors.selectedDays) {
      setErrors((prev) => ({ ...prev, selectedDays: false }));
    }
  };

  // Handle week selection for recurring
  const handleWeekToggle = (week: string) => {
    setFormData((prev) => {
      const newWeekSelection = prev.weekSelection.includes(week)
        ? prev.weekSelection.filter((w) => w !== week)
        : [...prev.weekSelection, week];

      // If "All" is selected, select all other options
      if (week === "All" && !prev.weekSelection.includes("All")) {
        if (prev.dayType === "Weekdays") {
          return {
            ...prev,
            weekSelection: [
              "1st Week",
              "2nd Week",
              "3rd Week",
              "4th Week",
              "5th Week",
              "All",
            ],
          };
        } else if (prev.dayType === "Weekends") {
          return {
            ...prev,
            weekSelection: [
              "1st Weekend",
              "2nd Weekend",
              "3rd Weekend",
              "4th Weekend",
              "5th Weekend",
              "All",
            ],
          };
        }
      }

      // If "All" is deselected, deselect all other options
      if (week === "All" && prev.weekSelection.includes("All")) {
        return {
          ...prev,
          weekSelection: [],
        };
      }

      // If any other option is selected and "All" was already selected, remove "All"
      if (week !== "All" && prev.weekSelection.includes("All")) {
        const filteredSelection = prev.weekSelection.filter((w) => w !== "All");
        return {
          ...prev,
          weekSelection: newWeekSelection.filter((w) => w !== "All"),
        };
      }

      // Check if all individual options are selected (except "All"), then auto-select "All"
      const allOptions =
        prev.dayType === "Weekdays"
          ? ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week"]
          : [
              "1st Weekend",
              "2nd Weekend",
              "3rd Weekend",
              "4th Weekend",
              "5th Weekend",
            ];

      const hasAllIndividualOptions = allOptions.every((option) =>
        newWeekSelection.includes(option)
      );

      if (hasAllIndividualOptions && !newWeekSelection.includes("All")) {
        return {
          ...prev,
          weekSelection: [...newWeekSelection, "All"],
        };
      }

      return {
        ...prev,
        weekSelection: newWeekSelection,
      };
    });

    // Clear day error when user selects a week
    if (errors.selectedDays) {
      setErrors((prev) => ({ ...prev, selectedDays: false }));
    }
  };

  // Handle day toggle for recurring weekly schedule
  const handleRecurringDayToggle = (day: string, week: string) => {
    const dayKey = `${week}-${day}`;
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayKey)
        ? prev.selectedDays.filter((d) => d !== dayKey)
        : [...prev.selectedDays, dayKey],
    }));

    if (errors.selectedDays) {
      setErrors((prev) => ({ ...prev, selectedDays: false }));
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof RosterFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing/selecting
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }

    // If department selection changes, fetch filtered employees
    if (field === "departments") {
      fetchFilteredFMUsers(value as number[]);
      // Clear selected employees when departments change
      setFormData((prev) => ({
        ...prev,
        selectedEmployees: [],
      }));
      // Clear employee selection error
      setErrors((prev) => ({ ...prev, selectedEmployees: false }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    let hasSelectedDays = false;

    if (formData.dayType === "Recurring") {
      hasSelectedDays = formData.selectedDays.length > 0;
    } else if (
      formData.dayType === "Weekdays" ||
      formData.dayType === "Weekends"
    ) {
      hasSelectedDays = formData.weekSelection.length > 0;
    }

    const newErrors = {
      templateName: !formData.templateName.trim(),
      selectedDays: !hasSelectedDays,
      dayType: false, // dayType is always selected by default
      location: false, // Location is auto-populated, not required validation
      departments: formData.departments.length === 0,
      shift: formData.shift === null,
      selectedEmployees:
        formData.departments.length > 0 &&
        formData.selectedEmployees.length === 0,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) {
      const errorFields = [];
      if (newErrors.templateName) errorFields.push("Template Name");
      if (newErrors.selectedDays) errorFields.push("Working Days");
      if (newErrors.departments) errorFields.push("Department");
      if (newErrors.shift) errorFields.push("Shift");
      if (newErrors.selectedEmployees) errorFields.push("Selected Employees");

      toast.error(
        `Please fill in the following required fields: ${errorFields.join(
          ", "
        )}`,
        {
          duration: 5000,
        }
      );
    }

    return !hasErrors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build payload for API
      let payload;
      const baseUserRoaster = {
        name: formData.templateName,
        resource_id:
          selectedSite?.id || localStorage.getItem("selectedSiteId") || "",
        user_shift_id: formData.shift || "",
        seat_category_id: "1", // Required field
        allocation_type: formData.rosterType,
        roaster_type: formData.dayType,
      };

      // Common date format (Rails style for all types)
      const commonDateFields = {
        "start_date(3i)": period.startDate.getDate().toString(),
        "start_date(2i)": (period.startDate.getMonth() + 1).toString(),
        "start_date(1i)": period.startDate.getFullYear().toString(),
        "end_date(3i)": period.endDate.getDate().toString(),
        "end_date(2i)": (period.endDate.getMonth() + 1).toString(),
        "end_date(1i)": period.endDate.getFullYear().toString(),
      };

      // Base payload structure (common for all day types)
      const basePayload = {
        user_roaster: {
          ...baseUserRoaster,
          ...commonDateFields,
        },
        department_id: formData.departments.map(String),
        no_of_days: "",
        weekdays: [],
        weekends: [],
        user_ids: formData.selectedEmployees,
      };

      if (formData.dayType === "Weekdays") {
        // Weekdays payload
        // Convert week selections to weekday numbers (1-5 for 1st Week to 5th Week)
        const weekdays = formData.weekSelection
          .filter((w) => w.match(/^\d/)) // Filter selections that start with digit
          .map((w) => w.charAt(0)); // Get first character (week number)

        payload = {
          ...basePayload,
          weekdays: weekdays,
        };
      } else if (formData.dayType === "Weekends") {
        // Weekends payload
        // Convert weekend selections to weekend numbers (1-5 for 1st Weekend to 5th Weekend)
        const weekends = formData.weekSelection
          .filter((w) => w.match(/^\d/)) // Filter selections that start with digit
          .map((w) => w.charAt(0)); // Get first character (weekend number)

        payload = {
          ...basePayload,
          weekends: weekends,
        };
      } else if (formData.dayType === "Recurring") {
        // Recurring payload - matching your example structure
        const recurringData = {};
        for (let weekNum = 1; weekNum <= 5; weekNum++) {
          const daysForWeek = formData.selectedDays
            .filter((d) => d.startsWith(`Week${weekNum}-`))
            .map((d) => {
              const dayShort = d.split("-")[1];
              // Map short day to number (Mon=1, Tue=2, ..., Sun=7)
              return (
                ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(
                  dayShort
                ) + 1
              ).toString();
            });
          if (daysForWeek.length > 0) {
            recurringData[weekNum.toString()] = daysForWeek;
          }
        }

        payload = {
          ...basePayload,
          recurring: [recurringData],
        };
      } else {
        // Default fallback
        payload = basePayload;
      }

      // Log payload to console
      console.log("🎯 API Payload:", JSON.stringify(payload, null, 2));

      // Make API call
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/admin/user_roasters.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("API error");

      toast.success("Roster template created successfully!");
      navigate("/roster");
    } catch (error) {
      console.error("Error creating roster template:", error);
      toast.error("Failed to create roster template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel/back
  const handleCancel = () => {
    navigate("/roster");
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Select Period Section */}

      {/* Loading overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Roster Management"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide uppercase">
                Create Roster Template
              </h1>
              {(selectedSite?.name || currentLocation !== "Current Site") && (
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {selectedSite?.name || currentLocation}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Basic Information Section */}
        <Section
          title="Basic Information"
          icon={<Calendar className="w-4 h-4" />}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <TextField
                label={
                  <>
                    Template Name<span className="text-red-500">*</span>
                  </>
                }
                placeholder="Enter template name"
                value={formData.templateName}
                onChange={(e) =>
                  handleInputChange("templateName", e.target.value)
                }
                fullWidth
                variant="outlined"
                error={errors.templateName}
                helperText={
                  errors.templateName ? "Template name is required" : ""
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <TextField
                label="Roster Type"
                value="Permanent"
                disabled
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
                }}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-4 block mt-6">
              Working Days *
            </Label>

            {/* Day Type Selection - Compact inline */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-6">
                {/* Weekdays Option */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dayType"
                    checked={formData.dayType === "Weekdays"}
                    onChange={() => handleDayTypeChange("Weekdays")}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030] focus:ring-2"
                    style={{
                      accentColor: "#C72030",
                    }}
                    disabled={isSubmitting}
                  />
                  <span className="font-medium text-gray-800">Weekdays</span>
                  <span className="text-sm text-gray-500">(Mon-Fri)</span>
                </label>

                {/* Weekends Option */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dayType"
                    checked={formData.dayType === "Weekends"}
                    onChange={() => handleDayTypeChange("Weekends")}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030] focus:ring-2"
                    style={{
                      accentColor: "#C72030",
                    }}
                    disabled={isSubmitting}
                  />
                  <span className="font-medium text-gray-800">Weekends</span>
                  <span className="text-sm text-gray-500">(Sat-Sun)</span>
                </label>

                {/* Recurring Option */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dayType"
                    checked={formData.dayType === "Recurring"}
                    onChange={() => handleDayTypeChange("Recurring")}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030] focus:ring-2"
                    style={{
                      accentColor: "#C72030",
                    }}
                    disabled={isSubmitting}
                  />
                  <span className="font-medium text-gray-800">Recurring</span>
                  <span className="text-sm text-gray-500">(Custom)</span>
                </label>
              </div>
            </div>

            {/* Weekdays Selection - Compact */}
            {formData.dayType === "Weekdays" && (
              <div className="space-y-3 p-4 bg-[#f6f4ee] border border-[#D5DbDB] rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-sm font-medium text-[#C72030]">
                    Frequency:
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "1st Week",
                    "2nd Week",
                    "3rd Week",
                    "4th Week",
                    "5th Week",
                    "All",
                  ].map((week) => (
                    <label
                      key={week}
                      className={`
                        flex items-center gap-2 px-3 py-1 rounded-md border-2 cursor-pointer transition-all duration-200
                        ${
                          formData.weekSelection.includes(week)
                            ? "border-[#C72030] bg-[#C72030] text-white"
                            : "border-[#D5DbDB] bg-white text-[#1a1a1a] hover:border-[#C72030]"
                        }
                        ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.weekSelection.includes(week)}
                        onChange={() => handleWeekToggle(week)}
                        disabled={isSubmitting}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">
                        {week === "All" ? "All Weeks" : week}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-[#1a1a1a] opacity-70 mt-2">
                  Days: Mon, Tue, Wed, Thu, Fri
                </div>
              </div>
            )}

            {/* Weekends Selection - Compact */}
            {formData.dayType === "Weekends" && (
              <div className="space-y-3 p-4 bg-[#f6f4ee] border border-[#D5DbDB] rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-sm font-medium text-[#C72030]">
                    Frequency:
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "1st Weekend",
                    "2nd Weekend",
                    "3rd Weekend",
                    "4th Weekend",
                    "5th Weekend",
                    "All",
                  ].map((weekend) => (
                    <label
                      key={weekend}
                      className={`
                        flex items-center gap-2 px-3 py-1 rounded-md border-2 cursor-pointer transition-all duration-200
                        ${
                          formData.weekSelection.includes(weekend)
                            ? "border-[#C72030] bg-[#C72030] text-white"
                            : "border-[#D5DbDB] bg-white text-[#1a1a1a] hover:border-[#C72030]"
                        }
                        ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.weekSelection.includes(weekend)}
                        onChange={() => handleWeekToggle(weekend)}
                        disabled={isSubmitting}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">
                        {weekend === "All" ? "All Weekends" : weekend}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-[#1a1a1a] opacity-70 mt-2">
                  Days: Sat, Sun
                </div>
              </div>
            )}

            {/* Recurring Selection - Compact */}
            {formData.dayType === "Recurring" && (
              <div className="space-y-4 p-4 bg-[#f6f4ee] border border-[#D5DbDB] rounded-lg">
                <div className="text-sm font-medium text-[#C72030] mb-3">
                  Custom Weekly Pattern
                </div>

                {[1, 2, 3, 4, 5].map((weekNum) => (
                  <div
                    key={weekNum}
                    className="bg-white border border-[#D5DbDB] rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Week {weekNum}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const allDaysForWeek = [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ].map((day) => `Week${weekNum}-${day}`);
                          const hasAllDays = allDaysForWeek.every((dayKey) =>
                            formData.selectedDays.includes(dayKey)
                          );

                          setFormData((prev) => ({
                            ...prev,
                            selectedDays: hasAllDays
                              ? prev.selectedDays.filter(
                                  (d) => !allDaysForWeek.includes(d)
                                )
                              : [
                                  ...prev.selectedDays,
                                  ...allDaysForWeek.filter(
                                    (d) => !prev.selectedDays.includes(d)
                                  ),
                                ],
                          }));
                        }}
                        disabled={isSubmitting}
                        className={`
                          px-2 py-1 text-xs rounded transition-all duration-200
                          ${
                            [
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                              "Sun",
                            ].every((day) =>
                              formData.selectedDays.includes(
                                `Week${weekNum}-${day}`
                              )
                            )
                              ? "bg-[#C72030] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-[#C72030] hover:text-white"
                          }
                        `}
                      >
                        All
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {[
                        { short: "Mon", full: "Monday" },
                        { short: "Tue", full: "Tuesday" },
                        { short: "Wed", full: "Wednesday" },
                        { short: "Thu", full: "Thursday" },
                        { short: "Fri", full: "Friday" },
                        { short: "Sat", full: "Saturday" },
                        { short: "Sun", full: "Sunday" },
                      ].map((day) => {
                        const isSelected = formData.selectedDays.includes(
                          `Week${weekNum}-${day.short}`
                        );
                        return (
                          <button
                            key={day.short}
                            type="button"
                            onClick={() =>
                              handleRecurringDayToggle(
                                day.short,
                                `Week${weekNum}`
                              )
                            }
                            disabled={isSubmitting}
                            className={`
                              w-full h-8 rounded text-xs font-medium transition-all duration-200
                              ${
                                isSelected
                                  ? "bg-[#C72030] text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-[#C72030] hover:text-white"
                              }
                            `}
                            title={`${day.full} - Week ${weekNum}`}
                          >
                            {day.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="text-xs text-[#1a1a1a] opacity-70">
                  {formData.selectedDays.length > 0
                    ? `${formData.selectedDays.length} days selected across all weeks`
                    : "No days selected yet"}
                </div>
              </div>
            )}

            {errors.selectedDays && (
              <p className="text-red-500 text-sm mt-1">
                {formData.dayType === "Recurring"
                  ? "Please select at least one working day"
                  : "Please select at least one frequency option"}
              </p>
            )}
          </div>
        </Section>

        {/* Location & Department Section */}
        <Section
          title="Location & Department"
          icon={<MapPin className="w-4 h-4" />}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <TextField
                label="Location *"
                value={formData.location}
                disabled
                placeholder="Current site location"
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
                  startAdornment: (
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                  ),
                }}
              />
            </div>

            <div className="relative">
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ "& .MuiInputBase-root": fieldStyles }}
              >
                <InputLabel shrink>Department *</InputLabel>
                <MuiSelect
                  multiple
                  value={formData.departments}
                  onChange={(e) =>
                    handleInputChange("departments", e.target.value as number[])
                  }
                  input={<OutlinedInput notched label="Department *" />}
                  renderValue={(selected) => {
                    const selectedArray = selected as number[];
                    if (selectedArray.length === 0) return "";
                    if (selectedArray.length <= 2) {
                      return (
                        <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 0.5, overflow: "hidden" }}>
                          {selectedArray.map((value) => {
                            const dept = departments.find((d) => d.id === value);
                            return (
                              <Chip
                                key={value}
                                label={dept?.department_name || `ID: ${value}`}
                                size="small"
                                sx={{ 
                                  backgroundColor: "#C72030", 
                                  color: "white",
                                  maxWidth: "150px",
                                  "& .MuiChip-label": {
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                  }
                                }}
                              />
                            );
                          })}
                        </Box>
                      );
                    }
                    return (
                      <Chip
                        label={`${selectedArray.length} departments selected`}
                        size="small"
                        sx={{ backgroundColor: "#C72030", color: "white" }}
                      />
                    );
                  }}
                  displayEmpty
                  disabled={loadingDepartments || isSubmitting}
                  error={errors.departments}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        overflow: 'auto',
                      },
                    },
                  }}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      <Checkbox
                        checked={formData.departments.indexOf(dept.id!) > -1}
                        sx={{
                          color: "#D5DbDB",
                          "&.Mui-checked": {
                            color: "#C72030",
                          },
                        }}
                      />
                      <ListItemText primary={dept.department_name} />
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loadingDepartments && (
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <CircularProgress size={16} />
                  </div>
                )}
              </FormControl>
              {errors.departments && (
                <p className="text-red-500 text-sm mt-1">
                  Please select at least one department
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* Shift Section */}
        <Section title="Shift & Employees" icon={<Clock className="w-4 h-4" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ "& .MuiInputBase-root": fieldStyles }}
              >
                <InputLabel shrink>Shift *</InputLabel>
                <MuiSelect
                  value={formData.shift || ""}
                  onChange={(e) =>
                    handleInputChange("shift", Number(e.target.value))
                  }
                  label="Shift *"
                  notched
                  displayEmpty
                  disabled={loadingShifts || isSubmitting}
                  error={errors.shift}
                >
                  <MenuItem value="">Select Shift</MenuItem>
                  {shifts.map((shift) => (
                    <MenuItem key={shift.id} value={shift.id}>
                      {shift.timings} ({shift.total_hour}h)
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loadingShifts && (
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <CircularProgress size={16} />
                  </div>
                )}
              </FormControl>
              {errors.shift && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a shift
                </p>
              )}
            </div>
            {formData.departments.length > 0 && (
              <div className="relative">
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>List Of Selected Employees *</InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.selectedEmployees}
                    onChange={(e) =>
                      handleInputChange(
                        "selectedEmployees",
                        e.target.value as number[]
                      )
                    }
                    input={
                      <OutlinedInput
                        notched
                        label="List Of Selected Employees *"
                      />
                    }
                    renderValue={(selected) => {
                      const selectedArray = selected as number[];
                      if (selectedArray.length === 0) return "";
                      if (selectedArray.length <= 2) {
                        return (
                          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 0.5, overflow: "hidden" }}>
                            {selectedArray.map((value) => {
                              const user = filteredFMUsers.find(
                                (u) => u.id === value
                              );
                              return (
                                <Chip
                                  key={value}
                                  label={user?.name || `User ${value}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: "#C72030",
                                    color: "white",
                                    maxWidth: "150px",
                                    "& .MuiChip-label": {
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap"
                                    }
                                  }}
                                />
                              );
                            })}
                          </Box>
                        );
                      }
                      return (
                        <Chip
                          label={`${selectedArray.length} employees selected`}
                          size="small"
                          sx={{ backgroundColor: "#C72030", color: "white" }}
                        />
                      );
                    }}
                    displayEmpty
                    disabled={
                      loadingFilteredFMUsers ||
                      isSubmitting ||
                      formData.departments.length === 0
                    }
                    error={errors.selectedEmployees}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          overflow: 'auto',
                        },
                      },
                    }}
                  >
                    {filteredFMUsers.length > 0 ? (
                      filteredFMUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Checkbox
                            checked={
                              formData.selectedEmployees.indexOf(user.id) > -1
                            }
                            sx={{
                              color: "#D5DbDB",
                              "&.Mui-checked": {
                                color: "#C72030",
                              },
                            }}
                          />
                          <ListItemText
                            primary={user.name || "No name available"}
                            secondary={user.email}
                          />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <ListItemText
                          primary="No employees found for selected departments"
                          sx={{ fontStyle: "italic", color: "#9ca3af" }}
                        />
                      </MenuItem>
                    )}
                  </MuiSelect>
                  {loadingFilteredFMUsers && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <CircularProgress size={16} />
                    </div>
                  )}
                </FormControl>
                {errors.selectedEmployees && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select at least one employee
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Showing employees from selected departments:{" "}
                  {departments
                    .filter((dept) => formData.departments.includes(dept.id!))
                    .map((dept) => dept.department_name)
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        </Section>

        {/* Employees Section - Only show if departments are selected */}

        {/* Show message if no departments selected */}
        {formData.departments.length === 0 && (
          <Section title="Employees" icon={<Users className="w-4 h-4" />}>
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">
                Select Departments First
              </p>
              <p className="text-gray-400 text-sm">
                Please select at least one department to view and select
                employees
              </p>
            </div>
          </Section>
        )}

        <Section title="Select Period" icon={<Calendar className="w-4 h-4" />}>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-4 block">
                Roster Period *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Start Date
                  </Label>
                  <input
                    type="date"
                    value={period.startDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setPeriod(prev => ({ ...prev, startDate: newDate }));
                    }}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-[#e1e5e9] rounded-md bg-[#fafbfc] 
                             focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-gray-900 text-sm"
                    style={{ height: '45px' }}
                  />
                </div>

                {/* End Date */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    End Date
                  </Label>
                  <input
                    type="date"
                    value={period.endDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setPeriod(prev => ({ ...prev, endDate: newDate }));
                    }}
                    disabled={isSubmitting}
                    min={period.startDate.toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-[#e1e5e9] rounded-md bg-[#fafbfc] 
                             focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-gray-900 text-sm"
                    style={{ height: '45px' }}
                  />
                </div>
              </div>

              {/* Date Range Display */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Selected Period:</span>
                  <span>
                    {period.startDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="mx-1">→</span>
                  <span>
                    {period.endDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="ml-2 text-blue-600">
                    ({Math.ceil((period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24))} days)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-3 justify-center pt-2">
        <Button
          variant="destructive"
          className="px-8"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Template
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="px-8"
          onClick={() => navigate("/roster")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
