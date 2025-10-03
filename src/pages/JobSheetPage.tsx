import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowLeft,
  User,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
  Download,
  Loader2,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { taskService } from "@/services/taskService";
import { Typography } from "@mui/material";
import { JobSheetPDFGenerator } from "@/components/JobSheetPDFGenerator";

interface JobSheetData {
  basic_info: {
    job_id: number;
    job_card_no: number;
    created_date: string;
    scheduled_date: string;
    completed_date: string;
    bef_sub_attachment: string | null;
    aft_sub_attachment: string | null;
    steps: number;
    before_after_enabled: boolean;
    breakdown_status: string;
    priority: string;
  };
  task_details: {
    task_id: number;
    task_name: string;
    task_status: string;
    task_comments: string | null;
    task_description: string | null;
    asset: {
      id: number;
      name: string;
      code: string;
      category: string;
      location: {
        site: string;
        building: string;
        wing: string;
        area: string;
        floor: string;
        room: string | null;
      };
    };
    site: {
      id: number;
      name: string;
      code: string | null;
      address: string | null;
    };
  };
  checklist_responses: Array<{
    index: number;
    group_id: string;
    sub_group_id: string;
    question_id: number | null;
    activity: string;
    help_text: string | null;
    input_type: string | null;
    input_value: string | null;
    comments: string | null;
    weightage: number;
    rating: number;
    max_rating: number;
    score: number;
    max_possible_score: number;
    status: string | null;
    is_critical: boolean;
    requires_action: boolean;
    attachments: any[];
  }>;
  personnel: {
    performed_by: {
      first_name: string;
      last_name: string | null;
      full_name: string;
      employee_id: string | null;
      contact_number: string | null;
      email: string | null;
      type: string;
    };
  };
  comments: any[];
  metadata: {
    total_checklist_items: number;
    completed_items: number;
    pending_items: number;
    completion_percentage: number;
    scoring: {
      total_score: number;
      max_possible_score: number;
      overall_percentage: number;
    };
    form_type: string | null;
    checklist_for: string;
    form_version: string;
    generated_at: string;
    api_version: string;
  };
  summary: {
    task_completion_status: string;
    is_completed: boolean;
    is_overdue: boolean;
    has_checklist_responses: boolean;
    has_comments: boolean;
    requires_approval: boolean;
    approval_status: string;
    time_tracking: {
      start_time: string;
      end_time: string;
      start_time_iso: string;
      end_time_iso: string;
      duration_seconds: number;
      duration_minutes: number;
      duration_hours: number;
      logged_at: string;
    };
    quality_indicators: {
      all_items_completed: boolean;
      high_performance_score: boolean;
      within_schedule: boolean;
    };
  };
}

