import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, ArrowLeft, CheckCircle, Upload, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import {
  ticketManagementAPI,
  CategoryResponse,
  SubCategoryResponse,
} from "@/services/ticketManagementAPI";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
} from "@mui/material";

// --- Interface Definitions ---
interface AnswerOption {
  id?: number;
  text: string;
  type: "P" | "N";
}

interface Question {
  id?: string;
  text: string;
  answerType: string;
  mandatory: boolean;
  answerOptions?: AnswerOption[];
  rating?: number;
  selectedEmoji?: string;
  additionalFieldOnNegative?: boolean;
  additionalFields?: Array<{
    id?: number;
    title: string;
    files: File[];
    existingFiles?: Array<{
      id: number;
      file_name: string;
      url: string;
    }>;
  }>;
  // Add flag to track if question should be deleted
  markedForDeletion?: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface SurveyImage {
  id?: number;
  file_name?: string;
  content_type?: string;
  file_size?: number;
  updated_at?: string;
  url?: string;
}



// --- Field Styles for Material-UI Components ---
const fieldStyles = {
  height: "48px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    height: "48px",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#C72030",
    },
  },
};

const textareaStyles = {
  ...fieldStyles,
  height: "auto",
  "& .MuiOutlinedInput-root": {
    height: "auto",
    minHeight: "80px",
    padding: "16.5px 14px",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
};

export const EditSurveyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast: hookToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [checkType, setCheckType] = useState("");
  const [createTicket, setCreateTicket] = useState(false);
  const [ticketCategory, setTicketCategory] = useState(""); // Store category name for display
  const [ticketCategoryId, setTicketCategoryId] = useState(""); // Store category ID for backend
  const [ticketSubCategory, setTicketSubCategory] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [ticketCategories, setTicketCategories] = useState<CategoryResponse[]>(
    []
  );
  const [ticketSubCategories, setTicketSubCategories] = useState<SubCategoryResponse[]>([]);
  const [fmUsers, setFmUsers] = useState<
    { id: number; firstname: string; lastname: string; email?: string }[]
  >([]);
  const [loadingTicketCategories, setLoadingTicketCategories] = useState(false);
  const [loadingTicketSubCategories, setLoadingTicketSubCategories] = useState(false);
  const [loadingFmUsers, setLoadingFmUsers] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "", answerType: "", mandatory: false },
  ]);
  const [surveyImage, setSurveyImage] = useState<File | null>(null);
  const [existingSurveyImage, setExistingSurveyImage] = useState<SurveyImage | null>(null);
  const [destroyQuestionIds, setDestroyQuestionIds] = useState<string[]>([]);
  const [destroyTagIds, setDestroyTagIds] = useState<number[]>([]);
  const [destroyOptionIds, setDestroyOptionIds] = useState<number[]>([]);
  const [destroyIconIds, setDestroyIconIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Destroy IDs tracking for smart deletion

  // Emoji and rating constants
  const EMOJIS = ["😁", "😊", "😐", "😟", "😞"];
  const RATING_STARS = ["1-star", "2-star", "3-star", "4-star", "5-star"];

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchSurveyData();
    }
  }, [id]);

  // Load ticket categories when createTicket is enabled
  const loadTicketCategories = useCallback(async () => {
    if (!createTicket) return;

    setLoadingTicketCategories(true);
    try {
      const response = await ticketManagementAPI.getCategories();
      setTicketCategories(response.helpdesk_categories || []);
      console.log("Ticket categories loaded:", response.helpdesk_categories);
    } catch (error) {
      console.error("Error loading ticket categories:", error);
    } finally {
      setLoadingTicketCategories(false);
    }
  }, [createTicket]);

  // Load subcategories when category changes
  const loadTicketSubCategories = useCallback(async (categoryId: number) => {
    setLoadingTicketSubCategories(true);
    try {
      const subcats = await ticketManagementAPI.getSubCategoriesByCategory(categoryId);
      setTicketSubCategories(subcats);
      console.log("Ticket subcategories loaded:", subcats);
      return subcats; // Return the loaded subcategories
    } catch (error) {
      console.error("Error loading ticket subcategories:", error);
      return []; // Return empty array on error
    } finally {
      setLoadingTicketSubCategories(false);
    }
  }, []);

  // Load FM users for assign to dropdown
  const loadFMUsers = useCallback(async () => {
    if (!createTicket) return;

    setLoadingFmUsers(true);
    try {
      const response = await ticketManagementAPI.getEngineers();
      setFmUsers(response.users || response.fm_users || []);
      console.log("FM users loaded:", response.users || response.fm_users);
    } catch (error) {
      console.error("Error loading FM users:", error);
    } finally {
      setLoadingFmUsers(false);
    }
  }, [createTicket]);

  // Handle category change and load subcategories
  const handleTicketCategoryChange = (categoryId: string) => {
    setTicketCategoryId(categoryId);
    setTicketSubCategory(""); // Reset subcategory when category changes
    setTicketSubCategories([]); // Clear subcategories
    if (categoryId) {
      loadTicketSubCategories(parseInt(categoryId));
    }
  };

  // Load ticket data when createTicket checkbox is checked
  useEffect(() => {
    if (createTicket) {
      loadTicketCategories();
      loadFMUsers();
    } else {
      // Reset selections when unchecked
      setTicketCategory("");
      setTicketCategoryId("");
      setTicketSubCategory("");
      setAssignTo("");
      setTicketSubCategories([]);
    }
  }, [createTicket, loadTicketCategories, loadFMUsers]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/snag_audit_categories.json");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      hookToast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const fetchSurveyData = async () => {
    try {
      const response = await apiClient.get(
        `/pms/admin/snag_checklists/${id}.json`
      );
      const surveyData = response.data;

      // Populate form fields with fetched data
      setTitle(surveyData.name);
      // Map check_type properly - handle Question and patrolling types
      const mappedCheckType =
        surveyData.check_type === "survey"
          ? "survey"
          : surveyData.check_type === "patrolling"
          ? "patrolling"
          : surveyData.check_type || "";
      setCheckType(mappedCheckType);

      // Check if ticket creation is enabled based on existing data
      const hasTicketConfig = surveyData.ticket_configs && surveyData.ticket_configs.active;
      setCreateTicket(hasTicketConfig);

      if (hasTicketConfig && surveyData.ticket_configs) {
        const ticketConfig = surveyData.ticket_configs;
        console.log("Processing ticket config:", ticketConfig);
        
        // First, load all ticket categories for the dropdowns
        try {
          const categoriesResponse = await ticketManagementAPI.getCategories();
          const allCategories = categoriesResponse.helpdesk_categories || [];
          setTicketCategories(allCategories);
          console.log("All ticket categories loaded:", allCategories);
        } catch (error) {
          console.error("Error loading ticket categories:", error);
        }

        // Handle category and subcategory setup
        // Handle different naming conventions for subcategory ID
        const subcategoryId = ticketConfig.subcategory_id || ticketConfig.sub_category_id;
        
        if (ticketConfig.category_id && subcategoryId) {
          // Case 1: Both category and subcategory IDs are available
          console.log("Case 1: Both category and subcategory available");
          console.log("Using subcategory_id:", subcategoryId, "from field:", ticketConfig.subcategory_id ? 'subcategory_id' : 'sub_category_id');
          setTicketCategoryId(ticketConfig.category_id.toString());
          setTicketCategory(ticketConfig.category || "");
          
          // Load subcategories for this category
          try {
            const loadedSubcategories = await loadTicketSubCategories(ticketConfig.category_id);
            console.log("Subcategories loaded for category", ticketConfig.category_id, ":", loadedSubcategories);
            
            // Set the subcategory after loading subcategories
            setTimeout(() => {
              setTicketSubCategory(subcategoryId.toString());
              console.log("Set subcategory ID:", subcategoryId);
            }, 100);
          } catch (error) {
            console.error("Error loading subcategories:", error);
          }
          
        } else if (subcategoryId && !ticketConfig.category_id) {
          // Case 2: Only subcategory ID is available, need to find parent category
          console.log("Case 2: Only subcategory ID available, finding parent category");
          console.log("Using subcategory_id for reverse lookup:", subcategoryId);
          try {
            const allSubCategoriesResponse = await ticketManagementAPI.getSubCategories();
            const allSubCategories = allSubCategoriesResponse.sub_categories || allSubCategoriesResponse || [];
            console.log("All subcategories loaded:", allSubCategories);
            
            const matchingSubCategory = allSubCategories.find(
              (subCat: SubCategoryResponse) => subCat.id === subcategoryId
            );
            
            if (matchingSubCategory && matchingSubCategory.helpdesk_category_id) {
              console.log("Found parent category:", matchingSubCategory.helpdesk_category_id);
              setTicketCategoryId(matchingSubCategory.helpdesk_category_id.toString());
              
              // Load subcategories for the parent category
              const loadedSubcats = await loadTicketSubCategories(matchingSubCategory.helpdesk_category_id);
              
              // Set subcategory after loading
              setTimeout(() => {
                setTicketSubCategory(subcategoryId.toString());
                console.log("Set subcategory ID from reverse lookup:", subcategoryId);
                
                const foundSubcat = loadedSubcats?.find(s => s.id === subcategoryId);
                console.log("Verified subcategory from reverse lookup:", foundSubcat);
              }, 100);
            }
          } catch (error) {
            console.error("Error loading subcategories to find parent category:", error);
          }
          
        } else if (ticketConfig.category_id && !subcategoryId) {
          // Case 3: Only category ID is available
          console.log("Case 3: Only category ID available");
          setTicketCategoryId(ticketConfig.category_id.toString());
          setTicketCategory(ticketConfig.category || "");
          
          // Load subcategories for this category
          try {
            await loadTicketSubCategories(ticketConfig.category_id);
          } catch (error) {
            console.error("Error loading subcategories:", error);
          }
        }
        
        // Set assigned user if available (handle both naming conventions)
        const assignedToId = ticketConfig.assigned_to_id || ticketConfig.assignedtoid;
        if (assignedToId) {
          setAssignTo(assignedToId.toString());
          console.log("Set assigned user ID:", assignedToId);
        }
      }

      // Map snag_questions to component questions format
      const mappedQuestions =
        surveyData.snag_questions?.map((q: any) => {
          // Map generic_tags to additional fields
          const additionalFields = q.generic_tags?.map((tag: any) => ({
            id: tag.id,
            title: tag.category_name,
            files: [], // New files to be uploaded
            existingFiles: tag.icons?.map((icon: any) => ({
              id: icon.id,
              file_name: icon.file_name,
              url: icon.url
            })) || []
          })) || [];

          return {
            id: q.id.toString(),
            text: q.descr,
            answerType:
              q.qtype === "multiple"
                ? "multiple-choice"
                : q.qtype === "input"
                ? "input-box"
                : q.qtype === "rating"
                ? "rating"
                : q.qtype === "emoji"
                ? "emojis"
                : q.qtype === "text"
                ? "input-box"
                : q.qtype === "description"
                ? "description"
                : "description",
            mandatory: q.quest_mandatory,
            answerOptions:
              q.snag_quest_options?.map((option: any) => ({
                id: option.id,
                text: option.qname,
                type: option.option_type === "p" ? "P" : "N",
              })) || [],
            rating: q.qtype === "rating" ? q.rating || 5 : undefined,
            selectedEmoji:
              q.qtype === "emoji" ? q.selected_emoji || "😊" : undefined,
            additionalFieldOnNegative: additionalFields.length > 0,
            additionalFields: additionalFields.length > 0 ? additionalFields : undefined,
          };
        }) || [];

      setQuestions(
        mappedQuestions.length > 0
          ? mappedQuestions
          : [{ id: "1", text: "", answerType: "", mandatory: false }]
      );

      // Set existing survey image if available in survey_attachment format
      if (surveyData.survey_attachment) {
        setExistingSurveyImage({
          id: surveyData.survey_attachment.id,
          file_name: surveyData.survey_attachment.file_name,
          content_type: surveyData.survey_attachment.content_type,
          file_size: surveyData.survey_attachment.file_size,
          updated_at: surveyData.survey_attachment.updated_at,
          url: surveyData.survey_attachment.url
        });
      }

      setInitialLoading(false);
    } catch (error) {
      console.error("Error fetching Question data:", error);
      hookToast({
        title: "Error",
        description: "Failed to fetch Question data",
        variant: "destructive",
      });
      setInitialLoading(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `new_${Date.now()}`, // Use a clear prefix for new questions
      text: "",
      answerType: "",
      mandatory: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    console.log("Removing question with ID:", id);
    const activeQuestions = questions.filter(q => {
      const isMarkedForDeletion = q.markedForDeletion === true;
      const hasValidId = q.id && q.id.trim() !== "";
      const hasValidText = q.text && q.text.trim() !== "";
      const hasValidAnswerType = q.answerType && q.answerType.trim() !== "";
      const isNotNullData = q.text !== null && q.answerType !== null;
      return !isMarkedForDeletion && hasValidId && isNotNullData && (hasValidText || hasValidAnswerType || q.id.startsWith("new_"));
    });
    console.log("Active questions before removal:", activeQuestions.length);
    
    // Only allow removal if there will be at least one active question remaining
    if (activeQuestions.length > 1) {
      setQuestions(prevQuestions => {
        console.log("Previous questions:", prevQuestions);
        const updatedQuestions = prevQuestions.map((q) => {
          if (q.id === id) {
            console.log("Marking question for deletion:", q);
            
            // Track destroy IDs for existing questions (not new ones)
            if (q.id && !q.id.startsWith("new_") && q.id !== "1") {
              setDestroyQuestionIds(prev => [...prev, q.id!]);
              
              // Collect option IDs for destruction
              if (q.answerOptions) {
                const optionIds = q.answerOptions
                  .filter(option => option.id)
                  .map(option => option.id!);
                setDestroyOptionIds(prev => [...prev, ...optionIds]);
              }
              
              // Collect additional field (tag) IDs for destruction
              if (q.additionalFields) {
                const tagIds = q.additionalFields
                  .filter(field => field.id)
                  .map(field => field.id!);
                setDestroyTagIds(prev => [...prev, ...tagIds]);
                
                // Collect icon IDs from existing files
                const iconIds = q.additionalFields
                  .flatMap(field => field.existingFiles || [])
                  .map(file => file.id);
                setDestroyIconIds(prev => [...prev, ...iconIds]);
              }
            }
            
            // Mark question for deletion
            return {
              ...q,
              markedForDeletion: true
            };
          }
          return q;
        });
        
        console.log("Updated questions after marking:", updatedQuestions);
        
        // Check if all questions are now marked for deletion or have null content
        const remainingActiveQuestions = updatedQuestions.filter(q => {
          const isMarkedForDeletion = q.markedForDeletion === true;
          const hasValidId = q.id && q.id.trim() !== "";
          const hasValidText = q.text && q.text.trim() !== "";
          const hasValidAnswerType = q.answerType && q.answerType.trim() !== "";
          const isNotNullData = q.text !== null && q.answerType !== null;
          return !isMarkedForDeletion && hasValidId && isNotNullData && (hasValidText || hasValidAnswerType || q.id.startsWith("new_"));
        });
        console.log("Remaining active questions:", remainingActiveQuestions.length);
        
        // If no active questions remain, add a new blank question
        if (remainingActiveQuestions.length === 0) {
          console.log("No active questions remain, adding new blank question");
          updatedQuestions.push({
            id: `new_${Date.now()}`,
            text: "",
            answerType: "",
            mandatory: false,
          });
        }
        
        return updatedQuestions;
      });
    } else {
      console.log("Cannot remove - would leave no active questions");
    }
  };

  const handleQuestionChange = (
    id: string,
    field: keyof Question,
    value: string | boolean | number | AnswerOption[] | Array<{title: string; files: File[]}>
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          const updatedQuestion = { ...q, [field]: value };
          if (
            field === "answerType" &&
            ["multiple-choice", "rating", "emojis"].includes(value as string) &&
            !updatedQuestion.answerOptions
          ) {
            updatedQuestion.answerOptions = [
              { text: "", type: "P" },
              { text: "", type: "P" },
            ];
          } else if (
            field === "answerType" &&
            !["multiple-choice", "rating", "emojis"].includes(value as string)
          ) {
            updatedQuestion.answerOptions = undefined;
          }
          if (
            field === "additionalFieldOnNegative" &&
            value === true &&
            !updatedQuestion.additionalFields
          ) {
            updatedQuestion.additionalFields = [{ title: "", files: [] }];
          }
          
          // Handle smart deletion when additionalFieldOnNegative is unchecked
          if (
            field === "additionalFieldOnNegative" &&
            value === false &&
            updatedQuestion.additionalFields
          ) {
            // Mark existing additional fields (tags) for deletion
            updatedQuestion.additionalFields.forEach((additionalField) => {
              if (additionalField.id) {
                setDestroyTagIds(prev => [...prev, additionalField.id!]);
              }
              
              // Mark existing files (icons) for deletion
              if (additionalField.existingFiles) {
                additionalField.existingFiles.forEach((file) => {
                  setDestroyIconIds(prev => [...prev, file.id]);
                });
              }
            });
            
            // Clear the additional fields
            updatedQuestion.additionalFields = undefined;
          }
          
          return updatedQuestion;
        }
        return q;
      })
    );
  };

  const handleAddAnswerOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const currentOptionsCount = question.answerOptions?.length || 0;
    if (currentOptionsCount >= 5) return; // Limit to 5 options

    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answerOptions: [
                ...(q.answerOptions || []),
                { text: "", type: "P" },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveAnswerOption = (
    questionId: string,
    optionIndex: number
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.answerOptions) {
          const optionToRemove = q.answerOptions[optionIndex];
          
          // Track destroy ID for existing options
          if (optionToRemove?.id) {
            setDestroyOptionIds(prev => [...prev, optionToRemove.id!]);
          }
          
          return {
            ...q,
            answerOptions: q.answerOptions.filter(
              (_, index) => index !== optionIndex
            ),
          };
        }
        return q;
      })
    );
  };

  const handleAnswerOptionChange = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answerOptions: q.answerOptions?.map((option, index) =>
                index === optionIndex ? { ...option, text: value } : option
              ),
            }
          : q
      )
    );
  };

  const handleAnswerOptionTypeChange = (
    questionId: string,
    optionIndex: number,
    value: "P" | "N"
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answerOptions: q.answerOptions?.map((option, index) =>
                index === optionIndex ? { ...option, type: value } : option
              ),
            }
          : q
      )
    );
  };

  // Additional field handlers
  const handleAddAdditionalField = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: [
                ...(q.additionalFields || []),
                { title: "", files: [], existingFiles: [] },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveAdditionalField = (
    questionId: string,
    fieldIndex: number
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.additionalFields) {
          const fieldToRemove = q.additionalFields[fieldIndex];
          
          // Track destroy ID for existing additional fields (tags)
          if (fieldToRemove?.id) {
            setDestroyTagIds(prev => [...prev, fieldToRemove.id!]);
          }
          
          // Track destroy IDs for existing files (icons)
          if (fieldToRemove?.existingFiles) {
            const iconIds = fieldToRemove.existingFiles.map(file => file.id);
            setDestroyIconIds(prev => [...prev, ...iconIds]);
          }
          
          return {
            ...q,
            additionalFields: q.additionalFields.filter(
              (_, index) => index !== fieldIndex
            ),
          };
        }
        return q;
      })
    );
  };

  const handleAdditionalFieldTitleChange = (
    questionId: string,
    fieldIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: q.additionalFields?.map((field, index) =>
                index === fieldIndex ? { ...field, title: value } : field
              ),
            }
          : q
      )
    );
  };

  const handleAdditionalFieldFilesChange = (
    questionId: string,
    fieldIndex: number,
    files: File[]
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: q.additionalFields?.map((field, index) =>
                index === fieldIndex ? { ...field, files } : field
              ),
            }
          : q
      )
    );
  };

  const removeAdditionalFieldFile = (
    questionId: string,
    fieldIndex: number,
    fileIndex: number
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: q.additionalFields?.map((field, index) =>
                index === fieldIndex
                  ? {
                      ...field,
                      files: field.files.filter((_, i) => i !== fileIndex),
                    }
                  : field
              ),
            }
          : q
      )
    );
  };

  const removeExistingFile = (
    questionId: string,
    fieldIndex: number,
    fileId: number
  ) => {
    // Track destroy ID for existing files (icons)
    setDestroyIconIds(prev => [...prev, fileId]);
    
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: q.additionalFields?.map((field, index) =>
                index === fieldIndex
                  ? {
                      ...field,
                      existingFiles: field.existingFiles?.filter((file) => file.id !== fileId),
                    }
                  : field
              ),
            }
          : q
      )
    );
  };

  const handleUpdateQuestion = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Validation Error", {
        description: "Please enter a title for the Question",
        duration: 3000,
      });
      return;
    }
    if (!checkType) {
      toast.error("Validation Error", {
        description: "Please select a check type",
        duration: 3000,
      });
      return;
    }

    // Validate ticket fields if create ticket is checked
    if (createTicket) {
      if (!ticketCategoryId) {
        toast.error("Validation Error", {
          description: "Please select a ticket category",
          duration: 3000,
        });
        return;
      }
    }

    // Validate questions (exclude deleted ones and null/empty ones)
    const activeQuestions = questions.filter(q => {
      const isMarkedForDeletion = q.markedForDeletion === true;
      const hasValidId = q.id && q.id.trim() !== "";
      const hasValidText = q.text && q.text.trim() !== "";
      const hasValidAnswerType = q.answerType && q.answerType.trim() !== "";
      const isNotNullData = q.text !== null && q.answerType !== null;
      return !isMarkedForDeletion && hasValidId && isNotNullData && (hasValidText || hasValidAnswerType || q.id.startsWith("new_"));
    });
    
    console.log("Validation - Active questions:", activeQuestions);
    
    if (activeQuestions.length === 0) {
      toast.error("Validation Error", {
        description: "Please add at least one question",
        duration: 3000,
      });
      return;
    }
    
    for (let i = 0; i < activeQuestions.length; i++) {
      const question = activeQuestions[i];
      const displayIndex = i + 1; // Use sequential index for display
      if (!question.text.trim()) {
        toast.error("Validation Error", {
          description: `Please enter text for Question ${displayIndex}`,
          duration: 3000,
        });
        return;
      }
      if (!question.answerType) {
        toast.error("Validation Error", {
          description: `Please select an answer type for Question ${displayIndex}`,
          duration: 3000,
        });
        return;
      }
      
      // Check if multiple choice, rating, or emojis have at least one option with text
      if (["multiple-choice", "rating", "emojis"].includes(question.answerType)) {
        if (!question.answerOptions || question.answerOptions.length === 0) {
          toast.error("Validation Error", {
            description: `Please add at least one option for Question ${displayIndex}`,
            duration: 3000,
          });
          return;
        }
        // Check if all options have text
        for (let j = 0; j < question.answerOptions.length; j++) {
          if (!question.answerOptions[j].text.trim()) {
            toast.error("Validation Error", {
              description: `Please enter text for option ${j + 1} in Question ${displayIndex}`,
              duration: 3000,
            });
            return;
          }
        }
      }

      // Validate additional fields
      if (question.additionalFieldOnNegative && question.additionalFields) {
        for (let k = 0; k < question.additionalFields.length; k++) {
          const field = question.additionalFields[k];
          if (!field.title.trim()) {
            toast.error("Validation Error", {
              description: `Please enter title for additional field ${k + 1} in Question ${displayIndex}`,
              duration: 3000,
            });
            return;
          }
          
          // Check if file attachment is required
          const hasNewFiles = field.files && field.files.length > 0;
          const hasExistingFiles = field.existingFiles && field.existingFiles.length > 0;
          
          if (!hasNewFiles && !hasExistingFiles) {
            toast.error("Validation Error", {
              description: `Please upload at least one file for additional field ${k + 1} in Question ${displayIndex}`,
              duration: 3000,
            });
            return;
          }
        }
      }
    }

    try {
      setLoading(true);
      setIsSubmitting(true);

      // Create FormData for multipart/form-data request matching server expectations
      const formData = new FormData();

      // Add basic Question data as individual form fields
      formData.append("snag_checklist[name]", title);
      formData.append("snag_checklist[check_type]", checkType);

      // Add survey image if provided
      if (surveyImage) {
        formData.append("snag_checklist[survey_image]", surveyImage);
      }

      // Add ticket creation fields - send create_tickets flag and related data
      formData.append("create_ticket", createTicket ? "true" : "false");
      
      if (createTicket) {
        formData.append("category_name", ticketCategoryId);
        if (ticketSubCategory) {
          formData.append("sub_category_id", ticketSubCategory);
        }
        // Pass 'subcategory' if both category and subcategory are selected, otherwise pass 'category'
        const categoryType = ticketSubCategory ? 'subcategory' : 'category';
        formData.append("category_type", categoryType);
      }

      // Add destroy IDs for smart deletion
      destroyQuestionIds.forEach(questionId => {
        formData.append("destroy_questions_ids[]", questionId);
      });
      
      destroyTagIds.forEach(tagId => {
        formData.append("destroy_tags_ids[]", tagId.toString());
      });
      
      destroyOptionIds.forEach(optionId => {
        formData.append("destroy_options_ids[]", optionId.toString());
      });
      
      destroyIconIds.forEach(iconId => {
        formData.append("destroy_icons_ids[]", iconId.toString());
      });

      // Process questions with proper FormData structure matching server expectations
      questions.forEach((question, questionIndex) => {
        // Skip questions marked for deletion in the main processing
        // but handle them separately for deletion
        if (question.markedForDeletion) {
          // For questions marked for deletion, we need to send the ID with a destroy flag
          if (question.id && !question.id.startsWith("new_") && question.id !== "1") {
            formData.append(`question[][id]`, question.id);
            formData.append(`question[][_destroy]`, "true");
          }
          return; // Skip the rest of the processing for deleted questions
        }

        // Add question ID only for existing questions (not new ones)
        // New questions have IDs that start with "new_" or are "1" (default)
        const isNewQuestion = !question.id || 
                             question.id === "1" || 
                             question.id.startsWith("new_");
        
        // Only add ID for existing questions that came from the server
        if (!isNewQuestion && question.id) {
          formData.append(`question[][id]`, question.id);
        }

        // Add question basic fields
        formData.append(`question[][descr]`, question.text);

        const qtype =
          question.answerType === "multiple-choice"
            ? "multiple"
            : question.answerType === "input-box"
            ? "text"
            : question.answerType === "rating"
            ? "rating"
            : question.answerType === "emojis"
            ? "emoji"
            : "description";

        formData.append(`question[][qtype]`, qtype);
        formData.append(
          `question[][quest_mandatory]`,
          question.mandatory.toString()
        );
        formData.append(`question[][image_mandatory]`, "false");

        // Add rating
        if (question.answerType === "rating" && question.rating) {
          formData.append(`question[][rating]`, question.rating.toString());
        }

        // Add selected emoji
        if (question.answerType === "emojis" && question.selectedEmoji) {
          formData.append(`question[][selected_emoji]`, question.selectedEmoji);
        }

        // Handle additional fields (generic_tags) with files
        if (question.additionalFieldOnNegative && question.additionalFields) {
          question.additionalFields.forEach((field, fieldIndex) => {
            // Add existing field ID if it exists (for updates)
            if (field.id) {
              formData.append(`question[][generic_tags][][id]`, field.id.toString());
            }
            
            // Add generic tag metadata
            formData.append(`question[][generic_tags][][category_name]`, field.title);
            formData.append(`question[][generic_tags][][category_type]`, 'questions');
            formData.append(`question[][generic_tags][][tag_type]`, 'not generic');
            formData.append(`question[][generic_tags][][active]`, 'true');
            
            // Add new files as icons array
            if (field.files && field.files.length > 0) {
              field.files.forEach((file, fileIndex) => {
                formData.append(`question[][generic_tags][][icons][]`, file);
              });
            }
          });
        }

        // Add multiple choice, rating, and emoji options with proper structure
        if (
          ["multiple-choice", "rating", "emojis"].includes(question.answerType) &&
          question.answerOptions
        ) {
          question.answerOptions.forEach((option, optionIndex) => {
            // Check if this is an existing option (would have an ID from server)
            if (option.id) {
              formData.append(`question[][quest_options][][id]`, option.id.toString());
            }
            formData.append(
              `question[][quest_options][][option_name]`,
              option.text
            );
            formData.append(
              `question[][quest_options][][option_type]`,
              option.type.toLowerCase()
            );
          });
        }
      });

      console.log(
        "Question updated with FormData:",
        Array.from(formData.entries())
      );

      const response = await apiClient.put(
        `/pms/admin/snag_checklists/${id}.json`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Question updated successfully:", response.data);

      // Clear destroy IDs after successful update
      setDestroyQuestionIds([]);
      setDestroyTagIds([]);
      setDestroyOptionIds([]);
      setDestroyIconIds([]);

      // Show success toast
      toast.success("Question Updated Successfully!", {
        description: "Your Question has been updated.",
        icon: <CheckCircle className="w-4 h-4" />,
        duration: 4000,
      });

      navigate("/master/survey/list");
    } catch (error) {
      console.error("Error updating Question:", error);

      // Show detailed error message
      if (error.response) {
        toast.error("Update Failed", {
          description: `Server error: ${error.response.status} - ${
            error.response.data?.message || "Unknown error"
          }`,
          duration: 5000,
        });
      } else if (error.request) {
        toast.error("Network Error", {
          description: "No response from server. Please check your connection.",
          duration: 5000,
        });
      } else {
        toast.error("Error", {
          description:
            "An unexpected error occurred while updating the Question.",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleProceed = async () => {
    await handleUpdateQuestion();
  };

  if (initialLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-96">
          <div>Loading Question Bank data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/master/survey/list")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Question</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <TextField
                  label="Question Title/Name"
                  fullWidth
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { '& .MuiInputLabel-asterisk': { color: '#ef4444' } }
                  }}
                  sx={fieldStyles}
                />
              </div>

              <div className="space-y-2">
                <FormControl fullWidth required sx={{ 
                  ...fieldStyles,
                  "& .MuiInputLabel-asterisk": { color: "#ef4444" }
                }}>
                  <InputLabel id="check-type-label">
                    Select Check Type
                  </InputLabel>
                  <MuiSelect
                    labelId="check-type-label"
                    id="checkType"
                    value={checkType}
                    label="Select Check Type"
                    onChange={(e) => setCheckType(e.target.value)}
                  >
                    <MenuItem value="survey">Survey</MenuItem>
                    <MenuItem value="patrolling">Patrolling</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            {/* Ticket Creation Configuration */}
            <div className="space-y-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={createTicket}
                    onChange={(e) => setCreateTicket(e.target.checked)}
                    color="primary"
                  />
                }
                label="Create Ticket on Question Response"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "16px",
                    fontWeight: 500,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#C72030",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#C72030",
                  },
                }}
              />

              {createTicket && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <FormControl fullWidth required sx={{
                      ...fieldStyles,
                      "& .MuiInputLabel-asterisk": { color: "#ef4444" }
                    }}>
                      <InputLabel id="ticket-category-label">
                        Ticket Category
                      </InputLabel>
                      <MuiSelect
                        labelId="ticket-category-label"
                        id="ticketCategory"
                        value={ticketCategoryId}
                        label="Ticket Category"
                        onChange={(e) => handleTicketCategoryChange(e.target.value)}
                        disabled={loadingTicketCategories}
                      >
                        <MenuItem value="">
                          {loadingTicketCategories
                            ? "Loading categories..."
                            : "Select Ticket Category"}
                        </MenuItem>
                        {ticketCategories.map((category) => (
                          <MenuItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div className="space-y-2">
                    <FormControl fullWidth sx={{
                      ...fieldStyles,
                    }}>
                      <InputLabel id="ticket-subcategory-label">
                        Ticket Sub Category
                      </InputLabel>
                      <MuiSelect
                        labelId="ticket-subcategory-label"
                        id="ticketSubCategory"
                        value={ticketSubCategory}
                        label="Ticket Sub Category"
                        onChange={(e) => setTicketSubCategory(e.target.value)}
                        disabled={loadingTicketSubCategories || !ticketCategoryId}
                      >
                        <MenuItem value="">
                          {loadingTicketSubCategories
                            ? "Loading subcategories..."
                            : !ticketCategoryId
                            ? "Select a category first"
                            : "Select Ticket Sub Category"}
                        </MenuItem>
                        {ticketSubCategories.map((subcat) => (
                          <MenuItem key={subcat.id} value={subcat.id.toString()}>
                            {subcat.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
              )}
                 <div className="space-y-2 mt-3">
                              <label className="text-sm font-medium text-gray-700">
                                Upload Image
                              </label>
                              <div className="flex items-center gap-4 grid grid-cols-3">
                                <div className="flex-1">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      setSurveyImage(file);
                                    }}
                                    className="hidden"
                                    id="survey-image"
                                    disabled={isSubmitting}
                                  />
                                  <label
                                    htmlFor="survey-image"
                                    className={`block w-full px-4 py-2 text-sm text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                      isSubmitting
                                        ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600 hover:text-gray-600"
                                    }`}
                                  >
                                    {surveyImage
                                      ? `Selected: ${surveyImage.name}`
                                      : "Click to upload survey image"}
                                  </label>
                                </div>
                                {surveyImage && (
                                  <Button
                                    onClick={() => setSurveyImage(null)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-red-500 p-2"
                                    disabled={isSubmitting}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              {surveyImage && (
                                <div className="mt-2">
                                  <img
                                    src={URL.createObjectURL(surveyImage)}
                                    alt="Survey preview"
                                    className="max-w-full h-32 object-cover rounded-lg border"
                                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                  />
                                </div>
                              )}
                              {existingSurveyImage && !surveyImage && (
                                <div className="mt-2">
                                  <img
                                    src={existingSurveyImage.url}
                                    alt="Existing survey image"
                                    className="max-w-full h-32 object-cover rounded-lg border"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Current image: {existingSurveyImage.file_name}
                                  </p>
                                </div>
                              )}
                            </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    Add No. of Questions
                  </span>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
                    <span className="text-sm">
                      {(() => {
                        const activeCount = questions.filter(q => {
                          const isMarkedForDeletion = q.markedForDeletion === true;
                          const hasValidId = q.id && q.id.trim() !== "";
                          const hasValidText = q.text && q.text.trim() !== "";
                          const hasValidAnswerType = q.answerType && q.answerType.trim() !== "";
                          const isNotNullData = q.text !== null && q.answerType !== null;
                          return !isMarkedForDeletion && hasValidId && isNotNullData && (hasValidText || hasValidAnswerType || q.id.startsWith("new_"));
                        }).length;
                        return activeCount.toString().padStart(2, "0");
                      })()}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAddQuestion}
                      className="p-1 h-6 w-6"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-sm">No. of Questions</span>
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {questions.filter(q => {
                      const isMarkedForDeletion = q.markedForDeletion === true;
                      const hasValidId = q.id && q.id.trim() !== "";
                      const hasValidText = q.text && q.text.trim() !== "";
                      const hasValidAnswerType = q.answerType && q.answerType.trim() !== "";
                      const isNotNullData = q.text !== null && q.answerType !== null;
                      return !isMarkedForDeletion && hasValidId && isNotNullData && (hasValidText || hasValidAnswerType || q.id.startsWith("new_"));
                    }).length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(() => {
                  // Debug: Log current questions state
                  console.log("All questions:", questions);
                  
                  // Filter out questions marked for deletion and questions with null/empty essential content
                  const activeQuestions = questions.filter(question => {
                    const isMarkedForDeletion = question.markedForDeletion === true;
                    const hasValidId = question.id && question.id.trim() !== "";
                    const hasValidText = question.text && question.text.trim() !== "";
                    const hasValidAnswerType = question.answerType && question.answerType.trim() !== "";
                    const isNotNullData = question.text !== null && question.answerType !== null;
                    
                    console.log(`Question ${question.id}: markedForDeletion=${isMarkedForDeletion}, hasValidId=${hasValidId}, hasValidText=${hasValidText}, hasValidAnswerType=${hasValidAnswerType}, isNotNullData=${isNotNullData}`);
                    
                    return !isMarkedForDeletion && hasValidId && isNotNullData && (hasValidText || hasValidAnswerType || question.id.startsWith("new_"));
                  });
                  
                  console.log("Active questions after filtering:", activeQuestions);
                  return activeQuestions;
                })().map((question, index) => (
                  <Card key={`active-${question.id}-${index}`} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-black">
                          Question {index + 1}
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveQuestion(question.id!)}
                          className="p-1 h-6 w-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Question Text <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          value={question.text}
                          onChange={(e) =>
                            handleQuestionChange(
                              question.id!,
                              "text",
                              e.target.value
                            )
                          }
                          placeholder="Enter your Question"
                          className="min-h-20"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Select Answer Type <span className="text-red-500">*</span></Label>
                        <Select
                          value={question.answerType}
                          onValueChange={(value) =>
                            handleQuestionChange(
                              question.id!,
                              "answerType",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Answer Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="emojis">Emojis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Multiple Choice, Rating, and Emoji Options */}
                      {["multiple-choice", "rating", "emojis"].includes(question.answerType) && (
                        <div className="space-y-3 pt-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {question.answerType === "rating" ? "Rating Options" : 
                             question.answerType === "emojis" ? "Emoji Options" : 
                             "Answer Options"}
                          </Label>
                          {(question.answerOptions || []).map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-3">
                              {question.answerType === "emojis" ? (
                                <div className="flex items-center justify-center w-12 h-12">
                                  <span className="text-3xl">{EMOJIS[optionIndex]}</span>
                                </div>
                              ) : question.answerType === "rating" ? (
                                <div className="flex items-center justify-center w-28 h-12">
                                  <span className="text-base">{RATING_STARS[optionIndex]}</span>
                                </div>
                              ) : (
                                <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                                  {optionIndex + 1}
                                </div>
                              )}
                              <TextField
                                placeholder={
                                  question.answerType === "rating" ? `Enter rating description` :
                                  question.answerType === "emojis" ? `Enter description for ${EMOJIS[optionIndex]}` :
                                  `Option ${optionIndex + 1}`
                                }
                                value={option.text}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleAnswerOptionChange(question.id!, optionIndex, value);
                                }}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  sx: { 
                                    ...fieldStyles, 
                                    height: "40px",
                                    backgroundColor: 'white'
                                  },
                                }}
                              />
                              <Select
                                value={option.type}
                                onValueChange={(value: "P" | "N") =>
                                  handleAnswerOptionTypeChange(
                                    question.id!,
                                    optionIndex,
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="P">P</SelectItem>
                                  <SelectItem value="N">N</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleRemoveAnswerOption(question.id!, optionIndex)
                                }
                                className="p-2 text-gray-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAddAnswerOption(question.id!)}
                            className="p-0 h-auto font-medium text-red-600 hover:text-red-700 flex items-center"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Option
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`mandatory-${question.id}`}
                          checked={question.mandatory}
                          onCheckedChange={(checked) =>
                            handleQuestionChange(
                              question.id!,
                              "mandatory",
                              checked
                            )
                          }
                        />
                        <Label
                          htmlFor={`mandatory-${question.id}`}
                          className="text-sm text-black"
                        >
                          Mandatory
                        </Label>
                      </div>

                      {/* Additional Field on Negative Selection */}
                      {(question.answerType === "multiple-choice" || question.answerType === "rating" || question.answerType === "emojis") && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`additional-${question.id}`}
                            checked={question.additionalFieldOnNegative || false}
                            onCheckedChange={(checked) =>
                              handleQuestionChange(
                                question.id!,
                                "additionalFieldOnNegative",
                                checked
                              )
                            }
                          />
                          <Label
                            htmlFor={`additional-${question.id}`}
                            className="text-sm text-black"
                          >
                            Do you want to open additional field on negative selection
                          </Label>
                        </div>
                      )}

                      {/* Additional Fields */}
                      {question.additionalFieldOnNegative && question.additionalFields && (
                        <div className="space-y-3 pt-2 border-t border-gray-200 mt-4 pt-4">
                          <Label className="text-sm font-medium text-gray-700">
                            Additional Fields for Negative Selection
                          </Label>

                          <div className="space-y-4">
                            {question.additionalFields.map((field, fieldIndex) => {
                              const isOnlyField = (question.additionalFields?.length || 0) === 1;
                              return (
                                <div
                                  key={fieldIndex}
                                  className={`grid gap-3 items-end ${
                                    isOnlyField
                                      ? "grid-cols-1 md:grid-cols-2"
                                      : "grid-cols-1 md:grid-cols-3"
                                  }`}
                                >
                                  <TextField
                                    label="Title"
                                    placeholder="Enter title"
                                    value={field.title}
                                    onChange={(e) =>
                                      handleAdditionalFieldTitleChange(
                                        question.id!,
                                        fieldIndex,
                                        e.target.value
                                      )
                                    }
                                    fullWidth
                                    variant="outlined"
                                    required
                                    InputLabelProps={{ 
                                      shrink: true,
                                      sx: { '& .MuiInputLabel-asterisk': { color: '#ef4444' } }
                                    }}
                                    InputProps={{
                                      sx: { ...fieldStyles, height: "36px" },
                                    }}
                                  />

                                  <div className="relative">
                                    <TextField
                                      label="Upload File"
                                      value={
                                        field.files.length > 0
                                          ? `${field.files.length} file(s) selected`
                                          : "Choose File"
                                      }
                                      fullWidth
                                      variant="outlined"
                                      required
                                      InputLabelProps={{ 
                                        shrink: true,
                                        sx: { '& .MuiInputLabel-asterisk': { color: '#ef4444' } }
                                      }}
                                      InputProps={{
                                        sx: {
                                          ...fieldStyles,
                                          height: "36px",
                                          cursor: "pointer",
                                          "& input": {
                                            color:
                                              field.files.length > 0
                                                ? "#C72030"
                                                : "inherit",
                                            fontWeight:
                                              field.files.length > 0
                                                ? "500"
                                                : "normal",
                                            cursor: "pointer",
                                          },
                                        },
                                        readOnly: true,
                                      }}
                                      onClick={() =>
                                        document
                                          .getElementById(
                                            `additional-file-${question.id}-${fieldIndex}`
                                          )
                                          ?.click()
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                    <input
                                      type="file"
                                      multiple
                                      className="hidden"
                                      id={`additional-file-${question.id}-${fieldIndex}`}
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        handleAdditionalFieldFilesChange(
                                          question.id!,
                                          fieldIndex,
                                          [...field.files, ...files]
                                        );
                                      }}
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
                                    />
                                  </div>

                                  {!isOnlyField && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        handleRemoveAdditionalField(question.id!, fieldIndex)
                                      }
                                      className="p-2 text-red-500 hover:text-red-700"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              );
                            })}

                            {/* Display existing files */}
                            {question.additionalFields.some(field => field.existingFiles && field.existingFiles.length > 0) && (
                              <div className="space-y-2">
                                <Label className="text-xs text-gray-600">Existing Files</Label>
                                <div className="flex flex-wrap gap-3">
                                  {question.additionalFields.map((field, fieldIndex) => 
                                    field.existingFiles?.map((existingFile) => (
                                      <div
                                        key={`existing-${existingFile.id}`}
                                        className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
                                      >
                                        <img
                                          src={existingFile.url}
                                          alt={existingFile.file_name}
                                          className="w-[40px] h-[40px] object-cover rounded border mb-1"
                                        />
                                        <span className="text-[10px] text-center truncate max-w-[100px] mb-1">
                                          {existingFile.file_name}
                                        </span>
                                        <button
                                          type="button"
                                          className="absolute top-1 right-1 text-gray-600 hover:text-red-600 p-0"
                                          onClick={() => removeExistingFile(question.id!, fieldIndex, existingFile.id)}
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Display uploaded files */}
                            {question.additionalFields.some(field => field.files.length > 0) && (
                              <div className="space-y-2">
                                <Label className="text-xs text-gray-600">New Files</Label>
                                <div className="flex flex-wrap gap-3">
                                  {question.additionalFields.map((field, fieldIndex) => 
                                    field.files.map((file, fileIndex) => {
                                      const isImage = file.type.startsWith('image/');
                                      const isPdf = file.type === 'application/pdf';
                                      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                                      const fileURL = URL.createObjectURL(file);
                                      return (
                                        <div
                                          key={`${file.name}-${file.lastModified}`}
                                          className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
                                        >
                                          {isImage ? (
                                            <img
                                              src={fileURL}
                                              alt={file.name}
                                              className="w-[40px] h-[40px] object-cover rounded border mb-1"
                                            />
                                          ) : isPdf ? (
                                            <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6c-1.1 0-2 .9-2 2z"/><path d="M14 2v6h6"/></svg>
                                            </div>
                                          ) : isExcel ? (
                                            <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="2"/><path d="M8 11h8M8 15h8"/></svg>
                                            </div>
                                          ) : (
                                            <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-600 bg-white mb-1">
                                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="2"/></svg>
                                            </div>
                                          )}
                                          <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                                          <button
                                            type="button"
                                            className="absolute top-1 right-1 text-gray-600 hover:text-red-600 p-0"
                                            onClick={() => removeAdditionalFieldFile(question.id!, fieldIndex, fileIndex)}
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAddAdditionalField(question.id!)}
                              className="p-0 h-auto font-medium text-red-600 hover:text-red-700 flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" /> Add Additional Field
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleAddQuestion}
                  variant="outline"
                  className="border-dashed border-red-400 text-red-600 hover:bg-red-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Questions
                </Button>
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <Button
                  onClick={handleUpdateQuestion}
                  disabled={loading || isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white px-8"
                >
                  {loading || isSubmitting ? "Updating..." : "Update Question"}
                </Button>
                <Button
                  onClick={() => navigate("/master/survey/list")}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 px-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};