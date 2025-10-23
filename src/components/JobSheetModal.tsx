import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TextField } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { taskService } from '@/services/taskService';
import { JobSheetPDFGenerator } from './JobSheetPDFGenerator';
import { toast as sonnerToast } from 'sonner';

interface JobSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskDetails: any;
  jobSheetData: any;
  jobSheetLoading: boolean;
  onRefresh?: () => Promise<void>;
}

export const JobSheetModal: React.FC<JobSheetModalProps> = ({
  isOpen,
  onClose,
  taskId,
  taskDetails,
  jobSheetData,
  jobSheetLoading,
  onRefresh
}) => {
  const { toast } = useToast();
  const [jobSheetComments, setJobSheetComments] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const pdfGenerator = new JobSheetPDFGenerator();

  // React.useEffect(() => {
  //   if (jobSheetData?.data?.job_sheet?.task_details?.task_comments || jobSheetData?.job_sheet?.task_details?.task_comments) {
  //     setJobSheetComments(
  //       jobSheetData?.data?.job_sheet?.task_details?.task_comments || 
  //       jobSheetData?.job_sheet?.task_details?.task_comments
  //     );
  //   }
  // }, [jobSheetData]);

  const handleJobSheetUpdate = async () => {
    if (!taskId) return;
    
    if (!jobSheetComments.trim()) {
      sonnerToast.error('Please enter a comment before updating');
      return;
    }

    const loadingToastId = sonnerToast.loading('Updating task comments...', {
      duration: Infinity,
    });

    setIsUpdating(true);
    
    try {
      await taskService.updateTaskComments(taskId, jobSheetComments);
      
      sonnerToast.dismiss(loadingToastId);
      sonnerToast.success('Comments updated successfully!');
      
      // Clear the comment field
      setJobSheetComments('');
      
      // Reload the job sheet data if onRefresh is provided
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Failed to update comments:', error);
      sonnerToast.dismiss(loadingToastId);
      sonnerToast.error('Failed to update comments. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!taskDetails || !jobSheetData) return;
    
    setIsDownloading(true);
    try {
      // Pass the correct data structure to PDF generator
      await pdfGenerator.generateJobSheetPDF(taskDetails, jobSheetData.data || jobSheetData, jobSheetComments);
      toast({
        title: 'Success',
        description: 'Job sheet PDF downloaded successfully!'
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
      case 'scheduled':
        return 'bg-green-100 text-green-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'completed':
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getBadgeColor = (valueType: string) => {
    switch (valueType?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl max-h-[90vh] overflow-y-auto"
        aria-describedby="job-sheet-dialog-description"
      >
        <span id="job-sheet-dialog-description" className="sr-only">
          View and edit job sheet details with comments for the completed task.
        </span>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            Job Sheet
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
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

        <div className="p-4">
          {jobSheetLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
              <span className="ml-2">Loading job sheet...</span>
            </div>
          ) : jobSheetData ? (
            <div className="space-y-6">
              {/* Job Sheet Header Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Created Date</label>
                    <p className="font-medium">{jobSheetData?.data?.job_sheet?.basic_info?.created_date || jobSheetData?.job_sheet?.basic_info?.created_date || taskDetails?.task_details?.created_on}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Job Card No</label>
                    <p className="font-medium">{jobSheetData?.data?.job_sheet?.basic_info?.job_card_no || jobSheetData?.job_sheet?.basic_info?.job_card_no || taskDetails?.task_details?.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Scheduled Date</label>
                    <p className="font-medium">{jobSheetData?.data?.job_sheet?.basic_info?.scheduled_date || jobSheetData?.job_sheet?.basic_info?.scheduled_date || taskDetails?.task_details?.scheduled_on}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Job ID</label>
                    <p className="font-medium">{jobSheetData?.data?.job_sheet?.basic_info?.job_id || jobSheetData?.job_sheet?.basic_info?.job_id || taskDetails?.task_details?.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        disabled 
                        checked={(jobSheetData?.data?.job_sheet?.metadata?.checklist_for || jobSheetData?.job_sheet?.metadata?.checklist_for)?.includes('Asset')} 
                      />
                      <label className="text-sm">Assets</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        disabled 
                        checked={(jobSheetData?.data?.job_sheet?.metadata?.checklist_for || jobSheetData?.job_sheet?.metadata?.checklist_for)?.includes('Service')} 
                      />
                      <label className="text-sm">Services</label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Priority:</label>
                    <span className="text-sm font-medium">{jobSheetData?.data?.job_sheet?.basic_info?.priority || jobSheetData?.job_sheet?.basic_info?.priority || 'Medium'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm">Breakdown:</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        disabled 
                        checked={(jobSheetData?.data?.job_sheet?.basic_info?.breakdown_status || jobSheetData?.job_sheet?.basic_info?.breakdown_status) === 'Yes'} 
                      />
                      <label className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        disabled 
                        checked={(jobSheetData?.data?.job_sheet?.basic_info?.breakdown_status || jobSheetData?.job_sheet?.basic_info?.breakdown_status) === 'No'} 
                      />
                      <label className="text-sm">No</label>
                    </div>
                  </div>
                </div>

                {/* Completion and Score Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <label className="text-sm text-gray-600">Completion</label>
                    <p className="font-medium">{jobSheetData?.data?.job_sheet?.metadata?.completion_percentage || jobSheetData?.job_sheet?.metadata?.completion_percentage || 0}%</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Total Items</label>
                    <p className="font-medium">{jobSheetData?.data?.job_sheet?.metadata?.total_checklist_items || jobSheetData?.job_sheet?.metadata?.total_checklist_items || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Score</label>
                    <p className="font-medium">
                      {jobSheetData?.data?.job_sheet?.metadata?.scoring?.total_score || jobSheetData?.job_sheet?.metadata?.scoring?.total_score || 0}/
                      {jobSheetData?.data?.job_sheet?.metadata?.scoring?.max_possible_score || jobSheetData?.job_sheet?.metadata?.scoring?.max_possible_score || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Performance</label>
                    <p className="font-medium">{jobSheetData?.data?.job_sheet?.metadata?.scoring?.overall_percentage || jobSheetData?.job_sheet?.metadata?.scoring?.overall_percentage || 0}%</p>
                  </div>
                </div>
              </div>

              {/* Checklist Responses Table - Grouped by Sections */}
              <div className="space-y-6">
                {(() => {
                  const responses = jobSheetData?.data?.job_sheet?.checklist_responses || jobSheetData?.job_sheet?.checklist_responses || [];
                  
                  if (responses.length === 0) {
                    return (
                      <div className="border rounded-lg p-8 text-center text-gray-500">
                        No checklist responses found for this job sheet.
                      </div>
                    );
                  }

                  // Group responses by group_id and sub_group_id
                  const grouped: { [key: string]: any[] } = {};
                  responses.forEach((response: any) => {
                    const groupId = response.group_id || 'ungrouped';
                    const subGroupId = response.sub_group_id || 'ungrouped';
                    const key = `${groupId}_${subGroupId}`;
                    
                    if (!grouped[key]) {
                      grouped[key] = [];
                    }
                    grouped[key].push(response);
                  });

                  // Convert to array of sections
                  const sections = Object.keys(grouped).map(key => ({
                    sectionKey: key,
                    group_name: grouped[key][0]?.group_name || 'Ungrouped',
                    sub_group_name: grouped[key][0]?.sub_group_name || '',
                    responses: grouped[key]
                  }));

                  return sections.map((section, sectionIndex) => (
                    <div key={section.sectionKey} className="space-y-3">
                      {/* Section Header */}
                      <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-2 rounded-lg border-l-4 border-[#C72030AD]">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-semibold text-gray-800">
                              {section.group_name}
                            </h4>
                            {section.sub_group_name && (
                              <p className="text-sm text-gray-600 mt-1">
                                {section.sub_group_name}
                              </p>
                            )}
                          </div>
                          <Badge className="bg-[rgba(196,184,157,0.33)] text-black-700 px-3 py-1">
                            Section {sectionIndex + 1}
                          </Badge>
                        </div>
                      </div>

                      {/* Section Table */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left bg-gray-50">
                                <th className="p-3 border-b border-r">Help Text</th>
                                <th className="p-3 border-b border-r">Activities</th>
                                <th className="p-3 border-b border-r">Input</th>
                                <th className="p-3 border-b border-r">Comments</th>
                                <th className="p-3 border-b border-r">Weightage</th>
                                <th className="p-3 border-b border-r">Rating</th>
                                <th className="p-3 border-b border-r">Score</th>
                                <th className="p-3 border-b border-r">Status</th>
                                <th className="p-3 border-b">Attachments</th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.responses.map((response: any, index: number) => {
                          const files = response.attachments || [];
                          
                          // Display input value or "-" if null/empty
                          const displayValue = response.input_value || '-';
                          
                          // Determine badge color based on the activity result
                          const getBadgeColorForValue = (value: string) => {
                            if (value === 'Yes' || value === 'OK' || value === 'Pass') {
                              return 'bg-green-100 text-green-800';
                            } else if (value === 'No' || value === 'Not OK' || value === 'Fail') {
                              return 'bg-red-100 text-red-800';
                            }
                            return 'bg-gray-100 text-gray-800';
                          };
                          
                          return (
                            <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                              <td className="p-3 border-b border-r">{response.help_text || '-'}</td>
                              <td className="p-3 border-b border-r">{response.activity || '-'}</td>
                              <td className="p-3 border-b border-r">
                                {displayValue !== '-' ? (
                                  <Badge className={getBadgeColorForValue(displayValue)}>
                                    {displayValue}
                                  </Badge>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </td>
                              <td className="p-3 border-b border-r">{response.comments || '-'}</td>
                              <td className="p-3 border-b border-r">{response.weightage || '-'}</td>
                              <td className="p-3 border-b border-r">
                                {response.rating !== undefined && response.rating !== null ? 
                                  `${response.rating}/${response.max_rating || 5}` : '-'
                                }
                              </td>
                              <td className="p-3 border-b border-r">
                                {response.score !== undefined && response.score !== null ? 
                                  `${response.score}/${response.max_possible_score || 0}` : '-'
                                }
                              </td>
                              <td className="p-3 border-b border-r">
                                <Badge className={getStatusColor(
                                  jobSheetData?.data?.job_sheet?.task_details?.task_status || 
                                  jobSheetData?.job_sheet?.task_details?.task_status
                                )}>
                                  {jobSheetData?.data?.job_sheet?.task_details?.task_status || 
                                   jobSheetData?.job_sheet?.task_details?.task_status || 'Pending'}
                                </Badge>
                              </td>
                              <td className="p-3 border-b">
                                {files.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {files.map((file: any, fileIndex: number) => {
                                      // Handle both string URLs and object formats
                                      const fileUrl = typeof file === 'string' ? file : (file.url || file.file_url);
                                      const fileName = typeof file === 'string' 
                                        ? `Attachment ${fileIndex + 1}` 
                                        : (file.filename || file.name || `Attachment ${fileIndex + 1}`);
                                      
                                      return (
                                        <div key={fileIndex} className="flex items-center gap-1">
                                          <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:opacity-80 transition-opacity"
                                            title={fileName}
                                          >
                                            <img 
                                              src={fileUrl} 
                                              alt={fileName} 
                                              className="w-12 h-12 object-cover rounded border border-gray-200"
                                              onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4=';
                                              }}
                                            />
                                          </a>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500">No attachments</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>

              {/* Existing Task Comments Display */}
              {(jobSheetData?.data?.job_sheet?.task_details?.task_comments || jobSheetData?.job_sheet?.task_details?.task_comments) && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2" style={{ color: '#C72030' }}>
                    Existing Task Comments:
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {jobSheetData?.data?.job_sheet?.task_details?.task_comments || jobSheetData?.job_sheet?.task_details?.task_comments}
                    </p>
                  </div>
                </div>
              )}

              {/* Update Comments Section */}
              <div>
                <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                  Update Task Comments:
                </h3>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={jobSheetComments}
                  onChange={(e) => setJobSheetComments(e.target.value)}
                  variant="outlined"
                  placeholder="Enter new comments to update the task"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white'
                    }
                  }}
                />
                <Button
                  onClick={handleJobSheetUpdate}
                  style={{ backgroundColor: '#22c55e' }}
                  className="text-white hover:bg-green-600"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update'
                  )}
                </Button>
              </div>

              {/* Personnel and Summary Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm text-gray-600">Performed By</label>
                  <p className="font-medium">
                    {jobSheetData?.data?.job_sheet?.personnel?.performed_by?.full_name || 
                     jobSheetData?.job_sheet?.personnel?.performed_by?.full_name || 'Not specified'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {jobSheetData?.data?.job_sheet?.personnel?.performed_by?.type || 
                     jobSheetData?.job_sheet?.personnel?.performed_by?.type || ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Task Status</label>
                  <p className="font-medium">
                    {jobSheetData?.data?.job_sheet?.summary?.task_completion_status || 
                     jobSheetData?.job_sheet?.summary?.task_completion_status || 'Pending'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Completion: {jobSheetData?.data?.job_sheet?.metadata?.completion_percentage || 
                                 jobSheetData?.job_sheet?.metadata?.completion_percentage || 0}%
                  </p>
                </div>
              </div>

              {/* Time Tracking Info */}
              {(jobSheetData?.data?.job_sheet?.summary?.time_tracking || jobSheetData?.job_sheet?.summary?.time_tracking) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Time Tracking</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="text-gray-600">Start Time</label>
                      <p className="font-medium">
                        {(jobSheetData?.data?.job_sheet?.summary?.time_tracking || jobSheetData?.job_sheet?.summary?.time_tracking)?.start_time || '-'}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600">End Time</label>
                      <p className="font-medium">
                        {(jobSheetData?.data?.job_sheet?.summary?.time_tracking || jobSheetData?.job_sheet?.summary?.time_tracking)?.end_time || '-'}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600">Duration</label>
                      <p className="font-medium">
                        {(jobSheetData?.data?.job_sheet?.summary?.time_tracking || jobSheetData?.job_sheet?.summary?.time_tracking)?.duration_minutes?.toFixed(1) || 0} minutes
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No job sheet data available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
