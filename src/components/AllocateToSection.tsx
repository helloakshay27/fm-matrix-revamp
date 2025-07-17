
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAllocationData } from '@/hooks/useAllocationData';

interface AllocateToSectionProps {
  allocateTo: string;
  setAllocateTo: (value: string) => void;
  allocatedToId: number | null;
  setAllocatedToId: (value: number | null) => void;
}

export const AllocateToSection: React.FC<AllocateToSectionProps> = ({
  allocateTo,
  setAllocateTo,
  allocatedToId,
  setAllocatedToId,
}) => {
  const { departments, users, loading } = useAllocationData();
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
            value={allocatedToId || ''}
            onChange={(e) => setAllocatedToId(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading.departments || loading.users}
          >
            <option value="">
              {allocateTo === 'department' ? 'Select Department' : 'Select User'}
            </option>
            {allocateTo === 'department' 
              ? departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </option>
                ))
              : users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name}
                  </option>
                ))
            }
          </select>
        </div>
      </div>
    </div>
  );
};
