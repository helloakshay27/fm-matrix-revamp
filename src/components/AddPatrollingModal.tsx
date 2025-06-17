
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddPatrollingForm } from './AddPatrollingForm';

interface AddPatrollingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPatrollingModal = ({ isOpen, onClose }: AddPatrollingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add</DialogTitle>
        </DialogHeader>
        
        <AddPatrollingForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
