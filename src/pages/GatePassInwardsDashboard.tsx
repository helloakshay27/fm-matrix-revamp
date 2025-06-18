
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, SlidersHorizontal } from 'lucide-react';
import { GatePassInwardsFilterModal } from '@/components/GatePassInwardsFilterModal';

export const GatePassInwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex gap-3">
          <Button 
            style={{ backgroundColor: '#C72030' }}
            className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Inwards Pass
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded flex items-center gap-2"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Inwards Gate Pass</h2>
          <p>Inwards gate pass records will be displayed here</p>
        </div>
      </div>

      <GatePassInwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
