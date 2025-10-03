import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Typography } from '@mui/material';

interface TaskSubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails?: () => void;
  stats?: {
    questionsAttended: number;
    negativeFeedback: number;
    ticketsRaised: number;
  };
}

export const TaskSubmissionSuccessModal: React.FC<TaskSubmissionSuccessModalProps> = ({
  isOpen,
  onClose,
  onViewDetails,
  stats = {
    questionsAttended: 10,
    negativeFeedback: 2,
    ticketsRaised: 2
  }
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <div className="text-center py-8">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-teal-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-teal-500" />
          </div>
          
          {/* Success Message */}
          <Typography variant="h6" className="font-semibold text-gray-900 mb-8">
            Checklist submitted!
          </Typography>
          
          {/* Statistics */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Typography variant="body2" className="text-gray-600">
                No. of questions attended
              </Typography>
              <Typography variant="body2" className="font-semibold text-gray-900">
                {stats.questionsAttended}
              </Typography>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Typography variant="body2" className="text-gray-600">
                Negative feedback
              </Typography>
              <Typography variant="body2" className="font-semibold text-gray-900">
                {String(stats.negativeFeedback).padStart(2, '0')}
              </Typography>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Typography variant="body2" className="text-gray-600">
                Ticket Raised
              </Typography>
              <Typography variant="body2" className="font-semibold text-gray-900">
                {String(stats.ticketsRaised).padStart(2, '0')}
              </Typography>
            </div>
          </div>
          
          {/* Action Button */}
          <Button
            onClick={onViewDetails || onClose}
            className="bg-red-600 text-white hover:bg-red-700 px-8 py-2 rounded-md"
          >
            View details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
