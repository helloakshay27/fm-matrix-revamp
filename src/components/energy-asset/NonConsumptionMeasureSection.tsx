
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { MeasureForm } from './MeasureForm';

interface NonConsumptionMeasureSectionProps {
  expanded: boolean;
  onToggle: () => void;
  measures: any[];
  onAddMeasure: () => void;
  onRemoveMeasure: (index: number) => void;
}

export const NonConsumptionMeasureSection: React.FC<NonConsumptionMeasureSectionProps> = ({
  expanded,
  onToggle,
  measures,
  onAddMeasure,
  onRemoveMeasure
}) => {
  return (
    <div className="mb-6">
      <div 
        className="flex items-center gap-3 mb-4 cursor-pointer"
        onClick={onToggle}
      >
        <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
          6+
        </div>
        <h3 className="text-lg font-semibold text-sidebar-foreground flex-1">NON CONSUMPTION ASSET MEASURE</h3>
        {expanded ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
      </div>
      
      {expanded && (
        <div className="bg-white p-6 rounded-lg border border-sidebar-border">
          {measures.map((measure, index) => (
            <MeasureForm
              key={index}
              index={index}
              onRemove={index > 0 ? () => onRemoveMeasure(index) : undefined}
              showRemove={index > 0}
            />
          ))}
          <Button
            variant="outline"
            onClick={onAddMeasure}
            className="w-full border-dashed border-2 border-red-300 text-red-600 hover:bg-red-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add More
          </Button>
        </div>
      )}
    </div>
  );
};
