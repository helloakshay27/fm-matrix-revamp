import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

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
  onClearSelection: () => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedCount,
  entityName,
  selectedItems,
  actions,
  onAdd,
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

  if (selectedCount === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 pointer-events-auto max-w-4xl w-full mx-4">
        <div className="flex items-center justify-between">
          {/* Left section - Selection info */}
          <div className="flex items-center gap-4">
            <div className="bg-[#C72030] text-white px-3 py-2 rounded-lg font-bold text-lg min-w-[3rem] text-center">
              {selectedCount}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {selectedCount} {entityName}{selectedCount !== 1 ? 's' : ''} Selected
              </div>
              <div className="text-sm text-gray-600">
                {getDisplayText()}
              </div>
            </div>
          </div>

          {/* Middle section - Actions */}
          <div className="flex items-center gap-2">
            {/* Add button */}
            <Button
              variant="outline"
              onClick={onAdd}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>

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
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>

          {/* Right section - Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};