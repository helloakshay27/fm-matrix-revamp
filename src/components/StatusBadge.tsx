import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in use':
        return 'default'; // Green
      case 'in store':
        return 'secondary'; // Blue
      case 'breakdown':
        return 'destructive'; // Red
      case 'disposed':
        return 'outline'; // Gray
      default:
        return 'secondary';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {status}
    </Badge>
  );
};