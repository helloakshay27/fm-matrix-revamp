
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { X, User, Edit, Download, QrCode, Loader2, HandCoins } from 'lucide-react';
import { CostApprovalModal } from './CostApprovalModal';

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
  const navigate = useNavigate();
  const [isGoldenLoading, setIsGoldenLoading] = useState(false);
  const [isFlagLoading, setIsFlagLoading] = useState(false);
  const [isCostApprovalOpen, setIsCostApprovalOpen] = useState(false);

  const handleGoldenTicket = () => {
    console.log('TicketSelectionPanel - Assign To clicked for tickets:', selectedTickets);
    navigate('/maintenance/ticket/assign', {
      state: { selectedTickets: selectedTicketObjects }
    });
  };

  const handleFlag = () => {
    console.log('TicketSelectionPanel - Update clicked for tickets:', selectedTickets);
    navigate('/maintenance/ticket/update', {
      state: { selectedTickets: selectedTicketObjects }
    });
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
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isGoldenLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <User className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Assign To</span>
          </Button>
          
          <Button
            onClick={() => setIsCostApprovalOpen(true)}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <HandCoins className="w-6 h-6 text-black" />
            <span className="text-xs text-gray-600">Cost Approval</span>
          </Button>
          
          <Button
            onClick={handleExport}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <Download className="w-6 h-6 text-black" />
            <span className="text-xs text-gray-600">Export</span>
          </Button>
        </div>
      </div>
      
      {/* Cross button - 44px wide */}
      <div className="w-[44px] flex items-center justify-center border-l border-gray-200">
        <button
          onClick={handleClearSelection}
          className="w-full h-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
        >
          <X className="w-4 h-4 text-black" />
        </button>
      </div>
      
      {/* Cost Approval Modal */}
      <CostApprovalModal
        isOpen={isCostApprovalOpen}
        onClose={() => setIsCostApprovalOpen(false)}
        selectedTickets={selectedTickets}
      />
    </div>
  );
};
