import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Camera, X, Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ticketManagementAPI, UserOption } from '@/services/ticketManagementAPI';

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
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>(undefined);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  // Get mobile number from navigation state if available
  const initialMobileNumber = location.state?.mobileNumber || '9555625186';

  // Field styles for Material-UI components
  const fieldStyles = {
    height: '45px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      height: '45px',
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#C72030',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  const [formData, setFormData] = useState({
    visitorType: 'guest',
    frequency: 'once',
    host: undefined,
    tower: undefined,
    visitPurpose: undefined,
    supportCategory: undefined,
    passNumber: '',
    vehicleNumber: '',
    visitorName: '',
    mobileNumber: initialMobileNumber,
    visitorComingFrom: '',
    remarks: '',
    skipHostApproval: false,
    goodsInwards: false,
    // Days Validity fields
    passValidFrom: '',
    passValidTo: '',
    daysPermitted: {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false
    }
  });

  const [goodsData, setGoodsData] = useState({
    selectType: '',
    category: '',
    modeOfTransport: '',
    lrNumber: '',
    tripId: ''
  });

  const [showGoodsForm, setShowGoodsForm] = useState(false);
  const [items, setItems] = useState([
    { id: 1, selectItem: '', uicInvoiceNo: '', quantity: '' }
  ]);

  const [additionalVisitors, setAdditionalVisitors] = useState<Array<{ id: number; name: string; mobile: string }>>([]);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isPhotoSaved, setIsPhotoSaved] = useState(false);
  const [fmUsers, setFmUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [supportCategories, setSupportCategories] = useState<{ id: number; name: string }[]>([]);
  const [loadingSupportCategories, setLoadingSupportCategories] = useState(false);
  const [itemMovementTypes, setItemMovementTypes] = useState<{ id: number; name: string }[]>([]);
  const [loadingItemMovementTypes, setLoadingItemMovementTypes] = useState(false);
  const [itemTypes, setItemTypes] = useState<{ id: number; name: string }[]>([]);
  const [loadingItemTypes, setLoadingItemTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdditionalVisitors, setShowAdditionalVisitors] = useState(false);

  useEffect(() => {
    // Don't auto-initialize camera, let user choose
    getCameraDevices();
    
    // Fetch FM Users for host dropdown
    fetchFMUsers();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);
    } catch (error) {
      console.error('Error getting camera devices:', error);
    }
  };

  const fetchFMUsers = async () => {
    try {
      setLoadingUsers(true);
      const users = await ticketManagementAPI.getFMUsers();
      setFmUsers(users);
    } catch (error) {
      console.error('Error fetching FM users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      setLoadingBuildings(true);
      const buildingsResponse = await ticketManagementAPI.getBuildings();
      // Handle both array and single building response
      const buildingsData = Array.isArray(buildingsResponse) ? buildingsResponse : buildingsResponse ? [buildingsResponse] : [];
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoadingBuildings(false);
    }
  };

  const fetchSupportCategories = async () => {
    try {
      setLoadingSupportCategories(true);
      const categories = await ticketManagementAPI.getSupportStaffCategories();
      setSupportCategories(categories);
    } catch (error) {
      console.error('Error fetching support staff categories:', error);
    } finally {
      setLoadingSupportCategories(false);
    }
  };

  const fetchItemMovementTypes = async () => {
    try {
      setLoadingItemMovementTypes(true);
      const types = await ticketManagementAPI.getItemMovementTypes();
      setItemMovementTypes(types);
    } catch (error) {
      console.error('Error fetching item movement types:', error);
    } finally {
      setLoadingItemMovementTypes(false);
    }
  };

  const fetchItemTypes = async () => {
    try {
      setLoadingItemTypes(true);
      const items = await ticketManagementAPI.getItemTypes();
      setItemTypes(items);
    } catch (error) {
      console.error('Error fetching item types:', error);
    } finally {
      setLoadingItemTypes(false);
    }
  };

  const initializeCamera = async () => {
    try {
      // Get available cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);

      if (videoDevices.length > 0) {
        const defaultCamera = videoDevices[0].deviceId;
        setSelectedCamera(defaultCamera);
        await startCamera(defaultCamera);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const startCamera = async (deviceId: string) => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
        audio: false
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
      }
    }
  };

  const handleInputChange = (field: string, value: string | boolean | undefined) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Clear conflicting fields when switching visitor types
      if (field === 'visitorType') {
        if (value === 'support') {
          newData.visitPurpose = undefined;
          // Fetch support categories when switching to support staff
          fetchSupportCategories();
        } else {
          newData.supportCategory = undefined;
        }
      }
      
      // Clear days validity data when switching to 'once'
      if (field === 'frequency' && value === 'once') {
        newData.passValidFrom = '';
        newData.passValidTo = '';
        newData.daysPermitted = {
          Sunday: false,
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false
        };
      }
      
      // Fetch buildings when host is selected
      if (field === 'host' && value) {
        fetchBuildings();
      }
      
      // Clear tower when host is cleared
      if (field === 'host' && !value) {
        newData.tower = undefined;
      }
      
      return newData;
    });
  };

  const handleDayPermittedChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      daysPermitted: {
        ...prev.daysPermitted,
        [day]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log('🚀 Submitting visitor form:', formData);
      console.log('📷 Captured photo status:', capturedPhoto ? 'Photo available' : 'No photo captured');
      
      // Prepare visitor data for API
      const visitorApiData = {
        visitorType: formData.visitorType,
        frequency: formData.frequency,
        host: formData.host,
        tower: formData.tower,
        visitPurpose: formData.visitPurpose,
        supportCategory: formData.supportCategory,
        passNumber: formData.passNumber,
        vehicleNumber: formData.vehicleNumber,
        visitorName: formData.visitorName,
        mobileNumber: formData.mobileNumber,
        visitorComingFrom: formData.visitorComingFrom,
        remarks: formData.remarks,
        skipHostApproval: formData.skipHostApproval,
        goodsInwards: formData.goodsInwards,
        passValidFrom: formData.passValidFrom,
        passValidTo: formData.passValidTo,
        daysPermitted: formData.daysPermitted,
        capturedPhoto: capturedPhoto, // This will be passed as gatekeeper[image]
        additionalVisitors: additionalVisitors.filter(visitor => visitor.name && visitor.mobile),
        goodsData: formData.goodsInwards ? goodsData : undefined,
        items: formData.goodsInwards ? items.filter(item => item.selectItem && item.quantity) : undefined
      };
      
      console.log('📤 Sending visitor data:', visitorApiData);
      
      const result = await ticketManagementAPI.createVisitor(visitorApiData);
      
      console.log('✅ Visitor created successfully:', result);
      
      // Show success message or redirect
      alert('Visitor created successfully!');
      navigate('/security/visitor');
      
    } catch (error) {
      console.error('❌ Error creating visitor:', error);
      alert('Failed to create visitor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    startCamera(deviceId);
  };

  const addAdditionalVisitor = () => {
    const newId = additionalVisitors.length > 0 ? Math.max(...additionalVisitors.map(v => v.id)) + 1 : 1;
    setAdditionalVisitors([...additionalVisitors, { id: newId, name: '', mobile: '' }]);
    setShowAdditionalVisitors(true); // Show the additional visitors section
  };

  const removeAdditionalVisitor = (id: number) => {
    const updatedVisitors = additionalVisitors.filter(visitor => visitor.id !== id);
    setAdditionalVisitors(updatedVisitors);
    // Only hide the section if NO visitors remain at all
    if (updatedVisitors.length === 0) {
      setShowAdditionalVisitors(false);
    }
  };

  const updateAdditionalVisitor = (id: number, field: string, value: string) => {
    setAdditionalVisitors(additionalVisitors.map(visitor =>
      visitor.id === id ? { ...visitor, [field]: value } : visitor
    ));
  };

  const handleGoodsInputChange = (field: string, value: string) => {
    setGoodsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { id: newId, selectItem: '', uicInvoiceNo: '', quantity: '' }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleGoodsInwardsChange = (checked: boolean) => {
    handleInputChange('goodsInwards', checked);
    if (checked) {
      setShowGoodsForm(false); // Reset goods form visibility when toggling
      // Fetch both item movement types and item types when goods inwards is enabled
      fetchItemMovementTypes();
      fetchItemTypes();
    }
  };

  const handleCameraClick = () => {
    console.log('handleCameraClick called');
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
    // Photo is already saved in capturedPhoto state
    console.log('Photo saved:', capturedPhoto);
    // Ensure the photo is properly stored for form submission
    if (capturedPhoto) {
      console.log('Photo confirmed for submission');
      setIsPhotoSaved(true); // Hide the buttons and show only the image
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Camera Permission Modal */}
          {showCameraModal && (
            <div className="fixed top-20 left-8 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
              {/* Close Button */}
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCameraModal(false)}
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
                  onClick={() => {
                    if (videoRef.current && canvasRef.current && stream) {
                      const video = videoRef.current;
                      const canvas = canvasRef.current;
                      const ctx = canvas.getContext('2d');

                      canvas.width = video.videoWidth;
                      canvas.height = video.videoHeight;
                      
                      if (ctx) {
                        ctx.drawImage(video, 0, 0);
                        const imageData = canvas.toDataURL('image/jpeg');
                        setCapturedPhoto(imageData);
                        setShowCameraModal(false); // Close modal after capture
                      }
                    }
                  }}
                  className="w-full bg-pink-200 hover:bg-pink-300 text-gray-800 rounded-full"
                >
                  Capture Photo
                </Button>
                <Button
                  onClick={() => {
                    if (videoRef.current && canvasRef.current && stream) {
                      const video = videoRef.current;
                      const canvas = canvasRef.current;
                      const ctx = canvas.getContext('2d');

                      canvas.width = video.videoWidth;
                      canvas.height = video.videoHeight;
                      
                      if (ctx) {
                        ctx.drawImage(video, 0, 0);
                        const imageData = canvas.toDataURL('image/jpeg');
                        setCapturedPhoto(imageData);
                        setShowCameraModal(false); // Close modal after capture
                      }
                    }
                  }}
                  className="w-full bg-pink-200 hover:bg-pink-300 text-gray-800 rounded-full"
                >
                  Allow this time
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCameraModal(false)}
                  className="w-full bg-pink-200 hover:bg-pink-300 text-gray-800 rounded-full border-none"
                >
                  Never allow
                </Button>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* Form Section */}
          <div>
          {/* Camera Section */}
          <div className="flex justify-center mb-6">
            {!capturedPhoto ? (
              <button
                type="button"
                onClick={handleCameraClick}
                className="w-32 h-24 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Camera className="h-8 w-8 text-white" />
              </button>
            ) : (
              <div className="text-center">
                <div className="w-32 h-24 bg-black rounded-lg mb-4 overflow-hidden relative group cursor-pointer">
                  <img 
                    src={capturedPhoto} 
                    alt="Captured photo" 
                    className="w-full h-full object-cover"
                    onClick={!isPhotoSaved ? handleRetakePhoto : undefined}
                  />
                  {!isPhotoSaved && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                {!isPhotoSaved && (
                  <div className="flex gap-2 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRetakePhoto}
                      className="px-3 py-1 text-xs border-gray-300"
                    >
                      Retake
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSavePhoto}
                      className="px-3 py-1 text-xs bg-purple-900 hover:bg-purple-800 text-white"
                    >
                      Save
                    </Button>
                  </div>
                )}
                {isPhotoSaved && (
                  <div className="flex justify-center mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleRetakePhoto}
                      className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
                    >
                      Change Photo
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visitor Type and Frequency */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="guest"
                      name="visitorType"
                      value="guest"
                      checked={formData.visitorType === 'guest'}
                      onChange={(e) => handleInputChange('visitorType', e.target.value)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                    />
                    <label htmlFor="guest" className="text-sm text-gray-700">Guest</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="support"
                      name="visitorType"
                      value="support"
                      checked={formData.visitorType === 'support'}
                      onChange={(e) => handleInputChange('visitorType', e.target.value)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                    />
                    <label htmlFor="support" className="text-sm text-gray-700">Support Staff</label>
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="once"
                      name="frequency"
                      value="once"
                      checked={formData.frequency === 'once'}
                      onChange={(e) => handleInputChange('frequency', e.target.value)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                    />
                    <label htmlFor="once" className="text-sm text-gray-700">Once</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="frequently"
                      name="frequency"
                      value="frequently"
                      checked={formData.frequency === 'frequently'}
                      onChange={(e) => handleInputChange('frequency', e.target.value)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                    />
                    <label htmlFor="frequently" className="text-sm text-gray-700">Frequently</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Host</InputLabel>
                <MuiSelect
                  value={formData.host || ''}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                  label="Host"
                  notched
                  displayEmpty
                  disabled={loadingUsers}
                >
                  <MenuItem value="">{loadingUsers ? "Loading hosts..." : "Select Person To Meet"}</MenuItem>
                  {fmUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </MenuItem>
                  ))}
                  {fmUsers.length === 0 && !loadingUsers && (
                    <MenuItem value="" disabled>
                      No hosts available
                    </MenuItem>
                  )}
                </MuiSelect>
              </FormControl>

              {/* Tower/Building dropdown - Only shown when host is selected */}
              {formData.host && (
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Tower</InputLabel>
                  <MuiSelect
                    value={formData.tower || ''}
                    onChange={(e) => handleInputChange('tower', e.target.value)}
                    label="Tower"
                    notched
                    displayEmpty
                    disabled={loadingBuildings}
                  >
                    <MenuItem value="">{loadingBuildings ? "Loading towers..." : "Select Tower"}</MenuItem>
                    {buildings.map((building) => (
                      <MenuItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </MenuItem>
                    ))}
                    {buildings.length === 0 && !loadingBuildings && (
                      <MenuItem value="" disabled>
                        No towers available
                      </MenuItem>
                    )}
                  </MuiSelect>
                </FormControl>
              )}

              <TextField
                label="Visitor Name"
                placeholder="Enter Visitor Name"
                value={formData.visitorName}
                onChange={(e) => handleInputChange('visitorName', e.target.value)}
                fullWidth
                variant="outlined"
                required
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              {/* Conditional dropdown based on visitor type */}
              {formData.visitorType === 'support' ? (
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Support Category</InputLabel>
                  <MuiSelect
                    value={formData.supportCategory || ''}
                    onChange={(e) => handleInputChange('supportCategory', e.target.value)}
                    label="Support Category"
                    notched
                    displayEmpty
                    disabled={loadingSupportCategories}
                  >
                    <MenuItem value="">{loadingSupportCategories ? "Loading categories..." : "Select Support Category"}</MenuItem>
                    {supportCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                    {supportCategories.length === 0 && !loadingSupportCategories && (
                      <MenuItem value="" disabled>
                        No support categories available
                      </MenuItem>
                    )}
                  </MuiSelect>
                </FormControl>
              ) : (
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Visit Purpose</InputLabel>
                  <MuiSelect
                    value={formData.visitPurpose || ''}
                    onChange={(e) => handleInputChange('visitPurpose', e.target.value)}
                    label="Visit Purpose"
                    notched
                    displayEmpty
                  >
                    <MenuItem value="">Select Purpose Of Visit</MenuItem>
                    <MenuItem value="Courier">Courier</MenuItem>
                    <MenuItem value="Personal">Personal</MenuItem>
                    <MenuItem value="Meeting">Meeting</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                  </MuiSelect>
                </FormControl>
              )}

              <TextField
                label="Mobile Number"
                placeholder="Enter Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                fullWidth
                variant="outlined"
                required
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              <TextField
                label="Pass Number"
                placeholder="Enter Pass Number"
                value={formData.passNumber}
                onChange={(e) => handleInputChange('passNumber', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              <TextField
                label="Visitor Coming From"
                placeholder="Enter Visitor Coming From"
                value={formData.visitorComingFrom}
                onChange={(e) => handleInputChange('visitorComingFrom', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              <TextField
                label="Vehicle Number"
                placeholder="Enter Vehicle Number"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              <TextField
                label="Remarks"
                placeholder="Enter Remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>

            {/* Days Validity Section - Only shown when frequency is 'frequently' */}
            {formData.frequency === 'frequently' && (
              <div className="space-y-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Days Validity</h3>
                
                {/* Pass Valid From and To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Pass Valid From"
                    type="date"
                    value={formData.passValidFrom}
                    onChange={(e) => handleInputChange('passValidFrom', e.target.value)}
                    fullWidth
                    variant="outlined"
                    required={formData.frequency === 'frequently'}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    InputProps={{
                      sx: fieldStyles,
                    }}
                  />
                  
                  <TextField
                    label="Pass Valid To"
                    type="date"
                    value={formData.passValidTo}
                    onChange={(e) => handleInputChange('passValidTo', e.target.value)}
                    fullWidth
                    variant="outlined"
                    required={formData.frequency === 'frequently'}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    InputProps={{
                      sx: fieldStyles,
                    }}
                  />
                </div>

                {/* Days Permitted */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Days Permitted</label>
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(formData.daysPermitted).map(([day, isChecked]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleDayPermittedChange(day, checked as boolean)}
                        />
                        <label htmlFor={`day-${day}`} className="text-sm text-gray-700">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Checkboxes */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skipHost"
                  checked={formData.skipHostApproval}
                  onCheckedChange={(checked) => handleInputChange('skipHostApproval', checked as boolean)}
                />
                <label htmlFor="skipHost" className="text-sm text-gray-700">Skip Host Approval</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="goodsInwards"
                  checked={formData.goodsInwards}
                  onCheckedChange={(checked) => handleGoodsInwardsChange(checked as boolean)}
                />
                <label htmlFor="goodsInwards" className="text-sm text-gray-700">Goods Inwards</label>
              </div>
            </div>

            {/* Goods Inwards Form */}
            {formData.goodsInwards && (
              <div className="border-t pt-6 space-y-6">
                {!showGoodsForm && (
                  <div className="flex justify-start">
                    <Button
                      type="button"
                      onClick={() => setShowGoodsForm(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Goods</span>
                    </Button>
                  </div>
                )}

                {showGoodsForm && (
                  <div className="space-y-6">
                    {/* Goods Form Fields */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{ '& .MuiInputBase-root': fieldStyles }}
                        >
                          <InputLabel shrink>Select Type</InputLabel>
                          <MuiSelect
                            value={goodsData.selectType || ''}
                            onChange={(e) => handleGoodsInputChange('selectType', e.target.value)}
                            label="Select Type"
                            notched
                            displayEmpty
                            disabled={loadingItemMovementTypes}
                          >
                            <MenuItem value="">{loadingItemMovementTypes ? "Loading types..." : "Select Movement Type"}</MenuItem>
                            {itemMovementTypes.map((type) => (
                              <MenuItem key={type.id} value={type.id.toString()}>
                                {type.name}
                              </MenuItem>
                            ))}
                            {itemMovementTypes.length === 0 && !loadingItemMovementTypes && (
                              <MenuItem value="no-types" disabled>
                                No movement types available
                              </MenuItem>
                            )}
                          </MuiSelect>
                        </FormControl>
                      </div>

                      <div>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{ '& .MuiInputBase-root': fieldStyles }}
                        >
                          <InputLabel shrink>Category</InputLabel>
                          <MuiSelect
                            value={goodsData.category || ''}
                            onChange={(e) => handleGoodsInputChange('category', e.target.value)}
                            label="Category"
                            notched
                            displayEmpty
                          >
                            <MenuItem value="">Select Category</MenuItem>
                            <MenuItem value="Spree::User">Permanent Staff</MenuItem>
                            <MenuItem value="SocietyStaff">Temporary Staff</MenuItem>
                            <MenuItem value="Gatekeeper">Visitor</MenuItem>
                            <MenuItem value="Pms::Supplier">Vendor</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>

                      <div>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{ '& .MuiInputBase-root': fieldStyles }}
                        >
                          <InputLabel shrink>Mode of Transport</InputLabel>
                          <MuiSelect
                            value={goodsData.modeOfTransport || ''}
                            onChange={(e) => handleGoodsInputChange('modeOfTransport', e.target.value)}
                            label="Mode of Transport"
                            notched
                            displayEmpty
                          >
                            <MenuItem value="">Mode of Transport</MenuItem>
                            <MenuItem value="By Hand">By Hand</MenuItem>
                            <MenuItem value="By Courier">By Courier</MenuItem>
                            <MenuItem value="By Vehicle">By Vehicle</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>

                      <div>
                        <TextField
                          label="LR Number"
                          placeholder="LR Number"
                          value={goodsData.lrNumber}
                          onChange={(e) => handleGoodsInputChange('lrNumber', e.target.value)}
                          fullWidth
                          variant="outlined"
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                        />
                      </div>

                      <div>
                        <TextField
                          label="Trip Id"
                          placeholder="Trip Id"
                          value={goodsData.tripId}
                          onChange={(e) => handleGoodsInputChange('tripId', e.target.value)}
                          fullWidth
                          variant="outlined"
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                        />
                      </div>
                    </div>

                    {/* Items Section */}
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-3 gap-4 items-end">
                          <div>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              required
                              sx={{ '& .MuiInputBase-root': fieldStyles }}
                            >
                              <InputLabel shrink>Select Item</InputLabel>
                              <MuiSelect
                                value={item.selectItem || ''}
                                onChange={(e) => updateItem(item.id, 'selectItem', e.target.value)}
                                label="Select Item"
                                notched
                                displayEmpty
                                disabled={loadingItemTypes}
                              >
                                <MenuItem value="">{loadingItemTypes ? "Loading items..." : "Select Item Type"}</MenuItem>
                                {itemTypes.map((itemType) => (
                                  <MenuItem key={itemType.id} value={itemType.id.toString()}>
                                    {itemType.name}
                                  </MenuItem>
                                ))}
                                {itemTypes.length === 0 && !loadingItemTypes && (
                                  <MenuItem value="no-items" disabled>
                                    No item types available
                                  </MenuItem>
                                )}
                              </MuiSelect>
                            </FormControl>
                          </div>

                          <div>
                            <TextField
                              label="UIC/Invoice No"
                              placeholder="UIC/Invoice No"
                              value={item.uicInvoiceNo}
                              onChange={(e) => updateItem(item.id, 'uicInvoiceNo', e.target.value)}
                              fullWidth
                              variant="outlined"
                              slotProps={{
                                inputLabel: {
                                  shrink: true,
                                },
                              }}
                              InputProps={{
                                sx: fieldStyles,
                              }}
                            />
                          </div>

                          <div className="flex items-end space-x-2">
                            <div className="flex-1">
                              <TextField
                                label="Quantity"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                fullWidth
                                variant="outlined"
                                slotProps={{
                                  inputLabel: {
                                    shrink: true,
                                  },
                                }}
                                InputProps={{
                                  sx: fieldStyles,
                                }}
                              />
                            </div>
                            {items.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add Item Button */}
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={addItem}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Item</span>
                        </Button>
                      </div>
                    </div>

                    {/* Save Changes Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Visitors - Only show when showAdditionalVisitors is true */}
            {showAdditionalVisitors && (
              <div className="space-y-4">
                {additionalVisitors.map((visitor, index) => (
                  <div key={visitor.id} className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <TextField
                          label="Additional Visitor Name"
                          placeholder="Name"
                          value={visitor.name}
                          onChange={(e) => updateAdditionalVisitor(visitor.id, 'name', e.target.value)}
                          fullWidth
                          variant="outlined"
                          required
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                        />
                      </div>
                      <div className="relative">
                        <div className="flex items-center space-x-2">
                          <TextField
                            label="Mobile"
                            placeholder="Mobile"
                            value={visitor.mobile}
                            onChange={(e) => updateAdditionalVisitor(visitor.id, 'mobile', e.target.value)}
                            fullWidth
                            variant="outlined"
                            required
                            slotProps={{
                              inputLabel: {
                                shrink: true,
                              },
                            }}
                            InputProps={{
                              sx: fieldStyles,
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAdditionalVisitor(visitor.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add More Visitor Button (inside additional visitors section) */}
                <div className="flex justify-start pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAdditionalVisitor}
                    className="text-purple-600 border-purple-600 hover:bg-purple-50 px-4 py-2 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add More Visitor</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Additional Visitor Button (only show when no additional visitors are shown) */}
            {!showAdditionalVisitors && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={addAdditionalVisitor}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Additional Visitor</span>
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-start pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-900 hover:bg-purple-800 text-white px-8 py-3 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </Button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};