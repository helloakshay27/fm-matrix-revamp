
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Sample data matching the staff dashboard
const allStaffsData = [
  {
    id: '38969',
    name: 'Avdesh Tiwari',
    firstName: 'Avdesh',
    lastName: 'Tiwari',
    unit: '512',
    department: 'Operations',
    email: 'avdesh.tiwari@example.com',
    mobile: '9987654390',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validFrom: '26/03/2024',
    validTill: '05/04/2024',
    staffId: '',
    password: ''
  },
  {
    id: '37764',
    name: 'Avdesh Tiwari',
    firstName: 'Avdesh',
    lastName: 'Tiwari',
    unit: 'HELP DESK',
    department: 'HR',
    email: 'avdesh.tiwari@vodafoneidea.com',
    mobile: '9876567665',
    workType: 'Vendor',
    vendorName: 'Tech Solutions',
    status: 'Approved',
    validFrom: '26/03/2024',
    validTill: '05/04/2024',
    staffId: 'EMP001',
    password: 'demo@lockated.com'
  },
  {
    id: '37143',
    name: 'Sohail Ansari',
    firstName: 'Sohail',
    lastName: 'Ansari',
    unit: 'HELP DESK',
    department: 'Operations',
    email: 'sohail.ansari@example.com',
    mobile: '7715088437',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validFrom: '26/03/2024',
    validTill: '05/04/2024',
    staffId: 'EMP002',
    password: ''
  },
  {
    id: '36954',
    name: 'Chandan Kumar',
    firstName: 'Chandan',
    lastName: 'Kumar',
    unit: 'Reception',
    department: 'ACCOUNTS',
    email: 'chandanthakur22988@gmail.com',
    mobile: '8489599800',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validFrom: '26/03/2024',
    validTill: '05/04/2024',
    staffId: 'EMP003',
    password: ''
  }
];

interface ScheduleDay {
  day: string;
  enabled: boolean;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

export const EditStaffPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the staff member by ID
  const staff = allStaffsData.find(s => s.id === id);

  const [formData, setFormData] = useState({
    firstName: staff?.firstName || 'twst',
    lastName: staff?.lastName || 'mane',
    email: staff?.email || 'demo@lockated.com',
    password: staff?.password || 'Password',
    mobile: staff?.mobile || '9011376751',
    unit: staff?.unit || '',
    department: staff?.department || '',
    workType: staff?.workType || 'Driver',
    staffId: staff?.staffId || '',
    vendorName: staff?.vendorName || 'Vendor Name',
    validFrom: staff?.validFrom || '',
    validTill: staff?.validTill || '05/04/2024',
    status: staff?.status || ''
  });

  const [schedule, setSchedule] = useState<ScheduleDay[]>([
    { day: 'Monday', enabled: false, startHour: '00', startMinute: '00', endHour: '00', endMinute: '00' },
    { day: 'Tuesday', enabled: true, startHour: '13', startMinute: '00', endHour: '15', endMinute: '00' },
    { day: 'Wednesday', enabled: false, startHour: '00', startMinute: '00', endHour: '00', endMinute: '00' },
    { day: 'Thursday', enabled: false, startHour: '00', startMinute: '00', endHour: '00', endMinute: '00' },
    { day: 'Friday', enabled: false, startHour: '00', startMinute: '00', endHour: '00', endMinute: '00' },
    { day: 'Saturday', enabled: false, startHour: '00', startMinute: '00', endHour: '00', endMinute: '00' },
    { day: 'Sunday', enabled: false, startHour: '00', startMinute: '00', endHour: '00', endMinute: '00' }
  ]);

  const [attachments, setAttachments] = useState({
    profilePicture: null as File | null,
    manuals: null as File | null
  });

