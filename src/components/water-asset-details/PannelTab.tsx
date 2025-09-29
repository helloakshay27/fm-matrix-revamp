import React, { useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Upload,
  Filter,
  AlertCircle,
  Trash2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectionAction {
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
  loading?: boolean;
}

interface SelectionPanelProps {
  actions?: SelectionAction[];
  onAdd?: () => void;
  onImport?: () => void;
  onChecklist?: () => void;
  onClearSelection?: () => void;
  loading?: boolean;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  actions = [],
  onAdd,
  onImport,
  onChecklist,
  onClearSelection,
  loading
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClearSelection?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClearSelection]);

  const defaultActions: SelectionAction[] = [
    ...(onAdd ? [{ label: 'Add', icon: Plus, onClick: onAdd }] : []),
    ...(onImport ? [{ label: 'Import', icon: Upload, onClick: onImport }] : []),
    ...actions,
  ];

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-sm shadow-lg z-50"
      style={{ top: "50%", left: "30%", width: "863px", height: "105px" }}
    >
      <div className="flex items-center justify-between w-full h-full pr-6">
        <div className="flex items-center gap-2">
          <div className="text-[#C72030] bg-[#C4B89D] rounded-lg w-[44px] h-[105px] flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div className="flex flex-col justify-center px-3 py-2 flex-1">
            <span className="text-[16px] font-semibold text-[#1A1A1A] whitespace-nowrap leading-none">
              Actions
            </span>
            <span className="text-[12px] font-medium text-[#6B7280] break-words leading-tight">
              Quick actions available
            </span>
          </div>
        </div>

        <div className="flex items-center ml-10">
          {defaultActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                disabled={action.loading}
                className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5 disabled:opacity-50"
              >
                <Icon className="w-6 h-6 mt-4 mb-2" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}

          <div className="w-px h-8 bg-gray-300 mr-5"></div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="text-gray-600 hover:bg-gray-100"
            style={{ width: "44px", height: "44px" }}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
