import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  QrCode,
  Upload,
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
import { getAuthHeader } from "@/config/apiConfig";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAppDispatch } from "@/store/hooks";
import { facilityBookingSetupDetails } from "@/store/slices/facilityBookingsSlice";
import { Print } from "@mui/icons-material";
import { DialogTitle } from "@radix-ui/react-dialog";

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
  const [selectedBookingFiles, setSelectedBookingFiles] = useState<[]>([]);
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
    link.href = qrUrl; // Replace with actual QR code URL
    link.download = "qr-code.png";
    link.click();
  };

  const handleAdditionalOpen = () => {
    setAdditionalOpen(!additionalOpen);
  };

  const fetchDepartments = async () => {
    if (departments.length > 0) return; // Don't fetch if already loaded

    setLoadingDepartments(true);
    try {
      const response = await fetch(
        "https://fm-uat-api.lockated.com/pms/departments.json",
        {
          headers: {
            Authorization: getAuthHeader(),
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
        // slots: [
        //   {
        //     startTime: { hour: "00", minute: "00" },
        //     breakTimeStart: { hour: "00", minute: "00" },
        //     breakTimeEnd: { hour: "00", minute: "00" },
        //     endTime: { hour: "00", minute: "00" },
        //     concurrentSlots: "",
        //     slotBy: 15,
        //     wrapTime: "",
        //   },
        // ],
        slots: response.facility_slots.map((slot: any) => ({
          startTime: { hour: slot.facility_slot.start_hour, minute: slot.facility_slot.start_min },
          breakTimeStart: { hour: slot.facility_slot.break_start_hour, minute: slot.facility_slot.break_start_min },
          breakTimeEnd: { hour: slot.facility_slot.break_end_hour, minute: slot.facility_slot.break_end_min },
          endTime: { hour: slot.facility_slot.end_hour, minute: slot.facility_slot.end_min },
          concurrentSlots: "",
          slotBy: slot.facility_slot.breakminutes_label,
          wrapTime: slot.facility_slot.wrap_time,
        }))
      });
      setSelectedFile(response?.cover_image?.document);
      setSelectedBookingFiles(
        response?.documents.map((doc: any) => doc.document.document)
      );
      setQrUrl(response?.qr_code.document);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(formData)

  useEffect(() => {
    fetchDepartments();
    fetchFacilityBookingDetails();
  }, []);

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
    <>
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
                      placeholder="Enter Facility Name"
                      value={formData.facilityName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          facilityName: e.target.value,
                        })
                      }
                      variant="outlined"
                    />
                    <FormControl>
                      <InputLabel className="bg-[#F6F7F7]">Active*</InputLabel>
                      <Select
                        value={formData.active}
                        onChange={(e) =>
                          setFormData({ ...formData, active: e.target.value })
                        }
                        label="Active*"
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        label="Department"
                      >
                        <MenuItem value="Select Department">
                          {loadingDepartments
                            ? "Loading..."
                            : "Select Department"}
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

                  {/* Radio Buttons */}
                  <div className="flex gap-6 bg-[#F6F7F7]">
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
                      {/* Start Time */}
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
                                value={i.toString()}
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
                                value={i.toString()}
                              >
                                {i.toString().padStart(2, "0")}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* Break Time Start */}
                      <div className="flex gap-1">
                        <FormControl size="small">
                          <Select
                            value={slot.breakTimeStart.hour}
                            onChange={(e) => {
                              const newSlots = [...formData.slots];
                              newSlots[index].breakTimeStart.hour =
                                e.target.value;
                              setFormData({ ...formData, slots: newSlots });
                            }}
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <MenuItem
                                key={i}
                                value={i.toString()}
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
                                value={i.toString()}
                              >
                                {i.toString().padStart(2, "0")}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* Break Time End */}
                      <div className="flex gap-1">
                        <FormControl size="small">
                          <Select
                            value={slot.breakTimeEnd.hour}
                            onChange={(e) => {
                              const newSlots = [...formData.slots];
                              newSlots[index].breakTimeEnd.hour =
                                e.target.value;
                              setFormData({ ...formData, slots: newSlots });
                            }}
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <MenuItem
                                key={i}
                                value={i.toString()}
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
                              newSlots[index].breakTimeEnd.minute =
                                e.target.value;
                              setFormData({ ...formData, slots: newSlots });
                            }}
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <MenuItem
                                key={i}
                                value={i.toString()}
                              >
                                {i.toString().padStart(2, "0")}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* End Time */}
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
                                value={i.toString()}
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
                                value={i.toString()}
                              >
                                {i.toString().padStart(2, "0")}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* Concurrent Slots */}
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

                      {/* Slot By */}
                      <FormControl size="small">
                        <Select
                          value={slot.slotBy}
                          onChange={(e) => {
                            const newSlots = [...formData.slots];
                            newSlots[index].slotBy = e.target.value.split(" ")[0];
                            setFormData({ ...formData, slots: newSlots });
                          }}
                        >
                          <MenuItem value={"15 Minutes"}>15 Minutes</MenuItem>
                          <MenuItem value={"30 Minutes"}>Half hour</MenuItem>
                          <MenuItem value={"45 Minutes"}>45 Minutes</MenuItem>
                          <MenuItem value={"60 Minutes"}>1 hour</MenuItem>
                          <MenuItem value={"90 Minutes"}>1 and a half hours</MenuItem>
                        </Select>
                      </FormControl>

                      {/* Wrap Time */}
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
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, postpaid: !!checked })
                        }
                      />
                      <label htmlFor="postpaid">Postpaid</label>
                    </div>
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
                        setFormData({
                          ...formData,
                          sgstPercentage: e.target.value,
                        })
                      }
                      variant="outlined"
                    />
                    <TextField
                      label="GST(%)"
                      value={formData.gstPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gstPercentage: e.target.value,
                        })
                      }
                      variant="outlined"
                    />
                  </div>

                  <TextField
                    label="Per Slot Charge"
                    value={formData.perSlotCharge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        perSlotCharge: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="flex items-center justify-between gap-4">
                {/* Cover Image */}
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
                          alt={`cover-preview`}
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

              <div
                className={`border rounded-lg overflow-hidden ${additionalOpen ? "h-auto" : "h-[3.8rem]"
                  }`}
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
                  {/* Configure Amenity Info */}
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
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              amenities: {
                                ...formData.amenities,
                                tv: !!checked,
                              },
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
                        <label htmlFor="wirelessCharging">
                          Wireless Charging
                        </label>
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

                  {/* Seater Info */}
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seaterInfo: e.target.value,
                            })
                          }
                          label="Seater Info"
                        >
                          <MenuItem value="Select a seater">
                            Select a seater
                          </MenuItem>
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              floorInfo: e.target.value,
                            })
                          }
                          label="Floor Info"
                        >
                          <MenuItem value="Select a floor">
                            Select a floor
                          </MenuItem>
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

                  {/* Shared Content Info */}
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
                      className=" p-6 bg-[#F6F7F7]"
                      style={{ border: "1px solid #D9D9D9" }}
                    >
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

                  {/* Configure App Key */}
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
            </div>
          </div>
        </div>
      </ThemeProvider>

      <Dialog
        open={showQr}
        onClose={() => setShowQr(false)}
        aria-labelledby="qr-code-dialog-title"
      >
        {/* <DialogTitle id="qr-code-dialog-title">QR Code</DialogTitle> */}
        <DialogContent>
          <Box display="flex" justifyContent="center">
            <img
              src={qrUrl} // Replace with actual QR code URL
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
    </>
  );
};
