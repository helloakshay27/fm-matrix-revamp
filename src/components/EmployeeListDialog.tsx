
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface EmployeeListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewList: () => void;
}

export const EmployeeListDialog = ({ open, onOpenChange, onViewList }: EmployeeListDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  // Sample employee data - in real app this would come from an API
  const allEmployees = [
    'John Doe',
    'Jane Smith', 
    'Robert Day2',
    'Alice Johnson',
    'Bob Wilson',
    'Carol Brown',
    'David Lee',
    'Emma Davis'
  ];

  const filteredEmployees = allEmployees.filter(employee =>
    employee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmployeeToggle = (employee: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employee) 
        ? prev.filter(e => e !== employee)
        : [...prev, employee]
    );
  };

  const handleSubmit = () => {
    console.log('Selected employees:', selectedEmployees);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl mx-auto p-0 max-h-[80vh]">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">List Of Employees</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="p-6">
          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Employee Lists */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* All Employees */}
            <div>
              <h3 className="text-lg font-medium mb-3">All Employees</h3>
              <div className="border rounded-lg h-64 overflow-y-auto p-3 bg-gray-50">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee}
                    className={`p-2 rounded cursor-pointer mb-1 ${
                      selectedEmployees.includes(employee) 
                        ? 'bg-blue-100 border border-blue-300' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleEmployeeToggle(employee)}
                  >
                    {employee}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Employees */}
            <div>
              <h3 className="text-lg font-medium mb-3">Selected Employees</h3>
              <div className="border rounded-lg h-64 overflow-y-auto p-3 bg-gray-50">
                {selectedEmployees.map((employee) => (
                  <div
                    key={employee}
                    className="p-2 rounded cursor-pointer mb-1 bg-green-100 border border-green-300 hover:bg-green-200"
                    onClick={() => handleEmployeeToggle(employee)}
                  >
                    {employee}
                  </div>
                ))}
                {selectedEmployees.length === 0 && (
                  <p className="text-gray-500 text-center mt-8">No employees selected</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030', borderColor: '#C72030' }}
              className="hover:bg-[#B01E2A] text-white px-8"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
