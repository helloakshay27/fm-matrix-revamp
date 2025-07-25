
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
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-l-4 border-l-[#C4B59A] border-r border-t border-b border-[#A6966E] shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50" style={{ width: '800px', height: '60px' }}>
      <div className="flex items-center h-full px-4 gap-4">
        {/* Selection Title */}
        <div className="text-sm font-medium text-[#1a1a1a] whitespace-nowrap">Selection</div>
        
        {/* Selected Items */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {selectedTicketObjects.map((ticket, index) => (
            <div key={ticket.id || index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs whitespace-nowrap">
              <span className="text-gray-700">{ticket.ticket_number || `Ticket ${index + 1}`}</span>
              <button 
                onClick={() => {
                  // Remove this specific ticket from selection
                  const updatedSelection = selectedTickets.filter((_, i) => i !== index);
                  // This would need to be handled by parent component
                }}
                className="text-gray-500 hover:text-gray-700 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            onClick={handleGoldenTicket}
            disabled={isGoldenLoading}
            variant="outline"
            size="sm"
            className="gap-1 bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 h-7 px-2 text-xs font-medium whitespace-nowrap"
          >
            {isGoldenLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Star className="w-3 h-3" />
            )}
            Move Assets
          </Button>
          
          <Button
            onClick={handleFlag}
            disabled={isFlagLoading}
            variant="outline"
            size="sm"
            className="gap-1 bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 h-7 px-2 text-xs font-medium whitespace-nowrap"
          >
            {isFlagLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Flag className="w-3 h-3" />
            )}
            Print QR
          </Button>
          
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="gap-1 bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 h-7 px-2 text-xs font-medium whitespace-nowrap"
          >
            <Download className="w-3 h-3" />
            Download
          </Button>
          
          <Button
            onClick={handleGoldenTicket}
            disabled={isGoldenLoading}
            variant="outline"
            size="sm"
            className="gap-1 bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 h-7 px-2 text-xs font-medium whitespace-nowrap"
          >
            {isGoldenLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Flag className="w-3 h-3" />
            )}
            Dispose
          </Button>
        </div>
        
        {/* Main Close Button */}
        <Button
          onClick={handleClearSelection}
          variant="outline"
          size="sm"
          className="bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 h-7 w-7 p-0 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