export const JobSheetPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobSheetData, setJobSheetData] = useState<JobSheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [jobSheetComments, setJobSheetComments] = useState('');

  const pdfGenerator = new JobSheetPDFGenerator();

  // Fetch job sheet data and task details
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);

        // Fetch both job sheet data and task details for PDF generation
        const [jobSheetResponse, taskDetailsResponse] = await Promise.all([
          taskService.getJobSheet(id),
          taskService.getTaskDetails(id),
        ]);

        setJobSheetData(jobSheetResponse.data.job_sheet );
        setTaskDetails(taskDetailsResponse);
        
        // Set initial comments if they exist
        if (jobSheetResponse.data.job_sheet?.task_details?.task_comments) {
          setJobSheetComments(jobSheetResponse.data.job_sheet.task_details.task_comments);
        }
      } catch (error) {
        sonnerToast.error("Failed to load job sheet data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "scheduled":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Handle image load errors with fallback SVGs
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    type: "before" | "after"
  ) => {
    const target = e.target as HTMLImageElement;
    const color = type === "before" ? "f5f5f5" : "e8f5e8";
    const textColor = type === "before" ? "888888" : "2d5a2d";
    const label = type === "before" ? "BEFORE" : "AFTER";

    target.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="128" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${color}"/>
        <text x="50%" y="40%" font-family="Arial" font-size="10" fill="#${textColor}" text-anchor="middle" dy=".3em">${label}</text>
        <text x="50%" y="60%" font-family="Arial" font-size="8" fill="#${textColor}" text-anchor="middle" dy=".3em">No Image Available</text>
      </svg>
    `)}`;
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!taskDetails || !jobSheetData) return;
    
    setIsDownloading(true);
    try {
      // Create the proper data structure to match what PDF generator expects
      const formattedJobSheetData = {
        data: {
          job_sheet: jobSheetData
        }
      };
      
      // Pass the correct data structure to PDF generator
      await pdfGenerator.generateJobSheetPDF(taskDetails, jobSheetData , jobSheetComments);
      sonnerToast.success('Job sheet PDF downloaded successfully!');
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
          <p>Loading job sheet...</p>
        </div>
      </div>
    );
  }

  if (!jobSheetData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p>Job sheet not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50 print:p-0 print:bg-white">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/maintenance/task/details/${id}`)}
          className="flex items-center gap-1 hover:text-gray-800 mb-4 print:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Task Details
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase">
              Job Sheet
            </h1>
            <p className="text-gray-600 mt-1">
              ID: {jobSheetData.basic_info.job_id}
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Job Sheet Content */}
      <div className="space-y-6">
        {/* Pre-Post Inspection Info */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <User className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Pre-Post Inspection Info</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Before</h4>
                  <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                    {jobSheetData.basic_info.bef_sub_attachment ? (
                      <img
                        src={jobSheetData.basic_info.bef_sub_attachment}
                        alt="Before inspection"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => handleImageError(e, "before")}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="text-xs font-medium">BEFORE</div>
                        <div className="text-xs mt-1">No Image Available</div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">After</h4>
                  <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                    {jobSheetData.basic_info.aft_sub_attachment ? (
                      <img
                        src={jobSheetData.basic_info.aft_sub_attachment}
                        alt="After inspection"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => handleImageError(e, "after")}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="text-xs font-medium">AFTER</div>
                        <div className="text-xs mt-1">No Image Available</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                <select className="w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>{jobSheetData.personnel.performed_by.full_name}</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Job Info */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <FileText className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Job Info</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="task-info-enhanced">
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Job ID</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.basic_info.job_id}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Job Card No</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.basic_info.job_card_no}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Site Name</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.task_details.site.name}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Asset Name</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.task_details.asset.name}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Asset Code</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.task_details.asset.code}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Task Name</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.task_details.task_name}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Scheduled Date</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.basic_info.scheduled_date}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Completed Date</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.basic_info.completed_date}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Performed By</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.personnel.performed_by.full_name}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Status</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  <Badge className={getStatusColor(jobSheetData.task_details.task_status)}>
                    {jobSheetData.task_details.task_status.toUpperCase()}
                  </Badge>
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Priority</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  <Badge className={getPriorityColor(jobSheetData.basic_info.priority)}>
                    {jobSheetData.basic_info.priority.toUpperCase()}
                  </Badge>
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Duration</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {Math.floor(jobSheetData.summary.time_tracking.duration_hours)}:
                  {String(Math.floor(jobSheetData.summary.time_tracking.duration_minutes % 60)).padStart(2, "0")}:00
                </span>
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
            <div className="relative">
              {/* Stepper Line */}
              <div className="location-stepper-line absolute top-8 left-6 right-6" style={{zIndex: 1}}></div>
              
              {/* Location Steps */}
              <div className="grid grid-cols-6 gap-4 relative" style={{zIndex: 2}}>
                {/* Site */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">Site</div>
                  <div className="location-step-dot mb-3"></div>
                  <div className="text-sm font-semibold text-gray-900 text-center">
                    {jobSheetData.task_details.asset.location.site || ''}
                  </div>
                </div>

                {/* Building */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">Building</div>
                  <div className="location-step-dot mb-3"></div>
                  <div className="text-sm font-semibold text-gray-900 text-center">
                    {jobSheetData.task_details.asset.location.building || ''}
                  </div>
                </div>

                {/* Wing */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">Wing</div>
                  <div className="location-step-dot mb-3"></div>
                  <div className="text-sm font-semibold text-gray-900 text-center">
                    {jobSheetData.task_details.asset.location.wing || ''}
                  </div>
                </div>

                {/* Floor */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">Floor</div>
                  <div className="location-step-dot mb-3"></div>
                  <div className="text-sm font-semibold text-gray-900 text-center">
                    {jobSheetData.task_details.asset.location.floor || ''}
                  </div>
                </div>

                {/* Area */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">Area</div>
                  <div className="location-step-dot mb-3"></div>
                  <div className="text-sm font-semibold text-gray-900 text-center">
                    {jobSheetData.task_details.asset.location.area || ''}
                  </div>
                </div>

                {/* Room */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">Room</div>
                  <div className="location-step-dot mb-3"></div>
                  <div className="text-sm font-semibold text-gray-900 text-center">
                    {jobSheetData.task_details.asset.location.room || ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <FileText className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Activity</h3>
            </div>
          </div>
          <div className="figma-card-content">
            {jobSheetData.checklist_responses.length > 0 ? (
              <div className="space-y-4">
                {/* Main Checklist Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 bg-gray-100 px-3 py-2 rounded">
                    {jobSheetData.task_details.task_name}
                  </h4>
                  <div className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-xs font-medium text-gray-600">Help Text</TableHead>
                          <TableHead className="text-xs font-medium text-gray-600">Activities</TableHead>
                          <TableHead className="text-xs font-medium text-gray-600">Input</TableHead>
                          <TableHead className="text-xs font-medium text-gray-600">Comments</TableHead>
                          <TableHead className="text-xs font-medium text-gray-600">Weightage</TableHead>
                          <TableHead className="text-xs font-medium text-gray-600">Rating</TableHead>
                          <TableHead className="text-xs font-medium text-gray-600">Score</TableHead>
                          <TableHead className="text-xs font-medium text-gray-600">Attachments</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobSheetData.checklist_responses.map((item, index) => (
                          <TableRow key={item.index}>
                            <TableCell className="text-xs">
                              {item.help_text || '-'}
                            </TableCell>
                            <TableCell className="text-xs">
                              {item.activity}
                            </TableCell>
                            <TableCell className="text-xs">
                              {item.input_value || '-'}
                            </TableCell>
                            <TableCell className="text-xs">
                              {item.comments || '-'}
                            </TableCell>
                            <TableCell className="text-xs">
                              {item.weightage}
                            </TableCell>
                            <TableCell className="text-xs">
                              {item.rating}/{item.max_rating}
                            </TableCell>
                            <TableCell className="text-xs">
                              {item.score}
                            </TableCell>
                            <TableCell className="text-xs">
                              {item.attachments && item.attachments.length > 0 ? (
                                <div className="flex gap-1">
                                  {item.attachments.map((attachment, idx) => (
                                    <div
                                      key={idx}
                                      className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center"
                                    >
                                      <span className="text-xs">📎</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                "No Attachment"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No activities found for this job sheet.
              </p>
            )}
          </div>
        </Card>

        {/* Summary */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <CheckCircle className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Summary</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="task-info-enhanced">
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Total Items</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.metadata.total_checklist_items}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Completed Items</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.metadata.completed_items}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Completion %</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.metadata.completion_percentage}%
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Total Score</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.metadata.scoring.total_score} / {jobSheetData.metadata.scoring.max_possible_score}
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Overall %</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  {jobSheetData.metadata.scoring.overall_percentage}%
                </span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Approval Status</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">
                  <Badge className={getStatusColor(jobSheetData.summary.approval_status)}>
                    {jobSheetData.summary.approval_status.toUpperCase()}
                  </Badge>
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Remarks</h4>
              <div className="border border-gray-300 p-4 min-h-[100px] bg-gray-50 rounded">
                {jobSheetData.task_details.task_comments || "No remarks available."}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 italic">
                This is a system-generated report and does not require any signature.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Powered by <span className="font-semibold text-red-600">FMMatrix</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
