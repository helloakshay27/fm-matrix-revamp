
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { staffService, SocietyStaffDetails, Unit, Department, WorkType } from '@/services/staffService';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { API_CONFIG } from '@/config/apiConfig';

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

  // API state management
  const [staff, setStaff] = useState<SocietyStaffDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dropdown data state
  const [units, setUnits] = useState<Unit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingWorkTypes, setLoadingWorkTypes] = useState(true);

  // Load staff data from API
  useEffect(() => {
    const loadStaffData = async () => {
      if (!id) {
        setError('No staff ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching staff details for ID:', id);
        const staffDetails = await staffService.getStaffDetails(id);
        console.log('Fetched staff details:', staffDetails);
        console.log('Staff status_text:', staffDetails.status_text);
        console.log('Staff status (raw):', staffDetails.status);
        setStaff(staffDetails);
      } catch (err) {
        console.error('Error loading staff details:', err);
        setError('Failed to load staff details');
      } finally {
        setLoading(false);
      }
    };

    loadStaffData();
  }, [id]);

  // Fetch dropdown data on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [unitsData, departmentsData, workTypesData] = await Promise.all([
          staffService.getUnits(),
          staffService.getDepartments(),
          staffService.getWorkTypes()
        ]);
        setUnits(unitsData);
        setDepartments(departmentsData);
        setWorkTypes(workTypesData);
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
        toast.error('Failed to load dropdown options');
      } finally {
        setLoadingUnits(false);
        setLoadingDepartments(false);
        setLoadingWorkTypes(false);
      }
    };

    fetchDropdownData();
  }, []);

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

  // Update form data when staff data is loaded
  useEffect(() => {
    if (staff && units.length > 0 && departments.length > 0 && workTypes.length > 0) {
      const nameParts = staff.full_name.split(' ');
      
      // Find the matching department by ID
      const matchingDepartment = departments.find(dept => dept.id === staff.department_id);
      console.log('Staff department_id:', staff.department_id, 'Found department:', matchingDepartment);
      
      // Find the matching work type by ID
      const matchingWorkType = workTypes.find(wt => wt.id === staff.type_id);
      console.log('Staff type_id:', staff.type_id, 'Found work type:', matchingWorkType);
      
      // Find the matching unit by ID
      const matchingUnit = units.find(unit => unit.id === staff.pms_unit_id);
      console.log('Staff pms_unit_id:', staff.pms_unit_id, 'Found unit:', matchingUnit);
      
      // Map status from API response to dropdown value
      let statusValue = '';
      if (staff.status_text) {
        // Map status text to dropdown values
        switch (staff.status_text.toLowerCase()) {
          case 'approved':
            statusValue = '1';
            break;
          case 'pending':
            statusValue = 'pending';
            break;
          case 'rejected':
            statusValue = '0';
            break;
          default:
            statusValue = staff.status_text;
        }
      }
      
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: staff.email || '',
        password: '', // Don't populate password for security
        mobile: staff.mobile || '',
        unit: matchingUnit ? matchingUnit.unit_name : '',
        department: matchingDepartment ? matchingDepartment.department_name : '',
        workType: matchingWorkType ? matchingWorkType.id.toString() : '',
        staffId: staff.soc_staff_id || '',
        vendorName: staff.vendor_name || '',
        validFrom: staff.valid_from || '',
        validTill: staff.expiry || '',
        status: statusValue
      });

      console.log('Status mapping - API status_text:', staff.status_text, 'Mapped to:', statusValue);
    }
  }, [staff, workTypes, departments, units]); // Add all dependencies

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

  // Track removed files for API
  const [removedFiles, setRemovedFiles] = useState<number[]>([]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-[#f6f4ee] min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading staff details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !staff) {
    return (
      <div className="p-6 bg-[#f6f4ee] min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-600">
            {error || 'Staff Not Found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'The requested staff member could not be found.'}
          </p>
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

  const handleSubmit = async () => {
    if (!id || !staff) {
      toast.error('Staff ID not available');
      return;
    }

    setSaving(true);
    try {
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Add text fields - following the exact API specification format
      formDataToSend.append('society_staff[first_name]', formData.firstName);
      formDataToSend.append('society_staff[last_name]', formData.lastName);
      formDataToSend.append('society_staff[email]', formData.email);
      formDataToSend.append('society_staff[mobile]', formData.mobile);
      
      // Add staff ID if provided
      if (formData.staffId) {
        formDataToSend.append('society_staff[soc_staff_id]', formData.staffId);
      }
      
      // Add additional fields
      if (formData.unit) {
        // Find the unit ID by name
        const selectedUnit = units.find(unit => unit.unit_name === formData.unit);
        if (selectedUnit) {
          formDataToSend.append('society_staff[pms_unit_id]', selectedUnit.id.toString());
        }
      }
      if (formData.department) {
        // Find the department ID by name
        const selectedDepartment = departments.find(dept => dept.department_name === formData.department);
        if (selectedDepartment) {
          formDataToSend.append('society_staff[department_id]', selectedDepartment.id.toString());
        }
      }
      if (formData.workType) {
        // Work type is already stored as ID
        formDataToSend.append('society_staff[type_id]', formData.workType);
      }
      if (formData.vendorName) {
        formDataToSend.append('society_staff[vendor_name]', formData.vendorName);
      }
      if (formData.validFrom) {
        formDataToSend.append('society_staff[valid_from]', formData.validFrom);
      }
      if (formData.validTill) {
        formDataToSend.append('society_staff[expiry]', formData.validTill);
      }
      if (formData.status) {
        // Map dropdown value back to API format
        formDataToSend.append('society_staff[status]', formData.status);
        console.log('Status submission - Form value:', formData.status);
      }
      
      if (formData.password) {
        formDataToSend.append('society_staff[password]', formData.password);
      }

      // Add removed files if any
      if (removedFiles.length > 0) {
        formDataToSend.append('removed_files', removedFiles.join(','));
      }

      // Add file uploads if any
      if (attachments.profilePicture) {
        formDataToSend.append('staffimage', attachments.profilePicture);
      }
      
      if (attachments.manuals) {
        formDataToSend.append('attachments[]', attachments.manuals);
      }

      console.log('📤 Final form data being sent to API:');
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      
      console.log('🔗 API Endpoint will be:', `${API_CONFIG.BASE_URL}/pms/admin/society_staffs/${id}.json`);
      console.log('🔑 Using PUT method for staff update');

      await staffService.updateStaff(id, formDataToSend);
      
      // Navigate back to staff list after successful update
      navigate('/security/staff');
    } catch (error) {
      console.error('Error updating staff:', error);
      // Error is already handled in the service with toast
    } finally {
      setSaving(false);
    }
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">EDIT STAFF</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {/* Section 1: Staff Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              Staff Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField
                label="First Name*"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                label="Last Name*"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                label="Password"
                type="password"
                placeholder="Leave empty to keep current password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
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
                label="Mobile*"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
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
              
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink sx={{ '&.Mui-focused': { color: '#C72030' } }}>
                  Unit
                </InputLabel>
                <MuiSelect
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  label="Unit"
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    {loadingUnits ? "Loading units..." : "Select Unit"}
                  </MenuItem>
                  {units.map((unit) => (
                    <MenuItem key={unit.id} value={unit.unit_name}>
                      {unit.unit_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink sx={{ '&.Mui-focused': { color: '#C72030' } }}>
                  Department
                </InputLabel>
                <MuiSelect
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  label="Department"
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    {loadingDepartments ? "Loading departments..." : "Select Department"}
                  </MenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.department_name}>
                      {department.department_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink sx={{ '&.Mui-focused': { color: '#C72030' } }}>
                  Work Type
                </InputLabel>
                <MuiSelect
                  value={formData.workType}
                  onChange={(e) => handleInputChange('workType', e.target.value)}
                  label="Work Type"
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    {loadingWorkTypes ? "Loading work types..." : "Select Work Type"}
                  </MenuItem>
                  {workTypes.map((workType) => (
                    <MenuItem key={workType.id} value={workType.id.toString()}>
                      {workType.staff_type}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <TextField
                label="Staff ID"
                placeholder="Enter Staff ID"
                value={formData.staffId}
                onChange={(e) => handleInputChange('staffId', e.target.value)}
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
                label="Vendor Name"
                placeholder="Vendor Name"
                value={formData.vendorName}
                onChange={(e) => handleInputChange('vendorName', e.target.value)}
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
                label="Valid From*"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
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
                label="Valid Till*"
                type="date"
                value={formData.validTill}
                onChange={(e) => handleInputChange('validTill', e.target.value)}
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
              
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink sx={{ '&.Mui-focused': { color: '#C72030' } }}>
                  Status
                </InputLabel>
                <MuiSelect
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="Status"
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>Select Status</MenuItem>
                  <MenuItem value="1">Approved</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="0">Rejected</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Section 2: Attachments */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              Add Attachments
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Profile Picture Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('profilePicture', e.target.files?.[0] || null)}
                    className="hidden"
                    id="profile-picture-upload"
                  />
                  <label htmlFor="profile-picture-upload" className="cursor-pointer">
                    <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                      Drag & Drop or <span className="text-red-500 cursor-pointer font-medium">Choose File</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </label>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Documents Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('manuals', e.target.files?.[0] || null)}
                    className="hidden"
                    id="manuals-upload"
                  />
                  <label htmlFor="manuals-upload" className="cursor-pointer">
                    <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                      Drag & Drop or <span className="text-red-500 cursor-pointer font-medium">Choose File</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC up to 10MB</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Schedule */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              Schedule Information
            </h2>
          </div>
          <div className="p-6">
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
                  {schedule.map((scheduleDay, index) => (
                    <tr key={scheduleDay.day} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={scheduleDay.enabled}
                            onChange={(e) => handleScheduleChange(index, 'enabled', e.target.checked)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                          />
                          <span className="capitalize font-medium text-gray-700">{scheduleDay.day}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-4">
                        <div className="flex gap-2 justify-center">
                          <Select 
                            value={scheduleDay.startHour}
                            onValueChange={(value) => handleScheduleChange(index, 'startHour', value)}
                          >
                            <SelectTrigger className="w-16 h-8 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {generateHourOptions().map(hour => (
                                <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="flex items-center text-gray-500">:</span>
                          <Select 
                            value={scheduleDay.startMinute}
                            onValueChange={(value) => handleScheduleChange(index, 'startMinute', value)}
                          >
                            <SelectTrigger className="w-16 h-8 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {generateMinuteOptions().map(minute => (
                                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-4">
                        <div className="flex gap-2 justify-center">
                          <Select 
                            value={scheduleDay.endHour}
                            onValueChange={(value) => handleScheduleChange(index, 'endHour', value)}
                          >
                            <SelectTrigger className="w-16 h-8 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {generateHourOptions().map(hour => (
                                <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="flex items-center text-gray-500">:</span>
                          <Select 
                            value={scheduleDay.endMinute}
                            onValueChange={(value) => handleScheduleChange(index, 'endMinute', value)}
                          >
                            <SelectTrigger className="w-16 h-8 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {generateMinuteOptions().map(minute => (
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
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button 
            type="submit"
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              'Update Staff'
            )}
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={handleBack}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
