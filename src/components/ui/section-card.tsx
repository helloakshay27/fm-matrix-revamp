
import React from 'react';
import { ChevronDown, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isCompleted?: boolean;
  hasErrors?: boolean;
  requiredFieldsCount?: number;
  completedFieldsCount?: number;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  isCompleted = false,
  hasErrors = false,
  requiredFieldsCount = 0,
  completedFieldsCount = 0,
  children,
  className
}) => {
  return (
    <Card className={cn("mb-6 transition-all duration-200", className)}>
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors px-4 sm:px-6 md:px-[50px]"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200",
              isCompleted
                ? "border-green-500 bg-green-50"
                : hasErrors
                ? "border-red-500 bg-red-50"
                : "border-primary bg-primary/10"
            )}
          >
            {isCompleted ? (
              <Check size={18} className="text-green-600" />
            ) : hasErrors ? (
              <AlertCircle size={18} className="text-red-600" />
            ) : (
              <div className="text-primary">{icon}</div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase text-foreground font-['Work_Sans']">
              {title}
            </h3>
            {requiredFieldsCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {completedFieldsCount}/{requiredFieldsCount} required fields completed
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isCompleted && (
            <span className="text-sm text-green-600 font-medium">Complete</span>
          )}
          {hasErrors && (
            <span className="text-sm text-red-600 font-medium">Needs attention</span>
          )}
          {isExpanded ? (
            <ChevronDown size={20} className="text-muted-foreground" />
          ) : (
            <ChevronRight size={20} className="text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="px-4 sm:px-6 md:px-[50px] animate-accordion-down">
          {children}
        </CardContent>
      )}
    </Card>
  );
};
