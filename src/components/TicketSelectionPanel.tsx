
import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, Star, Flag, Download, Loader2 } from 'lucide-react';

interface TicketSelectionPanelProps {
  selectedTickets: string[];
  selectedTicketObjects: any[];
  onGoldenTicket: () => Promise<void>;
  onFlag: () => Promise<void>;
  onExport: () => void;
  onClearSelection: () => void;
}

export const TicketSelectionPanel: React.FC<TicketSelectionPanelProps> = ({
  selectedTickets,
  selectedTicketObjects,
  onGoldenTicket,
  onFlag,
  onExport,
  onClearSelection
}) => {
  const [isGoldenLoading, setIsGoldenLoading] = useState(false);
  const [isFlagLoading, setIsFlagLoading] = useState(false);

  const handleGoldenTicket = async () => {
    setIsGoldenLoading(true);
    try {
      await onGoldenTicket();
    } finally {
      setIsGoldenLoading(false);
    }
  };

  const handleFlag = async () => {
    setIsFlagLoading(true);
    try {
      await onFlag();
    } finally {
      setIsFlagLoading(false);
    }
  };

  const getDisplayText = () => {
    const count = selectedTickets.length;
    if (count === 0) return '';
    
    const firstThree = selectedTickets.slice(0, 3).join(', ');
    if (count <= 3) {
      return `${count} ticket${count > 1 ? 's' : ''} selected: ${firstThree}`;
    }
    
    return `${count} tickets selected: ${firstThree} and ${count - 3} more`;
  };

  if (selectedTickets.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700 font-medium">
              {getDisplayText()}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleGoldenTicket}
              disabled={isGoldenLoading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isGoldenLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Star className="w-4 h-4 mr-2" />
              )}
              Golden Ticket
            </Button>
            
            <Button
              onClick={handleFlag}
              disabled={isFlagLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isFlagLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Flag className="w-4 h-4 mr-2" />
              )}
              Flag
            </Button>
            
            <Button
              onClick={onExport}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button
              onClick={onClearSelection}
              variant="outline"
              className="border-gray-300"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
