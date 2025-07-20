
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
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md text-sm font-medium">
              {selectedTickets.length}
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Tickets Selected
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGoldenTicket}
              disabled={isGoldenLoading}
              variant="outline"
              size="sm"
              className="h-10 px-4 gap-2"
            >
              {isGoldenLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Star className="w-4 h-4" />
              )}
              Golden Ticket
            </Button>
            
            <Button
              onClick={handleFlag}
              disabled={isFlagLoading}
              variant="outline"
              size="sm"
              className="h-10 px-4 gap-2"
            >
              {isFlagLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Flag className="w-4 h-4" />
              )}
              Flag
            </Button>
            
            <Button
              onClick={onExport}
              variant="outline"
              size="sm"
              className="h-10 px-4 gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button
              onClick={onClearSelection}
              variant="outline"
              size="sm"
              className="h-10 px-4 gap-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
