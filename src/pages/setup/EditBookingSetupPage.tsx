import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Armchair, ArrowLeft, BookKey, CalendarDays, ChevronDown, ChevronUp, CreditCard, DollarSign, FileCog, FileImage, Image, LampFloor, MessageSquareX, NotepadText, ReceiptText, Settings, Share2, Tv, Upload, User, X } from "lucide-react";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Radio,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";
import axios from "axios";
import { GalleryImageUpload } from "@/components/GalleryImageUpload";

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
    const { id } = useParams();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const coverImageRef = useRef(null);
    const bookingImageRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedBookingFiles, setSelectedBookingFiles] = useState([]);
    const [imageIdsToRemove, setImageIdsToRemove] = useState([]);
    const [galleryModalOpen, setGalleryModalOpen] = useState(false);
    const [selectedGalleryImages, setSelectedGalleryImages] = useState<any[]>([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState<any[]>([]);
    const [blockDaySlots, setBlockDaySlots] = useState<{ [key: number]: any[] }>({});
    const [additionalOpen, setAdditionalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    const [formData, setFormData] = useState({
        facilityName: "",
        isBookable: true,
        isRequest: false,
        active: "",
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
        chargeSetup: {
            member: { selected: false, adult: "", child: "" },
            guest: { selected: false, adult: "", child: "" },
            minimumPersonAllowed: "1",
            maximumPersonAllowed: "1",
        },
        blockDays: [
            {
                startDate: "",
                endDate: "",
                dayType: "entireDay",
                blockReason: "",
                selectedSlots: [],
            },
        ],
    });

    const [cancellationRules, setCancellationRules] = useState([
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
            const response = await axios.get(
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
                active: responseData.active,
                department: responseData.department_id || "",
                appKey: responseData.app_key,
                postpaid: responseData.postpaid,
                prepaid: responseData.prepaid,
                payOnFacility: responseData.pay_on_facility,
                complimentary: responseData.complementary,
                gstPercentage: responseData.gst,
                sgstPercentage: responseData.sgst,
                perSlotCharge: responseData?.facility_charge?.per_slot_charge,
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
                        selected: responseData.amenity_info[0].selected,
                        tag_id: responseData.amenity_info[0].tag_id
                    },
                    whiteboard: {
                        name: "Whiteboard",
                        selected: responseData.amenity_info[1].selected,
                        tag_id: responseData.amenity_info[1].tag_id
                    },
                    casting: {
                        name: "Casting",
                        selected: responseData.amenity_info[2].selected,
                        tag_id: responseData.amenity_info[2].tag_id
                    },
                    smartPenForTV: {
                        name: "Smart Pen for TV",
                        selected: responseData.amenity_info[3].selected,
                        tag_id: responseData.amenity_info[3].tag_id
                    },
                    wirelessCharging: {
                        name: "Wireless Charging",
                        selected: responseData.amenity_info[4].selected,
                        tag_id: responseData.amenity_info[4].tag_id
                    },
                    meetingRoomInventory: {
                        name: "Meeting Room Inventory",
                        selected: responseData.amenity_info[5].selected,
                        tag_id: responseData.amenity_info[5].tag_id
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
                    dayofweek: slot.facility_slot.dayofweek || "",
                    _destroy: false,
                })),
                chargeSetup: {
                    member: { selected: responseData.facility_charge.adult_member_charge, adult: responseData.facility_charge.adult_member_charge, child: responseData.facility_charge.child_member_charge },
                    guest: { selected: responseData.facility_charge.adult_guest_charge, adult: responseData.facility_charge.adult_guest_charge, child: responseData.facility_charge.child_guest_charge },
                    minimumPersonAllowed: responseData.min_people,
                    maximumPersonAllowed: responseData.max_people,
                },
                blockDays: responseData?.facility_blockings?.map((blocking: any) => ({
                    startDate: blocking.facility_blocking?.ondate || "",
                    endDate: "",
                    dayType: "entireDay",
                    blockReason: blocking.facility_blocking?.reason || "",
                    selectedSlots: [],
                })) || [
                        {
                            startDate: "",
                            endDate: "",
                            dayType: "entireDay",
                            blockReason: "",
                        },
                    ],
            });
            const transformedRules = responseData.cancellation_rules.map((rule) => ({
                description: rule.description,
                time: {
                    type: rule.hour,
                    value: rule.min,
                    day: rule.day,
                },
                deduction: rule.deduction?.toString() || "",
            }));

            setCancellationRules([...transformedRules]);

            setSelectedFile(responseData?.cover_image?.document || null);
            setSelectedBookingFiles(
                responseData?.documents.map((doc) => ({
                    file: doc.document.document,
                    id: doc.document.id
                })) || []
            );

            // Extract gallery images from API response
            const galleryImages: any[] = [];
            const ratioKeys = ['gallery_image_1_by_1', 'gallery_image_16_by_9', 'gallery_image_9_by_16', 'gallery_image_3_by_2'];
            const ratioLabels: { [key: string]: string } = {
                'gallery_image_1_by_1': '1:1',
                'gallery_image_16_by_9': '16:9',
                'gallery_image_9_by_16': '9:16',
                'gallery_image_3_by_2': '3:2'
            };

            ratioKeys.forEach((ratioKey) => {
                const imageArray = responseData?.[ratioKey];
                if (Array.isArray(imageArray) && imageArray.length > 0) {
                    imageArray.forEach((item: any) => {
                        const imageData = item[ratioKey];
                        if (imageData?.document) {
                            galleryImages.push({
                                ratio: ratioLabels[ratioKey],
                                url: imageData.document,
                                doctype: imageData.doctype,
                                fileSize: imageData.document_file_size
                            });
                        }
                    });
                }
            });

            setExistingGalleryImages(galleryImages);
        } catch (error) {
            console.error("Error fetching facility details:", error);
            toast.error("Failed to fetch facility details");
        }
    };

    const handleGalleryModalOpen = () => {
        setGalleryModalOpen(true);
    };

    const handleGalleryModalClose = () => {
        setGalleryModalOpen(false);
    };

    const handleGalleryModalContinue = (galleryImages: any[]) => {
        setSelectedGalleryImages(galleryImages);
        setGalleryModalOpen(false);
    };

    const fetchBlockDaySlots = async (facilityId: string, date: string, blockIndex: number) => {
        try {
            const formattedDate = date.replace(/-/g, '/');
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/facility_setups/${facilityId}/get_schedules.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: {
                        on_date: formattedDate,
                    }
                }
            );

            if (response.data && response.data.slots) {
                setBlockDaySlots(prev => ({
                    ...prev,
                    [blockIndex]: response.data.slots
                }));
            }
        } catch (error) {
            console.error('Error fetching block day slots:', error);
            setBlockDaySlots(prev => ({
                ...prev,
                [blockIndex]: []
            }));
        }
    };

    const addBlockDay = () => {
        const newBlockDay = {
            startDate: "",
            endDate: "",
            dayType: "entireDay",
            blockReason: "",
            selectedSlots: [],
        };
        setFormData({
            ...formData,
            blockDays: [...formData.blockDays, newBlockDay],
        });
    };

    console.log(formData);

    useEffect(() => {
        fetchDepartments();
        fetchFacilityBookingDetails();
    }, [id]);

    const handleCoverImageChange = (e) => {
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

    const handleBookingImageChange = (e) => {
        const files = Array.from(e.target.files || []).map(file => ({
            file,
            id: null
        }));
        setSelectedBookingFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleRemoveBookingImage = (index, imageId) => {
        setSelectedBookingFiles((prevFiles) =>
            prevFiles.filter((_, i) => i !== index)
        );
        if (imageId) {
            setImageIdsToRemove((prevIds) => [...prevIds, imageId]);
        }
    };

    console.log(imageIdsToRemove)

    const triggerFileSelect = () => {
        coverImageRef.current?.click();
    };

    const triggerBookingImgSelect = () => {
        bookingImageRef.current?.click();
    };

    const handleAdditionalOpen = () => {
        setAdditionalOpen(!additionalOpen);
    };

    const validateForm = () => {
        if (!formData.facilityName) {
            toast.error("Please enter Facility Name");
            return false;
        } else if (!formData.active) {
            toast.error("Please select Active");
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
            formDataToSend.append("facility_setup[active]", formData.active);
            // if (formData.department) {
            //     formDataToSend.append(
            //         "facility_setup[department_id]",
            //         formData.department
            //     );
            // }
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
            // formDataToSend.append(
            //     "facility_setup[facility_charge_attributes][per_slot_charge]",
            //     formData.perSlotCharge
            // );

            // Charge Setup - Member charges
            if (formData.chargeSetup.member.selected) {
                formDataToSend.append(
                    "facility_setup[facility_charge_attributes][adult_member_charge]",
                    formData.chargeSetup.member.adult || "0"
                );
            }

            // Charge Setup - Guest charges
            if (formData.chargeSetup.guest.selected) {
                formDataToSend.append(
                    "facility_setup[facility_charge_attributes][adult_guest_charge]",
                    formData.chargeSetup.guest.adult || "0"
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

            // Block Days - Handle multiple block day records
            formData.blockDays.forEach((blockDay, index) => {
                if (blockDay.startDate) {
                    formDataToSend.append(
                        `facility_setup[facility_blockings_attributes][${index}][ondate]`,
                        blockDay.startDate
                    );
                }

                if (blockDay.blockReason) {
                    formDataToSend.append(
                        `facility_setup[facility_blockings_attributes][${index}][reason]`,
                        blockDay.blockReason
                    );
                }

                // Default values for facility blockings
                formDataToSend.append(
                    `facility_setup[facility_blockings_attributes][${index}][order_allowed]`,
                    "false"
                );

                formDataToSend.append(
                    `facility_setup[facility_blockings_attributes][${index}][booking_allowed]`,
                    "false"
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
                JSON.parse(localStorage.getItem("user")).id
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

            // Append gallery images
            selectedGalleryImages.forEach((image: any, index: number) => {
                // Convert aspect ratio to format: 16_by_9, 9_by_16, 1_by_1, 3_by_2
                const ratioKey = image.ratio.replace(':', '_by_');
                formDataToSend.append(
                    `facility_setup[attach_file_${ratioKey}][${index}][file]`,
                    image.file
                );
            });

            // Append image IDs to remove
            imageIdsToRemove.forEach((id) => {
                formDataToSend.append(`image_remove[]`, id);
            });

            let index = 0;
            Object.keys(formData.amenities).forEach((key) => {
                const amenity = formData.amenities[key];
                if (amenity.tag_id && !amenity.selected) {
                    formDataToSend.append(`facility_setup[generic_tags_attributes][${index}][id]`, amenity.tag_id);
                    formDataToSend.append(`facility_setup[generic_tags_attributes][${index}][_destroy]`, "1");
                    index++;
                } else if (amenity.selected) {
                    formDataToSend.append(`facility_setup[generic_tags_attributes][${index}][tag_type]`, "amenity_things");
                    formDataToSend.append(`facility_setup[generic_tags_attributes][${index}][category_name]`, amenity.name);
                    formDataToSend.append(`facility_setup[generic_tags_attributes][${index}][selected]`, "1");
                    if (amenity.tag_id) {
                        formDataToSend.append(`facility_setup[generic_tags_attributes][${index}][id]`, amenity.tag_id);
                    }
                    index++;
                }
            });

            // Facility Slots
            formData.slots.forEach((slot, index) => {
                if (slot.id) {
                    formDataToSend.append(`facility_slots[][id]`, slot.id);
                }
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
                navigate(-1);
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
                                    label="Facility Name*"
                                    placeholder="Enter Facility Name"
                                    value={formData.facilityName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, facilityName: e.target.value })
                                    }
                                    variant="outlined"
                                />
                                {/* <FormControl>
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
                                            {loadingDepartments
                                                ? "Loading..."
                                                : "All"}
                                        </MenuItem>
                                        {Array.isArray(departments) &&
                                            departments.map((dept, index) => (
                                                <MenuItem key={index} value={dept.id}>
                                                    {dept.department_name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl> */}
                            </div>
                            <div className="flex gap-6">
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
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            chargeSetup: {
                                                                ...formData.chargeSetup,
                                                                member: {
                                                                    ...formData.chargeSetup.member,
                                                                    selected: e.target.checked,
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
                                                    onChange={(e) => {
                                                        if (!e.target.checked) {
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
                                                    onChange={(e) => {
                                                        if (!e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                chargeSetup: {
                                                                    ...formData.chargeSetup,
                                                                    member: {
                                                                        ...formData.chargeSetup.member,
                                                                        child: "",
                                                                    },
                                                                },
                                                            });
                                                        }
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
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            chargeSetup: {
                                                                ...formData.chargeSetup,
                                                                guest: {
                                                                    ...formData.chargeSetup.guest,
                                                                    selected: e.target.checked,
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
                                                    onChange={(e) => {
                                                        if (!e.target.checked) {
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
                                                    onChange={(e) => {
                                                        if (!e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                chargeSetup: {
                                                                    ...formData.chargeSetup,
                                                                    guest: {
                                                                        ...formData.chargeSetup.guest,
                                                                        child: "",
                                                                    },
                                                                },
                                                            });
                                                        }
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
                                                    newSlots[index].startTime.hour = e.target.value;
                                                    setFormData({ ...formData, slots: newSlots });
                                                }}
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
                                                onChange={(e) => {
                                                    const newSlots = [...formData.slots];
                                                    newSlots[index].startTime.minute = e.target.value;
                                                    setFormData({ ...formData, slots: newSlots });
                                                }}
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
                                                onChange={(e) => {
                                                    const newSlots = [...formData.slots];
                                                    newSlots[index].breakTimeStart.hour =
                                                        e.target.value;
                                                    setFormData({ ...formData, slots: newSlots });
                                                }}
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
                                                onChange={(e) => {
                                                    const newSlots = [...formData.slots];
                                                    newSlots[index].breakTimeStart.minute =
                                                        e.target.value;
                                                    setFormData({ ...formData, slots: newSlots });
                                                }}
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
                                                onChange={(e) => {
                                                    const newSlots = [...formData.slots];
                                                    newSlots[index].breakTimeEnd.hour = e.target.value;
                                                    setFormData({ ...formData, slots: newSlots });
                                                }}
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
                                                onChange={(e) => {
                                                    const newSlots = [...formData.slots];
                                                    newSlots[index].breakTimeEnd.minute =
                                                        e.target.value;
                                                    setFormData({ ...formData, slots: newSlots });
                                                }}
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
                                                onChange={(e) => {
                                                    const newSlots = [...formData.slots];
                                                    newSlots[index].endTime.hour = e.target.value;
                                                    setFormData({ ...formData, slots: newSlots });
                                                }}
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
                                                onChange={(e) => {
                                                    const newSlots = [...formData.slots];
                                                    newSlots[index].endTime.minute = e.target.value;
                                                    setFormData({ ...formData, slots: newSlots });
                                                }}
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
                                            <MenuItem value={"15 Minutes"}>15 Minutes</MenuItem>
                                            <MenuItem value={"30 Minutes"}>Half hour</MenuItem>
                                            <MenuItem value={"45 Minutes"}>45 Minutes</MenuItem>
                                            <MenuItem value={"60 Minutes"}>1 hour</MenuItem>
                                            <MenuItem value={"90 Minutes"}>
                                                1 and a half hours
                                            </MenuItem>
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
                                {/* <div className="flex flex-col gap-5">
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
                                </div> */}
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                    <CalendarDays className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Block Days</h3>
                            </div>
                            <Button
                                onClick={addBlockDay}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                            >
                                Add
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {[...formData.blockDays].reverse().map((blockDay, reverseIndex) => {
                                const blockIndex = formData.blockDays.length - 1 - reverseIndex;
                                return (
                                    <div key={blockIndex} className="space-y-4 p-4 border rounded-lg">
                                        {formData.blockDays.length > 1 && (
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-semibold">Block Day {blockIndex + 1}</span>
                                                <button
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            blockDays: formData.blockDays.filter((_, idx) => idx !== blockIndex),
                                                        });
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <TextField
                                                label="Date"
                                                type="date"
                                                value={blockDay.startDate}
                                                onChange={(e) => {
                                                    const newBlockDays = [...formData.blockDays];
                                                    newBlockDays[blockIndex].startDate = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        blockDays: newBlockDays,
                                                    });
                                                    // Fetch slots automatically if selectedSlots is active
                                                    if (blockDay.dayType === "selectedSlots" && e.target.value) {
                                                        fetchBlockDaySlots(id!, e.target.value, blockIndex);
                                                    }
                                                }}
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>

                                        <div className="flex gap-6 px-1">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id={`entireDay-${blockIndex}`}
                                                    name={`dayType-${blockIndex}`}
                                                    checked={blockDay.dayType === "entireDay"}
                                                    onChange={() => {
                                                        const newBlockDays = [...formData.blockDays];
                                                        newBlockDays[blockIndex].dayType = "entireDay";
                                                        setFormData({
                                                            ...formData,
                                                            blockDays: newBlockDays,
                                                        });
                                                    }}
                                                    className="text-blue-600"
                                                />
                                                <label htmlFor={`entireDay-${blockIndex}`}>Entire Day</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id={`selectedSlots-${blockIndex}`}
                                                    name={`dayType-${blockIndex}`}
                                                    checked={blockDay.dayType === "selectedSlots"}
                                                    onChange={() => {
                                                        const newBlockDays = [...formData.blockDays];
                                                        newBlockDays[blockIndex].dayType = "selectedSlots";
                                                        setFormData({
                                                            ...formData,
                                                            blockDays: newBlockDays,
                                                        });
                                                    }}
                                                    className="text-blue-600"
                                                />
                                                <label htmlFor={`selectedSlots-${blockIndex}`}>Selected Slots</label>
                                            </div>
                                        </div>

                                        {blockDay.dayType === "selectedSlots" && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-3">Select Slots</h4>
                                                {blockDaySlots[blockIndex]?.length > 0 ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {blockDaySlots[blockIndex].map((slot) => (
                                                            <div key={slot.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`slot-${blockIndex}-${slot.id}`}
                                                                    checked={blockDay.selectedSlots?.includes(slot.id) || false}
                                                                    onChange={(e) => {
                                                                        const newBlockDays = [...formData.blockDays];
                                                                        if ((e.target as HTMLInputElement).checked) {
                                                                            newBlockDays[blockIndex].selectedSlots = [...(blockDay.selectedSlots || []), slot.id];
                                                                        } else {
                                                                            newBlockDays[blockIndex].selectedSlots = (blockDay.selectedSlots || []).filter((id: number) => id !== slot.id);
                                                                        }
                                                                        setFormData({
                                                                            ...formData,
                                                                            blockDays: newBlockDays,
                                                                        });
                                                                    }}
                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                                />
                                                                <label
                                                                    htmlFor={`slot-${blockIndex}-${slot.id}`}
                                                                    className="cursor-pointer text-sm font-medium"
                                                                >
                                                                    {slot.ampm}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : blockDay.startDate ? (
                                                    <p className="text-sm text-gray-500">No slots available for the selected date</p>
                                                ) : (
                                                    <p className="text-sm text-gray-500">Please select a date to fetch available slots</p>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Block Reason</label>
                                            <Textarea
                                                placeholder="Please mention block reason"
                                                value={blockDay.blockReason}
                                                onChange={(e) => {
                                                    const newBlockDays = [...formData.blockDays];
                                                    newBlockDays[blockIndex].blockReason = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        blockDays: newBlockDays,
                                                    });
                                                }}
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
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
                            {/* <TextField
                                label="Per Slot Charge"
                                value={formData.perSlotCharge}
                                onChange={(e) =>
                                    setFormData({ ...formData, perSlotCharge: e.target.value })
                                }
                                variant="outlined"
                            /> */}
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
                            <div
                                className="p-6"
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
                        <div className="bg-white rounded-lg border-2 p-6 space-y-6 w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                    <Image className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Booking Summary Image</h3>
                            </div>
                            <div
                                className="p-6"
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
                                        {selectedBookingFiles.length > 0 ? "Files selected" : "No file chosen"}
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

                    {/* Gallery Images Card */}
                    <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                <Image className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">GALLERY IMAGES</h3>
                        </div>

                        <div
                            onClick={handleGalleryModalOpen}
                            className="border border-dashed rounded-lg p-8 text-center cursor-pointer border-[#C72030] transition-colors hover:bg-[#C72030]/5"
                        >
                            <div className="text-[#C72030] mb-2">
                                <Upload className="h-8 w-8 mx-auto" />
                            </div>
                            <p className="text-sm text-gray-600">
                                Drag & Drop or{" "}
                                <span className="text-[#C72030] cursor-pointer font-medium">
                                    Click to Upload Gallery Images
                                </span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Supports multiple aspect ratios (16:9, 9:16, 1:1, 3:2)
                            </p>
                        </div>

                        {(selectedGalleryImages.length > 0 || existingGalleryImages.length > 0) && (
                            <div className="space-y-6">
                                {existingGalleryImages.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-gray-700">Existing Gallery Images</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-10 gap-3">
                                            {existingGalleryImages.map((image, index) => (
                                                <div key={`existing-${index}`} className="relative group">
                                                    <img
                                                        src={image.url}
                                                        alt={`existing-gallery-${index}`}
                                                        className="h-24 w-24 rounded border border-gray-200 object-fit"
                                                    />
                                                    <div className="absolute top-1 right-1 bg-[#C72030] text-white text-xs font-semibold px-2 py-1 rounded">
                                                        {image.ratio}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {selectedGalleryImages.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-gray-700">New Selected Images</h4>
                                            <span className="text-xs text-gray-500">{selectedGalleryImages.length} image(s)</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {selectedGalleryImages.map((image, index) => (
                                                <div key={`new-${index}`} className="relative group">
                                                    <img
                                                        src={image.preview}
                                                        alt={`gallery-${index}`}
                                                        className="h-24 w-full rounded border border-gray-200 object-cover"
                                                    />
                                                    <div className="absolute top-1 right-1 bg-[#C72030] text-white text-xs font-semibold px-2 py-1 rounded">
                                                        {image.ratio}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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
                                    {Object.keys(formData.amenities).map((key) => (
                                        <div key={key} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={key}
                                                checked={formData.amenities[key].selected}
                                                onCheckedChange={(checked) =>
                                                    setFormData({
                                                        ...formData,
                                                        amenities: {
                                                            ...formData.amenities,
                                                            [key]: {
                                                                ...formData.amenities[key],
                                                                selected: !!checked,
                                                            },
                                                        },
                                                    })
                                                }
                                            />
                                            <label htmlFor={key}>
                                                {formData.amenities[key].name}
                                            </label>
                                        </div>
                                    ))}
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
                            <div className="bg-white rounded-lg border-2 p-6 space-y-6">
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
                            </div> */}
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

            {/* Gallery Image Upload Modal */}
            {galleryModalOpen && (
                <GalleryImageUpload
                    showAsModal={galleryModalOpen}
                    onClose={handleGalleryModalClose}
                    onContinue={handleGalleryModalContinue}
                    label="Upload Gallery Images"
                    description="Upload images supporting multiple aspect ratios."
                    ratios={[
                        { label: '16:9', ratio: 16 / 9, width: 200, height: 112 },
                        { label: '9:16', ratio: 9 / 16, width: 120, height: 213 },
                        { label: '1:1', ratio: 1, width: 150, height: 150 },
                        { label: '3:2', ratio: 3 / 2, width: 180, height: 120 }
                    ]}
                    enableCropping={true}
                    initialImages={selectedGalleryImages}
                    onImagesChange={setSelectedGalleryImages}
                />
            )}
        </ThemeProvider >
    );
};