import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export const AddStaffPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    unit: '',
    department: '',
    workType: '',
    staffId: '',
    vendorName: '',
    validFrom: '',
    validTill: '',
    status: ''
  });

  const [schedule, setSchedule] = useState({
    monday: { checked: false, startTime: '00', startMinute: '00', endTime: '00', endMinute: '00' },
    tuesday: { checked: false, startTime: '00', startMinute: '00', endTime: '00', endMinute: '00' },
    wednesday: { checked: false, startTime: '00', startMinute: '00', endTime: '00', endMinute: '00' },
    thursday: { checked: false, startTime: '00', startMinute: '00', endTime: '00', endMinute: '00' },
    friday: { checked: false, startTime: '00', startMinute: '00', endTime: '00', endMinute: '00' },
    saturday: { checked: false, startTime: '00', startMinute: '00', endTime: '00', endMinute: '00' },
    sunday: { checked: false, startTime: '00', startMinute: '00', endTime: '00', endMinute: '00' }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (day: string, field: string, value: string | boolean) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSubmit = () => {
    console.log('Staff data:', formData);
    console.log('Schedule:', schedule);
    // Add your submission logic here
    navigate(-1); // Go back to previous page
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => 
    String(i).padStart(2, '0')
  );

  const minuteOptions = ['00', '15', '30', '45'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="mr-4 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add Society Staff</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-8">
          {/* Staff Details Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
              <h3 className="text-lg font-semibold text-[#C72030]">STAFF DETAILS</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">First Name*</Label>
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Last Name*</Label>
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Mobile*</Label>
                <Input
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512">512</SelectItem>
                    <SelectItem value="helpdesk">HELP DESK</SelectItem>
                    <SelectItem value="1110">1110</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="accounts">ACCOUNTS</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Work Type</Label>
                <Select value={formData.workType} onValueChange={(value) => handleInputChange('workType', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]">
                    <SelectValue placeholder="Select Work Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Staff ID</Label>
                <Input
                  placeholder="Enter Staff ID"
                  value={formData.staffId}
                  onChange={(e) => handleInputChange('staffId', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Vendor Name</Label>
                <Input
                  placeholder="Vendor Name"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Valid From*</Label>
                <Input
                  type="date"
                  placeholder="Valid From"
                  value={formData.validFrom}
                  onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Valid Till*</Label>
                <Input
                  type="date"
                  placeholder="Valid Till"
                  value={formData.validTill}
                  onChange={(e) => handleInputChange('validTill', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]">
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
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
              <h3 className="text-lg font-semibold text-[#C72030]">ATTACHMENTS</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Profile Picture Upload</Label>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer">
                  <p className="text-sm text-gray-600">
                    Drag & Drop or <span className="text-orange-500 cursor-pointer font-medium">Choose File</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">No file chosen</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Manuals Upload</Label>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer">
                  <p className="text-sm text-gray-600">
                    Drag & Drop or <span className="text-orange-500 cursor-pointer font-medium">Choose File</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">No file chosen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
              <h3 className="text-lg font-semibold text-[#C72030]">SCHEDULE</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-4 text-left font-medium text-gray-700">Day</th>
                    <th className="border border-gray-200 p-4 text-center font-medium text-gray-700">Start Time</th>
                    <th className="border border-gray-200 p-4 text-center font-medium text-gray-700">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(schedule).map(([day, data]) => (
                    <tr key={day} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={data.checked}
                            onChange={(e) => handleScheduleChange(day, 'checked', e.target.checked)}
                            className="rounded border-gray-300 text-[#C72030] focus:ring-[#C72030]"
                          />
                          <span className="capitalize font-medium text-gray-700">{day}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-4">
                        <div className="flex gap-2 justify-center">
                          <Select 
                            value={data.startTime} 
                            onValueChange={(value) => handleScheduleChange(day, 'startTime', value)}
                          >
                            <SelectTrigger className="w-16 h-8 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="flex items-center text-gray-500">:</span>
                          <Select 
                            value={data.startMinute} 
                            onValueChange={(value) => handleScheduleChange(day, 'startMinute', value)}
                          >
                            <SelectTrigger className="w-16 h-8 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {minuteOptions.map(minute => (
                                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-4">
                        <div className="flex gap-2 justify-center">
                          <Select 
                            value={data.endTime} 
                            onValueChange={(value) => handleScheduleChange(day, 'endTime', value)}
                          >
                            <SelectTrigger className="w-16 h-8 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="flex items-center text-gray-500">:</span>
                          <Select 
                            value={data.endMinute} 
                            onValueChange={(value) => handleScheduleChange(day, 'endMinute', value)}
                          >
                            <SelectTrigger className="w-16 h-8 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {minuteOptions.map(minute => (
                                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-6 border-t border-gray-200">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
