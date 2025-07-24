import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  console.log(status)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_use':
      case 'in use':
        return 'bg-green-500 text-white';
      case 'breakdown':
        return 'bg-red-500 text-white';
      case 'in_storage':
      case 'in store':
        return 'bg-blue-500 text-white';
      case 'disposed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
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
    <div className={`${getStatusColor(status)} inline-flex items-center justify-center text-xs px-2 py-1 rounded-sm font-medium w-20 text-center`}>
      {formatStatusLabel(status)}
    </div>
  );
};