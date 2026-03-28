import React from 'react';
import { Eye, Shield, ChevronDown } from 'lucide-react';
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

export const AdminViewEmulation: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedUserType, selectedUser } = useSelector(
    (state: RootState) => state.adminViewEmulation
  );

  return (
    <Card className="p-4 mb-6 bg-primary border-border shadow-md rounded-[8px]">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2">
          <Eye className="w-5 h-5 text-[#2C2C2C]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#2C2C2C]">Admin View Emulation</h3>
          <p className="text-xs text-[#2C2C2C] opacity-80">
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
            <SelectTrigger className="w-full bg-white border-[#E9D5FF] text-sm text-[#581C87] h-10">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#2C2C2C]" />
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
            <SelectTrigger className="w-full bg-white border-[#E9D5FF] text-sm text-[#581C87] h-10">
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
