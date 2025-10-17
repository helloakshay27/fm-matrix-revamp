import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Loader2, FileText, User, MapPin, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TextField } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import html2pdf from 'html2pdf.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { OIG_LOGO_CODE } from "@/assets/pdf/oig-logo-code";
import { VI_LOGO_CODE } from "@/assets/vi-logo-code";
import { DEFAULT_LOGO_CODE } from "@/assets/default-logo-code";

interface TicketComment {
  id?: number;
  comment: string;
  commented_by?: string;
  created_at?: string;
}

interface TicketData {
  id: number;
  ticket_id?: string;
  ticket_number?: string;
  title?: string;
  heading?: string;
  description?: string;
  status?: string;
  priority?: string;
  category_name?: string;
  subcategory_name?: string;
  category_type?: string;
  sub_category_type?: string;
  created_at?: string;
  updated_at?: string;
  expected_completion_date?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  assigned_to_email?: string;
  society_id?: number;
  society_name?: string;
  society_address?: string;
  building_name?: string;
  wing_name?: string;
  floor_name?: string;
  area_name?: string;
  room_name?: string;
  asset_id?: number;
  asset_name?: string;
  asset_code?: string;
  comments?: TicketComment[];
  created_by_name?: string;
  asset_service?: string;
  response_tat?: number;
  resolution_tat?: number;
  preventive_action?: string;
  corrective_action?: string;
  visit_date?: string;
  severity?: string;
  root_cause?: string;
  feedback?: string;
}

interface TicketJobSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketData: TicketData | null;
  jobSheetData: TicketData | null;
  jobSheetLoading: boolean;
}

