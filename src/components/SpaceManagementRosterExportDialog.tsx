import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MaterialDatePicker } from "@/components/ui/material-date-picker";
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
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [showDepartmentList, setShowDepartmentList] = useState(false);

  const departments = [
    'Select All',
    'Sales',
    'HR',
    'Operations',
    'IR',
    'Tech',
    'Accounts',
    'RM',
    'Electrical',
    'IBMS',
    'Housekeeping',
    'kitchen',
    'Finance',
    'Marketing',
    'IOS',
    'staff',
    'Cook',
    'ACCOUNTS',
    'Technician',
    'Store Manager',
    'Carpenting',
    'Plumbing',
    'Admin',
    'CLUB HOUSE',
    'Security A',
    'Technical A',
    'Housekeeping A',
    'Staff',
    'BB Admin',
    'BB FM',
    'BB FM Accounts',
    'BB Electrical',
    'BB HVAC',
    'Operation',
    'UI/UX',
    'Soft Service',
    'admin',
    'Function 1',
    'Function 2',
    'Function 3',
    'Function 4',
    'Frontend',
    'Backend',
    'DevOps',
    'Support'
  ];

  const handleDepartmentChange = (department: string, checked: boolean) => {
    if (department === 'Select All') {
      if (checked) {
        setSelectedDepartments(departments.filter(d => d !== 'Select All'));
      } else {
        setSelectedDepartments([]);
      }
    } else {
      if (checked) {
        setSelectedDepartments(prev => [...prev, department]);
      } else {
        setSelectedDepartments(prev => prev.filter(d => d !== department));
      }
    }
  };

  const isSelectAllChecked = selectedDepartments.length === departments.length - 1;
  const isSelectAllIndeterminate = selectedDepartments.length > 0 && selectedDepartments.length < departments.length - 1;

  const handleSubmit = () => {
    console.log('Roster Export submitted:', { fromDate, toDate, departments: selectedDepartments });
    
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
      <DialogContent className="sm:max-w-md [&>button]:hidden">
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
            <MaterialDatePicker
              value={fromDate}
              onChange={setFromDate}
              placeholder="Select from date"
              className="text-sm"
            />
          </div>
          
          <div>
            <MaterialDatePicker
              value={toDate}
              onChange={setToDate}
              placeholder="Select to date"
              className="text-sm"
            />
          </div>

          <div className="relative">
            <div 
              className="border border-input bg-background px-3 py-2 text-sm rounded-md cursor-pointer flex justify-between items-center"
              onClick={() => setShowDepartmentList(!showDepartmentList)}
            >
              <span className="text-muted-foreground">
                {selectedDepartments.length > 0 
                  ? `${selectedDepartments.length} department(s) selected`
                  : 'Select Department...'
                }
              </span>
              <X className={`h-4 w-4 transition-transform ${showDepartmentList ? 'rotate-180' : ''}`} />
            </div>
            
            {showDepartmentList && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg z-50">
                <ScrollArea className="h-48">
                  <div className="p-2 space-y-2">
                    {departments.map((department) => (
                      <div key={department} className="flex items-center space-x-2">
                        <Checkbox
                          id={department}
                          checked={department === 'Select All' ? isSelectAllChecked : selectedDepartments.includes(department)}
                          onCheckedChange={(checked) => handleDepartmentChange(department, !!checked)}
                          className={department === 'Select All' && isSelectAllIndeterminate ? 'data-[state=checked]:bg-primary' : ''}
                        />
                        <label
                          htmlFor={department}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {department}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030', color: 'white' }}
              className="w-full hover:opacity-90"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
