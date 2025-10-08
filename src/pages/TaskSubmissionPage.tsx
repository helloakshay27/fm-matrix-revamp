import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Upload, Camera, Edit, User, FileText } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { taskService, TaskOccurrence } from "@/services/taskService";
import { TaskSubmissionSuccessModal } from "@/components/TaskSubmissionSuccessModal";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";

interface TaskSubmissionStep {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface ChecklistItem {
  id: string;
  question: string;
  type: "radio" | "checkbox" | "text";
  required: boolean;
  options?: string[];
  value?: any;
  comment?: string;
  attachment?: File | null;
}

export const TaskSubmissionPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskDetails, setTaskDetails] = useState<TaskOccurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStats, setSubmissionStats] = useState({
    questionsAttended: 0,
    negativeFeedback: 0,
    ticketsRaised: 0,
  });

  // File upload refs
  const beforePhotoRef = useRef<HTMLInputElement>(null);
  const afterPhotoRef = useRef<HTMLInputElement>(null);

  // Form data state
  const [formData, setFormData] = useState({
    beforePhoto: null as File | null,
    beforePhotoName: "",
    afterPhoto: null as File | null,
    afterPhotoName: "",
    checklist: {} as {
      [key: string]: { value: any; comment: string; attachment: File | null };
    },
  });

  // Dynamic checklist from API response
  const getChecklistFromTaskDetails = (): ChecklistItem[] => {
    console.log("Getting checklist from task details:", taskDetails);

    // Helper function to extract options from values array
    const extractOptions = (values: any[]) => {
      if (!values || !Array.isArray(values)) return [];
      return values.map((val: any) => {
        if (typeof val === "string") return val;
        return val.label || val.value || val.name || String(val);
      });
    };

    // Try to get checklist_questions first (new structure - direct from API root)
    const checklistQuestions = taskDetails?.checklist_questions;
    console.log("Checklist questions found:", checklistQuestions);

    if (checklistQuestions && Array.isArray(checklistQuestions)) {
      console.log("Processing checklist_questions structure");
      const questions = checklistQuestions.map((item: any, index: number) => {
        console.log("Processing question:", item);
        const itemType =
          item.type === "radio-group"
            ? ("radio" as const)
            : item.type === "checkbox-group"
            ? ("checkbox" as const)
            : item.type === "select"
            ? ("radio" as const) // Treat select as radio for UI consistency
            : item.type === "number"
            ? ("text" as const) // Treat number as text input
            : ("text" as const);
        return {
          id: item.name || `question_${index}`,
          question: item.label || item.hint || `Question ${index + 1}`,
          type: itemType,
          required: item.required === "true" || item.required === true,
          options:
            extractOptions(item.values) ||
            (item.type === "radio-group" || item.type === "select"
              ? ["Yes", "No"]
              : []),
        };
      });
      console.log("Final checklist from checklist_questions:", questions);
      return questions;
    }

    // Fallback to grouped_questions if available (new structure - direct from API root)
    const groupedQuestions = taskDetails?.grouped_questions;
    console.log("Grouped questions found:", groupedQuestions);

    if (groupedQuestions && Array.isArray(groupedQuestions)) {
      console.log("Processing grouped_questions structure");
      const allQuestions: ChecklistItem[] = [];
      groupedQuestions.forEach((group: any) => {
        console.log("Processing group:", group);
        if (group.sub_groups && Array.isArray(group.sub_groups)) {
          group.sub_groups.forEach((subGroup: any) => {
            console.log("Processing sub group:", subGroup);
            if (subGroup.questions && Array.isArray(subGroup.questions)) {
              subGroup.questions.forEach((item: any, index: number) => {
                console.log("Processing grouped question:", item);
                const itemType =
                  item.type === "radio-group"
                    ? ("radio" as const)
                    : item.type === "checkbox-group"
                    ? ("checkbox" as const)
                    : item.type === "select"
                    ? ("radio" as const) // Treat select as radio for UI consistency
                    : item.type === "number"
                    ? ("text" as const) // Treat number as text input
                    : ("text" as const);
                allQuestions.push({
                  id:
                    item.name ||
                    `grouped_${group.group_id}_${subGroup.sub_group_id}_${index}`,
                  question:
                    item.label ||
                    item.hint ||
                    `Question ${allQuestions.length + 1}`,
                  type: itemType,
                  required: item.required === "true" || item.required === true,
                  options:
                    extractOptions(item.values) ||
                    (item.type === "radio-group" || item.type === "select"
                      ? ["Yes", "No"]
                      : []),
                });
              });
            }
          });
        }
      });
      console.log("Final checklist from grouped_questions:", allQuestions);
      return allQuestions;
    }

    // Fallback to old activity.resp structure
    const activityResp = (taskDetails?.activity as any)?.resp;
    console.log("Activity resp found:", activityResp);

    if (!activityResp) {
      console.log("No checklist data found in any structure");
      return [];
    }

    console.log("Processing activity.resp structure");
    const questions = activityResp.map((item: any, index: number) => {
      console.log("Processing activity question:", item);
      const itemType =
        item.type === "radio-group"
          ? ("radio" as const)
          : item.type === "checkbox-group"
          ? ("checkbox" as const)
          : ("text" as const);
      return {
        id: item.name || `item_${index}`,
        question: item.label || item.hint || `Question ${index + 1}`,
        type: itemType,
        required: item.required === "true" || item.required === true,
        options: extractOptions(item.values) || ["Yes", "No"],
      };
    });
    console.log("Final checklist from activity.resp:", questions);
    return questions;
  };

  const dynamicChecklist = getChecklistFromTaskDetails();

  // Group checklist by group_id and sub_group_id for section-wise display
  const getGroupedChecklistData = () => {
    const checklistQuestions = taskDetails?.checklist_questions;
    
    if (!checklistQuestions || !Array.isArray(checklistQuestions)) {
      return [];
    }

    // Group by group_id and sub_group_id
    const grouped: { [key: string]: any[] } = {};
    
    checklistQuestions.forEach((item: any) => {
      const groupId = item.group_id || 'ungrouped';
      const subGroupId = item.sub_group_id || 'ungrouped';
      const key = `${groupId}_${subGroupId}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      // Map to ChecklistItem format
      const itemType =
        item.type === "radio-group"
          ? ("radio" as const)
          : item.type === "checkbox-group"
          ? ("checkbox" as const)
          : item.type === "select"
          ? ("radio" as const)
          : item.type === "number"
          ? ("text" as const)
          : ("text" as const);

      grouped[key].push({
        id: item.name,
        question: item.label || item.hint || '',
        type: itemType,
        required: item.required === "true" || item.required === true,
        options: item.values?.map((val: any) => {
          if (typeof val === "string") return val;
          return val.label || val.value || val.name || String(val);
        }) || [],
        group_id: groupId,
        sub_group_id: subGroupId,
        group_name: item.group_name || 'Ungrouped',
        sub_group_name: item.sub_group_name || ''
      });
    });

    // Convert to array of sections
    return Object.keys(grouped).map(key => ({
      sectionKey: key,
      group_name: grouped[key][0]?.group_name || 'Ungrouped',
      sub_group_name: grouped[key][0]?.sub_group_name || '',
      questions: grouped[key]
    }));
  };

  const groupedChecklist = getGroupedChecklistData();

  // Calculate dynamic stats for success modal
  const calculateSubmissionStats = () => {
    const totalQuestions = dynamicChecklist.length;
    let negativeFeedback = 0;
    let ticketsRaised = 0;

    dynamicChecklist.forEach((item) => {
      const answer = formData.checklist[item.id]?.value;
      // Count "No" answers as negative feedback
      if (answer === "No" || answer === "Poor" || answer === "Bad") {
        negativeFeedback++;
      }
      // Count negative answers as potential tickets (simplified logic)
      if (answer === "No") {
        ticketsRaised++;
      }
    });

    return {
      questionsAttended: totalQuestions,
      negativeFeedback,
      ticketsRaised,
    };
  };

  // Get task name dynamically
  const getTaskName = () => {
    return (
      taskDetails?.checklist ||
      taskDetails?.task_details?.task_name ||
      "Task Submission"
    );
  };

  // Get task location details
  const getLocationDetails = () => {
    // Try new API structure first
    if (taskDetails?.asset_path) {
      return taskDetails.asset_path;
    }

    // Fallback to old structure
    const location = taskDetails?.task_details?.location;
    if (!location) return "Location not available";

    const parts = [];
    if (location.site && location.site !== "NA")
      parts.push(`Site: ${location.site}`);
    if (location.building && location.building !== "NA")
      parts.push(`Building: ${location.building}`);
    if (location.wing && location.wing !== "NA")
      parts.push(`Wing: ${location.wing}`);
    if (location.floor && location.floor !== "NA")
      parts.push(`Floor: ${location.floor}`);
    if (location.area && location.area !== "NA")
      parts.push(`Area: ${location.area}`);
    if (location.room && location.room !== "NA")
      parts.push(`Room: ${location.room}`);

    return parts.length > 0
      ? parts.join(" / ")
      : location.full_location || "Location not available";
  };

  // Get assigned user name
  const getAssignedUserName = () => {
    // Try new API structure first
    if (taskDetails?.assigned_to_name) {
      return taskDetails.assigned_to_name.split(",")[0].trim(); // Take first assigned user
    }

    // Fallback to old structure
    return (
      taskDetails?.task_details?.assigned_to ||
      taskDetails?.task_details?.created_by ||
      "User"
    );
  };

  // Get task status information
  const getTaskStatus = () => {
    // Try new API structure first
    if (taskDetails?.task_status) {
      return taskDetails.task_status;
    }

    // Fallback to old structure
    return taskDetails?.task_details?.status?.display_name || "Unknown Status";
  };

  // Helper function to determine appropriate icon for photo actions
  const getPhotoActionIcon = (hasPhoto: boolean) => {
    return hasPhoto ? Camera : Upload;
  };

  // Helper function to get photo action text
  const getPhotoActionText = (hasPhoto: boolean) => {
    return hasPhoto ? "Change Photo" : "Upload Files";
  };

  // Helper function to get attachment action text
  const getAttachmentActionText = (hasAttachment: boolean) => {
    return hasAttachment ? "Change Attachment" : "Add Attachment";
  };

  // Helper function to determine appropriate icon for attachment actions
  const getAttachmentActionIcon = (hasAttachment: boolean) => {
    return hasAttachment ? Edit : Upload;
  };

  // Check if step has valid data
  const isStepDataValid = (step: number): boolean => {
    const apiSteps = taskDetails?.steps;

    if (apiSteps === 1) {
      // Single step workflow validation
      switch (step) {
        case 1: // Checkpoint
          return dynamicChecklist.every((item) => {
            if (item.required) {
              const answer = formData.checklist[item.id]?.value;
              return answer && answer !== "" && (!Array.isArray(answer) || answer.length > 0);
            }
            return true; // Non-required items are always valid
          });
        case 2: // Preview
          return true;
        default:
          return false;
      }
    } else {
      // Multi-step workflow validation
      switch (step) {
        case 1:
          return !!formData.beforePhoto;
        case 2:
          return dynamicChecklist.every((item) => {
            if (item.required) {
              const answer = formData.checklist[item.id]?.value;
              return answer && answer !== "" && (!Array.isArray(answer) || answer.length > 0);
            }
            return true; // Non-required items are always valid
          });
        case 3:
          return !!formData.afterPhoto;
        case 4:
          return true; // Preview step doesn't have its own data
        default:
          return false;
      }
    }
  };

  // Generate dynamic steps based on API response
  const generateSteps = (): TaskSubmissionStep[] => {
    const apiSteps = taskDetails?.steps; // Default to 3 for backward compatibility

    if (apiSteps === 1) {
      // Single step workflow: Only Checkpoint and Preview
      return [
        {
          id: 1,
          title: "Checkpoint",
          completed: completedSteps.includes(1) && isStepDataValid(1),
          active: currentStep === 1,
        },
        {
          id: 2,
          title: "Preview",
          completed: completedSteps.includes(2) && isStepDataValid(2),
          active: currentStep === 2,
        },
      ];
    } else {
      // Multi-step workflow: Before Photo, Checkpoint, After Photo, Preview
      return [
        {
          id: 1,
          title: "Before Photo",
          completed: completedSteps.includes(1) && isStepDataValid(1),
          active: currentStep === 1,
        },
        {
          id: 2,
          title: "Checkpoint",
          completed: completedSteps.includes(2) && isStepDataValid(2),
          active: currentStep === 2,
        },
        {
          id: 3,
          title: "After Photo",
          completed: completedSteps.includes(3) && isStepDataValid(3),
          active: currentStep === 3,
        },
        {
          id: 4,
          title: "Preview",
          completed: completedSteps.includes(4) && isStepDataValid(4),
          active: currentStep === 4,
        },
      ];
    }
  };

  const steps: TaskSubmissionStep[] = generateSteps();

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed steps or current step, or next step if current is valid
    const maxAccessibleStep = Math.max(...completedSteps, currentStep);
    const canProceedToNext = currentStep < steps.length && isStepDataValid(currentStep);
    
    if (stepId <= maxAccessibleStep || (stepId === currentStep + 1 && canProceedToNext)) {
      setCurrentStep(stepId);
    }
  };

  // Separate function for explicit edit actions (from edit buttons)
  const handleEditStep = (stepId: number) => {
    setCurrentStep(stepId);

    // Note: We no longer reset data automatically - users can manually re-upload if needed
    // This preserves data when navigating between steps
  };

  // Initialize checklist data when task details are loaded
  useEffect(() => {
    if (taskDetails && dynamicChecklist.length > 0) {
      const initialChecklist = dynamicChecklist.reduce((acc, item) => {
        acc[item.id] = {
          value: item.type === "checkbox" ? [] : "",
          comment: "",
          attachment: null,
        };
        return acc;
      }, {} as { [key: string]: { value: any; comment: string; attachment: File | null } });

      setFormData((prev) => ({ ...prev, checklist: initialChecklist }));
    }
  }, [taskDetails]);

  // Auto-mark steps as completed when they have valid data
  useEffect(() => {
    const newCompletedSteps: number[] = [];
    
    steps.forEach((step) => {
      if (step.id < currentStep && isStepDataValid(step.id)) {
        newCompletedSteps.push(step.id);
      }
    });

    setCompletedSteps((prev) => {
      const combined = [...new Set([...prev, ...newCompletedSteps])];
      return combined;
    });
  }, [formData, currentStep, steps]);

  // Fetch task details
  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await taskService.getTaskSubmissionDetails(id);
        const mappedDetails = response;
        setTaskDetails(mappedDetails);
      } catch (error) {
        sonnerToast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id]);

  const handleFileUpload = (type: "before" | "after", file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      // 10MB limit
      sonnerToast.error(
        "File too large. Please select a file smaller than 10MB"
      );
      return;
    }

    if (type === "before") {
      setFormData((prev) => ({
        ...prev,
        beforePhoto: file,
        beforePhotoName: file?.name || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        afterPhoto: file,
        afterPhotoName: file?.name || "",
      }));
    }
  };

  const handleChecklistChange = (
    itemId: string,
    field: "value" | "comment" | "attachment",
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [itemId]: {
          ...prev.checklist[itemId],
          [field]: value,
        },
      },
    }));
  };

  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }

    // Mark current step as completed if not already
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    const totalSteps = steps.length;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    const apiSteps = taskDetails?.steps;

    if (apiSteps === 1) {
      // Single step workflow validation
      switch (currentStep) {
        case 1: // Checkpoint
          // Validate checklist items
          console.log("Validating checklist items:", dynamicChecklist);
          console.log("Current form data:", formData.checklist);
          
          for (const item of dynamicChecklist) {
            if (item.required) {
              console.log(`Checking required item: ${item.question}`);
              const answer = formData.checklist[item.id]?.value;
              console.log(`Answer for ${item.id}:`, answer);
              
              if (!answer || answer === "" || (Array.isArray(answer) && answer.length === 0)) {
                sonnerToast.error(
                  `Required Field. Please answer: ${item.question}`
                );
                return false;
              }
            }
          }
          break;
        case 2: // Preview
          // Preview step - all validations should be done by now
          break;
      }
    } else {
      // Multi-step workflow validation
      switch (currentStep) {
        case 1:
          if (!formData.beforePhoto) {
            sonnerToast.error(
              "Photo Required. Please add a photograph before starting work."
            );
            return false;
          }
          break;
        case 2:
          // Validate checklist items
          console.log("Validating multi-step checklist items:", dynamicChecklist);
          console.log("Current form data:", formData.checklist);
          
          for (const item of dynamicChecklist) {
            if (item.required) {
              console.log(`Checking required item: ${item.question}`);
              const answer = formData.checklist[item.id]?.value;
              console.log(`Answer for ${item.id}:`, answer);
              
              if (!answer || answer === "" || (Array.isArray(answer) && answer.length === 0)) {
                sonnerToast.error(
                  `Required Field. Please answer: ${item.question}`
                );
                return false;
              }
            }
          }
          break;
        case 3:
          if (!formData.afterPhoto) {
            sonnerToast.error(
              "Photo Required. Please add a photograph after work."
            );
            return false;
          }
          break;
        case 4:
          // Preview step - all validations should be done by now
          break;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Mark final step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    // Show loading state
    setIsSubmitting(true);
    const loadingToastId = sonnerToast.loading("Submitting task...", {
      duration: Infinity,
    });

    try {
      // Helper function to convert file to base64
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64 = reader.result as string;
            // Remove the data:image/...;base64, prefix
            resolve(base64.split(",")[1]);
          };
          reader.onerror = reject;
        });
      };

      // Convert images to base64 if they exist
      const beforePhotoBase64 = formData.beforePhoto
        ? await fileToBase64(formData.beforePhoto)
        : "";
      const afterPhotoBase64 = formData.afterPhoto
        ? await fileToBase64(formData.afterPhoto)
        : "";

      // Get overall attachments (non-checklist specific files)
      const overallAttachments: string[] = [];

      // Prepare checklist data with attachments
      const checklistData = await Promise.all(
        dynamicChecklist.map(async (item) => {
          const checklistItem = formData.checklist[item.id];
          let attachments: string[] = [];

          // Convert attachment to base64 if it exists
          if (checklistItem?.attachment) {
            try {
              const attachmentBase64 = await fileToBase64(
                checklistItem.attachment
              );
              attachments.push(attachmentBase64);
            } catch (error) {
              console.warn(
                `Failed to convert attachment for ${item.id}:`,
                error
              );
            }
          }

          return {
            qname: item.id,
            comment: checklistItem?.comment || "",
            value: Array.isArray(checklistItem?.value)
              ? checklistItem.value
              : checklistItem?.value
              ? [checklistItem.value]
              : [""],
            rating: "Good", // Default rating - can be made dynamic if needed
            attachments: attachments,
          };
        })
      );

      // Prepare submission data according to your API format
      const submissionData = {
        response_of_id: "", // Optional, can be blank as per your example
        response_of: "Pms::Asset",
        occurrence_of: "Pms::AssetTaskOccurrence",
        occurrence_of_id: id!,
        offlinemobile: "true",
        first_name: getAssignedUserName().trim(),
        asset_quest_response: {
          occurrence_of: "Pms::AssetTaskOccurrence",
          occurrence_of_id: id!,
          response_of: "Pms::Asset",
          response_of_id: "", // Optional, can be blank
          first_name: getAssignedUserName().trim(),
        },
        data: checklistData,
        attachments: overallAttachments,
        bef_sub_attachment: beforePhotoBase64,
        aft_sub_attachment: afterPhotoBase64,
        mobile_submit: "true",
        token: localStorage.getItem("token") || "",
      };

      console.log("Submitting task with formatted payload:", submissionData);

      // Call the API and handle response
      const response = await taskService.submitTaskResponse(submissionData);

      // Check if response contains an application-level error (even with 200 status)
      if (response && response.code === 500) {
        // Handle application-level 500 error in successful HTTP response
        let errorMessage = "Failed to submit task. Please try again.";
        
        if (response.error === "Task not available for submission") {
          errorMessage = "This task is no longer available for submission. It may have been completed or cancelled.";
        } else if (response.error) {
          errorMessage = response.error;
        }

        sonnerToast.dismiss(loadingToastId);
        sonnerToast.error(errorMessage, {
          duration: 6000,
        });
        return; // Exit early, don't show success modal
      }

      // Only proceed with success flow if we get a successful response without errors
      if (response) {
        // Use stats from API response instead of local calculation
        const stats = {
          questionsAttended: response.question_attended_count || 0,
          negativeFeedback: response.negative_answers_count || 0,
          ticketsRaised: response.complaints_count || 0,
        };
        setSubmissionStats(stats);

        sonnerToast.dismiss(loadingToastId);
        sonnerToast.success("Task submitted successfully!");
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.error("Task submission failed:", error);
      sonnerToast.dismiss(loadingToastId);

      // Handle specific error scenarios
      let errorMessage = "Failed to submit task. Please try again.";
      
      // Check for API response errors
      if (error?.response?.data) {
        const errorData = error.response.data;
        
        // Handle specific 500 error with "Task not available for submission"
        if (errorData.code === 500 && errorData.error === "Task not available for submission") {
          errorMessage = "This task is no longer available for submission. It may have been completed or cancelled.";
        }
        // Handle other structured API errors
        else if (errorData.error) {
          errorMessage = errorData.error;
        }
        // Handle error messages from API
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      // Handle network or other errors
      else if (error?.message) {
        if (error.message.includes("Network Error")) {
          errorMessage = "Network connection failed. Please check your internet connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }

      // Show error toast with specific message
      sonnerToast.error(errorMessage, {
        duration: 6000, // Show error longer than success messages
      });

      // Log additional error details for debugging
      if (error?.response?.status) {
        console.error(`API Error ${error.response.status}:`, error.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveToDraft = () => {
    const apiSteps = taskDetails?.steps;

    // Count how many questions have been answered
    const answeredCount = Object.keys(formData.checklist).filter(key => {
      const item = formData.checklist[key];
      return item.value && (Array.isArray(item.value) ? item.value.length > 0 : item.value !== "");
    }).length;

    const totalQuestions = dynamicChecklist.length;
    
    // Count photos based on workflow type
    let savedItems = [];
    
    // Only show photos for multi-step workflow (apiSteps !== 1)
    if (apiSteps !== 1) {
      if (formData.beforePhoto) savedItems.push("Before Photo");
      if (formData.afterPhoto) savedItems.push("After Photo");
    }
    
    // Always show checklist items if answered
    if (answeredCount > 0) savedItems.push(`${answeredCount}/${totalQuestions} Checklist Items`);

    // Save to localStorage as draft
    const draftData = {
      taskId: id,
      formData: {
        ...formData,
        // Convert Files to base64 for storage
        beforePhoto: formData.beforePhoto ? "saved" : null,
        afterPhoto: formData.afterPhoto ? "saved" : null,
      },
      savedAt: new Date().toISOString(),
      currentStep,
      completedSteps,
    };

    try {
      localStorage.setItem(`task_draft_${id}`, JSON.stringify(draftData));
      
      sonnerToast.success(
        `Draft saved successfully! ${savedItems.length > 0 ? savedItems.join(", ") : "No data"} saved.`,
        {
          duration: 4000,
        }
      );
    } catch (error) {
      console.error("Failed to save draft:", error);
      sonnerToast.error("Failed to save draft. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate(`/maintenance/task/details/${id}`);
  };

  const renderStepContent = () => {
    const apiSteps = taskDetails?.steps;

    if (apiSteps === 1) {
      // Single step workflow rendering
      switch (currentStep) {
        case 1: // Checkpoint
          return (
            <div className="space-y-6">
              {/* Checklist Card (Active) */}
              <Card className="border border-gray-200 shadow-sm">
                <div className="figma-card-header">
                  <div className="flex items-center gap-3">
                    <div className="figma-card-icon-wrapper">
                      <FileText className="figma-card-icon" />
                    </div>
                    <Typography variant="body1" className="figma-card-title">
                      {taskDetails?.task_details?.task_name || "Task"} Checklist
                    </Typography>
                  </div>
                </div>

                <CardContent className="figma-card-content">
                  {dynamicChecklist.length === 0 ? (
                    <div className="text-center py-8">
                      <Typography variant="body1" className="text-gray-600">
                        No checklist items available for this task.
                      </Typography>
                    </div>
                  ) : groupedChecklist.length > 0 ? (
                    <div className="space-y-6">
                      {groupedChecklist.map((section, sectionIndex) => (
                        <div key={section.sectionKey} className="space-y-4">
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

                          {/* Section Questions */}
                          <div className="space-y-8">
                            {section.questions.map((item: any, index: number) => (
                        <div key={item.id} className="space-y-4">
                          <Typography
                            variant="body2"
                            className="font-medium text-gray-900"
                          >
                            {index + 1}. {item.question}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </Typography>

                          {item.type === "text" && (
                            <TextField
                              placeholder="Enter your value..."
                              fullWidth
                              variant="outlined"
                              type={
                                item.question
                                  .toLowerCase()
                                  .includes("voltage") ||
                                item.question
                                  .toLowerCase()
                                  .includes("current") ||
                                item.question.toLowerCase().includes("power") ||
                                item.question.toLowerCase().includes("time")
                                  ? "number"
                                  : "text"
                              }
                              value={formData.checklist[item.id]?.value || ""}
                              onChange={(e) =>
                                handleChecklistChange(
                                  item.id,
                                  "value",
                                  e.target.value
                                )
                              }
                              className=""
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "white",
                                  "& fieldset": {
                                    borderColor: "#D1D5DB",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9CA3AF",
                                  },
                                },
                              }}
                            />
                          )}

                          {item.type === "radio" && (
                            <RadioGroup
                              value={formData.checklist[item.id]?.value || ""}
                              onChange={(e) =>
                                handleChecklistChange(
                                  item.id,
                                  "value",
                                  e.target.value
                                )
                              }
                              className=""
                            >
                              {item.options?.map((option) => (
                                <FormControlLabel
                                  key={option}
                                  value={option}
                                  control={
                                    <Radio
                                      sx={{
                                        color: "#C72030",
                                        "&.Mui-checked": { color: "#C72030" },
                                      }}
                                    />
                                  }
                                  label={option}
                                  className="mb-1"
                                />
                              ))}
                            </RadioGroup>
                          )}

                          {item.type === "checkbox" && (
                            <div className="">
                              {item.options?.map((option) => (
                                <FormControlLabel
                                  key={option}
                                  control={
                                    <Checkbox
                                      checked={
                                        Array.isArray(formData.checklist[item.id]?.value) &&
                                        formData.checklist[item.id].value.includes(option)
                                      }
                                      onChange={(e) => {
                                        const currentValues = Array.isArray(formData.checklist[item.id]?.value)
                                          ? formData.checklist[item.id].value
                                          : [];
                                        const newValues = e.target.checked
                                          ? [...currentValues, option]
                                          : currentValues.filter((v: string) => v !== option);
                                        handleChecklistChange(item.id, "value", newValues);
                                      }}
                                      sx={{
                                        color: "#C72030",
                                        "&.Mui-checked": { color: "#C72030" },
                                      }}
                                    />
                                  }
                                  label={option}
                                  className="block mb-1"
                                />
                              ))}
                            </div>
                          )}

                          <div className="">
                            <TextField
                              placeholder="Add your comment..."
                              fullWidth
                              multiline
                              minRows={3}
                              variant="outlined"
                              value={formData.checklist[item.id]?.comment || ""}
                              onChange={(e) =>
                                handleChecklistChange(
                                  item.id,
                                  "comment",
                                  e.target.value
                                )
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "white",
                                  "& fieldset": {
                                    borderColor: "#D1D5DB",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9CA3AF",
                                  },
                                },
                              }}
                            />
                          </div>

                          {formData.checklist[item.id]?.attachment && (
                            <div className="">
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                                <img
                                  src={URL.createObjectURL(
                                    formData.checklist[item.id].attachment
                                  )}
                                  alt="Attachment"
                                  className="w-16 h-16 object-cover rounded border"
                                />
                                <Typography
                                  variant="body2"
                                  className="flex-1 text-gray-700"
                                >
                                  {formData.checklist[item.id].attachment.name}
                                </Typography>
                              </div>
                            </div>
                          )}

                          <div className="">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#C72030] border-[#C72030] hover:bg-red-50"
                              onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "image/*";
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement)
                                    .files?.[0];
                                  if (file) {
                                    handleChecklistChange(
                                      item.id,
                                      "attachment",
                                      file
                                    );
                                  }
                                };
                                input.click();
                              }}
                            >
                              Add Attachment
                            </Button>
                          </div>
                        </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {dynamicChecklist.map((item, index) => (
                        <div key={item.id}>Question {index + 1}</div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );

        case 2: // Preview
          return (
            <div className="space-y-6">
              {/* Checklist Summary */}
              <Card className="border border-gray-200 shadow-sm">
                <div className="figma-card-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="figma-card-icon-wrapper">
                        <FileText className="figma-card-icon" />
                      </div>
                      <Typography variant="body1" className="figma-card-title">
                        Checklist Summary
                      </Typography>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-4 py-2 rounded-md"
                      onClick={() => handleEditStep(1)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                <CardContent className="figma-card-content">
                  {dynamicChecklist.length === 0 ? (
                    <div className="text-center py-8">
                      <Typography variant="body1" className="text-gray-600">
                        No checklist items available for this task.
                      </Typography>
                    </div>
                  ) : groupedChecklist.length > 0 ? (
                    <div className="space-y-6">
                      {groupedChecklist.map((section, sectionIndex) => (
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
                          <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Help Text
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Activities
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Input
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Comments
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Attachment
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {section.questions.map((item: any) => {
                                  const answer = formData.checklist[item.id]?.value;
                                  const comment = formData.checklist[item.id]?.comment;
                                  const attachment = formData.checklist[item.id]?.attachment;

                                  return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                        <span className="text-xs">-</span>
                                      </td>
                                      <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                        <span className="text-xs">{item.question}</span>
                                      </td>
                                      <td className="px-4 py-3 text-xs border-b border-gray-100">
                                        <span className="text-xs">
                                          {Array.isArray(answer) 
                                            ? answer.length > 0 
                                              ? answer.join(", ") 
                                              : "-"
                                            : answer || "-"}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                        <span className="text-xs">{comment || "-"}</span>
                                      </td>
                                      <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                        {attachment ? (
                                          <div className="flex items-center gap-2">
                                            <img
                                              src={URL.createObjectURL(attachment)}
                                              alt="Attachment"
                                              className="w-8 h-8 object-cover rounded border border-gray-200"
                                            />
                                            <span className="text-xs text-gray-600 truncate max-w-20">
                                              {attachment.name}
                                            </span>
                                          </div>
                                        ) : (
                                          <span className="text-xs">-</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Help Text
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Activities
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Input
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Comments
                            </th>
                          
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Attachment
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {dynamicChecklist.map((item, index) => {
                            const answer = formData.checklist[item.id]?.value;
                            const comment = formData.checklist[item.id]?.comment;
                            const attachment = formData.checklist[item.id]?.attachment;
                            
                            // Calculate score based on answer (similar to TaskDetailsPage logic)
                            const calculateScore = () => {
                              if (answer === "Yes") return "100";
                              if (answer === "No") return "0";
                              if (Array.isArray(answer) && answer.length > 0) return "75";
                              return "-";
                            };

                            return (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                  <span className="text-xs"></span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                  <span className="text-xs">{item.question}</span>
                                </td>
                                <td className="px-4 py-3 text-xs border-b border-gray-100">
                                  <span className="text-xs">
                                    {Array.isArray(answer) 
                                      ? answer.length > 0 
                                        ? answer.join(", ") 
                                        : "-"
                                      : answer || "-"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                  <span className="text-xs">{comment || "-"}</span>
                                </td>
  
                                <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                  {attachment ? (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={URL.createObjectURL(attachment)}
                                        alt="Attachment"
                                        className="w-8 h-8 object-cover rounded border border-gray-200"
                                      />
                                      <span className="text-xs text-gray-600 truncate max-w-20">
                                        {attachment.name}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xs">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );

        default:
          return null;
      }
    } else {
      // Multi-step workflow rendering
      switch (currentStep) {
        case 1: // Before Photo
          return (
            <div className="space-y-6">
              <Card className="border border-gray-200 shadow-sm">
                <div className="figma-card-header">
                  <div className="flex items-center gap-3">
                    <div className="figma-card-icon-wrapper">
                      <User className="figma-card-icon" />
                    </div>
                    <Typography variant="body1" className="figma-card-title">
                      Pre-Post Inspection Info
                    </Typography>
                  </div>
                </div>

                <CardContent className="figma-card-content">
                  <div className="space-y-6">
                    <div>
                      <Typography
                        variant="body2"
                        className="font-medium text-gray-900 mb-4"
                      >
                        Attach Before Photograph
                      </Typography>

                      {formData.beforePhoto ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <Typography
                              variant="body2"
                              className="font-medium text-gray-900 mb-3"
                            >
                              Before
                            </Typography>
                            <div className="flex items-start gap-4">
                              <img
                                src={URL.createObjectURL(formData.beforePhoto)}
                                alt="Before"
                                className="w-24 h-24 object-cover rounded border border-gray-200"
                              />
                              <div className="flex-1">
                                <FormControl
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                >
                                  <InputLabel>Name</InputLabel>
                                  <MuiSelect
                                    value={getAssignedUserName()}
                                    label="Name"
                                    disabled={true}
                                  >
                                    <MenuItem value={getAssignedUserName()}>
                                      {getAssignedUserName()}
                                    </MenuItem>
                                  </MuiSelect>
                                </FormControl>
                              </div>
                            </div>
                          </div>

                          {/* Change Photo Button */}
                          <div className="flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#C72030] border-[#C72030] hover:bg-red-50"
                              onClick={() => beforePhotoRef.current?.click()}
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              {getPhotoActionText(true)}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-[#C72030] rounded-lg p-12 text-center cursor-pointer hover:border-[#B11E2A] hover:bg-red-50 transition-colors"
                          onClick={() => beforePhotoRef.current?.click()}
                        >
                          {React.createElement(getPhotoActionIcon(false), {
                            className: "w-8 h-8 text-[#C72030] mx-auto mb-3",
                          })}
                          <Typography
                            variant="body2"
                            className="text-[#C72030] font-medium"
                          >
                            {getPhotoActionText(false)}
                          </Typography>
                        </div>
                      )}

                      <input
                        ref={beforePhotoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            "before",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );

        case 2: // Checkpoints
          return (
            <div className="space-y-6">
              {/* Step 1 - Pre-Post Inspection Info (Disabled/Completed) */}
              {formData.beforePhoto && (
                <Card className="border border-gray-200 shadow-sm">
                  <div className="figma-card-header">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="figma-card-icon-wrapper">
                          <User className="figma-card-icon" />
                        </div>
                        <Typography
                          variant="body1"
                          className="figma-card-title"
                        >
                          Pre-Post Inspection Info
                        </Typography>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-4 py-2 rounded-md"
                        onClick={() => handleEditStep(1)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <CardContent className="figma-card-content">
                    <div className="space-y-4">
                      <Typography
                        variant="body2"
                        className="font-medium text-gray-900 mb-3"
                      >
                        Before
                      </Typography>
                      <div className="flex items-start gap-4">
                        <img
                          src={URL.createObjectURL(formData.beforePhoto)}
                          alt="Before"
                          className="w-20 h-20 object-cover rounded border border-gray-200"
                        />
                        <div className="flex-1">
                          <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled
                          >
                            <InputLabel>Name</InputLabel>
                            <MuiSelect
                              value={getAssignedUserName()}
                              label="Name"
                              disabled
                            >
                              <MenuItem value={getAssignedUserName()}>
                                {getAssignedUserName()}
                              </MenuItem>
                            </MuiSelect>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2 - Checklist Card (Active) */}
              <Card className="border border-gray-200 shadow-sm">
                <div className="figma-card-header">
                  <div className="flex items-center gap-3">
                    <div className="figma-card-icon-wrapper">
                      <FileText className="figma-card-icon" />
                    </div>
                    <Typography variant="body1" className="figma-card-title">
                      {taskDetails?.task_details?.task_name || "Task"}{" "}
                      Checklists
                    </Typography>
                  </div>
                </div>

                <CardContent className="figma-card-content">
                  {dynamicChecklist.length === 0 ? (
                    <div className="text-center py-8">
                      <Typography variant="body1" className="text-gray-600">
                        No checklist items available for this task.
                      </Typography>
                    </div>
                  ) : groupedChecklist.length > 0 ? (
                    <div className="space-y-6">
                      {groupedChecklist.map((section, sectionIndex) => (
                        <div key={section.sectionKey} className="space-y-4">
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

                          {/* Section Questions */}
                          <div className="space-y-8">
                            {section.questions.map((item: any, index: number) => (
                              <div key={item.id} className="space-y-4">
                                <Typography
                                  variant="body2"
                                  className="font-medium text-gray-900"
                                >
                                  {index + 1}. {item.question}
                                  {item.required && <span className="text-red-500 ml-1">*</span>}
                                </Typography>

                                {item.type === "text" && (
                                  <TextField
                                    placeholder="Enter your value..."
                                    fullWidth
                                    variant="outlined"
                                    type={
                                      item.question
                                        .toLowerCase()
                                        .includes("voltage") ||
                                      item.question
                                        .toLowerCase()
                                        .includes("current") ||
                                      item.question.toLowerCase().includes("power") ||
                                      item.question.toLowerCase().includes("time")
                                        ? "number"
                                        : "text"
                                    }
                                    value={formData.checklist[item.id]?.value || ""}
                                    onChange={(e) =>
                                      handleChecklistChange(
                                        item.id,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    className=""
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        backgroundColor: "white",
                                        "& fieldset": {
                                          borderColor: "#D1D5DB",
                                        },
                                        "&:hover fieldset": {
                                          borderColor: "#9CA3AF",
                                        },
                                      },
                                    }}
                                  />
                                )}

                                {item.type === "radio" && (
                                  <RadioGroup
                                    value={formData.checklist[item.id]?.value || ""}
                                    onChange={(e) =>
                                      handleChecklistChange(
                                        item.id,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    className=""
                                  >
                                    {item.options?.map((option) => (
                                      <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={
                                          <Radio
                                            sx={{
                                              color: "#C72030",
                                              "&.Mui-checked": { color: "#C72030" },
                                            }}
                                          />
                                        }
                                        label={option}
                                        className="mb-1"
                                      />
                                    ))}
                                  </RadioGroup>
                                )}

                                {item.type === "checkbox" && (
                                  <div className="">
                                    {item.options?.map((option) => (
                                      <FormControlLabel
                                        key={option}
                                        control={
                                          <Checkbox
                                            checked={
                                              Array.isArray(formData.checklist[item.id]?.value) &&
                                              formData.checklist[item.id].value.includes(option)
                                            }
                                            onChange={(e) => {
                                              const currentValues = Array.isArray(formData.checklist[item.id]?.value)
                                                ? formData.checklist[item.id].value
                                                : [];
                                              const newValues = e.target.checked
                                                ? [...currentValues, option]
                                                : currentValues.filter((v: string) => v !== option);
                                              handleChecklistChange(item.id, "value", newValues);
                                            }}
                                            sx={{
                                              color: "#C72030",
                                              "&.Mui-checked": { color: "#C72030" },
                                            }}
                                          />
                                        }
                                        label={option}
                                        className="block mb-1"
                                      />
                                    ))}
                                  </div>
                                )}

                                <div className="">
                                  <TextField
                                    placeholder="Add your comment..."
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    variant="outlined"
                                    value={formData.checklist[item.id]?.comment || ""}
                                    onChange={(e) =>
                                      handleChecklistChange(
                                        item.id,
                                        "comment",
                                        e.target.value
                                      )
                                    }
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        backgroundColor: "white",
                                        "& fieldset": {
                                          borderColor: "#D1D5DB",
                                        },
                                        "&:hover fieldset": {
                                          borderColor: "#9CA3AF",
                                        },
                                      },
                                    }}
                                  />
                                </div>

                                {formData.checklist[item.id]?.attachment && (
                                  <div className="">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                                      <img
                                        src={URL.createObjectURL(
                                          formData.checklist[item.id].attachment
                                        )}
                                        alt="Attachment"
                                        className="w-16 h-16 object-cover rounded border"
                                      />
                                      <Typography
                                        variant="body2"
                                        className="flex-1 text-gray-700"
                                      >
                                        {formData.checklist[item.id].attachment.name}
                                      </Typography>
                                    </div>
                                  </div>
                                )}

                                <div className="">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-[#C72030] border-[#C72030] hover:bg-red-50"
                                    onClick={() => {
                                      const input = document.createElement("input");
                                      input.type = "file";
                                      input.accept = "image/*";
                                      input.onchange = (e) => {
                                        const file = (e.target as HTMLInputElement)
                                          .files?.[0];
                                        if (file) {
                                          handleChecklistChange(
                                            item.id,
                                            "attachment",
                                            file
                                          );
                                        }
                                      };
                                      input.click();
                                    }}
                                  >
                                    Add Attachment
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {dynamicChecklist.map((item, index) => (
                        <div key={item.id} className="space-y-4">
                          <Typography
                            variant="body2"
                            className="font-medium text-gray-900"
                          >
                            {index + 1}. {item.question}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </Typography>

                          {item.type === "text" && (
                            <TextField
                              placeholder="Enter your value..."
                              fullWidth
                              variant="outlined"
                              type={
                                item.question
                                  .toLowerCase()
                                  .includes("voltage") ||
                                item.question
                                  .toLowerCase()
                                  .includes("current") ||
                                item.question.toLowerCase().includes("power") ||
                                item.question.toLowerCase().includes("time")
                                  ? "number"
                                  : "text"
                              }
                              value={formData.checklist[item.id]?.value || ""}
                              onChange={(e) =>
                                handleChecklistChange(
                                  item.id,
                                  "value",
                                  e.target.value
                                )
                              }
                              className=""
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "white",
                                  "& fieldset": {
                                    borderColor: "#D1D5DB",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9CA3AF",
                                  },
                                },
                              }}
                            />
                          )}

                          {item.type === "radio" && (
                            <RadioGroup
                              value={formData.checklist[item.id]?.value || ""}
                              onChange={(e) =>
                                handleChecklistChange(
                                  item.id,
                                  "value",
                                  e.target.value
                                )
                              }
                              className=""
                            >
                              {item.options?.map((option) => (
                                <FormControlLabel
                                  key={option}
                                  value={option}
                                  control={
                                    <Radio
                                      sx={{
                                        color: "#C72030",
                                        "&.Mui-checked": { color: "#C72030" },
                                      }}
                                    />
                                  }
                                  label={option}
                                  className="mb-1"
                                />
                              ))}
                            </RadioGroup>
                          )}

                          {item.type === "checkbox" && (
                            <div className="">
                              {item.options?.map((option) => (
                                <FormControlLabel
                                  key={option}
                                  control={
                                    <Checkbox
                                      checked={
                                        Array.isArray(formData.checklist[item.id]?.value) &&
                                        formData.checklist[item.id].value.includes(option)
                                      }
                                      onChange={(e) => {
                                        const currentValues = Array.isArray(formData.checklist[item.id]?.value)
                                          ? formData.checklist[item.id].value
                                          : [];
                                        const newValues = e.target.checked
                                          ? [...currentValues, option]
                                          : currentValues.filter((v: string) => v !== option);
                                        handleChecklistChange(item.id, "value", newValues);
                                      }}
                                      sx={{
                                        color: "#C72030",
                                        "&.Mui-checked": { color: "#C72030" },
                                      }}
                                    />
                                  }
                                  label={option}
                                  className="block mb-1"
                                />
                              ))}
                            </div>
                          )}

                          <div className="">
                            <TextField
                              placeholder="Add your comment..."
                              fullWidth
                              multiline
                              minRows={3}
                              variant="outlined"
                              value={formData.checklist[item.id]?.comment || ""}
                              onChange={(e) =>
                                handleChecklistChange(
                                  item.id,
                                  "comment",
                                  e.target.value
                                )
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "white",
                                  "& fieldset": {
                                    borderColor: "#D1D5DB",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9CA3AF",
                                  },
                                },
                              }}
                            />
                          </div>

                          {formData.checklist[item.id]?.attachment && (
                            <div className="">
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                                <img
                                  src={URL.createObjectURL(
                                    formData.checklist[item.id].attachment
                                  )}
                                  alt="Attachment"
                                  className="w-16 h-16 object-cover rounded border"
                                />
                                <Typography
                                  variant="body2"
                                  className="flex-1 text-gray-700"
                                >
                                  {formData.checklist[item.id].attachment.name}
                                </Typography>
                              </div>
                            </div>
                          )}

                          <div className="">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#C72030] border-[#C72030] hover:bg-red-50"
                              onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "image/*";
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement)
                                    .files?.[0];
                                  if (file) {
                                    handleChecklistChange(
                                      item.id,
                                      "attachment",
                                      file
                                    );
                                  }
                                };
                                input.click();
                              }}
                            >
                              Add Attachment
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );

        case 3: // After Photo
          return (
            <div className="space-y-6">
              {/* Step 1 - Pre-Post Inspection Info (Disabled/Completed) */}
              {formData.beforePhoto && (
                <Card className="border border-gray-200 shadow-sm">
                  <div className="figma-card-header">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="figma-card-icon-wrapper">
                          <User className="figma-card-icon" />
                        </div>
                        <Typography
                          variant="body1"
                          className="figma-card-title"
                        >
                          Pre-Post Inspection Info
                        </Typography>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-4 py-2 rounded-md"
                        onClick={() => handleEditStep(1)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <CardContent className="figma-card-content">
                    <div className="space-y-4">
                      <Typography
                        variant="body2"
                        className="font-medium text-gray-900 mb-3"
                      >
                        Before
                      </Typography>
                      <div className="flex items-start gap-4">
                        <img
                          src={URL.createObjectURL(formData.beforePhoto)}
                          alt="Before"
                          className="w-20 h-20 object-cover rounded border border-gray-200"
                        />
                        <div className="flex-1">
                          <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled
                          >
                            <InputLabel>Name</InputLabel>
                            <MuiSelect
                              value={getAssignedUserName()}
                              label="Name"
                              disabled
                            >
                              <MenuItem value={getAssignedUserName()}>
                                {getAssignedUserName()}
                              </MenuItem>
                            </MuiSelect>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2 - Checklist (Disabled/Completed) */}
              <Card className="border border-gray-200 shadow-sm">
                <div className="figma-card-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="figma-card-icon-wrapper">
                        <FileText className="figma-card-icon" />
                      </div>
                      <Typography variant="body1" className="figma-card-title">
                        {taskDetails?.task_details?.task_name || "Task"}{" "}
                        Checklists
                      </Typography>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-4 py-2 rounded-md"
                      onClick={() => handleEditStep(2)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                <CardContent className="figma-card-content">
                  {dynamicChecklist.length === 0 ? (
                    <div className="text-center py-8">
                      <Typography variant="body1" className="text-gray-600">
                        No checklist items available for this task.
                      </Typography>
                    </div>
                  ) : groupedChecklist.length > 0 ? (
                    <div className="space-y-6">
                      {groupedChecklist.map((section, sectionIndex) => (
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

                          {/* Section Questions (Disabled) */}
                          <div className="space-y-6">
                            {section.questions.map((item: any, index: number) => (
                              <div key={item.id} className="space-y-3">
                                <Typography
                                  variant="body2"
                                  className="font-medium text-gray-900"
                                >
                                  {index + 1}. {item.question}
                                </Typography>

                                {item.type === "text" && (
                                  <TextField
                                    placeholder="Enter your value..."
                                    fullWidth
                                    variant="outlined"
                                    value={formData.checklist[item.id]?.value || ""}
                                    disabled
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#f9fafb",
                                        "& fieldset": {
                                          borderColor: "#D1D5DB",
                                        },
                                      },
                                    }}
                                  />
                                )}

                                {item.type === "radio" && (
                                  <RadioGroup
                                    value={formData.checklist[item.id]?.value || ""}
                                    className=""
                                  >
                                    {item.options?.map((option) => (
                                      <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={
                                          <Radio
                                            sx={{
                                              color: "#C72030",
                                              "&.Mui-checked": { color: "#C72030" },
                                            }}
                                            disabled
                                          />
                                        }
                                        label={option}
                                        className="mb-1"
                                        disabled
                                      />
                                    ))}
                                  </RadioGroup>
                                )}

                                {item.type === "checkbox" && (
                                  <div className="">
                                    {item.options?.map((option) => (
                                      <FormControlLabel
                                        key={option}
                                        control={
                                          <Checkbox
                                            checked={
                                              Array.isArray(formData.checklist[item.id]?.value) &&
                                              formData.checklist[item.id].value.includes(option)
                                            }
                                            disabled
                                            sx={{
                                              color: "#C72030",
                                              "&.Mui-checked": { color: "#C72030" },
                                            }}
                                          />
                                        }
                                        label={option}
                                        className="block mb-1"
                                        disabled
                                      />
                                    ))}
                                  </div>
                                )}

                                <div className="">
                                  <TextField
                                    placeholder="Add your comment..."
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    variant="outlined"
                                    value={formData.checklist[item.id]?.comment || ""}
                                    disabled
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#f9fafb",
                                        "& fieldset": {
                                          borderColor: "#D1D5DB",
                                        },
                                      },
                                    }}
                                  />
                                </div>

                                {formData.checklist[item.id]?.attachment && (
                                  <div className="">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                                      <img
                                        src={URL.createObjectURL(
                                          formData.checklist[item.id].attachment
                                        )}
                                        alt="Attachment"
                                        className="w-16 h-16 object-cover rounded border"
                                      />
                                      <Typography
                                        variant="body2"
                                        className="flex-1 text-gray-700"
                                      >
                                        {formData.checklist[item.id].attachment.name}
                                      </Typography>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {dynamicChecklist.map((item, index) => (
                        <div key={item.id} className="space-y-3">
                          <Typography
                            variant="body2"
                            className="font-medium text-gray-900"
                          >
                            {index + 1}. {item.question}
                          </Typography>

                          {item.type === "text" && (
                            <TextField
                              placeholder="Enter your value..."
                              fullWidth
                              variant="outlined"
                              value={formData.checklist[item.id]?.value || ""}
                              disabled
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#f9fafb",
                                  "& fieldset": {
                                    borderColor: "#D1D5DB",
                                  },
                                },
                              }}
                            />
                          )}

                          {item.type === "radio" && (
                            <RadioGroup
                              value={formData.checklist[item.id]?.value || ""}
                              className=""
                            >
                              {item.options?.map((option) => (
                                <FormControlLabel
                                  key={option}
                                  value={option}
                                  control={
                                    <Radio
                                      sx={{
                                        color: "#C72030",
                                        "&.Mui-checked": { color: "#C72030" },
                                      }}
                                      disabled
                                    />
                                  }
                                  label={option}
                                  className="mb-1"
                                  disabled
                                />
                              ))}
                            </RadioGroup>
                          )}

                          {item.type === "checkbox" && (
                            <div className="">
                              {item.options?.map((option) => (
                                <FormControlLabel
                                  key={option}
                                  control={
                                    <Checkbox
                                      checked={
                                        Array.isArray(formData.checklist[item.id]?.value) &&
                                        formData.checklist[item.id].value.includes(option)
                                      }
                                      disabled
                                      sx={{
                                        color: "#C72030",
                                        "&.Mui-checked": { color: "#C72030" },
                                      }}
                                    />
                                  }
                                  label={option}
                                  className="block mb-1"
                                  disabled
                                />
                              ))}
                            </div>
                          )}

                          <div className="">
                            <TextField
                              placeholder="Add your comment..."
                              fullWidth
                              multiline
                              minRows={2}
                              variant="outlined"
                              value={formData.checklist[item.id]?.comment || ""}
                              disabled
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#f9fafb",
                                  "& fieldset": {
                                    borderColor: "#D1D5DB",
                                  },
                                },
                              }}
                            />
                          </div>

                          {formData.checklist[item.id]?.attachment && (
                            <div className="">
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                                <img
                                  src={URL.createObjectURL(
                                    formData.checklist[item.id].attachment
                                  )}
                                  alt="Attachment"
                                  className="w-16 h-16 object-cover rounded border"
                                />
                                <Typography
                                  variant="body2"
                                  className="flex-1 text-gray-700"
                                >
                                  {formData.checklist[item.id].attachment.name}
                                </Typography>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 3 - After Photo Upload Card (Active) */}
              <Card className="border border-gray-200 shadow-sm">
                <div className="figma-card-header">
                  <div className="flex items-center gap-3">
                    <div className="figma-card-icon-wrapper">
                      <Camera className="figma-card-icon" />
                    </div>
                    <Typography variant="body1" className="figma-card-title">
                      After Work Photo
                    </Typography>
                  </div>
                </div>

                <CardContent className="figma-card-content">
                  <div className="space-y-6">
                    <div>
                      <Typography
                        variant="body2"
                        className="font-medium text-gray-900 mb-4"
                      >
                        Attach After Photograph
                      </Typography>

                      {formData.afterPhoto ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <Typography
                              variant="body2"
                              className="font-medium text-gray-900 mb-3"
                            >
                              After
                            </Typography>
                            <div className="flex items-start gap-4">
                              <img
                                src={URL.createObjectURL(formData.afterPhoto)}
                                alt="After"
                                className="w-24 h-24 object-cover rounded border border-gray-200"
                              />
                              <div className="flex-1">
                                <FormControl
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                >
                                  <InputLabel>Name</InputLabel>
                                  <MuiSelect
                                    value={getAssignedUserName()}
                                    label="Name"
                                    disabled={true}
                                  >
                                    <MenuItem value={getAssignedUserName()}>
                                      {getAssignedUserName()}
                                    </MenuItem>
                                  </MuiSelect>
                                </FormControl>
                              </div>
                            </div>
                          </div>

                          {/* Change Photo Button */}
                          <div className="flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#C72030] border-[#C72030] hover:bg-red-50"
                              onClick={() => afterPhotoRef.current?.click()}
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              {getPhotoActionText(true)}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-[#C72030] rounded-lg p-12 text-center cursor-pointer hover:border-[#B11E2A] hover:bg-red-50 transition-colors"
                          onClick={() => afterPhotoRef.current?.click()}
                        >
                          {React.createElement(getPhotoActionIcon(false), {
                            className: "w-8 h-8 text-[#C72030] mx-auto mb-3",
                          })}
                          <Typography
                            variant="body2"
                            className="text-[#C72030] font-medium"
                          >
                            {getPhotoActionText(false)}
                          </Typography>
                        </div>
                      )}

                      <input
                        ref={afterPhotoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            "after",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );

        case 4: // Preview
          return (
            <div className="space-y-6">
          

              {/* Photo Preview */}
              <Card className="border border-gray-200 shadow-sm">
                <div className="figma-card-header">
                  <div className="flex items-center gap-3">
                    <div className="figma-card-icon-wrapper">
                      <Camera className="figma-card-icon" />
                    </div>
                    <Typography variant="body1" className="figma-card-title">
                      Before & After Photos
                    </Typography>
                  </div>
                </div>

                <CardContent className="figma-card-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Before Photo */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="h6"
                          className="font-bold text-gray-900"
                        >
                          Before
                        </Typography>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-4 py-2 rounded-md"
                          onClick={() => handleEditStep(1)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      {formData.beforePhoto && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <img
                            src={URL.createObjectURL(formData.beforePhoto)}
                            alt="Before"
                            className="w-full h-64 object-cover rounded border border-gray-200 mb-4"
                          />
                          <div className="text-center">
                            <Typography
                              variant="body2"
                              className="font-medium text-gray-900 mb-2"
                            >
                              Captured by:{" "}
                              {formData.beforePhotoName ||
                                getAssignedUserName()}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-600"
                            >
                              {new Date().toLocaleString()}
                            </Typography>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* After Photo */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="h6"
                          className="font-bold text-gray-900"
                        >
                          After
                        </Typography>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-4 py-2 rounded-md"
                          onClick={() => handleEditStep(3)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      {formData.afterPhoto && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <img
                            src={URL.createObjectURL(formData.afterPhoto)}
                            alt="After"
                            className="w-full h-64 object-cover rounded border border-gray-200 mb-4"
                          />
                          <div className="text-center">
                            <Typography
                              variant="body2"
                              className="font-medium text-gray-900 mb-2"
                            >
                              Captured by:{" "}
                              {formData.afterPhotoName ||
                                formData.beforePhotoName ||
                                getAssignedUserName()}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-600"
                            >
                              {new Date().toLocaleString()}
                            </Typography>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Checklist Summary */}
              <Card className="border border-gray-200 shadow-sm">
                <div className="figma-card-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="figma-card-icon-wrapper">
                        <FileText className="figma-card-icon" />
                      </div>
                      <Typography variant="body1" className="figma-card-title">
                        Checklist Summary
                      </Typography>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-4 py-2 rounded-md"
                      onClick={() => handleEditStep(2)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                <CardContent className="figma-card-content">
                  {dynamicChecklist.length === 0 ? (
                    <div className="text-center py-8">
                      <Typography variant="body1" className="text-gray-600">
                        No checklist items available for this task.
                      </Typography>
                    </div>
                  ) : groupedChecklist.length > 0 ? (
                    <div className="space-y-6">
                      {groupedChecklist.map((section, sectionIndex) => (
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
                          <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Help Text
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Activities
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Input
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Comments
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    Attachment
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {section.questions.map((item: any) => {
                                  const answer = formData.checklist[item.id]?.value;
                                  const comment = formData.checklist[item.id]?.comment;
                                  const attachment = formData.checklist[item.id]?.attachment;

                                  return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                        <span className="text-xs"></span>
                                      </td>
                                      <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                        <span className="text-xs">{item.question}</span>
                                      </td>
                                      <td className="px-4 py-3 text-xs border-b border-gray-100">
                                        <span className="text-xs">
                                          {Array.isArray(answer) 
                                            ? answer.length > 0 
                                              ? answer.join(", ") 
                                              : "-"
                                            : answer || "-"}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                        <span className="text-xs">{comment || "-"}</span>
                                      </td>
                                      <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                        {attachment ? (
                                          <div className="flex items-center gap-2">
                                            <img
                                              src={URL.createObjectURL(attachment)}
                                              alt="Attachment"
                                              className="w-8 h-8 object-cover rounded border border-gray-200"
                                            />
                                            <span className="text-xs text-gray-600 truncate max-w-20">
                                              {attachment.name}
                                            </span>
                                          </div>
                                        ) : (
                                          <span className="text-xs">-</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Help Text
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Activities
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Input
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Comments
                            </th>
                           
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Attachment
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {dynamicChecklist.map((item, index) => {
                            const answer = formData.checklist[item.id]?.value;
                            const comment = formData.checklist[item.id]?.comment;
                            const attachment = formData.checklist[item.id]?.attachment;
                            
                            // Calculate score based on answer (similar to TaskDetailsPage logic)
                            const calculateScore = () => {
                              if (answer === "Yes") return "100";
                              if (answer === "No") return "0";
                              if (Array.isArray(answer) && answer.length > 0) return "75";
                              return "-";
                            };

                            return (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                  <span className="text-xs"></span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                  <span className="text-xs">{item.question}</span>
                                </td>
                                <td className="px-4 py-3 text-xs border-b border-gray-100">
                                  <span className="text-xs">
                                    {Array.isArray(answer) 
                                      ? answer.length > 0 
                                        ? answer.join(", ") 
                                        : "-"
                                      : answer || "-"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                  <span className="text-xs">{comment || "-"}</span>
                                </td>
                               
                                <td className="px-4 py-3 text-xs text-gray-900 border-b border-gray-100">
                                  {attachment ? (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={URL.createObjectURL(attachment)}
                                        alt="Attachment"
                                        className="w-8 h-8 object-cover rounded border border-gray-200"
                                      />
                                      <span className="text-xs text-gray-600 truncate max-w-20">
                                        {attachment.name}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xs">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );

        default:
          return null;
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate(`/maintenance/task/details/${id}`)}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Task Details
        </button>
      </div>

      {/* Step Progress Indicator */}
      <div className="mb-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Continuous Dotted Line Background */}
          <div
            className="absolute top-8 left-0 right-0 h-0.5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, #9CA3AF 0, #9CA3AF 6px, transparent 6px, transparent 12px)",
              height: "2px",
            }}
          ></div>

          {/* Steps Container */}
          <div className="relative flex justify-between items-start">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= Math.max(...completedSteps, currentStep)
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-100"
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                {/* Step Header Bar */}

                <div
                  className={`
                  py-2 px-3 rounded text-white font-semibold bg-white
                `}
                >
                  <div
                    className={`
                    px-6 py-3 rounded text-white font-semibold text-xs relative z-5 transition-colors whitespace-nowrap
                    ${step.active ? "bg-[#C72030]" : "bg-gray-400"}
                  `}
                  >
                    {step.id}. {step.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Text */}
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-left justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 uppercase">
              {getTaskName()}
            </h1>
          </div>
        </div>
      </div>

      {/* Step Content */}
             {renderStepContent()}


      <div className="text-center mt-6 mb-4">
        <Typography variant="body2" className="text-gray-600">
          You've completed {completedSteps.length} out of{" "}
          {steps.length} steps. 
          {dynamicChecklist.length > 0 && (
            <span className="ml-2">
              ({Math.round((Object.keys(formData.checklist).filter(key => {
                const item = formData.checklist[key];
                return item.value && (Array.isArray(item.value) ? item.value.length > 0 : item.value !== "");
              }).length / dynamicChecklist.length) * 100)}% checklist completed)
            </span>
          )}
        </Typography>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
        <div className="flex justify-center gap-3 items-center">
          {/* <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-6 py-2"
              >
                Back
              </Button>
            )}
          </div> */}

          {/* Middle Section - Save to Draft */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSaveToDraft}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2"
            >
              Save to draft
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                className="bg-[#C72030] text-white hover:bg-[#B11E2A] px-6 py-2"
              >
                Proceed to Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-[#C72030] text-white hover:bg-[#B11E2A] px-6 py-2"
              >
                Submit Task
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <TaskSubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        onViewDetails={handleSuccessClose}
        stats={submissionStats}
      />
       </div>
  );
};
