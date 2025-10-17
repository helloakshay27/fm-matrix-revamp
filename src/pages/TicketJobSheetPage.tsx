import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Loader2, FileText, User, MapPin, Clock, CheckCircle } from 'lucide-react';
import { JobSheetPDFGenerator } from '@/components/JobSheetPDFGenerator';
import { toast as sonnerToast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { TextField } from '@mui/material';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';

interface TicketData {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  issue_status: string;
  priority: string;
  severity: string;
  category_type: string;
  sub_category_type: string;
  site_name: string;
  address: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string;
  created_date: string;
  updated_at: string;
  visit_date: string;
  expected_completion_date: string;
  assigned_to_name: string;
  assigned_to_email: string;
  created_by_name: string;
  response_tat: number;
  resolution_tat: number;
  comments: Array<{
    id: number;
    comment: string;
    commented_by: string;
    created_at: string;
  }>;
}

export const TicketJobSheetPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [jobSheetComments, setJobSheetComments] = useState('');

  const pdfGenerator = new JobSheetPDFGenerator();

  // Fetch ticket data
  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        
        // Fetch ticket details using the same API as TicketDetailsPage
        const data = await ticketManagementAPI.getTicketDetails(id);
        console.log('🎫 Ticket Data for PDF:', data);
        console.log('🔍 Ticket Number:', data.ticket_number);
        console.log('🔍 Category:', data.category_type);
        console.log('🔍 Priority:', data.priority);
        console.log('🔍 Status:', data.issue_status);
        setTicketData(data);
        
        // Set initial comments if they exist
        if (data.description) {
          setJobSheetComments(data.description);
        }
      } catch (error) {
        console.error('Error fetching ticket data:', error);
        sonnerToast.error("Failed to load ticket data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicketData();
  }, [id]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "in progress":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
      case "resolved":
      case "completed":
        return "bg-green-100 text-green-700";
      case "on hold":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
      case "p1":
        return "bg-red-100 text-red-700";
      case "medium":
      case "p2":
        return "bg-yellow-100 text-yellow-700";
      case "low":
      case "p3":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!ticketData) return;
    
    setIsDownloading(true);
    try {
      // Create current timestamp
      const now = new Date();
      const currentDateTime = now.toISOString();
      
      // Format ticket data to match the exact structure expected by JobSheetPDFGenerator
      const formattedJobSheetData = {
        data: {
          job_sheet: {
            basic_info: {
              job_id: ticketData.id || 0,
              job_card_no: ticketData.ticket_number || ticketData.id || 0,
              created_date: ticketData.created_date ? new Date(ticketData.created_date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
              scheduled_date: ticketData.visit_date ? new Date(ticketData.visit_date).toLocaleDateString('en-GB') : '',
              completed_date: ticketData.expected_completion_date ? new Date(ticketData.expected_completion_date).toLocaleDateString('en-GB') : '',
              priority: ticketData.priority || 'Medium',
              steps: 2, // No before/after for tickets
              before_after_enabled: false,
              breakdown_status: ticketData.issue_status === 'Open' ? 'NO' : 'YES',
              bef_sub_attachment: null,
              aft_sub_attachment: null
            },
            task_details: {
              task_id: ticketData.id || 0,
              task_name: `Ticket Maintenance - ${ticketData.category_type || 'General'}`,
              task_status: ticketData.issue_status || 'Open',
              task_comments: jobSheetComments || ticketData.description || '',
              task_description: ticketData.description || '',
              asset: {
                id: ticketData.asset_id || 0,
                name: ticketData.category_type || 'Ticket Category',
                code: ticketData.ticket_number || ticketData.id?.toString() || '',
                category: ticketData.category_type || 'General',
                location: {
                  site: ticketData.site_name || 'N/A',
                  building: ticketData.building_name || 'N/A',
                  wing: ticketData.wing_name || 'N/A',
                  area: ticketData.area_name || 'N/A',
                  floor: ticketData.floor_name || 'N/A',
                  room: ticketData.room_name || null
                }
              },
              site: {
                id: ticketData.society_id || 0,
                name: ticketData.site_name || 'N/A',
                code: null,
                address: ticketData.address || null
              }
            },
            checklist_responses: [
              {
                index: 1,
                group_id: "ticket_information",
                sub_group_id: "basic_details",
                group_name: "Ticket Information",
                sub_group_name: "Basic Details",
                question_id: 1,
                activity: "Ticket ID",
                help_text: null,
                input_type: "text",
                input_value: ticketData.ticket_number || ticketData.id?.toString() || 'N/A',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 2,
                group_id: "ticket_information",
                sub_group_id: "basic_details",
                group_name: "Ticket Information",
                sub_group_name: "Basic Details",
                question_id: 2,
                activity: "Category",
                help_text: null,
                input_type: "text",
                input_value: ticketData.category_type || 'N/A',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 3,
                group_id: "ticket_information",
                sub_group_id: "basic_details",
                group_name: "Ticket Information",
                sub_group_name: "Basic Details",
                question_id: 3,
                activity: "Sub Category",
                help_text: null,
                input_type: "text",
                input_value: ticketData.sub_category_type || 'N/A',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 4,
                group_id: "ticket_information",
                sub_group_id: "basic_details",
                group_name: "Ticket Information",
                sub_group_name: "Basic Details",
                question_id: 4,
                activity: "Priority",
                help_text: null,
                input_type: "text",
                input_value: ticketData.priority || 'Medium',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 5,
                group_id: "ticket_information",
                sub_group_id: "basic_details",
                group_name: "Ticket Information",
                sub_group_name: "Basic Details",
                question_id: 5,
                activity: "Status",
                help_text: null,
                input_type: "text",
                input_value: ticketData.issue_status || 'Open',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 6,
                group_id: "ticket_information",
                sub_group_id: "assignment_details",
                group_name: "Ticket Information",
                sub_group_name: "Assignment Details",
                question_id: 6,
                activity: "Assigned To",
                help_text: null,
                input_type: "text",
                input_value: ticketData.assigned_to_name || 'Unassigned',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 7,
                group_id: "ticket_information",
                sub_group_id: "assignment_details",
                group_name: "Ticket Information",
                sub_group_name: "Assignment Details",
                question_id: 7,
                activity: "Created By",
                help_text: null,
                input_type: "text",
                input_value: ticketData.created_by_name || 'N/A',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 8,
                group_id: "ticket_information",
                sub_group_id: "timing_details",
                group_name: "Ticket Information",
                sub_group_name: "Timing Details",
                question_id: 8,
                activity: "Response TAT",
                help_text: null,
                input_type: "text",
                input_value: ticketData.response_tat ? `${ticketData.response_tat} Minutes` : '30 Minutes',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 9,
                group_id: "ticket_information",
                sub_group_id: "timing_details",
                group_name: "Ticket Information",
                sub_group_name: "Timing Details",
                question_id: 9,
                activity: "Resolution TAT",
                help_text: null,
                input_type: "text",
                input_value: ticketData.resolution_tat ? `${ticketData.resolution_tat} Hours` : '1 Hour',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 10,
                group_id: "ticket_information",
                sub_group_id: "basic_details",
                group_name: "Ticket Information",
                sub_group_name: "Basic Details",
                question_id: 10,
                activity: "Associated To",
                help_text: null,
                input_type: "text",
                input_value: ticketData.associated_to || "Survey",
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 11,
                group_id: "ticket_information",
                sub_group_id: "location_details",
                group_name: "Ticket Information",
                sub_group_name: "Location Details",
                question_id: 11,
                activity: "Location",
                help_text: null,
                input_type: "text",
                input_value: ticketData.location || `${ticketData.building_name || ''} ${ticketData.wing_name || ''} ${ticketData.floor_name || ''} ${ticketData.area_name || ''}`.trim() || "-",
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 12,
                group_id: "ticket_information",
                sub_group_id: "timing_details",
                group_name: "Ticket Information",
                sub_group_name: "Timing Details",
                question_id: 12,
                activity: "Response TAT",
                help_text: null,
                input_type: "text",
                input_value: ticketData.response_tat ? `${ticketData.response_tat} Minutes` : "30 Mins",
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 13,
                group_id: "ticket_information",
                sub_group_id: "timing_details",
                group_name: "Ticket Information",
                sub_group_name: "Timing Details",
                question_id: 13,
                activity: "Resolution TAT",
                help_text: null,
                input_type: "text",
                input_value: ticketData.resolution_tat ? `${ticketData.resolution_tat} Hours` : "1 Hour",
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 14,
                group_id: "ticket_information",
                sub_group_id: "action_details",
                group_name: "Ticket Information",
                sub_group_name: "Action Details",
                question_id: 14,
                activity: "Preventive Action",
                help_text: null,
                input_type: "text",
                input_value: ticketData.preventive_action || "Test",
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 15,
                group_id: "ticket_information",
                sub_group_id: "action_details",
                group_name: "Ticket Information",
                sub_group_name: "Action Details",
                question_id: 15,
                activity: "Corrective Action",
                help_text: null,
                input_type: "text",
                input_value: ticketData.corrective_action || "Test",
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 16,
                group_id: "ticket_information",
                sub_group_id: "date_details",
                group_name: "Ticket Information",
                sub_group_name: "Date Details",
                question_id: 16,
                activity: "Expected Visit Date",
                help_text: null,
                input_type: "text",
                input_value: ticketData.visit_date ? new Date(ticketData.visit_date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 17,
                group_id: "ticket_information",
                sub_group_id: "date_details",
                group_name: "Ticket Information",
                sub_group_name: "Date Details",
                question_id: 17,
                activity: "Expected Closer Date",
                help_text: null,
                input_type: "text",
                input_value: ticketData.expected_completion_date ? new Date(ticketData.expected_completion_date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 18,
                group_id: "ticket_information",
                sub_group_id: "additional_details",
                group_name: "Ticket Information",
                sub_group_name: "Additional Details",
                question_id: 18,
                activity: "Severity",
                help_text: null,
                input_type: "text",
                input_value: ticketData.severity || 'High',
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 19,
                group_id: "ticket_information",
                sub_group_id: "additional_details",
                group_name: "Ticket Information",
                sub_group_name: "Additional Details",
                question_id: 19,
                activity: "Root Cause",
                help_text: null,
                input_type: "text",
                input_value: ticketData.root_cause || "Test",
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              },
              {
                index: 20,
                group_id: "ticket_information",
                sub_group_id: "additional_details",
                group_name: "Ticket Information",
                sub_group_name: "Additional Details",
                question_id: 20,
                activity: "Comments",
                help_text: null,
                input_type: "textarea",
                input_value: jobSheetComments || ticketData.description || ticketData.heading || ticketData.notes || "No comments available",
                comments: null,
                weightage: 1,
                rating: 5,
                max_rating: 5,
                score: 5,
                max_possible_score: 5,
                status: "completed",
                is_critical: false,
                requires_action: false,
                attachments: []
              }
            ],
            personnel: {
              performed_by: {
                first_name: ticketData.assigned_to_name?.split(' ')[0] || 'Assigned',
                last_name: ticketData.assigned_to_name?.split(' ').slice(1).join(' ') || 'User',
                full_name: ticketData.assigned_to_name || 'Unassigned',
                employee_id: null,
                contact_number: null,
                email: ticketData.assigned_to_email || null,
                type: 'Staff'
              }
            },
            comments: ticketData.comments || [],
            metadata: {
              total_checklist_items: 10,
              completed_items: 10,
              pending_items: 0,
              completion_percentage: 100,
              scoring: {
                total_score: 50,
                max_possible_score: 50,
                overall_percentage: 100
              },
              form_type: 'Ticket',
              checklist_for: 'Asset',
              form_version: '1.0',
              generated_at: currentDateTime,
              api_version: '1.0'
            },
            summary: {
              task_completion_status: ticketData.issue_status || 'Open',
              is_completed: ['Closed', 'Resolved', 'Completed'].includes(ticketData.issue_status || ''),
              is_overdue: false,
              has_checklist_responses: true,
              has_comments: (ticketData.comments || []).length > 0 || !!jobSheetComments,
              requires_approval: false,
              approval_status: 'N/A',
              time_tracking: {
                start_time: ticketData.created_date || currentDateTime,
                end_time: ticketData.updated_at || currentDateTime,
                start_time_iso: ticketData.created_date || currentDateTime,
                end_time_iso: ticketData.updated_at || currentDateTime,
                duration_seconds: 0,
                duration_minutes: 0,
                duration_hours: 0,
                logged_at: ticketData.updated_at || currentDateTime
              },
              quality_indicators: {
                all_items_completed: true,
                high_performance_score: true,
                within_schedule: true
              }
            },
            group_scores: [
              {
                group_name: "Ticket Information",
                sub_group_name: "Basic Details",
                total_score: 25,
                max_possible_score: 25,
                percentage: 100
              },
              {
                group_name: "Ticket Information", 
                sub_group_name: "Assignment Details",
                total_score: 10,
                max_possible_score: 10,
                percentage: 100
              },
              {
                group_name: "Ticket Information",
                sub_group_name: "Timing Details",
                total_score: 10,
                max_possible_score: 10,
                percentage: 100
              },
              {
                group_name: "Ticket Information",
                sub_group_name: "Description & Actions",
                total_score: 5,
                max_possible_score: 5,
                percentage: 100
              }
            ]
          }
        }
      };

      // Create task details structure that matches what PDF generator expects
      const formattedTaskDetails = {
        task_details: {
          id: ticketData.id || 0,
          task_name: `Ticket Maintenance - ${ticketData.category_type || 'General'}`,
          description: ticketData.description || 'Ticket maintenance request',
          created_on: ticketData.created_date || currentDateTime,
          scheduled_on: ticketData.visit_date || ticketData.expected_completion_date || currentDateTime,
          location: {
            site: ticketData.site_name || 'N/A',
            building: ticketData.building_name || 'N/A',
            wing: ticketData.wing_name || 'N/A',
            area: ticketData.area_name || 'N/A',
            floor: ticketData.floor_name || 'N/A',
            room: ticketData.room_name || null
          }
        }
      };

      console.log('📋 PDF Data being passed to generator:');
      console.log('🔸 Basic Info:', formattedJobSheetData.data.job_sheet.basic_info);
      console.log('🔸 Task Details:', formattedJobSheetData.data.job_sheet.task_details);
      console.log('🔸 First few checklist items:', formattedJobSheetData.data.job_sheet.checklist_responses.slice(0, 5));

      // Use the JobSheetPDFGenerator with properly formatted data
      await pdfGenerator.generateJobSheetPDF(
        formattedTaskDetails,
        formattedJobSheetData,
        jobSheetComments || ticketData.description || ''
      );
      
      sonnerToast.success('Ticket job sheet PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      sonnerToast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p>Loading ticket job sheet...</p>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p>Ticket data not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50 print:p-0 print:bg-white">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/maintenance/ticket/${id}`)}
          className="flex items-center gap-1 hover:text-gray-800 mb-4 print:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ticket Details
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase">
              Ticket Job Sheet
            </h1>
            <p className="text-gray-600 mt-1">
              Ticket ID: {ticketData.ticket_number || ticketData.id}
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
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
          </div>
        </div>
      </div>

      {/* Main Ticket Job Sheet Content */}
      <div className="space-y-6">
        {/* Ticket Basic Info */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <FileText className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Ticket Information</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ticket ID</label>
                  <p className="text-sm text-gray-900">{ticketData.ticket_number || ticketData.id}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Badge className={getStatusColor(ticketData.issue_status || '')}>
                    {ticketData.issue_status || 'Open'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <Badge className={getPriorityColor(ticketData.priority || '')}>
                    {ticketData.priority || 'Medium'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{ticketData.category_type || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sub Category</label>
                  <p className="text-sm text-gray-900">{ticketData.sub_category_type || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Severity</label>
                  <p className="text-sm text-gray-900">{ticketData.severity || 'Medium'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Created On</label>
                  <p className="text-sm text-gray-900">
                    {ticketData.created_date ? new Date(ticketData.created_date).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Created By</label>
                  <p className="text-sm text-gray-900">{ticketData.created_by_name || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Assigned To</label>
                  <p className="text-sm text-gray-900">{ticketData.assigned_to_name || 'Unassigned'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Visit Date</label>
                  <p className="text-sm text-gray-900">
                    {ticketData.visit_date ? new Date(ticketData.visit_date).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900 mt-1">{ticketData.description || 'No description provided'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Location Details */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <MapPin className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Location Details</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Society</label>
                <p className="text-sm text-gray-900">{ticketData.site_name || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Building</label>
                <p className="text-sm text-gray-900">{ticketData.building_name || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Wing</label>
                <p className="text-sm text-gray-900">{ticketData.wing_name || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Floor</label>
                <p className="text-sm text-gray-900">{ticketData.floor_name || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Area</label>
                <p className="text-sm text-gray-900">{ticketData.area_name || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Room</label>
                <p className="text-sm text-gray-900">{ticketData.room_name || 'N/A'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Timing Information */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <Clock className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Timing Information</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Response TAT</label>
                <p className="text-sm text-gray-900">
                  {ticketData.response_tat ? `${ticketData.response_tat} Minutes` : '30 Minutes'}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Resolution TAT</label>
                <p className="text-sm text-gray-900">
                  {ticketData.resolution_tat ? `${ticketData.resolution_tat} Hours` : '1 Hour'}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Expected Completion</label>
                <p className="text-sm text-gray-900">
                  {ticketData.expected_completion_date ? new Date(ticketData.expected_completion_date).toLocaleDateString('en-GB') : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-sm text-gray-900">
                  {ticketData.updated_at ? new Date(ticketData.updated_at).toLocaleDateString('en-GB') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        {ticketData.comments && ticketData.comments.length > 0 && (
          <Card className="w-full bg-transparent shadow-none border-none">
            <div className="figma-card-header">
              <div className="flex items-center gap-3">
                <div className="figma-card-icon-wrapper">
                  <CheckCircle className="figma-card-icon" />
                </div>
                <h3 className="figma-card-title">Comments</h3>
              </div>
            </div>
            <div className="figma-card-content">
              <div className="space-y-3">
                {ticketData.comments.map((comment, index) => (
                  <div key={comment.id} className="border-l-2 border-blue-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {comment.commented_by || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString('en-GB') : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Job Sheet Comments */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <User className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Job Sheet Comments</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <TextField
              fullWidth
              multiline
              rows={4}
              value={jobSheetComments}
              onChange={(e) => setJobSheetComments(e.target.value)}
              variant="outlined"
              placeholder="Add comments for the job sheet..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white'
                }
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};