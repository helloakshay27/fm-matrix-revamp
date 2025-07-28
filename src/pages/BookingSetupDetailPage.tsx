import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  QrCode,
} from "lucide-react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAppDispatch } from "@/store/hooks";
import { facilityBookingSetupDetails } from "@/store/slices/facilityBookingsSlice";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

export const BookingSetupDetailPage = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState();
  const [selectedBookingFiles, setSelectedBookingFiles] = useState([]);
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [formData, setFormData] = useState({
    facilityName: "",
    isBookable: true,
    isRequest: false,
    active: "Select",
    department: "Select Department",
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

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qr-code.png";
    link.click();
  };

  const handleAdditionalOpen = () => {
    setAdditionalOpen(!additionalOpen);
  };

  const fetchDepartments = async () => {
    if (departments.length > 0) return;
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
      let departmentsList = [];
      if (Array.isArray(data)) {
        departmentsList = data;
      } else if (data && Array.isArray(data.departments)) {
        departmentsList = data.departments;
      } else if (data && data.length !== undefined) {
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

  const fetchFacilityBookingDetails = async () => {
    try {
      const response = await dispatch(
        facilityBookingSetupDetails({ baseUrl, token, id })
      ).unwrap();
      setFormData({
        facilityName: response.fac_name,
        isBookable: response.fac_type === "bookable" ? true : false,
        isRequest: response.fac_type === "request" ? true : false,
        active: response.active,
        department: response.department_id,
        appKey: response.app_key,
        postpaid: response.postpaid,
        prepaid: response.prepaid,
        payOnFacility: response.pay_on_facility,
        complimentary: response.complementary,
        gstPercentage: response.gst,
        sgstPercentage: response.sgst,
        perSlotCharge: response?.facility_charge?.per_slot_charge,
        bookingAllowedBefore: {
          day: response.bb_dhm.d,
          hour: response.bb_dhm.h,
          minute: response.bb_dhm.m,
        },
        advanceBooking: {
          day: response.ab_dhm.d,
          hour: response.ab_dhm.h,
          minute: response.ab_dhm.m,
        },
        canCancelBefore: {
          day: response.cb_dhm.d,
          hour: response.cb_dhm.h,
          minute: response.cb_dhm.m,
        },
        allowMultipleSlots: response.multi_slot,
        maximumSlots: response.max_slots,
        facilityBookedTimes: "",
        description: response.description,
        termsConditions: response.terms,
        cancellationText: response.cancellation_policy,
        amenities: {
          tv: false,
          whiteboard: false,
          casting: false,
          smartPenForTV: false,
          wirelessCharging: false,
          meetingRoomInventory: false,
        },
        seaterInfo: response.seater_info,
        floorInfo: response.location_info,
        sharedContentInfo: response.shared_content,
        slots: response.facility_slots.map((slot) => ({
          startTime: { hour: slot.facility_slot.start_hour, minute: slot.facility_slot.start_min },
          breakTimeStart: { hour: slot.facility_slot.break_start_hour, minute: slot.facility_slot.break_start_min },
          breakTimeEnd: { hour: slot.facility_slot.break_end_hour, minute: slot.facility_slot.break_end_min },
          endTime: { hour: slot.facility_slot.end_hour, minute: slot.facility_slot.end_min },
          concurrentSlots: "",
          slotBy: slot.facility_slot.breakminutes_label,
          wrapTime: slot.facility_slot.wrap_time,
        })),
      });
      setSelectedFile(response?.cover_image?.document);
      setSelectedBookingFiles(
        response?.documents.map((doc) => doc.document.document)
      );
      setQrUrl(response?.qr_code.document);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchFacilityBookingDetails();
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="px-5 bg-white min-h-screen">
        <div className="bg-white rounded-lg max-w-6xl mx-auto pt-3">
          <div className="flex items-center justify-between pr-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/settings/vas/booking/setup")}
              className="mt-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Booking List
            </Button>
            <button
              className="bg-[#F6F4EE] py-2 px-4 rounded mt-2 flex items-center gap-2"
              onClick={() => setShowQr(true)}
            >
              <QrCode className="w-4 h-4" color="#000" /> QR Code
            </button>
          </div>
          <div className="p-6 space-y-8">
            {/* Basic Info */}
            <div className="border rounded-lg">
              <div
                className="flex items-center gap-2 bg-[#F6F4EE] p-6"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  Basic Info
                </h3>
              </div>
              <div
                className="p-[31px] bg-[#F6F7F7] space-y-4"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TextField
                    label="Facility Name*"
                    value={formData.facilityName}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                  <FormControl>
                    <InputLabel className="bg-[#F6F7F7]">Active*</InputLabel>
                    <Select
                      value={formData.active}
                      label="Active*"
                      disabled
                    >
                      <MenuItem value="Select">Select</MenuItem>
                      <MenuItem value="1">Yes</MenuItem>
                      <MenuItem value="0">No</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel className="bg-[#F6F7F7]">Department</InputLabel>
                    <Select
                      value={formData.department}
                      label="Department"
                      disabled
                    >
                      <MenuItem value="Select Department">
                        {loadingDepartments ? "Loading..." : "Select Department"}
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
                <div className="flex gap-6 bg-[#F6F7F7]">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="bookable"
                      name="type"
                      checked={formData.isBookable}
                      disabled
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
                      disabled
                      className="text-blue-600"
                    />
                    <label htmlFor="request">Request</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Configure Slot */}
            <div className="border rounded-lg">
              <div
                className="flex items-center gap-2 bg-[#F6F4EE] p-6"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  CONFIGURE SLOT
                </h3>
              </div>
              <div
                className="p-[31px] bg-[#F6F7F7]"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <Button
                  disabled
                  className="bg-purple-600 hover:bg-purple-700 mb-4 opacity-50 cursor-not-allowed"
                >
                  Add
                </Button>
                <div className="grid grid-cols-7 gap-2 mb-2 text-sm font-medium text-gray-600">
                  <div>Start Time</div>
                  <div>Break Time Start</div>
                  <div>Break Time End</div>
                  <div>End Time</div>
                  <div>Concurrent Slots</div>
                  <div>Slot by</div>
                  <div>Wrap Time</div>
                </div>
                {formData.slots.map((slot, index) => (
                  <div key={index} className="grid grid-cols-7 gap-2 mb-2">
                    <div className="flex gap-1">
                      <FormControl size="small">
                        <Select
                          value={slot.startTime.hour}
                          disabled
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <MenuItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small">
                        <Select
                          value={slot.startTime.minute}
                          disabled
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <MenuItem key={i} value={i.toString()}>
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
                          disabled
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <MenuItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small">
                        <Select
                          value={slot.breakTimeStart.minute}
                          disabled
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <MenuItem key={i} value={i.toString()}>
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
                          disabled
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <MenuItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small">
                        <Select
                          value={slot.breakTimeEnd.minute}
                          disabled
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <MenuItem key={i} value={i.toString()}>
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
                          disabled
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <MenuItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small">
                        <Select
                          value={slot.endTime.minute}
                          disabled
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <MenuItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <TextField
                      size="small"
                      value={slot.concurrentSlots}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                    />
                    <FormControl size="small">
                      <Select
                        value={slot.slotBy}
                        disabled
                      >
                        <MenuItem value={"15 Minutes"}>15 Minutes</MenuItem>
                        <MenuItem value={"30 Minutes"}>Half hour</MenuItem>
                        <MenuItem value={"45 Minutes"}>45 Minutes</MenuItem>
                        <MenuItem value={"60 Minutes"}>1 hour</MenuItem>
                        <MenuItem value={"90 Minutes"}>1 and a half hours</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      value={slot.wrapTime}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
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
                        InputProps={{ readOnly: true }}
                      />
                      <span>d</span>
                      <TextField
                        placeholder="Hour"
                        size="small"
                        style={{ width: "80px" }}
                        variant="outlined"
                        value={formData.bookingAllowedBefore.hour}
                        InputProps={{ readOnly: true }}
                      />
                      <span>h</span>
                      <TextField
                        placeholder="Mins"
                        size="small"
                        style={{ width: "80px" }}
                        variant="outlined"
                        value={formData.bookingAllowedBefore.minute}
                        InputProps={{ readOnly: true }}
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
                        InputProps={{ readOnly: true }}
                      />
                      <span>d</span>
                      <TextField
                        placeholder="Hour"
                        size="small"
                        style={{ width: "80px" }}
                        variant="outlined"
                        value={formData.advanceBooking.hour}
                        InputProps={{ readOnly: true }}
                      />
                      <span>h</span>
                      <TextField
                        placeholder="Mins"
                        size="small"
                        style={{ width: "80px" }}
                        variant="outlined"
                        value={formData.advanceBooking.minute}
                        InputProps={{ readOnly: true }}
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
                        InputProps={{ readOnly: true }}
                      />
                      <span>d</span>
                      <TextField
                        placeholder="Hour"
                        size="small"
                        style={{ width: "80px" }}
                        variant="outlined"
                        value={formData.canCancelBefore.hour}
                        InputProps={{ readOnly: true }}
                      />
                      <span>h</span>
                      <TextField
                        placeholder="Mins"
                        size="small"
                        style={{ width: "80px" }}
                        variant="outlined"
                        value={formData.canCancelBefore.minute}
                        InputProps={{ readOnly: true }}
                      />
                      <span>m</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 flex items-center justify-between mt-4">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowMultipleSlots"
                        checked={formData.allowMultipleSlots}
                        disabled
                      />
                      <label htmlFor="allowMultipleSlots">
                        Allow Multiple Slots
                      </label>
                    </div>
                    {formData.allowMultipleSlots && (
                      <div>
                        <TextField
                          label="Maximum no. of slots"
                          value={formData.maximumSlots}
                          variant="outlined"
                          size="small"
                          style={{ width: "200px" }}
                          InputProps={{ readOnly: true }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Facility can be booked</span>
                    <TextField
                      value={formData.facilityBookedTimes}
                      variant="outlined"
                      size="small"
                      style={{ width: "80px" }}
                      InputProps={{ readOnly: true }}
                    />
                    <span>times per day by User</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Configure Payment */}
            <div className="border rounded-lg">
              <div
                className="flex items-center gap-2 bg-[#F6F4EE] p-6"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  CONFIGURE PAYMENT
                </h3>
              </div>
              <div
                className="p-[31px] bg-[#F6F7F7] space-y-6"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="postpaid"
                      checked={formData.postpaid}
                      disabled
                    />
                    <label htmlFor="postpaid">Postpaid</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prepaid"
                      checked={formData.prepaid}
                      disabled
                    />
                    <label htmlFor="prepaid">Prepaid</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payOnFacility"
                      checked={formData.payOnFacility}
                      disabled
                    />
                    <label htmlFor="payOnFacility">Pay on Facility</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="complimentary"
                      checked={formData.complimentary}
                      disabled
                    />
                    <label htmlFor="complimentary">Complimentary</label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <TextField
                    label="SGST(%)"
                    value={formData.sgstPercentage}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="GST(%)"
                    value={formData.gstPercentage}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </div>
                <TextField
                  label="Per Slot Charge"
                  value={formData.perSlotCharge}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </div>
            </div>

            {/* Cover Image and Booking Summary Image */}
            <div className="flex items-center justify-between gap-4">
              <div className="border rounded-lg w-full">
                <div
                  className="flex items-center gap-2 bg-[#F6F4EE] p-6"
                  style={{ border: "1px solid #D9D9D9" }}
                >
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    COVER IMAGE
                  </h3>
                </div>
                <div
                  className="p-6 bg-[#F6F7F7]"
                  style={{ border: "1px solid #D9D9D9" }}
                >
                  {selectedFile && (
                    <div className="flex gap-2 flex-wrap">
                      <img
                        src={selectedFile}
                        alt="cover-preview"
                        className="h-[80px] w-20 rounded border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="border rounded-lg w-full">
                <div
                  className="flex items-center gap-2 bg-[#F6F4EE] p-6"
                  style={{ border: "1px solid #D9D9D9" }}
                >
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    5
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    Booking Summary Image
                  </h3>
                </div>
                <div
                  className="p-6 bg-[#F6F7F7]"
                  style={{ border: "1px solid #D9D9D9" }}
                >
                  {selectedBookingFiles.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {selectedBookingFiles.map((file, index) => (
                        <img
                          key={index}
                          src={file}
                          alt={`cover-preview-${index}`}
                          className="h-[80px] w-20 rounded border border-gray-200 bg-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border rounded-lg">
              <div
                className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  6
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  DESCRIPTION
                </h3>
              </div>
              <div
                className="p-6 bg-[#F6F7F7]"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <Textarea
                  value={formData.description}
                  className="min-h-[100px]"
                  readOnly
                />
              </div>
            </div>

            {/* Terms & Conditions and Cancellation Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg">
                <div
                  className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                  style={{ border: "1px solid #D9D9D9" }}
                >
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    7
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    TERMS & CONDITIONS
                  </h3>
                </div>
                <div
                  className="p-6 bg-[#F6F7F7]"
                  style={{ border: "1px solid #D9D9D9" }}
                >
                  <Textarea
                    value={formData.termsConditions}
                    className="min-h-[100px]"
                    readOnly
                  />
                </div>
              </div>
              <div className="border rounded-lg">
                <div
                  className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                  style={{ border: "1px solid #D9D9D9" }}
                >
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    8
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    CANCELLATION POLICY
                  </h3>
                </div>
                <div
                  className="p-6 bg-[#F6F7F7]"
                  style={{ border: "1px solid #D9D9D9" }}
                >
                  <Textarea
                    value={formData.cancellationText}
                    className="min-h-[100px]"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Cancellation Rules */}
            <div className="border rounded-lg">
              <div
                className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  9
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  RULE SETUP
                </h3>
              </div>
              <div
                className="p-6 bg-[#F6F7F7]"
                style={{ border: "1px solid #D9D9D9" }}
              >
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
                    <div className="text-sm text-gray-600">
                      {rule.description}
                    </div>
                    <div className="flex gap-2">
                      <TextField
                        placeholder="Day"
                        size="small"
                        style={{ width: "80px" }}
                        variant="outlined"
                        value={rule.time.day}
                        InputProps={{ readOnly: true }}
                      />
                      <FormControl size="small" style={{ width: "80px" }}>
                        <Select
                          value={rule.time.type}
                          disabled
                        >
                          <MenuItem value="Hr">Hr</MenuItem>
                          {Array.from({ length: 24 }, (_, i) => (
                            <MenuItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" style={{ width: "80px" }}>
                        <Select
                          value={rule.time.value}
                          disabled
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
                    <TextField
                      placeholder="%"
                      size="small"
                      variant="outlined"
                      value={rule.deduction}
                      InputProps={{ readOnly: true }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Setup */}
            <div
              className={`border rounded-lg overflow-hidden ${additionalOpen ? "h-auto" : "h-[3.8rem]"}`}
            >
              <div
                className="flex justify-between p-6 bg-[#F6F4EE]"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold"></div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    ADDITIONAL SETUP
                  </h3>
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
              <div
                className="p-6 space-y-4"
                style={{ border: "1px solid #D9D9D9" }}
                id="additional"
              >
                <div className="border rounded-lg">
                  <div
                    className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                  >
                    <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      11
                    </div>
                    <h3 className="text-lg font-semibold text-[#C72030]">
                      CONFIGURE AMENITY INFO
                    </h3>
                  </div>
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                    id="amenities"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tv"
                        checked={formData.amenities.tv}
                        disabled
                      />
                      <label htmlFor="tv">TV</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="whiteboard"
                        checked={formData.amenities.whiteboard}
                        disabled
                      />
                      <label htmlFor="whiteboard">Whiteboard</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="casting"
                        checked={formData.amenities.casting}
                        disabled
                      />
                      <label htmlFor="casting">Casting</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smartPenForTV"
                        checked={formData.amenities.smartPenForTV}
                        disabled
                      />
                      <label htmlFor="smartPenForTV">Smart Pen for TV</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wirelessCharging"
                        checked={formData.amenities.wirelessCharging}
                        disabled
                      />
                      <label htmlFor="wirelessCharging">Wireless Charging</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="meetingRoomInventory"
                        checked={formData.amenities.meetingRoomInventory}
                        disabled
                      />
                      <label htmlFor="meetingRoomInventory">
                        Meeting Room Inventory
                      </label>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg">
                  <div
                    className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                    id="seater"
                  >
                    <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      12
                    </div>
                    <h3 className="text-lg font-semibold text-[#C72030]">
                      SEATER INFO
                    </h3>
                  </div>
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                  >
                    <FormControl>
                      <InputLabel>Seater Info</InputLabel>
                      <Select
                        value={formData.seaterInfo}
                        label="Seater Info"
                        disabled
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
                <div className="border rounded-lg">
                  <div
                    className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                    id="floor"
                  >
                    <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      13
                    </div>
                    <h3 className="text-lg font-semibold text-[#C72030]">
                      FLOOR INFO
                    </h3>
                  </div>
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                  >
                    <FormControl>
                      <InputLabel>Floor Info</InputLabel>
                      <Select
                        value={formData.floorInfo}
                        label="Floor Info"
                        disabled
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
                <div className="border rounded-lg">
                  <div
                    className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                    id="shared"
                  >
                    <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      14
                    </div>
                    <h3 className="text-lg font-semibold text-[#C72030]">
                      Shared Content Info
                    </h3>
                  </div>
                  <div
                    className="p-6 bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                  >
                    <Textarea
                      value={formData.sharedContentInfo}
                      className="min-h-[100px]"
                      readOnly
                    />
                  </div>
                </div>
                <div className="border rounded-lg">
                  <div
                    className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                    id="appKey"
                  >
                    <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-[#C72030]">
                      CONFIGURE APP KEY
                    </h3>
                  </div>
                  <div
                    className="p-6 bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                    id="appKey"
                  >
                    <TextField
                      label="App Key"
                      value={formData.appKey}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={showQr}
        onClose={() => setShowQr(false)}
        aria-labelledby="qr-code-dialog-title"
      >
        <DialogContent>
          <Box display="flex" justifyContent="center">
            <img
              src={qrUrl}
              alt="QR Code"
              style={{ width: "200px", height: "200px" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <button
            className="bg-[#F6F4EE] text-[#C72030] font-bold py-2 px-4 rounded mx-auto -mt-6 mb-4"
            onClick={handleDownloadQr}
          >
            Download
          </button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};