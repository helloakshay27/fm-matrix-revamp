import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Upload } from 'lucide-react';

interface SelectionAction {
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  loading?: boolean;
}

interface SelectionPanelProps {
  actions?: SelectionAction[];
  onAdd?: () => void;
  onImport?: () => void;
  onClearSelection?: () => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  actions = [],
  onAdd,
  onImport,
  onClearSelection,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClearSelection?.(); // Close the panel
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClearSelection]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-40 pl-32 pointer-events-none">
      <div
        ref={panelRef}
        className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 pointer-events-auto w-fit mx-4"
      >
        <div className="flex items-center justify-center gap-2">
          {/* Add button */}
          <Button
            variant="destructive"
            onClick={onAdd}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </Button>

          {/* Import button */}
          {onImport && (
            <Button
              variant="destructive"
              onClick={onImport}
              size="lg"
              className="flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Import
            </Button>
          )}

          {/* Dynamic actions */}
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                onClick={action.onClick}
                disabled={action.loading}
                className="flex items-center gap-2"
                size="lg"
              >
                <Icon className="w-5 h-5" />
                {action.label}
              </Button>
            );
          })}

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-500 hover:text-gray-700 ml-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
