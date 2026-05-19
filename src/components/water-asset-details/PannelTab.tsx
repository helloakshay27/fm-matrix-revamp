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
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  actions = [],
  onAdd,
  onImport,
  onChecklist,
  onClearSelection,
  loading,
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
      className="selection-panel bg-white"
      style={{ top: "50%", left: "30%", width: "max-content", height: "105px" }}
      ref={panelRef}
    >
      <div
        className="flex items-center w-full pr-4 md:pr-6"
        style={{ minHeight: "105px" }}
      >
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-[#C72030] bg-[#C4B89D] rounded-lg w-[44px] flex-shrink-0 flex items-center justify-center text-xs font-bold self-stretch">
            A
          </div>
          <div className="flex flex-col justify-center px-2 md:px-3 py-2">
            <span className="text-[16px] font-semibold text-[#1A1A1A] whitespace-nowrap leading-none">
              Actions
            </span>
            <span className="text-[12px] font-medium text-[#6B7280] whitespace-nowrap leading-tight mt-1">
              Quick actions available
            </span>
          </div>
        </div>

        <div className="flex items-center ml-2 md:ml-8 gap-1 md:gap-4 flex-wrap md:flex-nowrap flex-1">
          {defaultActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                disabled={action.loading}
                className="text-gray-600 hover:bg-gray-100 flex flex-col items-center justify-center h-auto p-2 disabled:opacity-50"
                style={{ width: "60px", height: "70px" }}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            );
          })}

          <div className="w-px h-12 bg-gray-300 mx-1 md:mx-2"></div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="text-gray-600 hover:bg-gray-100 flex items-center justify-center"
            style={{ width: "44px", height: "44px" }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
