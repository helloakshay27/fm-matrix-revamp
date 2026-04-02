import React from 'react';
import { Eye, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setSelectedUserType, setSelectedUser } from '@/store/slices/adminViewEmulationSlice';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const AdminViewEmulation: React.FC<{ className?: string }> = ({ className }) => {
  const dispatch = useDispatch();
  const { selectedUserType, selectedUser } = useSelector(
    (state: RootState) => state.adminViewEmulation
  );

  return (
    <Card
      className={cn(
        'mb-6 rounded-2xl border border-[#DA7756]/20 bg-white p-4 shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2">
          <Eye className="w-5 h-5 text-neutral-700" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Admin View Emulation</h3>
          <p className="text-xs text-neutral-500">
            Experience the app as different user types
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Select
            value={selectedUserType}
            onValueChange={(value) => dispatch(setSelectedUserType(value))}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-neutral-600" />
                <SelectValue placeholder="Select role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Default (Your Role)">Default (Your Role)</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select
            value={selectedUser}
            onValueChange={(value) => dispatch(setSelectedUser(value))}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25">
              <SelectValue placeholder="Select specific user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No specific user">No specific user</SelectItem>
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
