import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem
} from '@mui/material';
import { userService } from '@/services/userService';
import { taskService, TaskOccurrence } from '@/services/taskService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}


// If User type is not imported, define minimally here:
type User = {
  id: number;
  full_name: string;
};

export const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [taskDetails, setTaskDetails] = useState<TaskOccurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showJobSheetModal, setShowJobSheetModal] = useState(false);
  const [jobSheetData, setJobSheetData] = useState<any>(null);
  const [jobSheetLoading, setJobSheetLoading] = useState(false);
  const [jobSheetComments, setJobSheetComments] = useState('');

  // Submit form state
  const [formData, setFormData] = useState({
    isFloorClean: false,
    floorComment: '',
    isDustClean: false,
    dustComment: '',
    isLiftClean: false,
    liftOptions: {
      dust: false,
      dryMop: false,
      wetMop: false,
      vacuum: false
    },
    liftComment: '',
    attachments: null as File | null
  });

  // Reschedule form state
  const [rescheduleData, setRescheduleData] = useState({
    scheduleDate: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
    scheduleTime: '10:30',
    email: false
  });

  // File upload state (for attachments in submit form)
  const [attachedFiles, setAttachedFiles] = useState<{
    [key: string]: File | null;
  }>({
    file1: null,
    file2: null,
    file3: null,
    file4: null
  });

  // Menu props for MUI Select
  const selectMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 9999
      }
    },
    disablePortal: true,
    container: document.body
  };

  // Style for fields
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' }
    }
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const details = await taskService.getTaskDetails(id);
        setTaskDetails(details);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load task details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id, toast]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.searchUsers('');
        setUsers(fetchedUsers);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch users'
        });
      }
    };
    fetchUsers();
  }, []);

  // Utility: build start_date as "YYYY-MM-DD HH:mm:ss"
  const getStartDateString = () => {
    if (!rescheduleData.scheduleDate || !rescheduleData.scheduleTime) return '';
    return `${rescheduleData.scheduleDate} ${rescheduleData.scheduleTime}:00`;
  };

  const handleBack = () => navigate('/maintenance/task');
  const handleSubmitTask = () => setShowSubmitForm(true);
  const handleTaskReschedule = () => setShowRescheduleDialog(true);

  const handleJobSheetClick = async () => {
    if (!id) return;
    try {
      setJobSheetLoading(true);
      setShowJobSheetModal(true);
      const jobSheet = await taskService.getJobSheet(id);
      setJobSheetData(jobSheet);
      setJobSheetComments(jobSheet.task_comments || '');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load job sheet',
        variant: 'destructive'
      });
      setShowJobSheetModal(false);
    } finally {
      setJobSheetLoading(false);
    }
  };

  // File upload handler for form
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileKey: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFiles(prev => ({
        ...prev,
        [fileKey]: file
      }));
    }
  };

  // --- Submit Handlers

  const handleSubmitForm = () => {
    // Send to API if needed
    setShowSubmitForm(false);
    toast({
      title: 'Success',
      description: 'Task submitted successfully!'
    });
  };

  const handleRescheduleSubmit = async () => {
    if (
      !rescheduleData.scheduleDate ||
      !rescheduleData.scheduleTime
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        start_date: getStartDateString(),
        user_ids: [Number(taskDetails?.task_details?.assigned_to) || 1], // Ensure it's a number
        email: rescheduleData.email,
        sms: false // Default to false for SMS
      };

      await taskService.rescheduleTask(id!, payload);

      // Refresh task details after successful reschedule
      const updatedDetails = await taskService.getTaskDetails(id!);
      setTaskDetails(updatedDetails);

      setShowRescheduleDialog(false);
      toast({
        title: 'Success',
        description: 'Task rescheduled successfully!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reschedule task. Please try again.',
      });
    }
  };

  const handleJobSheetUpdate = async () => {
    if (!id) return;
    try {
      await taskService.updateTaskComments(id, jobSheetComments);
      setShowJobSheetModal(false);
      toast({
        title: 'Success',
        description: 'Comments updated successfully!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update comments. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const downloadJobSheetPDF = async () => {
    if (!taskDetails) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Header with logos and company info
      currentY += 3;
      
      // OIG Logo area - Left side
      pdf.setFillColor(255, 255, 255);
      pdf.rect(margin, currentY, 55, 22, 'F');
      pdf.setLineWidth(0.5);
      pdf.rect(margin, currentY, 55, 22);
      
      // OIG text
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 255);
      pdf.text('OIG', margin + 3, currentY + 8);
      
      // Arabic text
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('شركة المجموعة الدولية العمانية ش.م.م', margin + 3, currentY + 12);
      pdf.text('OMAN INTERNATIONAL GROUP SAOC', margin + 3, currentY + 15);

      // Facilities Management Services logo area - Right side
      pdf.setFillColor(255, 255, 255);
      pdf.rect(pageWidth - margin - 65, currentY, 65, 22, 'F');
      pdf.rect(pageWidth - margin - 65, currentY, 65, 22);
      
      // Draw colored squares representing the logo
      const colors = [
        [65, 105, 225],   // Blue
        [128, 128, 128],  // Gray
        [139, 195, 74],   // Green
        [255, 152, 0],    // Orange
        [255, 235, 59],   // Yellow
        [156, 39, 176]    // Purple
      ];
      
      const squareSize = 3;
      const startX = pageWidth - margin - 62;
      for (let i = 0; i < 6; i++) {
        pdf.setFillColor(colors[i][0], colors[i][1], colors[i][2]);
        pdf.rect(startX + (i * 4), currentY + 2, squareSize, squareSize, 'F');
      }
      
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('إدارة المرافق والخدمات اللوجستية', startX, currentY + 8);
      pdf.text('FACILITIES MANAGEMENT SERVICES', startX, currentY + 11);

      currentY += 27;

      // Client information table
      const infoTableData = [
        ['CLIENT: NIZWA GRAND MALL', '', 'JOB CODE: HFM16938'],
        [`Task: ${taskDetails.task_details.task_name || 'Office Opening Preparedness Checklist'}`, 'Frequency: 3 months', 'Date:'],
        ['Pump NO:', 'Asset code:', ''],
        ['Model No:', '', 'Sl. No:']
      ];

      const infoRowHeight = 8;
      const infoColWidths = [contentWidth * 0.4, contentWidth * 0.3, contentWidth * 0.3];

      infoTableData.forEach((row, rowIndex) => {
        let x = margin;
        row.forEach((cell, colIndex) => {
          // Draw cell border
          pdf.setLineWidth(0.3);
          pdf.rect(x, currentY, infoColWidths[colIndex], infoRowHeight);
          
          // Add text
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          
          // Handle long text wrapping
          const lines = pdf.splitTextToSize(cell, infoColWidths[colIndex] - 3);
          pdf.text(lines, x + 2, currentY + 5);
          
          x += infoColWidths[colIndex];
        });
        currentY += infoRowHeight;
      });

      currentY += 5;

      // Service checklist title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('SERVICE CHECKLIST OF CHILLED WATER SECONDARY PUMP', margin, currentY);
      currentY += 8;

      // Checklist table headers
      const checklistHeaders = ['SL\nNO', 'INSPECTION POINT', 'RESULT\n(√)', 'REMARKS'];
      const checklistColWidths = [15, 100, 30, 35];
      
      // Header row with light gray background (no black)
      pdf.setFillColor(240, 240, 240);  // Very light gray
      pdf.setDrawColor(100, 100, 100);  // Gray border
      let x = margin;
      checklistHeaders.forEach((header, index) => {
        pdf.rect(x, currentY, checklistColWidths[index], 15, 'F');
        pdf.setLineWidth(0.5);
        pdf.rect(x, currentY, checklistColWidths[index], 15);
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        
        // Handle multi-line headers
        const headerLines = header.split('\n');
        headerLines.forEach((line, lineIndex) => {
          pdf.text(line, x + 2, currentY + 6 + (lineIndex * 4));
        });
        
        x += checklistColWidths[index];
      });
      
      // Sub-header for Result column (S and NS)
      const resultColX = margin + checklistColWidths[0] + checklistColWidths[1];
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('S', resultColX + 6, currentY + 18);
      pdf.text('NS', resultColX + 16, currentY + 18);
      
      currentY += 15;

      // Checklist items exactly as shown in the image
      const checklistItems = [
        'Check and monitor the Pump & Motor operation for any abnormal noise',
        'Check and monitor the Pump & Motor operation for vibration',
        'Check all Suction & Discharge and valves are working properly',
        'Check and lubricate the bearing if required',
        'Check the chilled water line insulation condition',
        'Check inlet and outlet Pressure gauges working properly',
        'Check Pump and motor for Proper foundation',
        'Check Seal or Gland leakage',
        'Check the overload setting',
        'Ensure all indication lamps are working',
        'Check and clean the complete Unit and check if required any painting',
        'Ensure that the earth, neutral and LV cables are firmly connected to the Grounding System'
      ];

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);

      checklistItems.forEach((item, index) => {
        const rowHeight = 15;
        x = margin;
        
        // Draw row borders with white background
        checklistColWidths.forEach((width) => {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(x, currentY, width, rowHeight, 'F');
          pdf.setLineWidth(0.3);
          pdf.setDrawColor(100, 100, 100);  // Gray border, not black
          pdf.rect(x, currentY, width, rowHeight);
          x += width;
        });

        // Add serial number
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.text((index + 1).toString(), margin + 6, currentY + 9);
        
        // Add inspection point text with proper wrapping
        const textLines = pdf.splitTextToSize(item, checklistColWidths[1] - 4);
        pdf.text(textLines, margin + checklistColWidths[0] + 2, currentY + 9);
        
        currentY += rowHeight;
      });

      currentY += 3;

      // Note in red color as shown in image
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(255, 0, 0);
      pdf.text('Note: Use Only Lithium Soap base grade 2 grease', margin, currentY);
      pdf.setTextColor(0, 0, 0);
      currentY += 8;

      // Measurement tables section
      const measurementHeaders = ['VOLTAGE', 'R-N', 'Y-N', 'B-N', 'RY', 'YB', 'RB'];
      const measurementColWidth = contentWidth / measurementHeaders.length;
      
      // Check if we need a new page
      if (currentY > pageHeight - 100) {
        pdf.addPage();
        currentY = margin;
      }
      
      // Voltage table with light gray background
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(240, 240, 240);  // Light gray, not dark
      pdf.setFontSize(8);
      
      // Draw voltage table
      measurementHeaders.forEach((header, index) => {
        const cellX = margin + (index * measurementColWidth);
        pdf.rect(cellX, currentY, measurementColWidth, 12, 'F');
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(100, 100, 100);  // Gray border
        pdf.rect(cellX, currentY, measurementColWidth, 12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(header, cellX + 2, currentY + 7);
      });
      currentY += 12;

      // Voltage values row - empty for filling
      pdf.setFont('helvetica', 'normal');
      pdf.setFillColor(255, 255, 255);
      for (let i = 0; i < measurementHeaders.length; i++) {
        const cellX = margin + (i * measurementColWidth);
        pdf.rect(cellX, currentY, measurementColWidth, 12, 'F');
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(100, 100, 100);
        pdf.rect(cellX, currentY, measurementColWidth, 12);
      }
      currentY += 12;

      // Ampere row with gray background
      const ampereHeaders = ['AMPERE', '', '', '', '', '', ''];
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(240, 240, 240);
      
      ampereHeaders.forEach((header, index) => {
        const cellX = margin + (index * measurementColWidth);
        pdf.rect(cellX, currentY, measurementColWidth, 12, 'F');
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(100, 100, 100);
        pdf.rect(cellX, currentY, measurementColWidth, 12);
        if (index === 0) {
          pdf.setTextColor(0, 0, 0);
          pdf.text(header, cellX + 2, currentY + 7);
        }
      });
      currentY += 12;

      // Ampere values row - empty for filling
      pdf.setFont('helvetica', 'normal');
      pdf.setFillColor(255, 255, 255);
      for (let i = 0; i < measurementHeaders.length; i++) {
        const cellX = margin + (i * measurementColWidth);
        pdf.rect(cellX, currentY, measurementColWidth, 12, 'F');
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(100, 100, 100);
        pdf.rect(cellX, currentY, measurementColWidth, 12);
      }
      currentY += 12;

      // Pressure section with gray background
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, currentY, measurementColWidth, 12, 'F');
      pdf.setLineWidth(0.3);
      pdf.setDrawColor(100, 100, 100);
      pdf.rect(margin, currentY, measurementColWidth, 12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('PRESSURE', margin + 2, currentY + 7);
      
      // Inlet pressure
      const inletPressureX = margin + measurementColWidth;
      pdf.setFillColor(255, 255, 255);
      pdf.rect(inletPressureX, currentY, measurementColWidth * 3, 12, 'F');
      pdf.rect(inletPressureX, currentY, measurementColWidth * 3, 12);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text('INLET PRESSURE (bar)', inletPressureX + 2, currentY + 7);
      
      // Outlet pressure
      const outletPressureX = margin + (measurementColWidth * 4);
      pdf.rect(outletPressureX, currentY, measurementColWidth * 3, 12, 'F');
      pdf.rect(outletPressureX, currentY, measurementColWidth * 3, 12);
      pdf.text('OUTLET PRESSURE (bar)', outletPressureX + 2, currentY + 7);
      
      currentY += 18;

      // Check if we need a new page for remarks and signature
      if (currentY > pageHeight - 80) {
        pdf.addPage();
        currentY = margin;
      }

      // Remarks section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Remarks:', margin, currentY);
      currentY += 5;
      
      // Large remarks box
      const remarksHeight = 40;
      pdf.setFillColor(255, 255, 255);
      pdf.rect(margin, currentY, contentWidth, remarksHeight, 'F');
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(100, 100, 100);  // Gray border
      pdf.rect(margin, currentY, contentWidth, remarksHeight);
      
      if (jobSheetComments) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        const remarkLines = pdf.splitTextToSize(jobSheetComments, contentWidth - 6);
        pdf.text(remarkLines, margin + 3, currentY + 10);
      }
      currentY += remarksHeight + 8;

      // Signature section at bottom
      const signatureHeight = 35;
      const signatureY = currentY;
      
      // Work Completed by section
      pdf.setFillColor(255, 255, 255);
      pdf.rect(margin, signatureY, contentWidth/2 - 2, signatureHeight, 'F');
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(100, 100, 100);  // Gray border
      pdf.rect(margin, signatureY, contentWidth/2 - 2, signatureHeight);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Work Completed by', margin + 3, signatureY + 10);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text('Date:', margin + 3, signatureY + signatureHeight - 8);

      // Inspected by section
      pdf.setFillColor(255, 255, 255);
      pdf.rect(margin + contentWidth/2 + 2, signatureY, contentWidth/2 - 2, signatureHeight, 'F');
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(100, 100, 100);  // Gray border
      pdf.rect(margin + contentWidth/2 + 2, signatureY, contentWidth/2 - 2, signatureHeight);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('Inspected by', margin + contentWidth/2 + 5, signatureY + 10);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text('Date:', margin + contentWidth/2 + 5, signatureY + signatureHeight - 8);

      // Save the PDF
      const fileName = `JobSheet_${taskDetails.task_details.id}_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);

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
    }
  };

  // --- UI Helper
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'scheduled':
        return 'bg-green-100 text-green-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // --- UI ---

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!taskDetails) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <p>Task not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 hover:text-[#C72030]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Scheduled Task List</span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Task Details</h1>
            <div className="flex gap-3">
              {taskDetails.task_details.status.value.toLowerCase() === 'closed' && (
                <Button
                  onClick={handleJobSheetClick}
                  style={{
                    backgroundColor: '#C72030'
                  }}
                  className="text-white hover:bg-[#C72030]/90"
                >
                  Job Sheet
                </Button>
              )}
              {/* {taskDetails.actions.can_submit_task && (
                <Button
                  onClick={handleSubmitTask}
                  style={{
                    backgroundColor: '#C72030'
                  }}
                  className="text-white hover:bg-[#C72030]/90"
                >
                  Submit Task
                </Button>
              )} */}
              {taskDetails.actions.can_reschedule && (
                <Button
                  onClick={handleTaskReschedule}
                  style={{
                    backgroundColor: '#C72030'
                  }}
                  className="text-white hover:bg-[#C72030]/90"
                >
                  Task Reschedule
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Task Details Section */}
        <Card className="mb-6">
          <CardHeader className="border-b bg-white">
            <CardTitle
              className="flex items-center gap-2"
              style={{
                color: '#C72030'
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                style={{
                  backgroundColor: '#C72030'
                }}
              >
                T
              </div>
              Task Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">ID</label>
                  <p className="font-medium">
                    {taskDetails.task_details.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Associated With
                  </label>
                  <p className="font-medium">
                    {taskDetails.task_details.associated_with}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Asset/Service Code
                  </label>
                  <p className="font-medium">
                    {taskDetails.task_details.asset_service_code}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Schedule on</label>
                  <p className="font-medium">
                    {taskDetails.task_details.scheduled_on}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Task Duration
                  </label>
                  <p className="font-medium">
                    {taskDetails.task_details.task_duration}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created By</label>
                  <p className="font-medium">
                    {taskDetails.task_details.created_by}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <Badge className={getStatusColor(taskDetails.task_details.status.value)}>
                    {taskDetails.task_details.status.display_name}
                  </Badge>
                </div>
                {taskDetails.task_details.completed_on && (
                  <div>
                    <label className="text-sm text-gray-600">Completed on</label>
                    <p className="font-medium">
                      {taskDetails.task_details.completed_on}
                    </p>
                  </div>
                )}
                {taskDetails.task_details.start_time && (
                  <div>
                    <label className="text-sm text-gray-600">Start time</label>
                    <p className="font-medium">
                      {taskDetails.task_details.start_time}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Task</label>
                  <p className="font-medium">
                    {taskDetails.task_details.task_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Asset/Service Name
                  </label>
                  <p className="font-medium">
                    {taskDetails.task_details.asset_service_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Supplier</label>
                  <p className="font-medium">
                    {taskDetails.task_details.supplier}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Assigned to</label>
                  <p className="font-medium">
                    {taskDetails.task_details.assigned_to}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created on</label>
                  <p className="font-medium">
                    {taskDetails.task_details.created_on}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p className="font-medium text-sm">
                    {taskDetails.task_details.location.full_location}
                  </p>
                </div>
                {taskDetails.task_details.performed_by && (
                  <div>
                    <label className="text-sm text-gray-600">Performed by</label>
                    <p className="font-medium">
                      {taskDetails.task_details.performed_by}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Section */}
        <Card>
          <CardHeader className="border-b bg-white">
            <CardTitle
              style={{
                color: '#C72030'
              }}
              className="flex items-center gap-2"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                style={{
                  backgroundColor: '#C72030'
                }}
              >
                A
              </div>
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
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
                <tbody>                        {taskDetails?.activity?.ungrouped_content?.length > 0 ? (
                          taskDetails.activity.ungrouped_content.map((activity: any, index: number) => {
                            const files = taskDetails.attachments?.blob_store_files?.filter(
                              (file: any) => file.relation === `AssetQuestResponse${activity.name}`
                            );

                            const score = taskDetails.activity.total_score ?? '-';

                            return (
                              <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                                <td className="p-3 border-b border-r">{activity.hint || '-'}</td>
                                <td className="p-3 border-b border-r">{activity.label || '-'}</td>
                                <td className="p-3 border-b border-r">
                                  {activity.userData?.length > 0 ? activity.userData.join(', ') : '-'}
                                </td>
                                <td className="p-3 border-b border-r">{activity.comment || '-'}</td>
                                <td className="p-3 border-b border-r">{activity.weightage || '-'}</td>
                                <td className="p-3 border-b border-r">{activity.rating || '-'}</td>
                                <td className="p-3 border-b border-r">{score}</td>
                                <td className="p-3 border-b border-r">
                                  <Badge className={getStatusColor(taskDetails.task_details.status.value)}>
                                    {taskDetails.task_details.status.display_name}
                                  </Badge>
                                </td>
                                <td className="p-3 border-b">
                                  {files?.length > 0 ? (
                                    <div className="space-y-1">
                                      {files.map((file: any) => (
                                        <div key={file.id} className="flex items-center gap-2">
                                          <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline text-sm truncate max-w-[150px]"
                                            title={file.filename}
                                          >
                                            <img
                                              src={file.url}
                                              alt={file.filename}
                                              className="w-8 h-8 object-cover rounded"
                                            />
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-500">No attachments for this activity</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={9} className="p-3 text-center text-gray-500">
                              No activities found for this task.
                            </td>
                          </tr>
                        )}


                </tbody>

              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Task Form Dialog */}
      <Dialog open={showSubmitForm} onOpenChange={setShowSubmitForm}>
        <DialogContent
          className="max-w-4xl max-h-[80vh] overflow-y-auto"
          aria-describedby="submit-task-dialog-description"
        >
          <span id="submit-task-dialog-description" className="sr-only">
            Submit the task with your feedback and task completion details.
          </span>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Test Ladies washroom Checklists
            </DialogTitle>
            <button
              onClick={() => setShowSubmitForm(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          {/* Place your submit form fields here */}
          {/* Example: */}
          <div className="p-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Comment
              </label>
              <TextField
                fullWidth
                multiline
                minRows={2}
                value={formData.floorComment}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    floorComment: e.target.value
                  }))
                }
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </div>
            {/* Add your other fields as required */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSubmitForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitForm}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent
          className="max-w-lg"
          aria-describedby="reschedule-dialog-description"
        >
          <span id="reschedule-dialog-description" className="sr-only">
            Select a new schedule date, time, user, and notification preferences for this task.
          </span>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Task Reschedule</DialogTitle>
            <button
              onClick={() => setShowRescheduleDialog(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          <div className="space-y-6 p-4">
            <div>
              <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                New Schedule
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Schedule Date"
                  type="date"
                  value={rescheduleData.scheduleDate}
                  onChange={e =>
                    setRescheduleData(prev => ({
                      ...prev,
                      scheduleDate: e.target.value
                    }))
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                  required
                />
                <TextField
                  label="Time"
                  type="time"
                  value={rescheduleData.scheduleTime}
                  onChange={e =>
                    setRescheduleData(prev => ({
                      ...prev,
                      scheduleTime: e.target.value
                    }))
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                Notification Preferences
              </h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={rescheduleData.email}
                  onCheckedChange={checked =>
                    setRescheduleData(prev => ({
                      ...prev,
                      email: !!checked
                    }))
                  }
                />
                <label htmlFor="email" className="text-sm font-medium">
                  Email Notification
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowRescheduleDialog(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRescheduleSubmit}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90 px-6"
              >
                Reschedule Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Sheet Modal */}
      <Dialog open={showJobSheetModal} onOpenChange={setShowJobSheetModal}>
        <DialogContent
          className="max-w-4xl max-h-[80vh] overflow-y-auto"
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
                onClick={downloadJobSheetPDF}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <button
                onClick={() => setShowJobSheetModal(false)}
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
                      <p className="font-medium">{jobSheetData.created_date || taskDetails?.task_details.created_on}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Job Card No</label>
                      <p className="font-medium">{jobSheetData.job_card_no || taskDetails?.task_details.id}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Scheduled Date</label>
                      <p className="font-medium">{jobSheetData.scheduled_date || taskDetails?.task_details.scheduled_on}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Job ID</label>
                      <p className="font-medium">{jobSheetData.job_id || taskDetails?.task_details.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input type="radio" disabled checked={jobSheetData.type === 'assets' || taskDetails?.task_details.associated_with === 'Assets'} />
                        <label className="text-sm">Assets</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" disabled checked={jobSheetData.type === 'services' || taskDetails?.task_details.associated_with === 'Services'} />
                        <label className="text-sm">Services</label>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Warranty</label>
                        <input type="radio" disabled checked={jobSheetData.warranty === 'yes'} />
                        <label className="text-sm">Yes</label>
                        <input type="radio" disabled checked={jobSheetData.warranty === 'no'} />
                        <label className="text-sm">No</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Breakdown</label>
                        <input type="radio" disabled checked={jobSheetData.breakdown === 'yes'} />
                        <label className="text-sm">Yes</label>
                        <input type="radio" disabled checked={jobSheetData.breakdown === 'no'} />
                        <label className="text-sm">No</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activities Table */}
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
                        {taskDetails?.activity?.ungrouped_content?.length > 0 ? (
                          taskDetails.activity.ungrouped_content.map((activity: any, index: number) => {
                            const files = taskDetails.attachments?.blob_store_files?.filter(
                              (file: any) => file.relation === `AssetQuestResponse${activity.name}`
                            );

                            const score = taskDetails.activity.total_score ?? '-';

                            return (
                              <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                                <td className="p-3 border-b border-r">{activity.hint || '-'}</td>
                                <td className="p-3 border-b border-r">{activity.label || '-'}</td>
                                <td className="p-3 border-b border-r">
                                  {activity.userData?.length > 0 ? activity.userData.join(', ') : '-'}
                                </td>
                                <td className="p-3 border-b border-r">{activity.comment || '-'}</td>
                                <td className="p-3 border-b border-r">{activity.weightage || '-'}</td>
                                <td className="p-3 border-b border-r">{activity.rating || '-'}</td>
                                <td className="p-3 border-b border-r">{score}</td>
                                <td className="p-3 border-b border-r">
                                  <Badge className={getStatusColor(taskDetails.task_details.status.value)}>
                                    {taskDetails.task_details.status.display_name}
                                  </Badge>
                                </td>
                                <td className="p-3 border-b">
                                  {files?.length > 0 ? (
                                    <div className="space-y-1">
                                      {files.map((file: any) => (
                                        <div key={file.id} className="flex items-center gap-2">
                                          <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline text-sm truncate max-w-[150px]"
                                            title={file.filename}
                                          >
                                            <img
                                              src={file.url}
                                              alt={file.filename}
                                              className="w-8 h-8 object-cover rounded"
                                            />
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-500">No attachments for this activity</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={9} className="p-3 text-center text-gray-500">
                              No activities found for this task.
                            </td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Comments Section */}
                <div>
                  <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                    Additional Comments:
                  </h3>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={jobSheetComments}
                    onChange={(e) => setJobSheetComments(e.target.value)}
                    variant="outlined"
                    placeholder="Enter Comments"
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
                  >
                    Update
                  </Button>
                </div>

                

                {/* Performed By and Supplier */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm text-gray-600">Performed By (Internal/External)</label>
                    <p className="font-medium">{jobSheetData.performed_by || taskDetails?.task_details.performed_by || 'a'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Supplier</label>
                    <p className="font-medium">{jobSheetData.supplier || taskDetails?.task_details.supplier}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No job sheet data available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
