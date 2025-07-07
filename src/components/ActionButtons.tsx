
import React from 'react';
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSave: () => void;
  onBack: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onBack }) => {
  return (
    <div className="flex justify-end gap-4">
      <Button 
        onClick={onSave}
        className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8"
      >
        Save
      </Button>
      <Button 
        onClick={onBack}
        variant="outline"
        className="border-gray-300 text-gray-700 px-8"
      >
        Back
      </Button>
    </div>
  );
};
