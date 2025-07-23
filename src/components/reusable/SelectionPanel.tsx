import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Upload } from 'lucide-react';

interface SelectionAction {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  loading?: boolean;
}

interface SelectionPanelProps {
  selectedCount: number;
  entityName: string; // e.g., "AMC", "Service", "Inventory"
  selectedItems: any[];
  actions: SelectionAction[];
  onAdd: () => void;
  onImport?: () => void;
  onClearSelection: () => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedCount,
  entityName,
  selectedItems,
  actions,
  onAdd,
  onImport,
  onClearSelection,
}) => {
  const getDisplayText = () => {
    if (selectedCount === 0) return '';
    
    if (selectedCount === 1) {
      return selectedItems[0]?.name || selectedItems[0]?.title || `${entityName} #${selectedItems[0]?.id}`;
    }
    
    if (selectedCount <= 3) {
      return selectedItems
        .slice(0, selectedCount)
        .map(item => item?.name || item?.title || `#${item?.id}`)
        .join(', ');
    }
    
    return `${selectedItems.slice(0, 2)
      .map(item => item?.name || item?.title || `#${item?.id}`)
      .join(', ')} and ${selectedCount - 2} more`;
  };

  

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-32 pointer-events-auto"
      onClick={onClearSelection}
    >
      <div 
        className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 pointer-events-auto w-fit mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-2">
          {/* Add button */}
          <Button
            variant="outline"
            size="lg"
            onClick={onAdd}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </Button>

          {/* Import button */}
          {onImport && (
            <Button
              variant="outline"
              size="lg"
              onClick={onImport}
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
                size="lg"
                onClick={action.onClick}
                disabled={action.loading}
                className="flex items-center gap-2"
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