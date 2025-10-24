import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { API_CONFIG } from '@/config/apiConfig';

interface TicketComment {
  id?: number;
  comment: string;
  commented_by?: string;
  created_at?: string;
}

interface ComplaintLog {
  id: number;
  complaint_id: number;
  complaint_status_id: number | null;
  changed_by: number | null;
  priority: string | null;
  created_at: string;
  updated_at: string;
  log_comment: string;
  log_status: string | null;
  log_by: string | null;
  documents: any[];
}

interface CommunicationTemplate {
  id: number;
  identifier: string;
  resource_id: number;
  resource_type: string;
  body: string;
  identifier_action: string;
  active: boolean;
  created_by_id: number;
  created_at: string;
  updated_at: string;
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
  complaint_logs?: ComplaintLog[];
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
  rca_template_ids?: number[];
  corrective_action_template_ids?: number[];
  preventive_action_template_ids?: number[];
  issue_status?: string;
  issue_related_to?: string;
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
  const [communicationTemplates, setCommunicationTemplates] = useState<CommunicationTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Priority labels mapping
  const priorityLabels: { [key: string]: string } = {
    "P1": "P1 - Critical",
    "P2": "P2 - Very High", 
    "P3": "P3 - High",
    "P4": "P4 - Medium",
    "P5": "P5 - Low"
  };

  const getPriorityDisplay = (priority: string | undefined) => {
    if (!priority) return '-';
    return priorityLabels[priority] || '-';
  };

