import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, X, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export const VisitorFormPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>(undefined);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  const [formData, setFormData] = useState({
    visitorType: 'guest',
    frequency: 'once',
    host: undefined,
    visitPurpose: undefined,
    passNumber: '',
    vehicleNumber: '',
    visitorName: '',
    mobileNumber: '',
    visitorComingFrom: '',
    remarks: '',
    skipHostApproval: false,
    goodsInwards: false,
  });

  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Visitor form submitted:', formData);
    console.log('Captured image:', capturedImage);
    // Handle form submission
    navigate('/security/visitor');
  };

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    startCamera(deviceId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">New Visitor</h1>
            <Button
              variant="ghost"
              onClick={() => navigate('/security/visitor')}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Visitor Type and Frequency */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Visitor Type</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="guest"
                          name="visitorType"
                          value="guest"
                          checked={formData.visitorType === 'guest'}
                          onChange={(e) => handleInputChange('visitorType', e.target.value)}
                          className="text-red-600"
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
                          className="text-red-600"
                        />
                        <label htmlFor="support" className="text-sm text-gray-700">Support Staff</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Frequency</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="once"
                          name="frequency"
                          value="once"
                          checked={formData.frequency === 'once'}
                          onChange={(e) => handleInputChange('frequency', e.target.value)}
                          className="text-red-600"
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
                          className="text-red-600"
                        />
                        <label htmlFor="frequently" className="text-sm text-gray-700">Frequently</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Host *</label>
                    <Select value={formData.host || undefined} onValueChange={(value) => handleInputChange('host', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Person To Meet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Doe</SelectItem>
                        <SelectItem value="jane">Jane Smith</SelectItem>
                        <SelectItem value="bob">Bob Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Visitor Name *</label>
                    <Input
                      placeholder="Visitor Name"
                      value={formData.visitorName}
                      onChange={(e) => handleInputChange('visitorName', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Visit Purpose *</label>
                    <Select value={formData.visitPurpose || undefined} onValueChange={(value) => handleInputChange('visitPurpose', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your Purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Mobile Number *</label>
                    <Input
                      placeholder="9555625186"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Pass Number</label>
                    <Input
                      placeholder="Pass Number"
                      value={formData.passNumber}
                      onChange={(e) => handleInputChange('passNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Visitor Coming From</label>
                    <Input
                      placeholder="Visitor Coming From"
                      value={formData.visitorComingFrom}
                      onChange={(e) => handleInputChange('visitorComingFrom', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Vehicle Number</label>
                    <Input
                      placeholder="Vehicle Number"
                      value={formData.vehicleNumber}
                      onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Remarks</label>
                    <Input
                      placeholder="Remarks"
                      value={formData.remarks}
                      onChange={(e) => handleInputChange('remarks', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center space-x-6">
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
                      onCheckedChange={(checked) => handleInputChange('goodsInwards', checked as boolean)}
                    />
                    <label htmlFor="goodsInwards" className="text-sm text-gray-700">Goods Inwards</label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center space-x-4">
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-8"
                  >
                    Submit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Additional Visitor
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};