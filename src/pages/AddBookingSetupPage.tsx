import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Armchair, ArrowLeft, BookKey, CalendarDays, ChevronDown, ChevronUp, CreditCard, DollarSign, FileCog, FileImage, Image, LampFloor, MessageSquareX, NotepadText, ReceiptText, Settings, Share, Share2, Tv, Upload, User, X } from "lucide-react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Radio,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";

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

export const AddBookingSetupPage = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const coverImageRef = useRef(null);
  const bookingImageRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [selectedBookingFiles, setSelectedBookingFiles] = useState<File[]>([]);

  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    facilityName: "",
    isBookable: true,
    isRequest: false,
    active: "1",
    department: "",
    appKey: "",
    postpaid: false,
    prepaid: false,
    payOnFacility: false,
    complimentary: false,
    gstPercentage: "",
    sgstPercentage: "",
    perSlotCharge: "",
    bookingAllowedBefore: { day: "", hour: "", minute: "" },
    advanceBooking: { day: "", hour: "", minute: "" },
    canCancelBefore: { day: "", hour: "", minute: "" },
    allowMultipleSlots: false,
    maximumSlots: "",
    facilityBookedTimes: "",
    description: "",
    termsConditions: "",
    cancellationText: "",
    amenities: {
      tv: false,
      whiteboard: false,
      casting: false,
      smartPenForTV: false,
      wirelessCharging: false,
      meetingRoomInventory: false,
    },
    seaterInfo: "Select a seater",
    floorInfo: "Select a floor",
    sharedContentInfo: "",
    slots: [
      {
        startTime: { hour: "00", minute: "00" },
        breakTimeStart: { hour: "00", minute: "00" },
        breakTimeEnd: { hour: "00", minute: "00" },
        endTime: { hour: "00", minute: "00" },
        concurrentSlots: "",
        slotBy: 15,
        wrapTime: "",
      },
    ],
    chargeSetup: {
      member: { selected: false, adult: "", child: "" },
      guest: { selected: false, adult: "", child: "" },
      minimumPersonAllowed: "1",
      maximumPersonAllowed: "1",
      gst: "0.0",
    },
    blockDays: {
      startDate: "",
      endDate: "",
      dayType: "entireDay",
      blockReason: "",
    },
  });

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [cancellationRules, setCancellationRules] = useState([
    {
      description:
        "If user cancels the booking selected hours/days prior to schedule, a percentage of the amount will be deducted",
      time: { type: "Hr", value: "00", day: "0" },
      deduction: "",
    },
    {
      description:
        "If user cancels the booking selected hours/days prior to schedule, a percentage of the amount will be deducted",
      time: { type: "Hr", value: "00", day: "0" },
      deduction: "",
    },
    {
      description:
        "If user cancels the booking selected hours/days prior to schedule, a percentage of the amount will be deducted",
      time: { type: "Hr", value: "00", day: "0" },
      deduction: "",
    },
  ]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFile(files);
  };

  const handleBookingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedBookingFiles(files);
  };

  const removeCoverImage = (indexToRemove) => {
    setSelectedFile(selectedFile.filter((_, index) => index !== indexToRemove));
  };

  const removeBookingImage = (indexToRemove) => {
    setSelectedBookingFiles(
      selectedBookingFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const triggerFileSelect = () => {
    coverImageRef.current?.click();
  };

  const triggerBookingImgSelect = () => {
    bookingImageRef.current?.click();
  };

  const handleAdditionalOpen = () => {
    setAdditionalOpen(!additionalOpen);
  };

  const fetchDepartments = async () => {
    if (departments.length > 0) return; // Don't fetch if already loaded

    setLoadingDepartments(true);
    try {
      const response = await fetch(
        `https://${baseUrl}/pms/departments.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      // Handle different response structures
      let departmentsList = [];
      if (Array.isArray(data)) {
        departmentsList = data;
      } else if (data && Array.isArray(data.departments)) {
        departmentsList = data.departments;
      } else if (data && data.length !== undefined) {
        // Handle case where data might be array-like
        departmentsList = Array.from(data);
      }

      setDepartments(departmentsList);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const validateForm = () => {
    if (!formData.facilityName) {
      toast.error("Please enter Facility Name");
      return false;
    } else if (!formData.facilityBookedTimes) {
      toast.error("Please enter how many times facility can be booked per day");
      return false;
    } else if (!formData.termsConditions) {
      toast.error("Please enter Terms and Conditions");
      return false;
    } else if (!formData.cancellationText) {
      toast.error("Please enter Cancellation Policies");
      return false;
    }

    for (let index = 0; index < formData.slots.length; index++) {
      const slot = formData.slots[index];

      const startHour = parseInt(slot.startTime.hour);
      const breakStartHour = parseInt(slot.breakTimeStart.hour);
      const breakEndHour = parseInt(slot.breakTimeEnd.hour);
      const endHour = parseInt(slot.endTime.hour);

      if (slot.startTime.hour !== "00") {
        if (
          slot.breakTimeStart.hour === "00" ||
          slot.breakTimeEnd.hour === "00" ||
          slot.endTime.hour === "00"
        ) {
          toast.error(
            `Slot ${index + 1}: All subsequent time fields must be selected when Start Time is set`
          );
          return false;
        }

        if (breakStartHour < startHour) {
          toast.error(
            `Slot ${index + 1}: Break Time Start hour must be greater than or equal to Start Time hour`
          );
          return false;
        }
        if (breakEndHour < startHour) {
          toast.error(
            `Slot ${index + 1}: Break Time End hour must be greater than or equal to Start Time hour`
          );
          return false;
        }
        if (endHour < startHour) {
          toast.error(
            `Slot ${index + 1}: End Time hour must be greater than or equal to Start Time hour`
          );
          return false;
        }
      }

      if (slot.breakTimeStart.hour !== "00") {
        if (
          slot.breakTimeEnd.hour === "00" ||
          slot.endTime.hour === "00"
        ) {
          toast.error(
            `Slot ${index + 1}: Break Time End and End Time must be selected when Break Time Start is set`
          );
          return false;
        }

        if (breakEndHour < breakStartHour) {
          toast.error(
            `Slot ${index + 1}: Break Time End hour must be greater than or equal to Break Time Start hour`
          );
          return false;
        }
        if (endHour < breakStartHour) {
          toast.error(
            `Slot ${index + 1}: End Time hour must be greater than or equal to Break Time Start hour`
          );
          return false;
        }
      }

      if (slot.breakTimeEnd.hour !== "00") {
        if (slot.endTime.hour === "00") {
          toast.error(
            `Slot ${index + 1}: End Time must be selected when Break Time End is set`
          );
          return false;
        }

        if (endHour < breakEndHour) {
          toast.error(
            `Slot ${index + 1}: End Time hour must be greater than or equal to Break Time End hour`
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Basic Facility Info
      formDataToSend.append(
        "facility_setup[fac_type]",
        formData.isBookable ? "bookable" : "request"
      );
      formDataToSend.append("facility_setup[fac_name]", formData.facilityName);
      formDataToSend.append(
        "facility_setup[active]",
        formData.active
      );

      // Find department ID from selected department name
      if (formData.department) {
        formDataToSend.append(
          "facility_setup[department_id]",
          formData.department
        );
      }

      formDataToSend.append("facility_setup[app_key]", formData.appKey);
      formDataToSend.append(
        "facility_setup[postpaid]",
        formData.postpaid ? "1" : "0"
      );
      formDataToSend.append(
        "facility_setup[prepaid]",
        formData.prepaid ? "1" : "0"
      );
      formDataToSend.append(
        "facility_setup[pay_on_facility]",
        formData.payOnFacility ? "1" : "0"
      );
      formDataToSend.append(
        "facility_setup[complementary]",
        formData.complimentary ? "1" : "0"
      );
      formDataToSend.append("facility_setup[gst]", formData.gstPercentage);
      formDataToSend.append("facility_setup[sgst]", formData.sgstPercentage);
      formDataToSend.append(
        "facility_setup[facility_charge_attributes][per_slot_charge]",
        formData.perSlotCharge
      );

      // Charge Setup - Member charges
      if (formData.chargeSetup.member.selected) {
        formDataToSend.append(
          "facility_setup[facility_charge_attributes][adult_member_charge]",
          formData.chargeSetup.member.adult || "0"
        );
        formDataToSend.append(
          "facility_setup[facility_charge_attributes][child_member_charge]",
          formData.chargeSetup.member.child || "0"
        );
      }

      // Charge Setup - Guest charges
      if (formData.chargeSetup.guest.selected) {
        formDataToSend.append(
          "facility_setup[facility_charge_attributes][adult_guest_charge]",
          formData.chargeSetup.guest.adult || "0"
        );
        formDataToSend.append(
          "facility_setup[facility_charge_attributes][child_guest_charge]",
          formData.chargeSetup.guest.child || "0"
        );
      }

      // Charge Setup - Person limits and GST
      formDataToSend.append(
        "facility_setup[min_people]",
        formData.chargeSetup.minimumPersonAllowed || "1"
      );
      formDataToSend.append(
        "facility_setup[max_people]",
        formData.chargeSetup.maximumPersonAllowed || "1"
      );

      // Block Days - Date range
      if (formData.blockDays.startDate) {
        formDataToSend.append(
          "facility_setup[facility_blockings_attributes][0][ondate]",
          formData.blockDays.startDate
        );
      }

      // if (formData.blockDays.endDate) {
      //   formDataToSend.append(
      //     "facility_blockings_attributes[0][end_date]",
      //     formData.blockDays.endDate
      //   );
      // }

      // Block Days - Type (entire day or selected slots)
      // formDataToSend.append(
      //   "facility_blockings_attributes[0][block_type]",
      //   formData.blockDays.dayType === "entireDay" ? "entire_day" : "selected_slots"
      // );

      // Block Days - Reason
      if (formData.blockDays.blockReason) {
        formDataToSend.append(
          "facility_setup[facility_blockings_attributes][0][reason]",
          formData.blockDays.blockReason
        );
      }

      // Default values for facility blockings
      formDataToSend.append(
        "facility_setup[facility_blockings_attributes][0][order_allowed]",
        "false"
      );

      formDataToSend.append(
        "facility_setup[facility_blockings_attributes][0][booking_allowed]",
        "false"
      );

      formDataToSend.append(
        "facility_setup[description]",
        formData.termsConditions || ""
      );
      formDataToSend.append(
        "facility_setup[terms]",
        formData.termsConditions || ""
      );
      formDataToSend.append(
        "facility_setup[cancellation_policy]",
        formData.cancellationText || ""
      );
      formDataToSend.append(
        "facility_setup[cutoff_day]",
        cancellationRules[0].time.day
      );
      formDataToSend.append(
        "facility_setup[cutoff_hr]",
        cancellationRules[0].time.type
      );
      formDataToSend.append(
        "facility_setup[cutoff_min]",
        cancellationRules[0].time.value
      );
      formDataToSend.append(
        "facility_setup[return_percentage]",
        cancellationRules[0].deduction
      );
      formDataToSend.append(
        "facility_setup[cutoff_second_day]",
        cancellationRules[1].time.day
      );
      formDataToSend.append(
        "facility_setup[cutoff_second_hr]",
        cancellationRules[1].time.type
      );
      formDataToSend.append(
        "facility_setup[cutoff_second_min]",
        cancellationRules[1].time.value
      );
      formDataToSend.append(
        "facility_setup[return_percentage_second]",
        cancellationRules[1].deduction
      );
      formDataToSend.append(
        "facility_setup[cutoff_third_day]",
        cancellationRules[2].time.day
      );
      formDataToSend.append(
        "facility_setup[cutoff_third_hr]",
        cancellationRules[2].time.type
      );
      formDataToSend.append(
        "facility_setup[cutoff_third_min]",
        cancellationRules[2].time.value
      );
      formDataToSend.append(
        "facility_setup[return_percentage_third]",
        cancellationRules[2].deduction
      );
      formDataToSend.append("facility_setup[book_by]", "slot");
      formDataToSend.append(
        "facility_setup[create_by]",
        JSON.parse(localStorage.getItem("user")).id
      );

      selectedFile.forEach((file) => {
        formDataToSend.append(`cover_image`, file);
      });

      selectedBookingFiles.forEach((file) => {
        formDataToSend.append(`attachments[]`, file);
      });

      // Generic Tags (Amenities)
      const amenities = [];
      if (formData.amenities.tv) amenities.push("TV");
      if (formData.amenities.whiteboard) amenities.push("Whiteboard");
      if (formData.amenities.casting) amenities.push("Casting");
      if (formData.amenities.smartPenForTV) amenities.push("Smart Pen for TV");
      if (formData.amenities.wirelessCharging)
        amenities.push("Wireless Charging");
      if (formData.amenities.meetingRoomInventory)
        amenities.push("Meeting Room Inventory");

      amenities.forEach((name, index) => {
        formDataToSend.append(
          `facility_setup[generic_tags_attributes][${index}][tag_type]`,
          "amenity_things"
        );
        formDataToSend.append(
          `facility_setup[generic_tags_attributes][${index}][category_name]`,
          name
        );
        formDataToSend.append(
          `facility_setup[generic_tags_attributes][${index}][_destroy]`,
          "0"
        );
        formDataToSend.append(
          `facility_setup[generic_tags_attributes][${index}][selected]`,
          "1"
        );
      });

      // Facility Slots
      formData.slots.forEach((slot, index) => {
        formDataToSend.append(
          `facility_slots[][slot_no]`,
          (index + 1).toString()
        );
        formDataToSend.append(`facility_slots[][dayofweek]`, "");
        formDataToSend.append(
          `facility_slots[][start_hour]`,
          slot.startTime.hour
        );
        formDataToSend.append(
          `facility_slots[][start_min]`,
          slot.startTime.minute
        );
        formDataToSend.append(
          `facility_slots[][break_start_hour]`,
          slot.breakTimeStart.hour
        );
        formDataToSend.append(
          `facility_slots[][break_start_min]`,
          slot.breakTimeStart.minute
        );
        formDataToSend.append(
          `facility_slots[][break_end_hour]`,
          slot.breakTimeEnd.hour
        );
        formDataToSend.append(
          `facility_slots[][break_end_min]`,
          slot.breakTimeEnd.minute
        );
        formDataToSend.append(`facility_slots[][end_hour]`, slot.endTime.hour);
        formDataToSend.append(`facility_slots[][end_min]`, slot.endTime.minute);
        formDataToSend.append(
          `facility_slots[][max_bookings]`,
          slot.concurrentSlots || "1"
        );
        formDataToSend.append(
          `facility_slots[][breakminutes]`,
          slot.slotBy.toString()
        );
        formDataToSend.append(
          `facility_slots[][wrap_time]`,
          slot.wrapTime || "5"
        );
      });

      formDataToSend.append(
        "facility_setup[multi_slot]",
        formData.allowMultipleSlots ? "1" : "0"
      )
      formDataToSend.append(
        "facility_setup[max_slots]",
        formData.maximumSlots
      )
      formDataToSend.append(
        "facility_setup[booking_limit]", formData.facilityBookedTimes
      )

      // Booking Window Configs
      formDataToSend.append(
        "book_before_day",
        formData.bookingAllowedBefore.day
      );
      formDataToSend.append(
        "book_before_hour",
        formData.bookingAllowedBefore.hour
      );
      formDataToSend.append(
        "book_before_min",
        formData.bookingAllowedBefore.minute
      );
      formDataToSend.append("advance_booking_day", formData.advanceBooking.day);
      formDataToSend.append(
        "advance_booking_hour",
        formData.advanceBooking.hour
      );
      formDataToSend.append(
        "advance_booking_min",
        formData.advanceBooking.minute
      );
      formDataToSend.append("cancel_day", formData.canCancelBefore.day);
      formDataToSend.append("cancel_hour", formData.canCancelBefore.hour);
      formDataToSend.append("cancel_min", formData.canCancelBefore.minute);

      // Extra Info
      formDataToSend.append(
        "seater_info",
        formData.seaterInfo !== "Select a seater" ? formData.seaterInfo : ""
      );
      formDataToSend.append(
        "location_info",
        formData.floorInfo !== "Select a floor" ? formData.floorInfo : ""
      );
      formDataToSend.append(
        "shared_content_info",
        formData.sharedContentInfo || ""
      );

      const response = await fetch(
        `https://${baseUrl}/pms/admin/facility_setups.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        toast.success("Booking setup saved successfully");
        navigate(-1);
      } else {
        console.error("Failed to save booking setup:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving booking setup:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const addSlot = () => {
    const newSlot = {
      startTime: { hour: "00", minute: "00" },
      breakTimeStart: { hour: "00", minute: "00" },
      breakTimeEnd: { hour: "00", minute: "00" },
      endTime: { hour: "00", minute: "00" },
      concurrentSlots: "",
      slotBy: 15,
      wrapTime: "",
    };
    setFormData({ ...formData, slots: [...formData.slots, newSlot] });
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="p-6 bg-white">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              <p className="text-gray-600 text-sm">Back</p>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">BASIC INFo</h3>
            </div>

            <div className="space-y-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextField
                  label="Facility Name"
                  placeholder="Enter Facility Name"
                  value={formData.facilityName}
                  onChange={(e) =>
                    setFormData({ ...formData, facilityName: e.target.value })
                  }
                  variant="outlined"
                  required
                  InputLabelProps={{
                    classes: {
                      asterisk: "text-red-500", // Tailwind class for red color
                    },
                    shrink: true,
                  }}
                />
                <FormControl>
                  <InputLabel className="bg-[#F6F7F7]">Department</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    onFocus={fetchDepartments}
                    label="Department"
                    displayEmpty
                  >
                    <MenuItem value="">
                      {loadingDepartments ? "Loading..." : "All"}
                    </MenuItem>
                    {Array.isArray(departments) &&
                      departments.map((dept, index) => (
                        <MenuItem key={index} value={dept.id}>
                          {dept.department_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>

              <div className="flex gap-6 px-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="bookable"
                    name="type"
                    checked={formData.isBookable}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        isBookable: true,
                        isRequest: false,
                      })
                    }
                    className="text-blue-600"
                  />
                  <label htmlFor="bookable">Bookable</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="request"
                    name="type"
                    checked={formData.isRequest}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        isBookable: false,
                        isRequest: true,
                      })
                    }
                    className="text-blue-600"
                  />
                  <label htmlFor="request">Request</label>
                </div>
              </div>
            </div>
          </div>

          {/* Charge Setup Card */}
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CHARGE SETUP</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Member Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Adult</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Child</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.chargeSetup.member.selected}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              chargeSetup: {
                                ...formData.chargeSetup,
                                member: {
                                  ...formData.chargeSetup.member,
                                  selected: !!checked,
                                },
                              },
                            })
                          }
                        />
                        <span>Member</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Checkbox
                          checked={!!formData.chargeSetup.member.adult}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              setFormData({
                                ...formData,
                                chargeSetup: {
                                  ...formData.chargeSetup,
                                  member: {
                                    ...formData.chargeSetup.member,
                                    adult: "",
                                  },
                                },
                              });
                            }
                          }}
                        />
                        <TextField
                          size="small"
                          variant="outlined"
                          value={formData.chargeSetup.member.adult}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chargeSetup: {
                                ...formData.chargeSetup,
                                member: {
                                  ...formData.chargeSetup.member,
                                  adult: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full max-w-[200px]"
                        />
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Checkbox
                          checked={!!formData.chargeSetup.member.child}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              chargeSetup: {
                                ...formData.chargeSetup,
                                member: {
                                  ...formData.chargeSetup.member,
                                  child: checked ? formData.chargeSetup.member.child || "" : "",
                                },
                              },
                            });
                          }}
                        />
                        <TextField
                          size="small"
                          variant="outlined"
                          value={formData.chargeSetup.member.child}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chargeSetup: {
                                ...formData.chargeSetup,
                                member: {
                                  ...formData.chargeSetup.member,
                                  child: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full max-w-[200px]"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.chargeSetup.guest.selected}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              chargeSetup: {
                                ...formData.chargeSetup,
                                guest: {
                                  ...formData.chargeSetup.guest,
                                  selected: !!checked,
                                },
                              },
                            })
                          }
                        />
                        <span>Guest</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Checkbox
                          checked={!!formData.chargeSetup.guest.adult}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              setFormData({
                                ...formData,
                                chargeSetup: {
                                  ...formData.chargeSetup,
                                  guest: {
                                    ...formData.chargeSetup.guest,
                                    adult: "",
                                  },
                                },
                              });
                            }
                          }}
                        />
                        <TextField
                          size="small"
                          variant="outlined"
                          value={formData.chargeSetup.guest.adult}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chargeSetup: {
                                ...formData.chargeSetup,
                                guest: {
                                  ...formData.chargeSetup.guest,
                                  adult: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full max-w-[200px]"
                        />
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Checkbox
                          checked={!!formData.chargeSetup.guest.child}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              chargeSetup: {
                                ...formData.chargeSetup,
                                guest: {
                                  ...formData.chargeSetup.guest,
                                  child: checked ? formData.chargeSetup.guest.child || "" : "",
                                },
                              },
                            });
                          }}
                        />
                        <TextField
                          size="small"
                          variant="outlined"
                          value={formData.chargeSetup.guest.child}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chargeSetup: {
                                ...formData.chargeSetup,
                                guest: {
                                  ...formData.chargeSetup.guest,
                                  child: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full max-w-[200px]"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold whitespace-nowrap">Minimum Person Allowed</label>
                <TextField
                  size="small"
                  variant="outlined"
                  value={formData.chargeSetup.minimumPersonAllowed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chargeSetup: {
                        ...formData.chargeSetup,
                        minimumPersonAllowed: e.target.value,
                      },
                    })
                  }
                  className="w-32"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold whitespace-nowrap">Maximum Person Allowed</label>
                <TextField
                  size="small"
                  variant="outlined"
                  value={formData.chargeSetup.maximumPersonAllowed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chargeSetup: {
                        ...formData.chargeSetup,
                        maximumPersonAllowed: e.target.value,
                      },
                    })
                  }
                  className="w-32"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <CalendarDays className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CONFIGURE SLOT</h3>
            </div>

            <div>
              <Button
                onClick={addSlot}
                className="bg-purple-600 hover:bg-purple-700 mb-4"
              >
                Add
              </Button>

              {/* Slot Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-sm font-medium text-gray-600">
                <div>Start Time</div>
                <div>Break Time Start</div>
                <div>Break Time End</div>
                <div>End Time</div>
                <div>Concurrent Slots</div>
                <div>Slot by</div>
                <div>Wrap Time</div>
              </div>

              {/* Slot Rows */}
              {formData.slots.map((slot, index) => (
                <div key={index} className="grid grid-cols-7 gap-2 mb-2">
                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select
                        value={slot.startTime.hour}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].startTime.hour = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select
                        value={slot.startTime.minute}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].startTime.minute = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select
                        value={slot.breakTimeStart.hour}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].breakTimeStart.hour = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select
                        value={slot.breakTimeStart.minute}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].breakTimeStart.minute =
                            e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select
                        value={slot.breakTimeEnd.hour}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].breakTimeEnd.hour = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select
                        value={slot.breakTimeEnd.minute}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].breakTimeEnd.minute = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select
                        value={slot.endTime.hour}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].endTime.hour = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select
                        value={slot.endTime.minute}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].endTime.minute = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <TextField
                    size="small"
                    value={slot.concurrentSlots}
                    onChange={(e) => {
                      const newSlots = [...formData.slots];
                      newSlots[index].concurrentSlots = e.target.value;
                      setFormData({ ...formData, slots: newSlots });
                    }}
                    variant="outlined"
                  />

                  <FormControl size="small">
                    <Select
                      value={slot.slotBy}
                      onChange={(e) => {
                        const newSlots = [...formData.slots];
                        newSlots[index].slotBy = e.target.value;
                        setFormData({ ...formData, slots: newSlots });
                      }}
                    >
                      <MenuItem value={15}>15 Minutes</MenuItem>
                      <MenuItem value={30}>Half hour</MenuItem>
                      <MenuItem value={45}>45 Minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={90}>1 and a half hours</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    value={slot.wrapTime}
                    onChange={(e) => {
                      const newSlots = [...formData.slots];
                      newSlots[index].wrapTime = e.target.value;
                      setFormData({ ...formData, slots: newSlots });
                    }}
                    variant="outlined"
                  />
                </div>
              ))}

              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Booking Allowed before :
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    (Enter Time: DD Days, HH Hours, MM Minutes)
                  </p>
                  <div className="flex gap-2 items-center">
                    <TextField
                      placeholder="Day"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.bookingAllowedBefore.day}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bookingAllowedBefore: {
                            ...formData.bookingAllowedBefore,
                            day: e.target.value,
                          },
                        })
                      }
                    />
                    <span>d</span>
                    <TextField
                      placeholder="Hour"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.bookingAllowedBefore.hour}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bookingAllowedBefore: {
                            ...formData.bookingAllowedBefore,
                            hour: e.target.value,
                          },
                        })
                      }
                    />
                    <span>h</span>
                    <TextField
                      placeholder="Mins"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.bookingAllowedBefore.minute}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bookingAllowedBefore: {
                            ...formData.bookingAllowedBefore,
                            minute: e.target.value,
                          },
                        })
                      }
                    />
                    <span>m</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Advance Booking :
                  </label>
                  <div className="flex gap-2 items-center">
                    <TextField
                      placeholder="Day"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.advanceBooking.day}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          advanceBooking: {
                            ...formData.advanceBooking,
                            day: e.target.value,
                          },
                        })
                      }
                    />
                    <span>d</span>
                    <TextField
                      placeholder="Hour"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.advanceBooking.hour}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          advanceBooking: {
                            ...formData.advanceBooking,
                            hour: e.target.value,
                          },
                        })
                      }
                    />
                    <span>h</span>
                    <TextField
                      placeholder="Mins"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.advanceBooking.minute}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          advanceBooking: {
                            ...formData.advanceBooking,
                            minute: e.target.value,
                          },
                        })
                      }
                    />
                    <span>m</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Can Cancel Before Schedule :
                  </label>
                  <div className="flex gap-2 items-center">
                    <TextField
                      placeholder="Day"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.canCancelBefore.day}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          canCancelBefore: {
                            ...formData.canCancelBefore,
                            day: e.target.value,
                          },
                        })
                      }
                    />
                    <span>d</span>
                    <TextField
                      placeholder="Hour"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.canCancelBefore.hour}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          canCancelBefore: {
                            ...formData.canCancelBefore,
                            hour: e.target.value,
                          },
                        })
                      }
                    />
                    <span>h</span>
                    <TextField
                      placeholder="Mins"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.canCancelBefore.minute}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          canCancelBefore: {
                            ...formData.canCancelBefore,
                            minute: e.target.value,
                          },
                        })
                      }
                    />
                    <span>m</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex items-center justify-between mt-4  ">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowMultipleSlots"
                      checked={formData.allowMultipleSlots}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          allowMultipleSlots: !!checked,
                        })
                      }
                    />
                    <label htmlFor="allowMultipleSlots">
                      Allow Multiple Slots
                    </label>
                  </div>

                  {formData.allowMultipleSlots && (
                    <div>
                      <TextField
                        label="Maximum no. of slots"
                        placeholder="Maximum no. of slots"
                        value={formData.maximumSlots}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maximumSlots: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                        style={{ width: "200px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Facility can be booked</span>
                  <TextField
                    placeholder=""
                    value={formData.facilityBookedTimes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        facilityBookedTimes: e.target.value,
                      })
                    }
                    variant="outlined"
                    size="small"
                    style={{ width: "80px" }}
                  />
                  <span>times per day by User</span>
                </div>
              </div>
            </div>
          </div>

          {/* Block Days Section */}
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <CalendarDays className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Block Days</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                label="Date"
                type="date"
                value={formData.blockDays.startDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    blockDays: {
                      ...formData.blockDays,
                      startDate: e.target.value,
                    },
                  })
                }
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/* <TextField
                label="End Date"
                type="date"
                value={formData.blockDays.endDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    blockDays: {
                      ...formData.blockDays,
                      endDate: e.target.value,
                    },
                  })
                }
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}
            </div>

            <div className="flex gap-6 px-1">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="entireDay"
                  name="dayType"
                  checked={formData.blockDays.dayType === "entireDay"}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      blockDays: {
                        ...formData.blockDays,
                        dayType: "entireDay",
                      },
                    })
                  }
                  className="text-blue-600"
                />
                <label htmlFor="entireDay">Entire Day</label>
              </div>
              {/* <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="selectedSlots"
                  name="dayType"
                  checked={formData.blockDays.dayType === "selectedSlots"}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      blockDays: {
                        ...formData.blockDays,
                        dayType: "selectedSlots",
                      },
                    })
                  }
                  className="text-blue-600"
                />
                <label htmlFor="selectedSlots">Selected Slots</label>
              </div> */}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Block Reason</label>
              <Textarea
                placeholder="Please mention block reason"
                value={formData.blockDays.blockReason}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    blockDays: {
                      ...formData.blockDays,
                      blockReason: e.target.value,
                    },
                  })
                }
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CONFIGURE PAYMENT</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* <div className="flex items-center space-x-2">
                  <Checkbox
                    id="postpaid"
                    checked={formData.postpaid}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, postpaid: !!checked })
                    }
                  />
                  <label htmlFor="postpaid">Postpaid</label>
                </div> */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prepaid"
                    checked={formData.prepaid}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, prepaid: !!checked })
                    }
                  />
                  <label htmlFor="prepaid">Prepaid</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payOnFacility"
                    checked={formData.payOnFacility}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, payOnFacility: !!checked })
                    }
                  />
                  <label htmlFor="payOnFacility">Pay on Facility</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="complimentary"
                    checked={formData.complimentary}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, complimentary: !!checked })
                    }
                  />
                  <label htmlFor="complimentary">Complimentary</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextField
                  label="SGST(%)"
                  value={formData.sgstPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, sgstPercentage: e.target.value })
                  }
                  variant="outlined"
                />
                <TextField
                  label="GST(%)"
                  value={formData.gstPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, gstPercentage: e.target.value })
                  }
                  variant="outlined"
                />
              </div>

              <TextField
                label="Per Slot Charge"
                value={formData.perSlotCharge}
                onChange={(e) =>
                  setFormData({ ...formData, perSlotCharge: e.target.value })
                }
                variant="outlined"
              />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="bg-white rounded-lg border-2 p-6 space-y-6 w-full">
              <div className="flex items-center gap-3">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                  <FileImage className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">COVER IMAGE</h3>
              </div>

              <div className="p-6" style={{ border: "1px solid #D9D9D9" }}>
                <div
                  className="border-2 border-dashed border-[#C72030]/30 rounded-lg text-center p-6"
                  onClick={triggerFileSelect}
                >
                  <div className="text-[#C72030] mb-2">
                    <Upload className="h-8 w-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Drag & Drop or{" "}
                    <span className="text-[#C72030] cursor-pointer">
                      Choose File
                    </span>{" "}
                    No file chosen
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted file formats: PNG/JPEG (height: 142px, width:
                    328px) (max 5 mb)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleCoverImageChange}
                  ref={coverImageRef}
                  hidden
                />

                {selectedFile.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {selectedFile.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`cover-preview-${index}`}
                          className="h-[80px] w-20 rounded border border-gray-200"
                        />
                        <button
                          onClick={() => removeCoverImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border-2 p-6 space-y-6 w-full">
              <div className="flex items-center gap-3">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                  <Image className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Booking Summary Image</h3>
              </div>

              <div className="p-6" style={{ border: "1px solid #D9D9D9" }}>
                <div
                  className="border-2 border-dashed border-[#C72030]/30 rounded-lg text-center p-6"
                  onClick={triggerBookingImgSelect}
                >
                  <div className="text-[#C72030] mb-2">
                    <Upload className="h-8 w-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Drag & Drop or{" "}
                    <span className="text-[#C72030] cursor-pointer">
                      Choose File
                    </span>{" "}
                    No file chosen
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted file formats: PNG/JPEG (height: 142px, width:
                    328px) (max 5 mb)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleBookingImageChange}
                  ref={bookingImageRef}
                  hidden
                />

                {selectedBookingFiles.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {selectedBookingFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`booking-preview-${index}`}
                          className="h-[80px] w-20 rounded border border-gray-200 bg-cover"
                        />
                        <button
                          onClick={() => removeBookingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <NotepadText className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">DESCRIPTION</h3>
            </div>

            <div>
              <Textarea
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Terms & Conditions and Cancellation Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border-2 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                  <ReceiptText className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">TERMS & CONDITIONS*</h3>
              </div>

              <div>
                <Textarea
                  placeholder="Enter terms and conditions"
                  value={formData.termsConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      termsConditions: e.target.value,
                    })
                  }
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border-2 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                  <MessageSquareX className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CANCELLATION POLICY*</h3>
              </div>

              <div>
                <Textarea
                  placeholder="Enter cancellation text"
                  value={formData.cancellationText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cancellationText: e.target.value,
                    })
                  }
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <Settings className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">RULE SETUP</h3>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="font-medium text-gray-700">
                  Rules Description
                </div>
                <div className="font-medium text-gray-700">Time</div>
                <div className="font-medium text-gray-700">Deduction</div>
              </div>
              {cancellationRules.map((rule, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 mb-2 items-center"
                >
                  {/* Description */}
                  <div className="text-sm text-gray-600">
                    {rule.description}
                  </div>

                  {/* Time Type & Value */}
                  <div className="flex gap-2">
                    {/* Day Input */}
                    <TextField
                      placeholder="Day"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={rule.time.day}
                      onChange={(e) => {
                        const newRules = [...cancellationRules];
                        newRules[index].time.day = e.target.value;
                        setCancellationRules(newRules);
                      }}
                    />

                    {/* Type: Hr or Day */}
                    <FormControl size="small" style={{ width: "80px" }}>
                      <Select
                        value={rule.time.type}
                        onChange={(e) => {
                          const newRules = [...cancellationRules];
                          newRules[index].time.type = e.target.value;
                          setCancellationRules(newRules);
                        }}
                      >
                        <MenuItem value="Hr">Hr</MenuItem>
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Value: 0 - 23 */}
                    <FormControl size="small" style={{ width: "80px" }}>
                      <Select
                        value={rule.time.value}
                        onChange={(e) => {
                          const newRules = [...cancellationRules];
                          newRules[index].time.value = e.target.value;
                          setCancellationRules(newRules);
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Percentage Input */}
                  <TextField
                    placeholder="%"
                    size="small"
                    variant="outlined"
                    value={rule.deduction}
                    onChange={(e) => {
                      const newRules = [...cancellationRules];
                      newRules[index].deduction = e.target.value;
                      setCancellationRules(newRules);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={`bg-white rounded-lg border-2 p-6 space-y-6 overflow-hidden ${additionalOpen ? 'h-auto' : 'h-[6rem]'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                  <FileCog className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">ADDITIONAL SETUP</h3>
              </div>
              {additionalOpen ? (
                <ChevronUp
                  onClick={handleAdditionalOpen}
                  className="cursor-pointer"
                />
              ) : (
                <ChevronDown
                  onClick={handleAdditionalOpen}
                  className="cursor-pointer"
                />
              )}
            </div>

            <div className="space-y-4" id="additional">
              <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    <Tv className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CONFIGURE AMENITY INFO</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="amenities">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tv"
                      checked={formData.amenities.tv}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: { ...formData.amenities, tv: !!checked },
                        })
                      }
                    />
                    <label htmlFor="tv">TV</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whiteboard"
                      checked={formData.amenities.whiteboard}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            whiteboard: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="whiteboard">Whiteboard</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="casting"
                      checked={formData.amenities.casting}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            casting: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="casting">Casting</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smartPenForTV"
                      checked={formData.amenities.smartPenForTV}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            smartPenForTV: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="smartPenForTV">Smart Pen for TV</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wirelessCharging"
                      checked={formData.amenities.wirelessCharging}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            wirelessCharging: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="wirelessCharging">Wireless Charging</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meetingRoomInventory"
                      checked={formData.amenities.meetingRoomInventory}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            meetingRoomInventory: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="meetingRoomInventory">
                      Meeting Room Inventory
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    <Armchair className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">SEATER INFO</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-2">
                  <FormControl>
                    <InputLabel>Seater Info</InputLabel>
                    <Select
                      value={formData.seaterInfo}
                      onChange={(e) =>
                        setFormData({ ...formData, seaterInfo: e.target.value })
                      }
                      label="Seater Info"
                    >
                      <MenuItem value="Select a seater">Select a seater</MenuItem>
                      <MenuItem value="1 Seater">1 Seater</MenuItem>
                      <MenuItem value="2 Seater">2 Seater</MenuItem>
                      <MenuItem value="3 Seater">3 Seater</MenuItem>
                      <MenuItem value="4 Seater">4 Seater</MenuItem>
                      <MenuItem value="5 Seater">5 Seater</MenuItem>
                      <MenuItem value="6 Seater">6 Seater</MenuItem>
                      <MenuItem value="7 Seater">7 Seater</MenuItem>
                      <MenuItem value="8 Seater">8 Seater</MenuItem>
                      <MenuItem value="9 Seater">9 Seater</MenuItem>
                      <MenuItem value="10 Seater">10 Seater</MenuItem>
                      <MenuItem value="11 Seater">11 Seater</MenuItem>
                      <MenuItem value="12 Seater">12 Seater</MenuItem>
                      <MenuItem value="13 Seater">13 Seater</MenuItem>
                      <MenuItem value="14 Seater">14 Seater</MenuItem>
                      <MenuItem value="15 Seater">15 Seater</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Floor Info */}
              <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    <LampFloor className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">FLOOR INFO</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-2">
                  <FormControl>
                    <InputLabel>Floor Info</InputLabel>
                    <Select
                      value={formData.floorInfo}
                      onChange={(e) =>
                        setFormData({ ...formData, floorInfo: e.target.value })
                      }
                      label="Floor Info"
                    >
                      <MenuItem value="Select a floor">Select a floor</MenuItem>
                      <MenuItem value="1st Floor">1st Floor</MenuItem>
                      <MenuItem value="2nd Floor">2nd Floor</MenuItem>
                      <MenuItem value="3rd Floor">3rd Floor</MenuItem>
                      <MenuItem value="4th Floor">4th Floor</MenuItem>
                      <MenuItem value="5th Floor">5th Floor</MenuItem>
                      <MenuItem value="6th Floor">6th Floor</MenuItem>
                      <MenuItem value="7th Floor">7th Floor</MenuItem>
                      <MenuItem value="8th Floor">8th Floor</MenuItem>
                      <MenuItem value="9th Floor">9th Floor</MenuItem>
                      <MenuItem value="10th Floor">10th Floor</MenuItem>
                      <MenuItem value="11th Floor">11th Floor</MenuItem>
                      <MenuItem value="12th Floor">12th Floor</MenuItem>
                      <MenuItem value="13th Floor">13th Floor</MenuItem>
                      <MenuItem value="14th Floor">14th Floor</MenuItem>
                      <MenuItem value="15th Floor">15th Floor</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Shared Content Info</h3>
                </div>

                <div>
                  <Textarea
                    placeholder="Text content will appear on meeting room share icon in Application"
                    value={formData.sharedContentInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sharedContentInfo: e.target.value,
                      })
                    }
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    <BookKey className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CONFIGURE APP KEY</h3>
                </div>
                <div className="my-2" id="appKey">
                  <TextField
                    label="App Key"
                    placeholder="Enter Alphanumeric Key"
                    value={formData.appKey}
                    onChange={(e) =>
                      setFormData({ ...formData, appKey: e.target.value })
                    }
                    variant="outlined"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider >
  );
};