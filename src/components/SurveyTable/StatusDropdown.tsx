
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface StatusDropdownProps {
  status: string;
  onStatusChange: (newStatus: string) => void;
}

const statusOptions = ['Active', 'Draft', 'Published', 'Inactive'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Published':
      return 'text-green-600';
    case 'Draft':
      return 'text-yellow-600';
    case 'Inactive':
      return 'text-red-600';
    case 'Active':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

export const StatusDropdown = ({ status, onStatusChange }: StatusDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded">
        <span className={`font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black border shadow-lg z-50">
        {statusOptions.map((statusOption) => (
          <DropdownMenuItem
            key={statusOption}
            onClick={() => onStatusChange(statusOption)}
            className="cursor-pointer hover:bg-gray-800 text-white"
          >
            <span className="text-white">{statusOption}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
