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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ticketManagementAPI,
  UserOption,
} from "@/services/ticketManagementAPI";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  const initialMobileNumber = location.state?.mobileNumber || "9555625186";

  const fieldStyles = {
    height: "45px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    "& .MuiOutlinedInput-root": {
      height: "45px",
      "& fieldset": { borderColor: "#ddd" },
      "&:hover fieldset": { borderColor: "#C72030" },
      "&.Mui-focused fieldset": { borderColor: "#C72030" },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": { color: "#C72030" },
    },
  };

  const [formData, setFormData] = useState({
    visitorType: "guest",
    frequency: "once",
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
    skipHostApproval: false,
    goodsInwards: false,
    passValidFrom: "",
    passValidTo: "",
    daysPermitted: {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    },
  });

  const [goodsData, setGoodsData] = useState({
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
    Array<{ id: number; name: string; mobile: string }>
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
        alert("No camera devices found. Please connect a camera and try again.");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera permission denied or no camera available. Please allow camera access and try again.");
    }
  };

  const startCamera = async (deviceId: string) => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: false
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
      alert("Failed to access camera. Please check permissions and try again.");
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
        if (value) fetchBuildings();
        else newData.tower = undefined;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const visitorApiData = {
        ...formData,
        capturedPhoto,
        additionalVisitors: additionalVisitors.filter(
          (v) => v.name && v.mobile
        ),
        goodsData: formData.goodsInwards ? goodsData : undefined,
        items: formData.goodsInwards
          ? items.filter((i) => i.selectItem && i.quantity)
          : undefined,
      };
      console.log("📤 Sending visitor data:", visitorApiData);
      await ticketManagementAPI.createVisitor(visitorApiData);
      alert("Visitor created successfully!");
      navigate("/security/visitor");
    } catch (error) {
      console.error("❌ Error creating visitor:", error);
      alert("Failed to create visitor. Please try again.");
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
      { id: Date.now(), name: "", mobile: "" },
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
        stream.getTracks().forEach(track => track.stop());
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
        stream.getTracks().forEach(track => track.stop());
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
                  stream.getTracks().forEach(track => track.stop());
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

          {/* Capture Image Label */}
          <div className="text-center mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
            <span className="text-lg text-blue-800 font-bold">Capture Image</span>
          </div>

          {/* Camera Selection Dropdown */}
          <div className="mb-4">
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ '& .MuiInputBase-root': fieldStyles }}
            >
              <InputLabel shrink>Select Camera</InputLabel>
              <MuiSelect
                value={selectedCamera || ''}
                onChange={(e) => handleCameraChange(e.target.value)}
                label="Select Camera"
                notched
                displayEmpty
              >
                <MenuItem value="">Select Camera</MenuItem>
                {cameras.filter(camera => camera.deviceId && camera.deviceId.trim() !== '').map((camera) => (
                  <MenuItem key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `USB2.0 HD UVC WebCam (${camera.deviceId.slice(0, 4)}:...)`}
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
                  stream.getTracks().forEach(track => track.stop());
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

      <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
                sx={{ "& .MuiInputBase-root": fieldStyles }}
              >
                <InputLabel shrink>Host </InputLabel>
                <MuiSelect
                  value={formData.host || ""}
                  onChange={(e) => handleInputChange("host", e.target.value)}
                  label="Host"
                  notched
                  disabled={loadingUsers}
                >
                  <MenuItem value="">
                    {loadingUsers ? "Loading..." : "Select Person To Meet"}
                  </MenuItem>
                  {fmUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {formData.host && (
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
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
                value={formData.visitorName}
                onChange={(e) =>
                  handleInputChange("visitorName", e.target.value)
                }
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />

              {formData.visitorType === "support" ? (
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
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
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Visit Purpose</InputLabel>
                  <MuiSelect
                    value={formData.visitPurpose || ""}
                    onChange={(e) =>
                      handleInputChange("visitPurpose", e.target.value)
                    }
                    label="Visit Purpose"
                    notched
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
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                inputProps={{
                  inputMode: "numeric", // shows numeric keyboard on mobile
                  pattern: "[0-9]{10}", // regex for 10 digits
                  maxLength: 10,
                }}
              />
              <TextField
                label="Pass Number"
                value={formData.passNumber}
                onChange={(e) =>
                  handleInputChange("passNumber", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Coming From"
                value={formData.visitorComingFrom}
                onChange={(e) =>
                  handleInputChange("visitorComingFrom", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Vehicle Number"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  handleInputChange("vehicleNumber", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
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
                      sx={{ "& .MuiInputBase-root": fieldStyles }}
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
                      sx={{ "& .MuiInputBase-root": fieldStyles }}
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
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ "& .MuiInputBase-root": fieldStyles }}
                    >
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
                      InputProps={{ sx: fieldStyles }}
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
                      InputProps={{ sx: fieldStyles }}
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
                          sx={{ "& .MuiInputBase-root": fieldStyles }}
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
                          InputProps={{ sx: fieldStyles }}
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
                            InputProps={{ sx: fieldStyles }}
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
                  InputProps={{ sx: fieldStyles }}
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
                  InputProps={{ sx: fieldStyles }}
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
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-t pt-4 first:border-t-0 first:pt-0"
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
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                  <div className="flex items-center space-x-2 md:col-span-2">
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
                      required
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      inputProps={{
                        inputMode: "numeric", // shows numeric keyboard on mobile
                        pattern: "[0-9]{10}", // regex for 10 digits
                        maxLength: 10,
                      }}
                    />

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