
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { X, User, Edit, Download, QrCode, Loader2, HandCoins } from 'lucide-react';
import { CostApprovalModal } from './CostApprovalModal';
import { getFullUrl, getAuthHeader, ENDPOINTS } from '@/config/apiConfig';
import { useToast } from '@/hooks/use-toast';

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
  const [isExportLoading, setIsExportLoading] = useState(false);
  const { toast } = useToast();

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

  const handleExport = async () => {
    console.log('TicketSelectionPanel - Export clicked for tickets:', selectedTickets);
    
    if (selectedTickets.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select tickets to export.",
        variant: "destructive"
      });
      return;
    }

    setIsExportLoading(true);
    
    try {
      // Create the ticket IDs query parameters in the correct format: q[id_in][]=1&q[id_in][]=2
      const ticketParams = selectedTickets.map(id => `q[id_in][]=${id}`).join('&');
      console.log('📥 Exporting tickets with IDs:', selectedTickets);
      console.log('📥 Generated ticket parameters:', ticketParams);
      
      // Build the export URL with selected ticket IDs using the correct format
      const exportEndpoint = `${ENDPOINTS.TICKETS_EXPORT_EXCEL}?${ticketParams}`;
      const exportUrl = getFullUrl(exportEndpoint);
      
      console.log('📥 Export endpoint:', exportEndpoint);
      console.log('📥 Full export URL:', exportUrl);

      // Make the API call to get the Excel file
      const response = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Export API error response:', errorText);
        
        if (response.status === 401) {
          console.error('401 Authentication failed during export - invalid or expired token');
          throw new Error('Authentication failed. Please login again.');
        }
        
        throw new Error(`Export failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Get the file blob
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `selected_tickets_${selectedTickets.length}_${timestamp}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('Export completed successfully');
      toast({
        title: "Export Successful",
        description: `Successfully exported ${selectedTickets.length} ticket(s).`
      });
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      
      // Handle authentication errors specifically
      if (error instanceof Error && error.message.includes('Authentication failed')) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please login again.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Export Failed",
        description: `Failed to export tickets: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsExportLoading(false);
    }
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
            disabled={isExportLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isExportLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <Download className="w-6 h-6 text-black" />
            )}
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
