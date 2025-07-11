
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ChevronDown, CheckCircle } from 'lucide-react';
import { TextField, MenuItem } from '@mui/material';

interface FacilityBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacilityBookingForm: React.FC<FacilityBookingFormProps> = ({ isOpen, onClose }) => {
  const [userType, setUserType] = useState('occupant');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    console.log('Form submitted:', {
      userType,
      selectedUser,
      selectedFacility,
      selectedDate,
      comment
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-[#FF4500]">
            <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            Facility Booking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Type Selection */}
          <div className="space-y-4">
            <RadioGroup value={userType} onValueChange={setUserType} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occupant" id="occupant" />
                <Label htmlFor="occupant" className="text-base font-medium">Occupant User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fm" id="fm" />
                <Label htmlFor="fm" className="text-base font-medium">FM User</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Form Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">User</Label>
              <TextField
                select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder="Select User"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    height: { xs: '36px', sm: '45px' },
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#9ca3af',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF4500',
                    }
                  },
                  '& .MuiSelect-select': {
                    color: selectedUser ? '#1f2937' : '#FF4500',
                    fontWeight: selectedUser ? 'normal' : 'medium'
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <span className="text-[#FF4500]">Select User</span>
                </MenuItem>
                <MenuItem value="user1">User 1</MenuItem>
                <MenuItem value="user2">User 2</MenuItem>
                <MenuItem value="user3">User 3</MenuItem>
              </TextField>
            </div>

            {/* Facility Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Facility</Label>
              <TextField
                select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder="Select Facility"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    height: { xs: '36px', sm: '45px' },
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#9ca3af',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B4B8C',
                    }
                  }
                }}
              >
                <MenuItem value="" disabled>Select Facility</MenuItem>
                <MenuItem value="meeting-room">Meeting Room</MenuItem>
                <MenuItem value="conference-hall">Conference Hall</MenuItem>
                <MenuItem value="board-room">Board Room</MenuItem>
              </TextField>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Date</Label>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder="Select Date"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    height: { xs: '36px', sm: '45px' },
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#9ca3af',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B4B8C',
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: selectedDate ? '#1f2937' : '#9ca3af',
                  }
                }}
              />
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Comment</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comments here..."
              className="min-h-[80px] resize-none border-gray-300 focus:border-[#8B4B8C] focus:ring-[#8B4B8C] rounded-md"
            />
          </div>

          {/* Select Slot Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Slot</h3>
            {/* Slot selection can be added here */}
          </div>

          {/* Payment Method Section */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-700">Payment Method</h3>
            {/* Payment method options can be added here */}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSubmit}
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white px-8 py-2 rounded-md font-medium"
            >
              Submit
            </Button>
          </div>

          {/* Footer Links */}
          <div className="flex gap-6 pt-4 text-sm">
            <button className="text-[#FF4500] hover:underline">
              Cancellation Policy
            </button>
            <button className="text-[#FF4500] hover:underline">
              Terms & Conditions
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
