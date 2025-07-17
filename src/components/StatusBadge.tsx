import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_use':
      case 'in use':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'breakdown':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'in_storage':
      case 'in store':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'disposed':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      default:
        return 'bg-gray-400 text-white hover:bg-gray-500';
    }
  };

  const formatStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'in_use':
        return 'In Use';
      case 'in_storage':
        return 'In Store';
      case 'breakdown':
        return 'Breakdown';
      case 'disposed':
        return 'Disposed';
      default:
        return status;
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} text-xs px-2 py-1`}>
      {formatStatusLabel(status)}
    </Badge>
  );
};