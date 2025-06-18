
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface EditBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    scheduleDate: string;
    day: string;
    category: string;
    building: string;
    floor: string;
    designation: string;
    department: string;
    slotsAndSeat: string;
    status: string;
    createdOn: string;
  } | null;
}

export const EditBookingDialog: React.FC<EditBookingDialogProps> = ({
  open,
  onOpenChange,
  booking,
}) => {
  const [formData, setFormData] = useState({
    employeeName: booking?.employeeName || '',
    employeeEmail: booking?.employeeEmail || '',
    scheduleDate: booking?.scheduleDate || '',
    category: booking?.category || '',
    building: booking?.building || '',
    floor: booking?.floor || '',
    designation: booking?.designation || '',
    department: booking?.department || '',
    slotsAndSeat: booking?.slotsAndSeat || '',
    status: booking?.status || '',
  });

  React.useEffect(() => {
    if (booking) {
      setFormData({
        employeeName: booking.employeeName,
        employeeEmail: booking.employeeEmail,
        scheduleDate: booking.scheduleDate,
        category: booking.category,
        building: booking.building,
        floor: booking.floor,
        designation: booking.designation,
        department: booking.department,
        slotsAndSeat: booking.slotsAndSeat,
        status: booking.status,
      });
    }
  }, [booking]);

  const handleSubmit = () => {
    console.log('Updated booking:', { ...booking, ...formData });
    onOpenChange(false);
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Edit Booking - ID: {booking.id}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeName" className="text-sm font-medium">Employee Name</Label>
              <Input
                id="employeeName"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="employeeEmail" className="text-sm font-medium">Employee Email</Label>
              <Input
                id="employeeEmail"
                value={formData.employeeEmail}
                onChange={(e) => setFormData({ ...formData, employeeEmail: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduleDate" className="text-sm font-medium">Schedule Date</Label>
              <Input
                id="scheduleDate"
                value={formData.scheduleDate}
                onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="building" className="text-sm font-medium">Building</Label>
              <Input
                id="building"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="floor" className="text-sm font-medium">Floor</Label>
              <Input
                id="floor"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="designation" className="text-sm font-medium">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="department" className="text-sm font-medium">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slotsAndSeat" className="text-sm font-medium">Slots & Seat No.</Label>
              <Input
                id="slotsAndSeat"
                value={formData.slotsAndSeat}
                onChange={(e) => setFormData({ ...formData, slotsAndSeat: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030', color: 'white' }}
              className="w-full hover:opacity-90 border-0"
            >
              Update Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
