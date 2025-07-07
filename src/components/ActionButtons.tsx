
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
        className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-8"
      >
        Back
      </Button>
    </div>
  );
};
