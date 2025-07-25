
import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, Star, Flag, Download, Loader2 } from 'lucide-react';

interface TicketSelectionPanelProps {
  selectedTickets: number[];
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
    console.log('TicketSelectionPanel - Golden Ticket clicked for tickets:', selectedTickets);
    setIsGoldenLoading(true);
    try {
      await onGoldenTicket();
    } catch (error) {
      console.error('Golden Ticket action failed:', error);
    } finally {
      setIsGoldenLoading(false);
    }
  };

  const handleFlag = async () => {
    console.log('TicketSelectionPanel - Flag clicked for tickets:', selectedTickets);
    setIsFlagLoading(true);
    try {
      await onFlag();
    } catch (error) {
      console.error('Flag action failed:', error);
    } finally {
      setIsFlagLoading(false);
    }
  };

  const handleExport = () => {
    console.log('TicketSelectionPanel - Export clicked for tickets:', selectedTickets);
    onExport();
  };

  const handleClearSelection = () => {
    console.log('TicketSelectionPanel - Clear selection clicked');
    onClearSelection();
  };

  if (selectedTickets.length === 0) {
    console.log('TicketSelectionPanel - No tickets selected, hiding panel');
    return null;
  }

  console.log('TicketSelectionPanel - Rendering with selected tickets:', selectedTickets);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#C4B59A] border border-[#A6966E] shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#1a1a1a]">Selection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#C72030] text-white px-2 py-1 rounded text-xs font-medium">
                {selectedTickets.length}
              </div>
              <span className="text-xs text-gray-600">
                {selectedTicketObjects.slice(0, 2).map(ticket => ticket.ticket_number).join(', ')}
                {selectedTicketObjects.length > 2 && ` +${selectedTicketObjects.length - 2} more`}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGoldenTicket}
              disabled={isGoldenLoading}
              variant="outline"
              size="sm"
              className="gap-2 bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 h-8 px-3 text-xs font-medium"
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
              className="gap-2 bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 h-8 px-3 text-xs font-medium"
            >
              {isFlagLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Flag className="w-4 h-4" />
              )}
              Flag
            </Button>
            
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="gap-2 bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 h-8 px-3 text-xs font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button
              onClick={handleClearSelection}
              variant="outline"
              size="sm"
              className="gap-2 bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 h-8 px-3 text-xs font-medium"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
