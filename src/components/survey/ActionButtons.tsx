
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onSaveAsDraft: () => void;
  onSubmit: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSaveAsDraft,
  onSubmit
}) => {
  return (
    <div className="p-6 border-t border-gray-200 flex justify-center gap-4">
      <Button
        variant="outline"
        onClick={onSaveAsDraft}
        className="px-8 py-2 border-red-600 text-red-600 hover:bg-red-50"
      >
        Save As Draft
      </Button>
      <Button
        onClick={onSubmit}
        className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white"
      >
        Submit
      </Button>
    </div>
  );
};