  // Fetch communication templates from API
  const fetchCommunicationTemplates = useCallback(async () => {
    console.log('Fetching communication templates...');
    console.log('API Config:', {
      BASE_URL: API_CONFIG.BASE_URL,
      TOKEN_present: !!API_CONFIG.TOKEN,
      ENDPOINT: API_CONFIG.ENDPOINTS.COMMUNICATION_TEMPLATES
    });

    if (!API_CONFIG.BASE_URL || !API_CONFIG.TOKEN) {
      console.warn('Missing API configuration', {
        BASE_URL: API_CONFIG.BASE_URL,
        TOKEN: !!API_CONFIG.TOKEN
      });
      return;
    }

    setLoadingTemplates(true);
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMMUNICATION_TEMPLATES}`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch communication templates: ${response.status} - ${errorText}`);
      }

      const templates = await response.json();
      console.log('Received templates:', {
        count: templates?.length || 0,
        sample: templates?.slice(0, 3),
        rcaTemplates: templates?.filter((t: CommunicationTemplate) => t.identifier === "Root Cause Analysis")
      });

      setCommunicationTemplates(templates || []);
      
      // Log success
    //   toast({
    //     title: 'Success',
    //     description: `Loaded ${templates?.length || 0} communication templates`,
    //   });
    } catch (error) {
      console.error('Error fetching communication templates:', error);
      toast({
        title: 'Error',
        description: `Could not load communication templates: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setLoadingTemplates(false);
    }
  }, [toast]);

  // Fetch templates when modal opens
  useEffect(() => {
    if (isOpen && communicationTemplates.length === 0) {
      console.log('Modal opened, fetching communication templates...');
      fetchCommunicationTemplates();
    }
  }, [isOpen, communicationTemplates.length, fetchCommunicationTemplates]);

  // Debug ticket data
  useEffect(() => {
    if (ticketData) {
      console.log('Ticket data received:', {
        id: ticketData.id,
        rca_template_ids: ticketData.rca_template_ids,
        corrective_action_template_ids: ticketData.corrective_action_template_ids,
        preventive_action_template_ids: ticketData.preventive_action_template_ids,
        hasRcaIds: !!ticketData.rca_template_ids?.length,
        hasCorrectiveIds: !!ticketData.corrective_action_template_ids?.length,
        hasPreventiveIds: !!ticketData.preventive_action_template_ids?.length,
        allTicketKeys: Object.keys(ticketData)
      });
    }
  }, [ticketData]);

  const getRootCauseDisplay = () => {
    // Debug logging
    console.log('getRootCauseDisplay called:', {
      ticketData_rca_template_ids: ticketData?.rca_template_ids,
      communicationTemplates_length: communicationTemplates.length,
      loadingTemplates,
      communicationTemplates_sample: communicationTemplates.slice(0, 3)
    });

    if (!ticketData?.rca_template_ids || ticketData.rca_template_ids.length === 0) {
      console.log('No rca_template_ids found');
      return '-';
    }

    if (loadingTemplates) {
      return 'Loading...';
    }

    if (communicationTemplates.length === 0) {
      console.log('No communication templates loaded');
      return 'No templates loaded';
    }

    // Find templates that match the IDs in rca_template_ids
    const rcaTemplates = communicationTemplates.filter(
      template => {
        const matchesId = ticketData.rca_template_ids!.includes(template.id);
        const matchesIdentifier = template.identifier === "Root Cause Analysis";
        
        console.log(`Template ${template.id}:`, {
          id: template.id,
          identifier: template.identifier,
          matchesId,
          matchesIdentifier,
         identifier_action: template.identifier_action.substring(0, 50) + '...'
        });
        
        return matchesId && matchesIdentifier;
      }
    );

    console.log('Filtered RCA templates:', rcaTemplates.length, rcaTemplates);

    if (rcaTemplates.length === 0) {
      // Try to find any templates with matching IDs regardless of identifier
      const anyMatchingTemplates = communicationTemplates.filter(
        template => ticketData.rca_template_ids!.includes(template.id)
      );
      console.log('Any matching templates by ID:', anyMatchingTemplates);
      
      if (anyMatchingTemplates.length > 0) {
        return anyMatchingTemplates.map(template => template.identifier_action).join(', ');
      }
      
      return 'No matching templates found';
    }

    // Return the body content of matching templates
    const result = rcaTemplates.map(template => template.identifier_action).join(', ');
    console.log('Final result:', result);
    return result;
  };

  const getCorrectiveActionDisplay = () => {
    // Debug logging
    console.log('getCorrectiveActionDisplay called:', {
      ticketData_corrective_action_template_ids: ticketData?.corrective_action_template_ids,
      communicationTemplates_length: communicationTemplates.length,
      loadingTemplates
    });

    if (!ticketData?.corrective_action_template_ids || ticketData.corrective_action_template_ids.length === 0) {
      console.log('No corrective_action_template_ids found');
      return '-';
    }

    if (loadingTemplates) {
      return 'Loading...';
    }

    if (communicationTemplates.length === 0) {
      console.log('No communication templates loaded');
      return 'No templates loaded';
    }

    // Find templates that match the IDs in corrective_action_template_ids
    const correctiveActionTemplates = communicationTemplates.filter(
      template => {
        const matchesId = ticketData.corrective_action_template_ids!.includes(template.id);
        const matchesIdentifier = template.identifier === "Corrective Action";
        
        console.log(`Corrective Action Template ${template.id}:`, {
          id: template.id,
          identifier: template.identifier,
          matchesId,
          matchesIdentifier,
          identifier_action: template.identifier_action.substring(0, 50) + '...'
        });
        
        return matchesId && matchesIdentifier;
      }
    );

    console.log('Filtered Corrective Action templates:', correctiveActionTemplates.length, correctiveActionTemplates);

    if (correctiveActionTemplates.length === 0) {
      // Try to find any templates with matching IDs regardless of identifier
      const anyMatchingTemplates = communicationTemplates.filter(
        template => ticketData.corrective_action_template_ids!.includes(template.id)
      );
      console.log('Any matching corrective action templates by ID:', anyMatchingTemplates);
      
      if (anyMatchingTemplates.length > 0) {
        return anyMatchingTemplates.map(template => template.identifier_action).join(', ');
      }
      
      return 'No matching templates found';
    }

    // Return the identifier_action content of matching templates
    const result = correctiveActionTemplates.map(template => template.identifier_action).join(', ');
    console.log('Final corrective action result:', result);
    return result;
  };

  const getPreventiveActionDisplay = () => {
    // Debug logging
    console.log('getPreventiveActionDisplay called:', {
      ticketData_preventive_action_template_ids: ticketData?.preventive_action_template_ids,
      communicationTemplates_length: communicationTemplates.length,
      loadingTemplates
    });

    if (!ticketData?.preventive_action_template_ids || ticketData.preventive_action_template_ids.length === 0) {
      console.log('No preventive_action_template_ids found');
      return '-';
    }

    if (loadingTemplates) {
      return 'Loading...';
    }

    if (communicationTemplates.length === 0) {
      console.log('No communication templates loaded');
      return 'No templates loaded';
    }

    // Find templates that match the IDs in preventive_action_template_ids
    const preventiveActionTemplates = communicationTemplates.filter(
      template => {
        const matchesId = ticketData.preventive_action_template_ids!.includes(template.id);
        const matchesIdentifier = template.identifier === "Preventive Action";
        
        console.log(`Preventive Action Template ${template.id}:`, {
          id: template.id,
          identifier: template.identifier,
          matchesId,
          matchesIdentifier,
          identifier_action: template.identifier_action.substring(0, 50) + '...'
        });
        
        return matchesId && matchesIdentifier;
      }
    );

    console.log('Filtered Preventive Action templates:', preventiveActionTemplates.length, preventiveActionTemplates);

    if (preventiveActionTemplates.length === 0) {
      // Try to find any templates with matching IDs regardless of identifier
      const anyMatchingTemplates = communicationTemplates.filter(
        template => ticketData.preventive_action_template_ids!.includes(template.id)
      );
      console.log('Any matching preventive action templates by ID:', anyMatchingTemplates);
      
      if (anyMatchingTemplates.length > 0) {
        return anyMatchingTemplates.map(template => template.identifier_action).join(', ');
      }
      
      return 'No matching templates found';
    }

    // Return the identifier_action content of matching templates
    const result = preventiveActionTemplates.map(template => template.identifier_action).join(', ');
    console.log('Final preventive action result:', result);
    return result;
  };

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
            {/* Job Sheet - Ticket #{ticketData?.ticket_number || ticketData?.ticket_id || ticketData?.id} */}
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
            <div ref={contentRef} className="">
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
                      <td className="border border-gray-300 px-3 py-2 w-1/6" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.issue_status || '-'}</td>
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
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{getPriorityDisplay(ticketData?.priority)}</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Assigned to</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.assigned_to || '-'}</td>
                    </tr>
                    
                    {/* Row 5 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Issue Type</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>Complaint</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Related to</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.issue_related_to || '-'}</td>
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
                        {getPreventiveActionDisplay()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Corrective Action</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {getCorrectiveActionDisplay()}
                      </td>
                    </tr>
                    
                    {/* Row 9 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Expected Visit Date</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.visit_date || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Expected Closer Date</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {ticketData?.expected_completion_date ? new Date(ticketData.expected_completion_date).toLocaleDateString('en-GB') : '-'}
                      </td>
                    </tr>
                    
                    {/* Row 10 */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Severity</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{ticketData?.severity || '-'}</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Root Cause</td>
                      <td className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>{getRootCauseDisplay()}</td>
                    </tr>
                    
                    {/* Comments Row */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-bold" style={{backgroundColor: '#C4B89D59'}}>Comments</td>
                      <td colSpan={3} className="border border-gray-300 px-3 py-2" style={{backgroundColor: '#EFF1F1'}}>
                        {(() => {
                          if (ticketData?.complaint_logs && Array.isArray(ticketData.complaint_logs) && ticketData.complaint_logs.length > 0) {
                            // Get the last complaint log with a non-empty log_comment
                            const logsWithComments = ticketData.complaint_logs.filter(log => log.log_comment && log.log_comment.trim() !== '');
                            if (logsWithComments.length > 0) {
                              const lastLogComment = logsWithComments[logsWithComments.length - 1];
                              return lastLogComment.log_comment;
                            }
                            // If no logs have comments, try to get the last log regardless
                            const lastLog = ticketData.complaint_logs[ticketData.complaint_logs.length - 1];
                            return lastLog.log_comment || '-';
                          }
                          return ticketData?.description || '-';
                        })()}
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