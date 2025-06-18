
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MeterCategorySectionProps {
  expanded: boolean;
  onToggle: () => void;
}

export const MeterCategorySection: React.FC<MeterCategorySectionProps> = ({
  expanded,
  onToggle
}) => {
  return (
    <div className="mb-6">
      <div 
        className="flex items-center gap-3 mb-4 cursor-pointer"
        onClick={onToggle}
      >
        <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
          4
        </div>
        <h3 className="text-lg font-semibold text-sidebar-foreground">Meter Category Type</h3>
        {expanded ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
      </div>
      
      {expanded && (
        <div className="bg-white p-6 rounded-lg border border-sidebar-border">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
              <input type="radio" name="meterCategory" value="board" className="mb-2" />
              <span className="text-2xl mb-2">📋</span>
              <span className="text-sm text-sidebar-foreground">Board</span>
            </label>
            <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
              <input type="radio" name="meterCategory" value="dg" className="mb-2" />
              <span className="text-2xl mb-2">⚡</span>
              <span className="text-sm text-sidebar-foreground">DG</span>
            </label>
            <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
              <input type="radio" name="meterCategory" value="renewable" className="mb-2" />
              <span className="text-2xl mb-2">🔄</span>
              <span className="text-sm text-sidebar-foreground">Renewable</span>
            </label>
            <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
              <input type="radio" name="meterCategory" value="freshWater" className="mb-2" />
              <span className="text-2xl mb-2">💧</span>
              <span className="text-sm text-sidebar-foreground">Fresh Water</span>
            </label>
            <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
              <input type="radio" name="meterCategory" value="recycled" className="mb-2" />
              <span className="text-2xl mb-2">♻️</span>
              <span className="text-sm text-sidebar-foreground">Recycled</span>
            </label>
            <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
              <input type="radio" name="meterCategory" value="iexGdam" className="mb-2" />
              <span className="text-2xl mb-2">🏭</span>
              <span className="text-sm text-sidebar-foreground">IEX-GDAM</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
