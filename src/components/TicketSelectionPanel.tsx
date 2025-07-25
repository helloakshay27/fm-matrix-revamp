
import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, User, Edit, Download, Loader2 } from 'lucide-react';

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
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50 flex h-[105px]">
      {/* Beige left strip - 44px wide */}
      <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex flex-col items-center justify-center">
        <div className="text-[#C72030] font-bold text-lg">
          {selectedTickets.length}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex items-center justify-between gap-4 px-6 flex-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1a1a1a]">Selection</span>
          </div>
          <div className="flex items-center gap-2">
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
              <User className="w-4 h-4" />
            )}
            Assign To
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
              <Edit className="w-4 h-4" />
            )}
            Update
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
        </div>
      </div>
      
      {/* Cross button - 44px wide */}
      <div className="w-[44px] flex items-center justify-center border-l border-gray-200">
        <Button
          onClick={handleClearSelection}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 hover:bg-gray-100"
        >
          <X className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};
