
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface SpaceManagementRosterExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SpaceManagementRosterExportDialog: React.FC<SpaceManagementRosterExportDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [fromDate, setFromDate] = useState('01/06/2025');
  const [toDate, setToDate] = useState('30/06/2025');
  const [department, setDepartment] = useState('');

  const handleSubmit = () => {
    console.log('Roster Export submitted:', { fromDate, toDate, department });
    
    // Create and download roster export file
    const exportContent = "data:text/csv;charset=utf-8," + 
      "Employee ID,Employee Name,Schedule Date,Department,Building,Floor,Seat\n" +
      "73974,HO Occupant 2,29 December 2023,HR,Jyoti Tower,2nd Floor,HR 1\n" +
      "71905,Prashant P,29 December 2023,Tech,Jyoti Tower,2nd Floor,S7";
    
    const encodedUri = encodeURI(exportContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `roster_export_${fromDate.replace(/\//g, '-')}_to_${toDate.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Roster Export</DialogTitle>
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
            <Input
              placeholder="01/06/2025"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <Input
              placeholder="30/06/2025"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-sm"
            />
          </div>

          <div>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select Department..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSubmit}
              className="w-full bg-[#8B4A9C] hover:bg-[#7A4089] text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
