
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CustomTextField } from '@/components/ui/custom-text-field';

interface AllocateToSectionProps {
  allocateTo: string;
  setAllocateTo: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
}

export const AllocateToSection: React.FC<AllocateToSectionProps> = ({
  allocateTo,
  setAllocateTo,
  department,
  setDepartment,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Allocate To</h3>
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
        <div className="flex-shrink-0">
          <RadioGroup value={allocateTo} onValueChange={setAllocateTo} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="department" id="department" />
              <Label htmlFor="department" className="text-sm">Department</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user" className="text-sm">User</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex-1 max-w-full lg:max-w-xs">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Department</option>
            <option value="hr">Human Resources</option>
            <option value="it">Information Technology</option>
            <option value="finance">Finance</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
            <option value="admin">Administration</option>
          </select>
        </div>
      </div>
    </div>
  );
};
