
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  count: number;
  color: string;
  textColor: string;
  iconBg: string;
  icon: LucideIcon;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  color,
  textColor,
  iconBg,
  icon: IconComponent
}) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#F6F4EE' }}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F6F4EE' }}>
            <IconComponent className={`w-6 h-6 ${textColor}`} />
          </div>
          <div className="flex-1">
            <div className={`text-2xl font-bold ${textColor}`}>{count}</div>
            <div className="text-sm text-gray-600">{title}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