  if (!staff) {
    return (
      <div className="p-6 bg-[#f6f4ee] min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Staff Not Found</h2>
          <Button onClick={() => navigate('/security/staff')}>
            Back to Staff List
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/security/staff');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleChange = (dayIndex: number, field: keyof ScheduleDay, value: string | boolean) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, [field]: value } : day
    ));
  };

  const handleFileUpload = (type: keyof typeof attachments, file: File | null) => {
    setAttachments(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    console.log('Schedule:', schedule);
    console.log('Attachments:', attachments);
    toast.success('Staff details updated successfully!');
  };

  const generateHourOptions = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }
    return hours;
  };

  const generateMinuteOptions = () => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i.toString().padStart(2, '0'));
    }
    return minutes;
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <span>Quick Gate</span>
        <span>&gt;</span>
        <span>Society Staff</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 uppercase">SOCIETY STFF</h1>
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="p-6">
          {/* Staff Details Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-bold">👤</span>
              </div>
              <h2 className="text-lg font-semibold text-orange-500 uppercase">STAFF DETAILS</h2>
            </div>

            <div className="grid grid-cols-5 gap-4 mb-6">
              <div>
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="mobile">Mobile*</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512">512</SelectItem>
                    <SelectItem value="help-desk">HELP DESK</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="accounts">ACCOUNTS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="workType">Work Type</Label>
                <Select onValueChange={(value) => handleInputChange('workType', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={formData.workType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="staffId">Staff ID</Label>
                <Input
                  id="staffId"
                  placeholder="Enter Staff ID"
                  value={formData.staffId}
                  onChange={(e) => handleInputChange('staffId', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input
                  id="vendorName"
                  placeholder="Vendor Name"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="validFrom">Valid From*</Label>
                <Input
                  id="validFrom"
                  placeholder="Valid From"
                  value={formData.validFrom}
                  onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="validTill">Valid Till*</Label>
                <Input
                  id="validTill"
                  value={formData.validTill}
                  onChange={(e) => handleInputChange('validTill', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-bold">📎</span>
              </div>
              <h2 className="text-lg font-semibold text-orange-500 uppercase">ATTACHMENTS</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-600 mb-3">Profile Picture Upload</h4>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50">
                  <input
                    type="file"
                    id="profilePicture"
                    className="hidden"
                    onChange={(e) => handleFileUpload('profilePicture', e.target.files?.[0] || null)}
                    accept="image/*"
                  />
                  <label htmlFor="profilePicture" className="cursor-pointer">
                    <div className="text-gray-600">
                      <span>Drag & Drop or </span>
                      <span className="text-orange-600 underline">Choose Files</span>
                      <span> No file chosen</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-3">Manuals Upload</h4>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50">
                  <input
                    type="file"
                    id="manuals"
                    className="hidden"
                    onChange={(e) => handleFileUpload('manuals', e.target.files?.[0] || null)}
                  />
                  <label htmlFor="manuals" className="cursor-pointer">
                    <div className="text-gray-600">
                      <span>Drag & Drop or </span>
                      <span className="text-orange-600 underline">Choose File</span>
                      <span> No file chosen</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-bold">⏰</span>
              </div>
              <h2 className="text-lg font-semibold text-orange-500 uppercase">SCHEDULE</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4 mb-4 font-semibold text-gray-700">
                <div className="text-center">Day</div>
                <div className="text-center">Start Time</div>
                <div className="text-center">End Time</div>
                <div className="text-center">Enable</div>
              </div>

              {schedule.map((scheduleDay, index) => (
                <div key={scheduleDay.day} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-200">
                  <div className="text-center font-medium">
                    {scheduleDay.day}
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <Select 
                      value={scheduleDay.startHour}
                      onValueChange={(value) => handleScheduleChange(index, 'startHour', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {generateHourOptions().map(hour => (
                          <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={scheduleDay.startMinute}
                      onValueChange={(value) => handleScheduleChange(index, 'startMinute', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {generateMinuteOptions().map(minute => (
                          <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <Select 
                      value={scheduleDay.endHour}
                      onValueChange={(value) => handleScheduleChange(index, 'endHour', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {generateHourOptions().map(hour => (
                          <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={scheduleDay.endMinute}
                      onValueChange={(value) => handleScheduleChange(index, 'endMinute', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {generateMinuteOptions().map(minute => (
                          <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-center">
                    <Checkbox
                      checked={scheduleDay.enabled}
                      onCheckedChange={(checked) => handleScheduleChange(index, 'enabled', checked as boolean)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-600">
            Powered by <span className="font-semibold">Pivotal.work</span>
          </p>
        </div>
      </div>
    </div>
  );
};
