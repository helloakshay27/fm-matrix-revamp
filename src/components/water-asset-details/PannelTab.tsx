import React, { useEffect, useRef } from "react";
import {
  X,
  Plus,
  Upload,
  Filter,
  AlertCircle,
  Trash2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  mobileSheet?: boolean;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  actions = [],
  onAdd,
  onImport,
  onChecklist,
  onClearSelection,
  loading,
  mobileSheet = true,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClearSelection?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClearSelection]);

  const defaultActions: SelectionAction[] = [
    ...(onAdd ? [{ label: "Add", icon: Plus, onClick: onAdd }] : []),
    ...(onImport ? [{ label: "Import", icon: Upload, onClick: onImport }] : []),
    ...actions,
  ];

  return (
    <div
      className="fixed bottom-3 left-3 right-3 z-50 flex h-[105px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] sm:bottom-6 sm:left-1/2 sm:right-auto sm:w-max sm:max-w-[calc(100vw-1.5rem)] sm:-translate-x-1/2"
      ref={panelRef}
    >
      <div className="flex h-[105px] w-full items-center pr-2 sm:pr-6">
        <div className="flex min-w-0 items-center gap-2 self-stretch sm:flex-shrink-0 sm:gap-3">
          <div className="text-[#C72030] bg-[#C4B89D] rounded-l-lg w-[44px] flex-shrink-0 flex items-center justify-center text-xs font-bold self-stretch">
            A
          </div>
          <div className="flex min-w-0 flex-col justify-center px-2 py-2 sm:px-3">
            <span className="truncate text-[16px] font-semibold text-[#1A1A1A] leading-none">
              Actions
            </span>
            <span className="hidden text-[12px] font-medium text-[#6B7280] whitespace-nowrap leading-tight mt-1 sm:block">
              Quick actions available
            </span>
          </div>
        </div>

        <div className="ml-2 flex flex-shrink-0 items-center gap-1 sm:ml-8 sm:gap-4">
          {defaultActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                disabled={action.loading}
                className="text-gray-600 hover:bg-gray-100 flex flex-col items-center justify-center disabled:opacity-50 w-[54px] h-[64px] p-1.5 sm:w-[60px] sm:h-[70px] sm:p-2"
              >
                <Icon className="w-5 h-5 mb-0.5 sm:mb-1" />
                <span className="text-[11px] font-medium text-center leading-tight sm:text-xs">
                  {action.label}
                </span>
              </Button>
            );
          })}

          <div className="h-12 w-px bg-gray-300 mx-1 sm:mx-2"></div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="text-gray-600 hover:bg-gray-100 flex items-center justify-center w-9 h-11 sm:w-11 sm:h-11"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