export const TicketJobSheetModal: React.FC<TicketJobSheetModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  ticketData,
  jobSheetData,
  jobSheetLoading
}) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!ticketData || !contentRef.current) {
      toast({
        title: 'Error',
        description: 'No ticket data available to download',
        variant: 'destructive'
      });
      return;
    }

    setIsDownloading(true);
    try {
      const element = contentRef.current;

      // Render the logo components as JSX elements
      const defaultLogo = renderToStaticMarkup(<DEFAULT_LOGO_CODE />);

      const headerHTML = `
      <div style="position: relative; width: 100%; height: 50px;">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          background-color: #C4B89D59;
          height: 45px;
          width: 1000px;
          display: inline-block;
          padding: 8px 0 0 8px;
        ">${defaultLogo}</div>
      </div>
    `;

      const fullContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .header { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #D9D9D9; background-color: #F6F4EE; }
              .logo { margin: 0 10px; }
              .header-text { margin: 0 0 18px 0 !important; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 0.5px solid #000; padding: 6px 8px 6px 8px; text-align: left; vertical-align: middle; }
              .bg-gray-100 { background-color: #f3f4f6; }
              .bg-tan { background-color: #D2B48C; }
              .bg-gray-200 { background-color: #e5e7eb; }
              .font-bold { font-weight: bold; }
              .font-semibold { font-weight: 600; }
              .text-center { text-align: center; }
              .py-3 { padding-top: 12px; padding-bottom: 12px; }
              .px-4 { padding-left: 16px; padding-right: 16px; }
              .py-2 { padding-top: 8px; padding-bottom: 8px; }
              .px-3 { padding-left: 12px; padding-right: 12px; }
              .mb-4 { margin-bottom: 16px; }
              .space-y-4 > * + * { margin-top: 8px; }
              .space-y-2 > * + * { margin-top: 8px; }
              .min-h-20 { min-height: 80px; }
              .min-h-24 { min-height: 100px; }
              .flex { display: flex; }
              .justify-center { justify-content: center; }
              .items-center { align-items: center; }
              .gap-8 { gap: 32px; }
              .text-sm { font-size: 14px; }
              .text-xs { font-size: 12px; }

              /* Job Card header center alignment for PDF */
              .bg-\\[\\#C4B89D\\] { 
                background-color: #C4B89D !important; 
                text-align: center !important; 
                padding: 6px 8px 6px 8px !important; 
                font-weight: bold !important; 
                font-size: 18px !important; 
                border: 1px solid #999 !important; 
              }

              input[type="checkbox"] { margin: 0 4px; }
            </style>
          </head>
          <body>
            ${headerHTML}
            <div style="padding: 5px 30px 30px 30px;">${element.innerHTML}</div>
          </body>
        </html>
      `;

      const opt = {
        margin: 0,
        filename: `ticket_job_sheet_${ticketData.ticket_number || ticketData.ticket_id || ticketData.id}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, logging: false, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" as const },
      };

      await html2pdf().from(fullContent).set(opt).save();

      toast({
        title: 'Success',
        description: 'Ticket job sheet PDF downloaded successfully!'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-7xl max-h-[95vh] overflow-y-auto"
        aria-describedby="ticket-job-sheet-dialog-description"
      >
        <span id="ticket-job-sheet-dialog-description" className="sr-only">
          View and manage job sheet details for the ticket with PDF download functionality.
        </span>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-[#C72030]">
            Job Sheet - Ticket #{ticketData?.ticket_number || ticketData?.ticket_id || ticketData?.id}
          </DialogTitle>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownloadPDF}
              className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {jobSheetLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
              <span className="ml-3 text-lg">Loading job sheet...</span>
            </div>
          ) : (
            <div ref={contentRef} className="space-y-6">
              {/* Job Card Header */}
              <div className="bg-[#C4B89D] text-center py-3 font-bold text-lg border border-gray-400">
                Job Card
              </div>

              {/* Spacing between header and table */}
              <div className="h-4"></div>

              {/* Job Card Table */}
              <div>
                <table className="w-full border-collapse">
                  <tbody>
                    {/* Description Row */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold w-1/6" style={{backgroundColor: '#C4B89D59'}}>Description</td>
                      <td colSpan={3} className="border border-gray-300 px-3 py-2 min-h-[60px]" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.heading || ticketData?.description || 'No description provided'}
                      </td>
                    </tr>
                    
                    {/* Row 1 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold w-1/6" style={{backgroundColor: '#C4B89D59'}}>Ticket Id</td>
                      <td className="border border-gray-300 px-3 py-2 w-1/6" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.ticket_number || ticketData?.ticket_id || ticketData?.id || '-'}</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold w-1/6" style={{backgroundColor: '#C4B89D59'}}>Status</td>
                      <td className="border border-gray-300 px-3 py-2 w-1/6" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.status || 'Open'}</td>
                    </tr>
                    
                    {/* Row 2 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Category</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.category_type || ticketData?.category_name || '-'}</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Sub Category</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.sub_category_type || ticketData?.subcategory_name || '-'}</td>
                    </tr>
                    
                    {/* Row 3 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Created On</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.created_at ? new Date(ticketData.created_at).toLocaleDateString('en-GB') : 'DD/MM/YYYY'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Created By</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.created_by_name || 'User'}</td>
                    </tr>
                    
                    {/* Row 4 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Priority</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.priority || 'P1'}</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Assigned to</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.assigned_to || '-'}</td>
                    </tr>
                    
                    {/* Row 5 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Issue Type</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>Complaint</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Related to</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>Maintenance</td>
                    </tr>
                    
                    {/* Row 6 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Associated To</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.asset_service || '-'}</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Location</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {[
                          ticketData?.building_name,
                          ticketData?.wing_name,
                          ticketData?.floor_name,
                          ticketData?.area_name,
                          ticketData?.room_name
                        ].filter(Boolean).join(', ') || '-'}
                      </td>
                    </tr>
                    
                    {/* Row 7 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Response TAT</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.response_tat ? `${ticketData.response_tat} Mins` : '30 Mins'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Resolution TAT</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.resolution_tat ? `${ticketData.resolution_tat} Hour` : '1 Hour'}
                      </td>
                    </tr>
                    
                    {/* Row 8 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Preventive Action</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.preventive_action || 'Test'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Corrective Action</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.corrective_action || 'Test'}
                      </td>
                    </tr>
                    
                    {/* Row 9 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Expected Visit Date</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.visit_date || 'DD/MM/YYYY'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Expected Closer Date</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.expected_completion_date ? new Date(ticketData.expected_completion_date).toLocaleDateString('en-GB') : 'DD/MM/YYYY'}
                      </td>
                    </tr>
                    
                    {/* Row 10 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Severity</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.severity || 'High'}</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Root Cause</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.root_cause || 'Test'}</td>
                    </tr>
                    
                    {/* Comments Row */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Comments</td>
                      <td colSpan={3} className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.description || 'Test'}
                      </td>
                    </tr>
                    
                    {/* Feedback Checkboxes Row */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Feedback</td>
                      <td className="border border-gray-300 px-3 py-2 text-center" style={{backgroundColor: '#EFF1F1'}}>
                        <input type="checkbox" className="transform scale-110" disabled />
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center" style={{backgroundColor: '#EFF1F1'}}>
                        <input type="checkbox" className="transform scale-110" disabled />
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center" style={{backgroundColor: '#EFF1F1'}}>
                        <input type="checkbox" className="transform scale-110" disabled />
                      </td>
                    </tr>
                    
                    {/* Feedback Labels Row */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}></td>
                      <td className="border border-gray-300 px-3 py-2 text-center" style={{backgroundColor: '#EFF1F1'}}>
                        <div className="text-xs font-bold text-gray-800">Need Improvement</div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center" style={{backgroundColor: '#EFF1F1'}}>
                        <div className="text-xs font-bold text-gray-800">Satisfied</div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center" style={{backgroundColor: '#EFF1F1'}}>
                        <div className="text-xs font-bold text-gray-800">Not Satisfied</div>
                      </td>
                    </tr>
                    
                    {/* Your Valuable Feedback Row */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Your Valuable Feedback</td>
                      <td colSpan={3} className="border border-gray-300 px-3 py-2 min-h-[80px]" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.feedback || ''}
                      </td>
                    </tr>
                    
                    {/* Customer Signature Row */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Customer Signature</td>
                      <td colSpan={3} className="border border-gray-300 px-3 py-2 min-h-[100px]" style={{backgroundColor: '#EFF1F1'}}>
                        {/* Signature area - could be an image or empty for manual signature */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};