import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  DollarSign,
  User,
  CalendarDays,
  CreditCard,
  FileImage,
  Image,
  NotepadText,
  ReceiptText,
  MessageSquareX,
  Settings,
  FileCog,
  Tv,
  Armchair,
  LampFloor,
  Share2,
  BookKey,
} from "lucide-react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAppDispatch } from "@/store/hooks";
import { facilityBookingSetupDetails } from "@/store/slices/facilityBookingsSlice";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QRCodeModal } from "@/components/QRCodeModal";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [slotsConfigured, setSlotsConfigured] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState<{ [key: string]: boolean }>({});
  const [popoverOpen, setPopoverOpen] = useState<{ [key: string]: boolean }>({});
  const [premiumPercentage, setPremiumPercentage] = useState<{ [key: string]: string }>({});
  const [isPremiumSlots, setIsPremiumSlots] = useState<{ [key: string]: boolean }>({});
  const [inventories, setInventories] = useState<any[]>([]);
  const [loadingInventories, setLoadingInventories] = useState(false);
  const [formData, setFormData] = useState({
    facilityName: "",
    isBookable: true,
    isRequest: false,
    department: "",
    appKey: "",
    postpaid: false,
    prepaid: false,
    payOnFacility: false,
    complimentary: false,
    gstPercentage: "",
    sgstPercentage: "",
    igstPercentage: "",
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
    amenities: {} as Record<string, boolean>,
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

  const handleDownloadQr = async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/admin/facility_setups/facility_qr_codes.pdf?access_token=${token}&facility_ids[]=${id}`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      a.download = 'facility_qr_codes.pdf';

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
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

  const fetchInventories = async () => {
    if (inventories.length > 0) return;
    setLoadingInventories(true);
    try {
      const response = await fetch(
        `https://${baseUrl}/pms/inventories.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data && Array.isArray(data.inventories)) {
        setInventories(data.inventories);
      } else {
        setInventories([]);
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
      setInventories([]);
    } finally {
      setLoadingInventories(false);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/settings/vas/booking/setup/edit/${id}`);
  }

  const fetchFacilityBookingDetails = async () => {
    try {
      const response = await dispatch(
        facilityBookingSetupDetails({ baseUrl, token, id })
      ).unwrap();
      setFormData({
        facilityName: response.fac_name,
        isBookable: response.fac_type === "bookable" ? true : false,
        isRequest: response.fac_type === "request" ? true : false,
        department: response.department_id ?? "",
        appKey: response.app_key,
        postpaid: response.postpaid,
        prepaid: response.prepaid,
        payOnFacility: response.pay_on_facility,
        complimentary: response.complementary,
        gstPercentage: response.gst,
        sgstPercentage: response.sgst,
        igstPercentage: response.igst,
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
        facilityBookedTimes: response.booking_limit,
        description: response.description,
        termsConditions: response.terms,
        cancellationText: response.cancellation_policy,
        amenities: response.amenity_info?.reduce((acc, amenity) => {
          acc[amenity.name] = amenity.selected;
          return acc;
        }, {}) || {},
        seaterInfo: response.seater_info,
        floorInfo: response.location_info,
        sharedContentInfo: response.shared_content,
        slots: response.facility_slots?.map((slot) => ({
          startTime: { hour: slot.facility_slot.start_hour, minute: slot.facility_slot.start_min },
          breakTimeStart: { hour: slot.facility_slot.break_start_hour, minute: slot.facility_slot.break_start_min },
          breakTimeEnd: { hour: slot.facility_slot.break_end_hour, minute: slot.facility_slot.break_end_min },
          endTime: { hour: slot.facility_slot.end_hour, minute: slot.facility_slot.end_min },
          concurrentSlots: slot.facility_slot.max_bookings,
          slotBy: slot.facility_slot.breakminutes_label,
          wrapTime: slot.facility_slot.wrap_time,
        })) || [],
        chargeSetup: {
          member: { selected: response.facility_charge?.adult_member_charge, adult: response.facility_charge?.adult_member_charge, child: response.facility_charge?.child_member_charge },
          guest: { selected: response.facility_charge?.adult_guest_charge, adult: response.facility_charge?.adult_guest_charge, child: response.facility_charge?.child_guest_charge },
          minimumPersonAllowed: response.min_people,
          maximumPersonAllowed: response.max_people,
        },
        blockDays: {
          startDate: response?.facility_blockings[0]?.facility_blocking?.ondate,
          endDate: "",
          dayType: "entireDay",
          blockReason: response?.facility_blockings[0]?.facility_blocking?.reason,
        },
      });
      const transformedRules = response.cancellation_rules?.map((rule: any) => ({
        description: rule.description,
        time: {
          type: rule.hour, // You can dynamically determine this if needed
          value: rule.min,
          day: rule.day,
        },
        deduction: rule.deduction?.toString() || '',
      })) || [];

      setCancellationRules([...transformedRules]);

      const slots = response.facility_slots.map(slot => (
        slot?.facility_slot?.slot_times.map(time => ({
          id: time.slot_time.id,
          isPremium: time.slot_time.is_premium,
          premium_percentage: time.slot_time.premium_percentage || 0,
          startTime: { hour: time.slot_time.start_hour, minute: time.slot_time.start_minute },
          endTime: { hour: time.slot_time.end_hour, minute: time.slot_time.end_minute },
        }))
      ));
      setSlotsConfigured(slots);

      // Initialize premium slots and percentage
      const premiumMap: { [key: string]: boolean } = {};
      const percentageMap: { [key: string]: string } = {};
      slots[0]?.forEach((slot: any, idx: number) => {
        const slotKey = `${slot.id}-${idx}`;
        premiumMap[slotKey] = slot.isPremium || false;
        percentageMap[slotKey] = slot.premium_percentage?.toString() || '';
      });
      setIsPremiumSlots(premiumMap);
      setPremiumPercentage(percentageMap);

      // setCancellationRules(response.cancellation_rules)
      setSelectedFile(response?.cover_image?.document);
      setSelectedBookingFiles(
        response?.documents.map((doc) => doc.document.document)
      );
      setQrUrl(response?.qr_code.document);

      // Setup gallery images
      const allGalleryImages: any[] = [];
      
      // 1:1 images
      if (response?.gallery_image_1_by_1 && Array.isArray(response.gallery_image_1_by_1)) {
        response.gallery_image_1_by_1.forEach((item: any) => {
          if (item.gallery_image_1_by_1?.document) {
            allGalleryImages.push({
              name: `Image ${allGalleryImages.length + 1}`,
              preview: item.gallery_image_1_by_1.document,
              ratio: '1:1',
              enableToApp: true
            });
          }
        });
      }
      
      // 16:9 images
      if (response?.gallery_image_16_by_9 && Array.isArray(response.gallery_image_16_by_9)) {
        response.gallery_image_16_by_9.forEach((item: any) => {
          if (item.gallery_image_16_by_9?.document) {
            allGalleryImages.push({
              name: `Image ${allGalleryImages.length + 1}`,
              preview: item.gallery_image_16_by_9.document,
              ratio: '16:9',
              enableToApp: true
            });
          }
        });
      }
      
      // 9:16 images
      if (response?.gallery_image_9_by_16 && Array.isArray(response.gallery_image_9_by_16)) {
        response.gallery_image_9_by_16.forEach((item: any) => {
          if (item.gallery_image_9_by_16?.document) {
            allGalleryImages.push({
              name: `Image ${allGalleryImages.length + 1}`,
              preview: item.gallery_image_9_by_16.document,
              ratio: '9:16',
              enableToApp: true
            });
          }
        });
      }
      
      // 3:2 images
      if (response?.gallery_image_3_by_2 && Array.isArray(response.gallery_image_3_by_2)) {
        response.gallery_image_3_by_2.forEach((item: any) => {
          if (item.gallery_image_3_by_2?.document) {
            allGalleryImages.push({
              name: `Image ${allGalleryImages.length + 1}`,
              preview: item.gallery_image_3_by_2.document,
              ratio: '3:2',
              enableToApp: true
            });
          }
        });
      }
      
      setGalleryImages(allGalleryImages);
    } catch (error) {
      console.error("Error fetching facility details:", error);
      console.error("Error details:", error?.response?.data || error.message);
    }
  };

  console.log(slotsConfigured)

  const handleSlotCheckboxChange = (slotId: string) => {
    setIsPremiumSlots(prev => ({
      ...prev,
      [slotId]: !prev[slotId]
    }));

    // Open popover when checkbox is checked
    if (!isPremiumSlots[slotId]) {
      setPopoverOpen(prev => ({
        ...prev,
        [slotId]: true
      }));
    }
  };

  const handleSendData = async (slotId: string) => {
    try {
      const payload = {
        slot_time_id: slotId,
        is_premium: true,
        premium_percentage: parseFloat(premiumPercentage[slotId]) || 0
      };

      const response = await axios.patch(
        `https://${baseUrl}/pms/admin/facility_setups/${id}/update_slot_premium.json`,
        payload,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Data sent successfully:", response.data);

      // Update isPremiumSlots to reflect the premium status
      setIsPremiumSlots(prev => ({
        ...prev,
        [slotId]: true
      }));

      setPopoverOpen(prev => ({
        ...prev,
        [slotId]: false
      }));
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchInventories();
    fetchFacilityBookingDetails();
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="p-6 bg-white">
        {/* <div className="bg-white rounded-lg max-w-6xl mx-auto pt-3"> */}
        <div className="mb-6">
          <div className="flex items-end justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => location.pathname.includes("/club-management/") ?
                navigate("/club-management/vas/booking/setup") : navigate("/settings/vas/booking/setup")
              }
              className="p-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Booking List
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleEditClick(id)}
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              >
                Edit
              </Button>
              <Button
                onClick={() => setShowQr(true)}
                className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
              >
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.332031 4.20609V0.935059H3.66536V2.24347H1.66536V4.20609H0.332031ZM0.332031 14.0192V10.7481H1.66536V12.7108H3.66536V14.0192H0.332031ZM10.332 14.0192V12.7108H12.332V10.7481H13.6654V14.0192H10.332ZM12.332 4.20609V2.24347H10.332V0.935059H13.6654V4.20609H12.332ZM10.6654 11.0752H11.6654V12.0566H10.6654V11.0752ZM10.6654 9.11263H11.6654V10.0939H10.6654V9.11263ZM9.66536 10.0939H10.6654V11.0752H9.66536V10.0939ZM8.66536 11.0752H9.66536V12.0566H8.66536V11.0752ZM7.66536 10.0939H8.66536V11.0752H7.66536V10.0939ZM9.66536 8.13132H10.6654V9.11263H9.66536V8.13132ZM8.66536 9.11263H9.66536V10.0939H8.66536V9.11263ZM7.66536 8.13132H8.66536V9.11263H7.66536V8.13132ZM11.6654 2.89768V6.82291H7.66536V2.89768H11.6654ZM6.33203 8.13132V12.0566H2.33203V8.13132H6.33203ZM6.33203 2.89768V6.82291H2.33203V2.89768H6.33203ZM5.33203 11.0752V9.11263H3.33203V11.0752H5.33203ZM5.33203 5.8416V3.87898H3.33203V5.8416H5.33203ZM10.6654 5.8416V3.87898H8.66536V5.8416H10.6654Z"
                    fill="#C72030"
                  />
                </svg>
                View QR
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
                <span className="text-gray-500 min-w-[140px]">Facility Name</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.facilityName || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Type</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.isBookable ? "Bookable" : formData.isRequest ? "Request" : "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Department</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.department ? departments.find(d => d.id === formData.department)?.department_name || "-" : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Charge Setup Card */}
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                CHARGE SETUP
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Member Adult Charge</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.chargeSetup.member.adult || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Guest Adult Charge</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.chargeSetup.guest.adult || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Member Child Charge</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.chargeSetup.member.child || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Guest Child Charge</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.chargeSetup.guest.child || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Minimum Person Allowed</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.chargeSetup.minimumPersonAllowed || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Maximum Person Allowed</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.chargeSetup.maximumPersonAllowed || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Configure Slot */}
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <CalendarDays className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CONFIGURE SLOT</h3>
            </div>

            <div className="space-y-6">
              {formData.slots.map((slot, index) => (
                <div key={index} className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700">Slot {index + 1}</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Start Time</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {slot.startTime.hour}:{slot.startTime.minute}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">End Time</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {slot.endTime.hour}:{slot.endTime.minute}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Break Time Start</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {slot.breakTimeStart.hour}:{slot.breakTimeStart.minute}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Break Time End</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {slot.breakTimeEnd.hour}:{slot.breakTimeEnd.minute}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Concurrent Slots</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {slot.concurrentSlots || "-"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Slot By</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {slot.slotBy || "-"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Wrap Time</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {slot.wrapTime || "-"}
                      </span>
                    </div>
                  </div>
                  {index < formData.slots.length - 1 && <hr className="mt-4" />}
                </div>
              ))}

              <div className="border-t pt-6 space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">Booking Configuration</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Booking Allowed Before</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.bookingAllowedBefore.day}d {formData.bookingAllowedBefore.hour}h {formData.bookingAllowedBefore.minute}m
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Advance Booking</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.advanceBooking.day}d {formData.advanceBooking.hour}h {formData.advanceBooking.minute}m
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Can Cancel Before</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.canCancelBefore.day}d {formData.canCancelBefore.hour}h {formData.canCancelBefore.minute}m
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Allow Multiple Slots</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.allowMultipleSlots ? "Yes" : "No"}
                    </span>
                  </div>
                  {formData.allowMultipleSlots && (
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[160px]">Maximum Slots</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {formData.maximumSlots || "-"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Facility Booked Times Per Day</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.facilityBookedTimes || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3 -mb-3">
              <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <CalendarDays className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">SLOTS CONFIGURED</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {slotsConfigured[0]?.map((slot, idx) => {
                const slotKey = `${slot.id}-${idx}`;
                return (
                  <Popover key={idx} open={popoverOpen[slotKey]} onOpenChange={(open) => {
                    if (selectedSlots[slotKey]) {
                      setPopoverOpen(prev => ({
                        ...prev,
                        [slotKey]: open
                      }));
                    }
                  }}>
                    <PopoverTrigger asChild>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPremiumSlots[slotKey] || false}
                          onChange={() => handleSlotCheckboxChange(slotKey)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <Label
                          className="cursor-pointer text-sm font-medium"
                        >
                          {slot.startTime.hour}:{slot.startTime.minute} - {slot.endTime.hour}:{slot.endTime.minute}
                          {isPremiumSlots[slotKey] && premiumPercentage[slotKey] && (
                            <span className="ml-2 text-xs text-gray-600">
                              ({premiumPercentage[slotKey]}%)
                            </span>
                          )}
                        </Label>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Set Premium Percentage</h4>
                          <p className="text-xs text-gray-500">
                            {slot.startTime.hour}:{slot.startTime.minute} - {slot.endTime.hour}:{slot.endTime.minute}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`premium-${slotKey}`} className="text-sm">
                            Premium Percentage (%)
                          </Label>
                          <TextField
                            id={`premium-${slotKey}`}
                            type="number"
                            placeholder="Enter percentage"
                            value={premiumPercentage[slotKey] || ""}
                            onChange={(e) => {
                              setPremiumPercentage(prev => ({
                                ...prev,
                                [slotKey]: e.target.value
                              }));
                            }}
                            variant="outlined"
                            size="small"
                            fullWidth
                            inputProps={{ min: "0", max: "100", step: "0.01" }}
                          />
                        </div>
                        <Button
                          onClick={() => handleSendData(slotKey)}
                          className="w-full bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                        >
                          Save
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
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
                variant="outlined"
                InputProps={{ readOnly: true }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/* <TextField
                label="End Date"
                type="date"
                value={formData.blockDays.endDate}
                variant="outlined"
                InputProps={{ readOnly: true }}
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
                  disabled
                  className="text-blue-600"
                />
                <label htmlFor="entireDay">Entire Day</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="selectedSlots"
                  name="dayType"
                  checked={formData.blockDays.dayType === "selectedSlots"}
                  disabled
                  className="text-blue-600"
                />
                <label htmlFor="selectedSlots">Selected Slots</label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Block Reason</label>
              <Textarea
                value={formData.blockDays.blockReason}
                className="min-h-[100px]"
                readOnly
              />
            </div>
          </div>

          {/* Configure Payment */}
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                CONFIGURE PAYMENT
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Prepaid</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.prepaid ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Pay on Facility</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.payOnFacility ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">SGST (%)</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.sgstPercentage || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">GST (%)</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.gstPercentage || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">IGST (%)</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.igstPercentage || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Per Slot Charge</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formData.perSlotCharge || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Cover Image and Booking Summary Image */}
          <div className="flex items-start justify-between gap-4">
            <div className="bg-white rounded-lg border-2 p-6 space-y-6 w-full">
              <div className="flex items-center gap-3">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                  <FileImage className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">COVER IMAGE</h3>
              </div>
              <div>
                {selectedFile ? (
                  <div className="flex gap-2 flex-wrap">
                    <img
                      src={selectedFile}
                      alt="cover-preview"
                      className="h-[80px] w-20 rounded border border-gray-200"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No image selected
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
              <div>
                {selectedBookingFiles.length > 0 ? (
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
                ) : (
                  <div className="text-center text-gray-500">
                    No image selected
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                  <Image className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                  GALLERY IMAGES [{galleryImages.length}]
                </h3>
              </div>
            </div>

            {galleryImages.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#E5E0D3]">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Image Name</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Preview</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Ratio</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Enable to App</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryImages.map((image: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">
                          <span className="text-gray-900">{image.name || `Image ${index + 1}`}</span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex justify-center">
                            <img
                              src={image.preview}
                              alt={`gallery-preview-${index}`}
                              className="h-20 w-20 rounded border border-gray-200 object-cover"
                            />
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          {image.ratio || '1:1'}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={image.enableToApp ?? true}
                              disabled
                              className="w-5 h-5 mx-auto"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <NotepadText className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">DESCRIPTION</h3>
            </div>
            <div>
              <Textarea
                value={formData.description}
                className="min-h-[100px]"
                readOnly
              />
            </div>
          </div>

          {/* Terms & Conditions and Cancellation Text */}
          <div className="grid  gap-6">
            <div className="bg-white rounded-lg border-2 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                  <ReceiptText className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">TERMS & CONDITIONS*</h3>
              </div>
              <div>
                <Textarea
                  value={formData.termsConditions}
                  className="min-h-[100px]"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Rule Setup */}
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
                  <div className="flex gap-2 items-center">
                    {/* Day Input */}
                    <TextField
                      placeholder="Day"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={rule.time.day}
                      InputProps={{ readOnly: true }}
                    />
                    <span>DD</span>

                    {/* Type: Hr or Day */}
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
                    <span>HH</span>

                    {/* Value: 0 - 23 */}
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
                    <span>MM</span>
                  </div>

                  {/* Percentage Input */}
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

            <div className="space-y-3">
              <div className="font-medium text-gray-700">
                Cancellation Policy
              </div>
              <Textarea
                placeholder="Enter cancellation text"
                value={formData.cancellationText}
                disabled
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* /* Additional Setup */ }
          <div className={`bg-white rounded-lg border-2 p-6 space-y-6 overflow-hidden ${additionalOpen ? "h-auto" : "h-[6rem]"}`}>
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
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CONFIGURE ACCESSORIES</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="amenities">
                  {loadingInventories ? (
                    <div className="col-span-full text-center text-gray-500">Loading inventories...</div>
                  ) : inventories.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">No inventories available</div>
                  ) : (
                    inventories.map((inventory) => {
                      const isSelected = formData.amenities[inventory.name] || false;
                      return (
                        <div key={inventory.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`inventory-${inventory.id}`}
                            checked={isSelected}
                            disabled
                          />
                          <label htmlFor={`inventory-${inventory.id}`}>
                            {inventory.name}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    <Armchair className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">SEATER INFO</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-2">
                  <FormControl>
                    <InputLabel sx={{ backgroundColor: '#F6F7F7', paddingRight: "5px" }}>Seater Info</InputLabel>
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
              </div> */}

              {/* <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    <LampFloor className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">FLOOR INFO</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-2">
                  <FormControl>
                    <InputLabel sx={{ backgroundColor: '#F6F7F7', paddingRight: "5px" }}>Floor Info</InputLabel>
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
              </div> */}
              {/* <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Shared Content Info</h3>
                </div>
                <div>
                  <Textarea
                    value={formData.sharedContentInfo}
                    className="min-h-[100px]"
                    readOnly
                  />
                </div>
              </div> */}
              {/* <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    <BookKey className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CONFIGURE APP KEY</h3>
                </div>
                <div className="my-2" id="appKey">
                  <TextField
                    label="App Key"
                    value={formData.appKey}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <QRCodeModal
        isOpen={showQr}
        onClose={() => setShowQr(false)}
        qrCode={qrUrl}
        handleDownloadQR={handleDownloadQr}
      />
    </ThemeProvider>
  );
};