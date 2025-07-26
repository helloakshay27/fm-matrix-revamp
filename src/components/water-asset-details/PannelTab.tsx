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
import { useLayout } from '@/contexts/LayoutContext';

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
  const { isSidebarCollapsed } = useLayout();


  return (
    <div
      className={`fixed z-50 flex items-end justify-center pb-8 sm:pb-[16rem] pointer-events-none transition-all duration-300 ${isSidebarCollapsed ? 'left-16' : 'left-64'
        } right-0 bottom-0`}
    >      {/* Main panel + right bar container */}
      <div className="flex max-w-full pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-lg mx-4 overflow-hidden">
        {/* Right vertical bar */}
        <div className="hidden sm:flex w-8 bg-[#C4B89D54] items-center justify-center text-red-600 font-semibold text-sm">
        </div>

        {/* Main content */}
        <div ref={panelRef} className="p-4 sm:p-6 w-full sm:w-auto">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 sm:gap-12">
            {defaultActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.loading}
                  className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </button>
              );
            })}

            {/* Vertical divider */}
            <div className="w-px h-8 bg-black opacity-20 mx-2 sm:mx-4" />

            {/* Close icon */}
            <div
              onClick={onClearSelection}
              className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 w-16 sm:w-auto"
            >
              <X className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium text-center">Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
