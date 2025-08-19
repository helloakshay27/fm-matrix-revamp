import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronDown, ChevronUp, Upload, X } from "lucide-react";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";
import axios from "axios";

// Define interfaces for TypeScript
interface Department {
    id: number;
    department_name: string;
}

interface TimeSlot {
    hour: string;
    minute: string;
}

interface FacilitySlot {
    id?: number;
    startTime: TimeSlot;
    breakTimeStart: TimeSlot;
    breakTimeEnd: TimeSlot;
    endTime: TimeSlot;
    concurrentSlots: string;
    slotBy: number;
    wrapTime: string;
    dayofweek?: string;
    _destroy?: boolean;
}

interface Amenity {
    name: string;
    selected: boolean;
    tag_id: number | null;
}

interface TimeConfig {
    d: string;
    h: string;
    m: string;
}

interface CancellationRule {
    description: string;
    time: {
        type: string;
        value: string;
        day: string;
    };
    deduction: string;
}

interface BookingFile {
    file: File | string;
    id: number | null;
}

interface FormData {
    facilityName: string;
    isBookable: boolean;
    isRequest: boolean;
    department: string | number;
    appKey: string;
    postpaid: boolean;
    prepaid: boolean;
    payOnFacility: boolean;
    complimentary: boolean;
    gstPercentage: string;
    sgstPercentage: string;
    perSlotCharge: string;
    bookingAllowedBefore: TimeConfig;
    advanceBooking: TimeConfig;
    canCancelBefore: TimeConfig;
    allowMultipleSlots: boolean;
    maximumSlots: string;
    facilityBookedTimes: string;
    description: string;
    termsConditions: string;
    cancellationText: string;
    amenities: {
        tv: Amenity;
        whiteboard: Amenity;
        casting: Amenity;
        smartPenForTV: Amenity;
        wirelessCharging: Amenity;
        meetingRoomInventory: Amenity;
    };
    seaterInfo: string;
    floorInfo: string;
    sharedContentInfo: string;
    slots: FacilitySlot[];
}

interface FacilitySetupResponse {
    facility_setup: {
        fac_name: string;
        fac_type: string;
        active: string;
        department_id: number | null;
        app_key: string;
        postpaid: boolean;
        prepaid: boolean;
        pay_on_facility: boolean;
        complementary: boolean;
        gst: string;
        sgst: string;
        facility_charge?: { per_slot_charge: string };
        bb_dhm: TimeConfig;
        ab_dhm: TimeConfig;
        cb_dhm: TimeConfig;
        multi_slot: boolean;
        max_slots: string;
        booking_limit: string;
        description: string;
        terms: string;
        cancellation_policy: string;
        amenity_info: Amenity[];
        seater_info: string;
        location_info: string;
        shared_content: string;
        facility_slots: Array<{
            facility_slot: {
                id: number;
                start_hour: string;
                start_min: string;
                break_start_hour: string;
                break_start_min: string;
                break_end_hour: string;
                break_end_min: string;
                end_hour: string;
                end_min: string;
                max_bookings: string;
                breakminutes_label: number;
                wrap_time: string;
                dayofweek?: string;
            };
        }>;
        cancellation_rules: Array<{
            description: string;
            hour: string;
            min: string;
            day: string;
            deduction?: string;
        }>;
        cover_image?: { document: string };
        documents: Array<{ document: { id: number; document: string } }>;
    };
}

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

