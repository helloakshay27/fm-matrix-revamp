
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStaffModal = ({ isOpen, onClose }: AddStaffModalProps) => {
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
    onClose();
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => 
    String(i).padStart(2, '0')
  );

  const minuteOptions = ['00', '15', '30', '45'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <DialogTitle className="text-lg font-semibold">SOCIETY STAFF</DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-8">
          {/* Staff Details Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">1</div>
              <h3 className="text-lg font-semibold text-primary">STAFF DETAILS</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">First Name*</Label>
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Last Name*</Label>
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mobile*</Label>
                <Input
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger className="border-gray-300">
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
                <Label className="text-sm font-medium">Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger className="border-gray-300">
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
                <Label className="text-sm font-medium">Work Type</Label>
                <Select value={formData.workType} onValueChange={(value) => handleInputChange('workType', value)}>
                  <SelectTrigger className="border-gray-300">
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
                <Label className="text-sm font-medium">Staff ID</Label>
                <Input
                  placeholder="Enter Staff ID"
                  value={formData.staffId}
                  onChange={(e) => handleInputChange('staffId', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Vendor Name</Label>
                <Input
                  placeholder="Vendor Name"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Valid From*</Label>
                <Input
                  placeholder="Valid From"
                  value={formData.validFrom}
                  onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Valid Till*</Label>
                <Input
                  placeholder="Valid Till"
                  value={formData.validTill}
                  onChange={(e) => handleInputChange('validTill', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-gray-300">
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">2</div>
              <h3 className="text-lg font-semibold text-primary">ATTACHMENTS</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Profile Picture Upload</Label>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                  <p className="text-sm text-gray-600">
                    Drag & Drop or <span className="text-orange-500 cursor-pointer">Choose File</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">No file chosen</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Manuals Upload</Label>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                  <p className="text-sm text-gray-600">
                    Drag & Drop or <span className="text-orange-500 cursor-pointer">Choose File</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">No file chosen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">3</div>
              <h3 className="text-lg font-semibold text-primary">SCHEDULE</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-3 text-left">Day</th>
                    <th className="border border-gray-200 p-3 text-center">Start Time</th>
                    <th className="border border-gray-200 p-3 text-center">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(schedule).map(([day, data]) => (
                    <tr key={day}>
                      <td className="border border-gray-200 p-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={data.checked}
                            onChange={(e) => handleScheduleChange(day, 'checked', e.target.checked)}
                            className="rounded"
                          />
                          <span className="capitalize">{day}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="flex gap-2 justify-center">
                          <Select 
                            value={data.startTime} 
                            onValueChange={(value) => handleScheduleChange(day, 'startTime', value)}
                          >
                            <SelectTrigger className="w-16 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select 
                            value={data.startMinute} 
                            onValueChange={(value) => handleScheduleChange(day, 'startMinute', value)}
                          >
                            <SelectTrigger className="w-16 h-8">
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
                      <td className="border border-gray-200 p-3">
                        <div className="flex gap-2 justify-center">
                          <Select 
                            value={data.endTime} 
                            onValueChange={(value) => handleScheduleChange(day, 'endTime', value)}
                          >
                            <SelectTrigger className="w-16 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select 
                            value={data.endMinute} 
                            onValueChange={(value) => handleScheduleChange(day, 'endMinute', value)}
                          >
                            <SelectTrigger className="w-16 h-8">
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

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
