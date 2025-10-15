import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import {
  Camera,
  X,
  Plus,
  Trash2,
  User,
  CalendarDays,
  Truck,
  Users,
  Upload,
  FileText,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ticketManagementAPI,
  UserOption,
} from "@/services/ticketManagementAPI";
import { useSelector } from 'react-redux';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface Building {
  id: number;
  name: string;
  site_id: string;
}

export const VisitorFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>(
    undefined
  );
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  const initialMobileNumber = location.state?.mobileNumber || "";

  const selectedSite = useSelector((state: any) => state.site.selectedSite);

  const fieldStyles = {
    height: "45px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    "& .MuiOutlinedInput-root": {
      height: "45px",
      "& fieldset": { borderColor: "#ddd" },
      "&:hover fieldset": { borderColor: "#4d494aff" },
      "&.Mui-focused fieldset": { borderColor: "#C72030" },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": { color: "#201f20ff" },
      "& .MuiInputLabel-asterisk": {
        color: "#C72030 !important",
      },
    },
    "& .MuiFormLabel-asterisk": {
      color: "#C72030 !important",
    },
  };

  const [formData, setFormData] = useState({
    visitorType: "guest",
    frequency: "once",
    visitorVisit: "expected",
    host: undefined,
    tower: undefined,
    visitPurpose: undefined,
    supportCategory: undefined,
    passNumber: "",
    vehicleNumber: "",
    visitorName: "",
    mobileNumber: initialMobileNumber,
    visitorComingFrom: "",
    remarks: "",
    expected_at: new Date().toISOString().slice(0, 16),
    skipHostApproval: false,
    goodsInwards: false,
    passValidFrom: "",
    passValidTo: "",
    hostName: "",
    hostMobile: "",
    hostEmail: "",
    visitor_documents: [] as File[],
    daysPermitted: {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    },
  }); const [goodsData, setGoodsData] = useState({
    selectType: "",
    category: "",
    modeOfTransport: "",
    lrNumber: "",
    tripId: "",
  });

  const [showGoodsForm, setShowGoodsForm] = useState(false);
  const [items, setItems] = useState([
    { id: 1, selectItem: "", uicInvoiceNo: "", quantity: "" },
  ]);

  const [additionalVisitors, setAdditionalVisitors] = useState<
    Array<{ id: number; name: string; mobile: string; passNo: string }>
  >([]);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isPhotoSaved, setIsPhotoSaved] = useState(false);
  const [fmUsers, setFmUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [supportCategories, setSupportCategories] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingSupportCategories, setLoadingSupportCategories] =
    useState(false);
  const [itemMovementTypes, setItemMovementTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingItemMovementTypes, setLoadingItemMovementTypes] =
    useState(false);
  const [itemTypes, setItemTypes] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loadingItemTypes, setLoadingItemTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdditionalVisitors, setShowAdditionalVisitors] = useState(false);

  // Visitor info state
  const [visitorInfo, setVisitorInfo] = useState<{
    id: number;
    guest_name: string;
    guest_number: string;
    guest_vehicle_number: string;
    visit_purpose: string;
    otp_verified: number;
    support_staff_id: number | null;
    guest_type: string;
    guest_from: string;
    delivery_service_provider_id: number | null;
    support_staff_category_name: string | null;
    image: string;
    delivery_service_provider_name: string | null;
    delivery_service_provider_icon_url: string | null;
  } | null>(null);
  const [loadingVisitorInfo, setLoadingVisitorInfo] = useState(false);
  const [showVisitorInfo, setShowVisitorInfo] = useState(false);

  useEffect(() => {
    getCameraDevices();
    fetchFMUsers();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setCameras(videoDevices);
    } catch (error) {
      console.error("Error getting camera devices:", error);
    }
  };

  const fetchFMUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await ticketManagementAPI.getFMUsers();
      setFmUsers(users);
    } catch (error) {
      console.error("Error fetching FM users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBuildings = async () => {
    setLoadingBuildings(true);
    try {
      const buildingsResponse = await ticketManagementAPI.getBuildings();
      const buildingsData = Array.isArray(buildingsResponse)
        ? buildingsResponse
        : buildingsResponse
          ? [buildingsResponse]
          : [];
      setBuildings(buildingsData);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    } finally {
      setLoadingBuildings(false);
    }
  };

  const fetchSupportCategories = async () => {
    setLoadingSupportCategories(true);
    try {
      const categories = await ticketManagementAPI.getSupportStaffCategories();
      setSupportCategories(categories);
    } catch (error) {
      console.error("Error fetching support staff categories:", error);
    } finally {
      setLoadingSupportCategories(false);
    }
  };

  const fetchItemMovementTypes = async () => {
    setLoadingItemMovementTypes(true);
    try {
      const types = await ticketManagementAPI.getItemMovementTypes();
      setItemMovementTypes(types);
    } catch (error) {
      console.error("Error fetching item movement types:", error);
    } finally {
      setLoadingItemMovementTypes(false);
    }
  };

  const fetchItemTypes = async () => {
    setLoadingItemTypes(true);
    try {
      const items = await ticketManagementAPI.getItemTypes();
      setItemTypes(items);
    } catch (error) {
      console.error("Error fetching item types:", error);
    } finally {
      setLoadingItemTypes(false);
    }
  };

  const fetchVisitorInfo = async (mobile: string) => {
    if (!mobile || mobile.length !== 10) return;

    console.log('🔍 fetchVisitorInfo called with mobile:', mobile);
    setLoadingVisitorInfo(true);
    try {
      // Use selected site from Redux instead of user account
      let currentUserSiteId = selectedSite?.id?.toString();

      if (!currentUserSiteId) {
        console.warn('⚠️ No selected site found, trying to fetch from user account as fallback');
        try {
          const userAccount = await ticketManagementAPI.getUserAccount();
          currentUserSiteId = userAccount.site_id.toString();
          console.log('✅ Got user site_id from account:', currentUserSiteId);
        } catch (accountError) {
          console.warn('⚠️ Failed to fetch user account, cannot proceed without site_id');
          toast.error("Unable to determine site. Please select a site and try again.");
          return;
        }
      } else {
        console.log('✅ Using selected site_id from Redux:', currentUserSiteId);
      }

      console.log('📡 Calling getVisitorInfo API with:', { resourceId: currentUserSiteId, mobile });
      const response = await ticketManagementAPI.getVisitorInfo(currentUserSiteId, mobile);
      console.log('📥 API Response:', response);

      if (response && response.gatekeeper) {
        console.log('✅ Visitor info found:', response.gatekeeper);
        setVisitorInfo(response.gatekeeper);
        setShowVisitorInfo(true);

        // Pre-fill form data with visitor info
        setFormData(prev => ({
          ...prev,
          visitorName: response.gatekeeper.guest_name || prev.visitorName,
          visitorComingFrom: response.gatekeeper.guest_from || prev.visitorComingFrom,
          vehicleNumber: response.gatekeeper.guest_vehicle_number || prev.vehicleNumber,
          visitPurpose: response.gatekeeper.visit_purpose || prev.visitPurpose,
        }));

        toast.success("Visitor information found and loaded!");
      } else {
        console.log('❌ No visitor info found in response');
        setVisitorInfo(null);
        setShowVisitorInfo(false);
        toast.info("No previous visitor information found for this mobile number.");
      }
    } catch (error) {
      console.error("❌ Error fetching visitor info:", error);
      setVisitorInfo(null);
      setShowVisitorInfo(false);
      toast.error("Failed to fetch visitor information.");
    } finally {
      setLoadingVisitorInfo(false);
    }
  };

  useEffect(() => {
    fetchVisitorInfo(initialMobileNumber);
  }, [selectedSite?.id]);

  const initializeCamera = async () => {
    try {
      // Request camera permissions and get device list
      await navigator.mediaDevices.getUserMedia({ video: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setCameras(videoDevices);

      if (videoDevices.length > 0) {
        const defaultCamera = videoDevices[0].deviceId;
        setSelectedCamera(defaultCamera);
        await startCamera(defaultCamera);
      } else {
        toast.error(
          "No camera devices found. Please connect a camera and try again."
        );
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error(
        "Camera permission denied or no camera available. Please allow camera access and try again."
      );
    }
  };

  const startCamera = async (deviceId: string) => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;

        // Wait for video to load metadata
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        };
      }
    } catch (error) {
      console.error("Error starting camera:", error);
      toast.error(
        "Failed to access camera. Please check permissions and try again."
      );
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "visitorType") {
        newData.visitPurpose =
          value === "support" ? undefined : prev.visitPurpose;
        newData.supportCategory =
          value === "guest" ? undefined : prev.supportCategory;
        if (value === "support") fetchSupportCategories();
      }
      if (field === "visitorVisit") {
        if (value === "unexpected") {
          newData.expected_at = "";
        } else if (value === "expected") {
          if (!newData.expected_at) {
            newData.expected_at = new Date().toISOString().slice(0, 16);
          }
        }
      }
      if (field === "frequency" && value === "once") {
        newData.passValidFrom = "";
        newData.passValidTo = "";
        newData.daysPermitted = {
          Sunday: false,
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
        };
      }
      if (field === "host") {
        if (value) {
          fetchBuildings();
          // Clear host details if switching away from "others"
          if (value !== "others") {
            newData.hostName = "";
            newData.hostMobile = "";
            newData.hostEmail = "";
          }
        } else {
          newData.tower = undefined;
          newData.hostName = "";
          newData.hostMobile = "";
          newData.hostEmail = "";
        }
      }
      if (field === "mobileNumber") {
        console.log('📱 Mobile number changed to:', value, 'Length:', value?.length);
        // Trigger visitor info fetch when mobile number is complete
        if (value && value.length === 10) {
          console.log('✅ Mobile number is 10 digits, triggering fetchVisitorInfo');
          fetchVisitorInfo(value);
        } else {
          console.log('⚠️ Mobile number is not 10 digits, clearing visitor info');
          setVisitorInfo(null);
          setShowVisitorInfo(false);
        }
      }
      return newData;
    });
  };

  const handleDayPermittedChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      daysPermitted: { ...prev.daysPermitted, [day]: checked },
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      // Validate each file
      Array.from(files).forEach((file) => {
        // Check file size (max 5MB per file)
        if (file.size > 5 * 1024 * 1024) {
          invalidFiles.push(`${file.name} - File too large (max 5MB)`);
          return;
        }

        // Check file type (only images and PDFs)
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
          invalidFiles.push(`${file.name} - Invalid file type (only images and PDFs allowed)`);
          return;
        }

        validFiles.push(file);
      });

      // Show error messages for invalid files
      if (invalidFiles.length > 0) {
        invalidFiles.forEach(error => toast.error(error));
      }

      // Add valid files to existing documents
      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          visitor_documents: [...prev.visitor_documents, ...validFiles],
        }));

        if (validFiles.length === 1) {
          toast.success(`File "${validFiles[0].name}" added successfully`);
        } else {
          toast.success(`${validFiles.length} files added successfully`);
        }
      }
    }

    // Reset input value to allow selecting the same files again if needed
    event.target.value = '';
  };

  const removeUploadedFile = (indexToRemove?: number) => {
    setFormData((prev) => ({
      ...prev,
      visitor_documents: indexToRemove !== undefined
        ? prev.visitor_documents.filter((_, index) => index !== indexToRemove)
        : [], // Remove all files if no index specified
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!formData.host) {
      toast.error("Please select a host");
      return;
    }


    // Validate host details if "others" is selected
    if (formData.host === "others") {
      if (!formData.hostName.trim()) {
        toast.error("Please enter host name");
        return;
      }
      if (formData.hostMobile.length !== 10) {
        toast.error("Host mobile number must be 10 digits");
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.hostEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    if (!formData.visitorName.trim()) {
      toast.error("Please enter visitor name");
      return;
    }

    if (formData.mobileNumber.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    if (!formData.passNumber.trim()) {
      toast.error("Please enter Pass number");
      return;
    }

    // if (formData.passNumber.trim().length !== 10) {
    //   toast.error('Pass number must be 10 digits');
    //   return;
    // }

    // if (!formData.vehicleNumber.trim()) {
    //   toast.error("Please enter Vehicle number");
    //   return;
    // }

    if (formData.visitorType === "support" && !formData.supportCategory) {
      toast.error("Please select support category");
      return;
    }

    if (formData.visitorType === "guest" && !formData.visitPurpose) {
      toast.error("Please select visit purpose");
      return;
    }

    if (formData.frequency === "frequently") {
      if (!formData.passValidFrom) {
        toast.error("Please select pass valid from date");
        return;
      }
      if (!formData.passValidTo) {
        toast.error("Please select pass valid to date");
        return;
      }
      const hasSelectedDay = Object.values(formData.daysPermitted).some(
        (day) => day
      );
      if (!hasSelectedDay) {
        toast.error("Please select at least one day for frequent visits");
        return;
      }
    }

    if (formData.goodsInwards && showGoodsForm) {
      if (!goodsData.selectType) {
        toast.error("Please select movement type for goods");
        return;
      }
      if (!goodsData.category) {
        toast.error("Please select category for goods");
        return;
      }
      const hasValidItem = items.some(
        (item) => item.selectItem && item.quantity
      );
      if (!hasValidItem) {
        toast.error("Please add at least one item with quantity");
        return;
      }
    }

    // Check additional visitors validation
    const invalidAdditionalVisitor = additionalVisitors.find(
      (visitor) =>
        (visitor.name && (!visitor.mobile || !visitor.passNo)) ||
        (visitor.mobile && (!visitor.name || !visitor.passNo)) ||
        (visitor.passNo && (!visitor.name || !visitor.mobile)) ||
        (!visitor.name && visitor.mobile) ||
        (!visitor.name && visitor.passNo) ||
        (!visitor.mobile && visitor.passNo)
    );
    if (invalidAdditionalVisitor) {
      toast.error(
        "Please complete all additional visitor details (name, mobile, and pass number) or remove incomplete entries"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare base visitor data
      const baseVisitorData = {
        ...formData,
        capturedPhoto,
        parentGkId: visitorInfo?.id || null,
        additionalVisitors: additionalVisitors.filter(
          (v) => v.name && v.mobile && v.passNo
        ),
        goodsData: formData.goodsInwards ? goodsData : undefined,
        items: formData.goodsInwards
          ? items.filter((i) => i.selectItem && i.quantity)
          : undefined,
      };

      // For unexpected visitors, remove expected_at completely
      let visitorApiData;
      if (formData.visitorVisit === "unexpected") {
        const { expected_at, ...dataWithoutExpectedAt } = baseVisitorData;
        visitorApiData = dataWithoutExpectedAt;
      } else {
        visitorApiData = baseVisitorData;
      }

      console.log("📤 Sending visitor data:", visitorApiData);
      console.log("📋 Visitor visit type:", formData.visitorVisit);
      console.log("� Expected_at field present:", 'expected_at' in visitorApiData);

      // Get site ID from Redux state with fallback
      const siteId = selectedSite?.id?.toString() || '';
      console.log("🏢 Using site ID for visitor creation:", siteId);

      await ticketManagementAPI.createVisitor(visitorApiData, siteId);
      toast.success("Visitor created successfully!");
      navigate("/security/visitor");
    } catch (error) {
      console.error("❌ Error creating visitor:", error);
      toast.error("Failed to create visitor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    startCamera(deviceId);
  };

  const addAdditionalVisitor = () => {
    setAdditionalVisitors([
      ...additionalVisitors,
      { id: Date.now(), name: "", mobile: "", passNo: "" },
    ]);
    setShowAdditionalVisitors(true);
  };

  const removeAdditionalVisitor = (id: number) => {
    const updated = additionalVisitors.filter((v) => v.id !== id);
    setAdditionalVisitors(updated);
    if (updated.length === 0) setShowAdditionalVisitors(false);
  };

  const updateAdditionalVisitor = (
    id: number,
    field: string,
    value: string
  ) => {
    setAdditionalVisitors(
      additionalVisitors.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  const handleGoodsInputChange = (field: string, value: string) => {
    setGoodsData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), selectItem: "", uicInvoiceNo: "", quantity: "" },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleGoodsInwardsChange = (checked: boolean) => {
    handleInputChange("goodsInwards", checked);
    if (checked) {
      setShowGoodsForm(false);
      fetchItemMovementTypes();
      fetchItemTypes();
    }
  };

  const handleCameraClick = () => {
    setShowCameraModal(true);
    initializeCamera();
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setIsPhotoSaved(false);
    setShowCameraModal(true);
    initializeCamera();
  };

  const handleSavePhoto = () => {
    if (capturedPhoto) {
      setIsPhotoSaved(true);
    }
  };

  const handleCaptureAndClose = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedPhoto(imageData);

        // Stop the camera stream
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setShowCameraModal(false);
      }
    }
  };

  const handleAllowThisTime = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedPhoto(imageData);

        // Stop the camera stream
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setShowCameraModal(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">NEW VISITOR</h1>

      {showCameraModal && (
        <div className="fixed top-20 left-8 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Camera</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowCameraModal(false);
                if (stream) {
                  stream.getTracks().forEach((track) => track.stop());
                }
              }}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Camera permissions checkbox */}
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useCamera"
                checked={false}
                readOnly
                className="w-4 h-4"
              />
              <label htmlFor="useCamera" className="text-sm text-gray-700">
                Use available cameras ({cameras.length})
              </label>
            </div>
          </div>

          {/* Camera Preview */}
          <div className="relative mb-4 bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                📹 Preview
              </span>
            </div>
          </div>

          {/* Camera Selection Dropdown */}
          <div className="mb-4">
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Camera</InputLabel>
              <MuiSelect
                value={selectedCamera || ""}
                onChange={(e) => handleCameraChange(e.target.value)}
                label="Select Camera"
                notched
                displayEmpty
              >
                <MenuItem value="">Select Camera</MenuItem>
                {cameras
                  .filter(
                    (camera) => camera.deviceId && camera.deviceId.trim() !== ""
                  )
                  .map((camera) => (
                    <MenuItem key={camera.deviceId} value={camera.deviceId}>
                      {camera.label ||
                        `USB2.0 HD UVC WebCam (${camera.deviceId.slice(
                          0,
                          4
                        )}:...)`}
                    </MenuItem>
                  ))}
              </MuiSelect>
            </FormControl>
          </div>

          {/* Camera Control Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleCaptureAndClose}
              className="w-full bg-pink-200 hover:bg-pink-300 text-gray-800 rounded-full"
              disabled={!stream}
            >
              Capture Photo
            </Button>
            <Button
              onClick={handleAllowThisTime}
              className="w-full bg-pink-200 hover:bg-pink-300 text-gray-800 rounded-full"
              disabled={!stream}
            >
              Allow this time
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowCameraModal(false);
                if (stream) {
                  stream.getTracks().forEach((track) => track.stop());
                }
              }}
              className="w-full bg-pink-200 hover:bg-pink-300 text-gray-800 rounded-full border-none"
            >
              Never allow
            </Button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Visitor Info Display Section - Shows when visitor info is found */}
        {showVisitorInfo && visitorInfo ? (
          // <div className="bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
          //   <div className="px-6 py-3 border-b border-blue-200">
          //     <h2 className="text-lg font-medium text-blue-900 flex items-center">
          //       <span
          //         className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
          //         style={{ backgroundColor: "#DBEAFE" }}
          //       >
          //         <User size={16} color="#1E40AF" />
          //       </span>
          //       Previous Visitor Information Found
          //     </h2>
          //   </div>
          //   <div className="p-6">
          //     <div className="flex flex-col md:flex-row gap-6">
          //       {/* Visitor Image Section */}
          <div className="flex-shrink-0">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Visitor Photo</h3>
            </div>

            {/* Show previous visitor photo directly or captured photo */}
            {(visitorInfo?.image || capturedPhoto) ? (
              <div className="text-center">
                <div className="w-32 h-32 bg-black rounded-lg mb-2 overflow-hidden relative group mx-auto">
                  <img
                    src={capturedPhoto || visitorInfo.image}
                    alt={capturedPhoto ? "Selected photo" : visitorInfo.guest_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                <Button
                  type="button"
                  variant="link"
                  onClick={handleCameraClick}
                  className="text-xs text-gray-600"
                >
                  Change Photo
                </Button>
              </div>
            ) : (
              /* Fallback camera button when no photo is available */
              <button
                type="button"
                onClick={handleCameraClick}
                className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <Camera className="h-8 w-8 text-gray-600" />
              </button>
            )}
          </div>
        ) : (
          /* Default capture photo section - Shows when no visitor info */
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Capture Image</h3>
            </div>
            <div className="flex justify-center mb-6">
              {!capturedPhoto ? (
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Camera className="h-8 w-8 text-gray-600" />
                </button>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-24 bg-black rounded-lg mb-2 overflow-hidden relative group cursor-pointer">
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      className="w-full h-full object-cover"
                      onClick={!isPhotoSaved ? handleRetakePhoto : undefined}
                    />
                    {!isPhotoSaved && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  {!isPhotoSaved ? (
                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRetakePhoto}
                        className="h-8 px-3 text-xs"
                      >
                        Retake
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSavePhoto}
                        className="h-8 px-3 text-xs bg-red-600 hover:bg-red-700 text-white"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleRetakePhoto}
                      className="text-xs text-gray-600"
                    >
                      Change Photo
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visitor Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: "#E5E0D3" }}
              >
                <User size={16} color="#C72030" />
              </span>
              Visitor Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Visitor Visit
                </label>
                <RadioGroup
                  value={formData.visitorVisit}
                  onValueChange={(v) => handleInputChange("visitorVisit", v)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expected" id="expected" />
                    <label htmlFor="expected">Expected</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unexpected" id="unexpected" />
                    <label htmlFor="unexpected">UnExpected</label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Visitor Type
                </label>
                <RadioGroup
                  value={formData.visitorType}
                  onValueChange={(v) => handleInputChange("visitorType", v)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="guest" id="guest" />
                    <label htmlFor="guest">Guest</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="support" id="support" />
                    <label htmlFor="support">Support Staff</label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Frequency
                </label>
                <RadioGroup
                  value={formData.frequency}
                  onValueChange={(v) => handleInputChange("frequency", v)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="once" id="once" />
                    <label htmlFor="once">Once</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frequently" id="frequently" />
                    <label htmlFor="frequently">Frequently</label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              >
                <InputLabel shrink>Host </InputLabel>
                <MuiSelect
                  value={formData.host || ""}
                  onChange={(e) => handleInputChange("host", e.target.value)}
                  label="Host"
                  notched
                  disabled={loadingUsers}
                  displayEmpty
                >
                  <MenuItem value="">
                    {loadingUsers ? "Loading..." : "Select Person To Meet"}
                  </MenuItem>
                  {fmUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </MenuItem>
                  ))}

                  <MenuItem key="others" value="others">
                    Others
                  </MenuItem>
                </MuiSelect>
              </FormControl>

              {/* Host Details Fields - Show when "others" is selected */}
              {formData.host === "others" && (
                <>
                  <TextField
                    label="Host Name"
                    value={formData.hostName}
                    onChange={(e) =>
                      handleInputChange("hostName", e.target.value)
                    }
                    fullWidth
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                  <TextField
                    label="Host Mobile No."
                    value={formData.hostMobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      if (value.length <= 10) {
                        handleInputChange("hostMobile", value);
                      }
                    }}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                    inputProps={{
                      inputMode: "numeric", // shows numeric keyboard on mobile
                      pattern: "[0-9]{10}", // regex for 10 digits
                      maxLength: 10,
                    }}
                  />
                  <TextField
                    label="Host Email ID"
                    value={formData.hostEmail}
                    onChange={(e) =>
                      handleInputChange("hostEmail", e.target.value)
                    }
                    fullWidth
                    type="email"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </>
              )}

              {formData.host && (
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                >
                  <InputLabel shrink>Tower</InputLabel>
                  <MuiSelect
                    value={formData.tower || ""}
                    onChange={(e) => handleInputChange("tower", e.target.value)}
                    label="Tower"
                    notched
                    disabled={loadingBuildings}
                  >
                    <MenuItem value="">
                      {loadingBuildings ? "Loading..." : "Select Tower"}
                    </MenuItem>
                    {buildings.map((b) => (
                      <MenuItem key={b.id} value={b.id.toString()}>
                        {b.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              )}

              <TextField
                label="Visitor Name"
                placeholder="Enter Name"
                value={formData.visitorName}
                onChange={(e) =>
                  handleInputChange("visitorName", e.target.value)
                }
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />

              {formData.visitorType === "support" ? (
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={fieldStyles}
                >
                  <InputLabel shrink>Support Category</InputLabel>
                  <MuiSelect
                    value={formData.supportCategory || ""}
                    onChange={(e) =>
                      handleInputChange("supportCategory", e.target.value)
                    }
                    label="Support Category"
                    notched
                    disabled={loadingSupportCategories}
                  >
                    <MenuItem value="">
                      {loadingSupportCategories
                        ? "Loading..."
                        : "Select Category"}
                    </MenuItem>
                    {supportCategories.map((c) => (
                      <MenuItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              ) : (
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={fieldStyles}
                >
                  <InputLabel shrink>Visit Purpose</InputLabel>
                  <MuiSelect
                    value={formData.visitPurpose || ""}
                    onChange={(e) =>
                      handleInputChange("visitPurpose", e.target.value)
                    }
                    label="Visit Purpose"
                    notched
                    displayEmpty
                  >
                    <MenuItem value="">Select Purpose</MenuItem>
                    <MenuItem value="Courier">Courier</MenuItem>
                    <MenuItem value="Personal">Personal</MenuItem>
                    <MenuItem value="Meeting">Meeting</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                  </MuiSelect>
                </FormControl>
              )}

              <TextField
                label="Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  if (value.length <= 10) {
                    handleInputChange("mobileNumber", value);
                  }
                }}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
                inputProps={{
                  inputMode: "numeric", // shows numeric keyboard on mobile
                  pattern: "[0-9]{10}", // regex for 10 digits
                  maxLength: 10,
                }}
                // helperText={
                //   loadingVisitorInfo 
                //     ? "🔍 Searching for visitor information..." 
                //     : visitorInfo 
                //       ? "✅ Previous visitor information found!" 
                //       : formData.mobileNumber.length === 10 
                //         ? "No previous visitor information found" 
                //         : "Enter 10-digit mobile number"
                // }
                FormHelperTextProps={{
                  style: {
                    color: loadingVisitorInfo
                      ? "#1976d2"
                      : visitorInfo
                        ? "#2e7d32"
                        : "#666666"
                  }
                }}
              />
              <TextField
                label={<>Pass Number<span className="text-red-500">*</span></>}
                value={formData.passNumber}
                placeholder="Enter Pass No."
                onChange={(e) =>
                  handleInputChange("passNumber", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
              <TextField
                label="Coming From"
                placeholder="Enter City Name"
                value={formData.visitorComingFrom}
                onChange={(e) =>
                  handleInputChange("visitorComingFrom", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
              <TextField
                label="Vehicle Number"
                placeholder="Enter Vehicle Number"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  handleInputChange("vehicleNumber", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />

              {/* Expected At field - only show for expected visitors */}
              {formData.visitorVisit === "expected" && (
                <TextField
                  label="Expected At"
                  type="datetime-local"
                  value={formData.expected_at}
                  onChange={(e) =>
                    handleInputChange("expected_at", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                // helperText="Expected arrival date and time"
                />
              )}

              <TextField
                label="Remarks"
                placeholder="Enter Remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />

              {/* Government ID Upload - Multiple Files */}
              <div className="flex flex-col md:col-span-2">
                {/* <label className="text-sm font-medium text-gray-700 mb-2">
                  Government ID
                </label> */}

                {/* Upload Button */}
                <div className="relative mb-3">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="government-id-upload"
                    multiple
                  />
                  <label
                    htmlFor="government-id-upload"
                    className="flex items-center justify-center w-full h-[45px] px-3 py-2 border border-gray-300 rounded-[5px] cursor-pointer hover:border-gray-400 transition-colors bg-white"
                  >
                    <div className="flex items-center">
                      <Upload className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        Upload Government ID Documents
                      </span>
                    </div>
                  </label>
                </div>

                {/* Display uploaded files */}
                {formData.visitor_documents.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
                    {formData.visitor_documents.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between bg-white p-2 rounded border"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <FileText className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeUploadedFile(index);
                          }}
                          className="ml-2 p-1 hover:bg-gray-100 rounded flex-shrink-0"
                          title="Remove file"
                        >
                          <X className="h-3 w-3 text-gray-500" />
                        </button>
                      </div>
                    ))}

                    {/* Clear all button */}
                    {formData.visitor_documents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUploadedFile()}
                        className="text-xs text-red-600 hover:text-red-800 mt-1"
                      >
                        Clear all files
                      </button>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Supports: JPEG, PNG, GIF, PDF (Max 5MB per file, Multiple files allowed)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skipHost"
                  checked={formData.skipHostApproval}
                  onCheckedChange={(c) =>
                    handleInputChange("skipHostApproval", c as boolean)
                  }
                />
                <label htmlFor="skipHost">Skip Host Approval</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="goodsInwards"
                  checked={formData.goodsInwards}
                  onCheckedChange={(c) =>
                    handleGoodsInwardsChange(c as boolean)
                  }
                />
                <label htmlFor="goodsInwards">Goods Inwards</label>
              </div>
            </div>
          </div>
        </div>

        {formData.goodsInwards && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: "#E5E0D3" }}
                >
                  <Truck size={16} color="#C72030" />
                </span>
                Goods Inwards Details
              </h2>
            </div>
            <div className="p-6">
              {!showGoodsForm ? (
                <Button type="button" onClick={() => setShowGoodsForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goods Details
                </Button>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      required
                      sx={fieldStyles}
                    >
                      <InputLabel shrink>Movement Type</InputLabel>
                      <MuiSelect
                        value={goodsData.selectType}
                        onChange={(e) =>
                          handleGoodsInputChange("selectType", e.target.value)
                        }
                        label="Movement Type"
                        notched
                        disabled={loadingItemMovementTypes}
                      >
                        <MenuItem value="">
                          {loadingItemMovementTypes
                            ? "Loading..."
                            : "Select Type"}
                        </MenuItem>
                        {itemMovementTypes.map((t) => (
                          <MenuItem key={t.id} value={t.id.toString()}>
                            {t.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      required
                      sx={fieldStyles}
                    >
                      <InputLabel shrink>Category</InputLabel>
                      <MuiSelect
                        value={goodsData.category}
                        onChange={(e) =>
                          handleGoodsInputChange("category", e.target.value)
                        }
                        label="Category"
                        notched
                      >
                        <MenuItem value="">Select Category</MenuItem>
                        <MenuItem value="Spree::User">Permanent Staff</MenuItem>
                        <MenuItem value="SocietyStaff">
                          Temporary Staff
                        </MenuItem>
                        <MenuItem value="Gatekeeper">Visitor</MenuItem>
                        <MenuItem value="Pms::Supplier">Vendor</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                      <InputLabel shrink>Mode of Transport</InputLabel>
                      <MuiSelect
                        value={goodsData.modeOfTransport}
                        onChange={(e) =>
                          handleGoodsInputChange(
                            "modeOfTransport",
                            e.target.value
                          )
                        }
                        label="Mode of Transport"
                        notched
                      >
                        <MenuItem value="">Select Mode</MenuItem>
                        <MenuItem value="By Hand">By Hand</MenuItem>
                        <MenuItem value="By Courier">By Courier</MenuItem>
                        <MenuItem value="By Vehicle">By Vehicle</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="LR Number"
                      value={goodsData.lrNumber}
                      onChange={(e) =>
                        handleGoodsInputChange("lrNumber", e.target.value)
                      }
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Trip ID"
                      value={goodsData.tripId}
                      onChange={(e) =>
                        handleGoodsInputChange("tripId", e.target.value)
                      }
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Items</h4>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                      >
                        <FormControl
                          fullWidth
                          variant="outlined"
                          required
                          sx={fieldStyles}
                        >
                          <InputLabel shrink>Item</InputLabel>
                          <MuiSelect
                            value={item.selectItem}
                            onChange={(e) =>
                              updateItem(item.id, "selectItem", e.target.value)
                            }
                            label="Item"
                            notched
                            disabled={loadingItemTypes}
                          >
                            <MenuItem value="">
                              {loadingItemTypes ? "Loading..." : "Select Item"}
                            </MenuItem>
                            {itemTypes.map((it) => (
                              <MenuItem key={it.id} value={it.id.toString()}>
                                {it.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                        <TextField
                          label="UIC/Invoice No"
                          value={item.uicInvoiceNo}
                          onChange={(e) =>
                            updateItem(item.id, "uicInvoiceNo", e.target.value)
                          }
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={fieldStyles}
                        />
                        <div className="flex items-center space-x-2">
                          <TextField
                            label="Quantity"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", e.target.value)
                            }
                            fullWidth
                            required
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            sx={fieldStyles}
                          />
                          {items.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" onClick={addItem}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {formData.frequency === "frequently" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: "#E5E0D3" }}
                >
                  <CalendarDays size={16} color="#C72030" />
                </span>
                Visit Schedule
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  label="Pass Valid From"
                  type="date"
                  value={formData.passValidFrom}
                  onChange={(e) =>
                    handleInputChange("passValidFrom", e.target.value)
                  }
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
                <TextField
                  label="Pass Valid To"
                  type="date"
                  value={formData.passValidTo}
                  onChange={(e) =>
                    handleInputChange("passValidTo", e.target.value)
                  }
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Days Permitted
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(formData.daysPermitted).map(
                    ([day, isChecked]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={isChecked}
                          onCheckedChange={(c) =>
                            handleDayPermittedChange(day, c as boolean)
                          }
                        />
                        <label htmlFor={`day-${day}`}>{day}</label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showAdditionalVisitors && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: "#E5E0D3" }}
                >
                  <Users size={16} color="#C72030" />
                </span>
                Additional Visitors
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {additionalVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-t pt-4 first:border-t-0 first:pt-0"
                >
                  <TextField
                    label="Visitor Name"
                    value={visitor.name}
                    onChange={(e) =>
                      updateAdditionalVisitor(
                        visitor.id,
                        "name",
                        e.target.value
                      )
                    }
                    fullWidth
                    // required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  // sx={fieldStyles}
                  />
                  <TextField
                    label="Mobile"
                    value={visitor.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // remove non-numeric characters
                      if (value.length <= 10) {
                        updateAdditionalVisitor(visitor.id, "mobile", value);
                      }
                    }}
                    fullWidth
                    // required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    // sx={fieldStyles}
                    inputProps={{
                      inputMode: "numeric", // shows numeric keyboard on mobile
                      pattern: "[0-9]{10}", // regex for 10 digits
                      maxLength: 10,
                    }}
                  />
                  <TextField
                    label="Pass No."
                    value={visitor.passNo}
                    onChange={(e) =>
                      updateAdditionalVisitor(
                        visitor.id,
                        "passNo",
                        e.target.value
                      )
                    }
                    fullWidth
                    // required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  // sx={fieldStyles}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAdditionalVisitor(visitor.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-start pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAdditionalVisitor}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More
                </Button>
              </div>
            </div>
          </div>
        )}

        {!showAdditionalVisitors && (
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={addAdditionalVisitor}
            >
              <Plus className="h-4 w-4 mr-2" />
              Additional Visitor
            </Button>
          </div>
        )}

        <div className="flex justify-center gap-4 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white px-10"
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/security/visitor")}
            className="px-10"
          >
            CANCEL
          </Button>
        </div>
      </form>
    </div>
  );
};
