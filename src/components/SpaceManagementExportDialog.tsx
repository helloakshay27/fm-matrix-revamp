
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MaterialDatePicker } from "@/components/ui/material-date-picker";
import { X } from "lucide-react";

interface SpaceManagementExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SpaceManagementExportDialog: React.FC<SpaceManagementExportDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [fromDate, setFromDate] = useState('01/06/2025');
  const [toDate, setToDate] = useState('30/06/2025');

  const handleSubmit = () => {
    console.log('Report Export submitted:', { fromDate, toDate });
    
    // Create and download export file
    const exportContent = "data:text/csv;charset=utf-8," + 
      "ID,Employee ID,Employee Name,Employee Email,Schedule Date,Day,Category,Building,Floor,Designation,Department,Slots & Seat No.,Status,Created On\n" +
      "142179,73974,HO Occupant 2,hooccupant2@locatard.com,29 December 2023,Friday,Angular War,Jyoti Tower,2nd Floor,,HR,10:00 AM to 08:00 PM - HR 1,Cancelled,15/02/2023, 5:44 PM\n" +
      "142150,71905,Prashant P,889853791@gmail.com,29 December 2023,Friday,Angular War,Jyoti Tower,2nd Floor,,,10:00 AM to 08:00 PM - S7,Cancelled,15/02/2023, 5:43 PM";
    
    const encodedUri = encodeURI(exportContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookings_report_${fromDate.replace(/\//g, '-')}_to_${toDate.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Report</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <MaterialDatePicker
              value={fromDate}
              onChange={setFromDate}
              placeholder="Select from date"
              className="text-sm h-12 bg-gray-50"
            />
          </div>
          
          <div>
            <MaterialDatePicker
              value={toDate}
              onChange={setToDate}
              placeholder="Select to date"
              className="text-sm h-12 bg-gray-50"
            />
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030', color: 'white' }}
              className="w-full hover:opacity-90 h-12 rounded-md border-0"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
