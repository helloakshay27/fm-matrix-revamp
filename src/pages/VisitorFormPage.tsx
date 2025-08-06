import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, X, Plus, Trash2 } from 'lucide-react';
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
    mobileNumber: '9555625186',
    visitorComingFrom: '',
    remarks: '',
    skipHostApproval: false,
    goodsInwards: false,
  });

  const [additionalVisitors, setAdditionalVisitors] = useState([
    { id: 1, name: '', mobile: '' },
    { id: 2, name: '', mobile: '' }
  ]);

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

  const addAdditionalVisitor = () => {
    const newId = additionalVisitors.length > 0 ? Math.max(...additionalVisitors.map(v => v.id)) + 1 : 1;
    setAdditionalVisitors([...additionalVisitors, { id: newId, name: '', mobile: '' }]);
  };

  const removeAdditionalVisitor = (id: number) => {
    setAdditionalVisitors(additionalVisitors.filter(visitor => visitor.id !== id));
  };

  const updateAdditionalVisitor = (id: number, field: string, value: string) => {
    setAdditionalVisitors(additionalVisitors.map(visitor =>
      visitor.id === id ? { ...visitor, [field]: value } : visitor
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Camera Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
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
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Host <span className="text-red-500">*</span>
                </label>
                <Select value={formData.host || undefined} onValueChange={(value) => handleInputChange('host', value)}>
                  <SelectTrigger className="w-full">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visitor Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Visitor Name"
                  value={formData.visitorName}
                  onChange={(e) => handleInputChange('visitorName', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visit Purpose <span className="text-red-500">*</span>
                </label>
                <Select value={formData.visitPurpose || undefined} onValueChange={(value) => handleInputChange('visitPurpose', value)}>
                  <SelectTrigger className="w-full">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="9555625186"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pass Number</label>
                <Input
                  placeholder="Pass Number"
                  value={formData.passNumber}
                  onChange={(e) => handleInputChange('passNumber', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Coming From</label>
                <Input
                  placeholder="Visitor Coming From"
                  value={formData.visitorComingFrom}
                  onChange={(e) => handleInputChange('visitorComingFrom', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                <Input
                  placeholder="Vehicle Number"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <Input
                  placeholder="Remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

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
                  onCheckedChange={(checked) => handleInputChange('goodsInwards', checked as boolean)}
                />
                <label htmlFor="goodsInwards" className="text-sm text-gray-700">Goods Inwards</label>
              </div>
            </div>

            {/* Additional Visitors */}
            {additionalVisitors.map((visitor, index) => (
              <div key={visitor.id} className="border-t pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Name"
                      value={visitor.name}
                      onChange={(e) => updateAdditionalVisitor(visitor.id, 'name', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Mobile"
                        value={visitor.mobile}
                        onChange={(e) => updateAdditionalVisitor(visitor.id, 'mobile', e.target.value)}
                        className="w-full"
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

            {/* Additional Visitor Button */}
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

            {/* Submit Button */}
            <div className="flex justify-start pt-4">
              <Button
                type="submit"
                className="bg-purple-900 hover:bg-purple-800 text-white px-8 py-3 font-medium"
              >
                SUBMIT
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};