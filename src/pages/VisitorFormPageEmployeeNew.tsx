import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { Camera, X, Plus, Trash2, User } from "lucide-react";
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import { createExpectedVisitor, getVisitorByMobile, CreateVisitorFormData } from "@/services/visitorAPI";
import { ticketManagementAPI } from "@/services/ticketManagementAPI";

export const VisitorFormPageEmployeeNew = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [selectedCamera, setSelectedCamera] = useState<string | undefined>(undefined);
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
            "& .MuiInputLabel-asterisk": { color: "#C72030 !important" },
        },
        "& .MuiFormLabel-asterisk": { color: "#C72030 !important" },
    };

    const [formData, setFormData] = useState({
        visitorName: "",
        mobileNumber: initialMobileNumber,
        visitorComingFrom: "",
        vehicleNumber: "",
        visitPurpose: "",
        expectedDate: new Date().toISOString().slice(0, 10),
        expectedTime: new Date().toTimeString().slice(0, 5),
        remarks: "",
    });

    const [additionalVisitors, setAdditionalVisitors] = useState<
        Array<{ id: number; name: string; mobile: string }>
    >([]);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAdditionalVisitors, setShowAdditionalVisitors] = useState(false);
    const [visitorInfo, setVisitorInfo] = useState<any>(null);
    const [showVisitorInfo, setShowVisitorInfo] = useState(false);
    const [loadingVisitorInfo, setLoadingVisitorInfo] = useState(false);

    useEffect(() => {
        getCameraDevices();
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (initialMobileNumber && initialMobileNumber.length === 10) {
            fetchVisitorInfo(initialMobileNumber);
        }
    }, [selectedSite?.id]);

    const getCameraDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === "videoinput");
            setCameras(videoDevices);
        } catch (error) {
            console.error("Error getting camera devices:", error);
        }
    };

    const fetchVisitorInfo = async (mobile: string) => {
        if (!mobile || mobile.length !== 10) return;

        setLoadingVisitorInfo(true);
        try {
            // Use selected site from Redux with fallback to user account
            let resourceId = selectedSite?.id?.toString();

            if (!resourceId) {
                console.warn('⚠️ No selected site found, trying to fetch from user account as fallback');
                try {
                    const userAccount = await ticketManagementAPI.getUserAccount();
                    resourceId = userAccount.site_id.toString();
                    console.log('✅ Got user site_id from account:', resourceId);
                } catch (accountError) {
                    console.warn('⚠️ Failed to fetch user account, cannot proceed without site_id');
                    toast.error("Unable to determine site. Please select a site and try again.");
                    setLoadingVisitorInfo(false);
                    return;
                }
            } else {
                console.log('✅ Using selected site_id from Redux:', resourceId);
            }

            console.log('📡 Calling getVisitorByMobile with:', { resourceId, mobile });
            const response = await getVisitorByMobile(resourceId, mobile);
            console.log('📥 API Response:', response);

            if (response && response.gatekeeper) {
                setVisitorInfo(response.gatekeeper);
                setShowVisitorInfo(true);

                // Pre-fill form data
                setFormData(prev => ({
                    ...prev,
                    visitorName: response.gatekeeper.guest_name || prev.visitorName,
                    visitorComingFrom: response.gatekeeper.guest_from || prev.visitorComingFrom,
                    vehicleNumber: response.gatekeeper.guest_vehicle_number || prev.vehicleNumber,
                    visitPurpose: response.gatekeeper.visit_purpose || prev.visitPurpose,
                }));

                toast.success("Visitor information found and loaded!");
            } else {
                setVisitorInfo(null);
                setShowVisitorInfo(false);
                toast.info("No previous visitor information found");
            }
        } catch (error) {
            console.error("❌ Error fetching visitor info:", error);
            setVisitorInfo(null);
            setShowVisitorInfo(false);
        } finally {
            setLoadingVisitorInfo(false);
        }
    };

    const initializeCamera = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === "videoinput");
            setCameras(videoDevices);

            if (videoDevices.length > 0) {
                const defaultCamera = videoDevices[0].deviceId;
                setSelectedCamera(defaultCamera);
                await startCamera(defaultCamera);
            } else {
                toast.error("No camera devices found");
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            toast.error("Camera permission denied or no camera available");
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
                videoRef.current.onloadedmetadata = () => {
                    if (videoRef.current) {
                        videoRef.current.play().catch(console.error);
                    }
                };
            }
        } catch (error) {
            console.error("Error starting camera:", error);
            toast.error("Failed to access camera");
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (field === "mobileNumber" && value.length === 10) {
            fetchVisitorInfo(value);
        } else if (field === "mobileNumber" && value.length < 10) {
            setVisitorInfo(null);
            setShowVisitorInfo(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Validations
        if (!formData.visitorName.trim()) {
            toast.error("Please enter visitor name");
            return;
        }

        if (formData.mobileNumber.length !== 10) {
            toast.error("Mobile number must be 10 digits");
            return;
        }

        if (!formData.visitPurpose) {
            toast.error("Please select visit purpose");
            return;
        }

        // Validate additional visitors
        const invalidAdditionalVisitor = additionalVisitors.find(
            (visitor) =>
                (visitor.name && !visitor.mobile) ||
                (!visitor.name && visitor.mobile) ||
                (visitor.mobile && visitor.mobile.length !== 10)
        );

        if (invalidAdditionalVisitor) {
            toast.error("Please complete all additional visitor details or remove incomplete entries");
            return;
        }

        setIsSubmitting(true);
        try {
            // Use selected site from Redux with fallback to user account
            let resourceId = selectedSite?.id?.toString();

            if (!resourceId) {
                console.warn('⚠️ No selected site found, trying to fetch from user account as fallback');
                try {
                    const userAccount = await ticketManagementAPI.getUserAccount();
                    resourceId = userAccount.site_id.toString();
                    console.log('✅ Got user site_id from account:', resourceId);
                } catch (accountError) {
                    console.warn('⚠️ Failed to fetch user account, cannot proceed without site_id');
                    toast.error("Unable to determine site. Please select a site and try again.");
                    setIsSubmitting(false);
                    return;
                }
            } else {
                console.log('✅ Using selected site_id from Redux:', resourceId);
            }

            console.log('🏢 Using resource_id for visitor creation:', resourceId);

            const visitorData: CreateVisitorFormData = {
                visitorName: formData.visitorName,
                mobileNumber: formData.mobileNumber,
                visitorComingFrom: formData.visitorComingFrom,
                vehicleNumber: formData.vehicleNumber,
                visitPurpose: formData.visitPurpose,
                expectedDate: formData.expectedDate,
                expectedTime: formData.expectedTime,
                remarks: formData.remarks,
                capturedPhoto: capturedPhoto || undefined,
                additionalVisitors: additionalVisitors
                    .filter((v) => v.name && v.mobile)
                    .map((v) => ({ name: v.name, mobile: v.mobile })),
            };

            await createExpectedVisitor(visitorData, resourceId);
            toast.success("Visitor created successfully!");
            navigate("/security/visitor");
        } catch (error) {
            console.error("Error creating visitor:", error);
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
        setAdditionalVisitors([...additionalVisitors, { id: Date.now(), name: "", mobile: "" }]);
        setShowAdditionalVisitors(true);
    };

    const removeAdditionalVisitor = (id: number) => {
        const updated = additionalVisitors.filter((v) => v.id !== id);
        setAdditionalVisitors(updated);
        if (updated.length === 0) setShowAdditionalVisitors(false);
    };

    const updateAdditionalVisitor = (id: number, field: string, value: string) => {
        setAdditionalVisitors(
            additionalVisitors.map((v) => (v.id === id ? { ...v, [field]: value } : v))
        );
    };

    const handleCameraClick = () => {
        setShowCameraModal(true);
        initializeCamera();
    };

    const handleRetakePhoto = () => {
        setCapturedPhoto(null);
        setShowCameraModal(true);
        initializeCamera();
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

                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
                setShowCameraModal(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">CREATE VISITOR</h1>

            {/* Camera Modal */}
            {showCameraModal && (
                <div className="fixed top-20 left-8 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
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
                                    .filter((camera) => camera.deviceId && camera.deviceId.trim() !== "")
                                    .map((camera) => (
                                        <MenuItem key={camera.deviceId} value={camera.deviceId}>
                                            {camera.label || `Camera (${camera.deviceId.slice(0, 4)}:...)`}
                                        </MenuItem>
                                    ))}
                            </MuiSelect>
                        </FormControl>
                    </div>

                    <div className="space-y-2">
                        <Button
                            onClick={handleCaptureAndClose}
                            className="w-full bg-pink-200 hover:bg-pink-300 text-gray-800 rounded-full"
                            disabled={!stream}
                        >
                            Capture Photo
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
                            Cancel
                        </Button>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Visitor Info Display - Shows when previous visitor found */}
                {showVisitorInfo && visitorInfo && (
                    <div className="bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
                        <div className="px-6 py-3 border-b border-blue-200">
                            <h2 className="text-lg font-medium text-blue-900 flex items-center">
                                <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: "#DBEAFE" }}>
                                    <User size={16} color="#1E40AF" />
                                </span>
                                Previous Visitor Information Found
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Visitor Photo */}
                                <div className="flex-shrink-0">
                                    <div className="text-center mb-2">
                                        <h3 className="text-sm font-semibold text-gray-800">Visitor Photo</h3>
                                    </div>
                                    {(visitorInfo?.image || capturedPhoto) ? (
                                        <div className="text-center">
                                            <div className="w-32 h-32 bg-black rounded-lg mb-2 overflow-hidden mx-auto">
                                                <img
                                                    src={capturedPhoto || visitorInfo.image}
                                                    alt="Visitor"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                            </div>
                                            <Button type="button" variant="link" onClick={handleCameraClick} className="text-xs text-gray-600">
                                                Change Photo
                                            </Button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleCameraClick}
                                            className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors mx-auto"
                                        >
                                            <Camera className="h-8 w-8 text-gray-600" />
                                        </button>
                                    )}
                                </div>

                                {/* Visitor Details */}
                                <div className="flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-blue-700">Name</label>
                                            <p className="text-gray-900 font-medium">{visitorInfo.guest_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-blue-700">Mobile</label>
                                            <p className="text-gray-900 font-medium">{visitorInfo.guest_number || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-blue-700">Coming From</label>
                                            <p className="text-gray-900 font-medium">{visitorInfo.guest_from || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-blue-700">Vehicle Number</label>
                                            <p className="text-gray-900 font-medium">{visitorInfo.guest_vehicle_number || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-blue-700">Purpose</label>
                                            <p className="text-gray-900 font-medium">{visitorInfo.visit_purpose || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-4">
                                        ℹ️ Information pre-filled from previous visit. You can modify as needed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Capture Photo Section - When no previous visitor */}
                {!showVisitorInfo && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Capture Image</h3>
                        </div>
                        <div className="flex justify-center">
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
                                    <div className="w-32 h-24 bg-black rounded-lg mb-2 overflow-hidden">
                                        <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
                                    </div>
                                    <Button type="button" variant="link" onClick={handleRetakePhoto} className="text-xs text-gray-600">
                                        Change Photo
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Visitor Details Form */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: "#E5E0D3" }}>
                                <User size={16} color="#C72030" />
                            </span>
                            Visitor Details
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField
                                label="Visitor Name"
                                placeholder="Enter Visitor's Name"
                                value={formData.visitorName}
                                onChange={(e) => handleInputChange("visitorName", e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={fieldStyles}
                            />

                            <TextField
                                label="Mobile Number"
                                placeholder="Enter Mobile No."
                                value={formData.mobileNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    if (value.length <= 10) {
                                        handleInputChange("mobileNumber", value);
                                    }
                                }}
                                fullWidth
                                required
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={fieldStyles}
                                inputProps={{ inputMode: "numeric", pattern: "[0-9]{10}", maxLength: 10 }}
                            />

                            <FormControl fullWidth variant="outlined" required sx={fieldStyles}>
                                <InputLabel shrink>Purpose</InputLabel>
                                <MuiSelect
                                    value={formData.visitPurpose}
                                    onChange={(e) => handleInputChange("visitPurpose", e.target.value)}
                                    label="Purpose"
                                    notched
                                    displayEmpty
                                >
                                    <MenuItem value="">Select Purpose</MenuItem>
                                    <MenuItem value="Personal">Personal</MenuItem>
                                    <MenuItem value="Courier">Courier</MenuItem>
                                    <MenuItem value="Meeting">Meeting</MenuItem>
                                    <MenuItem value="Vendor">Vendor</MenuItem>
                                    <MenuItem value="Delivery">Delivery</MenuItem>
                                </MuiSelect>
                            </FormControl>

                            <TextField
                                label="Coming From"
                                placeholder="Enter Coming From"
                                value={formData.visitorComingFrom}
                                onChange={(e) => handleInputChange("visitorComingFrom", e.target.value)}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={fieldStyles}
                            />

                            <TextField
                                label="Vehicle Number"
                                placeholder="Enter Vehicle Number"
                                value={formData.vehicleNumber}
                                onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={fieldStyles}
                            />

                            <TextField
                                label="Expected Date"
                                type="date"
                                value={formData.expectedDate}
                                onChange={(e) => handleInputChange("expectedDate", e.target.value)}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={fieldStyles}
                            />

                            <TextField
                                label="Expected Time"
                                type="time"
                                value={formData.expectedTime}
                                onChange={(e) => handleInputChange("expectedTime", e.target.value)}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={fieldStyles}
                            />

                            <TextField
                                label="Notes"
                                placeholder="Enter Additional Notes"
                                value={formData.remarks}
                                onChange={(e) => handleInputChange("remarks", e.target.value)}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={fieldStyles}
                                className="md:col-span-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Visitors Section */}
                {showAdditionalVisitors && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-3 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: "#E5E0D3" }}>
                                    <User size={16} color="#C72030" />
                                </span>
                                Additional Visitors
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {additionalVisitors.map((visitor) => (
                                <div key={visitor.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-t pt-4 first:border-t-0 first:pt-0">
                                    <TextField
                                        label="Visitor Name"
                                        placeholder="Enter Name"
                                        value={visitor.name}
                                        onChange={(e) => updateAdditionalVisitor(visitor.id, "name", e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        sx={fieldStyles}
                                    />
                                    <TextField
                                        label="Mobile"
                                        placeholder="Enter Mobile"
                                        value={visitor.mobile}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            if (value.length <= 10) {
                                                updateAdditionalVisitor(visitor.id, "mobile", value);
                                            }
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        sx={fieldStyles}
                                        inputProps={{ inputMode: "numeric", pattern: "[0-9]{10}", maxLength: 10 }}
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
                                <Button type="button" variant="outline" onClick={addAdditionalVisitor}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add More
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {!showAdditionalVisitors && (
                    <div className="flex justify-start">
                        <Button type="button" variant="outline" onClick={addAdditionalVisitor}>
                            <Plus className="h-4 w-4 mr-2" />
                            Additional Visitor
                        </Button>
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-center gap-4 pt-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-red-600 hover:bg-red-700 text-white px-10"
                    >
                        {isSubmitting ? "CREATING..." : "CREATE"}
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