export const EditBookingSetupPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const baseUrl = localStorage.getItem("baseUrl") || "";
    const token = localStorage.getItem("token") || "";

    const coverImageRef = useRef<HTMLInputElement>(null);
    const bookingImageRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
    const [selectedBookingFiles, setSelectedBookingFiles] = useState<
        BookingFile[]
    >([]);
    const [imageIdsToRemove, setImageIdsToRemove] = useState<number[]>([]);
    const [additionalOpen, setAdditionalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({
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
        perSlotCharge: "",
        bookingAllowedBefore: { d: "", h: "", m: "" },
        advanceBooking: { d: "", h: "", m: "" },
        canCancelBefore: { d: "", h: "", m: "" },
        allowMultipleSlots: false,
        maximumSlots: "",
        facilityBookedTimes: "",
        description: "",
        termsConditions: "",
        cancellationText: "",
        amenities: {
            tv: { name: "TV", selected: false, tag_id: null },
            whiteboard: { name: "Whiteboard", selected: false, tag_id: null },
            casting: { name: "Casting", selected: false, tag_id: null },
            smartPenForTV: {
                name: "Smart Pen for TV",
                selected: false,
                tag_id: null,
            },
            wirelessCharging: {
                name: "Wireless Charging",
                selected: false,
                tag_id: null,
            },
            meetingRoomInventory: {
                name: "Meeting Room Inventory",
                selected: false,
                tag_id: null,
            },
        },
        seaterInfo: "Select a seater",
        floorInfo: "Select a floor",
        sharedContentInfo: "",
        slots: [
            {
                startTime: { hour: "", minute: "" },
                breakTimeStart: { hour: "", minute: "" },
                breakTimeEnd: { hour: "", minute: "" },
                endTime: { hour: "", minute: "" },
                concurrentSlots: "",
                slotBy: 15,
                wrapTime: "",
            },
        ],
    });

    const [cancellationRules, setCancellationRules] = useState<
        CancellationRule[]
    >([
        {
            description:
                "If user cancels the booking selected hours/days prior to schedule, a percentage of the amount will be deducted",
            time: { type: "Hr", value: "", day: "" },
            deduction: "",
        },
        {
            description:
                "If user cancels the booking selected hours/days prior to schedule, a percentage of the amount will be deducted",
            time: { type: "Hr", value: "", day: "" },
            deduction: "",
        },
        {
            description:
                "If user cancels the booking selected hours/days prior to schedule, a percentage of the amount will be deducted",
            time: { type: "Hr", value: "", day: "" },
            deduction: "",
        },
    ]);

    const fetchDepartments = async () => {
        if (departments.length > 0) return;
        setLoadingDepartments(true);
        try {
            const response = await fetch(`https://${baseUrl}/pms/departments.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            let departmentsList: Department[] = [];
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
            const response = await axios.get<FacilitySetupResponse>(
                `https://${baseUrl}/pms/admin/facility_setups/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const responseData = response.data.facility_setup;

            setFormData({
                facilityName: responseData.fac_name,
                isBookable: responseData.fac_type === "bookable",
                isRequest: responseData.fac_type === "request",
                department: responseData.department_id ?? "", // Set to "" if department_id is null
                appKey: responseData.app_key,
                postpaid: responseData.postpaid,
                prepaid: responseData.prepaid,
                payOnFacility: responseData.pay_on_facility,
                complimentary: responseData.complementary,
                gstPercentage: responseData.gst,
                sgstPercentage: responseData.sgst,
                perSlotCharge: responseData?.facility_charge?.per_slot_charge ?? "",
                bookingAllowedBefore: responseData.bb_dhm,
                advanceBooking: responseData.ab_dhm,
                canCancelBefore: responseData.cb_dhm,
                allowMultipleSlots: responseData.multi_slot,
                maximumSlots: responseData.max_slots,
                facilityBookedTimes: responseData.booking_limit,
                description: responseData.description,
                termsConditions: responseData.terms,
                cancellationText: responseData.cancellation_policy,
                amenities: {
                    tv: {
                        name: "TV",
                        selected: responseData.amenity_info[0]?.selected ?? false,
                        tag_id: responseData.amenity_info[0]?.tag_id ?? null,
                    },
                    whiteboard: {
                        name: "Whiteboard",
                        selected: responseData.amenity_info[1]?.selected ?? false,
                        tag_id: responseData.amenity_info[1]?.tag_id ?? null,
                    },
                    casting: {
                        name: "Casting",
                        selected: responseData.amenity_info[2]?.selected ?? false,
                        tag_id: responseData.amenity_info[2]?.tag_id ?? null,
                    },
                    smartPenForTV: {
                        name: "Smart Pen for TV",
                        selected: responseData.amenity_info[3]?.selected ?? false,
                        tag_id: responseData.amenity_info[3]?.tag_id ?? null,
                    },
                    wirelessCharging: {
                        name: "Wireless Charging",
                        selected: responseData.amenity_info[4]?.selected ?? false,
                        tag_id: responseData.amenity_info[4]?.tag_id ?? null,
                    },
                    meetingRoomInventory: {
                        name: "Meeting Room Inventory",
                        selected: responseData.amenity_info[5]?.selected ?? false,
                        tag_id: responseData.amenity_info[5]?.tag_id ?? null,
                    },
                },
                seaterInfo: responseData.seater_info,
                floorInfo: responseData.location_info,
                sharedContentInfo: responseData.shared_content,
                slots: responseData.facility_slots.map((slot) => ({
                    id: slot.facility_slot.id,
                    startTime: {
                        hour: slot.facility_slot.start_hour,
                        minute: slot.facility_slot.start_min,
                    },
                    breakTimeStart: {
                        hour: slot.facility_slot.break_start_hour,
                        minute: slot.facility_slot.break_start_min,
                    },
                    breakTimeEnd: {
                        hour: slot.facility_slot.break_end_hour,
                        minute: slot.facility_slot.break_end_min,
                    },
                    endTime: {
                        hour: slot.facility_slot.end_hour,
                        minute: slot.facility_slot.end_min,
                    },
                    concurrentSlots: slot.facility_slot.max_bookings,
                    slotBy: slot.facility_slot.breakminutes_label,
                    wrapTime: slot.facility_slot.wrap_time,
                    dayofweek: slot.facility_slot.dayofweek ?? "",
                    _destroy: false,
                })),
            });

            const transformedRules = responseData.cancellation_rules.map((rule) => ({
                description: rule.description,
                time: {
                    type: rule.hour,
                    value: rule.min,
                    day: rule.day,
                },
                deduction: rule.deduction?.toString() ?? "",
            }));

            setCancellationRules([...transformedRules]);

            setSelectedFile(responseData?.cover_image?.document ?? null);
            setSelectedBookingFiles(
                responseData?.documents.map((doc) => ({
                    file: doc.document.document,
                    id: doc.document.id,
                })) ?? []
            );
        } catch (error) {
            console.error("Error fetching facility details:", error);
            toast.error("Failed to fetch facility details");
        }
    };

    useEffect(() => {
        fetchDepartments();
        if (id) {
            fetchFacilityBookingDetails();
        }
    }, [id]);

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (!["image/png", "image/jpeg"].includes(file.type)) {
                toast.error("Only PNG or JPEG files are allowed");
                return;
            }
            if (file.size > maxSize) {
                toast.error("File size must not exceed 5MB");
                return;
            }
        }
        setSelectedFile(file);
    };

    const handleBookingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).map((file) => ({
            file,
            id: null,
        }));
        setSelectedBookingFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleRemoveBookingImage = (index: number, imageId: number | null) => {
        setSelectedBookingFiles((prevFiles) =>
            prevFiles.filter((_, i) => i !== index)
        );
        if (imageId) {
            setImageIdsToRemove((prevIds) => [...prevIds, imageId]);
        }
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

    const validateForm = (): boolean => {
        if (!formData.facilityName) {
            toast.error("Please enter Facility Name");
            return false;
        } else if (!formData.description) {
            toast.error("Please enter Description");
            return false;
        } else if (!formData.termsConditions) {
            toast.error("Please enter Terms and Conditions");
            return false;
        } else if (!formData.cancellationText) {
            toast.error("Please enter Cancellation Policies");
            return false;
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
            if (formData.department) {
                formDataToSend.append(
                    "facility_setup[department_id]",
                    formData.department.toString()
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
            formDataToSend.append(
                "facility_setup[multi_slot]",
                formData.allowMultipleSlots ? "1" : "0"
            );
            formDataToSend.append("facility_setup[max_slots]", formData.maximumSlots);
            formDataToSend.append(
                "facility_setup[booking_limit]",
                formData.facilityBookedTimes
            );
            formDataToSend.append(
                "facility_setup[description]",
                formData.description || ""
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
                JSON.parse(localStorage.getItem("user") || "{}").id?.toString() || ""
            );

            // Append cover image (single file)
            if (selectedFile && typeof selectedFile !== "string") {
                formDataToSend.append("cover_image", selectedFile);
            }

            // Append booking files (multiple files)
            selectedBookingFiles.forEach(({ file }) => {
                if (typeof file !== "string") {
                    formDataToSend.append(`attachments[]`, file);
                }
            });

            // Append image IDs to remove
            imageIdsToRemove.forEach((id) => {
                formDataToSend.append(`image_remove[]`, id.toString());
            });

            let index = 0;
            Object.keys(formData.amenities).forEach((key) => {
                const amenity = formData.amenities[key as keyof FormData["amenities"]];
                if (amenity.tag_id && !amenity.selected) {
                    formDataToSend.append(
                        `facility_setup[generic_tags_attributes][${index}][id]`,
                        amenity.tag_id.toString()
                    );
                    formDataToSend.append(
                        `facility_setup[generic_tags_attributes][${index}][_destroy]`,
                        "1"
                    );
                    index++;
                } else if (amenity.selected) {
                    formDataToSend.append(
                        `facility_setup[generic_tags_attributes][${index}][tag_type]`,
                        "amenity_things"
                    );
                    formDataToSend.append(
                        `facility_setup[generic_tags_attributes][${index}][category_name]`,
                        amenity.name
                    );
                    formDataToSend.append(
                        `facility_setup[generic_tags_attributes][${index}][selected]`,
                        "1"
                    );
                    if (amenity.tag_id) {
                        formDataToSend.append(
                            `facility_setup[generic_tags_attributes][${index}][id]`,
                            amenity.tag_id.toString()
                        );
                    }
                    index++;
                }
            });

            // Facility Slots
            formData.slots.forEach((slot, index) => {
                if (slot.id) {
                    formDataToSend.append(`facility_slots[][id]`, slot.id.toString());
                }
                formDataToSend.append(
                    `facility_slots[][slot_no]`,
                    (index + 1).toString()
                );
                formDataToSend.append(
                    `facility_slots[][dayofweek]`,
                    slot.dayofweek || ""
                );
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
                formDataToSend.append(`facility_slots[][wrap_time]`, slot.wrapTime);
            });

            // Booking Window Configs
            formDataToSend.append("book_before_day", formData.bookingAllowedBefore.d);
            formDataToSend.append(
                "book_before_hour",
                formData.bookingAllowedBefore.h
            );
            formDataToSend.append("book_before_min", formData.bookingAllowedBefore.m);
            formDataToSend.append("advance_booking_day", formData.advanceBooking.d);
            formDataToSend.append("advance_booking_hour", formData.advanceBooking.h);
            formDataToSend.append("advance_booking_min", formData.advanceBooking.m);
            formDataToSend.append("cancel_day", formData.canCancelBefore.d);
            formDataToSend.append("cancel_hour", formData.canCancelBefore.h);
            formDataToSend.append("cancel_min", formData.canCancelBefore.m);

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
                `https://${baseUrl}/pms/admin/facility_setups/${id}.json`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formDataToSend,
                }
            );

            if (response.ok) {
                toast.success("Booking setup updated successfully");
                navigate("/settings/vas/booking/setup");
            } else {
                console.error("Failed to update booking setup:", response.statusText);
                toast.error("Failed to update booking setup");
            }
        } catch (error) {
            console.error("Error updating booking setup:", error);
            toast.error("Error updating booking setup");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        navigate("/settings/vas/booking/setup");
    };

    const addSlot = () => {
        const newSlot: FacilitySlot = {
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
            <div className="px-5 bg-white min-h-screen">
                <div className="bg-white rounded-lg max-w-6xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/settings/vas/booking/setup")}
                        className="mt-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Booking List
                    </Button>
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
                                            setFormData({ ...formData, facilityName: e.target.value })
                                        }
                                        variant="outlined"
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
                                            {departments.map((dept) => (
                                                <MenuItem key={dept.id} value={dept.id}>
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
                        {/* Remaining JSX remains unchanged */}
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
                                                    onChange={(e) => {
                                                        const newSlots = [...formData.slots];
                                                        newSlots[index].startTime.hour = e.target
                                                            .value as string;
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
                                                        newSlots[index].startTime.minute = e.target
                                                            .value as string;
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
                                                        newSlots[index].breakTimeStart.hour = e.target
                                                            .value as string;
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
                                                        newSlots[index].breakTimeStart.minute = e.target
                                                            .value as string;
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
                                                        newSlots[index].breakTimeEnd.hour = e.target
                                                            .value as string;
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
                                                        newSlots[index].breakTimeEnd.minute = e.target
                                                            .value as string;
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
                                                        newSlots[index].endTime.hour = e.target
                                                            .value as string;
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
                                                        newSlots[index].endTime.minute = e.target
                                                            .value as string;
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
                                                    newSlots[index].slotBy = Number(e.target.value);
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
                                            onChange={(e) => {
                                                const newSlots = [...formData.slots];
                                                newSlots[index].wrapTime = e.target.value;
                                                setFormData({ ...formData, slots: newSlots });
                                            }}
                                            value={slot.wrapTime}
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
                                                value={formData.bookingAllowedBefore.d}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        bookingAllowedBefore: {
                                                            ...formData.bookingAllowedBefore,
                                                            d: e.target.value,
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
                                                value={formData.bookingAllowedBefore.h}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        bookingAllowedBefore: {
                                                            ...formData.bookingAllowedBefore,
                                                            h: e.target.value,
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
                                                value={formData.bookingAllowedBefore.m}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        bookingAllowedBefore: {
                                                            ...formData.bookingAllowedBefore,
                                                            m: e.target.value,
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
                                                value={formData.advanceBooking.d}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        advanceBooking: {
                                                            ...formData.advanceBooking,
                                                            d: e.target.value,
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
                                                value={formData.advanceBooking.h}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        advanceBooking: {
                                                            ...formData.advanceBooking,
                                                            h: e.target.value,
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
                                                value={formData.advanceBooking.m}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        advanceBooking: {
                                                            ...formData.advanceBooking,
                                                            m: e.target.value,
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
                                                value={formData.canCancelBefore.d}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        canCancelBefore: {
                                                            ...formData.canCancelBefore,
                                                            d: e.target.value,
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
                                                value={formData.canCancelBefore.h}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        canCancelBefore: {
                                                            ...formData.canCancelBefore,
                                                            h: e.target.value,
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
                                                value={formData.canCancelBefore.m}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        canCancelBefore: {
                                                            ...formData.canCancelBefore,
                                                            m: e.target.value,
                                                        },
                                                    })
                                                }
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
                                        setFormData({ ...formData, perSlotCharge: e.target.value })
                                    }
                                    variant="outlined"
                                />
                            </div>
                        </div>
                        <div className="flex items-start justify-between gap-4">
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
                                            {selectedFile ? "File selected" : "No file chosen"}
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
                                    {selectedFile && (
                                        <div className="mt-4 flex gap-2 flex-wrap">
                                            <img
                                                src={
                                                    typeof selectedFile === "string"
                                                        ? selectedFile
                                                        : URL.createObjectURL(selectedFile)
                                                }
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
                                            {selectedBookingFiles.length > 0
                                                ? "Files selected"
                                                : "No file chosen"}
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
                                        multiple
                                    />
                                    {selectedBookingFiles.length > 0 && (
                                        <div className="mt-4 flex gap-2 flex-wrap">
                                            {selectedBookingFiles.map(({ file, id }, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={
                                                            typeof file === "string"
                                                                ? file
                                                                : URL.createObjectURL(file)
                                                        }
                                                        alt={`cover-preview-${index}`}
                                                        className="h-[80px] w-20 rounded border border-gray-200 bg-cover"
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveBookingImage(index, id)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
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
                        <div className="border rounded-lg">
                            <div
                                className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                                style={{ border: "1px solid #D9D9D9" }}
                            >
                                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    6
                                </div>
                                <h3 className="text-lg font-semibold text-[#C72030]">
                                    DESCRIPTION*
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
                                        TERMS & CONDITIONS*
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
                                        CANCELLATION POLICY*
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
                                                onChange={(e) => {
                                                    const newRules = [...cancellationRules];
                                                    newRules[index].time.day = e.target.value;
                                                    setCancellationRules(newRules);
                                                }}
                                            />
                                            <FormControl size="small" style={{ width: "80px" }}>
                                                <Select
                                                    value={rule.time.type}
                                                    onChange={(e) => {
                                                        const newRules = [...cancellationRules];
                                                        newRules[index].time.type = e.target
                                                            .value as string;
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
                                            <FormControl size="small" style={{ width: "80px" }}>
                                                <Select
                                                    value={rule.time.value}
                                                    onChange={(e) => {
                                                        const newRules = [...cancellationRules];
                                                        newRules[index].time.value = e.target
                                                            .value as string;
                                                        setCancellationRules(newRules);
                                                    }}
                                                >
                                                    {Array.from({ length: 60 }, (_, i) => (
                                                        <MenuItem key={i} value={i.toString()}>
                                                            {i.toString()}
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
                                    <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        10
                                    </div>
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
                                        {Object.keys(formData.amenities).map((key) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={key}
                                                    checked={
                                                        formData.amenities[
                                                            key as keyof FormData["amenities"]
                                                        ].selected
                                                    }
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            amenities: {
                                                                ...formData.amenities,
                                                                [key]: {
                                                                    ...formData.amenities[
                                                                    key as keyof FormData["amenities"]
                                                                    ],
                                                                    selected: !!checked,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <label htmlFor={key}>
                                                    {
                                                        formData.amenities[
                                                            key as keyof FormData["amenities"]
                                                        ].name
                                                    }
                                                </label>
                                            </div>
                                        ))}
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
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        seaterInfo: e.target.value as string,
                                                    })
                                                }
                                                label="Seater Info"
                                            >
                                                <MenuItem value="Select a seater">
                                                    Select a seater
                                                </MenuItem>
                                                {Array.from({ length: 15 }, (_, i) => (
                                                    <MenuItem key={i + 1} value={`${i + 1} Seater`}>
                                                        {i + 1} Seater
                                                    </MenuItem>
                                                ))}
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
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        floorInfo: e.target.value as string,
                                                    })
                                                }
                                                label="Floor Info"
                                            >
                                                <MenuItem value="Select a floor">
                                                    Select a floor
                                                </MenuItem>
                                                {Array.from({ length: 15 }, (_, i) => (
                                                    <MenuItem key={i + 1} value={`${i + 1}th Floor`}>
                                                        {i + 1}th Floor
                                                    </MenuItem>
                                                ))}
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
                                <div className="border rounded-lg">
                                    <div
                                        className="flex items-center gap-2 p-6 bg-[#F6F4EE]"
                                        style={{ border: "1px solid #D9D9D9" }}
                                        id="appKey"
                                    >
                                        <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            15
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
                        <div className="flex gap-4 pt-6 border-t justify-center">
                            <Button
                                onClick={handleSave}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                disabled={isSubmitting}
                            >
                                Update
                            </Button>
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};
