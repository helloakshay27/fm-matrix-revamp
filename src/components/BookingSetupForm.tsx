import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Custom theme for MUI components
const muiTheme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '16px',
        },
      },
      defaultProps: {
        shrink: true, // Make all labels floating
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            height: '36px', // Mobile height
            '@media (min-width: 768px)': {
              height: '45px', // Desktop height
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '8px 14px',
            '@media (min-width: 768px)': {
              padding: '12px 14px',
            },
          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          shrink: true, // Make all TextField labels floating
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            height: '36px', // Mobile height
            '@media (min-width: 768px)': {
              height: '45px', // Desktop height
            },
          },
          '& .MuiSelect-select': {
            padding: '8px 14px',
            '@media (min-width: 768px)': {
              padding: '12px 14px',
            },
          },
        },
      },
    },
  },
});

interface BookingSetupFormProps {
  onClose: () => void;
}

export const BookingSetupForm: React.FC<BookingSetupFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    facilityName: '',
    isBookable: true,
    isRequest: false,
    active: 'Select',
    department: 'Select Department',
    appKey: '',
    postpaid: false,
    prepaid: false,
    payOnFacility: false,
    complimentary: false,
    gstPercentage: '0.0',
    sgstPercentage: '',
    perSlotCharge: '0.0',
    bookingAllowedBefore: { day: 'd', hour: 'h', minute: 'm' },
    advanceBooking: { day: 'd', hour: 'h', minute: 'm' },
    canCancelBefore: { day: 'd', hour: 'h', minute: 'm' },
    allowMultipleSlots: false,
    facilityBookedTimes: '',
    termsConditions: '',
    cancellationText: '',
    amenities: {
      tv: false,
      whiteboard: false,
      casting: false,
      smartPenForTV: false,
      wirelessCharging: false,
      meetingRoomInventory: false
    },
    seaterInfo: 'Select a seater',
    floorInfo: 'Select a floor',
    sharedContentInfo: 'Text content will appear on meeting room share icon in Application'
  });

  const [slots, setSlots] = useState([
    {
      startTime: { hour: '00', minute: '00' },
      breakTimeStart: { hour: '00', minute: '00' },
      breakTimeEnd: { hour: '00', minute: '00' },
      endTime: { hour: '00', minute: '00' },
      concurrentSlots: '',
      slotBy: '15 Minutes',
      wrapTime: ''
    }
  ]);

  const [cancellationRules, setCancellationRules] = useState([
    {
      description: 'If user cancel the booking selected hours/days prior to schedule given percentage of amount will be deducted',
      time: { type: 'Hr', value: '00' },
      deduction: ''
    },
    {
      description: 'If user cancel the booking selected hours/days prior to schedule given percentage of amount will be deducted',
      time: { type: 'Hr', value: '00' },
      deduction: ''
    },
    {
      description: 'If user cancel the booking selected hours/days prior to schedule given percentage of amount will be deducted',
      time: { type: 'Hr', value: '00' },
      deduction: ''
    }
  ]);

  const handleSave = () => {
    console.log('Saving booking setup:', formData);
    onClose();
  };

  const addSlot = () => {
    setSlots([...slots, {
      startTime: { hour: '00', minute: '00' },
      breakTimeStart: { hour: '00', minute: '00' },
      breakTimeEnd: { hour: '00', minute: '00' },
      endTime: { hour: '00', minute: '00' },
      concurrentSlots: '',
      slotBy: '15 Minutes',
      wrapTime: ''
    }]);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-4 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-6xl mx-4 mb-4 max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b bg-gray-50">
            <div>
              <p className="text-sm text-gray-600 mb-1">Booking Setup List &gt; New Booking Setup</p>
              <h2 className="text-xl font-bold text-gray-800">NEW BOOKING SETUP</h2>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField
                label="Facility Name*"
                placeholder="Enter Facility Name"
                value={formData.facilityName}
                onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                variant="outlined"
              />
              <FormControl>
                <InputLabel>Active*</InputLabel>
                <Select
                  value={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value })}
                  label="Active*"
                >
                  <MenuItem value="Select">Select</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  label="Department"
                >
                  <MenuItem value="Select Department">Select Department</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Radio Buttons */}
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="bookable"
                  name="type"
                  checked={formData.isBookable}
                  onChange={() => setFormData({ ...formData, isBookable: true, isRequest: false })}
                  className="text-blue-600"
                />
                <label htmlFor="bookable">Bookable</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="request"
                  name="type"
                  checked={formData.isRequest}
                  onChange={() => setFormData({ ...formData, isBookable: false, isRequest: true })}
                  className="text-blue-600"
                />
                <label htmlFor="request">Request</label>
              </div>
            </div>

            {/* Configure App Key */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <h3 className="text-lg font-semibold text-[#C72030]">CONFIGURE APP KEY</h3>
              </div>
              <TextField
                label="App Key"
                placeholder="Enter Alphanumeric Key"
                value={formData.appKey}
                onChange={(e) => setFormData({ ...formData, appKey: e.target.value })}
                variant="outlined"
              />
            </div>

            {/* Configure Payment */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <h3 className="text-lg font-semibold text-[#C72030]">CONFIGURE PAYMENT</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="postpaid"
                    checked={formData.postpaid}
                    onCheckedChange={(checked) => setFormData({ ...formData, postpaid: !!checked })}
                  />
                  <label htmlFor="postpaid">Postpaid</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prepaid"
                    checked={formData.prepaid}
                    onCheckedChange={(checked) => setFormData({ ...formData, prepaid: !!checked })}
                  />
                  <label htmlFor="prepaid">Prepaid</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payOnFacility"
                    checked={formData.payOnFacility}
                    onCheckedChange={(checked) => setFormData({ ...formData, payOnFacility: !!checked })}
                  />
                  <label htmlFor="payOnFacility">Pay on Facility</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="complimentary"
                    checked={formData.complimentary}
                    onCheckedChange={(checked) => setFormData({ ...formData, complimentary: !!checked })}
                  />
                  <label htmlFor="complimentary">Complimentary</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="SGST(%)"
                  value={formData.sgstPercentage}
                  onChange={(e) => setFormData({ ...formData, sgstPercentage: e.target.value })}
                  variant="outlined"
                />
                <TextField
                  label="GST(%)"
                  value={formData.gstPercentage}
                  onChange={(e) => setFormData({ ...formData, gstPercentage: e.target.value })}
                  variant="outlined"
                />
              </div>
            </div>

            {/* Configure Slot */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <h3 className="text-lg font-semibold text-[#C72030]">CONFIGURE SLOT</h3>
              </div>
              <Button onClick={addSlot} className="mb-4 bg-purple-600 hover:bg-purple-700">
                Add
              </Button>
              
              {/* Slot Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-sm font-medium text-gray-600">
                <div>Start Time</div>
                <div>Break Time Start</div>
                <div>Break Time End</div>
                <div>End Time</div>
                <div>Concurrent Slots</div>
                <div>Slot by</div>
                <div>Wrap Time</div>
              </div>

              {/* Slot Rows */}
              {slots.map((slot, index) => (
                <div key={index} className="grid grid-cols-7 gap-2 mb-2">
                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select value={slot.startTime.hour}>
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select value={slot.startTime.minute}>
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select value={slot.breakTimeStart.hour}>
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select value={slot.breakTimeStart.minute}>
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select value={slot.breakTimeEnd.hour}>
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select value={slot.breakTimeEnd.minute}>
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select value={slot.endTime.hour}>
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select value={slot.endTime.minute}>
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <TextField size="small" value={slot.concurrentSlots} variant="outlined" />
                  <FormControl size="small">
                    <Select value={slot.slotBy}>
                      <MenuItem value="15 Minutes">15 Minutes</MenuItem>
                      <MenuItem value="30 Minutes">30 Minutes</MenuItem>
                      <MenuItem value="60 Minutes">60 Minutes</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField size="small" value={slot.wrapTime} variant="outlined" />
                </div>
              ))}
            </div>

            {/* Charge Setup */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                <h3 className="text-lg font-semibold text-[#C72030]">CHARGE SETUP</h3>
              </div>
              <div className="space-y-4">
                <TextField
                  label="Per Slot Charge"
                  value={formData.perSlotCharge}
                  onChange={(e) => setFormData({ ...formData, perSlotCharge: e.target.value })}
                  variant="outlined"
                />
                <div>
                  <label className="text-sm font-medium text-gray-700">Booking Allowed before :</label>
                  <p className="text-sm text-gray-600 mb-2">(Enter Time: DD Days, HH Hours, MM Minutes)</p>
                  <div className="flex gap-2 items-center">
                    <TextField placeholder="Day" size="small" style={{ width: '80px' }} variant="outlined" />
                    <span>d</span>
                    <TextField placeholder="Hour" size="small" style={{ width: '80px' }} variant="outlined" />
                    <span>h</span>
                    <TextField placeholder="Mins" size="small" style={{ width: '80px' }} variant="outlined" />
                    <span>m</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Advance Booking :</label>
                  <div className="flex gap-2 items-center">
                    <TextField placeholder="Day" size="small" style={{ width: '80px' }} variant="outlined" />
                    <span>d</span>
                    <TextField placeholder="Hour" size="small" style={{ width: '80px' }} variant="outlined" />
                    <span>h</span>
                    <TextField placeholder="Mins" size="small" style={{ width: '80px' }} variant="outlined" />
                    <span>m</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Can Cancel Before Schedule :</label>
                  <div className="flex gap-2 items-center">
                    <TextField placeholder="Day" size="small" style={{ width: '80px' }} variant="outlined" />
                    <span>d</span>
                    <TextField placeholder="Hour" size="small" style={{ width: '80px' }} variant="outlined" />
                    <span>h</span>
                    <TextField placeholder="Mins" size="small" style={{ width: '80px' }} variant="outlined" />
                    <span>m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slot Setup */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                <h3 className="text-lg font-semibold text-[#C72030]">SLOT SETUP</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowMultipleSlots"
                    checked={formData.allowMultipleSlots}
                    onCheckedChange={(checked) => setFormData({ ...formData, allowMultipleSlots: !!checked })}
                  />
                  <label htmlFor="allowMultipleSlots">Allow Multiple Slots</label>
                </div>
                <div className="text-sm text-gray-600">
                  Facility can be booked <span className="mx-4">times per day by User</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">6</div>
                <h3 className="text-lg font-semibold text-[#C72030]">COVER IMAGE</h3>
              </div>
              <div className="border-2 border-dashed border-[#C72030]/30 rounded-lg p-8 text-center">
                <div className="text-[#C72030] mb-2">
                  <Upload className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-600">
                  Drag & Drop or <span className="text-[#C72030] cursor-pointer">Choose File</span> No file chosen
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Accepted file formats: PNG/JPEG (height: 142px, width: 328px) (max 5 mb)
                </p>
              </div>
            </div>

            {/* Booking Summary Image */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">7</div>
                <h3 className="text-lg font-semibold text-[#C72030]">Booking Summary Image</h3>
              </div>
              <div className="border-2 border-dashed border-[#C72030]/30 rounded-lg p-8 text-center">
                <div className="text-[#C72030] mb-2">
                  <Upload className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-600">
                  Drag & Drop or <span className="text-[#C72030] cursor-pointer">Choose File</span> No file chosen
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Accepted file formats: PNG/JPEG (height: 91px, width: 108px) (max 5 mb)
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">8</div>
                <h3 className="text-lg font-semibold text-[#C72030]">DESCRIPTION</h3>
              </div>
              <Textarea
                placeholder="Enter description"
                value={formData.termsConditions}
                onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            {/* Terms & Conditions and Cancellation Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-[#C72030]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">9</div>
                  <h3 className="text-lg font-semibold text-[#C72030]">TERMS & CONDITIONS</h3>
                </div>
                <Textarea
                  placeholder="Enter terms and conditions"
                  value={formData.termsConditions}
                  onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="border border-[#C72030]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">10</div>
                  <h3 className="text-lg font-semibold text-[#C72030]">CANCELLATION TEXT</h3>
                </div>
                <Textarea
                  placeholder="Enter cancellation text"
                  value={formData.cancellationText}
                  onChange={(e) => setFormData({ ...formData, cancellationText: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Cancellation Rules */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="font-medium text-gray-700">Rules Description</div>
                <div className="font-medium text-gray-700">Time</div>
                <div className="font-medium text-gray-700">Deduction</div>
              </div>
              {cancellationRules.map((rule, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 mb-2 items-center">
                  <div className="text-sm text-gray-600">{rule.description}</div>
                  <div className="flex gap-2">
                    <TextField placeholder="Day" size="small" style={{ width: '64px' }} variant="outlined" />
                    <FormControl size="small" style={{ width: '64px' }}>
                      <Select value={rule.time.type}>
                        <MenuItem value="Hr">Hr</MenuItem>
                        <MenuItem value="Day">Day</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" style={{ width: '64px' }}>
                      <Select value={rule.time.value}>
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <TextField placeholder="%" size="small" variant="outlined" />
                </div>
              ))}
            </div>

            {/* Configure Amenity Info */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">11</div>
                <h3 className="text-lg font-semibold text-[#C72030]">CONFIGURE AMENITY INFO</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tv"
                    checked={formData.amenities.tv}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      amenities: { ...formData.amenities, tv: !!checked }
                    })}
                  />
                  <label htmlFor="tv">TV</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whiteboard"
                    checked={formData.amenities.whiteboard}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      amenities: { ...formData.amenities, whiteboard: !!checked }
                    })}
                  />
                  <label htmlFor="whiteboard">Whiteboard</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="casting"
                    checked={formData.amenities.casting}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      amenities: { ...formData.amenities, casting: !!checked }
                    })}
                  />
                  <label htmlFor="casting">Casting</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smartPenForTV"
                    checked={formData.amenities.smartPenForTV}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      amenities: { ...formData.amenities, smartPenForTV: !!checked }
                    })}
                  />
                  <label htmlFor="smartPenForTV">Smart Pen for TV</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wirelessCharging"
                    checked={formData.amenities.wirelessCharging}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      amenities: { ...formData.amenities, wirelessCharging: !!checked }
                    })}
                  />
                  <label htmlFor="wirelessCharging">Wireless Charging</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="meetingRoomInventory"
                    checked={formData.amenities.meetingRoomInventory}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      amenities: { ...formData.amenities, meetingRoomInventory: !!checked }
                    })}
                  />
                  <label htmlFor="meetingRoomInventory">Meeting Room Inventory</label>
                </div>
              </div>
            </div>

            {/* Seater Info */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">12</div>
                <h3 className="text-lg font-semibold text-[#C72030]">SEATER INFO</h3>
              </div>
              <FormControl>
                <InputLabel>Seater Info</InputLabel>
                <Select
                  value={formData.seaterInfo}
                  onChange={(e) => setFormData({ ...formData, seaterInfo: e.target.value })}
                  label="Seater Info"
                >
                  <MenuItem value="Select a seater">Select a seater</MenuItem>
                  <MenuItem value="2-4 People">2-4 People</MenuItem>
                  <MenuItem value="5-10 People">5-10 People</MenuItem>
                  <MenuItem value="10+ People">10+ People</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Floor Info */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">13</div>
                <h3 className="text-lg font-semibold text-[#C72030]">FLOOR INFO</h3>
              </div>
              <FormControl>
                <InputLabel>Floor Info</InputLabel>
                <Select
                  value={formData.floorInfo}
                  onChange={(e) => setFormData({ ...formData, floorInfo: e.target.value })}
                  label="Floor Info"
                >
                  <MenuItem value="Select a floor">Select a floor</MenuItem>
                  <MenuItem value="Ground Floor">Ground Floor</MenuItem>
                  <MenuItem value="1st Floor">1st Floor</MenuItem>
                  <MenuItem value="2nd Floor">2nd Floor</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Shared Content Info */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">14</div>
                <h3 className="text-lg font-semibold text-[#C72030]">Shared Content Info</h3>
              </div>
              <Textarea
                placeholder="Text content will appear on meeting room share icon in Application"
                value={formData.sharedContentInfo}
                onChange={(e) => setFormData({ ...formData, sharedContentInfo: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-6">
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 px-8">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};